//获取应用实例
const app = getApp();
const serverUrl = app.globalData.serverUrl;

Page({
  data: {
    // 列表数据
    page: [],
    isLoad: false,
    isBottomText: false,

    // 是否有数据
    isData: true,

    // 是否全选
    isSelectAll: false,
    // 结算商品总金额
    allMoney: 0,
    // 结算商品数量
    allProCount: 0,
  },

  // 界面渲染回调
  onLoad: function () {
    var _this = this;

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
          var page = res.data.page;
          console.log(page)

          if (res.data.page.page.length > 0) {
            _this.setData({
              page: page,
              isBottomText: page.pageTotalNum <= 1 ? true : false,
              isData: true,
              allMoney: 0,
              allProCount: 0,
            });
          } else {
            // 没有数据
            _this.setData({ isData: false });
          }
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
  onPullDownRefresh: function (e) {
    console.log('--------下拉刷新-------');
    wx.stopPullDownRefresh() //停止下拉刷新
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getProductData();
  },

  // 上拉加载
  onReachBottom: function (e) {
    console.log('--------上拉加载-------');
    this.loadPage();
  },

  // 跳转商品详情页面
  toProductInfo: function (e) {
    wx.navigateTo({
      url: '../productInfo/productInfo?id=' + e.currentTarget.dataset.id
    })
  },

  // 删除购物车商品
  delProduct: function (e) {
    var _this = this;
    var page = _this.data.page;
    var length = page.page.length;
    var array = [];
    for (var i = 0; i < length; i++) {
      if (page.page[i].isSelected) {
        array[i] = page.page[i].id;
      }
    }

    if (!array.length > 0) return;

    // 用户openid
    var openid = wx.getStorageSync("openid");
    
    _this.showToast();
    // 发起网络请求
    wx.request({
      url: serverUrl + 'delShoppingCartList',
      data: {
        openid: openid,
        array: JSON.stringify(array),
      },
      success: function (res) {
        wx.hideNavigationBarLoading() //完成停止加载
        if (res.data.error == 'code-0000') {
          _this.hideoast();
          wx.showToast({
            title: res.data.message,
            icon: 'success'
          });
          _this.getProductData();
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
          _this.setData({ isBottomText: true });
        }
      }
    });
  },

  // 增加商品数量
  addCount: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var page = _this.data.page;
    page.page[index].productCount = page.page[index].productCount + 1;
    _this.setData({ page: page });
  },

  // 减少商品数量
  removeCount: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var page = _this.data.page;
    page.page[index].productCount = page.page[index].productCount - 1;
    _this.setData({ page: page });
  },

  // 选中购物车商品
  selectedProduct: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var page = _this.data.page;
    page.page[index].isSelected = true;
    var money = parseFloat(_this.data.allMoney) + parseFloat(page.page[index].price * page.page[index].productCount);

    _this.setData({
      page: page,
      allMoney: money.toFixed(2),
      allProCount: _this.data.allProCount + 1,
    });

  },

  // 取消选中购物车商品
  notSelectedProduct: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var page = _this.data.page;
    page.page[index].isSelected = false;
    var money = parseFloat(_this.data.allMoney) - parseFloat(page.page[index].price * page.page[index].productCount);

    _this.setData({
      page: page,
      allMoney: money.toFixed(2),
      allProCount: _this.data.allProCount - 1,
    });
  },

  // 全选
  selectedAll: function (e) {
    var _this = this;
    var page = _this.data.page;
    var length = page.page.length;
    var money = 0;

    for (var i = 0; i < length; i++) {
      page.page[i].isSelected = true;
      money += page.page[i].price * page.page[i].productCount;
    }

    _this.setData({
      page: page,
      isSelectAll: true,
      allMoney: money.toFixed(2),
      allProCount: length,
    });

  },

  // 取消全选
  notSelectedAll: function (e) {
    var _this = this;
    var page = _this.data.page;
    var length = page.page.length;
    for (var i = 0; i < length; i++) {
      page.page[i].isSelected = false;
    }

    _this.setData({
      page: page,
      isSelectAll: false,
      allMoney: 0,
      allProCount: 0,
    });

  },

})
