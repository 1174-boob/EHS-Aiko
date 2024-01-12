<template>
  <HasFixedBottomWrapper>
    <a-spin :spinning="loadingThree" wrapperClassName="a-spin">
      <template description="基本信息">
        <div class="base-info">
          <div class="base-info-left">
            <span>组织：{{baseIfo.corporationName}}</span>
            <span>部门：{{baseIfo.deptName}}</span>
            <span>年份：{{baseIfo.year}}</span>
            <span>月份：{{baseIfo.month}}月</span>
          </div>
          <div class="base-info-reight">
            <div class="base-info-reight-subGear" v-if="this.baseIfo.scorePositionStatus">分档：{{subGear}}档</div>
            <a-button type="primary" :loading="loadingTwo" @click="exportTable">下载</a-button>
          </div>
        </div>
      </template>

      <div>
        <div class="color-666 font-16" v-if="reportData && reportData.length">
          <vxe-table
            class="me-data-filling vxe-scrollbar beauty-scroll-fireBox editable-footer"
            border
            align="center"
            ref="xTable"
            show-footer
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
            <vxe-column field="typeAndProject" title="设立目的" min-width="200">
              <template #default="{ row }">{{row.purposeOfEstablishment}}</template>
            </vxe-column>
            <vxe-column field="typeAndProject" title="项目" min-width="200">
              <template #default="{ row }">{{row.project}}</template>
            </vxe-column>
            <vxe-column field="maturityEvaluationIndexId" title="定义" min-width="200">
               <template #default="{ row }">{{row.definition}}</template>
            </vxe-column>
            <vxe-column field="maturityEvaluationIndexId" title="分值" width="100">
              <template #default="{ row }">{{row.score}}</template>
            </vxe-column>
            <vxe-column field="maturityEvaluationIndexId" title="得分" width="100">
              <template #default="{ row }">{{row.pointsDeductionFinalScore}}</template>
            </vxe-column>
            <vxe-column field="calculationDetails" title="计算明细" min-width="240" :show-overflow="false"></vxe-column>

            <template v-if="isView">
              <vxe-column field="pointsDeductionNumber" title="现场情况" min-width="100">
                <template #default="{ row }">
                  <span>{{row.pointsDeductionNumber}} {{row.indicatorUnit}}</span>
                </template>
              </vxe-column>
            </template>

            <template v-else>
              <vxe-column field="pointsDeductionNumber" title="现场情况" min-width="200">
                <template #default="{ row }">
                  <div class="points-deduction">
                    <a-input-number class="points-deduction-input" :value="row.pointsDeductionNumber" :precision="0" :min="0" :controls="false" @change="(e) => {sitesNumChange(e, row)}" />
                    <span class="points-deduction-unit">{{row.indicatorUnit}}</span>
                  </div>
                </template>
              </vxe-column>
            </template>

            <vxe-column field="pointsDeductions" title="扣分分值" width="100"></vxe-column>
            <vxe-column field="fileIdList" title="问题点图片" min-width="200" :show-overflow="false">
              <template #default="{ row }">
                <UploadCanRemove ref="fileIdListRef" :maxSize="5" :limit="20" :disabled="isView" :headImgs="row._fileListShow || []" @handleSuccess="(fileList)=> fileIdListRefSuccess(row,fileList)"></UploadCanRemove>
                <span v-if="isView && row._fileListShow.length == 0">--</span>
              </template>
            </vxe-column>
            <vxe-column field="dataSource" title="数据来源" min-width="140">
              <template #default="{ row }">
                <template v-if="isView">{{row.dataSourceStr || '--'}}</template>

                <template v-else>
                  <a-select style="width:100%;" v-model="row.dataSource" placeholder="请选择">
                    <a-select-option v-for="item in dataSourceList" :key="item.sourceKey" :value="item.sourceKey">{{item.sourceLable}}</a-select-option>
                  </a-select>
                </template>
              </template>
            </vxe-column>
            <vxe-column field="itemRemarks" title="备注" min-width="230">
              <template #default="{ row }" v-if="!isView">
                <div style="padding: 8px 0;">
                  <a-textarea v-if="!loadingThree" placeholder="请输入备注" v-model="row.itemRemarks" :maxLength="300" autoSize />
                </div>
              </template>
            </vxe-column>
          </vxe-table>
          <div class="table-remark" v-if="this.baseIfo.scorePositionStatus">备注： A：95分(含以上)； B：85分(含)~95分； C：85分以下</div>
        </div>
        <div class="color-666 font-16 text-center" v-else>该组织还没配置报表</div>
      </div>
    </a-spin>

    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button @click="goBack">返回</a-button>
          <a-button type="primary" v-if="!isView" :loading="loading" @click="onSubmit">保存</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import { rmDuplicatesByKey } from "@/utils/util.js";
