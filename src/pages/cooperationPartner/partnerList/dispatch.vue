<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :rules="formRules" :colon="false">
        <!-- <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline"></CommonSearchItem> -->
        <a-form-model-item label="联系方式" prop="phone">
          <a-input v-model="formInline.phone" placeholder="请输入联系方式"></a-input>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" :loading="loadingTwo" @click="dispatchFn">派工</a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>index" :pagination="false">
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="actionEdit(record)">编辑</span>
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionLook(record)">学习记录</span>
          <span class="color-0067cc cursor-pointer" @click="actionDelete(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
    <CommonModal class="table-modal" title="派工" :visible="detailVisible" :cancelFn="detailCancle">
      <div>
        <SearchTerm>
          <a-form-model layout="inline" :model="formInlineDetail" :rules="detailRules" :colon="false">
            <a-form-model-item label="姓名">
              <a-input v-model="formInlineDetail.userName" placeholder="请输入姓名"></a-input>
            </a-form-model-item>
            <a-form-model-item label="联系方式">
              <a-input v-model="formInlineDetail.phone" placeholder="请输入联系方式"></a-input>
            </a-form-model-item>
            <a-form-model-item label="证件号码">
              <a-input v-model="formInlineDetail.idNumber" placeholder="请输入证件号码"></a-input>
            </a-form-model-item>
            <!-- 搜索栏按钮需要加固定的float-right类名 -->
            <a-form-model-item class="float-right">
              <a-button type="primary" :loading="loadingTwo" @click="iSearchDetail">查询</a-button>
              <a-button @click="iRestDetail">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>
        <CommonTable :page="pageDetail" :pageNoChange="pageNoChangeDetail" :showSizeChange="onShowSizeChangeDetail">
          <a-table
            :row-selection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,...rowDisabled}"
            :columns="columnsDetail"
            :scroll="{ x: 800 }"
            :locale="{emptyText: emptyText}"
            :data-source="tableDataListDetail"
            :rowKey="tableRowKey"
            :pagination="false"
          ></a-table>
        </CommonTable>
      </div>
      <template slot="btn">
        <a-button @click="detailCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" :loading="loadingThree" @click="detailConfirm">确定</a-button>
      </template>
    </CommonModal>
    <CommonModal title="派工" :visible="editVisible" :cancelFn="editCancle">
      <template slot="form">
        <a-form-model
          ref="editForm"
          :model="editForm"
          :rules="editFormRules"
          :label-col="{ style: { width: '66px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 66px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="姓名" prop="userName">
            <a-input v-model="editForm.userName" placeholder="请输入姓名" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="证件号" prop="idNumber">
            <a-input v-model="editForm.idNumber" placeholder="请输入证件号" />
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="editCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="editConfirm">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>
<script>
import { GetDispatchPage, SelectDispatch, SaveDispatch, DeleteDispatch, UpdateDispatch, getDispatchRowDisabledDataApi } from "@/services/api.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { debounce } from 'lodash';
import cancelLoading from '@/mixin/cancelLoading';
import dayJs from 'dayjs';
import { formValidator } from "@/utils/clx-form-validator.js";
import teableSelected from "@/mixin/teableSelected.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading, teableSelected],
  data() {
    return {
      tableSpinning:false,
      dataMsg: undefined,
      tableRowKey: 'beUserId',
      formInline: {},
      preFormInline: {},
      // 表单验证
      formRules: {
        phone: [
          { required: false, validator: formValidator.texTphoneNumber, trigger: "blur" },
        ]
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: '姓名',
          dataIndex: 'userName',
          key: "userName"
        },
        {
          title: '所属组织',
          dataIndex: 'corporationName',
          key: "corporationName"
        },
        {
          title: '联系方式',
          dataIndex: 'phone',
          key: "phone"
        },
        {
          title: '证件号码',
          dataIndex: 'idNumber',
          key: "idNumber"
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
      detailVisible: false,
      formInlineDetail: {},
      preFormInlineDetail: {},
      // 表单验证
      detailRules: {
        phone: [
          { required: false, validator: formValidator.texTphoneNumber, trigger: "blur" },
        ]
      },
      pageDetail: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columnsDetail: [
        {
          title: '姓名',
          dataIndex: 'userName',
          key: "userName",
          width: 150,
          align: "center",
          ellipsis: true
        },
        {
          title: '联系方式',
          dataIndex: 'phone',
          key: "phone",
          width: 150,
          align: "center",
          ellipsis: true
        },
        {
          title: '证件号码',
          dataIndex: 'idNumber',
          key: "idNumber",
          width: 150,
          align: "center",
          ellipsis: true
        },
      ],
      tableDataListDetail: [],
      companyId: "",
      companyName: "",
      // 编辑
      editVisible: false,
      editMsg: {},
      editForm: {},
      editFormRules: {
        userName: [
          { required: false, validator: formValidator.texTiText, trigger: "blur" },
        ],
        idNumber: [
          { required: false, validator: formValidator.texTidCard, trigger: "blur" },
        ]
      },
      disabledSelUserIdArr: [],
    }
  },
  created() {
    this.initConfigPage()
    this.getDataList();
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.initConfigPage()
        this.iRest()
      }
    }, 20);
  },
  computed: {
    rowDisabled() {
      return {
        getCheckboxProps: record => ({
          props: {
            disabled: this.disabledSelUserIdArr.includes(record.beUserId),
          },
        }),
      };
    },
  },
  methods: {
    initConfigPage(){
      this.companyId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company.companyId;
      this.companyName = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company.companyName;
      this.dataMsg = this.$route.query;
      if (!this.dataMsg) {
        this.$router.push("/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/partnerList");
        return;
      }
    },
    // 已被派工列表
    getDataList() {
      this.tableSpinning = true
      return SelectDispatch({
        companyId: this.dataMsg.companyId,
        ...this.page,
        ...this.formInline
      }).then(res => {
        this.cancelLoading(100);
        this.tableDataList = res.data.list;
        this.page.total = res.data.total;
      }).catch(err => {
        console.log(err);
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    // 派工
    dispatchFn() {
      this.handleLoadingTwo()
      Promise.all([
        this.getDataListDetail(true),
        this.getDispatchRowDisabledDataFn(),
      ])
        .finally(() => {
          this.cancelLoadingTwo()
        })
    },
    // 获取已经派工的userId集合
    getDispatchRowDisabledDataFn() {
      let apiData = {
        corporationId: this.dataMsg.corporationId,
        beCompanyId: this.dataMsg.companyId,
      }
      return getDispatchRowDisabledDataApi(apiData)
        .then(res => {
          this.disabledSelUserIdArr = res.data || []
        })
        .catch(err => {

        })
    },
    // 查询
    iSearch() {
      this.formInline.time = dayJs(this.formInline.time).format('YYYY-MM-DD')
      this.preFormInline = { ...this.formInline };
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      // 获取列表
      this.getDataList()
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
      this.preFormInline = {};
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getDataList();
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
    },
    // 学习记录
    actionLook(record) {
      this.$router.push({ path: "/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/learn", query: { beUserId: record.beUserId, companyId: record.beCompanyId } });
    },
    // 删除派工
    actionDelete(record) {
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          return DeleteDispatch({ dispatchId: record.dispatchId })
            .then(res => {
              this.$antMessage.success("操作成功");
              this.getDataList();
            })
            .catch(err => { })
        },
      });
    },
    actionEdit(record) {
      this.editForm = {
        ...record
      };
      this.editVisible = true;
    },
    editCancle(record) {
      this.editVisible = false;
      this.editForm = {};
    },
    editConfirm(record) {
      if (!formValidator.formAll(this, 'editForm')) {
        return;
      }
      this.editVisible = false;
      UpdateDispatch({
        dispatchId: this.editForm.dispatchId,
        userName: this.editForm.userName,
        idNumber: this.editForm.idNumber
      }).then(res => {
        this.$antMessage.success("操作成功");
        this.page = {
          pageSize: 10,
          pageNo: 1,
          total: 0
        }
        this.getDataList();
      }).catch(err => {
        console.log(err);
      })
    },
    resetModalMsg(flag) {
      this.tableDataListDetail = [];
      this.pageDetail = {
        pageSize: 10,
        pageNo: 1,
        total: 0
      }
      if (flag) {
        this.formInlineDetail = {};
        this.preFormInlineDetail = {};
      }
    },
    detailCancle(record) {
      this.selectedRowKeys = []
      this.detailVisible = false;
      this.resetModalMsg(true);
      this.cancelLoadingThree()
    },
    detailConfirm(record) {
      if (this.selectedRowKeys.length == 0) {
        this.$antMessage.warn('请选择要派工的人')
        return
      }
      this.handleLoadingThree()
      let apiData = {
        dispatchJson: this.selectedRow,
        companyId: this.dataMsg.companyId,
        companyName: this.dataMsg.customerName,
        corporationId: this.dataMsg.corporationId,
        corporationName: this.dataMsg.corporationName,
      }
      SaveDispatch(apiData)
        .then(res => {
          this.$antMessage.success("操作成功");
          this.detailVisible = false;
          this.selectedRowKeys = []
          this.getDataList();
          this.resetModalMsg(true);
          this.cancelLoadingThree()
        })
        .catch(err => {
          console.log(err);
        })
    },
    // 获取人员列表
    getDataListDetail(flag) {
      return GetDispatchPage({
        pageSize: this.pageDetail.pageSize,
        pageNo: this.pageDetail.pageNo,
        beCompanyId: this.dataMsg.companyId,
        ...this.formInlineDetail
      }).then(res => {
        if (flag) {
          this.detailVisible = true;
        }
        this.cancelLoading(100);
        this.tableDataListDetail = res.data.list;
        this.pageDetail.total = res.data.total;
      }).catch(err => {
        console.log(err);
      })
    },
    // 查询
    iSearchDetail() {
      this.handleLoadingTwo()
      this.formInlineDetail.time = dayJs(this.formInlineDetail.time).format('YYYY-MM-DD')
      this.preFormInlineDetail = { ...this.formInlineDetail };
      this.pageDetail = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.selectedRowKeys = []
      // 获取列表
      this.getDataListDetail()
        .finally(() => {
          this.cancelLoadingTwo();
        })
    },
    // 重置
    iRestDetail: debounce(function () {
      this.selectedRowKeys = []
      this.resetModalMsg(true);
      this.getDataListDetail()
    }, 250, { leading: true, trailing: false }),
    // 页码改变
    pageNoChangeDetail(page) {
      this.pageDetail.pageNo = page;
      // 获取列表
      this.getDataListDetail();
    },
    onShowSizeChangeDetail(current, pageSize) {
      this.pageDetail.pageNo = 1;
      this.pageDetail.pageSize = pageSize;
      this.getDataListDetail();
    },
  }
}
</script>
<style lang="less" scoped>
.course-info {
  img {
    width: 160px;
    height: 120px;
  }
  p {
    line-height: 1;
    margin: 0;
    &:last-child {
      margin-top: 10px;
    }
  }
}
.course-msg {
  .lecturer-list {
    img {
      width: 100px;
      height: 100px;
      border: 1px solid #eee;
      border-radius: 50%;
    }
  }
}
</style>