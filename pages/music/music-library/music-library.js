var utils = require('../../../utils/util.js');
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    style_name:'请选择'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this
    utils.request('musicLibraries','GET',{}).then(data=>{
      that.setData({
        musicList:data.music_libraries
      })
    })
    utils.request('styles','GET',{}).then(data=>{
      that.setData({
        styleList: data,
      })
    })
  },
  styleChange:function(e){
    var style=that.data.styleList[e.detail.value]
    that.setData({
      money:style.money,
      style_name:style.title,
      style_id:style.id
    })
  },
  musicChange:function(e){
    that.setData({
      music_select:e.detail.value
    })
  },
  toBuy:function(){
    
    if (!that.data.music_select || that.data.style_name=='请选择'){
      wx.showToast({
        title: '请填写完整信息',
        icon:'none'
      })
      return false
    }
    var id = that.data.music_select.join(',')
    wx.redirectTo({
      url: '../music-order/music-order?type=3&id=' + id + "&money=" + that.data.money+"&style_id="+that.data.style_id,
    })
  }
})