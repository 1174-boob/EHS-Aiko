<template>
  <vxe-table ref="vxeTable" class="vxe-scrollbar beauty-scroll-fireBox" border show-overflow align="center" :data="dataSource" show-header-overflow :row-config="{height: 60, isHover: true}">
    <vxe-column title="序号" width="80">
      <template #default="{ _rowIndex }">
       {{_rowIndex+1}}
      </template>
    </vxe-column>
    <vxe-column field="deptName" title="部门" min-width="120"></vxe-column>
    <vxe-column field="score" title="*月得分" min-width="100"></vxe-column>
    <vxe-column field="ringComparison" title="环比" min-width="100"></vxe-column>
    <vxe-column field="project" title="主要扣分项" min-width="150"></vxe-column>
    <vxe-column field="pointsDeductionFinalScore" title="总分" min-width="100"></vxe-column>
    <vxe-column field="score" title="得分" min-width="100"></vxe-column>
    <vxe-column field="itemRemarksList" title="扣分点描述" min-width="200"></vxe-column>

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
    deductPointsData: {}
  },
  data() {
    return {
      dataSource: [
        {
          lable:'模拟数据'
        },
        {
          lable:'模拟数据'
        },
      ],
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
  methods: {
    // 处理数据
    handleTableData() {
      
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
</style>
