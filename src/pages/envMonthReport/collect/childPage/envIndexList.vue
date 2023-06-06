<template>
  <!-- 环境指标详表 -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="searchFormData" :colon="false">
        <a-form-model-item label="日期筛选">
          <a-select v-model="searchFormData.dateType" @change="handleChange" placeholder="请选择">
            <a-select-option key="1">月度</a-select-option>
            <a-select-option key="2">季度</a-select-option>
            <a-select-option key="3">半年度</a-select-option>
            <a-select-option key="4">年度</a-select-option>
          </a-select>
          <span style="width:10px;display: inline-block;"></span>
          <el-date-picker v-if="searchFormData.dateType==1" v-model="searchFormData.dateStr" value-format="yyyy-MM" type="month" placeholder="选择月" :clearable="false"></el-date-picker>
          <template v-if="searchFormData.dateType==2">
            <el-date-picker v-model="searchFormData.dateStr" type="year" value-format="yyyy" placeholder="选择年" :clearable="false"></el-date-picker>
            <span style="width:10px;display: inline-block;"></span>
            <a-select v-model="searchFormData.dataType" placeholder="请选择">
              <a-select-option key="1">第一季度</a-select-option>
              <a-select-option key="2">第二季度</a-select-option>
              <a-select-option key="3">第三季度</a-select-option>
              <a-select-option key="4">第四季度</a-select-option>
            </a-select>
          </template>
          <template v-if="searchFormData.dateType==3">
            <el-date-picker v-model="searchFormData.dateStr" type="year" value-format="yyyy" placeholder="选择年" :clearable="false"></el-date-picker>
            <span style="width:10px;display: inline-block;"></span>
            <a-select v-model="searchFormData.dataType" placeholder="请选择">
              <a-select-option key="1">上半年</a-select-option>
              <a-select-option key="2">下半年</a-select-option>
            </a-select>
          </template>
          <el-date-picker v-if="searchFormData.dateType==4" v-model="searchFormData.dateStr" type="year" value-format="yyyy" placeholder="选择年" :clearable="false"></el-date-picker>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <!-- 列表 -->
    <vxe-table border resizable align="center" :data="tableData">
      <vxe-column field="carBonName" title="项目"></vxe-column>

      <vxe-column v-for="(i,index) in titleList" :field="i" :title="findCorporationId(i)" :key="index"></vxe-column>
      <template #empty>
        <div style="padding:16px 0;">
          <a-empty />
        </div>
      </template>
    </vxe-table>
    <chart :option="optionData"></chart>
  </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { debounce } from "lodash";
import getDictionaryItemObj from "@/utils/dictionary.js";
import { environmentMonthDetailed } from "@/services/envMonth.js";
import dayJs from "dayjs";
import chart from "./chart.vue";
// import tableDataJson from "@/pages/envMonthReport/terrain/childPage/monthlyData.js";
import tableDataJson from "@/pages/envMonthReport/terrain/childPage/aikoMonthData.js";
import { tableConversion, findCorporationId, lastMonth } from "./methods.js";
export default {
  components: { chart },
  data() {
    return {
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      searchFormData: { dateType: '1', dateStr: lastMonth(), dataType: '' },
      tableDataList: [],
      checkItemList: null,
      option: {
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
          data: ["碳排放强度(kgCO2e/m2)", "电耗(kWh/m2)", "水耗(t/m2)", "废弃物单耗(kg/m2)", "废弃物单价(元/t)"],
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
            data: [123],
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "",
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
            name: "",
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
            name: "碳排放强度(kgCO2e/m2)",
            type: "bar",
            emphasis: {
              focus: "series",
            },
            barMaxWidth: 50,
            data: [],
          },
          {
            name: "电耗(kWh/m2)",
            type: "bar",

            emphasis: {
              focus: "series",
            },
            barMaxWidth: 50,
            data: [],
          },
          {
            name: "水耗(t/m2)",
            type: "bar",
            yAxisIndex: 1,
            barMaxWidth: 50,
            data: [],
          },
          {
            name: "废弃物单耗(kg/m2)",
            type: "line",
            yAxisIndex: 1,
            data: [],
          },
          {
            name: "废弃物单价(元/t)",
            type: "line",
            yAxisIndex: 1,
            data: [],
          },
        ],
      },
      optionData: undefined,
      loading: false,
      titleList: null,
      tableData: null,
    };
  },
  computed: {
    corporationList() {
      return this.$store.state.setting.corporationList
    },
  },
  created() {
    this.initData();
  },
  mounted() { },
  methods: {
    findCorporationId,
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.initData();
    },
    // 字典组每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.initData();
    },
    // 重置
    iRest: debounce(
      function () {
        this.searchFormData = { dateType: '1', dateStr: lastMonth(), dataType: '' };
        this.initData();
      },
      250,
      { leading: true, trailing: false }
    ),
    // 查询
    iSearch() {

      this.initData();
    },
    initData() {
      environmentMonthDetailed({
        ...this.searchFormData,
      }).then((res) => {

        let data = res.data;
        if (Object.keys(data).length === 0) {
          this.optionData = undefined
          this.titleList = null;
          this.tableData = null
        } else {
          let tableData = []
          let titleList = []
          for (let key in data) {
            let item = this.findData(key)
            for (let i = 0; i < data[key].length; i++) {
              let name = data[key][i].corporationId;
              if (key == 1110) {
                titleList.push(name);
              }
              item[name] = data[key][i].dataItem
            }
            tableData.push(item)
          }
          console.log(tableData)
          console.log(titleList)

          this.titleList = titleList;
          tableData.splice(0, 0, ...tableData.splice(3, 1))
          this.tableData = tableData
          console.log(this.option.xAxis[0].data)

          this.option.xAxis[0].data = this.titleList.map(findCorporationId)

          for (let i = 0; i < this.tableData.length; i++) {
            this.option.series[i].data = []
            for (let j = 0; j < this.titleList.length; j++) {
              let key = this.titleList[j]
              console.log(this.tableData[i][key])
              this.option.series[i].data.push(this.tableData[i][key])
            }
            // this.option.series[i].name = this.tableData[i].carBonName
          }
          console.log(this.option.series)
          this.optionData = this.option
        }
      });
    },
    handleChange(e) {
      if (e == 1 || e == 4) {
        this.searchFormData.dataType = '';
      } else {
        this.searchFormData.dataType = '1';
      }
      if (e != 1) {
        this.searchFormData.dateStr = new Date().getFullYear().toString();
      }
    },
    findData(key) {
      let item = tableDataJson.find(i => {
        return i.nicheItemsCode == key
      })
      return item
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
</style>
