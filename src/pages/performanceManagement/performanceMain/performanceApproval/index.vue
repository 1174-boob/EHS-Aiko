<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>绩效审批管理</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="审核状态">
          <a-select v-model="formInline.infoStatus" placeholder="请选择审核状态">
            <a-select-option v-for="item in statusList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="填报年度">
          <a-date-picker v-model="formInline.year" mode="year" format="YYYY" valueFormat="YYYY" @panelChange="yearChange" />
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>

    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="infoStatus" slot-scope="record">{{getMappingValue(statusList, "dictValue", record.infoStatus).dictLabel}}</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionLook(record)">查看</span>
          <span v-if="record.handler && record.handler == userId" class="color-0067cc cursor-pointer" @click="toCreate(record)">处理</span>
          <!-- <span class="color-red cursor-pointer" @click="actionDel(record)">删除</span> -->
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { debounce } from 'lodash';
import { orgDataSelectApproval } from '@/services/performanceManagement.js';

export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      tableSpinning:false,
      statusList: [],
      formInline: {},
      preFormInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: '填报范围',
          dataIndex: 'range',
          width: 200
        },
        {
          title: '填报人',
          dataIndex: 'createUserId',
          width: 200
        },
        {
          title: '提交时间',
          dataIndex: 'createTime',
          width: 200
        },
        {
          title: '审批人',
          dataIndex: 'handlerName',
          width: 200
        },
        {
          title: '审批时间',
          dataIndex: 'updateTime',
          // scopedSlots: { customRender: 'updateTime' },
          width: 200
        },
        {
          title: '审批状态',
          scopedSlots: { customRender: 'infoStatus' },
          fixed: 'right', // 固定操作列
          width: 200
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
      userId: "",
      userIdsMsg: {}
    }
  },
  created() {
    this.setRouterCode("performanceApproval");
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
      this.statusList = this.getMappingValue(this.dictTypeData, "dictType", "kpi_node").dictItem;
      this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
    },
    yearChange(val) {
      this.$set(this.formInline, "year", val.format('YYYY'));
    },
    // 变岗审批列表
    getDataList() {
      this.tableSpinning = true
      return orgDataSelectApproval({
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        ...this.preFormInline
      }).then(res => {
        this.cancelLoading(100);
        this.tableDataList = res.data.list || [];
        this.page.total = res.data.total;
      }).catch(err => {
        console.log(err);
      })
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
      this.$router.push({ path: "/ehsGerneralManage/performanceManagement/performanceApprovalDetail", query: { id: record.id } });
    },
    // 处理
    toCreate(record) {
      this.$router.push({ path: "/ehsGerneralManage/performanceManagement/performanceApprovalResolve", query: { id: record.id } });
    },
    // 按钮-删除
    actionDel(record) {
      accidentEventDelete({
        id: record.id
      }).then(res => {
        this.$antMessage.success("删除成功！");
        this.getDataList();
      })
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