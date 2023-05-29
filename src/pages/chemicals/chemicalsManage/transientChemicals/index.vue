<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>临时化学品入厂</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" deptLabel="申请人部门"></CommonSearchItem>
        <a-form-model-item label="标题">
          <a-input v-model="formInline.title" :maxLength="30" placeholder="请输入标题" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="化学品名称">
          <a-input v-model="formInline.chemicalsId" :maxLength="30" placeholder="请输入化学品名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select v-model="formInline.status" placeholder="请选择" style="width: 200px" show-search :filter-option="filterOption">
            <a-select-option v-for="item in statusList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="进出厂状态">
          <a-select v-model="formInline.factoryStatus" placeholder="请选择" style="width: 200px" show-search :filter-option="filterOption">
            <a-select-option v-for="item in dictionary('factoryRecordStatus')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="goDraft">草稿箱</a-button>
        <a-button type="dashed" @click="jumpAddOrDetail">
          <a-icon type="plus" />新建
        </a-button>
        <a-button type="dashed" @click="jumpList">临时化学品清单</a-button>
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
        <div slot="factoryStatus" slot-scope="text">
          <span class="cursor-pointer" :class="text == '5' ? 'color-ff4d4f':''">{{text? dictionary('factoryRecordStatus', text):''}}</span>
        </div>
        <div slot="action" slot-scope="text,record">
          <span class="color-0067cc cursor-pointer" @click="goShowPage(record)">查看</span>
          <span class="color-0067cc cursor-pointer" v-if="isResolveVisible(record)" @click="goHandlePge(record)">处理</span>
          <span class="color-0067cc cursor-pointer" v-if="showQrCodeBtn(record)" @click="openQRcodeModel(record)">二维码</span>
          <span class="color-0067cc cursor-pointer" v-if="showQrCodeBtn(record)" @click="goTagPage(record)">标签</span>
          <span class="color-0067cc cursor-pointer" v-if="showNoteBtn(record)" @click="openNoteModel(record)">进出场记录</span>
        </div>
      </a-table>
    </CommonTable>
    <!-- 二维码 弹窗 -->
    <QRcodeModel v-model="QRcodeModelShow" :QRCodeData="QRCodeData" />
    <!-- 进出场记录 弹窗 -->
    <NoteModel v-model="noteModelShow" :noteModelData="noteModelData" />
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
import NoteModel from './components/noteModel/noteModel.vue'
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
export default {
  components: { QRcodeModel, NoteModel, OrganizeLazyTree },
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
      // 所属组织下拉列表
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
          title: "状态",
          dataIndex: "status",
          key: "status",
          customRender: (text) => {
            text = dictionary('chemicalApproveStatus', text)
            return text;
          },
          width: 110,
        },
        {
          title: "进出厂状态",
          dataIndex: "factoryStatus",
          key: "factoryStatus",
          scopedSlots: { customRender: "factoryStatus" },
          width: 120,
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right", // 固定操作列
          width: 250, // 宽度根据操作自定义设置
        },
      ],
      tableList: [],
      // 二维码弹窗
      QRcodeModelShow: false,
      QRCodeData: {},
      // 进出场记录 弹窗
      noteModelShow: false,
      noteModelData: {},
      // 当前用户信息
      userId: undefined,
    };
  },
  created() {
    this.setRouterCode("transientChemicals");
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
      // 所属组织字典
      // 状态字典
      this.statusList = dictionary("chemicalApproveStatus");
      // 用户信息
      this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
    },
    // 树搜索过滤
    filterTree(inputValue, treeNode) {
      return treeNode.data.props.deptName.includes(inputValue)
    },
    // 控制处理按钮是否显示
    showQrCodeBtn(row) {
      let showBtn = false
      // 已入场  已出厂  异常
      if (row.factoryStatus) {
        showBtn = true
      }
      return showBtn
    },
    // 控制进出厂按钮是否显示
    showNoteBtn(row) {
      let showBtn = false
      // 已入场  已出厂  异常
      if ([3, 4, 5].includes(row.factoryStatus - 0)) {
        showBtn = true
      }
      return showBtn
    },
    // 控制处理按钮是否显示
    isResolveVisible(row) {
      let showBtn = false
      if (row.status != 'end') {
        showBtn = row.handler.indexOf(this.userId) != -1
      }
      return showBtn
    },
    // 获取列表
    getTableList() {
      const params = {
        ...this.formInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        //不查草稿
        draftStatus: 2,
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
      this.QRCodeData = { temporaryEntryId: row.temporaryEntryId };
      this.QRcodeModelShow = true;
    },
    // 入场纪录弹窗
    openNoteModel(row) {
      this.noteModelData = row
      this.noteModelShow = true;
    },
    // 跳转草稿箱
    goDraft() {
      this.$router.push({
        path: "/ehsGerneralManage/cooperationPartner/transientChemicalsDraft",
      });
    },
    // 跳转临时化学品清单
    jumpList() {
      this.$router.push({
        path: "/ehsGerneralManage/cooperationPartner/transientChemicalsList",
      });
    },
    //跳转新增、编辑页面
    jumpAddOrDetail() {
      let query = {};
      this.$router.push({
        path: "/ehsGerneralManage/cooperationPartner/transientChemicalsAdd",
        query,
      });
    },
    // 跳转处理页面
    goHandlePge(record) {
      let query = { temporaryEntryId: record.temporaryEntryId };
      this.$router.push({
        path: "/ehsGerneralManage/cooperationPartner/transientChemicalsHandle",
        query,
      });
    },
    // 跳转查看页面
    goShowPage(record) {
      let query = { temporaryEntryId: record.temporaryEntryId };
      this.$router.push({
        path: "/ehsGerneralManage/cooperationPartner/transientChemicalsShow",
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
        this.$refs.commonSearchItem.reset();
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
