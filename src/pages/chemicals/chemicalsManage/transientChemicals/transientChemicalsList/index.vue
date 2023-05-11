<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>临时化学品清单</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="所属组织">
          <a-select v-model="formInline.corporationId" placeholder="请选择" style="width: 200px" show-search :filter-option="filterOptionMixin" allowClear>
            <a-select-option v-for="item in corporationList" :key="item.corporationId" :value="item.corporationId">{{item.orgAbbrName}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="化学品名称">
          <a-input v-model="formInline.chemicalsId" :maxLength="30" placeholder="请输入化学品名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="实际入厂日期">
          <a-range-picker separator="至" v-model="time" @change="timeChange">
            <a-icon slot="suffixIcon" type="calendar" />
          </a-range-picker>
        </a-form-model-item>
        <a-form-model-item label="厂商">
          <a-input v-model="formInline.tradeName" :maxLength="30" placeholder="请输入厂商" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="申请部门">
          <OrganizeLazyTree v-model="formInline.deptId" ref="organizeLazyTree" />
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div></div>
      <div>
        <a-button type="primary" class="btn" @click="exportAll" :loading="downLoading">批量导出</a-button>
      </div>
    </DashBtn>
    <!--表格列表 -->
    <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table
        bordered
        :columns="columns"
        :scroll="{ x: 1460 }"
        :locale="{ emptyText: emptyText }"
        :data-source="tableList"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
        :pagination="false"
      >
      </a-table>
    </CommonTable>
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dragTable from "@/mixin/dragTable.js";
import { debounce } from "lodash";
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue';
import { chemicalsPageList,chemicalsIntoExport } from '@/services/api.js';
export default {
  mixins: [teableCenterEllipsis, cancelLoading, dragTable],
  components: { OrganizeLazyTree },
  data() {
    return {
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      time: null,
      downLoading: false,
      formData: {},
      dataTime: {},
      formInline: {},
      corporationDict: {},
      // chemicalDict: {},
      tableList:[],
      columns: [
        {
          title: "序号",
          dataIndex: "number",
          key: "number",
          width: 100,
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: "所属组织",
          dataIndex: "organization",
          key: "organization",
          width: 140,
          customRender: (text, record, index) => {
            return this.corporationDict[text] ? this.corporationDict[text] : "--";
          },
        },
        {
          title: "计划入厂日期",
          dataIndex: "intoFactoryDate",
          key: "intoFactoryDate",
          width: 140,
        },
        {
          title: "实际入厂日期",
          dataIndex: "actualIntoFactoryDate",
          key: "actualIntoFactoryDate",
          width: 140,
        },
        {
          title: "化学品名称",
          dataIndex: "chemicalsId",
          key: "chemicalsId",
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
          width: 140,
        },
        {
          title: "申请入厂数量",
          dataIndex: "applicationNum",
          key: "applicationNum",
          customRender: (text, record, index) => {
            return text ? text + record.chemicalsUnit : "--";
          },
          width: 140,
        },
        {
          title: "实际入厂数量",
          dataIndex: "recordNum",
          key: "recordNum",
          customRender: (text, record, index) => {
            return text ? text + record.chemicalsUnit : "--";
          },
          width: 140,
        },
        {
          title: "厂商",
          dataIndex: "tradeName",
          key: "tradeName",
          width: 140,
        },
        {
          title: "申请部门",
          dataIndex: "deptName",
          key: "deptName",
          width: 140,
        },
        {
          title: "BOE担当",
          dataIndex: "boeAssume",
          key: "boeAssume",
          width: 140,
        },
      ]
    }
  },
  computed: {
    corporationList() {
      const corporationList = this.$store.state.setting.corporationList;
      corporationList.forEach(ele => {
        this.$set(this.corporationDict, ele.corporationId, ele.orgAbbrName);
      });
      return corporationList
    },
  },
  created() {
    this.getTableList();
  },
  methods: {
    getTableList() {
      const params = {
        ...this.formData,
        pageNo: this.page.pageNo,
        pageSize:this.page.pageSize,
      }
      chemicalsPageList(params).then(res=>{
        this.tableList = res.data.list;
        this.page.total = res.data.total;
      }).catch(err=>{
        console.log(err);
      })
      this.cancelLoading();
    },
    // 批量导出
    async exportAll() {
      this.downLoading = true;
      const name = '临时化学品清单';
      let res = await chemicalsIntoExport(this.formData);
      if(res){
        const blob = new Blob([res],{ type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const downloadElement = document.createElement('a');
        const href = URL.createObjectURL(blob); //创建下载链接
        downloadElement.href = href;
        downloadElement.download = name + '.xlsx';
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);// 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      }
      this.downLoading = false;
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
    // 时间改变
    timeChange(value) {
      if (value.length == 0) {
        var actualIntoFactoryDateStart = undefined;
        var actualIntoFactoryDateEnd = undefined;
      } else {
        var actualIntoFactoryDateStart = value[0].format("YYYY-MM-DD");
        var actualIntoFactoryDateEnd = value[1].format("YYYY-MM-DD");
      }
      this.dataTime = {
        actualIntoFactoryDateStart,
        actualIntoFactoryDateEnd,
      }
    },
    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
      const formData = JSON.parse(JSON.stringify(this.formInline));
      this.formData = {
        ...formData,
        ...this.dataTime,
      }
      this.handleLoading();
      this.getTableList();
    },
    // 重置
    iRest: debounce(
      function () {
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.formInline = {};
        this.formData = {};
        this.time = null;
        this.dataTime = {};
        this.getTableList();
      },
      250,
      { leading: true, trailing: false }
    ),
  }
}
</script>

<style>

</style>