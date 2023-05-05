<template>
  <DrillPlan :plan="'adjust'" :planId="planId" :adjust="true"></DrillPlan>
</template>

<script lang="js">
import DrillPlan from "./component/drillPlan.vue"
export default {
  components: { DrillPlan },
  data() {
    return {
    }
  },
  created() {
    this.setRouterCode("emergencyPlan");
    this.planId = this.$route.query.planId;
  }
}
</script>

<style>

</style>