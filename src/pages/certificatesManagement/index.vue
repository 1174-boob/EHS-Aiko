<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <a-tabs v-model="activeKey" @change="tabChange">
      <a-tab-pane key="1" tab="内部员工">
        <InternalEmployees/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="外部员工">
        <ExternalEmployees/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import InternalEmployees from "./tpl/internalEmployees.vue";
import ExternalEmployees from "./tpl/externalEmployees.vue";
export default {
  components: {
    InternalEmployees,
    ExternalEmployees
  },
  data() {
    return {
      activeKey: '1',
    }
  },
  created() {
    this.setRouterCode("certificatesManagement");
    this.activeKey = this.$route.query.activeKey ? this.$route.query.activeKey + '' : '1'
  },
  methods: {
    // tab切换
    tabChange(activeKey) {
      let query = { activeKey };
      this.$router.push({
        path: "/ehsGerneralManage/securityArchiveManagement/certificatesManagement",
        query,
      });
    },
  }
}
</script>

<style lang='less' scoped>
</style>