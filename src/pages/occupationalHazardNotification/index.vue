<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <a-tabs v-model="activeKey" @change="tabChange">
      <a-tab-pane key="1" tab="通用版">
        <GenericVersion/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="工序版">
        <ProcessVersion/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import GenericVersion from "./tpl/genericVersion.vue";
import ProcessVersion from "./tpl/processVersion.vue";
export default {
  components: {
    GenericVersion,
    ProcessVersion
  },
  data() {
    return {
      activeKey: '1',
    }
  },
  created() {
    this.setRouterCode("occupationalHazardNotification");
    this.activeKey = this.$route.query.activeKey ? this.$route.query.activeKey + '' : '1'
  },
  methods: {
    // tab切换
    tabChange(activeKey) {
      let query = { activeKey };
      this.$router.push({
        path: "/ehsGerneralManage/securityArchiveManagement/occupationalHazardNotification",
        query,
      });
    },
  }
}
</script>

<style lang='less' scoped>
</style>