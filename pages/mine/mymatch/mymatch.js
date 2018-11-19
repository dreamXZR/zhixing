var utils = require('../../../utils/util.js');
var that
Page({
  data: {
    orderList:[],
    status: 1,
    servsers: getApp().globalData.servsers,
    show: 1,
  },
  
  govideo: function (event){
    var videoid = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../index/video/video?videoid=' + videoid,
    })
  },
  onLoad: function () {
    that=this
  },
  onShow: function () {
    wx.showLoading()
    utils.authRequest('userMatch','POST',{}).then(data=>{
      wx.hideLoading();
      if (!data.zx_match_videos[0]) {

        that.setData({
          show: 0,
        })

      }
      that.setData({
        orderList: data.zx_match_videos,
      });
    })
 
  },
  Topay: function (event){
    var order_id = event.currentTarget.dataset.id;
    utils.authRequest('WxPay', 'POST', { order_id:order_id, pay_type: 6 }).then(result => {
      wx.requestPayment({
        'timeStamp': result.timeStamp,
        'nonceStr': result.nonceStr,
        'package': result.package,
        'signType': result.signType,
        'paySign': result.paySign,
        fail: function (aaa) {
          wx.showToast({ title: '支付失败' })
        },
        success: function () {
          that.onShow()
        }
      })
    })
  },
  Todel: function (e) {
    var order_id = e.currentTarget.dataset.id
    wx.showModal({
      content: '是否要删除该订单？',
      success: function (res) {
        if (res.confirm) {
          utils.authRequest('onlineEnroll', 'DELETE', { order_id: order_id }).then(data => {
            wx.showToast({
              title: data.message,
              icon: 'none'
            })
            if (data.status) {
              that.Show()
            }
          })
        }
      }
    })
  },
})