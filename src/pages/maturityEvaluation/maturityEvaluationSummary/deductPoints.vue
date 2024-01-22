<template>
  <vxe-table 
    ref="vxeTable" 
    class="vxe-scrollbar beauty-scroll-fireBox" 
    border show-overflow 
    align="center" 
    :data="dataSource" 
    show-header-overflow 
    :row-config="{ isHover: true }"
  >
    <vxe-column title="序号" width="80">
      <template #default="{ _rowIndex }">
       {{_rowIndex+1}}
      </template>
    </vxe-column>
    <vxe-column field="deptName" title="部门" min-width="120"></vxe-column>
    <vxe-column field="previousScore" :title="`${month-1 == 0 ? '12' :month-1}月得分`" min-width="100">
      <template #default="{ row }">
        <span>{{row.previousScore ? row.previousScore : '--'}}</span>
      </template>
    </vxe-column> 
    <vxe-column field="nowScore" :title="`${month}月得分`" min-width="100">
      <template #default="{ row }">
        <span style="fontWeight: 700;">{{row.nowScore ? row.nowScore : '--'}}</span>
      </template>
    </vxe-column>
    <vxe-column field="ringComparison" title="环比" min-width="100">
      <template #default="{ row }">
        <span v-if="row.ringComparison < 0" style="color: #d9001b;">{{ row.ringComparison ? row.ringComparison : '--'}}</span>
        <span v-else style="color: #0067cc;">{{ row.ringComparison ? row.ringComparison : '--'}}</span>
      </template>
    </vxe-column>
    <!-- project -->
    <vxe-column field="dataId" title="主要扣分项" min-width="150">
      <template #default="{ row }">
        <div v-if="row.ringComparison < 0 || row.ringComparison == null" style="color: #d9001b;">
          <p v-for="item_, index in row.list">{{index + 1}}、{{item_.project}}</p>
        </div>
        <div v-if="row.ringComparison > 0" style="color: #0067cc;">
          <p v-for="item_, index in row.list">{{index + 1}}、{{item_.project}}</p>
        </div>
      </template>
    </vxe-column>
    <vxe-column field="score" title="总分" min-width="100">
      <template #default="{ row }">
        <div v-if="row.ringComparison < 0 || row.ringComparison == null" style="color: #d9001b;">
          <p v-for="item_, index in row.list">{{item_.score}}</p>
        </div>
        <div v-if="row.ringComparison > 0" style="color: #0067cc;">
          <p v-for="item_, index in row.list">{{item_.score}}</p>
        </div>
      </template>
    </vxe-column>
    <vxe-column field="pointsDeductionFinalScore" title="得分" min-width="100">
      <template #default="{ row }">
        <div v-if="row.ringComparison < 0 || row.ringComparison == null" style="color: #d9001b;">
          <p v-for="item_, index in row.list">{{item_.pointsDeductionFinalScore}}</p>
        </div>
        <div v-if="row.ringComparison > 0" style="color: #0067cc;">
          <p v-for="item_, index in row.list">{{item_.pointsDeductionFinalScore}}</p>
        </div>
      </template>
    </vxe-column>
    <vxe-column field="itemRemarksList" title="扣分点描述" min-width="200">
      <template #default="{ row }">
        <p v-for="(item_, index_) in row.list">
          {{item_.itemRemarksList.map((value, index) => `${index == 0 ? `${index_ + 1}、` : `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`} (${index + 1})${value}\n`).join("")}}
        </p>
      </template>
    </vxe-column>

    <template #empty>
      <div style="padding:16px 0;">
        <a-empty />
      </div>
    </template>
  </vxe-table>
</template>

<script>
import rowspanMethod from "@/utils/rowspanMethod.js";

export default {
  props: {
    deductPointsData: {},
    monthData: {
      type: String,
      default: ``
    }
  },
  data() {
    return {
      dataSource: [],
      deptColumn: [],
      scoreMap: {},
      month:''
    };
  },
  methods: {
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if(columnIndex == 5) {
        console.log(row.list.length)
        return {
          rowspan: row.list.length,
          colspan: row.list.length
        };
      }
    },
    // 处理数据
    handleTableData() {
      this.dataSource = this.deductPointsData
      this.month = this.monthData
    }
  },
  watch: {
    deductPointsData: {
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
::v-deep  .vxe-cell {
  max-height: 1000px !important;
}
::v-deep .vxe-table--cell {
  white-space: normal;
}
</style>
