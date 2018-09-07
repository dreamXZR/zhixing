const app = getApp()
var api=getApp().globalData.api;
var servsers = getApp().globalData.servsers
var that
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
    that.setData({
      activeCategoryId: e.currentTarget.id
    });
    switch (e.currentTarget.id){
      case '1':
        that.mvList()
      break;
      case '2':
       that.musicList()
      break;
      case '3':
        that.styleList()
      break;
    }
  },
  musicList:function(){
    wx.request({
      url: api +'musics',
      success:function(res){
        that.setData({
          musicList:res.data.musics
        })
      }
    })
  },
  mvList:function(){
    wx.request({
      url: api + 'mvList',
      method: 'POST',
      success: function (res) {
        that.setData({
          musiclist: res.data.data
        })

      }
    })
  },
  styleList:function(){
    wx.request({
      url: api + 'styles',
      success: function (res) {
        that.setData({
          styleList: res.data
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
    wx.request({
      url: api + 'mvImg',
      success: function (res) {
        that.setData({
          musicbanner: res.data.data,
        })
      }
    })
    that.mvList()
  },
  musictap:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'single-music/single-music?id=' + id,

    })
  },
  styletap: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'style-music/style-music?id=' + id,

    })
  }

  

  
})