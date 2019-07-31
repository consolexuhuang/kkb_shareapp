// pages/shareRanking/shareRanking.js
import NumberAnimate from "../../utils/NumberAnimate";
const api = getApp().api
import Store from '../../utils/store.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0, //索引
    imgUrl: getApp().globalData.imgUrl,
    // firstNum:2100,
    // stepNumber:0,
    myRankData:'', //排名数据
    isShowAllRank:false,
    jurisdictionState: false, //授权显示
  },
  dealNumberStep(minutes) {
    let _this = this
    let stepNumber = minutes
    wx.getSystemInfo({
      success: res => {
        if (res.platform == "ios" || res.platform == "devtools") {
          let numberAnimate = new NumberAnimate({
            from: stepNumber,//开始时的数字
            speed: 800,// 总时间
            refreshTime: 45,//  刷新一次的时间
            decimals: 0,//小数点后的位数
            onUpdate: () => {//更新回调函数
              _this.setData({
                ['myRankData.self.minute']: numberAnimate.tempValue
              });
            },
          });
        } else {
          _this.setData({
            ['myRankData.self.minute']: minutes
          });
        }
      }
    })
  },
  // 获取我的排名信息
  getMemberRankInfo(type) {
    let data = {
      type: type == 0 ? 'month' : (type == 1 ? 'year' : (type == 2 ? 'total' : 'month'))
    }
    wx.showLoading({ title: '加载中' })
    api.post('v2/member/myRank', data).then(res => {
      console.log('获取我的排名信息', res)
      wx.hideLoading()
      res.msg.self.rank == 1 || res.msg.self.rank == 2
        ? this.setData({ isShowAllRank: true })
        : this.setData({ isShowAllRank: false })
      if (res.msg.top3){
        res.msg.top3[0] = res.msg.top3.splice(1, 1, res.msg.top3[0])[0]
        console.log(res.msg.top3)
      }
      this.dealNumberStep(res.msg.self.minute)
      this.setData({ myRankData: res.msg, index: type})
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    if (!Store.getItem('userData')) {
      getApp().wx_loginIn().then(() => {
        this.getMemberRankInfo(0)
        this.setData({ jurisdictionState: false })
      }, () => {
        this.setData({ jurisdictionState: true })
      })
    } else {
      this.getMemberRankInfo(0)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  bindgetuserinfo() {
    getApp().wx_loginIn().then(() => {
      this.setData({ jurisdictionState: false })
      // this.setData({ loadState: true })
      this.getMemberRankInfo(0)
    }, () => {
      this.setData({ jurisdictionState: true })
    })
  },
  //点击导航
  chooseItem(e){
    this.data.index != e.currentTarget.dataset.id ? this.getMemberRankInfo(e.currentTarget.dataset.id) : console.log('无需加载')
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
  onShareAppMessage(){
    return {
      title: '这周本群的J&J冠军诞生！来看看你超过了多少群友',
      path: 'pages/groupRanking/groupRanking',
      imageUrl: 'https://img.cdn.powerpower.net/5d3ecd89e4b0985f5293e516.png',
      success: function (res) {
      },
      fail: function (res) {
        console.log(res)
      }
    }
  },
})