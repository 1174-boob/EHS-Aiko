<template>
  <!-- 设备安全认证履历 -->
  <HasSpinAndBtnBox :spinning="false">
    <div class="clx-flex-1">
      <div class="baseInfo">
        <a-row type="flex" justify="space-around">
          <a-col :span="4">设备名称：{{queryInfo.equipmentName}}</a-col>
          <a-col :span="4">设备代码：{{queryInfo.equipmentCode}}</a-col>
          <a-col :span="4">所在位置：{{queryInfo.equipmentLocation}}</a-col>
          <a-col v-if="queryInfo.forkliftPlateNum!= null" :span="4">牌照编号：{{queryInfo.forkliftPlateNum}}</a-col>
        </a-row>
      </div>

      <div v-if="equipmentType == '0' || equipmentType == '2'">
        <a-tabs v-model="activeKey" @change="tabChange">
          <a-tab-pane key="1" tab="日常点检">
            <ClkchkSearch :equipmentType="equipmentType" :equipmentId="equipmentId" :equipmentName="queryInfo.equipmentName" 
            :equipmentCode="queryInfo.equipmentCode" :equipmentCategory="queryInfo.equipmentCategory" :equipmentLocation="queryInfo.equipmentLocation" :forkliftPlateNum="queryInfo.forkliftPlateNum" :chkType="'1'" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="月度点检">
            <ClkchkSearch :equipmentType="equipmentType" :equipmentId="equipmentId" :equipmentName="queryInfo.equipmentName" 
            :equipmentCode="queryInfo.equipmentCode" :equipmentCategory="queryInfo.equipmentCategory" :equipmentLocation="queryInfo.equipmentLocation" :forkliftPlateNum="queryInfo.forkliftPlateNum" :chkType="'2'" />
          </a-tab-pane>
          <a-tab-pane key="3" tab="年度点检">
            <ClkchkSearch :equipmentType="equipmentType" :equipmentId="equipmentId" :equipmentName="queryInfo.equipmentName" 
            :equipmentCode="queryInfo.equipmentCode" :equipmentCategory="queryInfo.equipmentCategory" :equipmentLocation="queryInfo.equipmentLocation" :forkliftPlateNum="queryInfo.forkliftPlateNum" :chkType="'3'" />
          </a-tab-pane>
          <a-tab-pane key="4" tab="年度自评">
            <ClkchkSearch :equipmentType="equipmentType" :equipmentId="equipmentId" :equipmentName="queryInfo.equipmentName" 
            :equipmentCode="queryInfo.equipmentCode" :equipmentCategory="queryInfo.equipmentCategory" :equipmentLocation="queryInfo.equipmentLocation" :forkliftPlateNum="queryInfo.forkliftPlateNum" :chkType="'4'" />
          </a-tab-pane>
        </a-tabs>
      </div>
      
      <div v-if="equipmentType == '1' || equipmentType == '4'"> 
        <a-tabs v-model="activeKey" @change="tabChange">
          <a-tab-pane key="1" tab="日常点检">
            <ClkchkSearch :equipmentType="equipmentType" :equipmentId="equipmentId" :equipmentName="queryInfo.equipmentName" 
            :equipmentCode="queryInfo.equipmentCode" :equipmentCategory="queryInfo.equipmentCategory" :equipmentLocation="queryInfo.equipmentLocation" :forkliftPlateNum="queryInfo.forkliftPlateNum" :chkType="'1'" />
          </a-tab-pane>
          <a-tab-pane key="4" tab="年度自评">
            <ClkchkSearch :equipmentType="equipmentType" :equipmentId="equipmentId" :equipmentName="queryInfo.equipmentName" 
            :equipmentCode="queryInfo.equipmentCode" :equipmentCategory="queryInfo.equipmentCategory" :equipmentLocation="queryInfo.equipmentLocation" :forkliftPlateNum="queryInfo.forkliftPlateNum" :chkType="'4'" />
          </a-tab-pane>
        </a-tabs>
      </div>

      <div v-if="equipmentType == '3'"> 
        <a-tabs v-model="activeSpecKey" @change="tabChange">
          <a-tab-pane key="2" tab="月度点检">
            <ClkchkSearch :equipmentType="equipmentType" :equipmentId="equipmentId" :equipmentName="queryInfo.equipmentName" 
            :equipmentCode="queryInfo.equipmentCode" :equipmentCategory="queryInfo.equipmentCategory" :equipmentLocation="queryInfo.equipmentLocation" :forkliftPlateNum="queryInfo.forkliftPlateNum" :chkType="'2'" />
          </a-tab-pane>
          <a-tab-pane key="4" tab="年度自评">
            <ClkchkSearch :equipmentType="equipmentType" :equipmentId="equipmentId" :equipmentName="queryInfo.equipmentName" 
            :equipmentCode="queryInfo.equipmentCode" :equipmentCategory="queryInfo.equipmentCategory" :equipmentLocation="queryInfo.equipmentLocation" :forkliftPlateNum="queryInfo.forkliftPlateNum" :chkType="'4'" />
          </a-tab-pane>
        </a-tabs>
      </div>

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
      activeSpecKey: '2',
      countInfo: {},
      curIndex: null,
      tableDataList: null,
      //弹框
      loading: false,
      queryInfo: {},
      equipmentId: null,
      recordInfo: {},
    };
  },
  created() {
    this.activeKey = this.$route.query.activeKey ? this.$route.query.activeKey + '' : '1'
    this.equipmentId = this.$route.query.id;
    this.equipmentType = this.$route.query.equipmentType;
    this.queryInfo = JSON.parse(sessionStorage.getItem('checkRow'));
    console.log('this.queryInfo',this.queryInfo);
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
