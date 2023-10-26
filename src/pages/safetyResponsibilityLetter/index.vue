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
            <a-select-option v-for="item in dictionary('signatureStatus2')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="模板分类">
          <a-select allowClear show-search v-model="formInline.templateClassificationId" placeholder="请选择模板分类">
            <a-select-option v-for="item in classificationList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
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
        <a-button type="primary" @click="batchSign">批量签署</a-button>
        <a-button type="primary" @click="batchExport">批量下载</a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, selectedRows: choosedArr, onChange: onSelectChange, onSelectAll: onSelectAllSelect }" bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return record.id}" :pagination="false">
        <div slot="num" slot-scope="record">{{ record.num }}</div>
        <div slot="templateTypeName" slot-scope="record">{{ record.templateTypeName }}</div>
        <div slot="templateClassificationName" slot-scope="record">{{ record.templateClassificationName }}</div>
        <div slot="signatureUserName" slot-scope="record">{{ record.signatureUserName }}/{{ record.signatureUserJobNumber }}</div>
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
    <CommonModal :title="'签署责任书'" :visible="signVisible" :cancelFn="signCancle">
      <template slot="form">
        <a-form-model
          ref="editForm"
          :model="editForm"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="签名区域" prop="sealData">
            <div class="test">
              <div id="testEle" class="testInfo"></div>
            </div>
            <a-button type="primary" class="m-l-15 m-t-10" @click="signUndo">
              撤销
            </a-button>
            <a-button type="primary" class="m-l-15 m-t-10" @click="signRedo">
              重签
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="signCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="signConfirm"
          >确定</a-button
        >
      </template>
    </CommonModal>
    <!-- 上传 -->
    <Upload :importVisible="importVisible" @closeAddVisible="closeAddVisible" :pushStatus='pushStatus' :type="type"/>
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis"
import cancelLoading from '@/mixin/cancelLoading'
import { formValidator } from "@/utils/clx-form-validator.js"
import { mapState } from 'vuex'
import Upload from '@/pages/safetyResponsibilityLetter/components/uploadImport.vue'
import dayJs from "dayjs"
import '@/utils/dzjm.min.js'
import dictionary from "@/utils/dictionary";
import moment from 'moment'
import { debounce, cloneDeep } from 'lodash'
import serviceNameList from '@/config/default/service.config.js'
import {getResponsibilityCount, getResponsibilityList, pushResponsibility, responsibilityDelete, responsibilitySignBatch, certificateDetail} from "@/services/api.js"
import optionsMixin from '@/pages/occupationHealth/physicalExam/mixin/optionsMixin'
import postOptionsMixin from '@/pages/occupationHealth/physicalExam/mixin/postOptions'

