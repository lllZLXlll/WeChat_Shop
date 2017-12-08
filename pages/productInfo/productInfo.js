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
    // 筛选样式
    translate: 'transform: translateX(-1000px)',
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
  // 侧边栏切换效果 end
  

})
