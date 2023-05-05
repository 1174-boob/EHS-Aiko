<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline"></CommonSearchItem>
        <a-form-model-item label="PPE类型">
          <a-select v-model="formInline.ppeType" placeholder="请选择" option-filter-prop="children" style="width: 200px" show-search :filter-option="filterOption">
            <a-select-option v-for="item in ppeTypeList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="物料名称">
          <a-input v-model="formInline.materialName" :maxLength="30" placeholder="请输入物料名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="品牌/型号">
          <a-input v-model="formInline.brand" :maxLength="30" placeholder="请输入品牌/型号" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="openAddChangeModel()">
          <a-icon type="plus" />新建
        </a-button>
      </div>
      <div>
        <a-button type="primary" :loading="loadingTwo" @click="downloadTem">导出Excel</a-button>
      </div>
    </DashBtn>
    <!--表格列表 -->
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table
        bordered
        :columns="columns"
        :scroll="{ x: tableScrollX() }"
        :locale="{ emptyText: emptyText }"
        :data-source="tableList"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
        :pagination="false"
      >
        <div slot="action" slot-scope="text,record">
          <span class="color-0067cc cursor-pointer" @click="openAddChangeModel(record)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="delDataList(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>

    <!-- 新增、编辑弹窗 -->
    <AddChangeModel v-model="addChangeModelShow" :ppeTypeList="ppeTypeList" :formModelOldData="formModelOldData" @getTableList="getTableList" />
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dragTable from "@/mixin/dragTable.js";
import { cloneDeep, debounce } from "lodash";
import { getPpeDepositoryListApi, rmPpeDepositoryItemApi, exportPpeDepositoryApi } from "@/services/chemicalIdentSafetyTipsAdd.js";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import QRcodeModel from "@/components/qrCodeModel/qrCodeModel.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import dictionary from "@/utils/dictionary";
import AddChangeModel from './components/addChangeModel.vue'
export default {
  components: { UploadBtnStyle, QRcodeModel, AddChangeModel },
  mixins: [teableCenterEllipsis, cancelLoading, dragTable, chemicalDict],
  data() {
    return {
      tableSpinning:false,
      // 新增、编辑弹窗显示
      addChangeModelShow: false,
      formModelOldData: {},
      // 化学品名称list
      ppeTypeList: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formInline: {},
      columns: [
        {
          title: "序号",
          dataIndex: "code",
          key: "code",
          customRender: (text, row, index) => {
            return index + 1;
          },
          width: 100,
        },
        {
          title: "PPE类型",
          dataIndex: "ppeType",
          key: "ppeType",
          customRender: (text) => {
            text = text ? this.getChemicalDictText('PPE_type', text) : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          minWidth: 100,
        },
        {
          title: "物料名称",
          dataIndex: "materialName",
          key: "materialName",
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
          minWidth: 100,
        },
        {
          title: "品牌/型号",
          dataIndex: "brand",
          key: "brand",
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
          title: "数量",
          dataIndex: "amount",
          key: "amount",
          customRender: (text) => {
            text = text || text === 0 ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          minWidth: 100,
        },
        {
          title: "单位",
          dataIndex: "unit",
          key: "unit",
          customRender: (text) => {
            text = text ? this.getChemicalDictText('PPE_unit', text) : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          minWidth: 100,
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right", // 固定操作列
          width: 130, // 宽度根据操作自定义设置
        },
      ],
      tableList: [],
    };
  },
  created() {
    this.columns.splice(1, 0, this.addCommonColumnItem());
    this.initConfigPage()
    this.getTableList();
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
      // PPE类型字典
      this.ppeTypeList = this.getChemicalDictList('PPE_type')
    },
    // 获取列表
    getTableList() {
      const params = {
        ...this.formInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      };
      this.tableSpinning = true
      getPpeDepositoryListApi(params)
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
          this.tableSpinning = false
          this.cancelLoading();
        })
    },
    //新增、编辑页面
    openAddChangeModel(row) {
      if (row) {
        if (!this.canClickBtnMixin("ppeDepositoryChange")) {
          return;
        }
        this.formModelOldData = { ...row }
        this.addChangeModelShow = true
      } else {
        if (!this.canClickBtnMixin("ppeDepositoryAdd")) {
          return;
        }
        this.formModelOldData = {}
        this.addChangeModelShow = true
      }
    },
    // 删除
    delDataList(record) {
      if (!this.canClickBtnMixin("ppeDepositoryRm")) {
        return;
      }
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          return rmPpeDepositoryItemApi({ inventoryId: record.inventoryId })
            .then((res) => {
              this.$antMessage.success('删除成功');
              this.getTableList();
            })
            .catch(err => { });
        },
      });
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
    // 下载模板
    downloadTem() {
      const name = '库存管理'
      let apiData = {
        ...this.formInline,
      }
      this.handleLoadingTwo()
      exportPpeDepositoryApi(apiData)
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
        this.$refs.commonSearchItem.reset();
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
