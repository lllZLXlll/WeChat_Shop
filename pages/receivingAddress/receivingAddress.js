//index.js
//获取应用实例
const app = getApp();
const serverUrl = app.globalData.serverUrl;

Page({
  data: {
    addressList: null
  },
  
  onLoad: function(e) {
    // 请求数据
    var _this = this;
    _this.getAddressData();

  },

  getAddressData: function() {
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    try {
      // 从微信缓存中读取openid
      var openid = wx.getStorageSync('openid')
      if (openid) {
        wx.request({
          url: serverUrl + 'queryReceivingAddressListById',
          data: {
            openid: openid
          },
          success: function (res) {
            // 隐藏提示框
            wx.hideLoading();
            console.log(res.data)
            if (res.data.error == 'code-0000') {
              _this.setData({
                addressList: res.data.resultList
              });
            }
          }
        });
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  addReceivingAddress: function() {
    var _this = this;
    // 调用微信添加收货地址
    wx.chooseAddress({
      success: function (res) {
        try {
          // 从微信缓存中读取openid
          var openid = wx.getStorageSync('openid')
          if (openid) {
            _this.addAddress(res, openid);
          } else {
            // 缓存中没有openid则调用checkLogin 获取openid
            _this.checkLogin(res);
          }
        } catch (e) {
          // Do something when catch error
        }

      }
    })
  },

  addAddress: function (res, openid) {
    var _this = this;
    wx.request({
      url: serverUrl + 'addReceivingAddress',
      data: {
        userName: res.userName,
        postalCode: res.postalCode,
        provinceName: res.provinceName,
        cityName: res.cityName,
        countyName: res.countyName,
        detailInfo: res.detailInfo,
        nationalCode: res.nationalCode,
        telNumber: res.telNumber,
        openid: openid
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.error == 'code-0000') {
          _this.getAddressData();
        }
      }
    });
  },
  checkLogin: function (address) {
    var _this = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.getUserInfo({
            lang: 'zh_CN',
            success(e) {
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
                success: function (res) {
                  console.log(res.data)
                  if (res.data.error == 'code-0000') {
                    // 登录成功，用户openid保存到微信存储中
                    wx.setStorageSync("openid", res.data.openid);
                    // 获取openid后在添加地址
                    _this.addAddress(address, res.data.openid)
                  }
                }
              })
            }
          });
        }
      },
    });
  },

  // 设置为默认地址
  setAddressStatus: function(e) {
    // bindtap 通过 data-id 传参 通过 e.currentTarget.dataset.id 取值
    var _this = this;

    try {
      // 从微信缓存中读取openid
      var openid = wx.getStorageSync('openid')
      if (openid) {
        wx.request({
          url: serverUrl + 'setAddressStatusById',
          data: {
            id: e.currentTarget.dataset.id,
            openid: openid
          },
          success: function (res) {
            console.log(res.data)
            if (res.data.error == 'code-0000') {
             _this.getAddressData();
            } else {
              wx.showToast({
                title: res.data.message,
                image: '../../images/user/icon_error.png'
              })
            }
          }
        });
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  // 删除地址
  delAddressStatus: function (e) {
    // bindtap 通过 data-id 传参 通过 e.currentTarget.dataset.id 取值
    var _this = this;

    // 弹出确认框，用户确认后删除
    wx.showModal({
      title: '提示',
      content: '确定删除地址吗？',
      success: function (res) {
        if (res.confirm) {
          try {
            // 从微信缓存中读取openid
            var openid = wx.getStorageSync('openid')
            if (openid) {
              wx.request({
                url: serverUrl + 'delAddressStatusById',
                data: {
                  id: e.currentTarget.dataset.id,
                  status: e.currentTarget.dataset.status,
                  openid: openid
                },
                success: function (res) {
                  console.log(res.data)
                  if (res.data.error == 'code-0000') {
                    _this.getAddressData();
                  } else {
                    wx.showToast({
                      title: res.data.message,
                      image: '../../images/user/icon_error.png'
                    })
                  }
                }
              });
            }
          } catch (e) {
            // Do something when catch error
          }
        }
      }
    })
  },
})
