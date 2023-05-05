<template>
  <CommonDrawer title="关联危险源" :visible="dangerSourceDrawer" :cancelFn="closeDrawer" :width="'80vw'">
    <template>
      <a-tabs>
        <a-tab-pane key="1" tab="共性危险源">
          <DangerSourceEqual />
        </a-tab-pane>
        <a-tab-pane key="2" tab="特异性危险源">
          <DangerSourceEqual />
        </a-tab-pane>
      </a-tabs>
    </template>
    <template slot="btn">
      <a-button type="dashed" @click="closeDrawer">取消</a-button>
      <a-button type="primary" style="margin-left: 0.2rem" :loading="loading" @click="onSubmit">确定</a-button>
    </template>
  </CommonDrawer>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import DangerSourceEqual from './dangerSourceEqual.vue'
export default {
  components: { DangerSourceEqual },
  mixins: [cancelLoading,],
  model: {
    prop: 'dangerSourceDrawer',
  },
  props: ['dangerSourceDrawer'],
  data() {
    return {
      selectedRowKeys: [],
      selectedRow: [],
    };
  },
  computed: {

  },
  methods: {
    // 取消-关闭model
    closeDrawer() {
      this.$emit('input', false)
    },
    // 提交
    onSubmit() {

    },
  },
  watch: {
    dangerSourceDrawer(newVal) {
      if (newVal) {

      } else {
        setTimeout(() => {
        }, 100);
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
