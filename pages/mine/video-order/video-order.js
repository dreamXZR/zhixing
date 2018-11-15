var utils = require('../../../utils/util.js');
var that;

Page({

  data: {
    statusType: ["待付款", "已付款"],//"待发货","待收货",
     servsers : getApp().globalData.servsers,
     currentTpye: 0,
     show: 1
  },
  
  onLoad: function (options) {
    that = this
    that.orderList(0)
  },

  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    that.setData({
      currentTpye: curType
    });
    that.orderList(curType)
  },

  orderList:function(status){
    utils.authRequest('video_orders','GET',{status:status}).then(data=>{
      var show=1
      if(data.data.length==0){
        show=0
      }
      that.setData({
        show:show,
        orderList: data.data
      })
    })
  },
  Todel:function(e){
    var order_id = e.currentTarget.dataset.id
    wx.showModal({
      content: '是否要删除该订单？',
      success:function(res){
        if(res.confirm){
          utils.authRequest('video_orders', 'DELETE', { order_id: order_id }).then(data => {
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
  Topay:function(e){
    wx.navigateTo({
      url: '/pages/video-course/video-pay/video-pay?order_id=' + e.currentTarget.dataset.id + '&money=' + e.currentTarget.dataset.money,
    })
    
  },
  ToView:function(e){
    wx.navigateTo({
      url: '/pages/video-course/video-course?id='+e.currentTarget.dataset.id,
    })
  }
})