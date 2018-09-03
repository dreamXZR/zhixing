var servsers = getApp().globalData.servsers;
var WxParse = require('../../../wxParse/wxParse.js');
var api=getApp().globalData.api;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  onTapBuy: function (event) {
    if (!wx.getStorageSync('user_id')) {
      wx.navigateTo({
        url: '../../login/login',
      })
      return false;
    }
    var that=this;
    wx.navigateTo({
      url: '../order/order?course_id='+that.data.infoid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      servsers: servsers,
      id: options.id
    })
    

    
    if (options.dist_user_id) {
      app.globalData.dist = {
        dist_user_id: options.dist_user_id,
        view_id: options.id
      }
    } else {
      that.setData({
        dist_user_id: '',
      })

    }
    wx.request({
      url: api+'courseInfo?course_id='+options.id,
     
      success: function (res) {
        that.setData({
          infoid: res.data.data[0].id,
          infoimg: res.data.data[0].pictures,
          infoname: res.data.data[0].course_name,
          infoprice: res.data.data[0].course_money  
        })
        var course_about = res.data.data[0].course_about;
        WxParse.wxParse('course_about', 'html', course_about, that, 5);
      }
    })
  },

  //分享
  onShareAppMessage: function () {
    var that = this;

    return {
      title: '训练营教程分享',
      path: 'pages/lesson/info/info?id=' + that.data.id + '&dist_user_id=' + wx.getStorageSync('user_id'),
    }
  }

 
})