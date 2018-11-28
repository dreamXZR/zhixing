var utils = require('../../../../utils/util.js');
var api = getApp().globalData.api;
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    servsers:getApp().globalData.servsers
  },
  onLoad: function (options) {
    that = this;
    that.setData({
      giftname: options.giftname,
      money: options.money,
      number1: options.number1,
      order_id:options.order_id
    })
    //余额查询
    utils.authRequest('moneyCheck', 'POST', { money: that.data.money}).then(data=>{
      that.setData({
        zhixingPay:data.status
      })
    })

  },
  tapCheck: function (e) {
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
          success: function (res) {
            if(res.confirm){
              that.ZxPay();
            }
            
          }
        })
      }
    }
  },
  wxPay: function () {
    var params={
      order_id:that.data.order_id,
      pay_type: 5,
    }
    utils.authRequest('WxPay', 'POST', params).then(data=>{
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
          that.giftBuy(0); 
        }
      })
    })
  },
  ZxPay: function () {
    var params = {
      money: that.data.money,
      pay_type: 5,
    }
    utils.authRequest('ZxPay','POST',params).then(data=>{
      that.giftBuy(1);   
    })
  },
  giftBuy(status) {
    var params={
      order_id:that.data.order_id,
      is_zx:status
    }
    utils.authRequest('gift_orders','PUT',params).then(data=>{
      if (data.status) {
        wx.showToast({
          title:data.message,
          success: function () {
            setTimeout(function () {
              wx.navigateBack({
                delta: 2
              })
            }, 1000)
          }
        })
      }
    })

  }
})