<template>
  <DrillReport :drillCode="'add'" :planId="planId"></DrillReport>
</template>

<script>
import DrillReport from "./component/drillReport.vue"
export default {
  components: { DrillReport },
  data() {
    return {
      planId: "",
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