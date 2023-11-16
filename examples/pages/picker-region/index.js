import regions from '../../dist/picker-region/region-data'

Page({
  data: {
    /**
     * 地区数据
     */
    regionList: [],
    //默认显示的地区(为空则显示第一项)
    region: ["广东", "深圳市"],
  },
  onLoad() {
    this.setData({regionList:regions});
  },
  //地区选择监听
  onChange({ detail }) {
    let values = detail.values; //选择的下标值,格式为:[0,0]
    let names = detail.names; //选择的省市名称,格式为:['北京市','北京市']
    console.log("values", values, "names", names);
  },
});
