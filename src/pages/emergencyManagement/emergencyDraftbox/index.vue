<template>
  <div class="emergency-plan clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>应急演练草稿箱</PageTitle>
    <SearchTerm class="feat">
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" @corporationChange="corporationChange" @centerChange="centerChange" @corporationDeptChange="corporationDeptChange"></CommonDept>
        <a-form-model-item label="应急演练级别">
          <a-select v-model="formInline.drillLevel" placeholder="请选择应急演练级别" allowClear>
            <a-select-option v-for="item in emergencyLevel" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="应急演练类型">
          <a-select v-model="formInline.drillTypeCode" placeholder="请选择应急演练类型" allowClear>
            <a-select-option v-for="item in drill_type" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="应急演练形式">
          <a-select v-model="formInline.drillForm" placeholder="请选择演练形式" allowClear>
            <a-select-option v-for="item in emergencyForm" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="计划所属部门">
          <dept-tree :placeholder="'请选择计划所属部门'" v-model="formInline.planDepartCode" :deptData="deptData" allowClear></dept-tree>
        </a-form-model-item>
        <a-form-model-item label="应急演练名称">
          <a-input v-model="formInline.drillName" placeholder="请输入应急演练名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="演练计划时间">
          <a-range-picker v-model="formInline.planTime" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD">
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
    <!-- <DashBtn>
      <div>
        应急演练列表结果
      </div>
    </DashBtn> -->
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="dataSource" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="edit(record.planId)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="deleteEm(record.planId)">删除</span>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>
// 这个混入只适用于页面中仅有单个表格时（主要处理了单元格文案居中，溢出显示省略号，没数据时显示的组件样式）
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
// 查询按钮的loading状态
import { debounce } from 'lodash';
import cancelLoading from '@/mixin/cancelLoading';
import serviceNameList from '@/config/default/service.config.js'
import dictionary from '@/utils/dictionary';
import chemicalDict from "@/mixin/chemicalDict.js";
import teableSelected from "@/mixin/teableSelected.js";
import {  draftPagelist, drillDeletePlan } from "@/services/api.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading,chemicalDict,teableSelected],
  data() {
    return {
      tableSpinning:false,
      formInline: {
        planDepartCode: undefined,
        draftDepartCode: undefined,
      },
      emergencyLevel: undefined,
      emergencyForm: undefined,
      drill_type: undefined,
      approveDisabled: true,
      deptData:[],
      // 导入文件地址
      action: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.chemicals}/api/ehs/chemical/list/upload`,
      preformInline: {},
      dirllPlanApproveStatus: [],
      formDict: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      dataSource: [],
      columns: [
        {
          title: '计划编号',
          dataIndex: 'planNumber',
          scopedSlots: { customRender: 'planNumber' },
          width: 230
        },
        {
          title: '应急演练级别',
          dataIndex: 'drillLevel',
          customRender: (text) => {
            return text ? dictionary("emergencyLevel", text) : '--'
          },
          width: 200
        },
        {
          title: '应急演练名称',
          dataIndex: 'drillName',
          width: 200
        },
        {
          title: '应急演练类型',
          dataIndex: 'drillTypeCode',
          customRender: (text) => {
            return text ? this.getChemicalDictText('drill_type', text) : '--'
          },
          width: 200
        },
        {
          title: '应急演练形式',
          dataIndex: 'drillForm',
          customRender: (text) => {
            return text ? dictionary("emergencyForm", text) : '--'
          },
          width: 200
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 200
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right',
          width: 130
        }
      ]
    }
  },
  computed: {
  },
  created() {
    this.setRouterCode("emergencyDraftbox");
    this.initConfigPage()
    this.columns.splice(1, 0, this.addCommonColumnItem(150))
    this.columns.splice(3, 0, this.addCommonColumnDepartment({
      width: 150,
      title: "计划所属部门",
      key:'planDepartCode',
    }))
    this.getDrillPageList();
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
      this.emergencyLevel = dictionary("emergencyLevel"); //应急演练级别
      this.emergencyForm = dictionary("emergencyForm"); //应急演练形式
      this.dirllPlanApproveStatus = dictionary("dirllPlanApproveStatus"); //审批状态
      this.drill_type = this.getChemicalDictList('drill_type'); //应急演练类型
    },
    // 组织改变
    corporationChange(val, deptId) {
      
    },
    // 获取组织下所有部门
    corporationDeptChange(deptData) {
      this.deptData = deptData;
    },
    // 中心改变
    centerChange(val) {
      this.deptData = [];
    },
    // 获取分页查询数据
    getDrillPageList() {
      const params = {
        ...this.preformInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }
      this.tableSpinning= true
      draftPagelist(params)
      .then(res=>{
        const data = res.data;
        this.dataSource = data.list;
        this.page.total = data.total;
      })
      .catch(err=>{ })
      .finally(()=>{
        this.tableSpinning=false
      })
    },
    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      const { centerId, corporationId, drillForm, drillLevel, drillName, drillTypeCode, planDepartCode } = { ...this.formInline }
      this.preformInline = { centerId, corporationId, drillForm, drillLevel, drillName, drillTypeCode, planDepartCode }
      if(this.formInline.planTime && this.formInline.planTime.length >= 1) {
        this.preformInline.startTime = this.formInline.planTime[0];
        this.preformInline.endTime = this.formInline.planTime[1];
      }
      this.getDrillPageList();
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.preformInline = {};
      this.getDrillPageList();
    }, 250, { leading: true, trailing: false }),
    // 编辑
    edit(planId) {
      this.$router.push({path:"/safeManage/emergencyManagement/emergencyDrillManagement/editEmergencyDraft",query:{planId}});
    },
    // 删除
    deleteEm(planId) {
      if (!this.canClickBtnMixin("emergencyDraftbox-del")) {
        return;
      }
      this.$antConfirm({
        content: '确认删除？',
        cancelText: '取消',
        onOk: () => {
          drillDeletePlan({planId}).then(res => {
            this.$antMessage.success('删除成功');
            this.page.pageNo = 1;
            this.getDrillPageList();
          }).catch(err => {
            console.log(err);
          })
        },
      });
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      this.getDrillPageList();
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDrillPageList();
    },
  }
}
</script>

<style lang="less" scoped>
// .emergency-plan {
// }
  .feat{
    padding-right: 0 !important;
  }
</style>