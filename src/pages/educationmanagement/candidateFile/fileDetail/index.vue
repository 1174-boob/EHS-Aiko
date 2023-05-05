<template>
  <HasSpinAndBtnBox :spinning="spinning">
    <div class="file-detail clx-flex-1">
      <div class="top-box">
        <div class="top-left">
          <div class="avatar-box">
            <a-avatar class="avatar-main" :size="80" shape="circle" :src="detailsObj.avatar" />
          </div>
          <div class="file-info">
            <div class="file-name">{{type == '1'? detailsObj.name : detailsObj.userName}}</div>
            <div class="file-info-item">
              <template v-if="type == '1'">
                <span class="file-info-item-left">工号：{{detailsObj.userCode}}</span>
                <span class="file-info-item-left">所属组织：{{detailsObj.corporationName}}</span>
              </template>
              <template v-else>
                <span class="file-info-item-left">手机号：{{detailsObj.phone}}</span>
                <span class="file-info-item-right">证件号码：{{detailsObj.idNumber}}</span>
              </template>
            </div>
            <div class="file-info-item">
              <span class="file-info-item-left" v-if="type == '2'">所属组织：{{detailsObj.companyName}}</span>
              <span class="file-info-item-right" v-if="type == '1'">部门：{{deptCache[detailsObj.deptId]}}</span>
            </div>
          </div>
        </div>
        <ul class="top-right">
          <li class="top-right-item">
            <div class="step-name">待学习</div>
            <div class="step-detail">
              <span class="step-detail-number">{{detailsObj.toStudyTimes}}</span>个课程
            </div>
          </li>
          <li class="top-right-item">
            <div class="step-name">学习中</div>
            <div class="step-detail">
              <span class="step-detail-number">{{detailsObj.studyTimes}}</span>个课程
            </div>
          </li>
          <li class="top-right-item">
            <div class="step-name">已完成</div>
            <div class="step-detail">
              <span class="step-detail-number">{{detailsObj.studyFinishTimes}}</span>个课程
            </div>
          </li>
        </ul>
      </div>
      <!-- 培训情况 -->
      <Training ref="training" :userId="userId" :companyId="companyId" />
      <!-- 考试情况 -->
      <Exam ref="exam" :userId="userId" :companyId="companyId" />
    </div>

    <FixedBottom slot="fixedBottom">
      <a-button :style="{ marginLeft: '8px' }" @click="back">返回</a-button>
    </FixedBottom>
  </HasSpinAndBtnBox>
</template>

