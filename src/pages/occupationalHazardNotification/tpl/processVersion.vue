<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" deptLabel="所属部门"></CommonSearchItem>
        <a-form-model-item label="签署人">
          <a-input v-model="formInline.signatureUserJobNumberOrName" placeholder="请输入签署人"></a-input>
        </a-form-model-item>
        <a-form-model-item label="签署状态">
          <a-select allowClear show-search v-model="formInline.signatureStatus" placeholder="请选择状态">
            <a-select-option v-for="item in dictionary('signatureStatus')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="入职日期">
          <a-range-picker format="YYYY-MM-DD" v-model="formInline.entryDate" :placeholder="['开始日期','结束日期']"/>
        </a-form-model-item>
        <a-form-model-item label="签署日期">
          <a-range-picker format="YYYY-MM-DD" v-model="formInline.signatureFinalDate" :placeholder="['开始日期','结束日期']"/>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <div class="pe-data-container">
      <h4 class="pe-data-title">{{peDate}}数据</h4>
      <div>
        <div @click="changeTab(0)" class="pe-data-item total-pe-num" :class="[curIndex === 0 ? 'active' : '']">
          <span class="pe-data-body">总数 {{countInfo.total==0? '0':countInfo.total}} 份</span>
          <p class="en-illus">total quantity</p>
          <i></i>
        </div>
        <div @click="changeTab(1)" class="pe-data-item forbid-pe-num" :class="[curIndex === 1 ? 'active' : '']">
          <span class="pe-data-body">签署完成 {{countInfo.signingComplete}} 份</span>
          <p class="en-illus">sign off</p>
          <i></i>
        </div>
        <div @click="changeTab(2)" class="pe-data-item exception-pe-num" :class="[curIndex === 2 ? 'active' : '']">
          <span class="pe-data-body">待签署 {{countInfo.toBeSigned}} 份</span>
          <p class="en-illus">to be signed</p>
          <i></i>
        </div>
      </div>
    </div>
    <DashBtn>
      <div>
        <a-button type="primary" @click="importPersonnel">导入人员</a-button>
        <a-button type="primary" @click="batchPush">批量推送</a-button>
        <a-button type="primary" @click="batchExport">批量导出</a-button>
        <UploadBtnStyle
          :showAcceptText="false"
          :accept="['.pdf',]"
          :showUploadList="false"
          :btnText="'导入文件'"
          :btnType="'primary'"
          :btnIcon="false"
          @handleSuccess="handleSuccess"
        ></UploadBtnStyle>
        <a-button style="margin-left:10px;" type="primary" @click="downloadArchive">下载归档</a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, selectedRows: choosedArr, onChange: onSelectChange, onSelectAll: onSelectAllSelect }" bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return record.id}" :pagination="false">
        <div slot="num" slot-scope="record">{{ record.num }}</div>
        <div slot="templateTypeName" slot-scope="record">{{ record.templateTypeName }}</div>
        <div slot="templateClassificationName" slot-scope="record">{{ record.templateClassificationName }}</div>
        <div slot="jobName" slot-scope="record">{{ record.jobName }}</div>
        <div slot="signatureUserName" slot-scope="record">{{ record.signatureUserName }}/{{ record.signatureUserJobNumber }}</div>
        <div slot="occupationalHazardName" slot-scope="record">{{ record.occupationalHazardName }}</div>
        <div slot="launchUserName" slot-scope="record">{{ record.launchUserName }}/{{ record.launchUserJobNumber }}</div>
        <div slot="signatureStatus" slot-scope="record">{{ record.signatureStatus }}</div>
        <div slot="entryDate" slot-scope="record">{{ record.entryDate }}</div>
        <div slot="signatureRecordList" slot-scope="record">{{ record.signatureRecordList }}</div>
        <div slot="signatureFinalDate" slot-scope="record">{{ record.signatureFinalDate }}</div>
        <div slot="action" slot-scope="record">
          <!-- <span class="color-0067cc cursor-pointer" v-if="record.signatureStatus == 1 " @click="signFile(record)">签署</span> -->
          <span class="color-0067cc cursor-pointer" v-if="record.signatureStatus == 1 && record.signatoriesHandlerUserId == userId" @click="signFile(record)">签署</span>
          <span class="color-0067cc cursor-pointer" v-if="record.signatureStatus == 0" @click="pushFile(record)">推送</span>
          <span class="color-0067cc cursor-pointer" @click="viewFile(record)">预览</span>
          <span class="color-ff4d4f cursor-pointer" @click="reSend(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
    <!-- 上传 -->
    <Upload :importVisible="importVisible" @closeAddVisible="closeAddVisible" :pushStatus='pushStatus' :type="type"/>
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis"
import cancelLoading from '@/mixin/cancelLoading'
import { formValidator } from "@/utils/clx-form-validator.js"
import { mapState } from 'vuex'
import Upload from '@/pages/occupationalHazardNotification/tpl/components/uploadImport.vue'
import dayJs from "dayjs"
import dictionary from "@/utils/dictionary";
import moment from 'moment'
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import { debounce, cloneDeep } from 'lodash'
import serviceNameList from '@/config/default/service.config.js'
import {getNotificationCount, getNotificationList, pushNotification, notificationDelete, notificationImportSignPDF, certificateDetail} from "@/services/api.js"
import optionsMixin from '@/pages/occupationHealth/physicalExam/mixin/optionsMixin'
import postOptionsMixin from '@/pages/occupationHealth/physicalExam/mixin/postOptions'

