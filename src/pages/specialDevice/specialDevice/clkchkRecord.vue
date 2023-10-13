<template>
  <!-- 设备安全认证履历 -->
  <HasSpinAndBtnBox :spinning="false">
    <div class="clx-flex-1">
      <div class="baseInfo">
        <a-row type="flex" justify="space-around">
          <a-col :span="4">设备名称：叉车</a-col>
          <a-col :span="4">设备代码：xxx</a-col>
          <a-col :span="4">所在位置：xxx</a-col>
          <a-col :span="4">牌照编号：xxx</a-col>
        </a-row>
      </div>

      <a-tabs v-model="activeKey" @change="tabChange">
        <a-tab-pane key="1" tab="日常点检">
          <ClkchkSearch :equipmentType="equipmentType" :chkType="'day'" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="月度点检">
          <ClkchkSearch :equipmentType="equipmentType" :chkType="'month'" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="年度点检">
          <ClkchkSearch :equipmentType="equipmentType" :chkType="'year'" />
        </a-tab-pane>
        <a-tab-pane key="4" tab="年度自评">
          <ClkchkSearch :equipmentType="equipmentType" :chkType="'self'" />
        </a-tab-pane>
      </a-tabs>
    </div>
    <FixedBottom slot="fixedBottom">
      <a-button @click="goBack">返回</a-button>
    </FixedBottom>
  </HasSpinAndBtnBox>
</template>

<script>
import { debounce } from "lodash";
import { recordList, recordExport } from "@/services/deviceSafety.js";
import { getPortraitUrlt } from "@/services/api.js";
import dayJs from "dayjs";
import ClkchkSearch from './chkComp/ClkchkSearch.vue'
export default {
  components: { ClkchkSearch },
  data() {
    return {
      activeKey: '1',
      countInfo: {},
      curIndex: null,
      tableDataList: null,
      //弹框
      loading: false,
      equipmentId: null,
      recordInfo: {},
    };
  },
  created() {
    this.activeKey = this.$route.query.activeKey ? this.$route.query.activeKey + '' : '1'
    this.equipmentId = this.$route.query.Id;
    this.equipmentType = this.$route.query.equipmentType;
    this.initData();
  },
  methods: {
    tabChange(activeKey) {
      // let query = { activeKey };
      // this.$router.push({
      //   path: "/ehsGerneralManage/securityArchiveManagement/certificatesManagement",
      //   query,
      // });
    },
    goBack() {
      this.setKeepalive(true);
      this.$router.go(-1);
    },
    handelDownload() {
      console.log("下载");
      recordExport({ equipmentId: this.equipmentId }).then((res) => {
        const name = "设备履历导出";
        const blob = new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const downloadElement = document.createElement("a");
        const href = URL.createObjectURL(blob); //创建下载链接
        downloadElement.href = href;
        downloadElement.download = name + ".xlsx";
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
        this.$antMessage.success("导出成功");
      });
    },
    initData() {
      recordList({ equipmentId: this.equipmentId }).then((res) => {
        this.recordInfo = res.data;
        this.tableDataList = res.data.certificationVoList;
      });
      // let res = { data: {}, total: 1 }
      // res.data = [{ responsibilityName: '4', bDate: 'test', bjr: 'test', bcTime: 'test', notCause: 'test', report: 'test' }]
      // this.tableDataList = res.data
    },
    handleDownloadPdf(e) {
      getPortraitUrlt([e]).then((res) => {
        if (res.data[0]) {
          console.log(res.data[0].filePath);
          window.open(res.data[0].filePath);
        }
      });
    },
    handleCheckInfo(e) {
      this.$router.push({
        path: "/safeManage/deviceSafeManage/deviceSafety/recordDteails",
        query: {
          Id: e.certificationId,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.download {
  padding: 20px 0;
}
.baseInfo {
  padding: 30px 0;
  .bottom {
    margin-top: 30px;
  }
}
</style>
