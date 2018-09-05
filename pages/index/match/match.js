
var WxParse = require('../../../wxParse/wxParse.js');
var api=getApp().globalData.api;
var util = require('../../../utils/util.js');
Page({

  data: {
  },
  enroll:function(){
    if (!wx.getStorageSync('user_id')) {
      wx.navigateTo({
        url: '../../login/login',
      })
      return false;
    }
    var that = this
    var match_data=that.data.match_data
    var start_time = new Date(match_data.start_time.replace(/-/g, "/"));
    var end_time = new Date(match_data.end_time.replace(/-/g, "/"));
    var now_time = new Date(that.data.now_time.replace(/-/g, "/"));

    var day1 = now_time.getTime() - start_time.getTime();
    var day2 = now_time.getTime() - end_time.getTime();
    var day1 = parseInt(day1 / (1000 * 60 * 60 * 24));
    var day2 = parseInt(day2 / (1000 * 60 * 60 * 24));
    if (day1 < 0) {
      wx.showToast({ title: '未开始报名' })
    } else if (day2 > 0) {
      wx.showToast({ title: '报名已结束' })
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

  onLoad: function () {
  },
  onShow:function(){
    var that = this;
    wx.request({
      url: api + 'onlineMatchInfo',
      success: function (res) {
        that.setData({
          match_data: res.data
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
    
    //获取当前时间
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      now_time: time
    });
  }
  

  
})