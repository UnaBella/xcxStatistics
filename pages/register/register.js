// pages/start/index.js
const app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    num: '',
    title: ''
  },
  userNumInput: function (e) {
    this.setData({
      num: e.detail.value
    })
  },
 
  bindGetUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    }, () => {
      this.getData()
    })

    //此处授权得到userInfo
    // console.log(e.detail.userInfo);

    //接下来写业务代码
  },


  formSubmit: function (e) {
    // console.log('app.globalData.userInfo，携带数据为：', app.globalData.userInfo)

    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    // if (!!e.detail.value ) {
    //   this.getData()
    // }
  },
  getData: function () {
    app.Ajax(
      'Open',
      'POST',
      'UserReg',
      { userCode: this.data.num, ...app.globalData.userInfo },
      function (json) {
        // console.log('json',json);
        if (json.success) {
          app.Toast('注册成功', 'none', 1000);
          wx.switchTab({
            url: '../offLine/offLine',
          })
        } else {
          app.Toast('', 'none', 3000, json.msg.code);
        }
      }
    )
  },

  
})