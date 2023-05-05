<template>
  <div class="flue-gas-monitoring clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <PageTitle>{{locationPollutantName}}</PageTitle>
      <SearchTerm>
        <a-form-model layout="inline" :model="formInline" :colon="false">
          <a-form-model-item label="日期范围选择">
            <a-range-picker
              separator="至"
              :allowClear="false"
              v-model="formInline.auditTime"
              class="search-range-picker"
              format="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              style="width: 260px"
              :placeholder="['开始时间','结束时间']"
            ></a-range-picker>
          </a-form-model-item>
          <a-form-model-item class="float-right">
            <a-button type="primary" :loading="loading" @click="iSearch(true)">查询</a-button>
            <a-button @click="iRest">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </SearchTerm>
      <div>
        <a-tabs v-model="activeKey" @change="changeTabs">
          <a-tab-pane key="1" tab="浓度监测值(mg/m3)">
            <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
              <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" :cell-style="cellStyle" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
                <vxe-column field="nowTime" :min-width="120" title="监控时间"></vxe-column>
                <vxe-column field="rtd" :min-width="120" title="浓度监测值(mg/m3)"></vxe-column>
                <vxe-column field="alarmUp" :min-width="120" title="预警值(mg/m3)"></vxe-column>
                <vxe-column field="warningUp" :min-width="120" title="报警值(mg/m3)"></vxe-column>
                <vxe-column field="flagName" :min-width="120" title="标记"></vxe-column>
                <template #empty>
                  <div style="padding:16px 0;">
                    <a-empty />
                  </div>
                </template>
              </vxe-table>
            </CommonTable>
          </a-tab-pane>
          <a-tab-pane key="2" tab="速率监测值(kg/h)">
            <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
              <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" :cell-style="cellStyle" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
                <vxe-column field="nowTime" :min-width="120" title="监控时间"></vxe-column>
                <vxe-column field="rtd" :min-width="120" title="速率监测值(kg/h)"></vxe-column>
                <vxe-column field="alarmUp" :min-width="120" title="预警值(kg/h)"></vxe-column>
                <vxe-column field="warningUp" :min-width="120" title="报警值(kg/h)"></vxe-column>
                <vxe-column field="flagName" :min-width="120" title="标记"></vxe-column>
                <template #empty>
                  <div style="padding:16px 0;">
                    <a-empty />
                  </div>
                </template>
              </vxe-table>
            </CommonTable>
          </a-tab-pane>
          <a-tab-pane key="a19001" tab="氧含量(%)">
            <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
              <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
                <vxe-column field="nowTime" :min-width="120" title="监控时间"></vxe-column>
                <vxe-column field="rtd" :min-width="120" title="氧含量(%)"></vxe-column>
                <template #empty>
                  <div style="padding:16px 0;">
                    <a-empty />
                  </div>
                </template>
              </vxe-table>
            </CommonTable>
          </a-tab-pane>
          <a-tab-pane key="a01011" tab="烟气流速(m/s)">
            <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
              <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
                <vxe-column field="nowTime" :min-width="120" title="监控时间"></vxe-column>
                <vxe-column field="rtd" :min-width="120" title="烟气流速(m/s)"></vxe-column>
                <template #empty>
                  <div style="padding:16px 0;">
                    <a-empty />
                  </div>
                </template>
              </vxe-table>
            </CommonTable>
          </a-tab-pane>
          <a-tab-pane key="a01012" tab="烟气温度(℃)">
            <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
              <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
                <vxe-column field="nowTime" :min-width="120" title="监控时间"></vxe-column>
                <vxe-column field="rtd" :min-width="120" title="烟气温度(℃)"></vxe-column>
                <template #empty>
                  <div style="padding:16px 0;">
                    <a-empty />
                  </div>
                </template>
              </vxe-table>
            </CommonTable>
          </a-tab-pane>
          <a-tab-pane key="a01014" tab="烟气湿度(%)">
            <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
              <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
                <vxe-column field="nowTime" :min-width="120" title="监控时间"></vxe-column>
                <vxe-column field="rtd" :min-width="120" title="烟气湿度(%)"></vxe-column>
                <template #empty>
                  <div style="padding:16px 0;">
                    <a-empty />
                  </div>
                </template>
              </vxe-table>
            </CommonTable>
          </a-tab-pane>
          <a-tab-pane key="a01013" tab="烟气压力(kpa)">
            <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
              <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
                <vxe-column field="nowTime" :min-width="120" title="监控时间"></vxe-column>
                <vxe-column field="rtd" :min-width="120" title="烟气压力(kpa)"></vxe-column>
                <template #empty>
                  <div style="padding:16px 0;">
                    <a-empty />
                  </div>
                </template>
              </vxe-table>
            </CommonTable>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-spin>
  </div>
