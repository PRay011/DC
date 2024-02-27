// pages/DetectionSpot/DetectionSpot.js

const img = "../../image/location.png"

Page({

data: {
  name:'',
  longitude: 126.321175,
  latitude: 39.993446,
  startDate: '',//默认起始时间  
  endDate: '',//默认结束时间 
  morStart: '',
  morEnd: '',
  afterStart: '',
  afterEnd: '',
  province: '',
  city: '',
  district: '',
  address: "",
  distance: 200,
  person_num:0,
  reserve_num:0,
  creator:'',
  phone: 12345673245,
  chooseDate:'',
  targetID:'',
  hesuanID:0,//核酸点特有id
  timeID:[],
  finalTimeID:0,
  isSelect:false,
  types:[],
  type:'',
  markers:[
    {
    id:0,
    width: 30,
		height: 30,
    longitude: 106.321175, //首次加载的经度
    latitude: 39.993446, //首次加载维度   
    iconPath:img
  }
]
},

  onLoad() {
    var that = this;
    wx.getStorage({ 
        key:"spotID",
      success: function(res) {   
        that.setData({
          targetID: res.data
        })
      } 
    });
  },

  onReady: function (e) {
    var that = this;
    var target = that.data.targetID;
    wx.request({
      url: 'http://localhost:8080/hesuan/queue/getQueueData?id='+target,
      method:'GET',
      success (res){
        console.log(res.data);
        that.setData({
          hesuanID:res.data.id,
          name:res.data.name,
          longitude: res.data.location.lng,
          latitude: res.data.location.lat,
          startDate: res.data.start_day,//默认起始时间  
          endDate: res.data.end_day,//默认结束时间 
          morStart: res.data.timeList[0].start_time,
          morEnd: res.data.timeList[0].end_time,
          afterStart: res.data.timeList[1].start_time,
          afterEnd: res.data.timeList[1].end_time,
          province: res.data.location.province,
          city: res.data.location.city,
          district: res.data.location.district,
          address: res.data.location.address,
          distance: res.data.location.distance,
          person_num:res.data.person_num,
          reserve_num:res.data.reserve_num,
          creator:res.data.username,
          phone: res.data.phone,
          chooseDate:res.data.start_day,//默认选择时间
          markers:[
            {
            id:0,
            width: 30,
	        	height: 30,
            longitude: res.data.location.lng, //首次加载的经度
            latitude: res.data.location.lat, //首次加载维度   
            iconPath:img
          }],
          types:[
            res.data.timeList[0].start_time+'-'+res.data.timeList[0].end_time,
            res.data.timeList[1].start_time+'-'+res.data.timeList[1].end_time
          ],
          timeID:[
            res.data.timeList[0].id,
            res.data.timeList[1].id,
          ]
        })
        
      }
    })

    this.mapCtx = wx.createMapContext('myMap');
    this.mapCtx.moveToLocation();
  },

  moveToLocation: function () {
    this.mapCtx.moveToLocation();
  },

  bindDateChoose(e) {
    let that = this;
    that.setData({
      chooseDate: e.detail.value,
    })
  },

  MakeAppointment(){
    //添加到历史记录
    var that = this;
    wx.getStorage({ 
      key:"openid",
      success: function(res) {   
        var openid=res.data;
        var appointment = {
          username: openid,
          queue_id: that.data.hesuanID,
          day: that.data.chooseDate,
          time_id: that.data.finalTimeID,
          status:0,
        };
        wx.request({
          url: 'http://localhost:8080/hesuan/queue/insertQueueRecord',
          data: JSON.stringify(appointment),
          method:'POST',
          success:(res)=>{
            console.log("appointment"+res.data)
          }
        })
        fail:(err)=>{
            console.log("获取失败",err);
        } 
      } 
     });
    wx.navigateTo({
      url: '/pages/Record/Record',
    })
  },
  
  select:function(){
    var isSelect = this.data.isSelect
    this.setData({ isSelect:!isSelect})
  },
  //点击下拉框选项，选中并隐藏下拉框
  getType:function(e){
    let value = e.currentTarget.dataset.type
    var tempTimeID = e.currentTarget.dataset.text;
    console.log(tempTimeID)
    this.setData({
      type:value ,
      isSelect: false,
      finalTimeID: tempTimeID,
    })
  }
})

