var WxParse = require('../../../../wxParse/wxParse.js');
var api=getApp().globalData.api;
var that
Page({


  data: {
  
  },

  onLoad: function (options) {
    that = this;
    that.setData({
      id: options.id
    })
  },
  onShow:function(){
    wx.request({
      url: api + 'articles/' + that.data.id,

      success: function (res) {
        that.setData({
          artlist: res.data,

        })

        var art_content = res.data.art_content;
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