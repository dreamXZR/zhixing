var api = getApp().globalData.api;
//滑动参数
var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
var flag_hd = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
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
              wx.request({
                url: api + 'videoComment',
                method: 'POST',
                data: {
                  video_id: that.data.videoid,

                },
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  that.setData({
                    talks: res.data,
                    length: res.data.length
                  })
                }
              })
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
  var that=this;
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
    wx.request({
      url: api + 'videoComment',
      method: 'POST',
      data: {
        video_id: that.data.videoid,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          talks: res.data,
          length: res.data.length
        })

      }
    })
  },
  
  onShow: function () {
    
  },
  videoChange: function () {
    var that = this;
    wx.request({
      url: api + 'changeHomeVideo',
      method: 'POST',
      data: {
        video_id: that.data.videoid
      },
      success: function (res) {
        wx.redirectTo({
          url: '../normalvideo/normalvideo?videoid=' + res.data,
        })
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