Page({
  onTouchleftmove({ detail }) {
    console.log("向左滑动");
  },
  onTouchrightmove() {
    console.log("向右滑动");
  },
  onTouchupmove() {
    console.log("向上滑动");
  },
  onTouchdownmove() {
    console.log("向下滑动");
  },
  onTouchleftend() {
    console.log("向左滑动结束");
  },
  onTouchrightend() {
    console.log("向右滑动结束");
  },
  onTouchupend() {
    console.log("向上滑动结束");
  },
  onTouchdownend() {
    console.log("向下滑动结束");
  },
  onTouchendx() {
    console.log("向X轴滑动结束");
  },
  onTouchendy() {
    console.log("向Y轴滑动结束");
  },
});
