var that
const app = getApp()
var utils = require('../../utils/util.js');
Page({


  data: {
    collect: 1,
    servsers:getApp().globalData.servsers,
    is_watch:1
  },

  onLoad: function (options) {
    that=this
    this.setData({
      video_id: options.id
    })
    //分销
    if (options.dist_user_id) {
      app.globalData.dist = {
        dist_user_id: options.dist_user_id,
        view_id: options.id
      }
    } else {
      this.setData({
        dist_user_id: '',
      })

    }
    utils.request('video_courses/' + options.id,'GET',{}).then(data=>{
      that.setData({
        course_info: data.course,
        parts:data.parts
      })
    })
    utils.authRequest('collection', 'POST', { video_id: options.id,type:1}).then(data=>{
      var collect
      if(data.status){
        collect=2
      }else{
        collect=1
      }
      that.setData({
        collect: collect
      })
    })
    utils.authRequest('is_watch', 'POST', { video_id:options.id}).then(data=>{
        var is_watch
        if(data.status){
          is_watch=1
        }else{
          is_watch=0
        }
        that.setData({
          is_watch:is_watch
        })
    })

  },
  onTapView: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: './video-part/video-part?id='+id,
    })
  },
  onTapBuy: function () {

  },
  //收藏
  onCollect: function () {
    var type = that.data.collect+1
    utils.authRequest('collection','POST',{video_id:that.data.video_id,type:type}).then(data=>{
        if(data.status){
          that.setData({
            collect:data.collect,
          })
          wx.showToast({
            title: data.message,
            icon:'none'
          })
        }
    })
    
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '视频教程分享',
      path: 'pages/video-course/video-course?id=' + that.data.video_id + '&dist_user_id=' + wx.getStorageSync('user_id'),
    }
  }


})