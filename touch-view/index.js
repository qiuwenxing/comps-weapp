let lastX = 0;
let lastY = 0;
Component({
  externalClasses: ['i-class'],
  properties: {},
  data: {
    /**
     * 当前手势(0:没有滑动,1:向左滑动,2:向右滑动,3:向上滑动,4:向下滑动)
     */
    gesture: 0
  },
  methods: {
    touchstart(e) {
      lastX = e.touches[0].pageX;
      lastY = e.touches[0].pageY;
    },
    touchmove(e) {
      let { gesture } = this.data;
      if (gesture != 0) return

      let currentX = e.touches[0].pageX;
      let currentY = e.touches[0].pageY;
      let tx = currentX - lastX;
      let ty = currentY - lastY;

      //左右方向滑动
      if (Math.abs(tx) > Math.abs(ty)) {
        if (tx < 0)
          gesture = 1
        else if (tx > 0)
          gesture = 2
      } else { //上下方向滑动
        if (ty < 0)
          gesture = 3
        else if (ty > 0)
          gesture = 4
      }
      //将当前坐标进行保存以进行下一次计算
      lastX = currentX;
      lastY = currentY;
      this.setData({ gesture });
      let eventName = null;
      let eventName2 = null;
      switch (gesture) {
        case 1://向左滑动
          eventName = 'touchleftmove';
          break;
        case 2://向右滑动
          eventName = 'touchrightmove';
          break;
        case 3://向上滑动
          eventName = 'touchupmove';
          break;
        case 4://向下滑动
          eventName = 'touchdownmove';
          break;
      }
      switch (gesture) {
        case 1://向左滑动
        case 2://向右滑动
          eventName2 = 'touchmovex';
          break;
        case 3://向上滑动
        case 4://向下滑动
          eventName2 = 'touchmovey';
          break;
      }
      this.triggerEvent(eventName, { value: e.touches });
      this.triggerEvent(eventName2, { value: e.touches });
    },
    touchend(e) {
      let { gesture } = this.data;
      let eventName = null;
      let eventName2 = null;
      switch (gesture) {
        case 1://向左滑动结束
          eventName = 'touchleftend';
          break;
        case 2://向右滑动结束
          eventName = 'touchrightend';
          break;
        case 3://向上滑动结束
          eventName = 'touchupend';
          break;
        case 4://向下滑动结束
          eventName = 'touchdownend';
          break;
      }
      switch (gesture) {
        case 1://向左滑动
        case 2://向右滑动
          eventName2 = 'touchendx';
          break;
        case 3://向上滑动
        case 4://向下滑动
          eventName2 = 'touchendy';
          break;
      }
      this.triggerEvent(eventName, { value: e.touches });
      this.triggerEvent(eventName2, { value: e.touches });
      gesture = 0;
      this.setData({ gesture });
    }
  }
})
