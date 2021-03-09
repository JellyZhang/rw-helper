## 一个可以响应手势操作的抽屉组件
### 标签名: ```<hj-dragabledrawer>```

### 属性：options [Object] 
>#### 是否可见（默认： false ）：visible:Boolean 
>#### 是否右侧显示（默认：true）：rightMode: Boolean 
>#### 是否在空余部分添加遮罩（默认：true）： mask: Boolean 
>#### 抽屉宽度百分比（默认：60）： width: Number 
>#### 是否在点击蒙层时关闭抽屉（默认：true）： autoClose: Boolean 
>#### [new]是否允许下拉刷新（默认：false）： pulldown: Boolean 
>#### 注：默认点击遮罩关闭抽屉

### 方法：
>#### open 打开抽屉
>#### close 关闭抽屉

### 事件：
>#### open 打开抽屉后
>#### close 关闭抽屉后
>#### error 出现错误后

### 已测试：微信小程序，安卓APP，H5
>#### v1.0.7 新增了切换滑动穿透和下拉刷新的冲突，精简了代码，因为新版h5支持了动画 2020-06-26
>#### v1.0.6 修复了滑动关闭后点击内容会触发关闭的BUG，多谢提交 2020-01-16
>#### v1.0.5 新增了点击蒙层不会自动关闭的配置，如果配置了此选项，请确保在抽屉中配置一个关闭按钮，见示例 2019-09-23
>#### v1.0.4 修改了开启方式、开启及关闭事件以及示例 2019-08-20
>#### v1.0.3 优化了显示蒙层的时机：当触摸移动时会关闭蒙层，如果反弹至全屏则会重新显示（多谢建议，这样显示效果好了不少，之前关闭时屏幕边上会因为关闭俩视图有点闪；统一了readme文件版本不一致的问题 2019-01-26
>#### v1.0.2 修复H5下的动画支持问题；修复页面有导航栏时，抽屉顶部被覆盖的问题；修复示例错误的问题;增加了示例内容 2019-01-22
>#### v1.0.1 修复slot内点击事件无效的问题，以及命名不规范的问题（插件命名要求是插件名部分只能字母和数字，之前的有个-） 2019-01-15

### 使用示例

```
<template>
	<view class="content">
		<hj-dragabledrawer :options="options" ref="dragBox" @open="afterOpen" @close="afterClose">
			<button @tap="hello">hi</button>
			<text>不建议使用v-for进行列表渲染</text>
			<text style="background-color: red;">单击蒙层也会关闭</text>
			<text>如需自定义抽屉内容布局，可把这些内容放在一个宽高100%的view里面哦</text>
			<button @tap="close">close</button>
			<view v-for="i in 10" :key="i">{{ i }}</view>
		</hj-dragabledrawer>
		<button @tap="open">打开</button>
		<button @tap="toggle">L/R模式切换</button>
		<button @tap="toggle1">mask模式切换</button>
		<text>
			当前模式：
			<text v-if="!options.rightMode">左侧弹出</text>
			<text v-else="">右侧弹出</text>
		</text>
		<text>遮罩：{{ options.mask ? '有' : '无' }}</text>
	</view>
</template>
<script>
import hjDragabledrawer from '@/components/hj-dragabledrawer/hj-dragabledrawer.vue'; //这里修改下插件的相对路径
let dragBox;
export default {
	data() {
		return {
			options: {
				visible: false,
				rightMode: false,
				autoClose: true,
				pulldown: true
			}
		};
	},
	onReady() {
		dragBox = this.$refs.dragBox;
	},
	components: {
		hjDragabledrawer
	},
	methods: {
		open() {
			dragBox.open();
		},
		hello() {
			uni.showToast({
				title: 'hello',
				icon: 'none'
			});
		},
		close() {
			dragBox.close();
		},
		toggle() {
			this.options.rightMode = !this.options.rightMode;
		},
		toggle1() {
			this.$set(this.options, 'mask', !this.options.mask);
		},
		afterOpen() {
			uni.showToast({
				title: 'open',
				icon: 'none'
			});
		},
		afterClose() {
			uni.showToast({
				title: 'close',
				icon: 'none'
			});
		}
	}
};
</script>
<style scoped="">
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
}

button {
	margin: 20upx;
	padding: 20upx;
	font-size: 32upx;
	width: 60%;
}

text {
	margin: 20upx;
	font-size: 24upx;
}
</style>
```