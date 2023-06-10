<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>相关方审批</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" deptLabel="所属部门"></CommonSearchItem>
        <a-form-model-item label="企业全称">
          <a-input v-model="formInline.companyName" :maxLength="30" placeholder="请输入企业全称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="合同号">
          <a-input v-model="formInline.contractNo" :maxLength="30" placeholder="请输入合同号" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select v-model="formInline.approvalStatus" placeholder="请选择审批状态" style="width: 200px" show-search :filter-option="filterOption">
            <a-select-option v-for="item in statusList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="安全协议到期日">
          <a-range-picker style="width: 200px" class="search-range-picker" v-model="formInline.createDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="jumpAddOrDetail">
          <a-icon type="plus" />新建
        </a-button>
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
          <span class="color-0067cc cursor-pointer" v-if="record.approvalStatus == 1 || record.approvalStatus == 3" @click="jumpAddOrDetail(record)">编辑</span>
          <span class="color-0067cc cursor-pointer" v-if="isResolveVisible(record)" @click="goHandlePge(record)">处理</span>
          <span class="color-ff4d4f cursor-pointer" @click="delDataList(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dragTable from "@/mixin/dragTable.js";
import { debounce } from "lodash";
import { 
  getEnterpriseList,
  enterpriseInsert,
  enterpriseUpdate,
  enterpriseDetail,
  enterpriseDelete,
  enterpriseApproval,
  enterpriseRejection,
  enterpriseSaveFiling} from "@/services/chemicalIdentSafetyTipsAdd.js";
import chemicalDict from "@/mixin/chemicalDict.js";
import dictionary from "@/utils/dictionary";
export default {
  components: { },
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
          title: "企业全称",
          dataIndex: "companyName",
          key: "companyName",
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
          title: '所属部门',
          dataIndex: 'departmentName',
          width: 140,
        },
        {
          title: "所属担当",
          dataIndex: "toBearName",
          key: "toBearName",
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
          title: "安全协议合同号",
          dataIndex: "contractNo",
          key: "contractNo",
          width: 140,
        },
        {
          title: "安全协议到期日",
          dataIndex: "contractExpirationDate",
          key: "contractExpirationDate",
          width: 140,
        },
        {
          title: "起草人",
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
          title: "创建日期",
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
          dataIndex: "approvalStatus",
          key: "approvalStatus",
          customRender: (text) => {
            text = dictionary('dirllPlanApproveStatus', text)
            return text;
          },
          width: 110,
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right", // 固定操作列
          width: 180, // 宽度根据操作自定义设置
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
      this.statusList = dictionary("dirllPlanApproveStatus");
      // 用户信息
      this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
    },
    // 树搜索过滤
    filterTree(inputValue, treeNode) {
      return treeNode.data.props.deptName.includes(inputValue)
    },
    // 控制处理按钮是否显示
    isResolveVisible(row) {
      let showBtn = false
      if (row.approvalStatus == 2 && row.handler.indexOf(this.userId) != -1) {
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
        startTime: this.formInline.createDate ? this.formInline.createDate[0] : "",
        endTime: this.formInline.createDate ? this.formInline.createDate[1] : "",
      };
      this.tableSpinning = true
      getEnterpriseList(params)
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
        .catch(err => {})
        .finally(() => {
          this.tableSpinning = false
          this.cancelLoading();
        })
    },
    //跳转新增、编辑页面
    jumpAddOrDetail(record) {
      let query = { invitationId: record.invitationId };
      this.$router.push({
        path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/examineAdd",
        query,
      }).catch(err => {
        console.log(err,'.....bc');
      });
    },
    // 跳转处理页面
    goHandlePge(record) {
      let query = { invitationId: record.invitationId };
      this.$router.push({
        path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/examineHandle",
        query,
      });
    },
    // 跳转查看、编辑页面
    goShowPage(record) {
      let query = { invitationId: record.invitationId };
      this.$router.push({
        path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/examinePreview",
        query,
      });
    },
    // 删除
    delDataList(record) {
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          return enterpriseDelete({ invitationId: record.invitationId })
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
