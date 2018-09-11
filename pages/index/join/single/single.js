const app = getApp();
var api=getApp().globalData.api;
var that
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    //项目
    it: [],
    //组别
    array: [],
    //组别名称
    group_name:'请点击选择',
    //报名费
    money:0,
  },
  
  //项目选择
  checkboxChange: function (e) {
    var text = [];
    var id = [];
    

    if(e.detail.value.length!=0){
      for (var i = 0; i < e.detail.value.length; i++) {
        var aaa = e.detail.value[i].split('_');
        text = text.concat(aaa[0])
        id = id.concat(aaa[1])
      }
      wx.request({
        url: api + 'money',
        method: 'POST',
        data: {
          item_str: text.join(','),
        },
        success: function (res) {
          if (res.data) {
            that.setData({
              money: res.data.sum_money,
              item_str: id.join(','),
            })
          }
        }
      })
    }else{
      that.setData({
        money:0,
        item_str:''
      })
    }
  },
 //组别
  bindPickerChange: function (e) {
    var index = e.detail.value;
    var array = that.data.array;
    that.setData({
      group_name: array[index]
    })
    //获得项目列表
    wx.request({
      url: api+'itemList',
      method:'POST',
      data:{
        type:0,
        group_name: array[index],
      },
      success:function(res){
        
        that.setData({
          it: res.data
        })
      }
    })
  },

  playerinfo:function(){
    wx.navigateTo({
      url: '../info/info?idnumber=' + app.globalData.single_enroll[0].id_number + "&status=" + that.data.is_idCard,
    })
  },

  //跳转
  add_number:function(){
    if (!app.globalData.single_enroll[0]){
      wx.navigateTo({
        url: "../info/info?status="+that.data.is_idCard
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '只可添加一人！',
      })
    }
    
  },
  //提交报名
  singleEnroll:function(){
    var data=that.data
    if (!data.single_enroll[0] || data.group_name == '请点击选择' || !data.item_str || data.money==0){
      wx.showToast({
        title: '请填写完整信息',
        icon:'none'
      })
      return false;
    }
    wx.request({
      url: api +'singleEnroll',
      method:'POST',
      data:{
        user_id: wx.getStorageSync('user_id'),
        name: data.single_enroll[0].name,
        id_number: data.single_enroll[0].id_number,
        group: data.group_name,
        item: data.item_str,
        money: data.money,
        match_id:data.match_id
      },
      success:function(res){
          if(res.data.status){
            var enroll_id = res.data.enroll_id;
            wx.showModal({
              title: '提示',
              content: '报名成功，请缴费！',
              success:function(res){
                if(res.confirm){
                  //进行支付
                  wx.request({
                    url: api + 'WxPay',
                    method: "POST",
                    data: {
                      user_id: wx.getStorageSync('user_id'),
                      money: that.data.money,
                      pay_type:2
                    },
                    success: function (res) {

                      wx.requestPayment({
                        'timeStamp': res.data.timeStamp,
                        'nonceStr': res.data.nonceStr,
                        'package': res.data.package,
                        'signType': res.data.signType,
                        'paySign': res.data.paySign,
                        fail: function (aaa) {
                          wx.showToast({ title: '支付失败'})
                        },
                        success: function () {
                          wx.request({
                            url: api+'enrollSubmit',
                            method:'POST',
                            data:{
                              enroll_id:enroll_id,
                              type:1
                            },
                            success:function(res){
                              wx.showToast({
                                  title: '支付成功',
                                  success: function(){
                                    setTimeout(function(){
                                      wx.navigateBack({})
                                    },2000)
                                  }
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                }
                
              }
            })
          }else{
            wx.showModal({
              title: '提示',
              content:res.data.message,
            })
          }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    //组别的加载
    wx.request({
      url: api + 'groupList',
      success: function (res) {
        var data = res.data;
        var arr = new Array();
        for (var i = 0; i < data.length; i++) {
          arr[i] = data[i].group_name;
        }
        that.setData({
          array: arr
        })
      }
    })
  },
  onShow:function(){
    that.setData({
      single_enroll: app.globalData.single_enroll
    })
    wx.request({
      url: api + 'enrollInfo',
      success: function (res) {
        that.setData({
          match_id: res.data.id,
          is_idCard:res.data.is_idCard
        })
      }
    })
  },
  
  //分享
  onShareAppMessage: function () {
    return {
      title: '比赛报名页',
      path: 'pages/index/join/single/single'

    }
  }

  
  
})