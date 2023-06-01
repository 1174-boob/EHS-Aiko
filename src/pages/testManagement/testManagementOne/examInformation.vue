<template>
  <div class="form-wrapper">
    <div class="form-content">
      <a-form-model ref="ruleForm" :model="policyForm" :rules="examRules" :colon="false">
        <a-row>
          <a-col :span="12">
            <h1 style="font-size: 16px">基本信息</h1>
            <CommonSearchItem :CommonFormInline="policyForm" :rules="examRules" :notTablePage="true" :labelCol="labelCol" :wrapperCol="wrapperCol" @corporationChange="corporationChange"></CommonSearchItem>
            <a-form-model-item label="名称" prop="name" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="policyForm.name" placeholder="考试名称，不超过45个字" />
            </a-form-model-item>
            <a-form-model-item label="考试封面" prop="headImg" :label-col="labelCol" :wrapper-col="wrapperCol">
              <upload-can-remove ref="editModel" :maxSize="5" :limit="1" :headImgs="headImgs" :handleSuccessName="'addFormUploadSuccess'" @addFormUploadSuccess="addFormUploadSuccess"></upload-can-remove>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="考试详情" :label-col="labelColEditor" :wrapper-col="wrapperColEditor">
              <Editor :height="height" v-model="policyForm.detail" :isClear="isClear" @submitEditor="submitEditor"></Editor>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="关联课程" prop="relCourse" :label-col="labelCol" :wrapper-col="wrapperCol">
              <div class="list_div">
                <div class="list_div_item" v-for="(item, index) in courseList" :key="item.courseId">
                  <div class="item_left">
                    <img
                      :src="item.coverUrl?item.coverUrl:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic_source%2F9e%2F32%2F9a%2F9e329acc0c79523b0204f6ed7ea1e45e.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1656225906&t=b23453b4f502773672e7f27ffc36ba5b'"
                      alt
                    />
                  </div>
                  <div class="item_right">
                    {{ item.name }}
                    <!-- <p>{{ item.type }}</p> -->
                  </div>
                  <div class="position" @click="deleteCourse(item.courseId)">×</div>
                </div>
                <a-button type="primary" @click="selectCourse">关联课程</a-button>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <h1 style="font-size: 16px">考试设置</h1>
            <a-form-model-item label="考试时间" prop="examinationTime" :label-col="labelCol" :wrapper-col="wrapperCol">
              <div class="exam-time">
                <div class="display_div">
                  <a-input v-model="policyForm.examinationTime" placeholder="请输入考试时间"></a-input>
                  <div style="padding-left: 10px; width: 60px">分钟</div>
                </div>
                <div class="tips">限制考试时长的情况下，员工考试中离开，倒计时不会停止，建议提醒员工不要长时间离开考试</div>
              </div>
            </a-form-model-item>
            <a-form-model-item label="参与考试次数" :prop="policyForm.limitFrequency==1?'limitFrequency':'frequency'" :label-col="labelCol" :wrapper-col="wrapperCol">
              <div>
                <a-radio-group v-model="policyForm.limitFrequency">
                  <a-radio value="1">不限次数</a-radio>
                  <a-radio value="2">限制</a-radio>
                </a-radio-group>
                <a-input style="width:30%" v-model="policyForm.frequency" :disabled="countDisabled" />
                <span style="margin-left:10px">次</span>
              </div>
            </a-form-model-item>
            <a-form-model-item label="重考时间间隔" prop="timeInterval" :label-col="labelCol" :wrapper-col="wrapperCol">
              <div class="exam-time">
                <div class="display_div">
                  <a-input v-model="policyForm.timeInterval" placeholder="请输入重考时间间隔"></a-input>
                  <div style="padding-left: 10px; width: 60px">分钟</div>
                </div>
                <div class="tips">员工完成考试提交后，计时结束后可以重考</div>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <h1 style="font-size: 16px">题目分值</h1>
            <a-form-model-item label="题目分值" prop="topicScore" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-radio-group v-model="policyForm.topicScore">
                <a-radio value="1">显示</a-radio>
                <!-- <a-radio value="2">隐藏</a-radio> -->
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <h1 style="font-size: 16px">答案展示</h1>
            <a-form-model-item label="答案展示" prop="answer" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-radio-group v-model="policyForm.answer">
                <a-radio value="1">提交后立即展示</a-radio>
                <!-- <a-radio value="2">隐藏</a-radio> -->
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="bottom_btnDiv">
      <a-button :style="{ marginLeft: '8px' }" @click="policyCancel">取消</a-button>
      <a-button type="primary" @click="policySubmit">下一步</a-button>
    </div>
    <CorrelativeCourse
      :corporationId="policyForm.corporationId"
      :addAddressModel="addAddressModel"
      :selectedCourse="selectedCourse"
      @closeAddAddressModel="closeAddAddressModel"
      @submitCourse="submitCourse"
    />
  </div>
