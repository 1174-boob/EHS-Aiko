<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true"></CommonSearchItem>
        <a-form-model-item label="PPE类型">
          <a-select v-model="formInline.ppeType" show-search placeholder="请选择" option-filter-prop="children" style="width: 200px" :filter-option="filterOption">
            <a-select-option v-for="item in ppeTypeList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="负责人">
          <a-input v-model.trim="formInline.principalUserName" :maxLength="20" placeholder="请输入负责人" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="手机号">
          <a-input v-model.trim="formInline.principalUserPhone" :maxLength="30" placeholder="请输入手机号" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="创建时间">
          <a-range-picker style="width: 200px" class="search-range-picker" v-model="formInline.auditTime" format="YYYY-MM-DD" :placeholder="['开始时间','结束时间']" />
        </a-form-model-item>
        <a-form-model-item label="审核状态">
          <a-select v-model="formInline.auditStatus" show-search placeholder="请选择" option-filter-prop="children" style="width: 200px" :filter-option="filterOption">
            <a-select-option v-for="item in statusList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
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
        <a-button type="dashed" @click="goAddPage">
          <a-icon type="plus" />新建报废申请
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
          <span class="color-0067cc cursor-pointer" @click="goHandleOrShowPge('show',record)">查看</span>
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
import { getPpeStockListApi, rmPpeStockItemApi, exportPpeStockApi } from "@/services/chemicalIdentSafetyTipsAdd.js";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import QRcodeModel from "@/components/qrCodeModel/qrCodeModel.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import serviceNameList from '@/config/default/service.config.js'
import dictionary from "@/utils/dictionary";
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
import dayJs from 'dayjs';
import staffOrDept from "@/components/staffOrDept";
export default {
  components: { UploadBtnStyle, QRcodeModel, OrganizeLazyTree, staffOrDept },
  mixins: [teableCenterEllipsis, cancelLoading, dragTable, chemicalDict],
  data() {
    return {
      tableSpinning:false,
      // 新增、编辑弹窗显示
      addChangeModelShow: false,
      checkedTreeNode: [],
      formModelOld: {},
      // 导入文件地址
      action: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.chemicals}/api/ehs/chemical/safe/label/upload`,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formInline: {},
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
          width: 176,
        },
        {
          title: "部门",
          dataIndex: "deptName",
          key: "deptName",
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
          width: 130,
        },
        {
          title: "物料名称/型号",
          dataIndex: "materialNameAndBrand",
          key: "materialNameAndBrand",
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
          title: "负责人",
          dataIndex: "principalUserName",
          key: "principalUserName",
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
          title: "手机号",
          dataIndex: "principalUserPhone",
          key: "principalUserPhone",
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
          width: 120,
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          width: 110,
        },
        {
          title: "有效期",
          dataIndex: "validityTime",
          key: "validityTime",
          width: 110,
        },
        {
          title: "结束时间",
          dataIndex: "finalTime",
          key: "finalTime",
          width: 110,
        },
        {
          title: "审核状态",
          dataIndex: "auditStatus",
          key: "auditStatus",
          customRender: (text) => {
            text = text ? dictionary('chemicalApproveStatus', text) : ''
            return text;
          },
          width: 110,
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
      // PPE类型字典
      ppeTypeList: [],
      // 审核状态字典
      statusList: [],
      // 当前用户信息
      userId: undefined,
    };
  },
  created() {
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
       // PPE类型字典
      this.ppeTypeList = this.getChemicalDictList('PPE_type')
      // 申请状态字典
      this.statusList = dictionary("chemicalApproveStatus");
      // 用户信息
      this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
    },
    // 控制处理按钮是否显示
    isResolveVisible(row) {
      let showBtn = false
      if (row.auditStatus != 'end') {
        showBtn = row.handler && row.handler.indexOf(this.userId) != -1
      }
      return showBtn
    },
    // 测试人员模糊筛选
    filterUserTree(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue)
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
        draftStatus: 2, //1 草稿 2非草稿
      };
      this.tableSpinning = true
      getPpeStockListApi(params)
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
        this.formModelOld = row
        this.addChangeModelShow = true
      } else {
        this.addChangeModelShow = true
      }
    },
    //跳转新增页面
    goAddPage() {
      this.$router.push({
        path: "/occupationHealth/ppeStockAdd",
        query: { type: 'add' },
      });
    },
    // 跳转处理页面
    goHandleOrShowPge(type, record) {
      let path = type == 'handle' ? "/occupationHealth/ppeStockHandle" : "/occupationHealth/ppeStockShow"
      let query = { scrapId: record.scrapId };
      this.$router.push({
        path,
        query,
      });
    },
    // 跳转草稿箱
    goDraft() {
      this.$router.push({
        path: "/occupationHealth/ppeStockDraft",
      });
    },
    // 删除
    delDataList(record) {
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          return rmPpeStockItemApi({ labelId: record.labelId })
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
      if (this.formInline.principalUserName && this.formInline.principalUserName.length < 2) {
        this.$antMessage.warn('负责人最少输入2位');
        return
      }
      if (this.formInline.principalUserPhone && this.formInline.principalUserPhone.length < 5) {
        this.$antMessage.warn('手机号最少输入5位');
        return
      }
      this.handleLoading();
      this.getTableList();
    },
    // 下载模板
    downloadTem() {
      const name = '报废管理'
      let { auditTime } = this.formInline
      let apiData = {
        ...this.formInline,
        auditTime: undefined,
        createTimeStart: auditTime && auditTime[0] ? dayJs(auditTime[0]).format("YYYY-MM-DD") : undefined,
        createTimeEnd: auditTime && auditTime[1] ? dayJs(auditTime[1]).format("YYYY-MM-DD") : undefined,
        draftStatus: 2, //1 草稿 2非草稿
      };
      this.handleLoadingTwo()
      exportPpeStockApi(apiData)
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
        this.checkedTreeNode = []
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
::v-deep .ant-calendar-range-picker-separator {
  transform: translateY(2px);
}
</style>
