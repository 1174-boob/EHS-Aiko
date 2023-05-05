<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <a-tabs v-model="activeKey" @change="tabChange">
      <a-tab-pane key="1" tab="值班室监控">
        <Monitoring v-if="activeKey == 1"></Monitoring>
      </a-tab-pane>
      <a-tab-pane key="2" tab="排班管理">
        <Pscheduling v-if="activeKey == 2"></Pscheduling>
      </a-tab-pane>
      <a-tab-pane key="3" tab="值班记录管理">
        <RecordDuty v-if="activeKey == 3"></RecordDuty>
      </a-tab-pane>
      <a-tab-pane key="4" tab="值班表管理">
        <ScheduleWork v-if="activeKey == 4"></ScheduleWork>
      </a-tab-pane>
      <a-tab-pane key="5" tab="配置管理">
        <SetSchedule v-if="activeKey == 5"></SetSchedule>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Monitoring from "@/pages/networkControl/dutyManagement/tpl/monitoring.vue";
import Pscheduling from "@/pages/networkControl/dutyManagement/tpl/pscheduling.vue";
import RecordDuty from "@/pages/networkControl/dutyManagement/tpl/recordDuty.vue";
import ScheduleWork from "@/pages/networkControl/dutyManagement/tpl/scheduleWork.vue";
import SetSchedule from "@/pages/networkControl/dutyManagement/tpl/setSchedule.vue";
export default {
  components: {
    Monitoring,
    Pscheduling,
    RecordDuty,
    ScheduleWork,
    SetSchedule,
  },
  data() {
    return {
      activeKey: "1",
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