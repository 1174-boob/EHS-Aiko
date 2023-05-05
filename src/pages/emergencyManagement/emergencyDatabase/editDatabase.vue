<template>
  <Database :prepId="prepId"></Database>
</template>

<script>
import Database from "./component/database.vue"
export default {
  components: { Database },
  data() {
    return {
      prepId: '',
    }
  },
  created() {
    this.prepId = this.$route.query.prepId;
  }
}
</script>

<style>

</style>