<template>
  <view>
    <view class="ray-msg-mask" @click="sendMsgToParent"></view>
    <view class="ray-msg-content">
      <text
        :class="['ray-msg-icon', type == 'success' ? '' : 'ray-msg-error']"
      ></text>
      <view class="ray-msg-title">{{
        title ? title : type == "success" ? "操作成功" : "操作失败"
      }}</view>
      <view class="fixed-msg-info" v-if="info">{{ info }}</view>
      <view
        :class="['ray-msg-btn', type == 'success' ? '' : 'ray-msg-error']"
        @click="sendMsgToParent"
        >{{ btn }}</view
      >
    </view>
  </view>
</template>

<script>
export default {
  name: "yangr-msg",
  //属性
  props: {
    title: {
      type: String,
      value: "", // title 为空时根据 type ，显示"操作成功"/"操作失败"
    },
    type: {
      type: String, // success or error
      value: "", // 默认值
    },
    info: {
      type: String,
      value: "", // info 为空时不显示
    },
    btn: {
      type: String,
      value: "",
    },
  },
  //组件生命周期
  created: function (e) {},
  methods: {
    sendMsgToParent() {
      this.$emit("yangrMsgEvent", "");
    },
  },
};
</script>

<style lang="scss">
@import "./yangr-msg.scss";
</style>
