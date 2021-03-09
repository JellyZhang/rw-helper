<template>
	<view>
		<view>
			<view class="line" v-if="loadType=='line'">
				<view class="loadline"
				:style="{width:loadPercent+'%',
				background:lineInfo.colorChange?'linear-gradient(to right,'+lineInfo.loadColor+')':lineInfo.loadColor.split(',')[0]}"></view>
				<view class="v-title">
					<text class="fa fa-spinner fa-spin"></text>
					{{loadText}}{{loadPercent}}%
				</view>
			</view>
			<view class="circle" v-if="loadType=='circle'">
				<view class="third" :style="{background:circleInfo.background}">
					<view class="second" v-if="loadPercent!=100" :style="{background:circleInfo.foreground}"></view>
					<view class="second_" :style="{transform: 'rotate('+(loadPercent>=50?((loadPercent-50)/100)*360:0)+'deg)',background:circleInfo.background}"></view>
					<view class="first" v-if="loadPercent<50" :style="{transform: 'rotate('+(360*(loadPercent/100))+'deg)',background:circleInfo.foreground}"></view>
					<view class="mask" :style="{background:circleInfo.circleColor}">
						<text>{{loadPercent}}%</text>
					</view>
				</view>
			</view>
			<view class="ball" v-if="loadType=='ball'" :style="{width:(ballSize_+25)+'px',height:(ballSize_+25)+'px'}">
				<view class="loading-ball" :style="{width:ballSize_+'px',height:ballSize_+'px',padding:ballInfo.ballPadding}">
					<view class="loading-wave" :style="{overflow:ballInfo.ballType=='all'?'initial':'hidden',width:ballSize_+'px',height:ballSize_+'px'}">
						<view v-if="loadPercent<100" class="loading-wave1" :style="{background:ballInfo.waveColor,top:(ballInfo.ballType=='all'?-(loadPercent*1.3):-(loadPercent*1.2))-4+'%',width:ballSize_*2+'px',height:ballSize_*2+'px'}"></view>
						<view v-if="loadPercent<100" class="loading-wave2" :style="{background:ballInfo.waveColor,top:(ballInfo.ballType=='all'?-(loadPercent*1.3):-(loadPercent*1.2))-4+'%',width:ballSize_*2+'px',height:ballSize_*2+'px'}"></view>
						<view class="loading-text" :style="{lineHeight:ballSize_+'px'}">{{loadPercent}}%</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			loadType:{//加载条的类型，line-线形，circle-圆形
				type:String,
				default:'line'
			},
			lineInfo:{
				type:Object,
				default:function(){
					var info={
						colorChange:false,//颜色是否渐变
						loadColor:'#6ee2e1,#2ba98c,#a07e1e'//进度条颜色,渐变时色值至少三种，非渐变时只需一种色值，多传取第一条，多个色值','逗号分开
					}
					return info;
				}
			},
			circleInfo:{
				type:Object,
				default:function(){
					var info={
						foreground:'#FFFFFF',//圆形进度条前景色
						background:'#6ED4BF',//背景色
						circleColor:'#cec4c4'//中心圆盘的颜色
					}
					return info;
				}
			},
			ballInfo:{
				type:Object,
				default:function(){
					var info={
						ballType:'all',//center-只中心出现水波，all-球面也出现水波
						ballSize:100,//球形的大小，最大200，最小50，超出范围可能样式需要再进行优化
						waveColor:'#cec4c4',//水波颜色
						ballPadding:'5px',//球内间距
						
					}
					return info;
				}
			},
			loadText:{//加载时显示的文字
				type:String,
				default:'加载中：'
			},
			loadPercent:{//进度百分比，不需要加%
				type:Number,
				default:0
			}
		},
		data() {
			return {
				ballSize_:0
			};
		},
		mounted() {
			if(this.ballInfo.ballSize>200){
				this.ballSize_=200;
			}else if(this.ballInfo.ballSize<50){
				this.ballSize_=50;
			}else{
				this.ballSize_=this.ballInfo.ballSize;
			}
		}
	}
</script>

<style>
	/* 图标使用的是font-awesome，图标可在http://fontawesome.dashgame.com/找 */
	@import url("./css/font-awesome.min.css");
	@import url("./css/loadline.css");
</style>
