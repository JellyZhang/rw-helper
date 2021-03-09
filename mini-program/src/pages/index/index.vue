<template>
  <view>
    <view>
      <sl-filter
        :ref="'slFilter'"
        :topFixed="false"
        :isTransNav="true"
        :navHeight="0"
        :menuList="menuList"
        :color="filterTitleColor"
        :themeColor="filterThemeColor"
        @result="result"
      ></sl-filter>
    </view>

    <view>
      <xw-empty
        :isShow="emptyShow"
        text="暂无相关数据"
        textColor="#777777"
      ></xw-empty>

      <view v-for="c in carpools" :key="c.id">
        <uni-card
          :title="'' + c.time"
          :thumbnail="c.thumbnail"
          :extra="'🙋🏻 ' + c.member"
          :note="c.note"
          isShadow="false"
          @click="cardClick(c)"
          >[{{ c.id }}]{{ c.start_pos }} ➡️ {{ c.end_pos }}
        </uni-card>
        <view class="progress-box">
          <progress
            :percent="c.percent"
            active
            stroke-width="3"
            :activeColor="getColor(c.percent)"
            duration="15"
          />
        </view>
      </view>
    </view>

    <view style="padding: 20px 30px 200px 30px">
      <wyb-pagination
        :total-items="pageInfo.total"
        @change="pageChange"
        :page-items="pageInfo.size"
        :current="pageInfo.current"
        :show-icon="true"
      />
    </view>

    <view>
      <uni-fab
        :pattern="fabOptions.pattern"
        :content="fabOptions.content"
        :horizontal="fabOptions.horizontal"
        :vertical="fabOptions.vertical"
        :direction="fabOptions.direction"
        @fabClick="fabClick"
      ></uni-fab>
    </view>

    <wyb-popup
      ref="popup"
      type="center"
      height="620"
      width="500"
      radius="6"
      :showCloseIcon="true"
    >
      <view style="text-align: center; margin: 20px 0">
        <tki-qrcode
          ref="qrcode"
          :val="qrcode_val"
          size="400"
          :onval="true"
          :showLoading="false"
        />
        <text style="margin: 20px 0">{{ qrcode_carpool }}\n</text>
        <text style="margin: 20px 0">请保存图片后扫码加入群聊\n</text>
      </view>
    </wyb-popup>
  </view>
</template>



<script>
import slFilter from "@/components/sl-filter/sl-filter.vue";
import wybPagination from "@/components/wyb-pagination/wyb-pagination.vue";
import xwEmpty from "@/components/xw-empty/xw-empty";
import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue";
import format from "date-fns/format";
import { zhCN } from "date-fns/locale";

