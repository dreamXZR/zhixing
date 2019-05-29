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
    music_select:[],
    playing_index:null,
    money:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this,
    
      utils.request('musicLibraries', 'GET', { library_style_id: options.library_style_id }).then(data => {

      that.setData({
        music_list: data.data
      })
    })
    utils.request('library_styles/' + options.library_style_id, 'GET', {}).then(data => {
      that.setData({
        style_info: data.music_library_style
      })
    })
    Background = wx.createInnerAudioContext()

  },
  // styleChange: function (e) {
  //   var style = that.data.styleList[e.detail.value]
  //   that.setData({
  //     single_money: style.library_single_money,
  //     more_money: style.library_more_money,
  //     style_name: style.title,
  //     style_id: style.id
  //   })
  // },
  // musicChange: function (e) {
  //   var parentindex=e.currentTarget.dataset.parentindex
  //   var music_select=that.data.music_select
  //   music_select[parentindex] = e.detail.value
  //   var select_id_arr=new Array()
  //   music_select.forEach(function(item,index){
  //     select_id_arr=select_id_arr.concat(item)
  //   })
  //   that.setData({
  //     music_select:music_select,
  //     select_id_arr: select_id_arr
  //   })
  //   var money
  //   if (select_id_arr.length == 0) {
  //     money = 0
  //   } else if (select_id_arr.length == 1) {
  //     money = that.data.single_money
  //   } else {
  //     money = that.data.more_money
  //   }
  //   that.setData({
  //     money: money
  //   })
  // },
  musicChange: function (e) {
    var select = e.detail.value
    var money=0
    if (select.length==0){
      money=0
    } else if (select.length==1){
      money = that.data.style_info.library_single_money
    }else{
      money = that.data.style_info.library_more_money
    }

    that.setData({
      money: money,
      music_library_id: select.join(',')
    })
    
  },
  toBuy: function () {

    if (that.data.money==0) {
      wx.showToast({
        title: '请勾选音乐片段',
        icon: 'none'
      })
      return false
    }
    wx.redirectTo({
      url: '../music-order/music-order?type=music_library' + "&money=" + that.data.money + "&music_library_id=" + that.data.music_library_id+'&style_id='+that.data.style_info.id,
    })
  },

  //试听
  // audition: function (e) {
  //   var parentindex = that.data.parentindex
  //   var stop_updata = "list[" + parentindex + "].data["+that.data.index+"].status"
  //   that.setData({
  //     [stop_updata]: 0,
  //   })

  //   var index = e.currentTarget.dataset.idx
  //   parentindex = e.currentTarget.dataset.parentindex
  //   Background.src = that.data.list[parentindex].data[index].qiniu_url
  //   Background.play()
  //   var updata = "list[" + parentindex + "].data[" + index + "].status"
  //   that.setData({
  //     [updata]: 1,
  //     index: index,
  //     parentindex: parentindex
  //   })
  // },
  // //暂停
  // stop: function (e) {
  //   var parentindex = that.data.parentindex
  //   var index = e.currentTarget.dataset.idx
  //   Background.stop()
  //   var updata = "list[" + parentindex + "].data[" + index + "].status"
  //   that.setData({
  //     [updata]: 0
  //   })
  // },
  //试听
  audition: function (e){
    Background.stop()
    
    if(that.data.playing_index!=null){
      var updata = "music_list[" + that.data.playing_index + "].status"
      that.setData({
        [updata]: 0
      })
    }
    var index = e.currentTarget.dataset.index
    
    Background.src=that.data.music_list[index].qiniu_url
    Background.play()

    var updata = "music_list[" + index + "].status"

    that.setData({
       [updata]: 1,
       playing_index:index
     })
  },
  //暂停
  stop: function (e) {
    var index = e.currentTarget.dataset.index
    Background.stop()
    var updata = "music_list[" + index + "].status"

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