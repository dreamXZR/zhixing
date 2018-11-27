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
    ],
    page:1,
  },
  tabClick: function (e) {
    that.setData({
      activeCategoryId: e.currentTarget.id
    });
    switch (e.currentTarget.id){
      case '1':
        that.mvList(1)
      break;
      case '2':
        that.musicStyleList()
      break;
      case '3':
        that.styleList()
      break;
      case '4':
        that.libraryStyleList()
      break;
    }
  },
  
  mvList:function(page){
    utils.request('video_courses','GET',{page:page}).then(data=>{
      that.setData({
        musiclist:data.data,
        page:1
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
  libraryStyleList:function(){
    utils.request('musicLibraryStyles','GET',{}).then(data=>{
      that.setData({
        styleList: data.music_library_styles
      })
    })
  },
  musicStyleList:function(){
    utils.request('music_styles', 'GET', {}).then(data => {
      that.setData({
        styleList: data.music_styles
      })
    })
  },
  navToPage: function (option) {
   
    var id = option.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/video-course/video-course?id=' + id,
     
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
    that.mvList(1)
  },
  navTap:function(e){
    var id = e.currentTarget.dataset.id
    var money = e.currentTarget.dataset.money;
    var activeCategoryId = that.data.activeCategoryId
    switch (activeCategoryId){
      case '2':
        wx.navigateTo({
          url: 'style-list-music/style-list-music?id=' + id,
        })
      break;
      case '3':
        wx.navigateTo({
          url: "music-order/music-order?type=2&id=" + id + "&money=" + money,
        })
      break;
      case '4':
        wx.navigateTo({
          url: 'music-library/music-library?style_id=' + id,
        })
      break;
    }
  },
  loadMore:function(){
    var page=that.data.page+1
    utils.request('video_courses', 'GET', { page: page }).then(data => {
      that.setData({
        musiclist: that.data.musiclist.concat(data.data),
        page: data.meta.pagination.current_page,
        total_pages: data.meta.pagination.total_pages
      })
    })
  }
  

  
})