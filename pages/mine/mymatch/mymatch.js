var utils = require('../../../utils/util.js');
var that
Page({
  data: {
    orderList:[],
    status: 1,
    servsers: getApp().globalData.servsers
  },
  
  govideo: function (event){
    var videoid = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../index/video/video?videoid=' + videoid,
    })
  },
  onLoad: function () {
    that=this
  },
  onShow: function () {
    wx.showLoading()
    that.setData({
      status:1
    })
    utils.authRequest('userMatch','POST',{}).then(data=>{
      wx.hideLoading();
      if (!data.zx_match_videos[0]) {

        that.setData({
          status: 0,
        })

      }
      that.setData({
        orderList: data.zx_match_videos,
      });
    })
 
  }
})