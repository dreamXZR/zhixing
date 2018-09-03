var api = getApp().globalData.api;
Page({
  data: {
    number1: 0,
    disabled1: false,
    disabled2: false,
    money: 0,
  },

  infolog: function () {
    wx.navigateTo({
      url: '../myzxorder/myzxorder'
    })
  },

  // 获取输入数值
  paymuchInput: function (e) {
    var that = this;
    that.setData({
      paymuch: e.detail.value
    })
    console.log(e.detail.value)
  },

  prevNum: function () {
    var that=this;
    that.setData({
      number1: this.data.number1 + 1,
      money: ((this.data.number1 + 1) * this.data.zx_money).toFixed(1)
    });

  },
  nextNum: function () {
    var that = this;
    that.setData({
      number1: this.data.number1 <= 0 ? 0 : this.data.number1 - 1,
      money: that.data.money <= 0 ? 0 : ((that.data.number1 - 1) * that.data.zx_money).toFixed(1),
  
    });
  },
  zhixing_money_info:function(){
    var that = this;
    wx.request({
      url: api + 'zhixing',
      method: 'POST',
      data: {
        user_id: wx.getStorageSync('user_id')
      },
      success: function (res) {
        that.setData({
          zhixing_money: res.data.zhixing_money,
          zx_money: res.data.zx_money,
        })
      }
    })
  },
  // 页面加载
  onLoad: function (options) {
    
  },

  onShow: function () {
    this.zhixing_money_info();
  },

  //充值
  zhixingPay:function(){
    var that=this;
    if (that.data.money==0){
      wx.showToast({
        title: '请输入购买数量',
      })
      return false;
    }
    wx.request({
      url: api+'zhixingPay',
      method:"POST",
      data:{
        user_id: wx.getStorageSync('user_id'),
        money:that.data.money
      },
      success:function(res){
       
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
            wx.request({
              url: api+'zhixingAdd',
              method:"POST",
              data:{
                user_id: wx.getStorageSync('user_id'),
                zhixing_money:that.data.number1,
                money: that.data.money
              },
              success:function(res){
                if(res.data=='success'){
                  wx.showToast({ title: '支付成功:'});
                  that.zhixing_money_info();
                }
              }
            })
          }
        })
      }
    })
  }
  


})