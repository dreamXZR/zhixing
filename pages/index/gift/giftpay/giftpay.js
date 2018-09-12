const app = getApp()
var api = getApp().globalData.api;
var servsers = getApp().globalData.servsers
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function (options) {
    that = this;
    that.setData({
      servsers: servsers,
      giftname: options.giftname,
      money: options.money,
      number1: options.number1,
      videoid:options.videoid,
      giftid:options.giftid,
    })
    wx.request({
      url: api + 'moneyCheck',
      method: 'POST',
      data: {
        user_id: wx.getStorageSync('user_id'),
        money: that.data.money,
      },
      success: function (res) {
        that.setData({
          zhixingPay: res.data.status
        })
      }
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
    var that = this;
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
    wx.request({
      url: api + 'WxPay',
      method: "POST",
      data: {
        user_id: wx.getStorageSync('user_id'),
        money: that.data.money,
        pay_type: 5,
      },
      success: function (res) {
       
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          fail: function (aaa) {
            wx.showToast({ title: '支付失败:' + aaa })
          },
          success: function () {
            that.giftBuy(wx.getStorageSync('user_id'), that.data.videoid, that.data.giftid, that.data.number1);
          }
        })
      }
    })
  },
  ZxPay: function () {
    wx.request({
      url: api + 'ZxPay',
      method: 'POST',
      data: {
        user_id: wx.getStorageSync('user_id'),
        money: that.data.money,
        pay_type: 1,
      },
      success: function (res) {
        that.giftBuy(wx.getStorageSync('user_id'), that.data.videoid, that.data.giftid, that.data.number1);
      }
    })
  },
  giftBuy(user_id, videoid,giftid,number1) {
    var that = this;
  
    wx.request({
      url: api + 'buyGift',
      method: "POST",
      data: {
        user_id: user_id,
        match_video_id: videoid,
        gift_id: giftid,
        gift_num: number1
      },
      success: function (res) {
        if (res.data.status) {
          wx.showToast({
            title: res.data.message,
            success:function(){
              setTimeout(function(){
                wx.navigateBack({
                  delta: 2
                })
              },1000)
            }
          })
        }
      }
    })

  }

   




})