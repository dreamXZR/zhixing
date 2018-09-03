var WxParse = require('../../wxParse/wxParse.js');
var servsers = getApp().globalData.servsers;
var app=getApp();
var api=getApp().globalData.api;
Page({

  data: {
    open: false,
    shopimg:[],
  },
  showitem: function () {
    this.setData({
      open: !this.data.open
    })
  },
  Classify: function (option) {
    var that = this;
    var id = option.currentTarget.dataset.id;
    
    wx.request({
      url: api+'courseList',
      method: 'POST',
      data: {
        class_id: id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          videolist: res.data.data
        })
      }
    })
  },
  
  navToPage: function (option) {
    var id = option.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'info/info?id=' + id,
      
    })
  },
  // 搜索入口  
  wxSearchTab: function () {
    wx.redirectTo({
      url: 'search/search'
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    this.setData({
      servsers: servsers
    })
  },
  onShow:function(){
    var that = this;
    wx.request({
      url: api + 'shopInfo',
      method: 'GET',

      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var shopinfo = res.data.info;
        WxParse.wxParse('shopinfo', 'html', shopinfo, that, 5);

      }
    });
    wx.request({
      url: api + 'shopImg',
      method: 'GET',

      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          shopimg: res.data,
        })
      }
    });
    wx.request({
      url: api + 'courseClassify',
      method: 'GET',

      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          courseClassify: res.data,
        })
      }
    });
    if (app.globalData.course_keyword) {
      wx.request({
        url: api + 'courseList',
        method: 'POST',
        data: {
          keyword: app.globalData.course_keyword,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            videolist: res.data.data
          });
          app.globalData.course_keyword = '';

        }
      })
    } else {
      wx.request({
        url: api + 'courseList',
        method: 'POST',

        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            videolist: res.data.data
          })

        }
      })
    }
  }

  



})