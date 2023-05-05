<template>
  <HasFixedBottomWrapper>
    <PageTitle>应急演练报告</PageTitle>
    <a-form-model ref="emForm" :colon="false" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-row class="m-t-20 handle-content">
        <a-col :span="12">
          <a-form-model-item class="flex" label="实际演练时间" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{reportDetail.actualDrillDate}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex" label="实际内部参演部门" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{reportDetail.innerDepart}}</div>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item class="flex" label="参演总人数" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{reportDetail.joinPeopleNum}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex" label="实际外部参演单位" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{reportDetail.outDepart}}</div>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-form-model-item class="flex" label="演练现场照片">
          <upload-can-remove v-if="reportDetail.headImgs.length > 0" :disabled="true" ref="editModel" :maxSize="5" :limit="20" :headImgs="reportDetail.headImgs"></upload-can-remove>
          <div v-else>暂无数据</div>
        </a-form-model-item>
      </a-row>
      <a-row>
        <a-col :span="24">
          <PageTitle>应急演练三个验证</PageTitle>
          <vxe-table
            border
            align="center"
            ref="xTable"
            :span-method="rowspanMethod"
            show-overflow
            :column-config="{resizable: true}"
            :row-config="{height: 60, isHover: true}"
            :data="reportDetail.tableData">
            <vxe-column field="purposeCode" title="演练目的" width="300">
              <template #default="{ row }">
                {{objectiveKey[row.purposeCode]}}
              </template>
            </vxe-column>
            <vxe-column field="summary" title="演练总结">
              <template #default="{ row }">
                <a-input :disabled="true" v-model="row.summary" placeholder="请输入演练总结" allowClear></a-input>
              </template>
            </vxe-column>
            <vxe-column field="betterMeasure" title="改善对策">
              <template #default="{ row }">
                <a-input :disabled="true" v-model="row.betterMeasure" placeholder="请输入改善对策" allowClear></a-input>
              </template>
            </vxe-column>
          </vxe-table>
        </a-col>
      </a-row>
      <a-row>
          <a-col :span="12">
            <a-form-model-item class="flex" label="应急演练报告" prop="file">
              <div v-if="reportDetail.fileLists && reportDetail.fileLists.length == 0">暂无数据</div>
              <div v-else class="file-item cursor-pointer addSuccess " v-for="item in reportDetail.fileLists" :key="item.id" @click="openFile(item.url)">{{item.name}}</div>
            </a-form-model-item>
          </a-col>
        </a-row>
      <!-- <CommonTable>
        <a-table :scroll="{ x: tableScrollX() }" :pagination="false" :data-source="dataSource" :columns="columns" :rowKey="(record, index)=>{return index}"></a-table>
      </CommonTable> -->
    </a-form-model>
    
  </HasFixedBottomWrapper>
</template>

<script>
const rowspanMethod = ({ row, _rowIndex, column, visibleData }) => {
  const fields = ['purposeCode']
  const cellValue = row[column.field]
  if (cellValue && fields.includes(column.field)) {
    const prevRow = visibleData[_rowIndex - 1]
    let nextRow = visibleData[_rowIndex + 1]
    if (prevRow && prevRow[column.field] === cellValue) {
      return { rowspan: 0, colspan: 0 }
    } else {
      let countRowspan = 1
      while (nextRow && nextRow[column.field] === cellValue) {
        nextRow = visibleData[++countRowspan + _rowIndex]
      }
      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 }
      }
    }
  }
}
const objectiveKey = {
  PrepFeasibility: "验证应急预案可行性",
  ReposeSpeedDealAbility: "验证人员应急响应速度和应急处理能力",
  FullReasonable: "验证应急物资充分性与合理性"
}

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import dictionary from '@/utils/dictionary';
import UploadCanRemove from "@/components/upload/uploadCanRemove.vue";

export default {
  components: { UploadCanRemove },
  mixins: [teableCenterEllipsis],
  props: {
    reportDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      labelCol: { style: { width: '150px' } },
      wrapperCol: { style: { width: 'calc(100% - 150px)' } },
      tableData: [],
      objectiveKey: objectiveKey,
      rowspanMethod: rowspanMethod,
      columns: [
        {
          title: '计划编号',
          dataIndex: 'code',
          width: 200
        },
        {
          title: '应急演练名称',
          dataIndex: 'a',
          width: 200
        },
        {
          title: '应急演练类型',
          dataIndex: 'c',
          width: 200
        },
        {
          title: '应急演练形式',
          dataIndex: 'b',
          width: 200
        },
        {
          title: '演练计划时间',
          dataIndex: 'b4',
          width: 200
        },
        {
          title: '参演内部部门',
          dataIndex: 'b3',
          width: 200
        },
        {
          title: '参演外部单位',
          dataIndex: 'b2',
          width: 200
        },
        {
          title: '应急预案',
          dataIndex: 'b1',
          width: 200
        },
      ],
      headImgs: [],
      fileLists: [],
      prepFeasibility: [],
      reposeSpeedDealAbility: [],
      fullReasonable: [],
    }
  },
  methods: {
    // 文件下载
    openFile(filePath) {
      window.open(filePath)
    },
  }
}
</script>

<style scoped lang="less">
.handle-content {
  ::v-deep .ant-form-item {
    padding: unset;
  }
}
.drill-plan {
  display: flex;
  margin-bottom: 20px;
  ::v-deep .dashed-btn {
    margin-left: 20px;
    margin-bottom: 15px;
  }
}
.ant-drawer {
  z-index: 999;
}
</style>