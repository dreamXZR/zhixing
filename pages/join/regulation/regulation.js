var WxParse = require('../../../wxParse/wxParse.js');
var utils = require('../../../utils/util.js');
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    utils.request('enrollInfo','GET',{}).then(data=>{
      var timestamp = Date.parse(new Date()) / 1000
      var is_enroll = 0
      if (data.start_time_str < timestamp && data.end_time_str > timestamp) {
          is_enroll = 1
        }
      that.setData({
        is_enroll: is_enroll,
        matchInfo:data
      })
      var match_content = data.match_content;
      WxParse.wxParse('match_content', 'html', match_content, that, 5);
    })
    utils.request('unitInfo','GET',{unit_id:wx.getStorageSync('unit_id')}).then(data=>{
      that.setData({
        unit_name:data.name
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  playerList:function(){
    wx.navigateTo({
      url: '../playerList/playerList',
    })
  },
  staffList:function(){
    wx.navigateTo({
      url: '../staff/staff',
    })
  },
  enroll:function(){
    if (that.data.is_enroll == 0) {
      wx.showToast({
        title: '报名时间已过',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '../single/single?match_id=' + that.data.matchInfo.id,
      })
    }
  },
  enrollList:function(){
    wx.navigateTo({
      url: '../enrollList/enrollList',
    })
  }
 
})