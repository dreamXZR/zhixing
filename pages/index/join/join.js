var WxParse = require('../../../wxParse/wxParse.js');
var api=getApp().globalData.api;
const app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  onTapSingle: function (event) {
    if (!wx.getStorageSync('user_id')) {
      wx.navigateTo({
        url: '../../login/login',
      })
      return false;
    }
    var that=this;
    var start_time = new Date(that.data.start_time.replace(/-/g, "/"));
    
    var end_time = new Date(that.data.end_time.replace(/-/g, "/"));
    
    var now_time = new Date(that.data.now_time.replace(/-/g, "/"));
    
    var day1 = now_time.getTime() - start_time.getTime();
    var day2 = now_time.getTime() - end_time.getTime();
    var day1 = parseInt(day1 / (1000 * 60 * 60 * 24));
    var day2 = parseInt(day2 / (1000 * 60 * 60 * 24));
    if(day1<0){
      wx.showToast({ title: '未开始报名' })
    }else if(day2>0){
      wx.showToast({ title: '报名已结束' })
    }else{
      app.globalData.single_enroll=[];
      wx.navigateTo({
        url: 'single/single',
      })
    }
  },
  onTapTeam: function (event) {
    if (!wx.getStorageSync('user_id')) {
      wx.navigateTo({
        url: '../../login/login',
      })
      return false;
    }
    var that = this;
    var start_time = new Date(that.data.start_time.replace(/-/g, "/"));
   
    var end_time = new Date(that.data.end_time.replace(/-/g, "/"));
   
    var now_time = new Date(that.data.now_time.replace(/-/g, "/"));
   
    var day1 = now_time.getTime() - start_time.getTime();
    var day2 = now_time.getTime() - end_time.getTime();
    var day1 = parseInt(day1 / (1000 * 60 * 60 * 24));
    var day2 = parseInt(day2 / (1000 * 60 * 60 * 24));
    if (day1 < 0) {
      wx.showToast({ title: '未开始报名' })
    } else if (day2 > 0) {
      wx.showToast({ title: '报名已结束' })
    } else {
      app.globalData.single_enroll = [];
      wx.navigateTo({
        url: 'team/team',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  onShow:function(){
    var that = this;
    wx.request({
      url: api + 'enrollInfo',
      success: function (res) {
        that.setData({
          match_title: res.data.match_title,
          start_time: res.data.start_time,
          end_time: res.data.end_time
        })

        var match_content = res.data.match_content;
        WxParse.wxParse('match_content', 'html', match_content, that, 5);
      }
    })

    //获取当前时间
    var time = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    this.setData({
      now_time: time
    });
  }

 
})