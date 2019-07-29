var utils=require('../../utils/util.js');
var servsers = getApp().globalData.servsers;
const app = getApp();
var that;
Page({
  /**
   * 页面的初始数据 
   */
  data: {
    indexvideo: [],
    banners:[],
    navType: [
      { alias: 'video', name:'精彩视频'},
      { alias: 'music', name: '精彩音乐'},
      { alias: 'match', name: '比赛视频'}
      ],
    currentTpye: 0,
    navbar:[
      { name: '线上比赛', img: '../../images/icon/game1.png', url:'match/match'},
      { name: '线下比赛', img: '../../images/icon/join1.png', url:'/pages/join/join'},
      { name: '文章资讯', img: '../../images/icon/news1.png', url:'news/news'},
      { name: '裁判训练', img: '../../images/icon/train.png', url:'train/train'}
    ],
    page:1
  },
  
  navTypeTap: function (e) {
    var curType = e.currentTarget.dataset.index
    this.setData({
      currentTpye: curType
    });
    this.change(curType);
  },
  onTap:function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  onTapMusic: function (event){
   
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'music/music?choice_id='+id,
    })
  },
  onTapMatchVideo:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'video/video?videoid=' + id,
    })
  },

  onTapVideo: function (event) {
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: 'normalvideo/normalvideo?choice_id=' + id,
    })
  },
  onLoad: function (options) {
    that=this;
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      app.globalData.share_user_id = scene
    }else{
      app.globalData.share_user_id ='nothing';
    }
    that.setData({
      servsers: servsers
    })
    that.change(0)
    // 获取user_id

    var user_id = wx.getStorageSync('user_id')
    var accessToken = wx.getStorageSync('access_token')
    if (!user_id || !accessToken) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      // 获取用户信息
      wx.getUserInfo({

        success: function (res) {
          app.globalData.userInfo = JSON.parse(res.rawData)
        }
      })
    }
  },
  onShow:function(){
    utils.request('homeBanner', 'GET', {}).then(values =>{
      that.setData({
        banners: values.data,
      })
    })
    
  },
  //导航栏更换
  change: function (curType){
    var url = 'choice_recommend';
    if (curType==2){
      url = 'choice_recommend?include=matchVideos'
    }
    utils.request(url, 'GET', { type: that.data.navType[curType].alias }).then(data => {
      if (curType==2){
        that.setData({
          matchRecommend: data.data
        })
      }else{
        that.setData({
          choice: data.data,
        })
      }
      
    })
  },
  more:function(e){
    wx.navigateTo({
      url: './match/match?match_id=' + e.currentTarget.dataset.id,
    })
  },
  loadMore:function(){
    var page=that.data.page+1
    var video_type = that.data.currentTpye+2
    setTimeout(function(){
      utils.request('homeVideo', 'GET', { video_type: video_type, page: page }).then(data => {
        that.setData({
          indexvideo: that.data.indexvideo.concat(data.data),
          page: data.meta.pagination.current_page,
        })
      })
    },500)
    
  },
  //轮播图点击跳转
  onSwiperTap:function(event){
    var index=event.target.dataset.index
    var link=that.data.banners[index].link_url
    var is_tabBar = that.data.banners[index].is_tabBar
    if (is_tabBar){
      wx.switchTab({
        url: link,
      })
    }else{
      wx.navigateTo({
        url: link,
      })
    }
    
  },
  show_more:function(e){
    var curType = that.data.currentTpye
    wx.navigateTo({
      url: 'choice/choice?type='+that.data.navType[curType].alias,
    })
  }
  
  

  
})
