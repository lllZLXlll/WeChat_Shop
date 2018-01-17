
//获取应用实例
const app = getApp();
const serverUrl = app.globalData.serverUrl;

Page({
  data: {
    // 订单基本信息
    orderInfo: null,
    // 商品列表
    orderProducts: [],
    // 收货地址
    address: null,
    // 是否已经取消订单
    isCancelOrder: false,
    // 订单倒计时
    orderTime: null,
  },

  onLoad: function (param) {
    var _this = this;
    // 用户openid
    var openid = wx.getStorageSync("openid");
    var order = param.order;
    var param = {
      order: order,
      openid: openid,
    };

    _this.showToast();
    wx.request({
      url: serverUrl + 'queryOrderInfo',
      method: 'POST',
      data: JSON.stringify(param),
      success: function (res) {
        _this.hideoast();
        console.log(res)
        if (res.data.error == 'code-0000') {

          _this.setData({
            address: res.data.address,
            orderInfo: res.data.orderInfo,
            orderProducts: res.data.productLIst,
            isCancelOrder: res.data.orderInfo.orderType == 3 ? true : false,
          });

          if (res.data.orderInfo.orderType == 1) {
            _this.setOrderTime(res.data.orderInfo.orderCreateTime);
          }

        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../images/user/icon_error.png'
          });
        }
      },
      complete: function (e) {
        if (e.errMsg != app.globalData.requestOk) {
          _this.hideoast();
          if (e.errMsg == app.globalData.requestTimeout) {
            wx.showToast({
              title: '网络请求超时',
              image: '../../images/user/icon_error.png'
            });
          } else if (e.errMsg == app.globalData.requestFail) {
            wx.showToast({
              title: '网络请求失败',
              image: '../../images/user/icon_error.png'
            });
          } else {
            wx.showToast({
              title: '请求失败',
              image: '../../images/user/icon_error.png'
            });
          }
          setTimeout(function () {
            wx.navigateBack();
          }, 2000);
        }
      }
    });

  },

  // 递归设置订单过期时间
  setOrderTime: function (orderCreateTime) {
    var _this = this;
    if (orderCreateTime <= 0) {
      _this.setData({ orderTime: '订单已过期，已自动取消' });
    } else {
      var EndTime = new Date(orderCreateTime);
      EndTime.setDate(EndTime.getDate() + 3);
      var NowTime = new Date();
      var t = EndTime.getTime() - NowTime.getTime();
      var d = 0;
      var h = 0;
      var m = 0;
      var s = 0;
      if (t >= 0) {
        d = Math.floor(t / 1000 / 60 / 60 / 24);
        h = Math.floor(t / 1000 / 60 / 60 % 24);
        m = Math.floor(t / 1000 / 60 % 60);
        s = Math.floor(t / 1000 % 60);
      }

      var orderTime = d + '天' + h + '时' + m + "分" + s + "秒";

      this.setData({ orderTime: orderTime });

      setTimeout(function() {
        _this.setOrderTime(orderCreateTime);
      }, 1000);
    }
    
  },

  // 展示加载框
  showToast: function () {
    wx.showLoading({
      title: '加载中...',
    })
  },

  // 隐藏加载框
  hideoast: function () {
    wx.hideLoading();
  },

  // 取消订单
  cancelOrder: function (e) {
    var _this = this;
    // 用户openid
    var openid = wx.getStorageSync("openid");
    var param = {
      order: _this.data.orderInfo.orderNumber,
      openid: openid,
    };
    wx.showModal({
      title: '提示',
      content: '订单取消后不可恢复，确定要取消吗？',
      success: function (res) {
        if (res.confirm) {

          _this.showToast();
          wx.request({
            url: serverUrl + 'updateOrderStatus',
            method: 'POST',
            data: JSON.stringify(param),
            success: function (res) {
              _this.hideoast();
              console.log(res)
              if (res.data.error == 'code-0000') {
                _this.setData({ isCancelOrder: true });
              }
              wx.showToast({
                title: res.data.message,
                image: '../../images/user/icon_error.png'
              });
            },
            complete: function (e) {
              if (e.errMsg != app.globalData.requestOk) {
                _this.hideoast();
                if (e.errMsg == app.globalData.requestTimeout) {
                  wx.showToast({
                    title: '网络请求超时',
                    image: '../../images/user/icon_error.png'
                  });
                } else if (e.errMsg == app.globalData.requestFail) {
                  wx.showToast({
                    title: '网络请求失败',
                    image: '../../images/user/icon_error.png'
                  });
                } else {
                  wx.showToast({
                    title: '请求失败',
                    image: '../../images/user/icon_error.png'
                  });
                }
              }
            }
          });
        }
      }
    })

  },

  delOrder: function (e) {
    var _this = this;
    // 用户openid
    var openid = wx.getStorageSync("openid");
    var param = {
      order: _this.data.orderInfo.orderNumber,
      openid: openid,
    };

    _this.showToast();
    wx.request({
      url: serverUrl + 'delOrder',
      method: 'POST',
      data: JSON.stringify(param),
      success: function (res) {
        _this.hideoast();
        console.log(res)
        if (res.data.error == 'code-0000') {
          setTimeout(function () {
            wx.navigateBack();
          }, 2000);
        }
        wx.showToast({
          title: res.data.message,
          image: '../../images/user/icon_error.png'
        });

      },
      complete: function (e) {
        if (e.errMsg != app.globalData.requestOk) {
          _this.hideoast();
          if (e.errMsg == app.globalData.requestTimeout) {
            wx.showToast({
              title: '网络请求超时',
              image: '../../images/user/icon_error.png'
            });
          } else if (e.errMsg == app.globalData.requestFail) {
            wx.showToast({
              title: '网络请求失败',
              image: '../../images/user/icon_error.png'
            });
          } else {
            wx.showToast({
              title: '请求失败',
              image: '../../images/user/icon_error.png'
            });
          }
        }
      }
    });
  },


})
