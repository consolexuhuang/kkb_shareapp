let ui = require('./ui.js');
// 存储
const setItem = (key, value, module_name) => {
  if (module_name) {
    let module_name_info = this.getItem(module_name) || {}
    module_name_info[key] = value;
    try {
      wx.setStorageSync(module_name, module_name_info)
    } catch (e) {
      wx.setStorage({
        key: module_name,
        data: module_name_info
      })
    }
  } else {
    try {
      wx.setStorageSync(key, value);
    } catch (e) {
      wx.setStorage({
        key: key,
        data: value
      })
    }
  }
}

// 读取
const getItem = (key, module_name) => {
  if (module_name) {
    let val = this.getItem(module_name);
    if (val) return val[key];
    return '';
  }
  return wx.getStorageSync(key)
}

// 清除缓存
const clear = (name) => {
  name ? wx.removeStorageSync(name) : wx.clearStorageSync()
}

//存储数据
const setStorageApiData = (key, data) => {
  wx.setStorage({
    key: key,
    data: data,
  })

}

//获取多个数据
const getStorageApiData = (keyArr, _this) => {
  //loading
  //ui.showLoading();
  //判断，如果参数不是数组，就代表一个
  if ((typeof keyArr) == 'string') {
    getStoragePromise(keyArr).then(result => {
      if (!result) {
        return;
      }
      let setDataObj = {};
      setDataObj[keyArr] = result.data;
      //设置数据
      _this.setData(setDataObj)
      //关闭loading
      //ui.hideLoading()
    })
  } else {
    let promiseArr = [];
    keyArr.map(key => {
      promiseArr.push(getStoragePromise(key));
    })
    return Promise.all(promiseArr).then((result) => {
      let setDataObj = {};
      keyArr.map((itemKey, index) => {
        setDataObj[itemKey] = result[index].data;
      })
      //设置数据
      _this.setData(setDataObj);
      //关闭loading
      //ui.hideLoading()
    })
      .catch(err => {
        //关闭loading
        //ui.hideLoading()
        console.log('没找到缓存数据')
      });
  }
}
//同步存储
const setStorageSync = (key, data) => {
  wx.setStorageSync({
    key: key,
    data: data,
  })
}

//同步获取
const getStorageSync = (key, data) => {
  wx.getStorageSync({
    key: key,
    data: data,
  })
}

function getStoragePromise(keyParam) {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: keyParam,
      success(res) {
        resolve(res);
      },
      fail(res) {
        reject();
      },
    })
  }).catch(err => {
    console.log(err)
  });
}

export default {
  setItem,
  getItem,
  clear,
  setStorageApiData,
  getStorageApiData
}