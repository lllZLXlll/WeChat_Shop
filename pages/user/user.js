//获取应用实例
const app = getApp()

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
                      url: 'http://127.0.0.1:8080/zlx/login',
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
                          // 登录成功，用户信息成功保存
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
                                      url: 'http://127.0.0.1:8080/zlx/login',
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
                                          // 登录成功，用户信息成功保存
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
                                      url: 'http://127.0.0.1:8080/zlx/login',
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
                                          // 登录成功，用户信息成功保存
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
                                                      url: 'http://127.0.0.1:8080/zlx/login',
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
                                                          // 登录成功，用户信息成功保存
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
                                  }
                                });
                              }
                            }
                          });
                        }
                      }
                    })
                  }
                });
              }
            }
          });
        } else {
          wx.login({
            success: function (res) {
              if (res.code) {
                wx.getUserInfo({
                  lang: 'zh_CN',
                  success(e) {
                    _this.setData({
                      userInfo: e.userInfo
                    });
                    //发起网络请求
                    wx.request({
                      url: 'http://127.0.0.1:8080/zlx/login',
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
                          // 登录成功，用户信息成功保存
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
                                      url: 'http://127.0.0.1:8080/zlx/login',
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
                                          // 登录成功，用户信息成功保存
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
                  }
                });
              }
            }
          });
        }
      },
    })
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
                      url: 'http://127.0.0.1:8080/zlx/login',
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
                          // 登录成功，用户信息成功保存
                        } else {
                          // 用户信息保存失败
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

  }

})
