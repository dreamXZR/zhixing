var app = getApp();
var api = getApp().globalData.api;

Page({
  /** 
   * 页面的初始数据
   */
  data: {
    

    userInfo: {},
    hasUserInfo: false,
    getUserInfoFail: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    items: [
      {
        icon: app.globalData.servsers+'mine/ok.png',
        text: '线上比赛',
        path: 'mymatch/mymatch'
      },
      {
        icon: app.globalData.servsers + 'mine/ok.png',
        text: '线下比赛',
        path: '/pages/join/join'
      },
      {
        icon: app.globalData.servsers +'mine/clock.png',
        text: '音乐订单',
        path: 'music-order/music-order'
      },
      {
        icon: app.globalData.servsers + 'mine/Fingerprint.png',
        text: '视频订单',
        path: 'video-order/video-order'
      },
    
     
    ],
    settings: [
      {
        icon: app.globalData.servsers +'mine/vip.png',
        text: '会员',
        path: 'vip/vip'
      },
      {
        icon: app.globalData.servsers +'mine/yue.png',
        text: '知行币',
        path: 'pay/pay'
      },
      // {
      //   icon: app.globalData.servsers +'mine/order.png',
      //   text: '订单',
      //   path: 'myorder/myorder'
      // },
    ]
  },
  
  
  navigateTo: function (e) {
    
    const index = e.currentTarget.dataset.index;
    const path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: path
    });
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    if (app.globalData.userInfo) {
      
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            openid: res.userInfo.openId,
            hasUserInfo: true
          })
        }
      })
    }

  },
 
})