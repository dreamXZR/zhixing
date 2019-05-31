
var servsers = getApp().globalData.servsers
var api = getApp().globalData.api
var that
var form_data
var i=0
var image_belong

Page({
	/**
   * 页面的初始数据
   */
  data: {
  	//图片设置
    tempFilePaths: [],
    percent: 0,
    in_percent: false,
    //性别
    sex:1,
    //性别
    items: [
      { name: 1, value: '男', checked: 'true'},
      { name: 0, value: '女', checked: ''},
      
    ],
    img_jia:"icon/jia.png",
    readonly:false,
  }, 
  //通过身份证获得相关信息
  getInfo: function (userNameid){
    wx.request({
      url: api + 'players/' + userNameid,
     
      success: function (res) {
          that.setData({
            info: res.data,
            readonly: true,
          });
          var tempFilePaths = new Array();
          tempFilePaths[0] = res.data.card_front,
          tempFilePaths[1] = res.data.card_back,
          tempFilePaths[2] = res.data.photo,
          that.setData({
            tempFilePaths: tempFilePaths
          });
          if (res.data.sex == 0) {
            that.setData({
              items: [
                { name: 1, value: '男', checked: '' },
                { name: 0, value: '女', checked: 'true' },
              ],
              sex: 0,
            })
          }
        }
      }
    )
  },
  //性别
  radioChange: function (e) {
    that.data.sex = e.detail.value;
   
  },
  //选择照片
  img_item: function (e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
       
        that.setData({
          ['tempFilePaths[' + e.target.id + ']']: res.tempFilePaths[0]
        })
      }
    })
  },

  //上传
  //POST  
  formSubmit: function (e) {
    form_data = e.detail.value;
    if (form_data.name != '' && form_data.id_number != '' && form_data.age!='') {
      var name_reg = /^[\u4E00-\u9FA5]{2,4}$/;
      if (!name_reg.test(form_data.name)) {
        wx.showToast({
          title: '姓名2-4中文字符！',
          icon: 'none',
        })
        return false;
      }
      var id_reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
      if (!id_reg.test(form_data.id_number)){
        wx.showToast({
          title: '身份证号错误',
          icon: 'none',
        })
        return false;
      }
      //是否上传图片验证
      var num = 0;
      for (var a = 0; a < 3; a++) {
        
        //其他图片验证
        if (that.data.tempFilePaths[a]) {
            num++
            if (num === 3) {
              that.btn_up()
            }

        } else {
            wx.showToast({
              title: '请上传图片···',
              icon: 'none',
            })
        }
      }
      
    } else {
      wx.showToast({
        title: '请填写完整···',
        icon: 'none',
      })

    }
  },
  //个人信息提交
  numberTextInfo:function(data){
    wx.request({
      url: api + 'numberTextInfo',
      method: "POST",
      data: data,
      success: function (res) {
        if(res.data.status){
          wx.showModal({
            title: '提示',
            content: '提交成功!',
            showCancel: false,
            success: function (res) {
              that.setData({
                in_percent: false
              })
              wx.navigateBack({
              })

            }
          })
        }else{
          wx.showToast({
            title: res.data.message,
            success:function(){
              setTimeout(function(){
                wx.navigateBack({})
              },2000)
            }
          })
        }

        
      }
    })
  },
  btn_up: function () {
    switch (i) {
      case 0:
        image_belong = 'card_front'
        break;
      case 1:
        image_belong = 'card_back'
        break;
      case 2:
        image_belong = 'photo'
        break;

    }
   
    //完整数据（除图片）
    var data = form_data
    data.sex = that.data.sex
    data.unit_id=wx.getStorageSync('unit_id')
    
    //普通非更换图片
    if (that.data.tempFilePaths[i].indexOf(servsers)>=0){
      i++;
      that.setData({
        percent: that.data.percent + 33,
        in_percent: true
      });
      if (i == 3) {
        i = 0;
        that.numberTextInfo(data)

      } else if (i <3) {//若图片还没有传完，则继续调用函数  
        that.btn_up()
      }
    } else {//数据与图片上传
      wx.uploadFile({

        url: api + 'numberImgInfo',
        filePath: that.data.tempFilePaths[i],
        name: image_belong,
        formData: data,
        success: function (res) {
          if(res.data){
            var status_data = JSON.parse(res.data)
            if (!status_data.status) {
              wx.showToast({
                title: status_data.message,
                icon: 'none'
              })
              return false
            }
          }
          i++;
          that.setData({
            percent: that.data.percent + 33,
            in_percent: true
          })
          if (i == 3) {
            i=0;
            that.numberTextInfo(data)
          } else if (i < 3) {//若图片还没有传完，则继续调用函数  
            that.btn_up()
          }
        }
      })
    }
    
  },
  onLoad: function (options) {
    that=this;
    that.setData({
      servsers: servsers,    //图片链接      
      idnumber: options.player_id ? options.player_id : '', //是否存在身份证号
    })
    if (options.player_id){
      that.getInfo(options.player_id)
    }
    
  }
  
})