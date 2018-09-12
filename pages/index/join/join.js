var WxParse = require('../../../wxParse/wxParse.js');
var api=getApp().globalData.api;
const app = getApp();
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  onTapSingle: function (event) {
    if (!wx.getStorageSync('user_id')) {
      wx.navigateTo({
        url: '../../login/login',
      })
      return false;
    } else if (that.data.is_enroll == 0) {
      wx.showToast({
        title: '报名时间已过',
        icon: 'none'
      })
    }else{
      app.globalData.single_enroll=[];
      wx.navigateTo({
        url: 'single/single',
      })
    }
  },
  onTapTeam: function (event) {
    if (!wx.getStorageSync('user_id')) {
      wx.navigateTo({
        url: '../../login/login',
      })
      return false;
    }else if(that.data.is_enroll==0){
      wx.showToast({
        title: '报名时间已过',
        icon:'none'
      })
    }else {
      app.globalData.single_enroll = [];
      wx.navigateTo({
        url: 'team/team',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this
  },
  onShow:function(){
    var that = this;
    wx.request({
      url: api + 'enrollInfo',
      success: function (res) {
        var timestamp = Date.parse(new Date()) / 1000
        var is_enroll = 0
        if (res.data.start_time_str < timestamp && res.data.end_time_str > timestamp) {
          is_enroll = 1
        }
        that.setData({
          match_title: res.data.match_title,
          start_time: res.data.start_time,
          end_time: res.data.end_time,
          is_enroll: is_enroll,
          
        })

        var match_content = res.data.match_content;
        WxParse.wxParse('match_content', 'html', match_content, that, 5);
      }
    })
  }

 
})