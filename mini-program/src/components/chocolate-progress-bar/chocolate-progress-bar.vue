<template>
  <view class="progress_box">
    <canvas class="progress_bg" canvas-id="cpbg"></canvas>
    <canvas class="progress_bar" canvas-id="cpbar"></canvas>
    <view class="progress_txt">
      <view class="progress_info">{{ progress_txt }}%</view>
      <text>正确率</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    progress_txt: {
      type: Number,
      default: 0,
    },
  },
  onReady: function () {
    this.drawProgressbg();
    this.drawCircle(this.progress_txt); //参数为1-100
  },
  methods: {
    drawProgressbg: function () {
      // 自定义组件实例 this ，表示在这个自定义组件下查找拥有 canvas-id 的 <canvas/>
      var ctx = uni.createCanvasContext("cpbg", this);
      ctx.setLineWidth(12); // 设置圆环的宽度
      ctx.setStrokeStyle("#E9E9E9"); // 设置圆环的颜色
      ctx.setLineCap("round"); // 设置圆环端点的形状
      ctx.beginPath(); //开始一个新的路径
      ctx.arc(110, 110, 70, 0.75 * Math.PI, 0.25 * Math.PI, false);
      //设置一个原点(110,110)，半径为100的圆的路径到当前路径
      ctx.stroke(); //对当前路径进行描边
      ctx.draw();
    },
    drawCircle: function (step) {
      var ctx = uni.createCanvasContext("cpbar", this);
      // 进度条的渐变(中心x坐标-半径-边宽，中心Y坐标，中心x坐标+半径+边宽，中心Y坐标)
      var gradient = ctx.createLinearGradient(28, 55, 192, 55);
      gradient.addColorStop("0", "#FFA68C");
      gradient.addColorStop("1.0", "#FF3B1D");
      ctx.setLineWidth(12);
      ctx.setStrokeStyle(gradient);
      ctx.setLineCap("round");
      ctx.beginPath();
      // 参数step 为绘制的百分比
      step = 0.015 * step + 0.75;
      if (step >= 2) {
        step = step % 2;
      }
      ctx.arc(110, 110, 70, 0.75 * Math.PI, step * Math.PI, false);
      ctx.stroke();
      ctx.draw();
    },
  },
};
</script>

<style>
.progress_box {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.progress_bg {
  position: absolute;
  width: 220px;
  height: 220px;
}
.progress_bar {
  width: 220px;
  height: 220px;
}
.progress_txt {
  position: absolute;
  font-size: 28upx;
  color: #999999;
}
.progress_info {
  font-size: 36upx;
  padding-left: 16upx;
  letter-spacing: 2upx;
  font-size: 52upx;
  color: #333333;
}
.progress_dot {
  width: 16upx;
  height: 16upx;
  border-radius: 50%;
  background-color: #fb9126;
}
</style>
