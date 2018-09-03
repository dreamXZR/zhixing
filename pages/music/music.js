const app = getApp()
var api=getApp().globalData.api;
var servsers = getApp().globalData.servsers
Page({

  data: {
    open: false,
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
      url: api+'mvList',
      method: 'POST',
      data: {
        class_id: id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          musiclist: res.data.data
        })
        
      }
    })
  },

  navToPage: function (option) {
   
    var id = option.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'musicinfo/musicinfo?id=' + id,
     
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
      url: api + 'mvImg',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          musicbanner: res.data.data,
        })
      }
    })

    wx.request({
      url: api + 'mvClassify',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          musicClassify: res.data,
        })

      }
    });
    if (app.globalData.music_keyword) {
      wx.request({
        url: api + 'mvList',
        method: 'POST',
        data: {
          keyword: app.globalData.music_keyword,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            musiclist: res.data.data
          });
          app.globalData.music_keyword = '';

        }
      })
    } else {
      wx.request({
        url: api + 'mvList',
        method: 'POST',
        data: {
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          that.setData({
            musiclist: res.data.data
          })

        }
      })
    }

  }

  
})