var servsers = getApp().globalData.servsers;
var answer;
var id;
var api = getApp().globalData.api;
const app = getApp();
var that
var subjectId_list=[]; //题目id列表
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: [],
    show: false,
    chooseSize: false,
    animationData: {},
    zx_number: wx.getStorageSync('train_zx_number'),
    sign:false
  },

  //动画
  chooseSezi: function (e) {
    wx.setStorageSync('train_zx_status', 1);
    var that = this;
    wx.request({
      url: api +'zhixingAdd',
      method:'POST',
      data:{
        user_id: wx.getStorageSync('user_id'),
        zhixing_money: wx.getStorageSync('train_zx_number'),
        money:0
      },
      success:function(res){
        
        if(res.data=='success' ){
         
          //减少一次
          var times_arr = wx.getStorageSync('train_zx_times');
          times_arr[1] = times_arr[1]-1;
          wx.setStorageSync('train_zx_times', times_arr);
          // 创建一个动画实例
          var animation = wx.createAnimation({
            // 动画持续时间
            duration: 500,
            // 定义动画效果，当前是匀速
            timingFunction: 'ease-in'
          })
          // 将该变量赋值给当前动画
          that.animation = animation
          // 先在y轴偏移，然后用step()完成一个动画
          animation.translateY(-200).step()
          // 用setData改变当前动画
          that.setData({
            // 通过export()方法导出数据
            animationData: animation.export(),
            // 改变view里面的Wx：if
            chooseSize: true
          })
          // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
          setTimeout(function () {
            animation.translateY(10).step()
            that.setData({
              animationData: animation.export()
            })
          }, 200)
            setTimeout(function () {
              that.setData({
                chooseSize: false,
              })
            }, 4500)
        }
      }
   })
    
  },
  //选择答案
  radioChange: function (e) {
    answer = e.detail.value
    id = e.currentTarget.dataset.id;
    for(var i=0;i<that.data.select.length;i++){
      if (that.data.select[i].value != answer){
        
        that.data.select[i].disabled=true
        
      }
      if (that.data.select[i].value == answer){
        that.data.select[i].checked = true
      }
    }
    that.setData({
      select: that.data.select
    })
    wx.request({
      url: api + 'answer',
      method: 'POST',
      data: {
        id: id,
        answer: answer,
      },
      success: function (res) {
        that.setData({
          answer: res.data.answer,
          status: res.data.status,
        });
        //答题记录
        var times_arr = wx.getStorageSync('train_zx_times');
        if (res.data.status==1){
          app.globalData.rig_arr.push(id);
        } else if (res.data.status == 2){
          app.globalData.err_arr.push(id);
        }
        if (app.globalData.rig_arr.length == wx.getStorageSync('train_zx_num') && times_arr[1] != 0 && wx.getStorageSync('train_zx_status')==0){
          that.chooseSezi();
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      servsers: servsers,
    })
    
    wx.request({
      url: api + 'titleList',
      method: 'POST',
      data: {
        sub_type: options.type,
      },
      success: function (res) {
        subjectId_list=res.data
        that.refresh()
      }
    })
   
   
  },
  //随机获得答题
  refresh:function(){
    var index = Math.floor(Math.random() * subjectId_list.length)
    if (subjectId_list.length > 0) {
      wx.request({
        url: api+'subject',
        data:{
          subject_id: subjectId_list[index].id
        },
        success:function(res){
          that.setData({
            answer:'',
            status:'',
            sign:false,
            train:res.data,
            select:res.data.select
          })
          subjectId_list.splice(index, 1)
        }
      })
      
    }else{
      wx.showModal({
        title: '温馨提示',
        content: '没题了',
      })
    }
    
  },
  nextTitle:function(){
    that.refresh()
  },
  titleEnd:function(){
    var err_num = app.globalData.err_arr.length;
    var rig_num = app.globalData.rig_arr.length;
    var all_num=err_num+rig_num;
    wx.showModal({
      title: '答题结束',
      content: '本次共答' + all_num+'题，答对'+rig_num+'题，答错'+err_num+'题',
      showCancel:false,
      success:function(){
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  judgement:function(){
    var that = this;
    var times_arr = wx.getStorageSync('train_zx_times');
    if (times_arr[1]==0 || wx.getStorageSync('train_zx_status')==1){
      that.titleEnd();
    }else{
      
      var rig_num = app.globalData.rig_arr.length;
      var train_zx_num = wx.getStorageSync('train_zx_num');
      var balance = train_zx_num - rig_num;
      if (balance > 0) {
        wx.showModal({
          title: '继续吗？',
          content: '您距离获得知行币仅差' + balance + '题',
          confirmText: '继续',
          cancelText: '不了',
          success: function (res) {
            if (res.cancel) {
              that.titleEnd();
            }
          }
        });
      } else {
        that.titleEnd();
      }
    }
    
  },
  sign:function(){
    that.setData({
      sign:true
    })
  }
})