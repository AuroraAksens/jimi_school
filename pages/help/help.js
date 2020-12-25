// pages/help/help.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: -1,
    optionDatas: [],
    optionData: [{
      index: 0,
      name: "如何接单？",
      text: "注意，一定要指定容器的宽度，不然的话是没有用的。注意word-break 是IE5+专有属性"
    }, {
      index: 1,
      name: "如何加急实名认证？",
      text: "注意，一定要指定容器的宽度，不然的话是没有用的。"
    }, {
      index: 2,
      name: "如何取消任务？",
      text: "注意，一定要指定容器的宽度"
    }, {
      index: 3,
      name: "订单退款多久到账？",
      text: "注意，一定要指定容器的宽度，不然的话是没有用的。注意word-break 是IE5+专有属性"
    }, {
      index: 4,
      name: "任务如何结算？",
      text: "注意，一定要指定容器的宽度，不然的话是没有用的。注意word-break 是IE5+专有属性"
    }, {
      index: 5,
      name: "提现多久到账？",
      text: "注意，一定要指定容器的宽度，不然的话是没有用的。注意word-break 是IE5+专有属性"
    }],
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


  // 点击显示文本
  blockBox: function (e) {
    if (this.data.status == e.currentTarget.dataset.index) {
      this.setData({
        status: -1
      })
    } else {
      this.setData({
        status: e.currentTarget.dataset.index
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    var token = wx.getStorageSync('token')

    if (token) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.url + 'user/help', //仅为示例，并非真实的接口地址
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'token': token
        },
        success(res) {
          wx.hideLoading();
          if (res.data.code == 200) {
            console.log(res)
            that.setData({
              optionDatas: res.data.data
            })
          } else {
            wx.showToast({
              title: res.data,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail() {
          wx.showToast({
            title: '服务器繁忙',
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      this.checkLogin()
    }
  },

  checkLogin() {
    wx.showToast({
      title: '未登录',
      icon: 'none',
      duration: 2000
    })
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