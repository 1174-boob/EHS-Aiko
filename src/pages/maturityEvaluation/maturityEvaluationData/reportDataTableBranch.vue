<template>
  <div>
    <vxe-table
      class="vxe-scrollbar beauty-scroll-fireBox editable-footer"
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
         <!-- <template #default="{ row }">得分</template> -->
      </vxe-column>
      <vxe-column field="purposeOfEstablishment" title="设立目的" min-width="100"></vxe-column>
      <vxe-column field="project" title="项目" width="100"></vxe-column>
      <vxe-column field="definition" title="定义" min-width="100"></vxe-column>
      <vxe-column field="score" title="分值" width="100"></vxe-column>
      <vxe-column field="pointsDeductionFinalScore" title="得分" width="100">
        <template #default="{ row }">得分</template>
      </vxe-column>
      <vxe-column field="calculationDetails" title="计算明细" min-width="150">
        <template #default="{ row }">{{row.calculationDetails}}</template>
      </vxe-column>
      <vxe-column field="pointsDeductionNumber" title="现场情况" width="100">
        <template #default="{ row }">
          <div class="flex align-items-center">
            <vxe-input :disabled="type == 'view'" width="80" type="number" :min="0" v-model="row.pointsDeductionNumber" placeholder="请点击输入现场情况" allowClear @change="(e) => {sitesNumChange(e, row)}"></vxe-input>
            {{row.unit}}
          </div>
        </template>
      </vxe-column>
      <vxe-column field="pointsDeductions" title="扣分分值" width="100"></vxe-column>
      <vxe-column field="fileIdList" title="问题点图片" width="100">
        <template #default="{ row }">
          <div class="flex align-items-center">问题点图片</div>
        </template>
      </vxe-column>
      <vxe-column field="dataSource" title="数据来源" width="100">
        <template #default="{ row }">
          <div class="flex align-items-center">数据来源</div>
        </template>
      </vxe-column>
      <vxe-column field="remarks" title="备注" width="100"></vxe-column>
    </vxe-table>
    <!-- <div class="m-t-20" v-if="startStatus==2&&subFileValue.A">
      备注：A档分值{{subFileValue.A[1]}}-{{subFileValue.A[0]}};
      B档分值{{subFileValue.B[1]}}-{{subFileValue.B[0]}};
      C档分值{{subFileValue.C[1]}}-{{subFileValue.C[0]}}。
    </div> -->
  </div>
</template>
<script>
import rowspanMethod from "@/utils/rowspanMethod.js";
import { BigNumber } from "bignumber.js";
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
  props: {
    reportData: {
      type: Array,
      default: () => []
    },
    // add填报，edit编辑，view查看
    type: {
      type: String,
      default: "add"
    },
    corporationMsg: {
      type: Object,
      default: () => {
        return {};
      }
    },
    hideDownLoad: {
      type: Boolean,
      default: false
    },
    startStatus: {
      type: [String, Number],
      default: '1'
    },
    subFileValue: {
      type: Object,
      default: () => { }
    },
  },
  data() {
    return {
      mergeFooterItems: [
        { row: 0, col: 0, rowspan: 1, colspan: 6 },
        { row: 1, col: 0, rowspan: 1, colspan: 6 },
      ],
      reportLevel: "--",
      score: "",
      level: ""
    }
  },
  created() {
    console.log(this.reportData)
  },
  methods: {
    rowspanMethod: rowspanMethod(['maturityEvaluationReportType', 'project', 'fenzhi', 'pointsDeductionFinalScore', 'remarks']),
    BigNumber,
    footerMethod({ columns, data }) {
      let arr = []
      let score = columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return '最终得分'
        }
        if (['indexId'].includes(column.field)) {
          return sumNum(data, column.field)
        }
        return null
      })
      let files = columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return '分档'
        }
        if (['indexId'].includes(column.field)) {
          let total = sumNum(data, column.field);
          return this.getReportLevel(total);
        }
        return null
      })
      if (this.startStatus == 2) {
        arr = [score, files]
      } else {
        arr = [score]
      }
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
    // 下载
    downLoadReport() {

    },
    toSitesDetail(record) {
      console.log("查看详情");
    }
  }
}
</script>
<style lang='less' scoped>
/deep/ .ant-calendar-picker {
  width: 100%;
}
</style>