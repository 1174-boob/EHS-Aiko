<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>通知公告</PageTitle>
    <SearchTerm>
      <!-- :colon="false"可以统一label值不带冒号： -->
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <!-- 下拉框选项 -->
        <!--  :hasDepartment="true" -->
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline"></CommonSearchItem>
        <a-form-model-item label="公告标题">
          <a-input v-model="formInline.policyLawSubject" placeholder="请输入公告标题" allowClear></a-input>
        </a-form-model-item>
        <!-- 日期选择框 -->
        <a-form-model-item label="发布时间">
          <a-range-picker separator="至" v-model="formInline.timeArr" @change="timeChange">
            <a-icon slot="suffixIcon" type="calendar" />
          </a-range-picker>
        </a-form-model-item>
        <!-- 公告类型 -->
        <a-form-model-item label="公告类型">
          <a-select v-model="formInline.noticeType" placeholder="请选择类型" allowClear>
            <a-select-option v-for="notice of noticeType" :value="notice.key" :key="notice.id">{{notice.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <!-- 带有加号按钮 -->
      <div>
        <a-button type="dashed" @click="goNoticeAddEdit">
          <a-icon type="plus" />新建
        </a-button>
      </div>
    </DashBtn>
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
        <div slot="noticeType" slot-scope="record">
          <span>{{record.noticeType ? typeObj[record.noticeType]?typeObj[record.noticeType] : "--":'--'}}</span>
        </div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="noticePreview(record)">预览</span>
          <span class="color-0067cc cursor-pointer" @click="noticeEdit(record)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="noticeDelete(record)">删除</span>
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
import { SelectPolicylaw, DeletePolicylaw } from "@/services/api.js";
import dayJs from 'dayjs';
import dictionary from "@/utils/dictionary.js";

export default {
  mixins: [teableCenterEllipsis, cancelLoading, dragTable],
  data() {
    return {
      noticeType: [],
      formInline: {},
      typeObj: {},
      condition: {},
      tableSpinning:false,
      page: {
        pageNo: 1,
        pageSize: 10,
      },
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: "id",
        },
        {
          title: '公告类型',
          scopedSlots: { customRender: 'noticeType' },
          key: "noticeType",
        },
        {
          title: '公告标题',
          dataIndex: 'policyLawSubject',
          key: "policyLawSubject",
          width: 400
        },
        {
          title: '发布时间',
          dataIndex: 'releaseTime',
          key: "releaseTime",
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
    this.columns.splice(1, 0, this.addCommonColumnItem());
    this.initConfigPage()
    this.getPolicylawList();
    this.noticeType = dictionary('noticeType');
    console.log(this.noticeType,'cvcv');
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
      this.initListPage()
      // this.noticeType = dictionary('noticeType');
      const type = {};
      for (let index = 0; index < this.noticeType.length; index++) {
        type[this.noticeType[index].key] = this.noticeType[index].value;
      }
      this.typeObj = type;
    },
    initListPage() {
      this.setRouterCode("notice");
      sessionStorage.removeItem('noticeMsg');
    },
    getPolicylawList(param = {}) {
      const params = {
        organizationId: param.organizationId ? param.organizationId : '',
        noticeType: param.noticeType ? param.noticeType : '',
        policyLawSubject: param.policyLawSubject ? param.policyLawSubject : '',
        releaseTimeStart: param.releaseTimeStart ? param.releaseTimeStart : '',
        releaseTimeEnd: param.releaseTimeEnd ? param.releaseTimeEnd : '',
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        type: '2',
        centerId: param.centerId,
        corporationId: param.corporationId,
        deptId: param.deptId
      }
      this.tableSpinning = true
      this.condition = JSON.parse(JSON.stringify(params)); //保存查询条件
      SelectPolicylaw(params)
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
    // 预览
    noticePreview(record) {
      const id = record.id
      this.$router.push({ path: "/notice/noticePreview", query: { id } })
    },
    // 编辑
    noticeEdit(record) {
      const id = record.id
      this.$router.push({ path: '/notice/noticeAddEdit', query: { id } })
    },
    // 删除
    noticeDelete(record) {
      const _this = this;
      if (!this.canClickBtnMixin("notice-del")) {
        return;
      }
      this.$antConfirm({
        title: '确定删除吗?',
        // content: h => <div>Some descriptions</div>,
        // icon: "redo",
        onOk() {
          DeletePolicylaw({ policyLawId: record.id }).then(res => {
            _this.$antMessage.success(res.message);
            _this.getPolicylawList(_this.condition);
          }).catch(err => {
            console.log(err);
          })
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    // 发布时间
    timeChange(value) {
      if (value.length >= 1) {
        this.formInline.releaseTimeStart = dayJs(value[0]).format('YYYY-MM-DD') + ' 00:00:00';
        this.formInline.releaseTimeEnd = dayJs(value[1]).format('YYYY-MM-DD') + ' 23:59:59';
      } else {
        this.formInline.releaseTimeStart = '';
        this.formInline.releaseTimeEnd = '';
      }

    },
    // 重置
    iRest: debounce(function () {
      this.$refs.commonSearchItem.reset();
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
        noticeType:'',
        organizationId: undefined,
        policyLawSubject: undefined,
        releaseTimeStart: '',
        releaseTimeEnd: '',
      }
      this.getPolicylawList();
    }, 250, { leading: true, trailing: false }),
    // 跳转新建页面
    goNoticeAddEdit() {
      this.$router.push("/notice/noticeAddEdit");
    },
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
</style>