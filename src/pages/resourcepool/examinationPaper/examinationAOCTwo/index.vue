<template>
  <HasFixedBottomWrapper>
    <div class="arc">
      <!-- 步骤条 -->
      <div class="steps">
        <span class="active">1/设置设卷信息</span>
        <span class="active">2/设置试卷题目</span>
      </div>

      <!-- 内容 -->
      <div class="arc_content">
        <div class="arc_content_left">
          <h1>
            {{ name }}
            <span>（共{{ alltotal }}题，总计{{ allscore }}分）</span>
          </h1>
          <p>
            选择试题：
            <a-button @click="chooseT('1')">手动选题</a-button>
            <a-button type="primary" :style="{ marginLeft: '8px' }" @click="chooseT('2')">随机抽题</a-button>
          </p>
          <div class="arc_content_left_item_father clx-model-body clx-show-scroll clx-flex-1 beauty-scroll" v-if="clickQuestions == 1">
            <div class="arc_content_left_item" v-for="(item, index) in list" :key="index">
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
                <a-input :value="item.topicScore" placeholder="请输入" @change="change($event, item)" />分
              </div>
              <p>答案解析：{{ item.topicSolution || "" }}</p>
              <div class="postins" @click="delQuestionItem(item)">删除</div>
            </div>
          </div>
          <div v-else-if="clickQuestions == 2">
            <h2>随机抽题</h2>
            <p>共{{ randomObj.total }}道题，总计{{ randomObj.price }}分</p>
          </div>
          <div v-else></div>
        </div>
        <div class="arc_content_right">
          <div class="content_right_div">
            <h1>
              试卷信息设置
              <br />
            </h1>
            <p>共{{ alltotal }}题，总计{{ allscore }}分</p>
            <div class="content_right_div_item">
              <span>单选题</span>
              <span>
                <span>共{{ radioAll.total }}题，</span>
                <span>共{{ radioAll.price }}分</span>
              </span>
            </div>
            <div class="content_right_div_item">
              <span>多选题</span>
              <span>
                <span>共{{ checkAll.total }}题，</span>
                <span>共{{ checkAll.price }}分</span>
              </span>
            </div>
            <div class="content_right_div_item">
              <span>判断题</span>
              <span>
                <span>共{{ isAll.total }}题，</span>
                <span>共{{ isAll.price }}分</span>
              </span>
            </div>
            <DashBtn>
              <div :style="{ width: '100%', marginTop: '30px' }">
                <a-button :disabled="list.length ? false : true" :style="{ width: '100%', marginTop: '30px' }" type="dashed" @click="openAllSetVisible">批量设置分值</a-button>
              </div>
            </DashBtn>
          </div>
          <div class="content_right_div">
            <h1>
              考试及格分数设置
              <br />
            </h1>
            <div class="info">
              成绩达到
              <a-input v-model="accessScore" @blur="scoreBlur" :style="{color:redColor?'#ff4d4f':'',borderColor:redColor?'#ff4d4f':''}" />分，及格
            </div>
            <div class="tips">员工提交后，将根据设置的分数，显示考试是否通过</div>
          </div>
        </div>
      </div>

      <!-- 添加题目弹框-组件 -->
      <AddTitleModal :subjectId="subjectId" :corporationId="corporationId" :addAddressModel="addAddressModel" @closeAddAddressModel="closeAddAddressModel" @submitDict="submitDict" :sonDataList="sonDataList" />

      <!-- 批量设置分支弹框 -->
      <CommonModal title="选择题目" :visible="allSetVisible" :cancelFn="closeAllSetVisible">
        <div class="virtual_tab">
          <div class="virtual_tab_top">
            <div class="virtual_tab_top_item">题目</div>
            <div class="virtual_tab_top_item_particular">分值设置</div>
            <div class="virtual_tab_top_item">题目数量</div>
            <div class="virtual_tab_top_item">总分值</div>
          </div>
          <div class="virtual_tab_bottom">
            <div class="virtual_tab_bottom_item">
              <div>单选题</div>
              <div class="virtual_tab_top_item_particular">
                每题得
                <a-input v-model="virtual.radio" :disabled="radioAll.total == 0" />分
              </div>
              <div>{{ radioAll.total }}</div>
              <div>{{ virtualThreeAll.radioAll }}</div>
            </div>
            <div class="virtual_tab_bottom_item">
              <div>多选题</div>
              <div class="virtual_tab_top_item_particular">
                每题得
                <a-input v-model="virtual.check" :disabled="checkAll.total == 0" />分
              </div>
              <div>{{ checkAll.total }}</div>
              <div>{{ virtualThreeAll.checkAll }}</div>
            </div>
            <div class="virtual_tab_bottom_item">
              <div>判断题</div>
              <div class="virtual_tab_top_item_particular">
                每题得
                <a-input v-model="virtual.is" :disabled="isAll.total == 0" />分
              </div>
              <div>{{ isAll.total }}</div>
              <div>{{ virtualThreeAll.isAll }}</div>
            </div>
          </div>
        </div>
        <template slot="btn">
          <a-button @click="closeAllSetVisible">取消</a-button>
          <a-button class="m-l-15" type="primary" @click="submitAllSetVisible">确定</a-button>
        </template>
      </CommonModal>

      <!-- 随机抽题弹框 -->
      <CommonModal title="随机抽题" :visible="randomVisible" :cancelFn="closeRandomVisible">
        <template slot="form">
          <!-- <SearchTerm>
            <a-form-model layout="inline" :model="formInline" :colon="false">
              <a-form-model-item label="选择科目">
                <a-select v-model="formInline.subjectId" placeholder="请选择" allowClear>
                  <a-select-option v-for="item in sujectList" :value="item.subjectId" :key="item.subjectId">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="选择题型">
                <a-select
                  v-model="formInline.topicType"
                  placeholder="请选择"
                  allowClear
                >
                  <a-select-option value="1">单选题</a-select-option>
                  <a-select-option value="2">多选题</a-select-option>
                  <a-select-option value="3">判断题</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item class="float-right">
                <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
                <a-button @click="iRest">重置</a-button>
              </a-form-model-item>
            </a-form-model>
          </SearchTerm> -->
          <a-form-model ref="dictForm" :model="dictForm" :rules="dictFormRules" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" labelAlign="left">
            <!-- <a-form-model-item label="题目分类">
            <div class="display_div">
              <a-select
                v-model="dictForm.subjectId"
                placeholder="请选择"
                allowClear
              >
                <a-select-option
                  v-for="item in sujectList"
                  :value="item.subjectId"
                  :key="item.subjectId"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
              <div style="padding-left: 5px; width: 45px"></div>
            </div>
            </a-form-model-item>-->
            <a-form-model-item label="单选题" props="singleNum">
              <div class="display_div">
                <a-input v-model.trim="dictForm.singleNum" placeholder="请输入" />
                <div style="padding-left: 5px; width: 45px">/{{ bigcount.singleNum }}</div>
              </div>
            </a-form-model-item>
            <a-form-model-item label="多选题">
              <div class="display_div">
                <a-input v-model.trim="dictForm.multipleNum" placeholder="请输入" />
                <div style="padding-left: 5px; width: 45px">/{{ bigcount.multipleNum }}</div>
              </div>
            </a-form-model-item>
            <a-form-model-item label="判断题">
              <div class="display_div">
                <a-input v-model.trim="dictForm.judgeNum" placeholder="请输入" />
                <div style="padding-left: 5px; width: 45px">/{{ bigcount.judgeNum }}</div>
              </div>
            </a-form-model-item>
          </a-form-model>
        </template>
        <template slot="btn">
          <a-button @click="closeRandomVisible">取消</a-button>
          <a-button class="m-l-15" type="primary" :loading="loading" @click="submitRandomVisible">确定</a-button>
        </template>
      </CommonModal>
    </div>
    <div slot="fixedBottom">
      <FixedBottom>
        <a-button @click="cancel">上一步</a-button>
        <a-button type="primary" :style="{ marginLeft: '20px' }" @click="submit">完成</a-button>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import AddTitleModal from "@/components/addTitleModel";
