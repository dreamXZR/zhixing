const app = getApp();
var servsers = getApp().globalData.servsers;
var api=getApp().globalData.api;

Page({

  data: {
  
  },
  navToPage: function (option) {

    var id = option.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'newinfo/newinfo?id=' + id,
    })
  },
  // 搜索入口  
  wxSearchTab: function () {
    wx.redirectTo({
      url: 'search/search'
    })
  },
  onLoad: function (options) {
    this.setData({
      servsers: servsers
    })
    
  },

  onShow:function(){
    var that = this;
    if (app.globalData.article_keyword) {
      wx.request({
        url: api + 'article',
        method: 'GET',
        data:{
          keyword: app.globalData.article_keyword
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            newslist: res.data.data,
          })

        }
      })
    }else{
      wx.request({
        url: api + 'article',
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            newslist: res.data.data,
          })

        }
      })
    }
    
  }

  
})