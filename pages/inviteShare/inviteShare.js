// pages/invite/invite.js
const api = getApp().api
import Store from '../../utils/store.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: '',      //用户数据
    shareMemberId: '', //上级分享用户id
    shareCoupon: '',   //享的配置参数
    invitedInfo: '',   //获取邀请信息
    invitedCouponList:'', //拉新用户优惠券列表
    qrcode: '',        //获取带本人信息的二维码
    inviteMember: '',  //分享人的信息
    // inviteQrcode: '',  //分享者信息的二维码
    imgUrl: getApp().globalData.imgUrl,
    isShadeShow:false , //面对面状态
    postConfig: {      //海报配置信息
      shareBgImg: '',
      codeImg: ''
    },
    isShare: getApp().globalData.share,
    jurisdictionState: false, //授权显示
    IsshowNetStatus:true,

    copyLinkGZH: getApp().globalData.copyLinkGZH,
    tipsState: false, //提示
    userAdmin:'', //当前用户身份 1：自己，2: 新用户, 3: 其他（老用户下单/为下单）
    // isReceiveState: false

    // navbarData: {
    //   title: 'Justin&Julie',
    //   showCapsule: 0,
    //   isShowBackHome: false,
    //   titleColor: "#000",
    //   tab_topBackground: '#fff'
    // },
    // marginTopBar: getApp().globalData.tab_height * 2 + 20
  },
// ----------------------------------------公共方法层
  getUserAdmin(){
    if (!getApp().globalData.share){
      this.setData({ userAdmin: '' })
    } else {
      if (this.data.shareMemberId == this.data.userData.id){
        this.setData({ userAdmin: 1})
      } else if (this.data.userData.isNewMember){
        this.setData({ userAdmin: 2 })
      } else {
        this.setData({ userAdmin: 3 })
      }
    }
    console.log('身份', this.data.userAdmin)
  },
  // 获取当前用户关注状态
  getMemberFollowState() {
    api.post('v2/member/memberInfo').then(res => {
      console.log('getMemberFollowState', res)
      Store.setItem('userData', res.msg)
    })
  },
  //缓存数据先渲染
  getStoreDataView(){
    return new Promise((resolve) => {
      if (Store.getItem('shareCoupon')){
        this.setData({ shareCoupon: Store.getItem('shareCoupon') },()=>{
          console.log('缓存渲染')
          resolve()
        })
      } else {
        console.log("缓存shareCoupon不存在")
        resolve()
      }
    })
  },
  // 获取页面的数据及分享的配置参数
  getShareCouponInfo: function () {
    this.getStoreDataView().then(() => {
      wx.showLoading({ title: '加载中...' })
      api.post('v2/coupon/shareCouponInfo').then(res => {
        setTimeout(() => {
          wx.hideLoading();
        }, 100);
        console.log(res)
        // res.msg.banner = res.msg.banner + '?imageView/1/w/375/h/335'
        const shareCoupon = res.msg
        this.setData({
          shareCoupon
        })
        console.log('接口渲染')
        Store.setItem('shareCoupon', res.msg)
        // !this.data.postConfig.shareBgImg ? this.getShareBgImg(res.msg.banner) : ''
      })
    })
  },
  // 获取邀请信息
  getInvitedInfo: function () {
    wx.showLoading({ title: '加载中...',})
    api.post('v2/member/getInvitedInfo').then(res => {
      setTimeout(() => {
        wx.hideLoading();
      }, 100);
      console.log('invitedCouponList',res)
      this.setData({
        invitedCouponList: res.msg.invited_member_List,
        invitedInfo: res.msg
      })
      Store.setItem('invitedCouponList', res.msg.invited_member_List)
    })
  },
  // 获取海报的二维码
  getQrcode: function () {
    api.post('getQrcode').then(res => {
      const qrcode = res.msg
      this.setData({
        qrcode
      })
      // !this.data.postConfig.codeImg ? this.getCodeImg(res.msg) : ''
    })
  },
  // 获取分享人的信息
  getInviteMemberInfo: function () {
    const shareMemberId = this.data.shareMemberId
    // const shareMemberId = Store.getItem('userData').id
    const data = {
      id: shareMemberId
    }
    api.post('v2/member/inviteMemberInfo', data).then(res => {
      res.msg.config.banner1 = res.msg.config.banner1 + '?imageView/1/w/750/h/670'
      res.msg.config.banner2 = res.msg.config.banner2 + '?imageView/1/w/500/h/500'
      const inviteMember = res.msg
      console.log("inviteMember",res.msg)
      this.setData({
        inviteMember
      })
    })
  },
  // 获取带分享者信息的二维码
  // getInviteQrcode: function () {
  //   const shareMemberId = this.data.shareMemberId
  //   const data = {
  //     memberId: shareMemberId
  //   }
  //   api.post('getQrcode', data).then(res => {
  //     const inviteQrcode = res.msg
  //     this.setData({
  //       inviteQrcode
  //     })
  //   })
  // },
  getFirstStepFriendList(){
    const data = {
      id: this.data.shareMemberId
    }
    api.post('v2/member/getInvitedSummaryInfo', data).then(res => {
      console.log('getInvitedSummaryInfo',res)
      this.setData({
        invitedInfo: res.msg,
        invitedCouponList: Store.getItem('invitedCouponList')
      })
    })
  },
  //加载用户信息总配置
  LoadPageFunc(){
    let userData = Store.getItem('userData') || ''
    this.setData({
      userData
    })
    this.getMemberFollowState()
    this.getFirstStepFriendList()
    this.getShareCouponInfo()
    this.getQrcode()
    this.getInvitedInfo()
    this.getInviteMemberInfo()
    this.getUserAdmin()
    // this.getInviteQrcode()
  },
