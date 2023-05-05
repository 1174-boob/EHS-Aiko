<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="编号">
          <a-input v-model="formInline.code" placeholder="请输入"></a-input>
        </a-form-model-item>
        <a-form-model-item label="工艺">
          <a-input v-model="formInline.workmanship" placeholder="请输入"></a-input>
        </a-form-model-item>
        <a-form-model-item label="风险分级">
          <a-select v-model="formInline.riskClassification" placeholder="请选择" show-search :filter-option="filterOptionMixin">
            <a-select-option v-for="item in  dictionary('riskLevel')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="危险源种类">
          <a-select v-model="formInline.riskClass" placeholder="请选择" show-search :filter-option="filterOptionMixin">
            <a-select-option v-for="item in getChemicalDictList('wxy_hazardkind')" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="可能导致事件">
          <a-select v-model="formInline.possibleEvents" placeholder="请选择" show-search :filter-option="filterOptionMixin">
            <a-select-option v-for="item in getChemicalDictList('wxy_leadtheevent')" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="关键词">
          <a-input v-model="formInline.keyWord" placeholder="请输入"></a-input>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table
        :columns="columns"
        :scroll="{ x: tableScrollX() }"
        :locale="{emptyText: emptyText}"
        :data-source="tableData"
        :loading="loading || loadingTwo"
        :pagination="false"
        :rowKey="tableRowKey"
        bordered
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,fixed:true }"
      >
        <div slot="code" slot-scope="text,record">
          <a-popover autoAdjustOverflow>
            <div slot="content">
              <p>{{ text }}</p>
            </div>
            <span class="can-click overflow-text" @click="goDangerSourceDetailsPage(record)">{{ text }}</span>
          </a-popover>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>

<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import dictionary from '@/utils/dictionary'
import { cloneDeep, debounce } from 'lodash';
import { GetSpecificityList } from '@/services/dangerSource/dangerList/index.js'
import chemicalDict from "@/mixin/chemicalDict.js";
import teableSelected from "@/mixin/teableSelected";
export default {
  mixins: [teableCenterEllipsis, cancelLoading, chemicalDict, teableSelected],
  props: {
    selectedRowOld: {
      type: Array,
      default: () => []
    },
    corporationId: {
      required: true,
    }
  },
  data() {
    return {
      dictionary,
      tableRowKey: 'id',
      formInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: '编号',
          dataIndex: 'code',
          width: 200,
          scopedSlots: { customRender: "code" },
        },
        {
          title: '部门',
          dataIndex: 'deptName',
          width: 150,
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: '工艺',
          dataIndex: 'workmanship',
          width: 150,
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: '设备或区域',
          dataIndex: 'equipmentArea',
          width: 150,
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: '作业状态',
          dataIndex: 'jobStatus',
          width: 150,
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: '风险描述',
          dataIndex: 'riskDescription',
          minWidth: 150,
          customRender: (text) => {
            text = text ? text : "";
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
          title: '危险源种类',
          dataIndex: 'riskClassKey',
          width: 110,
          customRender: (text) => {
            text = text ? this.getChemicalDictText('wxy_hazardkind', text) : "";
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
          title: '可能导致的事件',
          dataIndex: 'possibleEventsKey',
          width: 140,
          customRender: (text) => {
            text = text ? this.getChemicalDictText('wxy_leadtheevent', text) : "";
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
          title: '风险分级',
          dataIndex: "riskClassification",
          fixed: 'right',
          width: 110,
          customCell: (record) => {
            let background = dictionary('riskLevel', record.riskClassification, false).color || ''
            return {
              style: { 'background': background }
            }
          },
          customRender: (text, record) => {
            return text ? dictionary('riskLevel', text) : "";
          },
        },
      ],
      tableData: [],
    }
  },
  created() {
    // 列表插入所属组织
    this.columns.splice(1, 0, this.addCommonColumnItem(130));
    this.selectedRow = cloneDeep(this.selectedRowOld)
    this.selectedRowKeys = this.selectedRowOld.map(item => item[this.tableRowKey]).filter(item => item || item === 0)
    setTimeout(() => {
      this.getTableList();//获取列表
    }, 200);
  },
  methods: {
    // 关联危险源-跳转详情页
    goDangerSourceDetailsPage(record) {
      let routeUrl = this.$router.resolve({
        path: '/dangerSource/detailDanger',
        query: { id: record.id, type: 2, back: true }
      });
      window.open(routeUrl.href, "_blank");
    },
    //获取列表
    getTableList() {
      let params = {
        ...this.formInline,
        corporationId: this.corporationId,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo
      }
      this.handleLoadingTwo()
      return GetSpecificityList(params).then((res) => {
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

    // 页码改变
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getTableList();
    },

    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      // 获取列表
      this.getTableList()
        .finally(() => {
          this.cancelLoading();
        })
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
.overflow-text {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.can-click {
  color: #0067cc;
  cursor: pointer;
}
.scal {
  // color: #0067cc;
  // font-size: 15px;
  cursor: pointer;
  &:hover {
    color: #0067cc;
  }
}
</style>