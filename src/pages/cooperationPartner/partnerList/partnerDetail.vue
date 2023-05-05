<template>
  <div class="parter-detail">
    <PageTitle>详情</PageTitle>
    <div class="partner-title" v-if="partner==1">供应商基本信息</div>
    <a-row v-if="partnerInfo">
      <a-col :span="12">
        <p class="pd-b-16 m-b-0">供应商名称: {{partnerInfo.companyName}}</p>
        <p class="pd-b-16 m-b-0">人员总数: 20</p>
      </a-col>
      <a-col :span="12">
        <p class="pd-b-16 m-b-0">供应商简称: {{partnerInfo.companyAbbreviation}}</p>
      </a-col>
    </a-row>
    <div class="partner-title">关联信息</div>
    <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table :columns="columns" :scroll="{ x: tableScrollX() }" :locale="{emptyText: emptyText}" :data-source="dataSource" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="tobear" slot-scope="record">
          {{staffDetailMsg[record.toBear] ? staffDetailMsg[record.toBear].name : record.toBear}}
        </div>
      </a-table>
    </CommonTable>
    <FixedBottom>
      <a-button :style="{ marginLeft: '8px' }" @click="back">返回</a-button>
    </FixedBottom>
  </div>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom";
import { InvitationDetail, invitationSupplieDetail, invitationClientDetail } from "@/services/api.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import SelfTable from "@/pages/ngform/tpl/selfTable.vue";

export default {
  name: 'parter-detail',
  components: { FixedBottom, SelfTable },
  mixins: [teableCenterEllipsis],
  data() {
    return {
      partnerInfo: null,
      partner: null,
      columns: [
        {
          title: '所属部门',
          dataIndex: 'departmentName',
          width: 150
        },
        {
          title: '所属担当',
          scopedSlots: { customRender: "tobear" },
          width: 150
        },
        {
          title: '曾经入场现地',
          dataIndex: 'onceEnteredSite',
          width: 150
        },
        {
          title: '作业内容',
          dataIndex: 'jobContent',
          width: 150
        },
        {
          title: '安全协议合同号',
          dataIndex: 'contractNo',
          width: 150
        },
        {
          title: '安全协议到期日',
          dataIndex: 'contractExpirationDate',
          width: 150
        },
        {
          title: '厂商负责人',
          dataIndex: 'supplierDirector',
          width: 150
        },
        {
          title: '厂商负责人电话',
          dataIndex: 'supplierDirectorPhone',
          width: 150
        },
        {
          title: '厂商安全负责人',
          dataIndex: 'supplierSafeDirector',
          width: 150
        },
        {
          title: '厂商安全负责人电话',
          dataIndex: 'supplierSafeDirectorPhone',
          minWidth: 150
        }
      ],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      dataSource: [],
      templateData: undefined,
      tableDataList: [],
      dataListLoading: false,
      departmentName: undefined,
      toBear: undefined,
      showList: [],
      fromId: undefined,
      staffDetailMsg: {},
    }
  },
  created() {
    if (this.$route.query && this.$route.query.id) {
      this.partner = this.$route.query.partner;
      // 获取供应商基本信息
      this.initPage(this.$route.query.id);
      // 获取关联信息数据
      this.getInvitationSupplieDetail();
    }
  },
  methods: {
    // 获取详情
    initPage(id) {
      this.dataListLoading = true;
      InvitationDetail({ invitationId: id }).then(res => {
        let resultObj = res.data || {};
        if (this.partner == 1) {
          this.partnerInfo = resultObj;
        } else {
          this.partnerInfo = null
        }
        this.departmentName = resultObj.departmentName;
        this.toBear = resultObj.toBear;
        this.fromId = resultObj.fromId;
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.dataListLoading = false;
      })
    },
    // 获取关联信息数据
    getInvitationSupplieDetail() {
      let params = { 
        corporationId: this.$route.query.corporationId,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      }
      let promiseFn;
      if (this.partner == 1) { // 我的供应商
        promiseFn = invitationSupplieDetail;
        params.companyCode = this.$route.query.companyId;
      } else if (this.partner == 2) { // 我的客户
        promiseFn = invitationClientDetail;
        params.companyId = this.$route.query.companyId;
      }
      promiseFn(params).then(res => {
        const data = res.data || {};
        this.dataSource = data.list || [];
        this.page.total = data.total;
        let arr = [];
        for (let i = 0; i < this.dataSource.length; i++) {
          if (this.dataSource[i].toBear) {
            arr.push(this.dataSource[i].toBear)
          }
        }
        if (arr.length > 0) {
          this.getUserAndJobNumber([...new Set(arr)]).then(res=>{ // 全局方法
            let obj = res || {};
            this.staffDetailMsg = obj;
          }).catch(err=>{
            console.log(err);
          })
        }
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.dataListLoading = false;
      })
    },
    // 返回
    back() {
      this.setKeepalive(true)
      this.$router.go(-1)
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      this.getInvitationSupplieDetail();
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getInvitationSupplieDetail();
    },
  },

}
</script>

<style lang='less' scoped>
.parter-detail {
  width: 100%;
  .partner-title {
    font-size: 14px;
    font-weight: bold;
    padding: 10px 0 20px;
  }
}
</style>