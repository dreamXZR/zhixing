
var WxParse = require('../../../wxParse/wxParse.js');
var api=getApp().globalData.api;
var that
Page({

  data: {
    servsers:getApp().globalData.servsers
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
      url: '../video/video?videoid='+videoid,
    })
  },

  onLoad: function (options) {
    that=this
    that.setData({
      match_id: options.match_id ? options.match_id:0
    })
  },
  onShow:function(){
    wx.request({
      url: api + 'onlineMatchInfo',
      data:{
        match_id:that.data.match_id
      },
      success: function (res) {
        var timestamp = Date.parse(new Date())/1000
        var is_enroll=0
        if (res.data.start_time_str < timestamp && res.data.end_time_str > timestamp){
          is_enroll = 1
        }
        that.setData({
          match_data: res.data,
          is_enroll:is_enroll
        })
        var match_content = res.data.match_content;
        WxParse.wxParse('match_content', 'html', match_content, that, 5);
        wx.request({
          url: api + 'matchVideoList/' + res.data.id,
          success: function (res) {
            that.setData({
              matchVideo: res.data,
            })
          }

        });
      }
    });
    
  }
  

  
})