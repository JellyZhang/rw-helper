<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view>
      <button
        open-type="getPhoneNumber"
        @getphonenumber="getphonenumber"
        class="getInfo"
      >
        一键授权登录
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      apiUrl: "http://localhost:8080",
    };
  },
  onLoad() {},
  methods: {
    getphonenumber(e) {
      if (e.detail.iv) {
        console.log(e.detail.iv); //传后台解密换取手机号
        uni.showToast({
          title: "已授权",
          icon: "none",
          duration: 2000,
        });
      }
    },
    getUserInfo(e) {
      uni.getUserInfo({
        // 获取信息成功
        success(res) {
          console.log("getUserInfo success, res=" + res);
          // 成功后进行登录,获取code
          uni.login({
            provider: "weixin",
            success(res) {
              console.log(res);
              //小程序appid
              let appid = "wxf6cf897e9a597410"; //我瞎写的
              //小程序secret
              let secret = "55ff9573169571fafda67d1c3ecfb330"; //我瞎写的
              //wx接口路径
              let url =
                "https://api.weixin.qq.com/sns/jscode2session?appid=" +
                appid +
                "&secret=" +
                secret +
                "&js_code=" +
                res.code +
                "&grant_type=authorization_code";
              uni.request({
                url: url, // 请求路径
                method: "GET", //请求方式
                success: (result) => {
                  var openid = result.data.openid;
                  console.info("openid=" + openid);
                  // 存入storage
                  uni.setStorage({
                    key: "openid",
                    data: openid,
                    success: function () {
                      console.log("success set storage openid");
                      // 存储成功后返回上一级页面
                      uni.navigateBack();
                    },
                    fail: (err) => {
                      console.log("存储openid至storage失败，err=", err);
                    },
                  });
                },
                fail: (err) => {
                  console.log("通过code换取openid失败，err=" + err);
                },
              });
            },
          });
        },
        fail(err) {
          console.log("获取用户信息失败, err=" + err);
        },
      });
    },
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
