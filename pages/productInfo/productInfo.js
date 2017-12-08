//index.js
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    // 产品参数样式
    translate: 'transform: translateX(-1000px)',
    // 产品分类选择样式
    translate_select: 'transform: translateX(-1000px)',
    // 选择商品数量
    select_product_count: 1,
  },
  toPage: function(object) {
    console.log(object)
    wx.switchTab({
      url: '../logs/logs',
    })
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
  remove_select_product: function(e) {
    if (this.data.select_product_count > 1) {
      this.setData({
        select_product_count: this.data.select_product_count - 1
      });
    }
  },

  add_select_product: function (e) {
    console.log(e)
      this.setData({
        select_product_count: this.data.select_product_count + 1
      });
  },

})