import { getMaturityEvaDataConfigDetails, fillMaturityEvaDataConfigData, exportMaturityEvaDataConfigData } from "@/services/maturityEvaluation.js";
import { cloneDeep } from "lodash";
import cancelLoading from '@/mixin/cancelLoading';
import rowspanMethod from "@/utils/rowspanMethod.js";
import { BigNumber } from "bignumber.js";
import UploadCanRemove from './uploadCanRemove.vue';
export default {
  components: { FixedBottom, UploadCanRemove },
  mixins: [cancelLoading],
  data() {
    return {
      // 基本信息
      baseIfo: {},
      // 维度
      dimensionMatch: {
        prior: '事前',
        inTheMatter: '事中',
        afterTeFact: '事后',
      },
      reportData: [],
      dataSourceList: [
        {
          sourceKey: '1',
          sourceLable: '现场',
        },
        {
          sourceKey: '2',
          sourceLable: '环安',
        },
        {
          sourceKey: '3',
          sourceLable: '现场+环安',
        },
      ]
    }
  },
  created() {
    this.baseIfo = JSON.parse(sessionStorage.getItem('ehs_aiko_maturityEvaluationDataFilling') || '{}')
    this.handleLoadingThree()
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
    mergeFooterItems() {
      let mergeFooterItemsArr = [
        { row: 0, col: 0, rowspan: 1, colspan: 5 },
        { row: 0, col: 5, rowspan: 1, colspan: 6 },
      ]
      if (this.baseIfo.scorePositionStatus) {
        mergeFooterItemsArr = [
          ...mergeFooterItemsArr,
          { row: 1, col: 0, rowspan: 1, colspan: 5 },
          { row: 1, col: 5, rowspan: 1, colspan: 6 },
        ]
      }
      return mergeFooterItemsArr
    },
    // 最终得分
    finalScore() {
      return rmDuplicatesByKey(this.reportData, 'pointsDeductionFinalScore')  // maybe 出问题 原来的typeAndProject
        .reduce((acc, curr) => BigNumber(acc).plus(curr.pointsDeductionFinalScore).toString(), 0)
    },
    // 分档
    subGear() {
      if (this.baseIfo.scorePositionStatus) {
        const { aTwoScore, bTwoScore } = this.baseIfo
        if (Number(this.finalScore) >= Number(aTwoScore)) {
          return 'A'
        } else if (Number(this.finalScore) >= Number(bTwoScore)) {
          return 'B'
        } else {
          return 'C'
        }
      }
      return '--'
    }
  },
  methods: {
    rowspanMethod: rowspanMethod(['maturityEvaluationReportType', 'typeAndProject','maturityEvaluationIndexId','maturityEvaluationIndexItemId']),
    // 获取详情
    getDetals() {
      const apiData = {
        ...this.baseIfo
      }
      getMaturityEvaDataConfigDetails(apiData)
        .then(res => {
          const resData = cloneDeep(res.data)
          this.baseIfo = resData
          this.reportData = (resData.itemList || []).map(item => {
            return {
              ...item,
              typeAndProject: `${item.maturityEvaluationReportType}_${item.project}`,
              dataSourceStr: this.dataSourceList.find(dSItem => dSItem.sourceKey == item.dataSource)?.sourceLable,
              _fileListShow: (item.gatherFileList || []).map(fileItem => {
                return {
                  uid: fileItem.id,
                  id: fileItem.id,
                  name: fileItem.fileName,
                  status: 'done',
                  url: fileItem.filePath,
                }
              }),
            }
          })
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoadingThree(300)
        })
    },

    // 下载-导出excel
    exportTable() {
      let apiData = {
        maturityEvaluationDataId: this.baseIfo.maturityEvaluationDataId,
      }
      this.handleLoadingTwo()
      exportMaturityEvaDataConfigData(apiData)
        .then(res => {
          this.spreadSheetExcel(res, "成熟度评价数据");
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoadingTwo(300)
        })
    },

    // 图片上传
    fileIdListRefSuccess(row, fileList) {
      row.fileIdList = fileList.map(item => item.id)
      row._fileListShow = fileList
    },

    footerMethod({ columns, data }) {
      let arr = [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '最终得分'
          }
          if (['typeAndProject'].includes(column.property)) {
            return this.finalScore
          }
          return null
        })
      ]
      if (this.baseIfo.scorePositionStatus) {
        arr.push(
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return '分档'
            }
            if (['typeAndProject'].includes(column.property)) {
              return this.subGear
            }
            return null
          })
        )
      }
      return arr
    },

    // 更新表尾数据
    updateFooterEvent() {
      this.$nextTick(() => {
        this.$refs.xTable.updateFooter();
      })
    },

    // 现场情况改变事件
    sitesNumChange(e, row) {
      const value = e
      row.pointsDeductionNumber = value || 0
      row.pointsDeductionNumberScore = BigNumber(row.pointsDeductionNumber).times(row.pointsDeductions).toNumber()

      const { score, maturityEvaluationReportType, project, maturityEvaluationIndexId } = row
      const deductionScore = this.reportData
        .filter(item => item.maturityEvaluationReportType == maturityEvaluationReportType && item.maturityEvaluationIndexId == maturityEvaluationIndexId && item.project == project)
        .reduce((acc, curr) => BigNumber(acc).plus(curr.pointsDeductionNumberScore).toNumber(), 0)

      this.reportData.forEach(item => {
        if (item.maturityEvaluationReportType == maturityEvaluationReportType && item.maturityEvaluationIndexId == maturityEvaluationIndexId && item.project == project) {
          const pointsDeductionFinalScore = BigNumber(score).minus(deductionScore).toNumber()
          item.pointsDeductionFinalScore = pointsDeductionFinalScore < 0 ? 0 : pointsDeductionFinalScore
        }
      })

      this.updateFooterEvent();
    },

    // 返回
    goBack() {
      this.setKeepalive(true)
      this.$router.push("/ehsGerneralManage/maturityEvaluation/maturityEvaluationData");
    },

    // 提交
    onSubmit() {
      // 检查数据来源
      const hasEmptyDataSource = this.reportData.some(item => !Boolean(item.dataSource))
      if (hasEmptyDataSource) {
        this.$antMessage.warn("您有数据来源未进行选择！");
        return
      }
      let apiData = {
        ...this.baseIfo,
        finalScore: this.finalScore,
        itemList: this.reportData,
      }
      this.handleLoading()
      fillMaturityEvaDataConfigData(apiData)
        .then(res => {
          this.$antMessage.success("保存成功");
          this.$router.push({
            path: "/ehsGerneralManage/maturityEvaluation/maturityEvaluationData"
          })
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoading(300)
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
.table-remark {
  padding: 15px 0 20px;
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
    .base-info-reight-subGear {
      margin-right: 15px;
      font-weight: bold;
    }
    flex: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
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

::v-deep .a-spin {
  display: flex;
  flex: 1;
  overflow: hidden;
  .ant-spin-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .ant-spin-blur {
    opacity: 0.06 !important;
  }
}
</style>