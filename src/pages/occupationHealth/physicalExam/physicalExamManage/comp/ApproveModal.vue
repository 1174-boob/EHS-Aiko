<template>
  <CommonModal :title="title" :visible="approveVisible" :cancelFn="cancelFn">
    <div v-if="step === 1">
      <div class="pd-b-16">状态：{{+status === 0 ? "审批驳回" : "审批通过"}}</div>
      <div>
        <div>审批意见</div>
        <a-textarea placeholder="请输入审批意见" v-model="rebackMsg" allowClear :maxLength="500" />
      </div>
    </div>
    <div v-else>
      <div v-show="nodeName" class="pd-b-16">下一节点：{{ nodeName }}</div>
      <div>
        <div>办理人：</div>
        <a-spin :spinning="spinning" wrapperClassName="a-spin">
          <a-checkbox-group v-model="staffArr" :options="plainOptions" />
        </a-spin>
      </div>
    </div>
    <template slot="btn" v-if="step === 1 && status !== 0">
      <a-button type="primary" @click="nextConfirm">下一步</a-button>
      <a-button class="m-l-15" @click="cancelFn">取消</a-button>
    </template>
    <template slot="btn" v-else>
      <a-button type="primary" :loading="loading" @click="chooseStaffConfirm">发送</a-button>
      <a-button class="m-l-15" @click="cancelFn">取消</a-button>
    </template>
  </CommonModal>
</template>

