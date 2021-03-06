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
    money:0,
    ticket:0,
    free_gift:false
  },
  prevNum: function () {
    that.setData({
      number1: that.data.number1 + 1,
      money: ((that.data.number1 + 1) * that.data.gift_money).toFixed(2),
      ticket: (that.data.number1 + 1) * that.data.gift_ticket
    });

  },
  nextNum: function () {
    that.setData({
      number1: this.data.number1 <= 0 ? 0 : this.data.number1 - 1,
      money: this.data.money <= 0 ? 0 : ((this.data.number1 - 1) * this.data.gift_money).toFixed(2),
      ticket: this.data.ticket <= 0 ? 0 : (this.data.number1 - 1) * this.data.gift_ticket,

    });
  },

  thisVal: function (e) {  // 点击价格获取当前的价格
    var index = e.currentTarget.dataset.index
    var gift_money = that.data.buygift[index].gift_money
    var gift_ticket = that.data.buygift[index].gift_ticket
    that.setData({
      state: index,
      giftname: that.data.buygift[index].gift_name,
      gift_money: gift_money,
      gift_ticket: gift_ticket,
      giftid: that.data.buygift[index].id,
      number1:1,
      money: Math.round(gift_money * 100) / 100,
      ticket: gift_ticket,
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
            ticket_num:that.data.ticket,
            vote_type: 'money'
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
  toFreeGift:function(e){
    if (that.data.free_gift){
      wx.showModal({
        content: "是否投票支持该视频？",
        success: function (res) {
          if (res.confirm) {
            var gift = that.data.buygift[0]
            var param = {
              gift_name: gift.gift_name,
              gift_number: 1,
              money: 0,
              match_video_id: that.data.videoid,
              ticket_num: gift.gift_ticket,
              vote_type: 'free'
            }
            utils.authRequest('gift_orders', 'POST', param).then(data => {
              if (data.status) {
                utils.authRequest('gift_orders', 'PUT', { 'order_id': data.order_id }).then(data => {
                  if (data.status) {
                    wx.showToast({
                      title: data.message,
                    })
                    that.setData({
                      free_gift: false
                    })
                  }
                })
              }
            })
          }
        }
      })
    }else{
      wx.showModal({
        content: "免费投票次数已用完，购买礼品为您喜欢的选手加油吧",
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      servsers: servsers,
      videoid: options.videoid,
      match_id:options.match_id
    })
  },
  
  onShow:function(){
    utils.request('gifts', 'GET', {}).then(data => {
      that.setData({
        buygift: data.data
      });
    })
    utils.request('onlineMatchInfo', 'GET', { match_id: that.data.match_id }).then(data => {
      that.setData({
        match_data: data,
      })
     
    })

    utils.authRequest('gifts/free','GET',{}).then(data=>{
        that.setData({
          free_gift:data.status
        })
    })
  }

  
})