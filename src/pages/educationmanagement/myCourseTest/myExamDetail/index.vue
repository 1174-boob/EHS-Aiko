<template>
  <div class="my-exam-ing clx-flex-1 bg-fff">
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <div class="searchtable-wrapper">
        <template title="题目">
          <div class="left-box clx-show-scroll beauty-scroll">
            <PageTitle class="my-course-detail-main-title">
              {{ quesionObj.name }}
              <span class="my-course-detail-main-title-disc">(仅保留最高分答卷)</span>
            </PageTitle>
            <a-divider />
            <ul class="exam-box clx-flex-1 clx-show-scroll beauty-scroll">
              <li class="exam-item" v-for="(item, index) in examList" :key="item.topicId">
                <p class="exam-stem">{{ index + 1 }}、{{ item.topicTitle }}（{{item.topicType | topicType}}，{{ item.topicScore }}分）</p>

                <template v-if="item.topicType == 1 || item.topicType == 3" title="单选题 | 判断">
                  <div v-for="optionItem in item.optionsRels" :key="optionItem.optionsId" class="option-item1">
                    <!-- 正确答案-绿色 -->
                    <a-icon v-if="isRightArr.includes(optionItem.optionsId)" class="option-icon pass-icon" theme="filled" type="check-circle" />
                    <!-- 选错的-红色 -->
                    <a-icon v-else-if="isSelErrArr.includes(optionItem.optionsId)" class="option-icon err-icon" theme="filled" type="close-circle" />
                    <!-- 未选择的 -->
                    <span v-else class="only-circle"></span>
                    {{optionItem.optionsContent}}
                  </div>
                </template>

                <template v-if="item.topicType == 2" title="多选题">
                  <div v-for="optionItem in item.optionsRels" :key="optionItem.optionsId" class="option-item1">
                    <!-- 正确答案-未选择-红色 -->
                    <a-icon v-if="isRightNoSelArr.includes(optionItem.optionsId)" class="option-icon err-icon" theme="filled" type="check-square" />
                    <!-- 正确答案-绿色 -->
                    <a-icon v-else-if="isRightArr.includes(optionItem.optionsId)" class="option-icon pass-icon" theme="filled" type="check-square" />
                    <!-- 选错的-红色 -->
                    <a-icon v-else-if="isSelErrArr.includes(optionItem.optionsId)" class="option-icon err-icon" theme="filled" type="close-square" />
                    <!-- 未选择的 -->
                    <span v-else class="only-square"></span>
                    {{optionItem.optionsContent}}
                  </div>
                </template>

                <div class="explain">答案解析：{{item.topicSolution}}</div>
              </li>
            </ul>
          </div>
        </template>
      </div>
      <FixedBottom>
        <a-button @click="goBack">返回</a-button>
      </FixedBottom>
    </a-spin>
  </div>
</template>

<script>
import { getMyExamResultApi } from "@/services/api.js";
import FixedBottom from "@/components/commonTpl/fixedBottom";
import { cloneDeep, isEqual } from 'lodash'
export default {
  components: { FixedBottom },
  data() {
    return {
      spinning: false,
      examList: [],
      quesionObj: {
        name: '考试题目'
      },
      pathFrom: '',
      testRecordsId: undefined,
    };
  },
  created() {
    this.testRecordsId = this.$route.query.testRecordsId
    this.getDetails()
  },
  computed: {
    // 正确的 但未选择
    isRightNoSelArr() {
      let selAnsweArr = this.examList.map(item => item.selAnswe).filter(item => item)
      selAnsweArr = selAnsweArr.flat()
      let isRightNoSelArr = this.isRightArr.filter(item => {
        return !selAnsweArr.includes(item)
      })
      return isRightNoSelArr
    },
    // 正确的
    isRightArr() {
      let isRightArray = this.examList.map(item => item.rightAnswer).filter(item => item)
      isRightArray = isRightArray.flat()
      return isRightArray
    },
    // 选择的错误的
    isSelErrArr() {
      let isSelErrArray = this.examList.map(item => {
        if (!item.isRight) {
          return item.selAnswe
        }
      }).filter(item => item)
      isSelErrArray = isSelErrArray.flat()
      return isSelErrArray
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
    // 获取列表
    getDetails() {
      let apiData = {
        testRecordsId: this.testRecordsId
      };
      getMyExamResultApi(apiData)
        .then((res) => {
          this.quesionObj = res.data || {}
          // 试卷详情
          let topicVoList = res.data?.topicVoList || []
          let examList = topicVoList.map(item => {
            let selAnswe = item.answer || []
            let rightAnswer = (item.optionsRels || []).map(item1 => {
              // 是否是正确答案 1-是；2-否
              if (item1.solution == 1) {
                return item1.optionsId
              }
            }).filter(item2 => item2)
            let isRight = isEqual(selAnswe, rightAnswer)
            let obj = {
              topicId: item.topicId,
              topicType: item.topicType,
              topicTitle: item.topicTitle,
              topicScore: item.topicScore,
              optionsRels: item.optionsRels,
              isRight,
              selAnswe,
              rightAnswer,
              topicSolution: item.topicSolution,
            }
            return obj
          })
          console.log('试卷', examList);

          this.examList = cloneDeep(examList)
        })
        .finally(() => {
          setTimeout(() => {
            this.spinning = false
          }, 200);
        })
    },
    // 返回列表
    goBack() {
      let formType = sessionStorage.getItem('ehs-myExamDetailFormType') || 1
      this.$router.push({
        path: '/ehsGerneralManage/educationmanagement/myCourseTest',
        query: { activeKey: formType }
      })
    },
  },
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
        align-items: flex-end;
        margin-bottom: 0px;
        .my-course-detail-main-title-disc {
          font-size: 14px;
          margin-left: 6px;
          color: #999;
        }
      }
      .exam-item {
        position: relative;
        font-size: 14px;
        flex: 1;
        .exam-stem {
          margin: 20px 0 10px;
          color: #000;
          font-weight: 600;
        }
        .option-item1 {
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          .option-icon {
            font-size: 16px;
            margin-right: 8px;
          }
          .pass-icon {
            color: #03b615;
          }
          .err-icon {
            color: #d9001b;
          }
          .only-circle {
            display: inline-block;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            border: 1px solid #ccc;
            margin-right: 8px;
          }
          .only-square {
            display: inline-block;
            width: 15px;
            height: 15px;
            border: 1px solid #ccc;
            margin-right: 8px;
          }
        }
        .explain {
          margin-top: 10px;
          padding-right: 20px;
          line-height: 1.2;
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