<!--EHS培训报告--> 
<template>
  <div>
    <DashBtn v-if="!disabled">
      <div>
        <a-button type="primary" @click="onSave">保存</a-button>
      </div>
    </DashBtn>
    <h3><i></i>EHS培训报告</h3>
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" :cellClassName="cellClassName" :headerCellClassName="headerCellClassName"
      border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableData">
        <template v-for="(item) in columes">
          <vxe-column :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span v-if="item.dataIndex === 'passPercent'">{{ row[item.dataIndex] }}</span>
              <a-input v-else-if="!disabled" disabled @change="handleChange" @blur="handleNumberBlur(row)" class="editable-input" v-model="row[item.dataIndex]" :maxLength="30"></a-input>
              <span v-else>{{ row[item.dataIndex] }}</span>
            </template>
          </vxe-column>
        </template>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
      <!-- <a-table bordered :columns="columes" :scroll="{ x: 1000 }" :locale="{emptyText: ''}" :data-source="tableData" :rowKey="(record, index)=>{return index}" :pagination="false">
      </a-table> -->
    </CommonTable>
  </div>
</template>

<script>
import mixin from '../mixin'
import { staffTrainDetail, staffTrainSave } from '@/services/safeMonth'
import moment from 'moment'
import {  debounce, cloneDeep } from 'lodash'
export default {
  mixins: [mixin],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    para: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      columes: [
        {
          title: '培训类别',
          dataIndex: 'trainType',
          width: 200,
          align: 'center'
        },
        {
          title: '培训人数',
          dataIndex: 'trainNum',
          width: 200,
          align: 'center'
        },
        {
          title: '考核方式',
          dataIndex: 'inspectionWay',
          width: 200,
          align: 'center'
        },
        {
          title: '合格人数',
          dataIndex: 'qualifyNum',
          width: 200,
          align: 'center'
        },
        {
          title: '合格率',
          dataIndex: 'passPercent',
          width: 200,
          align: 'center'
        },
      ],
      tableData: []
    }
  },
  methods: {
    onSave: debounce(function () {
      if (!this.validate()) {
        return
      }
      let para = {
        reportDate: moment(this.para.reportDate).format('YYYY-MM'),
        corporationId: this.para.corporationId,
        centerId: this.para.centerId
      }
      para.staffTrainVoList = this.tableData
      staffTrainSave(para)
      this.isChanged = false
      this.$antMessage.success('保存成功')
    }, 250),
    handleNumberBlur(row) {
      if (row.trainNum && row.qualifyNum) {
        row.passPercent = ((row.qualifyNum / row.trainNum) * 100).toFixed(2) + '%'
      }
    },
    cellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (!['passPercent'].includes(column.property)) {
        return 'editable-td'
      }
      return ''
    },
    
    headerCellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (!['passPercent'].includes(column.property)) {
        return 'required'
      }
      return ''
    },
    async fetchData(para) {
      para = { ...this.para }
      const { data } = await staffTrainDetail(para)
      this.tableData = data || []
    },
    validate() {
      let trainTypeEmpty = false
      let trainNumEmpty = false
      let inspectionWayEmpty = false
      let qualifyNumEmpty = false
      this.tableData.forEach(item => {
        if (this.isEmpty(item.trainType)) {
          trainTypeEmpty = true
        } else if (this.isEmpty(item.trainNum)) {
          trainNumEmpty = true
        } else if (this.isEmpty(item.inspectionWay)) {
          inspectionWayEmpty = true
        } else if (this.isEmpty(item.qualifyNum)) {
          qualifyNumEmpty = true
        }
      })
      if (trainTypeEmpty) {
        this.$antMessage.warn('请输入EHS培训报告 培训类别')
        return false
      }
      if (trainNumEmpty) {
        this.$antMessage.warn('请输入EHS培训报告 培训人数')
        return false
      }
      if (inspectionWayEmpty) {
        this.$antMessage.warn('请输入EHS培训报告 考核方式')
        return false
      }
      if (qualifyNumEmpty) {
        this.$antMessage.warn('请输入EHS培训报告 合格人数')
        return false
      }
      return true
    },
  }
}
</script>

<style>

</style>