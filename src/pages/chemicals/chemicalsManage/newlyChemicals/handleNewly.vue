<template>
  <div class="post-wrapper flex clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div class="flex-1 position-rel pd-b-100">
      <div class="form-content clx-show-scroll beauty-scroll">
        <a-form-model ref="ruleForm" :model="newlyForm" :rules="newlyRules" :colon="false">
          <a-row class="m-t-20">
            <a-col :span="20">
              <a-form-model-item label="申请人" prop="applicant" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.applicant" placeholder="请输入申请人" disabled />
              </a-form-model-item>
              <!-- <CommonSearchItem :disabled="true" ref="commonSearchItem" :CommonFormInline="newlyForm" :rules="newlyRules" :notTablePage="true" :labelCol="labelCol" :wrapperCol="wrapperCol" :hasDepartment="true" deptLabel="使用部门" :departmentMultiple="true"></CommonSearchItem>
              <a-form-model-item label="申请人部门" prop="applicantDept" :label-col="labelCol" :wrapper-col="wrapperCol">
                <OrganizeLazyTree disabled v-model="newlyForm.applicantDept" ref="organizeLazyTree" @deptFormValidator="applicantDeptValidator" :disabledExtend="false" />
              </a-form-model-item> -->
              <CommonDept ref="commonSearchItem" :CommonFormInline="newlyForm" :rules="newlyRules" :hasDepartment="true" :notTablePage="true" @corporationDeptChange="corporationDeptChange" :labelCol="labelCol" :wrapperCol="wrapperCol" disabled></CommonDept>
              <a-form-model-item class="flex" label="使用部门" prop="deptIds" :label-col="labelCol" :wrapper-col="wrapperCol">
                <dept-tree :placeholder="'请选择使用部门'" multiple v-model="newlyForm.deptIds" :deptData="deptData" disabled></dept-tree>
              </a-form-model-item>
              <a-form-model-item class="flex" label="申请人部门" prop="applicantDept" :label-col="labelCol" :wrapper-col="wrapperCol">
                <dept-tree :placeholder="'请选择申请人部门'" v-model="newlyForm.applicantDept" :deptData="deptData" disabled></dept-tree>
              </a-form-model-item>
              <a-form-model-item label="标题" prop="title" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.title" placeholder="请输入标题" disabled />
              </a-form-model-item>
              <a-form-model-item label="新导入类型" prop="importType" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-select v-model="newlyForm.importType" placeholder="请选择新导入类型" disabled>
                  <a-select-option v-for="item of newlyType" :value="item.value" :key="item.value">{{item.label}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="化学品名称" prop="chemicalsId" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.chemicalsId" placeholder="请输入化学品名称" disabled/>
              </a-form-model-item>
              <a-form-model-item label="形态" prop="shape" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-select v-model="newlyForm.shape" placeholder="请选择形态" disabled>
                  <a-select-option v-for="item in form" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="供应厂商" prop="supplier" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.supplier" placeholder="请输入供应厂商" disabled />
              </a-form-model-item>
              <a-form-model-item label="主要成分" prop="mainIngredient" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.mainIngredient" placeholder="请输入主要成分" disabled />
              </a-form-model-item>
              <a-form-model-item label="化学品危险性" prop="chemicalHazard" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.chemicalHazard" placeholder="请输入化学品危险性" disabled />
              </a-form-model-item>
              <a-form-model-item label="新导入化学品目的" prop="importPurpose" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.importPurpose" placeholder="请输入新导入化学品目的" disabled />
              </a-form-model-item>
              <a-form-model-item label="可能发生的风险描述" prop="possibleRisks" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.possibleRisks" placeholder="请输入可能发生的风险描述" disabled />
              </a-form-model-item>
              <a-form-model-item label="供应方式" prop="supplyMethod" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.supplyMethod" placeholder="请输入供应方式" disabled />
              </a-form-model-item>
              <a-form-model-item label="使用设备" prop="useEquipment" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.useEquipment" placeholder="请输入使用设备" disabled />
              </a-form-model-item>
              <a-form-model-item label="使用区域" prop="appliedArea" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.appliedArea" placeholder="请输入使用区域" disabled />
              </a-form-model-item>
              <a-form-model-item label="月使用量" prop="monthlyUsage" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.monthlyUsage" placeholder="请输入月使用量" disabled />
              </a-form-model-item>
              <a-form-model-item label="人员接触频率" prop="contactFrequency" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.contactFrequency" placeholder="请输入人员接触频率" disabled />
              </a-form-model-item>
              <a-form-model-item label="接触原因" prop="contactReason" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.contactReason" placeholder="请输入接触原因" disabled />
              </a-form-model-item>
              <a-form-model-item label="工程防护措施" prop="protectiveMeasures" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.protectiveMeasures" placeholder="请输入工程防护措施" disabled />
              </a-form-model-item>
              <a-form-model-item label="管理措施" prop="managementMeasures" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.managementMeasures" placeholder="请输入管理措施" disabled />
              </a-form-model-item>
              <a-form-model-item label="个人防护措施" prop="personalMeasures" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.personalMeasures" placeholder="请输入个人防护措施" disabled />
              </a-form-model-item>
              <a-form-model-item label="计划入厂日期" prop="admissionDate" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-date-picker v-model.trim="newlyForm.admissionDate" disabled />
              </a-form-model-item>
              <a-form-model-item label="带入数量" prop="bringNum" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.bringNum" placeholder="请输入带入数量" disabled />
              </a-form-model-item>
              <a-form-model-item label="测试期限" prop="testDate" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-date-picker v-model.trim="newlyForm.testDate" disabled />
              </a-form-model-item>
              <a-form-model-item label="测试管控措施" prop="controlMeasures" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.controlMeasures" placeholder="请输入测试管控措施" disabled />
              </a-form-model-item>
              <!-- <a-form-model-item label="测试人员" prop="testPerson" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-tree-select
                  disabled
                  v-model="newlyForm.testPerson"
                  :replaceFields="userTreeFields"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '260px', overflow: 'auto' }"
                  :tree-data="userTreeData"
                  placeholder="请选择测试人员"
                ></a-tree-select>
              </a-form-model-item> -->
              <staffOrDept :labelTitle="'测试人员'" :checkedTreeNode="checkedTreeNode" :treeRoles="newlyRules" :propKey="'testPerson'" :onPreview="true" :labelCol="labelCol" :wrapperCol="wrapperCol"></staffOrDept>
              <a-form-model-item label="MSDS资料名称" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.materialName" placeholder="请输入MSDS资料名称" disabled />
              </a-form-model-item>
              <a-form-model-item label="版本" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input v-model.trim="newlyForm.version" placeholder="请输入版本" disabled />
              </a-form-model-item>
              <a-form-model-item label="有效期" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-date-picker v-model="newlyForm.expiredTime" disabled />
              </a-form-model-item>
              <a-form-model-item label="MSDS资料" :label-col="labelCol" :wrapper-col="wrapperCol">
                <ul class="download" v-if="newlyForm.echoMaterialList && newlyForm.echoMaterialList.length>=1">
                  <li v-for="file of newlyForm.echoMaterialList">{{file.sourceFileName}}<span class="btn" @click="downloadFile(file.filePath)">下载</span></li>
                </ul>
              </a-form-model-item>
              <a-form-model-item label="其他资料" :label-col="labelCol" :wrapper-col="wrapperCol">
                <ul class="download" v-if="newlyForm.echoOtherMaterialList && newlyForm.echoOtherMaterialList.length>=1">
                  <li v-for="file of newlyForm.echoOtherMaterialList">{{file.sourceFileName}}<span class="btn" @click="downloadFile(file.filePath)">下载</span></li>
                </ul>
              </a-form-model-item>
            </a-col>
            <!-- <a-col :span="12"></a-col> -->
          </a-row>
        </a-form-model>
      </div>

      <div slot="fixedBottom">
        <FixedBottom>
          <div>
            <a-button class="m-r-15" @click="goBack">返回</a-button>
            <a-button type="primary" class="m-r-15" @click="submit('reject')" v-if="handleNewly">驳回</a-button>
            <a-button type="primary" class="m-r-15" @click="submit('pass')" v-if="handleNewly">通过</a-button>
          </div>
        </FixedBottom>
      </div>
      <HandleModel
        v-model="handleModelShow"
        :modelType="modelType"
        :temporaryEntryId="importId"
        :detailObj="newlyForm"
        :nextInfoStatus="nextInfoStatus"
        :plainOptions="plainOptions"
        :nextInfoStatusName="nextInfoStatusName"
      />
    </div>
    <Log :flowLogList="logData"></Log>
  </div>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import HandleModel from './components/handleModel.vue';
