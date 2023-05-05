<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>
      {{subjectName}}
      <p class="edit-date">创建时间：{{$route.query.createTime}}</p>
    </PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item class="flex" label="状态" prop="state">
          <a-select v-model="formInline.status" placeholder="请选择状态">
            <a-select-option v-for="item in statusList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="科目名称">
          <a-input v-model="formInline.name" placeholder="请输入科目名称"></a-input>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <h3 class="count-subject">课程共({{this.page.total}}门)</h3>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="status" slot-scope="record">
          <span>{{findText(statusList, "key", record.status).value}}</span>
        </div>

        <!-- <div slot="headStatus" slot-scope="record">
          <span>{{findValue(2, record.headStatus)}}</span>
        </div>-->
      </a-table>
    </CommonTable>
    <!-- 弹框 -->
    <CommonModal title="添加课程" :visible="addVisible" :cancelFn="addCancle">
      <!-- <a-input v-model="addForm.name" placeholder="请输入科目名称" />
      <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>-->
      <a-input-search style="margin-bottom: 8px" placeholder="请输入课程名称" @search="handleSearch" />
      <!-- <a-tabs default-active-key="1" @change="handleTabs">
                <a-tab-pane key="1" tab="视频">
                </a-tab-pane>
                <a-tab-pane key="2" tab="音频"></a-tab-pane>
                <a-tab-pane key="3" tab="图文"></a-tab-pane>
      </a-tabs>-->
      <div style="width:100%">
        <a-checkbox-group @change="handleSelectC">
          <a-row>
            <a-col :span="24">
              <div v-for="item in allDataList" :key="item.courseId">
                <!-- <template v-if="item.type==tabsKey"> -->
                <template v-if="!item.type">
                  <a-checkbox :value="item.courseId">{{item.name}}</a-checkbox>
                </template>
              </div>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </div>

      <template slot="btn">
        <a-button @click="addCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="addConfirm">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import { findText } from "@/utils/common.js";
import uploadCanRemove from "@/mixin/uploadCanRemoveHaslimit";
import { debounce } from "lodash";
import {
  getContentModel,
  UpdateCourse,
  updateCourses
} from "@/services/api.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading, uploadCanRemove],
  props: {},
  // components: {
  //   UploadCanRemove
  // },
  data() {
    return {
      tableSpinning:false,
      formInline: {},
      preFormInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      detailVisible: false,
      currentMsg: {},

      // My data
      //添加科目验证
      editForm: {},
      editVisible: false,
      addVisible: false,
      addForm: {},
      editSubjectForm: {},
      addSubjectRules: {
        name: [
          {
            required: true,
            message: "科目名不能为空",
            trigger: "blur"
          }
        ],
        state: [
          {
            required: true,
            message: "请选择状态",
            trigger: "blur"
          }
        ]
      },
      editText: "",
      columns: [
        {
          title: "课程",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "创建人",
          dataIndex: "createUserName",
          key: "createUserName"
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          key: "createTime"
        },
        {
          title: "状态",
          scopedSlots: { customRender: "status" },
          key: "status"
        },
      ],
      tableDataList: [],
      subjectName: "",
      statusList: [
        {
          key: "1",
          value: "已上架"
        },
        {
          key: "0",
          value: "未上架"
        }
      ],
      searchCourseName: null,
      allDataList: null,
      selectList: null,
      tabsKey: "1"
    };
  },
  created() {
    console.log(this.$route.query);
    this.setRouterCode("subjectContent");
    this.subjectName = this.$route.query.name;
    this.getDataList();
  },
  methods: {
    findText,
    getDataList() {
      let params = {
        ...this.preFormInline,
        ...this.page,
        subjectId: this.$route.query.subjectId
      };
      // return getUserPageList(params).then((res) => {
      let res = {
        data: {
          list: [
            {
              name: "课程一",
              fileType: "mp4",
              state: "已上架"
            },
            {
              name: "课程二",
              fileType: "文件",
              state: "已上架"
            },
            {
              name: "课程三",
              fileType: "视频",
              state: "已上架"
            }
          ],
          total: 1
        }
      };
      this.tableSpinning = true
      return getContentModel(params)
      .then(res => {
        console.log(res);
        this.tableDataList = res.data.list;
        this.page.total = res.data.total;
      })
      .finally(()=>{
        this.tableSpinning = false
      })

      // }).catch((err) => {
      //   console.log(err);
      // })
    },
    // 查询
    iSearch() {
      console.log(this.formInline);
      this.preFormInline = { ...this.formInline };
      // 获取列表
      this.getDataList().finally(() => {
        this.cancelLoading();
      });
    },
    // 重置
    iRest: debounce(
      function () {
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0
        };
        this.formInline = {};
        this.preFormInline = {};
        this.getDataList();
      },
      250,
      { leading: true, trailing: false }
    ),
    //获取所有的课程
    getAllDataList() {
      let params = {
        name: this.searchCourseName,
        pageNo: 1,
        pageSize: 100
      };
      getContentModel(params).then(res => {
        console.log(res);
        this.allDataList = res.data.list;
      });
    },
    handleSelectC(e) {
      console.log(e);
      this.selectList = e;
    },
    handleSearch(e) {
      console.log(e);
      this.searchCourseName = e;
      this.getAllDataList();
    },
    //选择Tabs
    handleTabs(e) {
      console.log(e);
      this.tabsKey = e;
    },

    // 编辑弹框按钮事件
    editCancle() {
      this.editVisible = false;
      this.editForm = {};
    },

    addCancle() {
      this.addVisible = false;
    },
    addConfirm() {
      updateCourses({
        subjectId: this.$route.query.subjectId,
        courseId: this.selectList
      }).then(res => {
        this.$antMessage.success("添加成功！");
        this.getDataList();
        this.addVisible = false;
      });
    },

    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      console.log(this.page);
      // 获取列表
      this.getDataList();
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageSize = pageSize;
      this.getDataList();
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ td {
  .ant-select {
    width: 100%;
  }
}
.edit-date {
  font-size: 12px;
  padding-top: 20px;
  color: #7e7979;
}
.count-subject {
}
</style>