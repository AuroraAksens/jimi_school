let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    // 已授权是true，未授权是false
    state: null,
    selected: 0,
    color: "#646C74",
    selectedColor: "#FDAE3C",
    list: [{
        pagePath: "/pages/home/home",
        text: "首页",
        iconPath: "/images/tabbar/Home.png",
        selectedIconPath: "/images/tabbar/HomeSelect.png"
      },
      {
        pagePath: "/pages/my/my",
        text: "我的",
        iconPath: "/images/tabbar/My.png",
        selectedIconPath: "/images/tabbar/MySelect.png"
      }
    ],
    sta: 0,
    popUp: true,

    //0为开启  1为关闭
    type: 1,

    //用户协议
    agreement: false,
    agreementStatus: true,
  },

  attached() {
    var guide = wx.getStorageSync('guide')
    if (guide == 1) {
      this.setData({
        type: 1
      })
    } else {
      this.setData({
        type: 0
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转+高亮
    switchTab(e) {
      let data = e.currentTarget.dataset
      let url = data.path
      wx.switchTab({
        url
      })
      this.setData({
        selected: data.index
      })
    },
    // 动态弹框
    dySelect() {
      if (this.data.sta == 0) {
        this.setData({
          sta: 1
        })
      } else {
        this.setData({
          sta: 0
        })
      }
    },

    //拒绝授权
    noEmpower: function () {
      this.setData({
        state: true
      })
    },

    //登录授权

    bindGetUserInfo(e) {
      if (e.detail.errMsg == "getUserInfo:fail auth deny") {
        wx.setStorageSync('userInfoType', false)
        wx.showToast({
          icon: 'none',
          title: '未授权',
        })
        this.setData({
          state: true
        })
      } else {
        wx.showToast({
          title: '授权成功，请前往我的页面登录',
          icon: 'none',
          duration: 3000
        })
        var userinfo = JSON.parse(e.detail.rawData)
        wx.setStorageSync('userInfoType', true)
        app.globalData.userInfo = userinfo
        this.setData({
          state: true
        })
      }
    },

    //引导页
    guideType: function () {
      wx.setStorageSync('guide', 1)
      this.setData({
        type: 1
      })
    },

    //清楚弹框状态
    clearstatus: function () {
      this.setData({
        sta: 0
      })
    },


    //用户协议
    showagreement: function () {
      let agreement = this.data.agreement
      if (agreement == true) {
        this.setData({
          agreement: false
        })
      } else {
        this.setData({
          agreement: true
        })
      }
    },

    showagr: function (e) {
      console.log(e.currentTarget.dataset.checked)
      let agreementStatus = this.data.agreementStatus
      if (agreementStatus == true) {
        this.setData({
          agreementStatus: false
        })
      } else {
        this.setData({
          agreementStatus: true
        })
      }
    },

    showtongyi: function () {
      wx.showToast({
        title: '请先同意用户协议',
        icon: 'none',
        duration: 2000
      })
    }

  }
})