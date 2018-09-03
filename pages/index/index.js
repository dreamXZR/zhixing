var servsers = getApp().globalData.servsers;
var api=getApp().globalData.api;
const app = getApp();
Page({
  /**
   * 页面的初始数据 
   */
  data: {
    jsonText: [],
    indexvideo: [],
    statusType: ["比赛视频", "精彩教程", "精彩音乐"],
    currentTpye: 0,
  },

  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    this.data.currentTpye = curType
    this.setData({
      currentTpye: curType
    });
    this.onShow();
  },

  onTapMatch: function (event) {
    wx.navigateTo({
      url: 'match/match',
    })
  },
  onTapJoin: function (event) {
    wx.navigateTo({
      url: 'join/join',
    })
  },
  onTapNews: function (event) {
    app.globalData.article_keyword = '';
    wx.navigateTo({
      url: 'news/news',
    }) 
  },
  onTapTrain: function (event) {
    wx.navigateTo({
      url: 'train/train',
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

  onTapVideo: function (event) {

    var url = event.currentTarget.dataset.url;
    var videoid = event.currentTarget.dataset.id

    wx.navigateTo({
      url: 'normalvideo/normalvideo?videoid=' + videoid,
    })
  },
  onLoad: function (options) {
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      app.globalData.share_user_id = scene
    }else{
      app.globalData.share_user_id ='nothing';
    }
    this.setData({
      servsers: servsers
    })
  },
  onShow:function(){
    var that = this;
    var status;

    if (that.data.currentTpye == 0) {
      status = 1;
    }

    if (that.data.currentTpye == 1) {
      status = 2;
    }
    if (that.data.currentTpye == 2) {
      status = 3;
    }


    wx.request({
      url: api + 'homeBanner',
      method: 'GET',

      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          jsonText: res.data,
        })

      }
    }),

 
    wx.request({
      url: api + 'homeVideo',
      method: 'GET',
      data:{
        video_type: status
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          indexvideo: res.data,
        })
        
   
      }

    })
  }
  

  
})
