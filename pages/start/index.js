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
  getUserInfo: function (e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
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
    if (!!e.detail.value && !!app.globalData.userInfo.nickName) {
      this.getData()
    }
  },
  getData: function () {
    app.Ajax(
      // 方法组名称为：User（代购用户），不是系统通用用户Users
      'Users',
      'POST',
      'StaffReg',
      { staffCode: this.data.num, ...app.globalData.userInfo },
      function (json) {
        // console.log('json',json);
        if (json.success) {
          wx.navigateTo({
            url: '../index/index',
          })
        } else {
          app.Toast('', 'none', 3000, json.msg.code);
        }
      }
    )
  },

  
})