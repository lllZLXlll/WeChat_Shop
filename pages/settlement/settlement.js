
//获取应用实例
const app = getApp();
const serverUrl = app.globalData.serverUrl;

Page({
  data: {
    // 商品信息
    orderProducts: [],
    // 收货地址
    address: null,
    // 买家留言
    inputValue: null,
    // 总快递费
    expressFee: 0,
    // 总订单金额
    totalAmount: 0,
    // 总商品数量
    totalCount: 0,
  },

  onLoad: function (param) {
    var _this = this;

    var orderProducts = app.globalData.orderProducts;
    var expressFee = 0;
    var totalAmount = 0;
    var totalCount = 0;
    if (orderProducts) {
      for (var i in orderProducts) {
        var item = orderProducts[i];
        expressFee += Number(item.expressFee);
        totalAmount += Number(item.productCount) * Number(item.price);
        totalCount += Number(item.productCount);
      }
      _this.setData({
        orderProducts: orderProducts,
        expressFee: expressFee,
        totalAmount: totalAmount,
        totalCount: totalCount,
      });

    }


    // 用户openid
    var openid = wx.getStorageSync("openid");

    // 查询结算信息
    _this.showToast();
    wx.request({
      url: serverUrl + 'queryOrderSettlementInfo',
      data: {
        openid: openid
      },
      success: function (res) {
        _this.hideoast();
        console.log(res)
        if (res.data.error == 'code-0000') {
          _this.setData({
            address: res.data.address,
          });
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../images/user/icon_error.png'
          });
          setTimeout(function () {
            wx.navigateBack();
          }, 2000);
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

  // 监听页面显示 当从当前页面跳转到另一页面，另一页面销毁时会执行
  onShow: function (e) {
    this.setData({ address: app.globalData.address });
    app.globalData.address = null;
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


  // 获取搜索框的值
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 选择地址
  selectAddress: function (e) {
    var _this = this;
    // 跳转收货地址页面
    wx.navigateTo({
      url: '../receivingAddress/receivingAddress?isSelect=true'
    })
  },

  // 提交订单
  submitOrder: function (e) {
    var _this = this;

    if (!_this.data.address) {
      wx.showModal({
        title: '提示',
        content: '请先选择您的收货地址',
        success: function (result) {
          if (result.confirm) {
            // 跳转收货地址页面
            wx.navigateTo({
              url: '../receivingAddress/receivingAddress?isSelect=true'
            });
          }
          return;
        }
      })
    } else {
      // 用户openid
      var openid = wx.getStorageSync("openid");

      var params = {
        orderProducts: _this.data.orderProducts,
        isShoppingCart: app.globalData.isShoppingCart,
        openid: openid,
        addressId: _this.data.address.id,
        describes: _this.data.inputValue,
      };

      _this.showToast();
      wx.request({
        url: serverUrl + 'addOrder',
        method: 'POST',
        data: JSON.stringify(params),
        success: function (res) {
          _this.hideoast();
          console.log(res)
          if (res.data.error == 'code-0000') {
            app.globalData.isShoppingCart = -1;
            app.globalData.address = null;
            app.globalData.orderProducts = null;

            wx.showModal({
              title: '提示',
              content: '模拟调用微信支付, 点击取消跳转订单详情',
              success: function (e) {
                if (e.confirm) {
                  console.log('用户点击确定')
                } else if (e.cancel) {
                  wx.redirectTo({
                    url: '../orderInfo/orderInfo?order=' + res.data.order
                  });
                }
              }
            })
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
          }
        }
      });
    }

  },

})
