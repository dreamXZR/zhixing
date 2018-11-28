var utils = require('../../../utils/util.js');
var servsers = getApp().globalData.servsers;
var that
Page({
 
  /**
   * 页面的初始数据 
   */
  data: {
    number1: 0,
    show:'none',
    money:0
  },
  prevNum: function () {
    that.setData({
      number1: that.data.number1 + 1,
      money: (that.data.number1 + 1) * that.data.gift_money,
      ticket: (that.data.number1 + 1) * that.data.gift_ticket
    });

  },
  nextNum: function () {
    that.setData({
      number1: this.data.number1 <= 0 ? 0 : this.data.number1 - 1,
      money: this.data.money <= 0 ? 0 : (this.data.number1 - 1) * this.data.gift_money,
      ticket: this.data.ticket <= 0 ? 0 : (this.data.number1 - 1) * this.data.gift_ticket,

    });
  },

  thisVal: function (e) {  // 点击价格获取当前的价格
    that.setData({
      state: e.currentTarget.dataset.key,
      giftname: that.data.buygift[e.currentTarget.dataset.key].gift_name,
      gift_money: that.data.buygift[e.currentTarget.dataset.key].gift_money,
      gift_ticket: that.data.buygift[e.currentTarget.dataset.key].gift_ticket,
      giftid: that.data.buygift[e.currentTarget.dataset.key].id,
      number1:0,
      money:0,
      ticket:0,
      show: 'block',
    });
  },

 


  onTapBuy: function (event) {
    if (that.data.ticket == 0) {
      wx.showToast({
        title: '请选择相应礼物',
        icon: 'none'
      });
      return false;
    }
    wx.showModal({
      content:"是否投票支持该视频？",
      success:function(res){
        if(res.confirm){
          var param={
            gift_name: that.data.giftname,
            gift_number: that.data.number1,
            money: that.data.money,
            match_video_id: that.data.videoid,
            ticket_num:that.data.ticket
          }
          utils.authRequest('gift_orders', 'POST', param).then(data=>{
            if(data.status){
              wx.navigateTo({
                url: 'giftpay/giftpay?giftname=' + param.gift_name + '&money=' + param.money + '&number1=' + param.gift_number + '&order_id=' + data.order_id,
              })
            }else{
              wx.showToast({
                title: data.message,
                icon: 'none'
              });
            }
          })
        }
      }
    })
    
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      servsers: servsers,
      videoid: options.videoid,
    })
    utils.request('buyList','GET',{}).then(data=>{
      that.setData({
        buygift: data
      });
    })
    utils.request('buyContent','GET',{}).then(data=>{
      that.setData({
        gift_content: data.gift_content
      })
    })


  },

  
})