</template>
<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import Editor from "@/components/editor/wangEditor.vue";
import UploadEhs from "@/components/upload/uploadEhs.vue";
import FixedBottom from "@/components/commonTpl/fixedBottom";
import { GetfileMsgList, GetCourseDetail } from "@/services/api.js";
import UploadCanRemove from "@/components/upload/uploadCanRemove.vue";
import CorrelativeCourse from "./correlativeCourse.vue"

export default {
  components: { Editor, UploadEhs, FixedBottom, UploadCanRemove, CorrelativeCourse },
  props: ["examData"],
  data() {
    return {
      height: "300px",
      isClear: false,
      addAddressModel: false,
      countDisabled: true,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      labelColEditor: { span: 2 },
      wrapperColEditor: { span: 20 },
      policyForm: {
        centerId: "",
        corporationId: undefined,
        name: '', //试卷名称
        cover: null, //封面id
        detail: '', //详情
        courseId: null, //课程id
        // examineeScope: "1", //考生范围 1-全部，2-部分
        examinationTime: '', //考试时间
        limitFrequency: '1', //是否限制次数1-否，2-是
        frequency: '', //限制次数
        count: '', //次数
        timeInterval: null, //时间间隔
        topicScore: '1', //分值是否显示 1-否，2-是
        answer: '1' //答案是否展示：1-否，2-是
      },
      type: undefined,
      topicId: undefined,
      policyLowType: [
        { key: 1, value: "单选题", id: 1 },
        { key: 2, value: "多选题", id: 2 },
        { key: 3, value: "判断题", id: 3 },
      ],
      sujectList: [],
      headImgs: [
        // {
        //   id: "1531184019428024321",
        //   name: "gpm补充需求.png",
        //   status: "done",
        //   uid: "vc-upload-1653897504892-4",
        //   url: "https://test.boeplat.com/dev/file/resource/1653897692838.png",
        // }
      ],
      courseList: [],
      selectedCourse: []

    };
  },
  watch: {
    "policyForm.limitFrequency": {
      handler(value) {
        if (value == 1) {
          this.countDisabled = true;
          this.policyForm.frequency = ''
        } else {
          this.countDisabled = false;
        }
      },
      immediate: true,
      deep: true
    },
    // 编辑状态数据回显使用
    examData: {
      handler(value) {
        console.log("==========================");
        if (value) {
          console.log("examData===========================", value);
          this.policyForm = Object.assign(this.policyForm, value);
          if (value.courseId) {
            this.getCourseList(value.courseId);
          }
          if (value.cover) {
            this.getfileMsgList(value.cover);
          }
        }
      },
      immediate: true,
      deep: true
    },
  },
  computed: {
    //添加选项按钮禁用
    addDisabledBtn() {
      //1-单选；2-多选；3-判断
      //1-判断是否选中题目类型
      //2-判断类型 如果是判断题单选length为2就禁用
      //3-判断类型 如果是多选题length为8就禁用
      if (!this.policyForm.topicType) {
        return true;
      }
      if (this.policyForm.topicType == 1) {
        //判断
        if (this.policyForm.optionsRels.length == 2) {
          return true;
        }
      } else if (
        this.policyForm.topicType == 2 ||
        this.policyForm.topicType == 3
      ) {
        //多选、单选
        if (this.policyForm.optionsRels.length == 8) {
          return true;
        }
      }
    },
    examRules() {
      let examRules = {
        name: [
          { required: true, validator: this.nameValidator, trigger: "blur" },
        ],
        headImg: [
          { required: true, validator: this.headImgValidator, trigger: "change" },
        ],
        relCourse: [
          { required: true, validator: this.courseValidator, trigger: "change" },
        ],
        // examineeScope: [
        //   { required: true, message: "请选择考生范围", trigger: "change" },
        // ],
        limitFrequency: [
          { required: true, message: "请选择参与考试次数", trigger: "change" },
        ],
        examinationTime: [
          { required: true, validator: this.timeValidator, trigger: "change" },
        ],
        frequency: [
          { required: true, validator: this.countValidator, trigger: ["blur", 'change'] },
        ],
        timeInterval: [
          { required: true, validator: this.timeInValidator, trigger: "change" },
        ],
        topicScore: [
          { required: true, message: "题目分值不能为空", trigger: "change" },
        ],
        answer: [
          { required: true, message: "答案展示不能为空", trigger: "change" },
        ],
      }
      return examRules
    },
  },
  created() {
    this.setRouterCode("testManagement");
    // this.subjectsDataList(); //科目列表
    //获取参数
    let type = this.$route.query.type;
    let topicId = this.$route.query.topicId;

    //赋值存储参数
    this.type = type;
    this.topicId = topicId;

    //修改时调详情
    // if (type == "change") {
    //   this.getaillDataList();
    // }
  },
  methods: {
    // 组织变动
    corporationChange(corporationId, deptId) {
      this.$set(this.policyForm, "courseId", undefined);
      this.selectedCourse = [];
      this.courseList = [];
    },
    //头像上传
    async addFormUploadSuccess(fileList) {
      this.headImg = fileList[0];
      if (!formValidator.formItemValidate(this, "headImg", "ruleForm")) {
        return;
      }
    },
    // 获取图片详情
    getfileMsgList(cover) {
      GetfileMsgList([cover]).then(res => {
        // console.log("===图片详情是==",res);
        if (res.code == 20000) {
          this.headImgs = [{
            id: res.data[0].id,
            name: res.data[0].fileName,
            status: "done",
            uid: "-4",
            url: res.data[0].filePath,
          }];
          this.headImg = this.headImgs[0];
          console.log("hhhhead==", this.headImgs);
        }
      }).catch(err => {
        console.log(err);
      })
    },
    //科目列表
    // subjectsDataList() {
    //   SubjectsDataList()
    //     .then((res) => {
    //       this.sujectList = res.data;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
    // 获取编辑详情
    // getaillDataList() {
    //   DetaillDataList({ topicId: this.topicId })
    //     .then((res) => {
    //       this.policyForm.topicType = res.data.topicType; //题型
    //       this.policyForm.subjectId = res.data.subjectId; //科目分类
    //       this.policyForm.topicTitle = res.data.topicTitle; //题干
    //       this.policyForm.topicScore = res.data.topicScore; //基础分值
    //       this.policyForm.topicSolution = res.data.topicSolution; //答题解析
    //       //处理答案选项-选中格式
    //       let list = res.data.optionsRels;
    //       list.forEach((item, index) => {
    //         item.solution = item.solution == 1 ? true : false;
    //         item.tit = String.fromCharCode(65 + index);
    //       });
    //       this.policyForm.optionsRels = list; //选项集合
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },

    //类型下拉事件
    topicTypeSelect(val) {
      this.policyForm.optionsRels = [];
    },
    // 关闭model
    closeAddAddressModel() {
      this.addAddressModel = false;
      if (!formValidator.formItemValidate(this, "relCourse", "ruleForm")) {
        return;
      }
    },

    // 选择课程
    selectCourse() {
      if (!this.policyForm.corporationId) {
        this.$antMessage.warn("请先选择所属组织");
        return;
      }
      this.addAddressModel = true;
      this.selectedCourse = JSON.parse(JSON.stringify(this.courseList));
    },
    // 删除课程
    deleteCourse(id) {
      console.log("id==", id);
      this.courseList = this.courseList.filter(item => {
        return item.courseId != id
      })
      if (!formValidator.formItemValidate(this, "relCourse", "ruleForm")) {
        return;
      }
    },
    // 获取课程详情
    async getCourseList(courseId) {
      const result = await GetCourseDetail({ courseId });
      console.log("yyyyyyyyyyyy===uui", result);
      this.courseList = [result.data];
    },
    // 选择课程弹框回传数据
    submitCourse(value) {
      console.log("hui===", value);
      this.courseList = value;
      // this.courseList = [
      //   {
      //     id:'11',
      //     url: "https://inews.gtimg.com/newsapp_bt/0/14162219372/1000",
      //     tit: "小女孩名称",
      //     type: 1,
      //   },
      //   {
      //     id:"22",
      //     url: "https://inews.gtimg.com/newsapp_bt/0/14162219372/1000",
      //     tit: "小女孩名称2",
      //     type: 1,
      //   },
      // ]
      if (!formValidator.formItemValidate(this, "relCourse", "ruleForm")) {
        return;
      }
    },
    // submitStu(value) {
    //   console.log("选中的学员是。。。",value);
    //   if(value.length<1) {
    //     this.policyForm.examineeScope = '1';
    //   }
    // },
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
      console.log("vvvvv==", value);
      this.policyForm.detail = value;
    },

    //富文本编辑器-答案解析
    submitEditorTwo(value) {
      this.policyForm.topicSolution = value;
    },

    // 提交
    policySubmit() {
      // this.policyForm.cover = this.headImg.id;

      console.log("提交。。。", this.policyForm);
      console.log("headImg====", this.headImg);
      // this.$store.commit("setting/setExamFormData",this.policyForm);
      //校验必填项
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      this.policyForm.cover = this.headImg.id;
      this.policyForm.courseId = this.courseList[0].courseId;

      //校验答案选项
      // if (!this.checkSolution()) {
      //   return;
      // }
      // let params = this.changeEndObj();
      // if (this.type == "change") {
      //   params = { ...params, topicId: this.topicId };
      // }
      // AddOrChangeDataList(params)
      //   .then((res) => {
      //     if (res.code == 20000) {
      //       this.$antMessage.success(res.message);
      //       this.$router.replace(
      //         "/educationmanagement/questionbankManagement"
      //       );
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      const data = {
        ...this.policyForm,

      }
      this.$emit("jumpPage", { data, page: 2, })
      // this.$emit("jumpPage",{page:2})
    },

    // //提交时-改变数据字段返回后端需要格式
    // changeEndObj() {
    //   let obj = JSON.parse(JSON.stringify(this.policyForm));
    //   let LocalObj = JSON.parse(sessionStorage.getItem("zconsole_userInfo"));
    //   obj.optionsRels.forEach((item, index) => {
    //     delete item.id;
    //     delete item.tit;

    //     //删除输入框未填写的选项
    //     if (!item.optionsContent) {
    //       obj.optionsRels.splice(index, 1);
    //     }

    //     if (item.solution) {
    //       //为正确选项
    //       item.solution = 1;
    //     } else {
    //       item.solution = 2;
    //     }

    //     item.sort = index + 1;
    //   });
    //   obj.productId = LocalObj.productSets.productId;
    //   obj.companyId = LocalObj.company.companyId;
    //   obj.phone = LocalObj.user.phone;

    //   return obj;
    // },
    // 名称校验
    nameValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("请输入考试名称")
      } else if (value.length < 2 || value.length > 45) {
        return Promise.reject("考试名称2-45个汉字")
      } else {
        callback()
      }
    },
    // 封面校验
    headImgValidator(rule, value, callback) {
      if (!this.headImg || !this.headImg.id) {
        return Promise.reject("封面不能为空")
      } else {
        callback()
      }
    },
    // 关联课程校验
    courseValidator(rule, value, callback) {
      if (this.courseList.length < 1) {
        return Promise.reject("关联课程不能为空")
      } else {
        callback()
      }
    },
    // 考试时间
    timeValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("考试时间不能为空")
      } else if (/\D/g.test(value)) {
        return Promise.reject("考试时间只能为大于0的整数")
      } else if (value <= 0) {
        return Promise.reject("考试时间只能为大于0的整数")
      } else if (/^0/.test(value)) {
        return Promise.reject("填入数值格式有误")
      } else {
        callback()
      }
    },
    // 考试时间间隔校验
    timeInValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("重考时间间隔不能为空")
      } else if (/\D/g.test(value)) {
        return Promise.reject("重考时间间隔只能为大于0的整数")
      } else if (value <= 0) {
        return Promise.reject("重考时间间隔只能为大于0的整数")
      } else if (/^0/.test(value)) {
        return Promise.reject("填入数值格式有误")
      } else {
        callback()
      }
    },
    // 限制次数校验
    countValidator(rule, value, callback) {
      if (!value || value == '') {
        return Promise.reject("考试次数不能为空")
      } else if (/\D/g.test(value)) {
        return Promise.reject("考试次数只能为大于0的整数")
      } else if (value <= 0) {
        return Promise.reject("考试次数只能为大于0的整数")
      } else if (/^0/.test(value)) {
        return Promise.reject("填入数值格式有误")
      } else {
        callback()
      }
    },

    // //提交时-判断答案选项是否符合规则
    // checkSolution() {
    //   //1-单选；2-多选；3-判断

    //   let endReselt = true;
    //   if (this.policyForm.optionsRels.length < 2) {
    //     endReselt = false;
    //     this.$antMessage.info("答案选项个数最低为2个");
    //   } else if (
    //     this.policyForm.topicType == "1" ||
    //     this.policyForm.topicType == "3"
    //   ) {
    //     let resultOne = this.policyForm.optionsRels.every((item) => {
    //       return item.optionsContent;
    //     });
    //     if (!resultOne) {
    //       endReselt = false;
    //       this.$antMessage.info("请先输入选项内容");
    //     } else {
    //       let resultTwo = this.policyForm.optionsRels.some((item) => {
    //         return item.solution;
    //       });
    //       if (!resultTwo) {
    //         endReselt = false;
    //         this.$antMessage.info("最少选择1个选项为正确答案");
    //       } else {
    //         endReselt = true;
    //       }
    //     }
    //   } else if (this.policyForm.topicType == "2") {
    //     //多选
    //     let resultOne = this.policyForm.optionsRels.every((item) => {
    //       endReselt = false;
    //       return item.optionsContent;
    //     });
    //     if (!resultOne) {
    //       endReselt = false;
    //       this.$antMessage.info("请先输入选项内容");
    //     } else {
    //       let list = [];
    //       this.policyForm.optionsRels.forEach((item) => {
    //         if (item.solution) {
    //           list.push(item);
    //         }
    //       });
    //       if (list.length < 2) {
    //         endReselt = false;
    //         this.$antMessage.info("最少选择2个选项为正确答案");
    //       } else {
    //         endReselt = true;
    //       }
    //     }
    //   } else {
    //     endReselt = true;
    //   }

    //   return endReselt;
    // },

    // 取消
    policyCancel() {
      this.setKeepalive(true)
      this.$router.replace(
        "/ehsGerneralManage/educationmanagement/testManagement"
      );
    },
  },

};
</script>

<style lang="less" scoped>
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
    &:nth-child(2),
    &:nth-child(3) {
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
.exam-time {
  .tips {
    margin: 4px 0;
    font-size: 12px;
    color: #7f7f7f;
  }
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
.list_div {
  width: 100%;
  .list_div_item {
    display: flex;
    margin-bottom: 10px;
    background: #f6faff;
    padding: 20px;
    position: relative;
    .position {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 20px;
      &:hover {
        color: red;
        cursor: pointer;
      }
    }
    .item_left {
      margin-right: 20px;
      img {
        width: 80px;
        height: 80px;
      }
    }
    .item_right {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
      // p {
      //   margin-top: 10px;
      // }
    }
  }
}
</style>