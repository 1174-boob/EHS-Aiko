<template>
  <div>
    <SearchTerm>
      <a-form-model layout="inline" :model="dayFormInline" :colon="false">
        <a-form-model-item label="检查日期">
          <a-range-picker
            format="YYYY-MM-DD"
            v-model="dayFormInline.checkDate"
            :placeholder="['开始日期', '结束日期']"
          />
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="daySearch"
            >查询</a-button
          >
          <a-button @click="dayRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="dayNew">
          <a-icon type="plus" />新建
        </a-button>
        <a-button type="dashed" v-if="chkType != 'self'" @click="configurationChecklist">
          配置点检表
        </a-button>
      </div>
    </DashBtn>
    <CommonTable>
      <a-table
        :columns="dayColumns"
        :data-source="dayTableDataList"
        :pagination="false"
        bordered
      >
        <div slot="report" slot-scope="record">
          <span
            class="color-0067cc cursor-pointer"
            @click="handleDayPdf(record.certificationReport)"
            >认证报告.pdf</span
          >
        </div>
        <div slot="action" slot-scope="record">
          <span
            class="color-0067cc cursor-pointer"
            @click="handleCheckDay(record)"
            >点检</span
          >
          <span
            class="color-0067cc cursor-pointer"
            @click="handleCheckDay(record)"
            >上传点检表</span
          >
          <span
            class="color-0067cc cursor-pointer"
            @click="handleCheckDay(record)"
            >更新点检表</span
          >
          <span
            class="color-0067cc cursor-pointer"
            @click="handleCheckDay(record)"
            >查看</span
          >
          <span
            class="color-0067cc cursor-pointer"
            @click="handleCheckDay(record)"
            >删除</span
          >
        </div>
      </a-table>
    </CommonTable>
  </div>
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
    equipmentType: {
      type: String,
      default: "",
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
  methods: {
    // 查询
    daySearch() {},
    // 重置
    dayRest: debounce(function () {}, 250, { leading: true, trailing: false }),
    dayNew() {
      console.log('0 机动车 1 起重机械 2 电梯 3 压力管道 4 压力容器 =>',this.equipmentType)
      if(this.chkType && this.chkType != 'self') {
        let path = ''
        switch (this.chkType) {
          case 'day':
            path = '/safeManage/deviceSafeManage/specialeDevice/clkchkDayNew'
            break
          case 'month':
            path = '/safeManage/deviceSafeManage/specialeDevice/clkchkMonthNew'
            break
          case 'year':
            path = '/safeManage/deviceSafeManage/specialeDevice/clkchkYearNew'
            break
        }
        this.$router.push({
          path: path,
          query: { pageType: this.chkType }
        })
      }
    },
    configurationChecklist() {
      console.log('配置点检表');
      this.$router.push({
        path: "/safeManage/deviceSafeManage/specialeDevice/configurationChecklist",
        query: { checkType: this.chkType, equipType:this.equipmentType }, // 点检类型 设备类型
      });
    },
    handleDayPdf() {},
    handleCheckDay() {},
  },
};
</script>