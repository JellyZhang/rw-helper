<template>
	<view :style="{
			width: width,
			height: height,
			backgroundColor: disabled && type !== 'hollow' ? '#ffffff' : 'rgba(0, 0, 0, 0)',
			borderTopLeftRadius: radius[0],
			borderTopRightRadius: radius.length === 1 ? radius[0] : radius[1],
			borderBottomRightRadius: radius.length === 1 ? radius[0] : radius[2],
			borderBottomLeftRadius: radius.length === 1 ? radius[0] : radius[3],
			transform: 'scale(0.99)'}">
		<button class="wyb-button" :disabled="disabled" :data-param="dataParam" :hover-stop-propagation="true" :lang="lang"
		 :session-from="sessionFrom" :send-message-title="sendMessageTitle" :send-message-path="sendMessagePath"
		 :send-message-img="sendMessageImg" :show-message-card="showMessageCard" @touchstart="touch" @tap.stop="onClick" :form-type="formType"
		 @longtap.stop="onLongClick" @getphonenumber="getphonenumber" @getuserinfo="getuserinfo" @error="error" @opensetting="opensetting"
		 @launchapp="launchapp" :hover-class="disabled || ripple || type === 'none' ? '' 
			: (type === 'filled' ? 'btnHoverClass-filled' : (type === 'plain' ? 'btnHoverClass-plain' : 'btnHoverClass-hollow'))"
		 :style="{
			 	width: '100%',
			 	height: height,
			 	color: type === 'filled' ? '#ffffff' : color,
			 	border: type === 'plain' || type === 'hollow' ? borderSize + 'px ' + color + ' ' + borderType : 'none',
			 	backgroundColor: type === 'filled' ? color : (type === 'plain' ? RGBChange(color, 0.88, 'light') : 'rgba(0, 0, 0, 0)'),
			 	borderTopLeftRadius: radius[0],
			 	borderTopRightRadius: radius.length === 1 ? radius[0] : radius[1],
			 	borderBottomRightRadius: radius.length === 1 ? radius[0] : radius[2],
			 	borderBottomLeftRadius: radius.length === 1 ? radius[0] : radius[3],
			 	transform: 'scale(1.01)',
			 	opacity: disabled ? (type !== 'filled' ? 0.4 : 0.5) : 1.0,
			 	fontSize: ftSize,
			 	boxShadow: boxShadow}">
			<view v-if="isShowLoading" class="load-container loading">
				<view class="loader" :style="{
					 width: loaderSize + 'rpx', 
					 height: loaderSize + 'rpx',
					 borderTop: '1px solid ' + loadingColor.top,
					 borderRight: '1px solid ' + loadingColor.right,
					 borderBottom: '1px solid ' + loadingColor.bottom,
					 borderLeft: '1px solid ' + loadingColor.left,
					 transform: 'scale(0.5)'}" />
			</view>
			<image v-if="iconPath" :src="iconPath" :style="{
				 width: icSize,
				 height: icSize,
				 marginRight: iconMarginRight + 'rpx'}" />
			<view v-if="!startCountDown"><slot></slot></view>
			<view v-if="countDown&&startCountDown" class="count-down">
				<text>{{count}}秒{{countDownText}}</text>
			</view>
			<view v-if="ripple" class="waveRipple" :class="[isWaving?'waveActive':'']" :style="{
					top: rippleToTop + 'px',
					left: rippleToLeft + 'px',
					width: domInfo.targetWidth + 'px',
					height: domInfo.targetWidth + 'px',
					backgroundColor: rippleBgColor}">
			</view>
		</button>
	</view>
</template>

