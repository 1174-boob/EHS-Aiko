<template>
  <div :class="['page-header', layout, pageWidth]">
    <div class="page-header-wide">
      <Breadcrumb :breadcrumb="breadcrumb"/>

      
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import {mapState} from 'vuex'
export default {
  name: 'PageHeader',
  components:{Breadcrumb},
  props: {
    title: {
      type: [String, Boolean],
      required: false
    },
    breadcrumb: {
      type: Array,
      required: false
    },
    logo: {
      type: String,
      required: false
    },
    avatar: {
      type: String,
      required: false
    },
  },
  computed: {
    ...mapState('setting', ['layout', 'showPageTitle', 'pageWidth'])
  }
}
</script>

<style lang="less" scoped>
  @import "index";
</style>
