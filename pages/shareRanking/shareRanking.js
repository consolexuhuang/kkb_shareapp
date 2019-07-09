// pages/shareRanking/shareRanking.js
import NumberAnimate from "../../utils/NumberAnimate";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0, //索引
    imgUrl: getApp().globalData.imgUrl,
    firstNum:2100,
    stepNumber:0
  },
  dealNumberStep() {
    let _this = this
    let stepNumber = this.data.firstNum
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
                stepNumber: numberAnimate.tempValue
              });
            },
          });
        } else {
          _this.setData({
            stepNumber: this.data.firstNum
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.dealNumberStep()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //点击导航
  chooseItem(e){
    this.setData({
      index: e.currentTarget.dataset.id
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
  onShareAppMessage(){
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