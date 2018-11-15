var that
var utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect: 1,
    currentTpye: 0,
    list: []
  },
  statusTap: function (e) {
    var id = e.currentTarget.dataset.id
    wx.redirectTo({
      url: './video-part?id='+id+'&video_id='+that.data.video_id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this
    var id=options.id
    that.setData({
      part_id: options.id,
      video_id:options.video_id,
    })
    utils.request('parts/'+id,'GET',{}).then(data=>{
      that.setData({
        part_info:data.video_part
      })
    })
    utils.request('parts', 'GET', { video_id: options.video_id}).then(data=>{
      
      that.setData({
        list:data.video_parts
      })
    })
  },

 
})