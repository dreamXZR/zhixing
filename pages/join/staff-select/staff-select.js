var utils = require('../../../utils/util.js');
var api = getApp().globalData.api;
var that
Page({

  data: {
    leader: [],
    select_leader: [],
    coach: [],
    select_coach: [],
  },

  onLoad: function (options) {
    that = this;
    
    utils.request('isStaffEnroll', 'GET',{
      unit_id: wx.getStorageSync('unit_id'),
      match_id: options.match_id,
    }).then(values => {
        if(!values.status){
          wx.showModal({
          title: '提示',
          content: values.message,
          success: function (res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
        }
    })
    
    that.setData({
      match_id: options.match_id
    })
    //教练加载
    that.staffList(1)
    //领队加载
    that.staffList(2)
  },

  staffList: function (staff_type) {
    wx.request({
      url: api + 'staff',
      data: {
        unit_id: wx.getStorageSync('unit_id'),
        type: staff_type
      },
      success: function (res) {
        if (staff_type == 1) {
          that.setData({
            coach: res.data.data
          })
        } else if (staff_type == 2) {
          that.setData({
            leader: res.data.data 
          })
        }

      }
    })
  },
  
  selectLeader: function (e) {
    if (e.detail.value.length > 1) {
      wx.showToast({
        title: '领队最多可选1人',
        icon: 'none'
      })
      return false
    }
    var arr = new Array()
    for (var i = 0; i < e.detail.value.length; i++) {
      arr.push(that.data.leader[e.detail.value[i]])
    }
    that.setData({
      select_leader: arr,
    })

  },
  selectCoach: function (e) {
    if (e.detail.value.length > 2) {
      wx.showToast({
        title: '教练最多可选2人',
        icon: 'none'
      })
      return false
    }
    var arr = new Array()
    for (var i = 0; i < e.detail.value.length; i++) {
      arr.push(that.data.coach[e.detail.value[i]])
    }
    that.setData({
      select_coach: arr,
    })

    

  },

  staff_enroll: function () {
    var data = that.data
    
    if (data.select_leader.length == 0 || data.select_coach.length == 0){
      wx.showToast({
        title: '请选择教练或领队',
        icon: 'none'
      })
      return false;
    }
    var enroll_params ={
      unit_id: wx.getStorageSync('unit_id'),
      match_id: data.match_id,
      coach: JSON.stringify(data.select_coach),
      leader: JSON.stringify(data.select_leader),
    }
    
    utils.request('staffEnroll', 'POST', enroll_params).then(values => {
      if (values.status) {
        wx.showModal({
          title: '提示',
          content: '报名成功',
          success: function (res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }else{
        wx.showModal({
          title: '提示',
          content: values.message,
          success: function (res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
    
  }
})