<script>
	export default {
		computed: {
			loadingColor() {
				let color = this.color
				if (this.type === 'filled') color = '#ffffff'
				let rgbList = this.hexToRgb(color)
				let top = 'rgba(' + rgbList[0] + ',' + rgbList[1] + ',' + rgbList[2] + ', 0.3)'
				let bottom = 'rgba(' + rgbList[0] + ',' + rgbList[1] + ',' + rgbList[2] + ', 0.3)'
				let right = 'rgba(' + rgbList[0] + ',' + rgbList[1] + ',' + rgbList[2] + ', 0.3)'
				let left = 'rgb(' + rgbList[0] + ',' + rgbList[1] + ',' + rgbList[2] + ')'
				return {
					top,
					bottom,
					right,
					left
				}
			},
			loaderSize() {
				return parseFloat(this.height.replace(/[^0-9]/ig, "")) * 0.3
			},
			ftSize() {
				return (this.fontSize || (parseFloat(this.height.replace(/[^0-9]/ig, "")) * 0.388)) + 'rpx'
			},
			icSize() {
				return (this.iconSize || (parseFloat(this.height.replace(/[^0-9]/ig, "")) * 0.388)) + 'rpx'
			}
		},
		data() {
			return {
				rippleToTop: 0,
				rippleToLeft: 0,
				domInfo: {},
				isWaving: false,
				btnStyle: {},
				basePlateStyle: {},
				iconStyle: {},
				timer: {},
				flag: false,
				startCountDown: false,
				count: this.countDownNum,
				timer: {}
			}
		},
		props: {
			type: {
				type: String,
				default: 'filled'
			},
			width: {
				type: String,
				default: uni.getSystemInfoSync().screenWidth * 0.9 + 'px'
			},
			height: {
				type: String,
				default: '80rpx'
			},
			color: {
				type: String,
				default: '#007aff'
			},
			fontSize: {
				type: [String, Number],
				default: ''
			},
			radius: {
				type: Array,
				default () {
					return ['5px']
				}
			},
			borderSize: {
				type: [String, Number],
				default: 1
			},
			borderType: {
				type: String,
				default: 'solid'
			},
			rippleBgColor: {
				type: String,
				default: 'rgba(0, 0, 0, 0.15)'
			},
			ripple: {
				type: Boolean,
				default: false
			},
			isShowLoading: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			},
			iconPath: {
				type: String,
				default: ''
			},
			iconSize: {
				type: [String, Number],
				default: ''
			},
			iconMarginRight: {
				type: [String, Number],
				default: '15'
			},
			boxShadow: {
				type: String,
				default: ''
			},
			countDown: {
				type: Boolean,
				default: false
			},
			countDownNum: {
				type: Number,
				default: 60
			},
			countDownText: {
				type: String,
				default: '后重新获取'
			},
			formType: {
				type: String,
				default: ''
			},
			dataParam: {
				type: String,
				default: ''
			},
			openType: {
				type: String,
				default: ''
			},
			lang: {
				type: String,
				default: 'zh_CN'
			},
			sessionFrom: {
				type: String,
				default: ''
			},
			sendMessageTitle: {
				type: String,
				default: ''
			},
			sendMessagePath: {
				type: String,
				default: ''
			},
			sendMessageImg: {
				type: String,
				default: ''
			},
			showMessageCard: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			count(val) {
				if (val === 0) {
					clearInterval(this.timer)
					this.startCountDown = false
					this.count = this.countDownNum
				}
			}
		},
		methods: {
			touch(e) {
				this.throttle(()=>{
					if (!this.disabled) {
						if (this.ripple) {
							this.isWaving = false
							this.$nextTick(function() {
								this.getWaveQuery(e)
							})
						}
					}
				})
			},
			onClick(e) {
				if (!this.disabled && !this.startCountDown) {
					this.$emit('click', e)
				}
				if (this.countDown && !this.startCountDown) {
					this.startCountDown = true
					this.timer = setInterval(()=>{
						this.count--
					}, 1000)
				}
			},
			onLongClick(e) {
				if (!this.disabled && !this.startCountDown) {
					this.$emit('longclick', e)
				}
			},
			getWaveQuery(e) {
				this.getElQuery().then(res => {
					let data = res[0]
					if (!data.width || !data.width) return
					data.targetWidth = data.height > data.width ? data.height : data.width
					if (!data.targetWidth) return
					this.domInfo = data;
					let touchesX = ''
					let touchesY = ''
					// #ifndef MP-BAIDU || MP-ALIPAY
					touchesX = e.touches[0].clientX
					touchesY = e.touches[0].clientY
					// #endif
					// #ifdef MP-BAIDU
					touchesX = e.changedTouches[0].clientX
					touchesY = e.changedTouches[0].clientY
					// #endif
					// #ifdef MP-ALIPAY
					touchesX = e.detail.clientX
					touchesY = e.detail.clientY
					// #endif
					this.rippleToTop = touchesY - data.top - data.targetWidth / 2
					this.rippleToLeft = touchesX - data.left - data.targetWidth / 2
					this.$nextTick(() => {
						this.isWaving = true
					})
				})
			},
			getElQuery() {
				return new Promise(resolve => {
					let queryInfo = ''
					queryInfo = uni.createSelectorQuery().in(this)
					//#ifdef MP-ALIPAY
					queryInfo = uni.createSelectorQuery()
					//#endif
					queryInfo.select('.wyb-button').boundingClientRect()
					queryInfo.exec(data => {
						resolve(data)
					})
				})
			},
			RGBChange(color, level, type) {
				// hex转rgb
				if (color.length === 4) {
					let arr = color.split('')
					color = '#' + arr[1] + arr[1] + arr[2] + arr[2] + arr[3] + arr[3]
				}
				let color16List = [color.substring(1, 3), color.substring(3, 5), color.substring(5, 7)]
				let r = parseInt(color16List[0], 16)
				let g = parseInt(color16List[1], 16)
				let b = parseInt(color16List[2], 16)
				let rgbc = [r, g, b]
				// 减淡或加深
				for (var i = 0; i < 3; i++)
					type === 'light' ? rgbc[i] = Math.floor((255 - rgbc[i]) * level + rgbc[i]) : rgbc[i] = Math.floor(rgbc[i] * (1 -
						level))
				// rgb转hex
				let R = rgbc[0].toString(16)
				let G = rgbc[1].toString(16)
				let B = rgbc[2].toString(16)
				if (R.length === 1) R = '0' + R
				if (G.length === 1) G = '0' + G
				if (B.length === 1) B = '0' + B
				return '#' + R + G + B
			},
			hexToRgb(color) {
				if (color.length === 4) {
					let arr = color.split('')
					color = '#' + arr[1] + arr[1] + arr[2] + arr[2] + arr[3] + arr[3]
				}
				let color16List = [color.substring(1, 3), color.substring(3, 5), color.substring(5, 7)]
				let r = parseInt(color16List[0], 16)
				let g = parseInt(color16List[1], 16)
				let b = parseInt(color16List[2], 16)
				return [r, g, b]
			},
			throttle(fc, waitTime = 500, imme = true) {
				if (imme) {
					if (!this.flag) {
						this.flag = true
						typeof fc === 'function' && fc()
						this.timer = setTimeout(() => {
							this.flag = false
						}, waitTime)
					}
				} else {
					if (!this.flag) {
						this.flag = true
						this.timer = setTimeout(() => {
							this.flag = false
							typeof fc === 'function' && fc()
						}, waitTime)
					}
				}
			},
			getphonenumber(res) {
				this.$emit('getphonenumber', res)
			},
			getuserinfo(res) {
				this.$emit('getuserinfo', res)
			},
			error(res) {
				this.$emit('error', res)
			},
			opensetting(res) {
				this.$emit('opensetting', res)
			},
			launchapp(res) {
				this.$emit('launchapp', res)
			}
		}
	}
