<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept ref="commonDept" :CommonFormInline="formInline"></CommonDept>
        <a-form-model-item label="年份">
          <el-date-picker v-model="formInline.year" type="year" value-format="yyyy" placeholder="选择年" :clearable="false"></el-date-picker>
        </a-form-model-item>
        <a-form-model-item label="填报维度">
          <a-select v-model="formInline.fillDimension" placeholder="请选择" @change="handleWChange">
            <a-select-option :value="1">季度</a-select-option>
            <a-select-option :value="2">月度</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="季度">
          <a-select v-model="formInline.fillDate" placeholder="请选择">
            <a-select-option v-for="(i,index) in option" :key="index" :value="i.value">{{i.name}}</a-select-option>
          </a-select>
        </a-form-model-item>

        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="toDataFilling">数据填报</a-button>
        <a-button type="dashed" @click="exportExcel">批量导出</a-button>
      </div>
    </DashBtn>
    <CommonTable :page="page" :spinning="tableSpinning" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, fixed: true }"
        :columns="columns"
        :scroll="{ x: tableScrollX() }"
        :locale="{emptyText: emptyText}"
        :data-source="tableDataList"
        :rowKey="(record, index)=>{return record.id}"
        :pagination="false"
      >
        <div slot="createUser" slot-scope="record">{{record.createUserName ? record.createUserName + "/" + record.createUserCode : '--'}}</div>
        <div slot="status" slot-scope="record">{{getMappingValue(statusList, "key", record.status).value}}</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionDetail(record)">查看</span>
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionEdit(record)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="actionDelete(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { formValidator } from "@/utils/clx-form-validator.js";
// import rowspanMethod from "@/utils/rowspanMethod.js";
import dictionary from '@/utils/dictionary'
import dayJs from "dayjs";
import { debounce } from 'lodash';
import { cloneDeep } from 'lodash'
import { getDataFillList, batchExport, deleteAchDateData } from "@/services/performanceManagementBranch.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      tableSpinning: false,
      statusList: [],
      formInline: {
        fillDimension: 1,
        fillDate: this.isQuarter(),
        year: dayJs(new Date()).format("YYYY")
      },
      preFormInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      selectedRowKeys: [],
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
          title: '统计周期',
          dataIndex: 'countCycle',
          width: 200,
        },
        {
          title: '得分',
          dataIndex: 'score',
          width: 100,
        },
        {
          title: '填报人',
          scopedSlots: { customRender: 'createUser' },
          width: 200,
        },
        {
          title: '填报时间',
          dataIndex: 'createTime',
          minWidth: 200,
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
      option: [],
      quarterOption: [
        { name: '第一季度', value: 1 },
        { name: '第二季度', value: 2 },
        { name: '第三季度', value: 3 },
        { name: '第四季度', value: 4 },
      ],
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
    this.setRouterCode("performanceBranchData");
    this.initConfigPage()
    this.columns.splice(1, 0, this.addCommonColumnItem(200));
    // this.formInline.fillDate = this.isQuarter()
    // this.formInline.year = dayJs(new Date()).format("YYYY");
    this.getDataList();
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.initConfigPage()
        this.iRest()
      }
    }, 20);
  },
  methods: {
    initConfigPage(){
      this.statusList = dictionary("approvalStatus");
      this.option = this.quarterOption
    },
    // 查询季度
    isQuarter() {
      let Month = Number(new Date().getMonth()) + 1
      if (Month > 9) {
        return 4
      } else if (Month > 6) {
        return 3
      } else if (Month > 3) {
        return 2
      } else {
        return 1
      }

    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 导出Excel
    exportExcel() {
      if (!(this.selectedRowKeys && this.selectedRowKeys.length)) {
        this.$antMessage.error("请选择导出部门！");
        return
      }
      batchExport({ ids: this.selectedRowKeys }).then(res => {
        const name = '组织绩效数据导出'
        const blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
        const downloadElement = document.createElement('a')
        const href = URL.createObjectURL(blob) //创建下载链接
        downloadElement.href = href
        downloadElement.download = name + '.xlsx'
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement)// 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      })
    },
    // 填报数据报表
    toDataFilling() {
      console.log(this.selectedRowKeys);
      this.$router.push({
        path: "/ehsGerneralManage/orgPerformanceManage/branchDataFilling"
      })
    },
    getDataList() {
      let params = {
        ...this.formInline,
        ...this.page
      }
      this.tableSpinning = true
      return getDataFillList(params).then((res) => {

        this.addLoading = false;
        this.tableDataList = res.data.list;
        this.page.total = res.data.total;
      }).catch((err) => {
        console.log(err);
      }).finally(()=>{
        this.tableSpinning = false
      })
    },
    // 查询
    iSearch() {
      this.preFormInline = { ...this.formInline };
      // 获取列表
      this.getDataList()
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 重置
    iRest: debounce(function () {
      this.$refs.commonDept.reset();
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
        fillDimension: 1,
        fillDate: this.isQuarter(),
        year: dayJs(new Date()).format("YYYY")
      };
      this.option = this.quarterOption
      this.preFormInline = {};
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
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
          // DeleteLecturer({
          //   id: record.id,
          // }).then(res => {
          deleteAchDateData({ id: record.id }).then(() => {
            this.$antMessage.success('删除成功');
            this.getDataList();
          })

          // }).catch(err => {
          //   console.log(err);
          // })
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
    //筛选维度变化
    handleWChange(e) {
      if (e == 1) {
        this.formInline.fillDate = this.isQuarter()
        this.option = this.quarterOption
      } else {
        this.formInline.fillDate = Number(new Date().getMonth()) + 1
        this.option = this.monthOption
      }
    }
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