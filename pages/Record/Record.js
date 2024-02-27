// pages/Record/Record.js
Page({
  data: {
    records:[{}],
    sign:[],
    haveRecord:false,
  },

  onReady() { 
    var that = this;
    wx.getStorage({ 
      key:"openid",
      success: function(res) {   
        var openid=res.data;
        wx.request({
          url: 'http://localhost:8080/hesuan/queue/getQueueRecord?username='+openid,
          method:'GET',
          success:(res)=>{
            console.log(res.data)
            var temprecords=[{}];
            var tempSign=[];
            if(res.data.length>0){
              that.setData({
                haveRecord:true
              })
            }
            else{
              that.setData({
                haveRecord:false
              })
            }
            for(var i=0;i<res.data.length;i++){
              temprecords[i]=res.data[i];
              if(temprecords[i].status!=0){
                tempSign[i]=true;
              }
              else{
                tempSign[i]=false;
              }
            }
            that.setData({
              records: temprecords,
              sign: tempSign
            })
          }
          
        })
        console.log(that.data.records[0].id)
        var tempstatus = that.data.records;
        for(var i=0;i<tempstatus.length;i++){
          
        }
        fail:(err)=>{
            console.log("获取失败",err);
        } 
      } 
     });
  },

  signIN(e){
    var that = this;
    var id = parseInt(e.currentTarget.dataset.text);
    wx.request({
      url: 'http://localhost:8080/hesuan/queue/checkIn?queueRecordID='+id,
      // data: JSON.stringify(signIN),
      method:'PUT',
      success (res){
        console.log("签到成功");
        that.onReady() 
      }
    }) 
   
   
  },

  onShow: function (){
    this.onLoad()
  },

})