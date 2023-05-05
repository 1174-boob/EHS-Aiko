<template>
  <div class="my-exam-ing clx-flex-1 bg-fff">
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <div class="searchtable-wrapper">
        <template title="题目">
          <div class="left-box">
            <PageTitle class="my-course-detail-main-title">
              {{ paperDetail.name }}
              <div class="countdown">
                <template v-if="formType == 2">
                  <span class="tip">倒计时:</span>
                  <a-statistic-countdown :value="examDetai.examinationTime" format="mm:ss" @finish="onFinish" />
                </template>
              </div>
            </PageTitle>
            <a-divider />
            <ul class="exam-box clx-show-scroll beauty-scroll">
              <li class="exam-item" v-for="(item, index) in paperList" :key="item.topicId">
                <p class="exam-stem">{{ index + 1 }}、{{ item.topicTitle }}（{{item.topicType | topicType}}，{{ item.topicScore }}分）</p>

                <template v-if="item.topicType == 1" title="单选题">
                  <a-radio-group v-model="item.select">
                    <a-radio class="option-item" v-for="item1 in item.optionsRels" :value="item1.optionsId" :key="item1.optionsId">{{item1.optionsContent}}</a-radio>
                  </a-radio-group>
                </template>

                <template v-if="item.topicType == 2" title="多选题">
                  <a-checkbox-group v-model="item.select">
                    <a-checkbox class="option-item" v-for="item1 in item.optionsRels" :value="item1.optionsId" :key="item1.optionsId">{{item1.optionsContent}}</a-checkbox>
                  </a-checkbox-group>
                </template>

                <template v-if="item.topicType == 3" title="判断题">
                  <a-radio-group v-model="item.select">
                    <a-radio class="option-item" v-for="item1 in item.optionsRels" :value="item1.optionsId" :key="item1.optionsId">{{item1.optionsContent}}</a-radio>
                  </a-radio-group>
                </template>
              </li>
            </ul>
          </div>
        </template>

        <template title="答题卡">
          <div class="right-box bg-fc border-radius-3 border-f4">
            <h3 class="right-box-title border-b-e7 border-b-f6 bg-fff pd-l-20 pd-r-20 font-18 color-333">答题卡</h3>
            <div class="right-box-main clx-show-scroll beauty-scroll">
              <template title="单选题">
                <div class="card-box">
                  <span class="card-title">单选题</span>
                  <div class="card-item-box">
                    <span v-for="item in topicType1" :key="item.topicId" class="card-item" :class="item.select?'card-item-active':''">{{item.cardNumber}}</span>
                  </div>
                </div>
              </template>

              <template title="多选题">
                <div class="card-box">
                  <span class="card-title">多选题</span>
                  <div class="card-item-box">
                    <span v-for="item in topicType2" :key="item.topicId" class="card-item" :class="Array.isArray(item.select) && item.select.length ?'card-item-active':''">{{item.cardNumber}}</span>
                  </div>
                </div>
              </template>

              <template title="判断题">
                <div class="card-box">
                  <span class="card-title">判断题</span>
                  <div class="card-item-box">
                    <span v-for="item in topicType3" :key="item.topicId" class="card-item" :class="item.select?'card-item-active':''">{{item.cardNumber}}</span>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
      <FixedBottom>
        <a-button type="primary" :loading="loading" @click="submitAnswers">交卷并查看结果</a-button>
      </FixedBottom>
    </a-spin>
  </div>
</template>

