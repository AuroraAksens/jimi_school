// pages/bank-card/bank-card.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //银行卡列表信息
    bankList: [],

    //高亮选择
    status: -1,

    //传银行卡ID
    bankID: '',

    //传银行卡名称
    bankName: '',

    //识别是否提现
    sta: '',

    //钱包余额
    money: '',

    //加密银行卡号
    passCard: '',

    bankListLength: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var sta = options.sta
    var money = options.money
    this.setData({
      sta,
      money
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //跳转银行卡
  addBankCard: function () {
    wx.navigateTo({
      url: '/pages/add-bank-card/add-bank-card',
    })
  },

  //跳转提现页
  getoTake: function () {
    var bankID = this.data.bankID //银行卡ID
    var bankName = this.data.bankName //银行卡名称
    var money = this.data.money //余额
    var userID = wx.getStorageSync('userInfoID') //用户ID
    var sta = 1
    wx.navigateTo({
      url: '/pages/take/take?bankID=' + bankID + '&userID=' + userID + '&bankName=' + bankName + '&money=' + money + '&sta=' + sta,
    })
  },

  //银行卡列表信息
  listBankCard: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'wallet/bank_list',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token': token
      },
      success: res => {
        wx.hideLoading();
        if (res.data.code == 200) {
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].status = i
          }
          if (res.data.data.length) {
            that.setData({
              bankListLength: true
            })
          } else {
            that.setData({
              bankListLength: false
            })
          }
          for (var i = 0; i < res.data.data.length; i++) {
            that.setData({
              passCard: res.data.data[i].card_number.replace(/\s/g, '').replace(/(\d{4})\d+(\d{4})$/, "**** **** **** $2")
            })
            console.log(that.data.passCard)
          }
          that.setData({
            bankList: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
    })
  },

  //选择银行卡
  selectBank: function (e) {
    var index = e.currentTarget.dataset.index
    var bankID = e.currentTarget.dataset.bankid
    var bankName = e.currentTarget.dataset.bankname
    this.setData({
      status: index,
      bankID,
      bankName
    })
  },


  //解绑银行卡
  closeCard(e) {
    var that = this
    var token = wx.getStorageSync('token')
    var bankID = e.currentTarget.dataset.bankid
    wx.showActionSheet({
      itemList: ['解除绑定'],
      success(res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.showModal({
            title: '解绑提示',
            content: '确定要解除绑定这张银行卡吗？',
            success(res) {
              if (res.confirm) {
                wx.request({
                  url: app.globalData.url + 'wallet/remove',
                  method: 'POST',
                  data: {
                    bank_id: bankID
                  },
                  header: {
                    'content-type': 'application/json',
                    'token': token
                  },
                  success: res => {
                    wx.hideLoading();
                    if (res.data.code == 200) {
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                      })
                      setTimeout(function () {
                        that.listBankCard()
                      }, 2000)
                    } else {
                      wx.showToast({
                        title: res.data,
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  },
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
    })



  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.listBankCard()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})