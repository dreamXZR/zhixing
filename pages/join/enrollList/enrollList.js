var utils = require('../../../utils/util.js');
var that
Page({
  data: {
    orderList:[],
    show: 1,
    servsers : getApp().globalData.servsers,
    statusType: ["未报名", "已报名"],
    currentTpye: 0,
  },
  
  
  onLoad: function () {
    that=this
    wx.showLoading()
    that.orderList(0)
  },
  onShow: function () {
   
    
    
  },
  orderList:function(status){
    var unit_id = wx.getStorageSync('unit_id');
    utils.request('enrollList', 'GET', { unit_id: unit_id ,status:status}).then(data => {
      wx.hideLoading()
      if (data.enrolls) {
        that.setData({
          orderList: data.enrolls,
          show: 1,
        });
      } else {
        that.setData({
          show: 0,
        })
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
  Topay:function(e){
    var order_id = e.currentTarget.dataset.id
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
            icon:'none' 
          })
        },
        success: function () {
          wx.showToast({
            title:'支付成功'
          })
          that.onLoad()
        }
      })
    })
  },
  Todel:function(e){
    var order_id = e.currentTarget.dataset.id
    wx.showModal({
      content: '是否要删除该报名订单？',
      success: function (res) {
        if (res.confirm) {
          utils.authRequest('enrolls', 'DELETE', { order_id: order_id }).then(data => {
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
  goDetail:function(e){
    wx.navigateTo({
      url: '/pages/join/enrollDetail/enrollDetail?enroll_id='+e.currentTarget.dataset.id,
    })
  }

 
    
  
    
})