<template>
  <Proposal :action="'preview'" :reviewStatus="true"></Proposal>
</template>

<script>
import Proposal from "../myProposal/component/proposal.vue"
export default {
  components: { Proposal },
  created() {
    this.setRouterCode("proposalDatabase");
  }
}
</script>

<style>

</style>