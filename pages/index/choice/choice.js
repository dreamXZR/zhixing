var utils = require('../../../utils/util.js');
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndexNav: 0,
    navList: [],
    resourceList:[],
    page:1,
    servsers: getApp().globalData.servsers,
    search_value:'',
    type:'video'
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var type=options.type
    that.setData({
      type: type
    })
    this.getNavList(type);
  },

  // 获取导航数据
  getNavList(type) {
    utils.request('choice_types','GET',{type:type}).then(data=>{
      const navList = data.data
      that.setData({
        navList: navList
      })
      that.getResourceList(navList[0].id)
    })
   
  },
  getResourceList(choice_type_id){
    utils.request('choices', 'GET', { choice_type_id: choice_type_id}).then(data=>{
      that.setData({
        resourceList:data.data,
        page: data.meta.pagination.current_page
      })
    })
   
  },
  
  // 点击首页导航按钮
  activeNav(e) {
    var index = e.target.dataset.index
    that.setData({
      currentIndexNav: index
    })
    that.getResourceList(that.data.navList[index].id)
  },

  //搜索  
  searchInput: function (e) {
    that.setData({
      search_value: e.detail.value
    })
  },
  search:function(){
    const search_value=that.data.search_value
    if (!search_value==''){
      utils.request('choices','GET',{
        type:that.data.type,
        search: search_value
      }).then(data=>{
        that.setData({
          resourceList: data.data,
          page: data.meta.pagination.current_page
        })
      })
    }else{
      wx.showToast({
        title: '请输入搜索内容',
        icon:'none'
      })
    }
  },

  onTapMusic: function (event) {

    var choice_id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../music/music?choice_id=' + choice_id,
    })
  },

  onTapVideo: function (event) {
    var choice_id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../normalvideo/normalvideo?choice_id=' + choice_id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})