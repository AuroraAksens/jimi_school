//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {

      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })


    // 更新提示
    var e = wx.getUpdateManager();
    e.onCheckForUpdate(function (e) {}), e.onUpdateReady(function () {
      wx.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否马上重启小程序？",
        success: function (t) {
          t.confirm && e.applyUpdate();
        }
      });
    }), e.onUpdateFailed(function () {
      wx.showModal({
        title: "更新提示",
        content: "新版本下载失败",
        showCancel: !1
      });
    });

  },



  globalData: {
    userInfo: null,
    url: 'https://jimmy.01snt.com/api/',
    // 图片路径
    urls: 'http://qn.jimmy.01snt.com/',
    userInfoType: false,

    //首页学校
    schoolId: '',
    schoolName: '',

    //个人信息学校
    MySchoolId: '',
    MySchoolName: '',

    userGender: null,

    //评论数
    comment: ''
  }
})