<template>
  <!--  应急演练 -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :needDeptName="true" :hasDepartment="true"></CommonSearchItem>
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
        <a-form-model-item label="演练时间">
          <a-range-picker v-model="formInline.auditTime" valueFormat="YYYY-MM-DD" class="search-range-picker" format="YYYY-MM-DD" style="width: 200px" :placeholder="['开始时间', '结束时间']" />
        </a-form-model-item>
        <a-form-model-item label="预案级别">
          <a-select v-model="formInline.prepType" placeholder="请选择">
            <a-select-option v-for="item in levelList" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>

    <div class="content">
      <!-- 应急演练情况总览 -->
      <div>
        <div class="title">
          <div class="title-left">
            <span>应急演练情况总览</span>
          </div>
          <div class="title-right">
            <a-radio-group v-model="isRadioO" @change="changeRadio($event, 'isRadioO', 'getChartsList')" :disabled="formInlinePreview.dataSource == 1">
              <a-radio value="1">计划演练</a-radio>
              <a-radio value="2">实际演练</a-radio>
            </a-radio-group>&nbsp;&emsp;
          </div>
        </div>
        <div class="emergency_form">
          <span class="emergency_form_span">数据集：</span>
          <a-select v-model="formInlinePreview.dataSource" placeholder="请选择" style="width: 150px" @change="changeData">
            <a-select-option v-for="item in statusList" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
          </a-select>

          <span class="emergency_form_span_two">应急演练类型：</span>
          <a-select v-model="formInlinePreview.drillTypeList" placeholder="请选择" style="width: 250px" mode="multiple" @blur="blur" :disabled="disabled" class="dept-tree">
            <a-select-option v-for="item in dataSource" :key="item.dictValue" :value="item.dictValue">{{ item.dictLabel }}</a-select-option>
          </a-select>
        </div>
        <div class="casualties">
          <Echarts v-if="optionA.series.length" :option="optionA" />
          <a-empty v-else class="echarts-empty" />
        </div>
      </div>

      <!-- 应急演练级别数据 -->
      <div class="hidden_father">
        <div class="son">
          <div class="left">
            <div class="title">
              <div class="title-left">
                <span>应急演练级别数据</span>
              </div>
            </div>
            <div class="casualties">
              <Echarts v-if="optionB.series.length" :option="optionB" />
              <a-empty v-else class="echarts-empty" />
            </div>
          </div>
          <div class="right">
            <div class="title">
              <div class="title-left">
                <span>应急演练级别</span>
              </div>
              <div class="title-right">
                <a-radio-group v-model="isRadioT" @change="
                    changeRadio($event, 'isRadioT', 'getCategoryChartsList')
                  ">
                  <a-radio value="1">计划演练</a-radio>
                  <a-radio value="2">实际演练</a-radio>
                </a-radio-group>
              </div>
            </div>
            <div class="casualties">
              <Echarts v-if="optionC.series[0].data.length" :option="optionC" />
              <a-empty v-else class="echarts-empty" />
            </div>
          </div>
        </div>
      </div>

      <!-- 应急演练类型数据 -->
      <div>
        <div class="title">
          <div class="title-left">
            <span>应急演练类型数据</span>
          </div>
        </div>
        <div class="casualties">
          <Echarts v-if="optionD.series.length" :option="optionD" />
          <a-empty v-else class="echarts-empty" />
        </div>
      </div>

      <!-- 应急演练类型 -->
      <div>
        <div class="title">
          <div class="title-left">
            <span>应急演练类型</span>
          </div>
          <div class="title-right">
            <a-radio-group v-model="isRadioS" @change="changeRadio($event, 'isRadioS', 'getLevelChartsList')">
              <a-radio value="1">计划演练</a-radio>
              <a-radio value="2">实际演练</a-radio>
            </a-radio-group>
          </div>
        </div>
        <div class="casualties">
          <Echarts v-if="optionE.series[0].data.length" :option="optionE" />
          <a-empty v-else class="echarts-empty" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce, isEmpty, cloneDeep } from "lodash";
import cancelLoading from "@/mixin/cancelLoading";
import Echarts from "@/components/echarts/index.vue";
import { barObj } from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import dataAnalysis from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import {
  GetStatisticsChartsOverviewBar,
  GetStatisticsChartsLeveCookie,
  GetStatisticsChartsTypeCookie,
  ExoprtStatisticsChartsTypeCookie,
  ExoprtStatisticsChartsLeveCookie,
  ExoprtStatisticsChartsLeveBar,
  GetStatisticsChartsLeveBar,
  GetStatisticsChartsTypeBar,
  ExoprtStatisticsChartsTypeBar,
  ExoprtStatisticsChartsOverviewBar,
} from "@/services/hiddenCharts.js";
import moment from "moment";
import chemicalDict from "@/mixin/chemicalDict.js";

