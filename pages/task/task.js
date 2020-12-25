// pages/task/task.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sta: '',
    title: [{
      index: 0,
      name: '待接单'
    }, {
      index: 1,
      name: '已接单'
    }, {
      index: 2,
      name: '待结算'
    }, {
      index: 3,
      name: '已结算'
    }, {
      index: 4,
      name: '已取消'
    } ],

    taskData:[],

    //点赞
    good: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    var that = this
    var token = wx.getStorageSync('token')
    this.setData({
      sta: id
    })
    if (token) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.url + 'user/user_task/' + id,
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'token': token
        },
        success:res=> {
          wx.hideLoading();
          if (res.data.code == 200) {
            that.setData({
              taskData:res.data.data
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
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1000
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },



  //跳转详情页 
  gotoDetails: function (e) {
    var id = e.currentTarget.dataset.id
    var status = e.currentTarget.dataset.status
    console.log(id)
    console.log(status)
    wx.navigateTo({
      url: '/pages/details/details?status=' + status + '&id=' + id,
    })
  },


  //高亮标题
  selectTitle: function (e) {
    let data = e.currentTarget.dataset.index
    var token = wx.getStorageSync('token')
    this.setData({
      sta: data
    })
    var that = this
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.url + 'user/user_task/' + data,
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'token': token
        },
        success:res=> {
          wx.hideLoading();
          if (res.data.code == 200) {
            that.setData({
              taskData:res.data.data
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