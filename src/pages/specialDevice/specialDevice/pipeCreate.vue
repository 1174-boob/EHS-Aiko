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
              <dept-tree :disabled="disabled" :placeholder="'请选择保管部门'" v-model="newlyForm.saveDeptCode" :deptData="deptData" @change="(id,name)=>saveDeptChange(id,name)" allowClear></dept-tree>
            </a-form-model-item>
            <staffOrDept :onPreview="disabled" :labelTitle="'保管人'" :checkAbel="true" :checkedTreeNode="checkedTreeNode" :deptTreeId="deptTreeId" :treeRoles="newlyRules" :propKey="'testPerson'" @getTreeData="getTreeData" :labelCol="labelCol" :wrapperCol="wrapperCol"></staffOrDept>
            <a-form-model-item label="设备名称" prop="equipmentName" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.equipmentName" placeholder="最多可输入50字" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="设备代码" prop="equipmentCode" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.equipmentCode" placeholder="最多可输入50字" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="型号规格" prop="specialEquipmentDetail.equipmentSpecifications" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.equipmentSpecifications" placeholder="最多可输入50字" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="管道编号" prop="specialEquipmentDetail.pipingNum" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.pipingNum" placeholder="最多可输入50字" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="管道起止点" prop="specialEquipmentDetail.pipingStartandend" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.pipingStartandend" placeholder="最多可输入50字" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="介质" prop="specialEquipmentDetail.equipmentMedium" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.equipmentMedium" placeholder="最多可输入50字" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="长度" prop="specialEquipmentDetail.pipingLength" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input-number :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.pipingLength" :min="0" placeholder="长度" allowClear :maxLength="50"/> KM
            </a-form-model-item>
            <a-form-model-item label="设计压力" prop="specialEquipmentDetail.equipmentDesignPower" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input-number :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.equipmentDesignPower" :min="0" placeholder="设计压力" allowClear :maxLength="50"/> Mpa
            </a-form-model-item>
            <a-form-model-item label="设计温度" prop="specialEquipmentDetail.equipmentDesignTemperature" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input-number :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.equipmentDesignTemperature"  placeholder="设计温度" allowClear :maxLength="50"/> ℃
            </a-form-model-item>
            <a-form-model-item label="最高使用压力" prop="specialEquipmentDetail.equipmentLimitPower" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input-number :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.equipmentLimitPower" :min="0" placeholder="使用压力" allowClear :maxLength="50"/> Mpa
            </a-form-model-item>
            <a-form-model-item label="使用温度" prop="specialEquipmentDetail.pipingUseTemperature" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input-number :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.pipingUseTemperature" placeholder="使用温度" allowClear :maxLength="50"/> ℃
            </a-form-model-item>
            <a-form-model-item label="安装单位" prop="specialEquipmentDetail.equipmentInstallDept" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.equipmentInstallDept" placeholder="最多可输入50字" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="使用登记证编号" prop="useRegistryNum" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.useRegistryNum" placeholder="最多可输入50字" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="设备状态" prop="equipmentStatus" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select :disabled="disabled" v-model="newlyForm.equipmentStatus" placeholder="请选择设备状态">
                <a-select-option v-for="item of equipmentStatusOptions" :value="item.key" :key="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="检验日期" prop="checkDate" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker :disabled="disabled" v-model.trim="newlyForm.checkDate" placeholder="请选择检验日期" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="下次检验日期" prop="nextCheckDate" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker :disabled="disabled" format="YYYY-MM-DD" v-model.trim="newlyForm.nextCheckDate" placeholder="请选择下次检验日期" allowClear :maxLength="50"/>
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
          <a-button class="m-r-15" @click="cancel">取消</a-button>
          <a-button type="primary" class="m-r-15" @click="save">确定</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import { getDeptUserTree,DeptUserTree, getOrganizeList, manageAdd,manageUpdate,manageDetail } from "@/services/api.js";
import moment from "moment";
import { formValidator } from "@/utils/clx-form-validator.js";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";

import staffOrDept from "@/components/staffOrDept";
import mixin from '../mixin'
export default {
  mixins: [mixin],
  components: {
    FixedBottom,
    UploadBtnStyle,
    staffOrDept
    // OrganizeLazyTreeStaff
  },
  data() {
    return {
      addEdit: "add", //add 新建，edit编辑
      checkedTreeNode:[],
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
        specialEquipmentDetail: { infoFileIdList: [] },
        equipmentType: '3'
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
        saveCorporationId: [
          { required: true, message: '请选择保管属地', trigger: ['blur', 'change'] },
        ],
        saveDeptCode: [
          { required: true, message: '请选择保管部门', trigger: ['blur', 'change'] },
        ],
        'specialEquipmentDetail.pipingNum': [
          { required: true, message: '请输入管道编号', trigger: ['blur', 'change'] },
        ],
        'specialEquipmentDetail.pipingStartandend': [
          { required: true, message: '请输入管道起止点', trigger: ['blur', 'change'] },
        ],
        'specialEquipmentDetail.equipmentMedium': [
          { required: true, message: '请输入介质', trigger: ['blur', 'change'] },
        ],
        'specialEquipmentDetail.pipingLength': [
          { required: true, message: '请输入长度', trigger: ['blur', 'change'] },
        ],
        'specialEquipmentDetail.equipmentDesignPower': [
          { required: true, message: '请输入设计压力', trigger: ['blur', 'change'] },
        ],
        'specialEquipmentDetail.equipmentDesignTemperature': [
          { required: true, message: '请输入设计温度', trigger: ['blur', 'change'] },
        ],
        useRegistryNum: [
          { required: true, message: '请输入使用登记证编号', trigger: ['blur', 'change'] },
        ],
        equipmentName: [
          { required: true, message: '请输入设备名称', trigger: ['blur', 'change'] },
        ],
        equipmentCode: [
          { required: true, message: '请输入设备代码', trigger: ['blur', 'change'] },
        ],
        equipmentStatus: [
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
  created() {
    if(sessionStorage.getItem("zconsole_userInfo")) {
      let adminDeptId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user.adminDeptId;
      this.$set(this.newlyForm, 'draftDeptCode', adminDeptId ? [adminDeptId] : []);
    }
    this.setRouterCode("specalDeviceAccount")
    if(this.isCreate) {
      this.initApplicant()
    } else {
      this.fetchDetail()
    }
  },
  methods: {
    
  }
}
</script>

<style>
</style>