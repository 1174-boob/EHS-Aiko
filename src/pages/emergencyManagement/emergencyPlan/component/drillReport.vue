<template>
  <HasFixedBottomWrapper>
    <div class="form-content">
      <a-form-model ref="emForm" :model="emForm" :rules="iRules" :colon="false" :label-col="labelCol" :wrapper-col="wrapperCol">
        <div class="plan-detail m-t-20 border-b-e7">
          <PageTitle>演练计划信息</PageTitle>
          <span v-if="portalStatus">审批状态: {{portalStatus}}</span>
        </div>
        <!-- <div>审批单编号：俺弟大概吧杜甫</div> -->
        <PlanInfo :detailObj="detailObj"></PlanInfo>
        <div class="m-t-20 border-b-e7">
          <PageTitle>演练报告信息</PageTitle>
        </div>
        <a-row class="m-t-20">
          <a-col :span="12">
            <CommonDept
              :disabled="disabled"
              ref="commonDept"
              :CommonFormInline="emForm"
              :notTablePage="true"
              :hasDepartment="true"
              @corporationDeptChange="corporationDeptChange"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              v-show="false"
            ></CommonDept>
            <a-form-model-item class="flex" label="实际演练时间" prop="actualDrillDate">
              <a-date-picker :disabled="disabled" v-model="emForm.actualDrillDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD"></a-date-picker>
            </a-form-model-item>
            <a-form-model-item class="flex" label="实际内部参演部门" prop="innerDepartCode">
              <dept-tree :disabled="disabled" :placeholder="'请选择实际内部参演部门'" v-model="emForm.innerDepartCode" :multiple="true" :deptData="deptData" @change="innerChange" allowClear></dept-tree>
            </a-form-model-item>
            <a-form-model-item class="flex" label="演练现场照片" prop="photoId">
              <upload-can-remove
                :disabled="disabled"
                ref="editModel"
                :multiple="true"
                :maxSize="5"
                :limit="20"
                :headImgs="emForm.headImgs"
                :handleSuccessName="'addFormUploadSuccess'"
                @addFormUploadSuccess="addFormUploadSuccess"
              ></upload-can-remove>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item class="flex" label="参演总人数" prop="joinPeopleNum">
              <a-input type="number" :disabled="disabled" v-model="emForm.joinPeopleNum" placeholder="请输入参演总人数" allowClear></a-input>
            </a-form-model-item>
            <a-form-model-item class="flex" label="实际外部参演单位">
              <a-input :disabled="disabled" v-model="emForm.outDepart" placeholder="请输入实际外部参演单位" allowClear></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <PageTitle>应急演练三个验证</PageTitle>
            <vxe-table border align="center" ref="xTable" :span-method="rowspanMethod" show-overflow :column-config="{resizable: true}" :row-config="{height: 60, isHover: true}" :data="tableData">
              <vxe-column field="purposeCode" title="演练目的" width="300">
                <template #default="{ row }">{{objectiveKey[row.purposeCode]}}</template>
              </vxe-column>
              <vxe-column field="summary" title="演练总结">
                <template #default="{ row }">
                  <a-input :disabled="disabled" v-model="row.summary" placeholder="请输入演练总结" allowClear></a-input>
                </template>
              </vxe-column>
              <vxe-column field="betterMeasure" title="改善对策">
                <template #default="{ row }">
                  <a-input :disabled="disabled" v-model="row.betterMeasure" placeholder="请输入改善对策" allowClear></a-input>
                </template>
              </vxe-column>
              <vxe-column title="操作" width="140" align="center" v-if="!disabled">
                <template #default="{ row , rowIndex}">
                  <a-button class="m-r-15" @click="insertEvent(row.purposeCode, rowIndex)">+</a-button>
                  <a-button @click="deleteEvent(row.purposeCode, rowIndex)" v-if="checkTypeNum(row.purposeCode) > 1">-</a-button>
                </template>
              </vxe-column>
            </vxe-table>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item class="flex m-t-20" label="应急演练报告" prop="fileId">
              <UploadBtnStyle
                v-if="!disabled"
                :disabled="disabled"
                :showAcceptText="true"
                :accept="['.pdf','.ppt','.doc','.xls','.xlsx']"
                :showUploadList="true"
                :fileLists="emForm.fileLists"
                :btnText="'上传文件'"
                :btnType="'default'"
                @handleSuccess="handleSuccess"
              ></UploadBtnStyle>
              <div v-else>
                <div v-if="emForm.fileLists && emForm.fileLists.length == 0">暂无数据</div>
                <div v-else class="file-item cursor-pointer addSuccess" v-for="item in emForm.fileLists" :key="item.id" @click="openFile(item.url)">{{item.name}}</div>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div slot="fixedBottom">
      <!-- 按钮-查看/编辑/新建 -->
      <FixedBottom v-if="drillCode == 'preview' || drillCode == 'edit' || drillCode == 'add'">
        <div>
          <a-button class="m-r-15" @click="goBack">返回</a-button>
          <a-button :loading="btnLoading" v-if="this.drillCode != 'preview'" type="primary" class="m-r-15" @click="confirm('0')">暂存</a-button>
          <a-button :loading="btnLoading" v-if="this.drillCode != 'preview'" type="primary" class="m-r-15" @click="confirm('1')">提交</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
