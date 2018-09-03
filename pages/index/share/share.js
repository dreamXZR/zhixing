var api = getApp().globalData.api;
var servsers = getApp().globalData.servsers;
var path = '';
Page({
  data: {
    imagePath: "",
    canvasHidden: false,
    bgpath:'../../../images/sharepic.jpg'
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      playername: options.playername,
      videoid: options.videoid
    })
    wx.getImageInfo({
      //src:'https://www.567mc.cn/uploads/icon/tu.jpg',
      src: api + "get_match_video_qrcode?videoid=video",
     
      success: function (res) {
        path = res.path;
        that.createNewImg();
      }
    })
    // 页面初始化 options为页面跳转所带来的参数

    //创建初始化图片
  },


  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var ctx = wx.createCanvasContext('mycanvas');
    var imgPath = path;
    var bgImgPath = path;
    var bgpath = that.data.bgpath;
    ctx.drawImage(bgpath, 0, 0, 600, 520);

    ctx.setFillStyle('white')
    ctx.fillRect(0, 520, 600, 280);


    
    ctx.drawImage(imgPath, 410, 610, 160, 160);

    ctx.setFontSize(30)
    ctx.setFillStyle('#6b6c72')
    ctx.fillText('我是' + that.data.playername, 30, 590)

    ctx.setFontSize(30);
    ctx.setFillStyle('#333333')
    ctx.fillText("正在参加线上比赛", 30, 660);
    ctx.fillText('快来一起看看吧', 30, 700);

    ctx.setFontSize(24)
    ctx.fillText('长按扫码查看详情', 30, 770)

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
            if (res.confirm) {
              
            }
            that.hideShareImg()
          }
        })
      }
    })
  }


})