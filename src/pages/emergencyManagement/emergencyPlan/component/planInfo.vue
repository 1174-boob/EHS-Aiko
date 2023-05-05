<template>
  <div class="plan-info">
    <a-row class="m-t-20">
      <a-col :span="12">
        <a-form-model-item label="所属组织" :label-col="labelCol" :wrapper-col="wrapperCol">
          <div>{{detailObj.corporationName}}</div>
        </a-form-model-item>
        <a-form-model-item label="起草人" :label-col="labelCol" :wrapper-col="wrapperCol">
          <div>{{detailObj.draft}}</div>
        </a-form-model-item>
        <a-form-model-item label="应急演练名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <div>{{detailObj.drillName}}</div>
        </a-form-model-item>
        <a-form-model-item label="应急演练类型" :label-col="labelCol" :wrapper-col="wrapperCol">
          <div>{{detailObj.drillTypeCode}}</div>
        </a-form-model-item>
        <a-form-model-item label="演练计划时间" :label-col="labelCol" :wrapper-col="wrapperCol">
          <div>{{detailObj.planTime}}</div>
        </a-form-model-item>
        <a-form-model-item label="参演内部部门" :label-col="labelCol" :wrapper-col="wrapperCol">
          <div>{{detailObj.innerDepartName}}</div>
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="起草人部门" :label-col="labelCol" :wrapper-col="wrapperCol">
          <div>{{detailObj.draftDepartName}}</div>
        </a-form-model-item>
        <a-form-model-item label="计划所属部门" :label-col="labelCol" :wrapper-col="wrapperCol">
          <div>{{detailObj.planDepartName}}</div>
        </a-form-model-item>
        <a-form-model-item label="应急演练级别" :label-col="labelCol" :wrapper-col="wrapperCol">
          <div>{{detailObj.drillLevel}}</div>
        </a-form-model-item>
        <a-form-model-item label="应急演练形式" :label-col="labelCol" :wrapper-col="wrapperCol">
          <div>{{detailObj.drillForm}}</div>
        </a-form-model-item>
        <a-form-model-item label="应急预案" :label-col="labelCol" :wrapper-col="wrapperCol">
          <div>{{detailObj.temergentdrillPrep?detailObj.temergentdrillPrep.eplanName:''}}</div>
        </a-form-model-item>
        <a-form-model-item label="参演外部单位" :label-col="labelCol" :wrapper-col="wrapperCol">
          <div>{{detailObj.outDepart}}</div>
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  props: {
    detailObj: {
      type: Object,
      default: ()=>{},
    }
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
    }
  }

}
</script>

<style lang="less" scoped>
.plan-info {
  ::v-deep .ant-form-item {
    padding: unset;
  }
}
</style>