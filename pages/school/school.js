// pages/school/school.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '',
    city: '',
    school: '',
    schoolId: '',
    SID: '',
    personal:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var token = wx.getStorageSync('token')
    var personal = wx.getStorageSync('personal')
    var SID = options.status
    this.setData({
      personal:personal
    })
    if (token) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.url + 'index/city',
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'token': token
        },
        success: res => {
          wx.hideLoading()
          that.setData({
            city: res.data.data,
            status: 0,
            SID: SID
          })
        }
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //返回首页
  goback: function (e) {
    var id = e.currentTarget.dataset.id
    var schoolName = e.currentTarget.dataset.schoolname
    wx.switchTab({
      url: '/pages/home/home',
    })
    app.globalData.schoolId = id
    app.globalData.schoolName = schoolName
  },

  // 选择学校
  cityId: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    var id = e.currentTarget.dataset.id
    if (token) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.url + 'index/school',
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'token': token
        },
        data: {
          'city_id': id
        },
        success: res => {
          wx.hideLoading()
          that.setData({
            school: res.data.data,
            status: 1
          })
        }
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    }
  },


  // 重新选择学校
  schoolId: function (e) {
    var id = e.currentTarget.dataset.id
    var schoolName = e.currentTarget.dataset.schoolname
    if (this.data.SID == 0) {
      console.log(1)
      wx.switchTab({
        url: '/pages/home/home'
      })
      app.globalData.schoolId = id
      app.globalData.schoolName = schoolName
    }else{
      console.log(2)
      wx.navigateTo({
        url: '/pages/personal-data/personal-data',
      })
      app.globalData.MySchoolId = id
      app.globalData.MySchoolName = schoolName
    }

  },

  //个人信息选择学校



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