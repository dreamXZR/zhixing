var WxParse = require('../../wxParse/wxParse.js');
var servsers = getApp().globalData.servsers;
var app=getApp();
var api=getApp().globalData.api;
var that
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
    var id = option.currentTarget.dataset.id;
    
    wx.request({
      url: api+'courseList',
      method: 'POST',
      data: {
        class_id: id
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
  //搜索  
  searchInput: function (e) {
   that.setData({
     inputValue:e.detail.value
   })
  },
  search:function(){
    if (that.data.inputValue) {
      wx.request({
        url: api + 'courseList',
        method: 'POST',
        data: {
          keyword: that.data.inputValue,
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
        success: function (res) {
          that.setData({
            videolist: res.data.data
          })

        }
      })
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    that=this
    that.setData({
      servsers: servsers
    })
  },
  onShow:function(){
    //简介
    wx.request({
      url: api + 'shopInfo',
      success: function (res) {
        var shopinfo = res.data.info;
        WxParse.wxParse('shopinfo', 'html', shopinfo, that, 5);

      }
    });
    //轮播图
    wx.request({
      url: api + 'shopImg',
      success: function (res) {
        that.setData({
          shopimg: res.data,
        })
      }
    });
    //分类
    wx.request({
      url: api + 'courseClassify',
      success: function (res) {
        that.setData({
          courseClassify: res.data,
        })
      }
    });
    //课程
    wx.request({
      url: api + 'courseList',
      method: 'POST',
      success: function (res) {
        that.setData({
          videolist: res.data.data
        })

      }
    })
    
  }

})