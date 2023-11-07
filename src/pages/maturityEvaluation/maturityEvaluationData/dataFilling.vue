<template>
  <HasFixedBottomWrapper>
    <template description="基本信息">
      <div class="base-info">
        <div class="base-info-left">
          <span>组织：{{baseIfo.corporationName}}</span>
          <span>部门：{{baseIfo.deptName}}</span>
          <span>年份：{{baseIfo.year}}</span>
          <span>月份：{{baseIfo.month}}月</span>
        </div>
        <div class="base-info-reight"></div>
      </div>
    </template>

    <div>
      <div class="color-666 font-16" v-if="reportData && reportData.length">
        <!-- <ReportDataTableVue ref="reportDataTableVue" :startStatus="startStatus" :subFileValue="subFileValue" :reportData="reportData"></ReportDataTableVue> -->

        <vxe-table
          class="me-data-filling vxe-scrollbar beauty-scroll-fireBox editable-footer"
          border
          align="center"
          ref="xTable"
          show-footer
          show-overflow
          :span-method="rowspanMethod"
          :footer-method="footerMethod"
          :merge-footer-items="mergeFooterItems"
          :edit-config="{trigger: 'click', mode: 'cell'}"
          :column-config="{resizable: true}"
          :row-config="{height: 60, isHover: true}"
          :data="reportData"
        >
          <vxe-column field="maturityEvaluationReportType" title="维度" width="100">
            <template #default="{ row }">{{dimensionMatch[row.maturityEvaluationReportType]}}</template>
          </vxe-column>
          <vxe-column field="purposeOfEstablishment" title="设立目的" min-width="200"></vxe-column>
          <vxe-column field="typeAndproject" title="项目" min-width="200">
            <template #default="{ row }">
              {{row.project}}
            </template>
          </vxe-column>
          <vxe-column field="definition" title="定义" min-width="200"></vxe-column>
          <vxe-column field="typeAndproject" title="分值" width="100">
            <template #default="{ row }">
              {{row.score}}
            </template>
          </vxe-column>
          <vxe-column field="typeAndproject" title="得分" width="100">
            <template #default="{ row }">
              {{row.pointsDeductionFinalScore}}
            </template>
          </vxe-column>
          <vxe-column field="calculationDetails" title="计算明细" min-width="240" :show-overflow="false"></vxe-column>
          <vxe-column field="pointsDeductionNumber" title="现场情况" min-width="200">
            <template #default="{ row }">
              <div class="points-deduction">
                <vxe-input
                  class-name="points-deduction-input"
                  type="number"
                  :min="0"
                  v-model="row.pointsDeductionNumber"
                  placeholder="请点击输入"
                  :controls="false"
                  allowClear
                  @change="(e) => {sitesNumChange(e, row)}"
                ></vxe-input>
                <span class="points-deduction-unit">{{row.indicatorUnit}}</span>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="pointsDeductions" title="扣分分值" width="100"></vxe-column>
          <vxe-column field="fileIdList" title="问题点图片" min-width="200" :show-overflow="false">
            <template #default="{ row }">
              <UploadCanRemove ref="fileIdListRef" :maxSize="5" :limit="20" :headImgs="[]" @handleSuccess="(fileList)=> fileIdListRefSuccess(row,fileList)"></UploadCanRemove>
            </template>
          </vxe-column>
          <vxe-column field="dataSource" title="数据来源" min-width="140">
            <template #default="{ row }">
              <a-select style="width:100px;" v-model="row.dataSource" placeholder="请选择">
                <a-select-option v-for="item in dataSourceList" :key="item.sourceKey" :value="item.sourceKey">{{item.sourceLable}}</a-select-option>
              </a-select>
            </template>
          </vxe-column>
          <vxe-column field="remarks" title="备注" min-width="200"></vxe-column>
        </vxe-table>
      </div>
      <div class="color-666 font-16 text-center" v-else>该组织还没配置报表</div>
    </div>

    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button @click="pageCancle">返回</a-button>
          <a-button type="primary" v-if="!isView" :loading="loading" @click="pageSubmit">保存</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import ReportDataTableVue from "./reportDataTableBranch.vue";
