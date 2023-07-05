<template>
  <div class="pe-book-container" :class="[showRightLog ? 'resolve-page' : '']">
    <HasFixedBottomWrapper>
      <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
        <a-tabs :activeKey="activeTab" @change="handleTabChange" :tabBarGutter="1" :animated="false">
          <a-tab-pane v-for="item of compList" :key="item.id" :tab="item.name"></a-tab-pane>
        </a-tabs>
        <component :disabled="disabled" :treeData="treeData" :para="para" :is="curComponent" ref="compRef"></component>
      </div>
      <div slot="fixedBottom">
        <FixedBottom class="fixed-button-container">
          <a-button @click="onCancel">取消</a-button>
          <!-- <a-button v-if="isEdit || isCreate" type="primary" @click="onSubmit">提交</a-button> -->
          <a-button v-if="isResolve && isToApprove" @click="onRejected">驳回</a-button>
          <a-button v-if="isResolve && isToApprove" type="primary" @click="onApproved">通过</a-button>
          <a-button v-else-if="isEdit || isCreate" type="primary" @click="doSubmit">提交</a-button>
        </FixedBottom>
      </div>
    </HasFixedBottomWrapper>
    <div class="right-side" v-if="showRightLog">
      <OPLog :data="opData" />
    </div>
    <ApproveModal @doApprove="doApprove" @doReject="doReject" :isReject="isReject" ref="approveModal" :approveVisible.sync="approveVisible" />
  </div>
</template>
<script>
import FixedBottom from "@/components/commonTpl/fixedBottom"
import { tabComps } from './comp/compConfig'
import OPLog from './comp/OPLog'
import ApproveModal from './comp/ApproveModal'
import moment from 'moment'
import { safeMonthList, checkReportData, safeMonthProcessSave, safeMonthProcessResolve, safeMonthProcessReject, getSafeLog } from '@/services/safeMonth'
import { queryDeptTree, PushTask } from '@/services/api'
import { debounce, cloneDeep } from 'lodash'
import { getQueryVariable } from "@/utils/util.js";

