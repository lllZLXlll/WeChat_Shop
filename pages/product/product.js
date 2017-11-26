//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    searchImage: '../../images/product/icon_search.png',
    classificationImage: '../../images/product/icon_classification.png',
    // tab切换  
    currentTab: 0,
    // 屏幕剩余高度
    windowHeight: 0,
    // 滚动视图位置
    scrollTop: 0,
    // 分类图片
    icon_class: '../../images/product/icon_class2.png',

    // product data
    productData: [
      {
        productId: 1,productTitle: '小米手环1', price: 149.99, count: '1.1万人付款',     image:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
      },
      {
        productId: 1,productTitle: '小米手环2', price: 349, count: '2.1万人付款', image: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg'
      },
      {
        productId: 1,productTitle: '小米手环3', price: 549, count: '3.1万人付款', image: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
      },
      {
        productId: 1, productTitle: '小米手环1', price: 149.99, count: '1.1万人付款', image: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
      },
      {
        productId: 1, productTitle: '小米手环2', price: 349, count: '2.1万人付款', image: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg'
      },
      {
        productId: 1, productTitle: '小米手环3', price: 549, count: '3.1万人付款', image: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
      },
    ],
  },
  // 界面渲染回调
  onLoad: function() {
    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          windowHeight: res.windowHeight
        });
      },
    })
  },


  classClick: function() {
    console.log('分类');
  },
  searchClick: function () {
    console.log('搜索');
  },

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
    console.log(_this)
    if (_this.data.icon_class == '../../images/product/icon_class2.png')
      this.setData({ icon_class: '../../images/product/icon_class1.png' });
    else
      this.setData({ icon_class: '../../images/product/icon_class2.png' });
  },

})
