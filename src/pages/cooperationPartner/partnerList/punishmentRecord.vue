<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>处罚记录</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline"></CommonSearchItem>
        <a-form-model-item label="处罚日期">
          <a-range-picker v-model="formInline.timeArr" class="search-range-picker" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" style="width: 200px" :placeholder="['起始时间', '结束时间']" />
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn v-if="!isHidden">
      <div>
        <a-button type="dashed" @click="addInstructor">新增处罚</a-button>
      </div>
    </DashBtn>

    <!--表格列表 -->
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="tableList">
        <vxe-column field="punishTime" :min-width="120" title="日期"></vxe-column>
        <vxe-column field="corporationId" :min-width="120" title="所属组织">
          <template #default="{ row }">
            <span>{{matchOrganizeName(row.corporationId)}}</span>
          </template>
        </vxe-column>
        <vxe-column field="punishInfo" :min-width="120" title="详情"></vxe-column>
        <vxe-column field="punishAmount" :min-width="120" title="处罚金额（元）"></vxe-column>
        <vxe-column field="action" fixed="right" title="操作" width="160">
          <template #default="{ row }">
            <div class="vex-table-btn">
              <span class="color-0067cc cursor-pointer m-r-15" @click="actionLook(row)">查看</span>
              <span class="color-0067cc cursor-pointer m-r-15" v-if="!isHidden" @click="actionEdit(row)">编辑</span>
              <span class="color-0067cc cursor-pointer" v-if="!isHidden" @click="actionDelete(row)">删除</span>
            </div>
          </template>
        </vxe-column>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </CommonTable>

    <CommonModal class="table-modal" title="查看供应商处罚记录" :visible="lookVisible" :cancelFn="lookCancle">
      <template slot="form">
        <a-form-model :label-col="{ style: { width: '98px' } }" :wrapper-col="{ style: { width: 'calc(100% - 98px)' } }" :colon="false" labelAlign="left">
          <CommonSearchItem
            :CommonFormInline="currentMsg"
            :notTablePage="true"
            :disabled="true"
            :labelCol="{ style: { width: '98px' } }"
            :wrapperCol="{ style: { width: 'calc(100% - 98px)' } }"
            :labelAlign="'left'"
          ></CommonSearchItem>
          <a-form-model-item class="flex modal-form-text" label="处罚日期">
            <div>{{currentMsg.punishTime}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex modal-form-text" label="处罚金额(元)">
            <div>{{currentMsg.punishAmount}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex modal-form-text" label="处罚依据">
            <div>{{currentMsg.punishBasis}}</div>
          </a-form-model-item>
          <a-form-model-item class="flex modal-form-text" label="违规人员列表">
            <CommonTable>
              <a-table
                :columns="columnsCheckedStaffLook"
                :scroll="{ x: 800 }"
                :locale="{emptyText: emptyText}"
                :data-source="tableDataListCheckedStaff"
                :rowKey="(record, index)=>{return index}"
                :pagination="false"
              >
                <div slot="action" slot-scope="record">
                  <span class="color-0067cc cursor-pointer" @click="actionDeleteCheckedStaff(record)">删除</span>
                </div>
              </a-table>
            </CommonTable>
          </a-form-model-item>
          <a-form-model-item class="flex modal-form-text" label="详情">
            <div>{{currentMsg.punishInfo}}</div>
          </a-form-model-item>
        </a-form-model>
      </template>
    </CommonModal>
    <CommonModal class="table-modal" :title="editText" :visible="editVisible" :cancelFn="editCancle">
      <template slot="form">
        <a-form-model
          ref="editForm"
          :model="editForm"
          :rules="editFormRules"
          :label-col="{ style: { width: '98px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 98px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <CommonSearchItem
            :CommonFormInline="editForm"
            :rules="editFormRules"
            :notTablePage="true"
            :labelCol="{ style: { width: '98px' } }"
            :wrapperCol="{ style: { width: 'calc(100% - 98px)' } }"
            :labelAlign="'left'"
          ></CommonSearchItem>
          <a-form-model-item class="flex" label="处罚日期" prop="punishTime">
            <a-date-picker v-model="editForm.punishTime" :disabled-date="disabledDate" format="YYYY-MM-DD" placeholder="请输入处罚日期" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="处罚金额" prop="punishAmount">
            <a-input-number
              :min="1"
              :default-value="0"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
              placeholder="请输入处罚金额"
              v-model="editForm.punishAmount"
            />
          </a-form-model-item>
          <a-form-model-item class="flex" label="处罚依据" prop="punishBasis">
            <a-input v-model="editForm.punishBasis" placeholder="请输入处罚依据" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="违规人员列表">
            <div>
              <DashBtn>
                <div>
                  <a-button type="dashed" @click="addStaff">添加人员</a-button>
                </div>
              </DashBtn>
              <CommonTable>
                <a-table
                  :columns="columnsCheckedStaff"
                  :scroll="{ x: 800 }"
                  :locale="{emptyText: emptyText}"
                  :data-source="tableDataListCheckedStaff"
                  :rowKey="(record, index)=>{return index}"
                  :pagination="false"
                >
                  <div slot="action" slot-scope="record">
                    <span class="color-0067cc cursor-pointer" @click="actionDeleteCheckedStaff(record)">删除</span>
                  </div>
                </a-table>
              </CommonTable>
            </div>
          </a-form-model-item>
          <a-form-model-item class="flex" label="详情" prop="punishInfo">
            <a-textarea placeholder="请输入详情" v-model="editForm.punishInfo" allowClear :maxLength="300" />
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="editCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" :loading="addLoading" @click="editConfirm">确定</a-button>
      </template>
    </CommonModal>

    <CommonModal class="table-modal" title="选择违规人员" :visible="detailVisible" :cancelFn="detailCancle">
      <div>
        <SearchTerm>
          <a-form-model layout="inline" :model="formInlineDetail" :colon="false">
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
              <a-button type="primary" :loading="loading" @click="iSearchDetail">查询</a-button>
              <a-button @click="iRestDetail">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>
        <CommonTable :page="pageDetail" :pageNoChange="pageNoChangeDetail" :showSizeChange="onShowSizeChangeDetail">
          <a-table
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columnsDetail"
            :scroll="{ x: 800 }"
            :locale="{emptyText: emptyText}"
            :data-source="tableDataListDetail"
            :rowKey="(record, index)=>{return index}"
            :pagination="false"
          ></a-table>
        </CommonTable>
      </div>
      <template slot="btn">
        <a-button @click="detailCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="detailConfirm">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { formValidator } from "@/utils/clx-form-validator.js";

import UploadCanRemove from "@/components/upload/uploadCanRemove.vue";

import moment from 'moment'
import dayJs from "dayjs";

import { debounce } from 'lodash';
import { cloneDeep } from 'lodash'
import { punishPageList, punishInsert, punishUpdate, punishDelete, GetDispatchList } from "@/services/api.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  components: {
    UploadCanRemove
  },
  data() {
    return {
      tableSpinning:false,
      addLoading: false,
      dataMsg: {},
      company: "",

      formInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      tableList: [],

      // 查看
      lookVisible: false,
      currentMsg: {},
      columnsCheckedStaffLook: [],

      // 新增+编辑
      editForm: {},
      editVisible: false,
      editText: "",
      // 表单验证
      editFormRules: {
        punishTime: [
          { required: true, message: "处罚日期不能为空", trigger: "change" },
        ],
        punishAmount: [
          { required: true, message: "处罚金额不能为空", trigger: "blur" },
        ],
        punishBasis: [
          { required: true, message: "处罚依据不能为空", trigger: "blur" },
        ],
        punishInfo: [
          { required: true, message: "详情不能为空", trigger: "blur" },
        ],
      },


      columnsCheckedStaff: [
        {
          title: '人员姓名',
          dataIndex: 'userName',
          align: "center",
          ellipsis: true
        },
        {
          title: '联系方式',
          dataIndex: 'phone',
          align: "center",
          ellipsis: true
        },
        {
          title: '身份证号',
          dataIndex: 'idNumber',
          align: "center",
          ellipsis: true
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          align: "center",
          ellipsis: true,
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      tableDataListCheckedStaff: [],

      detailVisible: false,
      formInlineDetail: {},
      preFormInlineDetail: {},
      tableDataListDetail: [],
      selectedRowKeys: [],
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
      isHidden: false
    }
  },
  created() {
    this.dataMsg = this.$route.query;
    this.columnsCheckedStaffLook = this.columnsCheckedStaff.slice(0, -1);
    console.log(this.columnsCheckedStaffLook);
    this.getTableList();
    console.log(this.dataMsg);
    this.isHidden = this.$route.query.isHidden;
    this.editForm = { corporationId: this.dataMsg.corporationId }
  },
  methods: {
    getTableList() {
      this.tableDataListCheckedStaff = [];
      let { timeArr } = this.formInline
      let apiData = {
        ...this.formInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        timeArr: undefined,
        startTime: timeArr && timeArr[0] ? dayJs(timeArr[0]).format("YYYY-MM-DD") : undefined,
        endTime: timeArr && timeArr[1] ? dayJs(timeArr[1]).format("YYYY-MM-DD") : undefined,
        ...this.dataMsg,
      }
      this.tableSpinning = true
      return punishPageList(apiData)
        .then((res) => {
          this.addLoading = false;
          let { list: tableList, total } = res.data ? res.data : { list: [], total: 0 };
          this.tableList = tableList || [];
          this.page.total = total;
          // 处理页码 问题
          if (this.tableList.length === 0 && (this.page.pageNo !== 1 && this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .finally(() => {
          this.tableSpinning = false
          this.cancelLoading();
        })
    },
    // 查询
    iSearch() {
      this.handleLoading();
      this.getTableList()
    },
    // 重置
    iRest: debounce(function () {
      this.formInline = {};
      this.getTableList()
    }, 250, { leading: true, trailing: false }),
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
    actionLook(record) {
      console.log(record);
      this.tableDataListCheckedStaff = record.violators && JSON.parse(record.violators);
      this.currentMsg = record;
      this.lookVisible = true;
    },
    actionEdit(record) {
      this.tableDataListCheckedStaff = record.violators && JSON.parse(record.violators);
      this.editText = "编辑";
      this.editForm = cloneDeep(record);
      this.editVisible = true;
    },
    actionDelete(record) {
      this.$antConfirm({
        title: '提示',
        content: '确认删除该条供应商处罚记录吗？',
        cancelText: '取消',
        onOk: () => {
          punishDelete({
            punishId: record.punishId,
          }).then(res => {
            this.$antMessage.success('删除成功');
            this.getTableList()
          }).catch(err => {
            console.log(err);
          })
        },
      });
    },
    editCancle() {
      this.editVisible = false;
      this.editForm = {
        punishTime: moment().format("YYYY-MM-DD")
      };
      this.tableDataListCheckedStaff = [];
    },
    editConfirm() {
      if (!formValidator.formAll(this, 'editForm')) {
        return;
      }
      let params = {
        ...this.editForm,
        punishTime: dayJs(this.editForm.punishTime).format('YYYY-MM-DD'),
        violators: JSON.stringify(this.tableDataListCheckedStaff),
        company: this.dataMsg.companyCode
      }
      let promiseFn = punishInsert;
      if (this.editText == "编辑") {
        promiseFn = punishUpdate;
      }
      console.log(params);
      console.log(this.tableDataListCheckedStaff);
      this.addLoading = true;
      promiseFn(params).then(() => {
        this.$antMessage.success(this.editText + "成功");
        this.editVisible = false;
        this.editForm = {
          punishTime: moment().format("YYYY-MM-DD")
        };
        this.getTableList();
      }).catch(err => console.log(err))
        .finally(() => {
          this.addLoading = false;
        })
    },

    lookCancle() {
      this.lookVisible = false;
      this.tableDataListCheckedStaff = [];
    },
    // 新增
    addInstructor() {
      this.editText = "新增";
      this.editForm = {
        punishTime: moment().format("YYYY-MM-DD")
      };
      this.editVisible = true;
    },
    // 添加人员
    addStaff() {
      console.log("添加人员");
      this.detailVisible = true;
      this.getDispatchList();
    },
    // 删除人员
    actionDeleteCheckedStaff(record) {
      console.log("删除人员")
      let ind;
      for (let i = 0; i < this.tableDataListCheckedStaff.length; i++) {
        if (this.tableDataListCheckedStaff[i].dispatchId == record.dispatchId) {
          ind = i;
          break;
        }
      }
      console.log(ind);
      if (ind != undefined) {
        this.tableDataListCheckedStaff.splice(ind, 1);
      }
    },
    resetModalMsg(flag) {
      this.tableDataListDetail = [];
      this.selectedRowKeys = [];
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
      this.detailVisible = false;
      this.resetModalMsg(true);
    },
    detailConfirm(record) {
      this.detailVisible = false;
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        let currentArr = this.tableDataListCheckedStaff.filter(item => { return item.dispatchId == this.tableDataListDetail[this.selectedRowKeys[i]].dispatchId })
        if (currentArr.length == 0) { // tableDataListCheckedStaff不存在时，push进去
          this.tableDataListCheckedStaff.push(this.tableDataListDetail[this.selectedRowKeys[i]]);
        }
      }
      this.selectedRowKeys = [];
    },
    // 获取已派工人员列表
    getDispatchList() {
      return GetDispatchList({
        companyId: this.dataMsg.companyCode,
        pageNo: this.pageDetail.pageNo,
        pageSize: this.pageDetail.pageSize,
        ...this.preFormInlineDetail
      }).then(res => {
        this.cancelLoading(100);
        this.tableDataListDetail = res.data.list;
        this.pageDetail.total = res.data.total;
      }).catch(err => {
        console.log(err);
      })
    },
    // 页码改变
    pageNoChangeDetail(page) {
      this.pageDetail.pageNo = page;
      this.selectedRowKeys = [];
      // 获取列表
      this.getDispatchList();
    },
    onShowSizeChangeDetail(current, pageSize) {
      this.pageDetail.pageNo = 1;
      this.pageDetail.pageSize = pageSize;
      this.selectedRowKeys = [];
      this.getDispatchList();
    },
    // 查询
    iSearchDetail() {
      this.preFormInlineDetail = { ...this.formInlineDetail };
      this.pageDetail = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      // 获取列表
      this.getDispatchList()
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 重置
    iRestDetail: debounce(function () {
      this.resetModalMsg(true);
      this.getDispatchList()
    }, 250, { leading: true, trailing: false }),
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    disabledDate(current) {
      return current && current > moment().endOf('day');
    }
  }
}
</script>
