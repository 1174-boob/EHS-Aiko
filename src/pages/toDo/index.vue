<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle><span style="color:#666; margin-left: 20px; font-size: 14px;">首页&nbsp;/&nbsp;</span><span style="color:#999;font-size: 14px;">待办</span></PageTitle>
    <SearchTerm>
      <!-- :colon="false"可以统一label值不带冒号： -->
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <!-- 下拉框选项 -->
        <!--  :hasDepartment="true" -->
        <a-form-model-item label="标题名称">
          <a-input v-model="formInline.todoTitle" placeholder="请输入待办标题名称" allowClear></a-input>
        </a-form-model-item>
        <!-- 日期选择框 -->
        <a-form-model-item label="时间">
          <a-range-picker separator="至" v-model="formInline.timeArr" @change="timeChange">
            <a-icon slot="suffixIcon" type="calendar" />
          </a-range-picker>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <CommonTable :page="page" :spinning="tableSpinning" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
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
        <div slot="docUserId" slot-scope="record">
          <span>{{record.docUserName+ '/' + record.docUserId}}</span>
        </div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="toDoDetail(record)">详情</span>
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
import { messageListPage, } from "@/services/api.js";
import dayJs from 'dayjs';
import dictionary from "@/utils/dictionary.js";

export default {
  mixins: [teableCenterEllipsis, cancelLoading, dragTable],
  data() {
    return {
      formInline: {},
      condition: {},
      tableSpinning:false,
      page: {
        pageNo: 1,
        pageSize: 10,
      },
      columns: [
        {
          title: '标题名称',
          dataIndex: 'todoTitle',
          key: "todoTitle",
          width: 400
        },
        {
          title: '起草人',
          scopedSlots: { customRender: 'docUserId' },
          key: "docUserId",
        },
        {
          title: '接收时间',
          dataIndex: 'startTime',
          key: "startTime",
          customRender: (text, record, index) => {
            return text ? text.split(" ")[0] : '--';
          },
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
    this.getPolicylawList();
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.iRest()
      }
    }, 20);
  },
  methods: {
    getPolicylawList(param = {}) {
      const params = {
        todoTitle: param.todoTitle ? param.todoTitle : '',
        startDate: param.startDate ? param.startDate : '',
        endDate: param.endDate ? param.endDate : '',
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }
      this.tableSpinning = true
      this.condition = JSON.parse(JSON.stringify(params)); //保存查询条件
      messageListPage(params)
      .then(res => {
        this.cancelLoading(100);
        const list = res.data.list;
        this.dataList = list;
        this.page.total = res.data.total;
      })
      .catch(err => {
        console.log(err);
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    // 查询
    iSearch() {
      console.log(this.formInline,'查询项')
      this.handleLoading();
      this.getPolicylawList(this.formInline);
    },
    // 详情
    toDoDetail(record) {
      window.open(record.url, "_blank");
    },
    // 发布时间
    timeChange(value) {
      if (value.length >= 1) {
        this.formInline.startDate = dayJs(value[0]).format('YYYY-MM-DD') + ' 00:00:00';
        this.formInline.endDate = dayJs(value[1]).format('YYYY-MM-DD') + ' 23:59:59';
      } else {
        this.formInline.startDate = '';
        this.formInline.endDate = '';
      }

    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
        todoTitle: undefined,
        startDate: '',
        endDate: '',
      }
      this.getPolicylawList();
    }, 250, { leading: true, trailing: false }),
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      console.log(this.page);
      // 获取列表
      this.getPolicylawList(this.condition);
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getPolicylawList(this.condition);
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
::v-deep .searchtable-search {
    background-color: #FCFCFC !important;
}
::v-deep .ant-table-tbody {
    background-color: #FFFFFF !important;
}
 
</style>