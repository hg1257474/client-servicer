//index.js
//获取应用实例
const app = getApp()
const io = require("../../utils/weapp.socket.io.js")
const {
  serviceUrl
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
    const that = this
    const {
      services
    } = this.data
    socket = io(serviceUrl, {
      query: {
        sessionId: wx.getStorageSync("sessionId")
      }
    })
    socket.emit("pull", "initialization", () => {
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
  },
})