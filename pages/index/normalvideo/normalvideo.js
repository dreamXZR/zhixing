var utils = require('../../../utils/util.js');
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
    var params = {
      video_id: that.data.videoid,
      comment: e.detail.value
    }
    utils.authRequest('videoCommentSubmit', 'POST', params).then(data=>{
      wx.showToast({
        'title': data.message,
      })
      that.setData({
        inputvalue: ''
      })
      that.commentList()
    })

  },

  onLoad: function (options) {
    that=this;
    that.setData({
      videoid: options.videoid
    })

    //获取url
    utils.request('videoUrl', 'POST', { video_id: that.data.videoid, type: 1}).then(data=>{
      that.setData({
        url: data[0].video_url
      });
    })
    that.commentList()
    
  },
  
  onShow: function () {
    
  },
  commentList:function(){
    utils.authRequest('videoComment', 'POST', {video_id:that.data.videoid}).then(data=>{
      if (data.home_video_comments) {
        that.setData({
          talks: data.home_video_comments,
          length:data.home_video_comments.length
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