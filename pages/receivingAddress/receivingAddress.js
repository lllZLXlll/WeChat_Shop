//index.js
//获取应用实例
const app = getApp()

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
          url: 'http://127.0.0.1:8080/zlx/queryReceivingAddressListById',
          data: {
            openid: openid
          },
          header: {
            'content-type': 'application/json'
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
      url: 'http://127.0.0.1:8080/zlx/addReceivingAddress',
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
      header: {
        'content-type': 'application/json'
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
  }
})
