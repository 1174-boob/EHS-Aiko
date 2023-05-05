<template>
  <div class="my-course-detail file-detail clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <div class="my-exam-result-main">
        <a-result class="my-exam-result" :status="detailsObj.status==2?'success':'info'" :title="detailsObj.status==2?'考试通过':'考试未通过' ">
          <template #extra>
            <ul class="my-exam-result-detail">
              <li class="detail-item">
                <div class="detail-item-title">得分</div>
                <div class="detail-item-main">{{detailsObj.score}}</div>
              </li>
              <li class="detail-item">
                <div class="detail-item-title">用时</div>
                <div class="detail-item-main">{{getTimeStr(detailsObj.duration)}}</div>
              </li>
              <li class="detail-item">
                <div class="detail-item-title">错题</div>
                <div class="detail-item-main">{{detailsObj.incorrectNum}}</div>
              </li>
              <li class="detail-item" v-if="formType == 2 && (detailsObj.examTimes || detailsObj.examTimes===0)">
                <div class="detail-item-title">剩余考试次数</div>
                <div class="detail-item-main">{{detailsObj.examTimes}}</div>
              </li>
            </ul>
            <div>
              <template v-if="detailsObj.status!=2">
                <a-button type="primary" v-if="detailsObj.examTimes === null || (detailsObj.examTimes && detailsObj.examTimes != 0)" :loading="loading" class="exam-reset" @click="goExamReset">重新考试</a-button>
              </template>
              <a-button :type="detailsObj.status==2 ? 'primary' :'default'" @click="goMyExamDetail">查看答题详情</a-button>
            </div>
          </template>
        </a-result>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { cloneDeep, debounce } from "lodash";
import { getMyExamResultDetailsApi, getMyCourseExamDetailApi } from "@/services/api.js";
import cancelLoading from '@/mixin/cancelLoading';
export default {
  mixins: [cancelLoading],
  data() {
    return {
      spinning: true,
      detailsObj: {
        // 1考试未开始  2考试合格  3考试不合格
        status: 2,
        score: undefined,
        duration: undefined,
        incorrectNum: undefined
      },
      // 1通过课程进入 2通过考试进入 
      formType: 1,
      testRecordsId: undefined
    };
  },
  created() {
    this.formType = sessionStorage.getItem('ehs-myExamDetailFormType') || 1
    this.testRecordsId = this.$route.query.testRecordsId
    this.initPage()
  },
  methods: {
    initPage() {
      if (this.testRecordsId) {
        this.getMyExamResultDetailsApiFn()
      } else {
        let detailsObj = sessionStorage.getItem('ehs-myExamResult') || ''
        this.detailsObj = JSON.parse(detailsObj) || {}
        setTimeout(() => {
          this.spinning = false
        }, 300);
      }
    },
    // 重新考试
    goExamReset() {
      if (this.formType == 1) {
        this.$router.go(-1)
      } else {
        this.handleLoading()
        let apiData = {
          testId: this.detailsObj.testId,
        }
        getMyCourseExamDetailApi(apiData)
          .then(res => {
            let examDetail = res.data || {}
            if (!examDetail.timeIntervalFlag) {
              this.$antMessage.warn(`距离上次考试时间未超过${examDetail.timeInterval}分钟，请稍后再考`)
            } else {
              let query = { testId: this.detailsObj.testId, paperId: this.detailsObj.paperId, formType: this.formType }
              this.$router.push({
                path: '/ehsGerneralManage/educationmanagement/myExamIng',
                query
              })
            }
          })
          .catch(err => { })
          .finally(() => {
            this.cancelLoading()
          })
      }
    },
    // 获取详情
    getMyExamResultDetailsApiFn() {
      let apiData = { testRecordsId: this.testRecordsId }
      getMyExamResultDetailsApi(apiData)
        .then(res => {
          let detailsObj = res.data || {}
          this.detailsObj = cloneDeep(detailsObj)
        })
        .catch(err => { })
        .finally(() => {
          this.spinning = false
        })
    },
    goMyExamDetail() {
      let query = { testRecordsId: this.detailsObj.testRecordsId }
      this.$router.push({
        path: '/ehsGerneralManage/educationmanagement/myExamDetail',
        query
      })
    },
    // 转时间
    getTimeStr(s) {
      s = (s / 1000).toFixed(0)
      let durationStr = ''
      let day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整
      let hour = Math.floor((s - day * 24 * 3600) / 3600);
      durationStr = day ? (durationStr + day + "时") : durationStr
      let minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
      durationStr = minute ? (durationStr + minute + "分钟") : durationStr
      let second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
      durationStr = second ? (durationStr + second + "秒") : durationStr
      return durationStr
    }
  },
};
</script>

<style scoped lang='less'>
.my-course-detail {
  padding-top: 20px;
  display: flex;
  .my-exam-result-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    .my-exam-result {
      margin-top: -60px;
      .my-exam-result-detail {
        display: flex;
        margin-bottom: 44px;
        .detail-item {
          width: 180px;
          border: 1px solid #e8eaec;
          border-right: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px 15px;
          font-size: 18px;
          font-weight: bold;
          &:nth-last-child(1) {
            border-right: 1px solid #e8eaec;
          }
          .detail-item-title {
            margin-bottom: 30px;
          }
          .detail-item-main {
          }
        }
      }
      .exam-reset {
        margin-right: 30px;
      }
    }
  }
}
::v-deep .ant-result-title {
  font-size: 26px;
}
::v-deep .ant-result-subtitle {
  font-size: 16px;
}
::v-deep .ant-result-info .ant-result-icon > .anticon {
  color: #faad14;
}
::v-deep .ant-result-extra > * {
  margin-right: 0px;
}
</style>
