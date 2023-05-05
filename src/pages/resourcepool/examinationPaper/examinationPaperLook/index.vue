<template>
  <HasFixedBottomWrapper>
    <div class="look_father">
      <h1>{{ quesionObj.name }}</h1>
      <p>共{{ quesionObj.topicNum }}题，总计{{ quesionObj.totalScore }}分</p>
      <div class="arc_content_left_item_father clx-model-body clx-show-scroll clx-flex-1 beauty-scroll">
        <div class="arc_content_left_item" v-for="(item, index) in list" :key="index">
          <p>
            {{ index + 1 }}、{{ item.topicTitle }}（{{
            item.topicType == 1
            ? "单选题"
            : item.topicType == 2
            ? "多选题"
            : "判断题"
            }}，分值{{ item.topicScore }}）
          </p>
          <div v-for="(itemt, indext) in item.optionsRels" :key="indext" class="arc_content_left_item_content">
            <p :class="itemt.solution == 1 ? 'active' : ''">
              {{ String.fromCharCode(65 + indext) }}&nbsp;&nbsp;&nbsp;{{
              itemt.optionsContent
              }}
            </p>
          </div>
          <p>答案解析：{{ item.topicSolution || "" }}</p>
        </div>
      </div>
    </div>
    <div slot="fixedBottom">
      <FixedBottom>
        <a-button :style="{ marginLeft: '8px' }" @click="back">返回</a-button>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import { LookQuestionlDataList } from "@/services/questionmodel.js";
import FixedBottom from "@/components/commonTpl/fixedBottom";
export default {
  components: { FixedBottom },
  data() {
    return {
      list: [],
      quesionObj: {},
      pathFrom: '',
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.path != '/') {
      next(vm => {
        vm.setRouterCode("examinationPaper");
        vm.pathFrom = from.path;
      })
    } else {
      next(vm => {
        vm.setRouterCode("examinationPaper");
        vm.pathFrom = sessionStorage.getItem("pathFrom");
      })
    }
  },

  mounted() {
    this.getExaminationDetail(); //获取详情
    window.addEventListener("beforeunload", () => {
      if (this.pathFrom) { //当前路由没有id的时候才会将数据存入sessionStorage
        sessionStorage.setItem("pathFrom", this.pathFrom);
      }
    })
  },
  methods: {
    //获取详情
    getExaminationDetail() {
      let productId = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
        .productSets.productId;
      let paperId = this.$route.query.paperId;
      LookQuestionlDataList({ productId, paperId })
        .then((res) => {
          this.list = res.data.questionList;
          this.quesionObj = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    back() {
      this.setKeepalive(true)
      this.$router.replace(this.pathFrom)
    }
  },
};
</script>

<style lang='less' scoped >
.arc_content_left_item_father {
  margin-bottom: 62px;
  .arc_content_left_item {
    position: relative;
    background: #f9f9f9;
    margin-bottom: 10px;
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
        color: red;
      }
    }
  }
}
.look_father {
  & > p {
    text-align: center;
    font-size: 16px;
    margin: 15px 0 20px 0;
  }
  & > h1 {
    text-align: center;
    font-size: 20px;
    font-weight: 600;
  }
}
</style>