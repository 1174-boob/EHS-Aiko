<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>临时化学品草稿箱</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" deptLabel="申请人部门"></CommonSearchItem>
        <a-form-model-item label="标题">
          <a-input v-model="formInline.title" placeholder="请输入标题" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="化学品名称">
          <a-input v-model="formInline.chemicalsId" :maxLength="30" placeholder="请输入化学品名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
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
          <span class="color-0067cc cursor-pointer" @click="jumpAddOrDetail(record)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="delDataList(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
    <!-- 二维码 弹窗 -->
    <QRcodeModel v-model="QRcodeModelShow" :QRCodeData="QRCodeData" />
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dragTable from "@/mixin/dragTable.js";
import { debounce } from "lodash";
import { getTransientChemicalsListApi, rmTransientChemicalsItemApi, } from "@/services/chemicalIdentSafetyTipsAdd.js";
import QRcodeModel from "@/components/qrCodeModel/qrCodeModel.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import dictionary from "@/utils/dictionary";
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
export default {
  components: { QRcodeModel, OrganizeLazyTree },
  mixins: [teableCenterEllipsis, cancelLoading, dragTable, chemicalDict],
  data() {
    return {
      tableSpinning:false,
      dictionary,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formInline: {},
      // 状态下拉列表
      statusList: [],
      columns: [
        {
          title: "编号",
          dataIndex: "code",
          key: "code",
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
          width: 160,
        },
        {
          title: "标题",
          dataIndex: "title",
          key: "title",
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
          minWidth: 110,
        },
        {
          title: "业务担当",
          dataIndex: "boeAssume",
          key: "boeAssume",
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
          title: "化学品入厂日期",
          dataIndex: "intoFactoryDate",
          key: "intoFactoryDate",
          width: 140,
        },
        {
          title: "创建人",
          dataIndex: "userName",
          key: "userName",
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
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
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
          width: 160,
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right", // 固定操作列
          width: 140, // 宽度根据操作自定义设置
        },
      ],
      tableList: [],
      // 二维码弹窗
      QRcodeModelShow: false,
      QRCodeData: {},
      // 导出记录 弹窗
      noteModelShow: false,
    };
  },
  created() {
    this.columns.splice(1, 0, this.addCommonColumnItem(130));
    this.columns.splice(2, 0, this.addCommonColumnDepartment({
      width: 130,
      title: "申请人部门"
    }))
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
      // 状态字典
      this.statusList = dictionary("chemicalApproveStatus");
    },
    // 树搜索过滤
    filterTree(inputValue, treeNode) {
      return treeNode.data.props.deptName.includes(inputValue)
    },
    // 获取列表
    getTableList() {
      const params = {
        ...this.formInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        //查草稿
        draftStatus: 1,
      };
      this.tableSpinning = true
      getTransientChemicalsListApi(params)
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
    // 二维码弹窗
    openQRcodeModel(row) {
      this.QRCodeData = { type: 'transientChemicals', id: row.safeRemindId };
      this.QRcodeModelShow = true;
    },
    // 入场纪录弹窗
    openNoteModel(row) {
      this.noteModelShow = true;
    },
    //跳转新增、编辑页面
    jumpAddOrDetail(record) {
      let query = { temporaryEntryId: record.temporaryEntryId };
      this.$router.push({
        path: "/ehsGerneralManage/cooperationPartner/transientChemicalsAdd",
        query,
      });
    },
    // 跳转标签页面
    goTagPage(row) {
      let query = {
        temporaryEntryId: row.temporaryEntryId
      }
      this.$router.push({
        path: "/ehsGerneralManage/cooperationPartner/transientChemicalsTag",
        query,
      });
    },
    // 删除
    delDataList(record) {
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          return rmTransientChemicalsItemApi({ temporaryEntryId: record.temporaryEntryId })
            .then((res) => {
              this.$antMessage.success(res.message);
              this.getTableList();
            })
            .catch((err) => {
              console.log(err);
            });
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
    // 重置
    iRest: debounce(
      function () {
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.formInline = {};
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
