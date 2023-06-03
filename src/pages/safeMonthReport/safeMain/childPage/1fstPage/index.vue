<template>
  <div>
    <PageTitle>事故事件</PageTitle>
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="accidentEventAnalyseVo" :cellClassName="cellClassName" :headerCellClassName="headerCellClassName">
        <template v-for="(item, index) in typeColumes">
          <vxe-column v-if="item.dataIndex === 'eventType'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              {{row.title}}
            </template>
          </vxe-column>
          <vxe-column v-else :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span :style="(row[item.dataIndex] && row[item.dataIndex] != '0') && { color: 'red', fontWeight: 'bold' }">{{row[item.dataIndex] ? row[item.dataIndex] : '/'}}</span>
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
    <CommonTable>
      <a-table bordered :columns="columnsDetails" :scroll="{ x: 800 }"  :data-source="accidentEventDetailVo" rowKey="id" :pagination="false">
        <template slot="title">事件详情</template>
        <span slot="showSite" slot-scope="text, record">{{corporationList.find(item=>{ return record.corporationId == item.orgId }).orgName || record.corporationId}}</span>
        <span slot="eventType" slot-scope="text, record">{{record.eventType != 'xjws' ? eventTypeOptions.find(item=>{ return record.eventType == item.dictValue }).dictLabel : '虚惊未遂'}}</span>
      </a-table>
    </CommonTable>
  </div>
</template>

<script>
import { headEventDetail } from '@/services/safeMonth'
import dictionary from '@/utils/newDictionary'
export default {
  props: {
    searchData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      typeColumes: [
        
      ],
      columnsDetails: [
        {
          title: '现地',
          dataIndex: 'corporationId',
          key: "corporationId",
          width: 180,
          scopedSlots: { customRender: "showSite" },
        },
        {
          title: '事件类型',
          dataIndex: 'eventType',
          key: "eventType",
          scopedSlots: { customRender: "eventType" },
        },
        {
          title: '事件时间',
          dataIndex: 'eventTime',
          key: "eventTime",
        },
        {
          title: '事件经过',
          dataIndex: 'through',
          key: "through",
        },
        {
          title: '事件损失',
          dataIndex: 'loss',
          key: "loss",
        },
        {
          title: '原因分析',
          dataIndex: 'reason',
          key: "reason",
        },
        {
          title: '改善对策',
          dataIndex: 'measure',
          key: "measure",
        },
      ],
      // 事件详情
      accidentEventDetailVo: [],
      // 事件类型
      accidentEventAnalyseVo: [],
    }
  },
  computed: {
    // 事故类型
    eventTypeOptions() {
      let arr = dictionary('accident_type');
      if(arr && arr.length > 1 && arr[0].dictValue == 'xjws') {
        return arr
      } else {
        arr.unshift({ 
          dictLabel: "虚惊未遂",
          dictValue: "xjws"
        })
        return arr
      }
    },
    // 组织现地机构
    corporationList() {
      return this.getCommonAddOrgnizeListAll
      // return this.$store.state.setting.commonAddOrgnizeListAll
    },
  },
  mounted() {
    this.searchTable();
  },
  methods: {
    headerCellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (!['eventType'].includes(column.property)) {
        return 'normal-th'
      }
      return ''
    },
    cellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (['eventType'].includes(column.property)) {
        return 'bold-td'
      }
      return ''
    },
    async searchTable() {
      const { data } = await headEventDetail(this.searchData);
      if(data) {
        this.accidentEventDetailVo = data.accidentEventDetailVo || [];
        this.typeColumes = this.corporationList.map( item => {
          return {
            title: item.orgName,
            dataIndex: item.orgId,
            width: 80,
            align: 'center'
          }
        })
        this.typeColumes.unshift({
          title: '事件类型',
          dataIndex: 'eventType',
          width: 160,
          align: 'center',
        })
        this.accidentEventAnalyseVo = this.eventTypeOptions.map( item => {
          let mapIndex = {
            title: item.dictLabel,
            titleIndex: item.dictValue,
            width: 80,
            align: 'center'
          }
          if(!data.accidentEventAnalyseVo){
            this.accidentEventAnalyseVo = [];
          } else {
            data.accidentEventAnalyseVo.map( dataItem => {
              if(dataItem.eventType == mapIndex.titleIndex) {
                mapIndex[dataItem.corporationId] = dataItem.quantity
              }
            })
          }
          return mapIndex
        });
      } else {
        this.accidentEventDetailVo = [];
        this.accidentEventAnalyseVo = [];
      }
    },
  }
}
</script>

<style>

</style>