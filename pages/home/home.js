// pages/home/home.js
var app = getApp()
Component({

  /**
   * 页面的初始数据
   */
  data: {
    background: ['/images/index-img.png', '/images/index-img.png', '/images/index-img.png'],
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 800,
    circular: true,
    // 是否已点赞的状态，点赞了会为ture，没点赞会未fasle
    // type: '',

    dynamicState: 0,

    sta: '',

    // 导航条
    title: [{
      index: 0,
      name: '全部',
    }, {
      index: 1,
      name: '动态',
    }, {
      index: 2,
      name: '任务',
    }, {
      index: 3,
      name: '市场',
    }],

    //列表数据
    listData: '',

    //学校名字
    schoolName: '',

    //学校ID
    schoolId: '',

    //点赞
    good: false,

    //登录限制
    type: false,

    //轮播图
    banner: [],

    //vip显示
    vipshow: null,

    //滚动条
    scrollTop: '',

    //加载框
    showloading: false
  },

  pageLifetimes: {
    show() {
      var that = this
      var token = wx.getStorageSync('token')
      var schoolId = app.globalData.schoolId
      var schoolName = app.globalData.schoolName
      this.setData({
        schoolName,
        schoolId
      })
      if (token) {
        // 已登录状态
        that.setData({
          type: true,
        })
      } else {
        // 未登录状态
        that.setData({
          type: false,
        })
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: res => {
                  that.getTabBar().setData({
                    state: true,
                  });
                }
              })
            } else {
              that.getTabBar().setData({
                state: false,
              });
            }
          }
        })
      }
      that.getTabBar().setData({
        selected: 0
      });

      //首页数据渲染
      that.showHome()
    }
  },



  methods: {

    show() {
      this.setData({
        showloading: true
      })
    },

    hide() {
      this.setData({
        showloading: false
      })
    },

    onShareAppMessage: function (res) {
      console.log(res)
      var id = res.target.dataset.id
      var status = res.target.dataset.status
      console.log(id)
      console.log(status)
      if (res.from === 'button') {
        // 来自页面内转发按钮
      }
      return {
        path: 'pages/details/details?status=' + status + '&id=' + id
      }
    },


    //刷新页面数据
    onPullDownRefresh: function () {
      this.showHome()
    },

    // 检查登录
    checkLogin: function () {
      wx.showToast({
        title: '请登录后再试',
        icon: 'none'
      })
    },

    // 渲染首页数据
    showHome: function () {
      var that = this
      var token = wx.getStorageSync('token')
      var sta = this.data.sta
      wx.showLoading({
        title: '加载中'
      })
      if (that.data.schoolId != '') {
        wx.request({
          url: app.globalData.url + 'index/index_list/' + sta + '/' + that.data.schoolId,
          method: 'GET',
          header: {
            'content-type': 'application/json',
            'token': token
          },
          success: res => {
            wx.hideLoading()
            wx.stopPullDownRefresh()
            if (res.data.code == 200) {
              that.setData({
                listData: res.data.data.list,
                banner: res.data.data.banner,
                sta: sta
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
      } else if (sta != '') {
        wx.showLoading({
          title: '加载中'
        })
        wx.request({
          url: app.globalData.url + 'index/index_list/' + sta + '/' + 0,
          method: 'GET',
          header: {
            'content-type': 'application/json',
            'token': token
          },
          success: res => {
            this.hide()
            wx.hideLoading()
            wx.stopPullDownRefresh()
            if (res.data.code == 200) {
              that.setData({
                listData: res.data.data.list,
                banner: res.data.data.banner,
                sta: sta
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
          title: '加载中'
        })
        wx.request({
          url: app.globalData.url + 'index/index_list/' + 0 + '/' + 0,
          method: 'GET',
          header: {
            'content-type': 'application/json',
            'token': token
          },
          success: res => {
            this.hide()
            wx.hideLoading()
            wx.stopPullDownRefresh()
            if (res.data.code == 200) {
              that.setData({
                listData: res.data.data.list,
                banner: res.data.data.banner,
                sta: sta
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

    // 点击切换导航条
    selectTitle: function (e) {
      var that = this
      var token = wx.getStorageSync('token')
      wx.showLoading({
        title: '加载中'
      })
      that.setData({
        sta: e.currentTarget.dataset.index,
      })
      if (that.data.schoolId && that.data.sta != 1) {
        wx.request({
          url: app.globalData.url + 'index/index_list/' + e.currentTarget.dataset.index + '/' + that.data.schoolId,
          method: 'GET',
          header: {
            'content-type': 'application/json',
            'token': token
          },
          success: res => {
            wx.hideLoading()
            console.log(res.data.data.list)
            if (res.data.code == 200) {
              that.setData({
                listData: res.data.data.list,
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
        wx.request({
          url: app.globalData.url + 'index/index_list/' + e.currentTarget.dataset.index + '/' + 0,
          method: 'GET',
          header: {
            'content-type': 'application/json',
            'token': token
          },
          success: res => {
            wx.hideLoading()
            if (res.data.code == 200) {
              that.setData({
                listData: res.data.data.list,
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

    //切换动态
    showDynamic: function (e) {
      var that = this
      that.setData({
        dynamicState: e.currentTarget.dataset.state
      })
      console.log(that.data.dynamicState)
      var MySchoolID = wx.getStorageSync('MySchoolid')
      if (that.data.dynamicState == 1) {
        that.getshowDynamic(MySchoolID)
        that.setData({
          dynamicState: 1
        })
      } else {
        that.getshowDynamic(0)
        that.setData({
          dynamicState: 0
        })
      }
    },

    //  获取学校动态
    getshowDynamic(e) {
      var that = this
      var token = wx.getStorageSync('token')
      wx.showLoading({
        title: '加载中'
      })
      wx.request({
        url: app.globalData.url + 'index/index_list/' + 1 + '/' + e,
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'token': token
        },
        success: res => {
          wx.hideLoading()
          if (res.data.code == 200) {
            that.setData({
              listData: res.data.data.list,
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
    },

    //跳转详情页 
    gotoDetails: function (e) {
      var id = e.currentTarget.dataset.id
      var status = e.currentTarget.dataset.status
      var comment = e.currentTarget.dataset.comment
      app.globalData.comment = comment
      wx.navigateTo({
        url: '/pages/details/details?status=' + status + '&id=' + id + '&comLA=false',
      })
    },

    //跳转详情页 2
    gotoDetails2: function (e) {
      var id = e.currentTarget.dataset.id
      var status = e.currentTarget.dataset.status
      var comment = e.currentTarget.dataset.comment
      app.globalData.comment = comment
      wx.navigateTo({
        url: '/pages/details/details?status=' + status + '&id=' + id + '&comLA=true',
      })
    },


    //监听回到顶部
    onPageScroll: function (e) {
      if (e.scrollTop > 100) {
        this.setData({
          floorstatus: true
        });
      } else {
        this.setData({
          floorstatus: false
        });
      }
    },

    //回到顶部
    goTop: function (e) {
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        })
      }
    },

    //选择学校
    getoSchool: function () {
      wx.navigateTo({
        url: '/pages/school/school?status=' + 0,
      })
    },

    //点赞
    giveGood: function (e) {
      var that = this
      var id = e.currentTarget.dataset.id
      var status = e.currentTarget.dataset.status
      var index = e.currentTarget.dataset.index
      var token = wx.getStorageSync('token')
      this.setData({

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
            that.data.listData[index].good++
            that.data.listData[index].good_status = true
            that.setData({
              listData: that.data.listData
            })
            wx.showToast({
              title: '点赞成功',
              icon: 'none'
            })
          } else {
            that.data.listData[index].good--
            that.data.listData[index].good_status = false
            that.setData({
              listData: that.data.listData
            })
            wx.showToast({
              title: '取消成功',
              icon: 'none'
            })
          }
        }
      })
    },

  },
})