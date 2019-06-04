var utils = require('../../../utils/util.js');
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
    inputvalue:"",
    imagePath: "",
    canvasHidden: false,
    bgpath: '/images/sharepic.jpg',
    showshare:false,
    length:0
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
  commentSubmit: function(e){
    
    var params = {
      video_id: that.data.videoid,
      comment: e.detail.value
    }
    utils.authRequest('onlineComments', 'POST', params).then(data=>{
      wx.showToast({
        'title': '评论成功',
      })
      var length = that.data.length + 1
      var talks = that.data.talks
      talks.unshift(data)

      that.setData({
        inputvalue: '',
        length:length,
        talks: talks
      })
      
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

    ctx.setFontSize(40)
    ctx.setFillStyle('#6b6c72')
    ctx.fillText(that.data.matchInfo.name, 30, 590)

    ctx.setFontSize(30);
    ctx.setFillStyle('#333333')
    ctx.fillText("正在参加" + that.data.matchInfo.match_title, 30, 660);
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
    wx.navigateTo({
      url: '../gift/gift?videoid=' + that.data.videoid + '&match_id=' + that.data.match_id,
    })

  }, 

  onLoad: function (options) {
    that=this;
    if (options.scene){
      this.setData({
        servsers: servsers,
        videoid: options.scene,
        first: options.first,
        match_id: options.match_id
      })
    }else{
      this.setData({
        servsers: servsers,
        videoid: options.videoid,
        first: options.first,
        match_id:options.match_id
      })
    }
    if (options.first == 2) {
      that.setData({
        chooseSize: false
      })
    } else {
      clearTimeout(that.data.dingshi)
      this.chooseSezi();
    }
    
    
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
    utils.authRequest('onlineComments', 'GET', { video_id:that.data.videoid}).then(data=>{
      that.setData({
        talks: data.data,
        length: data.data.length
      })
    })
  },
  onShow: function () {
    //视频信息
    utils.request('matchVideoInfo', 'GET', { video_id: that.data.videoid}).then(data=>{
      that.setData({
        matchInfo:data,
      });
    })
    // 评委评分
    utils.request('scoreList', 'GET', { match_video_id: that.data.videoid }).then(data => {
      that.setData({
        scoreList: data
      });
    })
    //谁送的礼物
    utils.request('giftList', 'GET', { match_video_id: that.data.videoid }).then(data => {
      that.setData({
        
        giftList: data.data
      });
    })
    flag_hd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
  videoChange:function(){
    var params={
      video_id: that.data.videoid,
    }
    utils.request('changeVideo', 'GET', params).then(data=>{
      wx.redirectTo({
        url: '../video/video?videoid=' + data + '&first=' + 2,
      })
      clearTimeout(that.data.dingshi)
    })
  
  },
  onShareAppMessage: function () {
    return {
      title: '参赛视频',
      path: '/pages/index/video/video?videoid=' + that.data.videoid+'&match_id='+that.data.match_id,

    }
  }

})