const app = getApp()
var api=getApp().globalData.api;
var servsers = getApp().globalData.servsers
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  onLoad: function (options) {
    var that=this;
    that.setData({
      servsers: servsers,
      view_name:options.view_name,
      view_money:options.view_money,
      view_id:options.view_id,
      order_id: options.order_id,
    })
    wx.request({
      url: api+'moneyCheck',
      method:'POST',
      data:{
        user_id: wx.getStorageSync('user_id'),
        money:that.data.view_money,
      },
      success:function(res){
        that.setData({
          zhixingPay:res.data.status
        })
      }
    })
   
  },
  tapCheck: function (e) {
    var that=this;
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
    var that=this;
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
          success:function(){
            that.ZxPay();
          }
        })
      }
    }
  },
  wxPay:function(){
    var that=this;
   
    wx.request({
      url: api +'WxPay',
      method:"POST",
      data:{
        user_id: wx.getStorageSync('user_id'),
        money:that.data.view_money,
        pay_type:1,
      },
      success: function (res) {
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          fail: function (aaa) {
            wx.showToast({ title: '支付失败' })
          },
          success: function () {
            that.viewBuy(wx.getStorageSync('user_id'), that.data.view_id, that.data.order_id);
            
          }
        })
      }
    })
  },
  ZxPay:function(){
    var that=this;
    wx.request({
      url: api + 'ZxPay',
      method: 'POST',
      data: {
        user_id: wx.getStorageSync('user_id'),
        money: that.data.view_money,
        pay_type: 1,
      },
      success:function(res){
        that.viewBuy(wx.getStorageSync('user_id'), that.data.view_id, that.data.order_id);
        
      }
    })
  },
  viewBuy(user_id,view_id,order_id){
    var dist_user_id='';
    var that=this;
    if (app.globalData.dist.view_id==view_id){
      dist_user_id = app.globalData.dist.dist_user_id
    }
    wx.request({
      url: api + 'orderPay',
      method: "POST",
      data: {
        order_id_str: order_id,
      },
      success: function (res) {
        wx.request({
          url: api + 'mvMemberBuy',
          method: "POST",
          data: {
            user_id: user_id,
            view_id: view_id,
            dist_user_id: dist_user_id,
            view_money: that.data.view_money,
          },
          success: function (res) {
            if (res.data == 'success') {
              wx.showToast({
                title: '支付成功',
                success: function () {
                  setTimeout(function () {
                    wx.navigateBack({})
                  }, 1000) //延迟时间
                }
              })

            }
          }
        })
      }
    })
    
    
  }

  
})