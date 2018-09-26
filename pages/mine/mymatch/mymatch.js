var api = getApp().globalData.api
var servsers = getApp().globalData.servsers
var that
Page({
  data: {
    orderList:[],
    status: 1
  },
  
  govideo: function (event){
    var videoid = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../index/video/video?videoid=' + videoid,
    })
  },
  onLoad: function () {
    that=this
    that.setData({
      servsers: servsers
    })
  },
  onShow: function () {
    wx.showLoading()
    that.setData({
      status:1
    })
    var user_id = wx.getStorageSync('user_id');
    wx.request({
      url: api + 'userMatch',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        user_id: user_id,
      },
      success: function (res) {
        console.log(res.data)
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