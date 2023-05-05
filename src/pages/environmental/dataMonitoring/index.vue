<template>
  <div class="data-monitoring clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div class="content">
      <template title="废水数据监测">
        <div class="injury-box">
          <div class="title">
            <div class="title-left">废水数据监测</div>
            <div class="title-right"></div>
          </div>
          <div class="data-monitoring_form">
            <span class="data-monitoring_form_span">废水：</span>
            <a-select v-model="waterForm.pollutantName" placeholder="请选择" @change="changeData('water')">
              <a-select-option v-for="item in wasteWater" :key="item.value" :value="item.value">{{ item.label}}</a-select-option>
            </a-select>
          </div>
          <template v-if="showWater">
            <div class="injury-Echarts">
              <Echarts :option="optionA" />
            </div>
          </template>
          <template v-else>
            <a-empty />
          </template>
        </div>
      </template>

      <template title="废气数据监测">
        <div class="injury-box">
          <div class="title">
            <div class="title-left">废气数据监测</div>
            <div class="title-right"></div>
          </div>
          <div class="data-monitoring_form">
            <span class="data-monitoring_form_span">废气：</span>
            <a-select v-model="gasForm.pollutantName" placeholder="请选择" @change="changeData('gas')">
              <a-select-option v-for="item in wasteGas" :key="item.value" :value="item.value">{{ item.label}}</a-select-option>
            </a-select>
          </div>
          <template v-if="showGas">
            <div class="injury-Echarts">
              <Echarts :option="optionGas" />
            </div>
          </template>
          <template v-else>
            <a-empty />
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { debounce, isEmpty, cloneDeep } from "lodash";
import cancelLoading from "@/mixin/cancelLoading";
import Echarts from "@/components/echarts/index.vue";
import { barObj } from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import dataAnalysis from "@/pages/hiddenPerils/dataAnalysis/mixin/dataAnalysis.js";
import { monitorDataIndex } from "@/services/api.js";
import dictionary from '@/utils/newDictionary'
import { mapActions } from 'vuex'
import chemicalDict from "@/mixin/chemicalDict.js";
export default {
  components: { Echarts },
  mixins: [cancelLoading, dataAnalysis,chemicalDict],
  data() {
    return {
      showWater: false,
      showGas: false,
      hiddenEexport: true,
      wasteWater: [],
      wasteGas:[],
      waterForm: {
        pollutantName: undefined,
      },
      gasForm: {
        pollutantName: undefined,
      },
      summary: false,
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
          data: ['平均值','最大值'],
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
            data:[]
            // data:['B1','B2','B3','B4']
          },
        ],
        yAxis: [
          {
            type: "value",
            name: " ",
            alignTicks: true,
          },
        ],
        series: [
          {
            name: '平均值',
            type: 'bar',
            barMaxWidth: 50,
            // itemStyle: {
            //   color: '#91cc75',
            // },
            data: [],
          },
          {
            name: '最大值',
            type: 'line',
            // itemStyle: {
            //   color: '#91cc75',
            // },
            data: [],
          },
        ],
      },
      optionGas: {
        tooltip: { ...barObj.tooltip },
        toolbox: {
          emphasis: {
            ...barObj.emphasis,
          },
          feature: {},
        },
        grid: barObj.grid,
        legend: {
          data: ['平均值','最大值'],
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
            data:[]
          },
        ],
        yAxis: [
          {
            type: "value",
            name: " ",
            alignTicks: true,
          },
        ],
        series: [
          {
            name: '平均值',
            type: 'bar',
            barMaxWidth: 50,
            // itemStyle: {
            //   color: '#91cc75',
            // },
            data: [],
          },
          {
            name: '最大值',
            type: 'line',
            // itemStyle: {
            //   color: '#91cc75',
            // },
            data: [],
          },
        ],
      },
    }
  },
  computed: {
    pollutantOptions() {
      return this.$store.state.setting.pollutantOptions;
    },
  },
  watch: {
    pollutantOptions: {
      handler(newV) {
        if(newV && newV.length) {
          const wasteWater = newV.filter(item=>{
            return item.numberPickInstrumentType == 'water'
          });
          this.wasteWater = this.getPollutant(wasteWater);
          this.waterForm.pollutantName = this.wasteWater[0] ? this.wasteWater[0].value : undefined; //污染物选择框默认选中第一个污染物
          const wasteGas = newV.filter(item=>{
            return item.numberPickInstrumentType == 'gas'
          });
          this.wasteGas = this.getPollutant(wasteGas);
          this.gasForm.pollutantName = this.wasteGas[0] ? this.wasteGas[0].value : undefined; //污染物选择框默认选中第一个污染物
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.setRouterCode("dataMonitoring");
    this.getPollutantOptions();
    this.initOption();
    this.getWasteWater();
    this.getWasteGas();
  },
  methods: {
    ...mapActions("setting", ["getPollutantOptions"]),
    getPollutant(pollutant) {
      if(pollutant.length && pollutant.length >=1) {
        const newPollutant = [];
        for(let item of pollutant) {
          let unit = item.pollutantUnit ? '(' + item.pollutantUnit + ')' : '';
          let location = this.getChemicalDictText('point_location',item.location)
          let obj = {
            value: item.location + item.pollutantName,
            label: location + item.pollutantName + unit,
          }
          if(!newPollutant.some(ele=>ele.value == obj.value)) {
            newPollutant.push(obj)
          }
        }
        return newPollutant;
      } else {
        return []
      }
    },
    //数据集切换
    changeData(key) {
      if(key=='water') {
        this.getWasteWater();
      } else {
        this.getWasteGas()
      }
    },
    initOption() {
      this.optionA.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getWasteWater',
        // exportFnObj: {
        //   apiName: proposalAnalyseCountDownLoad, //导出文件的接口
        //   fileName: '废水数据监测',
        // }
      });
      this.optionGas.toolbox.feature = this.getFeatureMixin({
        refreshFnName: 'getWasteGas',
      });
    },
    getWasteWater() {
      let apiData = {
        ...this.waterForm,
      }
      monitorDataIndex(apiData).then(res=>{
        const data = res.data;
        if(data && data.xdata &&data.xdata.length>0) {
          this.showWater = true;
          this.optionA.xAxis[0].data = data.xdata;
          this.optionA.series[0].data = data.barData;
          this.optionA.series[1].data = data.lineData;
        } else {
          this.showWater = false
        }
      }).catch(err=>{
        this.showWater = false
      })
    },
    getWasteGas() {
      let apiData = {
        ...this.gasForm,
      }
      monitorDataIndex(apiData).then(res=>{
        const data = res.data;
        if(data && data.xdata && data.xdata.length>0) {
          this.showGas = true;
          this.optionGas.xAxis[0].data = data.xdata;
          this.optionGas.series[0].data = data.barData;
          this.optionGas.series[1].data = data.lineData;
        } else {
          this.showGas = false
        }
      }).catch(err=>{
        this.showGas = false
      })
    },
  }
}
</script>

<style scoped lang="less">
.data-monitoring {
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
  .data-monitoring_form {
    ::v-deep .ant-select {
      width: 220px;
    }
  }
}
::v-deep .ant-empty {
  margin-bottom: 20px;
}
}
</style>