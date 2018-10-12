var utils=require('../../utils/util.js');
var servsers = getApp().globalData.servsers;
var api=getApp().globalData.api;
const app = getApp();
var that;
Page({
  /**
   * 页面的初始数据 
   */
  data: {
    indexvideo: [],
    statusType: ["精彩视频", "精彩音乐", "比赛视频"],
    currentTpye: 0,
    banner:[
      { name: '线上比赛', img: '../../images/icon/game1.png', url:'match/match'},
      { name: '线下比赛', img: '../../images/icon/join1.png', url:'/pages/join/join'},
      { name: '文章资讯', img: '../../images/icon/news1.png', url:'news/news'},
      { name: '裁判训练', img: '../../images/icon/train.png', url:'train/train'}
    ]
  },
  
  statusTap: function (e) {
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
      url: 'music/music?music_id='+id,
    })
  },
  onTapMatchVideo:function(e){
    var videoid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'video/video?videoid=' + videoid,
    })
  },

  onTapVideo: function (event) {
    var videoid = event.currentTarget.dataset.id
    wx.navigateTo({
      url: 'normalvideo/normalvideo?videoid=' + videoid,
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
        jsonText: values,
      })
    })
    
  },
  //导航栏更换
  change: function (curType){
    utils.request('homeVideo', 'GET', { video_type: curType + 2 }).then(values => { 
      that.setData({
        indexvideo: values,
      })
    })
  },
  more:function(e){
    wx.navigateTo({
      url: './match/match?match_id=' + e.currentTarget.dataset.id,
    })
  }
  

  
})
