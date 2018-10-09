
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  refuse:function(){
    wx.navigateBack({})
  },
  agree:function(){
    wx.navigateTo({
      url: '../info/info',
    })
  }
})