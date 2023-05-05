<template>
  <DrillPlan :plan="'add'"></DrillPlan>
</template>

<script>
import DrillPlan from "./component/drillPlan.vue"
export default {
  components: { DrillPlan },
  data() {
    return {
    }
  },
  created() {
    this.setRouterCode("emergencyPlan");
  }
}
</script>

<style>

</style>