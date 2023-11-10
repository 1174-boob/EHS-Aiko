<template>
  <vxe-table
    v-if="isRender"
    ref="vxeTable"
    class="vxe-scrollbar beauty-scroll-fireBox"
    :span-method="rowspanMethod"
    border
    show-overflow
    align="center"
    :data="dataSource"
    show-header-overflow
    :cell-class-name="cellClassName"
    :row-config="{height: 60, isHover: true}"
  >
    <vxe-column field="maturityEvaluationReportType" title="维度" width="120">
      <template #default="{ row }">
        <template v-if="row.isEnd">合计</template>

        <template v-else>
          {{dimensionMatch[row.maturityEvaluationReportType]}}
          <br />
          {{numObj[row.maturityEvaluationReportType]}}项
        </template>
      </template>
    </vxe-column>
    <vxe-column field="project" title="项目" min-width="200"></vxe-column>
    <vxe-column field="score" title="分值" width="100"></vxe-column>

    <vxe-colgroup title="得分明细">
      <vxe-column v-for="item in deptColumn" :field="item.columnField" :title="item.columnTitle" :key="item.columnField" min-width="100"></vxe-column>
    </vxe-colgroup>

    <template #empty>
      <div style="padding:16px 0;">
        <a-empty />
      </div>
    </template>
  </vxe-table>
</template>

<script>
export default {
  props: {
    evaluatResultData: {}
  },
  data() {
    return {
      isRender: false,
      dataSource: [],
      // 维度
      dimensionMatch: {
        prior: '事前',
        inTheMatter: '事中',
        afterTeFact: '事后',
      },
      deptColumn: [],
      scoreMap: {},
    };
  },
  computed: {
    numObj() {
      let numObj = {}
      this.dataSource.forEach(item => {
        numObj[item.maturityEvaluationReportType] = (numObj[item.maturityEvaluationReportType] || 0) + 1
      })
      return numObj
    },
    getMinMaxScore() {
      const values = Object.values(this.scoreMap).filter(item => !isNaN(item));
      const max = Math.max(...values);
      const min = Math.min(...values);
      return { max, min };
    },
  },
  methods: {
    // 合并单元格
    rowspanMethod({ row, _rowIndex, column, _columnIndex, visibleData }) {
      if (_rowIndex == this.dataSource.length - 1) {
        if (_columnIndex === 0) {
          return { rowspan: 1, colspan: 2 }
        } else if (_columnIndex === 1) {
          return { rowspan: 0, colspan: 0 }
        }
      }
      const fields = ['maturityEvaluationReportType'];
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
    },
    // 样式
    cellClassName({ row, column }) {
      if (!['maturityEvaluationReportType', 'project', 'score'].includes(column.field)) {
        if (row[column.field] === '0') {
          return 'col-zero'
        }
      }
      if (row.isEnd) {
        const { max, min } = this.getMinMaxScore
        if (row[column.field] == max) {
          return 'cunt-highest'
        } else if (row[column.field] == min) {
          return 'cunt-minimum'
        }
      }
      return null
    },
    // 处理数据
    handleTableData() {
      this.isRender = false
      const { deptIdList, deptMap, list, scoreMap } = this.evaluatResultData

      this.deptColumn = deptIdList.map(item => {
        return {
          columnField: item + '',
          columnTitle: deptMap[item],
        }
      })
      this.dataSource = [
        ...list,
        {
          ...scoreMap,
          isEnd: true,
          project: '合计',
          score: scoreMap.totalScore,
        }
      ]
      this.scoreMap = {
        ...scoreMap,
        totalScore: undefined,
      }

      setTimeout(() => {
        this.isRender = true
      }, 100);
    }
  },
  watch: {
    evaluatResultData: {
      handler() {
        this.handleTableData()
      },
      deep: true,
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .col-zero {
  background-color: #ff0;
  color: #d9001b;
}
::v-deep .cunt-minimum {
  color: #d9001b;
}
::v-deep .cunt-highest {
  color: #0067cc;
}
</style>
