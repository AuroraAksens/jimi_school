// pages/dynamic/dynamic.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrImg: [],
    postImg: [],

    //登录验证
    type: false,

    //切换
    statusID: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var statusID = options.statusID
    var token = wx.getStorageSync('token')
    if (token) {
      this.setData({
        type: true,
        statusID: statusID
      })
    } else {
      this.setData({
        type: false,
        statusID: statusID
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //上传图片
  chooseImg: function () {
    var that = this
    var token = wx.getStorageSync('token')
    if (token) {
      wx.chooseImage({
        count: 9,
        success(res) {
          let tempFilePaths = res.tempFilePaths
          let imageArray = that.data.arrImg.concat(tempFilePaths)
          // that.data.arrImg.push(tempFilePaths[0])
          that.setData({
            arrImg: imageArray
          })
          wx.showLoading({
            title: '上传中',
          })
          if (that.data.statusID == 0) {
            console.log('动态图片')
            for (var i = 0; i < tempFilePaths.length; i++) {
              wx.uploadFile({
                url: app.globalData.url + 'user/image',
                filePath: tempFilePaths[i],
                name: 'image',
                header: {
                  "Content-Type": "multipart/form-data",
                  'token': token
                },
                formData: {
                  type: 1
                },
                success(res) {
                  console.log(res.data)
                  var dataItem = JSON.parse(res.data)
                  console.log(dataItem)
                  that.data.postImg.push(dataItem.data.url)
                }
              })
            }
            wx.hideLoading()
          } else {
            console.log('交易图片')
            for (var i = 0; i < tempFilePaths.length; i++) {
              wx.uploadFile({
                url: app.globalData.url + 'user/image',
                filePath: tempFilePaths[i],
                name: 'image',
                header: {
                  "Content-Type": "multipart/form-data",
                  'token': token
                },
                formData: {
                  type: 4
                },
                success(res) {
                  var dataItem = JSON.parse(res.data)
                  that.data.postImg.push(dataItem.data.url)
                }
              })
            }
            wx.hideLoading()
          }
        }
      })
    } else {
      wx.showToast({
        title: '请登录',
      })
    }
  },


  //预览图片
  showImg: function (e) {
    let imgSrc = e.currentTarget.dataset.imgsrc
    wx.previewImage({
      current: imgSrc,
      urls: this.data.arrImg
    })
  },

  //限制登录
  checkLogin() {
    wx.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000
    })
  },

  //提交动态数据
  postText: function (e) {
    var token = wx.getStorageSync('token')
    var text = e.detail.value.text
    var img = this.data.postImg
    wx.showLoading({
      title: '加载中',
    })
    console.log(img.length)
    console.log(this.data.arrImg.length)

    if (img.length != this.data.arrImg.length) {
      wx.showToast({
        title: '图片上传中',
        icon: 'loading',
      })
    } else {
      wx.request({
        url: app.globalData.url + 'release/dynamic',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'token': token
        },
        data: {
          'content': text,
          'images': img
        },
        success(res) {
          wx.hideLoading()
          if (res.data.code == 200) {
            wx.showToast({
              title: '发布成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              //要延时执行的代码
              wx.switchTab({
                url: '/pages/home/home',
              })
            }, 2000) //延迟时间 这里是1秒

          } else {
            wx.showToast({
              title: '发布失败',
              duration: 2000
            })
          }
        }
      })
    }
  },

  //提交市场数据
  postTransaction: function (e) {
    var token = wx.getStorageSync('token')
    var text = e.detail.value.text
    var img = this.data.postImg
    if (img.length != this.data.arrImg.length) {
      wx.showToast({
        title: '图片上传中',
        icon: 'loading',
      })
    } else {
      wx.showModal({
        title: '发布市场交易提示',
        content: '发布市场交易需要手续费,确认需要发布吗',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '加载中',
            })
            wx.request({
              url: app.globalData.url + 'release/deal',
              method: 'POST',
              header: {
                'content-type': 'application/json',
                'token': token
              },
              data: {
                'content': text,
                'images': img
              },
              success(res) {
                wx.hideLoading()
                console.log(res.data.data)
                if (res.data.code == 200) {
                  wx.requestPayment({
                    timeStamp: res.data.data.timeStamp,
                    nonceStr: res.data.data.nonceStr,
                    package: res.data.data.package,
                    signType: 'MD5',
                    paySign: res.data.data.paySign,
                    success(res) {
                      wx.showToast({
                        title: '发布成功',
                        icon: 'success',
                        duration: 2000
                      })
                      setTimeout(function () {
                        //要延时执行的代码
                        wx.switchTab({
                          url: '/pages/home/home',
                        })
                      }, 2000) //延迟时间 这里是1秒
                    },
                    fail(res) {
                      wx.showToast({
                        title: '支付失败',
                        icon: 'none',
                        duration: 2000
                      })
                    }
                  })
                } else {
                  wx.showToast({
                    title: res.data,
                    duration: 2000
                  })
                }
              }
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  //删除图片
  deleteImage: function (e) {
    var that = this;
    var arrImg = that.data.arrImg;
    var postImg = that.data.postImg
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          arrImg.splice(index, 1);
          postImg.splice(index, 1)
          that.setData({
            arrImg: arrImg,
            postImg: postImg
          });
        } else if (res.cancel) {
          return false;
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