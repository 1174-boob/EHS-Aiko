<template>
  <Scoring :action="'score'"></Scoring>
</template>

<script>
import Scoring from './component/scoring.vue';
export default {
  components: { Scoring },
  created() {
    this.setRouterCode("proposalApprove");
  },
}
</script>

<style>

</style>