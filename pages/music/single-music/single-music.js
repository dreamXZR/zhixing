var api = getApp().globalData.api;
var servsers = getApp().globalData.servsers;
var that
Page({


  data: {
   
    author: '知行体育',
  },
  onLoad: function (options) {
    that=this;
    that.setData({
      servsers: servsers,
    })
  //获取url
  wx.request({
    url: api + 'musics/' + options.id,
    success: function (res) {
      that.setData({
        music: res.data
      });

    }
  })
    
  },
  //邮箱发送
  formSubmit: function (e){
    var form_data = e.detail.value;
    var email_reg = /(\S)+[@]{1}(\S)+[.]{1}(\w)+/;
    if (!email_reg.test(form_data.email)) {
      wx.showToast({
        title: '邮箱格式错误',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    wx.navigateTo({
      url: '../musicpay/musicpay?view_id=' + that.data.music.id + '&email=' + form_data.email+'&view_money='+that.data.music.money,
    })
    
  },
 

  
})