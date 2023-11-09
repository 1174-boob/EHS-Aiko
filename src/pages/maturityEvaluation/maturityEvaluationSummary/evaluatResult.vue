<template>
  <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-overflow align="center" :data="dataSource" show-header-overflow>

    <vxe-column field="maturityEvaluationReportType" title="维度" width="100">
      <template #default="{ row }">{{dimensionMatch[row.maturityEvaluationReportType]}}</template>
    </vxe-column>
    <vxe-column field="project" title="项目" min-width="200"></vxe-column>
    <vxe-column field="score" title="分值" width="100"></vxe-column>

    <vxe-colgroup title="得分明细">
      <vxe-column field="bumen1" title="部门1" min-width="100"></vxe-column>
      <vxe-column field="bumen2" title="部门2" min-width="100"></vxe-column>
      <vxe-column field="bumen3" title="部门3" min-width="100"></vxe-column>
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
  data() {
    return {
      dataSource: [],
      // 维度
      dimensionMatch: {
        prior: '事前',
        inTheMatter: '事中',
        afterTeFact: '事后',
      },
    };
  },
  created() {

  },
  methods: {

  },
};
</script>

<style lang="less" scoped>
</style>
