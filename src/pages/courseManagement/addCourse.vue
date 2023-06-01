<template>
  <HasFixedBottomWrapper>
    <div class="tip">
      <i>!</i>请您遵守国家相关规定，切勿上传低俗色情、暴力恐怖、谣言诈骗、侵权盗版等相关内容，工业互联网平台保有依据国家规定及平台规则进行处理的权利。
    </div>
    <div class="m-t-20 border-b-e7">
      <PageTitle>基本信息</PageTitle>
    </div>
    <div class="m-t-20">
      <FormPage ref="basicForm" :formPageModal="basicInfoForm" :formPageRules="basicInfoRules">
        <template slot="left">
          <CommonSearchItem :CommonFormInline="basicInfoForm" :rules="basicInfoRules" :notTablePage="true" @corporationChange="corporationChange" ></CommonSearchItem>
          <a-form-model-item label="课程名称" prop="name">
            <a-input v-model="basicInfoForm.name" :maxLength="45" placeholder="请输入课程名称，不超过45个字"></a-input>
          </a-form-model-item>
          <a-form-model-item label="课程贴片" prop="patch">
            <div title="课程封面是指在商品列表展示的图片">
              <upload-can-remove ref="coursePatch" :maxSize="5" :limit="1" @handleSuccess="handleSuccess1"></upload-can-remove>
            </div>
          </a-form-model-item>
        </template>
        <template slot="right">
          <a-form-model-item label="课程描述" prop="description">
            <a-input v-model="basicInfoForm.description" :maxLength="300" placeholder="请输入课程描述，不超过300字"></a-input>
          </a-form-model-item>
          <a-form-model-item label="课程封面" prop="cover">
            <div title="课程贴片是指在播放前展示的图片">
              <upload-can-remove ref="courseCover" :maxSize="5" :limit="1" @handleSuccess="handleSuccess2"></upload-can-remove>
            </div>
          </a-form-model-item>
        </template>
      </FormPage>
    </div>
    <div class="m-t-20 border-b-e7">
      <PageTitle>课程信息</PageTitle>
    </div>
    <div class="m-t-20">
      <FormPage ref="courseForm" :formPageModal="courseInfoForm" :formPageRules="courseInfoRules">
        <template slot="left">
          <a-form-model-item label="所属科目" prop="subjectId">
            <a-select v-model="courseInfoForm.subjectId" placeholder="请选择科目">
              <a-select-option v-for="item in subjectList" :key="item.subjectId" :value="item.subjectId">{{item.name}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="课程模块" prop="moduleList">
            <div>
              <DashBtn>
                <div>
                  <a-button type="dashed" @click="addModule">添加模块</a-button>
                </div>
              </DashBtn>
            </div>
          </a-form-model-item>
        </template>
        <template slot="right">
          <a-form-model-item label="选择讲师">
            <a-select mode="multiple" v-model="courseInfoForm.lecturerIdList" placeholder="请选择讲师">
              <a-select-option v-for="item in lecturerList" :key="item.lecturerId" :value="item.lecturerId">{{item.name}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </template>
      </FormPage>
      <CommonTable :noPaging="true">
        <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="moduleList" :rowKey="(record, index)=>{return index}" :pagination="false">
          <div slot="action" slot-scope="record">
            <span class="color-0067cc cursor-pointer m-r-15" @click="actionEdit(record)">编辑</span>
            <span class="color-0067cc cursor-pointer" @click="actionDelete(record)">删除</span>
          </div>
          <div slot="coursewareList" slot-scope="record">
            <span class="m-r-8" v-for="item in record.coursewareList" :key="item">{{findText(coursewareListAll, "coursewareId", item).name}}</span>
          </div>
        </a-table>
      </CommonTable>
    </div>
    <div class="m-t-20 border-b-e7">
      <PageTitle>排序</PageTitle>
    </div>
    <div class="m-t-20">
      <FormPage ref="sortForm" :formPageModal="sortForm" :formPageRules="sortRules">
        <template slot="left">
          <a-form-model-item label="排序序号" prop="sortNo">
            <a-input v-model="sortForm.sortNo" :maxLength="45" placeholder="请输入排序序号"></a-input>
          </a-form-model-item>
        </template>
      </FormPage>
    </div>
    <div class="m-t-20 border-b-e7">
      <PageTitle>试卷</PageTitle>
    </div>
    <div class="m-t-20">
      <FormPage ref="testForm" :formPageModal="testForm">
        <template slot="left">
          <a-form-model-item v-show="!testForm.paperId" class="test-form-item" label="关联试卷">
            <div>
              <DashBtn>
                <div>
                  <a-button type="dashed" @click="relatedTestPaper">+ 关联试卷</a-button>
                </div>
              </DashBtn>
            </div>
          </a-form-model-item>
          <div class="flex justify-content-between test-paper pd-l-20 pd-r-20 pd-t-20 pd-b-20 bg-f5f7fa border-radius-3" v-show="testForm.paperId">
            <div>{{chooseTestMsg.name}}</div>
            <div class="flex flex-direction-column">
              <span class="m-b-15" @click="resetTestPaper">重新选择</span>
              <span @click="deleteTestPaper">删除</span>
            </div>
          </div>
        </template>
      </FormPage>
    </div>
    <div class="m-t-20 border-b-e7">
      <PageTitle>上架设置</PageTitle>
    </div>
    <div class="m-t-20">
      <FormPage ref="groundingForm" :formPageModal="groundingForm" :formPageRules="groundingRules">
        <template slot="left">
          <a-form-model-item label="上架设置" prop="status">
            <a-radio-group name="radioGroup" :default-value="1" v-model="groundingForm.status">
              <a-radio v-for="item in groundingList" :key="item.value" :value="item.value">{{item.label}}</a-radio>
            </a-radio-group>
          </a-form-model-item>
        </template>
      </FormPage>
    </div>
    <CommonModal :title="modalTitle" :visible="moduleVisible" :cancelFn="addModleCancle">
      <template slot="form">
        <a-form-model
          ref="addModleForm"
          :model="addModleForm"
          :rules="addModleFormRules"
          :label-col="{ style: { width: '80px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 80px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="模块标题" prop="title">
            <a-input v-model="addModleForm.title" placeholder="请输入模块标题" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="模块描述">
            <a-textarea v-model="addModleForm.description" :maxLength="300" placeholder="请输入模块描述" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="模块资源" prop="coursewareList">
            <a-select v-model="addModleForm.coursewareList" :filterOption="filterOption" mode="multiple" style="width: 100%" placeholder="请选择课件资源，可多选">
              <a-select-option v-for="item in coursewareListAll" :key="item.coursewareId" :label="item.name" :value="item.coursewareId">{{item.name}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="模块序号" prop="sort">
            <a-input v-model="addModleForm.sort" :maxLength="45" placeholder="请输入模块序号"></a-input>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="addModleCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="addModleConfirm">确定</a-button>
      </template>
    </CommonModal>
    <CommonModal class="test-modal" title="关联试卷" :visible="testVisible" :cancelFn="testCancle">
      <div class="flex">
        <div class="test-left border-f4 pd-l-20 pd-r-20 pd-t-20 pd-b-20 bg-fc m-r-20">
          <div class="search bg-fff flex border-f4 border-radius-3">
            <input class="flex-1" v-model="testForm.name" placeholder="请输入分类名称" />
            <span @click="getSubjectlist">搜索</span>
          </div>
          <div class="main pd-l-10 pd-t-20 pd-r-10">
            <div class="m-b-16" :class="{'color-0067cc': !testForm.subjectId}" @click="chooseTestType()">所有试卷</div>
            <div class="type-list">
              <ul>
                <li
                  class="flex align-items-center justify-content-between"
                  :class="{'color-0067cc': item.subjectId == testForm.subjectId}"
                  v-for="item in subjectTestList"
                  :key="item.subjectId"
                  @click="chooseTestType(item)"
                >{{item.name}}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="test-right flex-1 border-f4 pd-l-20 pd-r-20 pd-t-20 pd-b-20">
          <div class="search bg-fff flex border-f4 border-radius-3">
            <input class="flex-1" v-model="testSearchForm.name" placeholder="请输入试卷名称" />
            <span @click="getTestList">搜索</span>
          </div>
          <div class="m-t-20">
            <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange" :noPaging="false">
              <a-table
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
                :columns="testColumns"
                :scroll="{ x: 800 }"
                :locale="{ emptyText: emptyText }"
                :data-source="testPaperList"
                :rowKey="(record, index) => {return index;}"
                :pagination="false"
              ></a-table>
            </CommonTable>
          </div>
        </div>
      </div>
      <template slot="btn">
        <a-button @click="testCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="testConfirm">确定</a-button>
      </template>
    </CommonModal>
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="cancleSubmit">取消</a-button>
          <a-button type="primary" class="m-r-15" @click="confirmSubmit" :loading="addLoading">提交</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>
<script>
import FormPage from "@/components/commonTpl/formPage.vue";
import UploadCanRemove from '@/components/upload/uploadCanRemove.vue';
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import { GetLecturerAllList, GetCoursewareAllList, InsertCourse, UpdateCourse, GetfileMsgList, GetSubjectlist, CourseDetail, DownLoadCourse } from "@/services/api.js";
import { GetQuestionDataList } from "@/services/questionmodel.js";

import { formValidator } from "@/utils/clx-form-validator.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import dictionary from '@/utils/dictionary'
import { nanoid } from 'nanoid'
import { cloneDeep } from 'lodash'




export default {
  mixins: [teableCenterEllipsis],
  components: {
    UploadCanRemove,
    FormPage,
    FixedBottom
  },
  data() {
    return {
      addLoading: false,
      // 基本信息
      basicInfoForm: {
        patch: undefined,
        cover: undefined
      },
      basicInfoRules: {
        name: [
          { required: true, message: "课件名称不能为空", trigger: "blur" },
        ],
        cover: [
          { required: true, message: "课程封面不能为空", trigger: "change" },
        ],
        patch: [
          { required: true, message: "课程贴片不能为空", trigger: "change" },
        ],
      },
      // 课程信息
      courseInfoForm: {
        moduleList: [],
        lecturerIdList: [],
      },
      courseInfoRules: {
        subjectId: [
          { required: true, message: "科目不能为空", trigger: "change" },
        ],
        moduleList: [
          { required: true, message: "课程模块不能为空", trigger: "change" },
        ],
      },
      moduleVisible: false,
      modalTitle: "",
      addModleForm: {
        coursewareList: []
      },
      addModleFormRules: {
        title: [
          { required: true, message: "模块标题不能为空", trigger: "blur" },
        ],
        coursewareList: [
          { required: true, message: "模块资源不能为空", trigger: "change" },
        ],
        sort: [
          { required: true, text: "模块序号", validator: formValidator.texTonlyNumber, trigger: "blur" },
        ]
      },
      coursewareList: [],
      coursewareListAll: [],
      moduleList: [], // 展示课程模块的table数据
      columns: [ // 课程模块
        {
          title: "模块标题",
          dataIndex: "title",
          key: "title"
        },
        {
          title: "模块描述",
          dataIndex: "description",
          key: "description"
        },
        {
          title: "模块资源",
          scopedSlots: { customRender: "coursewareList" },
          key: "coursewareList"
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right", // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      modelEdit: false, // false新增  true编辑模块表格数据
      subjectList: [], // 科目列表
      subjectTestList: [], // 试卷分类
      fileTypeList: [], // 课件库类型
      lecturerList: [],
      // 排序
      sortForm: {},
      sortRules: {
        sortNo: [
          { required: true, text: "排序序号", validator: formValidator.texTonlyNumber, trigger: "blur" },
        ]
      },
      // 关联试卷 试卷
      testForm: {},
      testVisible: false,
      testColumns: [
        {
          title: "试卷名称",
          dataIndex: "name",
        },
        {
          title: "题目数量",
          dataIndex: "topicNum",
        },
        {
          title: "总分",
          dataIndex: "totalScore",
        }
      ],
      testPaperList: [],
      selectedRowKeys: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      testSearchForm: {},
      chooseTestMsg: {},
      // 上架
      groundingForm: {
        status: 1
      },
      groundingRules: {
        status: [
          { required: true },
        ]
      },
      groundingList: [
        {
          label: "立即上架",
          value: 1
        },
        {
          label: "暂停上架",
          value: 0
        },
      ],

      // 编辑数据
      dataMsg: undefined,
    }
  },
  async created() {
    this.fileTypeList = dictionary("fileType");
    
    if (this.$route.params.dataMsg) {
      this.dataMsg = this.$route.params.dataMsg;
      let result1 = await CourseDetail({ courseId: this.dataMsg.courseId, subjectId: this.dataMsg.subjectId })
      result1.data.lecturerList = result1.data.lecturerList ? result1.data.lecturerList : [];
      for (let i = 0; i < result1.data.lecturerList.length; i++) {
        this.courseInfoForm.lecturerIdList.push(result1.data.lecturerList[i].lecturerId);
      }
      let moduleList = result1.data.moduleList
      for (let i = 0; i < moduleList.length; i++) {
        let coursewareList = [];
        for (let j = 0; j < moduleList[i].coursewareList.length; j++) {
          coursewareList.push(moduleList[i].coursewareList[j].coursewareId);
        }
        this.moduleList.push({
          title: moduleList[i].title,
          description: moduleList[i].description,
          _id: nanoid(),
          sort: moduleList[i].sort,
          coursewareList: coursewareList
        })
      }
      this.dataMsg = { ...this.dataMsg, ...result1.data };
      this.groundingForm.status = this.dataMsg.status;
      console.log(this.dataMsg.corporationId)
      let basicInfoForm = {
        centerId: this.dataMsg.centerId,
        corporationId: this.dataMsg.corporationId,
        name: this.dataMsg.name,
        description: this.dataMsg.description,
      }
      
      this.courseInfoForm.subjectId = this.dataMsg.subjectId;
      this.sortForm.sortNo = this.dataMsg.sortNo;
      let result = await GetfileMsgList([this.dataMsg.patch, this.dataMsg.cover]);
      if (result.data[0]) {
        basicInfoForm.patch = result.data[0].id;
        this.$refs.coursePatch.fileList = [{
          uid: result.data[0].id,
          id: result.data[0].id,
          name: result.data[0].fileName,
          status: 'done',
          url: result.data[0].filePath
        }];
      }
      if (result.data[1]) {
        basicInfoForm.cover = result.data[1].id;
        this.$refs.courseCover.fileList = [{
          uid: result.data[0].id,
          id: result.data[1].id,
          name: result.data[1].fileName,
          status: 'done',
          url: result.data[1].filePath
        }];
      }
      this.getCorSubjectlist(this.dataMsg.corporationId);
      this.getLecturerList(this.dataMsg.corporationId);
      this.getCoursewareList(this.dataMsg.corporationId);
      
      // this.coursewareList = cloneDeep(result3.data);
      if (result1.data.paper) {
        this.testForm.paperId = result1.data.paper[0] ? result1.data.paper[0].paperId : "";
        this.chooseTestMsg = result1.data.paper[0] ? result1.data.paper[0] : {};
        this.getTestList();
      }
      this.$forceUpdate();
      this.basicInfoForm = { ...basicInfoForm }
      this.courseInfoForm = { ...this.courseInfoForm }
      this.sortForm = { ...this.sortForm }
      this.testForm = { ...this.testForm }
      this.groundingForm = { ...this.groundingForm }
      console.log(this.basicInfoForm.corporationId )
    }
  },
  computed: {
    coverLength() {
      return this.$refs.coursePatch.fileList.length
    },
    patchLength() {
      return this.$refs.courseCover.fileList.length
    },
  },
  methods: {
    // 组织变动
    corporationChange(corporationId, deptId) {
      this.$set(this.courseInfoForm, "subjectId", undefined);
      this.$set(this.courseInfoForm, "lecturerIdList", undefined);
      this.$set(this.testForm, "paperId", undefined);
      this.moduleList = [];
      this.sujectList = [];
      this.lecturerList = [];
      this.coursewareListAll = [];
      this.coursewareList = [];
      this.selectedRowKeys = [];
      this.testPaperList = [];
      this.testSearchForm = {};
      this.chooseTestMsg = {};
      if (corporationId) {
        this.getCorSubjectlist(corporationId);
        this.getLecturerList(corporationId);
        this.getCoursewareList(corporationId);
      }
    },
    async getCorSubjectlist(corporationId) {
      try {
        let result1 = await GetSubjectlist({
          corporationId: corporationId
        })
        this.subjectList = result1.data || [];
        this.subjectTestList = [ ...this.subjectList ];
        if (this.subjectList.length == 0) {
          this.$antMessage.warn("该组织下没有课程，请重新选择组织");
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getLecturerList(corporationId) {
      try {
        let result1 = await GetLecturerAllList({
          corporationId: corporationId
        })
        this.lecturerList = result1.data || [];
        if (this.lecturerList.length == 0) {
          this.$antMessage.warn("该组织下没有讲师，请重新选择组织");
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getCoursewareList(corporationId) {
      try {
        let result1 = await GetCoursewareAllList({
          corporationId: corporationId
        })
        this.coursewareListAll = result1.data || [];
        for(let i = 0; i < this.coursewareListAll.length; i++) {
          this.coursewareListAll[i]._id = nanoid();
        }
        this.coursewareList = result1.data || [];
        if (this.coursewareListAll.length == 0) {
          this.$antMessage.warn("该组织没有课件，请重新选择组织");
        }
      } catch (err) {
        console.log(err);
      }
    },
    handleSuccess1() {
      this.basicInfoForm.patch = this.$refs.coursePatch.fileList.length > 0 ? this.$refs.coursePatch.fileList[0].id : "";
      this.basicInfoForm = { ...this.basicInfoForm }
      formValidator.formItemValidate(this.$refs.basicForm, 'patch', 'addForm')
    },
    handleSuccess2() {
      this.basicInfoForm.cover = this.$refs.courseCover.fileList.length > 0 ? this.$refs.courseCover.fileList[0].id : "";
      this.basicInfoForm = { ...this.basicInfoForm }
      formValidator.formItemValidate(this.$refs.basicForm, 'cover', 'addForm')
    },
    cancleSubmit() {
      this.setKeepalive(true)
      this.$router.push({ name: "课程管理" })
    },
    confirmSubmit() {
      console.log(this.basicInfoForm)
      this.basicInfoForm.patch = this.$refs.coursePatch.fileList.length > 0 ? this.$refs.coursePatch.fileList[0].id : "";
      this.basicInfoForm.cover = this.$refs.courseCover.fileList.length > 0 ? this.$refs.courseCover.fileList[0].id : "";
      this.courseInfoForm.moduleList = this.moduleList;
      this.basicInfoForm = { ...this.basicInfoForm }
      this.courseInfoForm = { ...this.courseInfoForm }
      this.sortForm = { ...this.sortForm }
      this.testForm = { ...this.testForm }
      this.groundingForm = { ...this.groundingForm }
      if (!(formValidator.formAll(this.$refs.basicForm, 'addForm') && formValidator.formAll(this.$refs.courseForm, 'addForm') && formValidator.formAll(this.$refs.sortForm, 'addForm'))) {
        return;
      }
      let param = {
        ...this.basicInfoForm,
        ...cloneDeep(this.courseInfoForm),
        ...this.sortForm,
        ...this.testForm,
        ...this.groundingForm,
        format: 1,
        coverUrl: this.$refs.courseCover.fileList[0] ? this.$refs.courseCover.fileList[0].url : ""
      }
      let promiseFn = InsertCourse;
      if (this.$route.params.dataMsg) {
        param.courseId = this.dataMsg.courseId;
        promiseFn = UpdateCourse
      }
      for (let i = 0; i < param.moduleList.length; i++) {
        for (let j = 0; j < param.moduleList[i].coursewareList.length; j++) {
          param.moduleList[i].coursewareList[j] = {
            coursewareId: param.moduleList[i].coursewareList[j],
            sort: j + 1
          }
        }
      }
      this.addLoading = true;
      promiseFn(param).then(res => {
        this.addLoading = false;
        this.$router.push("/ehsGerneralManage/educationmanagement/coursemanagement");
      }).catch((err) => {
        console.log(err);
      })
    },
    addModule() {
      this.modalTitle = "新增模块";
      this.moduleVisible = true;
      this.modelEdit = false;
    },
    addModleCancle() {
      this.moduleVisible = false;
      this.modelEdit = false;
      this.coursewareList = [];
      this.addModleForm = {
        coursewareList: []
      };
    },
    addModleConfirm() {
      if (!formValidator.formAll(this, 'addModleForm')) {
        return;
      }
      if (this.modelEdit) { // 编辑
        for (let i = 0; i < this.moduleList.length; i++) {
          if (this.moduleList[i]._id == this.addModleForm._id) {
            this.moduleList[i] = cloneDeep(this.addModleForm);
            break;
          }
        }
      } else {
        this.moduleList.unshift({
          ...this.addModleForm,
          _id: nanoid()
        });
      }
      this.moduleList.sort((obj1, obj2) => {
        let val1 = obj1.sort;
        let val2 = obj2.sort;
        if (val1 < val2) {
          return 1;
        } else if (val1 > val2) {
          return -1;
        } else {
          return 0;
        }
      })
      this.moduleVisible = false;
      this.modelEdit = false;
      this.coursewareList = [];
      this.addModleForm = {
        coursewareList: []
      };
    },
    actionEdit(item) {
      this.modelEdit = true;
      this.modalTitle = "编辑模块";
      this.addModleForm = cloneDeep(item);
      this.coursewareList = cloneDeep(this.coursewareListAll);
      this.moduleVisible = true;
    },
    actionDelete(item) {
      // 去掉删除那一项
      for (let i = 0; i < this.moduleList.length; i++) {
        if (this.moduleList[i]._id == item._id) {
          this.moduleList.splice(i, 1);
          i--;
        }
      }
    },
    filterOption(inputValue, option) {
      return option.data.key.includes(inputValue)
    },
    relatedTestPaper() {
      if (!this.basicInfoForm.corporationId) {
        this.$antMessage.warn("请先选择组织");
        return;
      }
      this.testVisible = true;
      this.getTestList();
    },
    testCancle() {
      this.testVisible = false;
      this.selectedRowKeys = [];
      this.testPaperList = [];
      this.testSearchForm = {};
    },
    testConfirm() {
      this.testVisible = false;
      this.testForm = {};
      this.testSearchForm = {};
      this.testForm.paperId = this.testPaperList[this.selectedRowKeys[0]].paperId;
      this.chooseTestMsg = this.testPaperList[this.selectedRowKeys[0]]
    },
    // 删除试卷
    deleteTestPaper() {
      this.selectedRowKeys = [];
      this.testPaperList = [];
      this.testForm = {};
    },
    // 重新选择关联试卷
    resetTestPaper() {
      this.testForm = {
        type: this.chooseTestMsg.subjectId,
        paperId: this.chooseTestMsg.paperId
      }

      this.testVisible = true;
      this.getTestList();
    },
    chooseTestType(item) {
      if (item) {
        this.testForm.subjectId = item.subjectId;
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        }
      } else {
        this.testForm = {};
      }
      this.selectedRowKeys = [];
      this.testPaperList = [];
      this.getTestList();
    },
    // 查询试卷分类
    async getSubjectlist() {
      let result1 = await GetSubjectlist({
        ...this.testForm,
        pageNo: "",
        pageSize: "",
        corporationId: this.basicInfoForm.corporationId
      })
      this.subjectTestList = result1.data;
      this.selectedRowKeys = [];
      this.testPaperList = [];
      this.testForm = {};
      this.getTestList(1);
    },
    
    // 获取试卷列表
    getTestList() {
      console.log(this.testForm, this.testSearchForm)
      const params = {
        ...this.testForm,
        ...this.testSearchForm,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        corporationId: this.basicInfoForm.corporationId
      };
      GetQuestionDataList(params)
        .then((res) => {
          this.testPaperList = res.data.list || [];
          this.page.total = res.data.total;
          if (!this.testPaperList.length) {
            this.$antMessage.warn("暂无试卷");
          }
          let index;
          for (let i = 0; i < this.testPaperList.length; i++) {
            if (this.testPaperList[i].paperId == this.chooseTestMsg.paperId) {
              index = i;
              break;
            }
          }
          this.selectedRowKeys = index != undefined ? [index] : [];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 选择试卷改变事件
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getTabList();
    },
    // 字典组每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getTabList();
    },
    findText(arr, key, val) { // key：字段值， val：过滤值
      if (val == 0) val = 0 + "";
      if (!(arr && key && val)) {
        return {};
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] == val) {
          return arr[i]
        }
      }
      return {}
    },
  }
}
</script>
<style lang="less" scoped>
.tip {
  display: flex;
  align-items: center;
  background: #fffbe6;
  border: 1px solid rgba(255, 229, 143, 1);
  border-radius: 2px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-top: 10px;
  padding: 10px 17px 10px 17px;
  line-height: 20px;

  i {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    color: #fff;
    background: #faad14;
    font-size: 10px;
    text-align: center;
    line-height: 16px;
    font-style: normal;
    margin-right: 8px;
  }
}
.module-item {
  .position-abs {
    right: 0;
  }
}
.test-modal {
  /deep/ .ant-modal {
    width: 1000px !important;
  }
  .test-left {
    width: 252px;
    .search {
      padding: 10px;
      line-height: 1;
      position: relative;

      input {
        border: none;
        height: 14px;
        font-size: 14px;
        outline: none;
        padding-right: 48px;
        width: 100%;
      }
      span {
        position: absolute;
        right: 10px;

        display: inline-block;
        width: 38px;
        text-align: right;
        color: #666;
        border-left: 1px solid #dcdcdc;
        flex: none;
      }
    }
    .main {
      .type-list {
        li {
          height: 56px;
          border-top: 1px solid #eee;
        }
      }
    }
  }
  .test-right {
    overflow-x: auto;
    .search {
      padding: 10px;
      line-height: 1;
      position: relative;

      input {
        border: none;
        height: 14px;
        font-size: 14px;
        outline: none;
        padding-right: 48px;
        width: 100%;
      }
      span {
        position: absolute;
        right: 10px;

        display: inline-block;
        width: 38px;
        text-align: right;
        color: #666;
        border-left: 1px solid #dcdcdc;
        flex: none;
      }
    }
  }
}
.test-paper {
  width: 376px;
  & > div {
    &:first-child {
      padding-top: 10px;
    }
  }
  span {
    display: inline-block;
    width: 84px;
    padding: 10px 0;
    text-align: center;
    color: #999;
    background: #fff;
    border-radius: 2px;
  }
}
</style>