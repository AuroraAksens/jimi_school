// pages/add-bank-card/add-bank-card.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //银行卡号
    bankCard: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //提交银行卡
  postBank: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    var userID = wx.getStorageSync('userInfoID')
    var name = e.detail.value.name
    var bankName = e.detail.value.bankName
    var cardNumber = this.data.bankCard
    if (name != '' && bankName != '' && cardNumber != '') {
      wx.showModal({
        title: '确认银行卡信息',
        content: '请确认银行卡信息准确无误。',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '加载中',
            })
            wx.request({
              url: app.globalData.url + 'wallet/add_bank',
              method: 'POST',
              header: {
                'content-type': 'application/json',
                'token': token
              },
              data: {
                user_id: userID, //用户ID
                name: name, //用户ID
                bank_name: bankName, //银行卡名称
                card_number: cardNumber, //卡号
              },
              success: res => {
                wx.hideLoading();
                if (res.data.code == 200) {
                  wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                    duration: 1500
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1,
                    })
                  }, 1500)
                } else {
                  wx.showToast({
                    title: res.data.msg,
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
    } else {
      wx.showToast({
        title: '请填写完成',
        icon: 'none',
        duration: 2000
      })
    }

  },

  //银行卡号
  BankCardNoInput: function (e) {
    var card = e.detail.value;
    // card = card.replace(/\s/g, '').replace(/[^\d]/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
    this.setData({
      bankCard: card,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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