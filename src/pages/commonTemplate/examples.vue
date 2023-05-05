<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>这是插槽标题</PageTitle>
    <SearchTerm>
      <!-- :colon="false"可以统一label值不带冒号： -->
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <!-- 搜索项 -->
        <!-- 输入框 -->
        <a-form-model-item label="企业名称">
          <a-input v-model="formInline.companyName" placeholder="请输入企业名称"></a-input>
        </a-form-model-item>
        <a-form-model-item label="企业名称">
          <a-input v-model="formInline.companyName" placeholder="请输入企业名称"></a-input>
        </a-form-model-item>
        <a-form-model-item label="企业名称">
          <a-input v-model="formInline.companyName" placeholder="请输入企业名称"></a-input>
        </a-form-model-item>
        <!-- 下拉框选项 -->
        <a-form-model-item label="邀请状态">
          <a-select v-model="formInline.status" placeholder="请选择邀请状态">
            <a-select-option value="0">待通过</a-select-option>
            <a-select-option value="1">已通过</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 日期选择框 -->
        <a-form-model-item label="邀请时间">
          <a-range-picker separator="至" v-model="formInline.timeArr">
            <a-icon slot="suffixIcon" type="calendar" />
          </a-range-picker>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <!-- <a-form-model-item class="float-right"> -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <a-button type="dashed" @click="goInvitationAction">普通虚线框按钮</a-button>
      <!-- 带有加号按钮 -->
      <a-button type="dashed" @click="goInvitationAction">
        <a-icon type="plus" />带加号按钮
      </a-button>
      <div class="float-right">
        <a-button v-for="item in btnList" :key="item.key" @click="statusChoose(item)">{{item.value}}</a-button>
      </div>
    </DashBtn>
    <CommonTable :page="page" :pageNoChange="pageNoChange">
      <a-table
        bordered
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{emptyText: emptyText}"
        :data-source="dataList"
        :rowKey="(record, index)=>{return index}"
        :pagination="false"
        :components="drag(columns)"
      >
        <div slot="phone" slot-scope="record">
          <span>{{encryptionRules("phone", record.phone)}}</span>
        </div>
        <div slot="invitePlatform" slot-scope="record">
          <span>{{record.invitePlatform ? record.invitePlatform : "-"}}</span>
        </div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc" @click="actionFn(record)">查看</span>
          <span class="color-ff4d4f" @click="actionFn(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>

// 混入方法
// 这个混入只适用于页面中仅有单个表格时（主要处理了单元格文案居中，溢出显示省略号，没数据时显示的组件样式）
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
// 查询按钮的loading状态
import cancelLoading from '@/mixin/cancelLoading';
// 可伸缩表格
import dragTable from "@/mixin/dragTable.js"
import { debounce } from 'lodash';
// 用于前端加密手机号等敏感信息，但是一般后端做加密；当需前端要用到这些加密数据则后端不能加密，前端展示时加密即可
import encryptionRules from "@/utils/encryptionRules";


export default {
  mixins: [teableCenterEllipsis, cancelLoading, dragTable],
  data() {
    return {
      formInline: {
        companyName: undefined,
        status: undefined,
        timeArr: []
      },
      btnList: [
        {
          key: 1,
          value: "状态1"
        },
        {
          key: 2,
          value: "状态2"
        },
        {
          key: 3,
          value: "状态3"
        },
        {
          key: 4,
          value: "状态4"
        }
      ],
      page: {
        pageNo: 1,
        pageSize: 2,
        total: 10,
      },
      columns: [
        {
          title: '企业名称',
          dataIndex: 'partnerCompanyName',
          key: "partnerCompanyName",
          width: 200
        },
        {
          title: '联系人手机号',
          scopedSlots: { customRender: 'phone' },
          key: "phone",
          width: 200
        },
        {
          title: '邀请人',
          dataIndex: 'userName',
          key: "userName",
          width: 200
        },
        {
          title: '邀请时间',
          dataIndex: 'inviteTime',
          key: "inviteTime",
          width: 200
        },
        {
          title: '邀请入口',
          scopedSlots: { customRender: 'invitePlatform' },
          key: "invitePlatform",
          width: 200
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right', // 固定操作列
          width: 300 // 宽度根据操作自定义设置
        },
      ],
      dataList: [
        {
          partnerCompanyName: "partnerCompanyName11",
          phone: "13111111111",
          userName: "userName11",
          inviteTime: "inviteTime11",
          invitePlatform: "invitePlatform11"
        }
      ],
    }
  },
  methods: {
    encryptionRules,
    getCooperationPartnerList() {

    },
    // 查询
    iSearch() {
      // 获取列表
      // this.getCooperationPartnerList()
      // .finally(() => {
      //   this.cancelLoading();
      // })
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
        companyName: undefined,
        timeArr: [],
        status: undefined,
      }
      this.getCooperationPartnerList()
    }, 250, { leading: true, trailing: false }),
    goInvitationAction() {

    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      console.log(this.page);
      // 获取列表
      this.getCooperationPartnerList();
    },
    statusChoose(item) {
      console.log(item);
    },
  }
}
</script>
<style lang="less" scoped>
/deep/.table-draggable-handle {
  border: 1px solid red;
  height: 100% !important;
  left: auto !important;
  right: -5px;
  cursor: col-resize;
  touch-action: none;
  border: none;
  position: absolute;
  transform: none !important;
  bottom: 0;
}
/deep/.resize-table-th {
  position: relative;
}
</style>