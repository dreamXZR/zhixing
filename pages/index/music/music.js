var utils = require('../../../utils/util.js');
var api = getApp().globalData.api;
var that;
Page({
  data: {
    pic: "/images/paly.png",
    musiclist: [],
    mid: 0,
    scrollTop: 0,
    servsers: getApp().globalData.servsers
  },
  onLoad: function (options) {
    that = this
    that.audioCtx = wx.createAudioContext('myAudio')
    wx.getSystemInfo({
      success: function (res) {
        var a = res.windowHeight;
        that.setData({
          scrollTop: a - 200
        })
      }
    })
    that.musicInfo(options.music_id)
  },
  onReady: function (e) {
   
    utils.request('homeMusics','GET',{}).then(data=>{
      that.setData({
        musiclist:data.zx_home_videos
      })
      
    })
  },
  musicInfo:function(id){
    utils.request('homeMusics/' + id, 'GET', {}).then(data => {
      that.setData({
        musicInfo: data.zx_home_video,
        pic: "/images/paly.png"
      })
      that.audioPlay()
    })
  },
  audioPlay: function () {
    if (that.data.pic == "/images/paly.png") {
      that.audioCtx.play()
      that.setData({
        pic: "/images/pause.png"
      })

    } else {
      that.audioCtx.pause()
      that.setData({
        pic: "/images/paly.png"
      })
    }
  },
  musictap: function (event) {
    wx.redirectTo({
      url: '/pages/index/music/music?music_id=' + event.currentTarget.dataset.id,
    })
  },
  
  
})

