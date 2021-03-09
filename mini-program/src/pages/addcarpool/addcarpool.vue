<template>
  <view style="margin-top: 20px">
    <uni-forms :value="formData" ref="form" :rules="rules">
      <uni-forms-item required label="出发地" name="start_pos">
        <uni-easyinput
          type="text"
          v-model="formData.start_pos"
          placeholder="请输入出发地"
        />
        <view class="tag-body">
          <view v-for="s in startposTag" class="tag-view" :key="s">
            <uni-tag
              :text="s"
              type="primary"
              :circle="true"
              @click="startposClick(s)"
            ></uni-tag>
          </view>
        </view>
      </uni-forms-item>
      <uni-forms-item required label="目的地" name="end_pos">
        <uni-easyinput
          type="text"
          v-model="formData.end_pos"
          placeholder="请输入目的地"
        />
        <view class="tag-body">
          <view v-for="e in endposTag" class="tag-view" :key="e">
            <uni-tag
              :text="e"
              type="success"
              :circle="true"
              @click="endposClick(e)"
            ></uni-tag>
          </view>
        </view>
      </uni-forms-item>
      <uni-forms-item label="出发时间" name="time">
        <view style="margin: 7px">
          <uni-dateformat
            :date="formData.timestr"
            format="yyyy/MM/dd hh:mm"
            locale="zh"
            :threshold="[0, 0]"
            ref="dateformat"
          ></uni-dateformat>
        </view>
        <view class="tag-body">
          <view class="tag-view">
            <uni-tag
              text="现在"
              type="warning"
              :circle="true"
              @click="timeSetNow()"
            ></uni-tag>
          </view>
          <view v-for="t in timeTag" class="tag-view" :key="t.title">
            <uni-tag
              :text="t.title"
              type="warning"
              :circle="true"
              @click="timeAdd(t.value)"
            ></uni-tag>
          </view>
          <view class="tag-view">
            <uni-tag
              text="选择具体时间"
              type="error"
              :circle="true"
              @click="onShowDatePicker('datetime')"
            ></uni-tag>
          </view>
        </view>
        <mx-date-picker
          :show="timePicker.showPicker"
          :type="timePicker.type"
          :value="formData.timestr"
          :show-tips="true"
          @confirm="onSelected"
          @cancel="onSelected"
        />
      </uni-forms-item>
      <uni-forms-item label="总人数" name="total_member">
        <view>
          <uni-number-box
            :min="2"
            :max="4"
            v-model="formData.member"
          ></uni-number-box>
        </view>
      </uni-forms-item>

      <uni-forms-item label="备注" name="note">
        <uni-easyinput
          type="text"
          v-model="formData.note"
          placeholder="请输入备注(可选)"
        />
      </uni-forms-item>
    </uni-forms>

    <view class="btn-container uni-flex uni-row">
      <view class="btn-body">
        <button class="btn" @click="cancel" style="background-color: #b0c4de">
          取消
        </button>
      </view>
      <view class="btn-body">
        <button
          class="btn"
          @click="submitForm"
          style="background-color: #1e90ff"
        >
          创建
        </button>
      </view>
    </view>

    <wyb-loading ref="loading" loading-type="scale-line" mask-alpha="0.5" />
    <yangr-msg
      v-if="toast.show"
      :title="toast.title"
      :type="toast.type"
      :info="toast.info"
      btn="确定"
      @yangrMsgEvent="closeToast"
    ></yangr-msg>
  </view>
</template>

<script>
import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
import wybButton from "@/components/wyb-button/wyb-button.vue";
import wybLoading from "@/components/wyb-loading/wyb-loading.vue";
import wybPopup from "@/components/wyb-popup/wyb-popup.vue";
import yangrMsg from "@/components/yangr-msg/yangr-msg.vue";

