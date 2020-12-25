// pages/my-details/my-details.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    img: '',
    image:'',
    type: 0
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

  //跳转个人详情文本
  goDetailsText: function () {
    wx.navigateTo({
      url: '/pages/my-details-text/my-details-text?data=' + JSON.stringify(this.data.userInfo.introduce) + '&id=' + 0,
    })
  },

  //跳转个人昵称修改
  goDetailsName: function () {
    wx.navigateTo({
      url: '/pages/my-details-text/my-details-text?data=' + JSON.stringify(this.data.userInfo.name) + '&id=' + 1,
    })
  },

  //修改头像
  fileImg: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.chooseImage({
      count: 1,
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '加载中',
        })
        wx.uploadFile({
          url: app.globalData.url + 'user/image',
          filePath: tempFilePaths[0],
          name: 'image',
          header: {
            'token': token,
            'content-type': 'application/json',
          },
          formData: {
            'type': 3
          },
          success(res) {
            wx.hideLoading()
            const data = JSON.parse(res.data)
            that.setData({
              img:data.data.url
            })
            wx.request({
              url: app.globalData.url + 'user/update_headImage',
              method:'POST',
              data: {
                'headImage': that.data.img
              },
              header: {
                'content-type': 'application/json',
                'token': token,
              },
              success(res) {
                console.log('头像上传')
                console.log(res.data)
                wx.showToast({
                  title: '修改头像成功',
                  icon: 'success',
                  duration: 2000
                })
                that.setData({
                  type: 1,
                  image:tempFilePaths
                })
              }
            })
          }
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'user/userInfo',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token': token
      },
      success(res) {
        wx.hideLoading()
        that.setData({
          userInfo: res.data.data
        })
      }
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