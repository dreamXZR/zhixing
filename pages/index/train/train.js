var utils = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
const app = getApp();
var that;
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
    that = this;

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //比赛规则
    utils.request('train_rule','GET',{}).then(data=>{
      var rule = data.train_rule;
      WxParse.wxParse('rule', 'html', rule, that, 5);
    })
    //题目类型
    utils.request('train_classifies','GET',{}).then(data=>{
      that.setData({
        titletype: data
      })
    })
    
    app.globalData.rig_arr=[];
    app.globalData.err_arr=[];
    //相关数据
    utils.request('trainInfo','GET',{}).then(data=>{
      wx.setStorageSync('train_zx_num', data.train_zx_num);
      wx.setStorageSync('train_zx_number', data.train_zx_number);
      var time_date = new Date();
      var times_arr = wx.getStorageSync('train_zx_times');
      if (!times_arr || times_arr[0] != time_date.getDate()) {
        wx.setStorageSync('train_zx_times', [time_date.getDate(),data.train_zx_times]);
      }
      wx.setStorageSync('train_zx_status', 0);
    })
    
    
  },
  traininfo:function(e){
    wx.navigateTo({
      url: "../traininfo/traininfo?type="+e.currentTarget.id,
    })
  }
  
})