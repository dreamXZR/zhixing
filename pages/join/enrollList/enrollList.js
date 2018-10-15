var utils = require('../../../utils/util.js');
var that
Page({
  data: {
    enrollList:[],
    status: 1,
    servsers : getApp().globalData.servsers
  },
  
  
  onLoad: function () {
    that=this
  
  },
  onShow: function () {
    wx.showLoading()
    that.setData({
      status:1
    })
    var unit_id = wx.getStorageSync('unit_id');
    utils.request('enrollList','GET',{unit_id:unit_id}).then(data=>{
      wx.hideLoading()
      if (data.enrolls) {
        that.setData({
          enrollList: data.enrolls,
        });
      } else {
        that.setData({
          status: 0,
        })
      }
    })
  },
  goMoney:function(e){
    var id = e.currentTarget.dataset.id
    utils.request('is_money','POST',{enroll_id:id}).then(data=>{
      if (data.status) {
        var params={
          money: data.message.money,
          pay_type: 2
        }
        utils.authRequest('WxPay','POST',params).then(values=>{
          wx.requestPayment({
            'timeStamp': values.timeStamp,
            'nonceStr': values.nonceStr,
            'package': values.package,
            'signType': values.signType,
            'paySign': values.paySign,
            fail: function (aaa) {
              wx.showToast({
                title: '支付失败',
                success: function () {
                  setTimeout(function () {
                    wx.navigateBack({})
                  }, 2000)
                }
              })
            },
            success: function () {
              utils.request('enrollSubmit', 'POST', { enroll_id: id}).then(values1=>{
                wx.showToast({
                  title: '支付成功',
                  success: function () {
                    setTimeout(function () {
                      wx.navigateBack({})
                    }, 2000)
                  }
                })
              })
            }
          })
        })
      }else{
        wx.showToast({
          title:data.message,
        })
      }
    })
  },
  goDetail:function(e){
    wx.navigateTo({
      url: '/pages/join/enrollDetail/enrollDetail?enroll_id='+e.currentTarget.dataset.id,
    })
  }

 
    
  
    
})