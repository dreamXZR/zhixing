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
    
    // utils.authRequest('collection', 'POST', { video_id: options.id,type:1}).then(data=>{
    //   var collect
    //   if(data.status){
    //     collect=2
    //   }else{
    //     collect=1
    //   }
    //   that.setData({
    //     collect: collect
    //   })
    // })
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

      utils.request('video_courses/' + options.id, 'GET', { is_watch: is_watch}).then(data=> {
        that.setData({
          course_info: data.course,
          parts: data.parts
        })
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
        url: './video-part/video-part?id=' + id + "&video_id=" + that.data.video_id,
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
            money: that.data.course_info.money
          }
          utils.authRequest('video_orders', 'POST', post_data).then(data=>{
            if(data.status){
              wx.navigateTo({
                url: './video-pay/video-pay?order_id=' + data.order_id + "&money=" + that.data.course_info.money,
              })
            }else{
              wx.showToast({
                title: data.message,
                icon:'none'
              })
            }
          })
        }
      }
    })
  },
  //收藏
  // onCollect: function () {
  //   var type = that.data.collect+1
  //   utils.authRequest('collection','POST',{video_id:that.data.video_id,type:type}).then(data=>{
  //       if(data.status){
  //         that.setData({
  //           collect:data.collect,
  //         })
  //         wx.showToast({
  //           title: data.message,
  //           icon:'none'
  //         })
  //       }
  //   })
    
  // },
  //分享
  onShareAppMessage: function () {
    return {
      title: '视频教程分享',
      path: 'pages/video-course/video-course?id=' + that.data.video_id + '&dist_user_id=' + wx.getStorageSync('user_id'),
    }
  }


})