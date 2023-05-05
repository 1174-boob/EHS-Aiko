<template>
  <div>
    <exception-page home-route="/overview/preview" :style="`min-height: ${minHeight}`" type="403" />
  </div>
</template>

<script>
import ExceptionPage from '@/components/exception/ExceptionPage'
import { mapState } from 'vuex'
export default {
  name: 'Exp403',
  components: { ExceptionPage },
  computed: {
    ...mapState('setting', ['pageMinHeight']),
    minHeight() {
      return this.pageMinHeight ? this.pageMinHeight + 'px' : '100vh'
    }
  }
}
</script>

<style scoped lang="less">
</style>