import cancelLoading from "@/mixin/cancelLoading";
import FixedBottom from "@/components/commonTpl/fixedBottom";
import { debounce } from "lodash";
import {
  GetKDataList,
  AddQuestionDataList,
  ChangeQuestionDataList,
  SubjectsDataList,
  GetThreeBigCount,
} from "@/services/questionmodel.js";
import { formValidator } from "@/utils/clx-form-validator.js";

export default {
  mixins: [cancelLoading],
  components: { AddTitleModal, FixedBottom },
  data() {
    return {
      name: JSON.parse(sessionStorage.getItem("examinaObj_xt")).firstStep.name,
      corporationId: JSON.parse(sessionStorage.getItem("examinaObj_corporationId")),
      subjectId: JSON.parse(sessionStorage.getItem("examinaObj_subjectId")),
      labelCol: { span: 4 }, // 设置左边label宽度
      wrapperCol: { span: 20 }, // 设置右边表单宽度
      addAddressModel: false,
      randomVisible: false,
      allSetVisible: false,
      redColor: false,
      accessScore: '', //及格分数
      formInline: {
        // topicType: undefined,
        subjectId: undefined,
      },
      virtual: {
        radio: undefined,
        check: undefined,
        is: undefined,
      },
      dictRules: {},
      dictForm: {
        singleNum: undefined, //单选
        multipleNum: undefined, //多选
        judgeNum: undefined, //判断
        // subjectId: undefined, //科目
      },
      dictFormRules: {
        singleNum: [
          { required: true, message: "请先输入单选题", trigger: "change" },
        ],
        multipleNum: [
          { required: true, message: "请先输入多选题", trigger: "change" },
        ],
        judgeNum: [
          { required: true, message: "请先输入判断题", trigger: "change" },
        ],
      },
      clickQuestions: "", //1手动抽题 2随机抽题
      list: [],
      sonDataList: [],
      randomObj: { total: 0, price: 0 },
      sujectList: [],
      bigcount: {},
    };
  },
  created() {
    this.setRouterCode("examinationPaper");
    //刷新则返回列表
    let isJump = this.$store.state.examina.examinaObj;
    if (!isJump) {
      this.$router.replace(
        "/ehsGerneralManage/educationmanagement/examinationPaper"
      );
      sessionStorage.removeItem("examinaObj_xt");
      sessionStorage.removeItem("examinaObj_corporationId");
      sessionStorage.removeItem("examinaObj_subjectId");
      return;
    }
    this.subjectsDataList(); //科目列表
    this.getThreeBigCount(); //获取最大限制数量-单多判

    let sessObj = JSON.parse(sessionStorage.getItem("examinaObj_xt"));

    if (sessObj.type == "change") {
      if (sessObj.secondStep.type || sessObj.secondStep.type == 0) {
        this.accessScore = sessObj.firstStep.accessScore;
        if (sessObj.secondStep.type == 0) {
          //手动
          this.clickQuestions = "1";
          this.list = sessObj.secondStep.questionList;
          this.getAllId(sessObj.secondStep.questionList);
        } else {
          //随机
          this.clickQuestions = "2";
          let dictForm = sessObj.secondStep.dictForm;
          this.dictForm = dictForm;
        }
      }
    }
  },
  methods: {
    //获取id
    getAllId(list) {
      let listT = [];
      list.filter((item) => {
        listT.push(item.topicId);
      });
      this.sonDataList = listT;
    },
    //获取最大限制数量-单多判
    getThreeBigCount() {
      // console.log(this.formInline);
      // let sessObj = JSON.parse(sessionStorage.getItem("examinaObj_xt"));
      const subjectId = this.formInline.subjectId;
      GetThreeBigCount({ subjectId }).then(
        (res) => {
          this.bigcount = res.data;
        }
      );
    },
    // 科目列表
    subjectsDataList() {
      SubjectsDataList()
        .then((res) => {
          this.sujectList = res.data || [];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 查询
    iSearch() {
      this.getThreeBigCount();
    },
    // 重置
    iRest: debounce(
      function () {
        this.formInline = {
          subjectId: undefined,
        };
        this.getThreeBigCount();
      },
      250,
      { leading: true, trailing: false }
    ),
    //删除
    delQuestionItem(record) {
      this.sonDataList.forEach((item, index) => {
        if (item == record.topicId) {
          this.sonDataList.splice(index, 1);
        }
      });
      this.list.forEach((item, index) => {
        if (item.topicId == record.topicId) {
          this.list.splice(index, 1);
        }
      });
    },

    //每个题目分值输入框事件
    change(e, record) {
      let optionsRels = this.list;
      optionsRels.forEach((item, index) => {
        if (item.topicId == record.topicId) {
          item.topicScore = e.target.value;
        }
      });
    },

    //手动随机公共事件
    chooseT(clickQuestions) {
      // this.clickQuestions = clickQuestions;
      if (clickQuestions == "1") {
        //手动
        this.handChoose();
      } else {
        this.openRandomVisible();
      }
    },

    //获取手动选题回显
    getKDataList(list) {
      GetKDataList({
        topicIds: list,
      }).then((res) => {
        this.list = res.data;
        this.dictForm = {
          singleNum: undefined, //单选
          multipleNum: undefined, //多选
          judgeNum: undefined, //判断
          subjectId: undefined, //科目
        };
      })
      .catch((err) => {
        console.log(err);
      });
      console.log(this.list);
    },

    //返回
    cancel() {
      this.$router.push({
        path: "/ehsGerneralManage/educationmanagement/examinationAOCOne",
      });
    },

    //提交
    submit() {
      if (
        ((this.dictForm.singleNum ||
          this.dictForm.multipleNum ||
          this.dictForm.judgeNum) && this.randomObj.total > 0) ||
        this.list.length
      ) {
        if (this.scoreBlur()) {
          let obj = this.dealWithData();
          let sessObj = JSON.parse(sessionStorage.getItem("examinaObj_xt"));
          // let clickQuestionsObj = this.clickQuestions == 1 ? {} : this.dictForm;
          let clickQuestionsObj = {};
          if (this.clickQuestions == 1) {
            clickQuestionsObj = {};
          } else {
            clickQuestionsObj.singleNum = this.dictForm.singleNum ? this.dictForm.singleNum : '0'
            clickQuestionsObj.multipleNum = this.dictForm.multipleNum ? this.dictForm.multipleNum : '0'
            clickQuestionsObj.judgeNum = this.dictForm.judgeNum ? this.dictForm.judgeNum : '0'
          }
          let params = {
            ...clickQuestionsObj,
            ...sessObj.firstStep,
            questionList: obj,
            totalscore: this.allscore,
            topicNum: this.alltotal,
            type: this.clickQuestions == 1 ? 0 : 1,
            accessScore: this.accessScore,
          };

          if (sessObj.type == "add") {
            AddQuestionDataList(params)
              .then((res) => {
                // this.$antMessage.success(res.message);
                sessionStorage.removeItem("examinaObj_xt");
                const path = sessionStorage.getItem("examPathFrom")
                if (path) {
                  this.$router.replace(path);
                  if (path == '/ehsGerneralManage/educationmanagement/testManagementOne') {
                    this.$antMessage.success("新建试卷已进入试卷库");
                  } else {
                    this.$antMessage.success(res.message);
                  }
                } else {
                  this.$antMessage.success(res.message);
                  this.$router.replace(
                    "/ehsGerneralManage/educationmanagement/examinationPaper"
                  );
                }
                // this.$router.replace(
                //   "/educationmanagement/examinationPaper"
                // );
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            ChangeQuestionDataList(params)
              .then((res) => {
                this.$antMessage.success(res.message);
                sessionStorage.removeItem("examinaObj_xt");
                const path = sessionStorage.getItem("examPathFrom")
                if (path) {
                  this.$router.replace(path)
                } else {
                  this.$router.replace(
                    "/ehsGerneralManage/educationmanagement/examinationPaper"
                  );
                }
                // this.$router.replace(
                //   "/educationmanagement/examinationPaper"
                // );
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      } else {
        this.$antMessage.info("请先选择试题");
      }
    },

    //处理数据
    dealWithData() {
      let list = JSON.parse(JSON.stringify(this.list));
      let listT = [];
      list.forEach((item) => {
        listT.push({ questionId: item.topicId, score: item.topicScore });
      });
      return listT;
    },

    //打开批量设置分值弹框
    openAllSetVisible() {
      this.allSetVisible = true;
    },

    //关闭批量设置分值弹框
    closeAllSetVisible() {
      this.virtual = {
        radio: undefined,
        check: undefined,
        is: undefined,
      };
      this.allSetVisible = false;
    },

    //确认批量设置分值弹框
    submitAllSetVisible() {
      this.list.forEach((item) => {
        if (item.topicType == "1") {
          item.topicScore = this.virtual.radio;
        }
        if (item.topicType == "2") {
          item.topicScore = this.virtual.check;
        }
        if (item.topicType == "3") {
          item.topicScore = this.virtual.is;
        }
      });
      this.closeAllSetVisible();
    },

    //打开随机弹框
    openRandomVisible() {
      this.randomVisible = true;
    },

    //关闭随机弹框
    closeRandomVisible() {
      this.randomVisible = false;
    },

    //确认随机弹框
    submitRandomVisible() {
      if (
        this.dictForm.singleNum ||
        this.dictForm.multipleNum ||
        this.dictForm.judgeNum
      ) {
        this.randomObj.total =
          Number(this.dictForm.singleNum || 0) +
          Number(this.dictForm.multipleNum || 0) +
          Number(this.dictForm.judgeNum || 0);
        this.randomObj.price =
          (this.dictForm.singleNum || 0) * 2 +
          (this.dictForm.multipleNum || 0) * 5 +
          (this.dictForm.judgeNum || 0) * 5;
        this.clickQuestions = "2";
        this.closeRandomVisible();
        this.list = [];
      } else {
        this.$antMessage.info("请先选择题目");
      }
    },
    scoreBlur() {
      const value = this.accessScore;
      if (!value) {
        this.$antMessage.error("及格分数不能为空")
        this.redColor = true;
        return false;
      } else if (value > this.allscore) {
        this.redColor = true;
        this.$antMessage.error("及格分数不能大于试卷总分数")
        return false
      } else if (/\D/g.test(value) || value <= 0) {
        this.$antMessage.error("及格分数只能为大于0的整数")
        this.redColor = true;
        return false;
      } else if (/^0/.test(value)) {
        this.$antMessage.error("及格分数填入数值格式有误")
        this.redColor = true;
        return false;
      } else {
        this.redColor = false;
        return true
      }
    },
    //打开选择题目弹框
    handChoose() {
      this.addAddressModel = true;
    },

    //关闭件传弹框的参数
    closeAddAddressModel() {
      this.addAddressModel = false;
    },

    //接受组件传的参数
    submitDict(list) {
      this.clickQuestions = "1";
      this.sonDataList = list;
      this.getKDataList(list);
      this.closeAddAddressModel();
    },
  },
  computed: {
    //总分数
    allscore() {
      console.log(
        this.clickQuestions,
        this.dictForm,
        "....(this.clickQuestions"
      );
      let endScord = 0;
      if (this.clickQuestions == "1") {
        //手动
        this.list.forEach((item) => {
          endScord += Number(item.topicScore);
        });
      } else if (this.clickQuestions == "2") {
        //自动
        endScord =
          (this.dictForm.singleNum || 0) * 2 +
          (this.dictForm.multipleNum || 0) * 5 +
          (this.dictForm.judgeNum || 0) * 5;
        console.log;
      }
      return endScord;
    },
    //总题数
    alltotal() {
      let endScord = 0;
      if (this.clickQuestions == "1") {
        //手动
        endScord = this.list.length;
      } else {
        //自动
        endScord =
          Number(this.dictForm.singleNum || 0) +
          Number(this.dictForm.multipleNum || 0) +
          Number(this.dictForm.judgeNum || 0);
      }
      return endScord;
    },
    //单选题-总分数、总题数
    radioAll() {
      let endObj = { price: 0, total: 0 };
      if (this.clickQuestions == "1") {
        //手动
        let listAll = [];
        this.list.forEach((item) => {
          if (item.topicType == "1") {
            endObj.price += Number(item.topicScore);
            listAll.push(item);
          }
        });
        endObj.total = listAll.length;
      } else {
        endObj.price = (this.dictForm.singleNum || 0) * 2;
        endObj.total = this.dictForm.singleNum || 0;
      }
      return endObj;
    },
    //多选题-总分数、总题数
    checkAll() {
      let endObj = { price: 0, total: 0 };
      if (this.clickQuestions == "1") {
        //手动
        let listAll = [];
        this.list.forEach((item) => {
          if (item.topicType == "2") {
            endObj.price += Number(item.topicScore);
            listAll.push(item);
          }
        });
        endObj.total = listAll.length;
      } else {
        endObj.price = (this.dictForm.multipleNum || 0) * 5;
        endObj.total = this.dictForm.multipleNum || 0;
      }
      return endObj;
    },
    //判选题-总分数、总题数
    isAll() {
      let endObj = { price: 0, total: 0 };
      if (this.clickQuestions == "1") {
        //手动
        let listAll = [];
        this.list.forEach((item) => {
          if (item.topicType == "3") {
            endObj.price += Number(item.topicScore);
            listAll.push(item);
          }
        });
        endObj.total = listAll.length;
      } else {
        endObj.price = (this.dictForm.judgeNum || 0) * 5;
        endObj.total = this.dictForm.judgeNum || 0;
      }
      return endObj;
    },
    //批量设置分值每个总分值
    virtualThreeAll() {
      let endObj = { radioAll: 0, checkAll: 0, isAll: 0 };
      endObj.radioAll = this.radioAll.total * this.virtual.radio || 0;
      endObj.checkAll = this.checkAll.total * this.virtual.check || 0;
      endObj.isAll = this.isAll.total * this.virtual.is || 0;
      return endObj;
    },
  },
};
</script>

<style scoped lang='less'>
@media screen and (max-width: 1366px) {
  .clx-model{
    /deep/ .ant-modal{
      width: 800px !important;
    }
  }
}
.arc {
  width: 100%;
  height: 100%;
  .arc_content {
    width: 100%;
    display: flex;
    .arc_content_left {
      width: 80%;
      margin-right: 20px;
      h1 {
        font-size: 18px;
        padding-bottom: 20px;
        border-bottom: solid 1px #e9e9e9;
        span {
          font-size: 14px;
          color: rgb(148, 148, 148);
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
    .arc_content_right {
      flex: 1;
      .content_right_div {
        width: 285px;
        padding: 40px 20px 50px 20px;
        border: #eef2ff 1px solid;
        margin-bottom: 20px;
        h1 {
          text-align: center;
          font-size: 18px;
        }
        p {
          text-align: center;
          margin-top: 10px;
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
          color: #7f7f7f;
          text-align: left;
          line-height: 16px;
        }
        .content_right_div_item {
          width: 100%;
          margin-top: 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
  }
}
// 步骤条
.steps {
  color: #2c3e50;
  box-sizing: border-box;
  display: flex;
  margin: 20px 0 30px 0;
  & > span {
    width: 25%;
    height: 42px;
    line-height: 42px;
    padding-left: 30px;
    margin-right: 20px;
    background: #eef2ff;
    position: relative;
    // font-weight: 600;
    color: #999;
    &:before {
      content: "";
      width: 0;
      height: 0;
      border: 20px solid;
      border-color: transparent transparent transparent #eef2ff;
      position: absolute;
      right: -40px;
    }
    &:nth-child(2) {
      padding-left: 50px;
      &:after {
        content: "";
        width: 0;
        height: 0;
        border: 20px solid;
        border-color: transparent transparent transparent #fff;
        position: absolute;
        left: 0px;
      }
    }
  }
  .active {
    background: #e9f4ff;
    color: #0067cc;
    font-weight: 600;
    &:before {
      border-color: transparent transparent transparent #e9f4ff;
    }
  }
}
.display_div {
  width: 100%;
  display: flex;
  align-items: center;
}
.virtual_tab {
  width: 100%;
  // margin-bottom: 20px;

  .virtual_tab_top {
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgb(233, 233, 233);
    padding: 15px 0 15px 15px;
    background: #fafafa;
    .virtual_tab_top_item {
      width: 22%;
    }
    .virtual_tab_top_item_particular {
      width: 34%;
    }
  }
  .virtual_tab_bottom {
    width: 100%;
    .virtual_tab_bottom_item {
      width: 100%;
      display: flex;
      align-items: center;
      margin-top: 20px;
      border-bottom: 1px solid rgb(233, 233, 233);
      padding: 5px 0 20px 15px;
      div {
        width: 22%;
      }
      .virtual_tab_top_item_particular {
        width: 34%;
        display: flex;
        align-items: center;
        input {
          width: 60px;
          margin: 0 5px;
        }
      }
    }
  }
}
</style>