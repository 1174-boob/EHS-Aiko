<template>
  <iframe v-if="courseDetails.url" class="iframe-preview-pdf" :src="handleUrl()" frameborder="0"></iframe>
  <div v-else>url丢失</div>
</template>

<script>
import { Base64 } from '@/utils/base64.js'
export default {
  props: {
    courseDetails: {}
  },
  data() {
    return {
      previewFileBaseUrl: 'https://ziehs.boeplat.com/viewOnline//onlinePreview'
    };
  },
  created() {
  },
  methods: {
    handleUrl() {
      let myBase64 = Base64().Base64
      let targetUrl = `${this.previewFileBaseUrl}?url=${encodeURIComponent(myBase64.encode(this.courseDetails.url))}`
      return targetUrl
    },
  },
};
</script>

<style scoped lang='less'>
.iframe-preview-pdf {
  width: 100%;
  height: 100%;
}
</style>
