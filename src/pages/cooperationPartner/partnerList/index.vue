<template>
  <!-- 邀请列表 -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>合作伙伴列表</PageTitle>
    <div class="card-container">
      <a-tabs v-model="activeKey" @change="tabChange">
        <a-tab-pane key="1" tab="我的供应商">
          <SearchTerm>
            <a-form-model layout="inline" :model="formInline" :colon="false">
              <CommonDept ref="commonDept" :CommonFormInline="formInline"></CommonDept>
              <a-form-model-item label="公司全称">
                <a-input v-model="formInline.name" placeholder="公司全称模糊搜索" allowClear></a-input>
              </a-form-model-item>
              <a-form-model-item class="float-right">
                <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
                <a-button @click="iRest">重置</a-button>
              </a-form-model-item>
            </a-form-model>
          </SearchTerm>
          <!-- 字典组列表 -->
          <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
            <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="invitationList" :rowKey="(record, index)=>{return index}" :pagination="false">
              <div slot="customTitle">操作</div>
              <div slot="action" slot-scope="record">
                <span class="color-0067cc cursor-pointer" @click="action(record,1)">详情</span>
                <span class="color-0067cc cursor-pointer" @click="actionDispatchDetail(record)">查看派工</span>
                <span class="color-0067cc cursor-pointer" @click="actionPunishmentRecord1(record, 'companyCode')">处罚记录</span>
                <span class="color-0067cc cursor-pointer" v-if="record.approvalStatus == 1" @click="actionApprovalRecord(record)">审批记录</span>
              </div>
            </a-table>
          </CommonTable>
        </a-tab-pane>
        <a-tab-pane key="2" tab="我的客户">
          <SearchTerm>
            <a-form-model layout="inline" :model="clientForm" :colon="false">
              <a-form-model-item label="公司全称">
                <a-input v-model="clientForm.name" placeholder="公司全称模糊搜索" allowClear></a-input>
              </a-form-model-item>
              <a-form-model-item class="float-right">
                <a-button type="primary" :loading="loading" @click="clientSearch">查询</a-button>
                <a-button @click="clientRest">重置</a-button>
              </a-form-model-item>
            </a-form-model>
          </SearchTerm>
          <CommonTable :spinning="tableSpinningClient" :page="clientPage" :pageNoChange="clientPageChange" :showSizeChange="clientSizeChange">
            <a-table :columns="clientColumns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="clientList" :rowKey="(record, index)=>{return index}" :pagination="false">
              <div slot="action" slot-scope="record">
                <span class="color-0067cc cursor-pointer m-r-15" @click="actionDispatch(record,2)">派工</span>
                <span class="color-0067cc cursor-pointer m-r-15" @click="action(record,2)">详情</span>
                <span class="color-0067cc cursor-pointer" @click="actionPunishmentRecord2(record, 'companyId', true)">处罚记录</span>
              </div>
            </a-table>
          </CommonTable>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import dragTable from "@/mixin/dragTable.js";
import { debounce } from 'lodash';
import { InvitationSupplier, InvitationClient } from "@/services/api.js";

