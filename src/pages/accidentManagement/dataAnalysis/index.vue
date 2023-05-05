<template>
  <!-- 事故事件管理-虚惊未遂事件-数据统计分析 -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>数据统计分析</PageTitle>
    <div class="card-container">
      <a-tabs v-model="activeKey" @change="tabChange">
        <a-tab-pane key="1" tab="事故事件">
          <div>
            <AccidentDA />
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="虚惊未遂事件">
          <div>
            <FalseAlarmDA />
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import AccidentDA from './comp/accidentDA'
import FalseAlarmDA from './comp/falseAlarmDA'
export default {
  components: { AccidentDA, FalseAlarmDA },
  data() {
    return {
      activeKey: '1',
    }
  },
  created() {
    this.setRouterCode("accidentManagementDA");
    let activeKey = this.$route.query.activeKey + ''
    this.activeKey = activeKey ? (activeKey == '1' || activeKey == '2' ? activeKey : '1') : '1'
  },
  mounted() {
    // this.initPageFn()
  },
  methods: {
    // tab切换
    tabChange(activeKey) {
      let query = { activeKey };
      this.$router.push({
        path: "/safeManage/emergencyManagement/accidentManagement/accidentManagementDA",
        query,
      });
      // this.initPageFn
    },
    initPageFn() {
      // if (this.activeKey == 1) {
      //   this.$refs.PpeDepository.initPage()
      // } else if (this.activeKey == 2) {
      //   this.$refs.PpeClaim.initPage()
      // } else if (this.activeKey == 3) {
      //   this.$refs.PpeStock.initPage()
      // }
    }
  },
}
</script>

<style lang="less" scoped>
.card-container {
  position: relative;
}
</style>