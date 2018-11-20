const app = getApp()
var utils = require('../../../../utils/util.js');
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    servsers : getApp().globalData.servsers
  },
  onLoad: function (options) {
    that=this;
    that.setData({
      num:options.num,
      money:options.money,
      order_id:options.order_id
    })
    utils.authRequest('moneyCheck', 'POST', { money: options.money}).then(data=>{
      that.setData({
        zhixingPay: data.status
      })
    })
   
  },
  tapCheck: function (e) {
    var id = e.currentTarget.dataset.id;
    that.setData({
      pay_type:id,
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
  bindButtonTap:function(){
    var pay_type=that.data.pay_type;
    if (pay_type==2){
      that.wxPay();
    }else if(pay_type==1){
      if (that.data.zhixingPay==0){
        wx.showToast({
          title:'余额不足',
        })
      }else{
        wx.showModal({
          title:'支付',
          content:'是否使用知行币支付',
          success:function(res){
            if(res.confirm){
              that.ZxPay();
            }
            
          }
        })
      }
    }
  },
  wxPay:function(){
    var params = {
      order_id:that.data.order_id,
      pay_type: 3,
    }
    utils.authRequest('WxPay', 'POST', params).then(data => {
      wx.requestPayment({
        'timeStamp': data.timeStamp,
        'nonceStr': data.nonceStr,
        'package': data.package,
        'signType': data.signType,
        'paySign': data.paySign,
        fail: function (res) {
          wx.showToast({ title: '支付失败:'})
          wx.navigateBack({})
        },
        success: function () {
          wx.navigateBack({})

        }
      })
    })
    
  },
  ZxPay:function(){
    var params = {
      money: that.data.money,
      pay_type: 3,
    }
    utils.authRequest('ZxPay', 'POST', params).then(data => {
      that.memberAdd();
    })
  },
  memberAdd(){
    var params={
      order_id:that.data.order_id
    }
    utils.authRequest('memberAdd','POST',params).then(data=>{
      wx.showToast({
        title: data.message,
        success: function () {
          setTimeout(function () {
            wx.navigateBack({})
          }, 1000)

        },
      })
    })
 
  }

  
})