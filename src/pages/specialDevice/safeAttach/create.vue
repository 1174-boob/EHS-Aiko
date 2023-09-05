<template>
  <HasFixedBottomWrapper>
    <div class="form-content">
      <a-form-model ref="newlyForm" :model="newlyForm" :rules="newlyRules" :colon="false">
        <a-row class="m-t-20">
          <a-col :span="12">
            <CommonDept :disabled="disabled" ref="commonSearchItem" :CommonFormInline="newlyForm" :rules="newlyRules" :notTablePage="true" :hasDepartment="true" @corporationChange="corporationChange"  @corporationDeptChange="corporationDeptChange" :labelCol="labelCol" :wrapperCol="wrapperCol"></CommonDept>
            <a-form-model-item class="flex" label="起草人部门" prop="draftDeptCode" :label-col="labelCol" :wrapper-col="wrapperCol">
              <dept-tree :disabled="disabled" :placeholder="'请选择起草人部门'" v-model="newlyForm.draftDeptCode" @change="(id,name)=>draftDeptChange(id,name)" :deptData="draftDeptData" allowClear></dept-tree>
            </a-form-model-item>
            <a-form-model-item label="起草人" prop="applicant" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.applicant" placeholder="请输入申请人" disabled />
            </a-form-model-item>
            <a-form-model-item label="保管属地" prop="saveCorporationId" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select :disabled="disabled" v-model="newlyForm.saveCorporationId" placeholder="请选择保管属地" @change="handleSaveCorporationIdChange">
                <a-select-option v-for="item of getCommonAddOrgnizeListAll" :value="item.orgId" :key="item.orgId">{{item.orgName}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="flex" label="保管部门" prop="saveDeptCode" :label-col="labelCol" :wrapper-col="wrapperCol">
              <dept-tree :disabled="disabled" :placeholder="'请选择保管部门'" v-model="newlyForm.saveDeptCode" :deptData="deptData" @change="(id,name)=>saveDeptChange(id,name,'deptName')" allowClear></dept-tree>
            </a-form-model-item>
            <staffOrDept :onPreview="disabled" :labelTitle="'保管人'" :checkAbel="false" :checkedTreeNode="checkedTreeNode" :deptTreeId="deptTreeId" :treeRoles="newlyRules" :propKey="'testPerson'" @getTreeData="getTreeData" :labelCol="labelCol" :wrapperCol="wrapperCol"></staffOrDept>
            <a-form-model-item label="附件类型" prop="annexType" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select :disabled="disabled" v-model="newlyForm.annexType" placeholder="请选择附件类型" show-search :filter-option="filterOption">
                <a-select-option v-for="item in annexTypeOptions" :value="item.key" :key="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="附件编号" prop="annexNum" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.annexNum" placeholder="请输入附件编号" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="型号" prop="modelNum" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.modelNum" placeholder="请输入型号" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="设备状态" prop="annexStatus" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select :disabled="disabled" v-model="newlyForm.annexStatus" placeholder="请选择设备状态" show-search :filter-option="filterOption">
                <a-select-option v-for="item in annexStatusOptions" :value="item.key" :key="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="检验日期" prop="checkDate" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker :disabled="disabled" v-model.trim="newlyForm.checkDate" placeholder="请选择检验日期" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="下次检验日期" prop="nextCheckDate" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker :disabled="disabled" v-model.trim="newlyForm.nextCheckDate" placeholder="请选择下次检验日期" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="检验报告编号" prop="checkReportNum" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.checkReportNum" placeholder="请输入检验报告编号" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="附件" :label-col="labelCol" :wrapper-col="wrapperCol">
              <UploadBtnStyle :onlyShow="disabled" :showAcceptText="true" :accept="['.doc','.docx','.pdf','.xls','.xlsx','.ppt']" :showUploadList="true" :fileLists="infoFileIdList" :btnText="'上传文件'" :btnType="'default'" @handleSuccess="handleSuccess"></UploadBtnStyle>
            </a-form-model-item>
          </a-col>
          <a-col :span="12"></a-col>
        </a-row>
      </a-form-model>
    </div>
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="safeAttachCancel">取消</a-button>
          <a-button v-if="!disabled" type="primary" class="m-r-15" @click="safeAttachSave">确定</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import { safeAnnexInsert, safeAnnexUpdate, safeAnnexDetail } from "@/services/specialDevice.js"
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import moment from "moment";
import mixin from '../mixin'
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import { formValidator } from "@/utils/clx-form-validator.js";
import { queryDeptTree, GetfileMsgList } from '@/services/api'
import { debounce } from 'lodash'
import staffOrDept from "@/components/staffOrDept";
export default {
  mixins: [mixin],
  components: {
    FixedBottom,
    staffOrDept,
    UploadBtnStyle
  },
  data() {
    return {
      addEdit: "add", //add 新建，edit编辑
      checkedTreeNode:[],
      deptData:[],
      // 流程选择人员弹窗
      deptTreeId: "",
      // 流程人员
      plainOptions: [],
      importId:undefined,
      // adminDeptId: undefined,
      deptDisabled: false,
      flowData: {},
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      accept: '.doc,.docx,.pdf,.ppt',
      testDate: null,
      newlyForm: {
        specialEquipmentDetail:{infoFileIdList: [],}
      },
      chemicalDict: {},
      // treeData: [],
      // userTreeData: [],
      replaceFields: { title: 'name', key: 'id', value: 'id' },
      // userTreeFields: { title: 'name', key: 'id', value: 'id', isLeaf: 'isUser' },
      // userTreeFields: { value: 'key' },
      newlyType: [
        { value: "1", label: '二元化导入' },
        { value: "2", label: '新增使用' },
      ],
      fileLists: [],
      otherFileLists: [],
      fileDetail: [],
      newlyRules: {
        draftDeptCode: [
          { required: true, message: '请选择起草人部门', trigger: ['blur', 'change'] },
        ],
        saveDeptCode: [
          { required: true, message: '请选择保管属地', trigger: ['blur', 'change'] },
        ],
        saveDept: [
          { required: true, message: '请选择保管部门', trigger: ['blur', 'change'] },
        ],
        annexType: [
          { required: true, message: '请选择附件类型', trigger: ['blur', 'change'] },
        ],
        annexNum: [
          { required: true, message: '请输入附件编号', trigger: ['blur', 'change'] },
        ],
        annexStatus: [
          { required: true, message: '请选择设备状态', trigger: ['blur', 'change'] },
        ],
        checkDate: [
          { required: true, message: '请选择检验日期', trigger: ['blur', 'change'] },
        ],
        nextCheckDate: [
          { required: true, message: '请选择下次检验日期', trigger: ['blur', 'change'] },
        ],
        checkReportNum: [
          { required: true, message: '请选择检验报告编号', trigger: ['blur', 'change'] },
        ]
      },

    }
  },
  computed: {
    
  },
  created() {
    this.setRouterCode("safeAttachAccount")
    if(this.isCreate) {
      this.initApplicant()
    } else {
      this.fetchDetail()
    }
  },
  methods: {
    safeAttachCancel() {
      this.setKeepalive(true)
      this.$router.push({
        path: '/safeManage/deviceSafeManage/specialeDevice/safeAttachAccount'
      })
    },
    async fetchDetail() {
      let para = {
        safeAnnexId: this.$route.query.id
      }
      const { data } = await safeAnnexDetail(para)
      this.newlyForm = {
        ...data
      }
      //起草人
      this.newlyForm.applicant = this.newlyForm.draftName + '/' + this.newlyForm.draftNum
      //保管人
      this.checkedTreeNode = [this.newlyForm.savePersonId]
      let list = this.getCommonAddOrgnizeList
      let deptId = this.getMappingValue(list, "id", this.newlyForm.corporationId).deptId

      let list2 = this.getCommonAddOrgnizeListAll
      let deptId2 = this.getMappingValue(list2, 'id', this.newlyForm.saveCorporationId).deptId
      queryDeptTree({
        deptId: deptId
      }).then(res => {
        this.draftDeptData = res.data ? [res.data] : []
      }).catch(err => {console.log(err)})
      queryDeptTree({
        deptId: deptId2
      }).then(res => {
        this.deptData = res.data ? [res.data] : []
      }).catch(err => {console.log(err)})
      let result = await GetfileMsgList(this.newlyForm.specialEquipmentDetail.infoFileIdList) || {}
    },
    //安全附件保存
    safeAttachSave: debounce(function () {
      this.$refs.newlyForm.validate(async valid => {
        if (valid) {
          const para = {
            ...this.newlyForm,
          }
          if (this.isEdit) {
            para.safeAnnexId = this.$route.query.id
          }
          if (para.checkDate) {
            para.checkDate = moment(para.checkDate).format('YYYY-MM-DD')
          }
          if (para.nextCheckDate) {
            para.nextCheckDate = moment(para.nextCheckDate).format('YYYY-MM-DD')
          }
          let api = this.isCreate ? safeAnnexInsert : safeAnnexUpdate
          await api(para)
          this.$antMessage.success('保存成功')
          this.$router.push({
            path: '/safeManage/deviceSafeManage/specialeDevice/safeAttachAccount'
          })
        }
      })
    }, 250) ,
  }
}
</script>

<style>
</style>