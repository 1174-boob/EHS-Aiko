<template>
  <div class="emergency-plan clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>应急预案数据库</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" @corporationChange="corporationChange" @centerChange="centerChange" @corporationDeptChange="corporationDeptChange"></CommonDept>
        <a-form-model-item label="预案部门">
          <dept-tree :placeholder="'请选择预案部门'" v-model="formInline.eplanDepartcode" :deptData="deptData" @change="planDeptChange" allowClear></dept-tree>
        </a-form-model-item>
        <a-form-model-item label="预案级别">
          <a-select v-model="formInline.eplanLevel" placeholder="请选择预案级别" allowClear>
            <a-select-option v-for="item in prep_level" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="预案类型">
          <a-select v-model="formInline.eplanTypeCode" placeholder="请选择预案类型" allowClear>
            <a-select-option v-for="item in drill_type" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="预案名称">
          <a-input v-model="formInline.eplanName" placeholder="请输入预案名称" allowClear></a-input>
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
        <a-button type="dashed" @click="addDatabase">
          <a-icon type="plus" />新建
        </a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="dataSource" :rowKey="(record, index)=>{return index}" :pagination="false">
        <template slot="draft" slot-scope="record">
          {{record.draftName}}/{{record.draftCode}}
        </template>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="preview(record.prepId)">查看</span>
          <span class="color-0067cc cursor-pointer" @click="edit(record.prepId)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="deleteEm(record.prepId)">删除</span>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>
// 这个混入只适用于页面中仅有单个表格时（主要处理了单元格文案居中，溢出显示省略号，没数据时显示的组件样式）
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
// 查询按钮的loading状态
import { debounce } from 'lodash';
import cancelLoading from '@/mixin/cancelLoading';
import serviceNameList from '@/config/default/service.config.js'
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import dictionary from '@/utils/dictionary';
import chemicalDict from "@/mixin/chemicalDict.js";
import teableSelected from "@/mixin/teableSelected.js";
import {  chemicalDownload } from "@/services/api.js";
import { planPageList,planDeletePrep } from "@/services/api.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading,chemicalDict,teableSelected],
  components: {
    UploadBtnStyle,
  },
  data() {
    return {
      tableSpinning:false,
      formInline: {
        deptModel: undefined
      },
      formData: {},
      emergencyLevel: undefined,
      emergencyForm: undefined,
      drill_type: undefined,
      planTime: undefined,
      approveDisabled: true,
      deptData:[],
      // 导入文件地址
      action: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.chemicals}/api/ehs/chemical/list/upload`,
      completeDict: {},
      chemicalDict: {},
      formDict: {},
      riskDict: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      dataSource: [],
      columns: [
        {
          title: '预案编号',
          dataIndex: 'prepNumber',
          width: 200
        },
        {
          title: '预案名称',
          dataIndex: 'eplanName',
          width: 200
        },
        {
          title: '预案级别',
          dataIndex: 'eplanLevel',
          customRender: (text) => {
            return text ? this.getChemicalDictText('prep_level', text) : ''
          },
          width: 200
        },
        {
          title: '预案类型',
          dataIndex: 'eplanTypeCode',
          customRender: (text) => {
            return text ? this.getChemicalDictText('drill_type', text) : ''
          },
          width: 200
        },
        {
          title: '起草人',
          scopedSlots: { customRender: 'draft' },
          width: 200
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 200
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right',
          width: 150
        }
      ]
    }
  },
  computed: {
  },
  created() {
    this.setRouterCode("emergencyDatabase");
    this.initConfigPage()
    this.columns.splice(0, 0, this.addCommonColumnItem(150))
    this.columns.splice(1, 0, this.addCommonColumnDepartment({
      width: 150,
      key:'eplanDepartcode',
      title: "预案部门"
    }))
    this.getPageList();
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
      this.prep_level = this.getChemicalDictList('prep_level'); //预案级别
      this.emergencyForm = dictionary("emergencyForm"); //应急演练形式
      this.drill_type = this.getChemicalDictList('drill_type'); //应急演练类型
    },
    // 组织改变
    corporationChange(val, deptId) {
    },
    // 获取组织下所有部门
    corporationDeptChange(value) {
      this.deptData = value
    },
    // 中心改变
    centerChange(val) {
      this.deptData = [];
    },
    // 部门改变
    planDeptChange(id,name) {
    },
    // 获取分页查询数据
    getPageList() {
      this.tableSpinning = true
      const params = {
        ...this.formData,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        isPlanQuery: 2
      }
      planPageList(params)
      .then(res=>{
        this.dataSource = res.data.list;
        this.page.total = res.data.total;
        this.loading = false;
      })
      .catch(err=>{
        this.loading = false;
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    // 批量导入成功
    handleSuccess(fileList) {
      this.iRest();
    },
    // 批量导出
    async exportAll() {
      const name = '化学品清单批量导出'
      const params = {
        ...this.formData
      }
      let res = await chemicalDownload(params);
      if (res) {
        const blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const downloadElement = document.createElement('a');
        const href = URL.createObjectURL(blob); //创建下载链接
        downloadElement.href = href;
        downloadElement.download = name + '.xlsx';
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);// 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      }
    },
    // 查询
    iSearch() {
      this.loading = true;
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formData = JSON.parse(JSON.stringify(this.formInline));
      this.getPageList();
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {}
      this.formData = {};
      this.getPageList();
    }, 250, { leading: true, trailing: false }),
    // 新建
    addDatabase() {
      this.$router.push("/safeManage/emergencyManagement/emergencyDrillManagement/addDatabase");
    },
    // 查看
    preview(prepId) {
      this.$router.push({path:"/safeManage/emergencyManagement/emergencyDrillManagement/previewDatabase",query:{prepId}});
    },
    // 编辑
    edit(prepId) {
      this.$router.push({path:"/safeManage/emergencyManagement/emergencyDrillManagement/editDatabase",query:{prepId}});
    },
    // 删除
    deleteEm(prepId) {
      if (!this.canClickBtnMixin("emergencyDatabase-del")) {
        return;
      }
      this.$antConfirm({
        content: '确认删除？',
        cancelText: '取消',
        onOk: () => {
          planDeletePrep({prepId}).then(res => {
            this.$antMessage.success('删除成功');
            this.page.pageNo = 1;
            this.getPageList();
          }).catch(err => {
            console.log(err);
          })
        },
      });
    },
    // 导入模板下载
    downloadTemplate() {
      window.open(
        window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/化学品清单导入模板.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/化学品清单导入模板.xlsx`
      );
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      this.getPageList();
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getPageList();
    },
  }
}
</script>

<style lang="less" scoped>
// .emergency-plan {
// }
</style>