// import { VxeTablePropTypes } from 'vxe-table'
// 通用行合并函数（将相同多列数据合并为一行）
const rowspanMethod = ({ row, _rowIndex, column, visibleData }) => {
  const fields = ['purposeCode']
  const cellValue = row[column.field]
  if (cellValue && fields.includes(column.field)) {
    const prevRow = visibleData[_rowIndex - 1]
    let nextRow = visibleData[_rowIndex + 1]
    if (prevRow && prevRow[column.field] === cellValue) {
      return { rowspan: 0, colspan: 0 }
    } else {
      let countRowspan = 1
      while (nextRow && nextRow[column.field] === cellValue) {
        nextRow = visibleData[++countRowspan + _rowIndex]
      }
      if (countRowspan > 1) {
        return { rowspan: countRowspan, colspan: 1 }
      }
    }
  }
}
const objectiveKey = {
  PrepFeasibility: "验证应急预案可行性",
  ReposeSpeedDealAbility: "验证人员应急响应速度和应急处理能力",
  FullReasonable: "验证应急物资充分性与合理性"
}
// import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import { formValidator } from "@/utils/clx-form-validator.js";
import UploadCanRemove from "@/components/upload/uploadCanRemove.vue";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import PlanInfo from "./planInfo.vue";
import moment from "moment";
import EditableCell from "./EditableCell.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import dictionary from '@/utils/dictionary';
import { addDrillReport, reportEditDrillReport, viewDetailReport, viewDrillPlanReportInfo, PushTask } from "@/services/api.js"
export default {
  mixins: [chemicalDict,],
  components: {
    FixedBottom,
    UploadCanRemove,
    UploadBtnStyle,
    PlanInfo,
    EditableCell,
  },
  props: {
    drillCode: {
      type: String,
      default: 'add'
    },
    planId: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [
        { purposeCode: "PrepFeasibility", purposeName: objectiveKey.PrepFeasibility },
        { purposeCode: "ReposeSpeedDealAbility", purposeName: objectiveKey.ReposeSpeedDealAbility },
        { purposeCode: "FullReasonable", purposeName: objectiveKey.FullReasonable },
      ],
      objectiveKey: objectiveKey,
      rowspanMethod: rowspanMethod,

      addEdit: 'add',
      portalStatus: '',
      planTime: undefined,
      btnLoading: false,

      emergencyLevel: [],
      emergencyForm: [],
      drill_type: [],
      portalStatusList: [],
      prep_level: [],

      labelCol: { style: { width: '136px' } },
      wrapperCol: { style: { width: 'calc(100% - 136px)' } },
      deptData: [],
      fileLists: [],
      detailObj: {},
      emForm: {
        actualDrillDate: null,
      },
      iRules: {
        actualDrillDate: [
          { required: true, message: '实际演练时间不能为空', trigger: "change" },
        ],
        joinPeopleNum: [
          { required: true, validator: this.intValidator, trigger: "change" },
        ],
        innerDepartCode: [
          { required: true, message: '实际内部参演部门不能为空', trigger: "change" },
        ],
        photoId: [
          { required: true, message: "演练现场照片不能为空", trigger: "change" },
        ],
        fileId: [
          { required: true, message: "应急演练报告不能为空", trigger: "change" },
        ],
      },
      hasOldReport: false, // 详情里是否有报告数据，有：提交用更新报告接口  无：提交用新增报告接口
      isPlanEdit: 1, // 是从计划列表里进入的
      pushPara: {},
    }
  },
  created() {
    this.initData();
    this.emergencyLevel = dictionary("emergencyLevel"); //应急演练级别
    this.prep_level = this.getChemicalDictList('prep_level'); //预案级别
    this.emergencyForm = dictionary("emergencyForm"); //应急演练形式
    this.drill_type = this.getChemicalDictList('drill_type'); //应急演练类型
    this.portalStatusList = dictionary("dirllPlanApproveStatus"); // 审批状态
  },
  methods: {
    goBack(){
      this.setKeepalive(true)
      this.$router.go(-1)
    },
    insertEvent(purposeCode, index) {
      let record = { purposeCode: purposeCode, purposeName: this.objectiveKey[purposeCode] };
      this.tableData.splice(index + 1, 0, record);
    },
    deleteEvent(purposeCode, index) {
      this.tableData.splice(index, 1);
    },
    checkTypeNum(purposeCode) {
      return this.tableData.filter((item) => item.purposeCode == purposeCode).length;
    },
    // 初始化数据
    initData() {
      if (this.$route.query.planId) {
        this.echoPlanEdit();
      } else if (this.$route.query.reportId) {
        this.isPlanEdit = 2; // 从报告编辑进入的
        this.echoReportEdit();
      } else {
        this.$antMessage.warn("缺少参数~");
        this.$router.push({ // 报告列表页面
          path: "/safeManage/emergencyManagement/emergencyDrillManagement/emergencyReport"
        })
      }
    },
    // 文件下载
    openFile(filePath) {
      window.open(filePath)
    },
    // 报告-编辑/查看
    echoReportEdit() {
      viewDetailReport({ reportId: this.$route.query.reportId }).then(res => {
        this.hasOldReport = true;
        let resultObj = res.data || {};
        resultObj.innerDepartCode = resultObj.innerDepartCode ? resultObj.innerDepartCode.split(",") : [];
        this.$refs.commonDept.corporationChange(resultObj.corporationId, resultObj.innerDepartCode);
        this.portalStatus = resultObj.portalStatus ? dictionary("dirllPlanApproveStatus", resultObj.portalStatus) : '--';
        let temergentdrillPlan = resultObj.temergentdrillPlan || {};
        this.detailObj = {
          corporationName: temergentdrillPlan.corporationName,
          draft: temergentdrillPlan.draftCode ? (temergentdrillPlan.draftName + '/' + temergentdrillPlan.draftCode) : temergentdrillPlan.draftName,
          draftDepartName: temergentdrillPlan.draftDepartName,
          planDepartName: temergentdrillPlan.planDepartName,
          drillName: temergentdrillPlan.drillName,
          drillTypeCode: this.getMappingValue(this.drill_type, "dictValue", temergentdrillPlan.drillTypeCode).dictLabel,
          planTime: temergentdrillPlan.planTime,
          innerDepartName: temergentdrillPlan.innerDepartName,
          temergentdrillPrep: temergentdrillPlan.temergentdrillPrep,
          drillLevel: this.getMappingValue(this.emergencyLevel, "key", temergentdrillPlan.drillLevel).value,
          drillForm: this.getMappingValue(this.emergencyForm, "key", temergentdrillPlan.drillForm).value,
          outDepart: temergentdrillPlan.outDepart
        }
        let emForm = { ...resultObj };
        // 图片回显
        emForm.photoId = this.handleFileIdS(resultObj.gatherPhotoFiles).join(",");
        emForm.headImgs = this.handleFileRedisplay(resultObj.gatherPhotoFiles);
        // 附件回显
        emForm.fileId = this.handleFileIdS(resultObj.gatherFiles).join(",");
        emForm.fileLists = this.handleFileRedisplay(resultObj.gatherFiles);
        // 表格回显
        this.tableData = (resultObj.prepFeasibility || []).concat(resultObj.reposeSpeedDealAbility || []).concat(resultObj.fullReasonable || [])
        this.emForm = { ...emForm }
      }).catch(err => {
        console.log(err)
      }).finally(() => {

      })
    },
    // 计划-查看报告/录入报告
    echoPlanEdit() {
      viewDrillPlanReportInfo({ planId: this.$route.query.planId }).then(res => {
        let resultObj = res.data || {};
        this.planReportMsg = resultObj;
        this.$refs.commonDept.corporationChange(resultObj.corporationId, resultObj.innerDepartCode);
        this.portalStatus = resultObj.portalStatus ? dictionary("dirllPlanApproveStatus", resultObj.portalStatus) : '--';
        this.detailObj = {
          corporationName: resultObj.corporationName,
          draft: resultObj.draftCode ? (resultObj.draftName + '/' + resultObj.draftCode) : resultObj.draftName,
          draftDepartName: resultObj.draftDepartName,
          planDepartName: resultObj.planDepartName,
          drillName: resultObj.drillName,
          drillTypeCode: this.getMappingValue(this.drill_type, "dictValue", resultObj.drillTypeCode).dictLabel,
          planTime: resultObj.planTime,
          innerDepartName: resultObj.innerDepartName,
          temergentdrillPrep: resultObj.temergentdrillPrep,
          drillLevel: this.getMappingValue(this.emergencyLevel, "key", resultObj.drillLevel).value,
          drillForm: this.getMappingValue(this.emergencyForm, "key", resultObj.drillForm).value,
          outDepart: resultObj.outDepart
        }
        if (resultObj.temergentdrillReport) {
          this.hasOldReport = true;
          let temergentdrillReport = resultObj.temergentdrillReport || {};
          temergentdrillReport.innerDepartCode = temergentdrillReport.innerDepartCode ? temergentdrillReport.innerDepartCode.split(",") : [];
          let emForm = {
            ...temergentdrillReport,
            planId: resultObj.planId,
            centerId: resultObj.centerId,
            centerName: resultObj.centerName,
            corporationId: resultObj.corporationId,
            corporationName: resultObj.corporationName,
          };
          // 图片回显
          emForm.photoId = this.handleFileIdS(temergentdrillReport.gatherPhotoFiles).join(",");
          emForm.headImgs = this.handleFileRedisplay(temergentdrillReport.gatherPhotoFiles);
          // 附件回显
          emForm.fileId = this.handleFileIdS(temergentdrillReport.gatherFiles).join(",");
          emForm.fileLists = this.handleFileRedisplay(temergentdrillReport.gatherFiles); // 附件回显'
          // 表格回显
          this.tableData = (temergentdrillReport.prepFeasibility || []).concat(temergentdrillReport.reposeSpeedDealAbility || []).concat(temergentdrillReport.fullReasonable || [])
          this.emForm = { ...emForm }
        } else {
          this.emForm = {
            centerId: resultObj.centerId,
            centerName: resultObj.centerName,
            corporationId: resultObj.corporationId,
            corporationName: resultObj.corporationName,
            planId: resultObj.planId,
          };
        }
      }).catch(err => {
        console.log(err)
      }).finally(() => {

      })
    },
    // 处理文件id
    handleFileIdS(list) {
      list = list ? list : []
      let ids = list.map(item => {
        return item.id
      })
      ids = ids ? ids : []
      return ids
    },
    // 处理文件回显
    handleFileRedisplay(list) {
      list = list ? list : []
      let fileList = []
      list.forEach(item => {
        let itemObj = {
          id: item.id,
          uid: item.id,
          name: item.sourceFileName,
          status: 'done',
          url: item.filePath,
        }
        fileList.push(itemObj)
      })
      return fileList
    },
    // 获取组织下所有部门
    corporationDeptChange(value) {
      this.deptData = value;
    },
    innerChange(id, name) {
      this.$set(this.emForm, "innerDepart", name && name.join(','))
    },
    // 演练现场照片上传
    addFormUploadSuccess(fileList) {
      let arr = [];
      // let photoIds = this.handleFileIdS(fileList).join(',');
      for(let i = 0;i < fileList.length;i++) {
        arr.push(fileList[i].id)
      }
      this.$set(this.emForm, "photoId", arr.join(','));
      formValidator.formItemValidate(this, "photoId", "emForm")
    },
    // 文件成功上传回调
    handleSuccess(data) {
      this.fileLists = data;
      const idList = [];
      for (let value of data) {
        let id = value.response ? value.response.data.id : value.id;
        idList.push(id);
      }
      this.$set(this.emForm, "fileId", idList.join(','));
      formValidator.formItemValidate(this, 'fileId', 'emForm');
    },

    // 提交
    confirm(operationType) { //0暂存（为草稿）  1提交（进入审批生成审批单）
      for (let i = 0; i < this.tableData.length; i++) {
        if (!this.tableData[i].summary) {
          this.$antMessage.warn("演练总结必须填写");
          return;
        }
      }
      if (!formValidator.formAll(this, 'emForm')) {
        return;
      }
      const params = {
        ...this.emForm,
        operationType,
        isPlanEdit: this.isPlanEdit,
        prepFeasibility: this.tableData.filter(item => item.purposeCode == "PrepFeasibility"),
        reposeSpeedDealAbility: this.tableData.filter(item => item.purposeCode == "ReposeSpeedDealAbility"),
        fullReasonable: this.tableData.filter(item => item.purposeCode == "FullReasonable"),
      };
      let promise = addDrillReport;// 编辑
      if (this.hasOldReport) { // 之前就有报告数据，再次点击时用更新报告
        promise = reportEditDrillReport;
      }
      this.btnLoading = true;
      if (params.innerDepartCode && Array.isArray(params.innerDepartCode)) {
        params.innerDepartCode = params.innerDepartCode.join(",");
      }
      promise(params).then((res) => {
        this.$antMessage.success("操作成功");
        if (this.$route.query && this.$route.query.from == "1") { // 计划列表进入的
          this.$router.replace("/safeManage/emergencyManagement/emergencyDrillManagement/emergencyPlan");
        } else { // 报告列表进入的
          this.$router.replace("/safeManage/emergencyManagement/emergencyDrillManagement/emergencyReport");
        }
        if (operationType == 1) { // 提交
          this.pushPara = res.data || {};
          this.pushTask();
        }
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.btnLoading = false;
      })

    },
    // 待办推送
    async pushTask() {
      let routePath = "/safeManage/emergencyManagement/emergencyDrillManagement/approveReportHandle";
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + routePath + `&processId=${this.pushPara.processId}`
      if (this.pushPara.handle && this.pushPara.processId) {

        await PushTask({
          title: "应急演练推送待办",
          approval: 'emergencyManagement',
          userId: this.pushPara.handle,
          // docId: this.pushPara.processId ? this.pushPara.processId : this.pushPara.handle,
          taskId: this.pushPara.processId ? this.pushPara.processId : this.pushPara.handle,
          url: url,
          docNumber: this.emForm?.reportNumber,   //业务id
          docId: this.pushPara.processId,  //主键id
        })
      }
    },
    // 整数类型校验
    intValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("参演总人数不能为空");
      } else if (/\D+/g.test(value)) {
        return Promise.reject("只能输入正整数");
      } else if (value * 1 <= 0) {
        return Promise.reject("只能输入正整数");
      } else {
        callback();
      }
    },


  }
}
</script>

<style lang="less" scoped>
.plan-detail {
  display: flex;
  align-items: center;
  span {
    margin-left: 20px;
    margin-bottom: 10px;
    display: inline-block;
  }
}
.file-list {
  margin-bottom: 10px;
  .file-list-title {
    margin-bottom: 10px;
  }
  .file-item {
    cursor: pointer;
    margin-bottom: 10px;
    color: #0067cc;
    &:last-child {
      margin-bottom: 0px;
    }
    & > img {
      max-width: 100%;
      margin-bottom: 10px;
    }
  }
}
</style>