var utils = require('../../../utils/util.js');
var that
var Background
Page({

  /**
   * 页面的初始数据
   */
  data: {
    style_name: '请选择',
    index: 0,
    parentindex:0,
    music_select:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    utils.request('musicLibraries', 'GET', { style_id: options.style_id }).then(data => {

      that.setData({
        list: data
      })
    })
    utils.request('styles', 'GET', {}).then(data => {
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
  styleChange: function (e) {
    var style = that.data.styleList[e.detail.value]
    that.setData({
      single_money: style.library_single_money,
      more_money: style.library_more_money,
      style_name: style.title,
      style_id: style.id
    })
  },
  musicChange: function (e) {
    var parentindex=e.currentTarget.dataset.parentindex
    var music_select=that.data.music_select
    music_select[parentindex] = e.detail.value
    var select_id_arr=new Array()
    music_select.forEach(function(item,index){
      select_id_arr=select_id_arr.concat(item)
    })
    that.setData({
      music_select:music_select,
      select_id_arr: select_id_arr
    })
    var money
    if (select_id_arr.length == 0) {
      money = 0
    } else if (select_id_arr.length == 1) {
      money = that.data.single_money
    } else {
      money = that.data.more_money
    }
    that.setData({
      money: money
    })
  },
  toBuy: function () {

    if (!that.data.select_id_arr || that.data.style_name == '请选择') {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return false
    }
    var id = that.data.select_id_arr.join(',')
    wx.redirectTo({
      url: '../music-order/music-order?type=3&id=' + id + "&money=" + that.data.money + "&style_id=" + that.data.style_id,
    })
  },

  //试听
  audition: function (e) {
    var parentindex = that.data.parentindex
    var stop_updata = "list[" + parentindex + "].data["+that.data.index+"].status"
    that.setData({
      [stop_updata]: 0,
    })

    var index = e.currentTarget.dataset.idx
    parentindex = e.currentTarget.dataset.parentindex
    Background.src = that.data.list[parentindex].data[index].qiniu_url
    Background.play()
    var updata = "list[" + parentindex + "].data[" + index + "].status"
    that.setData({
      [updata]: 1,
      index: index,
      parentindex: parentindex
    })
  },
  //暂停
  stop: function (e) {
    var parentindex = that.data.parentindex
    var index = e.currentTarget.dataset.idx
    Background.stop()
    var updata = "list[" + parentindex + "].data[" + index + "].status"
    that.setData({
      [updata]: 0
    })
  },
  onUnload: function () {
    Background.destroy()
  },


  // listTap(e) {

  //   let Index = e.currentTarget.dataset.parentindex,//获取点击的下标值
  //     list = this.data.list;
  //   list[Index].show = !list[Index].show || false;//变换其打开、关闭的状态
  //   if (list[Index].show) {//如果点击后是展开状态，则让其他已经展开的列表变为收起状态
  //     this.packUp(list, Index);
  //   }

  //   this.setData({
  //     list,
  //     parentindex: Index
  //   });
  // },

  // packUp(data, index) {
   
  //   for (let i = 0, len = data.length; i < len; i++) {//其他最外层列表变为关闭状态
  //     if (index != i) {
  //       data[i].show = false;
        
  //     }
  //   }
  // },
MergeArray:function (arr1,arr2){
    var _arr = new Array();
    for(var i=0;i<arr1.length;i++){
       _arr.push(arr1[i]);
    }
    for(var i=0;i<arr2.length;i++){
        var flag = true;
        for(var j=0;j<arr1.length;j++){
            if(arr2[i]==arr1[j]){
                flag=false;
                break;
            }
        }
        if(flag){
            _arr.push(arr2[i]);
        }
    }
    return _arr;
}





})