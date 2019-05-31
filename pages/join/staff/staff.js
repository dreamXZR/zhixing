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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that.staffList(1)
    that.staffList(2)
    
  },
  staffList:function(staff_type){
    wx.request({
      url: api + 'staff',
      data: {
        unit_id: wx.getStorageSync('unit_id'),
        type: staff_type
      },
      success: function (res) {
        if (staff_type==1){
          that.setData({
            coach: res.data.data ? res.data.data : []
          })
        } else if (staff_type == 2){
          that.setData({
            leader: res.data.data ? res.data.data : []
          })
        }
        
      }
    })
  },
  staff_add:function(){
    wx.navigateTo({
      url: '../staff-info/staff-info',
    })
  },
  staff_delete:function(e){
    wx.showModal({
      title: '提示',
      content: '是否删除该人员？',
      success: function (res){
        
        if (res.confirm){
          wx.request({
            url: api +'staff',
            method:'DELETE',
            data:{
              staff_id: e.currentTarget.dataset.id
            },
            success:function(res){
              if(res.data.status){
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                  success:function(){
                    that.onShow()
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
  staff_edit:function(e){
    wx.navigateTo({
      url: '../staff-info/staff-info?staff_id='+e.currentTarget.dataset.id,
    })
  },
  

})