const app = getApp()
var api = getApp().globalData.api;
var servsers = getApp().globalData.servsers
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      servsers: servsers,
      giftname: options.giftname,
      money: options.money,
      number1: options.number1,
      videoid:options.videoid,
      giftid:options.giftid,
      url:options.url
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
    var that = this;
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
    var that = this;
    wx.request({
      url: api + 'ZxPay',
      method: 'POST',
      data: {
        user_id: wx.getStorageSync('user_id'),
        money: that.data.money,
        pay_type: 1,
      },
      success: function (res) {
        var url = that.data.url;
        console.log(that.data.url)
        console.log(222222)
        var videoid = that.data.videoid;
        console.log(that.data.videoid)
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
        video_id: videoid,
        gift_id: giftid,
        gift_num: number1
      },
      success: function (res) {
        var url = that.data.url;
        
        if (res.data == 'success') {
          wx.showToast({
            title: '支付成功',
            success:function(){
              setTimeout(function(){
                wx.redirectTo({
                  url: '../../video/video?videoid=' + videoid
                })
              },1000)
            }
          })
         
          
        }
      }
    })

  }

   




})