let animationShade = null;
let animationBody = null;
/**
 * 用于存储省市未加载完成之前的value
 */
let initValue = null;
Component({
  externalClasses: ['i-class'],
  properties: {
    /**
     * 所有省市地区数据
     */
    regionList: {
      type: Array,
      value: [],
      observer(e) {
        this.init();
        this.setValue(initValue);
      }
    },
    /**
     * 设置当前选中value
     */
    value: {
      type: Array,
      value: [],
      observer(array) {
        if (array && array.length == 2) {
          if (this.data.regionList.length > 0)
            this.setValue(array);
          else
            initValue = array;
        }
      }
    },
    containsAll: {
      type: Boolean,
      value: false
    }
  },
  data: {
    display: false,
    regionData: new Map(),
    provinces: [],
    citys: [],
    curIndex: [0, 0],//当前选项下标
    curValue: [],//当前选中省市
    /**
     * 最后保存的值
     */
    origin: {},
    animationDataShade: null,
    animationDataBody: null,
    headItem: ['所有省份', '所有城市'],
    isAnimation: false,//是否正在执行动画
  },
  methods: {
    init() {
      let { regionList, containsAll, headItem, regionData, provinces, curValue } = this.data;
      if (regionList.length > 0) {
        regionData = new Map();
        if (containsAll) {
          regionData.set(headItem[0], { name: headItem[0], city: [] });
        }
        regionList.forEach(item => {
          regionData.set(item.name, item);
        });
        if (regionList.length > 0) {
          regionData.forEach((item, key) => {
            provinces.push(key);
          });
        }
        if (curValue.length == 0) {
          curValue[0] = provinces[0];
        }
        this.setData({ regionData, provinces, curValue });
        this.refreshCity();
      }
    },
    /**
    * 属性值修改事件
    */
    onChange({ detail }) {
      let values = detail.value;
      let { curValue, provinces, curIndex } = this.data;
      //设置省份
      curValue[0] = provinces[values[0]];
      //省份有修改才刷新城市列表,修改省份时需要把当前选中城市恢复默认
      if (values[0] != curIndex[0]) {
        this.refreshCity();
        values[1] = 0;
      }
      //设置城市
      curValue[1] = this.data.citys ? this.data.citys[values[1]] : null;
      this.getVal();
      this.setData({ curValue });
    },
    /**
     * 确认
     */
    confirm() {
      let { curValue } = this.data;
      this.setData({ origin: null });
      this.hide();
      let values = this.getVal();
      this.triggerEvent('change', { value: { values: values, names: curValue, nation: '中国' } });
    },
    /**
     * 设置值
     * @param {string[]} array
     */
    setValue(array) {
      if (array && array.length == 2) {
        //省份是否有修改
        let isModify = false;
        let { curValue } = this.data;
        if (curValue[0] != array[0]) isModify = true;
        curValue = array;
        this.setData({ curValue });
        //省份有修改才刷新城市列表
        isModify && this.refreshCity(false);
        //设置值时执行提交动作
        this.confirm();
      }
    },
    /**
      * 取消(隐藏)
      */
    hide() {
      let { isAnimation, origin, curValue, curIndex, citys, display } = this.data;
      //显示状态才执行隐藏
      if (display && !isAnimation) {
        if (origin) {
          curValue = origin.curValue;
          curIndex = origin.curIndex;
          citys = origin.citys;
        }
        let animationDataShade = animationShade.opacity(0).step().export();
        let animationDataBody = animationBody.translateY('100%').step().export();
        this.setData({ isAnimation: true, curValue, curIndex, citys, animationDataShade, animationDataBody })
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
      let { isAnimation, curValue, curIndex, citys, display } = this.data;
      //隐藏状态才执行显示
      if (!display && !isAnimation) {
        let origin = { curValue: curValue, curIndex: curIndex, citys: citys };
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
    /**
     * 刷新城市
     * @param {boolean} isReset 是否重置城市
     */
    refreshCity(isReset = true) {
      let { curValue, citys, headItem, containsAll } = this.data;
      if (curValue.length > 0) {
        citys = this.getCitys(curValue[0]) || [];
        if (containsAll && citys)
          citys.unshift(headItem[1]);
        if (citys.length > 0 && isReset)
          curValue[1] = citys[0];
        this.setData({ citys, curValue });
      }
    },
    /**
     * 根据省份获取城市列表
     * @param {string} name 省份名称
     * @returns {string[]}
     */
    getCitys(name) {
      let { regionData } = this.data;
      let province = regionData.get(name);
      if (province && province.city) {
        let list = [];
        province.city.forEach(item => {
          list.push(item.name);
        });
        return list;
      }
      return null;
    },
    /**
     * 获取省份城市对应的下标数组
     * @returns {number[]}
     */
    getVal() {
      let provinceIndex = 0, cityIndex = 0;
      let { curValue, provinces, citys, curIndex } = this.data;
      if (provinces.length > 0) {
        if (curValue.length > 0) {
          provinceIndex = provinces.indexOf(curValue[0]);
          if (curValue.length > 1 && citys) {
            cityIndex = citys.indexOf(curValue[1]);
          }
        }
        curIndex = [provinceIndex, cityIndex]
        this.setData({ curIndex });
      }
      return curIndex;
    },
    noTouch() {
      return;
    },
    /*  throttle(fn, gapTime = 500) {
        let _lastTime = null
        return function () {
          let _nowTime = + new Date()
          if (_nowTime - _lastTime > gapTime || !_lastTime) {
            fn.apply(this, arguments)
            _lastTime = _nowTime
          }
        };
      }*/
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
