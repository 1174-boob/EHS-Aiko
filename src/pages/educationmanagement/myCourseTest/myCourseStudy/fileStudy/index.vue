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
      previewFileBaseUrl: window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/viewOnline/onlinePreview` : `http://10.254.131.77/viewOnline/onlinePreview`
    };
  },
  created() {
  },
  methods: {
    handleUrl() {
      console.log(this.courseDetails.url)
      let myBase64 = Base64().Base64
      let targetUrl = `${this.previewFileBaseUrl}?url=${encodeURIComponent(myBase64.encode(this.courseDetails.url.replace("ehs", "ehsfile")))}`
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
