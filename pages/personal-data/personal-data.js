// pages/personal-data/personal-data.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //年级
    date: '请选择年份',

    //用户名字
    name: '',

    //学校ID
    schoolID: '',

    //学校名字
    schoolName: '',

    //性别 0女生 1男生
    gender: null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideHomeButton({})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  //获取姓名
  bindName: function (e) {
    var name = e.detail.value
    // this.setData({
    //   name: name
    // })
    app.globalData.userInfo.nickName = name
  },


  //选择日期
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  //选择学校
  bindSchoolChange: function () {
    wx.navigateTo({
      url: '/pages/school/school?status=' + 1,
    })
  },

  //选择男生
  boySelect: function () {
    this.setData({
      gender: 1
    })
  },

  //选择女生
  girlSelect: function () {
    this.setData({
      gender: 0
    })
  },


  //提交数据
  postData: function () {
    var that = this
    var name = app.globalData.userInfo.nickName // 姓名
    var schoolID = that.data.schoolID // 学校ID
    var date = Number(that.data.date) // 年级
    var gender = that.data.gender // 性别
    var token = wx.getStorageSync('token')
    console.log(schoolID)
    if (name != '' && schoolID != ''  && date != undefined && gender != null) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.url + 'user/user_personal',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'token': token
        },
        data: {
          'name': name,
          'schoolId': schoolID,
          'grade': date,
          'gender': gender,

        },
        success: res => {
          wx.hideLoading()
          
          if (res.data.code == 200) {
            wx.showToast({
              title: '提交成功',
              icon: 'none',
              duration: 2000
            })
            that.getUserinfo(token)
            // wx.setStorageSync('key', data)
            setTimeout(function () {
              wx.reLaunch({
                url: '/pages/my/my',
              })
            }, 1000)
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
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


   // 获取用户信息
   getUserinfo(e) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'user/',
      method: 'GET',
      header: {
        'token': e
      },
      success: res => {
        wx.hideLoading()
        if (res.data.code == 401) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
          that.setData({
            type: true
          })
        } else {
          app.globalData.userGender = res.data.data.genderlist
          console.log(app.globalData.userGender)
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      var userInfo = app.globalData.userInfo.nickName
      var schoolID = app.globalData.MySchoolId 
      var schoolName = app.globalData.MySchoolName
      this.setData({
        schoolID: schoolID,
        schoolName: schoolName,
        name: userInfo
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