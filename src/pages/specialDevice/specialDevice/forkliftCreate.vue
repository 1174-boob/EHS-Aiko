<template>
  <HasFixedBottomWrapper>
    <div class="form-content">
      <a-form-model ref="newlyForm" :model="newlyForm" :rules="newlyRules" :colon="false">
        <a-row class="m-t-20">
          <a-col :span="12">
            <CommonDept :disabled="disabled" ref="commonSearchItem" :CommonFormInline="newlyForm" :rules="newlyRules" :notTablePage="true" :hasDepartment="true" @corporationDeptChange="corporationDeptChange" :labelCol="labelCol" :wrapperCol="wrapperCol"></CommonDept>
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
            <a-form-model-item label="设备区分" prop="equipmentCategory" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select :disabled="disabled" :placeholder="'请选择设备区分'" v-model.trim="newlyForm.equipmentCategory"  show-search :filter-option="filterOption">
                <a-select-option v-for="item in equipmentCategory" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="车辆归属" prop="specialEquipmentDetail.belongTo" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select :disabled="disabled" :placeholder="'请选择车辆归属'" v-model.trim="newlyForm.specialEquipmentDetail.belongTo"  show-search :filter-option="filterOption">
                <a-select-option v-for="item in belongToList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="动力形式" prop="specialEquipmentDetail.forkliftPowerType" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.forkliftPowerType" placeholder="最多可输入50字" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="型号规格" prop="specialEquipmentDetail.equipmentSpecifications" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.equipmentSpecifications" placeholder="最多可输入50字" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="车架编号" prop="specialEquipmentDetail.forkliftChassisNum" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.forkliftChassisNum" placeholder="最多可输入50字" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="牌照编号" prop="specialEquipmentDetail.forkliftPlateNum" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.forkliftPlateNum" placeholder="最多可输入50字" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="制造单位" prop="specialEquipmentDetail.equipmentBuildDept" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.equipmentBuildDept" placeholder="最多可输入50字" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="登记证编号" prop="useRegistryNum" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.useRegistryNum" placeholder="最多可输入50字" allowClear :maxLength="50"/>
            </a-form-model-item>
            <!-- <a-form-model-item label="运行速度" prop="specialEquipmentDetail.equipmentSpeed" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input-number :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.equipmentSpeed" :min="0" placeholder="运行速度" allowClear :maxLength="50"/> Km/h
            </a-form-model-item> -->
            <a-form-model-item label="额定载荷" prop="specialEquipmentDetail.equipmentLoadLimit" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input-number :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.equipmentLoadLimit" :min="0" placeholder="额定载荷" allowClear :maxLength="50"/> t
            </a-form-model-item>
            <a-form-model-item label="登记时间" prop="specialEquipmentDetail.forkliftPlateDate" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker :disabled="disabled" format="YYYY-MM-DD" v-model.trim="newlyForm.specialEquipmentDetail.forkliftPlateDate" placeholder="请选择登记时间" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="设备状态" prop="equipmentStatus" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select :disabled="disabled" v-model="newlyForm.equipmentStatus" placeholder="请选择设备状态" show-search :filter-option="filterOption">
                <a-select-option v-for="item in equipmentStatusOptions" :value="item.key" :key="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="设备位置" prop="specialEquipmentDetail.equipmentLocation" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.equipmentLocation" placeholder="最多可输入50字" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="检验日期" prop="checkDate" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker :disabled="disabled" format="YYYY-MM-DD" v-model.trim="newlyForm.checkDate" placeholder="请选择检验日期" allowClear :maxLength="50"/>
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
            <a-form-model-item label="附图" prop="specialVehicleImagesList" :label-col="labelCol" :wrapper-col="wrapperCol">
              <upload-can-remove ref="editModel" :maxSize="10" :limit="20" :headImgs="specialVehicleImagesList" :handleSuccessName="'addFormUploadSuccess'" @addFormUploadSuccess="addFormUploadSuccess" :disabled="disabled"></upload-can-remove>
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
import { specialEquipmentInsert, specialEquipmentUpdate, specialEquipmentDetail } from "@/services/specialDevice.js";
import UploadCanRemove from "@/components/upload/uploadCanRemove.vue";
import moment from "moment";
import { formValidator } from "@/utils/clx-form-validator.js";
import dictionary from "@/utils/dictionary";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";

