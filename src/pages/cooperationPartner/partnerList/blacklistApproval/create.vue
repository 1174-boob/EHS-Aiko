<template>
  <HasSpinAndBtnBox :spinning="spinning">
    <div class="clx-flex-1 black-list-detail">
      <div class="black-list-detail-left">
        <PageTitle>移除黑名单</PageTitle>
        <a-form-model ref="iForm" :model="iForm" :rules="rules" :colon="false" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="12">
              <a-form-model-item v-if="!isCreate" class="flex text-form-item" label="审批单编号">
                <div>{{iForm.formCode || "--"}}</div>
              </a-form-model-item>
              <a-form-model-item class="flex text-form-item" label="企业全称">
                <div>{{iForm.supplierName || "--"}}</div>
              </a-form-model-item>
              <a-form-model-item class="flex text-form-item" label="起草人部门">
                <div>{{iForm.departmentName || "--"}}</div>
              </a-form-model-item>
              <a-form-model-item class="flex text-form-item" label="联系电话">
                <div>{{iForm.phone || "--"}}</div>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item class="flex text-form-item" label="起草人">
                <div v-if="isCreate">{{userInfo.jobNumber ? userInfo.name + '/' + userInfo.jobNumber : userInfo.name || "--"}}</div>
                <div v-else>{{draftPersonMsg}}</div>
              </a-form-model-item>
              <a-form-model-item class="flex text-form-item" label="企业简称">
                <div>{{iForm.supplierCode || "--"}}</div>
              </a-form-model-item>
              <a-form-model-item class="flex text-form-item" label="违章次数">
                <div>{{iForm.violationNum || iForm.violationNum === 0 ? iForm.violationNum : "--"}}</div>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="16">
              <a-form-model-item class="flex" ref="email" label="电子邮箱" prop="email">
                <a-input :disabled="isResolve || isView" v-model.trim="iForm.email" :maxLength="50" placeholder="请输入联系方式"></a-input>
              </a-form-model-item>
              <CommonDept
                ref="commonDept"
                :CommonFormInline="iForm"
                :rules="rules"
                :notTablePage="true"
                :hasDepartment="true"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                :disabled="isResolve || isView"
                @corporationChange="corporationChange"
                @corporationDeptChange="corporationDeptChange"
              ></CommonDept>
              <!-- <a-form-model-item class="flex" label="起草人部门" prop="deptId">
                <a-tree-select
                  v-model="iForm.deptId"
                  style="width: 100%"
                  :disabled="isResolve || isView"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :replaceFields="{ title: 'name', key: 'id', value: 'id' }"
                  :tree-data="treeData"
                  placeholder="请输入起草人部门"
                  tree-default-expand-all
                  @change="deptChange"
                ></a-tree-select>
              </a-form-model-item> -->
              <a-form-model-item class="flex" ref="relieveReason" label="移除黑名单申请原因" prop="relieveReason">
                <a-textarea :disabled="isResolve || isView" v-model.trim="iForm.relieveReason" :maxLength="50" placeholder="请输入移除黑名单申请原因"></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <Log v-if="logData.length" :flowLogList="logData" :hiddenRemark="true"></Log>
    </div>

    <FixedBottom slot="fixedBottom">
      <a-button @click="onCancle">返回</a-button>
      <template v-if="isCreate || isEdit">
        <a-button :loading="loading" @click="onSave">保存</a-button>
        <a-button :loading="loadingTwo" type="primary" @click="onSubmit">提交</a-button>
      </template>
      <template v-if="isResolve && iForm.currentHandler && iForm.currentHandler.includes(userId)">
        <!--  流程进行到审议(nodeStatus==5)只能进行【通过】操作  -->
        <a-button type="primary" v-if="iForm.nodeStatus != 5" :loading="loadingFour" @click="reject">驳回</a-button>
        <a-button type="primary" :loading="loadingThree" @click="approved">通过</a-button>
      </template>
    </FixedBottom>

    <HandleModel v-model="handleModelShow" v-if="iForm.users" :modelType="'pass'" :users="iForm.users" @resolveFn="resolveFn" />
  </HasSpinAndBtnBox>
</template>

