<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline"></CommonSearchItem>
        <a-form-model-item label="企业全称">
          <a-input v-model="formInline.companyName" placeholder="请输入企业全称"></a-input>
        </a-form-model-item>
        <a-form-model-item label="企业简称">
          <a-input v-model="formInline.companyAbbreviation" placeholder="请输入企业简称"></a-input>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="blackListRules">黑名单规则</a-button>
        <a-button type="dashed" @click="toBlacklist">黑名单审批</a-button>
      </div>
    </DashBtn>
    <!--表格列表 -->
    <CommonTable :page="page" :spinning="tableSpinning" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
        <vxe-column field="blackId" :min-width="180" title="编号"></vxe-column>
        <vxe-column field="corporationId" :min-width="120" title="所属组织">
          <template #default="{ row }">
            <span>{{matchOrganizeName(row.corporationId)}}</span>
          </template>
        </vxe-column>
        <vxe-column field="companyName" :min-width="150"  title="企业全称"></vxe-column>
        <vxe-column field="companyAbbreviation" :min-width="100" title="企业简称"></vxe-column>
        <vxe-column field="companyCode" :min-width="180" title="统一社会信用代码"></vxe-column>
        <vxe-column field="action" fixed="right" title="操作" width="180">
          <template #default="{ row }">
            <div class="vex-table-btn">
              <span class="color-0067cc cursor-pointer m-r-15" @click="actionLook(row)">详情</span>
              <span class="color-0067cc cursor-pointer m-r-15" @click="actionRemoveBlacklist(row)">移除黑名单</span>
              <!-- <span class="color-0067cc cursor-pointer" @click="actionPunishmentRecord(row)">处罚记录</span> -->
            </div>
          </template>
        </vxe-column>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </CommonTable>
    <!-- 黑名单规则弹窗 -->
    <BlackRuleModel v-model="blackRuleModelShow" />
  </div>
</template>
<script>
import { selectEnterBlack, SelectTemplateByNode } from "@/services/api.js";
import cancelLoading from '@/mixin/cancelLoading';
import { debounce } from 'lodash';
import BlackRuleModel from './tpl/blackRuleModel.vue'
import { getDictTarget } from "@/utils/dictionary";
export default {
  components: { BlackRuleModel },
  mixins: [cancelLoading],
  data() {
    return {
      tableSpinning:false,
      phone: "",
      blackRuleModelShow: false,
      formInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      tableList: [],
      companyId: undefined,
    }
  },
  created() {
    this.setRouterCode("blacklistManagement");
    this.getTableList();
    this.initConfigPage()
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.initConfigPage()
        this.iRest()
      }
    }, 20);
  },
  methods: {
    initConfigPage(){
      this.phone = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user.phone;
      this.companyId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company.companyId;
    },
    getDictTarget,
    // 按钮-黑名单规则
    blackListRules() {
      if (!this.canClickBtnMixin("blacklistRules")) {
        return;
      }
      this.blackRuleModelShow = true;
    },
    toBlacklist() {
      if (!this.canClickBtnMixin("toBlacklist")) {
        return;
      }
      this.$router.push("/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/blacklistApprovalList");
    },
    // 黑名单列表
    getTableList() {
      let adpData = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        ...this.formInline
      }
      this.tableSpinning = true
      return selectEnterBlack(adpData)
        .then(res => {
          let { list: tableList, total } = res.data ? res.data : { list: [], total: 0 };
          this.tableList = tableList || [];
          this.page.total = total;
          // 处理页码 问题
          if (this.tableList.length === 0 && (this.page.pageNo !== 1 && this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .catch(err => {
        })
        .finally(() => {
          this.tableSpinning = false
          this.cancelLoading();
        })
    },
    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.handleLoading()
      this.getTableList()
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.getTableList()
    }, 250, { leading: true, trailing: false }),
    // 按钮-详情
    actionLook(record) {
      this.$router.push({
        path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/partnerDetail",
        query: { id: record.enterpriseId, partner: 1, companyId: record.blackCompanyId }
      });
    },
    // 按钮-移除黑名单
    actionRemoveBlacklist(record) {
      if (!this.canClickBtnMixin("blacklistManagement-del")) {
        return;
      }
      if (record.blackStatus == 1) {
        this.$antMessage.error("该公司已经进入移除黑名单审批流程了！");
        return;
      }
      this.$antConfirm({
        title: '提示',
        content: '确认将供应商移除黑名单？',
        cancelText: '取消',
        okText: '提交审批',
        onOk: () => {
          // 进入黑名单-自定义表单新建页面
          this.$router.push({
            path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/blacklistCreate",
            query: { blackId: record.blackId, enterpriseId: record.enterpriseId }
          });
        },
      });
    },
    // 按钮-处罚记录
    actionPunishmentRecord(record) {
      this.$router.push({
        path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/punishmentRecord",
        query: {
          companyId: this.companyId,  //登陆人
          corporationId: record.corporationId,
          company: record.blackCompanyId,
          companyCode: record.blackCompanyId
        }
      });
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getTableList();
    },
    showSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getTableList();
    },
  }
}
</script>

<style lang="less" scoped>
</style>