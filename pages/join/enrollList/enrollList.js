var api = getApp().globalData.api
var servsers = getApp().globalData.servsers
var that
Page({
  data: {
    enrollList:[],
    status: 1
  },
  
  
  onLoad: function () {
    that=this
    that.setData({
      servsers: servsers,
    })
  },
  onShow: function () {
    wx.showLoading()
    that.setData({
      status:1
    })
    var unit_id = wx.getStorageSync('unit_id');
    wx.request({
      url: api + 'enrollList',
      data: {
        unit_id: unit_id,
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.enrolls){
          that.setData({
            enrollList: res.data.enrolls,
          });
        }else{
          that.setData({
            status: 0,
          })
        }
        
      }
    })
  },
  goMoney:function(e){
    var id = e.currentTarget.dataset.id
    wx.request({
      url: api+'is_money',
      method:'POST',
      data:{
        enroll_id: id
      },
      success:function(res){
        if(res.data.status){
          //进行支付
          wx.request({
            url: api + 'WxPay',
            method: "POST",
            data: {
              user_id: wx.getStorageSync('user_id'),
              money: res.data.message.money,
              pay_type: 2
            },
            success: function (res) {

              wx.requestPayment({
                'timeStamp': res.data.timeStamp,
                'nonceStr': res.data.nonceStr,
                'package': res.data.package,
                'signType': res.data.signType,
                'paySign': res.data.paySign,
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
                  wx.request({
                    url: api + 'enrollSubmit',
                    method: 'POST',
                    data: {
                      enroll_id: id,
                      type: 1
                    },
                    success: function (res) {
                      wx.showToast({
                        title: '支付成功',
                        success: function () {
                          setTimeout(function () {
                            wx.navigateBack({})
                          }, 2000)
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }else{
          wx.showToast({
            title: res.data.message,
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