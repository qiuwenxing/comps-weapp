// pages/picker-range-month/index.js
Page({
  data: {
    /**
     * 默认设置的开始时间-结束时间,格式为:[开始年份, 开始月份, 结束年份, 结束月份]
     */
    date: [2017, 5, 2018, 6],
  },
  onLoad() {},
  //地区选择监听
  onChange({ detail }) {
    let date = detail.value;
    date.start.year; //开始年份
    date.start.month; //开始月份
    date.end.year; //结束年份
    date.end.month; //结束月份
    console.log(date);
  },
});
