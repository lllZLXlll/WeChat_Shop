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

  onLoad: function(e) {
    var _this = this;
    // 查看是否获取了用户信息
    wx.getSetting({
      success(res) {
        // 没有获取，就获取用户信息
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success(e) { // 用户同意直接获取
              wx.getUserInfo({
                success(e) {
                  _this.setData({
                    userInfo: e.userInfo
                  });
                }
              })
            },
            fail(e) { // 用户拒绝直接跳转开启授权页面，引导用户开启
              wx.openSetting({
                success(e) {
                  // 用户同意授权
                  if (e.authSetting['scope.userInfo'] == true) {
                    wx.getUserInfo({
                      success(e) {
                        _this.setData({
                          userInfo: e.userInfo
                        });
                      }
                    })
                  }
                },
              })
            }
          })
        } else {
          wx.getUserInfo({
            success(e) {
              _this.setData({
                userInfo: e.userInfo
              });
            }
          })
        }
      }
    })
  },
  
  // 获取用户信息
  getUserInfo: function() {
    var _this = this;  
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success(e) {
              wx.getUserInfo({
                success(e) {
                  _this.setData({
                    userInfo: e.userInfo
                  });
                }
              })
            },
          })
        } else {
          wx.getUserInfo({
            success(e) {
              _this.setData({
                userInfo: e.userInfo
              });
            }
          })
          if (_this.data.userInfo.nickName == null) {
            wx.openSetting({
              success(e) {
                // 用户同意授权
                if (e.authSetting['scope.userInfo'] == true) {
                  wx.getUserInfo({
                    success(e) {
                      _this.setData({
                        userInfo: e.userInfo
                      });
                    }
                  })
                }
              },
            })
          }
        }
      }
    })

  }

})
