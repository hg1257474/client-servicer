let {
  serviceUrl
} = require('../../utils/config.js')
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
    const that=this
    if (this.data.sendQuoteButton === "报价") wx.request({
      url: `${serviceUrl}/payment`,
      method:"PUT",
      header:{
        cookie:wx.getStorageSync("sessionId")
      },
      data:{
        fee:this.data.fee
      },
      success(){
        that.initial()
      }
    })
    else this.setData({sendQuoteButton:'报价'})
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
        if (data.canMakeConclusion) {
          data.conclusion = [null, []]
        }
        if (data.payment) {
          data.sendQuoteButton = data.payment[1] ? '已报价' : '修改'
        } else data.sendQuoteButton = '报价'
        data.isTextDescriptionType = typeof data.description === 'string'
        that.setData(data)
      }
    })
  },
  onLoad: function(options) {
    serviceUrl = `${serviceUrl}/${options.id}`
    this.initial()
  },
  radioChange: function(e) {
    this.setData({
      radioCheckVal: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  /*分配律师*/
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  onConclusionTextChange(e) {
    this.setData({
      concl
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
  }
})