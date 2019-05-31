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
      that.setData({
        is_enroll:data.is_enroll,
        matchInfo: data
      })
      var match_content = data.match_content;
      WxParse.wxParse('match_content', 'html', match_content, that, 5);
    })
    
    utils.request('unit/' + wx.getStorageSync('unit_id'),'GET',{}).then(data=>{
      that.setData({
        unit_info:data
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
    if (!that.data.is_enroll) {
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
  staffSelect:function(){
    if (!that.data.is_enroll) {
      wx.showToast({
        title: '报名时间已过',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '../staff-select/staff-select?match_id=' + that.data.matchInfo.id,
      })
    }
  },
  enrollList:function(){
    wx.navigateTo({
      url: '../enrollList/enrollList',
    })
  }
 
})