<script>
import { getMyCourseExamDetailApi, getMyCourseExamPaperDetailApi, myExamIngSubmitAnswersApi } from "@/services/api.js";
import FixedBottom from "@/components/commonTpl/fixedBottom";
import { cloneDeep } from 'lodash'
import dayJs from "dayjs";
import cancelLoading from "@/mixin/cancelLoading";
export default {
  components: { FixedBottom },
  mixins: [cancelLoading],
  data() {
    return {
      spinning: true,
      // 考试详情
      examDetai: {},
      // 试卷列表
      paperList: [],
      // 试卷详情
      paperDetail: {},
      testId: undefined,
      paperId: undefined,
      courseId: undefined,
      // 1通过课程进入 2通过考试进入 
      formType: 1,
      // 开始考试时间-用于计算考试时长
      testDate: undefined,
      autoSubmitMsgTime: 2
    };
  },
  created() {
    this.formType = this.$route.query.formType || 1
    sessionStorage.setItem('ehs-myExamDetailFormType', this.formType)
    if (this.formType == 1) {  // 1通过课程进入
      this.paperId = this.$route.query.paperId
      this.courseId = this.$route.query.courseId
    } else {  // 2通过考试进入
      this.testId = this.$route.query.testId
      this.paperId = this.$route.query.paperId
    }
    this.testDate = dayJs(Date.now() + 480 * 60 * 1000)
    this.getDetai()
  },
  computed: {
    // 单选题
    topicType1() {
      return this.paperList.filter(item => item.topicType == 1)
    },
    // 多选题
    topicType2() {
      return this.paperList.filter(item => item.topicType == 2)
    },
    // 判断题
    topicType3() {
      return this.paperList.filter(item => item.topicType == 3)
    },
  },
  filters: {
    // 题型
    topicType(val) {
      let topicTypeObj = {
        1: '单选题',
        2: '多选题',
        3: '判断题',
      }
      return topicTypeObj[val]
    }
  },
  methods: {
    getDetai() {
      if (this.formType == 2) {  // 2通过考试进入
        Promise.all([
          this.getMyCourseExamPaperDetailApiFn(),
          this.getMyCourseExamDetailFn(),
        ])
          .finally(() => {
            setTimeout(() => {
              this.spinning = false
            }, 200);
          })
      } else {  // 1通过课程进入
        Promise.all([
          this.getMyCourseExamPaperDetailApiFn(),
        ])
          .finally(() => {
            setTimeout(() => {
              this.spinning = false
            }, 200);
          })
      }
    },
    //获取考试详情
    getMyCourseExamDetailFn() {
      let apiData = {
        testId: this.testId,
      }
      return getMyCourseExamDetailApi(apiData)
        .then(res => {
          let examDetai = res.data || {}
          examDetai.examinationTime = examDetai.examinationTime ? Date.now() + Number(examDetai.examinationTime) * 60 * 1000 : 0
          this.examDetai = cloneDeep(examDetai)
        })
        .catch(err => {

        })
    },
    //获取试卷详情
    getMyCourseExamPaperDetailApiFn() {
      return getMyCourseExamPaperDetailApi({ paperId: this.paperId })
        .then(res => {
          this.paperDetail = res.data || {}
          let paperList = res.data?.questionList || []
          paperList.forEach((item, index) => {
            item.cardNumber = index + 1
            item.select = undefined
          })
          this.paperList = cloneDeep(paperList)
        })
        .catch(err => {
        })
    },
    onFinish() {
      this.$antMessage.warn(
        `${this.autoSubmitMsgTime}s后将自动交卷`,
        this.autoSubmitMsgTime,
        () => {
          this.submitAnswers(false)
        }
      )
    },
    // 提交试卷
    submitAnswers(check = true) {
      let hasNoselect = false
      if (check) {
        hasNoselect = this.paperList.some(item => {
          if (Array.isArray(item.select)) {
            return !Boolean(item.select.length)
          } else {
            return !Boolean(item.select)
          }
        })
      }
      if (check && hasNoselect) {
        this.$antMessage.warn('您还有未做的题，不能交卷！')
        return
      }
      let paperList = this.paperList
      // 处理参数
      paperList.forEach(item => {
        item.score = item.topicScore
        item.type = item.topicType
        item.options = Array.isArray(item.select) ? item.select : (item.select ? [item.select] : [])
      })
      let apiData = {
        // 1通过课程进入 2通过考试进入 
        testId: this.formType == 2 ? this.testId : undefined,
        courseId: this.formType == 1 ? this.courseId : undefined,
        testDate: this.testDate,
        accessScore: this.paperDetail.accessScore,
        paperScoreDtoList: paperList
      }
      // console.log('参数', apiData);
      // return
      this.handleLoading()
      myExamIngSubmitAnswersApi(apiData)
        .then(res => {
          sessionStorage.setItem('ehs-myExamResult', JSON.stringify({ ...res.data, testId: this.testId, paperId: this.paperId, formType: this.formType }))
          this.paperDetail.isSubmit = true
          if (this.formType == 2) {
            this.$router.replace({
              path: '/ehsGerneralManage/educationmanagement/myExamResult',
            })
          } else {
            this.$router.push({
              path: '/ehsGerneralManage/educationmanagement/myExamResult',
            })
          }
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoading()
        })
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.paperDetail.isSubmit) {
      next()
      return
    }
    this.$antConfirm({
      title: "未提交考试，确认离开吗?",
      onOk: () => {
        next()
      },
    });
  }
}
</script>>

