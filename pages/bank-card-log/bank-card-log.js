var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sta: '',
    title: [{
      index: 1,
      name: '审核中'
    }, {
      index: 3,
      name: '审核失败'
    }, {
      index: 2,
      name: '审核成功'
    }, {
      index: 4,
      name: '已提现'
    }],

    taskData: [],

    //点赞
    good: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var token = wx.getStorageSync('token')
    this.setData({
      sta: 1
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'wallet/record/' + 1,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': token
      },
      success: res => {
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            taskData: res.data.data
          })
        } else {
          wx.showToast({
            title: res.data,
            icon: 'none',
            duration: 2000
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //高亮标题
  selectTitle: function (e) {

    var that = this
    let data = e.currentTarget.dataset.index
    var token = wx.getStorageSync('token')
    this.setData({
      sta: data
    })
    if (data == 4) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.url + 'wallet/record/' + 2,
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'token': token
        },
        success: res => {
          wx.hideLoading();
          if (res.data.code == 200) {
            that.setData({
              taskData: res.data.data
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
    } else {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.url + 'wallet/record/' + data,
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'token': token
        },
        success: res => {
          wx.hideLoading();
          if (res.data.code == 200) {
            that.setData({
              taskData: res.data.data
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
    }


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