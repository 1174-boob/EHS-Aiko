<template>
  <div class="exam-paper">
    <div class="main-paper">
      <div  class="paper-left">
        <DashBtn>
          <div>
            <a-button type="dashed" @click="createPaper">
              <a-icon type="plus" />创建新试卷
            </a-button>
            <a-button type="dashed" @click="selectPaper">
              <a-icon type="plus" />从试卷库中选择试卷
            </a-button>
          </div>
        </DashBtn>
        <div class="paper-detail">
          <div class="arc_content_left" v-if="paperShow">
            <div class="title-paper">
              <div class="title">{{paperDetail.name}}</div>
              <div class="info">共 {{paperDetail.questionList.length}} 题，总计 {{paperDetail.totalScore}} 分</div>
            </div>
            <div class="arc_content_left_item_father clx-model-body clx-show-scroll clx-flex-1 beauty-scroll">
              <div class="arc_content_left_item" v-for="(item, index) in paperDetail.questionList" :key="index">
                <p>
                  {{ index + 1 }}.{{ item.topicTitle }}（{{
                  item.topicType == 1
                  ? "单选题"
                  : item.topicType == 2
                  ? "多选题"
                  : "判断题"
                  }}）
                </p>
                <div v-for="(itemt, indext) in item.optionsRels" :key="indext" class="arc_content_left_item_content">
                  <p :class="itemt.solution == 1 ? 'active' : ''">
                    {{ String.fromCharCode(65 + indext) }}&nbsp;&nbsp;&nbsp;{{
                    itemt.optionsContent
                    }}
                  </p>
                </div>
                <div class="count">
                  分值
                  <a-input :value="item.topicScore" disabled placeholder="请输入" @change="change($event, item)" />分
                </div>
                <!-- <p>答案解析：{{ item.topicSolution || "" }}</p>
                <div class="postins" @click="delQuestionItem(item)">删除</div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="paper-right">
        <div class="paper-info">
          <div class="title">试卷信息设置</div>
          <div class="info">共 {{paperDetail?paperDetail.questionList.length:'0'}} 题，总计 {{paperDetail?paperDetail.totalScore:'0'}} 分</div>
          <a-button type="primary" @click="editPaper" :disabled="!paperShow">编辑试卷</a-button>
        </div>
        <div class="paper-info">
          <div class="title">考试及格分数设置</div>
          <div class="info">成绩达到<a-input v-model:value="accessScore" @blur="scoreBlur" :style="{color:redColor?'#ff4d4f':'',borderColor:redColor?'#ff4d4f':''}"/>分，及格</div>
          <div class="tips">员工提交后，将根据设置的分数，显示考试是否通过</div>
        </div>
      </div>
    </div>
    <!-- 添加题目弹框-组件 -->
    <PaperModel :addAddressModel="addAddressModel" @closeAddAddressModel="closeAddAddressModel" @submitDict="submitDict" :sonDataList="sonDataList" />
    <div class="bottom_btnDiv">
      <a-button :style="{ marginLeft: '8px' }" @click="backStep"
        >上一步</a-button
      >
      <a-button type="primary" @click="nextStep">下一步</a-button>
    </div>
  </div>
</template>

