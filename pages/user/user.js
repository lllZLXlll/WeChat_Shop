//获取应用实例
const app = getApp()
const serverUrl = app.globalData.serverUrl;

Page({
  data: {
    // 用户头像
    userInfo: {
      nickName: null,
      avatarUrl: null,
    },
  },

  onLoad: function (e) {
    var _this = this;
    // 查看是否获取了用户信息
    wx.getSetting({
      success(res) {
        // 没有获取，就获取用户信息
        if (!res.authSetting['scope.userInfo']) {
          _this.userLogin();
        } else {
          _this.userLogin();
        }
      }
    })
  },

  userLogin: function() {
    var _this = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.getUserInfo({
            lang: 'zh_CN',
            success(e) {
              console.log(e)
              _this.setData({
                userInfo: e.userInfo
              });
              //发起网络请求
              wx.request({
                url: serverUrl + 'login',
                data: {
                  jdCode: res.code,
                  nickName: e.userInfo.nickName,
                  gender: e.userInfo.gender,
                  country: e.userInfo.country,
                  province: e.userInfo.province,
                  city: e.userInfo.city,
                  avatarUrl: e.userInfo.avatarUrl,
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  console.log(res.data)
                  if (res.data.error == 'code-0000') {
                    // 登录成功，用户openid保存到微信存储中
                    wx.setStorageSync("openid", res.data.openid);
                  } else {
                    // 用户信息保存失败,重新获取
                    wx.login({
                      success: function (res) {
                        if (res.code) {
                          wx.getUserInfo({
                            lang: 'zh_CN',
                            success(e) {
                              console.log(e)
                              _this.setData({
                                userInfo: e.userInfo
                              });
                              //发起网络请求
                              wx.request({
                                url: serverUrl + 'login',
                                data: {
                                  jdCode: res.code,
                                  nickName: e.userInfo.nickName,
                                  gender: e.userInfo.gender,
                                  country: e.userInfo.country,
                                  province: e.userInfo.province,
                                  city: e.userInfo.city,
                                  avatarUrl: e.userInfo.avatarUrl,
                                },
                                header: {
                                  'content-type': 'application/json' // 默认值
                                },
                                success: function (res) {
                                  console.log(res.data)
                                  if (res.data.error == 'code-0000') {
                                    // 登录成功，用户openid保存到微信存储中
                                    wx.setStorageSync("openid", res.data.openid);
                                  }
                                }
                              })
                            }
                          });
                        }
                      }
                    });
                  }
                }
              })
            },
            fail(e) {
              wx.openSetting({
                success(e) {
                  // 用户同意授权
                  if (e.authSetting['scope.userInfo'] == true) {
                    _this.userLogin();
                  }
                }
              })
            }
          });
        }
      },
    });
  },

  // 获取用户信息
  getUserInfo: function () {
    var _this = this;
    wx.openSetting({
      success(e) {
        // 用户同意授权
        if (e.authSetting['scope.userInfo'] == true) {
          wx.login({
            success: function (res) {
              if (res.code) {
                wx.getUserInfo({
                  lang: 'zh_CN',
                  success(e) {
                    console.log(e)
                    _this.setData({
                      userInfo: e.userInfo
                    });
                    //发起网络请求
                    wx.request({
                      url: serverUrl + 'login',
                      data: {
                        jdCode: res.code,
                        nickName: e.userInfo.nickName,
                        gender: e.userInfo.gender,
                        country: e.userInfo.country,
                        province: e.userInfo.province,
                        city: e.userInfo.city,
                        avatarUrl: e.userInfo.avatarUrl,
                      },
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      success: function (res) {
                        console.log(res.data)
                        if (res.data.error == 'code-0000') {
                          // 登录成功，用户openid保存到微信存储中
                          wx.setStorageSync("openid", res.data.openid);
                        }
                      }
                    })
                  }
                });
              }
            }
          });
        }
      }
    })

  },
  // 跳转收货地址页面
  toPageReceivingAddress: function() {
    var _this = this;
    // 看是否登录
    if (_this.data.userInfo.nickName == null) {
      wx.showModal({
        title: '提示',
        content: '请先登录才能添加收货地址',
        success: function (res) {
          if (res.confirm) {
            _this.getUserInfo();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../receivingAddress/receivingAddress'
      })
    }
  },

})