</script>

<style>
	.wyb-button {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		line-height: 1;
		z-index: 1;
		box-sizing: border-box;
		transition: all 0.12s;
		white-space: nowrap;
	}

	.wyb-button::after {
		border: none;
		transform-origin: center;
		transform: scale(1.5);
	}

	.btnHoverClass-plain::after {
		background-color: rgba(0, 0, 0, 0.08) !important;
	}

	.btnHoverClass-hollow::after {
		background-color: rgba(0, 0, 0, 0.08) !important;
	}

	.btnHoverClass-filled::after {
		background-color: rgba(0, 0, 0, 0.12) !important;
	}

	.waveRipple {
		z-index: 0;
		position: absolute;
		border-radius: 100%;
		background-clip: padding-box;
		transform-origin: center;
		pointer-events: none;
		transform: scale(0);
		user-select: none;
		opacity: 1;
	}

	.waveRipple.waveActive {
		opacity: 0;
		transform: scale(2);
		transition: opacity 0.6s linear, transform 0.6s linear;
	}

	.loader {
		font-size: 10px;
		position: relative;
		-webkit-animation: loading .75s infinite linear;
		animation: loading .75s infinite linear;
		margin-right: 20rpx;
	}

	.loader,
	.loader:after {
		border-radius: 50%;
	}

	@-webkit-keyframes loading {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}

		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}

	@keyframes loading {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}

		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
</style>
