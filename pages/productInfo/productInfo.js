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
    },

    // 商品图片
    images: [],


    // 商品选择分类页面数据 end
  },
  onLoad: function (param) {
    var _this = this;
    _this.showToast();
    // 发起网络请求
    wx.request({
      url: serverUrl + 'queryProductDetailInfoById',
      data: {
        productId: param.id
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

  tap_ch_select: function (e) {
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
    // 商品id
    var productId = e.currentTarget.dataset.productid;
    // 用户openid
    var openid = wx.getStorageSync("openid");
    // 添加收藏
    wx.request({
      url: serverUrl + 'addCollectionProduct',
      data: {
        productId: productId,
        openid: openid
      },
      success: function (res) {
        console.log(res)
        if (res.data.error == 'code-0000') {
          _this.setData({
            collectionImage: '../../images/productInfo/icon_collection1.png'
          });
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
  }

})
