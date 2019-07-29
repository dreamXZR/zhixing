var utils = require('../../../utils/util.js');
var api = getApp().globalData.api;
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    length:0,
    servsers: getApp().globalData.servsers,
    choice:'',
    recommend:[],
    talks:[]
  },
  // 提交评论
  formSubmit: function (e) {
   
    var params = {
      choice_id: that.data.choice_id,
      comment: e.detail.value
    }
    utils.authRequest('choiceComments', 'POST', params).then(data=>{
        wx.showToast({
          'title': '评论成功',
        })
        var talks=that.data.talks
        talks.unshift(data)
        that.setData({
          inputvalue: '',
          talks: talks
        })
    })

  },

  onLoad: function (options) {
    that=this;
    that.setData({
      choice_id: options.choice_id
    })
    //获取数据
    utils.request('choices/' + options.choice_id, 'GET', {}).then(data=>{
      that.setData({
        choice: data
      });
    })
    //评论列表
    that.commentList(options.choice_id)
    that.recommend()
  },
  
  
  commentList: function (choice_id){
    utils.authRequest('choiceComments', 'GET', { choice_id: choice_id}).then(data=>{
      that.setData({
          talks: data.data,
        })
      
    })
  },
  recommend:function(){
    utils.request('choice_recommend','GET',{type:'video'}).then(data=>{
      that.setData({
        recommend:data.data
      })
    })
  },
  videotap:function(e){
    wx.redirectTo({
      url: './normalvideo?choice_id=' + e.currentTarget.dataset.id,
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