let animationShade = null;
let animationBody = null;
Component({
  externalClasses: ['i-class'],
  properties: {
    /**
     * 最小年份
     */
    minYear: {
      type: Number,
      value: 1900
    },
    /**
     * 最大年份
     */
    maxYear: {
      type: Number,
      value: 2100
    },
    /**
     * 开始时间大于结束时间错误提示
     */
    errorMessage: {
      type: String,
      value: '开始时间不能大于结束时间'
    }
  },
  data: {
    display: false,
    years: [],
    months: [],
    val: [],
    result: {
      start: {
        year: null,
        month: null
      },
      end: {
        year: null,
        month: null
      }
    },
    error: false,
    /**
     * 最后保存的值
     */
    origin: null,
    animationDataShade: null,
    animationDataBody: null,
    isAnimation: false,//是否正在执行动画
  },
  methods: {
    /**
    * 属性值修改事件
    */
    onChange({ detail }) {
      let val = detail.value;
      let result = this.compute(val);
      this.setData({ result });
      this.validate(result);
    },
    /**
     * 确认
     */
    confirm() {
      let { result } = this.data;
      if (this.validate(result)) {
        this.setData({ origin: null });
        this.hide();
        this.triggerEvent('change', { value: result });
      } else {
        wx.vibrateLong();
      }
    },
    /**
      * 取消(隐藏)
      */
    hide() {
      let { isAnimation, origin, val, result, display } = this.data;
      //显示状态才执行隐藏
      if (display && !isAnimation) {
        if (origin) {
          val = origin.val;
          result = origin.result;
        }
        let animationDataShade = animationShade.opacity(0).step().export();
        let animationDataBody = animationBody.translateY('100%').step().export();
        this.setData({ isAnimation: true, val, result, animationDataShade, animationDataBody })
        setTimeout(() => {
          this.setData({ display: false });
        }, 400);
        setTimeout(() => {
          this.setData({ isAnimation: false });
        }, 500);
      }
    },
    /**
      * 显示
      */
    show() {
      let { isAnimation, val, result, display } = this.data;
      //隐藏状态才执行显示
      if (!display && !isAnimation) {
        let origin = { val, result };
        let animationDataShade = animationShade.opacity(1).step().export();
        let animationDataBody = animationBody.translateY('0').step().export();
        this.setData({ isAnimation: true, display: true });
        setTimeout(() => {
          this.setData({ origin, animationDataShade, animationDataBody });
        }, 100);
        setTimeout(() => {
          this.setData({ isAnimation: false });
        }, 500);
      }
    },
    //计算开始时间/结束时间
    compute(array) {
      if (array.length >= 5) {
        let { minYear } = this.data;
        return {
          start: { year: array[0] + minYear, month: array[1] + 1 },
          end: { year: array[3] + minYear, month: array[4] + 1 }
        };
      }
      return null;
    },
    /**
     * 校验日期大小
     * @param {Object} result
     */
    validate(result) {
      let start = new Date(result.start.year, result.start.month);
      let end = new Date(result.end.year, result.end.month);
      let isError = false;
      if (start.getTime() > end.getTime())
        isError = true;
      this.setData({ error: isError });
      return !isError;
    },
    noTouch() {
      return;
    },
  },
  ready() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    let { minYear, maxYear, years, months } = this.data;
    let val = [year - minYear, month, 0, year - minYear, month];
    let result = this.compute(val);
    //初始化年份
    for (let i = minYear; i < maxYear; i++) {
      years.push(i);
    }
    //初始化月份
    for (let i = 1; i <= 12; i++) {
      months.push(i);
    }
    this.setData({ val, result, years, months });
  },
  created() {
    animationShade = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      transformOrigin: "50% 50%"
    });
    animationBody = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
      transformOrigin: "50% 50%"
    });
  }
})
