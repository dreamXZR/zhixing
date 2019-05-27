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
      url: './video-part?part_id='+id+'&video_id='+that.data.video_id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this
    var part_id=options.part_id
    var video_id = options.video_id
    that.setData({
      part_id: part_id,
      video_id: video_id,
    })
    utils.authRequest('parts/' + part_id,'GET',{}).then(data=>{
      that.setData({
        part_info:data
      })
    })

    utils.authRequest('video_courses/' + video_id + '/parts', 'GET', {}).then(data => {
      that.setData({
        list: data.data
      })
    })
    
  },

 
})