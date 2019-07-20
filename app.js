//app.js
App({
  globalData: {
    userInfo: null,
    refresh() {
      wx.reLaunch({
        url: '/pages/account/account',
      })
    }
  },
  onLaunch: function() {
    console.log("refresh")
    console.log("refresh")
  }

})