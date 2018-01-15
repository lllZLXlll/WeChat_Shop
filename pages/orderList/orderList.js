//获取应用实例
const app = getApp()
const serverUrl = app.globalData.serverUrl;

Page({
  data: {
    // tab切换  
    currentTab: '0',
    // 价格排序图片
    priceSortImage: '../../images/product/icon_sort_asc.png',

    // 商品信息
    orderProducts: [],
  },

  onLoad: function (e) {
    var _this = this;
    var param = {
      order: '2018011317123115927988',
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
          var orderInfo = res.data.orderInfo;

          _this.setData({
            orderProducts: orderInfo,
          });
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

  /** 
  * 点击tab切换 
  */
  swichNav: function (e) {
    var _this = this;

    if ((_this.data.currentTab === e.target.dataset.current) && e.target.dataset.current != 2) {
      return false;
    } else {
      _this.setData({
        currentTab: e.target.dataset.current
      })
    }

  },

  toPage: function (object) {
    console.log(object)
    wx.navigateTo({
      url: '../productInfo/productInfo'

      // url: '../../components/productSelect/productSelect'
    })
  },
})
