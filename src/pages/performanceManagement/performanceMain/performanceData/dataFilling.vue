<template>
  <HasFixedBottomWrapper>
    <PageTitle v-if="!(isView || isEdit)">管理绩效数据</PageTitle>
    <a-form-model v-if="!(isView || isEdit)" ref="iForm" :model="iForm" :rules="rules" :colon="false" :label-col="{ style: { width: '80px' }}" :wrapper-col="{ style: { width: 'calc(100% - 80px)' } }">
      <a-row>
        <a-col :span="7">
          <!-- <CommonDept ref="commonDept" :CommonFormInline="iForm" :rules="rules" :notTablePage="true" @corporationChange="corporationChange"></CommonDept> -->
          <a-form-model-item class="flex" label="所属组织" prop="corporationId">
            <a-select v-model="iForm.corporationId" placeholder="请选择所属组织" @change="iFormChange">
              <a-select-option v-for="item in getCommonAddOrgnizeListAll" :key="item.orgId" :value="item.orgId">{{item.orgName}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="7" push="1">
          <a-form-model-item class="flex" label="选择年份" prop="year">
            <a-date-picker v-model="iForm.year" mode="year" format="YYYY" valueFormat="YYYY" @panelChange="yearChange"  />
          </a-form-model-item>
        </a-col>
        <a-col :span="7" push="2">
          <a-form-model-item class="flex" label="选择季度" prop="quarter">
            <a-select v-model="iForm.quarter" placeholder="请选择季度" @change="iFormChange">
              <a-select-option v-for="item in quarterList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <div v-if="reportData && reportData.length">
      <div class="color-666 font-16 text-center" v-if="(!iForm.corporationId) && !(isView || isEdit)">请先选择组织，再进行填报</div>
      <div v-else>
        <div class="color-666 font-16" v-if="reportData && reportData.length">
          <!-- 查看 -->
          <ReportDataTableVue v-if="isView" ref="reportDataTableVue" :reportData="reportData" :corporationMsg="corporationMsg.corporationId ? corporationMsg : undefined" type="view"></ReportDataTableVue>
          <!-- 编辑 -->
          <ReportDataTableVue v-else-if="isEdit" ref="reportDataTableVue" :reportData="reportData" :corporationMsg="corporationMsg.corporationId ? corporationMsg : undefined" type="edit" :hideDownLoad="true"></ReportDataTableVue>
          <!-- 新增-填报绩效报表 -->
          <ReportDataTableVue v-else ref="reportDataTableVue" :reportData="reportData"></ReportDataTableVue>
        </div>
        <div class="color-666 font-16 text-center" v-else>
          该组织还没配置报表
        </div>
      </div>
    </div>
    <div class="color-666 font-16 text-center" v-else>
      请先选择所属组织、年份、季度
    </div>
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button @click="pageCancle">返回</a-button>
          <a-button type="primary" v-if="!isView && (reportData && reportData.length)" :loading="btnLoading" @click="pageSubmit">保存</a-button>
          <a-button :disabled="true" type="primary" v-if="!isView && !(reportData && reportData.length)" :loading="btnLoading">保存</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>
<script>
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import ReportDataTableVue from "../../tpl/reportDataTable.vue";
import { formValidator } from "@/utils/clx-form-validator.js";
import { nanoid } from 'nanoid'
import { getQueryVariable } from "@/utils/util.js"


import { organizationSelectDetail, orgDataSelectDetailBySummary, orgDataSave, orgDataselectDetail, orgDataUpdate } from "@/services/performanceManagement.js";
import { cloneDeep, result } from "lodash";

export default {
  components: {
    FixedBottom,
    ReportDataTableVue
  },
  data() {
    return {
      btnLoading: false,
      projectList: [],
      quarterList: [
        {
          key: "1",
          value: "第一季度"
        },
        {
          key: "2",
          value: "第二季度"
        },
        {
          key: "3",
          value: "第三季度"
        },
        {
          key: "4",
          value: "第四季度"
        },
      ],
      bodyIndexData: {},
      iForm: {},
      rules: {
        corporationId: [
        { required: true, message: "所属组织不能为空", trigger: "change" },
        ],
        year: [
          { required: true, message: "年份不能为空", trigger: "change" },
        ],
        quarter: [
          { required: true, message: "季度不能为空", trigger: "change" },
        ],
      },
      reportData: [],
      corporationMsg: {}
    }
  },
  computed: {
    isView() {
      return this.$route.meta && this.$route.meta.isView
    },
    isEdit() {
      return this.$route.meta && this.$route.meta.isEdit
    },
  },
  created() {
    this.projectList = this.getMappingValue(this.dictTypeData, "dictType", "kpi_project").dictItem;
    for (let i = 0; i < this.projectList.length; i++) {
      this.bodyIndexData[this.projectList[i].dictValue] = {
        projectName: this.projectList[i].dictLabel,
        indexList: [],
      }
    }
    this.bodyIndexData = { ...this.bodyIndexData }
    let paramsMsg = {
        corporationId: (this.$route.query && this.$route.query.corporationId) || getQueryVariable("corporationId"),
        year: (this.$route.query && this.$route.query.year) || getQueryVariable("year"),
        quarter: (this.$route.query && this.$route.query.quarter) || getQueryVariable("quarter"),
      }
    if ((this.isView || this.isEdit) && this.$route.query.id) {
      paramsMsg = {
        id: this.$route.query.id
      }
      this.orgDataselectDetail(paramsMsg, true);
    } else if (paramsMsg.corporationId && paramsMsg.year && paramsMsg.quarter) {
      this.orgDataselectDetail(paramsMsg);
    }
  },
  methods: {
    // 校验组织、年份、季度是否同时存在
    isCanGetDetail() {
      console.log(this.iForm)
      if (this.iForm.corporationId && this.iForm.year && this.iForm.quarter) {
        return true;
      } else {
        return false;
      }
    },
    yearChange(val) {
      this.$set(this.iForm, "year", val.format('YYYY'));
      formValidator.formItemValidate(this, 'year', 'iForm')
      if (this.isCanGetDetail()) {
        this.getReportData();
      }
    },
    iFormChange() {
      console.log("=======")
      if (this.isCanGetDetail()) {
        this.getReportData();
      }
    },
    // 获取该组织下配置的绩效表详情
    getReportData() {
      organizationSelectDetail({
        ...this.iForm
      }).then(res => {
        let result = res.data || {};
        let arr = result.achievementRelationDTOS || [];
        let brr = [];
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr[i].indexIds.length; j++) {
            for (let m = 0; m < arr[i].indexIds[j].deductScoreDTOList.length; m++) {
              brr.push({
                ...arr[i].indexIds[j],
                ...arr[i].indexIds[j].deductScoreDTOList[m],
                sitesNum: 0,
                projectId: arr[i].modular,
                projectScore: arr[i].indexIds[j].riskScore ? arr[i].indexIds[j].riskScore : "--",
              })
              console.log("arr[i].sitesNum.length:"+arr[i].sitesNum.length)
            }
          }
        }
        this.reportData = [ ...brr ];
      }).catch(err => console.log(err))
    },
    // 查看|编辑 填报数据详情
    orgDataselectDetail(paramsMsg, flag) {
      let promiseFn = orgDataSelectDetailBySummary;
      if (flag) {
        promiseFn = orgDataselectDetail;
      }
      promiseFn(paramsMsg).then(res => {
        let result = res.data || {};
        let achievementOrgData = result.achievementOrgData || [];
        let reportData = [];
        this.corporationMsg = {
          corporationId: result.corporationId,
          year: result.year,
          quarter: result.quarter,
        }
        for (let i = 0; i < achievementOrgData.length; i++){
          for (let j = 0; j < achievementOrgData[i].detailDTOS.length; j++) {
            for (let m = 0; m < achievementOrgData[i].detailDTOS[j].deductScoreDTOList.length; m++) {
              let obj = {
                ...achievementOrgData[i],
                ...achievementOrgData[i].detailDTOS[j],
                ...achievementOrgData[i].detailDTOS[j].deductScoreDTOList[m],
                projectId: achievementOrgData[i].modular,
              }
              reportData.push({ ...obj });
            }
          }
        }
        this.reportData = cloneDeep(reportData);
        if (this.reportData.length > 0) {
          this.$nextTick(() => {
            this.$refs.reportDataTableVue.updateFooterEvent(true);
          })
        }
      }).catch(err => console.log(err))
    },
    pageCancle() {
      this.setKeepalive(true)
      this.$router.push("/ehsGerneralManage/performanceManagement/performanceData");
    },
    pageSubmit() {
      let params = {
        level: this.$refs.reportDataTableVue.level,
        score: Number(this.$refs.reportDataTableVue.score),
      }
      if (!this.isEdit) {
        if (!formValidator.formAll(this, 'iForm')) {
          return;
        }
        Object.assign(params, this.iForm);
      } else {
        Object.assign(params, this.corporationMsg);
      }
      let achievementOrgData = [];
      for (let i = 0; i < this.reportData.length; i++) {
        let arr = achievementOrgData.filter(item => {
          return item.modular == this.reportData[i].projectId;
        })
        if (arr.length == 0) {
          achievementOrgData.push({
            modular: this.reportData[i].projectId,
            detailDTOS: [
              {
                id: this.reportData[i].id,
                indexInfo: this.reportData[i].indexInfo,
                riskScore: this.reportData[i].riskScore,
                projectScore: (isNaN(Number(this.reportData[i].projectScore)) || Number(this.reportData[i].projectScore) <0 ) ? 0 : Number(this.reportData[i].projectScore),
                deductScoreDTOList: [
                  {
                    deductPoints: this.reportData[i].deductPoints,
                    unit: this.reportData[i].unit,
                    deductScore: this.reportData[i].deductScore,
                    sitesNum: this.reportData[i].sitesNum,
                    remake: this.reportData[i].remake
                  }
                ]
              }
            ]
          })
        } else {
          for (let j = 0; j < achievementOrgData.length; j++) {
            if (achievementOrgData[j].modular == this.reportData[i].projectId) {
              let brr = achievementOrgData[j].detailDTOS.filter(item => {
                return item.id == this.reportData[i].id;
              }) // 是否有已存在的指标
              if (brr.length == 0) { // 没有
                achievementOrgData[j].detailDTOS.push({
                  id: this.reportData[i].id,
                  indexInfo: this.reportData[i].indexInfo,
                  riskScore: this.reportData[i].riskScore,
                  projectScore: (isNaN(Number(this.reportData[i].projectScore)) || Number(this.reportData[i].projectScore) <0) ? 0 : Number(this.reportData[i].projectScore),
                  deductScoreDTOList: [
                    {
                      deductPoints: this.reportData[i].deductPoints,
                      unit: this.reportData[i].unit,
                      deductScore: this.reportData[i].deductScore,
                      sitesNum: this.reportData[i].sitesNum,
                      remake: this.reportData[i].remake
                    }
                  ]
                })
              } else {
                for (let m = 0; m < achievementOrgData[j].detailDTOS.length; m++) {
                  if (achievementOrgData[j].detailDTOS[m].id == this.reportData[i].id) {
                    achievementOrgData[j].detailDTOS[m].deductScoreDTOList.push({
                      deductPoints: this.reportData[i].deductPoints,
                      unit: this.reportData[i].unit,
                      deductScore: this.reportData[i].deductScore,
                      sitesNum: this.reportData[i].sitesNum,
                      remake: this.reportData[i].remake
                    })
                  }
                }
              }
            }
          }
        }
      }
      params.achievementOrgData = [ ...achievementOrgData ];
      if (!(params.score >= 0 && params.score <= 100)) {
        this.$antMessage.warn("总分范围必须控制在0~100（包含0和100）之内");
        return;
      }
      this.btnLoading = true;
      let promiseFn = orgDataSave;
      let str = "填报成功";
      if (this.isEdit) {
        promiseFn = orgDataUpdate;
        str = "更新成功";
      }
      promiseFn(params).then(res => {
        this.$antMessage.success(str);
        this.$router.push("/ehsGerneralManage/performanceManagement/performanceData");
      }).finally(() => {
        this.btnLoading = false;
      })
    },
  }
}
</script>
<style lang='less' scoped>
/deep/ .ant-calendar-picker{
  width: 100%;
}
</style>