<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <a-tabs v-model="activeKey">
      <a-tab-pane key="1" tab="火灾报警系统">
        <FireAlarm></FireAlarm>
      </a-tab-pane>
      <a-tab-pane key="2" tab="特气报警系统">
        <SpecialGasAlarm></SpecialGasAlarm>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import FireAlarm from "@/pages/networkControl/errorRecording/tpl/fireAlarm.vue";
import SpecialGasAlarm from "@/pages/networkControl/errorRecording/tpl/specialGasAlarm.vue";
export default {
  components: {
    FireAlarm,
    SpecialGasAlarm
  },
  data() {
    return {
      activeKey: '1',
    }
  },
  created() {
  },
  // methods: {
  //   handleChange(key) {
  //     if (key == 1) {
  //       this.activeFlag = false;
  //     }
  //   }
  // }
}
</script>

<style lang='less' scoped>
</style>