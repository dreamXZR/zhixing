var api = getApp().globalData.api;
var servsers = getApp().globalData.servsers;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvList:[],
    status:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      servsers: servsers,
      
    })
  },
  toIndexPage:function(){
    wx.switchTab({
      url: '/pages/music/music',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    wx.request({
      url: api+'aim',
      method:'POST',
      data:{
        user_id: wx.getStorageSync('user_id'),
      },
      success:function(res){
        that.setData({
          mvList:res.data
        })
        if (!that.data.mvList[0]){
          that.setData({
            status:0
          })
        }
      }
    })
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