<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="false"></CommonSearchItem>
        <a-form-model-item label="部门">
          <a-input v-model="formInline.deptName" placeholder="请输入部门"></a-input>
        </a-form-model-item>
        <a-form-model-item label="年份">
          <el-date-picker v-model="formInline.year" style="width:200px;" type="year" value-format="yyyy" placeholder="选择年" :clearable="false"></el-date-picker>
        </a-form-model-item>
        <a-form-model-item label="月份">
          <a-select v-model="formInline.month" placeholder="请选择">
            <a-select-option v-for="(i,index) in monthOption" :key="index" :value="i.value">{{i.name}}</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item class="float-right">
          <a-button type="primary" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="toDataFilling">数据填报</a-button>
      </div>
    </DashBtn>
    <CommonTable :page="page" :spinning="loadingTwo" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, fixed: true }"
        :columns="columns"
        :scroll="{ x: tableScrollX() }"
        :locale="{emptyText: emptyText}"
        :data-source="tableDataList"
        :rowKey="tableRowKey"
        :pagination="false"
      >
        <div slot="createUser" slot-scope="record">{{record.updateUserName ? record.updateUserName + "/" + record.updateUserCode : '--'}}</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionDetail(record)">查看</span>
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionEdit(record)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="actionDelete(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>

    <CheckFillModel v-model="checkFillModelShow" />
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import dayJs from "dayjs";
import { debounce, cloneDeep } from 'lodash';
import { getMaturityEvaluationDataList, rmMaturityEvaluationDataItem } from "@/services/maturityEvaluation.js";
import teableSelected from "@/mixin/teableSelected";
import CheckFillModel from './checkFillModel.vue'
export default {
  components:{CheckFillModel},
  mixins: [teableCenterEllipsis, cancelLoading, teableSelected],
  data() {
    return {
      checkFillModelShow:false,
      tableSpinning: false,
      tableRowKey: 'maturityEvaluationDataId',
      formInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: '部门',
          dataIndex: 'deptName',
          width: 150,
        },
        {
          title: '年份',
          dataIndex: 'year',
          width: 100,
        },
        {
          title: '月份',
          dataIndex: 'month',
          width: 200,
        },
        {
          title: '得分',
          dataIndex: 'finalSocre',
          width: 100,
        },
        {
          title: '填报人',
          scopedSlots: { customRender: 'createUser' },
          minWidth: 200,
        },
        {
          title: '填报时间',
          dataIndex: 'updateTime',
          width: 169,
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 140 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
      monthOption: [
        { name: '1月', value: 1 },
        { name: '2月', value: 2 },
        { name: '3月', value: 3 },
        { name: '4月', value: 4 },
        { name: '5月', value: 5 },
        { name: '6月', value: 6 },
        { name: '7月', value: 7 },
        { name: '8月', value: 8 },
        { name: '9月', value: 9 },
        { name: '10月', value: 10 },
        { name: '11月', value: 11 },
        { name: '12月', value: 12 },
      ],
    }
  },
  created() {
    this.setRouterCode("maturityEvaluationData");
    this.columns.splice(0, 0, this.addCommonColumnItem(200));
    this.getDataList();
  },
  activated() {
    setTimeout(() => {
      if (!this.keepalive) {
        this.iRest()
      }
    }, 20);
  },
  methods: {
    getDataList: debounce(function () {
      let params = {
        ...this.formInline,
        pageNo:this.page.pageNo,
        pageSize:this.page.pageSize,
      }
      this.handleLoadingTwo()
      return getMaturityEvaluationDataList(params)
        .then((res) => {
          let { list: tableDataList, total } = res.data ? res.data : { list: [], total: 0 };
          // 处理页码 问题
          if (tableDataList.length === 0 && (this.page.pageNo !== 1 && this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getDataList();
            return
          }

          this.tableDataList = tableDataList || [];
          this.page.total = total;
        })
        .catch((err) => { })
        .finally(() => {
          this.cancelLoadingTwo(200)
        })
    }, 250, { leading: true, trailing: false }),

    // 查询
    iSearch() {
      this.getDataList()
    },
    // 重置
    iRest: debounce(function () {
      this.$refs?.commonSearchItem?.reset()
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.getDataList()
    }, 250, { leading: true, trailing: false }),

    // 填报数据报表
    toDataFilling() {
      // if (!this.canClickBtnMixin("maturityEvaluationQuotaReportAddDept")) {
      //   return;
      // }
      this.checkFillModelShow = true
    },
    // 编辑
    async actionEdit(record) {
      this.$router.push({
        path: "/ehsGerneralManage/orgPerformanceManage/branchDataFillingEdit",
        query: { id: record.id }
      })

    },
    //查看
    actionDetail(record) {
      this.$router.push({
        path: "/ehsGerneralManage/orgPerformanceManage/branchDataFillingView",
        query: { id: record.id }
      })
    },
    // 删除
    actionDelete(record) {
      if (!this.canClickBtnMixin("performanceData-del")) {
        return;
      }
      this.$antConfirm({
        title: '删除提示',
        content: '本操作不可恢复，确定继续？',
        cancelText: '取消',
        onOk: () => {
          return rmMaturityEvaluationDataItem({ id: record.id })
            .then(() => {
              this.$antMessage.success('删除成功');
              this.getDataList();
            })
            .catch(err => { })
        },
      });
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getDataList();
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
    },
  }
}
</script>
<style lang="less" scoped>
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
</style>