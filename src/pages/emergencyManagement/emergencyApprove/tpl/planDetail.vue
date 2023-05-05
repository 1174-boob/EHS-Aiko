<template>
  <div>
    <a-form-model ref="emForm" :colon="false" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-row class="">
        <a-col :span="12">
          <a-form-model-item class="flex text-form-item" label="审批单编号" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{planDetail.processNumber}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex text-form-item" label="所属组织" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{planDetail.corporationName}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex text-form-item" label="起草人" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{planDetail.draftName}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex text-form-item" label="起草时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{planDetail.createTime}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex text-form-item" label="申请类型" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{planDetail.applyType}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex text-form-item" label="标题" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{planDetail.title}}</div>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item class="flex text-form-item" label="起草人部门" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{planDetail.draftDepartName}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex text-form-item" label="联系电话" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{planDetail.draftPhone}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex text-form-item" label="结束时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{planDetail.finalOperateTime ? planDetail.finalOperateTime : "--"}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex text-form-item" label="计划所属部门" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{planDetail.planDepartName}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex text-form-item" label="应急演练级别" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{planDetail.drillLevel}}</div>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <PageTitle>应急演练计划列表</PageTitle>
      </a-row>
      <a-row>
        <CommonTable>
          <vxe-table
          resizable
            border
            align="center"
            ref="xTable"
            :auto-resize="true"
            show-overflow
            :column-config="{resizable: true}"
            :row-config="{height: 60, isHover: true}"
            :data="planDetail.planList">
            <vxe-column field="planNumber" title="计划编号"></vxe-column>
            <vxe-column field="drillName" title="应急演练名称"></vxe-column>
            <vxe-column field="drillTypeCode" title="应急演练类型">
              <template #default="{ row }">
                {{getMappingValue(drill_type, "dictValue", row.drillTypeCode).dictLabel}}
              </template>
            </vxe-column>
            <vxe-column field="drillForm" title="应急演练形式">
              <template #default="{ row }">
                {{getMappingValue(emergencyForm, "key", row.drillForm).value}}
              </template>
            </vxe-column>
            <vxe-column field="planTime" title="演练计划时间"></vxe-column>
            <vxe-column field="innerDepartName" title="参演内部部门"></vxe-column>
            <vxe-column field="outDepart" title="参演外部单位"></vxe-column>
            <vxe-column field="temergentdrillPrep" title="应急预案">
              <template #default="{ row }">
                {{row.temergentdrillPrep.eplanName}}
              </template>
            </vxe-column>
          </vxe-table>
        </CommonTable>
      </a-row>
    </a-form-model>
    
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import dictionary from '@/utils/dictionary';
export default {
  mixins: [teableCenterEllipsis],
  props: {
    planDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      labelCol: { style: { width: '150px' } },
      wrapperCol: { style: { width: 'calc(100% - 150px)' } },
      columns: [
        {
          title: '计划编号',
          dataIndex: 'planNumber',
          width: 200
        },
        {
          title: '应急演练名称',
          dataIndex: 'drillName',
          width: 200
        },
        {
          title: '应急演练类型',
          scopedSlots: { customRender: 'drillTypeCode' },
          width: 200
        },
        {
          title: '应急演练形式',
          scopedSlots: { customRender: 'drillForm' },
          width: 200
        },
        {
          title: '演练计划时间',
          dataIndex: 'planTime',
          width: 200
        },
        {
          title: '参演内部部门',
          dataIndex: 'innerDepartName',
          width: 200
        },
        {
          title: '参演外部单位',
          dataIndex: 'outDepart',
          width: 200
        },
        {
          title: '应急预案',
          dataIndex: 'eplanName',
          minWidth: 200
        },
      ],
      emergencyForm: [],
      drill_type: []
    }
  },
  created() {
    this.emergencyForm = dictionary("emergencyForm"); //应急演练形式
    this.drill_type = this.getDictItemList('drill_type'); //应急演练类型
    
  },

}
</script>
