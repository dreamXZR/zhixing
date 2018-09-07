var api = getApp().globalData.api;
var servsers = getApp().globalData.servsers;
var that
Page({


  data: {
  },
  onLoad: function (options) {
    that=this;
    that.setData({
      videoid: options.video_id,
      servsers: servsers,
    })
    var videoContext = wx.createVideoContext('myvideo', this);
    videoContext.requestFullScreen();//执行全屏方法

  //观看记录
  wx.request({
    url: api + 'viewRecord',
    method: 'POST',
    data: {
      user_id: wx.getStorageSync('user_id'),
      video_id: that.data.videoid
    },
    
  })
  //获取url
  wx.request({
    url: api + 'videoUrl',
    method: 'POST',
    data: {
      
      type:3,
      video_id: that.data.videoid,
    },
    success: function (res) {
     
      that.setData({
        url: res.data[0].mv_url,
      });

    }
  })
    
  },
})