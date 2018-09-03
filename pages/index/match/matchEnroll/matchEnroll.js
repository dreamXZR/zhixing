var form_data;
var api=getApp().globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:'',
    items: [
        { name: 0, value: '男', checked: 'true' },
        { name: 1, value: '女' },

      ],
    //性别
    sex: 0,
  },
  //性别
  radioChange: function (e) {

    var that = this;
    that.data.sex = e.detail.value;
  },
  //获取视频按钮
  bindButtonTap: function () {
    var that = this
    wx.chooseVideo({
      sourceType: ['camera'],
      maxDuration: that.data.seconds,
      camera: 'back',
      success: function (res) {
        if (res.duration > that.data.seconds){
          wx.showModal({
            title: '提示',
            content: '请上传规定时间内视频',
          })
        }else{
          that.setData({
            src: res.tempFilePath,
            duration: res.duration
          })
        }
        
        
        
      }
    })
  },
 
  onTapVideo: function (event) {

    var url = event.currentTarget.dataset.url;
    var id= event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../video/video?id='+id+'&url='+url,
    })
  },
  //上传
  //POST  
  formSubmit: function (e) {
    var that = this
    form_data = e.detail.value;
    if (form_data.name == '' || form_data.phone == '' || that.data.src == '' || form_data.wx == '' || form_data.age==''){
      wx.showToast({
        title: '请填写完整信息',
        icon:'none'
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(e.detail.value.phone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    wx.request({
      url: api + 'WxPay',
      method: "POST",
      data: {
        user_id: wx.getStorageSync('user_id'),
        money: that.data.money,
        pay_type:6
      },
      success: function (res) {

        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          fail: function (aaa) {
            wx.showToast({ title: '支付失败' })
          },
          success: function () {
            wx.showLoading({
              title: '正在上传中...',
              mask: true
            })
            var data = form_data
            data.user_id = wx.getStorageSync('user_id')
            data.sex = that.data.sex
            data.match_id = that.data.match_id
            wx.uploadFile({
              url: api + 'onlineEnroll',
              filePath: that.data.src,
              name: 'match_video',
              formData: data,
              success: function (res) {
                var data = JSON.parse(res.data)
                if (data.status) {
                  wx.hideLoading();
                  wx.showModal({
                    title: '上传成功',
                    content: data.message,
                    showCancel: false,
                    success: function () {
                      wx.redirectTo({
                        url: '../../match/match',
                      })
                    }
                  })

                } else {
                  wx.showToast({
                    title: data.message,
                  })

                }

              }
            })
          }
        })
      }
    })
    
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.request({
      url: api + 'onlineMatchInfo',
      success:function(res){
        that.setData({
          seconds: res.data.match_seconds,
          match_id: res.data.id,
          money:res.data.money
        })
      }
    })
  },
  onShareAppMessage: function () {

    return {
      title: '比赛报名页',
      path: 'pages/index/join/single/single'

    }
  }

  
})