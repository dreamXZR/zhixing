var that
var utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect: 1,
    currentTpye: 0,
    list: [
      { num: '1' },
      { num: '2' },
      { num: '3' },
      { num: '4' },
      { num: '5' },
      { num: '6' },
      { num: '7' },
      { num: '8' },
      { num: '9' },
      { num: '10' },
      { num: '11' },
      { num: '12' }
    ]
  },
  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index
    this.setData({
      currentTpye: curType
    });
    this.change(curType);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this
    var id=options.id
    utils.authRequest()
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