export default {
  mixins: [teableCenterEllipsis, cancelLoading, optionsMixin, postOptionsMixin],
  components: { Upload,UploadBtnStyle},
  data() {
    return {
      dictionary,
      formInline: {
        entryDateStart: undefined,
        entryDateEnd: undefined,
        entryDate: [],
        signatureFinalDateStart: undefined,
        signatureFinalDateEnd: undefined,
        signatureFinalDate: []
      },
      choosedArr: [],
      selectedRowKeys: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      pushStatus: 1,
      peDate: '',
      curIndex: -1,
      signatureStatus2:'',
      importVisible: false,
      type: 0,
      countInfo: {
        total: '', //总数
        signingComplete: '', //签署成功
        toBeSigned: '', //待签署
      },
      tableSpinning: false,
      columns:  [
        {
          title: '编号',
          scopedSlots: { customRender: 'num' },
          width: 200
        },
        {
          title: '模板名称',
          scopedSlots: { customRender: 'templateTypeName' },
          width: 180
        },
        {
          title: '模板分类',
          scopedSlots: { customRender: 'templateClassificationName' },
          width: 180
        },
        {
          title: '岗位',
          scopedSlots: { customRender: 'jobName' },
          width: 180
        },
        {
          title: '签署人',
          scopedSlots: { customRender: 'signatureUserName' },
          width: 150
        },
        {
          title: '危害因素',
          scopedSlots: { customRender: 'occupationalHazardName' },
          width: 180
        },
        {
          title: '发起人',
          scopedSlots: { customRender: 'launchUserName' },
          width: 150
        },
        {
          title: '签署状态',
          dataIndex: 'signatureStatus',
          width: 150,
          customRender: (text) => {
            text = text ? this.getNumStatus(text) : ''
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
          title: '入职日期',
          dataIndex: 'entryDate',
          width: 150,
          customRender: (text) => {
            text = text ? text: '--'
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
          title: '签署记录',
          dataIndex:'securitySignRecordList',
          customRender: (text) => {
            if (!text) {
              return '--';
            }
            text = text ? text[0] : '--';
            const signatoriesJobNumber = text && text.signatoriesJobNumber ? text.signatoriesJobNumber : '--';
            const signatoriesName = text && text.signatoriesName ? text.signatoriesName : '--';
            const signatoriesTime = text && text.signatoriesTime ? text.signatoriesTime.split(' ')[0] : '--';
            return (
              <a-popover autoAdjustOverflow title="签署人">
                <div slot="content">
                  本人签署：<p>{signatoriesName}/{signatoriesJobNumber}&nbsp;&nbsp;&nbsp;{signatoriesTime}</p> 
                </div>
                <span>查看记录</span>
              </a-popover>
            );
          },
          width: 150,
        },
        {
          title: '签署完成日期',
          dataIndex: 'signatureFinalDate',
          width: 150,
          customRender: (text) => {
            text = text ? text: '--'
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
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
      userId: undefined
    }
  },
  created() {
    this.columns.splice(1, 0, this.addCommonColumnItem(150, true));
    this.columns.splice(2, 0, this.addCommonColumnDepartment({
      title: "所属部门",
      width: 150
    }, true));
    this.init()
    let zconsole_userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
    this.userId = zconsole_userInfo.user.userId
  },
  activated(){
    if(this.$route.query.activeKey == 2){
      this.init()
    }
  },
  methods: {
    async init() {
      this.getDataList()
      this.getCertCount()
      this.getPeDate()
    },
    // 导入成功
    handleSuccess(fileList) {
      console.log('导入文件',fileList);
      if (fileList.length > 0) {
        const fileId = fileList[fileList.length - 1].id;
        console.log('fileId ', fileId);
        notificationImportSignPDF({ fileId, securityOccupationalHazardNotificationType: 2 })
        .then((res) => {
          if (res.code === 20000) {
            this.$antMessage.success('导入成功');
            this.getDataList()
            this.getCertCount()
          }
        })
        .catch((err) => {
          console.log(err);
        });
      }
      this.getDataList()
    },
    // 获取到那三个格子的详情数据
    async getCertCount(){
      let params1 = {
        ...this.formInline,
        signatureStatus2:this.signatureStatus2,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        signatureFinalDateStart :this.formInline.signatureFinalDate[0] ? moment(this.formInline.signatureFinalDate[0]).format('YYYY-MM-DD') : '',
        signatureFinalDateEnd :this.formInline.signatureFinalDate[1] ? moment(this.formInline.signatureFinalDate[1]).format('YYYY-MM-DD') : '',
        entryDateStart :this.formInline.entryDate[0] ? moment(this.formInline.entryDate[0]).format('YYYY-MM-DD') : '',
        entryDateEnd :this.formInline.entryDate[1] ? moment(this.formInline.entryDate[1]).format('YYYY-MM-DD') : '',
        securityOccupationalHazardNotificationType: "2" 
      }
      const {code, data } = await getNotificationCount(params1)
      if (+code === 20000) {
        this.countInfo = data
      }
    },
    getPeDate() {
      if (!this.formInline.entryDate || !this.formInline.entryDate.length) {
        this.peDate = new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月'
      } else {
        let startMonth = new Date(this.formInline.entryDate[0]).getMonth() + 1
        let startYear = new Date(this.formInline.entryDate[0]).getFullYear()
        let endMonth = new Date(this.formInline.entryDate[1]).getMonth() + 1
        let endYear = new Date(this.formInline.entryDate[1]).getFullYear()
        if (startMonth === endMonth) {
          this.peDate = startYear + '年' + startMonth + '月'
        } else {
          this.peDate = startYear + '年' + startMonth + '月' + ' - ' + endYear + '年' + endMonth + '月'
        }
      }
    },
    async getDataList() {
      let entryDateStart = this.formInline.entryDate[0] ? moment(this.formInline.entryDate[0]).format('YYYY-MM-DD') : ''
      let entryDateEnd = this.formInline.entryDate[1] ? moment(this.formInline.entryDate[1]).format('YYYY-MM-DD') : ''
      let signatureFinalDateStart = this.formInline.signatureFinalDate[0] ? moment(this.formInline.signatureFinalDate[0]).format('YYYY-MM-DD') : ''
      let signatureFinalDateEnd = this.formInline.signatureFinalDate[1] ? moment(this.formInline.signatureFinalDate[1]).format('YYYY-MM-DD') : ''
      let params = {
        securityOccupationalHazardNotificationType:2,
        ...this.formInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        entryDateStart: entryDateStart,
        entryDateEnd: entryDateEnd,
        signatureFinalDateStart: signatureFinalDateStart,
        signatureFinalDateEnd: signatureFinalDateEnd,
        signatureStatus2:this.signatureStatus2
      }
      this.tableSpinning = true
      const { code, data } = await getNotificationList(params)
      this.tableSpinning = false
      if (+code === 20000 && data) {
        this.tableDataList = data.list
        this.page.total = data.total
      }
    },
    changeTab(tabIndex) {
      this.curIndex = this.curIndex === tabIndex ? -1 : tabIndex
      if (tabIndex == 0){
        this.signatureStatus2 = ''
      } else if (tabIndex == 1) {
        this.signatureStatus2 = '3'
      } else if (tabIndex == 2) {
        this.signatureStatus2 = '1'
      }
      this.page.pageNo = 1
      this.selectedRowKeys = []
      this.choosedArr = []
      this.getDataList()
    },
    // 批量推送
    async batchPush() {
      console.log(this.choosedArr);
      if (!this.choosedArr.length) {
        this.$antMessage.warning('请选择推送人员！')
        return
      }
      if (this.choosedArr.every(item => item.signatureStatus == 0 || item.signatureStatus == 1)) {
        const personIds = this.choosedArr.map(item => {
          return item.id
        })
        let para = {
          idList: personIds
        }
        const { code } = await pushNotification(para)
        if (+code === 20000) {
          this.$antMessage.success('批量推送成功')
          this.selectedRowKeys = []
          this.choosedArr = []
          this.getDataList()
          this.getCertCount()
        }
      } else {
        this.$antMessage.warning('请正确选择推送人员！')
        return;
      }
    },
    // 批量下载
    async batchExport() {
      console.log('批量下载',this.choosedArr);
      if (!this.choosedArr.length) {
        this.$antMessage.warning('至少选择一条数据！')
        return
      }
      if (this.choosedArr.every(item => item.signatureStatus == 2)) {
          this.choosedArr.forEach(item => {
          window.open(item.file.filePath);
        })
        this.choosedArr = []
      } else {
        this.$antMessage.warning('请下载员工已签署的文件！')
        return;
      }
    },
    async downloadArchive() {
      console.log('批量下载',this.choosedArr);
      if (!this.canClickBtnMixin("downloadArchiveBtn")) {
        return;
      }
      if (!this.choosedArr.length) {
        this.$antMessage.warning('至少选择一条数据！')
        return
      }
      if (this.choosedArr.every(item => item.signatureStatus == 3)) {
          this.choosedArr.forEach(item => {
          window.open(item.file.filePath);
        })
        this.choosedArr = []
      } else {
        this.$antMessage.warning('请下载员工签署完成的文件！')
        return;
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.choosedArr = selectedRows
      console.log('selectedRowKeys111',selectedRowKeys,'selectedRows222',selectedRows);
    },
    onSelectAllSelect(selected, selectedRows, changeRows) {
      this.selectedRowKeys = selectedRows.map((item,index) => {
        return item.id
      }) || []
      this.choosedArr = selectedRows
    },
    // 根据列表签署状态转为文字
    getNumStatus(num){
      if(num == '0'){
        return '待推送'
      } else if(num == '1'){
        return '待签署'
      } else if(num == '2'){
        return '已签署'
      } else if(num == '3'){
        return '签署完成'
      }
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
      this.getPeDate()
      // 获取列表
      this.page.pageNo = 1
      this.getDataList(this.formInline)
        .finally(() => {
          this.cancelLoading()
        })
      this.selectedRowKeys = []
      this.choosedArr = []
      this.getCertCount()
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
        entryDate: [],
        signatureFinalDate: [],
      }
      this.signatureStatus2 = ''
      this.curIndex = -1
      this.selectedRowKeys = []
      this.choosedArr = []
      this.getDataList()
      this.getCertCount()
      this.getPeDate()
    }, 250, { leading: true, trailing: false }),
    format(val) {
      return moment(val).format('YYYY-MM-DD')
    },
    // 导入人员-打开弹框
    importPersonnel() {
      this.importVisible = true
      this.type = 2
      this.pushStatus = 1
    },
    //关闭批量导入弹窗
    closeAddVisible(flag) {
      if (flag) {
        this.formInline = {
          entryDateStart: undefined,
          entryDateEnd: undefined,
          entryDate: [],
          signatureFinalDateStart: undefined,
          signatureFinalDateEnd: undefined,
          signatureFinalDate: []
        },
        this.getDataList();
        this.getCertCount()
      }
      this.importVisible = false;
      this.type = 0
      this.pushStatus = 1
    },
    // 处理文件id
    handleFileIdS(list) {
      list = list ? list : []
      let ids = list.map(item => {
        return item.id
      })
      ids = ids ? ids : []
      return ids
    },
    // 处理文件回显
    handleFileRedisplay(list) {
      // console.log(888,list);
      list = list ? list : []
      let fileList = []
      list.forEach(item => {
        let itemObj = {
          id: item.id,
          uid: item.id,
          name: item.sourceFileName,
          status: 'done',
          url: item.filePath,
        }
        fileList.push(itemObj)
      })
      return fileList
    },
    // 签署
    signFile(row){
      if (!this.canClickBtnMixin("hazardNoticeSign")) {
        return;
      }
      let query = {
        id: row.id,
        activeKey:'2'
      }
      this.$router.push({
        path: '/ehsGerneralManage/securityArchiveManagement/occupationalPreview',
        query
      })
    },
    // 预览
    viewFile(row){
      if (!this.canClickBtnMixin("hazardNoticePreview")) {
        return;
      }
      let query = {
        id: row.id,
        filePreview: true,
        activeKey:'2'
      }
      this.$router.push({
        path: '/ehsGerneralManage/securityArchiveManagement/occupationalPreview',
        query,
      })
    },
    // 推送
    pushFile(row){
      let para = {
        idList: [row.id]
      }
      pushNotification(para)
      .then((res) =>{
        if(res.code == 20000){
          this.$antMessage.success('推送成功')
          this.getDataList()
          this.getCertCount()
        }
      })
    },
    // 删除
    reSend(row){
      this.$antConfirm({
        title: '确认删除？',
        onOk: async () => {
          let para = {
           id:row.id
          }
          await notificationDelete(para)
          this.$antMessage.success('删除成功')
          this.getDataList()
          this.getCertCount()
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>

::v-deep .dashed-btn{
  .ant-btn-primary {
    background: #f1f4ff;
    color: #0067cc;
    border: 1px dashed #9fcaf5 !important;
  }
  .ant-btn-primary:hover {
    border: 1px dashed #0067cc !important;
  }
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
    border: 1px solid rgba(87,234,201,1);
    box-shadow: 0px 0px 10px 0px rgba(87,234,201,0.1);
    .pe-data-body,.en-illus{
      color: #57eac9;
    }
    i {
      background-color:rgba(87,234,201,1);
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