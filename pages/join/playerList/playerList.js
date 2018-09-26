var api = getApp().globalData.api;
var that;
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
    that=this
    wx.request({
      url: api + 'enrollInfo',
      success: function (res) {
        var timestamp = Date.parse(new Date()) / 1000
        var is_enroll = 0
        if (res.data.start_time_str < timestamp && res.data.end_time_str > timestamp) {
          is_enroll = 1
        }
        that.setData({
          match_title: res.data.match_title,
          start_time: res.data.start_time,
          end_time: res.data.end_time,
          is_enroll: is_enroll,
          match_id:res.data.id

        })
      }
    })
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
    that.players()
  },
  players:function(){
    wx.request({
      url: api + 'players',
      data: {
        unit_id: wx.getStorageSync('unit_id')
      },
      success: function (res) {
        that.setData({
          players: res.data
        })

      }
    })
  },
  player_add:function(){
    wx.navigateTo({
      url: '/pages/join/info/info',
    })
  },
  player_delete:function(e){
    wx.showModal({
      title: '提示',
      content: '是否删除该运动员？',
      success: function (res){
        if (res.confirm){
          wx.request({
            url: api +'playerDelete',
            method:'POST',
            data:{
              player_id: e.currentTarget.dataset.id
            },
            success:function(res){
              if(res.data.status){
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                  success:function(){
                    that.players()
                  }
                })
                
              }else{
                wx.showToast({
                  title:res.data.message,
                  icon: 'none',
                })
              }
            }
          })   
        }
      }
      
    })
  },
  player_edit:function(e){
    wx.navigateTo({
      url: '/pages/join/info/info?player_id='+e.currentTarget.dataset.id,
    })
  },
  enroll:function(){
    if(that.data.is_enroll == 0){
      wx.showToast({
        title: '报名时间已过',
        icon: 'none'
      })
    }else{
      wx.navigateTo({
        url: '../single/single?match_id='+that.data.match_id,
      })
    }
   
  },
  enrollList:function(){
    wx.navigateTo({
      url: '../enrollList/enrollList',
    })
  }

})