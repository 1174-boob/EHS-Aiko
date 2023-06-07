<template>
  <!-- 邀请列表 -->
  <div
    class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff"
  >
    <h3 class="title">爱旭废弃物</h3>

    <!-- 列表 -->
    <CommonTable
      :page="page"
      :pageNoChange="pageNoChange"
      :showSizeChange="showSizeChange"
    >
      <a-table
        :columns="boeColumns"
        :scroll="{ x: 800 }"
        :data-source="boeTableDataList"
        :pagination="false"
        bordered
      >
      </a-table>
    </CommonTable>
    <chart :option="setBoeOption"></chart>
    <h3 class="title">现地废弃物</h3>
    <SearchTerm>
      <a-form-model layout="inline" :model="searchFormData" :colon="false">
        <a-form-model-item label="日期筛选">
          <a-select
            v-model="searchFormData.dateType"
            @change="handleChange"
            placeholder="请选择"
          >
            <a-select-option key="1">月度</a-select-option>
            <a-select-option key="2">季度</a-select-option>
            <a-select-option key="3">半年度</a-select-option>
            <a-select-option key="4">年度</a-select-option>
          </a-select>
          <span style="width: 10px; display: inline-block"></span>
          <el-date-picker
            v-if="searchFormData.dateType == 1"
            v-model="searchFormData.dateStr"
            value-format="yyyy-MM"
            type="month"
            placeholder="选择月"
            :clearable="false"
          >
          </el-date-picker>
          <template v-if="searchFormData.dateType == 2">
            <el-date-picker
              v-model="searchFormData.dateStr"
              type="year"
              value-format="yyyy"
              placeholder="选择年"
              :clearable="false"
            >
            </el-date-picker>
            <span style="width: 10px; display: inline-block"></span>
            <a-select v-model="searchFormData.dataType" placeholder="请选择">
              <a-select-option key="1">第一季度</a-select-option>
              <a-select-option key="2">第二季度</a-select-option>
              <a-select-option key="3">第三季度</a-select-option>
              <a-select-option key="4">第四季度</a-select-option>
            </a-select>
          </template>
          <template v-if="searchFormData.dateType == 3">
            <el-date-picker
              v-model="searchFormData.dateStr"
              type="year"
              value-format="yyyy"
              placeholder="选择年"
              :clearable="false"
            >
            </el-date-picker>
            <span style="width: 10px; display: inline-block"></span>
            <a-select v-model="searchFormData.dataType" placeholder="请选择">
              <a-select-option key="1">上半年</a-select-option>
              <a-select-option key="2">下半年</a-select-option>
            </a-select>
          </template>
          <el-date-picker
            v-if="searchFormData.dateType == 4"
            v-model="searchFormData.dateStr"
            type="year"
            value-format="yyyy"
            placeholder="选择年"
            :clearable="false"
          >
          </el-date-picker>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch"
            >查询</a-button
          >
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <!-- 列表 -->
    <div>
      <vxe-table border resizable align="center" :data="tableData">
        <vxe-column field="rubbishName" title="项目"></vxe-column>

        <vxe-column
          v-for="(i, index) in titleList"
          :field="i"
          :title="findCorporationId(i)"
          :key="index"
        ></vxe-column>
        <template #empty>
          <div style="padding: 16px 0">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </div>

    <chart :option="setOption"></chart>
  </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { debounce } from "lodash";
