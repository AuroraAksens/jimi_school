// pages/order/order.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //快递数据
    listData: '',

    //其他任务数据
    orderData: '',

    //路径拼接
    src: app.globalData.urls,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = JSON.parse(options.data)
    this.setData({
      listData: data
    })
    console.log(data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  //拉起模板消息并提交快递数据
  posttmplIdsTask: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.url + 'template?key=' + 'order_received,order_success',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token': token
      },
      success: res => {
        var tmplIds = res.data.data
        wx.hideLoading()
        console.log(tmplIds)
        wx.requestSubscribeMessage({
          tmplIds: tmplIds,
          success(res) {
            console.log('拉起模板')
            that.postData()
          }
        })
      }
    })
  },

  //拉起模板消息并提交其他数据
  posttmplIdsOrder: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.globalData.url + 'template?key=' + 'order_received,order_success',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token': token
      },
      success: res => {
        var tmplIds = res.data.data
        wx.hideLoading()
        console.log(tmplIds)
        wx.requestSubscribeMessage({
          tmplIds: tmplIds,
          success(res) {
            console.log('拉起模板')
            that.postOrder()
          }
        })
      }
    })
  },

  //提交快递数据
  postData: function () {
    var that = this
    var userName = this.data.listData.userName //姓名
    var userPhone = this.data.listData.userPhone //电话
    var userExpress = this.data.listData.userExpress //快递信息
    var userMoney = this.data.listData.userMoney //赏金
    var remarks = this.data.listData.userRemarks // 备注
    var images = this.data.listData.images // 提交图片路径
    var token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'release/task',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': token
      },
      data: {
        'type': 0,
        'name': userName,
        'phone': userPhone,
        'item': userExpress,
        'money': userMoney,
        'remarks': remarks
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          console.log(res.data)
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
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },


  //提交其他任务数据
  postOrder: function () {
    var userName = this.data.listData.userName //姓名
    var userPhone = this.data.listData.userPhone //电话
    var userMoney = this.data.listData.userMoney // 赏金
    var userOtherMessage = this.data.listData.userOtherMessage //任务描述
    var images = this.data.listData.images // 提交图片路径
    var remarks = this.data.listData.userRemarks  //备注
    var token = wx.getStorageSync('token')
    console.log(images)
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'release/task',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': token
      },
      data: {
        'type': 1,
        'name': userName,
        'phone': userPhone,
        'represent': userOtherMessage,
        'images': images,
        'money': userMoney,
        'remarks': remarks
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          console.log(res.data)
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
        } else {
          wx.showToast({
            title: '发布失败或者当前有一个正在进行中的任务',
            icon: 'none',
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