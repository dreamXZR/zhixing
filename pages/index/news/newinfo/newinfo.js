var servsers = getApp().globalData.servsers;
var WxParse = require('../../../../wxParse/wxParse.js');
var api=getApp().globalData.api;
Page({


  data: {
  
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: api+'singleArticle?art_id=' + options.id,
      
      success: function (res) {
        that.setData({
          artlist:res.data.data,
      
        })
        
        var art_content = res.data.data[0].art_content;
        WxParse.wxParse('art_content', 'html', art_content, that, 5);
        
      }
    })
  },
  onShareAppMessage:function(){
    var that = this;
    return {
      title: that.data.artlist[0].art_title,
      path: '/pages/index/news/newinfo/newinfo?id=' + that.data.artlist[0].id,

    }
  }

  
})