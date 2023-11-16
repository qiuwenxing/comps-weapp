let component = null;
let number = 1;
let curPage = 1
const maxPage = 3
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  onLoad() {
    //获取组件对象
    component = this.selectComponent("#scroll");
    //显示loading
    component.startLoad();
    //请求第一页数据
    this.loadData(true).then(() => {
      //数据请求完成后需要调用该方法结束loading
      component.stopLoad();
    });
  },

  loadData(reset = false) {
    return new Promise((resolve) => {
      if (reset) {
        number = 1;
        curPage = 1
      }
      setTimeout(() => {
        let data = [];
        let max = number + 20;
        for (let i = number; i <= max; i++) {
          data.push({
            id: number,
            unique: "unique_" + number,
          });
          number++;
        }
        if (reset) {
          this.setData({
            list: data,
          });
        } else {
          this.data.list.push(...data);
          this.setData({
            list: this.data.list,
          });
          curPage++
          if(curPage >= maxPage){
            component.noData()
          }
        }
        resolve();
      }, 2000);
    });
  },

  //下拉刷新
  onPullDown() {
    console.log("下拉刷新");
    //请求第一页数据
    this.loadData(true).then(() => {
      //数据请求完成后需要调用该方法结束loading
      component.stop();
    });
  },
  //上拉加载更多
  onPullUp() {
    if(curPage >= maxPage){
      return
    }
    console.log("上拉加载更多");
    //显示loading
    component.startLoad();
    //加载下一页数据
    this.loadData().then(() => {
      //数据请求完成后需要调用该方法结束loading
      component.stopLoad();
    });
  },
});