import staffOrDept from "@/components/staffOrDept";
import mixin from '../mixin'
export default {
  mixins: [mixin],
  components: {
    FixedBottom,
    UploadBtnStyle,
    staffOrDept,
    UploadCanRemove
    // OrganizeLazyTreeStaff
  },
  data() {
    return {
      addEdit: "add", //add 新建，edit编辑
      checkedTreeNode:[],
      deptDisabled: false,
      dictionary,
      belongToList:[],
      equipmentCategory:[],
      specialVehicleImagesList: [],
      flowData: {},
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      accept: '.doc,.docx,.pdf,.ppt',
      testDate: null,
      newlyForm: {
        specialEquipmentDetail: { infoFileIdList: [] },
        equipmentType: '0'
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
        'specialEquipmentDetail.forkliftPowerType': [
          { required: true, message: '请输入动力形式', trigger: ['blur', 'change'] },
        ],
        'specialEquipmentDetail.forkliftPlateNum': [
          { required: true, message: '请输入牌照编号', trigger: ['blur', 'change'] },
        ],
        'specialEquipmentDetail.equipmentLocation': [
          { required: true, message: '请选择设备位置', trigger: ['blur', 'change'] },
        ],
        useRegistryNum: [
          { required: true, message: '请输入登记证编号', trigger: ['blur', 'change'] },
        ],
        equipmentName: [
          { required: true, message: '请输入设备名称', trigger: ['blur', 'change'] },
        ],
        equipmentCode: [
          { required: true, message: '请输入设备代码', trigger: ['blur', 'change'] },
        ],
        equipmentCategory: [
          { required: true, message: '请选择设备区分', trigger: ['blur', 'change'] },
        ],
        'specialEquipmentDetail.forkliftPlateDate': [
          { required: true, message: '请选择登记时间', trigger: ['blur', 'change'] },
        ],
        equipmentStatus: [
          { required: true, message: '请选择设备状态', trigger: ['blur', 'change'] },
        ],
        'specialEquipmentDetail.belongTo': [
          { required: true, message: '请选择车辆归属', trigger: ['blur', 'change'] },
        ],
        checkDate: [
          { required: true, message: '请选择检验日期', trigger: ['blur', 'change'] },
        ],
        nextCheckDate: [
          { required: true, message: '请选择下次检验日期', trigger: ['blur', 'change'] },
        ],
        checkReportNum: [
          { required: true, message: '请输入检验报告编号', trigger: ['blur', 'change'] },
        ]
      },

    }
  },
  computed: {
  },
  created() {
    this.belongToList = dictionary("belongTo");
    this.equipmentCategory = dictionary("equipment_category");
    if(sessionStorage.getItem("zconsole_userInfo")) {
      let adminDeptId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user.adminDeptId;
      this.$set(this.newlyForm, 'draftDeptCode', adminDeptId ? [adminDeptId] : []);
    }
    this.setRouterCode("specialDeviceAccount")
    if(this.isCreate) {
      this.initApplicant()
    } else {
      this.fetchDetail()
    }
  },
  methods: {
    // 附图上传
    async addFormUploadSuccess(fileList) {
      let photoList = [];
      for(let item of fileList) {
        photoList.push(item.id)
      }
      this.newlyForm.specialVehicleImagesList = photoList;
      this.specialVehicleImagesList = fileList;
    },
    saveConfirm() {
      if (!formValidator.formAll(this, 'newlyForm')) {
        return;
      }
      
    },
    // 文本框校验
    inputValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("不能为空")
      } else if (value && value.length > 30) {
        return Promise.reject("不能超过30字")
      } else {
        callback()
      }
    },
  }
}
</script>

<style>
</style>