export default {
  components: { FixedBottom, OPLog, ApproveModal },
  data() {
    return {
      form: {},
      opData: [],
      userInfo: {
        corporationId: '',
        centerId: ''
      },
      approveVisible: false,
      isReject: false,
      lastTabKey: 'accident',
      treeData: [],
      activeTab: 'accident',
      compList: tabComps,
      curComponent: (tabComps.find(item => {
        return item.id === 'accident'
      }) || {}).component
    }
  },
  mounted() {
    this.setRouterCode('safeBranchCorp')
    this.init()
  },
  computed: {
    showRightLog() {
      return this.isResolve || this.$route.query.type === 'approveView'
    },
    disabled() {
      return this.$route.meta && (this.$route.meta.isView || this.$route.meta.isResolve)
    },
    isToApprove() {
      return this.$route.query && (+this.$route.query.status === 2 || getQueryVariable('status') == '2')
    },
    isResolve() {
      return this.$route.meta && this.$route.meta.isResolve
    },
    isView() {
      return this.$route.meta && this.$route.meta.isView
    },
    isEdit() {
      return this.$route.meta && this.$route.meta.isEdit
    },
    isCreate() {
      return this.$route.meta && this.$route.meta.isCreate
    },
    para() {
      return {
        // centerId: this.$route.query.cId || getQueryVariable('type'),
        corporationId: this.$route.query.corpId || getQueryVariable('corpId'),
        reportDate: this.$route.query.date || getQueryVariable('date'),
        state: this.$route.query.state || getQueryVariable('state')
      }
    }
  },
  methods: {
    async init() {
      // treeData
      this.getTreeData()
      this.$nextTick(() => {
        // this.$refs.compRef.fetchData()
      })
      if (this.isView || this.isResolve) {
        let para = {
          operateId: this.$route.query.id || getQueryVariable('id')
        }
        const { data } = await getSafeLog(para)
        this.opData = data
      }
      // let userInfo = JSON.parse(sessionStorage.getItem('zconsole_userInfo')) || {}
      // let user = userInfo.user || {}
      // console.log(user, 'user - -- - -')
      // this.userInfo.corporationId = user.adminDeptId
      // // this.userInfo.
      // this.userInfo.centerId = this.getMappingValue(this.getCommonAddOrgnizeList, "id", user.adminDeptId).centerId
      // console.log(this.userInfo, 'this.userInfo - - -- -')
    },
    getTreeData() {
      let list = this.getCommonAddOrgnizeList
      let deptId = this.getMappingValue(list, "id", this.$route.query.corpId).deptId
      queryDeptTree({
        deptId: deptId
      }).then(res => {
        this.treeData = res.data ? [res.data] : [];
      }).catch(err => { console.log(err) })
    },
    /**
     * @description: tab点击事件
     * @param {*} tabKey：当前组件key
     * @return {*}
     */
    handleTabChange(tabKey) {
      if (this.$refs.compRef.checkIsChanged()) {
        this.activeTab = this.lastTabKey
        // this.$antMessage.warn('页面数据发生修改，您还没有保存')
        // return
        this.$antConfirm({
          title: '提示',
          content: '页面数据发生修改，您还没有保存，确定不保存吗？',
          cancelText: '取消',
          onOk: async () => {
            // 孙赫，2023-03-13，是否合理？
            await this.$refs.compRef.onSave();
            this.toTargetComp(tabKey)
          },
          onCancel: async() => {
            // 孙赫，2023-03-13，是否合理？
            await this.$refs.compRef.onSave();
            this.toTargetComp(tabKey)
          },
        });
      } else {
        this.toTargetComp(tabKey)
      }
    },
    toTargetComp(tabKey) {
      this.activeTab = tabKey
      this.lastTabKey = tabKey
      this.curComponent = (tabComps.find(item => {
        return item.id === tabKey
      }) || {}).component
      let para = {
        ...this.para
      }
      para.reportDate = moment(this.form.reportDate).format('YYYY-MM')
      this.$nextTick(() => {
        // this.$refs.compRef.fetchData(para)
      })
    },
    doApprove(msg) {
      this.approveProcess(1, msg)
    },
    doReject(msg) {
      this.approveProcess(2, msg)
    },
    // 提交 
    doSubmit: debounce(function () {
      this.approveProcess(1, '', true)
    }, 250),
    async approveProcess(approvalStatus = 1, remake = '', flag) {
      console.log(this.$route)
      console.log(this.para)
      var _this = this;
      let para = {
        corporationId: this.para.corporationId,
        reportDate: this.para.reportDate,
        remake: remake
      }
      if (approvalStatus === 1) {
        let userInfo = JSON.parse(sessionStorage.getItem('zconsole_userInfo')) || {}
        let user = userInfo.user || {}
        para.handler = user.userId
        para.deptId = user.adminDeptId
      }
      let api = approvalStatus === 1 ? safeMonthProcessResolve : safeMonthProcessReject
      const { data } = await api(para)
      let msg = approvalStatus === 1 ? '审核通过成功' : '审核已驳回'
      if (flag) {
        msg = '提交成功'
      }
      this.$antMessage.success(msg)

      // console.log(approvalStatus, 'approvalStatusapprovalStatusapprovalStatusapprovalStatus')
      // if(approvalStatus === 1) {
      //   const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/safeManage/securityThinkTank/monthReportManage/safeBranchCorpResolve?id=${this.$route.query.queryData.id}&cId=${this.$route.query.cId}&corpId=${this.$route.query.corpId}&date=${this.para.reportDate}&status=${this.$route.query.status}`;
      //   await PushTask({
      //     title: "安全月报审批",
      //     approval: 'monthReport',
      //     userId: para.handler,
      //     docId: this.$route.query.queryData.id,
      //     url: url,
      //   })
      //   this.approveVisible = false
      // } else {
        this.approveVisible = false
        this.$router.push({
          path: '/safeManage/securityThinkTank/monthReportManage/safeBranchCorp'
        })
      // }
    },
    onDateChange(date) {
      // this.$refs.compRef.fetchData(date)
    },
    /**
     * @description: 模块校验
     * @return {*}
     */
    // async validate() {
    //   try {
    //     await this.validatePromise()
    //     return true
    //   } catch (e) {
    //     this.$antMessage.warning(e)
    //     return false
    //   }
    // },
    /**
     * @description: 所有组件校验promise
     * @return {*}
     */
    // async validatePromise() {
    //   let refsArr = this.compList.map(item => {
    //     return item.id
    //   })
    //   let promiseArr = []
    //   refsArr.forEach(item => {
    //     promiseArr.push(new Promise((resolve, reject) => {
    //       this.$refs[item][0].validate((valid, msg) => {
    //         if (valid) {
    //           resolve()
    //         } else {
    //           reject(msg)
    //         }
    //       })
    //     }))
    //   })
    //   return Promise.all(promiseArr)
    // },
    /**
     * @description: 所有组件数据
     * @return {*}
     */
    getData() {
      let data = {}
      this.compList.forEach(item => {
        data[item.id] = this.$refs[item.id][0].getData()
      })
      return data
    },
    /**
     * @description: 保存
     * @return {*}
     */
    onSave() {

    },
    onApproved() {
      this.isReject = false
      this.approveVisible = true
    },
    onRejected() {
      this.isReject = true
      this.approveVisible = true
    },
    onCancel() {
      this.setKeepalive(true)
      this.$router.push({
        path: '/safeManage/securityThinkTank/monthReportManage/safeBranchCorp'
      })
    },
    /**
     * @description: 提交
     * @return {*}
     */
    onSubmit: debounce(async function () {
      let userInfo = JSON.parse(sessionStorage.getItem('zconsole_userInfo')) || {}
      let user = userInfo.user || {}
      let para = {
        reportDate: this.para.reportDate,
        handler: user.userId,
        corporationId: this.para.corporationId,
        centerId: this.para.centerId,
        deptId: user.adminDeptId
      }
      const { data } = await safeMonthProcessSave(para)
      //data成功则为null，失败则是对应模块检查的错误提示信息
      if (!data) {
        this.$antMessage.success('提交成功')
        this.onCancel()
      } else {
        this.$antMessage.warn(data)
      }
    }, 250),
    async validate() {
      try {
        let para = {
          ...this.para
        }
        await checkReportData(para)
        return true
      } catch (e) {
        return false
      }
    },
    corporationDeptChange(treeData) {
      console.log(treeData, 'treeData')
      this.treeData = treeData
    }
  },


}
</script>

<style lang="less" scoped>
/deep/.mgl-10 {
  margin-left: 10px;
}
/deep/.echarts-style {
  height: 400px;
}
.top-search {
  margin-top: 20px;
}
.resolve-page {
  /deep/.fixed-bottom {
    width: calc(100vw - 812px);
  }
}
.pe-book-container {
  display: flex;
  width: 100%;
}
.left-side {
  flex: 1;
  width: 0;
}
/deep/h3 {
  &.top-title {
    margin-top: 0;
  }
  margin-top: 10px;
  display: flex;
  align-items: center;
  font-size: 14px;
  i {
    width: 2px;
    height: 14px;
    margin-right: 5px;
    background: #0067cc;
    display: inline-block;
  }
}
.right-side {
  margin-top: 40px;
  flex-basis: 426px;
  background: #fcfcfc;
  border: 1px solid rgba(244, 244, 244, 1);
  border-radius: 4px 0px 0px 4px;
  margin-left: 20px;
  overflow: auto;
}
.arc {
  margin-top: 40px;
  width: 100%;
}
.table-container {
  width: calc(100vw - 300px);
  margin-top: 10px;
}
.resolve-page.table-container {
  width: calc(100vw - 700px);
}
</style>