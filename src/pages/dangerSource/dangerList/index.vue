<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <a-tabs v-model="activeKey" @change="handleChange">
      <a-tab-pane key="1" tab="共性危险源">
        <Common></Common>
      </a-tab-pane>
      <a-tab-pane key="2" tab="特异性危险源">
        <Specificity></Specificity>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Common from "@/pages/dangerSource/dangerList/tpl/common.vue";
import Specificity from "@/pages/dangerSource/dangerList/tpl/specificity.vue";
export default {
  components: {
    Common,
    Specificity
  },
  data() {
    return {
      activeKey: '1',
    }
  },
  created() {
    this.setRouterCode('dangerList')
  },
  methods: {
    handleChange(key) {
      if (key == 1) {
        this.activeFlag = false;
      }
    }
  }
}
</script>

<style lang='less' scoped>
</style>