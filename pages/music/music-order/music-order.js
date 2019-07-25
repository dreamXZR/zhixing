var utils = require('../../../utils/util.js');
var that
Page({
  data: {
    items:[
      { id: 0, value: '网盘链接' ,checked: 'true'},
      { id: 1, value: '自己发送' }
    ],
    select:0,
    is_send:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      type:options.type,
      music_id: options.music_id ? options.music_id:'',
      music_library_id: options.music_library_id ? options.music_library_id:'',
      style_id: options.style_id ? options.style_id : '',
      money: options.money ? options.money : '',
    })
    
    utils.request('musicSet','GET',{}).then(data=>{
      that.setData({
        set:data.music_control
      })
    })
  },
  radioChange:function(e){
    that.setData({
      select:e.detail.value
    })
  },
  formSubmit:function(e){
    var form_data = e.detail.value
    var type=that.data.type
    var select=that.data.select
    if (type == 'style_music' && select==0){
      if (!form_data.wangpan){
        wx.showToast({
          title:'请填写网盘信息',
          icon:'none'
        })
        return false
      }
    }
    if (type == 'style_music' && select == 1){
      if(that.data.is_send==0){
        wx.showToast({
          title: '请勾选确定按钮',
          icon: 'none'
        })
        return false
      }
    }
    
    form_data.music_type = type
    form_data.money=that.data.money
    
    switch (type){
      case 'music':
        form_data.music_id = that.data.music_id
        break;
      case 'style_music':
        form_data.style_id = that.data.style_id
        break;
      case 'music_library':
        form_data.music_library_id = that.data.music_library_id
        form_data.style_id = that.data.style_id
        break;
    }
    
   
    utils.authRequest('music_orders','POST',form_data).then(data=>{
      if (data.order_id){
        wx.showModal({
          title: '提示',
          content: that.data.money == '0.00' ?'已购买成功我们已将您购买的音乐发送至您登记邮箱':data.message,
          showCancel:false,
          success:function(res){
            if(res.confirm){
                wx.redirectTo({
                  url: '/pages/music/musicpay/musicpay?order_id=' + data.order_id,
                })
            }
          }
        })
      }else{
        wx.showToast({
          title:data.message,
          icon:'none',
          success:function(){
            setTimeout(function(){
              wx.navigateBack({})
            },2000)
          }
        })
      }
    })
  },
  is_send:function(e){
    if(e.detail.value){
      that.setData({
        is_send:1
      })
    }else{
      that.setData({
        is_send: 0
      })
    }
  },
  notice:function(){
    wx.navigateTo({
      url: '../notice/notice',
    })
  }

  
})