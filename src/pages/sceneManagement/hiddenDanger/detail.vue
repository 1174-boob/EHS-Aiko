<template>
  <HasFixedBottomWrapper>
    <div :key="$route.params.changeFlag">
      <div>
        <div>
          <div class="common-search">
            <CommonSearchItem :CommonFormInline="commonFormInline" :notTablePage="true" :isNgForm="true" :config="formConfig" :labelCol="{style:{width: formConfig.labelWidth + 'px'}}" :wrapperCol="{style: {flex: 1}}" :disabled="true"></CommonSearchItem>
          </div>
          <div class="custom-font-form pd-l-20 pd-r-20 pd-t-22 pd-b-22">
            <ng-form-build class="ng-form-build" ref="formbuild" :config="formConfig" :formTemplate="formTemplate" :models="models" :renderPreview="preview" :customComponents="customComponents" />
          </div>
        </div>
      </div>
    </div>
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="dataFormSubmit()" v-if="rebackBtnStatus">撤回</a-button>
          <a-button class="m-r-15" @click="$router.push(url)">返回</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import { cloneDeep } from 'lodash';
import { mapState } from 'vuex';
import Bus from '@/utils/bus.js';
import { getQueryVariable } from '@/utils/util'

import { UpdateFormData, GetId, GetFirstNode, GetBusinessDetail, getRevokeStatus, CancelTask, DeleteProcess, SelectTemplateByNode, selectFormDataDetail, } from "@/services/api.js";
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";

