var utils = require('../../../../utils/util.js');
var form_data;
var api=getApp().globalData.api;
var that
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
    that.data.sex = e.detail.value;
  },
  //获取视频按钮
  bindButtonTap: function () {
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
  //上传 
  formSubmit: function (e) {
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
    if(that.data.money=='0.00'){
      that.uploadVideo(form_data)
      return false
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
            that.uploadVideo(form_data)
          }
        })
      }
    })
    
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this
    utils.request('onlineMatchInfo','GET',{}).then(data=>{
      that.setData({
        seconds: data.match_seconds,
        match_id:data.id,
        money:data.money
      })
    })
  },
  //上传视频
  uploadVideo: function (form_data){
    wx.showLoading({
      title: '正在上传中...',
      mask: true
    })
    var params = form_data
    params.sex = that.data.sex
    params.match_id = that.data.match_id
    utils.uploadFile('onlineEnroll', that.data.src, 'match_video', params).then(data=>{
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
    })
 
  }
  

  
})