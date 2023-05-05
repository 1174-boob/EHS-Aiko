<template>
  <div class="form-wrapper clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>{{ type == "add" ? "新建" : "修改" }}</PageTitle>
    <div class="form-content">
      <a-form-model ref="ruleForm" :model="policyForm" :rules="policyRules" :colon="false">
        <a-row>
          <a-col :span="12">
            <CommonSearchItem :CommonFormInline="policyForm" :rules="policyRules" :notTablePage="true" :labelCol="labelCol" :wrapperCol="wrapperCol" labelAlign="right" @corporationChange="corporationChange"></CommonSearchItem>
            <a-form-model-item label="类型" prop="topicType" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="policyForm.topicType" placeholder="请选择类型" @change="topicTypeSelect">
                <a-select-option v-for="policy of policyLowType" :value="policy.key" :key="policy.id">{{ policy.value }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="题目分类" prop="sujectId" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="policyForm.sujectId" placeholder="请选择类型">
                <a-select-option v-for="item in sujectList" :value="item.subjectId" :key="item.subjectId">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="基础分值" prop="topicScore" :label-col="labelCol" :wrapper-col="wrapperCol">
              <div class="display_div">
                <a-input v-model="policyForm.topicScore" placeholder="请输入分数"></a-input>
                <div style="padding-left: 10px">分</div>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="题干" prop="topicTitle" :label-col="labelColEditor" :wrapper-col="wrapperColEditor">
              <Editor :height="height" v-model="policyForm.topicTitle" :isClear="isClear" @submitEditor="submitEditor"></Editor>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="答案选项" prop="optionsRels" :label-col="labelColEditor" :wrapper-col="wrapperColEditor">
              <div class="input_check_div" v-show="policyForm.optionsRels.length">
                <div class="item_input_check_div" v-for="(item, index) in policyForm.optionsRels" :key="index">
                  <span class="item_input_check_div_span">选项{{ item.tit }}</span>
                  <a-input placeholder="请输入" @change="inputchange($event, item)" :value="item.optionsContent"></a-input>
                  <a-checkbox class="item_input_check_div_check" :checked="item.solution" @change="checkchange(item)" v-show="policyForm.topicType == 2">设为正确答案</a-checkbox>
                  <a-radio
                    class="item_input_check_div_check"
                    :checked="item.solution"
                    @change="radiochange(item)"
                    v-show="
                      policyForm.topicType == 1 || policyForm.topicType == 3
                    "
                  >设为正确答案</a-radio>
                  <span class="color-ff4d4f cursor-pointer del_span" @click="delAnswer(item)">删除</span>
                </div>
              </div>
              <a-button type="primary" @click="addChoose" :disabled="addDisabledBtn">添加选项</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="答案解析" prop="topicSolution" :label-col="labelColEditor" :wrapper-col="wrapperColEditor">
              <Editor :height="height" v-model="policyForm.topicSolution" :isClear="isClear" @submitEditor="submitEditorTwo"></Editor>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="bottom_btnDiv">
      <a-button :style="{ marginLeft: '8px' }" @click="policyCancel">取消</a-button>
      <a-button type="primary" @click="policySubmit">确定</a-button>
    </div>
  </div>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import Editor from "@/components/editor/wangEditor.vue";
import UploadEhs from "@/components/upload/uploadEhs.vue";
import FixedBottom from "@/components/commonTpl/fixedBottom";
import _ from "lodash";
import {
  AddOrChangeDataList,
  DetaillDataList,
  SubjectsDataList,
} from "@/services/questionmodel.js";
import dictionary from "@/utils/dictionary.js";
export default {
  components: { Editor, UploadEhs, FixedBottom },
  data() {
    return {
      height: "300px",
      isClear: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
      labelColEditor: { span: 2 },
      wrapperColEditor: { span: 20 },
      policyForm: {
        topicType: undefined, //题型
        sujectId: undefined, //科目分类
        topicTitle: undefined, //题干
        topicScore: undefined, //基础分值
        topicSolution: undefined, //答题解析
        optionsRels: [], //选项集合
      },
      policyRules: {
        topicType: [
          { required: true, message: "类型不能为空", trigger: "change" },
        ],
        sujectId: [
          { required: true, message: "题目分类不能为空", trigger: "change" },
        ],
        topicTitle: [
          { required: true, message: "题干不能为空", trigger: "blur" },
        ],
        topicScore: [
          {
            required: true,
            validator: formValidator.texTonlyNumber,
            text: "基础分值",
            trigger: "change",
          },
        ],
        topicSolution: [
          { required: true, message: "答案解析不能为空", trigger: "change" },
        ],
        optionsRels: [
          { required: true, message: "答案选项不能为空", trigger: "change" },
        ],
      },
      type: undefined,
      topicId: undefined,
      policyLowType: [
        { key: 1, value: "单选题", id: 1 },
        { key: 2, value: "多选题", id: 2 },
        { key: 3, value: "判断题", id: 3 },
      ],
      sujectList: [],
    };
  },
  created() {
    this.setRouterCode("questionbankmanagement");
    // this.subjectsDataList(); //科目列表

    //获取参数
    let type = this.$route.query.type;
    let topicId = this.$route.query.topicId;

    //赋值存储参数
    this.type = type;
    this.topicId = topicId;

    //修改时调详情
    if (type == "change") {
      this.getaillDataList();
    }
  },
  methods: {
    // 组织变动
    corporationChange(corporationId, deptId) {
      this.$set(this.policyForm, "sujectId", undefined);
      if (corporationId) {
        this.subjectsDataList(corporationId);
      }
    },
    //科目列表
    subjectsDataList(corporationId) {
      SubjectsDataList({
        corporationId: corporationId
      })
        .then((res) => {
          if (corporationId) {
            this.sujectList = res.data || [];
            if (this.sujectList.length == 0) {
              this.$antMessage.warn("该组织下暂无题目分类");
            }
          } else {
            this.sujectList = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取编辑详情
    getaillDataList() {
      DetaillDataList({ topicId: this.topicId })
        .then((res) => {
          let policyForm = res.data || {};
          //处理答案选项-选中格式
          let list = res.data.optionsRels;
          list.forEach((item, index) => {
            item.solution = item.solution == 1 ? true : false;
            item.tit = String.fromCharCode(65 + index);
          });
          policyForm.optionsRels = list; //选项集合
          this.policyForm = { ...policyForm };
          this.subjectsDataList(this.policyForm.corporationId)
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //类型下拉事件
    topicTypeSelect(val) {
      this.policyForm.optionsRels = [];
    },

    //单选框改变事件
    radiochange(record) {
      let optionsRels = this.policyForm.optionsRels;
      optionsRels.forEach((item, index) => {
        if (item.optionsId == record.optionsId) {
          item.solution = true;
        } else {
          item.solution = false;
        }
      });
    },

    //复选框改变事件
    checkchange(record) {
      let optionsRels = this.policyForm.optionsRels;
      optionsRels.forEach((item, index) => {
        if (item.optionsId == record.optionsId) {
          item.solution = !item.solution;
        }
      });
    },

    //输入框改变事件
    inputchange(e, record) {
      let optionsRels = this.policyForm.optionsRels;
      optionsRels.forEach((item, index) => {
        if (item.optionsId == record.optionsId) {
          item.optionsContent = e.target.value;
        }
      });
    },

    //删除事件
    delAnswer(record) {
      let optionsRels = JSON.parse(JSON.stringify(this.policyForm.optionsRels));
      optionsRels.forEach((item, index) => {
        if (item.optionsId == record.optionsId) {
          optionsRels.splice(index, 1);
        }
      });
      optionsRels.forEach((item, index) => {
        item.tit = String.fromCharCode(65 + index);
      });
      this.policyForm.optionsRels = optionsRels;
    },

    //添加选项
    addChoose() {
      let tit = String.fromCharCode(65 + this.policyForm.optionsRels.length); //生成A-Z英文字母
      let newObj = {
        tit,
        solution: false,
        optionsContent: "",
        optionsId: String(Math.random()).slice(2),
      };
      let newArr = this.policyForm.optionsRels;
      newArr.push(newObj);
    },

    //富文本编辑器-题干
    submitEditor(value) {
      this.policyForm.topicTitle = value;
    },

    //富文本编辑器-答案解析
    submitEditorTwo(value) {
      this.policyForm.topicSolution = value;
    },

    // 标题校验
    titleValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("标题不能为空");
      } else if (value && value.length > 100) {
        return Promise.reject("不能超过100字");
      } else {
        callback();
      }
    },

    // 提交
    policySubmit:_.throttle(function() {
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      //校验答案选项
      if (!this.checkSolution()) {
        return;
      }
      let params = this.changeEndObj();
      if (this.type == "change") {
        params = { ...params, topicId: this.topicId };
      }
      AddOrChangeDataList(params)
        .then((res) => {
          if (res.code == 20000) {
            this.$antMessage.success(res.message);
            this.$router.replace(
              "/ehsGerneralManage/educationmanagement/questionbankmanagement"
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },1000),

    //提交时-改变数据字段返回后端需要格式
    changeEndObj() {
      let obj = JSON.parse(JSON.stringify(this.policyForm));
      let LocalObj = JSON.parse(sessionStorage.getItem("zconsole_userInfo"));
      obj.optionsRels.forEach((item, index) => {
        delete item.id;
        delete item.tit;

        //删除输入框未填写的选项
        if (!item.optionsContent) {
          obj.optionsRels.splice(index, 1);
        }

        if (item.solution) {
          //为正确选项
          item.solution = 1;
        } else {
          item.solution = 2;
        }

        item.sort = index + 1;
      });
      obj.productId = LocalObj.productSets.productId;
      obj.companyId = LocalObj.company.companyId;
      obj.phone = LocalObj.user.phone;

      return obj;
    },

    //提交时-判断答案选项是否符合规则
    checkSolution() {
      //1-单选；2-多选；3-判断

      let endReselt = true;
      if (this.policyForm.optionsRels.length < 2) {
        endReselt = false;
        this.$antMessage.info("答案选项个数最低为2个");
      } else if (
        this.policyForm.topicType == "1" ||
        this.policyForm.topicType == "3"
      ) {
        let resultOne = this.policyForm.optionsRels.every((item) => {
          return item.optionsContent;
        });
        if (!resultOne) {
          endReselt = false;
          this.$antMessage.info("请先输入选项内容");
        } else {
          let resultTwo = this.policyForm.optionsRels.some((item) => {
            return item.solution;
          });
          if (!resultTwo) {
            endReselt = false;
            this.$antMessage.info("最少选择1个选项为正确答案");
          } else {
            endReselt = true;
          }
        }
      } else if (this.policyForm.topicType == "2") {
        //多选
        let resultOne = this.policyForm.optionsRels.every((item) => {
          endReselt = false;
          return item.optionsContent;
        });
        if (!resultOne) {
          endReselt = false;
          this.$antMessage.info("请先输入选项内容");
        } else {
          let list = [];
          this.policyForm.optionsRels.forEach((item) => {
            if (item.solution) {
              list.push(item);
            }
          });
          if (list.length < 2) {
            endReselt = false;
            this.$antMessage.info("最少选择2个选项为正确答案");
          } else {
            endReselt = true;
          }
        }
      } else {
        endReselt = true;
      }

      return endReselt;
    },

    // 取消
    policyCancel() {
      this.setKeepalive(true)
      this.$router.replace(
        "/ehsGerneralManage/educationmanagement/questionbankmanagement"
      );
    },
  },
  computed: {
    //添加选项按钮禁用
    addDisabledBtn() {
      //1-单选；2-多选；3-判断
      //1-判断是否选中题目类型
      //2-判断类型 如果是判断题单选length为2就禁用
      //3-判断类型 如果是多选题length为8就禁用
      // 单选或多选选项2-8  判断2
      if (!this.policyForm.topicType) {
        return true;
      }
      if (this.policyForm.topicType == 1 || this.policyForm.topicType == 2) {
        //多选、单选
        if (this.policyForm.optionsRels.length == 8) {
          return true;
        }
      } else if (this.policyForm.topicType == 3) { // 判断
        if (this.policyForm.optionsRels.length == 2) {
          return true;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.form-wrapper {
  width: 100%;
  background: #fff;
  overflow-y: auto;
  padding-bottom: 60px;
  .ecertificateFileId-main {
    position: relative;
    display: flex;

    .ecertificateFileId-item2 {
      margin-left: 20px;
      height: 114px;
      width: 160px;
      position: relative;
      & > img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .main-tishi {
    font-size: 12px;
    color: #ccc;
    margin-top: 5px;
    display: block;
    line-height: 16px;
  }
  .action-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    right: 0.18rem;
    padding-right: 0.5rem !important;
    height: 0.6rem;
    padding-left: 0.4rem !important;
    background: #fff;
    z-index: 1;
    ::v-deep .ant-checkbox-wrapper {
      display: inline-block;
      margin-right: 6px;
      line-height: 0.6rem !important;
    }
    .promotion-agreement {
      color: #0067cc;
      cursor: pointer;
    }
  }
  ::v-deep .ant-input {
    color: #000;
  }
  .btn-content {
    display: flex;
    justify-content: left;
    padding: 30px 0 0;
    ::v-deep .ant-btn {
      margin-right: 20px;
    }
  }
}
.hover-box {
  padding: 10px 16px 4px;
  .fweight-p {
    font-weight: bold;
    font-size: 14px;
    margin: 0;
    text-align: center;
  }
  p {
    text-align: left;
    font-size: 12px;
  }
}
.bottom_btnDiv {
  text-align: right;
  padding: 0 20px;
  button {
    margin-right: 20px;
  }
}
.display_div {
  width: 100%;
  display: flex;
  align-items: center;
}
.item_input_check_div {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .item_input_check_div_span {
    width: 60px;
    display: inline-block;
    padding-right: 10px;
  }
  .item_input_check_div_check {
    width: 160px;
    padding: 0 0px 0 10px;
  }
  .del_span {
    width: 40px;
    display: inline-block;
  }
}
</style>