<template>
  <div class="page-detail">
    <PageTitle>查看</PageTitle>
    <div class="bg-fff flex flex-1">
      <component :is="currentComponent" :partnerInfo="partnerInfo"></component>
      <Log :historyList="historyList"></Log>
    </div>

    <FixedBottom>
      <a-button :style="{ marginLeft: '8px' }" @click="back">返回</a-button>
    </FixedBottom>
  </div>
</template>

<script>
import Info from '../cooperationInfo/info.vue';
import Log from "./log.vue";
import FixedBottom from "@/components/commonTpl/fixedBottom";
import { InvitationDetail } from "@/services/api.js";
export default {
  name: 'audit',
  components: { FixedBottom, Info, Log },
  data() {
    return {
      partnerInfo: {},
      historyList: [],
      currentComponent: Info,
    }
  },
  beforeRouteEnter(to, from, next) {
    const id = to.query.id;
    if (id) {
      next(vm => {
        vm.setRouterCode("partnerInvitation");
        vm.getInvitationDetail(id);
      })
    } else {
      next(vm=>{
        vm.setRouterCode("partnerInvitation");
      })
    }
  },
  methods: {
    // 获取详情
    getInvitationDetail(id) {
      InvitationDetail({ invitationId: id }).then(res => {
        this.partnerInfo = res.data;
        this.historyList = res.data.historyList;
      }).catch(err => {
        console.log(err);
      })
    },
    // 返回
    back() {
      this.setKeepalive(true)
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
}
</style>