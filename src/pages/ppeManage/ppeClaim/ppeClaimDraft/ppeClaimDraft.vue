<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>PPE领用管理草稿箱</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" deptLabel="领用部门"></CommonSearchItem>
        <a-form-model-item label="申请人">
          <a-input v-model.trim="formInline.userName" :maxLength="20" placeholder="请输入申请人" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="工号">
          <a-input v-model.trim="formInline.jobNumber" :maxLength="30" placeholder="请输入工号" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="手机号">
          <a-input v-model.trim="formInline.phone" :maxLength="30" placeholder="请输入手机号" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="创建时间">
          <a-range-picker v-model="formInline.auditTime" class="search-range-picker" format="YYYY-MM-DD" style="width: 200px" :placeholder="['开始时间','结束时间']" />
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
        <template slot="auditUserId" slot-scope="text">
          <!-- userIdFilter(IdObjs)全局过滤器 -->
          <a-popover autoAdjustOverflow>
            <div slot="content">
              <p>{{ text | userIdFilter(IdObjs) }}</p>
            </div>
            <span>{{ text | userIdFilter(IdObjs) }}</span>
          </a-popover>
        </template>
        <div slot="action" slot-scope="text,record">
          <span class="color-0067cc cursor-pointer" @click="goAddPage(record)">编辑</span>
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
import { cloneDeep, debounce } from "lodash";
import { getPpeClaimListApi, rmPpeClaimItemApi, exportPpeClaimApi } from "@/services/chemicalIdentSafetyTipsAdd.js";
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
      IdObjs: {},
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
          title: "申请人",
          dataIndex: "auditUserId",
          scopedSlots: { customRender: 'auditUserId' },
          minWidth: 130,
        },
        {
          title: "工号",
          dataIndex: "auditUserJobNumber",
          key: "auditUserJobNumber",
          minWidth: 110,
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
          title: "手机号",
          dataIndex: "auditUserPhone",
          key: "auditUserPhone",
          minWidth: 120,
        },
        {
          title: "申请人部门",
          dataIndex: "auditUserDeptName",
          key: "auditUserDeptName",
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
          minWidth: 140,
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
          customRender: (text) => {
            text = text ? text : ''
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
    };
  },
  created() {
    this.columns.splice(1, 0, this.addCommonColumnItem(undefined, true));
    this.columns.splice(2, 0, this.addCommonColumnDepartment({
      width: undefined,
      title: "领用部门"
    }))
    this.getTableList();
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.iRest()
      }
    }, 20);
 },
  methods: {
    // 测试人员模糊筛选
    userId(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue)
    },
    // 选择申请人
    getTreeData(value) {
      console.log("value---", value);
      const userId = value.treeIdList.join("");
      this.formInline.userId = userId;
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
        draftStatus: 1,  //1.草稿 2提交
      };
      this.tableSpinning = true
      getPpeClaimListApi(params)
        .then((res) => {
          let { list: tableList, total } = res.data ? res.data : { list: [], total: 0 };
          // 人员id数组获取人员详情
          if (tableList && tableList.length > 0) {
            let idArr = []; //人员id数组
            for (let ele of tableList) {
              if (ele.auditUserId) idArr.push(ele.auditUserId); //userIdList字段是返回值中的人员数组
            }
            if (idArr.length >= 1) {
              const newArr = new Set(idArr)
              this.getUserAndJobNumber(newArr).then(res => { //全局方法
                this.IdObjs = res;
              }).catch(err => {
                console.log(err);
              })
            }
          }

          // 人员id数组获取过程结束
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
    //跳转新增页面
    goAddPage(row) {
      this.$router.push({
        path: "/occupationHealth/ppeClaimAdd",
        query: { receiveId: row.receiveId },
      });
    },
    // 删除
    delDataList(record) {
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          return rmPpeClaimItemApi({ receiveId: record.receiveId })
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
      if (this.formInline.userName && this.formInline.userName.length < 2) {
        this.$antMessage.warn('申请人最少输入2位');
        return
      }
      if (this.formInline.jobNumber && this.formInline.jobNumber.length < 5) {
        this.$antMessage.warn('工号最少输入5位');
        return
      }
      if (this.formInline.phone && this.formInline.phone.length < 5) {
        this.$antMessage.warn('手机号最少输入5位');
        return
      }
      this.handleLoading();
      this.getTableList();
    },
    // 批量导入成功
    handleSuccess(fileList) {
      this.getTableList()
    },
    // 下载模板
    downloadTem() {
      const name = 'PPE领用批量导出'
      let apiData = {
        ...this.formInline,
      }
      exportPpeClaimApi(apiData)
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
        this.checkedTreeNode = [];
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