export default {
  components: { Echarts },
  mixins: [cancelLoading, dataAnalysis, chemicalDict],
  data() {
    return {
      checked: false,
      statusList: [
        { value: "计划演练情况", key: 1 },
        { value: "演练级别", key: 2 },
        { value: "演练类型", key: 3 },
        { value: "演练形式", key: 4 },
      ],
      disabledCommonDept: false,
      levelList: [
        { key: 1, value: "全部预案级别" },
        { key: 2, value: "综合应急预案" },
        { key: 3, value: "专项应急预案" },
        { key: 4, value: "现场处置方案" },
      ],
      formInline: {
        auditTime: [
          moment().startOf("month").format("YYYY-MM-DD"),
          moment().endOf("month").format("YYYY-MM-DD"),
        ],
        prepType: 1,
      },
      formInlinePreview: {
        drillTypeList: [],
        dataSource: 1,
      },
      isRadioO: "",
      isRadioT: "1",
      isRadioS: "1",
      disabled: true,
      dataSource: [], //应急演练类型多选
      dataSourceIdList: [],
      //应急演练情况总览
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
            name: "演练次数（次）",
            alignTicks: true,
          },
          {
            type: "value",
            name: "参演人数（人）",
            alignTicks: true,
          },
        ],
        series: [],
      },

      //应急演练级别数据
      optionB: {
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
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "演练次数（次）",
            alignTicks: true,
          },
          {
            type: "value",
            name: "参演人数（人）",
            alignTicks: true,
          },
        ],
        series: [],
      },
      optionC: {
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
            name: "应急演练级别",
            type: "pie",
            radius: "60%",
            label: {
              formatter: "{b}: {d}%",
            },
            data: [],
          },
        ],
      },

      // 应急演练类型数据
      optionD: {
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
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "演练次数（次）",
            alignTicks: true,
          },
          {
            type: "value",
            name: "参演人数（人）",
            alignTicks: true,
          },
        ],
        series: [],
      },

      // 应急演练类型
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
            name: "应急演练类型",
            type: "pie",
            radius: ["40%", "60%"],
            center: ["50%", "50%"],
            labelLine: {
              length: 5,
            },
            label: {
              formatter: "{b}: {d}%",
            },
            data: [],
          },
        ],
      },
    };
  },
  created() {
    this.setRouterCode('emergencyManagementDA')
    this.dataSource = this.getChemicalDictList("drill_type"); //应急演练类型
    this.initOption(); //初始化option
  },
  mounted() {
    this.iSearch(false);
  },
  methods: {
    //应急演练类型失去焦点
    blur() {
      this.getChartsList();
    },

    //数据集切换
    changeData(val) {
      if (val == 3 && this.dataSource.length) {
        //演练类型
        this.formInlinePreview.drillTypeList = [this.dataSource[0].dictValue];
        this.disabled = false;
      } else {
        this.formInlinePreview.drillTypeList = [];
        this.disabled = true;
      }
      if (val == 1) {
        //应急演练情况总览-禁用计划演练
        this.isRadioO = ''
      } else {
        this.isRadioO = '1'
      }
      this.getChartsList();
    },

    //radio切换
    changeRadio(e, radio, thing) {
      this[radio] = e.target.value;
      this[thing]();
    },

    //获取搜索参数
    getSearchObj() {
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
    },

    //应急演练情况总览
    getChartsList() {
      let apiData = this.getSearchObj();
      let obj = {
        ...apiData,
        ...this.formInlinePreview,
        drillType: this.isRadioO,
      };
      return GetStatisticsChartsOverviewBar(obj).then((res) => {
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
    //应急演练情况总览-导出
    exoprtStatisticsChartsOverviewBar() {
      let apiData = this.getSearchObj();
      let obj = {
        ...apiData,
        ...this.formInlinePreview,
        drillType: this.isRadioO,
      };
      ExoprtStatisticsChartsOverviewBar(obj).then((res) => {
        this.spreadSheetExcel(res, "应急演练情况总览");
      });
    },

    //应急演练级别数据*
    getEmergencyList() {
      let apiData = this.getSearchObj();
      return GetStatisticsChartsLeveBar(apiData).then((res) => {
        let ajaxData = res.data || [];
        if (ajaxData && ajaxData.length) {
          let { xAxisData, series, legendData } = this.barDataHandle(
            ajaxData,
            false,
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
    //应急演练级别数据-导出*
    exoprtStatisticsChartsLeveBar() {
      let apiData = this.getSearchObj();
      ExoprtStatisticsChartsLeveBar(apiData).then((res) => {
        this.spreadSheetExcel(res, "应急演练情况总览");
      });
    },
    //应急演练级别数据-饼状图*
    getCategoryChartsList() {
      let apiData = this.getSearchObj();
      return GetStatisticsChartsLeveCookie({
        ...apiData,
        drillType: this.isRadioT,
      }).then((res) => {
        if (res.data && res.data.length) {
          this.optionC.series[0].data = res.data || [];
        } else {
          this.optionC.series[0].data = [];
        }
      });
    },
    //应急演练级别数据-饼状图导出*
    exoprtStatisticsChartsLeveCookie() {
      let apiData = this.getSearchObj();
      ExoprtStatisticsChartsLeveCookie(apiData).then((res) => {
        this.spreadSheetExcel(res, "隐患类别");
      });
    },

    //应急演练类型数据
    getCompChartsList() {
      let apiData = this.getSearchObj(true);
      return GetStatisticsChartsTypeBar(apiData).then((res) => {
        let ajaxData = res.data || [];
        if (ajaxData && ajaxData.length) {
          let { xAxisData, series, legendData } = this.barDataHandle(
            ajaxData,
            false,
            false
          );
          this.optionD.xAxis[0].data = cloneDeep(xAxisData);
          this.optionD.legend.data = cloneDeep(legendData);
          this.optionD.series = cloneDeep(series);
        } else {
          this.optionD.series = [];
        }
      });
    },
    //应急演练类型-导出
    exoprtStatisticsChartsTypeBar() {
      let apiData = this.getSearchObj(true);
      ExoprtStatisticsChartsTypeBar(apiData).then((res) => {
        this.spreadSheetExcel(res, "对比分析");
      });
    },

    //应急演练类型-饼状图
    getLevelChartsList() {
      let apiData = this.getSearchObj();
      return GetStatisticsChartsTypeCookie({
        ...apiData,
        drillType: this.isRadioS,
      }).then((res) => {
        if (res.data && res.data.length) {
          this.optionE.series[0].data = res.data || [];
        } else {
          this.optionE.series[0].data = [];
        }
      });
    },
    //应急演练类型-导出
    exoprtStatisticsChartsTypeCookie() {
      let apiData = this.getSearchObj();
      ExoprtStatisticsChartsTypeCookie(apiData).then((res) => {
        this.spreadSheetExcel(res, "隐患级别");
      });
    },


    // 查询
    iSearch(openLoading = true) {
      openLoading && this.handleLoading();
      Promise.all([
        this.getChartsList(),
        this.getEmergencyList(),
        this.getCategoryChartsList(),
        this.getCompChartsList(),
        this.getLevelChartsList(),
      ])
        .then((res) => { })
        .finally(() => {
          this.cancelLoading();
        });
    },
    // 重置
    iRest: debounce(
      function () {
        this.$refs.commonSearchItem.reset();
        this.formInline = {
          auditTime: [
            moment().startOf("month").format("YYYY-MM-DD"),
            moment().endOf("month").format("YYYY-MM-DD"),
          ],
          prepType: 1,
        };
        this.iSearch();
      },
      250,
      { leading: true, trailing: false }
    ),

    // 初始化option
    initOption() {
      //应急演练情况总览
      this.optionA.toolbox.feature = this.getFeatureMixin({
        refreshFnName: "getChartsList",
        exportFnObj: {
          fnName: "exoprtStatisticsChartsOverviewBar",
          apiName: ExoprtStatisticsChartsOverviewBar,
        },
      });
      //应急演练级别数据-柱状
      this.optionB.toolbox.feature = this.getFeatureMixin({
        refreshFnName: "getEmergencyList",
        exportFnObj: {
          fnName: "exoprtStatisticsChartsLeveBar",
          apiName: ExoprtStatisticsChartsLeveBar,
        },
      });
      //应急演练级别数据-饼图
      this.optionC.toolbox.feature = this.getFeatureMixin({
        refreshFnName: "getCategoryChartsList",
        exportFnObj: {
          fnName: "exoprtStatisticsChartsLeveCookie",
          apiName: ExoprtStatisticsChartsLeveCookie,
        },
      });
      //应急演练类型数据
      this.optionD.toolbox.feature = this.getFeatureMixin({
        refreshFnName: "getCompChartsList",
        exportFnObj: {
          fnName: "exoprtStatisticsChartsTypeBar",
          apiName: ExoprtStatisticsChartsTypeBar,
        },
      });
      //应急演练类型
      this.optionE.toolbox.feature = this.getFeatureMixin({
        refreshFnName: "getLevelChartsList",
        exportFnObj: {
          fnName: "exoprtStatisticsChartsTypeCookie",
          apiName: ExoprtStatisticsChartsTypeCookie,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.echarts-empty {
  padding-top: 90px;
}
.dept-tree {
  height: 38px;
  ::v-deep .ant-select-selection {
    height: 100%;
    .ant-select-selection__rendered {
      height: 100%;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 0;
      }
    }
  }
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
.casualties {
  width: 100%;
  height: 350px;
  // margin-bottom: 40px;
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
  margin: 40px 0 20px 0;
  .title-left {
    font-size: 16px;
    line-height: 1.1;
    color: #000000;
    font-weight: bold;
  }
}
.noMargin {
  margin-bottom: 0;
}
.emergency_form {
  width: 100%;
  margin: 20px 0;
  display: flex;
  align-items: center;
  .emergency_form_span {
    padding: 0 0 0 10px;
  }
  .emergency_form_span_two {
    padding: 0 0 0 20px;
  }
}
.scal_span {
  font-size: 14px;
  // text-align: right;
  // padding-left: 20px;
}
</style>