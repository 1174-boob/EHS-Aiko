<template>
  <div>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :hasDepartment="true" :CommonFormInline="formInline" :needDeptName="true"></CommonSearchItem>
        <a-form-model-item label="编号">
          <a-input v-model="formInline.riskPointNo" :maxLength="30" placeholder="请输入编号" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="风险点">
          <a-input v-model="formInline.riskPointName" :maxLength="30" placeholder="请输入风险点" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="风险分级">
          <a-select v-model="formInline.riskLevel" placeholder="请选择" option-filter-prop="children" style="width: 200px" show-search :filter-option="filterOption">
            <a-select-option v-for="item in dictionary('riskLevel')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select v-model="formInline.status" show-search placeholder="请选择" option-filter-prop="children" style="width: 200px" :filter-option="filterOption">
            <a-select-option v-for="item in dictionary('riskPointApproveStatus')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="危险源种类">
          <a-select v-model="formInline.dangerSourceType" placeholder="请选择" option-filter-prop="children" style="width: 200px" show-search :filter-option="filterOption">
            <a-select-option v-for="item in getChemicalDictList('wxy_hazardkind')" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="可能导致事件">
          <a-select v-model="formInline.dangerSourceEvent" placeholder="请选择" option-filter-prop="children" style="width: 200px" show-search :filter-option="filterOption">
            <a-select-option v-for="item in getChemicalDictList('wxy_leadtheevent')" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="关键词">
          <a-input v-model="formInline.searchKey" :maxLength="30" placeholder="请输入关键词" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <!-- <DashBtn>
      <div>
        <a-button type="dashed" @click="goAddChangePage('add')">
          <a-icon type="plus" />新建
        </a-button>
      </div>
      <div>
        <a-button type="primary" @click="goRiskPointPage">风险点审批</a-button>
        <a-button type="primary" :loading="loadingTwo" @click="downloadTem" class="m-l-20">导出Excel</a-button>
      </div>
    </DashBtn> -->
    <!--表格列表 -->
    <CommonTable :page="page" :pageNoChange="pageNoChange"
    :showSizeChange="showSizeChange">
      <a-table bordered :columns="columns"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onRadioChange,
        type: 'radio',
      }"
      :scroll="{ x: tableScrollX() }" :locale="{ emptyText: emptyText }" :data-source="tableList" :rowKey="(record, index) => {return index;}" :pagination="false">
      </a-table>
    </CommonTable>
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dragTable from "@/mixin/dragTable.js";
import { cloneDeep, debounce } from "lodash";
import { getRiskBookListApi, rmRiskBookItemApi, exportRiskBookApi } from "@/services/dangerSource/risk";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import QRcodeModel from "@/components/qrCodeModel/qrCodeModel.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import dictionary from "@/utils/dictionary";
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
export default {
  components: { UploadBtnStyle, QRcodeModel, OrganizeLazyTree },
  mixins: [teableCenterEllipsis, cancelLoading, dragTable, chemicalDict],
  data() {
    return {
      dictionary,
      // 新增、编辑弹窗显示
      addChangeModelShow: false,
      formModelOldData: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formInline: {},
      selectedRowKeys: [],
      selectedRows: [],
      columns: [
        {
          title: "编号",
          dataIndex: "riskPointNo",
          key: "riskPointNo",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          width: 170,
        },
        {
          title: "所在位置",
          dataIndex: "riskPointLocation",
          key: "riskPointLocation",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          minWidth: 130,
        },
        {
          title: "风险点",
          dataIndex: "riskPointName",
          key: "riskPointName",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          width: 130,
        },
        {
          title: "危险源种类",
          dataIndex: "dangerSourceTypeList",
          key: "dangerSourceTypeList",
          customRender: (textArr) => {
            textArr = textArr ? textArr : []
            let text = '';
            (this.getChemicalDictList('wxy_hazardkind') || []).map(item => {
              if (textArr.includes(item.dictValue))
                text = text ? (text + ',' + item.dictLabel) : item.dictLabel
            })
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          width: 130,
        },
        {
          title: "可能导致的事件",
          dataIndex: "dangerSourceEventList",
          key: "dangerSourceEventList",
          width: 150,
          customRender: (textArr) => {
            textArr = textArr ? textArr : []
            let text = '';
            (this.getChemicalDictList('wxy_leadtheevent') || []).map(item => {
              if (textArr.includes(item.dictValue))
                text = text ? (text + ',' + item.dictLabel) : item.dictLabel
            })
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "管控层级",
          dataIndex: "controlsLevelId",
          key: "controlsLevelId",
          width: 130,
          customRender: (text) => {
            text = text ? dictionary('controlLevel', text) : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "责任部门",
          dataIndex: "responsibilityDeptId",
          key: "responsibilityDeptId",
          width: 130,
          customRender: (text) => {
            text = text ? this.deptCache[text] : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "责任人",
          dataIndex: "responsibilityPersonName",
          key: "responsibilityPersonName",
          width: 130,
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          width: 130,
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "风险分级",
          dataIndex: "riskLevel",
          key: "riskLevel",
          customCell: (record) => {
            let background = dictionary('riskLevel', record.riskLevel, false).color || ''
            return {
              style: { 'background': background },
            };
          },
          customRender: (text) => {
            text = text ? dictionary('riskLevel', text) : ''
            return (
              <span>{{ text }}</span>
            );
          },
          width: 110,
          fixed: "right", // 固定操作列
        }
      ],
      tableList: [],
    };
  },
  created() {
    this.initPage()
  },
  methods: {
    cancelSelect() {
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    getSelectData() {
      if (this.selectedRows.length === 0) {
        this.$antMessage.warning('请选择风险点')
      }
      return this.selectedRows
    },
    onRadioChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 象形图单元格样式
    initPage() {
      this.getTableList();
    },
    // 跳转风险点审批
    goRiskPointPage() {
      let path = "/safeManage/dualControlManage/riskManage/riskApproval"
      this.$router.push({
        path,
      });
    },
    // 获取列表
    getTableList() {
      const params = {
        ...this.formInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      };
      getRiskBookListApi(params)
        .then((res) => {
          let { list: tableList, total } = res.data ? res.data : { list: [], total: 0 };
          this.tableList = tableList || [];
          this.page.total = total;
          // 处理页码 问题
          if (this.tableList.length === 0 && (this.page.pageNo !== 1 || this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .finally(() => {
          this.cancelLoading();
        })
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
    // 查询
    iSearch() {
      this.handleLoading();
      this.getTableList();
    },
    // 导出
    downloadTem() {
      const name = '风险点台账'
      let apiData = {
        ...this.formInline,
      }
      this.handleLoadingTwo()
      exportRiskBookApi(apiData)
        .then(res => {
          const blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          const downloadElement = document.createElement('a');
          const href = URL.createObjectURL(blob); //创建下载链接
          downloadElement.href = href;
          downloadElement.download = name + '.xlsx';
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);// 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoadingTwo()
        })
    },
    // 重置
    iRest: debounce(
      function () {
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
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  },
};
</script>

<style scoped lang='less'>
.table-dialog {
  ::v-deep .ant-modal-header {
    margin-bottom: 20px !important;
  }
  ::v-deep .ant-modal-body {
    .clx-model-body {
      padding: 0 30px !important;
      .model-content {
        padding: 0;
      }
    }
  }
}
.top_div_marginDiv {
  margin-bottom: 15px;
}
</style>
