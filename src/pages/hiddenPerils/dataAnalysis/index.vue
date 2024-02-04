<template>
  <!-- 数据统计分析 -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" deptLabel="责任部门" :CommonFormInline="formInline" :needDeptName="true" :hasDepartment="true"></CommonSearchItem>
        <!-- <CommonDept
          ref="commonSearchItem"
          :CommonFormInline="formInline"
          :hasDepartment="true"
          :disabled="disabledCommonDept"
          @corporationChange="corporationChange('formInline')"
          @corporationDeptChange="corporationDeptChange"
        ></CommonDept>
        <a-form-model-item label="部门">
          <a-tree-select
            v-model="formInline.deptId"
            :allowClear="true"
            :disabled="disabledCommonDept"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="deptList"
            :replaceFields="{ title: 'name', key: 'id', value: 'id' }"
            :placeholder="
              formInline.corporationId ? '请选择' : '请先选择所属组织'
            "
          ></a-tree-select>
        </a-form-model-item> -->
        <a-form-model-item label="创建时间">
          <a-range-picker v-model="formInline.auditTime" valueFormat="YYYY-MM-DD" class="search-range-picker" format="YYYY-MM-DD" style="width: 200px" :placeholder="['开始时间', '结束时间']" />
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>

    <!-- 隐患数量统计 -->
    <div>
      <div class="title">
        <div class="title-left">隐患数量统计</div>
      </div>
      <div class="casualties">
        <Echarts v-if="optionA.series.length" :option="optionA" />
        <a-empty v-else class="echarts-empty" />
      </div>
    </div>

    <!-- 隐患分析 -->
    <div>
      <h1 class="hidden_H1">隐患分析</h1>
      <div class="title">
        <div class="title-left">隐患整改情况</div>
      </div>
      <div class="casualties">
        <Echarts v-if="optionB.series.length" :option="optionB" />
        <a-empty v-else class="echarts-empty" />
      </div>
      <div class="title">
        <div class="title-left">隐患超期情况</div>
      </div>
      <div class="casualties">
        <Echarts v-if="optionC.series.length" :option="optionC" />
        <a-empty v-else class="echarts-empty" />
      </div>
      <div class="hidden_father">
        <div class="son">
          <div class="left">
            <div class="title noMargin">
              <div class="title-left">隐患类别</div>
            </div>
            <div class="casualties">
              <Echarts v-if="optionD.series[0].data.length" :option="optionD" />
              <a-empty v-else class="echarts-empty" />
            </div>
          </div>
          <div class="right">
            <div class="title noMargin">
              <div class="title-left">隐患级别</div>
            </div>
            <div class="casualties">
              <Echarts v-if="optionE.series[0].data.length" :option="optionE" />
              <a-empty v-else class="echarts-empty" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分割线 -->
    <div class="line_Div"></div>

    <SearchTerm>
      <a-form-model layout="inline" :model="formInlineTwoObj" :colon="false">
        <CommonSearchItem ref="commonSearchItemTwo" deptLabel="责任部门" :CommonFormInline="formInlineTwoObj" :needDeptName="true" :hasDepartment="true"></CommonSearchItem>
        <!-- <CommonDept
          ref="commonSearchItemTwo"
          :CommonFormInline="formInlineTwoObj"
          :hasDepartment="true"
          :disabled="disabledCommonDeptTwo"
          @corporationChange="corporationChange('formInlineTwoObj')"
          @corporationDeptChange="corporationDeptChange"
        ></CommonDept>
        <a-form-model-item label="部门">
          <a-tree-select
            v-model="formInlineTwoObj.deptId"
            :allowClear="true"
            :disabled="disabledCommonDeptTwo"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="deptList"
            :replaceFields="{ title: 'name', key: 'id', value: 'id' }"
            :placeholder="
              formInlineTwoObj.corporationId ? '请选择' : '请先选择所属组织'
            "
          ></a-tree-select>
        </a-form-model-item> -->
        <a-form-model-item label="月份">
          <el-date-picker v-model="formInlineTwoObj.mouthTime" type="month" placeholder="选择月" class="mouthEl"></el-date-picker>
        </a-form-model-item>
        <a-form-model-item label="数据集">
          <a-select v-model="formInlineTwoObj.dataSource" placeholder="请选择">
            <a-select-option v-for="item in statusList" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loadingTwo" @click="iSearchTwo">查询</a-button>
          <a-button @click="iRestTwo">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>

    <!-- 对比分析 -->
    <div :class="[!optionF.series.length ? 'm-b-30' : '']">
      <div class="casualties">
        <div class="title">
          <div class="title-left">对比分析</div>
          <div class="title-right">
            隐患类别环比分析：
            <a-radio-group v-model="formInlineTwoObj.compType" @change="compTypeChange">
              <a-radio value="1">同比</a-radio>
              <a-radio value="2">环比</a-radio>
            </a-radio-group>&nbsp;&emsp;
          </div>
        </div>
        <Echarts :option="optionF" v-if="optionF.series.length" />
        <a-empty v-else class="echarts-empty" />
      </div>
    </div>
  </div>
