let {
  serviceUrl: _serviceUrl
} = require('../../utils/config.js')
let serviceUrl = null
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
  onLoad: function(options) {
    console.log("onLoad")
    serviceUrl = `${_serviceUrl}/${options.id}`
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
  onEndService() {
    const that = this
    wx.request({
      url: `${serviceUrl}/status`,
      success(res) {
        that.initial()
      }
    })
  },
  onMakeConclusion() {
    const that = this
    wx.request({
      url: serviceUrl,
      data: {
        makeConclusion: true,

      },
      success(res) {
        that.setData(res.data)
      }
    })
  },
  onChangeDescriptionShow() {
    this.setData({
      shouldViewDescription: !this.data.shouldViewDescription
    })
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
  },
  onGetFormId(e){
    console.log(e)
  }
})