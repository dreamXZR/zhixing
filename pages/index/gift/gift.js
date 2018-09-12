var api = getApp().globalData.api;
var WxParse = require('../../../wxParse/wxParse.js');
var servsers = getApp().globalData.servsers;
var that
Page({
 
  /**
   * 页面的初始数据 
   */
  data: {
    number1: 0,
    show:'none',
    giftname:'线上比赛小礼物',
    money:"0"
  },
  prevNum: function () {
    var that = this;
    that.setData({
      number1: this.data.number1 + 1,
      money: (this.data.number1 + 1) * this.data.gift_money
    });

  },
  nextNum: function () {
    var that = this;
    that.setData({
      number1: this.data.number1 <= 0 ? 0 : this.data.number1 - 1,
      money: this.data.money <= 0 ? 0 : (this.data.number1 - 1) * this.data.gift_money

    });
  },

  thisVal: function (e) {  // 点击价格获取当前的价格
    var that=this;
    that.setData({
      state: e.currentTarget.dataset.key,
      giftname: this.data.buygift[e.currentTarget.dataset.key].gift_name,
      gift_money: this.data.buygift[e.currentTarget.dataset.key].gift_money,
      giftid: this.data.buygift[e.currentTarget.dataset.key].id,
      number1:0,
      money:0
    });
  },

  toggleList:function(){
    var that=this
      that.setData({
        show: 'block',
      })
  },


  onTapBuy: function (event) {
    var giftname = that.data.giftname;
    var money = that.data.money;
    var number1 = that.data.number1;
    var videoid=that.data.videoid;
    var giftid=that.data.giftid;
    if (money==0){
      wx.showToast({
        title: '请选择相应礼物',
        icon:'none'
      });
      return false;
    }
    wx.navigateTo({
      url: 'giftpay/giftpay?giftname=' + giftname + '&money=' + money + '&number1=' + number1 + '&videoid=' + videoid + '&giftid=' + giftid,
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
    
    wx.request({
      url: api + 'buyList?id=' + options.id,
      success: function (res) {
        that.setData({
          buygift: res.data
        });
      }
    })

    wx.request({
      url: api + 'buyContent?id=' + options.id,
      success: function (res) {
        var gift_content = res.data.gift_content;
        WxParse.wxParse('gift_content', 'html', gift_content, that, 5);
      }
    })


  },

  
})