//app.js
App({
  onLaunch: function () {
    // 获取user_id
 
    var user_id= wx.getStorageSync('user_id');
    
    var that=this;
    if (!user_id){
      
      wx.showModal({
        title: '用户暂未登陆',
        content: '请点击跳转到登陆界面',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login',
            })
          }
        }
      })
    }else{
      // 获取用户信息
      wx.request({
        url: that.globalData.api +'getUserInfo',
        method:'POST',
        data:{
          user_id:user_id,
        },
        success:function(res){
          that.globalData.userInfo=res.data
        }
      })

    }
    
    
    
    
    
  },
  globalData: {
    userInfo: null,
    servsers: "https://www.567mc.cn/uploads/",
    api:'https://www.567mc.cn/api/',
    course_keyword:'',
    article_keyword:'',
    single_enroll:[],
    share_user_id:'',
    dist:{},
    user_status:0,
    rig_arr: [],
    err_arr: [],
  },
  
  
})
