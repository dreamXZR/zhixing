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
    //分销功能
    if (options.dist_user_id) {
      app.globalData.dist = {
        dist_user_id: options.dist_user_id,
        video_id: options.id
      }
    } else {
      this.setData({
        dist_user_id: '',
      })

    }
    //详细信息
    utils.request('video_courses/' + options.id, 'GET', {}).then(data => {
      that.setData({
        course_info: data
      })
    })
    //课程列表
    utils.authRequest('video_courses/' + options.id+'/parts', 'GET', {}).then(data => {
      that.setData({
        parts: data.data
      })
    })
    //课程视频状态
    utils.authRequest('video_status', 'get', { video_id:options.id}).then(data=>{
       
        that.setData({
          is_watch: data.status
        })
      
    })

  },
  onTapView: function (e) {
    var is_watch=that.data.is_watch
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    if (!is_watch){
      if (index != 0){
        wx.showToast({
          title: '如想观看请购买该系列视频',
          icon: 'none'
        })
      }else{
        wx.navigateTo({
          url: './try-see/try-see?id=' + id
        })
      }
      
    }else{
      wx.navigateTo({
        url: './video-part/video-part?part_id=' + id + "&video_id=" + that.data.video_id,
      })
    }
    
  },
  onTapBuy: function () {
    wx.showModal({
      title: '提示',
      content: '是否购买该系列教程？',
      success:function(res){
        if(res.confirm){
          var post_data={
            video_id: that.data.video_id,
          }
          utils.authRequest('video_orders', 'POST', post_data).then(data=>{
            if(data.status){
              wx.navigateTo({
                url: './video-pay/video-pay?order_id=' + data.order_id
              })
            }else{
              if (data.redirect){
                wx.showModal({
                  content: data.message,
                  success:function(res){
                    if(res.confirm){
                      wx.navigateTo({
                        url: '/pages/mine/vip/vip',
                      })
                    }
                  }
                })
              }else{
                wx.showToast({
                  title: data.message,
                  icon: 'none'
                })
              }
             
            }
          })
        }
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