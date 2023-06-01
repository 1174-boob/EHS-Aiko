<template>
  <HasFixedBottomWrapper>
    <div class="arc">
      <!-- 步骤条 -->
      <div class="steps">
        <span class="active">1/设置设卷信息</span>
        <span>2/设置试卷题目</span>
      </div>
      <a-form-model ref="ruleForm" :model="policyForm" :rules="rules" :colon="false">
        <a-row>
          <a-col :span="12">
            <CommonSearchItem :CommonFormInline="policyForm" :rules="rules" :notTablePage="true" :labelCol="labelCol" :wrapperCol="wrapperCol" @corporationChange="corporationChange"></CommonSearchItem>
            <a-form-model-item label="试卷名称" prop="name" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="policyForm.name" placeholder="请输入试卷名称"></a-input>
            </a-form-model-item>
            <a-form-model-item label="科目" prop="subjectId" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="policyForm.subjectId" placeholder="请选择科目" allowClear>
                <a-select-option v-for="item in sujectList" :value="item.subjectId" :key="item.subjectId">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="试卷描述" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-textarea v-model="policyForm.description" placeholder="请选择试卷描述" :maxLength="1000" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div slot="fixedBottom">
      <FixedBottom>
        <a-button @click="cancel">取消</a-button>
        <a-button type="primary" :style="{ marginLeft: '20px' }" @click="submit">下一步</a-button>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom";
import { formValidator } from "@/utils/clx-form-validator.js";
import {
  SubjectsDataList,
  LookQuestionlDataList,
} from "@/services/questionmodel.js";

export default {
  components: { FixedBottom },
  data() {
    return {
      labelCol: { span: 4 }, // 设置左边label宽度
      wrapperCol: { span: 18 }, // 设置右边表单宽度
      policyForm: {
        name: undefined,
        subjectId: undefined,
        description: undefined,
      },
      rules: {
        name: [
          { required: true, maxLength: 45, minLength: 2, text: "试卷名称", validator: formValidator.limitLength, trigger: "blur" },
        ],
        subjectId: [
          { required: true, message: "科目不能为空", trigger: "change" },
        ],
      },
      policyLowType: [], //科目数组
      sujectList: [],
      paperId: undefined,
      type: undefined,
      secondObj: {},
      secondStep: {},
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.path == '/ehsGerneralManage/educationmanagement/testManagementOne') {
      next(vm => {
        vm.setRouterCode("examinationPaper");
        sessionStorage.setItem("examPathFrom", from.path);
      })
    } else {
      next(vm => {
        vm.setRouterCode("examinationPaper");
      });
    }
  },
  created() {
    // this.subjectsDataList(); //科目列表
    let sessObj = JSON.parse(sessionStorage.getItem("examinaObj_xt"));

    //刷新则返回列表
    let isJump = this.$store.state.examina.examinaObj;
    if (!isJump) {
      this.$router.replace(
        "/ehsGerneralManage/educationmanagement/examinationPaper"
      );
      sessionStorage.removeItem("examinaObj_xt");
      return;
    }

    if (sessObj && sessObj.firstStep && sessObj.type) {
      this.policyForm = sessObj.firstStep;
      this.type = sessObj.type;
      this.secondStep = sessObj.secondStep;
      return;
    }

    let paperId = this.$route.query.paperId;
    let type = this.$route.query.type;

    this.paperId = paperId;
    this.type = type;

    console.log(sessObj, this.type, "...this.type");
    if (this.type == "change") {
      this.detailList(); //回显
    }
  },
  methods: {
    // 组织变动
    corporationChange(corporationId, deptId) {
      this.$set(this.policyForm, "subjectId", undefined);
      this.sujectList = [];
      if (corporationId) {
        this.subjectsDataList(corporationId);
      }
    },
    //回显
    detailList() {
      LookQuestionlDataList({ paperId: this.paperId }).then(
        (res) => {
          this.policyForm = {
            name: res.data.name,
            subjectId: res.data.subjectId,
            description: res.data.description,
            corporationId: res.data.corporationId,
            accessScore: res.data.accessScore,
          };
          this.subjectsDataList();
          this.secondObj = res.data;
          this.secondStep = {
            questionList: res.data.questionList,
            type: res.data.type,
            dictForm: {
              sigleNum: res.data.sigleNum, //单选
              multipleNum: res.data.multipleNum, //多选
              judgeNum: res.data.judgeNum, //判断
              // subjectId: res.data.subjectId, //科目
            },
          };
        }
      );
    },
    //科目
    subjectsDataList() {
      SubjectsDataList({
        corporationId: this.policyForm.corporationId
      })
        .then((res) => {
          this.sujectList = res.data || [];
          if (this.sujectList.length == 0) {
            this.$antMessage.warn("该组织下暂无科目");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //下一步
    submit() {
      // console.log(this.type, "...this.type");
      if (!formValidator.formAll(this, "ruleForm")) return;
      let obj = {
        firstStep: { ...this.policyForm, paperId: this.paperId },
        secondStep: this.secondStep,
        type: this.type,
      };
      sessionStorage.setItem("examinaObj_xt", JSON.stringify(obj));
      this.$router.replace(
        "/ehsGerneralManage/educationmanagement/examinationAOCTwo"
      );
    },
    //返回
    cancel() {
      this.setKeepalive(true)
      console.log("-----------66--6");
      sessionStorage.removeItem("examinaObj_xt");
      const path = sessionStorage.getItem("examPathFrom")
      if (path) {
        this.$router.replace(path)
      } else {
        this.$router.replace(
          "/ehsGerneralManage/educationmanagement/examinationPaper"
        );
      }
    },
  },
};
</script>

<style scoped lang='less'>
.arc {
  width: 100%;
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
</style>