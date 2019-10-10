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
    let _this = this
    console.log('scene', options.scene)
    this.globalData.scene = options.scene
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    }
    // 获取加密群信息
    console.log('清除全局数据')
    this.globalData.shareTicket_option = ''
    if (options.scene == 1044) {
      console.log('options.shareTicket', options.shareTicket)
      this.globalData.shareTicket_option = options
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
    shareTicket_option:'',

    //测试公众号地址
    copyLinkGZH: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzUxNDc0OTcxMg==&scene=110#wechat_redirect',
    //正式公众号地址
    // copyLinkGZH: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0OTcyNDU4Ng==&scene=110#wechat_redirect',

    JumpAppId: {                    //测试
      appid: 'wx6b00bfc932f22210',
      // envVersion: 'trial' //体验版
      envVersion: 'release' //正式版
    },
    // JumpAppId: {                   //正式
    //   appid: 'wx29946485f206d315',
    //   // envVersion: 'trial' //体验版
    //   envVersion: 'release' //正式版
    // }, 
  },
  //校验是否通过登陆
  passIsLogin() {
    if (
      this.store.getItem('userData') &&
      this.store.getItem('userData').token
    )
      return true
    else return false
  },
  //检查登录态是否过期
  checkSessionFun() {
    return new Promise((resolve, reject) => {
      wx.checkSession({
        success: (res) => {
          //session_key 未过期，并且在本生命周期一直有效
          console.log(`${new Date().getTime()}-登录态没过期，本地用户缓存-${this.passIsLogin() ? "有" : "没有-重新获取"}`)
          this.passIsLogin()
            ? resolve()
            : this.wx_loginIn().then(() => {
              resolve();
            }, () => {
              reject()
            })
        },
        fail: () => {
          console.log('登录态过期,重新登录')
          // session_key 已经失效，需要重新执行登录流程
          this.wx_loginIn().then(() => {
            resolve();
          }, () => {
            reject()
          })
        }
      })
    })

  },
  //正常登录用户方法
  wx_loginIn: function () {
    let _this = this
    return new Promise((resolve, reject) => {
      wx.login({
        success: res_code => {
          _this.globalData.code = res_code.code
          Store.setItem('code', res_code.code)
          let shareMemberId = wx.getStorageSync('shareMemberId') ? wx.getStorageSync('shareMemberId') : '';
          let data = {
            code: res_code.code,
            sourceData: _this.globalData.scene,
            shareChannel: shareMemberId,
          }
          api.get('authorizationShare', data).then(res => {
            if (res.msg) {
              if (res.code === -1) { //如果出现登录未知错误
                setTimeout(() => {
                  wx.navigateTo({
                    url: `/pages/noFind/noFind?type=1`
                  })
                }, 0)
              } else {
                // 已关联公众号
                wx.setStorageSync('shareMemberId', res.msg.id || '')
                wx.setStorageSync('userData', res.msg)
                //Store.setItem('userData', res.msg)
                resolve()
              }
            } else if (res.code === 0 && !res.msg) {
              // code: 0;
              // msg: null
              resolve()
            } else {
              reject()
            }
          })
        },
        fail: () => {
          console.error('登录失败！')
        }
      })
    })
  },
  //错误用户手动同意授权登录方法
  wx_AuthUserLogin: function () {
    let _this = this
    return new Promise((resolve, reject) => {
      wx.login({
        success: res_code => {
          _this.globalData.code = res_code.code
          Store.setItem('code', res_code.code)
          wx.getUserInfo({
            lang: 'zh_CN',
            success(res_userInfo) {
              Store.setItem('wx_userInfo', res_userInfo.userInfo)
              console.log('用户信息', res_userInfo)
              let data = {
                code: res_code.code,
                sourceData: _this.globalData.scene,
                shareChannel: _this.globalData.shareMemberId || '',
                nickName: res_userInfo.userInfo.nickName || '',
                headImg: res_userInfo.userInfo.avatarUrl || '',
                city: res_userInfo.userInfo.city || '',
                gender: res_userInfo.userInfo.gender || '',
                encryptedData: res_userInfo.encryptedData || '',
                iv: res_userInfo.iv || '',
                rawData: res_userInfo.rawData || '',
                signature: res_userInfo.signature || ''
              }
              wx.showLoading({ title: '登录中...', })
              api.get('authorizationShare', data).then(res => {
                wx.hideLoading()
                if (res.msg) {
                  if (res.code === -1) { //如果出现登录未知错误
                    setTimeout(() => {
                      wx.navigateTo({ url: `/pages/noFind/noFind?type=1` })
                    }, 0)
                  } else {
                    Store.setItem('userData', res.msg)
                    resolve()
                  }
                } else {
                  setTimeout(() => {
                    wx.navigateTo({ url: `/pages/noFind/noFind?type=1` })
                  }, 0)
                }
              })
            },
            fail() {
              reject('拒绝授权')
            }
          })

        },
        fail: () => {
          console.error('登录失败！')
        }
      })
    })
  },
  compareVersion(v1, v2) {
      v1 = v1.split('.')
      v2 = v2.split('.')
      const len = Math.max(v1.length, v2.length)

      while(v1.length <len) {
          v1.push('0')
        }
      while(v2.length <len) {
          v2.push('0')
        }

      for(let i = 0; i<len; i++) {
      const num1 = parseInt(v1[i])
      const num2 = parseInt(v2[i])

      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }

    return 0
  }
  //修改用户信息接口
  // wx_modifyUserInfo() {
  //   wx.showLoading({ title: '加载中...',})
  //   return new Promise(resolve => {
  //     let data = {
  //       nickName: Store.getItem('wx_userInfo').nickName || '',
  //       headImg: Store.getItem('wx_userInfo').avatarUrl || '',
  //       city: Store.getItem('wx_userInfo').city || '',
  //       gender: Store.getItem('wx_userInfo').gender || ''
  //     }
  //     api.post('modifyUserInfo', data).then(res => {
  //       wx.hideLoading()
  //       console.log('修改用户信息接口', res)
  //       if (res.msg) {
  //         //  Store.setItem('userData', res.msg) //暂时不同步更新用户数据
  //          resolve(res.msg)
  //       } else {
  //         wx.showToast({
  //           title: '授权失败!',
  //           icon:'none'
  //         })
  //       }
  //     })
  //   })
  // },
})