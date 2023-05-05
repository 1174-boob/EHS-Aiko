<template>
  <HasFixedBottomWrapper>
    <div class="form-content">
      <a-form-model ref="newlyForm" :model="newlyForm" :rules="newlyRules" :colon="false">
        <a-row class="m-t-20">
          <a-col :span="12">
            <a-form-model-item label="申请人" prop="applicant" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.applicant" placeholder="请输入申请人" disabled />
            </a-form-model-item>
            <!-- <CommonSearchItem ref="commonSearchItem" :CommonFormInline="newlyForm" :rules="newlyRules" :notTablePage="true" :labelCol="labelCol" :wrapperCol="wrapperCol" :hasDepartment="true" deptLabel="使用部门" :departmentMultiple="true" @corporationChange="corporationChange"></CommonSearchItem>
            <a-form-model-item label="申请人部门" prop="applicantDept" :label-col="labelCol" :wrapper-col="wrapperCol">
              <OrganizeLazyTree v-model="newlyForm.applicantDept" ref="organizeLazyTree" @deptFormValidator="applicantDeptValidator"/>
            </a-form-model-item> -->
            <CommonDept ref="commonSearchItem" :CommonFormInline="newlyForm" :rules="newlyRules" :notTablePage="true" :hasDepartment="true" @corporationChange="corporationChange"  @corporationDeptChange="corporationDeptChange" :labelCol="labelCol" :wrapperCol="wrapperCol"></CommonDept>
            <a-form-model-item class="flex" label="使用部门" prop="deptIds" :label-col="labelCol" :wrapper-col="wrapperCol">
              <dept-tree :placeholder="'请选择使用部门'" multiple v-model="newlyForm.deptIds" :deptData="deptData" @change="(id,name)=>draftChange(id,name,'deptName')" allowClear></dept-tree>
            </a-form-model-item>
            <a-form-model-item class="flex" label="申请人部门" prop="applicantDept" :label-col="labelCol" :wrapper-col="wrapperCol">
              <dept-tree :placeholder="'请选择申请人部门'" v-model="newlyForm.applicantDept" :deptData="deptData" allowClear></dept-tree>
            </a-form-model-item>
            <a-form-model-item label="标题" prop="title" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.title" placeholder="请输入标题" allowClear />
            </a-form-model-item>
            <a-form-model-item label="新导入类型" prop="importType" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="newlyForm.importType" placeholder="请选择新导入类型">
                <a-select-option v-for="item of newlyType" :value="item.value" :key="item.value">{{item.label}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="化学品名称" prop="chemicalsId" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.chemicalsId" placeholder="请输入化学品名称" allowClear />
            </a-form-model-item>
            <a-form-model-item label="形态" prop="shape" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="newlyForm.shape" placeholder="请选择形态" show-search :filter-option="filterOption">
                <a-select-option v-for="item in form" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="供应厂商" prop="supplier" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.supplier" placeholder="请输入供应厂商" allowClear />
            </a-form-model-item>
            <a-form-model-item label="主要成分" prop="mainIngredient" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.mainIngredient" placeholder="请输入主要成分" allowClear />
            </a-form-model-item>
            <a-form-model-item label="化学品危险性" prop="chemicalHazard" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.chemicalHazard" placeholder="请输入化学品危险性" allowClear />
            </a-form-model-item>
            <a-form-model-item label="新导入化学品目的" prop="importPurpose" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.importPurpose" placeholder="请输入新导入化学品目的" allowClear />
            </a-form-model-item>
            <a-form-model-item label="可能发生的风险描述" prop="possibleRisks" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.possibleRisks" placeholder="请输入可能发生的风险描述" allowClear />
            </a-form-model-item>
            <a-form-model-item label="供应方式" prop="supplyMethod" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.supplyMethod" placeholder="请输入供应方式" allowClear />
            </a-form-model-item>
            <a-form-model-item label="使用设备" prop="useEquipment" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.useEquipment" placeholder="请输入使用设备" allowClear />
            </a-form-model-item>
            <a-form-model-item label="使用区域" prop="appliedArea" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.appliedArea" placeholder="请输入使用区域" allowClear />
            </a-form-model-item>
            <a-form-model-item label="月使用量" prop="monthlyUsage" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.monthlyUsage" placeholder="请输入月使用量" allowClear />
            </a-form-model-item>
            <a-form-model-item label="人员接触频率" prop="contactFrequency" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.contactFrequency" placeholder="请输入人员接触频率" allowClear />
            </a-form-model-item>
            <a-form-model-item label="接触原因" prop="contactReason" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.contactReason" placeholder="请输入接触原因" allowClear />
            </a-form-model-item>
            <a-form-model-item label="工程防护措施" prop="protectiveMeasures" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.protectiveMeasures" placeholder="请输入工程防护措施" allowClear />
            </a-form-model-item>
            <a-form-model-item label="管理措施" prop="managementMeasures" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.managementMeasures" placeholder="请输入管理措施" allowClear />
            </a-form-model-item>
            <a-form-model-item label="个人防护措施" prop="personalMeasures" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.personalMeasures" placeholder="请输入个人防护措施" allowClear />
            </a-form-model-item>
            <a-form-model-item label="计划入厂日期" prop="admissionDate" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker v-model="newlyForm.admissionDate" />
            </a-form-model-item>
            <a-form-model-item label="带入数量" prop="bringNum" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.bringNum" placeholder="请输入带入数量" allowClear />
            </a-form-model-item>
            <a-form-model-item label="测试期限" prop="testDate" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker v-model="newlyForm.testDate" />
            </a-form-model-item>
            <a-form-model-item label="测试管控措施" prop="controlMeasures" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.controlMeasures" placeholder="请输入测试管控措施" allowClear />
            </a-form-model-item>
            <staffOrDept :labelTitle="'测试人员'" :checkedTreeNode="checkedTreeNode" :deptTreeId="deptTreeId" :treeRoles="newlyRules" :propKey="'testPerson'" @getTreeData="getTreeData" :labelCol="labelCol" :wrapperCol="wrapperCol"></staffOrDept>
            <a-form-model-item label="MSDS资料名称" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.materialName" placeholder="请输入MSDS资料名称" allowClear />
            </a-form-model-item>
            <a-form-model-item label="版本" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="newlyForm.version" placeholder="请输入版本" allowClear />
            </a-form-model-item>
            <a-form-model-item label="有效期" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker v-model="newlyForm.expiredTime"/>
            </a-form-model-item>
            <a-form-model-item label="MSDS资料" :label-col="labelCol" :wrapper-col="wrapperCol">
              <UploadBtnStyle :showAcceptText="true" :accept="['.doc','.docx','.pdf','.xls','.xlsx','.ppt']" :showUploadList="true" :fileLists="fileLists" :btnText="'上传文件'" :btnType="'default'" @handleSuccess="handleSuccess"></UploadBtnStyle>
            </a-form-model-item>
            <a-form-model-item label="其他资料" :label-col="labelCol" :wrapper-col="wrapperCol">
              <UploadBtnStyle :showAcceptText="true" :accept="['.doc','.docx','.pdf','.xls','.xlsx','.ppt']" :showUploadList="true" :fileLists="otherFileLists" :btnText="'上传文件'" :btnType="'default'" @handleSuccess="handleOtherSuccess"></UploadBtnStyle>
            </a-form-model-item>
          </a-col>
          <a-col :span="12"></a-col>
        </a-row>
      </a-form-model>
    </div>
    <SelNodeUser v-model="selNodeUserModelShow" :plainOptions="plainOptions" />
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="goBack">返回</a-button>
          <a-button class="m-r-15" type="primary" @click="save">保存</a-button>
          <a-button type="primary" class="m-r-15" @click="saveConfirm">提交</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import SelNodeUser from "./components/selNodeUser.vue";
import { getDeptUserTree,DeptUserTree, getOrganizeList, manageAdd,manageUpdate,manageDetail,GetFirstNode,CreateProcess,PushTask } from "@/services/api.js";
import {  msdsApproveNodeUser } from '@/services/chemicalMsds'
import moment from "moment";
import { formValidator } from "@/utils/clx-form-validator.js";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
// import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
// import OrganizeLazyTreeStaff from '@/components/organizeLazyTree/organizeLazyTreeStaff.vue'
// import { rmDuplicatesByKey } from "@/utils/util";
import staffOrDept from "@/components/staffOrDept";
export default {
  components: {
    FixedBottom,
    UploadBtnStyle,
    SelNodeUser,
    staffOrDept
    // OrganizeLazyTreeStaff
  },
  data() {
    return {
      addEdit: "add", //add 新建，edit编辑
      checkedTreeNode:[],
      deptData:[],
      // 流程选择人员弹窗
      selNodeUserModelShow: false,
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
        applicant: '',
        deptIds: undefined,
        applicantDept: undefined,
        expiredTime: null,
        admissionDate: null,
        testDate: null,
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
        applicant: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        deptIds: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
        ],
        applicantDept: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        // organization: [
        //   { required: true, message: '不能为空', trigger: 'change' },
        // ],
        title: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        importType: [
          { required: true, message: '不能为空', trigger: 'change' },
        ],
        chemicalsId: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        shape: [
          { required: true, message: '不能为空', trigger: 'change' },
        ],
        // deptId: [
        //   { required: true, message: '不能为空', trigger: 'change' },
        // ],
        supplier: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        mainIngredient: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        chemicalHazard: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        importPurpose: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        possibleRisks: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        supplyMethod: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        useEquipment: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        appliedArea: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        monthlyUsage: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        contactFrequency: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        contactReason: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        protectiveMeasures: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        managementMeasures: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        personalMeasures: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        admissionDate: [
          { required: true, message: '请选择计划入厂日期', trigger: 'change' },
        ],
        bringNum: [
          { required: true, validator: this.inputValidator, trigger: 'change' },
        ],
        testDate: [
          { required: true, message: '请选择测试期限', trigger: 'change' },
        ],
        controlMeasures: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        testPerson: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
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
    // organize() { //从字典组里获取所属组织数据
    //   const dict = this.$store.state.setting.dictTypeData;
    //   const organize = dict.find(item => {
    //     return item.dictType == 'organize';
    //   });
    //   return organize.dictItem; //字典项
    // },
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
    const userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"));
    const jobNumber = userInfo.user.jobNumber?'/'+userInfo.user.jobNumber:'';
    this.newlyForm.applicant = userInfo.user.name + jobNumber;
    const adminDeptId = userInfo.user.adminDeptId;
    if(adminDeptId) {
      this.deptDisabled = true;
    } else {
      this.deptDisabled = false;
    }
    this.setRouterCode("newlyChemicals");
    console.log()
    if (this.$route.query.id) {
      this.getNewlyDetail(this.$route.query.id);
    }
  },
  methods: {
    goBack(){
      this.setKeepalive(true)
      this.$router.go(-1)
    },
    // 获取组织下所有部门
    corporationDeptChange(value) {
      console.log("vvvv",value);
      this.deptData = value;
    },
    // 组织改变
    corporationChange(val, deptId) {
      this.deptTreeId = deptId;
      this.$set(this.newlyForm,'deptIds',undefined);
      this.$set(this.newlyForm,'applicantDept',undefined);
      this.newlyForm.deptName = undefined;
    },
    // 部门改变
    draftChange(id,name,key) {
      this.newlyForm[key] = name.join();
    },
    // corporationChange(corId, deptId) {
    //   this.$set(this.newlyForm, "applicantDept", undefined)
    //   this.$refs.organizeLazyTree.consoleOrganizeTreeList = [];
    //   this.$refs.organizeLazyTree.getOrganizeLazyTree(deptId);
    // },
    getNewlyDetail(importId) {
      console.log(this.addEdit)
      this.addEdit = 'edit';
      this.importId = importId;
      manageDetail({importId}).then(res=>{
        const data = res.data;
        this.$refs.commonSearchItem.corporationChange(data.corporationId);
        console.log("data-----",data);
        this.newlyForm = {...data};
        this.newlyForm.expiredTime = data.expiredTime ? moment(data.expiredTime): null;
        this.newlyForm.admissionDate = data.admissionDate ? moment(data.admissionDate): null;
        this.newlyForm.testDate = data.testDate ? moment(data.testDate): null;
        // this.newlyForm.deptIds = data.deptIds.split(',');
        this.newlyForm.corporationId = data.corporationId || undefined;
        this.newlyForm.testPerson = data.testPerson.split(',');
        this.checkedTreeNode = this.newlyForm.testPerson;
        const echoMaterialList = data.echoMaterialList;
        const otherMaterialList = data.echoOtherMaterialList;
        console.log("this.newlyForm===",this.newlyForm);
        if(echoMaterialList) {
          const fileLists = [];
          for (let index = 0; index < echoMaterialList.length; index++) {
            const element = echoMaterialList[index];
            let fileObj = {
              uid: '-1',
              status: 'done',
            };
            fileObj.id = element.id;
            fileObj.name = element.sourceFileName + '.' + element.fileName.split('.')[1];
            fileObj.url = element.filePath;
            fileLists.push(fileObj);
          }
          this.fileLists = fileLists;
          this.handleSuccess(fileLists)
        }
        if(otherMaterialList) {
          const otherFileLists = [];
          for (let index = 0; index < otherMaterialList.length; index++) {
            const element = otherMaterialList[index];
            let fileObj = {
              uid: '-1',
              status: 'done',
            };
            fileObj.id = element.id;
            fileObj.name = element.sourceFileName + '.' + element.fileName.split('.')[1];
            fileObj.url = element.filePath;
            otherFileLists.push(fileObj);
          }
          this.otherFileLists = otherFileLists;
          this.handleOtherSuccess(otherFileLists)
        }
      })
      // .then(res => {
      //   let deptIds = this.newlyForm.deptIds;
      //   let applicantDept = this.newlyForm.applicantDept;
      //   if(this.newlyForm.deptIds && this.newlyForm.corporationId) {
      //     console.log(this.newlyForm, this.newlyForm.corporationId, this.newlyForm.deptIds)
      //     this.$refs.commonSearchItem.corporationChange(this.newlyForm.corporationId, this.newlyForm.deptIds).then(res => {
      //       this.$refs.organizeLazyTree.getOrganizeLazyTree(res, true).then(res1 => {
      //         this.$refs.organizeLazyTree.getOrganizeEmersionTree(this.newlyForm.applicantDept, res);
      //         this.$set(this.newlyForm, "deptIds", deptIds);
      //         this.$set(this.newlyForm, "applicantDept", applicantDept);
      //       });
      //     })
      //   }
      // })
      .catch(err=>{
        console.log(err);
      })
    },
    // 获取用户组织树
    // getDeptUserTree() {
    //   DeptUserTree().then(res => {
    //     this.userTreeData = [res.data];
    //   }).catch(err => {
    //     console.log(err);
    //   })
    // },
    // 选择测试人员
    getTreeData(value) {
      this.newlyForm.testPerson = value.treeIdList;
      if (!formValidator.formItemValidate(this, "testPerson", "newlyForm")) {
        return;
      }
    },
    // applicantDeptValidator(val) {
    //   formValidator.formItemValidate(this, 'applicantDept', 'newlyForm')
    // },
    // deptFormValidator(val) {
    //   formValidator.formItemValidate(this, 'deptIds', 'newlyForm')
    // },
    // 下拉框模糊搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    // 测试人员模糊筛选
    // filterUserTree(inputValue, treeNode) {
    //   return treeNode.data.props.title.includes(inputValue)
    // },
    // MSDS资料上传成功
    handleSuccess(data) {
      this.fileDetail = [];
      this.newlyForm.materialList = [];
      for (let value of data) {
        const detail = {};
        let id = value.response ? value.response.data.id : value.id;
        detail.uid = value.response ? value.response.data.id : value.uid;
        detail.url = value.response ? value.response.data.url : value.url;
        detail.name = value.name;
        this.fileDetail.push(detail);
        this.newlyForm.materialList.push(id);
      }
    },
    // 其他资料上传成功
    handleOtherSuccess(data) {
      this.fileDetail = [];
      this.newlyForm.otherMaterialList = [];
      for (let value of data) {
        const detail = {};
        let id = value.response ? value.response.data.id : value.id;
        detail.uid = value.response ? value.response.data.id : value.uid;
        detail.url = value.response ? value.response.data.url : value.url;
        detail.name = value.name;
        this.fileDetail.push(detail);
        this.newlyForm.otherMaterialList.push(id);
      }
    },
    //获取首节点信息
    getFirstNode() {
      console.log("this.deployId----",this.deployId);
      let para = {
        deployId: this.deployId
      }
      return GetFirstNode(para)
    },
    // 创建流程-获取taskId
    createProcessData(infoStatus) {
      //根据infoStatus获取taskId
      let para = {
        deployId: this.deployId,
        module: new Date().getTime(),
        map: {}
      }
      para.map[infoStatus] = infoStatus
      return CreateProcess(para)
    },
    //获取节点用户信息
    getUserNodeInfo(infoStatus) {
      console.log('infoStatus', infoStatus);
      let para = {
        node: infoStatus,
        corporationId:this.newlyForm.corporationId || undefined
      }
      return msdsApproveNodeUser(para)
        .then(res => {
          const { data } = res
          this.plainOptions = (data || []).map(item => {
            const { userId: value, name: label } = item
            return { value, label }
          })
        })
        .catch(err => { })
    },

    saveConfirm() {
      if (!formValidator.formAll(this, 'newlyForm')) {
        return;
      }
      console.log("uuuuuuuuuuuuuu",this.newlyForm);
      this.getFirstNode()
        .then(res => {
          return res
        })
        .then(firstNodeData => {  //创建流程
          console.log('获取首节点信息', firstNodeData);
          const { id } = firstNodeData.data
          return Promise.all([this.createProcessData(id), this.getUserNodeInfo(id)])
            .then(resArr => {
              console.log("yyyiiii----",resArr);
              let { taskId,processId,code } = resArr[0].data
              this.flowData = {
                infoStatus: id,
                taskId,
                processId,
                docCode: code
              }
              // this.cancelLoading();
              this.selNodeUserModelShow = true
            })
        })
        .catch(err => {
          // 任何一步失败 保存到草稿箱
          this.save();
        })
      
    },
    // 保存
    save() {
      console.log(33333, this.newlyForm)
      const params = {
        ...this.newlyForm,
        admissionDate: this.newlyForm.admissionDate ? this.newlyForm.admissionDate.format("YYYY-MM-DD"):null,
        testDate: this.newlyForm.testDate ? this.newlyForm.testDate.format("YYYY-MM-DD"):null,
        expiredTime: this.newlyForm.expiredTime ? this.newlyForm.expiredTime.format("YYYY-MM-DD") : null,
        // deptIds: this.newlyForm.deptIds.join(),
        testPerson: this.newlyForm.testPerson ? this.newlyForm.testPerson.join():'',
        draftStatus: 1,
        importId: this.addEdit == 'edit' ? this.importId : undefined,
      };
      if(this.addEdit == 'add') { //新增
        manageAdd(params).then(res => {
          this.$antMessage.success('保存成功');
          const route = '/safeManage/chemicalSafeManage/chemicalListManage/newlyChemicalsDraft';
          this.$router.push(route);
        }).catch(err => {
          console.log(err);
        })
      } else { //编辑
        manageUpdate(params).then(res => {
          const route = '/safeManage/chemicalSafeManage/chemicalListManage/newlyChemicalsDraft';
          this.$router.push(route);
          this.$antMessage.success('修改成功');
        }).catch(err => {
          console.log(err);
        })
      }
    },
    // 提交
    saveHandler(handler) {
      console.log("------",this.newlyForm);
      const params = {
        ...this.newlyForm,
        handler: handler ? handler.join() : null,
        admissionDate: this.newlyForm.admissionDate.format("YYYY-MM-DD"),
        testDate: this.newlyForm.testDate.format("YYYY-MM-DD"),
        expiredTime: this.newlyForm.expiredTime ? this.newlyForm.expiredTime.format("YYYY-MM-DD") : null,
        // deptId: this.newlyForm.deptIds.join(),
        testPerson: this.newlyForm.testPerson.join(),
        draftStatus: 2,
        ...this.flowData,
        importId: this.addEdit == 'edit' ? this.importId : undefined,
      };
      console.log(this.addEdit, this.addEdit == 'add')
      if(this.addEdit == 'add') { //新增
        return manageAdd(params).then(res => {
          let id = res.data.id;
          if(id) {
            this.pushTask(id,handler);
          }
          this.$antMessage.success('提交成功');
          const route = '/safeManage/chemicalSafeManage/chemicalListManage/newlyChemicals';
          this.$router.push(route);
        }).catch(err => {
          console.log(err);
        })
      } else { //编辑
        return manageUpdate(params).then(res => {
          let id = res.data.id;
          if(id) {
            this.pushTask(id,handler);
          }
          const route = '/safeManage/chemicalSafeManage/chemicalListManage/newlyChemicals';
          this.$router.push(route);
          this.$antMessage.success('提交成功');
        }).catch(err => {
          console.log(err);
        })
      }
    },
    // 代办推送
    async pushTask(id,handler) {
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/safeManage/chemicalSafeManage/chemicalListManage/handleNewly&newlyChemicalsId=${this.id}`
      const pushTask = await PushTask({
        title: "新导入化学品审批",
        approval:'newlyChemicals',
        userId: handler.join(),
        docId: this.flowData.processId,
        taskId: this.flowData.taskId,
        url: url,
        docNumber: this.flowData.docCode || '',   //业务id
      })
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