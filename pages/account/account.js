// pages/register/register.js
const {
  accountUrl
} = require("../../config/app.js")
Page({
  data: {},
  onLoad: function(options) {
    console.log(this)
    console.log(options)
    this.setData(options)
    if (!options.isNeedRegister) this.getUserInfo()
  },
  loggedCb(){
    const pages=getCurrentPages()
    pages[pages.length-2].loggedCb()
    wx.navigateBack({
      delta:1
    })
  },
  onSubmit(e) {
    const that=this
    wx.request({
      url: accountUrl.register,
      data: {
        tSessionId: this.data.tSessionId,
        userName: e.detail.value.userName,
        password: e.detail.value.password
      },
      method: "POST",
      success(res) {
        if (res.data === "update") {
          that.getUserInfo()
        } else wx.showToast({
          title: '账户或密码错误',
          icon:"none"
        })
      }
    })
  },
  getUserInfo() {
    const that=this
    wx.getUserInfo({
      success(res) {
        wx.request({
          url: accountUrl.update,
          method: "POST",
          data: {
            avatar: res.userInfo.avatarUrl,
            nickName: res.userInfo.nickName,
            tSessionId: that.data.tSessionId
          },
          success(res) {
            console.log(res)
            wx.setStorageSync("sessionId", res.data)
            that.loggedCb()
          }
        })
      },
      fail:function () {
        that.setData({
          isNeedRegister: false
        })
      }
    })
  },
  onGetUserInfo(e) {
    console.log(e)
    const that=this
    wx.request({
      url: accountUrl.update,
      method: "POST",
      data: {
        nickName: e.detail.userInfo.nickName,
        avatar: e.detail.userInfo.avatarUrl,
        tSessionId: this.data.tSessionId
      },
      success:function (res) {
        wx.setStorageSync("sessionId", res.data)
        that.loggedCb()
      }
    })
  }
})