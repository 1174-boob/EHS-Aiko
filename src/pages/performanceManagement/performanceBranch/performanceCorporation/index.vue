<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <DashBtn>
      <div>
        <a-button type="dashed" @click="downLoadLocaReport">下载</a-button>
      </div>
    </DashBtn>
    <div ref="downloadArea">
      <SearchTerm>
        <a-form-model layout="inline" :model="formInline" :colon="false">
          <a-form-model-item label="年份">
            <el-date-picker v-model="formInline.year" type="year" value-format="yyyy" placeholder="选择年" :clearable="false"></el-date-picker>
          </a-form-model-item>
          <a-form-model-item label="季度">
            <a-select v-model="formInline.fillDate" placeholder="请选择">
              <a-select-option v-for="(i, index) in option" :key="index" :value="i.value">{{ i.name }}</a-select-option>
            </a-select>
          </a-form-model-item>

          <!-- 搜索栏按钮需要加固定的float-right类名 -->
          <a-form-model-item class="float-right">
            <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
            <a-button @click="iRest">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </SearchTerm>

      <div class="color-666 font-16" v-if="reportData && reportData.length">
        <!-- 查看 -->
        <ReportDataTableVue ref="reportDataTableVue" :reportData="reportData" :corporationMsg="undefined" :startStatus="startStatus" :subFileValue="subFileValue" type="view"></ReportDataTableVue>
      </div>
      <div class="color-666 font-16 text-center" v-else>该部门还没配置报表</div>
      <div style="height: 40px"></div>
      <SearchTerm>
        <a-form-model layout="inline" :model="searchForm" :colon="false">
          <a-form-model-item label="年份">
            <el-date-picker v-model="searchForm.year" type="year" value-format="yyyy" placeholder="选择年" :clearable="false"></el-date-picker>
          </a-form-model-item>
          <a-form-model-item label="维度">
            <a-select v-model="searchForm.queryDimension" placeholder="请选择" @change="handleTChange">
              <a-select-option :value="2">月度</a-select-option>
              <a-select-option :value="1">季度</a-select-option>
              <a-select-option :value="3">半年度</a-select-option>
              <a-select-option :value="4">年度</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="日期" v-if="searchForm.queryDimension != 4">
            <a-select v-model="searchForm.queryDateType" placeholder="请选择">
              <a-select-option v-for="(i, index) in tOption" :key="index" :value="i.value">{{ i.name }}</a-select-option>
            </a-select>
          </a-form-model-item>

          <!-- 搜索栏按钮需要加固定的float-right类名 -->
          <a-form-model-item class="float-right">
            <a-button type="primary" :loading="loading" @click="siSearch">查询</a-button>
            <a-button @click="siRest">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </SearchTerm>
      <echart :option="setOption"></echart>
      <template v-if="setPOption">
        <PageTitle>各组织管理绩效分档统计</PageTitle>
        <div>
          <p class="font-bold color-0067cc" v-for="(item, ind) in pieLevel" :key="ind">
            {{ item.type }}：{{
            item.arr.join(",")
            ? item.arr.join(",")
            : "暂无数据"
            }}
          </p>
        </div>
        <echart :option="setPOption"></echart>
      </template>
    </div>
  </div>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import { formValidator } from "@/utils/clx-form-validator.js";
