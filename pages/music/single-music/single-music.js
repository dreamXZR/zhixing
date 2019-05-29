var utils = require('../../../utils/util.js');
var that
var audioCtx
const app = getApp()
Page({


  data: {
    servsers : getApp().globalData.servsers,
    pic: "/images/paly.png",
    progress: 0,
    is_auditioned:true
  },
  onLoad: function (options) {
    that=this;
    //分销传值
    app.globalData.dist = {
      dist_user_id: options.dist_user_id ? options.dist_user_id : '',
      music_id: options.music_id
    }
    
    
    utils.request('musics/' + options.music_id,'GET',{}).then(data=>{
      that.setData({
        music: data,
        music_id: options.music_id
      })
      audioCtx = wx.createInnerAudioContext()
      audioCtx.src = data.qiniu_url
      utils.authRequest('is_auditioned', 'POST', { music_id: data.id}).then(data=>{
        if(!data.status){
          that.setData({
            second: data.second,
            is_auditioned:data.status
          })
          wx.showModal({
            title: '提示',
            content:data.message,
            cancelText: "不了",
            confirmText: "试听",
            success: function (res) {
              if (res.cancel) {
                return false
              }else{
                that.setData({
                  pic : "/images/paly.png"
                })
                that.audioPlay()
              }
            }
          })
         
        }else{
          that.setData({
            pic: "/images/paly.png",
            is_auditioned: data.status
          })
          that.audioPlay()
        }
      })
    })
    
  },
  onShow:function(){
    //猜你喜欢
    utils.request('randomMusics','GET',{}).then(data=>{
      that.setData({
        musicList:data.data
      })
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
          var progress = parseInt((audioCtx.currentTime / audioCtx.duration) * 100)
          if (audioCtx.currentTime >= that.data.second) {
            that.setData({
              pic: "/images/pause.png"
            })
            that.audioPlay()
            wx.showModal({
              title: '友情提示',
              content: '试听结束，如需要请购买',
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../music-order/music-order?type=1&id=' + that.data.music.id + "&money=" + that.data.music.money,
                  })
                }
              }
            })
          } else {
            that.setData({
              progress: progress,
              duration: audioCtx.duration
            })
          }
          
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
  //购买
  toBuy:function(){
    utils.authRequest('hasOrder/' + that.data.music.id, 'GET', {}).then(data=>{
      if(data.status){
        wx.redirectTo({
          url: '../music-order/music-order?type=music&music_id=' + that.data.music.id,
        })
      }else{
        wx.showToast({
          title:data.message,
          icon:'none'
        })
      }
    })
    
  },
  
  onUnload: function () {
    audioCtx.destroy()
  },
  musicChange: function (e) {
    var paress = parseFloat((that.data.duration * e.detail.value / 100).toFixed(1))
    if (paress>=that.data.second){
      that.setData({
        pic: "/images/pause.png"
      })
      that.audioPlay()
      wx.showModal({
        title: '友情提示',
        content: '试听结束，如需要请购买',
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../music-order/music-order?type=1&id=' + that.data.music.id + "&money=" + that.data.music.money,
            })
          }
        }
      })
      return false
    }else{
      audioCtx.seek(paress)
    }
    
  },
  musictap:function(e){
    wx.redirectTo({
      url: 'single-music?id=' + e.currentTarget.dataset.id,
    })
  },
  //秒数格式化
  formatSeconds:function(value){
    var secondTime = parseInt(value);// 秒
    var minuteTime = 0;// 分
    if (secondTime > 60) {
      minuteTime = parseInt(secondTime / 60);
      secondTime = parseInt(secondTime % 60);
    }
    if (secondTime<10){
      return '0'+minuteTime + ':0' + secondTime;
    }else{
      return '0'+minuteTime + ':' + secondTime;
    }
    
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '音乐购买分享',
      path: 'pages/music/single-music/single-music?id=' + that.data.music_id + '&dist_user_id=' + wx.getStorageSync('user_id'),
    }
  }


  
})