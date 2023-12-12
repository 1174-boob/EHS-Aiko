<template>
  <HasSpinAndBtnBox :spinning="spinning">
    <div class="study-play-box">
      <div class="study-play-title">{{ courseDetails.coursewareName }}</div>
      <a-divider />
      <div class="study-play-main">
        <!-- 课件类型 1MP3，2MP4 3PDF 4PPT -->
        <VideoStudy
          ref="videoStudy"
          v-if="[1, 2].includes(courseDetails.type)"
          :videoObj="courseDetails"
          @viodePlayEnd="viodePlayEnd"
          @viodePlayPaused="viodePlayPaused"
          @setTimeoutSaveStudyCount="startRecordTime"
          @stopSetTimeoutSaveStudyCount="stopRecordTime"
        />
        <FileStudy ref="fileStudy" v-else-if="[3, 4].includes(courseDetails.type)" :courseDetails="courseDetails" />
        <div v-else>类型错误</div>
      </div>
    </div>

    <FixedBottom slot="fixedBottom">
      <a-button :style="{ marginLeft: '8px' }" @click="back">返回</a-button>
    </FixedBottom>
  </HasSpinAndBtnBox>
</template>

<script>
import FileStudy from './fileStudy/index.vue'
import VideoStudy from './videoStudy/index.vue'
import { cloneDeep } from 'lodash'
import { getMyCourseStudyTargetDetailApi, setMyCourseStudyCountApi } from "@/services/api.js";
export default {
  components: { FileStudy, VideoStudy },
  data() {
    return {
      spinning: true,
      courseDetails: {
        type: undefined,
        url: '',
        studyCount: 0,
      },
      // 记录时间
      studyDuration: 0,
      recordTimer: null,
      // 保存进度间隔
      saveStudyCountTime: 10,
      // 是否正在保存中
      isSaveIng: false,
      // 课程id
      courseId: undefined,
      // 模块id
      moduleId: undefined,
      // 课件id
      coursewareId: undefined,
      // 在当前页面
      innerPage: true,
      paperObj: {},
    };
  },
  created() {
    let { courseId, moduleId, coursewareId, paperObj } = this.$route.query
    this.courseId = courseId
    this.moduleId = moduleId
    this.coursewareId = coursewareId
    this.paperObj = paperObj ? JSON.parse(paperObj) : {}
    this.getMyCourseStudyTargetDetailFn()
  },
  computed: {
    // 音频、视频类型
    isVideoType() {
      return [1, 2].includes(this.courseDetails.type)
    }
  },
  methods: {
    // 获取页面信息api
    getMyCourseStudyTargetDetailFn() {
      let apiData = {
        courseId: this.courseId,
        moduleId: this.moduleId,
        coursewareId: this.coursewareId,
        coursePushId: this.paperObj.coursePushId
      };
      getMyCourseStudyTargetDetailApi(apiData)
        .then((res) => {
          let courseDetails = res.data || {}
          // 完成状态0-未开始，1-学习中，2-已完成
          if ([1, 2].includes(courseDetails.type)) { // type 1音频 2视频 
            if (courseDetails.status == 2) {
              // 学完可以拖动进度
              courseDetails.allowSeekPlayed = false
              courseDetails.studyCount = 0
            }
          } else {
            // 开始计时
            this.startRecordTime()
            if (courseDetails.status != 2) { //未学完
              // 3秒后自动学习完成
              setTimeout(async () => {
                if (this.innerPage) {
                  await this.saveStudyCountAndRecordTimeFn()
                  this.courseDetails.status = 2
                }
              }, 3000);
            }
          }
          this.courseDetails = cloneDeep(courseDetails)
        })
        .catch(err => { })
        .finally(() => {
          this.spinning = false
        })
    },
    // 获取当前课程学习进度
    getStudyCount() {
      // type 1音频 2视频 3Pdf
      let studyCount = 0
      if (this.courseDetails.type == 1) {  //mp3

      } else if (this.courseDetails.type == 2) { //mp4
        if (this.$refs.videoStudy.player.ended || this.courseDetails.status == 2) {
          studyCount = this.courseDetails.length
        } else {
          studyCount = Math.floor(this.$refs.videoStudy.player.currentTime)
        }
      } else { //Pdf 文件 等
        studyCount = this.courseDetails.length
      }
      return studyCount
    },
    // 获取本次学习时长
    getrecordTime() {
      let studyDuration = this.studyDuration
      // 视频类型且未学习完
      // if (this.isVideoType && this.courseDetails.status != 2) {
      //   studyDuration = this.getStudyCount()
      // }
      return studyDuration
    },
    // 更新学习进度api
    setMyCourseStudyCountFn(studyCount, studyDuration) {
      let apiData = {
        courseId: this.courseId,
        moduleId: this.moduleId,
        coursewareId: this.coursewareId,
        studyCount,
        studyDuration,
      }
      return setMyCourseStudyCountApi(apiData)
        .then(res => { })
        .catch(err => { })
    },
    // 定时保存当前学习进度和学习时常,isForce是否强制更新
    saveStudyCountAndRecordTimeFn(isForce = false) {
      // 获取当前学习进度和学习时长
      let studyCount = this.getStudyCount()
      let studyDuration = this.getrecordTime()
      // 获取后接口前-学习时长清零
      this.studyDuration = 0

      // 如果视频学完且处于暂停状态，不更新进度
      if (!isForce && this.courseDetails.type == 2 && this.$refs.videoStudy && this.$refs.videoStudy.player.paused) {
        this.stopRecordTime()
        return Promise.resolve()
      } else {
        this.isSaveIng = true
        return Promise.all([
          this.setMyCourseStudyCountFn(studyCount, studyDuration),
        ])
          .then(res => { })
          .catch(err => { })
          .finally(() => {
            this.isSaveIng = false
          })
      }
    },
    // 视频播放结束
    viodePlayEnd() {
      this.saveStudyCountAndRecordTimeFn(true)
        .then(res => {
          this.courseDetails.status = 2
          this.stopRecordTime()
        })
        .catch(err => { })
    },
    // 视频播放暂停
    viodePlayPaused() {
      this.saveStudyCountAndRecordTimeFn(true)
        .then(res => {
          this.stopRecordTime()
        })
        .catch(err => { })
    },
    // 开始计时
    startRecordTime() {
      this.recordTimer && window.clearInterval(this.recordTimer)
      this.recordTimer = setInterval(() => {
        this.studyDuration++
      }, 1000);
    },
    // 停止计时
    stopRecordTime() {
      console.log('停止定时更新当前学习进度');
      this.recordTimer && window.clearInterval(this.recordTimer)
    },
    // 返回
    back() {
      this.$router.go(-1)
    }
  },
  watch: {
    studyDuration(newVal) {
      if (newVal % this.saveStudyCountTime === 0) {
        if (!this.isSaveIng) {
          this.saveStudyCountAndRecordTimeFn()
          // this.studyDuration = 0
        }
      }
    }
  },
  beforeDestroy() {
    this.innerPage = false
    this.recordTimer && window.clearTimeout(this.recordTimer)
    // 更新进度
    this.saveStudyCountAndRecordTimeFn()
  },
};
</script>

<style scoped lang='less'>
.study-play-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  .study-play-title {
    margin-top: 10px;
    font-size: 18px;
    color: #333;
  }
  .study-play-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ccc;
    overflow: hidden;
  }
}
</style>