export default {
  mixins: [teableCenterEllipsis, cancelLoading, optionsMixin, postOptionsMixin],
  components: { Upload },
  data() {
    return {
      dictionary,
      signVisible: false,
      mSign: null,
      editForm:{},
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
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
          title: '目标责任人',
          scopedSlots: { customRender: 'signatureUserName' },
          width: 150
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
            text[0] = text ? text[0] : '--';
            const signatoriesJobNumberFirst = text[0] && text[0].signatoriesJobNumber ? text[0].signatoriesJobNumber : '--';
            const signatoriesNameFirst = text[0] && text[0].signatoriesName ? text[0].signatoriesName : '--';
            const signatoriesTimeFirst = text[0] && text[0].signatoriesTime ? text[0].signatoriesTime.split(' ')[0] : '--';
            text[1] = text ? text[1] : '--';
            const signatoriesJobNumberSecond = text[1] && text[1].signatoriesJobNumber ? text[1].signatoriesJobNumber : '--';
            const signatoriesNameSecond = text[1] && text[1].signatoriesName ? text[1].signatoriesName : '--';
            const signatoriesTimeSecond = text[1] && text[1].signatoriesTime ? text[1].signatoriesTime.split(' ')[0] : '--';
            return (
              <a-popover autoAdjustOverflow title="签署人">
                <div slot="content">
                  目标责任人：<p>{signatoriesNameFirst}/{signatoriesJobNumberFirst}&nbsp;&nbsp;&nbsp;{signatoriesTimeFirst}</p> 
                  部门负责人：<p>{signatoriesNameSecond}/{signatoriesJobNumberSecond}&nbsp;&nbsp;&nbsp;{signatoriesTimeSecond}</p> 
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
      classificationList: [],
      userId: undefined
    }
  },
  created() {
    this.columns.splice(1, 0, this.addCommonColumnItem(150, true));
    this.columns.splice(2, 0, this.addCommonColumnDepartment({
      title: "所属部门",
      width: 150
    }, true));
    this.classificationList = this.getMappingValue(this.dictTypeData, "dictType", "safety_responsibility_statement").dictItem;
    this.init()
    let zconsole_userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
    this.userId = zconsole_userInfo.user.userId
  },
  activated(){
    if(this.$route.query.activeKey == 3){
      this.init()
    }
  },
  methods: {
    async init() {
      this.getDataList()
      this.getCertCount()
      this.getPeDate()
    },
    // 批量导入成功
    handleSuccess(fileList) {
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
        type: "1" 
      }
      const {code, data } = await getResponsibilityCount(params1)
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
        type:1,
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
      const { code, data } = await getResponsibilityList(params)
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
        const { code } = await pushResponsibility(para)
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
    // 批量签署
    async batchSign() {
      // console.log('批量签署',this.choosedArr);
      if (!this.choosedArr.length) {
        this.$antMessage.warning('至少选择一条数据！')
        return
      }
      const condition = (item) => {
        return item.signatoriesHandlerUserId != this.userId || item.signatureStatus != 2;
      };
      const canNotSign = this.choosedArr.some(condition);
      if (canNotSign) {
        this.$antMessage.warning('请正确选择签署文件！')
        return;
      } else {
        this.signVisible = true
        this.$nextTick(()=>{
          //所有功能演示代码
          this.mSign = new EleSign({
            ele: null
          });
          this.mSign.init();
          this.mSign.moutedEle(document.getElementById("testEle"))
        })
        console.log(this.selectedRowKeys,'idList999');
      }
    },
    // 批量下载
    async batchExport() {
      console.log('批量下载',this.choosedArr);
      if (!this.choosedArr.length) {
        this.$antMessage.warning('至少选择一条数据！')
        return
      }
      this.choosedArr.forEach(item => {
        window.open(item.file.filePath);
      })
      this.choosedArr = []
    },
    // 点击确定按钮
    signConfirm(){
      if(JSON.parse(this.mSign.toJson()).data.length > 0) {
        var baseUrl = this.mSign.toJpeg();
        var dataWithoutPrefix = baseUrl.split(',')[1];
        // console.log(baseUrl, '生成的base64')
      } else {
        this.$antMessage.warn('请签署姓名!')
        return
      }
      if (!formValidator.formAll(this, "editForm")) return;
      let params = {
        idList: this.selectedRowKeys,
        sealData: dataWithoutPrefix,
      }
      responsibilitySignBatch(params).then((res)=>{
        if(res.code == 20000){
          this.$antMessage.success("签署成功！");
          this.signVisible = false
          this.selectedRowKeys = []
          this.choosedArr = []
          this.getDataList()
        }
      })
    },
    signUndo() {
      this.mSign.undo();
    },
    signRedo() {
      this.mSign.clear();
    },
    // 点击取消按钮
    signCancle() {
      this.signVisible = false;
      this.editForm = {};
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
        return '签署中'
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
      this.type = 1
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
      if (!this.canClickBtnMixin("safetyResponsibilitySign")) {
        return;
      }
      let query = {
        id: row.id,
        activeKey:'1'
      }
      this.$router.push({
        path: '/ehsGerneralManage/securityArchiveManagement/safetyResponsibilityPreview',
        query
      })
    },
    // 预览
    viewFile(row){
      if (!this.canClickBtnMixin("safetyResponsibilityView")) {
        return;
      }
      let query = {
        id: row.id,
        filePreview: true
      }
      this.$router.push({
        path: '/ehsGerneralManage/securityArchiveManagement/safetyResponsibilityPreview',
        query,
      })
    },
    // 推送
    pushFile(row){
      let para = {
        idList: [row.id]
      }
      pushResponsibility(para)
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
          await responsibilityDelete(para)
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
::v-deep .ant-modal-content {
  .model-content-form {
    padding: 0 111px 0 102px !important;
  }
}
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
.testInfo {
  border: 2px dashed grey;
  overflow: hidden;
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