<template>
  <HasFixedBottomWrapper>
  <div class="arc">
        <div class="info-container mgt-20 mgb-45">
          <h3>姓名：<span>{{userInfo.name}}</span> <span class="work-num-span">工号：</span><span>{{userInfo.workNum}}</span> </h3>
          <div class="base-info-body">
            <a-row class="mgb-20">
              <a-col :span="6"><span class="info-label"> 性别：</span> <span>{{ userInfo.sex ? +userInfo.sex === 1 ? '男' : '女' : '--' }}</span></a-col>
              <a-col :span="6"><span class="info-label">身份证：</span><span>{{userInfo.certificateNum || '--'}}</span></a-col>
              <a-col :span="6"><span class="info-label">籍贯：</span><span>{{userInfo.nativePlace || '--'}}</span></a-col>
              <a-col :span="6"><span class="info-label">入司时间：</span><span>{{(userInfo.joyCompanyTime ? userInfo.joyCompanyTime.join('-') : '') || '--'}}</span></a-col>
            </a-row>
            <a-row class="mgb-20">
              <a-col :span="6"><span class="info-label">文化程度：</span><span>{{education[userInfo.degreeEducation] || '--'}}</span></a-col>
              <a-col :span="6"><span class="info-label">手机号：</span><span>{{userInfo.phone || '--'}}</span></a-col>
              <a-col :span="6"><span class="info-label">出生年月：</span><span>{{(userInfo.birthTime ? userInfo.birthTime.join('-') : '') || '--'}}</span></a-col>
              <a-col :span="6"><span class="info-label">婚姻状况：</span><span>{{userInfo.maritalStatus ? +userInfo.maritalStatus === 1 ? '已婚' : '未婚' : '--'}}</span></a-col>
            </a-row>
            <a-row class="mgb-20">
              <a-col :span="6"><span class="info-label">嗜好：</span><span>{{userInfo.hobby || '--'}}</span></a-col>
              <a-col :span="6"><span class="info-label">工龄（月）：</span><span>{{userInfo.workAge || '--'}}</span></a-col>
              <a-col :span="6"><span class="info-label">接害工龄（月）：</span><span>{{userInfo.harmfulAge || '--'}}</span></a-col>
              <a-col :span="6"><span class="info-label">所属组织：</span><span>{{userInfo.corporationName || '--'}}</span></a-col>
            </a-row>
            <a-row class="mgb-20">
              <a-col :span="6"><span class="info-label">所属部门：</span><span>{{userInfo.deptName || '--'}}</span></a-col>
              <a-col :span="6"><span class="info-label">岗位：</span><span>{{userInfo.postName || '--'}}</span></a-col>
              <a-col :span="6"><span class="info-label">近期体检结论：</span><span>{{checkResultLabel(userInfo.checkResult) || '--'}}</span></a-col>
              <a-col :span="6"><span class="info-label">是否构成职业病：</span><span>{{isSickLabel(userInfo.isSick) || '--'}}</span></a-col>
            </a-row>
            <a-row class="mgb-20">
              <a-col :span="24"><span class="info-label">接触危害：</span><span>{{userInfo.hazardFactors || '--'}}</span></a-col>
            </a-row>
          </div>
        </div>
        <h3 class="top-title">历史体检信息</h3>
        <a-spin :spinning="spinning" wrapperClassName="a-spin">
          <DashBtn>
            <div>
              <a-button type="dashed" @click="addCourse">添加人员历史体检记录</a-button>
            </div>
          </DashBtn>
          <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
            <a-table bordered :columns="columns" :scroll="{ x: 1080 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
              <div slot="isSick" slot-scope="record">{{isSickLabel(record.isSick)}}</div>
              <div slot="checkResult" slot-scope="record">{{checkResultLabel(record.checkResult)}}</div>
              <div slot="job" slot-scope="record">{{jobLabel(record.job)}}</div>
              <div slot="checkAgency" slot-scope="record">{{ checkAgencyLabel(record.checkAgency) }}</div>
              <div slot="checkType" slot-scope="record">{{ checkTypeLabel(record.checkType) }}</div>
              <div slot="action" slot-scope="text,record,index">
                <span class="color-0067cc cursor-pointer">
                  <!-- 上传体检报告 -->
                  <UploadEhs :showUploadList="false" useSlot :maxSize="20" :onlyShow="disabled" :accept="accept" @handleSuccess="(file) => {handleSuccess(file, record)}" :fileLists="record.checkFileData || []">
                    <span class="btn-text">{{ record.checkFileData && record.checkFileData.length ? '更新体检报告' : '上传体检报告' }}</span>
                  </UploadEhs>
                </span>
                <span v-if="record.checkFileData && record.checkFileData.length" class="color-0067cc cursor-pointer" @click="downloadFile(record)">体检报告</span>
                <span class="color-0067cc cursor-pointer" v-if="!record.checkResult" @click="showEdit(record,index)">编辑</span>
              </div>
            </a-table>
          </CommonTable>
        </a-spin>
      </div>
      <CommonModal title="编辑" :visible="moduleVisible" :cancelFn="cancelFn">
        <div>
          <a-form-model ref="innerForm" :model="innerForm" :rules="innerRules" :colon="false">
            <a-row>
              <a-col :span="18">
                <a-form-model-item label="是否构成职业病" prop="isSick" :label-col="innerLabelCol" :wrapper-col="innerWrapperCol">
                  <a-select :disabled="disabled" allowClear show-search v-model="innerForm.isSick" placeholder="请选择是否构成职业病">
                    <a-select-option v-for="item in universalOptions" :value="item.key" :key="item.key">{{item.value}}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="18">
                <a-form-model-item label="体检结论" prop="checkResult" :label-col="innerLabelCol" :wrapper-col="innerWrapperCol">
                  <a-select :disabled="disabled" allowClear show-search v-model="innerForm.checkResult" placeholder="请选择体检结论">
                    <a-select-option v-for="item in checkResultOptions" :value="item.key" :key="item.key">{{item.value}}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
        <template slot="btn">
          <a-button class="m-l-15" @click="cancelFn">取消</a-button>
          <a-button type="primary" @click="confirmEdit">保存</a-button>
        </template>
      </CommonModal>
      <CommonModal title="添加人员历史体检记录" :visible="peVisible" :cancelFn="peCancelFn">
        <div>
          <a-form-model ref="peInnerForm" :model="peInnerForm" :rules="peInnerRules" :colon="false">
            <a-row>
              <a-col :span="18">
                <a-form-model-item label="体检类型" prop="checkType" :label-col="innerLabelCol" :wrapper-col="innerWrapperCol">
                  <a-select :disabled="disabled" allowClear show-search v-model="peInnerForm.checkType" placeholder="请选择体检类型">
                    <a-select-option v-for="item in checkTypeOptions" :value="item.key" :key="item.key">{{item.value}}</a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="接触危害" prop="checkItem" :label-col="innerLabelCol" :wrapper-col="innerWrapperCol">
                  <a-select :disabled="disabled" allowClear show-search v-model="peInnerForm.checkItem" placeholder="请选择接触危害">
                    <a-select-option v-for="item in inspectionItems" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="体检机构" prop="checkAgency" :label-col="innerLabelCol" :wrapper-col="innerWrapperCol">
                  <a-select :disabled="disabled" allowClear show-search v-model="peInnerForm.checkAgency" placeholder="请选择体检机构">
                    <a-select-option v-for="item in healthyInstitution" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="体检日期" prop="checkDate" :label-col="innerLabelCol" :wrapper-col="innerWrapperCol">
                  <!-- <el-date-picker v-model="peInnerForm.checkDate" valueFormat="YYYY-MM-DD" format="YYYY-MM-DD"></el-date-picker> -->
                  <a-date-picker v-model="peInnerForm.checkDate" format="YYYY-MM-DD" />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
        <template slot="btn">
          <a-button class="m-l-15" @click="peCancelFn">取消</a-button>
          <a-button type="primary" @click="confirmPe">保存</a-button>
        </template>
      </CommonModal>
      <div slot="fixedBottom">
        <FixedBottom class="fixed-button-container">
          <a-button @click="reback">返回</a-button>
        </FixedBottom>
      </div>
  </HasFixedBottomWrapper>
