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
import { enterpriseRejection, enterpriseApproval, enterpriseSaveFiling } from "@/services/chemicalIdentSafetyTipsAdd.js";
import fromMaxLength from "@/mixin/fromMaxLength";
import cancelLoading from "@/mixin/cancelLoading";
// 自定义表单验证的class类
import { formValidator } from "@/utils/clx-form-validator.js";
import { getOrganizeList, GetFirstNode, CreateProcess, GetNextTask, ApprovedTask, GetNodeDetail,PushTask } from '@/services/api'
export default {
  mixins: [fromMaxLength, cancelLoading],
  model: {
    prop: 'handleModelShow',
  },
  props: ['handleModelShow', 'modelType', 'plainOptions', 'invitationId', 'nextInfoStatus', 'detailObj', 'nextInfoStatusName'],
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
        opinion: this.formRole.opinion,
        id: this.invitationId,
        userId: this.formRole.handler.join(),
        node: this.nextInfoStatus,
        taskId,
      }
      return enterpriseApproval(apiData)
        .then((res) => {
          if (this.isEnd) {
            // 结束归档api
            this.saveFilingFn()
          } else {
            // this.pushTask();
            this.$antMessage.success(`${this.modelTitle}成功`);
            // 跳转草稿箱列表页
            this.$router.push({ path: '/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/examine' })
            return res
          }
        })
        .catch(err => { })
        .finally(() => {
          !this.isEnd && this.cancelLoading()
        })
    },
    // // 代办推送
    // async pushTask() {
    //   const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/ehsGerneralManage/cooperationPartner/transientChemicalsHandle&invitationId=${this.invitationId}`
    //   const pushTask = await PushTask({
    //     title: "临时化学品入厂审批",
    //     approval:'transientChemicals',
    //     userId: this.formRole.handler.join(),
    //     docId: this.detailObj.processId,
    //     taskId: this.detailObj.taskId,
    //     url: url,
    //     docNumber: this.detailObj.docCode || '',
    //   })
    // },
    // 结束归档api
    saveFilingFn() {
      let apiData = {
        id: this.invitationId,
      }
      return enterpriseSaveFiling(apiData)
        .then((res) => {
          this.$antMessage.success(`审批完成`);
          // 跳转草稿箱列表页
          this.$router.push({ path: '/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/examine' })
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
        opinion: this.formRole.opinion,
        id: this.invitationId,
        userId: this.userId,
        node: this.detailObj.infoStatus,
        taskId: this.detailObj.taskId,
      }
      return enterpriseRejection(apiData)
        .then((res) => {
          this.closeModel()
          this.$antMessage.success(`${this.modelTitle}成功`);
          // 跳转草稿箱列表页
          this.$router.push({ path: '/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/examine' })
          return res
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoading()
        })
    }
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
