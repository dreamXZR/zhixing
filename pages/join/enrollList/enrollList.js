var utils = require('../../../utils/util.js');
var that
Page({
  data: {
    orderList:[],
    show: 1,
    servsers : getApp().globalData.servsers,
    //statusType: ["未报名", "已报名"],
    //currentTpye: 0,
  },
  
  
  onLoad: function () {
    that=this
    wx.showLoading()
    that.orderList()
  },
  onShow: function () {
   
    
    
  },
  orderList:function(status){
    var unit_id = wx.getStorageSync('unit_id');
    utils.request('enrollList', 'GET', { unit_id: unit_id}).then(data => {
      wx.hideLoading()
      if (data.data) {
        that.setData({
          orderList: data.data,
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
  
  
  goDetail:function(e){
    wx.navigateTo({
      url: '/pages/join/enrollDetail/enrollDetail?match_id='+e.currentTarget.dataset.match_id,
    })
  }

 
    
  
    
})