
const api = 'https://www.567mc.cn/api/'

function request(url,method,param){
  let response = new Promise(function(resolve, reject){
    wx.request({
      url: api + url,
      method: method,
      data: param,
      success:function(res){
        resolve(res.data)
      }
    })
  })
  return response;
}
//刷新token
function refreshToken(){
  let response = new Promise(function (resolve, reject){
    wx.request({
      url: api +'authorizations/current',
      method:'POST',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('access_token')
      },
      data:{
        user_id: wx.getStorageSync('user_id')
      },
      success:function(res){
        wx.setStorageSync('access_token',res.data.access_token)
        wx.setStorageSync('access_token_expired_at', new Date().getTime() + res.data.expires_in * 1000)
        resolve(res.data)
      }
    })
  })
  return response
}
//获得token
function getToken(){
  let response = new Promise(function (resolve, reject) {
    let accessToken = wx.getStorageSync('access_token')
    let expiredAt = wx.getStorageSync('access_token_expired_at')
    if (accessToken && new Date().getTime() > expiredAt) {
      refreshToken().then(values => {
        accessToken = values.access_token
        resolve(accessToken) 
      })
    } else {
      resolve(accessToken)
    }
  })
  return response

}
//身份认证
function authRequest(url, method, param){
  let response = new Promise(function (resolve, reject) {
    getToken().then(values=>{
      var token=values
     
      wx.request({
        url: api + url,
        method: method,
        header: {
          'Authorization': 'Bearer ' + token
        },
        data: param,
        success: function (res) {
          resolve(res.data)
        }
      })
    
     
    })
  })
  return response
  
}



module.exports = {
  request: request,
  authRequest: authRequest,
  refreshToken:refreshToken
}