<template>
  <CommonModal title="考试提示" :visible="tipModelShow" :cancelFn="closeModel">
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <div class="confirmDom-box">
        <h3 class="name-title">{{examDetai.name || ''}}</h3>
        <div>
          <span>关联课程 :</span>
          <span>{{examDetai.courseName || ''}}</span>
        </div>
        <div>
          <span>参考次数 :</span>
          <span>{{ examDetai.limitFrequency == 1 ? '无限制' : (examDetai.times || 0) + '/' + examDetai.frequency + '次'}}</span>
        </div>
        <div>
          <span>答卷时长 :</span>
          <span>{{examDetai.examinationTime || ''}}分钟</span>
        </div>
        <div>
          <span>试卷总分 :</span>
          <span>{{examDetai.totalScore || ''}}分</span>
        </div>
        <div>
          <span>及格分数 :</span>
          <span>{{examDetai.accessScore || ''}}分</span>
        </div>
        <div>
          <span>考试须知 :</span>
          <!-- <div v-html="examDetai.detail"></div> -->
          <p>各位考生请注意：<br/> 1、进入考试页面点击“开始考试”即正式答题； <br/>2、进行答题时请注意考试页面的倒计时，时间结束系统将强制提交试卷，请注意考试时间安排；<br/> 3、考试过程中请勿随意切换屏幕界面，造成任何后果由考生自行负责；<br/> 4、最终考试成绩以试卷提交成功为准。<br/> 祝各位考出好成绩！</p>
        </div>
      </div>
    </a-spin>
    <template slot="btn">
      <a-button type="dashed" @click="closeModel">取消</a-button>
      <a-button type="primary" :loading="loading" :disabled="examDetai.limitFrequency != 1 && examDetai.times >= examDetai.frequency" style="margin-left: 0.2rem" @click="onSubmit">开始考试</a-button>
    </template>
  </CommonModal>
</template>

<script>
import { getMyCourseExamDetailApi } from "@/services/api.js";
import cancelLoading from '@/mixin/cancelLoading';
export default {
  mixins: [cancelLoading],
  model: {
    prop: 'tipModelShow',
  },
  props: {
    tipModelShow: {
      type: Boolean,
      default: false
    },
    testDetai: {},
    testRecordsId: {},
  },
  data() {
    return {
      spinning: true,
      examDetai: {},
    };
  },
  methods: {
    getMyCourseExamDetailFn() {
      let apiData = {
        testId: this.testDetai.testId,
      }
      getMyCourseExamDetailApi(apiData)
        .then(res => {
          this.examDetai = res.data || {}
        })
        .catch(err => { })
        .finally(() => {
          this.spinning = false
        })
    },
    closeModel() {
      this.$emit('input', false)
    },
    // 提交
    onSubmit() {
      if (this.spinning) return
      this.handleLoading()
      let apiData = {
        testId: this.testDetai.testId,
      }
      getMyCourseExamDetailApi(apiData)
        .then(res => {
          let examDetail = res.data || {}
          if (!examDetail.timeIntervalFlag) {
            this.$antMessage.warn(`距离上次考试时间未超过${examDetail.timeInterval}分钟，请稍后再考`)
            return
          } else {
            // formType 1通过课程进入 2通过考试进入 
            let query = { testId: this.testDetai.testId, paperId: this.examDetai.paperId, formType: 2, testObj: JSON.stringify(this.testDetai) }
            this.closeModel()
            this.$router.push({
              path: '/ehsGerneralManage/educationmanagement/myExamIng',
              query: query
            })
          }
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoading()
        })
    },
  },
  watch: {
    tipModelShow(newVal) {
      if (newVal) {
        this.getMyCourseExamDetailFn()
      } else {
        setTimeout(() => {
          this.spinning = true
        }, 300);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.confirmDom-box {
  .name-title {
    font-weight: bold;
  }
  & > div {
    margin-bottom: 12px;
    display: flex;
    & > span:nth-of-type(1) {
      margin-right: 8px;
      flex: none;
    }
    & > span:nth-of-type(2) {
      flex: 1;
    }
  }
}
</style>