console.log(4444444)
export default {
  props: ["componentsParams"],
  components: {
    FixedBottom,
  },
  data() {
    return {
      commonFormInline: {},
      preview: false,
      models: {},
      formTemplate: {},
      formConfig: { // 动态表单配置项
        dict: [] // 数据字典配置
      },
      formData: {},
      dataMsg: undefined,
      url: "",
      typeList: ["uploadimg", "importFile", "relationForm"],
      routeParams: undefined,
      isEdit: false,
      rebackBtnStatus: false,
      businessId: "",
      taskId: "",
      draftUrl: "",
    }
  },
  computed: {
    ...mapState("setting", ["customComponents"])
  },
  watch: {
    $route(newObj, oldObj) {
      if (newObj.params != oldObj.params) {
        this.init();
      }
    }
  },
  async created() {
    console.log(getQueryVariable("formId"))
    let tempId = getQueryVariable("formId") ? getQueryVariable("formId") : this.$route.query.formId;
    let businessId = getQueryVariable("businessId") ? getQueryVariable("businessId") : this.$route.query.businessId;
    let url = getQueryVariable("url") ? getQueryVariable("url") : this.$route.query.url;
    let draftUrl = getQueryVariable("draftUrl") ? getQueryVariable("draftUrl") : this.$route.query.draftUrl;
    console.log(tempId, businessId, url, draftUrl)
    this.routeParams = this.componentsParams;
    if (tempId && businessId) {
      let result1 = await selectFormDataDetail({
        tempId: tempId,
        infoId: businessId
      })
      let result2 = await SelectTemplateByNode({
        tempId: tempId,
        nodeId: result1.data.nodeId,
        nodeState: result1.data.node_status
      })
      result2.data.templateData = JSON.parse(result2.data.templateData);
      this.routeParams = {
        formData: result2.data,
        dataMsg: result1.data,
        title: "查看",
        url: url,
        draftUrl: draftUrl
      }
    } else {
      this.routeParams = this.$route.params.formData ? this.$route.params : this.componentsParams;
    }
    this.userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user;
    if (this.$route.meta) {
      this.$route.meta.title = this.routeParams.title ? this.routeParams.title : this.$route.meta.title;
    }
    this.init();
  },
  mounted() {
    Bus.$on('changeParams', this.changeParams);
  },
  methods: {
    changeParams(obj) {
      this.init(obj);
    },
    async init(obj) {
      let _this = this;
      let { formData, dataMsg, url, draftUrl } = obj ? obj : this.routeParams;
      if (!formData) {
        this.$router.push(url);
        return;
      }
      this.formData = formData;
      this.url = url;
      this.draftUrl = draftUrl;
      console.log(111, this.url, this.draftUrl)
      this.formConfig = formData.templateData.config;
      this.formTemplate = formData.templateData;
      let arr = cloneDeep(formData.templateData.list);
      let models = [];

      function getModelArr(arr) {
        for (let i = 0; i < arr.length; i++) {
          if (formData.templateData.list[i].rules && formData.templateData.list[i].rules[0]) {
            formData.templateData.list[i].rules[0].required = false;
          }
          if (_this.typeList.indexOf(formData.templateData.list[i].type) < 0) {
            formData.templateData.list[i].options.disabled = true;
            formData.templateData.list[i].options.onlyRead = true;
          } else {
            formData.templateData.list[i].options.disabled = false;
          }
          if (arr[i].model) {
            models.push(arr[i].model)
          }
          for (let key in arr[i]) {
            if (Array.isArray(arr[i][key])) {
              getModelArr(arr[i][key])
            }
          }
        }
      }
      getModelArr(arr)
      this.$nextTick(() => {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].type == "batch" && arr[i].model && document.getElementById(arr[i].model)) {
            document.getElementById(arr[i].model).className += " none-events";
          }
        }
      })
      if (dataMsg) {
        if (this.userInfo.userId == dataMsg.create_user_id) {
          this.rebackBtnStatus = true;
        }
        this.isEdit = true;
        for (let key in dataMsg) {
          for (let i = 0; i < models.length; i++) {
            if (models[i] == key) {
              this.models[key] = dataMsg[key];
            }
          }
        }
        this.dataMsg = dataMsg;
        this.businessId = this.dataMsg.id;
        if (this.formConfig.isHiddenTab == 2) {
          this.models = { ...this.models };
          return;
        }
        this.nodeId = this.dataMsg.nodeId;
        let params10 = {
          businessId: this.businessId
        }
        let result10 = await GetBusinessDetail(params10);
        this.taskId = result10.data ? result10.data.taskId : "";
        this.deployId = result10.data ? result10.data.deploymentId : "";
      }
      if (this.formConfig.isHiddenTab == 2) {
        this.models = { ...this.models };
        this.rebackBtnStatus = false;
        return;
      }
      if (!this.deployId) {
        // 拿部署id
        let params1 = {
          tempId: this.formData.tempId
        }
        let result1 = await GetId(params1);
        this.deployId = result1.data.deploymentId;
      }
      if (!this.taskId) {
        // 拿第一个节点id
        let params8 = {
          deployId: this.deployId
        }
        let result8 = await GetFirstNode(params8);
        this.firstNode = result8.data.id;
        this.nodeId = result8.data.id;
      }
    },
    // 表单提交
    dataFormSubmit() { // 1:审核驳回  2:保存-到草稿箱  3:撤回   4:退回  5:只涉及表单不涉及流程的业务   else就是审核通过
      this.$refs.formbuild.validator().then((valid) => {
        this.$refs.formbuild.getData().then(async (obj) => {
          this.formObj = obj;
          const form_ = {
            tempId: this.formData.tempId || undefined
          }
          try {
            if (this.isEdit) { // 编辑
              this.businessId = this.dataMsg.id;
              form_.id = this.dataMsg.id + "";
              form_.updateMap = cloneDeep(obj);
              this.newFormObj = cloneDeep(form_);
            }
            this.rebackBtnFn();
          } catch (err) {
            console.log(err);
          }
        })
      })
    },
    // 撤回
    async rebackBtnFn() {
      // 看看是否符合允许撤回条件（发起流程后下一审批人还没有审批时，可以允许起草人撤回，否则提示流程已开始处理，不允许撤回）
      let params15 = {
        businessId: this.businessId
      }
      let result15 = await getRevokeStatus(params15);
      if (result15.data) {
        // 取消当前任务流程-取消任务
        let params16 = {
          taskId: this.taskId
        }
        let result16 = await CancelTask(params16);
        // 删除流程
        let params17 = {
          businessId: this.businessId
        }
        let result17 = await DeleteProcess(params17);
        this.updateFormDataFn(); // 撤回成功后保存到草稿箱
      } else {
        this.$antMessage.error("流程已开始处理，不允许撤回");
      }
    },
    // 更新表单数据
    async updateFormDataFn() {
      try {
        let params9 = {
          "id": this.businessId,
          "tempId": this.formData.tempId,
          updateMap: {}
        }
        params9.updateMap = this.newFormObj.updateMap ? this.newFormObj.updateMap : this.newFormObj.formData;
        params9.updateMap.draft_type = "3";
        // 提交保存到台账列表
        await UpdateFormData(params9);
        this.$antMessage.success("撤回成功");
        this.$router.push(this.draftUrl);
      } catch (err) { console.log(err); }
    },
  }
}
</script>
<style lang="less" scoped>
.custom-font-form {
  .el-form-item__content {
    font-size: 13px;
  }
  .ng-form-build {
    padding: 10px;
  }
}

/deep/ .ant-upload {
  pointer-events: none;
  * {
    pointer-events: none;
    cursor: no-drop;
  }
  /deep/ .ant-upload-list-item-card-actions {
    display: none !important;
    svg {
      display: none !important;
    }
  }
}
/deep/ .anticon-delete {
  display: none !important;
}
/deep/ #relationForm {
  // pointer-events: none;
  // cursor: no-drop;
  button {
    // background: #666;
  }
}
.uploadimg {
  img {
    width: 84px;
    height: 84px;
    margin-right: 10px;
  }
}
.common-search{
  padding-left: 30px;
  padding-right: 30px;
  /deep/ .ant-select{
    width: 100%;
  }
}
</style>
