<template>
  <HasSpinAndBtnBox :spinning="spinning">
    <div class="my-course-detail-box clx-flex-1">
      <div class="top-box">
        <div class="top-left">
          <div class="avatar-box">
            <img class="avatar-main" :src="courseDetails.coverUrl" />
          </div>
          <div class="file-info">
            <div class="file-name">{{courseDetails.name}}</div>
            <div class="file-info-type">
              <span class="file-info-type-main">{{courseDetails.subjectName}}</span>
              <a-tag color="blue">{{statusList[searchStatus] || '--'}}</a-tag>
            </div>
            <div class="file-info-description">
              <span>{{courseDetails.description}}</span>
            </div>
          </div>
        </div>
        <div class="top-right"></div>
      </div>
      <div class="my-course-detail-main">
        <PageTitle class="my-course-detail-main-title">课程目录</PageTitle>
        <a-divider />
        <ul class="course-box">
          <li class="model-item" v-for="(item,index) in moduleList" :key="item.moduleId">
            <span class="model-item-title">第{{index + 1}}章:{{item.title}}</span>
            <span class="model-item-description">{{item.description}}</span>
            <CommonTable>
              <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="item.coursewareList">
                <vxe-column field="name" :min-width="120" title="课件名称"></vxe-column>
                <vxe-column field="size" :min-width="120" title="课件大小" :formatter="formatterSize"></vxe-column>
                <vxe-column field="studyDuration" :min-width="120" title="学习时长(分)" formatter="studyDuration"></vxe-column>
                <vxe-column field="action" fixed="right" title="操作" width="160">
                  <template #default="{ row }">
                    <div class="vxe-table-btn">
                      <a-button
                        class="color-0067cc"
                        type="link"
                        :loading="row.loading"
                        @click="goMyCourseStudy(row)"
                      >{{studyHasRecordIds.includes('' + row.moduleId + row.coursewareId) ? '继续学习':'开始学习'}}</a-button>
                    </div>
                  </template>
                </vxe-column>
                <template #empty>
                  <div style="padding:16px 0;">
                    <a-empty />
                  </div>
                </template>
              </vxe-table>
            </CommonTable>
          </li>
        </ul>
      </div>
    </div>
    <FixedBottom slot="fixedBottom">
      <a-button @click="gobackList" :style="{ marginLeft: '8px' }">返回</a-button>
      <template v-if="Array.isArray(courseDetails.paper) && courseDetails.paper.length">
        <a-button type="primary" v-if="searchStatus == 1" disabled @click="goMyExamIng">开始考试</a-button>
        <a-button type="primary" v-else-if="searchStatus == 2" @click="goMyExamIng">开始考试</a-button>
        <a-button type="primary" v-else-if="searchStatus == 3" @click="goMyExamDetail">考试详情</a-button>
        <a-button type="primary" v-else-if="searchStatus == 4" @click="goMyExamIng">重新考试</a-button>
      </template>
    </FixedBottom>
  </HasSpinAndBtnBox>
</template>

