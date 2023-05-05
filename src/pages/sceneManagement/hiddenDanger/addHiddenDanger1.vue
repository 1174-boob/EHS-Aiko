<template>
  <HasFixedBottomWrapper>
    <div class="common-search">
      <CommonSearchItem :CommonFormInline="commonFormInline" :notTablePage="true" :isNgForm="true" :config="formConfig" :labelCol="{style:{width: formConfig.labelWidth + 'px'}}" :wrapperCol="{style: {flex: 1}}"></CommonSearchItem>
    </div>
    <div v-loading="loading" class="custom-font-form">
      <ng-form-build class="ng-form-build" ref="formbuild" :config="formConfig" :formTemplate="formTemplate" :models="models" :renderPreview="preview" :customComponents="customComponents" />
    </div>
    <CommonModal title="办理" :visible="chooseStaffVisible" :cancelFn="chooseStaffCancle">
      <div class="pd-b-16">下一节点：{{this.nodeName}}</div>
      <div>
        <div>办理人：</div>
        <a-checkbox-group v-model="staffArr" :options="plainOptions" />
      </div>
      <template slot="btn">
        <a-button type="primary" @click="chooseStaffConfirm" :loading="modalLoading">发送</a-button>
        <a-button class="m-l-15" @click="chooseStaffCancle">取消</a-button>
      </template>
    </CommonModal>
    <CommonModal title="办理" :visible="rebackVisable" :cancelFn="nextCancle">
      <div class="pd-b-16">状态：{{status == "0" ? "审批驳回" : "审批通过"}}</div>
      <div>
        <div>审批意见</div>
        <a-textarea placeholder="请输入审批意见" v-model="rebackMsg" allowClear :maxLength="500" />
      </div>
      <template slot="btn">
        <a-button type="primary" @click="nextConfirm" :loading="modalLoading">下一步</a-button>
        <a-button class="m-l-15" @click="nextCancle">取消</a-button>
      </template>
    </CommonModal>
    <div slot="fixedBottom">
      <FixedBottom v-if="formConfig.isHiddenTab != 2">
        <div>
          <a-button class="m-r-15" :disabled="btnStatus" @click="buttonTwoTextFn" v-if="buttonTwoVisable">{{this.buttonTwoText}}</a-button>
          <a-button class="m-r-15" @click="dataFormSubmit(6)" v-if="isShowBtn3" :loading="submitLoading">暂存</a-button>
          <a-button type="primary" :disabled="btnStatus" @click="buttonOneTextFn" v-if="!preview" :loading="submitLoading">{{this.buttonOneText}}</a-button>
        </div>
      </FixedBottom>
      <FixedBottom v-else>
        <div>
          <a-button type="primary" @click="dataFormSubmit(5)">提交</a-button>
          <slot name="btnSlot"></slot>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import { InsertFormData, UpdateFormData, InsertFormDataByEnter, UpdateFormDataByEnter, GetId, GetFirstNode, GetNextTask, SaveBusinessProcess, SearchUserList, CreateProcess, ApprovedTask, UpdateBusinessProcess, GetBusinessDetail, GetNodeDetail, RejectedTask, getNowTask, getRevokeStatus, CancelTask, DeleteProcess, SaveEndNodeId, PushTask, deleteEnterBlack, updateEnterBlack } from "@/services/api.js";
import dayJs from 'dayjs';
import { debounce, cloneDeep } from 'lodash'
import { mapState } from 'vuex';


import FixedBottom from "@/components/commonTpl/fixedBottom.vue";

