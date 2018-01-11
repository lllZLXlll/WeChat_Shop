//app.js
App({ 
  onLaunch: function () {
    
  },
  globalData: {
    // 服务器地址 test
    serverUrl: 'http://localhost:8080/zlx/',
    // pro
    // serverUrl: 'https://zzzlllxxx.com/',

    // 请求成功返回字符串
    requestOk: 'request:ok',
    // 请求失败返回字符串
    requestFail: 'request:fail ',
    // 请求超时返回字符串
    requestTimeout: 'request:fail timeout',
  }
})