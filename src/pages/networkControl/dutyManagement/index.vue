<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <a-tabs v-model="activeKey" @change="tabChange">
      <a-tab-pane key="2" tab="排班管理">
        <Pscheduling v-if="activeKey == 2"></Pscheduling>
      </a-tab-pane>
      <a-tab-pane key="3" tab="值班记录管理">
        <RecordDuty v-if="activeKey == 3"></RecordDuty>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Pscheduling from "@/pages/networkControl/dutyManagement/tpl/pscheduling.vue";
import RecordDuty from "@/pages/networkControl/dutyManagement/tpl/recordDuty.vue";
export default {
  components: {
    Pscheduling,
    RecordDuty,
  },
  data() {
    return {
      activeKey: "2",
    };
  },
  created() {
    this.setRouterCode("dutyManagement");
  },
  methods: {
    tabChange(key) {
      this.activeKey = key;
      console.log(key, "..key");
    },
  },
};
</script>

<style lang='less' scoped>
</style>