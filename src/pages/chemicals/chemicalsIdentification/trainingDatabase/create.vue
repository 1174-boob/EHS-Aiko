<template>
  <HasFixedBottomWrapper>
    <div class="arc">
      <!-- 步骤条 -->
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :colon="false">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="起草人" prop="createUserName" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="true" v-model="form.createUserName" placeholder="请输入起草人" :maxLength="30"></a-input>
            </a-form-model-item>
            <CommonSearchItem ref="commonSearchItem" :disabled="disabled" :CommonFormInline="form" :rules="rules" :notTablePage="true" :labelCol="labelCol" :wrapperCol="wrapperCol"></CommonSearchItem>
            <a-form-model-item label="培训课程名称" prop="courseName" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model="form.courseName" placeholder="请输入培训课程名称" :maxLength="30"></a-input>
            </a-form-model-item>
            <a-form-model-item label="主要内容" prop="courseContent" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model="form.courseContent" placeholder="请输入主要内容" :maxLength="30" />
            </a-form-model-item>
            <a-form-model-item label="培训对象" prop="coursePerson" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model="form.coursePerson" placeholder="请输入培训对象" :maxLength="30"></a-input>
            </a-form-model-item>
            <a-form-model-item label="建议培训时长" prop="courseDuration" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" v-model="form.courseDuration" placeholder="建议培训时长" :maxLength="30"></a-input>
            </a-form-model-item>
            <a-form-model-item label="资料附件" prop="courseFileList" :label-col="labelCol" :wrapper-col="wrapperCol">
              <UploadEhs :maxSize="20" :onlyShow="disabled" :accept="accept" @handleSuccess="handleSuccess" :fileLists="form.courseFileList"></UploadEhs>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div slot="fixedBottom" >
      <FixedBottom class="fixed-button-container">
        <a-button @click="onCancel">{{disabled ? '返回' : '取消'}}</a-button>
        <a-button v-if="!disabled" type="primary" @click="onSave">确定</a-button>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import dictionary from '@/utils/newDictionary'
import FixedBottom from "@/components/commonTpl/fixedBottom"
import { formValidator } from "@/utils/clx-form-validator.js"
import UploadEhs from "@/components/upload/uploadBtnStyle.vue"
import { debounce } from 'lodash'
import { msdsCourseSave, msdsCourseUpdate, msdsCourseDetail, msdsGetUserInfo } from "@/services/chemicalMsds"
import {
  SubjectsDataList,
  LookQuestionlDataList,
  
} from "@/services/questionmodel.js";

export default {
  components: { FixedBottom, UploadEhs },
  data() {
    return {
      labelCol: { span: 6 }, // 设置左边label宽度
      wrapperCol: { span: 16 }, // 设置右边表单宽度
      form: {
        createUserName: undefined,
        courseName: undefined,
        site: undefined,
        courseContent: undefined,
        coursePerson: undefined,
        courseDuration: undefined,
        courseFileList: []
      },
      orgnizeOptions: dictionary('organize'),
      accept: ['.doc', '.docx' ,'.pdf', '.xls', '.xlsx', '.ppt'],
      rules: {
        createUserName: [
          { required: true, maxLength: 30,  text: "申请人名称", trigger: "blur" },
        ],
        courseName: [
          { required: true, message: "培训课程名称不能为空", trigger: "change" },
        ],
        site: [
          { required: true, message: "所属组织不能为空", trigger: "change" },
        ],
        courseContent: [
          { required: true, message: "主要内容不能为空", trigger: "change" },
        ],
        coursePerson: [
          { required: true, message: "培训对象不能为空", trigger: "change" },
        ],
        courseDuration: [
          { required: true, message: "培训时长不能为空", trigger: "change" },
        ],
        courseFileList: [
          { required: true, message: "资料附件不能为空", trigger: "change" },
        ]
      },
      
    };
  },
  created() {
    this.setRouterCode('msdsApprove') 
    this.init()
  },
  computed: {
    disabled() {
      return this.$route.meta && this.$route.meta.isView
    },
    corporationList() {
      return this.$store.state.setting.corporationList;
    }
  },
  methods: {
    init() {
      //编辑和详情回显
      if (this.$route.query && this.$route.query.id) {
        this.fetchDetail(this.$route.query.id)
      } else {
        this.getUserInfo()
      }
    },
    async getUserInfo() {
      const { code, data } = await msdsGetUserInfo()
      if (+code === 20000) {
        this.form.createUserName = data.workNum ? data.userName + '/' + data.workNum : data.userName
        this.form.applicantId = data.userId
        // this.form.applicationDepartmentId = data.deptId
      }
    },
    async fetchDetail(id) {
      if (!id) {
        return
      }
      let para = {
        id: id
      }
      const { code, data } = await msdsCourseDetail(para)
      if (+code === 20000 && data) {
        this.form.site = data.site
        this.form.corporationId = data.corporationId
        this.form.createUserName = data.createUserName
        this.form.courseName = data.courseName
        this.form.courseContent = data.courseContent
        this.form.coursePerson = data.coursePerson
        this.form.courseDuration = data.courseDuration
        this.form.courseFileList = data.courseFileList
        this.form.centerId = data.centerId;
        this.form.centerName = data.centerName;
        this.form.corporationId = data.corporationId;
        this.form.corporationName = data.corporationName;
        this.form = {...this.form}
        this.$refs.commonSearchItem.corporationChange(this.form.corporationId, this.form.deptId)

      }
    },
    handleSuccess(file) {
      file = file.map(item => {
        return {
          uid: item.response ? item.response.data.id : item.uid,
          url: item.response ? item.response.data.url : item.url,
          name: item.name
        }
      })
      this.form.courseFileList = file
    },
    validate() {
      return new Promise((resolve) => {
        this.$refs.ruleForm.validate(valid => {
          resolve(valid)
        })
      }).catch(err => {
        console.log(err)
      })
    },
    onCancel() {
      this.setKeepalive(true)
      this.$router.push({
        path: '/safeManage/chemicalSafeManage/chemicalsIdentification/trainingDatabase'
      })
    },
    onSave: debounce( async function() {
      let valid = await this.validate()
      if (!valid) {
        return
      }
      let para = {
        ...this.form
      }
      let api = msdsCourseSave
      if (this.$route.query && this.$route.query.id) {
        //保存
        api = msdsCourseUpdate
        para.id = this.$route.query.id
      }
      const { code } = await api(para)
      if (+code === 20000) {
        this.$antMessage.success('保存成功')
        this.$router.push({
          path: '/safeManage/chemicalSafeManage/chemicalsIdentification/trainingDatabase'
        })
      }
    },300),
  }
}
</script>

<style scoped lang='less'>
.arc {
  margin-top:40px;
  width: 100%;
}

.fixed-button-container{
  .ant-btn +.ant-btn{
    margin-left:20px;
  }
}
.v-line-icon{
  display: inline-block;
  width:2px;
  height: 14px;
  margin-right:5px;
  background:#0067cc;
}
.active {
  background: #e9f4ff;
  color: #0067cc;
  font-weight: 600;
  &:before {
    border-color: transparent transparent transparent #e9f4ff;
  }
}
</style>