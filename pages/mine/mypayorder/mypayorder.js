var utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var that = this;
    if(options.type==1){
      utils.authRequest('memberRecord', 'POST', {}).then(data => {
        that.setData({
          info: data
        })
      })
    }else{
      utils.authRequest('zxRecord', 'POST', {}).then(data => {
        that.setData({
          info: data
        })
      })
    }
    

  },

 
})