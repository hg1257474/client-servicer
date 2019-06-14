// pages/register/register.js
const {
  loginUrl,
  accountUrl
} = require("../../config/app.js")
const callback = (res) => {
  console.log(res)
  const sessionId = {
    value: res.cookies[0].match(/sessionId=([^;]+);/)[1],
    raw: res.cookies[1].split(";")[0]
  }
  wx.setStorageSync("sessionId", sessionId)
  console.log("ddddddddddddddd")
  wx.redirectTo({
    url: '/pages/index/index',
  })
}
Page({
  data: {
    isNeedRegister: false
  },
  onSubmit(e) {
    const that = this
    wx.request({
      url: loginUrl,
      data: {
        openId: this.data.openId,
        username: e.detail.value.username,
        password: e.detail.value.password
      },
      method: "POST",
      success(res) {
        console.log(res)
        if (res.statusCode === 202) {
          that.getUserInfo()
        } else wx.showToast({
          title: '账户或密码错误',
          icon: "none"
        })
      }
    })
  },
  onLoad: function(options) {
    const that = this
    let sessionId = wx.getStorageSync("sessionId") && wx.getStorageSync("sessionId").raw
    wx.login({
      success: function(res) {
        wx.request({
          url: loginUrl,
          method: "POST",
          header: {
            cookie: sessionId
          },
          data: {
            jsCode: res.code
          },
          success: function(res) {
            console.log(res)
            if (res.statusCode === 202) {
              that.setData({
                  openId: res.data
                }, () =>
                that.getUserInfo()
              )
            } else if (res.statusCode === 201) callback(res)
            else if (res.statusCode === 401) {
              that.setData({
                isNeedRegister: true,
                openId: res.data
              })
            } else wx.redirectTo({
              url: '/pages/index/index',
            })
          }
        })
      }
    })
  },
  getUserInfo() {
    const that = this
    wx.getUserInfo({
      success(res) {
        wx.request({
          url: accountUrl,
          method: "PUT",
          data: {
            avatar: res.userInfo.avatarUrl,
            nickname: res.userInfo.nickName,
            openId: that.data.openId
          },
          success(res) {
            callback(res)
          }
        })
      },
      fail: function() {
        that.setData({
          isNeedRegister: false
        })
      }
    })
  },
  onGetUserInfo(e) {
    console.log(e)
    const that = this
    wx.request({
      url: accountUrl,
      method: "PUT",
      data: {
        nickname: e.detail.userInfo.nickName,
        avatar: e.detail.userInfo.avatarUrl,
        openId: that.data.openId
      },
      success: function(res) {
        callback(res)
      }
    })
  }
})