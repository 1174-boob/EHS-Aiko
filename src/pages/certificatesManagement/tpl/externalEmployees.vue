<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" deptLabel="所属部门"></CommonSearchItem>
        <a-form-model-item label="姓名222">
          <a-input v-model="formInline.name" placeholder="请输入姓名"></a-input>
        </a-form-model-item>
        <a-form-model-item label="工号">
          <a-input v-model="formInline.workNum" placeholder="请输入工号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="手机号">
          <a-input v-model="formInline.phone" placeholder="请输入手机号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="岗位">
          <a-select allowClear show-search v-model="formInline.post" placeholder="请选择岗位">
            <a-select-option v-for="item in postOptions" :key="item.value" :value="item.value">{{item.label}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="体检日期">
          <a-range-picker format="YYYY-MM-DD"  v-model="formInline.checkDate" :placeholder="['开始日期','结束日期']"/>
        </a-form-model-item>
        <a-form-model-item label="体检类型">
          <a-select allowClear show-search v-model="formInline.checkType" placeholder="请选择体检类型">
            <a-select-option v-for="item in checkTypeOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="体检结论">
          <a-select allowClear show-search v-model="formInline.checkResult" placeholder="请选择体检结论" @change="handleCheckResultChange">
            <a-select-option v-for="item in checkResultOptions" :key="item.value" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <div class="pe-data-container">
      <h4 class="pe-data-title">{{peDate}}体检数据</h4>
      <div>
        <div @click="changeTab(0)" class="pe-data-item total-pe-num" :class="[curIndex === 0 ? 'active' : '']">
          <span class="pe-data-body">体检 {{countInfo.checkPersonNum}} 人</span>
          <p class="en-illus">health examination</p>
          <i></i>
        </div>
        <div @click="changeTab(2)" class="pe-data-item exception-pe-num" :class="[curIndex === 2 ? 'active' : '']">
          <span class="pe-data-body">体检异常 {{countInfo.checkExceptionNum}} 人</span>
          <p class="en-illus">Physical abnormalities</p>
          <i></i>
        </div>
        <div @click="changeTab(3)" class="pe-data-item forbid-pe-num" :class="[curIndex === 3 ? 'active' : '']">
          <span class="pe-data-body">禁忌人员 {{countInfo.checkTabooNum}} 人</span>
          <p class="en-illus">Taboo personnel</p>
          <i></i>
        </div>
      </div>
    </div>
    <DashBtn>
      <div>
        <a-button type="primary" size="small" @click="toDraftPage">草稿箱</a-button>
        <a-button type="primary" size="small" @click="toApprovePage">体检审核</a-button>
        <!-- <a-button type="primary" size="small" @click="toDraftPage">批量导出</a-button> -->
        <a-button type="primary" size="small" @click="toMultiPEBook">批量预约</a-button>
        <a-button type="primary" size="small" @click="multUpdateConclusion">批量更新体检结论</a-button>
        <a-button type="primary" size="small" @click="sendNotify">体检通知</a-button>
      </div>
      <div>
        <a-button type="primary" class="btn" @click="exportExcel">导出Excel</a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, selectedRows: choosedArr, onChange: onSelectChange, onSelectAll: onSelectAllSelect }" bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="checkType" slot-scope="record">{{ record.checkType | systemFilter('healthCheckType') }}</div>
        <div slot="checkResult" :class="[['normal', 'radiationWork'].includes(record.checkResult) ? 'pe-green' : 'pe-red']" slot-scope="record">{{ record.checkResult | systemFilter('checkResult') }}</div>
        <div slot="isSick" slot-scope="record">{{ record.isSick | systemFilter('universal') }}</div>
        <div slot="checkStatus" slot-scope="record">{{ record.checkStatus | systemFilter('checkStatus') }}</div>
        <div slot="tellStatus" slot-scope="record">{{ record.tellStatus | systemFilter('tellStatus') }}</div>
        <!-- <div slot="siteCode" slot-scope="record">{{ getSite(record.siteCode) }}</div> -->
        <div slot="corporationId" slot-scope="record">
          <span>{{getMappingValue($refs.commonSearchItem.commonAddOrgnizeList, "id", record.corporationId).orgName}}</span>
        </div>
        <div slot="post" slot-scope="record">{{ postLabel(record.post)}}</div>
        <div slot="checkFileData" slot-scope="record"><span class="link-span" @click="dowonloadFile(record.checkFileData)"> 体检报告 </span></div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="viewDetail(record)">详情</span>
          <span v-if="record.checkResult !== 'review'" class="color-0067cc cursor-pointer" @click="toBookPE(record)">预约体检</span>
          <span v-if="record.checkResult === 'review'" class="color-0067cc cursor-pointer" @click="toBookReCheck(record)">复查预约</span>
          <span v-if="record.tellStatus === 'tellErr'" class="color-0067cc cursor-pointer" @click="reSend(record)">重新发送</span>
        </div>
      </a-table>
    </CommonTable>
    <CommonModal title="批量更新体检结论" :visible="multUpdateConclutionVisible" :cancelFn="conclusionCancelFn">
      <template slot="form">
        <a-form-model ref="conclusionFormRef" :rules="conclusionFormRule" :label-col="{ style: { width: '115px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 115px)' } }" :model="conclusionForm" :colon="false">
          <a-form-model-item class="flex" label="是否构成职业病" prop="isSick">
            <a-select allowClear show-search v-model="conclusionForm.isSick" placeholder="请选择是否构成职业病">
              <a-select-option v-for="item in universalOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="体检结论" prop="checkResult">
            <a-select allowClear show-search v-model="conclusionForm.checkResult" placeholder="请选择体检结论">
              <a-select-option v-for="item in checkResultOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="conclusionCancelFn">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="confirmUpdate">确定</a-button>
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
      peDate: '',
      curIndex: -1,
      equipTypeList: [],
      userId: '',
      choosedArr: [],
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
        // {
        //   title: '所属部门',
        //   dataIndex: 'departmentName',
        //   width: 150
        // },
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
        // {
        //   title: '体检报告',
        //   scopedSlots: { customRender: 'checkFileData' },
        //   width: 150
        // },
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

      /**批量更新体检结论start */
      multUpdateConclutionVisible: false,
      conclusionForm: {
        isSick: undefined,
        checkResult: undefined
      },
      conclusionFormRule: {
        isSick: [
          { required: true, trigger: 'change', message: '请选择是否构成职业病'}
        ],
        checkResult: [
          { required: true, trigger: 'change', message: '请选择体检结论'}
        ]
      }
      /**批量更新体检结论end */
    }
  },
  created() {
    this.setRouterCode('physicalExam')
    this.columns.splice(1, 0, this.addCommonColumnItem(150, true));
    this.columns.splice(2, 0, this.addCommonColumnDepartment({
      title: "所属部门",
      width: 150
    }, true));
    this.init()
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
      this.getPeDate()
      this.getHealthNumCount()
    },
    async init() {
      this.getDataList()
      this.initConfigPage()
    },
    async getHealthNumCount() {
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
    getPeDate() {
      if (!this.formInline.checkDate || !this.formInline.checkDate.length) {
        this.peDate = new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月'
      } else {
        let startMonth = new Date(this.formInline.checkDate[0]).getMonth() + 1
        let startYear = new Date(this.formInline.checkDate[0]).getFullYear()
        let endMonth = new Date(this.formInline.checkDate[1]).getMonth() + 1
        let endYear = new Date(this.formInline.checkDate[1]).getFullYear()
        if (startMonth === endMonth) {
          this.peDate = startYear + '年' + startMonth + '月'
        } else {
          this.peDate = startYear + '年' + startMonth + '月' + ' - ' + endYear + '年' + endMonth + '月'
        }
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
      const { code, data } = await  healthManageList(params)
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
      this.choosedArr = []
      this.getDataList()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.choosedArr = selectedRows
    },
    onSelectAllSelect(selected, selectedRows, changeRows) {
      this.selectedRowKeys = selectedRows.map((item,index) => {
        return index
      }) || []
      this.choosedArr = selectedRows
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
    // 查询
    iSearch() {
      // 获取列表
      this.getPeDate()
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
    getSite(siteCode){
      return (this.corporationList.find(item => {
        return item.corporationId === siteCode
      }) || {}).orgAbbrName
    },
    viewDetail(row) {
      this.$router.push({
        path: '/occupationHealth/PEBookDetail',
        query: { id: row.checkId, personId: row.personId }
      })
    },
    toBookPE(row) {
      this.$router.push({
        path: '/occupationHealth/PEBook',
        query: { id: row.checkId, personId: row.personId }
      })
    },
    toMultiPEBook(row) {
      this.$router.push({
        path: '/occupationHealth/multiPEBook',
      })
    },
    toBookReCheck(row) {
      this.$router.push({
        path: '/occupationHealth/PERecheck',
        query: { id: row.checkId, personId: row.personId }
      })
    },
    multUpdateConclusion() {
      if (!this.choosedArr.length) {
        this.$antMessage.warning('请选择体检人员')
        return
      }
      this.multUpdateConclutionVisible = true
    },
    toDraftPage() {
      this.$router.push({
        path: '/occupationHealth/physicalExamDraftList'
      })
    },
    toApprovePage() {
      this.$router.push({
        path: '/occupationHealth/physicalExamApprove'
      })
    },
    async exportExcel() {
      const personIds = this.choosedArr.map(item => {
        return item.personId
      }) || []
      if (!personIds.length) {
        this.$antMessage.warning('请选择人员')
        return
      }
      let para = {
        ...this.formInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        checkDateStart: this.formInline.checkDate[0] || '',
        checkDateEnd: this.formInline.checkDate[1] || '',
        filterType: this.curIndex === -1 ? null : this.curIndex + 1,
        personIds: personIds
      }
      let res = await healthCheckExport(para)
      if(res){
        const name = '体检管理导出'
        const blob = new Blob([res],{ type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
        const downloadElement = document.createElement('a')
        const href = URL.createObjectURL(blob) //创建下载链接
        downloadElement.href = href
        downloadElement.download = name + '.xlsx'
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement)// 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      }
    },
    async sendNotify() {
      if (!this.choosedArr.length) {
        this.$antMessage.warning('请选择体检通知人员')
        return
      }
      const personIds = this.choosedArr.map(item => {
        return item.personId
      })
      let para = {
        personIds: personIds
      }
      const { code } = await notifyNotCheck(para)
      if (+code === 20000) {
        this.$antMessage.success('体检通知成功')
        this.getDataList()
      }
    },
    async reSend(row) {
      let para = {
        personId: row.personId
      }
      const { code, data } = await sendOneNotify(para)
      if (+code === 20000) {
        this.$antMessage.success('重新发送成功')
        this.getDataList()
      }
    },
    
    /**批量更新体检结论 start */
    conclusionCancelFn() {
      this.$refs.conclusionFormRef.resetFields()
      this.multUpdateConclutionVisible = false
    },
    handleCheckResultChange() {
      //更新体检结论时，体检tab查询重置
      this.curIndex = -1
    },
    dowonloadFile(file) {
      if (file && file.length) {
        file = file[0]
      }
      if (file && file.filePath) {
        window.location.href = file.filePath
      }
    },
    confirmUpdate: debounce(function(){
      this.$refs.conclusionFormRef.validate(async valid => {
        if (valid) {
          const personIds = this.choosedArr.map(item => {
            return item.personId
          })
          let para = {
            personIds: personIds,
            isSick: this.conclusionForm.isSick,
            checkResult: this.conclusionForm.checkResult
          }
          const { code, data } = await updateCheckResult(para)
          if (+code === 20000) {
            this.conclusionCancelFn()
            this.$antMessage.success('更新成功')
            this.getHealthNumCount()
            this.getDataList()
          }
        }
      })
    })
  }
}
</script>

<style lang="less" scoped>
.top-tittle{
  padding: 20px 0 30px 0;
  font-size: 20px;
  color: #000;
  font-weight: 400;
}
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
.pe-data-title{
  margin-bottom: 30px;
  padding-bottom:20px;
  font-size: 16px;
  color: rgba(0,0,0,0.85);
  line-height: 24px;
  font-weight: 500;
  border-bottom: 1px solid #f4f4f4;
}
.pe-data-body{
  margin-top: 15px;
}
.pre-test {
  /deep/ .ant-modal-wrap {
    z-index: 1001;
  }
}
</style>