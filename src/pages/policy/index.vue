<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>政策法规</PageTitle>
    <SearchTerm>
      <!-- :colon="false"可以统一label值不带冒号： -->
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline"></CommonSearchItem>
        <a-form-model-item label="公告标题">
          <a-input v-model="formInline.policyLawSubject" placeholder="请输入公告标题" allowClear></a-input>
        </a-form-model-item>
        <!-- 日期选择框 -->
        <a-form-model-item label="发布时间">
          <a-range-picker class="search-range-picker" style="width: 200px"  v-model="formInline.timeArr" valueFormat="YYYY-MM-DD">
           
          </a-range-picker>
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
        <a-button type="dashed" @click="goPolicyAddEdit">
          <a-icon type="plus" />新建
        </a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
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
        <div slot="policyLawType" slot-scope="record">
          <span>{{record.policyLawType ? typeObj[record.policyLawType]?typeObj[record.policyLawType]:'--' : "--"}}</span>
        </div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="policyPreview(record)">预览</span>
          <span class="color-0067cc cursor-pointer" @click="policyEdit(record)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="policyDelete(record)">删除</span>
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
import dayJs from 'dayjs';
import { SelectPolicylaw, DeletePolicylaw  } from "@/services/api.js";
import dictionary from "@/utils/dictionary.js";

export default {
  mixins: [teableCenterEllipsis, cancelLoading, dragTable],
  data() {
    return {
      tableSpinning:false,
      timeArr: [],
      condition: {},
      typeObj: {},
      organizationArr: [],
      formInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: "id",
        },
        {
          title: '公告类型',
          scopedSlots: { customRender: 'policyLawType' },
          key: "policyLawType",
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
            return text?text.split(" ")[0]:'--';
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
    this.setRouterCode("policy");
    this.columns.splice(1, 0, this.addCommonColumnItem());
    this.initConfigPage()
    this.getPolicylawList();
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
      this.noticeType = dictionary('policyLowType');
      const type = {};
      for (let index = 0; index < this.noticeType.length; index++) {
        type[this.noticeType[index].key] = this.noticeType[index].value;
      }
      this.typeObj = type;
      sessionStorage.removeItem('policyMsg');
    },
    // 获取列表
    getPolicylawList() {
      let {timeArr} = this.formInline
      const params = {
        ...this.formInline,
        timeArr:undefined,
        releaseTimeStart: timeArr && timeArr[0] ? (timeArr[0] + ' 00:00:00') : undefined,
        releaseTimeEnd:  timeArr && timeArr[1] ? (timeArr[1] + ' 23:59:59') : undefined,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        type: '1',
      }
      this.condition = JSON.parse(JSON.stringify(params)); //保存查询条件
      this.tableSpinning = true
      SelectPolicylaw(params)
      .then(res => {
        let { list: dataList, total } = res.data ? res.data : { list: [], total: 0 };
        this.dataList = dataList || [];
        this.page.total = total;
        // 处理页码 问题
        if (this.dataList.length === 0 && (this.page.pageNo !== 1 && this.page.total !== 0)) {
          this.page.pageNo = 1;
          this.getPolicylawList();
        }
      })
      .finally(()=>{
        this.tableSpinning = false
        this.cancelLoading(100);
      })
    },
    // 查询
    iSearch() {
      this.handleLoading();
      this.getPolicylawList();
    },
    // 预览
    policyPreview(record) {
      const id = record.id
      this.$router.push({ path: "/safeManage/securityThinkTank/policyPreview", query: { id } })
    },
    //编辑
    policyEdit(record) {
      console.log(record);
      const id = record.id
      this.$router.push({ path: '/safeManage/securityThinkTank/policyAddEdit', query: { id } })
    },
    // 删除
    policyDelete(record) {
      console.log("rr==", record);
      if (!this.canClickBtnMixin("policy-del")) {
        return;
      }
      const _this = this;
      this.$antConfirm({
        title: '确定删除吗?',
        // content: h => <div>Some descriptions</div>,
        // icon: "redo",
        onOk() {
          DeletePolicylaw({ policyLawId: record.id }).then(res => {
            console.log(res);
            _this.$antMessage.success(res.message);
            _this.getPolicylawList(_this.condition);
          }).catch(err => {
            console.log(err);
          })
        },
        onCancel() {
          console.log('Cancel');
        },
        // class: 'test',
      });

    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
      }
      this.formInline = {}
      this.timeArr = [];
      this.getPolicylawList()
    }, 250, { leading: true, trailing: false }),
    // 跳转新建页面
    goPolicyAddEdit() {
      this.$router.push("/safeManage/securityThinkTank/policyAddEdit")
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
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