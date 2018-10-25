Component({
  externalClasses: ['i-class'],
  properties: {
    /**
     * 开启那个方向的事件(up:下拉事件,down:上拉事件,all:两者都开启)
     */
    open: {
      type: String,
      value: 'all'
    }
  },
  data: {
    /**
         * 刷新次数
         */
    refreshCount: 0,
    /**
     * 上方是否插入DOM
     */
    upInsertDOM: false,
    /**
     * 是否锁定下拉
     */
    isLockUp: false,
    /**
     * 是否锁定上拉
     */
    isLockDown: false,
    /**
     * 是否有数据
     */
    isData: true,
    /**
     * 是否正在加载
     */
    loading: false,
    /**
     * loading区域高度
     */
    domHeight: 0,
    /**
     * 当前下拉loading状态
     */
    upStatus: '',
    /**
     * 当前上拉loading状态
     */
    downStatus: '',
    /**
     * 开始刷新事件(防止加载过快)
     */
    startTime: 0,
    /**
     * 按下手指时候的Y轴坐标
     */
    startY: 0,
    /**
     * 当前滚动条位置
     */
    scroll: 0,
    /**
     * 拉动刷新距离(px)
     */
    distance: 60,
    /**
     * loading区域高度
     */
    loadingHeight: 40,
    /**
     * 按下手指的时候滚动条位置
     */
    touchScrollTop: 0,
    /**
     * 当前移动偏移量
     */
    moveY: 0,
    /**
     * 滑动方向(down:下滑,up:上划)
     */
    direction: '',
    /**
     * 动画过渡时间
     */
    transitionTime: 0,
    isScroll: true
  },
  methods: {
    onScroll(e) {
      this.setData({ scroll: e.detail.scrollTop });
      this.triggerEvent('scroll', e);
    },
    /**
     * 开始拖动
     */
    startHandle(e) {
      if (!this.data.loading && (this.data.open == 'down' || this.data.open == 'all')) {
        let touche = e.touches[0];
        let startY = touche.pageY;
        let touchScrollTop = this.data.scroll;
        this.setData({ startY, touchScrollTop });
      }
    },
    /**
     * 正在拖动
     */
    moveHandle(e) {
      let { loading, open, direction, isScroll } = this.data;
      if (!loading) {
        //下拉刷新动作
        if (open == 'down' || open == 'all') {
          let touche = e.touches[0];
          let pageY = touche.pageY;
          let moveY = pageY - this.data.startY;
          let { transitionTime, touchScrollTop, isLockUp, domHeight, upInsertDOM, upStatus, distance } = this.data;
          if (moveY > 0) {
            direction = 'down';
          } else if (moveY < 0) {
            direction = 'up';
          }
          let absMoveY = Math.abs(moveY);
          //加载上方
          if (touchScrollTop <= 0 && direction == 'down' && !isLockUp) {
            isScroll = false;
            let offsetY = 0;
            // 如果加载区没有DOM
            if (!upInsertDOM) {
              upInsertDOM = true;
            }
            transitionTime = 0;
            // 下拉
            if (absMoveY <= distance) {
              offsetY = absMoveY;
              upStatus = 'refresh';
              // 指定距离 < 下拉距离 < 指定距离*2
            } else if (
              absMoveY > distance &&
              absMoveY <= distance * 2
            ) {
              offsetY = distance + (absMoveY - distance) * 0.5;
              upStatus = 'update';
              // 下拉距离 > 指定距离*2
            } else {
              offsetY = distance + distance * 0.5 + (absMoveY - distance * 2) * 0.2;
            }
            domHeight = offsetY * 0.7;//移动距离衰减
          } else {
            isScroll = true;
            domHeight = 0;
            moveY = 0;
          }
          this.setData({ isScroll, domHeight, moveY, direction, upInsertDOM, upStatus, transitionTime });
        }
      }
    },
    /**
     * 结束拖动(开始执行刷新)
     */
    endHandle(e) {
      let { loading, open, moveY, domHeight, upStatus, transitionTime, touchScrollTop, direction, isLockUp, distance, loadingHeight } = this.data;
      if (!loading && (open == 'down' || open == 'all')) {
        let absMoveY = Math.abs(moveY);
        if (touchScrollTop <= 0 && direction == 'down' && !isLockUp) {
          transitionTime = 300;
          if (absMoveY > distance) {
            domHeight = loadingHeight;//刷新过程中loading区域高度
            upStatus = 'load';
            this.refresh();
          } else {
            domHeight = 0;
            setTimeout(() => {
              this.setData({ upInsertDOM: false });
            }, 300);
          }
          moveY = 0;
        } else {
          domHeight = 0;
          moveY = 0;
        }
      } else {
        domHeight = 0;
        moveY = 0;
      }
      this.setData({ moveY, domHeight, upStatus, transitionTime, isScroll: true });
    },
    /**
     * 上拉加载更多
     */
    pullUp() {
      if (!this.data.loading && (this.data.open == 'up' || this.data.open == 'all')) {
        this.triggerEvent('pullup');
      }
    },
    /**
     * 开始显示loading
     */
    startLoad() {
      this.setData({ loading: true, downStatus: 'load' });
    },
    /**
     * 隐藏loading
     */
    stopLoad() {
      if (this.data.downStatus != 'noData') {
        this.setData({ loading: false, downStatus: '' });
      }
    },
    /**
     * 无数据
     */
    noData() {
      this.setData({ loading: false, downStatus: 'noData' });
    },
    /**
     * 触发刷新
     */
    refresh() {
      let refreshCount = this.data.refreshCount + 1;
      let startTime = Date.now();
      this.setData({ refreshCount, startTime, loading: true });
      this.triggerEvent('pulldown');
    },
    /**
     * 停止下拉刷新
     */
    stop() {
      let time = Date.now() - this.data.startTime;
      if (time < 600) {
        setTimeout(() => {
          this.resetload();
        }, 600 - time);
      } else {
        this.resetload();
      }
    },
    /**
     * 锁定
     */
    lock(directionP) {
      let { direction, isLockDown, isLockUp } = this.data;
      if (directionP === undefined) {
        switch (direction) {
          case 'up':
            isLockDown = true;
            break;
          case 'down':
            isLockUp = true;
            break;
          default:
            isLockUp = true;
            isLockDown = true;
        }
      } else if (directionP == 'up') {
        isLockUp = true;
      } else if (directionP == 'down') {
        isLockDown = true;
        direction = 'up';
      }
      this.setData({ direction, isLockDown, isLockUp });
    },
    /**
     * 解锁
     */
    unlock() {
      this.setData({ isLockUp: false, isLockDown: false, direction: 'up' });
    },
    /**
     * 重置
     */
    resetload() {
      let { upInsertDOM } = this.data;
      if (this.data.direction == 'down' && upInsertDOM) {
        this.setData({ domHeight: 0 });
        setTimeout(() => {
          upInsertDOM = false;
          let loading = false;
          let isScroll = true;
          let upStatus = '';
          this.setData({ loading, upInsertDOM, isScroll, upStatus });
        }, 300);
      }
    }
  }
})
