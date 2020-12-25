// pages/my/my.js
var app = getApp()
Component({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',

    // 已给授权用户数据就是true，没有就是false
    userInfoType: null,

    // 没登录就是ture，登录了就是false
    type: null,

    //用户数据
    userInfo: '',

    //认证状态
    status: null,

    //是否进入个人信息状态
    personal: '',

    //性别判断
    userGender:null,

    imgData: [{
      id: 0,
      image: "/images/icon/my/receive.png",
      name: "待接单",
      goPath: '/pages/personal/personal'
    }, {
      id: 1,
      image: "/images/icon/my/meet.png",
      name: "已接单",
      goPath: '/pages/personal/personal'
    }, {
      id: 2,
      image: "/images/icon/my/settlement.png",
      name: "待结算",
      goPath: '/pages/personal/personal'
    }, {
      id: 3,
      image: "/images/icon/my/money.png",
      name: "已结算",
      goPath: '/pages/personal/personal'
    }, {
      id: 4,
      image: "/images/icon/my/cancel.png",
      name: "已取消",
      goPath: '/pages/personal/personal'
    }],

    //认证前的选项卡
    optionData: [{
      image: "/images/icon/my/personal.png",
      name: "个人中心",
      goPath: '/pages/personal/personal'
    }, {
      image: "/images/icon/my/authentication.png",
      name: "成为认证用户",
      goPath: '/pages/become/become'
    }, {
      image: "/images/icon/my/message.png",
      name: "消息",
      goPath: '/pages/message/message'
    }, {
      image: "/images/icon/my/wallet.png",
      name: "钱包",
      goPath: '/pages/money/money'
    }, {
      image: "/images/icon/my/help.png",
      name: "帮助与反馈",
      goPath: '/pages/help/help'
    }],

    //认证后的选项卡
    optionDatas: [{
      image: "/images/icon/my/personal.png",
      name: "个人中心",
      goPath: '/pages/personal/personal'
    }, {
      image: "/images/icon/my/myOrder.png",
      name: "我的接单",
      goPath: '/pages/my-task/my-task'
    }, {
      image: "/images/icon/my/message.png",
      name: "消息",
      goPath: '/pages/message/message'
    }, {
      image: "/images/icon/my/wallet.png",
      name: "钱包",
      goPath: '/pages/money/money'
    }, {
      image: "/images/icon/my/help.png",
      name: "帮助与反馈",
      goPath: '/pages/help/help'
    }],

  },

  pageLifetimes: {
    show() {
      var that = this
      // 这个是判断用户有没有给授权用户信息的
      var userInfoType = wx.getStorageSync('userInfoType')
      var personal = wx.getStorageSync('personal')
      that.setData({
        userInfoType: userInfoType,
        personal: personal
      })

      // 获取缓存里面的token，判断如果是登录了就做什么操作没登录做什么操作
      var token = wx.getStorageSync('token')
      if (token) {
        // 已登录状态
        that.setData({
          type: false
        })
        that.getUserinfo(token)
        //获取认证状态
      } else {
        // 未登录状态
        that.setData({
          type: true
        })
      }

      that.getTabBar().setData({
        selected: 1
      });


    }
  },

  created() {
    var that = this
    wx.login({
      success(res) {
        if (res.code) {
          that.setData({
            code: res.code
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },


  //方法
  methods: {

    //未登录提示
    checkLogin() {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    },

    // 登录事件，会去调用封装的登录事件
    getPhoneNumber(e) {
      // 判断用户是否授权手机号的时候点击了拒绝
      var e = e
      var that = this
      wx.login({
        success(res) {
          if (res.code) {
            that.setData({
              code: res.code
            })
            // 如果登录状态过期会去调起封装好的登录事件并传入参数
            that.chekc(e)
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
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
            that.setData({
              userInfo: res.data.data,
              userGender: res.data.data.genderlist
            })
            app.globalData.userGender = res.data.data.genderlist
            console.log(app.globalData.userGender)
            wx.setStorageSync('MySchoolid', that.data.userInfo.school_id) //学校ID
            wx.setStorageSync('userInfoID', that.data.userInfo.id) //用户ID
            wx.setStorageSync('userStatus', that.data.userInfo.status) //认证ID
          }
        }
      })
    },
    // 封装的登录事件
    chekc(e) {
      var that = this
      console.log(app.globalData.userInfo.nickName)
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: app.globalData.url + 'login', //仅为示例，并非真实的接口地址
          method: 'POST',
          data: {
            // 登录凭证
            'code': that.data.code,
            // 解密手机号码需要用到的参数
            'iv': e.detail.iv,
            'encryptedData': e.detail.encryptedData,
            // 用户授权信息数据
            'name': app.globalData.userInfo.nickName,
            'image': app.globalData.userInfo.avatarUrl,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res)
            wx.hideLoading();
            if (res.data.code == 200) {
              // 登录成功，服务器会返回应该token，我们把它存在缓存里，通过这个token在每个页面的onshow方法中判断用户是否是登录了。
              var token = res.data.data.token
              wx.setStorageSync('token', token)
              wx.setStorageSync('personal', res.data.data.personal)
              that.getUserinfo(token)
              wx.showToast({
                title: '登录成功',
                icon: 'none',
                duration: 1000
              })
              that.setData({
                type: false,
                personal: res.data.data.personal
              })
              console.log(res.data.data.personal)
              if (res.data.data.personal == 0) {
                setTimeout(function () {
                  wx.reLaunch({
                    url: '/pages/personal-data/personal-data',
                  })
                }, 1000)
              }
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
              that.setData({
                type: true,
              })
            }
          }
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '请允许授权',
        })
      }
    },


    //跳转我的任务
    goTask: function (e) {
      wx.navigateTo({
        url: '/pages/task/task?id=' + e.currentTarget.dataset.id
      })
    },

    // 跳转选项卡
    goto: function (e) {
      let url = e.currentTarget.dataset.path
      wx.navigateTo({
        url
      })
    },

    //退出登录
    clearToken: function () {
      var that = this
      var token = wx.getStorageSync('token')
      wx.showModal({
        title: '确定要退出登录吗？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.showLoading({
              title: '加载中',
            })
            wx.request({
              url: app.globalData.url + 'user/',
              method: 'GET',
              header: {
                'token': token
              },
              success: res => {
                wx.hideLoading()
                console.log(res.data)
                wx.showToast({
                  title: '退出登录成功',
                  icon: 'none',
                  duration: 2000
                })
                that.setData({
                  type: true
                })
              }
            })
            wx.setStorageSync('token', '')
          } else if (res.cancel) {
            console.log('用户点击取消')
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