var api = getApp().globalData.api;
var servsers = getApp().globalData.servsers;
Page({


  data: {

    author: '知行体育',
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      video_image: options.video_image,
      video_url: options.video_url,
      servsers: servsers,
      name: options.name,
    })

  },
  
  //分享
  onShareAppMessage: function () {
    var that = this;

    return {
      title: '精彩音乐分享',
      path: 'pages/index/music/music?video_image=' + that.data.video_image + "&video_url=" + that.data.video_url +'&name='+that.data.name,
    }
  }
})