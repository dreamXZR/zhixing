var api = getApp().globalData.api
var servsers = getApp().globalData.servsers
var that
Page({
  data: {
    enrollList:[],
    status: 1
  },
  
  
  onLoad: function () {
    that=this
    that.setData({
      servsers: servsers,
    })
  },
  onShow: function () {
    wx.showLoading()
    that.setData({
      status:1
    })
    var unit_id = wx.getStorageSync('unit_id');
    wx.request({
      url: api + 'enrollList',
      data: {
        unit_id: unit_id,
      },
      success: function (res) {
        wx.hideLoading();
        
        if (!res.data.enrolls[0]) {
          
          that.setData({
            status: 0,
          })
          
        }
        that.setData({
          enrollList: res.data.enrolls,
        });
      }
    })
  },
  goMoney:function(e){
    
  },
  goDetail:function(e){
    wx.navigateTo({
      url: '/pages/join/enrollDetail/enrollDetail?enroll_id='+e.currentTarget.dataset.id,
    })
  }

 
    
  
    
})