// -----------------------------------------------逻辑渲染层
  onReady(){
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('上级id', options.shareMemberId)
    const shareMemberId = options.shareMemberId || ''
    this.setData({
      shareMemberId
    })
    getApp().globalData.shareMemberId = options.shareMemberId
    // Store.clear('userData')
    if (!Store.getItem('userData')) {
      getApp().wx_loginIn().then(() => {
        this.LoadPageFunc()
      }, () => {
        wx.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: '#8969FF'
        });
        wx.setNavigationBarTitle({
          title:''
        })
        this.setData({ jurisdictionState: true })
      })
    } else {
      this.LoadPageFunc()
    }
  },
  onShow() {
    wx.hideShareMenu();
    //断网 
    wx.onNetworkStatusChange(res => {
      this.setData({
        IsshowNetStatus: res.isConnected
      })
      wx.hideLoading()
      // res.isConnected ? this.LoadPageFunc() : ''
    })
    console.log('shareState', getApp().globalData.share)
    // this.setData({ isShare : getApp().globalData.share })
  },
// -----------------------------------------------视图层事件
  bindgetuserinfo(){
    getApp().wx_loginIn().then(() => {
      wx.setNavigationBarColor({
        frontColor: "#000000",
        backgroundColor: '#ffffff'
      });
      wx.setNavigationBarTitle({
        title: '邀请好友'
      })
      this.setData({ jurisdictionState : false})
      this.LoadPageFunc()
    },()=>{
      wx.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: '#8969FF'
      });
      this.setData({ jurisdictionState: true })
    })
  },
  //跳转小程序
  handleReturnCourseTap: function (event) {
    console.log('navigateToMiniProgramPath',event.currentTarget.dataset.path)
    let pathUrl = event.currentTarget.dataset.path || 'pages/index/index'
    wx.navigateToMiniProgram({
      appId: getApp().globalData.JumpAppId.appid,
      path: pathUrl,
      extraData: {
        foo: '我是拉新数据'
      },
      envVersion: getApp().globalData.JumpAppId.envVersion,
      success(res) {
        // 打开成功
        console.log(res)
      }
    })
  },
  // 长摁识别
  // distinguishImg() {
  //   this.setData({
  //     showShareState: true
  //   }, () => {
  //     this.showCanvas(this.data.postConfig.shareBgImg, this.data.postConfig.codeImg)
  //   })
  // },
  // 关闭分享
  // onCloseShareImg() {
  //   this.setData({
  //     showShareState: false
  //   })
  // },
  // 显示面对面
  handleFaceInviteBtnTap: function (event) {
    const isShadeShow = true
    this.setData({
      isShadeShow
    })
  },
  // //关闭海报
  // onCloseShareImg() {
  //   this.setData({
  //     showShareState: false
  //   })
  // },
  //关闭面对面
  onClose(){
    this.setData({
      isShadeShow : false
    })
  },
  showCopyPopup(){
    this.setData({ tipsState: true})
  },
  //暂不黏贴
  closeNone(){
    this.setData({ tipsState: false })
  },
  //黏贴
  comfirmCopy(){
    this.setData({ tipsState: false })
    wx.setClipboardData({
      data: `点击下方链接，关注Justin & Julie公众号。资讯一手掌握，福利不再错过~
${this.data.copyLinkGZH}`,
      success: res => {
        wx.getClipboardData({
          success: res => {
            wx.showToast({
              title: '文本已复制成功，可以直接去粘贴',
              icon: 'none'
            })
            wx.vibrateShort()
          }
        })
      }
    })
  },
  jumpToRuleDetail(){
    wx.navigateTo({
      url: '/pages/ruleDetail/ruleDetail',
    })
  },
  //分享
  onShareAppMessage: function (e) {
    console.log('分享人id', e, this.data.userData.id)
    const title = this.data.shareCoupon.linkTitle
    const currentShareMemberId = this.data.userData.id
    return {
      title: title,
      path: '/pages/inviteShare/inviteShare?shareMemberId=' + currentShareMemberId,
      imageUrl: 'https://img.cdn.powerpower.net/5d560e07e4b0b1ac63d89462.png?imageView/1/w/500/h/400',
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    }
  },
  onPullDownRefresh(){
    if (this.data.IsshowNetStatus){
      if (!Store.getItem('userData')) {
        getApp().wx_loginIn().then(() => {
          this.LoadPageFunc()
        })
      } else {
        this.LoadPageFunc()
      }
    }
    
    wx.stopPullDownRefresh()
  },
  /**
   * canvas
   */
  // 下载背景图
  getShareBgImg(banner) {
    let that = this;
    wx.downloadFile({
      url: banner,
      success: res => {
        console.log('banner',res)
        if (res.statusCode === 200) {
          let shareBgImg = res.tempFilePath;
          // that.getCodeImg(shareBgImg)
          this.setData({ ['postConfig.shareBgImg']: shareBgImg })
        } else {
          wx.showToast({
            title: '下载失败！',
            success: () => {
              let shareBgImg = ''
              // that.getCodeImg(shareBgImg)
              this.setData({ ['postConfig.shareBgImg']: shareBgImg })
            }
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  //下载二维码
  getCodeImg(qrcode, count = 1, timer = null) {
    let that = this;
    wx.downloadFile({
      url: qrcode,
      success: res => {
        if (res.statusCode === 200) {
          let codeImg = res.tempFilePath;
          console.log('getCodeImg', codeImg)
          // that.showCanvas(shareBgImg, codeImg)
          this.setData({ ['postConfig.codeImg']: codeImg })
        } else {
          wx.showToast({
            title: '下载失败！',
            success: () => {
              let codeImg = ''
              // that.showCanvas(shareBgImg, codeImg)
              this.setData({ ['postConfig.codeImg']: codeImg })

            }
          })
        }
      },
      complete: res => {
        console.log(res)
        if (res.errMsg == 'downloadFile:fail Error: read ECONNRESET') {
          if (count == 10) {
            clearTimeout(timer)
          } else {
            timer = setTimeout(() => {
              count++
              this.getCodeImg(qrcode, count, timer)
            }, 1000)
          }
        }
      }
    })
  },
  /**
   * 2.创建画布
   */
  showCanvas(shareBgImg, codeImg) {
    wx.showLoading({ title: '海报生成中...' })
    let that = this;
    const ctx = wx.createCanvasContext('myCanvas'); //创建画布
    wx.createSelectorQuery().select('#canvas-container').boundingClientRect(function (rect) {
      console.log(rect)
      var height = rect.height;
      var width = rect.width;
      ctx.setFillStyle("#fff")
      ctx.fillRect(0, 0, width, height)
      //素材展示 所有的比例按照 750宽和 670高算
      if (shareBgImg) {
        ctx.drawImage(shareBgImg, 0, 0, width, height)
      }
      if (codeImg) {
        ctx.drawImage(codeImg, width / 22.7, height / 1.27, width / 7, width / 7)
      }
      //text
      ctx.setFontSize(height / 28)
      ctx.setTextAlign('left')
      ctx.setFillStyle("#fff")
      ctx.fillText('点击并保存分享', width / 22.7 + width / 7 + width / 47, height / 1.27 + width / 7 / 2 + height / 28 / 2)
      // ctx.stroke()
    }).exec()
    setTimeout(() => {
      ctx.draw()
      wx.hideLoading()
    }, 100)
  },
  /**
   * 3.保存本地
   */
  savePostLocation() {
    var that = this;
    wx.showLoading({ title: '正在保存', mask: true, })
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        fileType: 'jpg',
        success: function (res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: function (res) {
              console.log(res)
              wx.showModal({
                title: '提示',
                content: '您的推广海报已存入手机相册，赶快分享给好友吧',
                showCancel: false,
              })
            },
            fail: function (err) {
              console.log(err)
              // 防止用户禁止了授权,这须手动调起权限了
              if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
                // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
                wx.showModal({
                  title: '提示',
                  content: '需要您授权保存相册',
                  showCancel: false,
                  success: modalSuccess => {
                    wx.openSetting({
                      success(settingdata) {
                        console.log("settingdata", settingdata)
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                          wx.showModal({
                            title: '提示',
                            content: '获取权限成功,再次确认即可保存',
                            showCancel: false,
                          })
                        } else {
                          wx.showModal({
                            title: '提示',
                            content: '获取权限失败，将无法保存到相册哦~',
                            showCancel: false,
                          })
                        }
                      },
                      fail(failData) {
                        console.log("failData", failData)
                      },
                      complete(finishData) {
                        console.log("finishData", finishData)
                      }
                    })
                  }
                })
              }
            }
          })
        }
      })
    })
  },
})