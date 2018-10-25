# 小程序下拉刷新、上拉加载

## 使用说明

在页面或组件中json文件的usingComponents下引入scroll
``` json
usingComponents:{
	/*假设组件放在这个路径*/
	"scroll":'/lib/components/scroll/index'
}
```
``` javascript
Page({
	//下拉刷新
	onPullDown(){
		//TODO数据方法
	},
	//上拉加载更多
	onPullUp(){
		//TODO数据方法
	}
})
```
在template中使用
```htmlbars
	<template>
		<scroll id="scroll" open="all" bind:pulldown="onPullDown" bind:pullup="onPullUp">
			<!-- 这里写你的列表代码 -->
		</scroll>
	</template>
```
| 参数名     |    类型  |备注  |
| :-------- | :--------: |:-- |
| open		| up / down / all |开启哪个方向的事件(up:下拉事件,down:上拉事件,all:两者都开启)|
| id		| string | 通过this.selectComponent('#scroll')来获取组件对象（下拉刷新或上拉加载处理时调用组件对象的startLoad()和stopLoad()来显示和隐藏loading）
| bind:pulldown|   function | 下拉事件|
| bind:pullup|    function | 上拉事件 |

组件方法

| 	方法名     |   备注  	|
| :-------- | :--------:  |
| 	stop()		| 关闭下拉刷新Loading |
| 	startLoad()	|  显示上拉Loading（也可以在页面第一个加载数据时调用） |
| 	stopLoad() 	|关闭上拉Loading,配合startLoad()使用	|
| 	noData() 		| 在列表底部显示**暂无更多内容**(注意该方法只是显示暂无更多内容,是否可以上拉需要自己在上拉事件中处理)	|

组件监听事件(事件前面记得加bind)

| 	事件名称     	|   返回值  		|备注|
| :-------- | :--------: |:-- |
|	scroll	|同scroll-view的bindscroll	|返回当前scroll的混动条对象|
|	pulldown|null|触发下拉刷新监听|
|	pullup|null|触发上拉加载更多监听|

样例代码仅供参考
```javascript
let component = null;
Page({
	data:{
		list: []
	},
	//页面初始化
	onLoad(){
		//获取组件对象
		component = this.selectComponent('#scroll');
		//显示loading
		component.startLoad();
		//请求第一页数据
		this.loadData(true).then(() => {
			//数据请求完成后需要调用该方法结束loading
			component.stopLoad();
		});
	},
	//加载数据
	loadData:function(reset = false) {
		...
	},
	//下拉刷新
	onPullDown:function() {
		//请求第一页数据
		this.loadData(true).then(() => {
			//数据请求完成后需要调用该方法结束loading
			component.stop();
		});
	},
	//上拉加载更多
	onPullUp:function() {
		//显示loading
		component.startLoad();
		//加载下一页数据
		this.loadData().then(() => {
			//数据请求完成后需要调用该方法结束loading
			component.stopLoad();
		});
	}
})
```
