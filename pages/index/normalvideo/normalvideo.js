var api = getApp().globalData.api;
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    length:0
  },
  // 提交评论
  formSubmit: function (e) {
    if (!wx.getStorageSync('user_id')){
      wx.navigateTo({
        url: '../../login/login',
      })
      return false;
    }
    var that = this;
    wx.request({
      url: api + 'videoCommentSubmit',
      method: 'POST',
      data: {
        video_id: that.data.videoid,
        user_id: wx.getStorageSync('user_id'),
        comment: e.detail.value
      },
      success: function (res) {
        if (res.data.status) {
          wx.showToast({
            'title': res.data.message,
            success: function () {
              that.setData({
                inputvalue: ''
              });
              that.commentList()
            }
          })
        } else{
          wx.showToast({
            'title': res.data.message,
            success: function () {
              that.setData({
                inputvalue: ''
              });
            }
          })
        }

      }
    })

  },

  onLoad: function (options) {
    that=this;
    that.setData({
      videoid: options.videoid
    })

    //获取url
    wx.request({
      url: api + 'videoUrl',
      method: 'POST',
      data: {
        video_id: that.data.videoid,
        type:1
      },
      success: function (res) {
        that.setData({
          url: res.data[0].video_url
        });

      }
    })
    that.commentList()
    
  },
  
  onShow: function () {
    
  },
  commentList:function(){
    wx.request({
      url: api + 'videoComment',
      method: 'POST',
      data: {
        video_id: that.data.videoid,
        user_id:wx.getStorageSync('user_id')
      },
      success: function (res) {
        if (res.data.home_video_comments){
          that.setData({
            talks: res.data.home_video_comments,
            length: res.data.home_video_comments.length
          })
        }
        
      }
    })
  },
  //分享
  onShareAppMessage: function () {
    var that = this;

    return {
      title: '精彩视频分享',
      path: 'pages/index/normalvideo/normalvideo?videoid='+that.data.videoid,
    }
  }

})