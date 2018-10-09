
var servsers = getApp().globalData.servsers
var api = getApp().globalData.api
var that


Page({
	/**
   * 页面的初始数据
   */
  data: {
  	
    //性别
    sex:0,
    //性别
    items: [
      { name: 0, value: '男', checked: 'true'},
      { name: 1, value: '女', checked: ''},
      
    ],
    //类型
    staff_type:1,
    type:[
      { name: 1, value: '教练', checked: 'true' },
      { name: 2, value: '领队', checked: '' },
    ]
  }, 
  //通过身份证获得相关信息
  getInfo: function (userNameid){
    wx.request({
      url: api + 'staffInfo',
      data: {
        staff_id: userNameid
      },
      success: function (res) {
        if (!res.data.status) {
          wx.showToast({
            title: res.data.message,
            icon:'none'
          })
        } else {
          that.setData({
            info: res.data.message,
          });
          if (res.data.message.sex == '女') {
            that.setData({
              items: [
                { name: 0, value: '男', checked: '' },
                { name: 1, value: '女', checked: 'true' },
              ],
              sex: 1,
            })
          }
          if (res.data.message.type==2){
            that.setData({
              type: [
                { name: 1, value: '教练', checked: '' },
                { name: 2, value: '领队', checked: 'true' },
              ],
              staff_type: 2,
            })
          }
        }
      }
    })
  },
  //性别
  radioChange: function (e) {
    that.data.sex = e.detail.value;
   
  },
  //类型
  typeChange:function(e){
    that.data.staff_type = e.detail.value;
  },
  

  //上传
  //POST  
  formSubmit: function (e) {
    var form_data = e.detail.value;
    if (form_data.name != '' && form_data.phone != '') {
      var name_reg = /^[\u4E00-\u9FA5]{2,4}$/;
      if (!name_reg.test(form_data.name)) {
        wx.showToast({
          title: '姓名2-4中文字符！',
          icon: 'none',
        })
        return false;
      }
      form_data.sex=that.data.sex
      form_data.type=that.data.staff_type
      form_data.unit_id=wx.getStorageSync('unit_id')
      wx.request({
        url: api + 'staffAdd',
        method: "POST",
        data: form_data,
        success: function (res) {
          if (res.data.status) {
            wx.showModal({
              title: '提示',
              content: '提交成功!',
              showCancel: false,
              success: function (res) {
                wx.navigateBack({
                })

              }
            })
          } else {
            wx.showToast({
              title: res.data.message,
              success: function () {
                setTimeout(function () {
                  wx.navigateBack({})
                }, 2000)
              }
            })
          }


        }
      })
    }else{
      wx.showToast({
        title: '请填写完整信息..',
        icon: 'none',
      })
    }  
      
  },
  
  onLoad: function (options) {
    that=this;
    that.setData({
      servsers: servsers,    //图片链接      
      idnumber: options.staff_id ? options.staff_id : '', //是否存在身份证号
    })
    if (options.staff_id){
      that.getInfo(options.staff_id)
    }
    
  }
  
})