<script>
import PaperModel from "./paperModel.vue";
import {
  LookQuestionlDataList,
} from "@/services/questionmodel.js";
export default {
  components: {
    PaperModel,
  },
  props: ["examData"],
  data() {
    return {
      accessScore:'', //及格分数
      paperShow: false,
      redColor: false,
      addAddressModel: false,
      sonDataList: [],
      paperDetail:undefined,
    }
  },
  watch: {
    examData: {
      handler(value) {
        if(value) {
          // console.log("examppppp===========================",value);
          this.accessScore = value.accessScore;
          if(value.paperId) {
            this.getPaperDetail(value.paperId);
          }
        }
      },
      immediate: true,
      deep: true
    },
  },
  methods: {
    scoreBlur() {
      const value = this.accessScore;
      if (!value) {
        this.$antMessage.error("及格分数不能为空")
        this.redColor = true;
        return false;
      } else if(value > this.paperDetail.totalScore){
        this.redColor = true;
        this.$antMessage.error("及格分数不能大于试卷总分数")
        return false
      } else if(/\D/g.test(value) || value<=0) {
        this.redColor = true;
        this.$antMessage.error("及格分数只能为大于0的整数")
        return false;
      } else if(/^0/.test(value)) {
        this.redColor = true;
        this.$antMessage.error("及格分数填入数值格式有误")
        return false;
      } else {
        this.redColor = false;
        return true
      }
    },
    //获取手动选题回显
    getPaperDetail(paperId) {
      LookQuestionlDataList({ paperId })
        .then((res) => {
          // console.log("vvvvvv============",res);
          this.paperDetail = res.data;
          this.sonDataList = [res.data];
          this.paperShow = true;
          // console.log("vvvvvv===77777=00000========",this.sonDataList);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //每个题目分值输入框事件
    change(e, record) {
      // console.log("mmmmmm==",e,record);
      let optionsRels = this.paperDetail.questionList;
      optionsRels.forEach((item, index) => {
        if (item.topicId == record.topicId) {
          item.topicScore = e.target.value;
        }
      });
    },
    createPaper() {
      // console.log("创建新试卷。。。");
      const data = {
        ...this.examData,
        paperId: this.sonDataList.length>=1?this.sonDataList[0].paperId:'',
        accessScore: this.accessScore,
      }
      this.$store.dispatch("examina/getExaminaObj", "ok");
      sessionStorage.setItem("savEexamData",JSON.stringify(data)); //离开页面前保存之前编辑的全部数据
      this.$router.push({
        path: "/ehsGerneralManage/educationmanagement/resource/examinationAOCOne",
        query: { paperId: undefined, type:'add' },
      });
    },
    // 编辑试卷
    editPaper() {
      const data = {
        ...this.examData,
        paperId: this.sonDataList.length>=1?this.sonDataList[0].paperId:'',
        accessScore: this.accessScore,
      }
      this.$store.dispatch("examina/getExaminaObj", "ok"); //为了让编辑试卷页面不会重定向到列表页
      sessionStorage.setItem("savEexamData",JSON.stringify(data)); //离开页面前保存之前编辑的全部数据
      const paperId = this.paperDetail.paperId
      this.$router.push({
        path: "/ehsGerneralManage/educationmanagement/resource/examinationAOCOne",
        query: { paperId, type:"change" },
      });
    },
    selectPaper() {
      console.log("从。。。。");
      this.addAddressModel = true;
    },
    backStep() {
      this.$emit("jumpPage",{page:1})
    },
    nextStep() {
      if(this.sonDataList.length<1) {
        this.$antMessage.error("请选择试卷")
        return
      } else {
        if(this.scoreBlur()) {
          const data = {
            paperId: this.sonDataList[0].paperId,
            accessScore: this.accessScore,
          }
          this.$emit("jumpPage",{data,page: 3,})
        }
      }
      
      // this.$emit("jumpPage",{page:3})
    },
    //关闭件传弹框的参数
    closeAddAddressModel() {
      this.addAddressModel = false;
    },
    //接受组件传的参数
    submitDict(list) {
      console.log("wwwww===",list);
      // this.clickQuestions = "1";
      // this.sonDataList = list;
      this.getPaperDetail(list[0].paperId);
      this.closeAddAddressModel();
    },
  }
};
</script>

<style lang='less' scoped>
.exam-paper {
  .bottom_btnDiv {
    text-align: right;
    padding: 0 20px;
    button {
      margin-right: 20px;
    }
  }
  .main-paper {
    display: flex;
    margin-bottom: 20px;
    min-height: calc(100vh - 340px);
    .paper-left {
      flex: 1;
      .paper-detail {
        width: 100%;
        .arc_content_left {
          width: 80%;
          margin-right: 20px;
          .title-paper {
            .title {
              font-size: 18px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
            }
            .info {
              font-size: 14px;
              margin: 15px 0;
              text-align: center;
            }
          }
          & > p {
            padding: 20px 10px;
          }
          .arc_content_left_item_father {
            margin-bottom: 62px;
            .arc_content_left_item {
              position: relative;
              .postins {
                &:hover {
                  cursor: pointer;
                }
                position: absolute;
                right: 5%;
                color: rgb(202, 22, 22);
                top: 20px;
              }
              &:hover {
                background: #f2f7fd;
              }
              font-size: 14px;
              padding: 15px 10px;
              & > p {
                margin: 20px 0;
                color: #000;
                font-weight: 600;
              }
              .count {
                display: flex;
                align-items: center;
                input {
                  width: 80px;
                  margin: 0 12px 0 20px;
                }
              }
              .arc_content_left_item_content {
                p {
                  margin: 15px;
                  color: #767676;
                }
                .active {
                  color: #0067cc;
                }
              }
            }
          }
        }
      }
    }
    .paper-right {
      width: 400px;
      .paper-info {
        width: 100%;
        border: 1px solid #ddd;
        padding: 20px;
        color: #000;
        box-sizing: border-box;
        margin-bottom: 20px;
        .title {
          font-size: 20px;
          font-weight: bold;
          text-align: center;
        }
        .info {
          font-size: 14px;
          margin: 15px 0;
          text-align: center;
          ::v-deep .ant-input {
            width: 100px;
            margin: 0 10px;
          }
        }
        .tips {
          font-size: 12px;
          color: #7F7F7F;
          text-align: center;
        }
        ::v-deep .ant-btn {
          width: 100%;
        }
      }
    }
  }
}
</style>