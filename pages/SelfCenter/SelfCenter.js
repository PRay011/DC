// pages/SelfCenter/SelfCenter.js
Page({
  data: {
    userInfo:'',
    hasUserInfo: false,
    canIUseGetUserProfile: true,
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
        fail:(err)=>{
            console.log("获取失败",err);
        } 
      } 
     });

  },

  getUserProfile(e) {
    var that = this;
    wx.getUserProfile({
      desc: '展示信息', 
      success: (res) => {
        that.setData({
          userInfo:res.userInfo,
          hasUserInfo: true,
        }),
        // wx.login({
        //   success: (res) => {
        //     var loginInfo =  {
        //       appid:"wx119922c24362c7d8",
        //       secret:"787a1ad3837b869af620d4734d28697a4",
        //       js_code: res.code
        //     };
        //       if (res.code) {
        //         wx.request({
        //           url: 'http://localhost:8080/hesuan/user/login',
        //           data: JSON.stringify(loginInfo),
        //           method:'POST',
        //           success:(res)=>{
        //             var openid = res.data.openid
        //             wx.setStorage({ 
        //               key:"openid",
        //               data:openid,
        //               success:(s)=>{
        //                 console.log('存储缓存成功==id',s);
        //             },
        //             fail:(f)=>{
        //                 console.log('存储缓存失败==id',f);                    
        //             }
        //              });
        //           }
        //         })
        //       }else {
        //         console.log('登录失败！' + res.errMsg)
        //       }
        //   }
        // }),
        wx.setStorage({
          key:'userInfo',//本地缓存中指定的 key(类型：string)
          data:res.userInfo,//需要存储的内容。只支持原生类型、Date、及能够通过JSON.stringify序列化的对象(类型:any)
          success:(s)=>{
              console.log('存储缓存成功====',s);
              that.setData({
                   canIUseGetUserProfile: false  //隐藏登录按钮  
              })
              var pages = getCurrentPages();//获取页面栈
              if (pages.length > 1) {
                //上一个页面实例对象
                var prePage = pages[pages.length - 2];
                //调用上一个页面的onShow方法
                prePage.onShow()
              }
              wx.navigateBack({
                delta: 1
              })
          },
          fail:(f)=>{
              console.log('存储缓存失败====',f);                    
          }
      })
      },
      fail() {
        console.log("用户拒绝授权")
      }
    })
  },

    //跳转到历史记录
    toRecordPage(){
      wx.navigateTo({
        url: '/pages/Record/Record',
      })
    },

    toIndexPage(){
      wx.navigateTo({
        url: '/pages/index/index',
      })
    },

    Logout(){
      var that = this;
      wx.removeStorage({
        key: 'userInfo',
        success: function(res) {
          that.setData({
            storageData: [],
            hasUserInfo: false,
            canIUseGetUserProfile: true
          })
        },
      })
      this.toIndexPage()
    }
})