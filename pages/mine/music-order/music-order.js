var utils = require('../../../utils/util.js');
var that;
Page({


  data: {
    status: 1,
    servsers:getApp().globalData.servsers
  },

  onLoad: function (options) {
    that=this
  },
  toIndexPage: function () {
    wx.switchTab({
      url: '/pages/music/music',
    })
  },

  onShow: function () {
    utils.authRequest('music_orders','GET',{}).then(data=>{
      if(data.data.length!=0){
        that.setData({
          orderList:data.data
        })
      }else{
        that.setData({
          status:0
        })
      }
    })
  },
  toBuy:function (e){
    var order_id=e.currentTarget.dataset.id
    var money=e.currentTarget.dataset.money
    wx.navigateTo({
      url: '/pages/music/musicpay/musicpay?order_id=' + order_id + "&money=" + money,
    })
  }

})