</template>

<script>
import UploadEhs from "@/components/upload/uploadBtnStyle.vue"
import { formValidator } from "@/utils/clx-form-validator.js"
import oldDictionary from '@/utils/dictionary'
import dictionary from '@/utils/newDictionary'
import { selectDetailByPersonId, healthManageDetail, updateCheckResult, uploadCheckFile, addHistoryHealthyCheck } from "@/services/api.js"
import FixedBottom from "@/components/commonTpl/fixedBottom"
import { debounce } from 'lodash'
import dayJs from "dayjs";
import optionsMixin from '@/pages/occupationHealth/physicalExam/mixin/optionsMixin'
export default {
  mixins: [optionsMixin],
  components: { FixedBottom, UploadEhs },
  data() {
    return {
      oldDictionary,
      labelCol: { span: 4 }, // 设置左边label宽度
      wrapperCol: { span: 18 }, // 设置右边表单宽度
      innerLabelCol: { span: 9 },
      innerWrapperCol: { span: 15 },
      userInfo: {},
      curIndex: -1,
      curRow: null,
      rebackVisable: false,
      rebackMsg: '',
      moduleVisible: false,
      peVisible: false,
      tableDataList: [],
      staffArr: [],
      plainOptions: [],
      status: '',//审批状态
      nodeName: '',
      spinning: false,
      emptyText: '',
      accept: ['.doc', '.docx' ,'.pdf', '.xls', '.xlsx', '.ppt'],
      education: {
        '1':'高中',
        '2':'大专',
        '3':'本科',
        '4':'研究生',
        '5':'博士'
      },
      innerForm: {
        isSick: undefined,
        checkResult: undefined
      },
      peInnerForm: {
        isSick: undefined,
        checkResult: undefined
      },
      innerRules: {
        isSick: [
          { required: true, message: '请选择否构成职业病', trigger: 'change' }
        ],
        checkResult: [
          { required: true, message: '请选择体检结论', trigger: 'change' }
        ]
      },
      peInnerRules: {

      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columns:  [
        {
          title: '所属部门',
          dataIndex: 'deptName',
          width: 150,
          align: 'center'
        },{
          title: '岗位',
          dataIndex: 'postName',
          width: 150,
          align: 'center'
        },{
          title: '体检日期',
          dataIndex: 'checkDate',
          width: 150,
          align: 'center'
        },{
          title: '体检类型',
          scopedSlots: { customRender: 'checkType' },
          width: 150,
          align: 'center'
        },{
          title: '接触危害',
          dataIndex: 'exposureHazard',
          width: 150,
          align: 'center'
        },{
          title: '体检机构',
          scopedSlots: { customRender: 'checkAgency' },
          width: 150,
          align: 'center'
        },{
          title: '是否构成职业病',
          scopedSlots: { customRender: 'isSick' },
          width: 150,
          align: 'center'
        },{
          title: '体检提醒时间',
          dataIndex: 'checkTellDate',
          width: 150,
          align: 'center'
        },{
          title: '体检结论',
          scopedSlots: { customRender: 'checkResult' },
          width: 150,
          align: 'center'
        },{
          title: '操作',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          fixed: 'right', // 固定操作列
          width: 300 // 宽度根据操作自定义设置
        }
      ],
      orgnizeOptions: dictionary('organize'),
      chemicalNameOptions: dictionary('chemical'),
      formOptions: dictionary('form'),
      replaceFields: { children: 'childDeptList', title: 'deptName', key: 'deptId', value: 'deptId' },
      taskId: null,
      infoStatus: null,
      consoleOrganizeTreeList:[],
      DEPLOYIDOption: dictionary('approvalType') || [],
      inspectionItems: dictionary('inspection_items') || [],
      healthyInstitution: dictionary('healthy_institution') || [],
      createUserId: '',
      rules: {
        
      },
    };
  },
  created() {
    this.setRouterCode('physicalExam')
  },
  mounted() {
    this.init()
  },
  computed: {
    DEPLOYID() {
      return (this.DEPLOYIDOption.find(item => {
        return item.dictLabel === 'MSDSAPPROVAL'
      }) || {}).dictValue
    },
    showRightLog() {
      return this.isResolve || this.$route.query.type === 'approveView'
    },
    corporationList() {
      return this.$store.state.setting.corporationList
    },
    disabled() {
      return this.$route.meta && (this.$route.meta.isView || this.$route.meta.isResolve)
    },
    isResolve() {
      return this.$route.meta && this.$route.meta.isResolve
    },
    isView() {
      return this.$route.meta && this.$route.meta.isView
    },
    isEdit() {
      return this.$route.meta && this.$route.meta.isEdit
    },
    isCreate() {
      return this.$route.meta && this.$route.meta.isCreate
    },
    isRecheck() {
      return this.$route.meta && this.$route.meta.isRecheck
    }
  },
  methods: {
    async addCourse() {
      this.peVisible = true
    },
    async init() {
      // this.getCityOptions()
      this.getUserInfo()
      this.getDetail()
      // if (this.isCreate) {
      // }
      // if (!this.isCreate) {
      // }
    },
    async getUserInfo() {
      let para = {
        personId: (this.$route.query || {}).personId
      }
      const { code, data } = await selectDetailByPersonId(para)
      if (+code === 20000) {
        this.userInfo = data || {}
      }
    },
    async getDetail() {
      let para = {
        personId: this.$route.query.personId
      }
      this.spinning = true
      const { code, data } = await healthManageDetail(para)
      this.spinning = false
      if (+code === 20000) {
        (data.healthCheckupHistories || []).forEach(item => {
          item.checkFileData = (item.checkFileData || []).map(subItem => {
            return {
              uid: subItem.id,
              url: subItem.filePath,
              name: subItem.sourceFileName
            }
          }) || []
        })
        this.tableDataList = data.healthCheckupHistories || []
      }
    },
    handleSiteChange(val) {
      this.form.site = (this.orgnizeOptions.find(item => {
        return item.dictValue === val
      }) || {}).dictLabel
    },
    deleteRow(row, index) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: ()=> {
          this.tableDataList.splice(index, 1)
        }
      })
    },
    
    handleDateChange(val) {
      this.form.validityTime = moment(val).format('YYYY-MM-DD')
    },
    reback() {
      this.setKeepalive(true)
      this.$router.push({
        path: '/occupationHealth/physicalExam'
      })
    },
    // validate() {
    //   return new Promise((resolve) => {
        
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // },
    async handleSuccess(file, record) {
      if (file && file.length) {
        file = [file[file.length -1]]
      }
      const checkFileData = file.map(item => {
        return {
          uid: item.response ? item.response.data.id : item.uid,
          url: item.response ? item.response.data.url : item.url,
          name: item.name
        }
      }) || []
      this.$set(record, 'checkFileData', checkFileData)
      let para = {
        personId: this.$route.query.personId,
        chechHistoryId: record.chechHistoryId,
        checkFile: (checkFileData[0] || {}).uid
      }
      const { code } = await uploadCheckFile(para)
    },
    
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page
      // 获取列表
      this.getDataList()
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1
      this.page.pageSize = pageSize
      this.getDataList()
    },
    onCancel() {
      this.$router.push({
        path: '/occupationHealth/physicalExam'
      })
    },
    showEdit(row, index) {
      this.curRow = row
      const { isSick, checkResult } = row
      if (isSick || checkResult) {
        this.innerForm = { isSick, checkResult }
      }
      this.moduleVisible = true
    },
    // changeFindTime(val, v) {
    //   const start = _.cloneDeep(val).add(7, "days");
    //   this.hideDangerForm.rectificationTime = start; //改变整改日期值 为发现日期的后三天
    //   this.disabledDate(val);
    // },
    async confirmPe() {
      
      // const res = await addHistoryHealthyCheck({
      //   personIds: [
      //   "1001011"
      //   ],
      //   checkType: "jobing",
      //   checkItem: "血常规,接害",
      //   checkAgency: "2",
      //   checkDate: "2023-10-30"
      // })
      let checkDate = this.peInnerForm.checkDate ? dayJs(this.peInnerForm.checkDate).format("YYYY-MM-DD") : undefined;
      let para = {
        personIds: [this.$route.query.personId],
        checkType: this.peInnerForm.checkType,
        checkItem: this.peInnerForm.checkItem,
        checkAgency: this.peInnerForm.checkAgency,
        checkDate: checkDate,
        // chechHistoryId: this.curRow.chechHistoryId,
        // isSick: this.innerForm.isSick,
        // checkResult: this.innerForm.checkResult
      }
      const { code, data } = await addHistoryHealthyCheck(para)
      if (+code === 20000) {
        this.$antMessage.success('更新成功')
        this.peCancelFn()
        this.getDetail()
      }
    },
    confirmEdit() {
      this.$refs.innerForm.validate( async valid => {
        if (valid) {
          let para = {
            personIds: [this.$route.query.personId],
            chechHistoryId: this.curRow.chechHistoryId,
            isSick: this.innerForm.isSick,
            checkResult: this.innerForm.checkResult
          }
          const { code, data } = await updateCheckResult(para)
          if (+code === 20000) {
            this.$antMessage.success('更新成功')
            this.cancelFn()
            this.getDetail()
          }
        }
      })
    },
    downloadFile(row) {
      window.location.href = (row.checkFileData[0] || {}).url
    },
    cancelFn() {
      this.moduleVisible = false
      this.$refs.innerForm.resetFields()
    },
    peCancelFn() {
      this.peVisible = false
      this.$refs.peInnerForm.resetFields()
    }
  },
};
</script>