import { formValidator } from "@/utils/clx-form-validator.js";
import { nanoid } from 'nanoid'
import { getQueryVariable } from "@/utils/util.js"
import dayJs from "dayjs";
import { getMaturityEvaDataConfigDetails, fillInAchDeptData, viewAchDeptData, editAchDeptData } from "@/services/maturityEvaluation.js";
import { cloneDeep } from "lodash";
import { getDictTarget } from "@/utils/dictionary";
import cancelLoading from '@/mixin/cancelLoading';
import rowspanMethod from "@/utils/rowspanMethod.js";
import { BigNumber } from "bignumber.js";
import UploadCanRemove from './uploadCanRemove.vue';
const sumNum = (list, field) => {
  let count = 0;
  let obj = {};
  list.forEach(item => {
    obj[item.indexId] = item.projectScore;
  })
  for (let key in obj) {
    if (!isNaN(Number(obj[key]))) {
      count = BigNumber(count).plus(Number(obj[key]));
    }
  }
  return count;
}
export default {
  components: { FixedBottom, ReportDataTableVue,UploadCanRemove },
  mixins: [cancelLoading],
  data() {
    return {
      // 基本信息
      baseIfo: {},

      corporationMsg: {},

      startStatus: '1',
      subFileValue: {},
      // 维度
      dimensionMatch: {
        prior: '事前',
        inTheMatter: '事中',
        afterTeFact: '事后',
      },
      reportData: [],

      mergeFooterItems: [
        { row: 0, col: 0, rowspan: 1, colspan: 5 },
        { row: 0, col: 5, rowspan: 1, colspan: 6 },
        { row: 1, col: 0, rowspan: 1, colspan: 5 },
        { row: 1, col: 5, rowspan: 1, colspan: 6 },
      ],
      dataSourceList:[
        {
          sourceKey:1,
          sourceLable:'现场',
        },
        {
          sourceKey:2,
          sourceLable:'环安',
        },
        {
          sourceKey:3,
          sourceLable:'现场+环安',
        },
      ]
    }
  },
  created() {
    this.baseIfo = JSON.parse(sessionStorage.getItem('ehs_aiko_maturityEvaluationDataFilling') || '{}')
    this.getDetals()
  },
  computed: {
    isAdd() {
      return this.$route.meta && this.$route.meta.isAdd
    },
    isView() {
      return this.$route.meta && this.$route.meta.isView
    },
    isEdit() {
      return this.$route.meta && this.$route.meta.isEdit
    },
  },
  methods: {
    rowspanMethod: rowspanMethod(['maturityEvaluationReportType', 'typeAndproject']),
    // 获取详情
    getDetals() {
      const apiData = {
        ...this.baseIfo
      }
      console.log('apiData', apiData);
      getMaturityEvaDataConfigDetails(apiData)
        .then(res => {
          const resData = cloneDeep(res.data)
          this.baseIfo = resData
          this.reportData = (resData.itemList || []).map(item => {
            return {
              ...item,
              typeAndproject:`${item.maturityEvaluationReportType}_${item.project}`
            }
          })
          return
          let result = res.data || {};
          let arr = result.achievementRelationDTOS || [];
          let dispose = item => {
            let obj = []
            item.indexItems.forEach(i => {
              //（安全：safe 消防：fire_control 环境：environment 职业健康：occupational_health 其他管理事项：other_management）
              let info = {}
              if (projectId == 1) {
                info.moduleKey = 'safe'
                info.module = '安全'
              } else if (projectId == 2) {
                info.moduleKey = 'fire_control'
                info.module = '消防'
              } else if (projectId == 3) {
                info.moduleKey = 'environment'
                info.module = '环境'
              } else if (projectId == 4) {
                info.moduleKey = 'occupational_health'
                info.module = '职业健康'
              } else {
                info.moduleKey = 'other_management'
                info.module = '其他管理事项'
              }
              obj.push({ ...item, ...i, projectId: projectId, sitesNum: 0, ...info, sort: sort, projectScore: item.riskScore })
            })
            sort++
            return obj
          }
          let sort = 1;
          let projectId = 1;
          let safeIndexData = result.safeIndexData.map(dispose).flat(1)
          projectId = 2;
          let fireIndexData = result.fireIndexData.map(dispose).flat(1)
          projectId = 3
          let environmentIndexData = result.environmentIndexData.map(dispose).flat(1)
          projectId = 4
          let healthIndexData = result.healthIndexData.map(dispose).flat(1)
          projectId = 5
          let otherIndexData = result.otherIndexData.map(dispose).flat(1)
          let brr = [...safeIndexData, ...fireIndexData, ...environmentIndexData, ...healthIndexData, ...otherIndexData];
          // console.log(safeIndexData.flat(2))
          this.startStatus = result.startStatus.toString()
          if (result.startStatus == '2') {
            this.subFileValue = {
              A: [result.levelAOneScore, result.levelATwoScore],
              B: [result.levelBOneScore, result.levelBTwoScore],
              C: [result.levelCOneScore, result.levelCTwoScore]
            }
          }
          this.reportData = brr;
          // console.log(JSON.stringify(this.reportData[0]))
          if (this.reportData.length) {
            this.$nextTick(() => {
              this.$refs.reportDataTableVue.updateFooterEvent();
            })
          }

          // let a = ''

        })
        .catch(err => { })
    },

    // 图片上传
    fileIdListRefSuccess(row,fileList) {
      // console.log('图片上传',row,fileList);
      row.fileIdList = fileList.map(item => item.id)
    },

    
    footerMethod({ columns, data }) {
      let arr = []
      let score = columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return '最终得分'
        }
        if (['typeAndproject'].includes(column.property)) {
          return '100'
        }
        return null
      })
      let files = columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return '分档'
        }
        if (['typeAndproject'].includes(column.property)) {
          return 'C'
        }
        return null
      })
      arr = [score, files]
      return arr
    },
    // 根据项目得分计算分档
    getReportLevel(total) {
      this.score = total;
      // for (let i = 0; i < this.reportData.length; i++) {
      //     if (this.reportData[i].project == 1 && (this.reportData[i].pointsDeductionNumber && this.reportData[i].pointsDeductionNumber > 0)) {
      //         this.reportLevel = "C档";
      //         this.level = "C档";
      //         return "C档";
      //     }
      // }
      this.subFileValue
      if (typeof (Number(total)) != "number") {
        this.reportLevel = "--";
        this.level = "";
        return;
      }
      let localTotal = Number(total)
      console.log(this.startStatus)
      if (this.startStatus == 1) {
        return ''
      }
      // console.log(Number(this.subFileValue.B[0]) <= localTotal, localTotal >= Number(this.subFileValue.B[1]))
      if (localTotal >= Number(this.subFileValue.A[1])) {
        this.reportLevel = "A档";
        this.level = "A档";
        return "A档";
      } else if (localTotal <= Number(this.subFileValue.B[0]) && localTotal >= Number(this.subFileValue.B[1])) {
        this.reportLevel = "B档";
        this.level = "B档";
        return "B档";
      } else {
        this.reportLevel = "C档";
        this.level = "C档";
        return "C档";
      }
    },
    // 更新表尾数据
    updateFooterEvent() {
      console.log(111)
      this.$nextTick(() => {
        this.$refs.xTable.updateFooter();
      })
    },
    // 现场情况改变事件
    sitesNumChange(a, b) {
      let arr = this.reportData.filter(item => {
        return item.indexId == b.indexId;
      })
      if (arr.length) {
        let brr = [];
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].pointsDeductionNumber && arr[i].deductScore) {
            brr.push(Number(BigNumber(arr[i].pointsDeductionNumber).multipliedBy(arr[i].deductScore)))
          }
        }
        let num = Number(BigNumber(arr[0].riskScore).minus(BigNumber.sum(...brr))) < 0 ? 0 : Number(BigNumber(arr[0].riskScore).minus(BigNumber.sum(...brr)));
        if (num < 0) {
          this.$antMessage.warn("每项指标的扣分分值不得超过风险分值");
        }
        for (let i = 0; i < arr.length; i++) {
          this.reportData.forEach(item => {
            if (item.indexId == arr[i].indexId) {
              item.projectScore = isNaN(num) ? "--" : Number(num);
            }
          })
        }
        console.log(this.reportData)
        this.updateFooterEvent();
      }
    },






    pageCancle() {
      this.setKeepalive(true)
      this.$router.push("/ehsGerneralManage/maturityEvaluation/maturityEvaluationData");
    },
    pageSubmit() {
      let params = {
        level: this.$refs.reportDataTableVue.level,
        score: Number(this.$refs.reportDataTableVue.score),
      }
      if (!this.isEdit) {
        if (!formValidator.formAll(this, 'formInline')) {
          return;
        }
        Object.assign(params, this.formInline);
      } else {
        Object.assign(params, this.corporationMsg);
        params.achDataDetailList = cloneDeep(this.reportData).map(i => {
          i.scene = i.sitesNum
          i.projectScore = Number(i.projectScore) < 0 ? 0 : Number(i.projectScore)
          return i

        })
        if (this.startStatus == 2) {
          params.remark = JSON.stringify(this.subFileValue)
        }
        //负值不让提交
        let b = params.achDataDetailList.some(i => {
          if (i.projectScore < 0) {
            return true
          } else {
            return false
          }

        })
        if (b) {
          this.$antMessage.error("每项指标的扣分分值不得超过风险分值");
          return false
        }

        editAchDeptData(params).then(res => {
          this.$antMessage.success("修改成功");
          this.$router.push({
            path: "/ehsGerneralManage/orgPerformanceManage/performanceBranchData"
          })
        })
        return false
      }
      // achDataDetailList
      params.achDataDetailList = cloneDeep(this.reportData).map(i => {
        i.scene = i.sitesNum
        delete i.id //= ''
        delete i.indexItems
        i.projectScore = Number(i.projectScore) < 0 ? 0 : Number(i.projectScore)
        // i.sumDeductScore = Number(i.sumDeductScore)
        return i
      })
      if (this.startStatus == 2) {
        params.remark = JSON.stringify(this.subFileValue)
      }
      //负值不让提交
      let b = params.achDataDetailList.some(i => {
        if (i.projectScore < 0) {
          return true
        } else {
          return false
        }

      })
      if (b) {
        this.$antMessage.error("每项指标的扣分分值不得超过风险分值");
        return false
      }
      fillInAchDeptData(params).then(res => {
        this.$antMessage.success("填报成功");
        this.$router.push({
          path: "/ehsGerneralManage/orgPerformanceManage/performanceBranchData"
        })
      })
    },
  }
}
</script>

<style lang='less' scoped>
.me-data-filling {
  ::v-deep .vxe-input--inner {
    cursor: auto;
  }
}

.base-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0px 30px;
  line-height: 1;
  .base-info-left {
    & > span {
      margin-right: 20px;
      font-size: 15px;
      font-weight: bold;
    }
  }
  .base-info-reight {
  }
}
.points-deduction {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .points-deduction-input {
    flex: 1;
    margin-right: 10px;
  }
  .points-deduction-unit {
    flex: none;
    width: 2.5em;
    text-align: left;
  }
}
</style>