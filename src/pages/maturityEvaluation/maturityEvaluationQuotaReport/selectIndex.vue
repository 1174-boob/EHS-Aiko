<template>
  <!-- 选择指标 -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="searchFormData" :colon="false">
        <a-form-model-item label="项目">
          <a-input v-model="searchFormData.project" placeholder="请输入项目"></a-input>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>

    <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table
        :columns="columns"
        :scroll="{ x: 800 }"
        :data-source="tableDataList"
        :pagination="false"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,fixed:true }"
        :rowKey="tableRowKey"
        bordered
      >
        <div slot="calculationDetails" slot-scope="record" class="table-p-box">
          <p v-for="(i,index) in record" :key="index" :title="i">{{i}}</p>
        </div>
        <div slot="indicatorUnit" slot-scope="record" class="table-p-box">
          <p v-for="(i,index) in record" :key="index" :title="i">{{i}}</p>
        </div>
        <div slot="pointsDeductions" slot-scope="record" class="table-p-box">
          <p v-for="(i,index) in record" :key="index" :title="i">{{i}}</p>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { cloneDeep, debounce } from "lodash";
import { getMaturityEvaluaList } from "@/services/maturityEvaluation.js";
import teableSelected from "@/mixin/teableSelected";
export default {
  mixins: [cancelLoading, teableSelected],
  props: {
    selectedRowOld: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      searchFormData: {},
      columns: [
        {
          title: '设立目的',
          dataIndex: 'purposeOfEstablishment',
          width: 200,
        },
        {
          title: '项目',
          dataIndex: 'project',
          width: 200,
        },
        {
          title: '定义',
          dataIndex: 'definition',
          width: 200,
        },
        {
          title: '分值',
          dataIndex: 'score',
          width: 100,
        },
        {
          title: '计算明细',
          scopedSlots: { customRender: 'calculationDetails' },
          dataIndex: 'calculationDetails',
          width: 400,
        },
        {
          title: '单位',
          scopedSlots: { customRender: 'indicatorUnit' },
          dataIndex: 'indicatorUnit',
          width: 100,
        },
        {
          title: '扣分分值',
          scopedSlots: { customRender: 'pointsDeductions' },
          dataIndex: 'pointsDeductions',
          width: 100,
        },
        {
          title: '备注',
          dataIndex: 'remarks',
          width: 200,
        },
      ],
      tableDataList: [],
      tableRowKey: 'maturityEvaluationIndexId',
    };
  },
  created() {
    this.selectedRow = cloneDeep(this.selectedRowOld)
    this.selectedRowKeys = this.selectedRowOld.map(item => item[this.tableRowKey]).filter(item => item || item === 0)
    this.initData();
  },
  methods: {
    initData() {
      let params = {
        ...this.searchFormData,
        ...this.page
      }
      getMaturityEvaluaList(params)
        .then(res => {
          let { list: tableDataList, total } = res.data ? res.data : { list: [], total: 0 };
          // 处理页码 问题
          if (tableDataList.length === 0 && (this.page.pageNo !== 1 && this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.initData();
            return
          }

          this.tableDataList = (tableDataList || []).map(i => {
            i.calculationDetails = i.itemList.map(item => item.calculationDetails)
            i.indicatorUnit = i.itemList.map(item => item.indicatorUnit)
            i.pointsDeductions = i.itemList.map(item => item.pointsDeductions)
            return i
          })
          this.page.total = total;
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
      this.clearSelectedTable()
      this.handleLoading();
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
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      this.initData();
    },
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.initData();
    },
  },
};
</script>

<style lang="less" scoped>
.table-p-box {
  & > p {
    margin-bottom: 1em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:nth-last-child(1) {
      margin-bottom: 0px;
    }
  }
}
</style>
