
var utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
var api=getApp().globalData.api;
var that
Page({

  data: {
    servsers:getApp().globalData.servsers,
    page: 1
  },
  enroll:function(){
    if (!wx.getStorageSync('user_id')) {
      wx.navigateTo({
        url: '../../login/login',
      })
      return false;
    } else {
      wx.navigateTo({
        url: '../match/matchEnroll/matchEnroll',
      })
    }
  },
  onTapVideo: function (event) {
    var videoid= event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../video/video?videoid='+videoid+'&match_id='+that.data.match_id,
    })
  },

  onLoad: function (options) {
    that=this
    that.setData({
      match_id: options.match_id ? options.match_id:0
    })
  },
  onShow:function(){
    that.data.page=1
    utils.request('onlineMatchInfo', 'GET', {match_id: that.data.match_id}).then(data=>{
      
      that.setData({
        match_data: data,
        is_enroll: data.is_enroll
      })
      var match_content = data.match_content;
      WxParse.wxParse('match_content', 'html', match_content, that, 5);
      utils.request('matchVideoList/' + data.id, 'GET', {}).then(data => {
        that.setData({
          matchVideo: data.data,
        })
      })
    })
    
  },
  loadMore: function () {
    var page = that.data.page + 1
    setTimeout(function () {
      utils.request('matchVideoList/' + that.data.match_data.id, 'GET', { page: page }).then(data => {
      
        that.setData({
          matchVideo: that.data.matchVideo.concat(data.data),
          page: data.meta.pagination.current_page,
        })
       
      })
    }, 500)

  },
  

  
})