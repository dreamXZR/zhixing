var servsers = getApp().globalData.servsers;
var api=getApp().globalData.api;
var app = getApp();
//滑动参数
var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
var flag_hd = true;
var that
Page({

   
  data: {
    talks: [],
    videourl:null,
    giftList:[],
    inputvalue:null,
    imagePath: "",
    canvasHidden: false,
    bgpath: '/images/sharepic.jpg',
    showshare:false
  },

  //动画
  chooseSezi: function (e) {
    
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在x轴偏移，然后用step()完成一个动画
    animation.translateX(150).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
    })
      // 改变view里面的Wx：if
      var first
      if(that.data.first==2){
        that.setData({
          chooseSize: false
        })
      }else{
        that.setData({
          chooseSize: true
        })
        // 设置setTimeout来改变x轴偏移量，实现有感觉的滑动
        clearTimeout(dingshi)
        var dingshi=setTimeout(function () {
          animation.translateX(80).step()
          animation.translateX(150).step()
          animation.translateX(80).step()
          animation.translateX(150).step()
          animation.translateX(80).step()
          animation.translateX(120).step()
          that.setData({
            animationData: animation.export()
          })
        }, 2000)

        setTimeout(function () {
          that.setData({
            chooseSize: false
          })
        }, 6000)
      }
  },




  // 触摸开始事件
  handletouchtart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸结束事件
  handletouchend: function (e) {
    var touchMove = e.changedTouches[0].pageX;
  
    // 向左滑动   
    if (touchMove - touchDot <= -100 && time < 10 && flag_hd == true) {
      flag_hd = false;
      //执行切换页面的方法
      this.videoChange();
    }
    // 向右滑动   
    if (touchMove - touchDot >= 100 && time < 10 && flag_hd == true) {
      flag_hd = false;
      //执行切换页面的方法
      wx.navigateBack({});
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
  // 提交评论
  formSubmit: function(e){
    if (!wx.getStorageSync('user_id')) {
      wx.navigateTo({
        url: '../../login/login',
      })
      return false;
    }
    wx.request({
      url: api + 'commentSubmit',
      method: 'POST',
      data:{
        video_id:that.data.videoid,
        user_id: wx.getStorageSync('user_id'),
        comment: e.detail.value
      },
      success: function (res) {
        if(res.data.status){
          wx.showToast({
            'title': res.data.message,
            success:function(){
              that.setData({
                inputvalue: ''
              });
              that.commentList()
            }
          })
        } else{
          wx.showToast({
            'title': res.data.message,
            success:function(){
              that.setData({
                inputvalue: ''
              });
            }
          })
        }
        
      }
    })

  },

  shared:function(){
   
    wx.getImageInfo({
      
      src: api + "get_match_video_qrcode?videoid="+that.data.videoid,

      success: function (res) {
       
        that.setData({
          path : res.path,
          showshare: true
        })
       
        that.createNewImg();
      }
    })
  },


  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var ctx = wx.createCanvasContext('mycanvas');
    var imgPath = that.data.path;
    var bgImgPath = that.data.path;
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
    ctx.fillText('快为我加油吧！', 30, 700);

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
              showshare:false
            })
            if (res.confirm) {

            }
            that.hideShareImg()
          }
        })
      }
    })
  },

 
  toupiao: function () {
    if (!wx.getStorageSync('user_id')) {
      wx.navigateTo({
        url: '../../login/login',
      })
      return false;
    }
    var videoid = that.data.videoid;
    wx.navigateTo({
      url: '../gift/gift?videoid=' + videoid ,
    })

  }, 

  onLoad: function (options) {
    that=this;
    if (options.scene){
      this.setData({
        servsers: servsers,
        videoid: options.scene
      })
    }else{
      this.setData({
        servsers: servsers,
        videoid: options.videoid
      })
    }
    
    that.setData({
      first: options.first
    })

    var first
    if (that.data.first == 2) {
      that.setData({
        chooseSize: false
      })
    } else {
      clearTimeout(that.data.dingshi)
      this.chooseSezi();
    }
    // 评委评分
    wx.request({
      url: api + 'scoreList',
      method: 'POST',
      data: {
        view_id: that.data.videoid
      },
      success: function (res) {
        that.setData({
          scoreList: res.data
        });
      }
    })
    //谁送的礼物
    wx.request({
      url: api + 'buyInfo',
      method: 'POST',
      data: {
        id:that.data.videoid
      },
      success: function (res) {
        that.setData({
          buygift:res.data
        });
      }
    })
    
},
  /** 
         * 滑动切换tab 
         */
  bindChange: function (e) {
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    that.commentList()
  },
  //评论列表
  commentList:function(){
    wx.request({
      url: api + 'commentList',
      method: 'POST',
      data: {
        video_id: that.data.videoid,
        user_id:wx.getStorageSync('user_id')
      },
      success: function (res) {
        that.setData({
          talks: res.data.match_comments,
          length: res.data.match_comments.length
        })
      }
    })
  },
  onShow: function () {
    //视频信息
    wx.request({
      url: api + 'matchVideoInfo',
      method: 'POST',
      data: {
        video_id: that.data.videoid
      },
      success: function (res) {
        that.setData({
          matchInfo: res.data.zx_match_video,

        });
      }
    })
    flag_hd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
  videoChange:function(){
    wx.request({
        url: api +'changeVideo',
        method:'POST',
        data:{
          video_id: that.data.videoid
        },
        success:function(res){
          wx.redirectTo({
            url: '../video/video?videoid=' + res.data + '&first=' + 2,
            // chooseSize: false
          })
          clearTimeout(that.data.dingshi)
        }
    })
  },

  onShareAppMessage: function () {
    return {
      title: '线上参赛视频',
      path: '/pages/index/video/video?videoid=' + that.data.videoid,

    }
  }

})