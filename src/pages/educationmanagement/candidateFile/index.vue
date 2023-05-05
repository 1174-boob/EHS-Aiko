<template>
  <!-- 考生档案  -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>考生档案</PageTitle>
    <div class="card-container">
      <a-tabs v-model="activeKey" @change="tabChange">
        <a-tab-pane key="1" tab="内部员工">
          <div>
            <InsideWorker v-if="activeKey == 1" />
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="外部员工">
          <div>
            <OutsideWorker v-if="activeKey == 2" />
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import InsideWorker from './insideWorker/index.vue'
import OutsideWorker from './outsideWorker/index.vue'
export default {
  components: { InsideWorker, OutsideWorker },
  data() {
    return {
      activeKey: '1',
    }
  },
  created() {
    this.setRouterCode("candidateFile");
    this.activeKey = this.$route.query.activeKey ? this.$route.query.activeKey + '' : '1'
  },
  mounted() {
    // this.initPageFn()
  },
  methods: {
    // tab切换
    tabChange(activeKey) {
      let query = { activeKey };
      this.$router.push({
        path: "/ehsGerneralManage/educationmanagement/candidateFile",
        query,
      });
      // this.initPageFn
    },
    initPageFn() {
      if (this.activeKey == 1) {
        // this.$refs.InsideWorker.initPage()
      } else if (this.activeKey == 2) {
        // this.$refs.OutsideWorker.initPage()
      } else if (this.activeKey == 3) {
        // this.$refs.PpeStock.initPage()
      }
    }
  },
}
</script>

<style lang="less" scoped>
</style>