<script>
import { cloneDeep } from "lodash";
import { getCandidateFileDetailApi, getCandidateFileDetaiSteplApi, getCandidateFileStudyDetailApi, startCandidateFileStudyApi, setMyCourseStudyCountApi } from "@/services/api.js";
import cancelLoading from '@/mixin/cancelLoading.js'
export default {
  mixins: [cancelLoading],
  data() {
    return {
      spinning: true,
      courseDetails: {
        coverUrl: '',
        name: '',
        subjectName: '',
        description: '',
      },
      statusList: {
        1: '待学习',
        2: '已完成',
        3: '合格',
        4: '不合格',
      },
      searchStatus: 1,
      // 全部课程
      moduleList: [],
      // 已有学习记录的课程
      studyHasRecordList: [],
      // 课程id
      courseId: undefined,
      // 考试结果详情id
      testRecordsId: undefined
    };
  },
  created() {
    this.courseId = this.$route.query.courseId
    this.initPage();
    setTimeout(() => {
      this.spinning = false
    }, 1000);
  },
  computed: {
    // 已经学习完成的
    studyFinishList() {
      return this.studyHasRecordList.filter(item => item.status == 2).map(item => item.coursewareId)
    },
    // 正在学习的信息
    studyIngDataList() {
      return this.studyHasRecordList.filter(item => item.status == 1).map(item => item.coursewareId)
    },
    // 已有学习记录的课程id集合
    studyHasRecordIds() {
      return this.studyHasRecordList.map(item => ('' + item.moduleId + item.coursewareId))
    },
  },
  methods: {
    // 页面初始化-获取接口
    initPage() {
      Promise.all([
        this.getDetails(),
        this.getCandidateFileDetaiSteplApiFn()
      ])
        .finally(() => {
          setTimeout(() => {
            this.spinning = false;
          }, 300);
        })
    },
    // 当前状态
    getCandidateFileDetaiSteplApiFn() {
      let apiData = {
        courseId: this.courseId
      };
      return getCandidateFileDetaiSteplApi(apiData)
        .then(res => {
          this.searchStatus = res.data?.examStatus ? res.data?.examStatus : '1'
          this.testRecordsId = res.data?.testRecordsId
        })
        .catch(err => { })
    },
    // 获取详情api
    getDetails() {
      let apiData = {
        courseId: this.courseId
      };
      return getCandidateFileDetailApi(apiData)
        .then(res => {
          // 详情信息
          let courseDetails = res.data || {}
          this.courseDetails = cloneDeep(courseDetails)
          // 列表
          let moduleList = courseDetails?.moduleList || []
          moduleList.forEach(item => {
            (item.coursewareList || []).forEach(coursewareItem => {
              coursewareItem.loading = false
            })
          })
          this.moduleList = cloneDeep(moduleList)

          // 学习进度 studyStatus 0 未学习  1学习中  2学习完成
          if (courseDetails.studyStatus == 1 || courseDetails.studyStatus == 2) {
            return Promise.all([Promise.resolve(courseDetails), this.getCandidateFileStudyDetailFn()])
          } else { // 0 未学习
            return Promise.all([Promise.resolve(courseDetails), this.startCandidateFileStudyFn()])
          }
        })
        .catch(err => {
          return Promise.reject()
        })
    },
    // 获取当前课程学习进度api
    getCandidateFileStudyDetailFn() {
      let apiData = { coursePushId: this.$route.query.paperObj ? JSON.parse(this.$route.query.paperObj).coursePushId : '' }
      return getCandidateFileStudyDetailApi(apiData)
        .then(res => {
          // 已有学习记录的课程
          this.studyHasRecordList = res.data || []
          // 为课程列表匹配学习时常
          this.studyHasRecordList.forEach(item => {
            // 处理唯一标识
            let moduleIdCoursewareIdStr = '' + item.moduleId + item.coursewareId
            // 列表循环处理--唯一标识匹配
            this.moduleList.forEach(item1 => {
              (item1.coursewareList || []).some(coursewareItem => {
                let strIds = '' + coursewareItem.moduleId + coursewareItem.coursewareId
                // 唯一标识匹配
                if (moduleIdCoursewareIdStr == strIds) {
                  coursewareItem.studyDuration = item.studyDuration
                }
                return moduleIdCoursewareIdStr == strIds
              })
            })
          })
        })
        .catch(err => { })
    },
    // 开始学习api
    startCandidateFileStudyFn() {
      // return Promise.resolve()
      let apiData = { courseId: this.courseId, coursePushId: this.$route.query.paperObj ? JSON.parse(this.$route.query.paperObj).coursePushId : '' }
      return startCandidateFileStudyApi(apiData)
    },
    // 格式化课件大小
    formatterSize({ cellValue }) {
      let sizeM = (cellValue / 1024 / 1024).toFixed(2)
      sizeM = sizeM == 0 ? `0.01M` : sizeM + 'M'
      return sizeM
    },
    // 开始/继续 学习
    goMyCourseStudy(row) {
      console.log(row);
      const query = { courseId: row.courseId, moduleId: row.moduleId, coursewareId: row.coursewareId, paperObj: this.$route.query.paperObj }
      if (this.studyHasRecordIds.includes('' + row.moduleId + row.coursewareId)) {
        this.$router.push({
          path: '/ehsGerneralManage/educationmanagement/myCourseStudy',
          query
        })
      } else {
        row.loading = true
        let apiData = {
          courseId: row.courseId,
          moduleId: row.moduleId,
          coursewareId: row.coursewareId,
          studyCount: 0,
          studyDuration: 0,
          coursePushId: this.$route.query.paperObj ? JSON.parse(this.$route.query.paperObj).coursePushId : ''
        }
        // 更新学习进度为0
        return setMyCourseStudyCountApi(apiData)
          .then(res => {
            this.$router.push({
              path: '/ehsGerneralManage/educationmanagement/myCourseStudy',
              query
            })
          })
          .catch(err => {
            row.loading = false
          })
      }
    },
    // 跳转考试
    goMyExamIng() {
      let paperId = this.courseDetails.paper[0].paperId
      // formType 1通过课程进入 2通过考试进入 
      let query = { paperId, courseId: this.courseId, formType: 1, paperObj: this.$route.query.paperObj }
      this.$router.push({
        path: '/ehsGerneralManage/educationmanagement/myExamIng',
        query
      })
    },
    // 跳转考试详情
    goMyExamDetail() {
      sessionStorage.setItem('ehs-myExamDetailFormType', 1)
      let query = { testRecordsId: this.testRecordsId, }
      this.$router.push({
        path: '/ehsGerneralManage/educationmanagement/myExamResult',
        query,
      })
    },
    // 返回列表
    gobackList() {
      this.setKeepalive(true)
      this.$router.push({
        path: '/ehsGerneralManage/educationmanagement/myCourseTest'
      })
    },
  },
};
</script>

<style scoped lang='less'>
.my-course-detail-box {
  position: relative;
  .top-box {
    display: flex;
    justify-content: space-between;
    min-height: 100px;
    margin-bottom: 20px;
    .top-left {
      margin-right: 100px;
      display: flex;
      .avatar-box {
        margin-right: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        .avatar-main {
          width: 130px;
          max-height: 100px;
        }
      }
      .file-info {
        padding: 8px 0;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .file-name {
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }
        .file-info-type {
          margin: 15px 0;
          .file-info-type-main {
            margin-right: 20px;
            font-weight: bold;
          }
          .file-info-type-status {
            padding: 2px 4px;
            border-radius: 3px;
            background-color: rgba(0, 103, 204, 0.9);
            color: #fff;
          }
        }
        .file-info-description {
          line-height: 1.2;
        }
      }
    }
    .top-right {
      display: flex;
      .top-right-item {
        width: 180px;
        border: 1px solid #e8eaec;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px 15px;
      }
    }
  }
  .my-course-detail-main {
    .my-course-detail-main-title {
    }
    .course-box {
      .model-item {
        .model-item-title {
          display: block;
          margin-bottom: 15px;
          font-weight: bold;
        }
        .model-item-description {
          display: block;
          line-height: 1.2;
          color: #999;
          margin-bottom: 15px;
        }
      }
    }
  }
}

@media screen and (max-width: 1449px) {
  .top-right-item {
    width: 165px !important;
  }
}
</style>
