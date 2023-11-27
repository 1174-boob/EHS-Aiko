<!--职业健康管理--> 
<template>
  <div>
    <h3><i></i>职业健康管理</h3>
    <CommonTable>
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

    <h3><i></i>职业禁忌人员</h3>
    <CommonTable>
      <a-table
        bordered
        :columns="columns"
        :scroll="{ x: 800 }"
        :data-source="contrainList"
        :rowKey="(record, index)=>{return index}"
        :pagination="false"
      >
      </a-table>
    </CommonTable>

    <h3><i></i>禁忌调岗</h3>
    <CommonTable>
      <a-table
        bordered
        :columns="columns"
        :scroll="{ x: 800 }"
        :data-source="tabooList"
        :rowKey="(record, index)=>{return index}"
        :pagination="false"
      >
      </a-table>
    </CommonTable>
    <p class="tip-p">备注：如有确诊职业病的须立即上报</p>
  </div>
</template>

<script>
import { occupationHealthDetail, contrainHealthStaffDetail, tabooHealthStaffDetail } from '@/services/safeMonth'
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
      columns: [
        {
          title: '人员名称',
          dataIndex: 'name',
          key: "name",
        },
        {
          title: '工号',
          dataIndex: 'workNum',
          key: "workNum",
        },
        {
          title: '危害因素',
          dataIndex: 'hazardFactors',
          key: "hazardFactors",
        },
        {
          title: '岗位名称',
          dataIndex: 'postName',
          key: "postName",
        },
        {
          title: '部门名称',
          dataIndex: 'deptName',
          key: "deptName",
        },
        {
          title: '组织名称',
          dataIndex: 'corporationName',
          key: "corporationName",
        }
      ],
      contrainList: [],
      tabooList: [],
      Cpage: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      Tpage: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
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
      this.contrainHealthStaffDetail(para);
      this.tabooHealthStaffDetail(para);
    },
    async contrainHealthStaffDetail(para) {
      const { data } = await contrainHealthStaffDetail({pageNo: this.Cpage.pageNo, pageSize: this.Cpage.pageSize, ...para});
      console.log(data, '??1')
      if(data) {
        this.contrainList = data.staffList || [];
      } else {
        this.contrainList = [];
      }
    },
    async tabooHealthStaffDetail(para) {
      const { data } = await tabooHealthStaffDetail({pageNo: this.Tpage.pageNo, pageSize: this.Tpage.pageSize, ...para});
      console.log(data, '??2')
      if(data) {
        this.tabooList = data.staffList || [];
      } else {
        this.tabooList = [];
      }
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