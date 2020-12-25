// pages/my-details-text/my-details-text.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    introduce: null,
    myId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var data = options.data
    var id = options.id
    var pid = JSON.parse(id)
    var pdata = JSON.parse(data)
    this.setData({
      introduce: pdata,
      myId: pid
    })
    console.log(this.data.introduce)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  //保存个人介绍
  saveText: function (e) {
    var token = wx.getStorageSync('token')
    var introduce = e.detail.value.introduce
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'user/update_introduce',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': token
      },
      data: {
        'introduce': introduce
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.navigateBack({
              url: '/pages/personal/personal',
            })
          }, 2000) //延迟时间 这里是1秒


        } else {
          wx.showToast({
            title: '修改失败',
            duration: 2000
          })
        }
      }
    })
  },

  //保存昵称
  saveName: function (e) {
    var token = wx.getStorageSync('token')
    var name = e.detail.value.introduce 
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'user/update_nickname',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': token
      },
      data: {
        'name': name
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            //要延时执行的代码
            wx.navigateBack({
              url: '/pages/my-details/my-details',
            })
          }, 1000)


        } else {
          wx.showToast({
            title: '修改失败',
            duration: 2000
          })
        }
      }
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