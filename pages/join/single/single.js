var utils = require('../../../utils/util.js');
var api = getApp().globalData.api;
var that
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    
    project: [],
    project_name: '请点击选择',
    project_id:0,
    group: [],
    group_name:'请点击选择',
    group_id:0,

    player_status: 0,
    players:[],
    select_players:[],
    selected_players:[],
    
    leader:[],
    select_leader:[],
    coach:[],
    select_coach:[],
    //报名费
    money:0,
    num_max:0,
    num_min:0
  },
  
  
 //组别
  groupChange: function (e) {
    var index = e.detail.value;
    var array = that.data.group;
    that.setData({
      group_name: array[index].name,
      group_id: array[index].id,
      selected_players:[],
      select_players:[]
    })
    that.matchPlayer()
  },
  //项目
  projectChange:function(e){
    var index = e.detail.value;
    var array = that.data.project;
    that.setData({
      project_name: array[index].name,
      project_id: array[index].id,
      selected_players: [],
      select_players: []
    })
    that.matchPlayer()
  },
  //获得适合运动员
  matchPlayer:function(){
    var param={
      group_id: that.data.group_id,
      project_id: that.data.project_id,
      unit_id: wx.getStorageSync('unit_id'),
      match_id: that.data.match_id
    }
    utils.request('matchPlayer','POST',param).then(data=>{
      that.setData({
        players: data.players,
        num_max: data.num_max,
        num_min: data.num_min
      })
    })
  },
  //选择运动员
  selectPlayer:function(e){
    if(!that.data.num_max){
      wx.showToast({
        title: '请先选择项目',
        icon:'none'
      })
      return false
    }
    
     
      var arr = new Array()
      
      for (var i = 0; i < e.detail.value.length; i++) {
        arr.push(that.data.players[e.detail.value[i]])
        
      }
      that.setData({
        select_players: arr,
        
      })
  },
  player_enroll:function(){
    var data=that.data
    if (data.select_players.length > data.num_max) {
      wx.showToast({
        title: '报名人数超过上限',
        icon: 'none'
      })
      return false;
    }
    if (data.select_players.length < data.num_max) {
      wx.showToast({
        title: '报名人数少于下限',
        icon: 'none'
      })
      return false;
    }
    wx.request({
      url: api + 'enrollMoney',
      data: {
        player_num: data.select_players.length
      },
      success: function (res) {
        var id_arr = new Array()
        for (var i = 0; i < data.select_players.length; i++) {
          id_arr.push(data.select_players[i].id)
        }
        that.setData({
          money: res.data.enroll_money,
          player_status: 1,
          selected_players:data.select_players,
          player_ids: id_arr.join(',')
        })
      }
    })
  },
  selectLeader: function (e){
    if (e.detail.value.length>1){
      wx.showToast({
        title: '领队只可选1人',
        icon:'none'
      })
      return false
    }
    var arr = new Array()
    for (var i = 0; i < e.detail.value.length; i++) {
      arr.push(that.data.leader[e.detail.value[i]])
    }
    that.setData({
      select_leader: arr ,
    })
    
  },
  selectCoach:function(e){
    var arr = new Array()
    for (var i = 0; i < e.detail.value.length; i++) {
      arr.push(that.data.coach[e.detail.value[i]])
    }
    that.setData({
      select_coach: arr,
    })
    
  },
  
  
  //提交报名
  enroll:function(){
    var data=that.data
    if (data.group_name == '请点击选择' || data.project_name == '请点击选择' || data.selected_players.length==0 || data.select_leader.length==0 || data.select_coach.length==0){
      wx.showToast({
        title: '请填写完整信息',
        icon:'none'
      })
      return false;
      
    }
    var enroll_params={
      unit_id: wx.getStorageSync('unit_id'),
      match_id: data.match_id,
      player_ids: data.player_ids,
      group_id: data.group_id,
      project_id: data.project_id,
      coach: JSON.stringify(data.select_coach),
      leader: JSON.stringify(data.select_leader),
      money: data.money,
    }
    utils.request('enroll', 'POST', enroll_params).then(values=>{
      if (values.status) {
        var enroll_id = values.enroll_id
        if (data.money == '0.00') {
          that.enrollSubmit(enroll_id)
        }else{
          wx.showModal({
            title: '提示',
            content: '报名成功，请缴费！',
            success: function (res) {
              if (res.confirm) {
                utils.authRequest('WxPay', 'POST', {money:that.data.money,pay_type: 2}).then(result=>{
                  wx.requestPayment({
                    'timeStamp': result.timeStamp,
                    'nonceStr': result.nonceStr,
                    'package': result.package,
                    'signType': result.signType,
                    'paySign': result.paySign,
                    fail: function (res) {
                      wx.showToast({ title: '支付失败' })
                      wx.redirectTo({
                        url: '/pages/join/enrollList/enrollList',
                      })
                    },
                    success: function () {
                      that.enrollSubmit(enroll_id)
                    }
                  })
                })
              }else{
                wx.redirectTo({
                  url: '/pages/join/enrollList/enrollList',
                })
              }
            }
          })
        }
      } else {
        wx.showModal({
          title: '提示',
          content: values.message,
        })
      }
    })
  },
  enrollSubmit: function (enroll_id){
    utils.request('enrollSubmit','POST',{enroll_id:enroll_id}).then(data=>{
      wx.showToast({
        title: '报名成功',
        success: function () {
          setTimeout(function () {
            wx.navigateBack({})
          }, 2000)
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    //组别的加载
    utils.request('groupList','GET',{}).then(data=>{
      that.setData({
        group: data,
        match_id: options.match_id
      })
    })
    //项目加载
    utils.request('projectList','GET',{}).then(data=>{
      that.setData({
        project:data
      })
    })
    //教练加载
    that.staffList(1)
    //领队加载
    that.staffList(2)
  },
  onShow:function(){
    
    
  },
  staffList: function (staff_type) {
    wx.request({
      url: api + 'staffList',
      data: {
        unit_id: wx.getStorageSync('unit_id'),
        type: staff_type
      },
      success: function (res) {
        if (staff_type == 1) {
          that.setData({
            coach: res.data.staff ? res.data.staff : []
          })
        } else if (staff_type == 2) {
          that.setData({
            leader: res.data.staff ? res.data.staff : []
          })
        }

      }
    })
  },

  
  
})