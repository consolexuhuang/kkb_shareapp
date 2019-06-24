//app.js
const api = require('./utils/api.js');
import Store from './utils/store.js';

App({
  onLaunch: function (options) {
    this.api = api
    this.store = Store;
    //登录
    // this.checkSessionFun();
    //版本更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    //获取不同设备高度
    wx.getSystemInfo({
      success: res => {
        this.globalData.tab_height = res.statusBarHeight
        this.globalData.systemInfo = res
        if (res.model.indexOf('iPhone X') > -1) {
          this.globalData.isIpX = true
        }
      },
    })
  },
  onShow(options){
    console.log('scene', options.scene)
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = false
    } else {
      this.globalData.share = true
    }
  },
  globalData: {
    imgUrl: '/images/',
    systemInfo: '',
    share: false,
    tab_height: 0,
    code: '',
    // openid:'',
    location: '',
    isIpX: false, //是否是ipHonex
    redirectToState: true,
  },

  // //检查登录态是否过期
  // checkSessionFun() {
  //   wx.checkSession({
  //     success: () => {
  //       //session_key 未过期，并且在本生命周期一直有效
  //       Store.getItem('userData') ? console.log('无需重新登陆') : this.wx_loginIn()
  //     },
  //     fail: () => {
  //       // session_key 已经失效，需要重新执行登录流程
  //       this.wx_loginIn();
  //     }
  //   })
  // },
  wx_loginIn: function () {
    let _this = this
    return new Promise((resolve, reject) => {
      wx.login({
        success: res_code => {
          console.log('code', res_code.code)
          _this.globalData.code = res_code.code
          Store.setItem('code', res_code.code)
          let data = {
            code: res_code.code
          }
          api.get('authorizationShare', data).then(res => {
            if (res.msg) {
              if (res.code === -1) { //如果出现登陆未知错误
                // setTimeout(() => {
                //   wx.navigateTo({ url: `/pages/noFind/noFind?type=1` })
                // }, 0)
              } else {
                // 已关联公众号
                Store.setItem('userData', res.msg)
              }
            } else {
              // 未关联
              // setTimeout(() => {
              //   wx.redirectTo({
              //     url: '/pages/inviteShare/inviteShare',
              //   })
              // }, 0)
            }
            resolve()
          })
        }
      })
    })
  },
})