<script>
import { cloneDeep, debounce } from "lodash";
import { getCandidateFileDetailUserInfoApi, getCandidateFileDetailOutUserInfoApi, getCandidateFileDetailUserStatistics } from "@/services/api.js";
import Training from './tpl/training.vue'
import Exam from './tpl/exam.vue'
// 默认头像
const defaultAvatarObj = {
  base64: `data:image/svg+xml;base64,    PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgd2lkdGg9IjQxcHgiIGhlaWdodD0iNDFweCIgdmlld0JveD0iMCAwIDQxIDQxIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPg0KICAgIDx0aXRsZT5ob3botYTmlpnljaE8L3RpdGxlPg0KICAgIDxkZWZzPg0KICAgICAgICA8bGluZWFyR3JhZGllbnQgeDE9IjUwJSIgeTE9IjAlIiB4Mj0iNTAlIiB5Mj0iMTAwJSIgaWQ9ImxpbmVhckdyYWRpZW50LTEiPg0KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0RGRTFGNCIgb2Zmc2V0PSIwJSI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0M0QzlFMCIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+DQogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+DQogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iNTAlIiB5MT0iMCUiIHgyPSI1MCUiIHkyPSIxMDYuMzI4Mzg2JSIgaWQ9ImxpbmVhckdyYWRpZW50LTIiPg0KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0ZGRkZGRiIgb2Zmc2V0PSIwJSI+PC9zdG9wPg0KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0RERTJGRiIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+DQogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+DQogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iNTAlIiB5MT0iMCUiIHgyPSI1MCUiIHkyPSIxMDAlIiBpZD0ibGluZWFyR3JhZGllbnQtMyI+DQogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjRkZGRkZGIiBvZmZzZXQ9IjAlIj48L3N0b3A+DQogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjREFFM0ZGIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4NCiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4NCiAgICA8L2RlZnM+DQogICAgPGcgaWQ9Iue7n+S4gOWktOmDqOe7hOS7tiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+DQogICAgICAgIDxnIGlkPSLnu5/kuIDlpLTpg6jnu4Tku7YxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTU4NS4wMDAwMDAsIC03Ny4wMDAwMDApIj4NCiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtOeWkh+S7vS0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTcwLjAwMDAwMCwgNTMuMDAxMDAwKSI+DQogICAgICAgICAgICAgICAgPGcgaWQ9Imhvdui1hOaWmeWNoSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUuNTAwMDAwLCAyNC4xNzQ2NjcpIj4NCiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC0xKSIgZmlsbC1ydWxlPSJub256ZXJvIiBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiPjwvY2lyY2xlPg0KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTkuODUzNDc4MywyOC4zMzMzMzM0IEMyNi4xNDYxNzQ2LDI4LjMzMzMzMzQgMzEuNjk4Mzk0OCwzMC4yMDY3MjUgMzUsMzMuMDYxMTUzMyBDMzEuMzMyMjc1MywzNy4zMTA2MDU2IDI1LjkwNjk0NzYsNDAgMTkuODUzNDc4Myw0MCBDMTMuODAwMDA4OSw0MCA4LjM3NDY4MTI5LDM3LjMxMDYwNTYgNC43MDcxNDE3NCwzMy4wNjE0NjM0IEM4LjAwOTA0NDU5LDMwLjIwNjU2MiAxMy41NjEwNTU2LDI4LjMzMzMzMzQgMTkuODUzNDc4MywyOC4zMzMzMzM0IFoiIGlkPSJwYXRoLTIiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtMikiPjwvcGF0aD4NCiAgICAgICAgICAgICAgICAgICAgPHJlY3QgaWQ9IuefqeW9oiIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIiB4PSI1IiB5PSIxNi42NjY2NjY3IiB3aWR0aD0iMy4zMzMzMzMzMyIgaGVpZ2h0PSI1IiByeD0iMS42NjY2NjY2NyI+PC9yZWN0Pg0KICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2i5aSH5Lu9LTUiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgeD0iMzEuNjY2NjY2NiIgeT0iMTYuNjY2NjY2NyIgd2lkdGg9IjMuMzMzMzMzMzMiIGhlaWdodD0iNSIgcng9IjEuNjY2NjY2NjciPjwvcmVjdD4NCiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9IuakreWchuW9oiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNi42NjY2NjcsIDguMzMzMzMzKSI+DQogICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0icGF0aC00LWxpbmsiIGZpbGw9IiNGRkZGRkYiPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMy4zMzMzMzMzLDE4LjMzMzMzMzMgQzIwLjY5NzEzLDE4LjMzMzMzMzMgMjYuNjY2NjY2NywxNi4wNjI2MTAyIDI2LjY2NjY2NjcsMTEgQzI2LjY2NjY2NjcsNS45MzczODk4IDIxLjk3NjE3ODIsMCAxMy4zMzMzMzMzLDAgQzQuNjkwNDg4NSwwIDAsNS45MzczODk4IDAsMTEgQzAsMTYuMDYyNjEwMiA1Ljk2OTUzNjcsMTguMzMzMzMzMyAxMy4zMzMzMzMzLDE4LjMzMzMzMzMgWiIgaWQ9InBhdGgtNCI+PC9wYXRoPg0KICAgICAgICAgICAgICAgICAgICAgICAgPC9nPg0KICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9InBhdGgtNC1saW5rIiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTMpIiBmaWxsLXJ1bGU9Im5vbnplcm8iPg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMy4zMzMzMzMzLDE4LjMzMzMzMzMgQzIwLjY5NzEzLDE4LjMzMzMzMzMgMjYuNjY2NjY2NywxNi4wNjI2MTAyIDI2LjY2NjY2NjcsMTEgQzI2LjY2NjY2NjcsNS45MzczODk4IDIxLjk3NjE3ODIsMCAxMy4zMzMzMzMzLDAgQzQuNjkwNDg4NSwwIDAsNS45MzczODk4IDAsMTEgQzAsMTYuMDYyNjEwMiA1Ljk2OTUzNjcsMTguMzMzMzMzMyAxMy4zMzMzMzMzLDE4LjMzMzMzMzMgWiIgaWQ9InBhdGgtNCI+PC9wYXRoPg0KICAgICAgICAgICAgICAgICAgICAgICAgPC9nPg0KICAgICAgICAgICAgICAgICAgICA8L2c+DQogICAgICAgICAgICAgICAgPC9nPg0KICAgICAgICAgICAgPC9nPg0KICAgICAgICA8L2c+DQogICAgPC9nPg0KPC9zdmc+`
}
export default {
  components: { Training, Exam },
  data() {
    return {
      spinning: true,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      detailsObj: {
        avatar: defaultAvatarObj.base64,
        name: undefined,
        userCode: undefined,
        phone: undefined,
        corporationId: undefined,
        bumen: undefined,
        toStudyTimes: undefined,
        studyTimes: undefined,
        studyFinishTimes: undefined,
      },
      // '1'-本部，'2'-厂商
      type: '2',
      tableList: [],
      // 目标用户id
      userId: undefined,
      // 目标公司id
      companyId: undefined,
    };
  },
  created() {
    this.userId = this.$route.query.userId
    this.companyId = this.$route.query.companyId
    this.type = this.$route.query.type
  },
  mounted() {
    this.getDetails();
  },
  methods: {
    // 获取列表
    getDetails() {
      let apiData = {
        userId: this.userId,
        companyId: this.companyId
      };
      let getCandidateFileDetailUserInfo = this.type == 1 ? getCandidateFileDetailUserInfoApi : getCandidateFileDetailOutUserInfoApi
      Promise.all([
        getCandidateFileDetailUserInfo(apiData),
        getCandidateFileDetailUserStatistics(apiData),
        this.$refs.training.getTableList(apiData),
        this.$refs.exam.getTableList(apiData),
      ])
        .then((resArr) => {
          // 用户档案信息
          let resUser = resArr[0].data || {}
          // 统计学习情况
          let resStatistics = resArr[1].data || {}
          let detailsObj = { ...this.detailsObj, ...resUser, ...resStatistics }
          detailsObj.avatar = this.type == 1 ? detailsObj.avatar : detailsObj.photo
          detailsObj.avatar = detailsObj.avatar ? detailsObj.avatar : defaultAvatarObj.base64
          this.detailsObj = cloneDeep(detailsObj)
        })
        .finally(() => {
          this.spinning = false
        })
    },
    back() {
      this.setKeepalive(true)
      this.$router.go(-1)
    }
  },
};
</script>

<style scoped lang='less'>
.file-detail {
  padding-top: 20px;
  .top-box {
    display: flex;
    justify-content: space-between;
    height: 100px;
    margin-bottom: 30px;
    .top-left {
      margin-right: 20px;
      display: flex;
      .avatar-box {
        margin-right: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .file-info {
        font-size: 14px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .file-name {
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }
        .file-info-item {
          .file-info-item-left {
            margin-right: 20px;
          }
        }
      }
    }
    .top-right {
      display: flex;
      .top-right-item {
        width: 180px;
        border: 1px solid #e8eaec;
        border-right: none;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px 15px;
        &:nth-last-child(1) {
          border-right: 1px solid #e8eaec;
        }
        .step-name {
          font-size: 16px;
          font-weight: bold;
        }
        .step-detail {
          text-align: center;
          .step-detail-number {
            font-size: 18px;
            font-weight: bold;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 1449px) {
  .top-right-item {
    width: 160px !important;
  }
}
</style>
