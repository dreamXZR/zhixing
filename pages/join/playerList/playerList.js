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
          players: res.data.data
        })

      }
    })
  },
  player_add:function(){
    wx.navigateTo({
      url: '../info/info',
    })
  },
  player_delete:function(e){
    wx.showModal({
      title: '提示',
      content: '是否删除该运动员？',
      success: function (res){
        if (res.confirm){
          wx.request({
            url: api + 'players/' + e.currentTarget.dataset.id,
            method:'delete',
            
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
  

})