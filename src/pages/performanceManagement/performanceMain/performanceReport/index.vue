<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>管理绩效报表</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept ref="commonDept" :CommonFormInline="formInline" :isAllCorporation="true"></CommonDept>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="actionEdit">配置</a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="configStatus" slot-scope="record">
          {{getMappingValue(configStatusList, "key", record.configStatus).value}}
        </div>
        <div slot="updateUserId" slot-scope="record">
          {{record.configStatus == 1 ? "--" : record.updateUserId}}
        </div>
        <div slot="updateTime" slot-scope="record">
          {{record.configStatus == 1 ? "--" : record.updateTime}}
        </div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="actionEdit(record)">配置</span>
        </div>
      </a-table>
    </CommonTable>
   
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { debounce } from 'lodash';
// , InsertLecturer, UpdateLecturer, DeleteLecturer, getOrganizeList, DetailLecturer, GetfileMsgList
import { organizationSelect } from "@/services/performanceManagement.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      tableSpinning:false,
      formInline: {},
      preFormInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      configStatusList: [
        {
          key: "1",
          value: "未配置"
        },
        {
          key: "2",
          value: "已配置"
        }
      ],
      columns: [
        {
          title: '配置状态',
          scopedSlots: { customRender: 'configStatus' },
        },
        {
          title: '修改人',
          scopedSlots: { customRender: 'updateUserId' },
        },
        {
          title: '修改时间',
          scopedSlots: { customRender: 'updateTime' },
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],

      
    }
  },
  created() {
    this.setRouterCode("performanceReport");
    this.columns.splice(0, 0, this.addCommonColumnItem(200));
    this.getDataList();
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.iRest()
      }
    }, 20);
  },
  methods: {
    getDataList() {
      let params = {
        ...this.preFormInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo
      }
      this.tableSpinning = true
      return organizationSelect(params).then((result) => {
        this.tableDataList = result.data.list;
        this.page.total = result.data.total;
      }).catch((err) => {
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
      this.$refs.commonDept.reset();
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.preFormInline = {};
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    
    async actionEdit(record) {
      this.$router.push({
        path: "/ehsGerneralManage/performanceManagement/performanceReportConfig",
        query: {
          achieveId: record.achieveId,
          configStatus: record.configStatus,
          corporationId: record.corporationId
        }
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
