<template>
  <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
    <a-table
      bordered
      :columns="columns"
      :scroll="{ x: 800 }"
      :locale="{emptyText: emptyText}"
      :data-source="dataList"
      :rowKey="(record, index)=>{return index}"
      :pagination="false"
    >
      <template slot="person" slot-scope="record">
        {{record.draftPersonName}}/{{record.draftPersonJobNumber}}
      </template>
      <div slot="action" slot-scope="record">
        <span class="color-0067cc cursor-pointer" @click="previewScoring(record.proposalId)">查看</span>
      </div>
    </a-table>
  </CommonTable>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import dictionary from "@/utils/dictionary.js";
export default {
  mixins: [teableCenterEllipsis],
  props: {
    tabKey: {
      type: String,
      default: '1'
    },
    dataSource: {
      type: Object,
      default:()=>{}
    },
    tableSpinning:{
      default:false
    }
  },
  watch: {
    dataSource: {
      handler(val) {
        if(val && val.list && val.list.length>=1) {
          this.dataList = val.list;
          this.page.total = val.total;
        } else {
          this.dataList = [];
          this.page.total = 0;
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
      {
          title: '提案编号',
          dataIndex: 'proposalCode',
          key: "proposalCode",
          width: 210
        },
        {
          title: '提案人',
          scopedSlots: { customRender: 'person' },
          width: 200
        },
        {
          title: '提案名称',
          dataIndex: 'proposalName',
          key: "proposalName",
          width: 200
        },
        {
          title: '提案级别',
          dataIndex: 'proposalLevel',
          customRender: (text,record) => {
            return record.proposalLevel ? dictionary('proposalLevel', record.proposalLevel) : "--";
          },
          width: 200
        },
        {
          title: '分档',
          dataIndex: 'proposalGrade',
          customRender: (text,record) => {
            return record.proposalGrade ? dictionary('proposalGrade', record.proposalGrade) : "--";
          },
          width: 200
        },
        {
          title: '状态',
          dataIndex: 'approvalStatus',
          key: "approvalStatus",
          customRender: (text, record, index) => {
            return text==1 ? '评审中' : text==2 ?'评审完成' : '--';
          },
          width: 200
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        },
      ],
      dataList: [],
    }
  },
  created() {
    this.columns.splice(1, 0, this.addCommonColumnItem(150))
    this.columns.splice(3, 0, this.addCommonColumnDepartment({
      width: 150,
      key:'deptId',
      title: "部门"
    }))
  },
  methods: {
    // 查看
    previewScoring(proposalId) {
      this.$router.push({path:"/safeManage/securityThinkTank/improveProposalManagement/previewProposalDatabase",query:{proposalId}})
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      this.$emit('getPage',this.page);
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.$emit('getPage',this.page);
    },
  }
}
</script>

<style>

</style>