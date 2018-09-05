const app = getApp()
var api=getApp().globalData.api;
var servsers = getApp().globalData.servsers
Page({

  data: {
    open: false,
    activeCategoryId:1,
    categories:[
      {id:1,name:'视频教程'},
      {id:2,name:'音乐购买'},
      {id:3,name:'音乐定制'},
      {id:4,name:'音乐库'}
    ]
  },
  tabClick: function (e) {
    var that=this
    that.setData({
      activeCategoryId: e.currentTarget.id
    });
    switch (e.currentTarget.id){
      case '2':
        that.musicList()
      break;
    }
  },
  musicList:function(){
    wx.request({
      url: api+'',
    })
  },
  navToPage: function (option) {
   
    var id = option.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'musicinfo/musicinfo?id=' + id,
     
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