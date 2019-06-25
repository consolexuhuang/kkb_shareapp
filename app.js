//app.js
const api = require('./utils/api.js');
import Store from './utils/store.js';

App({
  onLaunch: function (options) {
    this.api = api
    this.store = Store;
    this.globalData.scene = options.scene
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
    this.globalData.scene = options.scene
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
    scene:'',

    JumpAppId: {                    //测试
      appid: 'wx6b00bfc932f22210',
      envVersion: 'trial' //体验版
      // envVersion: 'release' //正式版
    },
    // JumpAppId: {                   //正式
    //   appid: 'wx29946485f206d315',
    //   envVersion: 'trial' //体验版
    //   // envVersion: 'release' //正式版
    // }, 
  },

  wx_loginIn: function () {
    let _this = this
    return new Promise((resolve, reject) => {
      wx.login({
        success: res_code => {
          _this.globalData.code = res_code.code
          Store.setItem('code', res_code.code)
          let data = {
            code: res_code.code,
            sourceData: _this.globalData.scene,
            shareChannel: _this.globalData.shareMemberId || '',
            nickName: Store.getItem('wx_userInfo').nickName || '',
            headImg: Store.getItem('wx_userInfo').avatarUrl || '',
            city: Store.getItem('wx_userInfo').city || '',
            gender: Store.getItem('wx_userInfo').gender || ''
          }
          api.get('authorizationShare', data).then(res => {
            console.log('登陆', res.msg)
            Store.setItem('userData', res.msg)
            // if (res.msg.isNewMember === 1) {
            //   // 新用户
            // } else {
            //   Store.setItem('userData', res.msg)
            // }
            resolve()
          })
        }
      })
    })
  },
  //修改用户信息接口
  wx_modifyUserInfo() {
    wx.showLoading({ title: '加载中...',})
    return new Promise(resolve => {
      let data = {
        nickName: Store.getItem('wx_userInfo').nickName || '',
        headImg: Store.getItem('wx_userInfo').avatarUrl || '',
        city: Store.getItem('wx_userInfo').city || '',
        gender: Store.getItem('wx_userInfo').gender || ''
      }
      api.post('modifyUserInfo', data).then(res => {
        wx.hideLoading()
        console.log('修改用户信息接口', res)
        if (res.msg) {
          //  Store.setItem('userData', res.msg) //暂时不同步更新用户数据
           resolve(res.msg)
        } else {
          wx.showToast({
            title: '授权失败!',
            icon:'none'
          })
        }
      })
    })
  },
})