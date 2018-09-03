var servsers = getApp().globalData.servsers;
var api=getApp().globalData.api;
Page({

  
  data: {
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
  formSubmit: function (e) {
    var that = this;
    var data = e.detail.value; //获取表单所有input的值    
    data.sex=that.data.sex;
    data.user_id = wx.getStorageSync('user_id');
    data.course_id=that.data.infoid;
    data.money = that.data.infoprice;
    if (data.name=='' || data.old=='' || data.phone==''){
      wx.showToast({
        title: '请填写完整信息',
      })
      return false;
    }
    if (data.old>120){
      wx.showToast({
        title: '请填写正确年龄',
      })
      return false;
    }
    var name_reg = /^[\u4E00-\u9FA5]{2,4}$/;
    if(!name_reg.test(data.name)){
      wx.showToast({
        title: '2-4中文字符！',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(data.phone)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'success',
        duration: 1500
      })
      return false;
    }
    
    wx.request({
      url: api+'courseOrder',
      method:'POST',
      data: data,
      
      success: function (res) {
        if(res.data.status=='success'){
         
          wx.showToast({
            title: '订单生成请支付',
            success:function(){
              setTimeout(function(){
                wx.redirectTo({
                  url: '../../lesson/lessonpay/lessonpay?view_name=' + that.data.infoname + '&view_money=' + that.data.infoprice + '&order_id=' + res.data.order_id + '&course_id='+that.data.infoid
                })
              },1000)
             
            },
            duration: 2000
          });
         
        }else if(res.data.status=='error'){
          wx.showToast({
            title: '订单提交失败',
          })
        }
      }
    })
  },   

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      servsers: servsers
    })
    wx.request({
      url: api+'courseInfo?course_id=' + options.course_id,
      success: function (res) {
        that.setData({
          infoid: res.data.data[0].id,
          infoimg: res.data.data[0].course_img,
          infoname: res.data.data[0].course_name,
          infoprice: res.data.data[0].course_money
        })
       
      }
    })
  },

 
})