<template>
	<view :animation="animationData" class="uni-drawer" :class="{ 'uni-drawer-visible': visible, 'uni-drawer-right': option.rightMode }">
		<block v-if="showmask">
			<view v-if="option.pulldown" class="uni-drawer-mask" @tap="close(0)" @touchstart="stopref" @touchmove="stopref" @touchend="stopref"></view>
			<view v-else class="uni-drawer-mask" @tap.stop="close(0)" @touchstart.stop="stopref" @touchmove.stop="stopref" @touchend.stop="stopref"></view>
		</block>
		<view class="uni-drawer-content" @touchstart="updateStart" @touchmove.stop="updateMove" @touchcancel="updateEnd" @touchend="updateEnd" :style="{ width: option.width + '%' }"><slot></slot></view>
	</view>
</template>

<script>
let updating = false;
export default {
	name: 'hj-dragabledrawer',
	props: {
		/**
		 * 显示状态
		 */
		options: Object
	},
	data() {
		return {
			def: {
				rightMode: true,
				mask: true,
				width: 60,
				autoClose: true,
				pulldown: false
			},
			animationData: {},
			show: true,
			visible: false
		};
	},
	computed: {
		option() {
			return { ...this.def, ...this.options };
		},
		showmask() {
			return this.option.mask && this.show;
		}
	},
	created() {
		// #ifdef APP-PLUS
		const pages = getCurrentPages();
		const page = pages[pages.length - 1];
		this.cw = page.$getAppWebview();
		this.lastSupport = Object(this.cw.getStyle().pullToRefresh).support;
		// #endif
		try {
			this.animation = uni.createAnimation();
			this.screenWidth = uni.getSystemInfoSync().windowWidth;
		} catch (e) {
			this.$emit('error', e);
		}
		// if(!this.option.pulldown){

		// }
	},
	methods: {
		open() {
			// #ifdef APP-PLUS
			if (this.lastSupport && !this.option.pulldown) {
				this.cw.setStyle({
					pullToRefresh: {
						support: false
					}
				});
			}
			// #endif
			this.visible = true;
			this.$emit('open', {
				success: 1
			});
		},
		close(force = 1) {
			if (force || this.option.autoClose) {
				// #ifdef APP-PLUS
				if (this.lastSupport && !this.option.pulldown) {
					this.cw.setStyle({
						pullToRefresh: {
							support: true
						}
					});
				}
				// #endif
				this.visible = false;
				this.$emit('close', {
					success: 1
				});
			}
		},
		updateStart(e) {
			this.start = e.touches[0].pageX;
			this.scale = this.screenWidth / (this.screenWidth - this.start);
		},
		async updateMove(e) {
			if (updating) return;
			updating = true;
			this.stopref(e);
			this.tx = this.scale * (e.touches[0].pageX - this.start);
			this.show = false;
			if (this.option.rightMode) {
				if (this.tx > 0) {
					this.animation.translateX(this.tx).step({
						duration: 100
					});
				}
			} else {
				if (this.tx < 0) {
					this.animation.translateX(this.tx).step({
						duration: 100
					});
				}
			}
			this.animationData = this.animation.export();
			e.preventDefault();
			this.$nextTick(() => {
				updating = false;
			});
		},
		updateEnd(e) {
			this.stopref(e);
			if (this.option.rightMode) {
				if (this.tx > 100) {
					this.close();
				}
			} else {
				if (this.tx < -80) {
					this.close();
				}
			}
			this.animation.translateX(0).step();
			this.animationData = this.animation.export();
			this.tx = 0;
			this.show = true;
		},
		stopref(e) {
			if (!this.option.pulldown) {
				uni.stopPullDownRefresh();
				e.preventDefault();
			}
		}
	}
};
</script>

<style scoped>
.uni-drawer {
	display: block;
	position: fixed;
	/* #ifndef H5 */
	top: 0;
	/* #endif */
	/* #ifdef H5 */
	top: var(--window-top);
	/* #endif */
	left: 0;
	width: 750upx;
	bottom: 0;
	overflow: hidden;
	visibility: hidden;
	z-index: 99;
}

.uni-drawer > .uni-drawer-mask {
	display: block;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.4);
}

.uni-drawer > .uni-drawer-content {
	display: block;
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	background: #ffffff;
	transition: all 0.3s ease-out;
	transform: translatex(-100%);
}

.uni-drawer.uni-drawer-right > .uni-drawer-content {
	left: auto;
	right: 0;
	transform: translatex(100%);
}

.uni-drawer.uni-drawer-visible {
	visibility: visible;
}

.uni-drawer.uni-drawer-visible > .uni-drawer-mask {
	display: block;
}

.uni-drawer.uni-drawer-visible > .uni-drawer-content {
	transform: translatex(0);
}
</style>
