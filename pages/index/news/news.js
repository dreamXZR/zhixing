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
  //搜索  
  searchInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  search: function () {
    var that=this
    if (that.data.inputValue) {
      wx.request({
        url: api + 'article',
        data: {
          keyword: that.data.inputValue
        },
        success: function (res) {
          that.setData({
            newslist: res.data.data,
          })

        }
      })
    } else {
      wx.request({
        url: api + 'article',
        success: function (res) {
          that.setData({
            newslist: res.data.data,
          })

        }
      })
    }
  },
  onLoad: function () {
    this.setData({
      servsers: servsers
    })
    
  },

  onShow:function(){
    var that = this;
    wx.request({
      url: api + 'article',
      success: function (res) {
        that.setData({
          newslist: res.data.data,
        })

      }
    })
    
  }

  
})