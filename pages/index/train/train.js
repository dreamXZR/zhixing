var api = getApp().globalData.api;
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
    wx.request({
      url: api + 'trainRule',
      success: function (res) {
        var rule = res.data[0].subject_info;
        WxParse.wxParse('rule', 'html', rule, that, 5);

      }
    });
    //题目类型
    wx.request({
      url: api + 'titleType',
      success: function (res) {
        that.setData({
          titletype: res.data
        })


      }
    });
    app.globalData.rig_arr=[];
    app.globalData.err_arr=[];
    //相关数据
    wx.request({
      url:api + 'trainInfo',
      success: function (res) {
        wx.setStorageSync('train_zx_num', res.data.train_zx_num);
        wx.setStorageSync('train_zx_number', res.data.train_zx_number);
        var date = new Date();
        var times_arr = wx.getStorageSync('train_zx_times');
        if (!times_arr || times_arr[0] != date.getDate()){
          wx.setStorageSync('train_zx_times', [date.getDate(), res.data.train_zx_times]);
        }
        wx.setStorageSync('train_zx_status', 0);
        
      }
    })
    
  },
  traininfo:function(e){
    if (!wx.getStorageSync('user_id')) {
      wx.navigateTo({
        url: '../../login/login',
      })
      return false;
    }
    wx.navigateTo({
      url: "../traininfo/traininfo?type="+e.currentTarget.id,
    })
  }
  
})