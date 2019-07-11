// pages/groupRanking/groupRanking.js
import Store from '../../utils/store.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: getApp().globalData.imgUrl,
    jurisdictionState: false, //授权显示
    groupRankingList: '',
  },
  
  //分布渲染
  showViewDom(domList, durTime){
    console.log('定时器开启')
    let length = domList.length
    let count = 0;
    let timer = null
    timer = setInterval(()=>{
      if (count == length){
        console.log('定时器关闭')
        clearInterval(timer)
      } else {
        this.setData({ ['groupRankingList[' + count + ']']: domList[count] })
        count++
      } 
    }, durTime)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let list = [{ name: '小A与阿Jay', time: 5670 },
                { name: '撕夜', time: 52270 },
                { name: '小A小A与阿Jay小A与阿Jay与阿Jay', time: 5620070 },
                { name: '小米', time: 570 },
                { name: '大爷', time: 70 },
                { name: '大爷', time: 70 },
                { name: '大爷', time: 70 },
                { name: '小米', time: 570 },
                { name: '大爷', time: 70 },
                { name: '大爷', time: 70 },
                { name: '大爷', time: 70 },
                { name: '小米', time: 570 },
                { name: '大爷', time: 70 },
                { name: '大爷', time: 70 },
                { name: '大爷', time: 70 },
                { name: '小米', time: 570 },
                { name: '大爷', time: 70 },
                { name: '大爷', time: 70 },
                { name: '大爷', time: 70},
    ]
    this.showViewDom(list, 100)
    if (Store.getItem('userData') && Store.getItem('userData').token){
      
    } else {
      getApp().wx_loginIn().then(() => {
        this.setData({ jurisdictionState: false })
        // this.LoadPageFunc()
      }, () => {
        this.setData({ jurisdictionState: true })
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  bindgetuserinfo() {
    getApp().wx_loginIn().then(() => {
      this.setData({ jurisdictionState: false })
      // this.LoadPageFunc()
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