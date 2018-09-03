
var app = getApp();
var api = getApp().globalData.api;
var servsers = getApp().globalData.servsers;
Page({
  data: {
    statusType: ["全部", "待付款", "已完成"],//"待发货","待收货",
    currentTpye: 0,
    totalmoney:0,
    selectAllStatus: true,
    selectthis:1,
    show:1
  },

  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    this.data.currentTpye = curType
    this.setData({
      currentTpye: curType
    });
    this.onShow();
  },
  cancelOrderTap: function (e) {
    var that = this;
    var orderList = that.data.orderList;
    var arr=new Array();
    var arrstr;
    for (let i = 0; i < orderList.length; i++) {       
      if (orderList[i].isSelect) {                 
        arr.push(orderList[i].id)
      }
      arrstr = arr.join(",")
      that.setData({
        order_id_str: arrstr
      })
    }
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: api + 'orderCancel',
            method:'POST',
            data: {
              order_id_str:that.data.order_id_str
            },
            success:function(res){
              that.onShow();
            }
          })
        }
      }
    })
  },
  toPayTap: function (e) {
    var money = e.currentTarget.dataset.money;
    var that = this;
    var orderList = that.data.orderList;
    var arr = new Array();
    var arrname = new Array();
    var arrstr;
    var arrnamestr;
    for (let i = 0; i < orderList.length; i++) {
      if (orderList[i].isSelect) {
        arr.push(orderList[i].id)
        arrname.push(orderList[i].course_name)
      }
      arrstr = arr.join(",")
      arrnamestr = arrname.join(",")
      that.setData({
        order_id_str: arrstr,
        name: arrnamestr
      })
    }
    wx.navigateTo({
      url: 'myorderpay/myorderpay?order_name=课程缴费'+ '&order_money=' + that.data.totalPrice + '&order_id_str=' + that.data.order_id_str,
    })



    
  },


  bindCheckbox: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    let orderList = that.data.orderList;
    const isSelect = orderList[index].isSelect;
    that.data.orderList[index].isSelect = !isSelect;
    var select_num = 0;
    for (var i = 0; i < orderList.length; i++) {
      if (orderList[i].isSelect) {
        select_num += 1;
      }
    }
    if (select_num == orderList.length) {
      this.setData({
        selectAllStatus: true,
      })
    } else {
      this.setData({
        selectAllStatus: false,
      })
    }

    this.setData({
      orderList: orderList
    });
    this.getTotalPrice();
  },

  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;    // 是否全选状态
    selectAllStatus = !selectAllStatus;
    let orderList = this.data.orderList;

    for (let i = 0; i < orderList.length; i++) {
      orderList[i].isSelect = selectAllStatus;            // 改变所有商品状态
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      orderList: orderList
    });
    this.getTotalPrice();                               // 重新获取总价
  },

  getTotalPrice() {
    let orderList = this.data.orderList;                  // 获取购物车列表
    let total = 0;
    for (let i = 0; i < orderList.length; i++) {         // 循环列表得到每个数据
      if (orderList[i].isSelect) {                   // 判断选中才会计算价格
        total += +orderList[i].money;       
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      orderList: orderList,
      totalPrice: total,
    });
  },

  onLoad: function (options) {
    this.setData({
      servsers: servsers 
    })
  },

  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    // 获取订单列表
    wx.showLoading();
    var that = this;
    that.setData({
      show:1
    })
    var status;

    if (that.data.currentTpye == 0) {
      status = 2;
    }

    if (that.data.currentTpye == 1) {
      status = 0;
    }
    if (that.data.currentTpye == 2) {
      status = 1;
    }

    wx.request({
      url: api + 'order',
      method: 'POST',
      data: {
        user_id: wx.getStorageSync('user_id'),
        status: status
      },
      success: function (res) {
        wx.hideLoading();
       
        if (res.data[0]) {
          that.setData({
            orderList: res.data
          })

          //初始时获取总金额
          let orderList = that.data.orderList;                  // 获取购物车列表
          let total = 0;
          for (let i = 0; i < orderList.length; i++) {         // 循环列表得到每个数据
            if (orderList[i].isSelect) {                   // 判断选中才会计算价格
              total += +orderList[i].money;              // 所有价格加起来
            }
          }
          that.setData({                                // 最后赋值到data中渲染到页面
            orderList: orderList,
            totalPrice: total
          });



        } else {
          that.setData({
            orderList: null,
            show: 0
          })
        }
        
      }
    })
  },
  Topay:function(e){
    
    wx.navigateTo({
      url: 'myorderpay/myorderpay?order_name=课程缴费' + '&order_money=' + e.target.dataset.money + '&order_id_str=' + e.target.dataset.id,
    })
  }






  


})