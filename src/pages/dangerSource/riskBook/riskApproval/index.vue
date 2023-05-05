<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :hasDepartment="false" :CommonFormInline="formInline"></CommonSearchItem>
        <a-form-model-item label="风险分级">
          <a-select v-model="formInline.riskLevel" placeholder="请选择" option-filter-prop="children" style="width: 200px" show-search :filter-option="filterOption">
            <a-select-option v-for="item in dictionary('riskLevel')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select v-model="formInline.auditStatus" show-search placeholder="请选择" option-filter-prop="children" style="width: 200px" :filter-option="filterOption">
            <a-select-option v-for="item in dictionary('riskPointApproveStatus')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="提交时间">
          <a-range-picker v-model="formInline.auditTime" class="search-range-picker" format="YYYY-MM-DD" style="width: 200px" :placeholder="['开始时间','结束时间']" />
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="goAddChangePage('add')">
          <a-icon type="plus" />新建
        </a-button>
      </div>
    </DashBtn>
    <!--表格列表 -->
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: tableScrollX() }" :locale="{ emptyText: emptyText }" :data-source="tableList" :rowKey="(record, index) => {return index;}" :pagination="false">
        <div slot="action" slot-scope="text,record">
          <!-- 1待提交 2审核中  3审核通过  4审核驳回 -->
          <span class="color-0067cc cursor-pointer" v-if="[2,3].includes(record.auditStatus-0)" @click="goHandleOrShowPge('show',record)">查看</span>
          <span class="color-0067cc cursor-pointer" v-if="[1,4].includes(record.auditStatus-0)" @click="goAddChangePage('change',record)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" v-if="[1,3,4].includes(record.auditStatus-0)" @click="delDataList(record)">删除</span>
          <span class="color-0067cc cursor-pointer" v-if="isResolveVisible(record)" @click="goHandleOrShowPge('handle',record)">处理</span>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dragTable from "@/mixin/dragTable.js";
import { cloneDeep, debounce } from "lodash";
import { getRiskApprovalListApi, rmRiskApprovalItemApi } from "@/services/dangerSource/risk";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import QRcodeModel from "@/components/qrCodeModel/qrCodeModel.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import dictionary from "@/utils/dictionary";
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
import dayJs from 'dayjs';
export default {
  components: { UploadBtnStyle, QRcodeModel, OrganizeLazyTree },
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
      columns: [
        {
          title: "状态",
          dataIndex: "auditStatus",
          key: "auditStatus",
          customRender: (text) => {
            text = text ? dictionary('riskPointApproveStatus', text) : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          width: 110,
        },
        {
          title: "单号",
          dataIndex: "riskPointApprovalNo",
          key: "riskPointApprovalNo",
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
          minWidth: 110,
        },
        {
          title: "提交时间",
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
          minWidth: 130,
        },
        {
          title: "审核通过时间",
          dataIndex: "finalTime",
          key: "finalTime",
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
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right", // 固定操作列
          width: 135, // 宽度根据操作自定义设置
        },
      ],
      tableList: [],
      userId: undefined,
    };
  },
  created() {
    // 列表插入所属组织
    this.columns.splice(2, 0, this.addCommonColumnItem(130));
    this.getTableList()
    this.initConfigPage()
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
      this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
    },
    // 获取列表
    getTableList() {
      let { auditTime } = this.formInline
      const params = {
        ...this.formInline,
        auditTime: undefined,
        createTimeStart: auditTime && auditTime[0] ? dayJs(auditTime[0]).format("YYYY-MM-DD") : undefined,
        createTimeEnd: auditTime && auditTime[1] ? dayJs(auditTime[1]).format("YYYY-MM-DD") : undefined,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      };
      this.tableSpinning = true
      getRiskApprovalListApi(params)
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
    // 控制处理按钮是否显示
    isResolveVisible(row) {
      let showBtn = false
      if (row.auditStatus == 2) {
        showBtn = row.handler && row.handler.indexOf(this.userId) != -1
      }
      return showBtn
    },
    // 跳转风险点审批
    goRiskPointPage() {
      let path = "/occupationHealth/ppeClaimHandle"
      this.$router.push({
        path,
      });
    },
    // 跳转处理页面
    goHandleOrShowPge(type, record) {
      let path = type == 'handle' ? "/safeManage/dualControlManage/riskManage/riskApprovalHandle" : "/safeManage/dualControlManage/riskManage/riskApprovalShow"
      let query = { riskPointApprovalId: record.riskPointApprovalId };
      this.$router.push({
        path,
        query,
      });
    },
    //新增、编辑页面
    goAddChangePage(type, record) {
      let path = type == 'add' ? "/safeManage/dualControlManage/riskManage/riskApprovalAdd" : "/safeManage/dualControlManage/riskManage/riskApprovalEdit"
      let query = type == 'add' ? {} : { riskPointApprovalId: record.riskPointApprovalId };
      this.$router.push({
        path,
        query,
      });
    },
    // 删除
    delDataList(record) {
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          return rmRiskApprovalItemApi({ riskPointApprovalId: record.riskPointApprovalId })
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
    // 重置
    iRest: debounce(
      function () {
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.formInline = {}
        this.$refs.commonSearchItem.reset()
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
