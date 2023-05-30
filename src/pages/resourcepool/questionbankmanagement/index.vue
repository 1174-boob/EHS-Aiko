<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>题库管理</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" @corporationChange="corporationSearchChange"></CommonSearchItem>
        <a-form-model-item label="题干">
          <a-input v-model="formInline.topicTitle" placeholder="支持题干模糊搜索" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="题型">
          <a-select v-model="formInline.topicType" placeholder="请选择" allowClear>
            <a-select-option value="1">单选题</a-select-option>
            <a-select-option value="2">多选题</a-select-option>
            <a-select-option value="3">判断题</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="题目分类">
          <a-select v-model="formInline.sujectId" placeholder="请选择" allowClear>
            <a-select-option v-for="item in searchSubject" :value="item.subjectId" :key="item.subjectId">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="jumpAddOrDetail('add')">
          <a-icon type="plus" />新增题目
        </a-button>
        <a-button type="dashed" @click="addDict">
          <a-icon type="plus" />批量导入
        </a-button>
      </div>
    </DashBtn>
    <!--表格列表 -->
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{ emptyText: emptyText }"
        :data-source="dictList"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
        :pagination="false"
      >
      <template slot="topicTitle" slot-scope="record">
        <span v-html="record.topicTitle"></span>
      </template>
        <div slot="customTitle">操作</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="jumpAddOrDetail('change', record)">编辑</span>
          <!-- <span class="color-0067cc cursor-pointer" @click="copy(record)"
            >复制</span
          >-->
          <span class="color-ff4d4f cursor-pointer" @click="delDataList(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
    <!-- 批量导入弹框 -->
    <CommonModal :title="dictTitle" :visible="visible" :cancelFn="cancelFn">
      <template slot="form">
        <!-- <div>第一步</div> -->
        <a-form-model ref="dictForm" :model="dictForm" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" labelAlign="left" :rules="dictFormRules">
          <a-form-model-item label="第一步">
            <div class="top_div_marginDiv">下载模板填写并上传文件</div>
            <div class="addSuccess cursor-pointer" @click="downloadTemplate">下载模板</div>
          </a-form-model-item>
          <a-form-model-item label="第二步" prop="file">
            <div class="top_div_marginDiv">按照模版格式填写后上传Excel文件</div>
            <UploadEhs @handleSuccess="handleSuccess" :fileLists="fileLists"></UploadEhs>
          </a-form-model-item>
          <a-form-model-item label="第三步" prop="file">
            <div class="top_div_marginDiv">选择组织</div>
            <a-select v-model="dictForm.corporationId" placeholder="请选择组织" @change="corporationChange">
              <a-select-option v-for="item of getCommonAddOrgnizeList" :key="item.id" :value="item.id">{{item.orgAbbrName}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="第四步" prop="subjectId">
            <div class="top_div_marginDiv">选择题目分类</div>
            <a-select v-model="dictForm.sujectId" placeholder="请选择" allowClear>
              <a-select-option v-for="item in sujectList" :value="item.subjectId" :key="item.subjectId">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
        <div class="note_div">
          <p class="bg-250">注：题目导入顺序请按照文档题型从左到右的顺序导入（如下步骤）</p>
          <p>单选题 → 多选题 → 判断题</p>
        </div>
      </template>
      <template slot="btn">
        <a-button @click="visible = false">取消</a-button>
        <a-button class="m-l-15" type="primary" :loading="dictLoading" @click="submitDict">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dragTable from "@/mixin/dragTable.js";
import { formValidator } from "@/utils/clx-form-validator.js";
import { debounce } from "lodash";
import {
  GetDataList,
  DelDataList,
  CopylDataList,
  SubjectsDataList,
  SubjectsUpload,
} from "@/services/questionmodel.js";
import UploadEhs from "@/components/upload/uploadEhsNoInterFace.vue";
import serviceNameList from "@/config/default/service.config.js";
import { get, post } from "@/utils/request.js";

export default {
  mixins: [teableCenterEllipsis, cancelLoading, dragTable],
  components: { UploadEhs },
  data() {
    return {
      tableSpinning:false,
      // action: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.course}/api/course/topic/upload`,
      // permission: false,
      dictLoading: false,
      searchSubject: [],
      fileLists: [],
      visible: false,
      dictTitle: "批量导入题目",
      labelCol: { span: 4 }, // 设置左边label宽度
      wrapperCol: { span: 18 }, // 设置右边表单宽度
      dictFormRules: {},
      dictForm: {
        file: [],
        sujectId: undefined,
      },
      itemForm: {
        dictValue: "", //字典标签
        dictLabel: "", //字典项名称
        dictSort: "", //排序号
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formInline: {
        topicTitle: undefined,
        topicType: undefined,
        sujectId: undefined,
      },
      columns: [
        {
          title: "序号",
          dataIndex: "number",
          key: "number",
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: "题干",
          // dataIndex: "topicTitle",
          // key: "topicTitle",
          scopedSlots: { customRender: "topicTitle" },
        },
        {
          title: "题型",
          dataIndex: "topicType",
          key: "topicType",
          customRender: (text, record, index) => {
            return text == 1 ? "单选题" : text == 2 ? "多选题" : "判断题";
          },
        },
        {
          title: "题目分类",
          dataIndex: "sujectName",
          key: "sujectName",
        },
        {
          title: "创建人",
          dataIndex: "phone",
          key: "phone",
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime",
        },
        {
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right", // 固定操作列
          width: 300, // 宽度根据操作自定义设置
        },
      ],
      dictList: [],
      sujectList: [], //科目列表
    };
  },

  created() { 
    this.setRouterCode("questionbankmanagement");
    this.columns.splice(0, 0, this.addCommonColumnItem(150));
    this.getTabList(); // 获取列表
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.iRest()
      }
    }, 20);
  },
  methods: {
    // 搜索条件组织变动
    corporationSearchChange(corporationId, deptId) {
      this.$set(this.formInline, "subjectId", undefined);
      this.searchSubject = [];
      if (corporationId) {
        this.getSubjectSearchlist(corporationId);
      }
    },
    corporationChange(corporationId, deptId) {
      this.$set(this.dictForm, "sujectId", undefined);
      this.$set(this.dictForm, "centerId", this.getMappingValue(this.getCommonAddOrgnizeList, "id", corporationId).centerId);
      this.sujectList = [];
      if (corporationId) {
        SubjectsDataList({corporationId}).then((res) => {
          this.sujectList = res.data || [];
        }).catch((err) => {
          console.log(err);
        })
      }
    },
    getSubjectSearchlist(corporationId, flag) {
      let para = {}
      if (corporationId) {
        para.corporationId = corporationId;
      }
      SubjectsDataList(para).then((res) => {
        this.searchSubject = res.data || [];
      }).catch((err) => {
        console.log(err);
      })
    },
    // 获取列表
    getTabList() {
      const params = {
        ...this.formInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      };
      this.tableSpinning = true
      GetDataList(params)
        .then((res) => {
          this.cancelLoading(100);
          this.dictList = res.data.list;
          this.page.total = res.data.total;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(()=>{
          this.tableSpinning = false
        })
    },
    downloadTemplate() {
      window.open(
        window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/试题导入模板.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/试题导入模板.xlsx`
      );
    },
    //批量上传
    handleSuccess(fileList) {
      this.dictForm.file = fileList;
    },

    //跳转新增、编辑页面
    jumpAddOrDetail(type, record) {
      let query = {};
      if (record) {
        query = { type, topicId: record.topicId };
      } else {
        query = { type };
      }
      this.$router.push({
        path: "/ehsGerneralManage/educationmanagement/questionbankManagementAOC",
        query,
      });
    },

    //复制
    copy(record) {
      CopylDataList({ topicId: record.topicId })
        .then((res) => {
          this.$antMessage.success(res.message);
          this.getTabList();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 删除
    delDataList(record) {
      let _this = this;
      if (!this.canClickBtnMixin("questionbankmanagement-del")) {
        return;
      }
      this.$antConfirm({
        title: "确定删除吗?",
        onOk() {
          DelDataList({ topicId: record.topicId })
            .then((res) => {
              _this.$antMessage.success(res.message);
              _this.getTabList();
            })
            .catch((err) => {
              console.log(err);
            });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },

    // 打开弹框
    addDict() {
      this.dictForm = {
        file: [],
        sujectId: undefined,
      },
      this.visible = true;
    },

    // 关闭弹框
    cancelFn() {
      this.visible = false;
    },

    // 提交
    submitDict() {
      if (!this.dictForm.file.length) {
        return this.$antMessage.info("请先上传文件");
      }
      if (!this.dictForm.sujectId) {
        return this.$antMessage.info("请先选择题目分类");
      }
      this.dictLoading = true;
      let fromData = new FormData();
      fromData.append("file", this.dictForm.file[0]);
      fromData.append("centerId", this.dictForm.centerId);
      fromData.append("corporationId", this.dictForm.corporationId);
      fromData.append("subjectId", this.dictForm.sujectId);
      post(
        `${serviceNameList.course}/api/course/topic/upload`,
        fromData
      ).then((res) => {
        this.getTabList();
        this.$antMessage.success("导入成功");
        this.dictLoading = false;
        this.cancelFn();
      }).catch(err=>{
        this.dictLoading = false;
      });
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

    // 查询
    iSearch() {
      this.handleLoading();
      this.getTabList();
    },

    // 重置
    iRest: debounce(
      function () {
        this.$refs.commonSearchItem.reset();
        this.searchSubject = [];
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.formInline = {
          topicTitle: "",
          topicType: undefined,
          sujectId: undefined,
        };
        this.getTabList();
      },
      250,
      { leading: true, trailing: false }
    ),
  },
};
</script>

<style scoped lang='less'>
.table-dialog {
  ::v-deep .ant-modal-header {
    margin-bottom: 20px !important;
  }
  ::v-deep .ant-modal-body {
    .clx-model-body {
      padding: 0 30px !important;
      .model-content {
        padding: 0;
      }
    }
  }
}
.top_div_marginDiv {
  margin-bottom: 15px;
}
</style>