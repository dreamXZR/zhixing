var utils = require('../../../utils/util.js');
var api = getApp().globalData.api;
var that;
var audioCtx
Page({
  data: {
    pic: "/images/paly.png",
    musiclist: [],
    mid: 0,
    scrollTop: 0,
    servsers: getApp().globalData.servsers,
    progress:0
  },
  onLoad: function (options) {
    that = this
    that.musicInfo(options.music_id)
    audioCtx = wx.createInnerAudioContext()
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
      audioCtx.src = data.zx_home_video.video_url
      that.setData({
        musicInfo: data.zx_home_video,
        pic: "/images/paly.png"
      })
      that.audioPlay()
    })
  },
  audioPlay: function () {
    if (that.data.pic == "/images/paly.png") {
      audioCtx.play()
      setTimeout(() => {
        audioCtx.currentTime
        audioCtx.onTimeUpdate(() => {
          var progress = parseInt((audioCtx.currentTime/audioCtx.duration) * 100)
          that.setData({
            progress:progress,
            duration: audioCtx.duration
          })
        })
      }, 500)
      that.setData({
        pic: "/images/pause.png"
      })

    } else {
      audioCtx.pause()
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
  onUnload:function(){
    audioCtx.destroy()
  },
  musicChange:function(e){
    var paress = parseFloat((that.data.duration * e.detail.value / 100).toFixed(1))
    audioCtx.seek(paress)
  }
  
})

