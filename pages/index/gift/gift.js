var api = getApp().globalData.api;
var WxParse = require('../../../wxParse/wxParse.js');
var servsers = getApp().globalData.servsers;
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
    var that=this;
    var giftname = that.data.giftname;
    var money = that.data.money;
    var number1 = that.data.number1;
    var videoid=that.data.videoid;
    var giftid=that.data.giftid;
    var url=that.data.url;
    if (money==0){
      wx.showToast({
        title: '请选择相应礼物',
      });
      return false;
    }
    wx.navigateTo({
      url: 'giftpay/giftpay?giftname=' + giftname + '&money=' + money + '&number1=' + number1 + '&videoid=' + videoid + '&giftid=' + giftid + '&url=' + url,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      servsers: servsers,
      videoid: options.videoid,
      url: options.url
    })
    console.log(options.url)
    var that=this;
    wx.request({
      url: api + 'buyList?id=' + options.id,

      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          buygift: res.data
        });
      }
    })

    wx.request({
      url: api + 'buyContent?id=' + options.id,

      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var gift_content = res.data.gift_content;
        WxParse.wxParse('gift_content', 'html', gift_content, that, 5);
        console.log(res.data);
      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})