<style lang="less" scoped>
.my-exam-ing {
  display: flex;
  flex-direction: column;
  .searchtable-wrapper {
    flex: 1;
    display: flex;
    padding-bottom: 70px;
    overflow: hidden;
    .left-box {
      flex: 1;
      position: relative;
      margin-right: 16px;
      display: flex;
      flex-direction: column;
      .my-course-detail-main-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0px;
        .countdown {
          padding-right: 10px;
          display: flex;
          align-items: center;
          font-size: 14px;
          .tip {
            margin-right: 6px;
            color: #999;
          }
          ::v-deep .ant-statistic-content {
            font-size: 18px;
            line-height: 1.1;
          }
        }
      }
      .exam-box {
        flex: 1;
        .exam-item {
          position: relative;
          font-size: 14px;
          .exam-stem {
            margin: 20px 0 10px;
            color: #000;
            font-weight: 600;
          }
          .option-item {
            display: block;
          }
          &:nth-of-type(1) {
            .exam-stem {
              margin: 0px 0 10px;
              color: #000;
              font-weight: 600;
            }
          }
        }
      }
    }
    .right-box {
      flex: none;
      width: 400px;
      display: flex;
      flex-direction: column;
      .right-box-title {
        flex: none;
        height: 50px;
        line-height: 50px;
      }
      .right-box-main {
        flex: 1;
        padding: 10px 20px;
        .card-box {
          .card-title {
            display: block;
            font-size: 16px;
            margin-bottom: 10px;
          }
          .card-item-box {
            display: flex;
            flex-wrap: wrap;
            .card-item {
              width: 22px;
              height: 22px;
              padding: 6px;
              border-radius: 50%;
              border: 1px solid #0067cc;
              margin-bottom: 20px;
              margin-right: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              word-break: normal;
            }
            .card-item-active {
              background: #0067cc;
              color: #fff;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1366px) {
  .right-box {
    width: 285px !important;
    .card-item:nth-of-type(6n) {
      margin-right: 22px !important;
      margin-right: 0px !important;
    }
  }
}
@media screen and (min-width: 1367px) and (max-width: 1540px) {
  .right-box {
    width: 326px !important;
    .card-item:nth-of-type(7n) {
      margin-right: 0px !important;
    }
  }
}
@media screen and (min-width: 1540px) {
  .right-box {
    width: 400px !important;
    .card-item:nth-of-type(9n) {
      margin-right: 0px !important;
    }
  }
}
::v-deep .ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin-left: 0px;
}

@scrollbar-thumb: #ccc;
@scrollbar-track: transparent;
// 横向滚动条样式
.beauty-scroll {
  scrollbar-color: @scrollbar-thumb @scrollbar-track;
  scrollbar-width: thin;
  -ms-overflow-style: none;
  position: relative;

  &::-webkit-scrollbar {
    width: 3px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #ddd;
  }

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
    border-radius: 3px;
    background: @scrollbar-track;
  }
}
</style>