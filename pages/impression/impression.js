// pages/impression/impression.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,

    //用户数据
    userData: '',

    //标签数据
    label: '',

    labelId: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = JSON.parse(options.data)
    this.setData({
      userData: data
    })

    var that = this
    // var userId = that.data.userData.id
    var token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'user/effect',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token': token
      },
      success: res => {
        wx.hideLoading()
        let a = []
        for (let i = 0; i < res.data.data.length; i++) {
          res.data.data[i].type = false
          a.push(res.data.data[i])
          console.log(res.data.data[i])
        }
        console.log(a)
        that.setData({
          label: a,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //高亮标签
  showlabel: function (e) {
    var index = e.currentTarget.dataset.index
    var id = e.currentTarget.dataset.id
    var a = this.data.labelId
    if (a.length >= 3) {
      console.log("拒绝")
    } else {
      a.push(id)
      this.data.label[index].type = true
      this.setData({
        label: this.data.label,
        labelId: a
      })
    }
    console.log(this.data.label)
  },

  //提交印象
  postlabel: function(){
    var that = this
    var token = wx.getStorageSync('token')
    var id = this.data.userData.id
    var labelId = this.data.labelId
    var str = labelId.join(',')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'user/add_effect',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': token
      },
      data:{
        id:id,
        effect:str
      },
      success: res => {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        wx.hideLoading()
        if(res.data.code == 200){
          setTimeout(function(){
            wx.navigateBack()
          },2000)
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