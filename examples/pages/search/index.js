let component = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取组件对象
    component = this.selectComponent("#search");
  },
  //打开搜索栏
  openSearch({ target }) {
    const { value } = target.dataset;
    //传过去的参数会直接显示在打开的搜索界面输入框内
    component.show(value);
  },
  //搜索回调
  onSearch({ detail }) {
    let data = detail.value;
    console.log(data);
    wx.showToast({ title: data, icon: "none" });
  },
});
