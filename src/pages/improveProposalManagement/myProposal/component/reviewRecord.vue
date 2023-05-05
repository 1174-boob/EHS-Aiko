<template>
  <div class="review-record">
    <div class="judge">评审员:{{reviewer}}</div>
    <CommonTable>
      <a-table
        bordered
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{emptyText: emptyText}"
        :data-source="dataList"
        :rowKey="(record, index)=>{return index}"
        :pagination="false"
      >
      </a-table>
    </CommonTable>
    <div class="result">
      <div class="score">平均分: {{average}}</div>
      <div class="level">分档： {{grade}}</div>
      <div class="commit">说明：根据评审平均分计算，对应分档：优秀 [90,100]   良好 [70,90) 普通  [60, 70) 不通过 [0,60)</div>
    </div>
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import dictionary from "@/utils/dictionary.js";
export default {
  mixins: [teableCenterEllipsis],
  props: {
    recordsVo: {
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    return {
      reviewer: '',
      average: '',
      grade: '',
      columns:[
        {
          title: '评审人',
          dataIndex: 'reviewerName',
          key: "reviewerName",
          width: 200
        },
        {
          title: '评审时间',
          dataIndex: 'reviewTime',
          key: "reviewTime",
          width: 200
        },
        {
          title: '创新性',
          dataIndex: 'innovationScore',
          key: "innovationScore",
          width: 150
        },
        {
          title: '实用性',
          dataIndex: 'practicabilityScore',
          key: "practicabilityScore",
          width: 150
        },
        {
          title: '可推广性',
          dataIndex: 'generalizationScore',
          key: "generalizationScore",
          width: 150
        },
        {
          title: '合计',
          dataIndex: 'total',
          key: "total",
          width: 150
        },
        {
          title: '评审意见',
          dataIndex: 'reviewComments',
          key: "reviewComments",
        },
      ],
      dataList: []
    }
  },
  watch: {
    recordsVo: {
      handler(newV) {
        if(newV && Object.keys(newV).length !=0) {
          this.reviewer = newV.reviewer;
          this.dataList = newV.reviewVoList || [];
          this.average = newV.average ? newV.average : '--';
          this.grade = newV.proposalGrade ? dictionary('proposalGrade', newV.proposalGrade) : '--';
        } else {
          this.reviewer = '';
          this.dataList = [];
          this.average = '';
          this.grade = '';
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    if(!this.canShowModalMixin("reviewer-show")) {
      this.columns.splice(0,1);
    }
  }
}
</script>

<style lang="less" scoped>
.review-record {
  .judge {
    margin-bottom: 10px;
    font-size: 14px;
  }
  .result {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 40px;
    .score,.level {
      width: 200px;
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }
    .commit {
      font-size: 12px;
      color: #666;
    }
  }
}
</style>