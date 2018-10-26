var utils = require('../../../utils/util.js');
var that
var Background
Page({

  /**
   * 页面的初始数据
   */
  data: {
    style_name:'请选择',
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this
    utils.request('musicLibraries','GET',{style_id:options.style_id}).then(data=>{
      that.setData({
        musicList:data.data
      })
    })
    utils.request('styles','GET',{}).then(data=>{
      that.setData({
        styleList: data,
        single_money: data[0].library_single_money,
        more_money: data[0].library_more_money,
        money: 0,
        style_name: data[0].title,
        style_id: data[0].id
      })
    })
    Background = wx.createInnerAudioContext()
    
  },
  styleChange:function(e){
    var style=that.data.styleList[e.detail.value]
    that.setData({
      single_money:style.library_single_money,
      more_money:style.library_more_money,
      style_name:style.title,
      style_id:style.id
    })
  },
  musicChange:function(e){
    that.setData({
      music_select:e.detail.value
    })
    var money
    if (e.detail.value.length==0){
      money=0
    } else if (e.detail.value.length == 1){
      money=that.data.single_money
    }else{
      money=that.data.more_money
    }
    that.setData({
      money:money
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
  },

  //试听
  audition:function(e){
    var stop_updata = "musicList[" + that.data.index + "].status"
    that.setData({
      [stop_updata]: 0,
    })

    var index=e.currentTarget.dataset.idx
    Background.src=that.data.musicList[index].qiniu_url
    Background.play()
    var updata="musicList["+index+"].status"
    that.setData({
      [updata]:1,
      index:index
    })
  },
  //暂停
  stop:function(e){
    var index = e.currentTarget.dataset.idx
    Background.stop()
    var updata = "musicList[" + index + "].status"
    that.setData({
      [updata]: 0
    })
  },
  onUnload: function () {
    Background.destroy()
  },
  
})