<style scoped lang='less'>
.work-num-span{
  margin-left:30px;
}
.arc {
  width: 100%;
  flex: 1;
}
.resolve-page{
  /deep/.fixed-bottom{
    width: calc(100vw - 762px);
  }
}
.pe-book-container{
  width:100%;
}
.top-search-right-side{
  text-align: right;
  padding-right:24px;
  
}
.mgb-45{
  margin-bottom:45px;
}
.mgt-20{
  margin-top: 20px;
}
.mgb-20{
  margin-bottom: 20px;
}
/deep/.ant-btn{
  & +.ant-btn{
    margin-left: 8px;
  }
}
.info-container{
  background: rgba(250,250,250,0.50);
  border: 1px solid rgba(244,244,244,1);
  padding:32px 0 0;
  h3{
    font-size: 16px;
    color: #000000;
    font-weight: 500;
    margin: 0 19px 0;
    padding-bottom: 19px;
    border-bottom: 1px solid #E9E9E9;
  }
}
.pe-book-container{
  display: flex;
}
.top-title{
  margin-top:20px;
  margin-bottom:30px;
}
.left-side{
  flex:1;
  width:0;
}
.base-info-body{
  margin-top:20px;
  padding:0 44px;
  /deep/.ant-col.ant-col-6{
    display: flex;
  }
  .info-label{
    width:125px;
    flex:none;
    display: inline-block;
    font-size: 14px;
    color: #999;
    text-align: right;
  }
}

.right-side{
  margin-top:65px;
  flex-basis: 426px;
  background: #FCFCFC;
  border: 1px solid rgba(244,244,244,1);
  border-radius: 4px 0px 0px 4px;
  margin-left: 20px;
  
}
.log-body{
  background: #FCFCFC;
}
.table-container{
  width: calc(100vw - 300px);
}
.fixed-button-container{
  .ant-btn +.ant-btn{
    margin-left:20px;
  }
}
.v-line-icon{
  display: inline-block;
  width:2px;
  height: 14px;
  margin-right:5px;
  background:#0067cc;
}
.btn-text{
  color: #0067cc;
  cursor: pointer;
}
.active {
  background: #e9f4ff;
  color: #0067cc;
  font-weight: 600;
  &:before {
    border-color: transparent transparent transparent #e9f4ff;
  }
}
</style>