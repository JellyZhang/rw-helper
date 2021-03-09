<template>
  <view class="container">
    <view class="ui-all">
      <view class="avatar">
        <view class="imgAvatar">
          <view
            class="iavatar"
            :style="
              'background: url(' + avatar + ') no-repeat center/cover #eeeeee;'
            "
          ></view>
        </view>
      </view>
      <view class="ui-list">
        <text>昵称</text>
        <input
          type="text"
          :value="nickName"
          placeholder-class="place"
          :disabled="true"
        />
      </view>
      <view class="ui-list">
        <text>openid</text>
        <input
          type="text"
          :value="openid"
          placeholder-class="place"
          :disabled="true"
        />
      </view>
      <view class="ui-list">
        <text>绑定情况</text>
        <text v-if="isbind">已绑定</text>
        <text v-else>未绑定</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      avatar: "",
      nickName: "",
      city: "",
      country: "",
      gender: "",
      language: "",
      province: "",
      openid: "",
      isbind: false,
    };
  },
  onLoad() {},
  onShow() {
    var _this = this;
    uni.getSetting({
      success(res) {
        if (res.authSetting["scope.userInfo"]) {
          // 已登录
          // 获取用户基本信息
          uni.getUserInfo({
            success(res) {
              console.log(res);
              _this.avatar = res.userInfo.avatarUrl;
              _this.nickName = res.userInfo.nickName;
              _this.city = res.userInfo.city;
              _this.country = res.userInfo.country;
              _this.gender = res.userInfo.gender;
              _this.language = res.userInfo.language;
              _this.province = res.userInfo.province;
            },
            fail() {
              console.log("获取用户信息异常");
              uni.showToast({
                title: "获取用户信息异常",
                duration: 2000,
              });
            },
          });

          // 获取openid
          uni.getStorage({
            key: "openid",
            success: (res) => {
              _this.openid = res.data;
              // 获取isbind
              if (_this.openid == "or_UE5YCesYlZBCDww4Lls23YODE") {
                _this.isbind = true;
              }
            },
            fail: (err) => {
              console.log("get openid from storage error, err=", err);
              uni.navigateTo({
                url: "../login/login",
                success: (res) => {
                  console.log(res);
                },
                fail: (res) => {
                  console.log(res);
                },
                complete: (res) => {
                  console.log(res);
                },
              });
            },
          });
        } else {
          console.log("需要点击按钮手动授权");
          uni.navigateTo({
            url: "../login/login",
            success: (res) => {
              console.log(res);
            },
            fail: (res) => {
              console.log(res);
            },
            complete: (res) => {
              console.log(res);
            },
          });
        }
      },
    });
  },
  methods: {
    getSettingMes() {
      var _this = this;
      uni.getSetting({
        success(res) {
          if (res.authSetting["scope.userInfo"]) {
            // 用户信息已授权，获取用户信息
            uni.getUserInfo({
              success(res) {
                console.log(res);
                _this.avatar = res.userInfo.avatarUrl;
                _this.nickName = res.userInfo.nickName;
                _this.city = res.userInfo.city;
                _this.country = res.userInfo.country;
                _this.gender = res.userInfo.gender;
                _this.language = res.userInfo.language;
                _this.province = res.userInfo.province;
              },
              fail() {
                console.log("获取用户信息失败");
              },
            });
          } else if (!res.authSetting["scope.userInfo"]) {
            console.log("需要点击按钮手动授权");
            uni.navigateTo({
              url: "../login/login",
              success: (res) => {
                console.log(res);
              },
              fail: (res) => {
                console.log(res);
              },
              complete: (res) => {
                console.log(res);
              },
            });
          }
        },
        fail() {
          console.log("获取已授权选项失败");
        },
      });
    },
  },
};
</script>

<style lang="less">
.container {
  display: block;
}

.ui-all {
  padding: 20rpx 40rpx;

  .avatar {
    width: 100%;
    text-align: left;
    padding: 20rpx 0;
    border-bottom: solid 1px #f2f2f2;
    position: relative;

    .imgAvatar {
      width: 140rpx;
      height: 140rpx;
      border-radius: 50%;
      display: inline-block;
      vertical-align: middle;
      overflow: hidden;

      .iavatar {
        width: 100%;
        height: 100%;
        display: block;
      }
    }

    text {
      display: inline-block;
      vertical-align: middle;
      color: #8e8e93;
      font-size: 28rpx;
      margin-left: 40rpx;
    }
  }

  .ui-list {
    width: 100%;
    text-align: left;
    padding: 20rpx 0;
    border-bottom: solid 1px #f2f2f2;
    position: relative;

    text {
      color: #4a4a4a;
      font-size: 28rpx;
      display: inline-block;
      vertical-align: middle;
      min-width: 150rpx;
    }

    input {
      color: #030303;
      font-size: 30rpx;
      display: inline-block;
      vertical-align: middle;
    }
    button {
      color: #030303;
      font-size: 30rpx;
      display: inline-block;
      vertical-align: middle;
      background: none;
      margin: 0;
      padding: 0;
      &::after {
        display: none;
      }
    }
    picker {
      width: 90%;
      color: #030303;
      font-size: 30rpx;
      display: inline-block;
      vertical-align: middle;
      position: absolute;
      top: 30rpx;
      left: 150rpx;
    }

    textarea {
      color: #030303;
      font-size: 30rpx;
      vertical-align: middle;
      height: 150rpx;
      width: 100%;
      margin-top: 50rpx;
    }

    .place {
      color: #999999;
      font-size: 28rpx;
    }
  }

  .right:after {
    content: " ";
    width: 20rpx;
    height: 20rpx;
    border-top: solid 1px #030303;
    border-right: solid 1px #030303;
    transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    /* IE 9 */
    -moz-transform: rotate(45deg);
    /* Firefox */
    -webkit-transform: rotate(45deg);
    /* Safari 和 Chrome */
    -o-transform: rotate(45deg);
    position: absolute;
    top: 40rpx;
    right: 0;
  }
}
</style>