</template>

<script>
import dayJs from "dayjs";
import { cloneDeep, debounce } from "lodash";
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
import getPollutantListMixin from '@/pages/environmental/earlyWarnInfo/mixin/getPollutantListMixin'
import { getFlueGasMonitoringMoreApi } from "@/services/earlyWarnAlarmInfo.js";
import dictionary from '@/utils/dictionary'
export default {
  mixins: [chemicalDict, cancelLoading, getPollutantListMixin],
  data() {
    return {
      spinning: true,
      activeKey: '1',
      formInline: {
        instrumentPollutantRelId: undefined,
        auditTime: [],
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      tableList: [],
    }
  },
  created() {
    this.formInline.auditTime[0] = dayJs().subtract(1, 'year').format('YYYY-MM-DD')
    this.formInline.auditTime[1] = dayJs().format('YYYY-MM-DD')
    this.getPollutantListFn()
      .then(res => {
        this.formInline.instrumentPollutantRelId = this.$route.query.instrumentPollutantRelId;
        // console.log(this.matchPollutant(this.formInline.instrumentPollutantRelId));
        this.getTableList();
      })
      .catch(err => { })
      .finally(() => {
        setTimeout(() => {
          this.spinning = false
        }, 200);
      })
  },
  computed: {
    locationPollutantName() {
      let pollutantObj = this.matchPollutant(this.formInline.instrumentPollutantRelId, true)
      let textName = pollutantObj ? pollutantObj.locationPollutantName : ''
      return textName
    }
  },
  methods: {
    // 查询
    iSearch() {
      this.handleLoading();
      this.getTableList();
    },
    // 标记字段匹配文字颜色
    cellStyle({ row, column }) {
      if (column.property == 'flagName') {
        return {
          color: row.flagColor
        }
      }
    },
    getTableList() {
      let pollutantNum = this.activeKey
      if (this.activeKey == 1 || this.activeKey == 2) {
        let matchPollutantInfo = this.matchPollutant(this.formInline.instrumentPollutantRelId, true)
        if (matchPollutantInfo) {
          pollutantNum = this.activeKey == 1 ? matchPollutantInfo.pollutantNum : matchPollutantInfo.pollutantNum + 'XXX'
        } else {
          pollutantNum = ''
        }
      }
      let apiData = {
        pollutantNum,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        ...this.formInline,
        auditTime: undefined,
        startTime: this.formInline.auditTime && this.formInline.auditTime.length ? this.formInline.auditTime[0] : undefined,
        endTime: this.formInline.auditTime && this.formInline.auditTime.length ? this.formInline.auditTime[1] : undefined
      };
      getFlueGasMonitoringMoreApi(apiData)
        .then((res) => {
          let { list: tableList, total } = res.data ? res.data : { list: [], total: 0 };
          // 处理标记
          tableList.forEach(item => {
            item.flagName = item.flag ? dictionary('alarm_type', item.flag) : ''
            item.flagColor = item.flag ? dictionary('alarm_type', item.flag, false).color : ''
          })
          this.tableList = tableList || [];
          this.page.total = total;
          // 处理页码 问题
          if (this.tableList.length === 0 && (this.page.pageNo !== 1 && this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 重置
    iRest: debounce(
      function () {
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.formInline.auditTime[0] = dayJs().subtract(1, 'year').format('YYYY-MM-DD')
        this.formInline.auditTime[1] = dayJs().format('YYYY-MM-DD')
        this.getTableList();
      },
      250,
      { leading: true, trailing: false }
    ),
    // tab切换
    changeTabs(key) {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
      this.tableList = []
      this.handleLoadingTwo()
      setTimeout(() => {
        this.getTableList();
      }, 100);
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      this.getTableList();
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getTableList();
    },
  }

}
</script>

<style lang="less" scoped>
/deep/.table-draggable-handle {
  border: 1px solid red;
  height: 100% !important;
  left: auto !important;
  right: -5px;
  cursor: col-resize;
  touch-action: none;
  border: none;
  position: absolute;
  transform: none !important;
  bottom: 0;
}
/deep/.resize-table-th {
  position: relative;
}

::v-deep .ant-calendar-range-picker-separator {
  margin-top: 8px;
}
::v-deep .a-spin {
  display: flex;
  flex: 1;
  overflow: hidden;
  .ant-spin-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .ant-spin-blur {
    opacity: 0.06 !important;
  }
}
</style>