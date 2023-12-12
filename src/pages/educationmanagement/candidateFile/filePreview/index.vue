<template>
  <a-spin :spinning="spinning" wrapperClassName="a-spin">
    <div class="file-preview clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
      <iframe class="iframe-preview-pdf" v-if="pdfUrl" :src="pdfUrl" frameborder="0"></iframe>
      <div v-else>地址错误</div>
      <FixedBottom>
        <a-button :style="{ marginLeft: '8px' }" @click="back">返回</a-button>
      </FixedBottom>
    </div>
  </a-spin>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom";
import { getCandidateFileDetailExamExport } from "@/services/api.js";
export default {
  components: { FixedBottom },
  data() {
    return {
      spinning: true,
      pdfUrl: '',
      userId: undefined,
      companyId: undefined,
      courseId: undefined,
      testId: undefined,
      testPushId: undefined,
      coursePushId: undefined,
    };
  },
  created() {
    this.userId = this.$route.query.userId
    this.companyId = this.$route.query.companyId
    this.courseId = this.$route.query.courseId
    this.testId = this.$route.query.testId
    this.testPushId = this.$route.query.testPushId
    this.coursePushId = this.$route.query.coursePushId
    this.getPaperUrl()
  },
  methods: {
    getPaperUrl() {
      let apiData = {
        userId: this.userId,
        companyId: this.companyId,
        courseId: this.courseId,
        testId: this.testId,
        testPushId: this.testPushId,
        coursePushId: this.coursePushId,
      }
      getCandidateFileDetailExamExport(apiData)
        .then(res => {
          const blob = new Blob([res], { type: "application/pdf" });
          this.pdfUrl = URL.createObjectURL(blob); //创建下载链接
        })
        .catch(err => {

        })
        .finally(() => {
          this.spinning = false
        })
    },
    back() {
      this.$router.go(-1)
    }
  },
};
</script>

<style scoped lang='less'>
.file-preview {
  .iframe-preview-pdf {
    width: 100%;
    height: calc(100% - 75px);
  }
}
</style>
