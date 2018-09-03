var app = getApp();
var api = getApp().globalData.api;
var servsers = getApp().globalData.servsers;
Page({
  data: {
    statusType: ["线下比赛", "线上比赛"],
    currentTpye: 0,
    orderList:[],
    status: 1
  },
  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    this.data.currentTpye = curType
    this.setData({
      currentTpye: curType
    });
    this.onShow();
  },
  govideo: function (event){
    var videoid = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../index/video/video?videoid=' + videoid,
    })
  },
  onLoad: function () {
    
    this.setData({
      servsers: servsers
    })
  },
  onShow: function () {
    wx.showLoading();
    var that = this;
    that.setData({
      status:1
    })
    var user_id = wx.getStorageSync('user_id');
    if (that.data.currentTpye == 0) {
      var match_type=1;
    }
    if (that.data.currentTpye == 1){
      var match_type = 2;
    }

  
   
    wx.request({
      url: api + 'userMatch',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        user_id: user_id,
        match_type:match_type
      },
      success: function (res) {
        
        wx.hideLoading();
        
        if (!res.data[0]) {
          
          that.setData({
            status: 0,
               videoid: res.data.video_id,
          })
          
        }
        that.setData({
          orderList: res.data,
        });
      }
    })
  }

 
    
  
    
})