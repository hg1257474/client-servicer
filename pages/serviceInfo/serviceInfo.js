let {
  serviceUrl: _serviceUrl,
  fileUploadUrl
} = require('../../utils/config.js')
let serviceUrl = null
let serviceId = null
let serviceFileUrl = null
let tempFileId = null
Page({

  /**
   * 页面的初始数据
   * 
   * 
   * {{payment[1]?'已支付':'修改'}}
   */
  data: {
    shouldViewDescription: false,
    shouldViewContact: false,
    shouldViewProcessor: false,
    shouldViewComment: false,
    shouldViewConclusion: false,
  },
  datas: {
    description: "asdddddddddddddddddd",
    isTextDescriptionType: true,
    shouldViewDescription: true,
    shouldViewContact: true,
    shouldViewProcessor: true,
    shouldViewComment: true,
    shouldViewConclusion: true,
    processor: {
      name: "dsdsd",
      serviceTotal: 122,
      grade: 323,
      expert: '餐饮服务、合同咨询'
    },
    status: "待回复",
    name: "合同-咨询",
    contact: {
      name: "dsdsdsdsds",
      phone: 2312312312,
      method: "dingTalk",
      content: "dsdsds"
    },
    payment: [3232,
      true
    ],
    comment: [1, 2, 3, "dsdsds"],
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
    if (this.data.sendQuoteButton === "报价") wx.request({
      url: `${serviceUrl}/payment`,
      method: "PUT",
      header: {
        cookie: wx.getStorageSync("sessionId")
      },
      data: {
        fee: this.data.fee
      },
      success() {
        wx.showToast({
          title: '报价成功',
        })
        that.initial()
      }
    })
    else this.setData({
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
        that.setData(data)
      }
    })
  },
  onAssignService(e) {
    const that = this
    if (this.data.assignServiceButton === "分配") wx.request({
      url: `${serviceUrl}/processor`,
      method: "PUT",
      header: {
        cookie: wx.getStorageSync("sessionId")
      },
      data: {
        processorId: this.data.processorPicked[1]
      },
      success() {
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
      }
    }
  },
  onPreviewFile(e) {
    console.log(e)
    const index = e.currentTarget.dataset.index
    const type = this.data.description[index][0].slice(-4).includes(".") ? this.data.description[index][0].slice(-3) : this.data.description[index][0].slice(-4)
    console.log(type)
    if (["png", "jpg", "gif"].includes(type)) {
      wx.previewImage({
        urls: [`${serviceFileUrl}/${e.currentTarget.dataset.type==='conclusion'?'conclusion':'file'}/${index}`]
      })
    } else {
      wx.downloadFile({
        url: `${serviceFileUrl}/file/${index}`,
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