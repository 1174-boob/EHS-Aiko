<template>
  <div class="emergency-plan clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>应急演练计划</PageTitle>
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
        <a-form-model-item label="起草人部门">
          <dept-tree :placeholder="'请选择起草人部门'" v-model="formInline.draftDepartCode" :deptData="deptData" allowClear></dept-tree>
        </a-form-model-item>
        <a-form-model-item label="计划编号">
          <a-input v-model="formInline.planNumber" placeholder="请输入编号" allowClear></a-input>
        </a-form-model-item>
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
          <a-input v-model="formInline.drillName" :maxLength="50" placeholder="请输入应急演练名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="审批状态">
          <a-select v-model="formInline.portalStatus" placeholder="请选择" allowClear>
            <a-select-option v-for="item in dirllPlanApproveStatus" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="演练计划时间">
          <a-range-picker v-model="planTime">
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
    <DashBtn>
      <div>
        <a-button type="dashed" @click="addEmergency">
          <a-icon type="plus" />新建
        </a-button>
        <a-button type="dashed" :loading="drillSubmitApproveLoading" @click="drillSubmitApprove">提交审批</a-button>
        <!--  v-if="allButtonCodeList.includes('dangerWorkStaticAddAndChange')" -->
        <template v-if="true">
          <UploadBtnStyle
            :action="action"
            :showAcceptText="false"
            :accept="['.xlsx', '.xls',]"
            :showUploadList="false"
            :btnText="'批量导入'"
            :btnType="'dashed'"
            :btnIcon="false"
            @handleSuccess="handleSuccess"
            class="upload-btn-style"
          ></UploadBtnStyle>
          <a-button type="dashed" @click="downloadTem">下载导入模板</a-button>
        </template>
        <template v-else>
          <a-button type="dashed" @click="noAuth">批量导入</a-button>
          <a-button type="dashed" @click="noAuth">下载导入模板</a-button>
        </template>
        <a-button type="dashed" :loading="loadingThree" @click="exportAll">批量导出</a-button>
      </div>
      <div class="ttips">
        <div class="circle-item">
          <span class="red-circle"></span>
          <span>超期提醒</span>
        </div>
        <div class="circle-item">
          <span class="yellow-circle"></span>
          <span>到期前一个月提醒</span>
        </div>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table
        bordered
        :columns="columns"
        :scroll="{ x: tableScrollX() }"
        :locale="{emptyText: emptyText}"
        :data-source="dataSource"
        :rowKey="tableRowKey"
        :pagination="false"
        :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,...rowSelection}"
      >
        <template slot="planNumber" slot-scope="text, record, index">
          <a-popover autoAdjustOverflow>
            <div slot="content">
              <p>{{ text }}</p>
            </div>
            <!-- warnStatus  1超期提醒   2到期前一个月提醒 -->
            <span class="warn-span warn1" v-if="record.warnStatus=='1'"></span>
            <span class="warn-span warn2" v-else-if="record.warnStatus=='2'"></span>
            <span class="warn-span" v-else></span>
            {{text}}
          </a-popover>
        </template>
        <template slot="draft" slot-scope="record">
          <a-popover autoAdjustOverflow>
            <div slot="content">
              <p>{{record.draftName}}/{{record.draftCode}}</p>
            </div>
            <span>{{record.draftName}}/{{record.draftCode}}</span>
          </a-popover>
        </template>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="preview(record.planId)">查看</span>
          <!-- 只有待审批或审批驳回的才能进行编辑； -->
          <span class="color-0067cc cursor-pointer" v-if="record.portalStatus == 1 || record.portalStatus == 3" @click="edit(record.planId)">编辑</span>
          <!-- 计划审批通过且未进行演练的且到期前一个月提醒显示录入报告入口  -->
          <span class="color-0067cc cursor-pointer" v-if="record.portalStatus == 4 && record.hasReport == 0" @click="inputReport(record.planId)">录入报告</span>
          <!-- 录入过报告后就可以一直显示查看报告按钮 -->
          <span class="color-0067cc cursor-pointer" v-if="record.hasReport == 1" @click="previewReport(record.planId)">查看报告</span>
          <!-- 审批通过且未演练且未调整过的计划可以进行计划调整,只能调整一次 -->
          <span class="color-0067cc cursor-pointer" v-if="record.portalStatus == 4 && record.isPlanAdjust == 0 && record.hasReport == 0" @click="planAdjust(record.planId)">计划调整</span>
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
import { PushTask, drillPageList, drillDeletePlan, drillSubmitApprove, drillExportPlanData } from "@/services/api.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading, chemicalDict, teableSelected],
  components: {
    UploadBtnStyle,
  },
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
      planTime: undefined,
      approveDisabled: true,
      deptData: [],
      // 导入文件地址
      action: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.danger}/api/ehs/emergent/drill/importPlanData`,
      formData: {},
      dirllPlanApproveStatus: [],
      formDict: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      dataSource: [],
      tableRowKey: 'planId',
      drillSubmitApproveLoading: false,
      columns: [
        {
          title: '计划编号',
          dataIndex: 'planNumber',
          scopedSlots: { customRender: 'planNumber' },
          width: 180,
        },
        {
          title: '应急演练级别',
          dataIndex: 'drillLevel',
          customRender: (text) => {
            return text ? dictionary("emergencyLevel", text) : '--'
          },
          width: 160
        },
        {
          title: '应急演练名称',
          dataIndex: 'drillName',
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
          title: '应急演练类型',
          dataIndex: 'drillTypeCode',
          width: 160,
          customRender: (text) => {
            text = text ? this.getChemicalDictText('drill_type', text) : ''
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
          title: '应急演练形式',
          dataIndex: 'drillForm',
          width: 160,
          customRender: (text) => {
            text = text ? dictionary("emergencyForm", text) : ''
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
          title: '演练计划时间',
          dataIndex: 'planTime',
          width: 140
        },
        {
          title: '起草人',
          scopedSlots: { customRender: 'draft' },
          width: 200,
        },
        {
          title: '是否演练',
          dataIndex: 'hasReport', // 0未演练  1已演练
          customRender: (text) => {
            return text == '1' ? '已演练' : '未演练'
          },
          width: 110
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 180
        },
        {
          title: '状态',
          dataIndex: 'portalStatus', //1待审批 2审批中 3审批驳回 4审批通过
          customRender: (text) => {
            return text ? dictionary("dirllPlanApproveStatus", text) : '--'
          },
          fixed: 'right',
          width: 90
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right',
          width: 240
        }
      ]
    }
  },
  created() {
    this.setRouterCode("emergencyPlan");
    this.initConfigPage()
    this.columns.splice(1, 0, this.addCommonColumnItem(150))
    this.columns.splice(3, 0, this.addCommonColumnDepartment({
      width: 150,
      title: "计划所属部门",
      key: 'planDepartCode',
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
  computed: {
    rowSelection() {
      return {
        getCheckboxProps: record => ({
          props: {
            disabled: !(record.portalStatus == "1" || record.portalStatus == "3"), // 待审批及审批驳回可进行勾选
            // name: record.name,
          },
        }),
      };
    },
  },
  methods: {
    initConfigPage(){
      this.emergencyLevel = dictionary("emergencyLevel"); //应急演练级别
      this.emergencyForm = dictionary("emergencyForm"); //应急演练形式
      this.dirllPlanApproveStatus = dictionary("dirllPlanApproveStatus"); //审批状态
      console.log(this.dirllPlanApproveStatus)
      this.drill_type = this.getChemicalDictList('drill_type'); //应急演练类型
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
    // 获取分页查询数据
    getDrillPageList() {
      const params = {
        ...this.formData,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }
      this.tableSpinning = true
      drillPageList(params)
      .then(res => {
        const data = res.data;
        this.dataSource = data.list;
        this.page.total = data.total;
      })
      .catch(err => {
        console.log(err);
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    // 批量导入成功
    handleSuccess(fileList) {
      this.page = {
        pageNo: 1,
        pageSize: 10
      }
      this.selectedRowKeys = []
      this.getDrillPageList();
    },
    // 下载模板
    downloadTem() {
      let tarUrl = `${process.env.VUE_APP_API_BASE_URL}/file/template/应急演练计划批量导入.xlsx`
      window.open(tarUrl)
    },
    // 批量导出
    exportAll() {
      this.handleLoadingThree()
      let apiData = {
        ...this.formData
      }
      drillExportPlanData(apiData)
        .then(res => {
          this.spreadSheetExcel(res, '应急演练计划导出')
        })
        .catch(() => { })
        .finally(() => {
          this.cancelLoadingThree()
        })
    },
    // 无权限
    noAuth() {
      this.$antMessage.warn('暂无权限，请联系管理员开通权限后再操作！')
    },
    // 提交审批
    drillSubmitApprove() {
      if (!(this.selectedRowKeys && this.selectedRowKeys.length > 0)) {
        this.$antMessage.warning("请先选择审批数据");
        return;
      }

      let drillLevelArr = this.selectedRow.map(item => item.drillLevel); // 演练级别数组
      let planDepartCodeArr = this.selectedRow.map(item => item.planDepartCode); // 计划所属部门数组innerDepartCode
      let drillLevelArrSet = [...new Set(drillLevelArr)];
      let planDepartCodeArrSet = [...new Set(planDepartCodeArr)];

      console.log(drillLevelArrSet, planDepartCodeArrSet, this.selectedRowKeys);

      if (drillLevelArrSet.length > 1 || planDepartCodeArrSet.length > 1) {
        this.$antMessage.warn("只允许提交同种级别和同一计划所属部门的数据");
        return;
      }
      // return
      this.drillSubmitApproveLoading = true;
      drillSubmitApprove({
        planIds: this.selectedRowKeys
      }).then(res => {
        this.$antMessage.success("提交成功");
        this.pushPara = res.data;
        this.pushTask();
        this.$router.push({
          path: "/safeManage/emergencyManagement/emergencyDrillManagement/emergencyApprove"
        })
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.drillSubmitApproveLoading = false;
      })
    },

    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formData = JSON.parse(JSON.stringify(this.formInline));
      if (this.planTime && this.planTime.length >= 1) {
        this.formData.startTime = this.planTime[0].format('YYYY-MM-DD');
        this.formData.endTime = this.planTime[1].format('YYYY-MM-DD');
      } else {
        this.formData.startTime = undefined;
        this.formData.endTime = undefined;
      }
      this.selectedRowKeys = []
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
      this.planTime = null;
      this.formData = {};
      this.selectedRowKeys = []
      this.getDrillPageList();
    }, 250, { leading: true, trailing: false }),
    // 新建
    addEmergency() {
      this.$router.push("/safeManage/emergencyManagement/emergencyDrillManagement/addEmergencyPlan");
    },
    // 查看
    preview(planId) {
      this.$router.push({ path: "/safeManage/emergencyManagement/emergencyDrillManagement/previewEmergencyPlan", query: { planId } });
    },
    // 编辑
    edit(planId) {
      this.$router.push({ path: "/safeManage/emergencyManagement/emergencyDrillManagement/editEmergencyPlan", query: { planId } });
    },
    // 录入报告
    inputReport(planId) {
      this.$router.push({ path: "/safeManage/emergencyManagement/emergencyDrillManagement/inputReport", query: { planId, from: 1 } });
    },
    // 查看报告
    previewReport(planId) {
      this.$router.push({ path: "/safeManage/emergencyManagement/emergencyDrillManagement/previewReport", query: { planId, from: 1 } });
    },
    // 计划调整
    planAdjust(planId) {
      this.$router.push({ path: "/safeManage/emergencyManagement/emergencyDrillManagement/planAdjust", query: { planId } });
    },
    // 删除
    deleteEm(record) {
      if (!this.canClickBtnMixin("emergencyPlan-del")) {
        return;
      }
      if (record.portalStatus == 2) { // 审批中
        this.$antMessage.warn("流转中不允许删除");
        return;
      }
      this.$antConfirm({
        content: '确认删除？',
        cancelText: '取消',
        onOk: () => {
          drillDeletePlan({
            planId: record.planId
          }).then(res => {
            this.$antMessage.success('删除成功');
            this.page.pageNo = 1;
            this.selectedRowKeys = []
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
    // 待办推送
    async pushTask() {
      let routePath = "/safeManage/emergencyManagement/emergencyDrillManagement/approvePlanHandle";
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + routePath + `&processId=${this.pushPara.processId}`
      if (this.pushPara.handle && this.pushPara.processId) {
        await PushTask({
          title: "应急演练推送待办",
          approval: 'emergencyManagement',
          userId: this.pushPara.handle,
          // docId: this.pushPara.processId ? this.pushPara.processId : this.pushPara.handle,
          taskId: this.pushPara.processId ? this.pushPara.processId : this.pushPara.handle,
          createUserId: JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId,
          url: url,
          // docNumber: undefined,   //业务id
          docId: this.pushPara.processId,  //主键id
        })
      }
    },
  }
}
</script>

<style lang="less" scoped>
.emergency-plan {
  .btn {
    margin-left: 20px;
  }
  .warn-span {
    width: 8px;
    height: 8px;
    display: inline-block;
    border-radius: 50%;
  }
  .warn1 {
    background: #ff1212;
  }
  .warn2 {
    background: #ff9d01;
  }
  .ttips {
    height: 100%;
    display: flex;
    align-items: center;
    .circle-item {
      margin-right: 15px;
    }
  }
}
::v-deep .dashed-btn .upload-btn-style .ant-btn {
  background: #f1f4ff !important;
  color: #0067cc !important;
  border: 1px dashed #9fcaf5 !important;
  margin-right: 10px !important;
  &:hover {
    border: 1px dashed #0067cc !important;
  }
}

.feat {
  padding-right: 0 !important;
}
</style>