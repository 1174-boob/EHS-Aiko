<template>
  <DrillPlan :plan="'edit'" :planId="planId"></DrillPlan>
</template>

<script>
import DrillPlan from "./component/drillPlan.vue"
export default {
  components: { DrillPlan },
  data() {
    return {
      planId:''
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