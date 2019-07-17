// components/jurisdictionPopup/jurisdictionPopup.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    state:{
      type:Boolean,
      value: false,
    },
    imgUrl:{
      type:String,
      value:'/images/'
    },
    payLoad:{
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  // observers:{
  //   'payLoad': function (newVal, oldVal){
  //     console.log('newVal', newVal)
  //     // this.setData({ payLoad : })
  //   }
  // },

  /**
   * 组件的方法列表
   */
  methods: {
    bindgetuserinfo: function () {
      this.triggerEvent('myevent', {}, {composed: true})
    }
  }
})
