<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>试卷管理</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" @corporationChange="corporationChange"></CommonSearchItem>
        <a-form-model-item label="试卷名称">
          <a-input v-model="formInline.name" placeholder="试卷名称搜索" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="科目">
          <a-select v-model="formInline.subjectId" placeholder="请选择" allowClear>
            <a-select-option v-for="item in sujectList" :value="item.subjectId" :key="item.subjectId">{{ item.name }}</a-select-option>
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
          <a-icon type="plus" />新建试卷
        </a-button>
      </div>
    </DashBtn>
    <!-- 字典组列表 -->
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
        <div slot="customTitle">操作</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="jumpLook(record)">查看</span>
          <span class="color-0067cc cursor-pointer" @click="jumpAddOrDetail('change', record)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="deleteDict(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import dragTable from "@/mixin/dragTable.js";
import cancelLoading from "@/mixin/cancelLoading";
import { formValidator } from "@/utils/clx-form-validator.js";
import { debounce } from "lodash";
import {
  GetQuestionDataList,
  DelQuestionDataList,
  SubjectsDataList,
} from "@/services/questionmodel.js";

export default {
  mixins: [teableCenterEllipsis, cancelLoading, dragTable],
  data() {
    return {
      tableSpinning:false,
      // permission: false,
      dictTitle: "批量导入题目",
      labelCol: { span: 6 }, // 设置左边label宽度
      wrapperCol: { span: 18 }, // 设置右边表单宽度
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
        subjectId: undefined,
        name: undefined,
      },
      columns: [
        {
          title: "序号",
          dataIndex: "number",
          key: "number",
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: "试卷名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "试卷题目",
          dataIndex: "topicNum",
          key: "topicNum",
        },
        {
          title: "科目",
          dataIndex: "subjectName",
          key: "subjectName",
        },
        {
          title: "创建人",
          dataIndex: "createUserName",
          key: "createUserName",
        },
        {
          title: "更新时间",
          dataIndex: "updateTime",
          key: "updateTime",
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
      sujectList: [], //科目
    };
  },
  created() {
    this.setRouterCode("examinationPaper");
    this.columns.splice(1, 0, this.addCommonColumnItem());
    this.initConfigPage()
    // this.subjectsDataList(); //试卷分类列表
    this.getTabList(); // 获取列表
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.initConfigPage()
        this.iRest()
      }
    }, 20);
  },
  methods: {
    initConfigPage(){
      sessionStorage.removeItem("savEexamData");
      sessionStorage.removeItem("examPathFrom");
      sessionStorage.removeItem("pathFrom");
      // this.permission=this.canClickBtnMixin("examinationPaper-del")?true:false;
    },
    corporationChange() {
      this.sujectList = [];
      this.subjectsDataList();
    },
    //跳转查看
    jumpLook(record) {
      this.$router.push({
        path: "/ehsGerneralManage/educationmanagement/examinationLook",
        query: { paperId: record.paperId },
      });
    },

    //科目
    subjectsDataList() {
      SubjectsDataList({
        corporationId: this.formInline.corporationId
      })
        .then((res) => {
          this.sujectList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //跳转新增、编辑页面
    jumpAddOrDetail(type, record) {
      sessionStorage.removeItem("examinaObj_xt")
      this.$store.dispatch("examina/getExaminaObj", "ok");

      this.$router.push({
        path: "/ehsGerneralManage/educationmanagement/examinationAOCOne",
        query: { paperId: record ? record.paperId : undefined, type },
      });
    },

    // 获取列表
    getTabList() {
      const params = {
        ...this.formInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      };
      this.tableSpinning = true
      return GetQuestionDataList(params)
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

    // 删除字典组
    deleteDict(record) {
      if (!this.canClickBtnMixin("examinationPaper-del")) {
        return;
      }
      this.$antConfirm({
        title: "是否确定删除？",
        onOk: () => {
          DelQuestionDataList({
            paperId: record.paperId,
          })
            .then((res) => {
              this.$antMessage.success(res.message);
              this.getTabList();
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
        this.sujectList = [];
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.formInline = {
          dictName: "",
          type: null,
          typeT: null,
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
</style>