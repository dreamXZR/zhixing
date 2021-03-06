var utils = require('../../../utils/util.js');
var app = getApp();
var that
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    vipmonth: ['1', '3', '6', '12'],
    servsers:getApp().globalData.servsers,
    number1: 0,
    disabled1: false,
    disabled2: false,
    money:0,
    user_id: wx.getStorageSync('user_id'),
  },
  
  paylog:function(){
    wx.navigateTo({
      url: '../mypayorder/mypayorder?type=1'
    })
  },
  thisVal: function (e) {  // 点击价格获取当前的价格
    that.setData({
      state: e.currentTarget.dataset.key,
      money: e.currentTarget.dataset.money,
      month: e.currentTarget.dataset.month,
    });
  
    
  },

  onTapBuy:function(){
    if (that.data.money==0){
      wx.showToast({
        title: '请选择会员时间',
        icon:'none'
      });
      return false;
    }
    wx.showModal({
      content: '是否购买会员',
      success:function(res){
        if(res.confirm){
          utils.authRequest('member_orders', 'POST', { month: that.data.month, money: that.data.money}).then(data=>{
            if(data.status){
              wx.navigateTo({
                url: '../vip/vippay/vippay?money=' + that.data.money + '&num=' + that.data.month+'&order_id='+data.order_id
              })
            }
          })
        }
      }
    })
   
  },

  onLoad: function (options) {
    that=this
    this.setData({
      userInfo: app.globalData.userInfo
    })
    

  },
  onShow:function(){
    utils.authRequest('member','POST',{}).then(data=>{
      that.setData({
        info:data,
        vipmoney:data.member
      })
    })
    
  },
  shared: function () {
    
    var that = this;
    var user_id = wx.getStorageSync('user_id');
    wx.getImageInfo({
      src: "https://www.567mc.cn/api/get_qrcode?user_id=" + wx.getStorageSync('user_id'),
      
      success: function (res) {
        that.setData({
          
          path: res.path,
          showshare: true
        })
        that.createNewImg();
      }
    })
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg:function(){
    var that = this;
    var ctx = wx.createCanvasContext('mycanvas');
    var bgpath = that.data.path;
    ctx.setFillStyle('white')
    ctx.fillRect(0, 520, 600, 280);
    ctx.drawImage(bgpath, 0, 0, 600, 600);
    ctx.setFontSize(30);
    ctx.setFillStyle('#6b6c72');
    ctx.fillText('识别二维码，免费领取VIP会员', 100, 650);
    ctx.fillText('观看更多健美操精彩内容', 130, 700);
    //绘制图片
    ctx.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 600,
        height: 800,
        destWidth: 600,
        destHeight: 800,
        canvasId: 'mycanvas',

        success: function (res) {
          var tempFilePath = res.tempFilePath;

          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },
  save: function () {
    //4. 当用户点击分享到朋友圈时，将图片保存到相册
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          title: '存图成功',
          content: '图片成功保存到相册了，去发圈噻~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function (res) {
            that.setData({
              showshare: false
            })
            if (res.confirm) {

            }
            that.hideShareImg()
          }
        })
      }
    })
  },
 
})