export default {
  props: ["componentsParams", "submitNgForm", "customerCompanyId"],
  data() {
    return {
      commonFormInline: {},
      loading: false,
      submitLoading: false,
      modalLoading: false,
      preview: false,
      models: {},
      formTemplate: {},
      formConfig: { // 动态表单配置项
        dict: [] // 数据字典配置
      },
      formData: {},
      dataMsg: undefined,
      url: "",
      draftUrl: "",
      chooseStaffVisible: false,
      nodeName: "",
      staffArr: [],
      plainOptions: [],
      userInfo: {},
      companyId: "",
      formObj: {},
      newFormObj: {},
      businessId: "",
      deployId: "",
      firstNode: "",
      taskId: "",
      nodeId: "",
      isEdit: false,
      buttonOneText: "",
      buttonTwoText: "",
      type: "",
      rebackVisable: false,
      rebackMsg: "",
      status: "1",
      buttonTwoVisable: false, // 默认展示左边按钮
      saveBtn: false,
      rebackBtnStatus: false,
      btnStatus: true,
      routeParams: undefined,
      isShowBtn3: false, // 暂存按钮是否显示，如果有可编辑的项就显示true,否则不显示false
      isEndEvent: false, // 是否是最后一个节点
      blackId: "", // 黑名单列表编码
    }
  },
  components: {
    FixedBottom,
  },
  computed: {
    ...mapState("setting", ["customComponents"])
  },
  created() {
    this.routeParams = this.$route.params.formData ? this.$route.params : this.componentsParams;
    this.routeParams = { ...this.routeParams }
    this.userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user;
    this.companyId = this.customerCompanyId ? this.customerCompanyId : JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company.companyId;
    this.$route.meta.title = this.routeParams.title;
    this.init();

  },
  methods: {
    async init() {
      let { formData, dataMsg, url, draftUrl } = this.routeParams;
      console.log(33333, this.routeParams);
      if (!formData) {
        this.$router.push(url);
        return;
      }
      this.formData = formData;
      this.url = url;
      this.draftUrl = draftUrl;
      this.formConfig = formData.templateData.config;
      this.formTemplate = formData.templateData;
      let arr = cloneDeep(formData.templateData.list);
      let models = [];
      let counter = 0;

      let invitationMsg = this.$route.params.blackMsg ? this.$route.params.blackMsg : {};
      console.log(2222, invitationMsg)
      let _this = this;
      this.blackId = invitationMsg.blackId
      function getModelArr(arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].options && arr[i].options.disabled == false && arr[i].options.hidden == false) {
            counter += 1;
          }
          if (_this.$route.params.blackMsg && arr[i].relevance) {
            console.log(11111, arr[i].relevance, invitationMsg[arr[i].relevance])
            _this.models[arr[i].model] = invitationMsg[arr[i].relevance];
          }
          if (arr[i].relevance == "blackId" && dataMsg) {
            _this.blackId = dataMsg[arr[i].model];
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
      if (counter > 0) {
        this.isShowBtn3 = true;
      }
      this.$nextTick(() => {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].type == "batch" && !arr[i].options.hidden && arr[i].options.disabled) {
            document.getElementById(arr[i].model).className += " none-events";
          }
        }
      })




      let params11 = {}
      if (dataMsg) {
        this.commonFormInline = {
          centerId: dataMsg.centerId,
          corporationId: dataMsg.corporationId
        }
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
        params11 = {
          deploymentId: this.deployId,
          nodeId: this.dataMsg.nodeId
        }
      } else {
        this.models = { ...this.models };
        this.isShowBtn3 = false;
      }
      console.log(this.models);
      if (this.formConfig.isHiddenTab == 2) {
        this.models = { ...this.models };
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
      params11 = {
        deploymentId: this.deployId,
        nodeId: this.nodeId
      }
      this.models = { ...this.models };
      let result11 = await GetNodeDetail(params11);
      let buttonOneText = "";
      let buttonTwoText = "";
      if (!result11.data) {
        return;
      }
      this.type = result11.data.type;
      if (result11.data.type == 0 || result11.data.type == 1) {
        buttonOneText = "提交";
        if (result11.data.type == 1) {
          this.revokeStatus = result11.data.revokeStatus;
          this.buttonTwoVisable = this.revokeStatus; // false不允许退回，隐藏按钮  true允许退回，显示按钮，文案是退回
          buttonTwoText = "退回";
        } else {
          this.buttonTwoVisable = true;
          this.saveBtn = true;
          buttonTwoText = "保存";
        }
      } else if (result11.data.type == 2) {
        this.buttonTwoVisable = true;
        buttonOneText = "通过";
        buttonTwoText = "驳回";
      }
      this.buttonOneText = result11.data.buttonOneText ? result11.data.buttonOneText : buttonOneText;
      this.buttonTwoText = result11.data.buttonTwoText ? result11.data.buttonTwoText : buttonTwoText;
      this.btnStatus = false;
    },
    initTime(time) {
      if (time) {
        return dayJs(time).format('YYYY-MM-DD');
      }
    },
    // 表单提交
    dataFormSubmit: debounce(
      function (flag) { // 1:审核驳回  2:保存-到草稿箱  3:撤回   4:退回  5:只涉及表单不涉及流程的业务 6：只是暂存表单数据，不往下走流程   else就是审核通过
        console.log(222, flag);
        if (!this.commonFormInline.corporationId) {
          this.$antMessage.error("所属组织是必填项");
          return;
        }
        this.$refs.formbuild.validator().then((valid) => {
          if (valid) {
            this.$refs.formbuild.getData().then(async (obj) => {
              this.formObj = obj;
              const form_ = {
                tempId: this.formData.tempId || undefined,
                corporationId: this.commonFormInline.corporationId,
                centerId: this.commonFormInline.centerId
              }
              let result;
              let promiseFn1 = InsertFormData;
              let promiseFn2 = UpdateFormData;
              try {
                if (this.isEdit) { // 编辑
                  this.businessId = this.dataMsg.id;
                  form_.id = this.dataMsg.id + "";
                  form_.updateMap = cloneDeep(obj);
                  this.newFormObj = cloneDeep(form_);
                  if (flag == 4) {
                    form_.updateMap.draft_type = "3"; // 退回保存到草稿箱
                  } else if (flag == 5) {
                    form_.companyId = this.companyId;
                    promiseFn2 = UpdateFormDataByEnter;
                  }
                  result = await promiseFn2(form_);
                  if (flag == 4) { // 退回
                    this.returnBtn();
                    return;
                  } else if (flag == 6) { // 暂存，只更新数据，不走流程
                    this.$router.push(this.url);
                    return;
                  }
                } else {
                  form_.nodeStatus = "3";
                  if (flag == 5) {
                    form_.nodeStatus = "2";
                    form_.companyId = this.companyId;
                    promiseFn1 = InsertFormDataByEnter;
                  }
                  form_.formData = cloneDeep(obj);
                  // 提交表单，拿到表单数据id
                  this.newFormObj = cloneDeep(form_);
                  result = await promiseFn1(form_);
                  this.businessId = result.data + "";
                  // 如果是黑名单管理-移除黑名单进入的此页面，新建数据后需要更改状态，使移除黑名单按钮不能再次点击创建数据
                  if (this.blackId && this.$route.path == "/cooperationPartner/addhiddendanger10") { // 是黑名单的新建页面
                    updateEnterBlack({ blackId: this.blackId, blackStatus: 1 }).then(() => { }).catch(err => { console.log(err) });
                  }
                }

                if (flag == 2) { // 保存-到草稿箱
                  this.chooseStaffCancle();
                  return;
                } else if (flag == 5) {
                  if (this.submitNgForm) {
                    this.submitNgForm(this.businessId);
                  } else {
                    this.$router.push(this.url);
                  }
                  return;
                }
                if (!this.taskId) {
                  // 发起流程
                  let params2 = {
                    deployId: this.deployId,
                    module: this.businessId,
                    map: {
                      ...this.formObj
                    },
                    userId: this.userInfo.userId,
                    companyId: this.companyId
                  }
                  params2.map[this.firstNode] = this.userInfo.userId;
                  let result2 = await CreateProcess(params2);
                  this.taskId = result2.data.taskId;
                  // 保存业务流程
                  let params3 = {
                    businessId: this.businessId,
                    moduleCode: this.formData.code,
                    nextNode: this.firstNode,
                    nextOperator: this.userInfo.userId,
                    operatorStatus: 0,
                    taskId: this.taskId,
                    deploymentId: this.deployId,
                    tempId: this.formData.tempId
                  }
                  let result3 = await SaveBusinessProcess(params3);
                }

                if (flag == 1) { // 驳回
                  this.rejectedTask();
                } else if (flag == 3) { // 撤回
                  this.rebackBtnFn();
                } else { // 通过
                  this.isLastNode();
                }
              } catch (err) {
                console.log(err);
              }
            })
          } else {
            this.$antMessage.error("请检查所填写的数据是否符合规则")
          }
        })
      },
      1000,
      { leading: true, trailing: false }
    ),
    async chooseStaffConfirm() {
      if ((this.staffArr.length > 0 && this.nodeId.split("_")[0] != "endEvent") || this.nodeId.split("_")[0] == "endEvent") {
        let params6 = {
          taskId: this.taskId,
          userId: this.userInfo.userId,
          companyId: this.companyId,
          msg: this.rebackMsg,
          param: {
            ...this.formObj
          } // 下级节点的变量：所选人员，表单数据
        }
        if (this.nodeId.split("_")[0] != "endEvent") {
          params6.param[this.nodeId] = this.staffArr.join();
        } else {
          this.isEndEvent = true;
        }
        this.modalLoading = true;
        try {
          // 调用审核通过接口
          let result6 = await ApprovedTask(params6);
          let params7 = {
            businessId: this.businessId,
            moduleCode: this.formData.code,
            nextNode: this.nodeId,
            nextOperator: this.staffArr.join(), // 下级节点的变量：所选人员
            operatorStatus: 1, // 通过1  驳回2
            taskId: result6.data.taskId,
            deploymentId: this.deployId,
            tempId: this.formData.tempId
          }
          // 更新业务流程
          let result7 = await UpdateBusinessProcess(params7);
          let str = process.env.VUE_APP_LOGIN_URL + 'client_id=' + process.env.VUE_APP_CLIENTID + '&response_type=' + process.env.VUE_APP_RESPONSE_TYPE + '&redirect_uri=' + process.env.VUE_APP_REDIRECT_URI + '&routeUrl=' + this.$route.meta.detailUrl + '&formId=' + this.formData.tempId + '&businessId=' + this.businessId + '&url=' + this.$route.meta.url + '&draftUrl=' + this.$route.meta.draftUrl;
          console.log(str);
          if (this.staffArr.join()) {
            let result21 = await PushTask({
              approval: this.formData.name,
              userCode: this.staffArr.join(),
              docId: this.businessId,
              taskId: result6.data.taskId,
              url: str
            })
          }
          this.updateFormDataFn();
        } catch (err) {
          console.log(err);
        }
      } else {
        this.$antMessage.error("请选择办理人");
      }
    },
    chooseStaffCancle() {
      this.$router.push(this.draftUrl);
    },
    // 更新表单数据
    async updateFormDataFn(num) {
      try {
        let params9 = {
          "id": this.businessId,
          "tempId": this.formData.tempId,
          updateMap: {}
        }
        params9.updateMap = this.newFormObj.updateMap ? this.newFormObj.updateMap : this.newFormObj.formData;
        params9.updateMap.draft_type = num ? num : "0";
        // 提交保存到台账列表
        await UpdateFormData(params9);
        if (num) {
          this.$antMessage.success("撤回成功");
          this.$router.push(this.draftUrl);
        } else {
          console.log(1111, this.isEndEvent, this.blackId, this.$route.path == "/cooperationPartner/addhiddendanger10")
          if (this.isEndEvent && this.blackId && this.$route.path == "/cooperationPartner/addhiddendanger10") { // 是最后一个节点并且是黑名单逻辑的时候调用移除黑名单接口
            await deleteEnterBlack({ blackId: this.blackId }) // 移除黑名单
          }
          this.$antMessage.success("发送成功");
          this.$router.push(this.url);
        }
      } catch (err) { console.log(err); }
    },
    // 是否是最后一个节点处理逻辑
    async isLastNode() {
      try {
        // 拿下级节点id
        let params4 = {
          taskId: this.taskId,
          param: {
            ...this.formObj
          }
        }
        let result4 = await GetNextTask(params4);
        this.currentNodeId = cloneDeep(this.nodeId);
        this.nodeId = result4.data.id;
        if (this.nodeId.split("_")[0] != "endEvent") {
          // 拿用户列表选审批人员(多选)
          let params5 = {
            deploymentId: this.deployId,
            nodeId: this.nodeId,
            businessId: this.businessId
          }
          let result5 = await SearchUserList(params5);
          let list = result5.data;
          this.plainOptions = [];
          for (let i = 0; i < list.length; i++) {
            this.plainOptions.push({
              label: list[i].name,
              value: list[i].userId
            })
          }
          let params20 = {
            deploymentId: this.deployId,
            nodeId: this.nodeId
          }
          let result20 = await GetNodeDetail(params20);
          this.nodeName = result20.data.nodeName;
          this.chooseStaffVisible = true;
          this.submitLoading = false;
        } else {
          console.log("currentNodeId", this.currentNodeId);
          SaveEndNodeId({
            nodeId: this.currentNodeId,
            tempId: this.formData.tempId
          }).then(res => {
          })
          this.chooseStaffConfirm();
        }
      } catch (err) { console.log(err); }
    },
    // 下一步
    nextConfirm() {
      if (this.status == "1") { // 通过-下一步
        this.dataFormSubmit();
      } else { // 驳回-下一步
        // 调驳回接口
        this.dataFormSubmit(1);
      }
    },
    // 下一步-取消
    nextCancle() { // 审批弹框
      this.rebackVisable = false;
    },
    // 底部左边按钮事件
    buttonTwoTextFn() {
      if (this.type == 2) { // 驳回
        this.status = "0";
        this.rebackVisable = true;
      } else if (this.type == 1) { // 退回
        if (this.revokeStatus == 1) { // 允许退回
          this.dataFormSubmit(4);
        } else {
          this.$antMessage.error("不允许退回");
        }
      } else { // 保存
        this.dataFormSubmit(2);
      }
    },
    buttonOneTextFn() {
      if (this.type == 2) { // 通过
        this.status = "1";
        this.rebackVisable = true;
      } else if (this.type == 0 || this.type == 1) { // 提交
        this.dataFormSubmit();
      }
    },
    // 驳回
    async rejectedTask() {
      try {
        let params12 = {
          taskId: this.taskId,
          userId: this.userInfo.userId,
          companyId: this.companyId,
          msg: this.rebackMsg
        }
        let result12 = await RejectedTask(params12);

        // 获取当前节点扩展信息
        let params14 = {
          taskId: result12.data.taskId
        }
        let result14 = await getNowTask(params14);
        let nextOperator = "";
        for (let key in result14.data.param) {
          if (key == result14.data.id) {
            nextOperator = result14.data.param[key];
          }
        }
        let params13 = {
          businessId: this.businessId,
          moduleCode: this.formData.code,
          nextNode: result14.data.id,
          nextOperator: nextOperator, // 下级节点的变量：所选人员
          operatorStatus: 2, // 通过1  驳回2
          taskId: result12.data.taskId,
          deploymentId: this.deployId,
          tempId: this.formData.tempId
        }
        // 更新业务流程
        await UpdateBusinessProcess(params13);
        // 更新表单数据保存到台账列表
        this.updateFormDataFn();
      } catch (err) { console.log(err); }
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
        this.updateFormDataFn("3"); // 撤回成功后保存到草稿箱
      } else {
        this.$antMessage.error("流程已开始处理，不允许撤回");
      }
    },
    // 退回
    async returnBtn() {
      // 取消当前任务流程-取消任务
      let params18 = {
        taskId: this.taskId
      }
      let result18 = await CancelTask(params18);
      // 删除流程
      let params19 = {
        businessId: this.businessId
      }
      let result19 = await DeleteProcess(params19);
      this.chooseStaffCancle();
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
.common-search{
  padding-left: 10px;
  padding-right: 10px;
  /deep/ .ant-select{
    width: 100%;
  }
}
</style>
