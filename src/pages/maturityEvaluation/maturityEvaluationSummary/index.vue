<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div ref="downloadArea">
      <SearchTerm>
        <a-form-model layout="inline" :model="formInline" :colon="false">
          <a-form-model-item label="年份">
            <el-date-picker v-model="formInline.year" type="year" value-format="yyyy" placeholder="选择年" :clearable="false"></el-date-picker>
          </a-form-model-item>
          <a-form-model-item label="日期">
            <a-select v-model="formInline.fillDate" placeholder="请选择">
              <a-select-option v-for="(i, index) in monthOption" :key="index" :value="i.value">{{ i.name }}</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item class="float-right">
            <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
            <a-button @click="iRest">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </SearchTerm>

      <template description="评价结果">
        <div class="secondary-title">
          <div class="secondary-title-left">评价结果</div>
        </div>

        <EvaluatResult />
        <div style="height: 40px"></div>
      </template>

      <template description="主要扣分明细" v-if="false">
        <div class="secondary-title">
          <div class="secondary-title-left">主要扣分明细</div>
        </div>

        <a-table
          :columns="columnsDetails"
          :scroll="{ x: tableScrollX() }"
          bordered
          :locale="{ emptyText: emptyText }"
          :data-source="tableDataList"
          :rowKey="(record, index) => {return record.id;}"
          :pagination="false"
        >
          <div slot="orderNum" slot-scope="record,index">{{index+1}}</div>
          <div slot="deductionDescribe" slot-scope="record" class="table-p-box">
            <p v-for="(i,index) in record" :key="index">{{i}}</p>
          </div>
        </a-table>
        <div style="height: 40px"></div>
      </template>

      <template description="部门得分环比统计" v-if="false">
        <div class="injury-box">
          <div class="secondary-title">
            <div class="secondary-title-left">部门得分环比统计</div>
          </div>
          <template v-if="propertyLossOption.series && propertyLossOption.series.length">
            <div class="injury-Echarts">
              <Echarts :option="propertyLossOption" />
            </div>
          </template>
          <template v-else>
            <a-empty />
          </template>
        </div>
        <div style="height: 40px"></div>
      </template>

      <template description="部门得分月度统计" v-if="false">
        <div class="injury-box">
          <div class="secondary-title">
            <div class="secondary-title-left">部门得分月度统计</div>
          </div>
          <template v-if="monthlyOption.series && monthlyOption.series.length">
            <div class="injury-Echarts">
              <Echarts :option="monthlyOption" />
            </div>
          </template>
          <template v-else>
            <a-empty />
          </template>
        </div>
        <div style="height: 40px"></div>
      </template>
    </div>
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dictionary from "@/utils/dictionary";
import dayJs from "dayjs";
import { debounce, cloneDeep } from "lodash";
import Echarts from "@/components/echarts/index.vue";
import { querySummayDeptData, achDeptSummaryBar, achDeptSummaryLevel, } from "@/services/performanceManagementBranch.js";
import { downLoadReport } from "@/utils/common.js";
import EvaluatResult from './evaluatResult.vue'
export default {
  components: { Echarts,EvaluatResult },
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      formInline: {},
      columns: [
        {
          title: "维度",
          dataIndex: "weidu",
          minWidth: 120,
        },
        {
          title: "项目",
          dataIndex: "xiangmu",
          minWidth: 200,
        },
        {
          title: "分值",
          dataIndex: "fenzhi",
          minWidth: 100,
        },
        {
          title: "得分明细",
          children: [
            {
              title: '部门1',
              dataIndex: 'bumen1',
              align: 'center',
            },
            {
              title: '部门2',
              dataIndex: 'bumen2',
              align: 'center',
            },
            {
              title: '单项均分',
              dataIndex: 'danxiangjunfen',
              align: 'center',
            },
          ],
        },
      ],
      columnsDetails: [
        {
          title: "序号",
          scopedSlots: { customRender: 'orderNum' },
          align: 'center',
          width: 80,
        },
        {
          title: "部门",
          dataIndex: "bumen",
          align: 'center',
          minWidth: 200,
        },
        {
          title: "3月得分",
          dataIndex: "3yuedefen",
          align: 'center',
          minWidth: 100,
        },
        {
          title: "4月得分",
          dataIndex: "4yuedefen",
          align: 'center',
          minWidth: 100,
        },
        {
          title: "环比",
          dataIndex: "huanbi",
          align: 'center',
          minWidth: 100,
        },
        {
          title: "主要扣分项",
          dataIndex: "zhuyaokoufenxiang",
          align: 'center',
          minWidth: 100,
        },
        {
          title: "总分",
          dataIndex: "zongfen",
          align: 'center',
          minWidth: 100,
        },
        {
          title: "得分",
          dataIndex: "defen",
          align: 'center',
          minWidth: 100,
        },
        {
          title: "扣分点描述",
          scopedSlots: { customRender: 'deductionDescribe' },
          align: 'center',
          minWidth: 100,
        },
      ],
      propertyLossOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {},
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
          }
        ],
        series: [
          {
            name: 'Evaporation',
            type: 'bar',
            data: [
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ]
          },
          {
            name: 'Precipitation',
            type: 'bar',
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
          },
        ]
      },
      monthlyOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {},
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: 'Evaporation',
            type: 'bar',
            data: [
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ]
          },
          {
            name: 'Precipitation',
            type: 'bar',
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
          },
          {
            name: 'Temperature',
            type: 'line',
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]
      },
      tableDataList: [],
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
    };
  },
  created() {
    this.setRouterCode("performanceBranchSummary");
  },
  methods: {
    getDataList() {
      return querySummayDeptData(this.formInline)
        .then((res) => {
          this.addLoading = false;
          this.tableDataList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getChartList() {
      return achDeptSummaryBar()
        .then((res) => {
          this.addLoading = false;
          if (res.data.length) {
            this.bOption.series[0].data = res.data.map(
              (i) => i.score
            );
            this.bOption.xAxis[0].data = res.data.map(
              (i) => i.deptName
            );
            this.setOption = this.bOption;
          } else {
            this.setOption = undefined;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 查询
    iSearch() {
      this.getDataList()
    },
    // 重置
    iRest: debounce(
      function () {
        this.formInline = {};
        this.getDataList();
      },
      250,
      { leading: true, trailing: false }
    ),
  },
};
</script>

<style lang="less" scoped>
.table-p-box {
  & > p {
    margin-bottom: 1em;
    &:nth-last-child(1) {
      margin-bottom: 0px;
    }
  }
}
.secondary-title {
  height: 48px;
  background: #fafbff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 12px;
  margin-bottom: 10px;
  .secondary-title-left {
    font-size: 16px;
    line-height: 1.1;
    color: #333;
    font-weight: bold;
  }
}

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

.injury-box {
  .title {
    height: 48px;
    background: #fafbff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 12px;
    margin-bottom: 20px;
    .title-left {
      font-size: 16px;
      line-height: 1.1;
      color: #333;
      font-weight: bold;
    }
  }
  .serch-box {
    padding-left: 14px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .serch-item-lable {
      flex: none;
      margin-right: 20px;
    }
    .serch-item-select {
      min-width: 200px;
    }
  }
  .injury-Echarts {
    width: 100%;
    height: 350px;
  }
}
</style>
