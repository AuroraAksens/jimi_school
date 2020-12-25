var app = getApp()

// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sta: 1,

    //个人信息
    userInfo: '',

    //统计
    userCensus: '',

    //动态任务
    userTask: '',

    //vip显示
    vipshow: null,

    //接单同学id
    userid: '',

    //同学印象
    userEffect: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var token = wx.getStorageSync('token')
    var userStatus = wx.getStorageSync('userStatus')
    var userInfoID = wx.getStorageSync('userInfoID')
    var userid = options.userid
    console.log(userInfoID)
    console.log(userid)


    this.setData({
      userid: userid
    })

    if (userid == undefined) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.url + 'user/personal_task/' + 1 + '?user_id=' + userInfoID,
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'token': token
        },
        success: res => {
          wx.hideLoading()
          if (res.data.code == 200) {
            that.setData({
              userTask: res.data.data,
              vipshow: userStatus,
              sta: 1
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    } else {

      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.url + 'user/personal_task/' + 1 + '?user_id=' + userid,
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'token': token
        },
        success: res => {
          wx.hideLoading()
          if (res.data.code == 200) {
            that.setData({
              userTask: res.data.data,
              vipshow: userStatus,
              sta: 1
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //分享
  onShareAppMessage: function (res) {
    var id = res.target.dataset.id
    var status = res.target.dataset.status
    console.log(id)
    console.log(status)
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '自定义转发标题',
      path: 'pages/details/details?status=' + status + '&id=' + id
    }
  },

  //导航高亮
  selectSta: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    var userInfoID = wx.getStorageSync('userInfoID')
    var userid = this.data.userid
    this.setData({
      sta: e.currentTarget.dataset.index
    })
    if (userid == undefined) {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.url + 'user/personal_task/' + e.currentTarget.dataset.index + '?user_id=' + userInfoID,
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'token': token
        },
        success: res => {
          wx.hideLoading()
          if (res.data.code == 200) {
            that.setData({
              userTask: res.data.data
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.url + 'user/personal_task/' + e.currentTarget.dataset.index + '?user_id=' + userid,
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'token': token
        },
        success: res => {
          wx.hideLoading()
          if (res.data.code == 200) {
            that.setData({
              userTask: res.data.data
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
  },

  //跳转个人详情页
  goMyDetails: function () {
    wx.navigateTo({
      url: '/pages/my-details/my-details'
    })
  },

  //添加印象
  goImpression: function () {
    var userdata = this.data.userInfo
    var data = {
      id: userdata.id,
      name: userdata.name,
      school: userdata.school.name,
      image: userdata.image,
      grade: userdata.grade
    }
    console.log(data)
    data = JSON.stringify(data)
    wx.navigateTo({
      url: '/pages/impression/impression?data=' + data
    })
  },

  //跳转个人详情文本
  goDetailsText: function () {
    wx.navigateTo({
      url: '/pages/my-details-text/my-details-text',
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    var token = wx.getStorageSync('token')
    var userInfoID = wx.getStorageSync('userInfoID')
    var userid = this.data.userid
    if (userid == undefined) {
      wx.request({
        url: app.globalData.url + 'user/personal?user_id=' + userInfoID,
        method: 'GET',
        header: {
          'token': token
        },
        success: res => {
          if (res.data.code == 200) {
            that.setData({
              userInfo: res.data.data.userInfo,
              userCensus: res.data.data.userCensus,
              userEffect: res.data.data.userEffect
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
          console.log(that.data.userInfo)
          console.log(that.data.userCensus)
          console.log(that.data.userEffect)
        }
      })
    } else {
      wx.request({
        url: app.globalData.url + 'user/personal?user_id=' + userid,
        method: 'GET',
        header: {
          'token': token
        },
        success: res => {
          if (res.data.code == 200) {
            that.setData({
              userInfo: res.data.data.userInfo,
              userCensus: res.data.data.userCensus,
              userEffect: res.data.data.userEffect
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
          console.log(that.data.userInfo)
          console.log(that.data.userCensus)
          console.log(that.data.userEffect)
        }
      })
    }

  },

  //跳转详情页 
  gotoDetails: function (e) {
    var id = e.currentTarget.dataset.id
    var status = this.data.sta
    var comment = e.currentTarget.dataset.comment
    app.globalData.comment = comment
    wx.navigateTo({
      url: '/pages/details/details?status=' + status + '&id=' + id,
    })
  },

  //点赞
  giveGood: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var status = this.data.sta
    var index = e.currentTarget.dataset.index
    var token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'index/article_good',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': token
      },
      data: {
        itemId: id,
        status: status
      },
      success: res => {
        wx.hideLoading()
        if (res.data.data) {
          that.data.userTask[index].good++
          that.data.userTask[index].good_status = true
          that.setData({
            userTask: that.data.userTask
          })
          wx.showToast({
            title: '点赞成功',
            icon: 'none'
          })
        } else {
          that.data.userTask[index].good--
          that.data.userTask[index].good_status = false
          that.setData({
            userTask: that.data.userTask
          })
          wx.showToast({
            title: '取消成功',
            icon: 'none'
          })
        }
      }
    })
  },

  //跳转接单页
  gotoMyTask: function () {
    wx.navigateTo({
      url: '/pages/my-task/my-task',
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