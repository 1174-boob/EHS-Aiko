<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="部门名称">
          <a-input v-model="formInline.deptName" placeholder="请输入部门名称"></a-input>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="addDept">添加部门</a-button>
        <a-button type="dashed" @click="actionEdit">开始配置</a-button>
      </div>
    </DashBtn>
    <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" rowKey="maturityEvaluationReportId" :pagination="false">
        <div slot="status" slot-scope="record">{{getMappingValue(configStatusList, "key", record.status).value}}</div>
        <div slot="updateUser" slot-scope="record">{{record.workNum ? record.userName + "/" + record.workNum : record.userName}}</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="actionEdit(record)">修改</span>
          <span class="color-ff4d4f cursor-pointer" @click="handleDelete(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
    <!-- 添加部门 -->
    <CommonModal title="添加部门" :visible="addVisible" :cancelFn="addCancle">
      <template slot="form">
        <a-form-model
          ref="addForm"
          :model="addForm"
          :rules="addFormRules"
          :label-col="{ style: { width: '125px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 125px)' } }"
          :colon="false"
          labelAlign="right"
        >
          <CommonDept ref="commonDept" :notTablePage="true" :hasDepartment="true" @corporationDeptChange="corporationDeptChange" :CommonFormInline="addForm"></CommonDept>
          <a-form-model-item class="flex" label="选择部门" prop="deptIdList">
            <dept-tree :placeholder="'部门'" v-model="addForm.deptIdList" :deptData="deptData" :multiple="true" allowClear></dept-tree>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button class="m-r-15" @click="addCancle">取消</a-button>
        <a-button type="primary" :loading="loadingTwo" @click="addConfirm">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { debounce } from 'lodash';
import { formValidator } from "@/utils/clx-form-validator.js";
import StaffOrDept from "@/components/staffOrDept";
import { getMaturityEvaluationQuotaReportList, addMaturityEvaluationQuotaReportDept, deleteMaturityEvaluationQuotaReportDept } from "@/services/maturityEvaluation.js";
export default {
  components: { StaffOrDept },
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      formInline: {},
      preFormInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      configStatusList: [
        {
          key: 1,
          value: "已配置"
        },
        {
          key: 2,
          value: "未配置"
        }
      ],
      columns: [
        {
          title: '部门名称',
          dataIndex: 'deptName',
          width: 200,
        },
        {
          title: '配置状态',
          dataIndex: 'configurationStatus',
          customRender: (text) => {
            return text ? '已配置' : '未配置'
          }
        },
        {
          title: '修改人',
          dataIndex: 'updateUserName',
        },
        {
          title: '修改时间',
          dataIndex: 'updateTime',
          width: 160,
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 120 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
      addVisible: false,
      addForm: { deptIdList: [] },
      addFormRules: {
        corporationId: [{ required: true, message: "组织不能为空", trigger: "change" }],
        deptIdList: [{ required: true, message: "部门不能为空", trigger: "change" }],
      },
      deptData: null
    }
  },
  created() {
    this.setRouterCode("maturityEvaluationQuotaReport");
    this.columns.splice(0, 0, this.addCommonColumnItem());
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
    getDataList() {
      let params = {
        ...this.formInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }
      return getMaturityEvaluationQuotaReportList(params)
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
          this.cancelLoading();
        })
    },
    // 查询
    iSearch() {
      this.handleLoading()
      this.getDataList()
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      this.getDataList();
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.getDataList()
    }, 250, { leading: true, trailing: false }),

    //添加部门
    addDept() {
      this.addVisible = true
    },
    //关闭弹窗
    addCancle() {
      this.addVisible = false
      this.addForm = { deptIdList: [] }
    },
    //选择确定
    addConfirm: debounce(
      function () {
        if (!formValidator.formAll(this, "addForm")) {
          return;
        }
        // this.addForm.deptInfoList = this.addForm.deptIdList.map(i => {
        //   return {
        //     deptId: i,
        //     deptName: this.deptCache[i]
        //   }
        // })
        let apiData = {
          ...this.addForm,
        }
        console.log('this.addForm', apiData);
        this.handleLoadingTwo()
        addMaturityEvaluationQuotaReportDept(apiData)
          .then(res => {
            this.$antMessage.success("添加成功！");
            this.addCancle()
            this.getDataList()
          })
          .catch(err => { })
          .finally(() => {
            setTimeout(() => {
              this.cancelLoadingTwo()
            }, 200);
          })
      },
      2000,
      { leading: true, trailing: false }
    ),
    // 获取组织下所有部门
    corporationDeptChange(value) {
      this.deptData = value;
    },
    //删除
    handleDelete(targetItem) {
      this.$antConfirm({
        title: '确定删除部门吗?',
        onOk: () => {
          let apiData = {
            maturityEvaluationReportId: targetItem.maturityEvaluationReportId
          }
          return deleteMaturityEvaluationQuotaReportDept(apiData)
            .then(res => {
              this.$antMessage.success("删除成功！");
              this.getDataList()
            })
            .catch(err => { })
        },
      });
    },

    // 开始配置、编辑
    actionEdit(record) {
      let queryObj = { }
      if (record) {
        queryObj = {
          maturityEvaluationReportId: record.maturityEvaluationReportId,
          deptName : record.deptName
        }
      }
      this.$router.push({
        path: "/ehsGerneralManage/maturityEvaluation/maturityEvaluationQuotaReportConfig",
        query: queryObj
      })
    },
  }
}
</script>
