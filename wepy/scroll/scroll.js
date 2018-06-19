import wepy from 'wepy';

export default class Scroll extends wepy.component {
    props = {
        /**
         * 开启那个方向的事件(up:下拉事件,down:上拉事件,all:两者都开启)
         */
        open:String,
    };
    data = {
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
         * 拉动距离
         */
        distance: 40,
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
    };
    events = {};
    methods = {
        onScroll: e => {
            this.scroll = e.detail.scrollTop;
        },
        /**
         * 开始拖动
         */
        startHandle: e => {
            if (!this.loading && (this.open == 'down' || this.open == 'all')) {
                let touche = e.touches[0];
                this.startY = touche.pageY;
                this.touchScrollTop = this.scroll;
            }
        },
        /**
         * 正在拖动
         */
        moveHandle: e => {
            if (!this.loading && (this.open == 'down' || this.open == 'all')) {
                let touche = e.touches[0];
                let pageY = touche.pageY;
                this.moveY = pageY - this.startY;
                if (this.moveY > 0) {
                    this.direction = 'down';
                } else if (this.moveY < 0) {
                    this.direction = 'up';
                }
                let absMoveY = Math.abs(this.moveY);
                //加载上方
                if (
                    this.touchScrollTop <= 0 &&
                    this.direction == 'down' &&
                    !this.isLockUp
                ) {
                    let offsetY = 0;
                    this.isScroll = false;
                    // 如果加载区没有DOM
                    if (!this.upInsertDOM) {
                        this.upInsertDOM = true;
                    }
                    this.transitionTime = 0;
                    // 下拉
                    if (absMoveY <= this.distance) {
                        offsetY = absMoveY;
                        this.upStatus = 'refresh';
                        // 指定距离 < 下拉距离 < 指定距离*2
                    } else if (
                        absMoveY > this.distance &&
                        absMoveY <= this.distance * 2
                    ) {
                        offsetY = this.distance + (absMoveY - this.distance) * 0.5;
                        this.upStatus = 'update';
                        // 下拉距离 > 指定距离*2
                    } else {
                        offsetY =
                            this.distance +
                            this.distance * 0.5 +
                            (absMoveY - this.distance * 2) * 0.2;
                    }
                    this.domHeight = offsetY;
                    this.$apply();
                } else {
                    this.isScroll = true;
                    this.domHeight = 0;
                    this.moveY = 0;
                    this.$apply();
                }
            }
        },
        /**
         * 结束拖动(开始执行刷新)
         */
        endHandle: e => {
            if (!this.loading && (this.open == 'down' || this.open == 'all')) {
                let absMoveY = Math.abs(this.moveY);
                if (
                    this.touchScrollTop <= 0 &&
                    this.direction == 'down' &&
                    !this.isLockUp
                ) {
                    this.transitionTime = 300;
                    if (absMoveY > this.distance) {
                        this.domHeight = this.distance;
                        this.upStatus = 'load';
                        this.refresh();
                    } else {
                        this.domHeight = 0;
                        setTimeout(() => {
                            this.upInsertDOM = false;
                        }, 300);
                    }
                    this.moveY = 0;
                    this.$apply();
                }else{
                    this.domHeight = 0;
                    this.moveY = 0;
                    this.$apply();
                }
            }else{
                this.domHeight = 0;
                this.moveY = 0;
                this.$apply();
            }
        },
        /**
         * 上拉加载更多
         */
        pullUp: () => {
            if (!this.loading && (this.open == 'up' || this.open == 'all')) {
                this.$emit('pullUp');
            }
        }
    };
    onLoad() {
    }
    /**
     * 开始显示loading
     */
    startLoad() {
        this.loading = true;
        this.downStatus = 'load';
        this.$apply();
    }
    /**
     * 隐藏loading
     */
    stopLoad(){
        if(this.downStatus != 'noData'){
            this.loading = false;
            this.downStatus = '';
            this.$apply();
        }
    }
    /**
     * 无数据
     */
    noData(){
        this.loading = false;
        this.downStatus = 'noData';
        this.$apply();
    }
    /**
     * 触发刷新
     */
    refresh() {
        this.refreshCount++;
        this.startTime = Date.now();
        this.loading = true;
        this.$apply();
        this.$emit('pullDown');
    }
    /**
     * 停止下拉刷新
     */
    stop() {
        let time = Date.now() - this.startTime;
        if (time < 600) {
            setTimeout(() => {
                this.resetload();
            }, 600 - time);
        } else {
            this.resetload();
        }
    }
    /**
     * 锁定
     */
    lock(direction) {
        if (direction === undefined) {
            switch (this.direction) {
                case 'up':
                    this.isLockDown = true;
                    break;
                case 'down':
                    this.isLockUp = true;
                    break;
                default:
                    this.isLockUp = true;
                    this.isLockDown = true;
            }
        } else if (direction == 'up') {
            this.isLockUp = true;
        } else if (direction == 'down') {
            this.isLockDown = true;
            this.direction = 'up';
        }
    }
    /**
     * 解锁
     */
    unlock() {
        this.isLockUp = false;
        this.isLockDown = false;
        this.direction = 'up';
    }
    /**
     * 重置
     */
    resetload() {
        if (this.direction == 'down' && this.upInsertDOM) {
            this.domHeight = 0;
            this.$apply();
            setTimeout(() => {
                this.loading = false;
                this.upInsertDOM = false;
                this.isScroll = true;
                this.upStatus = '';
                this.$apply();
            }, 300);
        }
    }
}