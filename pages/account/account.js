// pages/register/register.js
const {
  LOGIN_URL
} = require("../../utils/config.js")
const setSessionId = (res) => {
  console.log(res)
  console.log(res.cookies)
  if (res.cookies && res.cookies.length) {
    if (res.cookies[0].value) wx.setStorageSync("sessionId", `EGG_SESS=${res.cookies[0].value}`)
    else wx.setStorageSync("sessionId", res.cookies[0].split(";")[0])
  } else {
    for (let key in res.header) {
      console.log(key.toLowerCase())
      if (key.toLowerCase() === "set-cookie") {
        const _temp = res.header[key]
        wx.setStorageSync("sessionId", _temp.match(/EGG_SESS=[^;]+/)[0])
      }
    }
  }
  wx.redirectTo({
    url: '/pages/serviceList/serviceList',
  })
}
Page({
  data: {
    isNeedRegister: false
  },
  onSubmit(e) {
    const that = this
    wx.request({
      url: LOGIN_URL,
      data: {
        openId: this.data.openId,
        username: e.detail.value.username,
        password: e.detail.value.password
      },
      method: "POST",
      success(res) {
        console.log(res)
        if (res.statusCode === 401) wx.showToast({
          title: '账户或密码错误',
          icon: "none"
        })
        else setSessionId(res)
      }
    })
  },
  onReady: function() {
    const that = this
    let sessionId = wx.getStorageSync("sessionId")
    wx.login({
      success: function(res) {
        wx.request({
          header: {
            cookie: sessionId
          },
          method: "POST",
          url: LOGIN_URL,
          data: {
            jsCode: res.code
          },
          success: function(res) {
            if (res.statusCode === 401) that.setData({
              openId: res.data
            })
            else setSessionId(res)
          },
          fail(res) {
            console.log("22")
            console.log(res)
          }
        });
      }
    })
  }
})