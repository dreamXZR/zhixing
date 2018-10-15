var api = getApp().globalData.api;
var that
var utils = require('../../../utils/util.js');
Page({
  data: {
    number1: 0,
    disabled1: false,
    disabled2: false,
    money: 0,
  },

  infolog: function () {
    wx.navigateTo({
      url: '../mypayorder/mypayorder?type=2'
    })
  },

  // 获取输入数值
  paymuchInput: function (e) {
    var that = this;
    that.setData({
      paymuch: e.detail.value
    })
  },

  prevNum: function () {
    that.setData({
      number1: that.data.number1 + 1,
      money: ((that.data.number1 + 1) * parseFloat(that.data.zx_money)).toFixed(2)
    });

  },
  nextNum: function () {
    that.setData({
      number1: that.data.number1 <= 0 ? 0 : that.data.number1 - 1,
      money: that.data.money <= 0 ? 0 : ((that.data.number1 - 1) * that.data.zx_money).toFixed(2),
  
    });
  },
  zhixing_money_info:function(){
    utils.authRequest('zhixing','POST',{}).then(data=>{
      that.setData({
        zhixing_money:data.zhixing_money,
        zx_money:data.zx_money,
      })
    })
  },
  // 页面加载
  onLoad: function (options) {
    that=this
  },

  onShow: function () {
    this.zhixing_money_info();
  },

  //充值
  zhixingPay:function(){
    if (that.data.money==0){
      wx.showToast({
        title: '请输入购买数量',
      })
      return false;
    }
    var params = {
      money: that.data.money,
      pay_type: 7,
    }
    utils.authRequest('WxPay','POST',params).then(data=>{
      wx.requestPayment({
        'timeStamp': data.timeStamp,
        'nonceStr': data.nonceStr,
        'package': data.package,
        'signType': data.signType,
        'paySign': data.paySign,
        fail: function (res) {
          wx.showToast({ title: '支付失败'})
        },
        success: function () {
          var zx_params={
            zhixing_money: that.data.number1,
            money: that.data.money
          }
          utils.authRequest('zhixingAdd', 'POST', zx_params).then(data=>{
            if (data.status) {
              wx.showToast({ title:data.message });
              that.zhixing_money_info();
            }
          })
        }
      })
    })
  }
  


})