<template>
  <HasSpinAndBtnBox :spinning="false">
    <div class="clx-flex-1">
      <div class="baseInfo">
        <a-row type="flex" justify="space-around">
          <a-col :span="4">设备名称：叉车</a-col>
          <a-col :span="4">牌照编号：xxx</a-col>
        </a-row>
        <a-row type="flex" justify="space-around" class="bottom">
          <a-col :span="4">设备代码：xxx</a-col>
          <a-col :span="4">所在位置：xxx</a-col>
        </a-row>
        <a-row type="flex" justify="space-around" class="bottom">
          <a-col :span="4">检查者：xxx</a-col>
          <a-col :span="4">安全管理人员：xxx</a-col>
          <a-col :span="4">检查时间：xxx</a-col>
        </a-row>
      </div>
    </div>
    <FixedBottom slot="fixedBottom">
      <a-button @click="goBack">返回</a-button>
    </FixedBottom>
  </HasSpinAndBtnBox>
</template>

<script>
import { debounce } from "lodash";
export default {
  name: "ClkchkSearch",
  props: {
    chkType: {
      type: String,
      default: "day",
    },
  },
  data() {
    return {
      dayFormInline: {
        checkDate: [],
        nextCheckDate: [],
      },
      dayColumns: [
        {
          title: "序号",
          dataIndex: "responsibilityName",
          key: "responsibilityName",
          align: "center",
        },
        {
          title: "检查日期",
          dataIndex: "thisCertificationDate",
          key: "thisCertificationDate",
          align: "center",
        },
        {
          title: "检查者12",
          dataIndex: "thisCertificationValid12",
          key: "thisCertificationValid12",
          align: "center",
          customRender: (v) => {
            return v ? v + "年" : "--";
          },
        },
        {
          title: "安全管理人员3",
          dataIndex: "thisCertificationValid3",
          key: "thisCertificationValid3",
          align: "center",
          customRender: (v) => {
            return v ? v + "年" : "--";
          },
        },
        {
          title: "状态123",
          dataIndex: "thisCertificationConclusion123",
          key: "thisCertificationConclusion123",
          align: "center",
        },
        {
          title: "自检报告4",
          dataIndex: "thisCertificationConclusion4",
          key: "thisCertificationConclusion4",
          align: "center",
        },
        {
          title: "点检表123",
          scopedSlots: { customRender: "report" },
          key: "report123",
          align: "center123",
          width: 200, // 宽度根据操作自定义设置
        },
        {
          title: "创建时间",
          dataIndex: "unqualifiedReason",
          key: "unqualifiedReason",
          align: "center",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          align: "center",
          fixed: "right", // 固定操作列
          width: 150, // 宽度根据操作自定义设置
        },
      ],
      dayTableDataList: [],
      loading: false,
    };
  },
  created() {
    console.log(this.$route.query.pageType)
  },
  methods: {
    // 查询
    daySearch() {},
    // 重置
    dayRest: debounce(function () {}, 250, { leading: true, trailing: false }),
    dayNew() {},
    handleDayPdf() {},
    handleCheckDay() {},
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.download {
  padding: 20px 0;
}
.baseInfo {
  padding: 30px 0;
  .bottom {
    margin-top: 30px;
  }
}
</style>