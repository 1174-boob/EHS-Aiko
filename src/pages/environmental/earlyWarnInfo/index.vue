<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>预警信息</PageTitle>
    <a-tabs v-model="activeKey" @change="tabChange">
      <a-tab-pane key="1" tab="废气预警信息">
        <WasteGas />
      </a-tab-pane>
      <a-tab-pane key="2" tab="废水预警信息">
        <WasteWater />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import WasteGas from "./tpl/wasteGas.vue";
import WasteWater from "./tpl/wasteWater.vue";
export default {
  components: {
    WasteGas,
    WasteWater
  },
  data() {
    return {
      activeKey: '1',
    }
  },
  created() {
    this.setRouterCode("earlyWarnInfo");
    this.activeKey = this.$route.query.activeKey ? this.$route.query.activeKey + '' : '1'
  },
  methods: {
    // tab切换
    tabChange(activeKey) {
      let query = { activeKey };
      this.$router.push({
        path: "/environmentManage/environmental/earlyWarnInfo",
        query,
      });
    },
  }
}
</script>

<style lang='less' scoped>
</style>