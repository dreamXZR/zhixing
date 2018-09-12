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
    statusType: ["精彩教程", "精彩音乐", "比赛视频"],
    currentTpye: 0,
    banner:[
      { name: '线上比赛', img: '../../images/icon/game1.png', url:'match/match'},
      { name: '线下比赛', img: '../../images/icon/join1.png', url:'join/join'},
      { name: '文章资讯', img: '../../images/icon/news1.png', url:'news/news'},
      { name: '小训练', img: '../../images/icon/train.png', url:'train/train'}
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
    var url = event.currentTarget.dataset.url;
    var image = event.currentTarget.dataset.image;
    var id = event.currentTarget.dataset.id;
    var name = event.currentTarget.dataset.name;
    
    wx.navigateTo({
      url: 'music/music?video_url=' + url + '&video_image=' + image + '&name=' + name,
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
  },
  onShow:function(){
    wx.request({
      url: api + 'homeBanner',
      success: function (res) {
        that.setData({
          jsonText: res.data,
        })

      }
    })
  },
  //导航栏更换
  change: function (curType){
      wx.request({
        url: api + 'homeVideo',
        method: 'GET',
        data: {
          video_type: curType + 2
        },
        success: function (res) {
          that.setData({
            indexvideo: res.data,
          })
        }
      })
  },
  more:function(e){
    wx.navigateTo({
      url: './match/match?match_id=' + e.currentTarget.dataset.id,
    })
  }
  

  
})
