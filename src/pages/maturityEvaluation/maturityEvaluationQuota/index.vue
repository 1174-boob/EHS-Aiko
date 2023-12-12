
<template>
  <!-- 成熟度评价指标 -->
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="项目">
          <a-input v-model="formInline.project" placeholder="请输入项目"></a-input>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="openAddModal({})">
          <a-icon type="plus" />新增指标
        </a-button>
      </div>
    </DashBtn>
    <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :columns="columns" :scroll="{ x: tableScrollX() }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="'maturityEvaluationIndexId'" :pagination="false">
        <div slot="calculationDetails" slot-scope="record" class="table-p-box">
          <p v-for="(i,index) in record" :key="index" :title="i">{{i}}</p>
        </div>
        <div slot="indicatorUnit" slot-scope="record" class="table-p-box">
          <p v-for="(i,index) in record" :key="index" :title="i">{{i}}</p>
        </div>
        <div slot="pointsDeductions" slot-scope="record" class="table-p-box">
          <p v-for="(i,index) in record" :key="index" :title="i">{{i}}</p>
        </div>

        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer m-r-15" @click="openEditModal(record)">编辑</span>
          <span class="color-red cursor-pointer" @click="handleDelete(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>

    <AddChangeModel v-model="addChangeModelShow" :addChangeModelOldData="addChangeModelOldData" @getTableList="getTableList" />
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { debounce, cloneDeep } from 'lodash';
import { getMaturityEvaluaList, deleteMaturityEvalua, } from "@/services/maturityEvaluation.js";
import AddChangeModel from './addChangeModel.vue'
export default {
  components: { AddChangeModel },
  mixins: [teableCenterEllipsis, cancelLoading,],
  data() {
    return {
      formInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
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
          minWidth: 200,
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          align: "center",
          fixed: "right", // 固定操作列
          width: 120, // 宽度根据操作自定义设置
        },

      ],
      tableDataList: [],

      addChangeModelShow: false,
      addChangeModelOldData: {},
    }
  },
  created() {
    this.setRouterCode("maturityEvaluationQuota");
    this.getTableList();
  },
  activated(){
    setTimeout(() => {
      if(!this.keepalive){
        this.iRest()
      }
    }, 20);
  },
  methods: {
    getTableList() {
      let params = {
        ...this.formInline,
        ...this.page
      }
      return getMaturityEvaluaList(params)
        .then((res) => {
          let { list: tableDataList, total } = res.data ? res.data : { list: [], total: 0 };
          // 处理页码 问题
          if (tableDataList.length === 0 && (this.page.pageNo !== 1 && this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getTableList();
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
      this.handleLoading()
      this.getTableList()
    },

    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.getTableList()
    }, 250, { leading: true, trailing: false }),

    // 新增-打开弹框
    openAddModal(targetItem) {
      if (!this.canClickBtnMixin("maturityEvaluationQuotaAddBtn")) {
        return;
      }
      this.addChangeModelOldData = cloneDeep(targetItem)
      this.addChangeModelShow = true
    },
    // 编辑-打开弹框
    openEditModal(targetItem) {
      if (!this.canClickBtnMixin("maturityEvaluationQuotaEditBtn")) {
        return;
      }
      this.addChangeModelOldData = cloneDeep(targetItem)
      this.addChangeModelShow = true
    },

    // 删除
    handleDelete(targetItem) {
      if (!this.canClickBtnMixin("maturityEvaluationQuotaRmBtn")) {
        return;
      }
      this.$antConfirm({
        title: '确定删除该指标吗?',
        onOk: () => {
          let apiData = {
            maturityEvaluationIndexId: targetItem.maturityEvaluationIndexId
          }
          return deleteMaturityEvalua(apiData)
            .then(res => {
              this.$antMessage.success("删除成功！");
              this.getTableList()
            })
            .catch(err => { })
        },
      });
    },

    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      this.getTableList();
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getTableList();
    },
  }
}
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
/deep/ .ant-input-number {
  width: 100%;
}
</style>