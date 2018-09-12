var api = getApp().globalData.api;
var servsers = getApp().globalData.servsers;
var that
Page({

  
  data: {
    items:[
      { id: 0, value: '文件', checked: 'true' },
      { id: 1, value: '网盘链接' },
      { id: 2, value: '自己发送' }
    ],
    select:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      servsers: servsers,
    })
  },
  radioChange:function(e){
    that.setData({
      select:e.detail.value
    })
  },
  //选择文件
  chooseImg: function () {
    wx.getFileInfo({
      success(res) {
        console.log(res.size)
        console.log(res.digest)
      }
    })
  }

  
})