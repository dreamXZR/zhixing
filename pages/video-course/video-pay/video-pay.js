var utils = require('../../../utils/util.js');
var that
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    servsers: getApp().globalData.servsers
  },
  onLoad: function (options) {
    that = this;
    that.setData({
      money: options.money,
      order_id: options.order_id ? options.order_id : '',

    })
    utils.authRequest('moneyCheck', 'POST', { money: options.money }).then(data => {
      that.setData({
        zhixingPay: data.status
      })
    })
  },
  tapCheck: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    that.setData({
      pay_type: id,
    })
    if (id == '1') {
      this.setData({
        checkhb: true,
        checkwx: false,
        checkqb: false
      })
    } else if (id == '2') {
      this.setData({
        checkhb: false,
        checkwx: true,
        checkqb: false
      })
    } else {
      this.setData({
        checkhb: false,
        checkwx: false,
        checkqb: true
      })
    }
  },
  bindButtonTap: function () {
    var pay_type = that.data.pay_type;
    if (pay_type == 2) {
      that.wxPay();
    } else if (pay_type == 1) {
      if (that.data.zhixingPay == 0) {
        wx.showToast({
          title: '余额不足',
        })
      } else {
        wx.showModal({
          title: '支付',
          content: '是否使用知行币支付',
          success: function () {
            that.ZxPay();
          }
        })
      }
    }
  },
  wxPay: function () {
    utils.authRequest('WxPay', 'POST', { pay_type: 8, money: that.data.money, }).then(data => {
      wx.requestPayment({
        'timeStamp': data.timeStamp,
        'nonceStr': data.nonceStr,
        'package': data.package,
        'signType': data.signType,
        'paySign': data.paySign,
        fail: function (res) {
          wx.showToast({ title: '支付失败' })
        },
        success: function () {
          that.order_status()
        }
      })
    })
  },
  ZxPay: function () {
    utils.authRequest('ZxPay', 'POST', { pay_type: 8, money: that.data.money }).then(data => {
      if (data == 'success') {
        that.order_status()
      }

    })
  },
  order_status: function () {
    var data = {
      order_id: that.data.order_id,
      // dist_user_id: app.globalData.dist.dist_user_id,
      // music_id: app.globalData.dist.music_id,
    }
    utils.authRequest('video_orders', 'PUT', data).then(data => {
      wx.showToast({
        title: data.message,
        success: function () {
          setTimeout(function () {
            wx.navigateBack({})
          }, 1000)
        }
      })
    })
  }


})