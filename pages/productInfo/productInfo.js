//获取应用实例
const app = getApp();
const serverUrl = app.globalData.serverUrl;

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    // 商品参数样式
    translate: 'transform: translateX(-1000px)',
    // 商品分类选择样式
    translate_select: 'transform: translateX(-1000px)',
    // 商品收藏图片
    collectionImage: '../../images/productInfo/icon_collection.png',
    // 商品是否收藏 0否 1是
    collectionProduct: 0,
    // 商品数据
    productInfo: [],

    // 商品选择分类页面数据 begin
    selectProductInfo: {
      // 商品分类集合
      productCalsss: [],
      // 选择的商品对象
      product: {},
      // 选择的商品数量
      select_product_count: 1,
      // 选择分类商品的id
      select_product_id: -1,
      // 从分类、加入购物车、立即购买点击进入选择页面状态不同，底部展示按钮也不同
      // 1：选择分类 2：加入购物车 3：立即购买
      selectStatus: 1,
    },

    // 商品图片
    images: [],


    // 商品选择分类页面数据 end
  },
  onLoad: function (param) {
    var _this = this;
    _this.showToast();

    // 用户openid
    var openid = wx.getStorageSync("openid");
    if (!openid) {
      openid = null;
    }

    // 发起网络请求
    wx.request({
      url: serverUrl + 'queryProductDetailInfoById',
      data: {
        productId: param.id,
        openid: openid
      },
      success: function (res) {
        console.log(res)
        if (res.data.error == 'code-0000') {
          _this.hideoast();
          // 返回数据map
          var resultMap = res.data.resultMap;
          // 商品图片集合
          var productImages = resultMap.productImages;
          // 选中商品信息
          var selectProductInfo = _this.data.selectProductInfo;

          selectProductInfo.productCalsss = resultMap.productCalsss;
          selectProductInfo.product.price = resultMap.price;
          selectProductInfo.product.count = resultMap.count;
          selectProductInfo.product.productImage = resultMap.productImage;
          selectProductInfo.product.id = -1;

          var images = new Array();
          var count = productImages.length;
          if (productImages.length > 0) {
            for (var i = 0; i < count; i++) {
              images[i] = productImages[i].image;
            }
          }

          _this.setData({
            productInfo: resultMap,
            selectProductInfo: selectProductInfo,
            images: images,
            collectionProduct: resultMap.collectionProduct,
            collectionImage: resultMap.collectionProduct == 0 ? '../../images/productInfo/icon_collection.png' : '../../images/productInfo/icon_collection1.png',
          });
        }
      },
      complete: function (e) {
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
        }
      }
    });
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

  // 侧边栏切换效果 begin
  tap_ch: function (e) {
    if (this.data.open) {
      this.setData({
        translate: 'transform: translateX(-1000px)'
      })
      this.data.open = false;
    } else {
      this.setData({
        translate: 'transform: translateX(0px)'
      })
      this.data.open = true;
    }
  },

  shoppingCartPurchase: function (e) {
    var _this = this;
    var _type = e.currentTarget.dataset.type;
    // 用户openid
    var openid = wx.getStorageSync("openid");
    // 判断用户是否登录
    if (!openid) {
      wx.showModal({
        title: '提示',
        content: '请先登录哦!',
        success: function (res) {
          if (res.confirm) {
            // 添加购物车
            if (_type == 1) {
              _this.getUserInfo(_this.addShoppingCart);
            } else if (_type == 2) { // 直接购买商品
              // 跳转到结算页面
              _this.getUserInfo(_this.toPageSettlement);
            }
          } else if (res.cancel) {
            console.log('用户点击取消');
            return;
          }
        }
      });
    } else {
      if (_type == 1) {
        _this.addShoppingCart();
      } else if (_type == 2) {
        // 跳转到结算页面
        _this.toPageSettlement();
      }
    }
  },

  // 添加购物车
  addShoppingCart: function (e) {
    var _this = this;
    // 用户openid
    var openid = wx.getStorageSync("openid");
    var selectProductInfo = _this.data.selectProductInfo;
    console.log(_this.data.selectProductInfo)
    // 选择了商品
    if (selectProductInfo.select_product_id != -1) {

      // 发起网络请求
      _this.showToast();
      wx.request({
        url: serverUrl + 'addShoppingCart',
        data: {
          openid: openid,
          productId: selectProductInfo.product.productId,
          productClassId: selectProductInfo.select_product_id,
          productCount: selectProductInfo.select_product_count,
        },
        success: function (res) {
          _this.hideoast();
          if (res.data.error == 'code-0000') {
            wx.showToast({
              title: res.data.message,
              icon: 'success'
            });
            _this.tap_ch_select();
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
    } else {
      wx.showToast({
        title: '请先选择商品',
        image: '../../images/user/icon_error.png'
      });
    }
  },

  tap_ch_select: function (e) {
    if (e) {
      var selectProductInfo = this.data.selectProductInfo;
      selectProductInfo.selectStatus = e.currentTarget.dataset.status;
      this.setData({ selectProductInfo: selectProductInfo });
    }
    if (this.data.open) {
      this.setData({
        translate_select: 'transform: translateX(-1000px)'
      })
      this.data.open = false;
    } else {
      this.setData({
        translate_select: 'transform: translateX(0px)'
      })
      this.data.open = true;
    }
  },
  // 侧边栏切换效果 end

  // 增，删减选择的商品
  remove_select_product: function (e) {
    var selectProductInfo = this.data.selectProductInfo;
    if (selectProductInfo.select_product_count > 1) {
      selectProductInfo.select_product_count = selectProductInfo.select_product_count - 1;
      this.setData({
        selectProductInfo: this.data.selectProductInfo
      });
    }
  },

  add_select_product: function (e) {
    var selectProductInfo = this.data.selectProductInfo;
    selectProductInfo.select_product_count = selectProductInfo.select_product_count + 1;
    this.setData({
      selectProductInfo: this.data.selectProductInfo
    });
  },

  // 在商品选择分类界面选择分类
  selectProduct: function (e) {
    var selectProductInfo = this.data.selectProductInfo;
    var index = e.currentTarget.dataset.index;
    selectProductInfo.product = selectProductInfo.productCalsss[index];
    selectProductInfo.select_product_id = selectProductInfo.product.id;
    this.setData({
      selectProductInfo: selectProductInfo,
    });
  },

  // 查看图片
  openImages: function (e) {
    var _this = this;
    wx.previewImage({
      current: e.currentTarget.dataset.image, // 当前显示图片的http链接
      urls: _this.data.images // 需要预览的图片http链接列表
    })
  },

  // 添加收藏
  addCollection: function (e) {
    var _this = this;
    // 用户openid
    var openid = wx.getStorageSync("openid");
    if (!openid) {
      wx.showModal({
        title: '提示',
        content: '请先登录才能收藏宝贝',
        success: function (res) {
          if (res.confirm) {
            _this.getUserInfo(_this.addCollectionProduct);
          } else if (res.cancel) {
            console.log('用户点击取消');
            return;
          }
        }
      });
    } else {
      _this.addCollectionProduct();
    }

  },

  addCollectionProduct: function () {
    var _this = this;
    // 用户openid
    var openid = wx.getStorageSync("openid");
    // 添加收藏
    wx.request({
      url: serverUrl + 'addCollectionProduct',
      data: {
        productId: _this.data.productInfo.id,
        openid: openid
      },
      success: function (res) {
        console.log(res)
        if (res.data.error == 'code-0000') {
          if (res.data.type == 1) {
            _this.setData({
              collectionImage: '../../images/productInfo/icon_collection1.png',
              collectionProduct: 1,
            });
          } else {
            _this.setData({
              collectionImage: '../../images/productInfo/icon_collection.png',
              collectionProduct: 0,
            });
          }
        }
      },
      complete: function (e) {
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
        }
      }
    });
  },

  // 获取用户信息
  getUserInfo: function (fun) {
    var _this = this;

    wx.login({
      success: function (res) {
        if (res.code) {
          wx.getUserInfo({
            lang: 'zh_CN',
            success(e) {
              //发起网络请求
              wx.request({
                url: serverUrl + 'login',
                data: {
                  jdCode: res.code,
                  nickName: e.userInfo.nickName,
                  gender: e.userInfo.gender,
                  country: e.userInfo.country,
                  province: e.userInfo.province,
                  city: e.userInfo.city,
                  avatarUrl: e.userInfo.avatarUrl,
                },
                success: function (res) {
                  console.log(res.data)
                  if (res.data.error == 'code-0000') {
                    // 登录成功，用户openid保存到微信存储中
                    wx.setStorageSync("openid", res.data.openid);
                    if (fun)
                      fun();
                  }
                }
              })
            }
          });
        }
      }
    });

  },

  // 跳转到结算页面
  toPageSettlement: function (e) {
    // 选择了商品
    if (this.data.selectProductInfo.select_product_id != -1) {
      wx.navigateTo({
        url: '../settlement/settlement?productId=' + this.data.selectProductInfo.product.productId + '&productCount=' + this.data.selectProductInfo.select_product_count + '&productClassId=' + this.data.selectProductInfo.select_product_id
      });

      this.tap_ch_select();
    } else {
      wx.showToast({
        title: '请先选择商品',
        image: '../../images/user/icon_error.png'
      });
    }
  },

})
