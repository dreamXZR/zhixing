var that
var utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    servsers : getApp().globalData.servsers,
    musicList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this
   
    utils.request('musics', 'GET', { 'style_id': options.id}).then(data => {
      that.setData({
        musicList: data.data
      })
    })
   
  },
  navTap:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../single-music/single-music?music_id=' + id,
    })
  }

})