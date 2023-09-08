<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" deptLabel="所属部门"></CommonSearchItem>
        <a-form-model-item label="证书类型">
          <a-select allowClear show-search v-model="formInline.checkType" placeholder="请选择体检类型">
            <a-select-option v-for="item in checkTypeOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="有效期限">
          <a-range-picker format="YYYY-MM-DD"  v-model="formInline.checkDate" :placeholder="['开始日期','结束日期']"/>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <div class="pe-data-container">
      <!-- <h4 class="pe-data-title">{{peDate}}体检数据</h4>   可以用来做消息设置里面的内/外部人员 -->
      <div>
        <div @click="changeTab(0)" class="pe-data-item total-pe-num" :class="[curIndex === 0 ? 'active' : '']">
          <span class="pe-data-body">证书总数 {{countInfo.checkPersonNum}} 张</span>
          <p class="en-illus">certificate total quantity</p>
          <i></i>
        </div>
        <div @click="changeTab(1)" class="pe-data-item exception-pe-num" :class="[curIndex === 1 ? 'active' : '']">
          <span class="pe-data-body">到期前{{countInfo.checkExceptionNum}}个{{countInfo.checkExceptionNum}} {{countInfo.checkExceptionNum}} 张</span>
          <p class="en-illus">before expiration</p>
          <i></i>
        </div>
        <div @click="changeTab(2)" class="pe-data-item forbid-pe-num" :class="[curIndex === 2 ? 'active' : '']">
          <span class="pe-data-body">证书已过期 {{countInfo.checkTabooNum}} 张</span>
          <p class="en-illus">expired certificate</p>
          <i></i>
        </div>
      </div>
    </div>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="addCertificate"><a-icon type="plus"/>新增</a-button>
        <a-button type="primary" @click="batchImport">批量导入</a-button>
        <a-button type="primary" @click="toMessageSettings">消息设置</a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="checkType" slot-scope="record">{{ record.checkType | systemFilter('healthCheckType') }}</div>
        <div slot="checkResult" :class="[['normal', 'radiationWork'].includes(record.checkResult) ? 'pe-green' : 'pe-red']" slot-scope="record">{{ record.checkResult | systemFilter('checkResult') }}</div>
        <div slot="isSick" slot-scope="record">{{ record.isSick | systemFilter('universal') }}</div>
        <div slot="checkStatus" slot-scope="record">{{ record.checkStatus | systemFilter('checkStatus') }}</div>
        <div slot="tellStatus" slot-scope="record">{{ record.tellStatus | systemFilter('tellStatus') }}</div>

        <div slot="post" slot-scope="record">{{ postLabel(record.post)}}</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="viewDetail(record)">详情</span>
          <span v-if="record.checkResult !== 'review'" class="color-0067cc cursor-pointer" @click="toBookPE(record)">预约体检</span>
          <span v-if="record.checkResult === 'review'" class="color-0067cc cursor-pointer" @click="toBookReCheck(record)">复查预约</span>
          <span v-if="record.tellStatus === 'tellErr'" class="color-0067cc cursor-pointer" @click="reSend(record)">重新发送</span>
        </div>
      </a-table>
    </CommonTable>
    <!-- 新增编辑证书弹框 -->
    <CommonModal :title="editText" :visible="editVisible" :cancelFn="editCancle">
      <template slot="form">
        <a-form-model
          ref="editForm"
          :model="editForm"
          :rules="editFormRules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :colon="false"
          labelAlign="left"
        >
          <CommonSearchItem
            ref="commonSearchItem1"
            :CommonFormInline="editForm"
            :rules="editFormRules"
            :notTablePage="true"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            labelAlign="left"
            :hasDepartment="true"
          ></CommonSearchItem>
           <!-- @corporationDeptChange="corporationDeptChange"
                @departmentChange="departmentChange"
            -->
          <a-form-model-item class="flex" label="排班名称" prop="planName">
            <a-input :maxLength="50" v-model="editForm.planName" placeholder="请输入排班名称"></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="值班日期" prop="planDate">
            <a-range-picker v-model="editForm.planDate" change="dataChange" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="班次" prop="classesIdT">
            <a-select v-model="editForm.classesIdT" placeholder="请选择">
              <a-select-option
                v-for="item in classesList"
                :key="item.classesId"
                :value="item.classesId"
                >{{
                  `${item.classesName}（${item.startTime}-${item.endTime}）`
                }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
          <StaffOrDept
            :treeType="'user'"
            :propKey="'dutyUserIdList'"
            :treeRoles="editFormRules"
            :labelTitle="'持证人'"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            @getTreeData="personThingOne"
            :checkedTreeNode="editForm.dutyUserIdList"
            :deptTreeId="editForm.deptId"
          />
          <a-form-model-item class="flex" label="备注">
            <a-textarea
              :maxLength="50"
              v-model="editForm.remark"
              placeholder="请输入"
            ></a-textarea>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="editCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="editConfirm"
          >确定</a-button
        >
      </template>
    </CommonModal>
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis"
import cancelLoading from '@/mixin/cancelLoading'
import { formValidator } from "@/utils/clx-form-validator.js"
import { mapState } from 'vuex'
import dayJs from "dayjs"
import moment from 'moment'
import uploadCanRemove from "@/mixin/uploadCanRemove"
import { debounce, cloneDeep } from 'lodash'
import { healthManageList, healthNumCount, updateCheckResult, notifyNotCheck, sendOneNotify, healthCheckExport, feathJobPosition } from "@/services/api.js"
import optionsMixin from '@/pages/occupationHealth/physicalExam/mixin/optionsMixin'
import postOptionsMixin from '@/pages/occupationHealth/physicalExam/mixin/postOptions'

export default {
  mixins: [teableCenterEllipsis, cancelLoading, optionsMixin, postOptionsMixin],
  components: { },
  data() {
    return {
      formInline: {
        checkDate: []
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      editText: "新增",
      // 表单验证
      editFormRules: {
        corporationId: [
          { required: true, message: "组织不能为空", trigger: "change" },
        ],
        deptId: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        planDate: [
          { required: true, message: "值班日期不能为空", trigger: "change" },
        ],
        classesIdT: [
          { required: true, message: "班次不能为空", trigger: "change" },
        ],
        dutyUserIdList: [
          { required: true, message: "值班员不能为空", trigger: "change" },
        ],
        planName: [
          { required: true, message: "排班名称不能为空", trigger: "change" },
        ],
      },
      peDate: '',
      curIndex: -1,
      selectedRowKeys: [],
      countInfo: {
        checkPersonNum: '',
        checkQualifiedNum: '',
        checkExceptionNum: '',
        checkTabooNum: ''
      },
      tableSpinning: false,
      columns:  [
        {
          title: '姓名',
          dataIndex: 'name',
          width: 150
        },{
          title: '工号',
          dataIndex: 'workNum',
          width: 150
        },{
          title: '手机号码',
          dataIndex: 'phone',
          width: 150
        },
        {
          title: '岗位',
          scopedSlots: { customRender: 'post' },
          width: 150
        },{
          title: '体检日期',
          dataIndex: 'checkDate',
          width: 150
        },{
          title: '体检类型',
          scopedSlots: { customRender: 'checkType' },
          width: 150
        },{
          title: '体检状态',
          scopedSlots: { customRender: 'checkStatus' },
          width: 150
        },{
          title: '体检提醒日期',
          dataIndex: 'tellDate',
          width: 150
        },{
          title: '体检通知状态',
          scopedSlots: { customRender: 'tellStatus' },
          width: 150
        },{
          title: '是否构成职业病',
          scopedSlots: { customRender: 'isSick' },
          width: 150
        },
        {
          title: '体检结论',
          scopedSlots: { customRender: 'checkResult' },
          width: 150
        },{
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 300 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],

    }
  },
  created() {
    // this.setRouterCode('physicalExam')
    this.columns.splice(1, 0, this.addCommonColumnItem(150, true));
    this.columns.splice(2, 0, this.addCommonColumnDepartment({
      title: "所属部门",
      width: 150
    }, true));
    this.init()
  },
  methods: {
    async init() {
      this.getDataList()
      this.getHealthNumCount()
    },
    async getHealthNumCount(){
      let params1 = {
        ...this.formInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        checkDateStart: this.formInline.checkDate[0] || '',
        checkDateEnd: this.formInline.checkDate[1] || '',
        filterType: this.curIndex === -1 ? null : this.curIndex + 1,
      }
      const {code, data } = await healthNumCount(params1)
      if (+code === 20000) {
        this.countInfo = data
      }
    },
    async getDataList() {
      let checkDateStart = this.formInline.checkDate[0] ? moment(this.formInline.checkDate[0]).format('YYYY-MM-DD') : ''
      let checkDateEnd = this.formInline.checkDate[1] ? moment(this.formInline.checkDate[1]).format('YYYY-MM-DD') : ''
      let params = {
        ...this.formInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        checkDateStart: checkDateStart,
        checkDateEnd: checkDateEnd,
        filterType: this.curIndex === -1 ? null : this.curIndex + 1
      }
      this.tableSpinning = true
      const { code, data } = await healthManageList(params)
      this.tableSpinning = false
      if (+code === 20000 && data) {
        this.tableDataList = data.list
        this.page.total = data.total
      }
    },
    changeTab(tabIndex) {
      this.curIndex = this.curIndex === tabIndex ? -1 : tabIndex
      this.page.pageNo = 1
      this.selectedRowKeys = []
      this.getDataList()
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page
      this.choosedArr = []
      this.selectedRowKeys = []
      // 获取列表
      this.getDataList()
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1
      this.page.pageSize = pageSize
      this.getDataList()
    },
    // //新增排班部门修改-清空人员组件
    // departmentChange() {
    //   this.editForm.dutyUserIdList = [];
    // },

    // //所属组织改变
    // corporationDeptChange() {
    //   if (this.editForm.corporationId) {
    //     this.getClassesListNoPage(); //获取班次列表
    //   }
    //   //清空班次
    //   this.$set(this.editForm, "classesId", undefined);
    //   this.classesList = [];
    // },
    // 查询
    iSearch() {
      // 获取列表
      this.page.pageNo = 1
      this.getDataList(this.formInline)
        .finally(() => {
          this.cancelLoading()
        })
      this.selectedRowKeys = []
      this.choosedArr = []
      this.getHealthNumCount()
    },
    // 重置
    iRest: debounce(function () {
      this.$refs.commonSearchItem.reset()
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
        checkDate: []
      }
      this.selectedRowKeys = []
      this.choosedArr = []
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    format(val) {
      return moment(val).format('YYYY-MM-DD')
    },
    // 批量导入
    batchImport() {
      
    },
    // 新增
    addCertificate() {

    
      this.getDataList()
    },
    // 跳转到消息设置页面
    toMessageSettings() {
      this.$router.push({
        path: '/ehsGerneralManage/securityArchiveManagement/employeesMessagesSet'
      })
    },
  }
}
</script>

<style lang="less" scoped>

.pe-data-item{
  display: inline-block;
  width:224px;
  height: 64px;
  cursor: pointer;
  position: relative;
  background: rgba(250,250,250,0.50);
  border: 1px solid rgba(244,244,244,1);
  border-radius: 4px;
  padding-left:30px;
  & +.pe-data-item{
    margin-left: 20px;
  }
  &.active{
    background:#fff;
  }
  i {
    position: absolute;
    display: inline-block;
    background-color: #333;
    -webkit-mask-image: url(~@/assets/images/data-icon.svg);
    mask-image: url(~@/assets/images/data-icon.svg);
    width:14px;
    top:34px;
    right: 30px;
    height: 14px;
  }
}
.link-span{
  cursor: pointer;
  color:#02A7F0;
}
.total-pe-num{
  &.active{
    border: 1px solid rgba(0,103,204,1);
    box-shadow: 0px 0px 10px 0px rgba(0,103,204,0.1);
    .pe-data-body{
      color: #0067CC;
    }
    .en-illus{
      color: #0067CC;
    }
    i {
      background-color: rgba(0,103,204,1);
    }
  }
}
.exception-pe-num{
  &.active{
    border: 1px solid rgba(255,157,1,1);
    box-shadow: 0px 0px 10px 0px rgba(255,157,1,0.1);
    .pe-data-body,.en-illus{
      color: #FF9D01;
    }
    i {
      background-color:rgba(255,157,1,1);
    }
  }
}
.forbid-pe-num{
  &.active{
    border: 1px solid rgba(255,18,18,1);
    box-shadow: 0px 0px 10px 0px rgba(255,18,18,0.1);
    .pe-data-body,.en-illus{
      color: #FF1212;
    }
    i {
      background-color:rgba(255,18,18,1);
    }
  }
}
.pe-data-container{
  margin-bottom:30px;
  .pe-data-body{
    display: inline-block;
    font-size: 14px;
    color: #333333;
  }
  .en-illus{
    opacity: 0.5;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #333333;
    line-height: 12px;
    font-weight: 400;
    margin-top:10px;
  }
}
.pe-green{
  color: #02DFAD;
}
.pe-red{
  color:#FF1212;
}
// .pe-data-title{
//   margin-bottom: 30px;
//   padding-bottom:20px;
//   font-size: 16px;
//   color: rgba(0,0,0,0.85);
//   line-height: 24px;
//   font-weight: 500;
//   border-bottom: 1px solid #f4f4f4;
// }
.pe-data-body{
  margin-top: 15px;
}
.pre-test {
  /deep/ .ant-modal-wrap {
    z-index: 1001;
  }
}
</style>