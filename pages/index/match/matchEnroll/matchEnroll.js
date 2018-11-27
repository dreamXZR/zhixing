var utils = require('../../../../utils/util.js');
var form_data;
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:'',
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
    if (form_data.name == '' || form_data.phone == '' || that.data.src == '' || form_data.wx == '' || form_data.unit_name==''){
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
    form_data.money=that.data.money
    that.uploadVideo(form_data)
    
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
    params.match_id = that.data.match_id
    utils.uploadFile('onlineEnroll', that.data.src, 'match_video', params).then(data=>{
      console.log(data)
      if (data.status) {
        wx.hideLoading();
        wx.showModal({
          title: '上传成功',
          content: data.message,
          showCancel: false,
          success: function () {
            if (form_data.money=='0.00'){
              wx.redirectTo({
                url: '../../match/match',
              })
            }else{
              utils.authRequest('WxPay', 'POST', { order_id: data.order_id, pay_type:6}).then(result=>{
                wx.requestPayment({
                  'timeStamp': result.timeStamp,
                  'nonceStr': result.nonceStr,
                  'package': result.package,
                  'signType': result.signType,
                  'paySign': result.paySign,
                  fail: function (aaa) {
                    wx.showToast({ title: '支付失败' })
                  },
                  success: function () {

                  }
                })
              })
            }
            
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