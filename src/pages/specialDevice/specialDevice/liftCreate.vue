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
            <staffOrDept :onPreview="disabled" :labelTitle="'保管人'" :checkAbel="false" :checkedTreeNode="checkedTreeNode" :deptTreeId="deptTreeId" :treeRoles="newlyRules" :propKey="'testPerson'" @getTreeData="getTreeData" :labelCol="labelCol" :wrapperCol="wrapperCol"></staffOrDept>
            <a-form-model-item label="设备类别" prop="specialEquipmentDetail.elevatorType" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select :disabled="disabled" v-model="newlyForm.specialEquipmentDetail.elevatorType" placeholder="请选择设备类别">
                <a-select-option v-for="item of elevatorTypeOptions" :value="item.key" :key="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="设备位置" prop="specialEquipmentDetail.equipmentLocation" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.equipmentLocation" placeholder="最多可输入50字" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="型号规格" prop="specialEquipmentDetail.equipmentSpecifications" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.equipmentSpecifications" placeholder="最多可输入50字" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="出厂编号" prop="specialEquipmentDetail.equipmentOutsideNum" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.equipmentOutsideNum" placeholder="最多可输入50字" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="制造日期" prop="specialEquipmentDetail.equipmentBuildDate" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker :disabled="disabled" format="YYYY-MM-DD" v-model.trim="newlyForm.specialEquipmentDetail.equipmentBuildDate" placeholder="制造日期" allowClear :maxLength="50"/>
            </a-form-model-item>
            <a-form-model-item label="运行速度" prop="specialEquipmentDetail.equipmentSpeed" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input-number :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.equipmentSpeed" :min="0" placeholder="运行速度" allowClear :maxLength="50"/> m/s
            </a-form-model-item>
            <a-form-model-item label="额定载荷" prop="specialEquipmentDetail.equipmentLoadLimit" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input-number :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.equipmentLoadLimit" :min="0" placeholder="额定载荷" allowClear :maxLength="50"/> t
            </a-form-model-item>
            <a-form-model-item label="提升高度" prop="specialEquipmentDetail.equipmentHeight" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input-number :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.equipmentHeight" :min="0" placeholder="提升高度" allowClear :maxLength="50"/> m
            </a-form-model-item>
            <a-form-model-item label="电梯层站" prop="specialEquipmentDetail.elevatorFloor" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input-number :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.elevatorFloor" :min="0" placeholder="电梯层站" allowClear :maxLength="50"/> 
            </a-form-model-item>
            <a-form-model-item label="维保单位" prop="specialEquipmentDetail.equipmentMaintainDept" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model.trim="newlyForm.specialEquipmentDetail.equipmentMaintainDept" placeholder="请输入维保单位" allowClear :maxLength="50"/>
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
              <a-date-picker :disabled="disabled" format="YYYY-MM-DD" v-model.trim="newlyForm.checkDate" placeholder="请选择检验日期" allowClear :maxLength="50"/>
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
        specialEquipmentDetail : { infoFileIdList : [] },
        equipmentType: '2'
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
        'specialEquipmentDetail.elevatorType': [
          { required: true, message: '请选择设备类别', trigger: ['blur', 'change'] },
        ],
        'specialEquipmentDetail.equipmentLocation': [
          { required: true, message: '请输入设备位置', trigger: ['blur', 'change'] },
        ],
        'specialEquipmentDetail.equipmentMaintainDept': [
          { required: true, message: '请输入维保单位', trigger: ['blur', 'change'] },
        ],
        useRegistryNum: [
          { required: true, message: '请输入使用登记证编号', trigger: ['blur', 'change'] },
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
  computed: {
    form() { //从字典组里获取化学品形态数据
      const dict = this.$store.state.setting.dictTypeData;
      const form = dict.find(item => {
        return item.dictType == 'form';
      });
      return form.dictItem; //字典项
    },
    
    chemical() { //从字典组里获取化学品名称数据
      const dict = this.$store.state.setting.dictTypeData;
      const chemical = dict.find(item => {
        return item.dictType == 'chemical';
      });
      chemical.dictItem.forEach(ele => {
        this.$set(this.chemicalDict, ele.dictValue, ele.dictLabel)
      });
      return chemical.dictItem;
    },
    deployId() { //从字典组里获取化学品名称数据
      const dict = this.$store.state.setting.dictTypeData;
      const approvalType = dict.find(item => {
        return item.dictType === 'approvalType';
      });
      console.log("------approvalType",approvalType);
      const dictItem = approvalType.dictItem;
      const importApproval = dictItem.filter(val=>{
        return val.dictLabel === 'IMPORTAPPROVAL';
      })
      console.log("iiiimportApproval---",importApproval);
      return importApproval[0].dictValue;
    },
    corporationList() {
      return this.$store.state.setting.corporationList;
    },
    // 目前存在的数据id集合
    // organizeIdS() {
    //   let ids = this.userTreeData.map(item => {
    //     return item.id
    //   })
    //   return ids
    // },
  },
  created() {
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