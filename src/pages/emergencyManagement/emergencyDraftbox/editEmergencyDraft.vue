<template>
  <DrillPlan :plan="'draft'" :planId="planId"></DrillPlan>
</template>

<script>
import DrillPlan from "../emergencyPlan/component/drillPlan.vue"
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