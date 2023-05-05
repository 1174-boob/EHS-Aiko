<template>
  <div>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
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
    <!--表格列表 -->
    <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table
        bordered
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,fixed:true }"
        :scroll="{ x: tableScrollX() }"
        :columns="columns"
        :locale="{emptyText: emptyText}"
        :data-source="tableData"
        :rowKey="tableRowKey"
        :loading="loading || loadingTwo"
        :pagination="false"
      ></a-table>
    </CommonTable>
  </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { cloneDeep, debounce } from "lodash";
import { getRiskApprovalGetRiskBookListApi } from "@/services/dangerSource/risk";
import chemicalDict from "@/mixin/chemicalDict.js";
import dictionary from "@/utils/dictionary";
import teableSelected from "@/mixin/teableSelected";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
export default {
  mixins: [cancelLoading, chemicalDict, teableSelected, teableCenterEllipsis],
  props: {
    selectedRowOld: {
      type: Array,
      default: () => []
    },
    corporationId: {
      required: true
    },
  },
  data() {
    return {
      dictionary,
      tableRowKey: 'riskPointId',
      // 新增、编辑弹窗显示
      addChangeModelShow: false,
      formModelOldData: {},
      formInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
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
          minWidth: 170,
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
        },
      ],
      tableData: [],
      selectedRowKeys: [],
      selectedRow: [],
    };
  },
  created() {
    // 列表插入所属组织
    this.columns.splice(1, 0, this.addCommonColumnItem(130));
    this.columns.splice(2, 0, this.addCommonColumnDepartment(130));
    this.selectedRow = cloneDeep(this.selectedRowOld)
    this.selectedRowKeys = this.selectedRowOld.map(item => item[this.tableRowKey]).filter(item => item || item === 0)
    setTimeout(() => {
      this.getTableList()
    }, 200);
  },
  methods: {
    // 获取列表
    getTableList() {
      const params = {
        ...this.formInline,
        corporationId: this.corporationId,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      };
      this.handleLoadingTwo()
      getRiskApprovalGetRiskBookListApi(params)
        .then((res) => {
          let { list: tableData, total } = res.data ? res.data : { list: [], total: 0 };
          this.tableData = tableData || [];
          this.page.total = total;
          // 处理页码 问题
          if (this.tableData.length === 0 && (this.page.pageNo !== 1 || this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .finally(() => {
          this.cancelLoading();
          this.cancelLoadingTwo();
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
  watch: {

  }
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
