<template>
  <CommonModal :title="modelTitle" :visible="handleModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formRole" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="opinion" :label="modelTitle+'原因'" prop="opinion">
          <a-textarea :maxLength="300" v-model="formRole.opinion" :placeholder="`请输入${modelTitle}原因`"></a-textarea>
        </a-form-model-item>
        <a-form-model-item ref="opinion" :label="'下一节点'" v-if="modelType == 'pass'">
          <span>{{nextInfoStatusName}}</span>
        </a-form-model-item>
        <template v-if="modelType == 'pass' && plainOptions.length">
          <a-form-model-item ref="handler" label="办理人" prop="handler">
            <a-checkbox-group v-model="formRole.handler">
              <a-checkbox v-for="item in plainOptions" :key="item.value" :value="item.value">{{item.label}}</a-checkbox>
            </a-checkbox-group>
          </a-form-model-item>
        </template>
      </a-form-model>
    </template>
    <template slot="btn">
      <a-button type="dashed" @click="closeModel">取消</a-button>
      <a-button type="primary" style="margin-left: 0.2rem" :loading="loading" @click="onSubmit">提交</a-button>
    </template>
  </CommonModal>
</template>

<script>
import { riskApprovalHandleRejectApi, riskApprovalHandlePassApi, riskApprovalHandleSaveFilingApi } from "@/services/dangerSource/risk";
import fromMaxLength from "@/mixin/fromMaxLength";
import cancelLoading from "@/mixin/cancelLoading";
// 自定义表单验证的class类
import { formValidator } from "@/utils/clx-form-validator.js";
import { ApprovedTask } from '@/services/api'
import { PushTask } from '@/services/api'
export default {
  mixins: [fromMaxLength, cancelLoading],
  model: {
    prop: 'handleModelShow',
  },
  props: ['handleModelShow', 'modelType', 'plainOptions', 'riskPointApprovalId', 'nextInfoStatus', 'detailObj', 'nextInfoStatusName'],
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      // 新增、修改表单
      formRole: {
        opinion: '',
        handler: []
      },
      userId: null,
    };
  },
  mounted() {
    this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
  },
  computed: {
    // 弹窗title
    modelTitle() {
      if (this.modelType == 'pass') {
        return '通过'
      } else {
        return '驳回'
      }
    },
    // 表单验证
    rules() {
      let rules = {
        opinion: [{ required: true, message: "原因不能为空", trigger: "blur" }],
      }
      if (this.modelType == 'pass') {
        rules.opinion[0].required = false
        if (this.plainOptions.length) {
          rules.handler = [{ required: true, message: "办理人不能为空", trigger: "change" }]
        }
      }
      return rules
    },
    // 是否为最后一个节点
    isEnd() {
      let end = this.nextInfoStatus.indexOf('end') == 0
      return end
    },
  },
  methods: {
    // 取消-关闭model
    closeModel() {
      this.$emit('input', false)
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    },
    // 提交
    onSubmit() {
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      this.handleLoading()
      let methodsName = this.modelType == 'pass' ? 'approvedTask' : 'rejectApiFn'
      this[methodsName]()
    },
    // 审批通过
    approvedTask() {
      let para = {
        taskId: this.detailObj.taskId,
        param: {},
        msg: this.formRole.opinion,
        userId: this.userId,
      }
      para.param[this.nextInfoStatus] = this.nextInfoStatus
      para.param.hasChargeSecurityHeadId = this.detailObj.hasChargeSecurityHeadId
      para.param.riskLevelType = this.detailObj.riskLevelType
      return ApprovedTask(para)
        .then(res => {
          // console.log('审批通过', res);
          let { taskId } = res.data
          this.passApiFn(taskId)
        })
        .catch(err => {
          return Promise.reject()
        })
    },
    // 通过api
    passApiFn(taskId) {
      // 1 通过并上架 2驳回
      let apiData = {
        riskPointApprovalId: this.riskPointApprovalId,
        opinion: this.formRole.opinion,
        userId: this.formRole.handler.join(),
        node: this.nextInfoStatus,
        taskId,
      }
      return riskApprovalHandlePassApi(apiData)
        .then((res) => {
          if (this.isEnd) {
            // 结束归档api
            this.saveFilingFn()
            this.pushTask(undefined, this.riskPointApprovalId)
          } else {
            this.$antMessage.success(`${this.modelTitle}成功`);
            // 跳转列表页
            this.$router.push({
              path: '/safeManage/dualControlManage/riskManage/riskApproval',
              query: { activeKey: 2 }
            })
            this.pushTask(this.formRole.handler.join(), this.riskPointApprovalId)
            return res
          }
        })
        .catch(err => { })
        .finally(() => {
          !this.isEnd && this.cancelLoading()
        })
    },
    // 结束归档api
    saveFilingFn() {
      let apiData = {
        riskPointApprovalId: this.riskPointApprovalId,
      }
      return riskApprovalHandleSaveFilingApi(apiData)
        .then((res) => {
          this.$antMessage.success(`审批完成`);
          // 跳转列表页
          this.$router.push({
            path: '/safeManage/dualControlManage/riskManage/riskApproval',
            query: { activeKey: 2 }
          })
          return res
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoading()
        })
    },
    // 驳回api
    rejectApiFn() {
      let apiData = {
        riskPointApprovalId: this.riskPointApprovalId,
        opinion: this.formRole.opinion,
        userId: this.userId,
        node: this.detailObj.infoStatus,
        taskId: this.detailObj.taskId,
      }
      return riskApprovalHandleRejectApi(apiData)
        .then((res) => {
          this.closeModel()
          this.$antMessage.success(`${this.modelTitle}成功`);
          // 跳转列表页
          this.$router.push({
            path: '/safeManage/dualControlManage/riskManage/riskApproval',
            query: { activeKey: 2 }
          })
          return res
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoading()
        })
    },
    // 代办推送
    async pushTask(securityUser, riskPointApprovalId) {
      if (riskPointApprovalId) {
        const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/safeManage/dualControlManage/riskManage/riskApprovalHandle&riskPointApprovalId=${riskPointApprovalId}`
        const pushTask = await PushTask({
          title: "风险点审批",
          approval: 'riskBook',
          userId: securityUser,
          url: url,
          docNumber: this.detailObj?.riskPointApprovalNo,   //业务id
          docId: riskPointApprovalId,  //主键id
        })
      }
    },
  },
  watch: {
    handleModelShow(newVal) {
      if (!newVal) {
        setTimeout(() => {
          this.formRole.opinion = ''
        }, 100);
      }
    }
  }
};
</script>

<style lang="less" scoped>
::v-deep .ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin-left: 0px;
}
</style>
