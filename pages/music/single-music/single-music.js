var utils = require('../../../utils/util.js');
var that
var audioCtx
Page({


  data: {
    servsers : getApp().globalData.servsers,
    pic: "/images/paly.png",
    progress: 0
  },
  onLoad: function (options) {
    that=this;
    utils.request('musics/' + options.id,'GET',{}).then(data=>{
      that.setData({
        music: data.data
      })
      audioCtx = wx.createInnerAudioContext()
      audioCtx.src = data.data.qiniu_url
      utils.authRequest('is_auditioned', 'POST', { music_id: data.data.id}).then(data=>{
        if(!data.status){
          that.setData({
            second: data.second
          })
          wx.showModal({
            title: '提示',
            content:data.message,
            cancelText: "不了",
            confirmText: "试听",
            success: function (res) {
              if (res.cancel) {
                wx.navigateBack({})
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
            pic: "/images/paly.png"
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
          var progress = parseInt((audioCtx.currentTime / audioCtx.duration) * 100)
          if (progress >= that.data.second) {
            that.setData({
              pic: "/images/pause.png"
            })
            that.audioPlay()
            wx.showModal({
              title: '友情提示',
              content: '试听结束，如需要请购买',
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
    utils.authRequest('is_buy', 'POST', { music_id: that.data.music.id}).then(data=>{
      if(data.status){
        wx.redirectTo({
          url: '../music-order/music-order?type=1&id=' + that.data.music.id + "&money=" + that.data.music.money,
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
      })
    }else{
      audioCtx.seek(paress)
    }
    
  },
  musictap:function(e){
    wx.redirectTo({
      url: 'single-music?id=' + e.currentTarget.dataset.id,
    })
  }


  
})