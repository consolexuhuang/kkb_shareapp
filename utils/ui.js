//toast
function showToast(txt){
  wx.showToast({
    title: txt,
    icon: 'none',
    duration: 3000
  })
}
//loading
function showLoading(txt){
  wx.showLoading({
    title: txt || '加载中...',
  })
}

function showLoadingMask(txt) {
  wx.showLoading({
    title: txt || '加载中...',
    mask:true
  })
}

function hideLoading(){
  wx.hideLoading()
}


module.exports = {
  showToast,
  showLoading,
  showLoadingMask,
  hideLoading
  };
