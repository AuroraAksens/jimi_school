// pages/details/details.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reply: 0,

    //高亮状态
    sta: 0,

    //详情数据
    listDetails: '',

    //评论数据
    listComment: '',

    //状态判断
    status: null,

    //评论图片
    imgArr: [],

    //上传图片
    imgPost: [],

    //评论输入数据
    commentText: '',

    //文章类型
    articleStatus: '',

    //文章ID
    detailsID: '',

    //输入框聚焦
    inputShowed: false,

    //评论id
    pId: '',

    //评论用户id
    comUserId: '',

    // 加密号码
    mPhone: '',

    // 加密名字
    mName: '',

    //用户登录ID
    MyuserID: '',

    //当前详情用户ID
    articleID: '',

    // 文章类型
    articleStatus: '',

    //文章ID
    ID: '',

    // 用户数据
    user_info: '',

    //接单用户ID
    userinfoID: '',

    //评论数量
    comment: '',

    //TA的印象
    effect: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var status = options.status
    var comsta = options.comLA
    var comment = app.globalData.comment
    var that = this
    this.setData({
      articleStatus: status,
      ID: id,
      comment: comment,
      inputShowed: Boolean(comsta)
    })

    console.log(typeof (this.data.inputShowed))

    //详情数据
    that.showDetails()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  //渲染详情页数据
  showDetails: function () {
    var that = this
    var token = wx.getStorageSync('token')
    var status = this.data.articleStatus
    var id = this.data.ID
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'index/get_message/' + status + '/' + id,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token': token
      },
      success: res => {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            listDetails: res.data.data[0], //详情数据
            listComment: res.data.data.comment, //评论数据
            effect: res.data.data.effect, //印象数据
            status: Number(res.data.data[0].state),
            articleStatus: status,
            detailsID: id,
            user_info: res.data.data.user_info,
            userinfoID: res.data.data.user_info.id
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
        console.log(that.data.listComment)
        console.log(that.data.listDetails)
        console.log(that.data.user_info)
        console.log(that.data.user_info.id)
        console.log(that.data.effect)
        that.showMD5()
      }
    })
  },

  //隐藏电话和姓名
  showMD5: function () {
    if (this.data.articleStatus != 1) {
      console.log('未加密')
      var MyuserID = wx.getStorageSync('userInfoID')
      var articleID = this.data.listDetails.user.id
      this.setData({
        MyuserID: MyuserID,
        articleID: articleID
      })
    } else {
      console.log('已加密')
      var MyuserID = wx.getStorageSync('userInfoID')
      var articleID = this.data.listDetails.user.id
      var name = this.data.listDetails.name
      var phone = this.data.listDetails.phone
      var mPhone = phone.substr(0, 3) + '********';
      var mName = name.substr(0, 1) + '*';
      this.setData({
        mName: mName,
        mPhone: mPhone,
        MyuserID: MyuserID,
        articleID: articleID
      })
    }
  },

  //显示回复弹框
  showReply: function (e) {
    let index = e.currentTarget.dataset.index
    let reply = this.data.reply;
    if (reply == 0) {
      this.setData({
        reply: 1,
        child: this.data.listComment[index].child
      })
    } else {
      this.setData({
        reply: 0
      })
    }
  },

  //接单提示
  receiving: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    wx.showModal({
      title: '接单提示',
      content: '接单后若您的主观因取消订单，则24小时内不得再次接单，是否确定接单',
      success(res) {
        if (res.confirm == true) {
          console.log(res.confirm, '用户点击确定')
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: app.globalData.url + 'template?key=' + 'order_received,order_success',
            method: 'GET',
            header: {
              'content-type': 'application/json',
              'token': token
            },
            success: res => {
              if (res.data.code == 200) {
                var tmplIds = res.data.data
                wx.hideLoading()
                console.log(tmplIds)
                wx.requestSubscribeMessage({
                  tmplIds: tmplIds,
                  success(res) {
                    that.getOrder(e)
                  }
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
        } else if (res.cancel == false) {
          console.log(res.confirm, '用户点击取消')
          that.setData({
            sta: 0
          })
        }
      }
    })
  },

  //已完成提示
  complete: function (e) {
    var that = this
    wx.showModal({
      title: '已完成提示',
      content: '确认您接到的任务已完成了吗',
      success(res) {
        if (res.confirm == true) {
          console.log(res.confirm, '用户点击确定')
          that.getOrder(e)
        } else if (res.cancel == false) {
          console.log(res.confirm, '用户点击取消')
          that.setData({
            sta: 0
          })
        }
      }
    })
  },

  //已完成提示
  confirm: function (e) {
    var that = this
    wx.showModal({
      title: '确认完成提示',
      content: '请确认任务完成',
      success(res) {
        if (res.confirm == true) {
          wx.showModal({
            title: '确认完成提示',
            content: '如确认完成，赏金将会打给接单员，不给予退回',
            success(res) {
              if (res.confirm == true) {
                console.log(res.confirm, '用户点击确定')
                that.getOrder(e)
              } else {
                console.log(res.confirm, '用户点击取消')
                that.setData({
                  sta: 0
                })
              }
            }
          })
        } else if (res.cancel == false) {
          console.log(res.confirm, '用户点击取消')
        }
      }
    })
  },

  //接单逻辑
  getOrder: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    var btnid = e.currentTarget.dataset.btnid
    var articleId = this.data.listDetails.id
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'business/update_task',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': token
      },
      data: {
        btn: btnid,
        itemId: articleId
      },
      success: res => {
        wx.hideLoading()
        console.log(res.data)
        if (res.data.code == 200) {
          that.setData({
            sta: 1
          })
          that.showDetails()
        } else {
          wx.showModal({
            title: '认证提示',
            content: res.data.msg,
            confirmText: '去认证',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/become/become',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })


  },


  //详情文章点赞
  detailsGood: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var status = e.currentTarget.dataset.status
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
        console.log(res.data.data)
        if (that.data.listDetails.good_status == 0) {
          that.data.listDetails.good++
          that.data.listDetails.good_status = 1
          that.setData({
            listDetails: that.data.listDetails
          })
          wx.showToast({
            title: '点赞成功',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.data.listDetails.good--
          that.data.listDetails.good_status = 0
          that.setData({
            listDetails: that.data.listDetails
          })
          wx.showToast({
            title: '取消点赞',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  //评论点赞
  commentGood: function (e) {
    var that = this
    var comid = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var status = e.currentTarget.dataset.status
    var detailsID = this.data.detailsID
    var token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'index/comment_good',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': token
      },
      data: {
        itemId: detailsID, //文章ID
        status: status, //文章类型
        com_id: comid, //评论ID
      },
      success: res => {
        wx.hideLoading()
        if (res.data.data) {
          that.data.listComment[index].good++
          that.data.listComment[index].good_status = 1
          that.setData({
            listComment: that.data.listComment
          })
          wx.showToast({
            title: '点赞成功',
            icon: 'none',
            duration: 2000
          })
        } else {
          that.data.listComment[index].good--
          that.data.listComment[index].good_status = 0
          that.setData({
            listComment: that.data.listComment
          })
          wx.showToast({
            title: '取消点赞',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  //回复评论点赞
  ReplycommentGood: function (e) {
    var that = this
    var comid = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var status = e.currentTarget.dataset.status
    var detailsID = this.data.detailsID
    var childData = this.data.child
    var token = wx.getStorageSync('token')
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'index/comment_good',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': token
      },
      data: {
        itemId: detailsID, //文章ID
        status: status, //文章类型
        com_id: comid, //评论ID
      },
      success: res => {
        wx.hideLoading()
        if (res.data.data) {
          childData[index].good++
          childData[index].good_status = 1
          that.setData({
            child: that.data.child
          })
          wx.showToast({
            title: '点赞成功',
            icon: 'none',
            duration: 2000
          })
        } else {
          childData[index].good--
          childData[index].good_status = 0
          that.setData({
            child: that.data.child
          })
          wx.showToast({
            title: '取消点赞',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  //上传评论图片
  postImage: function () {
    const that = this
    const token = wx.getStorageSync('token')
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        that.setData({
          imgArr: tempFilePaths
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
            type: 4
          },
          success(res) {
            wx.hideLoading()
            var dataItem = JSON.parse(res.data)
            console.log(dataItem.data.url)
            that.setData({
              imgPost: dataItem.data.url
            })
          }
        })
      }
    })
  },


  //输入评论
  commentInput: function (e) {
    var text = e.detail.value
    this.setData({
      commentText: text
    })
  },


  //提交评论
  postComment: function () {
    var that = this
    var input = /^[\s]*$/;
    var id = this.data.listDetails.id // 文章id
    var status = Number(this.data.articleStatus) //文章类型
    var commentText = this.data.commentText //评论内容
    var imgPost = this.data.imgPost //图片
    var pId = this.data.pId //评论id
    var token = wx.getStorageSync('token')
    if (input.test(commentText)) {
      wx.showToast({
        title: '评论不能为空',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      if (pId != '') {
        console.log('回复评论')
        wx.request({
          url: app.globalData.url + 'index/comment',
          method: 'POST',
          header: {
            'content-type': 'application/json',
            'token': token
          },
          data: {
            itemId: id, // 文章id
            status: status, //文章类型
            content: commentText, //评论内容
            image: imgPost, //图片
            pId: pId //评论id
          },
          success: res => {
            that.showDetails()
            wx.hideLoading()
            if (res.data.code == 200) {
              wx.showToast({
                title: '评论成功',
                icon:'none',
                duration:2000
              })
              that.setData({
                commentText: '',
                imgArr: '',
                pId: ''
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon:'none',
                duration:2000
              })
            }
          }
        })
      } else {
        console.log('普通评论')
        wx.request({
          url: app.globalData.url + 'index/comment',
          method: 'POST',
          header: {
            'content-type': 'application/json',
            'token': token
          },
          data: {
            itemId: id, // 文章id
            status: status, //文章类型
            content: commentText, //评论内容
            image: imgPost, //图片
            pId: 0 //评论id
          },
          success: res => {
            that.showDetails()
            wx.hideLoading()
            console.log(res.data)
            if (res.data.code == 200) {
              wx.showToast({
                title: '评论成功',
              })
              that.setData({
                commentText: '',
                imgArr: ''
              })
            } else {
              wx.showToast({
                title: '评论失败',
              })
            }
          }
        })
      }
    }

  },

  //回复评论
  replyComment: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    var comId = e.currentTarget.dataset.comid
    var comUserId = e.currentTarget.dataset.comuserid
    var userID = wx.getStorageSync('userInfoID')
    console.log(comUserId)
    console.log(userID)
    if (comUserId == userID) {
      wx.showActionSheet({
        itemList: ['回复评论', '删除评论'],
        success(res) {
          if (res.tapIndex == 0) {
            that.setData({
              inputShowed: true,
              pId: comId
            })
            console.log(that.data.inputShowed)
            console.log(that.data.pId)
          } else if (res.tapIndex == 1) {
            wx.showModal({
              title: '删除提示',
              content: '确定要删除这条评论吗？',
              success(res) {
                if (res.confirm) {
                  wx.showLoading({
                    title: '加载中',
                  })
                  wx.request({
                    url: app.globalData.url + 'user/delete_comment',
                    method: 'POST',
                    header: {
                      'content-type': 'application/json',
                      'token': token
                    },
                    data: {
                      itemId: comId
                    },
                    success: res => {
                      wx.hideLoading();
                      wx.showToast({
                        title: '删除成功',
                      })
                      that.showDetails()
                    },
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })

          }
        },
      })

    } else {
      wx.showActionSheet({
        itemList: ['回复评论'],
        success(res) {
          if (res.tapIndex == 0) {
            that.setData({
              inputShowed: true,
              pId: comId
            })
          }
        },
      })
    }
  },


  //详情预览图片
  messImg: function (e) {
    const imgKey = e.currentTarget.dataset.src
    var imgKeys = this.data.listDetails.images
    wx.previewImage({
      current: imgKey,
      urls: imgKeys
    })
  },

  //快递预览图片
  showImg: function (e) {
    const imgKey = e.currentTarget.dataset.src
    var imgKeys = this.data.listDetails.express
    for (var i = 0; i < imgKeys.length; i++) {
      var images = imgKeys[i].images
    }
    wx.previewImage({
      current: imgKey,
      urls: images
    })
  },

  //评论预览图片
  viewImage: function (e) {
    const imgKey = e.currentTarget.dataset.src
    var imgKeys = imgKey.split(',')
    wx.previewImage({
      current: imgKey,
      urls: imgKeys
    })
  },

  //删除文章
  deleteArticle: function () {
    var that = this
    var token = wx.getStorageSync('token')
    var article = that.data.listDetails.id

    wx.showActionSheet({
      itemList: ['删除动态'],
      success(res) {
        wx.showModal({
          title: '动态提示',
          content: '确认要删除这条动态吗？',
          success(res) {
            if (res.confirm) {
              wx.showLoading({
                title: '加载中',
              })
              wx.request({
                url: app.globalData.url + 'release/delete_dynamic',
                method: 'POST',
                header: {
                  'content-type': 'application/json',
                  'token': token
                },
                data: {
                  itemId: article
                },
                success: res => {
                  wx.hideLoading()
                  if (res.data.code == 200) {
                    wx.showToast({
                      title: '删除成功',
                      icon: 'success',
                      duration: 2000
                    })
                    setTimeout(function () {
                      wx.switchTab({
                        url: '/pages/home/home',
                      })
                    }, 1000)
                  }
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },

    })


  },


  //取消发布任务
  deleteMyTask: function () {
    var that = this
    var token = wx.getStorageSync('token')
    var article = that.data.listDetails.id

    wx.showActionSheet({
      itemList: ['取消发布任务'],
      success(res) {
        wx.showModal({
          title: '任务提示',
          content: '确认取消要发布这个任务吗？',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.showLoading({
                title: '加载中',
              })
              wx.request({
                url: app.globalData.url + 'business/cancel_rel',
                method: 'POST',
                header: {
                  'content-type': 'application/json',
                  'token': token
                },
                data: {
                  itemId: article
                },
                success: res => {
                  wx.hideLoading()
                  if (res.data.code == 200) {
                    wx.showToast({
                      title: '取消成功',
                      icon: 'success',
                      duration: 2000
                    })
                    setTimeout(function () {
                      wx.switchTab({
                        url: '/pages/home/home',
                      })
                    }, 1000)
                  } else {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                  console.log(res.data)
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
    })


  },

  //取消接单任务
  deleteOrderTask: function () {
    var that = this
    var token = wx.getStorageSync('token')
    var article = that.data.listDetails.id

    wx.showActionSheet({
      itemList: ['取消接单'],
      success(res) {
        wx.showModal({
          title: '任务提示',
          content: '确认要取消接单任务吗？',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.showLoading({
                title: '加载中',
              })
              wx.request({
                url: app.globalData.url + 'business/cancel_task',
                method: 'POST',
                header: {
                  'content-type': 'application/json',
                  'token': token
                },
                data: {
                  itemId: article
                },
                success: res => {
                  wx.hideLoading()
                  if (res.data.code == 200) {
                    wx.showToast({
                      title: '取消成功',
                      icon: 'success',
                      duration: 2000
                    })
                    setTimeout(function () {
                      wx.switchTab({
                        url: '/pages/home/home',
                      })
                    }, 1000)
                  }
                  console.log(res.data)
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
    })

  },

  //查看主页
  gotoPersonal: function () {
    var userinfoID = this.data.userinfoID
    wx.navigateTo({
      url: '/pages/personal/personal?userid=' + userinfoID,
    })
  },

  //点击头像或者个人信息跳转个人中心主页  --  详情
  getmesgoPersonal: function () {
    var DetailsId = this.data.listDetails.user.id
    wx.navigateTo({
      url: '/pages/personal/personal?userid=' + DetailsId,
    })
  },

  //点击头像或者个人信息跳转个人中心主页 -- 评论
  comGotoPersonal: function (e) {
    var comId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/personal/personal?userid=' + comId,
    })
  },

  //联系信息
  callWXhao: function (e) {
    var wxhao = e.currentTarget.dataset.wxhao

    wx.setClipboardData({
      data: wxhao,
      success: function (res) {
        wx.showToast({
            title: '已复制电话号码',
          }),
          wx.getClipboardData({
            success: function (res) {
              // console.log(res.data) 
            }
          })
      }
    })
  },

  //联系电话
  callPhone: function (e) {
    var phone = e.currentTarget.dataset.phone
    wx.showActionSheet({
      itemList: ['拨打电话'],
      success(res) {
        wx.makePhoneCall({
          phoneNumber: phone,
          success: function () {
            // console.log('成功播打电话')
          },
          fail: function () {
            // console.log('取消播打电话')
          }
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  //删除图片
  deleteImage: function () {
    var that = this;
    var imgArr = that.data.imgArr;
    var imgPost = that.data.imgPost
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          imgArr.splice(0, 1);
          imgPost = []
          that.setData({
            imgArr: imgArr,
            imgPost: imgPost
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
    var token = wx.getStorageSync('token')
    if (!token) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 3000,
      })
      setTimeout(function () {
        wx.switchTab({
          url: '/pages/home/home',
        })
      }, 1500)
    }
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