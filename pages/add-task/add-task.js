// pages/add-task/add-task.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sta: 0,
    inp: 0,
    imgArr: [],
    postImg: [],
    src: app.globalData.urls,
    addExpress: [{
      access_place: "",
      service_place: "",
      message: "",
      images: []
    }],
    addOther: [{
      takePlace: "",
      goPlace: "",
      otherMessage: ""
    }],
    addExpressLength: 1,
    addExpresss: [],

    //用户数据
    userInfo: '',

    //取件地区
    access_place: '',

    //送达地点
    service_place: '',

    //取件信息
    message: '',

    //姓名
    userName: '',

    //电话
    userPhone: '',

    //备注
    userRemarks: '',

    //赏金
    userMoney: null,

    //规定赏金
    itemMoney: null,

    //其他任务描述
    otherMessage: '',

    //登录验证
    type: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync('token')
    if (token) {

      this.setData({
        type: true
      })
    } else {
      this.setData({
        type: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //限制登录
  checkLogin() {
    wx.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000
    })
  },

  //输入限制
  limit: function () {
    wx.showToast({
      title: '赏金不能少于3元',
      icon: 'none',
      duration: 2000
    })
  },

  //上传图片
  postImg: function (e) {
    var index = e.currentTarget.dataset.index
    var addExpress = this.data.addExpress[index].images
    const that = this
    const token = wx.getStorageSync('token')
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '上传中',
        })
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
              type: 2
            },
            success(res) {
              wx.hideLoading()
              var dataItem = JSON.parse(res.data)
              addExpress.push(dataItem.data.url)
              that.setData({
                addExpress: that.data.addExpress
              })
            }
          })
        }
      }
    })
  },

  postImgs: function (e) {
    const that = this
    const token = wx.getStorageSync('token')
    var postImg = that.data.postImg 
    var imgArr = that.data.imgArr 
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '上传中',
        })
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
              type: 2
            },
            success(res) {
              wx.hideLoading()
              var dataItem = JSON.parse(res.data)
              postImg.push(dataItem.data.url)
              imgArr.push(tempFilePaths)
              that.setData({
                imgArr: imgArr,
                postImg:postImg
              })
              console.log(that.data.imgArr)
              console.log(that.data.postImg)
            }
          })
        }
      }
    })
  },

  //预览图片
  messImg: function (e) {
    const imgKey = e.currentTarget.dataset.src
    console.log(imgKey)
    wx.previewImage({
      current: imgKey,
      urls: this.data.imgArr
    })
  },

  //提交表单并跳转 -- 快递
  postTask: function () {
    var userName = this.data.userName //姓名
    var userPhone = this.data.userPhone //电话
    var userMoney = this.data.userMoney // 赏金
    var userNumber = this.data.addExpress.length // 快递数量
    var userExpress = this.data.addExpress // 快递
    var userRemarks = this.data.userRemarks // 备注
    for (let i = 0; i < userExpress.length; i++) {
      if (userExpress[i].access_place.length == 0 || userExpress[i].service_place.length == 0 || userExpress[i].message.length == 0) {
        wx.showToast({
          title: '请填写完整的快递信息',
          icon: 'none'
        })
        return
      }
    }
    var data = {
      userName: userName,
      userPhone: userPhone,
      userMoney: userMoney,
      userNumber: userNumber,
      userExpress: userExpress,
      userRemarks: userRemarks,
      listId: 0
    }
    if (data.userName != '' && data.userPhone != '' && data.userNumber != '') {
      data = JSON.stringify(data)
      wx.navigateTo({
        url: '/pages/order/order?data=' + data,
      })
    } else {
      wx.showToast({
        title: '请填写完所有内容',
        icon: 'none',
        duration: 2000
      })
    }
  },

  //提交表单并跳转 -- 其他任务
  postOther: function () {
    var userName = this.data.userName //姓名
    var userPhone = this.data.userPhone //电话
    var userRemarks = this.data.userRemarks // 备注
    var userMoney = this.data.userMoney // 赏金
    var userOtherMessage = this.data.otherMessage //任务描述
    var images = this.data.postImg // 提交图片路径
    var imgArr = this.data.imgArr // 本地图片路径
    if (images.length == imgArr.length) {
      var data = {
        userName: userName,
        userPhone: userPhone,
        userMoney: userMoney,
        userOtherMessage: userOtherMessage,
        userRemarks: userRemarks,
        images: images,
        imgArr: imgArr,
        listId: 1
      }
      if (data.userName != '' && data.userPhone != '' && data.userOtherMessage != '') {
        data = JSON.stringify(data)
        wx.navigateTo({
          url: '/pages/order/order?data=' + data,
        })
      } else {
        wx.showToast({
          title: '请填写完所有内容',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      wx.showToast({
        title: '图片上传中',
        icon: 'none',
        duration: 2000
      })
    }
  },


  //点击取快递高亮
  selectExpress: function () {
    this.setData({
      sta: 0,
      inp: 0
    })
  },

  //点击其他任务高亮
  selectOther: function () {
    this.setData({
      sta: 1,
      inp: 1
    })
  },


  // 添加快递
  addExpress: function (e) {
    let formData = e.detail.value
    let index = e.currentTarget.dataset.index
    let addExpress = this.data.addExpress
    if (addExpress[index].access_place == "" || addExpress[index].service_place == "" || addExpress[index].message == "") {
      wx.showToast({
        title: '请填写完当前快递信息',
        icon: 'none'
      })
      return
    } else {

      let datas = {
        access_place: "",
        service_place: "",
        message: "",
        images: []
      }

      // let data = {
      //   access_place: formData.access_place,
      //   service_place: formData.service_place,
      //   message: formData.message,
      //   imgArr: this.data.addExpress[index].imgArr
      // }

      //取到提交数据
      // addExpress[index] = data

      //添加空数组
      addExpress.push(datas)


      this.setData({
        addExpress: addExpress,
        addExpressLength: this.data.addExpress.length,
        access_place: "",
        service_place: "",
        message: ""
      })

    }
  },


  //删除快递
  deleteExpress: function (e) {
    const index = e.currentTarget.dataset.index
    let addExpress = this.data.addExpress
    addExpress.splice(index, 1)
    this.setData({
      addExpress: addExpress, // 重新赋值 - 刷新
      addExpressLength: this.data.addExpress.length
    })
  },


  getName(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  getPhone(e) {
    this.setData({
      userPhone: e.detail.value
    })
  },
  getRemarks(e) {
    this.setData({
      userRemarks: e.detail.value
    })
  },
  getMoney(e) {
    this.setData({
      userMoney: Number(e.detail.value)
    })
    console.log(this.data.userMoney);
  },
  getTakePlace(e) {
    let addExpress = this.data.addExpress
    let index = e.currentTarget.dataset.index
    let data = {
      access_place: e.detail.value,
      service_place: this.data.addExpress[index].service_place,
      message: this.data.addExpress[index].message,
      images: this.data.addExpress[index].images
    }

    addExpress[index] = data
    this.setData({
      addExpress: addExpress,
      access_place: e.detail.value
    })
  },
  getPlace(e) {
    let addExpress = this.data.addExpress
    let index = e.currentTarget.dataset.index
    let data = {
      access_place: this.data.addExpress[index].access_place,
      service_place: e.detail.value,
      message: this.data.addExpress[index].message,
      images: this.data.addExpress[index].images
    }

    addExpress[index] = data
    this.setData({
      addExpress: addExpress,
      service_place: e.detail.value
    })
  },
  getTakeMessage(e) {
    let addExpress = this.data.addExpress
    let index = e.currentTarget.dataset.index
    let data = {
      access_place: this.data.addExpress[index].access_place,
      service_place: this.data.addExpress[index].service_place,
      message: e.detail.value,
      images: this.data.addExpress[index].images
    }

    addExpress[index] = data
    this.setData({
      addExpress: addExpress,
      message: e.detail.value
    })
  },
  getOtherMessage(e) {
    this.setData({
      otherMessage: e.detail.value
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    var token = wx.getStorageSync('token')
    var userInfoID = wx.getStorageSync('userInfoID')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'release/name_phone',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': token
      },
      data: {
        'id': userInfoID
      },
      success(res) {
        wx.hideLoading()
        that.setData({
          userInfo: res.data.data,
          // userName: res.data.data.name,
          userPhone: res.data.data.phone,
          itemMoney: Number(res.data.data.money)
        })
      },
    })
  },
  deleteImages(e) {
    var that = this;
    var index = e.currentTarget.dataset.index
    var childindex = e.currentTarget.dataset.childindex
    let image = this.data.addExpress[index].images
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          image.splice(childindex, 1)
          that.setData({
            addExpress: that.data.addExpress
          });
        } else if (res.cancel) {
          return false;
        }
      }
    })
  },
  //删除图片
  deleteImage: function (e) {
    var that = this;
    var imgArr = that.data.imgArr;
    var postImg = that.data.postImg
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          imgArr.splice(index, 1);
          postImg.splice(index, 1)
          that.setData({
            imgArr: imgArr,
            postImg: postImg
          });
        } else if (res.cancel) {
          return false;
        }
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