import ReportDataTableVue from "../../tpl/reportDataTableBranch.vue";
import dictionary from "@/utils/dictionary";
import dayJs from "dayjs";
import { debounce } from "lodash";
import { cloneDeep } from "lodash";
import echart from "@/components/Gchart/chart";
import {
  queryDeptData,
  queryDeptBar,
  queryDeptLevel,
} from "@/services/performanceManagementBranch.js";
import { downLoadReport, doPrint } from "@/utils/common.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  components: { echart, ReportDataTableVue },
  data() {
    return {
      statusList: [],
      formInline: {
        fillDimension: 1,
        fillDate: this.isQuarter(),
        year: dayJs(new Date()).format("YYYY"),
      },
      searchForm: {
        queryDimension: 1,
        queryDateType: this.isQuarter(),
        year: dayJs(new Date()).format("YYYY"),
      },
      selectedRowKeys: [],
      //部门
      columns: [
        {
          title: "部门",
          dataIndex: "deptName",
        },
        {
          title: "安全管理扣分分值",
          dataIndex: "securityDeductScore",
          minWidth: 100,
        },
        {
          title: "消防管理扣分分值",
          dataIndex: "controlDeductScore",
          minWidth: 100,
        },
        {
          title: "环境管理扣分分值",
          dataIndex: "environmentDeductScore",
          minWidth: 100,
        },
        {
          title: "职业健康管理扣分分值",
          dataIndex: "healthyDeductScore",
          minWidth: 100,
        },
        {
          title: "其他管理事项扣分分值",
          dataIndex: "otherDeductScore",
          minWidth: 100,
        },
        {
          title: "总扣分值",
          dataIndex: "deductDeductScore",
          minWidth: 100,
        },
        {
          title: "总得分",
          dataIndex: "score",
          minWidth: 100,
        },
        {
          title: "分档",
          dataIndex: "level",
          minWidth: 100,
        },
      ],
      tableDataList: [],
      option: [
        { name: "第一季度", value: 1 },
        { name: "第二季度", value: 2 },
        { name: "第三季度", value: 3 },
        { name: "第四季度", value: 4 },
      ],
      tOption: [],
      quarterOption: [
        { name: "第一季度", value: 1 },
        { name: "第二季度", value: 2 },
        { name: "第三季度", value: 3 },
        { name: "第四季度", value: 4 },
      ],
      monthOption: [
        { name: "1月", value: 1 },
        { name: "2月", value: 2 },
        { name: "3月", value: 3 },
        { name: "4月", value: 4 },
        { name: "5月", value: 5 },
        { name: "6月", value: 6 },
        { name: "7月", value: 7 },
        { name: "8月", value: 8 },
        { name: "9月", value: 9 },
        { name: "10月", value: 10 },
        { name: "11月", value: 11 },
        { name: "12月", value: 12 },
      ],
      bOption: {
        title: {
          text: "各项目管理绩效得分", //"作业数量",
          x: "left",
          y: "top",
          z: 1,
          textStyle: {
            fontSize: 16,
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
        },
        grid: {
          top: "20%",
          left: "1%",
          right: "2%",
          bottom: "12%",
          containLabel: true,
        },
        legend: {
          // left:'45%',
          // x: "right",
          // y: "top",
          z: 2,
          top: 5,
          right: 20,
          data: [],
        },
        color: ["#0067CC", "#00CECA", "#9958FF"],
        xAxis: [
          {
            type: "category",
            axisLabel: {
              rotate: 40,
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
            name: "绩效得分",
          },
        ],
        series: [
          {
            name: "绩效得分",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            barMaxWidth: 50,
            data: [],
          },
        ],
      },
      setOption: undefined,
      pOption: {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "20",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: "A档" },
              { value: 735, name: "B档" },
              { value: 580, name: "C档" },
            ],
          },
        ],
      },
      setPOption: undefined,
      pieLevel: null,
      reportData: null,
      startStatus: "1",
      subFileValue: {},
    };
  },
  created() {
    this.setRouterCode("performanceBranchCorporation");
    this.deptId = JSON.parse(
      sessionStorage.getItem("zconsole_userInfo")
    ).user.adminDeptId;
    this.statusList = dictionary("approvalStatus");
    this.option = this.quarterOption;
    this.tOption = this.quarterOption;
    // this.formInline.fillDate = this.isQuarter()
    // this.formInline.year = dayJs(new Date()).format("YYYY");
    this.getDataList();
    this.getChartList();
  },
  methods: {
    // 查询季度
    isQuarter() {
      let Month = Number(new Date().getMonth()) + 1;
      if (Month > 9) {
        return 4;
      } else if (Month > 6) {
        return 3;
      } else if (Month > 3) {
        return 2;
      } else {
        return 1;
      }
    },
    getDataList() {
      this.reportData = [];
       return queryDeptData({ ...this.formInline, deptId: this.deptId })
        .then((res) => {
          let result = res.data || {};
          this.reportData = [
            ...result.safeAchData,
            ...result.fireAchData,
            ...result.environmentAchData,
            ...result.healthAchData,
            ...result.otherAchData,
          ].map((i) => {
            i.sitesNum = Number(i.scene);
            if (i.moduleKey == "safe") {
              i.projectId = 1;
            } else if (i.moduleKey == "fire_control") {
              i.projectId = 2;
            } else if (i.moduleKey == "environment") {
              i.projectId = 3;
            } else if (
              i.moduleKey == "occupational_health"
            ) {
              i.projectId = 4;
            } else {
              i.projectId = 5;
            }
            // delete i.projectScore
            return i;
          });
          if (result.remark) {
            this.startStatus = "2";
            this.subFileValue = JSON.parse(
              result.remark
            );
          }
          if (this.reportData.length) {
            this.$nextTick(() => {
              this.$refs.reportDataTableVue.updateFooterEvent(
                true
              );
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getChartList() {
      queryDeptBar({ ...this.searchForm, deptId: this.deptId })
        .then((res) => {
          this.addLoading = false;
          if (res.data.length) {
            this.bOption.series[0].data = res.data.map(
              (i) => i.projectScore
            );
            this.bOption.xAxis[0].data = res.data.map(
              (i) => i.module
            );
            this.setOption = this.bOption;
          } else {
            this.setOption = undefined;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return  queryDeptLevel({ ...this.searchForm, deptId: this.deptId })
        .then((res) => {
          this.addLoading = false;
          if (res.data.length) {
            this.pOption.series[0].data = res.data.map(
              (i) => {
                return {
                  value: Number(i.levelNum),
                  name: i.levelName,
                };
              }
            );
            this.setPOption = this.pOption;
          } else {
            this.pieLevel = [
              { type: "A档", arr: null },
              { type: "B档", arr: null },
              { type: "C档", arr: null },
            ];
            this.setPOption = undefined;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 查询
    iSearch() {
      // 获取列表
      this.getDataList().finally(() => {
        this.cancelLoading();
      });
    },
    // 重置
    iRest: debounce(
      function () {
        this.formInline = {
          fillDimension: 1,
          fillDate: this.isQuarter(),
          year: dayJs(new Date()).format("YYYY"),
        };
        this.option = this.quarterOption;
        this.getDataList();
      },
      250,
      { leading: true, trailing: false }
    ),
    //筛选维度变化
    handleWChange(e) {
      if (e == 1) {
        this.formInline.fillDate = this.isQuarter();
        this.option = this.quarterOption;
      } else {
        this.formInline.fillDate =
          Number(new Date().getMonth()) + 1;
        this.option = this.monthOption;
      }
    },

    // 图表重置
    siRest: debounce(
      function () {
        this.searchForm = {
          queryDimension: 1,
          queryDateType: this.isQuarter(),
          year: dayJs(new Date()).format("YYYY"),
        };
        this.tOption = this.quarterOption;
        this.getChartList();
      },
      250,
      { leading: true, trailing: false }
    ),
    // 图表查询
    siSearch() {
      // 获取列表
      this.getChartList().finally(() => {
        this.cancelLoading();
      });
    },

    //图表筛选维度变化
    handleTChange(e) {
      if (e == 1) {
        this.searchForm.queryDateType = this.isQuarter();
        this.tOption = this.quarterOption;
      } else if (e == 2) {
        this.searchForm.queryDateType =
          Number(new Date().getMonth()) + 1;
        this.tOption = this.monthOption;
      } else if (e == 3) {
        this.searchForm.queryDateType = 1;
        this.tOption = [
          { name: "上半年", value: 1 },
          { name: "下半年", value: 2 },
        ];
      } else {
        this.searchForm.queryDateType = null;
      }
    },
    //报表下载
    downLoadLocaReport() {
      const elLoading = this.$loading({
        lock: true,
        text: "导出中...",
      });
      this.showPrintPdfBtn = true;
      downLoadReport(
        this.$refs.downloadArea,
        "组织绩效部门报表"
      ).finally(() => {
        this.showPrintPdfBtn = false;
        elLoading.close();
      });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ td {
  img {
    width: 30px;
    height: 30px;
  }
}
.head-portrait {
  width: 50px;
  height: 50px;
}
</style>
