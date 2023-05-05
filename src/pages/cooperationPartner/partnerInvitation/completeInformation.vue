<template>
  <div class="page-detail">
    <PageTitle>{{title}}</PageTitle>
    <div class="bg-fff flex flex-1 m-t-10">
      <div class="flex-1">
        <component :is="currentComponent" :partnerInfo="partnerInfo"></component>
        <div v-if="$route.query.status==1 || $route.query.status==2">
          <ImproveInfo :disabled="true" :invitationId="invitationId" :echoMsg="echoMsg" :status="$route.query.status"></ImproveInfo>
        </div>
        <div v-else>
          <ImproveInfo :submitClick="submitClick" :invitationId="invitationId" :echoMsg="echoMsg" :status="$route.query.status"></ImproveInfo>
        </div>
      </div>
      <Log :historyList="historyList" :noRemark="true"></Log>
    </div>
  </div>
</template>

<script>
import Info from '../cooperationInfo/info.vue';
import FixedBottom from "@/components/commonTpl/fixedBottom";
import ImproveInfo from "./improveInfo.vue";
import { InvitationDetail, PerfectInformation, ChangeInformation } from "@/services/api.js";
import Log from "./log.vue";
export default {
  name: 'audit',
  components: { FixedBottom, Info, Log, ImproveInfo },
  data() {
    return {
      partnerInfo: {},
      invitationId: '',
      historyList: [],
      currentComponent: Info,
      componentsParams: undefined,
      echoMsg: {},
      title: "",
    }
  },
  created() {
    this.setRouterCode("partnerInvitation");
    if (this.$route.query.status == 1) {
      this.title = "查看信息";
    } else if (this.$route.query.status == 2) {
      this.title = "处理信息";
    } else if (this.$route.query.status == 3) {
      this.title = "完善信息";
    } else if (this.$route.query.status == 4) {
      this.title = "更改信息";
    } 
    let id = this.$route.query.id;
    if (id) {
      this.getInvitationDetail(id);
    }
  },
  methods: {    
    // 获取详情
    getInvitationDetail(id) {
      this.invitationId = id;
      InvitationDetail({ invitationId: id }).then(res => {
        // 将返回值操作人id转换成name
        this.historyList = res.data.historyList || [];
        this.partnerInfo = res.data;
        this.echoMsg = res.data && res.data.enterpriseSupplierInfoVo;
      }).catch(err => {
        console.log(err);
      })
    },
    // 提交
    async submitClick(businessId) {
      const params = {
        invitationId: this.invitationId,
        fromId: businessId
      }
      let promiseFn = this.$route.query.edit ? ChangeInformation : PerfectInformation;
      promiseFn(params).then(res => {
        this.$antMessage.success("操作成功");
        this.back();
      }).catch(err => {
        console.log(err);
      })
    },
    // 返回
    back() {
      this.$router.push('/ehsGerneralManage/cooperationPartner/cooperationBaseInfo/partnerInvitation')
    },
  },

}
</script>

<style lang='less' scoped>
.page-detail {
  width: 100%;
  padding-bottom: 60px;
  overflow-y: auto;
  /deep/ .custom-font-form,
  /deep/ .el-form {
    padding-left: 0 !important;
  }
}
</style>