var utils = require('../../utils/util.js');
var servsers = getApp().globalData.servsers
var that
Page({

  data: {
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
      case '4':
        that.setData({
          activeCategoryId: 1
        });
        wx.navigateTo({
          url: 'music-library/music-library',
        })
      break;
    }
  },
  musicList:function(){
    utils.request('musics','GET',{}).then(data=>{
      that.setData({
        musicList: data.data
      })
    })
  },
  mvList:function(){
    utils.request('mvList','POST',{}).then(data=>{
      that.setData({
        musiclist:data.data
      })
    })
  },
  styleList:function(){
    utils.request('styles','GET',{}).then(data=>{
      that.setData({
        styleList:data
      })
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
    utils.request('banners', 'GET', {}).then(data => {
      that.setData({
        musicbanner: data.data,
      })
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
    var money = e.currentTarget.dataset.money;
    wx.navigateTo({
      url: "music-order/music-order?type=2&id="+id+"&money="+money,

    })
  }

  

  
})