<template>
  <HasFixedBottomWrapper>
    <div class="left-box">
      <a-spin :spinning="spinning">
          <PageTitle>{{preview ? '查看':prepId ? "编辑" : '新建'}}应急演练</PageTitle>
          <div class="form-content">
            <a-form-model ref="emForm" :model="emForm" :rules="emRules" :colon="false" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-row class="m-t-20">
                <a-col :span="12">
                  <CommonDept ref="commonDept" :CommonFormInline="emForm" :rules="emRules" :notTablePage="true" :hasDepartment="true" @corporationChange="corporationChange" @corporationDeptChange="corporationDeptChange" :labelCol="labelCol" :wrapperCol="wrapperCol" :disabled="preview"></CommonDept>
                  <a-form-model-item label="起草人部门" prop="draftDepartcode">
                    <dept-tree :placeholder="'请选择起草人部门'" v-model="emForm.draftDepartcode" :deptData="deptData" @change="draftChange" :disabled="preview" allowClear></dept-tree>
                  </a-form-model-item>
                  <a-form-model-item label="起草人">
                    <span>{{emForm.draftCode ? (emForm.draftName + "/" + emForm.draftCode) : emForm.draftName}}</span>
                  </a-form-model-item>
                  <a-form-model-item label="预案名称" prop="eplanName">
                    <a-input v-model="emForm.eplanName" placeholder="请输入预案名称" :disabled="preview" allowClear></a-input>
                  </a-form-model-item>
                  <a-form-model-item label="预案级别" prop="eplanLevel">
                    <a-select v-model="emForm.eplanLevel" placeholder="请选择预案级别" :disabled="preview" allowClear>
                      <a-select-option v-for="item in prep_level" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="预案部门" prop="eplanDepartcode">
                    <dept-tree :placeholder="'请选择预案部门'" v-model="emForm.eplanDepartcode" :deptData="deptData" @change="planChange" :disabled="preview" allowClear></dept-tree>
                  </a-form-model-item>
                  <a-form-model-item label="预案类型" prop="eplanTypeCode">
                    <a-select v-model="emForm.eplanTypeCode" placeholder="请选择预案类型" :disabled="preview" allowClear>
                      <a-select-option v-for="item in drill_type" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="其他类型" v-if="emForm.eplanTypeCode=='other'" prop="eplanText">
                    <a-input v-model="emForm.eplanText" placeholder="请输入其他类型" :disabled="preview" allowClear></a-input>
                  </a-form-model-item>
                  <a-form-model-item label="预案文件" prop="fileId">
                    <UploadBtnStyle v-if="!preview" :showAcceptText="true" :accept="['.pdf','.ppt','.doc','.xls','.xlsx']" :showUploadList="true" :fileLists="emForm.fileLists" :btnText="'上传文件'" :btnType="'default'" @handleSuccess="handleSuccess"></UploadBtnStyle>
                    <div v-else>
                      <ul>
                        <li class="color-0067cc cursor-pointer" v-for="item of emForm.fileLists" :key="item.id" @click="openFile(item.url)">{{item.name}}</li>
                      </ul>
                    </div>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                </a-col>
              </a-row>
            </a-form-model>
          </div>
      </a-spin>
    </div>
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="goBack ">返回</a-button>
          <a-button v-if="!preview" type="primary" class="m-r-15" :loading="loading" @click="confirm">确定</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import dictionary from '@/utils/dictionary';
