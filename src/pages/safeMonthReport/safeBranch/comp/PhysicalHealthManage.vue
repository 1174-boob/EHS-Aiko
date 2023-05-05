<!--职业健康管理--> 
<template>
  <div>
    <h3><i></i>职业健康管理</h3>
    <CommonTable>
      <!-- <a-table bordered :columns="columes" :scroll="{ x: 1000 }" :locale="{emptyText: ''}" :data-source="tableData" :rowKey="(record, index)=>{return index}" :pagination="false">
      </a-table> -->
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableData">
        <template v-for="(item) in columes">
          <vxe-column v-if="item.dataIndex === 'type'" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template>
              <span>人数</span>
            </template>
          </vxe-column>
          <vxe-column v-else :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
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
    <p class="tip-p">备注：如有确诊职业病的须立即上报</p>
  </div>
</template>

<script>
import { occupationHealthDetail } from '@/services/safeMonth'
import mixin from '../mixin'
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
          title: '类型',
          dataIndex: 'type',
          width: 200,
          align: 'center'
        },
        {
          title: '危害岗位数',
          dataIndex: 'hazardNum',
          width: 200,
          align: 'center'
        },
        {
          title: '接害人数',
          dataIndex: 'exposureHazardNum',
          width: 200,
          align: 'center'
        },
        {
          title: '体检人数',
          dataIndex: 'checkNum',
          width: 200,
          align: 'center'
        },
        {
          title: '体检合格人数',
          dataIndex: 'checkTrueNum',
          width: 200,
          align: 'center'
        },
        {
          title: '体检异常人数',
          dataIndex: 'checkFalseNum',
          width: 200,
          align: 'center'
        },
        {
          title: '职业禁忌人数',
          dataIndex: 'contrainNum',
          width: 200,
          align: 'center'
        },
        {
          title: '禁忌调岗人数',
          dataIndex: 'tabooNum',
          width: 200,
          align: 'center'
        },
      ],
      tableData: [],
    }
  },
  methods: {
    validate(cb) {
      return true
    },
    checkIsChanged() {
      return false
    },
    async fetchData(para) {
      para = { ...this.para }
      const { data } = await occupationHealthDetail(para)
      this.tableData = data || []
    },
  }
}
</script>

<style scoped lang="less">
p.tip-p{
  margin-top:20px;
}
.danger-number{
  color: #f00;
  font-weight: bold;
}
</style>