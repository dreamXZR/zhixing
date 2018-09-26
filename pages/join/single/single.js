const app = getApp();
var api=getApp().globalData.api;
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

    players:[],
    select_players:[],
    leader_sex:'男',
    coach_sex:'男',
    leader:[],
    coach:[],
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
      group_id: array[index].id
    })
    that.matchPlayer()
  },
  //项目
  projectChange:function(e){
    var index = e.detail.value;
    var array = that.data.project;
    that.setData({
      project_name: array[index].name,
      project_id: array[index].id
    })
    that.matchPlayer()
  },
  //获得适合运动员
  matchPlayer:function(){
    wx.request({
      url: api +'matchPlayer',
      method:'POST',
      data:{
        group_id:that.data.group_id,
        project_id: that.data.project_id
      },
      success:function(res){
        that.setData({
          players:res.data.players,
          num_max:res.data.num_max,
          num_min:res.data.num_min
        })
      }
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
    
      wx.request({
        url: api + 'enrollMoney',
        data: {
          player_num: e.detail.value.length
        },
        success: function (res) {
          that.setData({
            money: res.data.enroll_money
          })
        }
      })
      var arr = new Array()
      var id_arr=new Array()
      console.log(e.detail.value)
      console.log(that.data.players)
      for (var i = 0; i < e.detail.value.length; i++) {
        arr.push(that.data.players[e.detail.value[i]])
        id_arr.push(that.data.players[e.detail.value[i]].id)
      }
      that.setData({
        select_players: arr,
        player_ids:id_arr.join(',')
      })
    
    
  },
  leaderSexChange:function(e){
    that.setData({
      leader_sex:e.detail.value
    })
  },
  coachSexChange:function(e){
    that.setData({
      coach_sex: e.detail.value
    })
  },
  add_leader:function(e){
    var data=e.detail.value
    if (!data.name){
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
      return false
    }
    data.sex=that.data.leader_sex
    var leader=that.data.leader
    
    if(leader.length==1){
      wx.showToast({
        title: '只允许添加一人',
        icon:'none'
      })
    }else{
      leader.push(data)
      that.setData({
        leader:leader
      })
    }
  },
  add_coach:function(e){
    var data = e.detail.value
    if (!data.name) {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
      return false
    }
    data.sex = that.data.coach_sex
    var coach = that.data.coach
    coach.push(data)
    that.setData({
      coach: coach
    })
  },
  del_coach:function(e){
    var index = e.currentTarget.dataset.index
    var coach = that.data.coach
    coach.splice(index, 1);
    that.setData({
      coach: coach
    })
  },
  del_leader:function(){
    that.setData({
      leader:[]
    })
  },
  //提交报名
  enroll:function(){
    var data=that.data
    if (data.group_name == '请点击选择' || data.project_name == '请点击选择' || data.select_players.length==0 || data.leader.length==0 || data.coach.length==0){
      wx.showToast({
        title: '请填写完整信息',
        icon:'none'
      })
      return false;
      
    }
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
      url: api +'enroll',
      method:'POST',
      data:{
        unit_id: wx.getStorageSync('unit_id'),
        match_id:data.match_id,
        player_ids:data.player_ids,
        group_id:data.group_id,
        project_id:data.project_id,
        coach: JSON.stringify(data.coach),
        leader: JSON.stringify(data.leader),
        money: data.money,
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
        that.setData({
          group: res.data,
          match_id:options.match_id
        })
      }
    })
    //项目加载
    wx.request({
      url: api + 'projectList',
      success: function (res) {
        
        that.setData({
          project: res.data
        })
      }
    })
  },
  onShow:function(){
    
    
  },


  
  
})