export default {
  components: {
    MxDatePicker,
    wybButton,
    wybLoading,
    wybPopup,
    yangrMsg,
  },
  data() {
    return {
      rules: {
        // 对name字段进行必填验证
        start_pos: {
          rules: [
            {
              required: true,
              errorMessage: "请输入出发地",
            },
            {
              minLength: 1,
              maxLength: 15,
              errorMessage: "长度在 {minLength} 到 {maxLength} 个字符",
            },
          ],
        },
        end_pos: {
          rules: [
            {
              required: true,
              errorMessage: "请输入目的地",
            },
            {
              minLength: 1,
              maxLength: 15,
              errorMessage: "长度在 {minLength} 到 {maxLength} 个字符",
            },
          ],
        },
        note: {
          rules: [
            {
              minLength: 0,
              maxLength: 20,
              errorMessage: "长度在 {minLength} 到 {maxLength} 个字符",
            },
          ],
        },
      },
      toast: {
        title: "",
        info: "",
        type: "success",
        show: false,
      },
      timePicker: {
        showPicker: false,
        type: "datetime",
      },

      formData: {
        start_pos: "",
        end_pos: "",
        timestr: new Date().toString(),
        time: new Date(),
        member: 4,
        note: "",
      },
      startposTag: ["大兴校区", "燕园校区", "燕园校区-东门", "燕园校区-南门"],
      endposTag: ["大兴校区", "燕园校区", "燕园校区-东门", "燕园校区-南门"],
      timeTag: [
        { title: "+1分钟", value: 1 },
        { title: "+5分钟", value: 5 },
        { title: "+10分钟", value: 10 },
        { title: "+30分钟", value: 30 },
        { title: "+1小时", value: 60 },
      ],
    };
  },
  computed: {},
  created() {},
  onLoad() {},
  methods: {
    closeToast() {
      this.toast.show = false;
      // 操作成功，直接返回上级页面
      if (this.toast.type === "success") {
        uni.navigateBack();
      }
    },
    timeSetNow() {
      this.formData.time = new Date();
      this.formData.timestr = this.formData.time.toString();
    },
    timeAdd(offset) {
      var cur = this.formData.time.getMinutes();
      this.formData.time.setMinutes(cur + offset);
      this.formData.timestr = this.formData.time.toString();
    },
    onShowDatePicker(type) {
      //显示
      this.timePicker.showPicker = true;
    },
    onSelected(e) {
      //选择
      this.timePicker.showPicker = false;
      if (e) {
        this.formData.timestr = e.value;
        this.formData.time = new Date(this.formData.timestr);
        //选择的值
        console.log("value => " + e.value);
        //原始的Date对象
        console.log("date => " + e.date);
      }
    },
    startposClick(pos) {
      this.formData.start_pos = pos;
    },
    endposClick(pos) {
      this.formData.end_pos = pos;
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    submitForm(form) {
      // 手动提交表单
      this.$refs.form.submit().then((res) => {
        this.$refs.loading.showLoading();
        res["start_time_stamp"] = Math.floor(
          new Date(res.time).getTime() / 1000
        );
        res["total_member"] = this.formData.member;
        const webUrl = getApp().globalData.apiUrl;
        console.log("表单返回得值：", res);
        uni.request({
          url: webUrl + "/carpool/create",
          method: "POST",
          data: res,
          header: {
            "content-type": "application/json",
          },
          success: (res) => {
            console.log(res.data);
            if (res.statusCode == 200) {
              this.toast.title = "请求成功";
              this.toast.info = "请求成功";
              this.toast.type = "success";
            } else {
              this.toast.title = "请求失败";
              this.toast.info = "服务器内部错误";
              this.toast.type = "error";
            }
          },
          fail: (res) => {
            console.log(res);
            this.toast.title = "请求失败";
            this.toast.info = "网络异常,请稍后重试";
            this.toast.type = "error";
          },
          complete: (res) => {
            console.log(res);
            this.$refs.loading.hideLoading();
            this.toast.show = true;
          },
        });
      });
    },
    cancel() {
      uni.navigateBack();
    },
    confirm() {
      console.log("a");
      uni.navigateBack();
    },
  },
};
</script>

<style>
.btn-container {
  margin-top: 0px;
}
.btn-body {
  width: 120px;
  margin: auto;
}
.btn {
  border-radius: 25px;
  color: white;
  font-size: 17px;
}

.tag-view {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;

  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  flex-direction: column;
  margin: 5rpx 5rpx;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
}

.tag-body {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;

  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
  padding: 10rpx 0rpx;
}

.uni-flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-flex-direction: row;
  flex-direction: row;
}

.uni-row {
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-flex-direction: row;
  flex-direction: row;
}
</style>
