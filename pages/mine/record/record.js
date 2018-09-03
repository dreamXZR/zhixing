var api = getApp().globalData.api;
var servsers = getApp().globalData.servsers;
Page({


  data: {
    status: 1
  },

  onLoad: function (options) {
    this.setData({
      servsers: servsers
    })
  },
  toIndexPage: function () {
    wx.switchTab({
      url: '/pages/music/music',
    })
  },

  onShow: function () {
    var that=this;
    wx.request({
      url: api +'getViewRecord',
      method:"POST",
      data:{
        user_id: wx.getStorageSync('user_id'),
      },
      success:function(res){
        that.setData({
          videoList:res.data
        })
        if (!that.data.videoList[0]) {
          that.setData({
            status: 0
          })
        }
      }
    })
  },


})