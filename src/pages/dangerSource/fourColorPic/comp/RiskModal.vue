<template>
  <!-- 选择危险源抽屉 -->
    <CommonDrawer title="选择风险点" :visible="visible" :cancelFn="cancelFn" :width="'90vw'" :zIndex="2000">
      <template>
        <RiskList ref="riskListRef"/>
      </template>
      <template slot="btn">
        <a-button type="dashed" @click="cancelFn">取消</a-button>
        <a-button type="primary" style="margin-left: 0.2rem" @click="onSubmitDrawer">确定</a-button>
      </template>
    </CommonDrawer>
</template>
<script>
import RiskList from './RiskList'
export default {
  components: { RiskList },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  created() {
  },
  methods: {
    cancelFn() {
      this.$refs.riskListRef && this.$refs.riskListRef.cancelSelect()
      this.$emit('update:visible', false)
    },
    onSubmitDrawer() {
      const data = this.$refs.riskListRef.getSelectData() || []
      if (data && data.length) {
        this.$emit('onSubmitRiskData', data[0])
        this.$emit('update:visible', false)
        this.$refs.riskListRef && this.$refs.riskListRef.cancelSelect()
      }
    },
    
  },
};
</script>

<style scoped lang='less'>
/deep/.ant-form-item{
  min-width: 300px;
}
/deep/.ant-form-item-control{
  left:76px;
}
</style>
