//index.js
//获取应用实例
const app = getApp()
const io = require("../../utils/weapp.socket.io.js")
const {
  serviceUrl,accountUrl
} = require("../../config/app.js")
let socket = null
Page({
  data: {
    services: []
  },
  onSubmit(e) {
    wx.navigateTo({
      url: `/pages/chat/chat?chatId=${e.detail.target.id}&formId=${e.detail.formId}`
    })
    console.log(e.detail)
  },
  onReady() {
    const sessionId = wx.getStorageSync("sessionId")
    const that=this
    wx.login({
      success(res) {
        wx.request({
          url: accountUrl.login,
          method: "POST",
          data: {
            sessionId,
            js_code: res.code
          },
          success(res) {
            console.log(res)
            if (res.data.tSessionId) wx.navigateTo({
              url: `/pages/account/account?tSessionId=${res.data.tSessionId}&isNeedRegister=${res.data.isNeedRegister}`,
            })
            else {
              if (res.data !== "already") wx.setStorageSync("sessionId", res.data)
              that.loggedCb()
            }
          }
        })
      }
    })
  },
  loggedCb() {
    console.log(111)
    const that = this
    const {
      services
    } = this.data
    socket = io(serviceUrl, {
      query: {
        sessionId: wx.getStorageSync("sessionId")
      }
    })
    socket.emit("pull","initialization", () => {
      socket.on("push", (_services, cb) => {
        console.log(_services)
        if (_services[0] instanceof Array) that.setData({
          services: [..._services, ...that.data.services]
        })
        else {
          console.log("Dsdsdss")
          let index = that.data.services.findIndex(item => item[2] === services[2])
          if (index !== -1) that.data.services.splice(index, 1)
          that.data.services.unshift(_services)
          console.log(index, that.data._services)
          that.setData({
            services: that.data.services
          })
        }
        if (cb) cb()
      })
    })
  }
})