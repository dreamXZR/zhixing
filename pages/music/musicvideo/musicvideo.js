var api = getApp().globalData.api;
var servsers = getApp().globalData.servsers;
Page({


  data: {
   
    author: '知行体育',
  },
  onLoad: function (options) {
  var that=this;
  that.setData({
    videoid: options.video_id,
    servsers: servsers,
  })

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
      video_id: that.data.videoid,
      type:3
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
     
      that.setData({
        url: res.data[0].mv_url,
        music_class_id: res.data[0].music_class_id,
        name:res.data[0].mv_name,
        poster: res.data[0].mv_img,
      });

    }
  })
    
  },
  //邮箱发送
  formSubmit: function (e){
    var that = this;
    var form_data = e.detail.value;
    var email_reg = /(\S)+[@]{1}(\S)+[.]{1}(\w)+/;
    if (!email_reg.test(form_data.email)) {
      wx.showToast({
        title: '邮箱格式错误',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    
    wx.request({
      url: api+'videoEmail',
      method:'post',
      data:{
        video_name: that.data.name,
        user_id: wx.getStorageSync('user_id'),
        email: form_data.email
      },
      success:function(res){
        if (res.data.status == 'success') {
          wx.showToast({
            title: '已发送',
            icon: 'success',
            duration: 1500
          })
        } else if (res.data.status == 'error') {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 1500
          })
        }
      }
    })
  },
 

  
})