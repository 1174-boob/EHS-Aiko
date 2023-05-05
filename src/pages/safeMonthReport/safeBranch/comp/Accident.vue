<!--事故事件分析--> 
<template>
  <div class="accident-container">
    <h3><i></i>事件类型</h3>
    <CommonTable>
      <!-- <a-table bordered :columns="typeColumes" :scroll="{ x: 1000 }" :locale="{emptyText: ''}" :data-source="typeTableData" :rowKey="(record, index)=>{return index}" :pagination="false">
      </a-table> -->
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border
        show-header-overflow show-overflow align="center" :row-config="{isHover: true}" 
        :data="typeTableData" :cellClassName="cellClassName" :headerCellClassName="headerCellClassName">
        <template v-for="(item, index) in typeColumes">
          <vxe-column :key="item.dataIndex + index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span :class="[+row[item.dataIndex] > 0 ? 'danger-number' : '']">{{ row[item.dataIndex] }}</span>
            </template>
          </vxe-column>
        </template>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </CommonTable>
    <h3><i></i>事件详情</h3>
    <CommonTable>
      <!-- <a-table bordered :columns="detailColumes" :scroll="{ x: 1000 }" :locale="{emptyText: ''}" :data-source="detailTableData" :rowKey="(record, index)=>{return index}" :pagination="false">
      </a-table> -->
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="detailTableData">
        <template v-for="(item, index) in detailColumes">
          <vxe-column :key="item.dataIndex + index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <template v-if="item.dataIndex === 'eventType'">
                <span v-if="row.eventType === 'xjws'">虚惊未遂</span>
                <span v-else>{{row.eventType | userFilter('accident_type')}}</span>
              </template>
              <span v-else>{{row[item.dataIndex]}}</span>
            </template>
          </vxe-column>
        </template>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </CommonTable>
  </div>
</template>

<script>
import dictionary from '@/utils/newDictionary'
import { monthEventDetail } from '@/services/safeMonth'
import { cloneDeep } from 'lodash'
import mixin from '../mixin'
export default {
  mixins: [mixin],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    date: {
      type: Object,
      default: () => {}
    },
    para: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    console.log('accident mounted')
  },
  data() {
    return {
      typeTableData: [],
      detailTableData: [],
      accidentEventAnalyseVo: [],
      typeColumes: [

      ],
      detailColumes: [
        {
          title: '事件类型',
          dataIndex: 'eventType',
          width: 200,
          align: 'center'
        },
        {
          title: '事件时间',
          dataIndex: 'eventTime',
          width: 200,
          align: 'center'
        },
        {
          title: '事件经过',
          dataIndex: 'through',
          width: 200,
          align: 'center'
        },
        {
          title: '事件损失',
          dataIndex: 'loss',
          width: 200,
          align: 'center'
        },
        {
          title: '原因分析',
          dataIndex: 'reason',
          width: 200,
          align: 'center'
        },
        {
          title: '整改措施',
          dataIndex: 'measure',
          width: 200,
          align: 'center'
        },
      ]
    }
  },
  computed: {
    eventTypeOptions() {
      return dictionary('accident_type')
    }
  },
  methods: {
    findEventNameById(eventType) {
      return (this.eventTypeOptions.find(item => {
        return item.dictValue === eventType
      }) || {}).dictLabel
    },
    checkIsChanged() {
      return false
    },
    async fetchData(para) {
      para = { ...this.para }
      const { data } = await monthEventDetail(para)
      if (data) {
        this.detailTableData = data.accidentEventDetailVo || []
        this.accidentEventAnalyseVo = data.accidentEventAnalyseVo || []
        this.typeColumes = data.accidentEventAnalyseVo.map( item => {
          let title = ''
          if ( item.eventType === 'xjws' ) {
            title = '虚惊未遂'
          } else { 
            title = this.findEventNameById(item.eventType)
          }
          return {
            title: title,
            dataIndex: item.eventType,
            width: 200,
            align: 'center'
          }
        })
        this.typeColumes.unshift({
          title: '事件类型',
          dataIndex: 'eventType',
          width: 200,
          align: 'center'
        })
        this.swap()//虚惊未遂放第二列
        let typeTableData = data.accidentEventAnalyseVo.reduce((prev,item) => {
          prev[item.eventType] = item.quantity
          prev.id = item.id
          prev.reportDate = item.reportDate
          return prev
        },{})
        typeTableData.eventType = '数量'
        this.typeTableData = [typeTableData]
      }
    },
    swap() {
      let index = this.typeColumes.findIndex(item => {
        return item.dataIndex === 'xjws'
      })
      if (index !== 1 && index !== -1) {
        let temp = cloneDeep(this.typeColumes[1])
        this.typeColumes[1] = cloneDeep(this.typeColumes[index])
        this.typeColumes[index] = temp
      }
    },
    cellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (['eventType'].includes(column.property)) {
        return 'bold-td'
      }
      return ''
    },
    
    headerCellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (!['eventType'].includes(column.property)) {
        return 'normal-th'
      }
      return ''
    },
  }
}
</script>

<style scoped lang="less">
/deep/.normal-th.vxe-header--column > .vxe-cell .vxe-cell--title{
  font-weight: 300;
}
/deep/.bold-td.vxe-header--column {
  font-weight: 500;
  color:#000;
}
.danger-number{
  color: #f00;
  font-weight: bold;
}
</style>