# 小程序下拉刷新、上拉加载

---
>注意：该组件采用wepy小程序框架编写，如需使用标准版小程序代码，请下载 [wepy](https://tencent.github.io/wepy/)创建一个新项目将该组件复制到项目中使用wepy编译，编译后dist目录下的同名文件夹即是标准版的小程序代码。

## 使用说明

在页面或组件中的components下引入scroll
``` javascript
import wepy from 'wepy';
import Scroll from '../../../components/scroll/scroll';/*假如组件放在这个目录*/

export default class List extends wepy.page {
	components = {
		scroll: Scroll
	};

	methods = {
		//下拉刷新
		onPullDown:() => { },
		//上拉加载更多
		onPullUp:() => { }
	};
}
```
在template中使用
```htmlbars
	<template>
		<scroll open="all" @pullDown.user="onPullDown" @pullUp.user="onPullUp">
			<!-- 这里写你的列表代码 -->
		</scroll>
	</template>
```
| 参数名     |    类型  |备注  |
| :-------- | :--------: |:-- |
| open		| up / down / all |开启哪个方向的事件(up:下拉事件,down:上拉事件,all:两者都开启)|
| @pullDown.user|   function | 下拉事件|
| @pullUp.user|    function | 上拉事件 |

方法
>以下所有方法都采用[wepy组件通信](https://tencent.github.io/wepy/document.html#/?id=%E7%BB%84%E4%BB%B6%E9%80%9A%E4%BF%A1%E4%B8%8E%E4%BA%A4%E4%BA%92)的方式调用，其他框架自行参考对应的组件通信调用方法。


| 	方法名     	|   备注  		|
| 	:--------		|	:-------- 	|
| 	stop()			| 关闭下拉刷新Loading |
| 	startLoad()	|  显示上拉Loading（也可以在页面第一个加载数据时调用） |
| 	stopLoad() 	|关闭上拉Loading,配合startLoad()使用	|
| 	noData() 		| 在列表底部显示**暂无更多内容**(注意该方法只是显示暂无更多内容,是否可以上拉需要自己在上拉事件中处理)	|

```javascript
import wepy from 'wepy';
import Scroll from '../../../components/scroll/scroll';/*假如组件放在这个目录*/

export default class List extends wepy.page {
	components = {
		scroll: Scroll
	};
	methods = {
		//下拉刷新
	    onPullDown: () => {
		    //请求第一页数据
	        this.loadData(true).then(() => {
		        //数据请求完成后需要调用该方法结束loading
	            this.$invoke('scroll', 'stop');
	        });
	    },
	    //上拉加载更多
	    onPullUp: () => {
		    //显示loading
	        this.$invoke('scroll', 'startLoad');
	        //加载下一页数据
	        this.loadData().then(() => {
		        //数据请求完成后需要调用该方法结束loading
	            this.$invoke('scroll', 'stopLoad');
	        });
	    }
    	};
	//页面初始化
	onLoad(){
		//显示loading
		this.$invoke('scroll', 'startLoad');
		//请求第一页数据
		this.loadData(true).then(() => {
			//数据请求完成后需要调用该方法结束loading
		    this.$invoke('scroll', 'stopLoad');
		});
	}
	//加载数据
	loadData(reset = false) {
		...
	}
}
```
