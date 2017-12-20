//index.js
//获取应用实例
const app = getApp();
const serverUrl = app.globalData.serverUrl;

Page({
  data: {
    // 侧边栏数据 begin
    open: false,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    translate: 'transform: translateX(-1000px)',
    // 侧边栏数据 end

    searchImage: '../../images/product/icon_search.png',
    classificationImage: '../../images/product/icon_classification.png',
    // tab切换  
    currentTab: 0,
    // 屏幕高度
    screenHeight: 0,
    // 屏幕剩余高度
    windowHeight: 0,
    // 滚动视图位置
    scrollTop: 0,
    // 分类图标图片
    icon_class: '../../images/product/icon_class1.png',
    classification: 1,

    // 商品列表临时数据
    productData: [
      // {
      //   productId: 1, name: '小米手环小米手环1小米手环1123123小米手环小米手环1小米手环1123123', price: 149.99, salesVolume: '1.1万人付款', expressFee: '包邮',     image:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
      // },
      // {
      //   productId: 1, name: '小米手环小米手环1小米手环1123123小米手环小米手环1小米手环1123123', price: 149.99, salesVolume: '1.1万人付款', expressFee: '包邮',     image:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
      // },
      // {
      //   productId: 1, name: '小米手环小米手环1小米手环1123123小米手环小米手环1小米手环1123123', price: 149.99, salesVolume: '1.1万人付款', expressFee: '包邮',     image:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
      // },
      // {
      //   productId: 1, name: '小米手环小米手环1小米手环1123123小米手环小米手环1小米手环1123123', price: 149.99, salesVolume: '1.1万人付款', expressFee: '包邮',     image:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
      // },
      // {
      //   productId: 1, name: '小米手环小米手环1小米手环1123123小米手环小米手环1小米手环1123123', price: 149.99, salesVolume: '1.1万人付款', expressFee: '包邮',     image:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
      // },
      // {
      //   productId: 1, name: '小米手环小米手环1小米手环1123123小米手环小米手环1小米手环1123123', price: 149.99, salesVolume: '1.1万人付款', expressFee: '包邮',     image:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
      // },
      // {
      //   productId: 1, name: '小米手环小米手环1小米手环1123123小米手环小米手环1小米手环1123123', price: 149.99, salesVolume: '1.1万人付款', expressFee: '包邮',     image:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
      // },
      // {
      //   productId: 1, name: '小米手环小米手环1小米手环1123123小米手环小米手环1小米手环1123123', price: 149.99, salesVolume: '1.1万人付款', expressFee: '包邮',     image:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
      // },
      
    ],

    // 商品列表数据
    page: [

    ],

    // 当前页数
    pageNum: 1,
    // 列表数据总页数  
    totalPageNum: 2,
  },
  // 界面渲染回调
  onLoad: function() {
    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          windowHeight: res.windowHeight,
          screenHeight: res.screenHeight,
        });
      },
    })

    //发起网络请求
    wx.request({
      url: serverUrl + 'queryProductList',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.error == 'code-0000') {
          // 登录成功，用户openid保存到微信存储中
          _this.setData({ page: res.data.page});
        }
      }
    });
  },

  // 上拉加载
  loadPage: function() {
    var _this = this;

    // 总页数等于当前页数不加载
    if (_this.data.totalPageNum <= _this.data.pageNum) {
      return;
    }

    //发起网络请求
    wx.request({
      url: serverUrl + 'queryProductList',
      data: {
        pageNum: _this.data.pageNum + 1,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.error == 'code-0000') {
          // 登录成功，用户openid保存到微信存储中
          _this.setData({ 
            productData: _this.data.page.page.concat(res.data.page.page),
            pageNum: _this.data.pageNum + 1,
          });
        }
      }
    });

  },


  classClick: function() {
    console.log('分类');
  },
  searchClick: function () {
    console.log('搜索');
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
  // 侧边栏切换效果 end

  // tab改变回调
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  // 商品列表滚动到顶部回调
  topRefresh: function() {
    // wx.showToast({
    //   title: '滚动到顶部回调',
    //   icon: 'success',
    //   mask: true,
    // })
  },
  // 商品列表滚动到底部回调
  bottomRefresh: function(e) {
    // console.log(e)
    // wx.showToast({
    //   title: '滚动到底部回调',
    //   icon: 'success',
    //   mask: true,

    // })
  } ,

  // 回到顶部
  toTop: function() {
    var _this = this;
    this.setData({scrollTop: 0});
  },
  
  // 切换分类
  setIconClass: function() {
    var _this = this;
    console.log(_this.data.classification)
    if (_this.data.classification == 2) {
      this.setData({ 
        icon_class: '../../images/product/icon_class1.png',
        classification: 1,
        });
    }else {
      this.setData({
        icon_class: '../../images/product/icon_class2.png',
        classification: 2
        });
    }
  },
  toProductInfo: function (object) {
    console.log(object)
    wx.navigateTo({
      url: '../productInfo/productInfo'
    })
  },

})
