
//获取应用实例
const app = getApp();
const serverUrl = app.globalData.serverUrl;

Page({
  data: {
    // 单个商品结算
    // 商品信息
    productInfo: null,
    // 收货地址
    address: null,
    // 买家留言
    inputValue: null,

    // 多个商品结算
  },

  onLoad: function(param) {
    var _this = this;
    var productId = param.productId;
    var productClassId = param.productClassId;
    var productCount = param.productCount;
    // 用户openid
    var openid = wx.getStorageSync("openid");

    // 查询结算信息
    _this.showToast();
    wx.request({
      url: serverUrl + 'queryOrderSettlementInfo',
      data: {
        productId: productId,
        productClassId: productClassId,
        openid: openid
      },
      success: function (res) {
        _this.hideoast();
        console.log(res)
        if (res.data.error == 'code-0000') {
          var productInfo = res.data.productInfo;
          productInfo.productCount = productCount;
          _this.setData({
            productInfo: productInfo,
            address: res.data.address,
          });
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../images/user/icon_error.png'
          });
          setTimeout(function() {
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
        }
      }
    });

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

})