import { formValidator } from "@/utils/clx-form-validator.js";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import { planAddPrep,viewDetailPrep,planEditPrep } from "@/services/api.js";
export default {
  mixins:[chemicalDict],
  components: {
    FixedBottom,
    UploadBtnStyle
  },
  props: {
    preview: { // true查看
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      spinning: true,
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
      emForm: {
        draftDepartcode: undefined,
        eplanDepartcode: undefined,
      },
      loading: false,
      deptData:[],
      prep_level: [],
      emergencyLevel:[],
      drill_type:[],
      fileDetail: [],
      fileLists: [],
      emRules: {
        draftDepartcode: [
          { required: true, message:"起草人部门不能为空", trigger: ['blur', 'change'] },
        ],
        eplanName: [
          { required: true, message:"预案名称不能为空", trigger: ['blur', 'change'] },
        ],
        eplanLevel: [
          { required: true, message:"预案级别不能为空", trigger: ['blur', 'change'] },
        ],
        eplanDepartcode: [
          { required: true, message:"预案部门不能为空", trigger: ['blur', 'change'] },
        ],
        eplanTypeCode: [
          { required: true, message:"预案类型不能为空", trigger: ['blur', 'change'] },
        ],
        eplanText: [
          { required: true, message:"其他类型不能为空", trigger: ['blur', 'change'] },
        ],
        fileId: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
      },
      prepId: "",
    }
  },
  created() {
    this.setRouterCode("emergencyDatabase");
    const user = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user;
    this.emForm.draftName = user.name ? user.name : '';
    this.emForm.draftCode = user.jobNumber ? user.jobNumber : '';
    this.prep_level = this.getChemicalDictList('prep_level'); //预案级别
    this.drill_type = this.getChemicalDictList('drill_type'); //应急演练类型
    this.prepId = this.$route.query && this.$route.query.prepId;
    this.initData();
  },
  methods: {
    goBack(){
      this.setKeepalive(true)
      this.$router.go(-1)
    },
    // 文件下载
    openFile(filePath) {
      window.open(filePath)
    },
    async initData() {
      if(this.prepId) {
        const result = await viewDetailPrep({prepId: this.prepId});
        let emForm = result.data || {};
        this.$refs.commonDept.corporationChange(emForm.corporationId, emForm.draftCode);
        const gatherFiles = emForm.gatherFiles || [];
        if(gatherFiles.length > 0) {
          const fileLists = [];
          for (let index = 0; index < gatherFiles.length; index++) {
            const item = gatherFiles[index];
            let fileObj = {
              uid: item.id,
              id: item.id,
              name: item.sourceFileName + '.' + item.fileName.split(".")[1],
              url: item.filePath,
              status: 'done',
            };
            fileLists.push(fileObj);
          }
          emForm.fileId = fileLists.map(item=>item.id).filter(item=>item).join(",");
          emForm.fileLists = fileLists;
        };
        this.emForm = { ...emForm };
        this.spinning = false;
      } else {
        this.spinning = false;
      }
    },
    // 获取组织下所有部门
    corporationDeptChange(value) {
      this.deptData = value;
    },
    // 组织改变
    corporationChange(val, deptId) {
      this.emForm.draftDepartcode = undefined;
      this.emForm.eplanDepartcode = undefined;
      this.emForm.draftDepart = '';
      this.emForm.eplanDepart = '';
    },
    draftChange(id,name) {
      this.emForm.draftDepart = name.join()
    },
    planChange(id,name) {
      this.emForm.eplanDepart = name.join()
    },
    // 确定
    confirm() {
      if (!formValidator.formAll(this, 'emForm')) {
        return;
      }
      this.loading = true;
      const api = this.prepId ? planEditPrep : planAddPrep
      api(this.emForm)
      .then(res=>{
        this.loading = false;
        this.$antMessage.success("操作成功");
        this.$router.replace("/safeManage/emergencyManagement/emergencyDrillManagement/emergencyDatabase")
      })
      .catch(err=>{
        this.loading = false;
      })
    },
    // 上传成功
    handleSuccess(data) {
      const idList = [];
      for (let value of data) {
        let id = value.response ? value.response.data.id : value.id;
        idList.push(id);
      }
      this.$set(this.emForm, "fileId", idList.join(','));
      formValidator.formItemValidate(this, 'fileId', 'emForm')
    },
  }
}
</script>

<style>

</style>