var api = getApp().globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  sign:function(e){
    var form_data=e.detail.value
    if (form_data.email == '' || form_data.password == '' || form_data.name == '' || form_data.area == '' || form_data.contact == '' || form_data.contact_phone == ''){
        wx.showToast({
          title: '请填写完整信息',
          icon:'none'
        })
    }else{
      var email_reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (!email_reg.test(form_data.email)){
        wx.showToast({
          title: '邮箱错误',
          icon: 'none',
        })
        return false;
      }
      var password_reg =/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
      if (!password_reg.test(form_data.password)) {
        wx.showToast({
          title: '密码请输入6-12位，由数字，字母组成',
          icon: 'none',
        })
        return false;
      }
      var phone_reg =/^1(3|4|5|7|8)\d{9}$/;
      if (!phone_reg.test(form_data.contact_phone)) {
        wx.showToast({
          title: '电话填写错误',
          icon: 'none',
        })
        return false;
      }
      wx.request({
        url: api +'unitCreate',
        method:'POST',
        data:form_data,
        
        success:function(res){
          if(res.data.status){
            wx.showToast({
              title:'注册成功',
              icon: 'none',
              success:function(){
                wx.setStorageSync('unit_id', res.data.unit_id)
                wx.redirectTo({
                  url: '/pages/join/playerList/playerList',
                })
              }
            })
          }else{
            wx.showToast({
              title:res.data.message,
              icon:'none'
            })
          }
        }
      })
    }
    
  }
})