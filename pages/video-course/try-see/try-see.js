var that
var utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    part_info:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this
    var videoContext = wx.createVideoContext('myvideo', this);
    videoContext.requestFullScreen();//执行全屏方法
    utils.request('parts/' + options.id, 'GET', {}).then(data => {
      that.setData({
        part_info: data
      })
    })
  },
  quit:function(e){
    if(!e.detail.fullScreen){
      wx.navigateBack({})
    }
  }

  
})