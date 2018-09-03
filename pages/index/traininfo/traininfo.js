var servsers = getApp().globalData.servsers;
var answer;
var id;
var api = getApp().globalData.api;
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: [],
    answer: [],
    status: [],
    show: false,
    chooseSize: false,
    animationData: {},
    zx_number: wx.getStorageSync('train_zx_number'),
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
  radioChange: function (e) {
    var that = this;

    answer = e.detail.value
    id = e.currentTarget.dataset.id;


    var isshow = this.data.show;

    that.setData({
      ['id[' + e.currentTarget.dataset.id + ']']: true,
      show: true
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
          ['answer[' + e.currentTarget.dataset.id + ']']: res.data.answer,
          ['status[' + e.currentTarget.dataset.id + ']']: res.data.status,
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
    var that = this;
    this.setData({
      servsers: servsers,
    })
    if(options.sub_sort){
      wx.request({
        url: api+'nextTitle',
        method:"POST",
        data:{
          sub_type: options.sub_type,
          sub_sort:options.sub_sort,
          id: options.id
        },
        success: function (res) {
          that.setData({
            train: res.data,
            sub_type: options.sub_type
          });

        }
      })
    }else{
      wx.request({
        url: api + 'titleList',
        method: 'POST',
        data: {
          sub_type: options.type,
        },
        success: function (res) {
          that.setData({
            train: res.data,
            sub_type: options.type
          })
          
        }
      })
    }
   
  },
  nextTitle:function(){
    var that=this;
    wx.request({
      url: api+'isFinal',
      method:'POST',
      data:{
        sub_type: that.data.sub_type,
        sub_sort: that.data.train[0].sub_sort,
        id: that.data.train[0].id
      },
      success:function(res){
        
        if(res.data=='success'){ 
          wx.redirectTo({
            url: '../traininfo/traininfo?sub_type=' + that.data.sub_type + "&sub_sort=" + that.data.train[0].sub_sort + "&id=" + that.data.train[0].id,
          })
        }else{
          wx.setStorageSync('train_zx_status', 1);
          wx.showToast({
            title:'这是最后一题啦！',
          })
        }
      }
    })
    
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
    
  }
})