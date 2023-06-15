<template>
  <!-- 废气预警信息 -->
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" @corporationChange="corporationChange"></CommonSearchItem>
        <a-form-model-item label="污染物">
          <a-select allowClear v-model="formInline.instrumentPollutantRelId" :disabled="!formInline.corporationId" :placeholder="formInline.corporationId?'请选择':'请先选择所属组织'">
            <a-select-option v-for="item in pollutantGasList" :key="item.instrumentPollutantRelId" :value="item.instrumentPollutantRelId">{{item.locationPollutantName}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select allowClear v-model="formInline.alarmState" placeholder="请选择">
            <a-select-option v-for="item in dictionary('waste_gas_status')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="处理类型">
          <a-select allowClear v-model="formInline.dealWithType" placeholder="请选择">
            <a-select-option v-for="item in dictionary('waste_gas_handle_type')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <DateFilter ref="dateFilter" />
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn class="dashBtn-box">
      <div class="pe-data-container">
        <div class="pe-data-item">
          <span class="pe-data-body">预警总数 {{listTotal.allAlarmCount}} 个</span>
        </div>
        <div class="pe-data-item">
          <span class="pe-data-body">今日预警 {{listTotal.todayCount}} 个</span>
        </div>
        <div class="pe-data-item">
          <span class="pe-data-body">当前预警 {{listTotal.unCloseCount}} 个</span>
        </div>
      </div>
      <div>
        <a-button type="primary" :loading="loadingThree" @click="exportExcel">导出Excel</a-button>
      </div>
    </DashBtn>

    <!--表格列表 -->
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
        <vxe-column field="corporationName" :min-width="120" title="所属组织"></vxe-column>
        <vxe-column field="monitoryPoint" :min-width="120" title="监控点"></vxe-column>
        <vxe-column field="pollutantName" :min-width="120" title="污染物"></vxe-column>
        <vxe-column field="classificationName" :min-width="120" title="预警分类"></vxe-column>
        <vxe-column field="warningTime" :min-width="150" title="预警时间"></vxe-column>
        <vxe-column field="nowConcentration" :min-width="140" title="实时浓度(mg/m3)"></vxe-column>
        <vxe-column field="alarmConcentration" :min-width="150" title="浓度预警值(mg/m3)"></vxe-column>
        <vxe-column field="relieveTime" :min-width="150" title="解除时间"></vxe-column>
        <vxe-column field="relieveValue" :min-width="120" title="解除值"></vxe-column>
        <vxe-column field="alarmDuration" :min-width="150" title="报警持续时间(小时)"></vxe-column>
        <vxe-column field="alarmStateName" :min-width="120" title="状态"></vxe-column>

        <vxe-column field="action" fixed="right" title="操作" width="110">
          <template #default="{ row }">
            <div class="table-btn-box">
              <span class="color-0067cc cursor-pointer" v-if="row.alarmState == 1" @click="goShowOrHandlePage('show',row)">查看</span>
              <span class="color-0067cc cursor-pointer" v-else @click="goShowOrHandlePage('handle',row)">处理</span>
            </div>
          </template>
        </vxe-column>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </CommonTable>
  </div>
</template>

<script>

import cancelLoading from '@/mixin/cancelLoading';
import dictionary from '@/utils/dictionary'
import chemicalDict from "@/mixin/chemicalDict.js";
import { debounce } from 'lodash';
import { getEarlyWarnInfoListApi, exportEarlyWarnInfoItemApi, getEarlyWarnInfoListTotalApi } from "@/services/earlyWarnAlarmInfo.js";
import DateFilter from '@/pages/environmental/earlyWarnInfo/comp/dateFilter.vue'
import getPollutantListMixin from '@/pages/environmental/earlyWarnInfo/mixin/getPollutantListMixin'
export default {
  components: { DateFilter },
  mixins: [cancelLoading, chemicalDict, getPollutantListMixin],
  data() {
    return {
      tableSpinning:true,
      dictionary,
      formInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      tableList: [],
      // 污染物
      pollutantList: [],
      // 数据合计
      listTotal: {
        allAlarmCount: 0,
        todayCount: 0,
        unCloseCount: 0,
      },
    }
  },
  mounted() {
    this.initConfigPage()
    .finally(() => {
      this.getTableList()
    })
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.initConfigPage()
        .finally(() => {
          this.iRest()
        })
      }
    }, 20);
  },
  methods: {
    initConfigPage(){
      this.tableSpinning = true
      this.getListTotal()
      return this.getPollutantListFn()
    },
    // 数据合计-api
    getListTotal() {
      //  1预警  2报警
      let apiData = { type: '1' }
      getEarlyWarnInfoListTotalApi(apiData)
        .then(res => {
          this.listTotal = res.data || this.listTotal
        })
        .catch(err => { })
    },
    getTableList() {
      let apiData = {
        ...this.formInline,
        ...this.$refs.dateFilter.getFormInline(),
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        // 1-预警，2-报警
        type: 1,
      };
      this.tableSpinning = true
      getEarlyWarnInfoListApi(apiData)
        .then((res) => {
          let { list: tableList, total } = res.data ? res.data : { list: [], total: 0 };
          tableList.forEach(item => {
            let matchPollutantInfo = this.matchPollutant(item.instrumentPollutantRelId, true)
            // 监控点
            item.monitoryPoint = matchPollutantInfo ? matchPollutantInfo.pointItemName : ''
            // 污染物
            item.pollutantName = matchPollutantInfo ? matchPollutantInfo.locationPollutantName : ''
            // 预警分类
            item.classificationName = item.classification ? dictionary('alarm_classification', item.classification) : ''
            // 报警状态
            item.alarmStateName = item.alarmState ? dictionary('waste_gas_status', item.alarmState) : ''
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
          this.tableSpinning = false
          this.cancelLoading();
        })
    },
    // 查询
    iSearch() {
      if (!this.$refs.dateFilter.hasAll()) {
        return
      }
      this.handleLoading();
      this.getTableList();
    },
    // 重置
    iRest: debounce(
      function () {
        this.$refs.commonSearchItem.reset();
        this.$refs.dateFilter.iRest()
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.formInline = {}
        this.getTableList();
      },
      250,
      { leading: true, trailing: false }
    ),
    // 批量导出
    exportExcel() {
      if (!this.canClickBtnMixin("earlyWarnInfoGasExport")) {
        return;
      }
      this.handleLoadingThree()
      let apiData = {
        ...this.formInline,
        ...this.$refs.dateFilter.getFormInline(),
        // 类型  1预警  2报警
        type: 1
      }
      exportEarlyWarnInfoItemApi(apiData)
        .then(res => {
          this.spreadSheetExcel(res, '废气预警信息')
        })
        .catch(() => { })
        .finally(() => {
          this.cancelLoadingThree()
        })
    },
    // 跳转查看、处理页面
    goShowOrHandlePage(type, row) {
      let query = { gasId: row.gasId };
      let path = type == 'show' ? '/environmentManage/environmental/wasteGasShow' : '/environmentManage/environmental/wasteGasHandle'
      this.$router.push({
        path,
        query,
      });
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getTableList();
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getTableList();
    },
    corporationChange() {
      this.$set(this.formInline, 'instrumentPollutantRelId', undefined)
    }
  },
  watch: {
    'formInline.centerId'(newVal, oldVal) {
      this.corporationChange()
    }
  }
}
</script>

<style lang="less" scoped>
.table-btn-box {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.dashBtn-box {
  display: flex;
  align-items: center;
  .pe-data-container {
    display: flex;
    .pe-data-item {
      width: 204px;
      height: 64px;
      background: rgba(250, 250, 250, 0.5);
      border: 1px solid rgba(244, 244, 244, 1);
      border-radius: 4px;
      margin-right: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      .pe-data-body {
        font-size: 14px;
        color: #333333;
      }
    }
  }
}
</style>
