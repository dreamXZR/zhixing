
var servsers = getApp().globalData.servsers
var utils = require('../../../utils/util.js');
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this
    that.setData({
      match_id:options.match_id,
      unit_id: wx.getStorageSync('unit_id')
    })  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    utils.request('unit/' +that.data.unit_id, 'GET', {}).then(data => {
      that.setData({
        unit_info: data
      })
    })

    utils.request('enrollInfo', 'GET', {
      match_id:that.data.match_id
    }).then(data => {
      that.setData({
        match_info: data
      })
    })
    that.enroll_orders()
  },
  enroll_orders:function(){
    utils.request('enrollOrders', 'GET', {
      match_id: that.data.match_id,
      unit_id: that.data.unit_id
    }).then(data => {
      that.setData({
        order_info: data.data
      })
    })
  },
  Todel: function (e) {
    var order_id = e.currentTarget.dataset.order_id
    wx.showModal({
      content: '是否要删除该报名订单？',
      success: function (res) {
        if (res.confirm) {
          utils.authRequest('enrollOrders/' + order_id, 'DELETE', {}).then(data => {
            wx.showToast({
              title: data.message,
              icon: 'none'
            })
            if (data.status) {
              that.enroll_orders()
            }
          })
        }
      }
    })
  },

  Topay: function (e) {
    if (e.currentTarget.dataset.status){
      return false
    }
    var order_id = e.currentTarget.dataset.order_id
    utils.authRequest('WxPay', 'POST', { order_id: order_id, pay_type: 2 }).then(result => {
      wx.requestPayment({
        'timeStamp': result.timeStamp,
        'nonceStr': result.nonceStr,
        'package': result.package,
        'signType': result.signType,
        'paySign': result.paySign,
        fail: function (res) {
          wx.showToast({
            title: '支付失败',
            icon: 'none'
          })
        },
        success: function () {
          wx.showToast({
            title: '支付成功'
          })
          that.enroll_orders()
        }
      })
    })
  },
})