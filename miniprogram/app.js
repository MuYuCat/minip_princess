// app.js
App({
  onLaunch: function () {
    wx.login({
      success: function(res) {
        if (res.code) {
          var userCode = res.code;
          console.log('登陆成功', res);
          // wx.request({
          //   url: 'https://api.weixin.qq.com/sns/jscode2session',
          //   data: {
          //     appid: 'wx6a9b40f48a1759da' ,
          //     secret: '6f561a0b8fff229e1b48e75b7fd08232',
          //     js_code: userCode,
          //     grant_type: 'authorization_code',
          //   },
          //   header: {
          //       'Content-Type': 'application/json'
          //   },
          //   success: function(res) {
          //     console.log(res.data)
          //   }
          // })
          wx.setStorage({
            key:"code",
            data:"res.code"
          })
        } else {
          console.log('登陆失败', res);
        }
      }
    });

    wx.getUserInfo({
      success: function(res) {
        console.log('getUserInfo', res);
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女 
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
      }
    })
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      });
    }

    this.globalData = {};
  }
});
