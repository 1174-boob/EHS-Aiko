<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>应急演练审批</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept ref="commonDept" :CommonFormInline="formInline"></CommonDept>
        <a-form-model-item label="申请类型">
          <a-select v-model="formInline.applyType" placeholder="请选择申请类型">
            <a-select-option v-for="item in applyTypeList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>

    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :columns="columns" :scroll="{ x: tableScrollX() }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionLook(record)">查看</span>
          <span v-if="record.isHander == 1" class="color-0067cc cursor-pointer m-r-15" @click="toCreate(record)">处理</span>
          <span class="color-red cursor-pointer" @click="actionDel(record)">删除</span>
        </div>
        <div slot="applyType" slot-scope="record">{{getMappingValue(applyTypeList, "key", record.applyType).value}}</div>
        <div slot="draftName" slot-scope="record">
          <a-popover autoAdjustOverflow>
            <div slot="content">
              <p>{{record.draftCode ? (record.draftName + "/" + record.draftCode) : record.draftName}}</p>
            </div>
            <span>{{record.draftCode ? (record.draftName + "/" + record.draftCode) : record.draftName}}</span>
          </a-popover>
        </div>
        <div slot="portalStatus" slot-scope="record">{{getMappingValue(portalStatusList, "key", record.portalStatus).value}}</div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { debounce } from 'lodash';
import dictionary from '@/utils/dictionary'
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
import { emergentProcessPageList, emergentProcessDeleteDrillProcess } from '@/services/api.js';

export default {
  components: { OrganizeLazyTree },
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      tableSpinning:false,
      applyTypeList: [
        {
          key: "0",
          value: "演练计划"
        },
        {
          key: "1",
          value: "演练报告"
        },
      ],
      portalStatusList: [],


      formInline: {},
      preFormInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: '审批单编号',
          dataIndex: 'processNumber',
          width: 180,
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '所属组织',
          dataIndex: 'corporationName',
          width: 140,
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '标题',
          dataIndex: 'title',
          width: 200,
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '申请类型',
          scopedSlots: { customRender: 'applyType' },
          width: 120,
        },
        {
          title: '起草人',
          scopedSlots: { customRender: 'draftName' },
          width: 140,
        },
        {
          title: '起草时间',
          dataIndex: 'createTime',
          width: 160,
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'portalStatus' },
          fixed: 'right', // 固定操作列
          width: 110
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 140 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
      changeTypeList: [],
      dangerousPostAll: [],
      userId: "",
      treeData: [],
    }
  },
  created() {
    this.setRouterCode("emergencyApprove");
    this.initConfigPage()
    this.getDataList();
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
      this.portalStatusList = dictionary("dirllPlanApproveStatus"); // 审批状态
      this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
    },
    // 审批列表
    getDataList() {
      this.tableSpinning = true
      return emergentProcessPageList({
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        ...this.preFormInline
      })
      .then(res => {
        this.cancelLoading(100);
        this.tableDataList = res.data.list;
        this.page.total = res.data.total;
      })
      .catch(err => {})
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    // 查询
    iSearch() {
      this.preFormInline = { ...this.formInline };
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      // 获取列表
      this.getDataList()
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 重置
    iRest: debounce(function () {
      this.$refs.commonDept.reset();
      this.treeData = [];
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.preFormInline = {};
      this.getDataList()
    }, 250, { leading: true, trailing: false }),

    // 按钮-详情
    actionLook(record) {
      if (record.applyType == "0") { // 计划
        this.$router.push({ path: "/safeManage/emergencyManagement/emergencyDrillManagement/approvePlanView", query: { processId: record.processId } });
      } else { // 报告
        this.$router.push({ path: "/safeManage/emergencyManagement/emergencyDrillManagement/approveReportView", query: { processId: record.processId, hasReport: true } });
      }
    },
    // 按钮-删除
    actionDel(record) {
      if (!this.canClickBtnMixin("emergencyApprove-del")) {
        return;
      }
      if (record.portalStatus == 2) {
        this.$antMessage.warn("审批中，不可删除");
        return;
      }
      emergentProcessDeleteDrillProcess({
        processId: record.processId
      }).then(res => {
        this.$antMessage.success("删除成功！");
        this.getDataList();
      })
    },
    // 按钮-处理
    toCreate(record) {
      if (record.applyType == "0") { // 计划
        this.$router.push({ path: "/safeManage/emergencyManagement/emergencyDrillManagement/approvePlanHandle", query: { processId: record.processId } });
      } else { // 报告
        this.$router.push({ path: "/safeManage/emergencyManagement/emergencyDrillManagement/approveReportHandle", query: { processId: record.processId, hasReport: true } });
      }
    },

    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getDataList();
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
    }
  }
}
</script>
<style lang="less" scoped>
</style>