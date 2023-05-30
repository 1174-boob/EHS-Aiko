<template>
  <div class="emergency-plan clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>应急演练报告</PageTitle>
    <SearchTerm class="feat">
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept
          ref="commonSearchItem"
          :CommonFormInline="formInline"
          :hasDepartment="true"
          @corporationChange="corporationChange"
          @centerChange="centerChange"
          @corporationDeptChange="corporationDeptChange"
        ></CommonDept>
        <a-form-model-item label="报告编号">
          <a-input v-model="formInline.reportNumber" placeholder="请输入报告编号" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="应急演练名称">
          <a-input v-model="formInline.drillName" placeholder="请输入应急演练名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="应急演练级别">
          <a-select v-model="formInline.drillLevel" placeholder="请选择应急演练级别" allowClear>
            <a-select-option v-for="item in emergencyLevel" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="计划所属部门">
          <dept-tree :placeholder="'请选择计划所属部门'" v-model="formInline.planDepartCode" :deptData="deptData" @change="planDeptChange" allowClear></dept-tree>
        </a-form-model-item>
        <a-form-model-item label="应急演练类型">
          <a-select v-model="formInline.drillTypeCode" placeholder="请选择应急演练类型" allowClear>
            <a-select-option v-for="item in drill_type" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="审批状态">
          <a-select v-model="formInline.portalStatus" placeholder="请选择" allowClear>
            <a-select-option v-for="item in portalStatusList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="实际演练时间">
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
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: tableScrollX() }" :locale="{emptyText: emptyText}" :data-source="dataSource" :rowKey="(record, index)=>{return index}" :pagination="false">
        <template slot="draftName" slot-scope="record">{{record.draftCode ? (record.draftName + "/" + record.draftCode) : record.draftName}}</template>
        <template slot="drillLevel" slot-scope="record">{{getMappingValue(emergencyLevel, "key", record.drillLevel).value}}</template>
        <template slot="portalStatus" slot-scope="record">{{getMappingValue(portalStatusList, "key", record.portalStatus).value}}</template>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="preview(record.reportId)">查看</span>
          <!-- portalStatus == 3 审批驳回的才会有编辑按钮 -->
          <span class="color-0067cc cursor-pointer" v-if="record.portalStatus == 3" @click="edit(record.reportId)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="deleteEm(record)">删除</span>
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
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import dictionary from '@/utils/dictionary';
import chemicalDict from "@/mixin/chemicalDict.js";
import teableSelected from "@/mixin/teableSelected.js";
import { chemicalDownload } from "@/services/api.js";
import { reportPageList, reportDeleteReport } from "@/services/api.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading, chemicalDict, teableSelected],
  components: {
    UploadBtnStyle,
  },
  data() {
    return {
      tableSpinning:false,
      formInline: {
        deptModel: undefined
      },
      formData: {},
      emergencyLevel: undefined,
      emergencyForm: undefined,
      drill_type: undefined,
      portalStatusList: [],
      deptData: [],
      // 导入文件地址
      action: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.chemicals}/api/ehs/chemical/list/upload`,
      completeDict: {},
      chemicalDict: {},
      formDict: {},
      riskDict: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      dataSource: [],
      columns: [
        {
          title: '报告编号',
          dataIndex: 'reportNumber',
          width: 200
        },
        {
          title: '应急演练名称',
          dataIndex: 'drillName',
          width: 200
        },
        {
          title: '演练计划时间',
          dataIndex: 'planTime',
          width: 200
        },
        {
          title: '实际演练时间',
          dataIndex: 'actualDrillDate',
          width: 200
        },
        {
          title: '演练级别',
          scopedSlots: { customRender: 'drillLevel' },
          width: 200
        },
        {
          title: '参演总人数',
          dataIndex: 'joinPeopleNum',
          width: 200
        },
        {
          title: '起草人',
          scopedSlots: { customRender: 'draftName' },
          width: 200
        },

        {
          title: '创建时间',
          dataIndex: 'createTime',
          minWidth: 200
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'portalStatus' },
          fixed: 'right',
          width: 200
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right',
          width: 160
        }
      ]
    }
  },
  computed: {
  },
  created() {
    this.setRouterCode("emergencyReport");
    this.initConfigPage()
    this.columns.splice(0, 0, this.addCommonColumnItem(150))
    this.getPageList();
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
      this.prep_level = this.getChemicalDictList('prep_level'); //预案级别
      this.emergencyForm = dictionary("emergencyForm"); //应急演练形式
      this.drill_type = this.getChemicalDictList('drill_type'); //应急演练类型
      this.portalStatusList = dictionary("dirllPlanApproveStatus"); // 审批状态
    },
    // 组织改变
    corporationChange(val, deptId) {
    },
    // 获取组织下所有部门
    corporationDeptChange(value) {
      this.deptData = value
    },
    // 中心改变
    centerChange(val) {
      this.deptData = [];
    },
    // 部门改变
    planDeptChange(id, name) {
    },
    // 获取分页查询数据
    getPageList() {
      this.tableSpinning= true
      const params = {
        ...this.formData,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }
      reportPageList(params)
      .then(res => {
        this.dataSource = res.data.list;
        this.page.total = res.data.total;
        this.loading = false;
      })
      .catch(err => {})
      .finally(() => {
        this.tableSpinning= false
        this.loading = false;
      })
    },

    // 查询
    iSearch() {
      this.loading = true;
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      const { centerId, corporationId, reportNumber, drillName, drillLevel, planDepartCode, drillTypeCode, portalStatus } = this.formInline;
      this.formData = { centerId, corporationId, reportNumber, drillName, drillLevel, planDepartCode, drillTypeCode, portalStatus }
      if (this.formInline.planTime && this.formInline.planTime.length > 0) {
        this.formData.startTime = this.formInline.planTime[0];
        this.formData.endTime = this.formInline.planTime[1];
      }
      this.getPageList();
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {}
      this.formData = {};
      this.getPageList();
    }, 250, { leading: true, trailing: false }),

    // 查看
    preview(reportId) {
      this.$router.push({ path: "/safeManage/emergencyManagement/emergencyDrillManagement/previewReport", query: { reportId } });
    },
    // 编辑
    edit(reportId) {
      this.$router.push({ path: "/safeManage/emergencyManagement/emergencyDrillManagement/editReport", query: { reportId } });
    },
    // 删除
    deleteEm(record) {
      if (!this.canClickBtnMixin("emergencyReport-del")) {
        return;
      }
      if (record.portalStatus == "2") {
        this.$antMessage.warn("流转中不允许删除");
        return;
      }
      this.$antConfirm({
        content: '确认删除？',
        cancelText: '取消',
        onOk: () => {
          reportDeleteReport({ reportId: record.reportId }).then(res => {
            this.$antMessage.success('删除成功');
            this.page.pageNo = 1;
            this.getPageList();
          }).catch(err => {
            console.log(err);
          })
        },
      });
    },

    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      this.getPageList();
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getPageList();
    },
  }
}
</script>

<style lang="less" scoped>
// .emergency-plan {
// }
.feat {
  padding-right: 0 !important;
}
</style>