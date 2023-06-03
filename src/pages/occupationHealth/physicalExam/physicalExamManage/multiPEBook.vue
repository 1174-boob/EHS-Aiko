<template>
  <div class="pe-book-container" :class="[showRightLog ? 'resolve-page' : '']">
    <HasFixedBottomWrapper>
      <div class="arc">
        <h3 class="top-title">预约体检</h3>
        <div class="info-container">
          <a-form-model ref="ruleForm" :model="form" :rules="formRule" :colon="false">
            <a-row>
              <a-col :span="12">
                <CommonSearchItem ref="commonSearchItem" :disabled="disabled" :CommonFormInline="form" :rules="formRule" :hasDepartment="true" :notTablePage="true" :labelCol="labelCol" :wrapperCol="wrapperCol" deptLabel="选择体检人员" @departmentChange="departmentChange"></CommonSearchItem>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
        <a-spin :spinning="spinning" wrapperClassName="a-spin">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :colon="false">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="体检城市" prop="city" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-cascader :disabled="disabled" v-model="form.city" :options="cityOptions" style="width: 100%" placeholder="请选择体检城市" @change="handleCityChange">
                  <template #displayRender="{ labels, selectedOptions }">
                    <span v-for="(label, index) in labels" :key="selectedOptions[index].value">
                      <span v-if="index === labels.length - 1">
                        {{ label }}
                      </span>
                      <span v-else>{{ label }} /</span>
                    </span>
                  </template>
                </a-cascader>
              </a-form-model-item>
              <a-form-model-item label="体检机构" prop="checkAgency" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-select :disabled="disabled" allowClear show-search v-model="form.checkAgency" placeholder="请选择体检机构">
                  <a-select-option v-for="item in checkAgencyOptions" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item v-if="isShowDate" label="体检日期" prop="checkDate" :label-col="labelCol" :wrapper-col="wrapperCol" >
                <a-date-picker :disabled="!canSelectDate" format="YYYY-MM-DD" @change="handleCheckDateChange" v-model="form.checkDate" placeholder="请选择有效期"/>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        </a-spin>
        <a-spin :spinning="spinningTable" wrapperClassName="a-spin">
          <div class="table-container" :class="[showRightLog ? 'resolve-page' : '']">
            <CommonTable :noPaging="true">
              <a-table :columns="columns" :scroll="{ x: 600 }" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
                <div slot="checkType" slot-scope="record">
                  {{checkTypeLabel(record.checkType)}}
                </div>
                <div slot="action" slot-scope="text,record,index">
                  <span class="color-0067cc cursor-pointer" v-if="!disabled" @click="edit(record, index)">编辑</span>
                  <span class="color-ff4d4f cursor-pointer" v-if="!disabled" @click="deleteRow(record, index)">删除</span>
                </div>
              </a-table>
            </CommonTable>
          </div>
        </a-spin>
      </div>
      <div slot="fixedBottom" v-if="isCreate || isEdit">
        <FixedBottom class="fixed-button-container">
          <a-button @click="onSave">保存</a-button>
          <a-button type="primary" @click="onSubmit">立即预约</a-button>
        </FixedBottom>
      </div>
      <div slot="fixedBottom" v-if="isResolve">
        <FixedBottom class="fixed-button-container">
          <a-button @click="reback">返回</a-button>
          <a-button type="primary" @click="reject">驳回</a-button>
          <a-button type="primary" @click="approved">通过</a-button>
        </FixedBottom>
      </div>
      <div slot="fixedBottom" v-if="isView">
        <FixedBottom class="fixed-button-container">
          <a-button @click="reback">返回</a-button>
        </FixedBottom>
      </div>
      <CommonModal title="编辑" :visible="moduleVisible" :cancelFn="cancelFn">
        <div>
          <a-form-model ref="innerRuleForm" :model="innerForm" :rules="innerRules" :colon="false">
            <a-row>
              <a-col :span="16">
                <a-form-model-item label="体检类型" prop="checkType" :label-col="innerLabelCol" :wrapper-col="innerWrapperCol">
                  <a-select allowClear show-search v-model="innerForm.checkType" placeholder="请选择体检类型">
                    <a-select-option v-for="item in checkTypeOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
        <template slot="btn">
          <a-button class="m-l-15" @click="cancelFn">取消</a-button>
          <a-button type="primary" @click="confirmEdit">确定</a-button>
        </template>
      </CommonModal>
    </HasFixedBottomWrapper>
  <ApproveModal @save="doSave" :corporationId='form.corporationId' @reject="doReject" :queryObj="queryObj" :createUserId="createUserId" :isEdit="isEdit" :isResolve="isResolve" ref="approveModal" :approveVisible.sync="approveVisible"/>
  <div class="right-side" v-if="showRightLog">
    <OPLog :data="opData"/>
  </div>
  </div>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom"
