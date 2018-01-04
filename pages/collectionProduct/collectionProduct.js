//获取应用实例
const app = getApp();
const serverUrl = app.globalData.serverUrl;

Page({
  data: {

    // 屏幕高度
    screenHeight: 0,
    // 屏幕剩余高度
    windowHeight: 0,
    // 滚动视图位置
    scrollTop: 0,

    // 列表数据
    page: [],
    isLoad: false,
    isBottomText: false,

    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,

    // 选中删除id
    selectDelId: -1,
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
    })

    _this.getCollectionProductData();

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

  getCollectionProductData: function () {
    var _this = this;

    // 用户openid
    var openid = wx.getStorageSync("openid");

    _this.showToast();
    // 发起网络请求
    wx.request({
      url: serverUrl + 'queryCollectionProductList',
      data: {
        openid: openid,
      },
      success: function (res) {
        if (res.data.error == 'code-0000') {
          _this.hideoast();
          _this.setData({ isLoad: false });

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
      url: serverUrl + 'queryCollectionProductList',
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

  toProductInfo: function (e) {
    var productId = e.currentTarget.dataset.id;
    // 判断是否长按
    var time = this.data.touchEndTime - this.data.touchStartTime;

    // 不是长按，如不做判断点击事件和长按事件会冲突，连个都会执行
    if (time < 500) {
      wx.navigateTo({
        url: '../productInfo/productInfo?id=' + productId
      })
    }

  },

  // 按钮触摸开始触发的事件
  touchStart: function (e) {
    this.setData({ touchStartTime: e.timeStamp })
  },

  // 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.setData({ touchEndTime: e.timeStamp })
  },

  // 长按事件，展示 取消、删除 按钮
  longpress: function (e) {
    var productId = e.currentTarget.dataset.id;
    this.setData({ selectDelId: productId });
  },

  // 取消删除遮罩
  cancelDelete: function (e) {
    this.setData({ selectDelId: -1 });
  },

  // 删除收藏
  deleteCollection: function (e) {
    var _this = this;
    var openid = wx.getStorageSync("openid");
    
    // 发起网络请求
    wx.request({
      url: serverUrl + 'delCollectionById',
      data: {
        openid: openid,
        productId: _this.data.selectDelId
      },
      success: function (res) {
        if (res.data.error == 'code-0000') {
          wx.showToast({
            title: res.data.message,
            icon: 'success'
          });

          _this.setData({ selectDelId: -1 });

          _this.getCollectionProductData();
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../images/user/icon_error.png'
          });
        }
      },
      complete: function (e) {
        if (e.errMsg != app.globalData.requestOk) {
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


})
