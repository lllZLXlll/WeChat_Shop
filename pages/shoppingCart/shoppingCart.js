//获取应用实例
const app = getApp();
const serverUrl = app.globalData.serverUrl;

Page({
  data: {
    // 列表数据
    page: [],
    isLoad: false,
    isBottomText: false,

    // 屏幕高度
    screenHeight: 0,
    // 屏幕剩余高度
    windowHeight: 0,
  },

  // 界面渲染回调
  onLoad: function () {
    var _this = this;

    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          windowHeight: res.windowHeight,
          screenHeight: res.screenHeight,
        });
      },
    });
    
    _this.getProductData();

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

  getProductData: function () {
    var _this = this;

    // 用户openid
    var openid = wx.getStorageSync("openid");
    if (!openid) {
      // 用户没登录展示空购物车图片，提示用户登录

      return;
    }

    _this.showToast();
    // 发起网络请求
    wx.request({
      url: serverUrl + 'queryShoppingCartList',
      data: {
        openid: openid,
      },
      success: function (res) {
        wx.hideNavigationBarLoading() //完成停止加载
        if (res.data.error == 'code-0000') {
          _this.hideoast();
          _this.setData({ isLoad: false });
          console.log(res.data.page)
          _this.setData({
            page: res.data.page,
            isBottomText: res.data.page.pageTotalNum <= 1 ? true : false,
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
          _this.setData({ isBottomText: true });
        }
      }
    });
  },

  // 上拉加载
  loadPage: function () {
    var _this = this;
    if (_this.data.isLoad)
      return;
    else
      _this.setData({ isLoad: true });

    // 总页数等于当前页数不加载
    if (_this.data.page.pageTotalNum <= _this.data.page.pageNum) {
      _this.setData({ isBottomText: true });
      return;
    }

    // 用户openid
    var openid = wx.getStorageSync("openid");

    //发起网络请求
    wx.request({
      url: serverUrl + 'queryShoppingCartList',
      data: {
        pageNum: _this.data.page.pageNum + 1,
        openid: openid,
      },
      success: function (res) {
        if (res.data.error == 'code-0000') {
          res.data.page.page = _this.data.page.page.concat(res.data.page.page);
          _this.setData({
            page: res.data.page,
            isLoad: false
          });
        }
      }
    });

  },

  // 下拉刷新
  onPullDownRefresh: function(e) {
    console.log('--------下拉刷新-------');
    wx.stopPullDownRefresh() //停止下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getProductData();
  },

  // 上拉加载
  onReachBottom: function(e) {
    console.log('--------上拉加载-------');
    this.loadPage();
  },

  // 跳转商品详情页面
  toProductInfo: function(e) {
    wx.navigateTo({
      url: '../productInfo/productInfo?id=' + e.currentTarget.dataset.id
    })
  },
  
})
