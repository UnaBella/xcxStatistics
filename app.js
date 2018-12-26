//app.js
App({
  onLaunch: function () {
    var isDebug = false;//true调试状态使用本地服务器，非调试状态使用远程服务器
    if (!isDebug) {
      //远程域名
      wx.setStorageSync('domainName', "https://wxapp.llwell.net/api/analysis/Wx/")
    }
    else {
      //本地测试域名
      wx.setStorageSync('domainName', "http://192.168.0.11:53695/api/analysis/Wx/")
    }

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const that = this;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.Ajax(
          'Open',
          'POST',
          'Login',
          { code: res.code },
          function (json) {
            // console.log('~~~',json);
            if (json.success) {
              wx.setStorageSync('token', json.data.token);
              setTimeout(function () {
                that.getOffLineData('')
              }, 0)
              setTimeout(function () {
                that.getOnLineData('')
              }, 0)
              setTimeout(function () {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 100)
             
              // console.log('g', that.globalData)
              
            } else {
              // that.Toast('','none',2000,json.msg.code)
              console.log('here something wrong');
            }
          }
        )


      }
    })
    
  },
  getOffLineData: function (shopId, tt) {
    const that = this;
    this.Ajax(
      'Dashboard',
      'POST',
      'GetOfflineShopData',
      { shopId: shopId },
      function (json) {
        if (json.success) {
          that.globalData.offLine = json.data;
          //  console.log('xianxia', that.globalData.offLine)
          // that.getOnLineData('',tt,that)
          if(tt != undefined){
              tt.re()
            
          }
          
          
        } else {
          // that.Toast('','none',2000,json.msg.code)
          console.log('here');
        }
      })
  },
  getOnLineData: function (shopId,tt) {
    const that = this;
    this.Ajax(
      'Dashboard',
      'POST',
      'GetOnlineShopData',
      { shopId: shopId },
      function (json) {
        if (json.success) {
          that.globalData.onLine = json.data;
          console.log('xianshang', that.globalData.onLine)
          if (tt != undefined) {
            tt.reOnLine()
            
          }
          
        } else {
          // that.Toast('','none',2000,json.msg.code)
          console.log('here');
        }
      })
  },
  globalData: {
    offLine:{},
    onLine:{},
  },


  Ajax: function (url, type, method, data, callback) {
    wx.showLoading({
      title: 'loading',
      duration: 1000,
    });

    var send = {
      token: wx.getStorageSync('token'),
      method: method,
      param: data,
    };
    wx.request({
      url: wx.getStorageSync('domainName') + url,
      data: send,
      method: type, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/json' // 默认值
      }, // 设置请求的 header
      success: function (res) {
        wx.hideLoading();
        // 发送请求成功执行的函数
        if (typeof callback === 'function') {
          callback(res.data);
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: '网络异常提示',
          content: '请检查网络，并重新登录小程序',
          showCancel: false,
        })
        //console.log('fa',res)
      },
      complete: function () {
        // wx.hideLoading();
      }
    })
  }
})