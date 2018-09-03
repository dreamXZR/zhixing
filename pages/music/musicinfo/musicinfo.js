var servsers = getApp().globalData.servsers;
var WxParse = require('../../../wxParse/wxParse.js');
var api=getApp().globalData.api;
const app = getApp();
Page({


  data: {
      collect:1,
  },

  onLoad: function (options) {
    this.setData({
      servsers: servsers,
      view_id:options.id
    })
    if(options.dist_user_id){
      app.globalData.dist={
        dist_user_id: options.dist_user_id,
        view_id: options.id
      }
    }else{
      this.setData({
        dist_user_id:'',
      })
      
    }

    var that = this;
    wx.request({
      url: api+'mvInfo?id=' + options.id,
      method: 'GET',
      
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          infoimg: res.data.data[0].pictures,
          infoname: res.data.data[0].mv_name,
          infoprice: res.data.data[0].mv_money,
          infotype: res.data.data[0].mv_type,
          url: res.data.data[0].mv_url
        })
        
        var mv_about = res.data.data[0].mv_about;
        WxParse.wxParse('mv_about', 'html', mv_about, that, 5);
      }
    })
    wx.request({
      url:api+'mvIsCollect',
      method:'POST',
      data:{
         user_id: wx.getStorageSync('user_id'),
          view_id: that.data.view_id
      },
      success:function(res){
        if(res.data=='success'){
          that.setData({
            collect:2
          })
        }else if(res.data=='error'){
          that.setData({
            collect:1
          })
        }
      }
    })
    
  },
  onTapView:function(){
    if (!wx.getStorageSync('user_id')) {
      wx.navigateTo({
        url: '../../login/login',
      })
      return false;
    }
    var that=this;
    wx.request({
      url: api +'mvView',
      method:'POST',
      data:{
        user_id: wx.getStorageSync('user_id'),
        view_id:that.data.view_id,
        mv_type:that.data.infotype,
      },
      success:function(res){
       
        if(res.data.status==1){
          wx.navigateTo({
            url: '../../music/musicvideo/musicvideo?video_id=' + that.data.view_id,
          })
          
          
        } else if (res.data.status == 2){
          wx.showToast({
            title:res.data.message
          })
        } else if (res.data.status == 3){
          wx.showModal({
            title:'提示',
            content:res.data.message,
            success:function(res){
              if(res.confirm){
                that.onTapBuy();
              }
              
            }
          })
        } else if (res.data.status == 4){
          wx.showToast({
            title: res.data.message,
            success:function(){
              setTimeout(function(){
                wx.navigateTo({
                  url: '../../mine/myorder/myorder',
                })
              },1000);
            }
          })
        }
      }
    })
  },
  onTapBuy:function(){

    var that= this;
    wx.request({
      url: api+'IsMember',
      method:'POST',
      data:{
        user_id: wx.getStorageSync('user_id'),
      },
      success:function(res){
        if (res.data.status == 1) {
          var view_name= that.data.infoname;
          var view_money = that.data.infoprice;
          var view_id = that.data.view_id;
          wx.request({
            url: api +'mvOrder',
            method: 'POST',
            data:{
              user_id:wx.getStorageSync('user_id'),
              video_id: view_id,
              money: view_money
            },
            success: function (res) {
              if (res.data.status == 'success') {
                wx.showToast({
                  title: '订单生成请支付',
                  success: function () {
                    setTimeout(function () {
                      wx.redirectTo({
                        url: '../musicpay/musicpay?view_name=' + view_name + '&view_money=' + view_money + '&view_id=' + view_id+'&order_id=' + res.data.order_id
                      })
                    }, 1000)

                  },
                  duration: 2000
                });
              } else if (res.data.status == 'error') {
                wx.showToast({
                  title: '订单提交失败',
                })
              }
            }
          })
          
        } else if (res.data.status == 2) {
          wx.showToast({
            title: res.data.message
          })
        }
      }
    })
  },
  onCollect:function(){
    if (!wx.getStorageSync('user_id')) {
      wx.navigateTo({
        url: '../../login/login',
      })
      return false;
    }
    var that=this;
    var collect=that.data.collect;
    wx.request({
      url: api + 'mvCollect',
      method:'POST',
      data:{
        user_id: wx.getStorageSync('user_id'),
        view_id: that.data.view_id
      },
      success:function(res){
        if (collect==1){
        if(res.data=='success'){
          wx.showToast({ title: '收藏成功' })
          that.setData({
            collect: 2
          })
          
        } else if (res.data == 'error'){
          wx.showToast({ title: '收藏失败' })
          that.setData({
            collect: 1
          })
        }
        }else{
          wx.request({
            url: api + 'mvCancel',
            method: 'POST',
            data: {
              user_id: wx.getStorageSync('user_id'),
              view_id: that.data.view_id
            },
            success: function (res) {
              wx.showToast({ title: '取消收藏' })
              that.setData({
                collect: 1
              })
            }
          })
     
        }


      }
    })
  },
  //分享
  onShareAppMessage: function () {
    var that=this;
    
    return {
      title: '视频教程分享',
      path: 'pages/music/musicinfo/musicinfo?id=' + that.data.view_id + '&dist_user_id=' + wx.getStorageSync('user_id'),
    }
  }


})