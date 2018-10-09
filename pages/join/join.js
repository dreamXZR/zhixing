var that
var api = getApp().globalData.api;
Page({
  data:{
    statusType:['登陆','注册'],
    currentTpye:0,
    region: [],
    hiddenmodalput: true,
    
  },
  onLoad:function(){
    that=this
    that.setData({
        email: wx.getStorageSync('email') ? wx.getStorageSync('email') : ''
    })
  },
  onTap:function(options){
    wx.navigateTo({
      url: '../regulation/regulation'
    })
  },
  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    that.setData({
      currentTpye: curType
    });
  },
  login: function (e) {
    var form_data = e.detail.value
    wx.request({
      url: api + 'login',
      method: 'POST',
      data: form_data,
      success: function (res) {
        if (res.data.status) {
          wx.setStorageSync('unit_id', res.data.unit_id)
          wx.setStorageSync('email', form_data.email)
          wx.redirectTo({
            url: './regulation/regulation',
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }

      }
    })
  },
  sign: function (e) {
    var form_data = e.detail.value
    if (form_data.email == '' || form_data.password == '' || form_data.name == '' || form_data.area == '' || form_data.contact == '' || form_data.contact_phone == '') {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
    } else {
      var email_reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (!email_reg.test(form_data.email)) {
        wx.showToast({
          title: '邮箱错误',
          icon: 'none',
        })
        return false;
      }
      var password_reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
      if (!password_reg.test(form_data.password)) {
        wx.showToast({
          title: '密码请输入6-12位，由数字，字母组成',
          icon: 'none',
        })
        return false;
      }
      var phone_reg = /^1(3|4|5|7|8)\d{9}$/;
      if (!phone_reg.test(form_data.contact_phone)) {
        wx.showToast({
          title: '电话填写错误',
          icon: 'none',
        })
        return false;
      }
      form_data.area = that.data.region.join('-')
      wx.request({
        url: api + 'unitCreate',
        method: 'POST',
        data: form_data,

        success: function (res) {
          if (res.data.status) {
            wx.showToast({
              title: '注册成功',
              icon: 'none',
              success: function () {
                wx.setStorageSync('unit_id', res.data.unit_id)
                wx.setStorageSync('email', form_data.email)
                wx.redirectTo({
                  url: './regulation/regulation',
                })
              }
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        }
      })
    }

  },
  bindRegionChange:function(e){
    that.setData({
      region: e.detail.value
    })
  },
  modalinput:function(){
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认
  confirm: function () {
    var email_reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    if (!email_reg.test(that.data.inpval)) {
      wx.showToast({
        title: '邮箱错误',
        icon: 'none',
      })
      return false;
    }
    wx.request({
      url: api+'forgetPassword',
      method:'POST',
      data:{
        email: that.data.inpval
      },
      success:function(res){
        if(res.data.status){
          wx.showToast({
            title: res.data.message ,
          })
        }else{
          that.setData({
            hiddenmodalput: true
          })
          wx.showToast({
            title:'邮件发送请查收',
          })
        }
      }
    })
    
  },
  jsInput:function(e){
    that.setData({ inpval: e.detail.value }) 
  }

  
})