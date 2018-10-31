let animation = null;
Component({
  externalClasses: ['i-class'],
  properties: {
    /**
     * 搜索栏标识
     */
    key: {
      type: String,
      value: null
    },
    /**
     * 占位内容
     */
    placeholder: {
      type: String,
      value: ''
    },
    /**
     * 输入框圆角
     */
    radius: {
      type: String,
      value: '10'
    },
    /**
     * 做多历史记录显示数量
     */
    count: {
      type: String,
      value: 20
    }
  },
  data: {
    display: false,
    animationData: null,
    focus: false,
    history: [],
    keyword: '',
  },
  methods: {
    selectSearch({ target }) {
      let i = target.dataset['i'];
      let value = this.data.history[i];
      this.search(value);
    },
    confirmSearch({ detail }) {
      this.search(detail.value);
    },
    //搜索
    search(value) {
      let { key, history, count } = this.data;
      if (value && value.trim().length > 0) {
        value = value.trim();
        let index = history.indexOf(value);
        if (index != -1) {
          history.splice(index, 1);
        }
        history.unshift(value);
        if (history.length > count) history.pop();
        wx.setStorage({
          key: key,
          data: history
        });
        this.setData({ history });
        //触发搜索事件
        this.triggerEvent('search', { value });
      }
    },
    //清空历史记录
    clean() {
      wx.showModal({
        title: '系统提示',
        content: '确定清空历史搜索？',
        success: (e) => {
          if (e.confirm == true) {
            let { key, history } = this.data;
            history = [];
            wx.setStorage({
              key: key,
              data: history
            });
            this.setData({ history });
          }
        }
      });
    },
    //清除文本框
    clearInput() {
      let { focus, keyword } = this.data;
      keyword = '';
      focus = false;
      this.setData({ keyword, focus });
      setTimeout(() => {
        focus = true;
        this.setData({ focus });
      }, 200);
    },
    /**
     * 打开搜索
     */
    show(value) {
      let { key, keyword, history, focus, display } = this.data;
      keyword = value || null;
      history = wx.getStorageSync(key) || [];
      focus = false;
      display = true;
      this.setData({ keyword, history, focus, display });
      let animationData = animation.opacity(1).step().export();
      this.setData({ animationData });
      //等待动画执行完毕
      setTimeout(() => {
        focus = true;
        this.setData({ focus });
      }, 100);
      setTimeout(() => {
        wx.hideTabBar();
      }, 500);
    },
    //隐藏
    hide() {
      let { display } = this.data;
      let animationData = animation.opacity(0).step().export();
      this.setData({ animationData });
      //等待动画执行完毕
      setTimeout(() => {
        display = false;
        this.setData({ display });
      }, 300);
      wx.showTabBar();
    },
  },
  created() {
    animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
      transformOrigin: "50% 50%"
    });
  }
})
