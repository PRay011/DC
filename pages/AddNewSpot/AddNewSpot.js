const img = "../../image/location.png"

Page({

data: {
  startDate: '2023-03-20',//默认起始时间  
  endDate: '2023-03-20',//默认结束时间 
  morStart: '8:00',
  morEnd: '12:00',
  afterStart: '12:00',
  afterEnd: '17:00',
  longitude: 116.321175, //首次加载的经度
  latitude: 39.993446, //首次加载维度 
  province: '湖南',
  city: '长沙',
  district: '岳麓区',
  address: "长沙市人民政府",
  distance: 200,
  markers:[
    {
    id:0,
    width: 30,
		height: 30,
    longitude: 116.321175, //首次加载的经度
    latitude: 39.993446, //首次加载维度   
    iconPath:img
  }
  ],
  Nowlocation:{},
 
},

bindStartDateChange(e) {
  let that = this;
  that.setData({
    startDate: e.detail.value,
  })
},
bindEndDateChange(e) {
  let that = this;
  that.setData({
    endDate: e.detail.value,
  })
},

bindMorningStartChange(e) {
  let that = this;
  that.setData({
    morStart: e.detail.value 
  });
},
bindMorningEndChange(e) {
  let that = this;
  that.setData({
    morEnd: e.detail.value 
  });
},

bindAfternoonStartChange(e) {
  let that = this;
  that.setData({
    afterStart: e.detail.value 
  });
},
bindAfternoonEndChange(e) {
  let that = this;
  that.setData({
    afterEnd: e.detail.value 
  });
},

  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap');
    const lat= "markers[0].latitude";
    const log= "markers[0].longitude";
    var that = this;
    this.mapCtx.getCenterLocation({
      success: function(res){
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          [lat]:res.latitude,
          [log]:res.longitude
         })
      }
    })
  },

  
  getCenterLocation: function () {
    const lat= "markers[0].latitude";
    const log= "markers[0].longitude";
    var that = this;
    this.mapCtx.getCenterLocation({
      success: function(res){
        targetLat=res.latitude;
        targetLog=res.longitude
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          
          [lat]:res.latitude,
          [log]:res.longitude
         })
      }
    })
    var targetLat = this.data.markers[0].latitude;
    var targetLog = this.data.markers[0].longitude;
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/?location='+targetLat+','+targetLog+'&key=WUNBZ-KDBE3-YDH3R-YMVWI-BWOS2-CQBES&get_poi=0',
      method:'GET',
      success:(res)=>{
        this.setData({
          Nowlocation:res.data,
          province: res.data.result.address_component.province,
          city: res.data.result.address_component.city,
          district: res.data.result.address_component.district,
          address: res.data.result.formatted_addresses.recommend,
        })
      }
    })
  },

  moveToLocation: function () {
    this.mapCtx.moveToLocation(); 
  },

  MakeAppointment: function(){
    //应该是要在这预约成功后把数据保留到个人中心（我的预约？->这个可以作为record）
    wx.navigateTo({
      url: '/pages/Record/Record',
    })
  },

  formSubmit:function(e){
    var that = this;
    var formData = e.detail.value;
    
    var creat = {
      name:formData.name,
      start_day:this.data.startDate,
      end_day:this.data.endDate,
      username:formData.username,
      phone:parseInt(formData.phone),
      location:{
        lat:this.data.latitude,
        lng:this.data.longitude,
        province:this.data.province,
        city:this.data.city,
        district:this.data.district,
        address:this.data.address,
        distance:formData.address
      },
      timeList:[
        {
          start_time: this.data.morStart,
          end_time: this.data.morEnd,
          max_num: parseInt(formData.morNum)
        },
        {
          start_time: this.data.afterStart,
          end_time: this.data.afterEnd,
          max_num:parseInt(formData.afterNum)
        }
      ]
      };
      console.log(creat)
    wx.request({
      url: 'http://localhost:8080/hesuan/queue/createQueue',
      data: JSON.stringify(creat),
      method:'POST',
    })
    wx.navigateTo({
      url: '/pages/index/index',
    })
    
    }
})