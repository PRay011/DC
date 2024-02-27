// index.js
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: true,
    spots:[],
    spotsID:[],
    hesuanSpot:[],
  },
  
  onLoad() {
    var that = this;
    wx.getStorage({ 
      key:"userInfo",
      success: function(res) {   
        that.setData({
            userInfo: res.data,
            hasUserInfo: true,
            canIUseGetUserProfile: false
        })
      }
     });
  },
  
  onReady(){
    var that = this;
    wx.request({
      url: 'http://localhost:8080/hesuan/queue/getQueueList',
      method:'GET',
      success (res){
        var tempSpots = new Array;
        var tempSpotsID = new Array;
          for (var i=0;i<res.data.length;i++){
            tempSpots[i]=res.data[i].name;
            tempSpotsID[i]=res.data[i].id
          }
          that.setData({
            spots: tempSpots,
            spotsID: tempSpotsID
          })
      }
    })
  },

  toSelfPage(){
    wx.navigateTo({
      url: '/pages/SelfCenter/SelfCenter',
    })
  },

  toDetectionSpot(e){
    var tempSpotID = e.currentTarget.dataset.text;
    wx.setStorage({
      key:'spotID',
      data:tempSpotID,
      success:(s)=>{
          console.log('存储缓存成功===index',s);
          
      },
      fail:(f)=>{
          console.log('存储缓存失败===indexError',f);              
      }
  })
  wx.navigateTo({
            url: '/pages/DetectionSpot/DetectionSpot',
          })
  },
 
  onShow: function (){
    this.onLoad()
  },

  addNewSpot(){
    wx.navigateTo({
      url: '/pages/AddNewSpot/AddNewSpot',
    })
  }
})


