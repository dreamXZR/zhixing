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
    group_name: '请点击选择',
    //报名费
    money: 0,

  },
// 项目选择
checkboxChange: function(e){
  var text = [];
  var id = [];
  if (e.detail.value.length != 0) {
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
  } else {
    that.setData({
      money: 0,
      item_str: ''
    })
  }
},


// 组别
  bindPickerChange:function(e){
    var index=e.detail.value;
    var array=this.data.array;
    var that=this;
    that.setData({
      group_name:array[index]
    })

    //获取项目列表
    wx.request({
      url: api+'itemList',
      method:'POST',
      data:{
        type:1,
        group_name:array[index]
      },
      success:function(res){
        that.setData({
            it:res.data
        })
      }
    })
},
playerinfo: function (e) {
    wx.navigateTo({
      url: '../info/info?idnumber=' + e.currentTarget.dataset.idnumber + "&status=" + that.data.is_idCard,
    })
  },

// 添加成员
add_number:function(){
  wx.navigateTo({
      url: "../info/info?status=" + that.data.is_idCard,
    })
},


  //提交报名
  teamEnroll: function () {
    if (!that.data.team_enroll[0]) {
      wx.showToast({
        title: '请添加报名成员',
      })
      return false;
    }
    if (that.data.group_name == '请点击选择' || !that.data.item_str || that.data.money == 0) {
      wx.showToast({
        title: '请填写完整信息',
      })
      return false;
    }
    var team_enroll_info = that.data.team_enroll;
    var str;
    var arr = new Array();
    for (var j = 0; j < team_enroll_info.length; j++) {
      arr.push(team_enroll_info[j].id_number);

    }
    str = arr.join(',');
    wx.request({
      url: api + 'teamEnroll',
      method: 'POST',
      data: {
        user_id: wx.getStorageSync('user_id'),
        id_number_str: str,
        group: that.data.group_name,
        item: that.data.item_str,
        money: that.data.money,
        match_id: that.data.match_id

      },
      success: function (res) {
        if (res.data.status) {
          var enroll_id = res.data.enroll_id;
          wx.showModal({
            title: '提示',
            content: '报名成功，请缴费！',
            success: function (res) {
              if (res.confirm) {
                //进行支付
                wx.request({
                  url: api + 'WxPay',
                  method: "POST",
                  data: {
                    user_id: wx.getStorageSync('user_id'),
                    money: that.data.money,
                    pay_type: 2
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
                        wx.request({
                          url: api + 'enrollSubmit',
                          method: 'POST',
                          data: {
                            enroll_id: enroll_id,
                            type: 2
                          },
                          success: function (res) {
                            wx.showToast({
                              title: '支付成功',
                              success: function () {
                                setTimeout(function () {
                                  wx.navigateBack({})
                                }, 2000)
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
        } else {
          wx.showModal({
            title: '提示',
            content: '报名失败，请重新提交！',
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this
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
      team_enroll: app.globalData.single_enroll
    })
    wx.request({
      url: api + 'enrollInfo',
      success: function (res) {
        that.setData({
          match_id: res.data.id,
          is_idCard: res.data.is_idCard
        })
      }
    })
  },
  onShareAppMessage: function () {

    return {
      title: '比赛报名页',
      path: 'pages/index/join/team/team'

    }
  }
  
})