<script>
import dictionary from '@/utils/newDictionary'
import { debounce } from 'lodash'
import { msdsApproveNodeUser } from '@/services/chemicalMsds'
import { PEApproveSave, PEApproveUpdate, PEApproveDetail, PEApproveResolve, PEApproveSavaDraft, PEApproveNodeUser, PEApproveSaveFiling } from '@/services/chemicalMsds'
import {
  getOrganizeList, GetFirstNode, CreateProcess, rejectedTaskToLast,
  GetNextTask, ApprovedTask, GetNodeDetail, getCityOptions, PECheckApprove, PECheckRejection, PECheckSaveFiling, PushTask
} from '@/services/api'
import cancelLoading from "@/mixin/cancelLoading";
export default {
  mixins: [cancelLoading],
  props: {
    approveVisible: {
      type: Boolean,
      default: false
    },
    isResolve: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    queryObj: {
      type: Object,
      default: () => { }
    },
    corporationId: {
      type: String,
      default: ''
    },
    form: {}
  },
  data() {
    return {
      step: 1,
      status: -1,
      spinning: false,
      taskId: '',
      id: '',
      date: null,
      infoStatus: '',
      createUserId: '',
      userId: '',
      processId: '',
      docNumber: '',
      plainOptions: [],
      staffArr: [],
      handler: '',
      rebackMsg: '',
      nodeName: '',
      DEPLOYIDOption: dictionary('approvalType') || [],
    }
  },
  computed: {
    DEPLOYID() {
      return (this.DEPLOYIDOption.find(item => {
        return item.dictLabel === 'CHECKAPPROVAL'
      }) || {}).dictValue
    },
    title() {
      return this.status === 0 ? '驳回' : '办理'
    }
  },
  created() {
    this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
  },
  methods: {
    cancelFn() {
      this.rebackMsg = ''
      this.$emit('update:approveVisible', false)
    },
    //弹窗打开调用方法
    async getFirstNodeData() {
      this.step = 2
      this.spinning = true
      const { code, data } = await this.getFirstNode()
      if (+code !== 20000) {
        return
      }
      this.infoStatus = data.id
      this.getNodeDetail(this.infoStatus).then(res => {
        if (+res.code === 20000) {
          this.nodeName = data.nodeName
        }
      })
      //获取安全员选项
      const { code: userCode, data: userData } = await this.fetchUserNodeInfo(this.infoStatus)
      if (+userCode !== 20000) {
        return
      }
      this.staffArr = (userData || []).map(item => {
        return item.userId
      })
      //创建流程
      let res = await this.createProcessData(this.infoStatus)
      if (+res.code === 20000) {
        console.log('创建流程了');
        this.taskId = (res.data || {}).taskId
        this.processId = (res.data || {}).processId
        this.docNumber = (res.data || {}).code
      }
      //获取下一节点信息
      const { code: nextCode, data: nextData } = await this.getNextTask(this.taskId, this.infoStatus)
      if (+nextCode !== 20000) {
        return
      }
      this.infoStatus = nextData.id || ''//更新获取下一节点
      //安全员直接通过
      const { code: resolveCode, data: resolveData } = await this.approvedTask(this.taskId, this.infoStatus, this.staffArr.join())
      if (+resolveCode !== 20000) {
        return
      }
      this.taskId = resolveData.taskId//更新taskId
      this.getUserNodeInfo(this.infoStatus)
    },
    setApproveData(data, status = -1) {
      this.createUserId = data.createUserId || ''
      this.taskId = data.taskId || ''
      this.infoStatus = data.infoStatus || ''
      this.id = data.checkId
      this.status = status
      this.date = data.date
      this.handler = data.handler
      this.step = 1
    },
    async nextConfirm() {
      if (this.status === 0) {
        //驳回
        const { code } = await this.approveSavaDraft()
        if (code === 20000) {
          this.$antMessage.success('驳回成功')
          this.$router.push({
            path: '/chemicalsIdentification/msdsApprove'
          })
        }
      } else {
        // 处理通过下一步
        const { code, data } = await this.getNextTask(this.taskId, this.infoStatus)
        if (+code !== 20000) {
          return
        }
        this.infoStatus = data.id || ''//更新获取下一节点
        if (this.infoStatus.indexOf('endEvent_') !== -1) {
          //最后一个节点通过后走归档操作
          this.lastNodeAction()
          //归档
        } else {
          //根据下一节点获取处理人员
          this.getUserNodeInfo(this.infoStatus)
          this.step = 2
        }
      }
    },
    //新建页面获取infoStatus
    getNodeDetail(infoStatus) {
      let para = {
        deploymentId: this.DEPLOYID,
        nodeId: infoStatus
      }
      return GetNodeDetail(para)
    },
    fetchUserNodeInfo(infoStatus) {
      let para = {
        node: infoStatus,
        userId: this.createUserId || this.queryObj.personId,
        corporationId: this.corporationId || undefined
      }
      return msdsApproveNodeUser(para)
    },
    async getUserNodeInfo(infoStatus) {
      //根据状态获取下一节点用户信息
      this.spinning = true
      const { code, data } = await this.fetchUserNodeInfo(infoStatus)
      this.spinning = false
      if (+code === 20000) {
        this.plainOptions = (data || []).map(item => {
          const { userId: value, name: label } = item
          return {
            value,
            label
          }
        })
      }
    },
    //处理 获取下一节点infoStatus信息
    getNextTask(taskId, infoStatus) {
      let para = {
        taskId: taskId,
        param: {}
      }
      para.param[infoStatus] = infoStatus
      return GetNextTask(para)
    },
    // 最后一个节点审批通过 + 归档
    async lastNodeAction() {
      const { code: resolveCode, data: resolveData } = await this.approvedTask(this.taskId, this.infoStatus, this.handler)
      if (+resolveCode !== 20000) {
        return
      }
      // this.taskId = resolveData.taskId//更新taskId
      //归档
      let para = {
        opinion: this.rebackMsg,
        date: this.date,
        id: this.id,
        taskId: this.taskId
      }
      const { code, data } = await PECheckSaveFiling(para)
      if (+code === 20000) {
        this.$antMessage.success('归档成功')

        // 最后节点代办推送
        this.pushTask(undefined);

        this.$router.push({
          path: '/occupationHealth/physicalExamApprove'
        })
      }
    },
    /**
     * @description: 审批通过
     */
    peApprovePass(taskId, infoStatus) {
      let para = {
        opinion: this.rebackMsg,
        id: this.id,
        taskId: taskId,
        node: infoStatus,
        userId: this.staffArr.join()//处理人
      }
      return PECheckApprove(para)
    },
    //驳回存草稿
    approveSavaDraft(taskId, infoStatus, handler) {
      let para = {
        opinion: this.rebackMsg,
        id: this.id,
        taskId: taskId || '',
        node: infoStatus || '',
        userId: handler || ''
      }
      return PECheckRejection(para)
    },
    //获取首节点信息
    getFirstNode() {
      let para = {
        deployId: this.DEPLOYID
      }
      return GetFirstNode(para)
    },
    createProcessData(infoStatus) {
      //根据infoStatus获取taskId
      let para = {
        deployId: this.DEPLOYID,
        module: new Date().getTime(),
        map: {}
      }
      para.map[infoStatus] = infoStatus
      return CreateProcess(para)
    },
    /**
     * @description: 审批通过
     */
    approvedTask(taskId, infoStatus, handler) {
      let para = {
        taskId: taskId,
        param: {},
        userId: this.userId,
        msg: this.rebackMsg
      }
      //key是节点信息，value是处理人
      para.param[infoStatus] = handler || ''
      return ApprovedTask(para)
    },
    /**
     * @description: 驳回上一节点
     * @return {*}
     */
    async doReject() {
      // let para = {
      //   taskId: this.taskId,
      // }
      // const { code, data } = await rejectedTaskToLast(para)
      // if (+code === 20000) {
      //   let handler = (data.param || {})[data.id]
      const { code: innerCode, data: innerData } = await this.approveSavaDraft()
      if (+innerCode === 20000) {
        this.$antMessage.success('驳回成功')
        this.$router.push({
          path: '/occupationHealth/physicalExamDraftList'
        })
      }
      // }
    },
    //发送
    chooseStaffConfirm: debounce(async function () {
      if (this.status === 0) {
        //驳回
        this.doReject()
        return
      }
      console.log("this.isResolve----", this.isResolve);
      if (!this.staffArr.length) {
        this.$antMessage.warning('请选择办理人')
        return
      }
      if (this.isResolve) {
        this.handleLoading();
        try {
          //处理的话走一个审批通过
          const { code: resolveCode, data: resolveData } = await this.approvedTask(this.taskId, this.infoStatus, this.handler)
          if (+resolveCode !== 20000) {
            return
          }
          this.taskId = resolveData.taskId//更新taskId
          const { code, data } = await this.peApprovePass(this.taskId, this.infoStatus)
          if (+ code === 20000) {
            console.log("dhhhhh--1-", data);
            // 消息推送
            if (data) {
              let id = data.id;
              let personId = data.personId;
              let url = '';
              if (data.isBatch == 1) {
                url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/occupationHealth/multiPEBookResolve&id=${id}`
                this.pushTask(url);
              } else {
                url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/occupationHealth/PEBookResolve&id=${id}&personId=${personId}`
                this.pushTask(url);
              }
              // if(id) {
              //   this.pushTask(url)
              // }
            }
            this.$router.push({
              path: '/occupationHealth/physicalExamApprove'
            })
            this.cancelLoading();
          }
        } catch (err) {
          this.cancelLoading();
        }

      } else {
        // let opinion = ''
        //提交 | 通过 发送(新建|编辑|处理，发送)
        let ovaPara = {
          infoStatus: this.infoStatus,
          taskId: this.taskId,
          processId: this.processId,
          docNumber: this.docNumber,
          handler: this.staffArr.join()//处理人
        }
        if (this.isResolve) {
          ovaPara.opinion = this.rebackMsg
        }
        this.$emit('save', 2, ovaPara)
      }

      // let para = {
      //   ...this.form,
      //   chemicalList: this.tableDataList,
      //   taskId: this.taskId,
      //   infoStatus: this.infoStatus,
      //   isDraft: 0,
      //   handler: this.staffArr.join()//处理人
      // }
      // if (this.isEdit || this.isResolve) {
      //   para.id = this.$route.query.id
      // }
      // if (this.isResolve) {
      //   para.opinion = this.rebackMsg
      // }
      // let api = (this.isEdit || this.isResolve) ? msdsApproveUpdate : msdsApproveSave //编辑更新 | 新建保存
      // const { code } = await api(para)
      // //处理的发送
      // if (+code === 20000) {
      //   let msg = this.isEdit ? '提交成功' : '通过成功'
      //   this.$antMessage.success(msg)
      //   this.chooseStaffVisible = false
      //   this.$router.push({
      //     path: '/chemicalsIdentification/msdsApprove'
      //   })
      // }
    }, 300, { leading: true, trailing: false }),
    // 代办推送
    async pushTask(url, ovaPara) {
      const pushTask = await PushTask({
        title: "体检预约处理",
        approval: 'physical_examination',
        userId: url ? this.staffArr.join() : undefined,
        docId: this.processId ? this.processId : this.form?.processId,
        // docId: this.processId,
        taskId: this.taskId,
        url: url,
        docNumber: this.docNumber || ''
      })
    },
  }
}
</script>

<style>
</style>