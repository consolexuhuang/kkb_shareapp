// pages/groupRanking/groupRanking.js
import Store from '../../utils/store.js'
const api = getApp().api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: getApp().globalData.imgUrl,
    jurisdictionState: false, //授权显示
    groupRankingList: '',
    ownGroupInfo: '',
    groupId: '',
    loadState: false, //是否需要加载启动页
    userData: '',
    shareIsGroup: true,
  },

  //分布渲染
  showViewDom(domList, durTime) {
    console.log('定时器开启')
    let length = domList.length
    let count = 0;
    let timer = null
    timer = setInterval(() => {
      if (count == length) {
        console.log('定时器关闭')
        clearInterval(timer)
      } else {
        this.setData({ ['groupRankingList.list[' + count + ']']: domList[count] })
        count++
      }
    }, durTime)
  },
  // 群排名数据
  getGroupList() {
    let _this = this
    wx.login({
      success(res_TicketCode) {
        wx.getShareInfo({
          shareTicket: getApp().globalData.shareTicket_option.shareTicket,
          success(shareTicket_res) {
            console.log('shareTicket_res', shareTicket_res)
            console.log('res_TicketCode', res_TicketCode.code)
            if (Store.getItem('userData') && Store.getItem('userData').token) {
              let data = {
                code: res_TicketCode.code || '',
                encryptedData: shareTicket_res.encryptedData || '',
                iv: shareTicket_res.iv || '',
                // groupName:''
              }
              // _this.setData({ jurisdictionState: true, loadState: true})
              api.post('v2/member/myGroupRank', data).then(res => {
                _this.setData({ jurisdictionState: false, shareIsGroup: true })
                console.log('群排名数据', res)
                // res.msg.list.slice(1)
                _this.setData({ groupId: res.msg.groupId, ownGroupInfo: res.msg.list.slice(0, 1) })
                _this.showViewDom(res.msg.list.slice(1), 100)
              })
            }
          },
          fail(res) {
            console.log('shareTicket_Failres', res)
            _this.setData({ jurisdictionState: false, shareIsGroup: false })
          }
        })
      }
    })
  },
  // 获取当前用信息
  getMemberFollowState() {
    api.post('v2/member/memberInfo').then(res => {
      console.log('获取当前用信息', res)
      this.setData({ userData: res.msg })
      // Store.setItem('userData', res.msg)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.setData({
      jurisdictionState: true,
      loadState: Store.getItem('userData') && Store.getItem('userData').token ? true : false
    })
    if (Store.getItem('userData') && Store.getItem('userData').token) {
      this.getGroupList()
      this.getMemberFollowState()
    } else {
      getApp().wx_loginIn().then(() => {
        this.setData({ jurisdictionState: false })
        this.getGroupList()
        this.getMemberFollowState()
      }, () => {
        this.setData({ jurisdictionState: true })
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  bindgetuserinfo() {
    getApp().wx_loginIn().then(() => {
      this.setData({ loadState: true, })
      this.getGroupList()
      this.getMemberFollowState()
    }, () => {
      this.setData({ jurisdictionState: true })
    })
  },
  //跳转小程序
  handleReturnCourseTap: function (event) {
    console.log('navigateToMiniProgramPath', event.currentTarget.dataset.path)
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '本群J&J的排名出炉啦！来看看本月超过了多少群友',
      path: 'pages/groupRanking/groupRanking',
      imageUrl: 'https://img.cdn.powerpower.net/5d244d90e4b0df3810725f06.png',
      success: function (res) {
      },
      fail: function (res) {
        console.log(res)
      }
    }
  },
})