import getDictionaryItemObj from "@/utils/dictionary.js";
import { wasteBOE, wasteLocal } from "@/services/envMonth.js";
import {
  tableConversion,
  findCorporationId,
  lastMonth,
  findData,
} from "./methods.js";
import dayJs from "dayjs";
import chart from "./chart.vue";
export default {
  components: { chart },
  data() {
    return {
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      searchFormData: { dateType: "1", dateStr: lastMonth(), dataType: "" },
      boeColumns: [
        {
          title: "2023年",
          dataIndex: "nicheItemsCode",
          key: "nicheItemsCode",
          align: "center",
          customRender: (text) => {
            return findData(text).rubbishName
              ? findData(text).rubbishName
              : "--";
          },
          width: 200,
        },
        {
          title: "1月",
          dataIndex: "january",
          key: "january",
          align: "center",
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "2月",
          dataIndex: "february",
          key: "february",
          align: "center",
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "3月",
          dataIndex: "march",
          key: "march",
          align: "center",
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "4月",
          dataIndex: "april",
          key: "april",
          align: "center",
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "5月",
          dataIndex: "may",
          key: "may",
          align: "center",
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "6月",
          dataIndex: "june",
          key: "june",
          align: "center",
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "7月",
          dataIndex: "july",
          key: "july",
          align: "center",
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "8月",
          dataIndex: "august",
          key: "august",
          align: "center",
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "9月",
          dataIndex: "september",
          key: "september",
          align: "center",
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "10月",
          dataIndex: "october",
          key: "october",
          align: "center",
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "11月",
          dataIndex: "november",
          key: "november",
          align: "center",
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "12月",
          dataIndex: "december",
          key: "december",
          align: "center",
          customRender: (text) => {
            return text ? text : "--";
          },
        },
      ],
      boeTableDataList: [],
      boeOption: {
        title: {
          text: "废气物统计图", //"作业数量",
          x: "left",
          y: "top",
          z: 1,
          textStyle: {
            fontSize: 18,
            fontWeight: "normal",
            label: {
              formatter: "{title|{b}}",
            },
            rich: {
              test: {
                color: "#333333",
                height: 48,
                padding: [0, 0, 0, 20],
                width: 2000,
              },
            },
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        grid: {
          top: "20%",
          left: "1%",
          right: "1%",
          bottom: "12%",
          containLabel: true,
        },
        legend: {
          // left:'45%',
          // x: "right",
          // y: "top",
          z: 2,
          top: 18,
          right: 20,
          data: [
            "废弃物处置量(万t)",
            "废弃物处置费用(百万元)",
            "废弃物单耗(kg/m2)",
          ],
        },
        color: ["#0067CC", "#00CECA", "#9958FF"],
        xAxis: [
          {
            type: "category",
            axisLabel: {
              // rotate: 40,
              width: 20,
              interval: 0,
            },
            data: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月",
            ],
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "万t",
            alignTicks: true,
            // interval: 100,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#000000",
              },
            },
          },
          {
            type: "value",
            name: "kg/m2",
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#000000",
              },
            },
          },
        ],
        series: [
          {
            name: "废弃物处置量(万t)",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            barMaxWidth: 50,
            data: [],
          },
          {
            name: "废弃物处置费用(百万元)",
            type: "line",
            yAxisIndex: 1,
            data: [],
          },
          {
            name: "废弃物单耗(kg/m2)",
            type: "line",
            yAxisIndex: 1,
            data: [],
          },
        ],
      },
      setBoeOption: undefined,
      columns: [],
      tableDataList: [],
      option: {
        title: {
          text: "{test|废弃物统计图}", //"作业数量",
          x: "left",
          y: "top",
          z: 1,
          textStyle: {
            fontSize: 28,
            fontWeight: "normal",
            label: {
              formatter: "{title|{b}}",
            },
            rich: {
              test: {
                color: "#333333",
                height: 48,
                padding: [0, 0, 0, 20],
                width: 2000,
              },
            },
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        grid: {
          top: "20%",
          left: "1%",
          right: "1%",
          bottom: "12%",
          containLabel: true,
        },
        legend: {
          // left:'45%',
          // x: "right",
          // y: "top",
          z: 2,
          top: 18,
          right: 20,
          data: ["废弃物单耗(kg/m2)", "平均处置单价(元/kg)"],
        },
        color: ["#0067CC", "#00CECA", "#9958FF"],

        xAxis: [
          {
            type: "category",
            axisLabel: {
              // rotate: 40,
              width: 20,
              interval: 0,
            },
            data: [],
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "kg/m2",
            alignTicks: true,
            // interval: 100,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#000000",
              },
            },
          },
          {
            type: "value",
            name: "元/kg",
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: "#000000",
              },
            },
          },
        ],
        series: [
          {
            name: "废弃物单耗(kg/m2)",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            barMaxWidth: 50,
            data: [],
          },
          {
            name: "平均处置单价(元/kg)",
            type: "line",
            yAxisIndex: 1,
            data: [],
          },
        ],
      },
      setOption: undefined,
      loading: false,
      titleList: null,
      tableData: null,
    };
  },
  computed: {},
  created() {
    this.initData();
  },
  mounted() {},
  methods: {
    findCorporationId,
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.initData();
    },
    // 重置
    iRest: debounce(
      function () {
        this.searchFormData = {
          dateType: "1",
          dateStr: lastMonth(),
          dataType: "",
        };
        this.initData();
      },
      250,
      { leading: true, trailing: false }
    ),
    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
      this.initData();
    },
    // 字典组每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.initData();
    },
    initData() {
      wasteBOE({}).then((res) => {
        this.boeTableDataList = [
          res.data[3],
          res.data[1],
          res.data[0],
          res.data[2],
        ];
        if (res.data.length) {
          let monthText = [
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december",
          ];
          let v1113 = [];
          let v1043 = [];
          let v1092 = [];
          for (let i = 0; i < res.data.length; i++) {
            for (let j in res.data[i]) {
              console.log(monthText.indexOf(j));
              if (monthText.indexOf(j) > -1) {
                if (res.data[i].nicheItemsCode == 1113) {
                  v1113[monthText.indexOf(j)] =
                    res.data[i][j] == null ? 0 : res.data[i][j];
                }
                if (res.data[i].nicheItemsCode == 1043) {
                  v1043[monthText.indexOf(j)] =
                    res.data[i][j] == null ? 0 : res.data[i][j];
                }
                if (res.data[i].nicheItemsCode == 1092) {
                  v1092[monthText.indexOf(j)] =
                    res.data[i][j] == null ? 0 : res.data[i][j];
                }
              }
            }
          }
          this.boeOption.series[2].data = v1113;
          this.boeOption.series[1].data = v1043;
          this.boeOption.series[0].data = v1092;
          console.log(v1113, v1043, v1092);
          this.setBoeOption = this.boeOption;
        } else {
          this.setBoeOption = undefined;
        }

        // [{11:11,code:1001}]
      });
      wasteLocal({ ...this.searchFormData }).then((res) => {
        if (Object.keys(res.data).length === 0) {
          this.setOption = undefined;
          this.titleList = null;
          this.tableData = null;
        } else {
          let obj = tableConversion(res.data, 1113);
          this.titleList = obj.titleList;
          this.tableData = obj.tableData;
          console.log(obj);
          this.option.xAxis[0].data = this.titleList.map(findCorporationId);
          for (let i = 0; i < this.tableData.length; i++) {
            this.option.series[i].data = [];
            for (let j = 0; j < this.titleList.length; j++) {
              let key = this.titleList[j];
              console.log(this.tableData[i][key]);
              this.option.series[i].data.push(this.tableData[i][key]);
            }
          }
          this.setOption = this.option;
        }
      });
    },
    handleChange(e) {
      if (e == 1 || e == 4) {
        this.searchFormData.dataType = "";
      } else {
        this.searchFormData.dataType = "1";
      }
      if (e != 1) {
        this.searchFormData.dateStr = new Date().getFullYear().toString();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.shenglvhao {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.title {
  font-size: 16px;
  font-weight: bold;
  color: 16px;
  line-height: 80px;
}
</style>
