let {
  serviceUrl: _serviceUrl,
  fileUploadUrl,
  SERVICE_FILE_URL
} = require('../../utils/config.js')
let serviceUrl = null
let serviceId = null
let serviceFileUrl = null
let tempFileId = null
const initialData = {
  shouldViewDescription: false,
  shouldViewContact: false,
  shouldViewProcessor: false,
  shouldViewComment: false,
  shouldViewConclusion: false,
  canMakeConclusion: false,
  canEndService: false,
  isSendQuoting:false
}
Page({

  /**
   * 页面的初始数据
   * 
   * 
   * {{payment[1]?'已支付':'修改'}}
   */
  data: {
    isSendQuoting:false,
    shouldViewDescription: false,
    shouldViewContact: false,
    shouldViewProcessor: false,
    shouldViewComment: false,
    shouldViewConclusion: false,
    canMakeConclusion: false,
    canEndService: false
  },
  onChoose(e) {
    console.log(e)
    this.setData({
      "info.franchiseMode": e.detail
    })
  },
  onFeeChange(e) {
    this.setData({
      fee: e.detail.value
    })
  },
  onSendQuote() {
    const that = this
    if (this.data.sendQuoteButton === "报价") {
      if (parseInt(this.data.fee) && parseInt(this.data.fee) > 0) {
        this.setData({isSendQuoting:true})
        wx.request({
          url: `${serviceUrl}/payment`,
          method: "PUT",
          header: {
            cookie: wx.getStorageSync("sessionId")
          },
          data: {
            fee: this.data.fee
          },
          success(res) {
            that.setData({isSendQuoting:false})
            if (res.data === 403) {
              getApp().globalData.refresh()
              return 1
            }
            console.log(1111)
            wx.showToast({
              title: '报价成功',
            })
            that.initial()
          }
        })
      } else wx.showToast({
        title: "报价不能为0",
        icon: "none"
      })
    } else this.setData({
      sendQuoteButton: '报价'
    })
  },
  initial() {
    const that = this
    wx.request({
      url: serviceUrl,
      header: {
        cookie: wx.getStorageSync("sessionId")
      },
      success(res) {
        if (res.data === 403) {
          getApp().globalData.refresh()
          return 1
        }
        console.log(res.data)
        const {
          data
        } = res
        if (data.processor) data.processorPicked = data.processor
        if (data.processors) {
          data.processorPickerRange = data.processor ? data.processors.filter(item => item[1] !== data.processor[1]) : data.processors
          data.assignServiceButton = "分配"
        } else data.assignServiceButton = "修改"
        console.log(data.processorPickerRange)
        if (data.canMakeConclusion) {
          data.conclusion = [null, []]
        }
        if (data.payment) {
          data.sendQuoteButton = data.payment[1] ? '已支付' : '修改'
        } else data.sendQuoteButton = '报价'
        data.isTextDescriptionType = typeof data.description === 'string'
        that.setData({ ...initialData,
          ...data
        })
      }
    })
  },
  onAssignService(e) {
    const that = this
    console.log(this.data.processorPicked)
    if (!this.data.processorPicked) {
      wx.showToast({
        title: '请选择律师后操作',
        icon: "none"
      })
      return 1
    }
    if (this.data.assignServiceButton === "分配") wx.request({
      url: `${serviceUrl}/processor`,
      method: "PUT",
      header: {
        cookie: wx.getStorageSync("sessionId")
      },
      data: {
        processorId: this.data.processorPicked[1]
      },
      success(res) {
        if (res.data === 403) {
          getApp().globalData.refresh()
          return 1
        }
        wx.showToast({
          title: '分配成功',
        })
        that.initial()
      }
    })
    else {
      const that = this
      if (!this.data.processorPickerRange) {
        wx.request({
          url: `${_serviceUrl}/processors`,
          method: "GET",
          success(res) {
            const processorPickerRange = res.data.filter(item => item[1] !== that.data.processorPicked[1])
            that.setData({
              assignServiceButton: '分配',
              processorPickerRange
            })
          }
        })
      } else {
        that.setData({
          assignServiceButton: '分配'
        })
      }
    }
  },
  onPreviewFile(e) {
    console.log(e)
    const index = e.currentTarget.dataset.index
    const target = e.currentTarget.dataset.type === "conclusion" ? this.data.conclusion[1] : this.data.description
    console.log(target)
    console.log(index)
    /*const type = target[index][0].slice(-4).includes(".") ? target[index][0].slice(-3) : target[index][0].slice(-4)*/
    const filename = target[index][0]
    let type = ""
    for (let key = filename.length - 1; key > -1; key--) {
      if (filename[key] !== ".") type = filename[key] + type
      else break;
    }
    console.log(type)
    if (["png", "jpg", "gif", "jpeg"].includes(type)) {
      wx.previewImage({
        urls: [`${SERVICE_FILE_URL}?part=data&target=${e.currentTarget.dataset.type}&serviceId=${serviceId}&index=${index}`],
        complete(res) {
          console.log(res)
        }
      })
    } else {
      wx.downloadFile({
        url: `${SERVICE_FILE_URL}?part=data&target=${e.currentTarget.dataset.type}&serviceId=${serviceId}&index=${index}`,
        success(res) {
          console.log(res)
          wx.openDocument({
            fileType: type,
            filePath: res.tempFilePath,
          })
        }
      })
    }
  },
  onDownloadFile(e) {
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `/pages/file/file?id=${serviceId}&type=download&target=${e.currentTarget.dataset.type}&index=${index}`
    })
  },
  onLoad: function(options) {
    console.log("onLoad")
    serviceId = options.id
    serviceUrl = `${_serviceUrl}/${options.id}`
    serviceFileUrl = `${serviceUrl}/${options.id}`
    this.initial()
  },
  /*分配律师*/
  onConclusionTextChange(e) {
    this.setData({
      concl
    })
  },
  onPickProcessor(e) {
    console.log(e)
    this.setData({
      processorPicked: this.data.processorPickerRange[e.detail.value]
    })
  },
  onDeleteFile: function(e) {
    const that = this
    const id = e.currentTarget.dataset.id
    wx.request({
      url: fileUploadUrl + "/" + id,
      method: "DELETE",
      success(res) {
        const files = that.data.conclusion[1].filter(item => item[2] !== id)
        that.setData({
          "conclusion[1]": files
        })
      }
    })
  },
  onChooseFile: function(options) {
    const that = this
    wx.request({
      url: fileUploadUrl,
      method: "POST",
      success(res) {
        console.log(res)
        tempFileId = res.data
        console.log("f")
        wx.navigateTo({
          url: "/pages/fileUpload/fileUpload?id=" + res.data
        })

      }
    })
  },
  onEndService() {
    const that = this

    wx.request({
      url: `${serviceUrl}/status`,
      method: "PUT",
      success(res) {
        that.initial()
      }
    })
  },
  onMakeConclusionText(e) {
    console.log(e)
    this.setData({
      "conclusion[0]": e.detail.value
    })
  },
  onMakeConclusion() {
    const that = this
    wx.request({
      url: serviceUrl + "/conclusion",
      method: "PUT",
      data: {
        makeConclusion: true,
        conclusion: that.data.conclusion
      },
      success(res) {
        that.initial()
      }
    })
  },
  onChangeDescriptionShow() {
    this.setData({
      shouldViewDescription: !this.data.shouldViewDescription
    })
  },
  onShow() {
    const that = this
    if (tempFileId) {
      wx.request({
        url: fileUploadUrl + "/summary/" + tempFileId,
        method: "GET",
        success(res) {
          console.log(res.data)
          console.log(that.data)
          res.data.push(tempFileId)
          console.log(that.data.files)
          that.data.conclusion[1].push(res.data)
          tempFileId = null
          console.log(that.data.conclusion)
          const newConclusion = that.data.conclusion.map(item => item)
          console.log(newConclusion)
          that.setData({
            conclusion: newConclusion
          })
        }
      })
    }
  },
  onChangeProcessorShow() {
    this.setData({
      shouldViewProcessor: !this.data.shouldViewProcessor
    })
  },
  onChangeContactShow() {
    this.setData({
      shouldViewContact: !this.data.shouldViewContact
    })
  },
  onChangeCommentShow() {
    this.setData({
      shouldViewComment: !this.data.shouldViewComment
    })
  },
  onChangeConclusionShow() {
    this.setData({
      shouldViewConclusion: !this.data.shouldViewConclusion
    })
  }
})