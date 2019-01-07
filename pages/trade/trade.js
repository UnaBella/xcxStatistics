// pages/trade/trade.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    shops: [
      { shopId: '', shopName: '全部店铺' },
    ],
    shopIds: [],
    shopNames: [],

    partSales: {
      dayDoc: {
        upOrDown: 0,
        rate: '0',
        actualAmount: '0',
        supplyAmount: '0',
        orderNum: '0',
      },
      index: 0,
      months: ['2018年9月'],
      monthDoc: {
        upOrDown: 0,
        rate: '0',
        actualAmount: '0',
        supplyAmount: '0',
        orderNum: '0'
      }
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})