import ApproveModal from './comp/ApproveModal'
import OPLog from './comp/OPLog'
import { formValidator } from "@/utils/clx-form-validator.js"
import oldDictionary from '@/utils/dictionary'
import dictionary from '@/utils/newDictionary'
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
import { getCityOptions, findHealthUserByDeptId, healthManageUpdate,
healthManageAdd, healthManageDetail, healthApproveManageDetail, getFlowLogApi, PushTask } from '@/services/api'
import optionsMixin from '@/pages/occupationHealth/physicalExam/mixin/optionsMixin'
import { getQueryVariable } from "@/utils/util.js";
import moment from 'moment'

import { debounce } from 'lodash'
export default {
  mixins: [optionsMixin],
  components: { FixedBottom, OrganizeLazyTree, OPLog, ApproveModal },
  data() {
    return {
      innerLabelCol: { span: 9 },
      innerWrapperCol: { span: 15 },
      rebackVisable: false,
      rebackMsg: '',
      curIndex: -1,
      curRow: null,
      chooseStaffVisible: false,
      tableDataList: [],
      staffArr: [],
      plainOptions: [],
      status: '',//审批状态
      nodeName: '',
      spinning: true,
      spinningTable: false,
      form: {
        checkDeptId: undefined,
        organization: undefined,
        checkAgency: undefined,
        checkDate: undefined
      },
      formRule: {},
      modalInfo: {},
      emptyText: '',
      treeData: [],
      orgnizeOptions: dictionary('organize'),
      chemicalNameOptions: dictionary('chemical'),
      formOptions: dictionary('form'),
      replaceFields: { children: 'childDeptList', title: 'deptName', key: 'deptId', value: 'deptId' },
      moduleVisible: false,
      taskId: null,
      infoStatus: null,
      consoleOrganizeTreeList:[],
      DEPLOYIDOption: dictionary('approvalType') || [],
      createUserId: '',
      rules: {
        organization: [
          { required: true,  message: "请选择组织", trigger: "change" },
        ],
        checkType: [
          { required: true,  message: "请选择体检类型", trigger: "change" },
        ],
        checkItem: [
          { required: true, message: "请选择体检项目", trigger: "change" },
        ],
        checkDate: [
          { required: true, message: "请选择体检时间", trigger: "change" },
        ]
      },
      infoStatus: '',
      /**new start */
      cityOptions: [],
      innerRules: {
        checkType: [
          { required: true, message: "请选择体检类型", trigger: "change" }
        ]
      },
      curIndex: -1,
      innerForm: {
        checkType: undefined
      },
      opData: [],
      approveVisible: false,
      
    };
  },
  created() {
    
  },
  mounted() {
    console.log("personnnn-----",this.queryObj);
    this.init()
  },
  computed: {
    queryObj() {
      let query = this.$route.query;
      if(query.id) {
        return query;
      } else {
        let id = getQueryVariable('id');
        let personId= getQueryVariable('personId');
        let queryObj = {
          id,
          personId,
        }
        return queryObj
      }
    },
    labelCol() {
      return this.showRightLog ? { span: 8 } : { span: 5 }
    }, // 设置左边label宽度
    wrapperCol() {
      return this.showRightLog ? { span: 14 } : { span: 17 }
    }, // 设置右边表单宽度
    showRightLog() {
      return this.isResolve || this.$route.query.type === 'approveView'
    },
    columns() {
      let op = this.isCreate || this.isEdit ? [{
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }] : []
      return [
        {
          title: '姓名',
          dataIndex: 'name',
          width: 150
        },{
          title: '部门',
          dataIndex: 'deptName',
          width: 150
        },{
          title: '岗位',
          dataIndex: 'postName',
          width: 150
        },{
          title: '危害因素',
          dataIndex: 'hazardFactors',
          width: 150
        },{
          title: '体检项目',
          dataIndex: 'checkItem',
          width: 150
        },{
          title: '体检类型',
          scopedSlots: { customRender: 'checkType' },
          width: 150
        },
        ...op
      ]
    },
    canSelectDate() {
      return this.$route.meta && this.$route.meta.isResolve && this.infoStatus.indexOf('__002') > -1
    },
    isShowDate() {
      return this.infoStatus.indexOf('__002') > -1 || this.status === 'end'
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
    }
  },
  methods: {
    async init() {
      this.getCityOptions()
      if (this.isCreate) {
        this.spinning = false;
      }
      if (!this.isCreate) {
        Promise.all([this.getDetail()])
          .then(resArr => { })
          .finally(() => {
            this.spinning = false
          })
        //编辑 | 查看 | 处理，回显
      }
        // 获取页面详情和组织机构
      
    },
    async getOpLog(processId, handler) {
      let para = {
        processInstanceId: processId,
        handler: handler
      }
      const { code, data } = await getFlowLogApi(para)
      if (+code === 20000) {
        this.opData = data || []
        console.log(data, 'data')
      }
    },
    async getDetail(){
      let para = {
        checkId: this.queryObj.id
      }
      const { code, data } = await healthApproveManageDetail(para)
      if (+code === 20000) {
        this.modalInfo = {
          createUserId: data.createUserId,
          taskId: data.taskId,
          infoStatus: data.infoStatus,
          checkId: this.queryObj.id,
          handler: data.handler
        }
        this.status = data.status
        this.infoStatus = data.infoStatus
        if (this.showRightLog) {
          let handler = data.handler ? data.handler.split(',') : []
          this.getOpLog(data.processId, handler)
        }
        this.$set(this.form, 'organization', data.organization)
        this.$set(this.form, 'organization', data.organization)
        this.$set(this.form, 'checkAgency', data.checkAgency)
        this.$set(this.form, 'checkProvince', data.checkProvince)
        this.$set(this.form, 'checkCity', data.checkCity)
        this.$set(this.form, 'checkCounty', data.checkCounty)

        this.$set(this.form, 'centerId', data.centerId)
        this.$set(this.form, 'centerName', data.centerName)
        this.$set(this.form, 'corporationId', data.corporationId)
        this.$set(this.form, 'corporationName', data.corporationName)
        this.$set(this.form, 'deptId', data.deptId)
        this.$set(this.form, 'deptName', data.deptName)
        if (typeof data.city === 'string') {
          data.city = JSON.parse(data.city)
          this.$set(this.form, 'city', data.city)
        }
        this.tableDataList = data.healthyUserVos || []
        this.$set(this.form, 'checkDeptId', data.checkDeptId)
        this.$set(this.form, 'checkDate', data.checkDate)
        console.log(this.form)
        this.$refs.commonSearchItem.corporationChange(this.form.corporationId, this.form.deptId)
      }
    },
    departmentChange(value, label, extra) {
      this.handleTreeChange(value, label, extra);
    },
    deptFormValidator(val) {
      formValidator.formItemValidate(this, 'checkDeptId', 'ruleForm')
    },
    getFormLabel(val) {
      return ((this.formOptions || []).find(item => {
        return item.dictValue === val
      }) || {}).dictLabel
    },
    async handleTreeChange(value, label) {
      // console.log(value, label, 'tree data')
      let para = {
        deptId: value
      }
      this.spinningTable = true
      const { code, data } = await findHealthUserByDeptId(para)
      this.spinningTable = false
      if (+code === 20000) {
        this.tableDataList = data || []
      }
      // this.form.applicationDepartmentId = value
    },
    filterTree(inputValue, treeNode) {
      return treeNode.data.props.deptName.includes(inputValue)
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
      this.$router.push({
        path: '/occupationHealth/physicalExam'
      })
    },
    // 最后一个节点审批通过 + 归档
    async approved() {
      let valid = await this.validate()
      if (!valid) {
        return
      }
      this.approveVisible = true
      this.$nextTick(() => {
        this.modalInfo.date = this.form.checkDate
        this.$refs.approveModal && this.$refs.approveModal.setApproveData(this.modalInfo)
      })
    },
    reject() {
      this.approveVisible = true
      this.$nextTick(() => {
        this.$refs.approveModal && this.$refs.approveModal.setApproveData(this.modalInfo, 0)
      })
    },
    chooseStaffCancle() {
      this.chooseStaffVisible = false
    },
    async pushTask(url,ovaPara) { 
      const pushTask = await PushTask({
        title: "体检预约处理",
        approval:'physical_examination',
        userId: ovaPara.handler,
        docId: ovaPara.processId,
        taskId: ovaPara.taskId,
        url: url,
        docNumber: ovaPara.docNumber,
      })
    },
    edit(row, index) {
      this.curIndex = index
      this.innerForm.checkType = row.checkType || undefined
      this.moduleVisible = true
    },
    validate() {
      return new Promise((resolve) => {
        this.$refs.ruleForm.validate(valid => {
          if (!valid) {
            resolve(false)
          } else if (!this.tableDataList.length){
            this.$antMessage.warning('请添加体检人员')
            resolve(false)
          } else {
            let bool = this.tableDataList.some(item => {
              return !item.checkType
            })
            if (bool) {
              this.$antMessage.warning('体检类型不能为空')
              resolve(false)
            }
          }
          resolve(true)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    // 最后一个节点审批通过 + 归档
    handleCityChange(val, arr) {
      this.form.checkProvince = (arr[0] || {}).code
      this.form.checkCity = (arr[1] || {}).code
      this.form.checkCounty = (arr[2] || {}).code
    },
    //提交
    async onSubmit() {
      console.log(this.form)
      let valid = await this.validate()
      if (!valid) {
        return
      }
      this.approveVisible = true
      this.$nextTick(() => {
        this.$refs.approveModal && this.$refs.approveModal.getFirstNodeData()
      })
      //逻辑放在组件里
      // this.getNodeDetail(this.infoStatus).then(res => {
      //   if (+res.code === 20000) {
      //     this.nodeName = data.nodeName
      //   }
      // })
      // this.getUserNodeInfo(this.infoStatus)
      // let res = await this.createProcessData(this.infoStatus)
      // if (+res.code === 20000) {
      //   this.chooseStaffVisible = true
      //   this.taskId = (res.data || {}).taskId
      // }
    },
    //保存
    async onSave() {
      let valid = await this.validate()
      if (!valid) {
        return
      }
      this.doSave()
    },
    async doSave(draftStatus = 1, ovaPara = {}) {
      let query = this.queryObj || {}
      let batchChecks = this.tableDataList.map(item => {
        return {
          personId: item.id,
          checkType: item.checkType,
          checkItem: item.checkItem
        }
      })
      let para = {
        batchChecks: batchChecks,
        draftStatus: draftStatus,
        isBatch: 1,//1 批量，2 单个
        ...this.form,
        city: JSON.stringify(this.form.city),
        ...ovaPara
      }
      let api = this.isEdit ? healthManageUpdate : healthManageAdd
      if (this.isEdit || this.isResolve) {
        para.checkId = query.id
      }
      const { code, data } = await api(para)
      if (+code === 20000) {
        if(draftStatus == 2 && data) {
          let id = data.checkId;
          if(id) {
            let url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/occupationHealth/multiPEBookResolve&id=${id}`
            this.pushTask(url,ovaPara);
          }
        }
        this.$antMessage.success('保存成功')
        if (draftStatus === 1) {
          this.$router.push({
            path: '/occupationHealth/physicalExamDraftList'
          })
        } else {
          this.$router.push({
            path: '/occupationHealth/physicalExamApprove'
          })
        }
      }
    },
    async doReject() {
      
    },
    /** start new*/
    // doSearch() {

    // },
    // doCancel() {

    // },
    handleCheckDateChange(val) {
      if (!val) {
        return
      }
      this.form.checkDate = moment(val).format('YYYY-MM-DD')
    },
    cancelFn() {
      this.moduleVisible = false
      this.$refs.innerRuleForm.resetFields()
    },
    confirmEdit() {
      this.$refs.innerRuleForm.validate(valid => {
        if (valid) {
          let checkType = this.innerForm.checkType
          this.$set(this.tableDataList[this.curIndex], 'checkType', checkType)
          this.cancelFn()
        }
      })
    },
    async getCityOptions() {
      const { code, data } = await getCityOptions()
      if (code === 20000) {
        this.cityOptions = data || []
      }
    }
  },
};
</script>

<style scoped lang='less'>
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
  margin-bottom: 30px;
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
.table-container{
  width: calc(100vw - 300px);
  margin-top: 10px;
}
.resolve-page.table-container{
  width: calc(100vw - 700px);
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
.title-h3{
  display: flex;
  align-items: center;
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
.active {
  background: #e9f4ff;
  color: #0067cc;
  font-weight: 600;
  &:before {
    border-color: transparent transparent transparent #e9f4ff;
  }
}
@media (min-width: 1340px){
  .base-info-body{
    .info-label{
      width:115px;
    }
  }
  .resolve-page{
    /deep/.fixed-bottom{
      width: calc(100vw - 612px);
    }
  }
  .right-side{
    flex-basis: 226px;
  }
}
@media (min-width: 1680px){
  .resolve-page{
    /deep/.fixed-bottom{
      width: calc(100vw - 712px);
    }
  }
  .right-side{
    flex-basis: 326px;
  }
}
@media (min-width: 1920px){
  .resolve-page{
    /deep/.fixed-bottom{
      width: calc(100vw - 812px);
    }
  }
  .base-info-body{
    .info-label{
      width:125px;
    }
  }
  .right-side{
    overflow: auto;
    flex-basis: 426px;
  }
}
</style>