import { getFlowLogApi,manageDetail,DeptUserTree,GetNextTask } from "@/services/api.js";
import { msdsApproveNodeUser } from '@/services/chemicalMsds'
import moment from "moment";
import cancelLoading from "@/mixin/cancelLoading";
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue';
import Log from "@/components/flowLog/flowLog.vue"
import staffOrDept from "@/components/staffOrDept";
import { getQueryVariable } from "@/utils/util.js";
export default {
  components: {
    FixedBottom,
    HandleModel,
    OrganizeLazyTree,
    staffOrDept,
    Log
  },
  mixins: [cancelLoading],
  data() {
    return {
      checkedTreeNode:[],
      handleNewly: false, //false-查看，true-处理
      deptData:[],
      logData: [], // 日志数据
      importId: undefined,
      labelCol: { span: 6 },
      wrapperCol: { span: 17 },
      handleModelShow: false,
      createUserId: null,
      newlyForm: {
        applicant: '',
      },
      // treeData: [],
      // chemicalDict:{},
      // userTreeData:[],
      // replaceFields: { children: 'childDeptList', title: 'deptName', key: 'deptId', value: 'deptId' },
      // userTreeFields: { value: 'key' },
      newlyType: [
        { value: "1", label: '二元化导入' },
        { value: "2", label: '新增使用' },
      ],
      // 下一个节点
      nextInfoStatus: undefined,
      nextInfoStatusName: '',
      modelType: 'pass',
      plainOptions: [],
      newlyRules: {
        applicant: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        applicantDept: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
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
          { required: true, message: '请选择化学品形态', trigger: 'change' },
        ],
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
      }
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
    isEnd() {
      let end = this.nextInfoStatus.indexOf('end') == 0
      return end
    },
    // chemical() { //从字典组里获取化学品名称数据
    //   const dict = this.$store.state.setting.dictTypeData;
    //   const chemical = dict.find(item => {
    //     return item.dictType == 'chemical';
    //   });
    //   chemical.dictItem.forEach(ele => {
    //     this.$set(this.chemicalDict, ele.dictValue, ele.dictLabel)
    //   });
    //   return chemical.dictItem;
    // },
    // corporationList() {
    //   return this.$store.state.setting.corporationList;
    // }
  },
  beforeRouteEnter(to, from, next) {
    const id = to.query.id || getQueryVariable("newlyChemicalsId");
    if (id) {
      next(vm => {
        vm.setRouterCode("newlyChemicals");
        vm.importId = id;
        vm.getNewlyDetail(id);
      })
    } else {
      next(vm=>{
        vm.setRouterCode("newlyChemicals");
      })
    }
  },
  methods: {
    goBack(){
      this.setKeepalive(true)
      this.$router.push({
        path:'/safeManage/chemicalSafeManage/chemicalListManage/newlyChemicals'
      })
    },
    // 获取组织下所有部门
    corporationDeptChange(value) {
      this.deptData = value;
    },
    getNewlyDetail(importId) {
      const handleNewly = sessionStorage.getItem("handleNewly");
      this.handleNewly = handleNewly == 1 ? true : false;
      manageDetail({importId}).then(res=>{
        const data = res.data;
        this.newlyForm = data;
        this.$refs.commonSearchItem.corporationChange(data.corporationId);
        if(data.processId) {
          this.getLogData(data.processId,data.handler);
        }
        this.createUserId = data.createUserId || null
        this.newlyForm.corporationId = data.corporationId ||undefined
        this.checkedTreeNode = data.testPerson.split(',');
        this.newlyForm.expiredTime = data.expiredTime ? moment(data.expiredTime): null;
        this.newlyForm.admissionDate = data.admissionDate ? moment(data.admissionDate): null;
        this.newlyForm.testDate = data.testDate ? moment(data.testDate): null;
        if(this.handleNewly) {
          this.getNextTask(data.taskId, data.infoStatus);
        }
      })
      // .then(res => {
      //   let deptIds = this.newlyForm.deptIds;
      //   if(this.newlyForm.deptIds && this.newlyForm.corporationId) {
      //     this.$refs.commonSearchItem.corporationChange(this.newlyForm.corporationId, this.newlyForm.deptIds).then(res => {
      //       this.$refs.organizeLazyTree.getOrganizeLazyTree(res, true).then(res1 => {
      //         this.$set(this.newlyForm, "deptIds", deptIds)
      //         this.$refs.organizeLazyTree.getOrganizeEmersionTree(this.newlyForm.applicantDept, res);
      //       });
      //     }).then(res => {

      //     })
      //   }
      // })
      .catch(err=>{
        console.log(err);
      })
    },
    async getLogData(processId,handler) {
      let para = {
        handler:handler.split(','),
        processInstanceId: processId,
      }
      const data = await getFlowLogApi(para);
      this.logData = data.data || [];
    },
    // 获取用户组织树
    // getDeptUserTree() {
    //   DeptUserTree().then(res => {
    //     this.userTreeData = [res.data];
    //   }).catch(err => {
    //     console.log(err);
    //   })
    // },
    applicantDeptValidator(val) {
      formValidator.formItemValidate(this, 'applicantDept', 'newlyForm')
    },
    // deptFormValidator(val) {
    //   formValidator.formItemValidate(this, 'deptId', 'newlyForm')
    // },
    //处理 获取下一节点infoStatus信息
    getNextTask(taskId, infoStatus) {
      let para = {
        taskId,
        param: {}
      }
      para.param[infoStatus] = infoStatus
      GetNextTask(para)
        .then(res => {
          // {
          //   id: "STAFF_FIRST"
          //   param: {SECTION_CHIEF: "SECTION_CHIEF"}
          // }
          this.nextInfoStatus = res.data.id
          this.nextInfoStatusName = res.data.name
        })
        .catch(err => { })
    },
    submit(modelType) {
      this.modelType = modelType
      if (modelType == 'pass') {
        this.handleLoading();
        // 先获取节点用户信息
        let infoStatus = this.nextInfoStatus
        this.getUserNodeInfo(infoStatus)
          .then(res => {
            this.handleModelShow = true
          })
          .finally(() => {
            this.cancelLoading();
          })
      } else {
        this.handleModelShow = true
      }
    },
    //获取节点用户信息
    getUserNodeInfo(infoStatus) {
      if (this.isEnd) {
        this.plainOptions = []
        return Promise.resolve()
      } else {
        let para = {
          node: infoStatus,
          userId: this.createUserId,
          createUserId:this.createUserId,
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
    // 下拉框模糊搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    // 下载文件
    downloadFile(filePath) {
      window.open(filePath)
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("handleNewly");
  }
}
</script>

<style lang="less" scoped>
.post-wrapper {
  /deep/ .fixed-bottom{
    bottom: 0;
    margin: 0;
    left: 0
  }
  /deep/ .log{
    flex: none;
  }
  .form-content {
    overflow: auto;
    height: 100%;
  }
}
  .download {
    li {
      margin-bottom: 10px;
    }
    .btn {
      margin-left: 10px;
      cursor: pointer;
      color: #0067cc;
    }
  }
@scrollbar-thumb: #ccc;
@scrollbar-track: transparent;
// 横向滚动条样式
.beauty-scroll {
  scrollbar-color: @scrollbar-thumb @scrollbar-track;
  scrollbar-width: thin;
  -ms-overflow-style: none;
  position: relative;

  &::-webkit-scrollbar {
    width: 3px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #ddd;
  }

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
    border-radius: 3px;
    background: @scrollbar-track;
  }
}
</style>