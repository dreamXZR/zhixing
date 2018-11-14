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
      id:options.id,
      money:options.money,
      style_id: options.style_id ? options.style_id:'',
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
    if (type==2 && select==0){
      if (!form_data.wangpan){
        wx.showToast({
          title:'请填写网盘信息',
          icon:'none'
        })
        return false
      }
    }
    if (type == 2 && select == 1){
      if(that.data.is_send==0){
        wx.showToast({
          title: '请勾选确定按钮',
          icon: 'none'
        })
        return false
      }
    }
    
    form_data.type=that.data.type
    form_data.ids=that.data.id
    form_data.money=that.data.money
    if (that.data.style_id){
      form_data.style_id = that.data.style_id
    }
    utils.authRequest('music_orders','POST',form_data).then(data=>{
      if (data.order_id){
        wx.showModal({
          title: '提示',
          content: that.data.money == '0.00'?'已发送，等待接收':data.message,
          showCancel:false,
          success:function(res){
            if(res.confirm){
                wx.redirectTo({
                  url: '/pages/music/musicpay/musicpay?order_id=' + data.order_id + "&money=" + that.data.money,
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