</template>

<script>
import Echarts from "@/components/echarts/index.vue";
import {
  GetChartsList,
  GetCategoryChartsList,
  GetLevelChartsList,
  GetRectificationChartsList,
  GetExceedChartsList,
  GetCompChartsList,
  ExoprtChartsList,
  ExoprtCategoryChartsList,
  ExoprtLevelChartsList,
  ExoprtRectificationChartsList,
  ExoprtExceedChartsList,
  ExoprtCompChartsList,
} from "@/services/hiddenCharts.js";
import moment from "moment";
import dataAnalysis from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import cancelLoading from "@/mixin/cancelLoading";
import { barObj } from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import { cloneDeep, debounce, isEmpty } from "lodash";

export default {
  components: { Echarts },
  mixins: [cancelLoading, dataAnalysis],
  data() {
    return {
      disabledCommonDept: false,
      disabledCommonDeptTwo: false,
      deptList: [],
      statusList: [
        { key: 1, value: "隐患总数" },
        { key: 2, value: "隐患类别" },
        { key: 3, value: "隐患级别" },
      ],
      formInline: {
        auditTime: undefined,
      },
      formInlineTwoObj: {
        compType: "1",
        dataSource: 1,
        mouthTime: moment().startOf("month").format("YYYY-MM-DD"),
      },
      optionA: {
        tooltip: { ...barObj.tooltip },
        toolbox: {
          emphasis: {
            ...barObj.emphasis,
          },
          feature: {},
        },
        grid: barObj.grid,
        legend: {
          data: [],
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              ...barObj.xAxis.axisLabel,
            },
            axisPointer: {
              ...barObj.xAxis.axisPointer,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "隐患量",
          },
        ],
        series: [],
      },
      optionB: {
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            var tip = "";
            if (params != null && params.length > 0) {
              tip += params[0].name + "<br/>";
              for (var i = 0; i < params.length; i++) {
                tip +=
                  params[i].marker +
                  params[i].seriesName +
                  "：" +
                  params[i].value +
                  `${params[i].seriesName == "整改率" ? "%" : ""}<br/>`;
              }
            }
            return tip;
          },
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          emphasis: {
            ...barObj.emphasis,
          },
          feature: {},
        },
        grid: barObj.grid,
        legend: {
          data: [],
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              ...barObj.xAxis.axisLabel,
            },
            axisPointer: {
              ...barObj.xAxis.axisPointer,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "隐患量",
            alignTicks: true,
          },
          {
            type: "value",
            name: "整改率（%）",
            alignTicks: true,
          },
        ],
        series: [],
      },
      optionC: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          emphasis: {
            ...barObj.emphasis,
          },
          feature: {},
        },
        grid: barObj.grid,
        legend: {
          data: [],
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              ...barObj.xAxis.axisLabel,
            },
            axisPointer: {
              ...barObj.xAxis.axisPointer,
            },
            // axisLine: {
            //   onZero: false, //-----------重点
            // },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "隐患量",
          },
        ],
        series: [],
      },
      optionD: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {d}%",
        },
        toolbox: {
          feature: {},
        },
        legend: {
          show: false,
        },
        series: [
          {
            name: "隐患类别分析",
            type: "pie",
            radius: "60%",
            label: {
              formatter: "{b}: {d}%",
            },
            data: [],
          },
        ],
      },
      optionE: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {d}%",
        },
        toolbox: {
          feature: {},
        },
        legend: {
          show: false,
        },
        series: [
          {
            name: "隐患级别分析",
            type: "pie",
            radius: "60%",
            label: {
              formatter: "{b}: {d}%",
            },
            data: [],
          },
        ],
      },
      optionF: {
        tooltip: {
          ...barObj.tooltip,
          formatter: (params) => {
            var tip = "";
            if (params != null && params.length > 0) {
              tip += params[0].name + "<br/>";
              for (var i = 0; i < params.length; i++) {
                tip +=
                  params[i].marker +
                  params[i].seriesName +
                  "：" +
                  params[i].value +
                  `${params[i].seriesName == "增长率" ? "%" : ""}<br/>`;
              }
            }
            return tip;
          },
        },
        toolbox: {
          emphasis: {
            ...barObj.emphasis,
          },
          feature: {},
        },
        grid: barObj.grid,
        legend: {
          data: [],
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              ...barObj.xAxis.axisLabel,
            },
            axisPointer: {
              ...barObj.xAxis.axisPointer,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "隐患量",
            alignTicks: true,
          },
          {
            type: "value",
            name: "增长率（%）",
            alignTicks: true,
          },
        ],
        series: [],
      },
    };
  },
  created() {
    this.setRouterCode('hiddenPerilsDA')
    this.formInline.auditTime = [
      moment().startOf("month").format("YYYY-MM-DD"),
      moment().endOf("month").format("YYYY-MM-DD"),
    ];
    this.initOption(); //初始化option
  },
  mounted() {
    this.iSearch(false);
    this.iSearchTwo(false);
  },
  methods: {
    //获取搜索参数
    getSearchObj(twoSearch) {
      if (twoSearch) {
        //虚线以下搜索 对比分析搜索
        return {
          ...this.formInlineTwoObj,

          //只有一个组织
          centerId: !isEmpty(this.corporationIdObjTwo)
            ? this.corporationIdObjTwo.centerId
            : this.formInlineTwoObj.centerId,
          corporationId: !isEmpty(this.corporationIdObjTwo)
            ? this.corporationIdObjTwo.corporationId
            : this.formInlineTwoObj.corporationId,

          mouthTime: this.formInlineTwoObj.mouthTime
            ? moment(this.formInlineTwoObj.mouthTime).format("YYYY-MM-DD")
            : undefined,
        };
      } else {
        return {
          ...this.formInline,

          //只有一个组织
          centerId: !isEmpty(this.corporationIdObj)
            ? this.corporationIdObj.centerId
            : this.formInline.centerId,
          corporationId: !isEmpty(this.corporationIdObj)
            ? this.corporationIdObj.corporationId
            : this.formInline.corporationId,

          startTime: this.formInline.auditTime
            ? this.formInline.auditTime[0]
            : undefined,
          endTime: this.formInline.auditTime
            ? this.formInline.auditTime[1]
            : undefined,
          auditTime: undefined,
        };
      }
    },

    //隐患数量统计
    getChartsList() {
      let apiData = this.getSearchObj();
      return GetChartsList(apiData).then((res) => {
        let ajaxData = res.data || [];
        if (ajaxData && ajaxData.length) {
          let { xAxisData, series, legendData } = this.barDataHandle(
            ajaxData,
            true,
            true
          );
          this.optionA.xAxis[0].data = cloneDeep(xAxisData);
          this.optionA.legend.data = cloneDeep(legendData);
          this.optionA.series = cloneDeep(series);
        } else {
          this.optionA.series = [];
        }
      });
    },

    //隐患数据量统计-导出
    exoprtChartsList() {
      let apiData = this.getSearchObj();
      ExoprtChartsList(apiData).then((res) => {
        this.spreadSheetExcel(res, "隐患数据量统计");
      });
    },

    //隐患类别-饼状图
    getCategoryChartsList() {
      let apiData = this.getSearchObj();
      return GetCategoryChartsList(apiData).then((res) => {
        if (res.data && res.data.length) {
          this.optionD.series[0].data = res.data || [];
        } else {
          this.optionD.series[0].data = [];
        }
      });
    },

    //隐患类别-导出
    exoprtCategoryChartsList() {
      let apiData = this.getSearchObj();
      ExoprtCategoryChartsList(apiData).then((res) => {
        this.spreadSheetExcel(res, "隐患类别");
      });
    },

    //隐患级别-饼状图
    getLevelChartsList() {
      let apiData = this.getSearchObj();
      return GetLevelChartsList(apiData).then((res) => {
        if (res.data && res.data.length) {
          this.optionE.series[0].data = res.data || [];
        } else {
          this.optionE.series[0].data = [];
        }
      });
    },

    //隐患级别-导出
    exoprtLevelChartsList() {
      let apiData = this.getSearchObj();
      ExoprtLevelChartsList(apiData).then((res) => {
        this.spreadSheetExcel(res, "隐患级别");
      });
    },

    //隐患整改情况-柱状
    getRectificationChartsList() {
      let apiData = this.getSearchObj();
      return GetRectificationChartsList(apiData).then((res) => {
        let ajaxData = res.data || [];
        if (ajaxData && ajaxData.length) {
          let { xAxisData, series, legendData } = this.barDataHandle(
            ajaxData,
            true,
            true
          );
          this.optionB.xAxis[0].data = cloneDeep(xAxisData);
          this.optionB.legend.data = cloneDeep(legendData);
          this.optionB.series = cloneDeep(series);
        } else {
          this.optionB.series = [];
        }
      });
    },

    //隐患整改情况-导出
    exoprtRectificationChartsList() {
      let apiData = this.getSearchObj();
      ExoprtRectificationChartsList(apiData).then((res) => {
        this.spreadSheetExcel(res, "隐患整改情况");
      });
    },

    //隐患超期情况-柱状
    getExceedChartsList() {
      let apiData = this.getSearchObj();
      return GetExceedChartsList(apiData).then((res) => {
        let ajaxData = res.data || [];
        if (ajaxData && ajaxData.length) {
          let { xAxisData, series, legendData } = this.barDataHandle(
            ajaxData,
            false,
            true
          );
          this.optionC.xAxis[0].data = cloneDeep(xAxisData);
          this.optionC.legend.data = cloneDeep(legendData);
          this.optionC.series = cloneDeep(series);
        } else {
          this.optionC.series = [];
        }
      });
    },

    //隐患超期情况-导出
    exoprtExceedChartsList() {
      let apiData = this.getSearchObj();
      ExoprtExceedChartsList(apiData).then((res) => {
        this.spreadSheetExcel(res, "隐患超期情况");
      });
    },

    //对比分析-柱状
    getCompChartsList() {
      let apiData = this.getSearchObj(true);
      return GetCompChartsList(apiData).then((res) => {
        let ajaxData = res.data || [];
        if (ajaxData && ajaxData.length) {
          let { xAxisData, series, legendData } = this.barDataHandle(
            ajaxData,
            false,
            true,
            "formInlineTwoObj",
            "commonSearchItemTwo"
          );
          this.optionF.xAxis[0].data = cloneDeep(xAxisData);
          this.optionF.legend.data = cloneDeep(legendData);
          this.optionF.series = cloneDeep(series);
        } else {
          this.optionF.series = [];
        }
      });
    },

    //对比分析-导出
    exoprtCompChartsList() {
      let apiData = this.getSearchObj(true);
      ExoprtCompChartsList(apiData).then((res) => {
        this.spreadSheetExcel(res, "对比分析");
      });
    },

    //同比环比切换
    compTypeChange() {
      this.iSearchTwo();
    },

    //隐患对比-汇总
    summaryChange(e) {
      this.disabledCommonDept = e.target.checked;
      let { auditTime } = this.formInline;
      this.formInline = { auditTime };
      this.iSearch();
    },

    //对比分析-汇总
    summaryChangeTwo(e) {
      this.disabledCommonDeptTwo = e.target.checked;
      let { compType, dataSource, mouthTime } = this.formInlineTwoObj;
      this.formInlineTwoObj = {
        mouthTime,
        compType,
        dataSource,
      };
      this.iSearchTwo();
    },

    // 查询-隐患
    iSearch(openLoading = true) {
      openLoading && this.handleLoading();
      Promise.all([
        this.getChartsList(),
        this.getCategoryChartsList(),
        this.getRectificationChartsList(),
        this.getExceedChartsList(),
        this.getLevelChartsList(),
      ])
        .then((res) => { })
        .finally(() => {
          this.cancelLoading();
        });
    },

    // 重置-隐患
    iRest: debounce(
      function () {
        this.formInline = {};
        this.$refs.commonSearchItem.reset();
        this.iSearch(false);
      },
      250,
      { leading: true, trailing: false }
    ),

    // 查询-对比
    iSearchTwo(openLoading = true) {
      openLoading && this.handleLoadingTwo();
      Promise.all([this.getCompChartsList()])
        .then((res) => { })
        .finally(() => {
          this.cancelLoadingTwo();
        });
    },

    // 重置-对比
    iRestTwo: debounce(
      function () {
        this.formInlineTwoObj = {
          compType: "1",
          dataSource: 1,
          mouthTime: moment().startOf("month").format("YYYY-MM-DD"),
        };
        this.$refs.commonSearchItemTwo.reset();
        this.iSearchTwo(false);
      },
      250,
      { leading: true, trailing: false }
    ),

    // 初始化option
    initOption() {
      //隐患数量统计
      this.optionA.toolbox.feature = this.getFeatureMixin({
        refreshFnName: "getChartsList",
        exportFnObj: {
          fnName: "exoprtChartsList",
          apiName: ExoprtChartsList,
        },
      });
      //隐患整改情况
      this.optionB.toolbox.feature = this.getFeatureMixin({
        refreshFnName: "getRectificationChartsList",
        exportFnObj: {
          fnName: "exoprtRectificationChartsList",
          apiName: ExoprtRectificationChartsList,
        },
      });
      //隐患超期情况
      this.optionC.toolbox.feature = this.getFeatureMixin({
        refreshFnName: "getExceedChartsList",
        exportFnObj: {
          fnName: "exoprtExceedChartsList",
          apiName: ExoprtExceedChartsList,
        },
      });
      //隐患类别
      this.optionD.toolbox.feature = this.getFeatureMixin({
        refreshFnName: "getCategoryChartsList",
        exportFnObj: {
          fnName: "exoprtCategoryChartsList",
          apiName: ExoprtCategoryChartsList,
        },
      });
      this.optionE.toolbox.feature = this.getFeatureMixin({
        //隐患级别
        refreshFnName: "getLevelChartsList",
        exportFnObj: {
          fnName: "exoprtLevelChartsList",
          apiName: ExoprtLevelChartsList,
        },
      });
      //对比分析
      this.optionF.toolbox.feature = this.getFeatureMixin({
        refreshFnName: "getCompChartsList",
        exportFnObj: {
          fnName: "exoprtCompChartsList",
          apiName: ExoprtCompChartsList,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.casualties {
  width: 100%;
  height: 350px;
}
.hidden_father {
  width: 100%;
  .son {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: space-around;
    .left {
      width: 48%;
      margin-right: 40px;
      height: 100%;
    }
    .right {
      flex: 1;
      height: 100%;
    }
  }
}
.title {
  height: 48px;
  background: #fafbff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 12px;
  margin: 40px 0 30px 0;
  .title-left {
    font-size: 16px;
    line-height: 1.1;
    color: #000000;
    font-weight: bold;
  }
}
.hidden_H1 {
  border-bottom: solid #dadada 1px;
  padding: 0px 0 20px 10px;
  font-size: 18px;
  font-weight: bold;
}
.mouthEl {
  ::v-deep .el-input__inner {
    width: 200px !important;
    height: 38px !important;
  }
}
.line_Div {
  width: 100%;
  height: 1px;
  border-bottom: dashed 3px #ccc;
  margin: 20px 0 40px 0;
}
.scal_span {
  font-size: 14px;
}
.echarts-empty {
  padding-top: 90px;
}
</style>