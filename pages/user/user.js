//获取应用实例
const app = getApp()

Page({
  data: {
    // 用户头像
    userInfo: {
      nickName: null,
      avatarUrl: null,
    },
  },
  
  // 用户登录
  userLogin: function() {
    var _this = this;  
    wx.login({
      success: function(e) {
        // 登录成功后获取用户信息
        wx.getUserInfo({
          success: function(e) {
            _this.setData({
              userInfo: e.userInfo
            });
          }
        })
      }
    })
  }

})
