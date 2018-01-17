//获取应用实例
const app = getApp()
const serverUrl = app.globalData.serverUrl;

Page({
  data: {
    // tab切换  
    currentTab: '0',

    // 订单数据
    page: [],
    isLoad: false,
    isBottomText: false,
    // 是否有数据
    isData: true,
  },

  onShow: function (e) {
    this.getData();
  },

  onLoad: function (e) {
    var _this = this;
    if (e.currentTab) {
      _this.setData({ currentTab: e.currentTab });
    }

  },

  getData: function (e) {
    var _this = this;
    var currentTab = _this.data.currentTab;
    if (currentTab == 0 || currentTab == 1) {
      _this.queryOrder(currentTab);
    }

  },

  queryOrder: function (currentTab) {
    var _this = this;

    // 用户openid
    var openid = wx.getStorageSync("openid");
    var orderType;

    if (currentTab == 1) {
      orderType = 1;
    }

    var param = {
      openid: openid,
      pageNum: 1,
      orderType: orderType,
    };

    _this.showToast();
    wx.request({
      url: serverUrl + 'queryAllOrder',
      method: 'POST',
      data: JSON.stringify(param),
      success: function (res) {
        _this.hideoast();
        console.log(res)
        if (res.data.error == 'code-0000') {
          _this.setData({ isLoad: false });
          var page = res.data.page;
          console.log(page)

          _this.setData({
            page: page,
            isBottomText: page.pageTotalNum <= 1 ? true : false,
            isData: res.data.page.page.length > 0 ? true : false,
          });

        }
      },
      complete: function (e) {
        wx.hideNavigationBarLoading() //完成停止标题栏中加载
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

        // 一定要放在最后，不然下拉后会卡在下面无法返回上去
        wx.stopPullDownRefresh() //停止下拉刷新
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
    var currentTab = e.target.dataset.current;

    if (_this.data.currentTab === currentTab) {
      return false;
    } else {
      _this.setData({
        currentTab: currentTab
      })
      if (currentTab == 0 || currentTab == 1) {
        _this.queryOrder(currentTab);
      }
    }

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
    var orderType;

    if (_this.data.currentTab == 1) {
      orderType = 1;
    }
    var param = {
      pageNum: _this.data.page.pageNum + 1,
      openid: openid,
      orderType: orderType,
    };

    //发起网络请求
    wx.request({
      url: serverUrl + 'queryAllOrder',
      method: 'POST',
      data: JSON.stringify(param),
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
    this.getData();
  },

  // 上拉加载
  onReachBottom: function (e) {
    console.log('--------上拉加载-------');
    this.loadPage();
  },

  // 取消订单
  cancelOrder: function (e) {
    var _this = this;
    // 用户openid
    var openid = wx.getStorageSync("openid");
    var order = e.currentTarget.dataset.order;
    var param = {
      order: order,
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
              if (res.data.error == 'code-0000') {
                _this.getData();
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
    var order = e.currentTarget.dataset.order;
    var param = {
      order: order,
      openid: openid,
    };

    _this.showToast();
    wx.request({
      url: serverUrl + 'delOrder',
      method: 'POST',
      data: JSON.stringify(param),
      success: function (res) {
        _this.hideoast();
        if (res.data.error == 'code-0000') {
          _this.getData();
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

  toOrderInfo: function (e) {
    wx.navigateTo({
      url: '../orderInfo/orderInfo?order=' + e.currentTarget.dataset.order
    })
  },

})