export default {
  components: {
    slFilter,
    wybPagination,
    xwEmpty,
    tkiQrcode,
  },
  data() {
    return {
      qrcode_val: "init",
      qrcode_carpool: "",
      emptyShow: false,
      fabOptions: {
        pattern: {
          color: "#3c3e49",
          selectedColor: "#007AFF",
          backgroundColor: "#ffffff",
          buttonColor: "#3c3e49",
        },
        content: [],
        horizontal: "right",
        direction: "horizontal",
        vertical: "bottom",
        popMenu: false,
      },
      pageInfo: {
        total: 1,
        current: 1,
        size: 10,
      },
      filterResult: "",
      filterThemeColor: "#00BFFF",
      menuList: [
        {
          title: "出发地",
          isMutiple: false,
          key: "startpos",
          detailList: [
            {
              title: "不限",
              value: "",
            },
            {
              title: "大兴校区",
              value: "daxing_campus",
            },
            {
              title: "燕园校区",
              value: "yanyuan_campus",
            },
            {
              title: "燕园校区-东门",
              value: "yanyuan_campus_east",
            },
            {
              title: "燕园校区-南门",
              value: "yanyuan_campus_south",
            },
            {
              title: "燕园校区-西门",
              value: "yanyuan_campus_west",
            },
            {
              title: "燕园校区-北门",
              value: "yanyuan_campus_north",
            },
            {
              title: "本部校医院",
              value: "yanyuan_hospital",
            },
          ],
        },
        {
          title: "目的地",
          isMutiple: false,
          key: "endpos",
          detailList: [
            {
              title: "不限",
              value: "",
            },
            {
              title: "大兴校区",
              value: "daxing_campus",
            },
            {
              title: "燕园校区",
              value: "yanyuan_campus",
            },
            {
              title: "燕园校区-东门",
              value: "yanyuan_campus_east",
            },
            {
              title: "燕园校区-南门",
              value: "yanyuan_campus_south",
            },
            {
              title: "燕园校区-西门",
              value: "yanyuan_campus_west",
            },
            {
              title: "燕园校区-北门",
              value: "yanyuan_campus_north",
            },
            {
              title: "本部校医院",
              value: "yanyuan_hospital",
            },
          ],
        },
        {
          title: "排序",
          key: "sort",
          isSort: true,
          detailList: [
            {
              title: "默认排序",
              value: "",
            },
            {
              title: "最新发布",
              value: "add_time",
            },
            {
              title: "最近出发",
              value: "start_time",
            },
          ],
        },
        {
          title: "时间",
          key: "time",
          isSort: true,
          isMutiple: false,
          detailList: [
            {
              title: "不限",
              value: "",
            },
            {
              title: "10分钟内",
              value: "within_10_minutes10",
            },
            {
              title: "30分钟内",
              value: "within_30_minutes",
            },
            {
              title: "今天",
              value: "today",
            },
            {
              title: "明天",
              value: "tomorrow",
            },
            {
              title: "本周末",
              value: "this_weekend",
            },
            {
              title: "7天之内",
              value: "within_7_days",
            },
            {
              title: "7天之后",
              value: "after_7_days",
            },
          ],
        },
      ],
      carpools: [],
    };
  },
  onLoad() {},
  onReady() {},
  onShow() {
    console.log("show");
    this.getCarpools();
  },
  methods: {
    getCarpools() {
      const webUrl = getApp().globalData.apiUrl;
      const carThumbnail = "/static/car.jpg";
      const planeThumbnail = "/static/plane.jpg";
      const trainThumbnail = "/static/train.jpg";
      uni.request({
        url: webUrl + "/carpools",
        success: (res) => {
          console.log(res.data);
          console.log(res.data.Data);
          this.carpools = [];
          if (res.data.Data == null) {
            res.data.Data = [];
          }
          for (var c of res.data.Data) {
            if (c.Status == 99) continue;
            const startTime = new Date(c.StartTime);
            const now = new Date();
            const dis = Math.floor(
              (startTime.getTime() - now.getTime()) / 60000
            );
            const p = dis < 0 || dis > 60 ? 0 : (dis * 100) / 60;

            this.carpools.push({
              id: c.CarpoolId,
              thumbnail: carThumbnail,
              start_pos: c.StartPos,
              end_pos: c.EndPos,
              time: format(startTime, "MM-dd EEE HH:mm", { locale: zhCN }),
              member:
                c.CurrentMember.toString() + "/" + c.TotalMember.toString(),
              note: c.Note,
              percent: p,
              qrcode_url: c.WechatRoomQRcode,
            });
          }
          console.log(this.carpools.length);
          if (this.carpools.length == 0) {
            this.emptyShow = true;
          } else {
            this.emptyShow = false;
          }
        },
        fail: (res) => {
          console.log(res.data);
        },
      });
    },
    cardClick(c) {
      this.qrcode_carpool =
        "[" + c.id + "]" + c.start_pos + "➡️" + c.end_pos + "\n" + c.time;
      this.qrcode_val = c.qrcode_url;
      this.$refs.qrcode._makeCode();
      this.$refs.popup.show(); // 显示
    },
    result(val) {
      console.log("filter_result:" + JSON.stringify(val));
      this.filterResult = JSON.stringify(val, null, 2);
      this.carpools = [
        {
          id: 3,
          icon: "🚅",
          start_pos: "燕园校区",
          end_pos: "大兴校区",
          time: "2020-01-01",
          member: "2/4",
          note: "无",
        },
      ];
    },
    pageChange(e) {
      this.$data.pageInfo.current = e.current;
      console.log(e.current);
    },
    fabClick() {
      uni.navigateTo({
        url: "../addcarpool/addcarpool",
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
    getColor(percent) {
      var r_1 = 0;
      var g_1 = 255;
      var b_1 = 0;
      var r_2 = 255;
      var g_2 = 0;
      var b_2 = 0;
      var r_3 = Math.round(r_1 + ((r_2 - r_1) / 100.0) * percent);
      var g_3 = Math.round(g_1 + ((g_2 - g_1) / 100.0) * percent);
      var b_3 = Math.round(b_1 + ((b_2 - b_1) / 100.0) * percent);
      var r = ("0" + (Math.round(r_3) || 0).toString(16)).slice(-2);
      var g = ("0" + (Math.round(g_3) || 0).toString(16)).slice(-2);
      var b = ("0" + (Math.round(b_3) || 0).toString(16)).slice(-2);
      var ans = "#" + r + g + b;
      return ans;
    },
  },
};
</script>

<style>
.progress-box {
  padding: 0 15px;
}
.example {
  padding: 10px;
  background-color: #fff;
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

.text {
  margin: 15rpx 10rpx;
  padding: 0 20rpx;
  background-color: #ebebeb;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
  color: #777;
  font-size: 26rpx;
}

.uni-column {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  flex-direction: column;
}
</style>
