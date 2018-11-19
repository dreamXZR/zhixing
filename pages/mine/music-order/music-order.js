var utils = require('../../../utils/util.js');
var that;
Page({


  data: {
    show: 1,
    servsers:getApp().globalData.servsers,
    statusType:["音乐购买","音乐定制"],
    currentTpye: 0,
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
    that.orderList(0)
  },
  orderList:function(value){
    utils.authRequest('music_orders', 'GET', {type:value}).then(data => {
      if (data.data.length != 0) {
        that.setData({
          orderList: data.data,
          show: 1
        })
      } else {
        that.setData({
          show: 0
        })
      }
    })
  },
  Topay:function (e){
    var order_id=e.currentTarget.dataset.id
    var money=e.currentTarget.dataset.money
    wx.navigateTo({
      url: '/pages/music/musicpay/musicpay?order_id=' + order_id + "&money=" + money,
    })
  },
  Todel:function(e){
    var order_id = e.currentTarget.dataset.id
    wx.showModal({
      content: '是否要删除该订单？',
      success: function (res) {
        if (res.confirm) {
          utils.authRequest('music_orders', 'DELETE', { order_id: order_id }).then(data => {
            wx.showToast({
              title: data.message,
              icon: 'none'
            })
            if (data.status) {
              that.orderList(0)
            }
          })
        }
      }
    })
  },
  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index
    this.setData({
      currentTpye: curType
    });
    that.orderList(curType)
  },
  musicTap:function(e){
    var music_id = e.currentTarget.dataset.musicid
    wx.navigateTo({
      url: '/pages/music/single-music/single-music?id=' + music_id,
    })
  }

})