<script>
import Log from "@/components/flowLog/flowLog.vue"
import { formValidator } from "@/utils/clx-form-validator.js"
import cancelLoading from '@/mixin/cancelLoading'
import { PushTask } from '@/services/api'
import { blackBeforeAddDetail, blackRelieveAdd, blackRelieveUpdate, blackRelieveDetail, blackRelieveGetlog, blackRelieveProcess } from '@/services/api.js';
import { debounce } from 'lodash'
import { getDictTarget } from "@/utils/dictionary";
import { getQueryVariable } from "@/utils/util.js";
import HandleModel from './tpl/handleModel.vue'
export default {
  components: { Log, HandleModel },
  mixins: [cancelLoading],
  data() {
    return {
      handleModelShow: false,
      spinning: true,
      labelCol: { style: { width: '150px' } },
      wrapperCol: { style: { width: 'calc(100% - 150px)' } },
      iForm: {},
      rules: {
        relieveReason: [
          { required: true, message: "移除黑名单申请原因不能为空", trigger: "blur" },
        ],
        // deptId: [
        //   { required: true, message: "起草人部门不能为空", trigger: "change" },
        // ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
        ],
      },
      treeData: [],
      draftPersonMsg: "",
      logData: [], // 日志数据
      userInfo: {},
      supplierName: "",
      blackId: '',
      formId: undefined,
      approvalStatus: undefined,
      userId: undefined,
    };
  },
  created() {
    this.setRouterCode("blacklistManagement");
    this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
    this.userInfo = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user;
    this.blackId = this.$route.query.blackId || getQueryVariable('blackId')
    this.enterpriseId = this.$route.query.enterpriseId || getQueryVariable('enterpriseId')
    this.formId = this.$route.query.formId || getQueryVariable('formId')
    this.init()
  },
  computed: {
    isView() {
      return this.$route.meta && this.$route.meta.isView
    },
    isResolve() {
      return this.$route.meta && this.$route.meta.isResolve
    },
    isEdit() {
      return this.$route.meta && this.$route.meta.isEdit
    },
    isCreate() {
      return this.$route.meta && this.$route.meta.isCreate
    },
    // 最后一个节点
    isEndFlow() {
      let isEnd = false
      if (this.iForm.nodeStatus == 8) {
        isEnd = true
      } else if (this.iForm.blackType == 'cor' && this.iForm.nodeStatus == 4) {
        isEnd = true
      }
      return isEnd
    },
  },
  methods: {
    getDictTarget,
    corporationChange(a, b) {
      // this.$set(this.iForm, "deptId", undefined);
    },
    corporationDeptChange(treeData) {
      this.treeData = treeData;
    },
    deptChange(a, b, c) {
      this.$set(this.iForm, "deptName", b && b[0]);
    },
    init() {
      if (this.isCreate) {
        let apiData = {
          blackId: this.blackId,
          enterpriseId: this.enterpriseId
        }
        blackBeforeAddDetail(apiData)
          .then(res => {
            let resData = res.data || {};
            this.iForm = {
              draftPersonId: this.userInfo.userId,
              email: this.userInfo.email,
              phone: this.userInfo.phone,
              ...resData,
              corporationId: undefined,
              supplierName: resData.companyName, // 企业名称
              supplierCode: resData.companyAbbreviation, // 企业简称
              violationNum: resData.punishmentCount, // 处罚次数
            }
          })
          .catch(err => { })
          .finally(() => {
            this.spinning = false;
          })
      } else {
        // 编辑 | 查看 | 处理，获取回显数据
        if (this.isEdit) {
          this.getDetail()
            .finally(() => {
              this.spinning = false;
            })
        } else {
          Promise.all([
            this.getDetail(),
            this.getLogData()
          ])
            .finally(() => {
              this.spinning = false
            })
        }
      }
    },
    getDetail() {
      let apiData = {
        formId: this.formId
      }
      return blackRelieveDetail(apiData)
        .then(res => {
          let iForm = {};
          let result = res.data || {};
          let setArr = ["createTime", "createUserId", "createUserName", "deleteStatus", "updateUserId", "updateTime"];
          for (let key in result) {
            if (setArr.indexOf(key) == -1) {
              iForm[key] = result[key];
            }
          }
          this.$refs.commonDept.corporationChange(iForm.corporationId)
          this.iForm = { ...iForm };
        })
        .catch(err => { })
    },
    // 获取日志
    getLogData() {
      let apiData = {
        formId: this.formId
      }
      let idArr = this.iForm.draftPersonId ? [this.iForm.draftPersonId] : [];
      return blackRelieveGetlog(apiData)
        .then(result => {
          let list = result.data || [];
          for (let i = 0; i < list.length; i++) {
            if (list[i].hander) {
              idArr.push(list[i].hander);
            }
            list[i].logId = list[i].id;
            list[i].endTime = list[i].handerTime;
          }
          if (idArr.length >= 1) {
            return this.getUserAndJobNumber([...new Set(idArr)])
              .then(res => { //全局方法
                let obj = res || {};
                if (this.iForm.draftPersonId && obj[this.iForm.draftPersonId]) {
                  this.draftPersonMsg = obj[this.iForm.draftPersonId].workNum ? (obj[this.iForm.draftPersonId].name + "/" + obj[this.iForm.draftPersonId].workNum) : obj[this.iForm.draftPersonId].name;
                }
                for (let i = 0; i < list.length; i++) {
                  list[i].assigneeName = list[i].hander ? obj[list[i].hander].name : "--";
                }
                this.logData = list;
              })
              .catch(err => {
              })
              .finally(() => {
                return Promise.resolve()
              })
          } else {
            return Promise.resolve()
          }
        })
        .catch(err => {
          return Promise.reject()
        })
    },

    // 提交
    onSubmit() {
      this.$refs.iForm.validate((valid, object) => {
        if (!valid) {
          this.scrollView(object);
        }
      });
      if (!formValidator.formAll(this, "iForm")) {
        return;
      }
      this.handleLoadingTwo()
      // 新建就save，编辑就update
      let promiseFn = this.isCreate ? blackRelieveAdd : blackRelieveUpdate
      let apiData = {
        ...this.iForm
      }
      apiData.draftStatus = 2;
      return promiseFn(apiData)
        .then(res => {
          let { handle, formId } = res.data || {}
          this.pushTask(handle, formId);
          this.$antMessage.success("提交成功");
          this.$router.push({
            path: '/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/blacklistApprovalList',
          })
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoadingTwo()
        })
    },
    //保存
    onSave() {
      this.$refs.iForm.validate((valid, object) => {
        if (!valid) {
          this.scrollView(object);
        }
      });
      if (!formValidator.formAll(this, "iForm")) {
        return;
      }
      this.handleLoading()
      let apiData = {
        ...this.iForm,
        draftStatus: 1,
      }
      if (this.isEdit) {
        apiData.id = this.formId
      }
      // 新建就save，编辑就update
      // 新建就save，编辑就update
      let promiseFn = this.isCreate ? blackRelieveAdd : blackRelieveUpdate;
      promiseFn(apiData)
        .then(res => {
          this.$antMessage.success("保存成功");
          this.$router.push({
            path: '/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/blacklistApprovalList'
          })
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoading()
        })
    },
    // 待办推送
    pushTask(handle, formId) {
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/blacklistResolve&formId=${formId}`
      let apiData = {}
      if (handle && !this.isEndFlow) {
        apiData = {
          title: this.iForm.supplierCode + "公司移除黑名单申请",
          approval: 'blacklistResolve',
          userId: handle,
          docId: formId,
          url: url,
          docNumber: this.iForm?.formCode
        }
      } else {   //最后一个节点,删除代办
        apiData = {
          title: this.iForm.supplierCode + "公司移除黑名单申请",
          approval: 'blacklistResolve',
          docId: formId,
        }
      }
      PushTask(apiData)
    },
    // 滚动到表单验证报错的地方
    scrollView(object) {
      for (const i in object) {
        let dom = this.$refs[i];
        // 这里是针对遍历的情况（多个输入框），取值为数组
        if (Object.prototype.toString.call(dom) !== "[object Object]") {
          dom = dom[0];
        }
        // 第一种方法（包含动画效果）
        dom.$el.scrollIntoView({
          // 滚动到指定节点
          // 值有start,center,end，nearest，当前显示在视图区域中间
          block: "center",
          // 值有auto、instant,smooth，缓动动画（当前是慢速的）
          behavior: "smooth",
        });
        break; // 因为我们只需要检测一项,所以就可以跳出循环了
      }
    },
    // 驳回按钮
    reject() {
      this.approvalStatus = 3;
      this.handleLoadingFour()
      this.resolveFn()
    },
    // 通过按钮
    approved() {
      this.approvalStatus = 2;
      if (Array.isArray(this.iForm.users) && this.iForm.users.length > 1) {
        this.handleModelShow = true
      } else {
        this.handleLoadingThree()
        this.resolveFn();
      }
    },
    resolveFn(selHandle = undefined) {
      let apiData = {
        formId: this.iForm.formId,
        approvalStatus: this.approvalStatus,
        hander: selHandle
      }
      return blackRelieveProcess(apiData)
        .then(res => {
          let { handle } = res.data;
          // 只有通过才推送代办
          if (this.approvalStatus == 2) {
            this.pushTask(handle, this.formId);
          }
          this.$antMessage.success(this.approvalStatus == 2 ? "通过成功" : "驳回成功");
          this.$router.push({
            path: '/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/blacklistApprovalList'
          })
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoadingFour()
          this.cancelLoadingThree()
        })
    },
    // 取消
    onCancle() {
      this.setKeepalive(true)
      if(this.isEdit){
        this.$router.go(-1);
      }else{
        this.$router.push({
          path: '/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/blacklistApprovalList'
        })
      }
    },
  },
};
</script>

<style scoped lang='less'>
.black-list-detail {
  display: flex;
  .black-list-detail-left {
    flex: 1;
  }
}
</style>