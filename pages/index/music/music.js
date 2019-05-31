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
   
    utils.request('randomMusics','GET',{}).then(data=>{
      that.setData({
        musiclist:data.data
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
          that.setData({
            time: that.formatSeconds(audioCtx.currentTime)
          })
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
      url: '/pages/music/single-music/single-music?music_id=' + event.currentTarget.dataset.id,
    })
  },
  onUnload:function(){
    audioCtx.destroy()
  },
  musicChange:function(e){
    var paress = parseFloat((that.data.duration * e.detail.value / 100).toFixed(1))
    audioCtx.seek(paress)
  },
  //秒数格式化
  formatSeconds: function (value) {
    var secondTime = parseInt(value);// 秒
    var minuteTime = 0;// 分
    if (secondTime > 60) {
      minuteTime = parseInt(secondTime / 60);
      secondTime = parseInt(secondTime % 60);
    }
    if (secondTime < 10) {
      return '0' + minuteTime + ':0' + secondTime;
    } else {
      return '0' + minuteTime + ':' + secondTime;
    }

  },
  
})

