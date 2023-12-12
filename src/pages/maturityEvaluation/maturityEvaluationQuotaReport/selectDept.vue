<template>
  <!-- 邀请列表 -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="searchFormData" :colon="false">
        <a-form-model-item class="flex" label="配置状态">
          <a-select v-model="searchFormData.configurationStatus" placeholder="请选择配置状态">
            <a-select-option v-for="item in configStatusList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="部门名称">
          <a-input v-model="searchFormData.deptName" placeholder="请输入部门名称"></a-input>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <!-- 列表 -->

    <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{emptyText: emptyText}"
        :data-source="tableDataList"
        :pagination="false"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,fixed:true }"
        :rowKey="tableRowKey"
        bordered
      ></a-table>
    </CommonTable>
  </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import UploadBtnStyle from "@/components/upload/uploadStyleXt.vue";
import { cloneDeep, debounce } from "lodash";
import { getMaturityEvaluationQuotaReportNoPageList } from "@/services/maturityEvaluation.js";
import teableSelected from "@/mixin/teableSelected";
export default {
  components: { UploadBtnStyle },
  mixins: [cancelLoading, teableSelected],
  props: {
    selectedRowOld: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      emptyText: <a-empty />,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      searchFormData: {},
      configStatusList: [
        {
          key: "1",
          value: "未配置"
        },
        {
          key: "2",
          value: "已配置"
        }
      ],
      columns: [
        {
          title: '部门',
          dataIndex: 'deptName',
        },
        {
          title: '配置状态',
          dataIndex: 'configurationStatus',
          customRender: (text) => {
            return text ? '已配置' : '未配置' 
          }
        },
      ],
      tableDataList: [],
      tableRowKey: 'maturityEvaluationReportId',
    };
  },
  created() {
    this.selectedRow = cloneDeep(this.selectedRowOld)
    this.selectedRowKeys = this.selectedRowOld.map(item => item[this.tableRowKey]).filter(item => item || item === 0)
    this.initData();
  },
  methods: {
    initData() {
      // 1未配置 2已配置
      let {deptName,configurationStatus} = this.searchFormData
      if(configurationStatus){
        configurationStatus = configurationStatus == 2
      }
      let apiData = {
        deptName,
        configurationStatus,
      }
      getMaturityEvaluationQuotaReportNoPageList(apiData)
        .then(res => {
          this.tableDataList = res.data || []
        })
        .catch(err => { })
    },
    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
      this.clearSelectedTable()
      this.initData();
    },
    // 重置
    iRest: debounce(
      function () {
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.clearSelectedTable()
        this.searchFormData = {};
        this.initData();
      },
      250,
      { leading: true, trailing: false }
    ),
    pageNoChange(page) {
      this.page.pageNo = page;
      this.initData();
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
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
