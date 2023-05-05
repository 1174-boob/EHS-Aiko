<template>
  <Proposal :action="'preview'"></Proposal>
</template>

<script>
import Proposal from "./component/proposal.vue"
export default {
  components: { Proposal },
  created() {
    this.setRouterCode("myProposal");
  },
}
</script>

<style>

</style>