export default {
  mixins: [teableCenterEllipsis, cancelLoading, dragTable],
  data() {
    return {
      tableSpinning:false,
      tableSpinningClient:false,
      activeKey:'1',
      gData: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      clientPage: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formInline: {
        name: '',
      },
      clientForm: {
        name: '',
      },
      searchFormData: {},
      clientFormData: {},
      columns: [
        {
          title: '编号',
          dataIndex: 'invitationId',
          key: "invitationId",
          // width: 200
        },
        {
          title: '供应商名称',
          dataIndex: 'companyName',
          key: "companyName",
          // width: 200
        },
        {
          title: '供应商简称',
          dataIndex: 'companyAbbreviation',
          key: "companyAbbreviation",
          // width: 200
        },
        {
          slots: { title: 'customTitle' },
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right', // 固定操作列
          width: 300 // 宽度根据操作自定义设置
        }
      ],
      clientColumns: [
        {
          title: '编号',
          dataIndex: 'invitationId',
          key: "invitationId",
          align: 'center',
          ellipsis: true,
          // width: 200
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
          key: "customerName",
          align: 'center',
          ellipsis: true,
          // width: 200
        },
        {
          title: '客户简称',
          dataIndex: 'customerAbbreviation',
          key: "customerAbbreviation",
          align: 'center',
          ellipsis: true,
          // width: 200
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          ellipsis: true,
          key: "action",
          fixed: 'right', // 固定操作列
          width: 300 // 宽度根据操作自定义设置
        }
      ],
      invitationList: [],
      clientList: [],
    }
  },
  created() {
    this.setRouterCode("partnerList");
    this.columns.splice(1, 0, this.addCommonColumnItem(200));
    this.clientColumns.splice(3, 0, this.addCommonColumnItem(200, true));
    this.getInvitationSupplier();
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        if(this.activeKey == 1){
          this.getInvitationSupplier();
        }else{
          this.getInvitationClient();
        }
      }
    }, 20);
  },
  methods: {
    // tab切换
    tabChange(key) {
      if (key == 1) {
        this.getInvitationSupplier();
      } else {
        this.getInvitationClient();
      }
    },
    // 我的供应商列表
    getInvitationSupplier(searchFormData = this.searchFormData) {
      const params = {
        ...searchFormData,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      }
      this.tableSpinning = true
      InvitationSupplier(params).then(res => {
        this.cancelLoading(100);
        this.invitationList = res.data.list;
        this.page.total = res.data.total;
      }).catch(err => {
        console.log(err);
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    // 我的客户列表
    getInvitationClient(clientFormData = this.clientFormData) {
      const params = {
        ...clientFormData,
        pageSize: this.clientPage.pageSize,
        pageNo: this.clientPage.pageNo,
      }
      this.tableSpinningClient = true
      InvitationClient(params).then(res => {
        this.cancelLoading(100);
        this.clientList = res.data.list;
        this.clientPage.total = res.data.total;
      }).catch(err => {
        console.log(err);
      })
      .finally(()=>{
        this.tableSpinningClient = false
      })
    },
    // 操作
    action(record, partner) {
      let companyId = record.companyId
      if (partner == 1) {
        companyId = record.companyCode;
      }
      this.$router.push({ path: '/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/partnerDetail', query: { id: record.invitationId, partner, companyId, corporationId: record.corporationId } })
    },
    // 派工
    actionDispatch(record) {
      let query = {
        companyId: record.companyId,
        customerName: record.customerName,
        corporationId: record.corporationId,
        corporationName: record.corporationName,
      }
      this.$router.push({
        path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/dispatch",
        query: query
      });
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getInvitationSupplier();
    },
    // 我的客户页码改变
    clientPageChange(page) {
      this.clientPage.pageNo = page;
      // 获取列表
      this.getInvitationClient();
    },
    // 我的供应商每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getInvitationSupplier();

    },
    // 我的客户每页展示条数改变
    clientSizeChange(page, pageSize) {
      this.clientPage.pageNo = 1;
      this.clientPage.pageSize = pageSize;
      this.getInvitationClient();
    },
    // 查询
    iSearch() {
      this.searchFormData = JSON.parse(JSON.stringify(this.formInline))
      this.handleLoading();
      this.getInvitationSupplier();
    },
    // 我的客户查询
    clientSearch() {
      this.clientFormData = JSON.parse(JSON.stringify(this.clientForm))
      this.handleLoading();
      this.getInvitationClient();
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
        name: '',
      }
      this.searchFormData = JSON.parse(JSON.stringify(this.formInline))
      this.getInvitationSupplier();
    }, 250, { leading: true, trailing: false }),
    // 我的客户重置
    clientRest: debounce(function () {
      this.clientPage = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.clientForm = {
        name: '',
      }
      this.clientFormData = JSON.parse(JSON.stringify(this.clientForm))
      this.getInvitationClient();
    }, 250, { leading: true, trailing: false }),
    // 查看派工
    actionDispatchDetail(record) {
      this.$router.push({ path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/dispatchDetail", query: { dataMsg: record } })
    },
    // 处罚记录--我的供应商
    actionPunishmentRecord1(record, str, flag) {
      if (!this.canClickBtnMixin("punishmentRecord")) {
        return;
      }
      let query = {
        corporationId: record.corporationId,
        companyId: record.companyId,
        company: record.companyCode,
        companyCode: record[str],
      };
      if (flag) {
        query.isHidden = true;
      }
      this.$router.push({ path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/punishmentRecord", query: query });
    },
    // 处罚记录--我的客户
    actionPunishmentRecord2(record, str, flag) {
      if (!this.canClickBtnMixin("punishmentRecord")) {
        return;
      }
      let query = {
        corporationId: record.corporationId,
        companyId: record.companyId,
        company: record.companyCode,
        companyCode: record[str],
      };
      if (flag) {
        query.isHidden = true;
      }
      this.$router.push({ path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/punishmentRecord", query: query });
    },
    // 审批记录
    actionApprovalRecord(record) {
      console.log("审批记录", record);
      this.$router.push({ path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/blacklistApprovalList", query: { companyName: record.companyName } });
    },
  },
}
</script>

<style lang="less" scoped>
</style>