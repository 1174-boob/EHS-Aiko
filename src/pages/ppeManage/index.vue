<template>
  <!-- PPE管理 -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>PPE管理</PageTitle>
    <div class="card-container">
      <a-tabs v-model="activeKey" @change="tabChange">
        <a-tab-pane key="1" tab="库存管理">
          <div>
            <PpeDepository v-if="activeKey == 1" />
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="领用管理">
          <div>
            <PpeClaim v-if="activeKey == 2" />
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="报废管理">
          <div>
            <PpeStock v-if="activeKey == 3" />
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import PpeDepository from './ppeDepository/index.vue'
import PpeClaim from './ppeClaim/index.vue'
import PpeStock from './ppeStock/index.vue'
export default {
  components: { PpeDepository, PpeClaim, PpeStock },
  data() {
    return {
      activeKey: '1',
    }
  },
  created() {
    this.setRouterCode("ppeManage");
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
        path: "/occupationHealth/ppeManage",
        query,
      });
      this.initPageFn
    },
    initPageFn() {
      if (this.activeKey == 1) {
        this.$refs.PpeDepository.initPage()
      } else if (this.activeKey == 2) {
        this.$refs.PpeClaim.initPage()
      } else if (this.activeKey == 3) {
        this.$refs.PpeStock.initPage()
      }
    }
  },
}
</script>

<style lang="less" scoped>
</style>