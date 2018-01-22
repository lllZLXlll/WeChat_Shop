//index.js
//获取应用实例
const app = getApp();
const serverUrl = app.globalData.serverUrl;

Page({
  data: {
    // banner图数据
    bannerList: [],
    // 推荐商品数据
    recommendedProList: [
      { productId: 1,
        productName: '小米手环1',
        productImg_1:'http://localhost:8080/zlx/resources/admin/upload/home/20180122153800931.jpg',
        productImg_2:'http://localhost:8080/zlx/resources/admin/upload/home/20180122153800931.jpg',
        productImg_3:'http://localhost:8080/zlx/resources/admin/upload/home/20180122153800931.jpg'
      },
      {
        productId: 2,
        productName: '小米手环2',
        productImg_1:'http://localhost:8080/zlx/resources/admin/upload/home/20180122153800931.jpg',
        productImg_2:'http://localhost:8080/zlx/resources/admin/upload/home/20180122153800931.jpg',
        productImg_3:'http://localhost:8080/zlx/resources/admin/upload/home/20180122153800931.jpg'
      },
      {
        productId: 3,
        productName: '小米手环3',
        productImg_1:'http://localhost:8080/zlx/resources/admin/upload/home/20180122153800931.jpg',
        productImg_2:'http://localhost:8080/zlx/resources/admin/upload/home/20180122153800931.jpg',
        productImg_3:'http://localhost:8080/zlx/resources/admin/upload/home/20180122153800931.jpg'
      },
      {
        productId: 4,
        productName: '小米手环4',
        productImg_1:'http://localhost:8080/zlx/resources/admin/upload/home/20180122153800931.jpg',
        productImg_2:'http://localhost:8080/zlx/resources/admin/upload/home/20180122153800931.jpg',
        productImg_3:'http://localhost:8080/zlx/resources/admin/upload/home/20180122153800931.jpg'
      },
    ],

    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
  },

  onShow: function (e) {
    this.getData();
  },

  // 展示加载框
  showToast: function () {
    wx.showLoading({
      title: '加载中...',
      // mask: true,
    })
  },

  // 隐藏加载框
  hideoast: function () {
    wx.hideLoading();
  },

  getData: function () {
    var _this = this;

    _this.showToast();
    // 发起网络请求
    wx.request({
      url: serverUrl + 'queryHomeData',
      success: function (res) {
        if (res.data.error == 'code-0000') {
          _this.hideoast();

          _this.setData({
            bannerList: res.data.bannerList
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
  },



  toProductInfo: function (e) {
    if (e.currentTarget.dataset.id) {
      wx.navigateTo({
        url: '../productInfo/productInfo?id=' + e.currentTarget.dataset.id
      })
    }
  },
})
