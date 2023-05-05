<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>废气在线数据</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="corporationId" :CommonFormInline="formInline" @corporationChange="corporationChange"></CommonSearchItem>
        <a-form-model-item label="污染物">
          <a-select v-model="formInline.instrumentPollutantRelId" :disabled="!formInline.corporationId" :placeholder="formInline.corporationId?'请选择':'请先选择所属组织'">
            <a-select-option v-for="item in pollutantGasList" :key="item.instrumentPollutantRelId" :value="item.instrumentPollutantRelId">{{item.locationPollutantName}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <div>
      <a-tabs v-model="activeKey" @change="changeTabs">
        <a-tab-pane key="1" tab="排放值浓度数据">
          <div v-if="activeKey=='1'">
            <EmissionConcent ref="emissionConcent" :formInline="formInline" />
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="排放值速率数据">
          <div v-if="activeKey=='2'">
            <EmissionRate ref="emissionRate" :formInline="formInline" />
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import chemicalDict from "@/mixin/chemicalDict.js";
import EmissionConcent from './tpl/emissionConcent.vue'
import EmissionRate from './tpl/emissionRate.vue'
import cancelLoading from '@/mixin/cancelLoading';
import getPollutantListMixin from '@/pages/environmental/earlyWarnInfo/mixin/getPollutantListMixin'
export default {
  components: { EmissionConcent, EmissionRate },
  mixins: [chemicalDict, cancelLoading, getPollutantListMixin],
  data() {
    return {
      activeKey: '1',
      formInline: {},
    }
  },
  created() {
    this.setRouterCode("flueGasMonitoring");
  },
  mounted() {
    this.getPollutantListFn()
      .then(res => {
        this.iSearch();
      })
      .catch(err => { })
  },
  methods: {
    // 查询
    iSearch(showLoading = true, showWarn = true) {
      if (!this.formInline.corporationId) {
        showWarn && this.$antMessage.warn('请选择所属组织')
        return
      }
      if (!this.formInline.instrumentPollutantRelId) {
        showWarn && this.$antMessage.warn('请选择污染物')
        return
      }
      showLoading && this.handleLoading();
      if (this.activeKey == '1') {
        this.$refs.emissionConcent.iSearch()
          .finally(() => {
            this.cancelLoading();
          })
      } else {
        this.$refs.emissionRate.iSearch()
          .finally(() => {
            this.cancelLoading();
          })
      }
    },
    // tab切换
    changeTabs(key) {
      this.activeKey = key;
      this.$nextTick(() => {
        this.iSearch(false)
      })
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

<style scoped lang="less">
.injury-box {
  margin-bottom: 10px;
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
    .title-right {
      color: #0067cc;
      cursor: pointer;
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
.time-picker {
  width: 350px;
  ::v-deep .ant-calendar-range-picker-separator {
    margin-top: 4px;
  }
  ::v-deep .el-range__icon {
    display: none;
  }
  ::v-deep .el-range-separator {
    width: 10%;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>