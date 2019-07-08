// pages/noFind/noFind.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverCont:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onload noFind')
    if(options.type){
      console.log(options.type)
      this.setData({ type: options.type})
      switch (options.type){
        case '1': this.setData({ serverCont: '服务器维护中，请耐心等待…'})
         break;
        case '2' : this.setData({ serverCont: '页面消失不见了～' })
          break;
        case '3' : this.setData({ serverCont: '账号出现了问题～' })
          break;
        case '4': this.setData({ serverCont: '网络连接出现了问题'})
      }
    };

    //设置进入状态
    // wx.setStorageSync('noFind', true)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  onHide:function(){
    console.log('onHide noFind')
    
  },
  backHome(){
    wx.redirectTo({
      url: '/pages/inviteShare/inviteShare',
    })
  }
})