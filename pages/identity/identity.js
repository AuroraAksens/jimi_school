// pages/identity/identity.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 提交给后端的数据
    imageData: '',
    imageDatas: '',

    // 渲染的数据
    imageData1: '',
    imageDatas2: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //上传身份证正面
  chooseImg: function () {
    var that = this
    var token = wx.getStorageSync('token')
    if (token) {
      wx.chooseImage({
        count: 1,
        success(res) {
          const tempFilePaths = res.tempFilePaths
          that.setData({
            imageData1: tempFilePaths
          })
          wx.showLoading({
            title: '上传中',
          })
          wx.uploadFile({
            url: app.globalData.url + 'user/image',
            filePath: tempFilePaths[0],
            name: 'image',
            header: {
              "Content-Type": "multipart/form-data",
              'token': token
            },
            formData: {
              type: 0
            },
            success(res) {
              wx.hideLoading()
              const data = JSON.parse(res.data)
              that.setData({
                imageData: data.data.url
              })
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: '请登录',
      })
    }
  },


  //上传身份证反面
  chooseImgs: function () {
    var that = this
    var token = wx.getStorageSync('token')
    if (token) {
      wx.chooseImage({
        count: 1,
        success(res) {
          const tempFilePaths = res.tempFilePaths
          that.setData({
            imageDatas2: tempFilePaths
          })
          wx.showLoading({
            title: '上传中',
          })
          wx.uploadFile({
            url: app.globalData.url + 'user/image',
            filePath: tempFilePaths[0],
            name: 'image',
            header: {
              "Content-Type": "multipart/form-data",
              'token': token
            },
            formData: {
              type: 0
            },
            success(res) {
              wx.hideLoading()
              const data = JSON.parse(res.data)
              that.setData({
                imageDatas: data.data.url
              })
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: '请登录',
      })
    }
  },

  //上传身份证
  addIdCard: function () {
    var that = this
    var token = wx.getStorageSync('token')
    var imageData = this.data.imageData.length
    var imageDatas = this.data.imageDatas.length
    
    if (imageDatas && imageData) {
      wx.showLoading({
        title: '提交中',
      })
      wx.request({
        url: app.globalData.url + 'user/addIdCard',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'token': token
        },
        data: {
          'front_image': that.data.imageData,
          'side_image': that.data.imageDatas,
        },
        success: res => {
          wx.hideLoading()
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/my/my',
            })
          }, 1000)

        }
      })
    }else{
      wx.showToast({
        title: '图片上传中',
        icon:'none',
        duration:2000
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