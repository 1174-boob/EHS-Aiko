<template>
  <!-- 部门 -->
  <div class="department-box clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>部门</PageTitle>
    <!-- 主要区域 -->
    <div class="department-main">
      <!-- 左侧树 -->
      <div class="department-main-left bea_scroll_xt">
        <div class="l-top">
          <span>组织架构</span>
        </div>
        <a-tree
          v-if="treeData.length"
          :replace-fields="{ title: 'name', key: 'id' }"
          :tree-data="treeData"
          @select="selectTree"
          :selectedKeys.sync="selectedKeys"
        />
      </div>

      <!-- 右侧列表 -->
      <div class="department-main-right">
        <!-- 查询 -->
        <!-- 左侧搜索 -->
        <SearchTerm>
          <a-form-model layout="inline" :model="formInline" :colon="false">
            <a-form-model-item label="部门名称">
              <a-input
                class="department-search-left-item"
                :maxLength="nameMaxLength"
                v-model="formInline.name"
                placeholder="请输入部门名称"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item class="float-right">
              <a-button
                type="primary"
                style="margin-right: 15px"
                :loading="loadingTwo"
                @click="iSearch"
                >查询</a-button
              >
              <a-button @click="iRest">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>

        <!-- 创建部门 -->
        <div class="department-apply clx-btn-dashed-box">
          <a-button type="dashed" @click="iAdd" class="clx-btn-margin-right">
            <a-icon type="plus" />创建部门
          </a-button>
          <a-button type="dashed" @click="delall">
            <a-icon type="minus" />批量删除
          </a-button>
        </div>
        <!-- 表格 -->
        <div class="department-table">
          <CommonTable
            :page="page"
            :pageNoChange="pageNoChange"
            :showSizeChange="showSizeChange"
          >
            <a-table
              :columns="columns"
              :locale="{ emptyText: emptyText }"
              :data-source="dataList"
              rowKey="deptId"
              :pagination="false"
              :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
              }"
            >
              <div class="table-btn" slot="action" slot-scope="text, record">
                <span @click="iChange(record)">修改</span>
                <span class="color-0067cc table-btn cursor-pointer" @click="openLabelModel(record)">标签</span>
                <span class="table-btn-rm" @click="iRm(record)">删除</span>
              </div>
            </a-table>
          </CommonTable>
        </div>
      </div>
    </div>
    <CommonModal
      :title="modelTitle"
      :visible="visible"
      :cancelFn="handleCancel"
    >
      <div slot="form">
        <div class="item_fl">
          <a-form-model
            ref="ruleForm"
            :model="formDepartment"
            :rules="rules"
            :label-col="{ style: { width: '80px' } }"
            :wrapper-col="{ style: { width: 'calc(100% - 80px)' } }"
            :colon="false"
          >
            <a-form-model-item ref="code" label="部门编码" prop="code">
              <a-input
                :disabled="disabled"
                :maxLength="6"
                v-model.trim="formDepartment.code"
                placeholder="请输入部门编码"
              />
            </a-form-model-item>
            <a-form-model-item ref="name" label="部门名称" prop="name">
              <a-input
                :maxLength="nameMaxLength"
                v-model.trim="formDepartment.name"
                placeholder="请输入部门名称"
              />
            </a-form-model-item>
            <a-form-model-item ref="sortNo" label="部门序号" prop="sortNo">
              <a-input
                :maxLength="sortNoMaxLength"
                v-model.trim="formDepartment.sortNo"
                placeholder="请输入部门序号"
              />
            </a-form-model-item>
            <!-- <a-form-model-item ref="bossId" label="负责人" prop="bossId"> -->
              <!-- <a-select
                v-model="formDepartment.bossId"
                placeholder="请选择负责人"
                show-search
                :filter-option="filterOption"
              >
                <a-select-option
                  v-for="item in allUserList"
                  :key="item.userId"
                  :value="item.userId"
                  >{{ item.namePhone }}</a-select-option
                >
              </a-select> -->
              <staffOrDept 
                :treeType="'user'" 
                :treeRoles="rules" 
                :labelTitle="'负责人'" 
                :checkAbel="true"
                :propKey="'bossId'" 
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 20 }" 
                :checkedTreeNode="sendBossId"
                @getTreeData="getUserTreeData"
              />
              <staffOrDept 
                :treeType="'user'" 
                :labelTitle="'第二负责人'" 
                :checkAbel="false"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 20 }" 
                :checkedTreeNode="sendSecondBossId"
                @getTreeData="getUserTreeData"
              />
            <!-- </a-form-model-item> -->
            <!-- <a-form-model-item ref="parentId" label="上级部门" prop="parentId"> -->
              <!-- <a-tree-select
                v-if="treeData.length"
                v-model="formDepartment.parentId"
                style="width: 100%"
                :dropdown-style="{
                  maxHeight: '400px',
                  overflow: 'auto',
                  zIndex: 9999,
                }"
                :tree-data="treeData"
                placeholder="请选择上级部门"
                :replace-fields="{ title: 'name', key: 'id', value: 'id' }"
              ></a-tree-select> -->
              <staffOrDept 
                :treeType="'dept'" 
                :treeRoles="rules" 
                :labelTitle="'上级部门'" 
                :checkAbel="false"
                :propKey="'parentId'" 
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 20 }"
                :checkedTreeNode="sendParentId"
                @getTreeData="getTreeData"
              />
            <!-- </a-form-model-item> -->
            <a-form-model-item
              ref="description"
              label="部门描述"
              prop="description"
            >
              <a-textarea
                :maxLength="descriptionMaxLength"
                v-model="formDepartment.description"
                placeholder="请输入部门描述"
              />
            </a-form-model-item>
            <a-form-model-item
              v-if="formDepartment.createTime"
              class="department-box-createTime"
              ref="description"
              label="创建时间"
              prop="description"
            >
              <span>{{ formDepartment.createTime }}</span>
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>

      <div slot="btn">
        <a-button type="dashed" @click="handleCancel">取消</a-button>
        <a-button
          type="primary"
          style="margin-left: 0.2rem"
          :loading="loading"
          @click="onSubmitFrom"
          >提交</a-button
        >
      </div>
    </CommonModal>

    <!-- 标签弹窗 -->
    <LabelModel v-model="labelModelShow" :labelModelData="labelModelData"  @getTableList="getTableList" />
  </div>
</template>

<script>
import {
  getDepartmentList,
  getDepartmentTree,
  addDepartmentItem,
  changeDepartmentItem,
  getDepartmentDetails,
  rmDepartmentItem,
  rmDepartmentItemAll,
  SynchronousDept,
  getAllUserByCompanyId,
  GetDepartCode,
} from "@/services/company.js";
import LabelModel from './components/labelModel.vue'
import treeMixin from "@/mixin/tree";
import fromMaxLength from "@/mixin/fromMaxLength";
import { formValidator } from "@/utils/clx-form-validator.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import teableSelected from "@/mixin/teableSelected";
import cancelLoading from "@/mixin/cancelLoading";
import { cloneDeep, debounce } from "lodash";
import staffOrDept from "@/components/staffOrDept";
export default {
  components: {
    staffOrDept,
    LabelModel
  },
  mixins: [
    treeMixin,
    fromMaxLength,
    teableCenterEllipsis,
    teableSelected,
    cancelLoading,
  ],
  data() {
    return {
      disabled:false,
      labelModelShow: false,
      //负责人列表
      treeDataPerson: [],
      //负责人
      defaultCheckedKeysTop: [],
      // 弹窗显示
      visible: false,
      // 按钮loading
      loading: false,
      // 搜索表单
      formInline: {
        name: "",
      },
      // 页码
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        {
          title: "部门编码",
          dataIndex: "code",
          key: "code",
        },
        {
          title: "部门名称",
          dataIndex: "name",
          key: "name",
          customRender: (text) => {
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "上级部门",
          dataIndex: "parentName",
          key: "parentName",
          customRender: (text) => {
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "负责人",
          dataIndex: "bossName",
          key: "bossName",
          customRender: (text) => {
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "第二负责人",
          dataIndex: "deputyDirectorName",
          key: "deputyDirectorName",
          customRender: (text) => {
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "描述",
          dataIndex: "description",
          key: "description",
          customRender: (text) => {
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          dataIndex: "action",
          title: "操作",
          width: 150,
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataList: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      // 新增、修改表单
      formDepartment: {
        parentId: undefined,
        name: "",
        description: "",
        createTime: "",
        sortNo: "",
        bossId: undefined,
        deputyDirectorId: undefined,
      },
      // 表单验证
      rules: {
        code: [
          {
            required: true,
            validator: formValidator.onlyNumber,
            trigger: "blur",
            text: "部门编码",
          },
        ],
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
        parentId: [
          { required: true, message: "请选择上级部门", trigger: "change" },
        ],
        description: [
          { required: true, message: "请输入部门描述", trigger: "blur" },
        ],
        sortNo: [
          {
            required: true,
            validator: formValidator.texTonlyNumber,
            trigger: "blur",
            text: "序号",
          },
        ],
        bossId: [
          { required: true, message: "请选择负责人", trigger: "change" },
        ],
        chuangjianshijian: [
          { required: true, message: "请输入创建时间", trigger: "change" },
        ]
      },
      // 关联策略树
      treeData: [],
      selectedKeys: [],
      selectedKeysOld: [],
      // 新增、查看、修改 标识
      btnType: 1,
      companyId: null,
      companyName: "",
      // 所有可选择为负责人的用户
      allUserList: [],
      labelModelData: undefined,
      sendParentId: [],
      sendBossId: [],
      sendSecondBossId: []
    };
  },
  created() {
    this.companyId = JSON.parse(
      sessionStorage.getItem("zconsole_userInfo")
    ).company.companyId;
    this.companyName = JSON.parse(
      sessionStorage.getItem("zconsole_userInfo")
    ).company.companyName;
  },
  mounted() {
    // 获取组织架构-树结构
    this.getEnterpriseTreeFn();
  },
  computed: {
    modelTitle() {
      return this.typeEnum[this.btnType] + "部门";
    },
  },
  methods: {
    // 标签-弹窗
    openLabelModel(row) {
      this.labelModelData = row
      this.labelModelShow = true
    },
    // 获取负责人选择列表
    getAllUserByCompanyIdFn() {
      return getAllUserByCompanyId().then((res) => {
        let allUserList = res.data ? res.data : [];
        // 过滤已冻结
        allUserList = allUserList.filter((item) => {
          return item.status != 2;
        });
        allUserList.forEach((item) => {
          item.namePhone = `${item.phone}（${item.name}${
            item.jobNumber ? "：" + item.jobNumber : ""
          }）`;
        });
        this.allUserList = cloneDeep(allUserList);
        return res;
      });
    },
    // 负责人搜索筛选功能
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    //批量删除
    async delall() {
      if (this.canClickBtnMixin("department-2")) {
        if (this.selectedRowKeys.length) {
          this.$antConfirm({
            title: "删除",
            content: "是否要批量删除？",
            okText: "确认",
            cancelText: "取消",
            maskClosable: false,
            onOk: async () => {
              let result = await rmDepartmentItemAll({
                ids: this.selectedRowKeys,
              });
              if (result.code == "20000") {
                this.getEnterpriseTreeFn();
                this.getTableList();
                this.$message.success("删除成功");
                this.selectedRowKeys = [];
              }
            },
          });
        } else {
          this.$message.info("请先选择一条数据");
        }
      }
    },
    // 数据同步
    dataSync: debounce(
      function () {
        SynchronousDept()
          .then((res) => {
            if (res.code == "20000") {
              this.$message.success("同步成功");
            }
          })
          .catch((err) => {});
      },
      250,
      { leading: true, trailing: false }
    ),
    // 选择组织架构的某一项
    selectTree(selectedKeys) {
      if (selectedKeys.length === 0) {
        this.selectedKeys = this.selectedKeysOld;
      } else {
        this.selectedKeysOld = this.selectedKeys;
        // 获取列表
        this.getTableList();
      }
    },
    // 获取组织架构-树结构
    getEnterpriseTreeFn() {
      let apiData = {
        companyId: this.companyId,
        companyName: this.companyName,
      };
      return getDepartmentTree(apiData)
        .then((res) => {
          this.treeData = [res.data];
          this.selectedKeys = this.treeData.length ? [this.treeData[0].id] : [];
          this.selectedKeysOld = this.treeData.length
            ? [this.treeData[0].id]
            : [];
          // 获取列表
          this.getTableList();
        })
        .catch((err) => {});
    },
    // 获取列表
    getTableList() {
      let deptId = this.selectedKeys.length ? this.selectedKeys[0] : "-1";
      let selObj = { ...this.formInline };
      // id = selObj.name ? "-1" : id;
      let postData = { deptId, companyId: this.companyId, ...this.page, ...selObj };
      return getDepartmentList(postData)
        .then((res) => {
          let { list: dataList, total } = res.data
            ? res.data
            : { list: [], total: 0 };
          this.dataList = dataList ? dataList : [];
          this.page.total = total;
          // 处理页码 问题
          if (
            this.dataList.length === 0 &&
            (this.page.pageNo !== 1 || this.page.total !== 0)
          ) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .catch((err) => {});
    },
    // 验证表单
    onSubmitFrom() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return;
        this.onSubmit();
      });
    },
    // 提交
    onSubmit() {
      this.loading = true;
      let apiData = { ...this.formDepartment, companyId: this.companyId };
      if (apiData.deptId) {
        changeDepartmentItem(apiData)
          .then((res) => {
            this.$message.success("修改成功");
            // 获取列表
            this.getTableList();
            this.getEnterpriseTreeFn();
            // 关闭model
            this.handleCancel();
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
          });
      } else {
        addDepartmentItem(apiData)
          .then((res) => {
            this.$message.success("新增成功");
            // 获取列表
            this.getTableList();
            this.getEnterpriseTreeFn();
            // 关闭model
            this.handleCancel();
            this.loading = false;
          })
          .catch((err) => {
            this.loading = false;
          });
      }
    },
    // 关闭model
    handleCancel() {
      this.visible = false;
      this.disabled = false,
      this.defaultCheckedKeysTop = [];
    },
    // 打开弹窗
    openModel() {
      this.visible = true;
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getTableList();
    },
    //改变每页条数事件
    showSizeChange(pageNo, pageSize) {
      this.page.pageNo = pageNo;
      this.page.pageSize = pageSize;
      //获取列表
      this.getTableList();
    },
    // 查询
    iSearch() {
      this.handleLoadingTwo();
      // 获取列表
      this.getTableList().finally(() => {
        this.cancelLoadingTwo();
      });
    },
    // 重置
    iRest: debounce(
      function () {
        this.formInline = { name: "" };
        this.getTableList();
      },
      250,
      { leading: true, trailing: false }
    ),
    iAdd() {
      if (this.canClickBtnMixin("department-1")) {
        this.getAllUserByCompanyIdFn()
          .then((res) => {
            //获取默认部门编码
            // GetDepartCode().then((res) => {
              // if (res.data) {
                // this.formDepartment.code = res.data;
                this.btnType = 1;
                this.sendParentId = [];
                this.sendBossId = [];
                this.sendSecondBossId = [];
                this.openModel();
              // }
            // });
          })
          .catch(() => {});
      }
    },
    // 获取详情
    getRoleItemDetailsFn(apiData) {
      return getDepartmentDetails(apiData)
        .then((res) => {
          let {
            deptId,
            parentId,
            name,
            description,
            createTime,
            sortNo,
            bossId,
            deputyDirectorId,
            code,
          } = res.data;
          this.formDepartment = {
            deptId,
            parentId,
            name,
            description,
            createTime,
            sortNo,
            bossId,
            deputyDirectorId,
            code,
          };
          this.sendParentId = [this.formDepartment.parentId]
          this.sendBossId = [this.formDepartment.bossId]
          this.sendSecondBossId = [this.formDepartment.deputyDirectorId]
        })
        .catch((err) => {});
    },
    // 修改
    iChange(item) {
      this.disabled = true
      if (this.canClickBtnMixin("department-1")) {
        let apiData = { id: item.deptId };
        Promise.all([
          this.getRoleItemDetailsFn(apiData),
          // this.getAllUserByCompanyIdFn(),
        ])
          .then((res) => {
            this.btnType = 3;
            this.openModel();
          })
          .catch((err) => {});
      }
    },
    // 删除
    iRm(row) {
      if (this.canClickBtnMixin("department-2")) {
        let postData = {
          deptId: row.deptId,
        };
        this.$antConfirm({
          title: "删除",
          icon: () => (
            <a-icon type="delete" class="confirm-icon-rm" theme="filled" />
          ),
          content: "确定删除该部门吗？",
          cancelText: "取消",
          onOk: () => {
            rmDepartmentItem(postData)
              .then((res) => {
                this.$message.success("删除成功");
                this.getTableList();
              })
              .catch((err) => {});
          },
        });
      }
    },
    getTreeData(data) {
      if(data.treeNameAndCodeList.length > 0) {
        this.formDepartment.parentId = data.treeNameAndCodeList[0].id;
      }
      if (!formValidator.formItemValidate(this, "parentId", "ruleForm")) {
        return;
      }
    },
    getUserTreeData(data) {
      if(data.treeNameAndCodeList.length > 0) {
        this.formDepartment.bossId = data.treeNameAndCodeList[0].id;
        this.formDepartment.deputyDirectorId = data.treeNameAndCodeList[0].id;
      }
      if (!formValidator.formItemValidate(this, "bossId", "ruleForm")) {
        return;
      }
    },
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        this.formDepartment = {
          parentId: undefined,
          name: "",
          description: "",
          createTime: "",
          sortNo: "",
          bossId: undefined,
          deputyDirectorId: undefined,
        };
      }
    },
    value(value) {},
  },
};
</script>

<style lang="less" scoped>
.department-box {
  display: flex;
  flex-direction: column;
  // 内容区域
  .department-main {
    height: 100%;
    display: flex;
    flex: 1;
    .department-main-left {
      width: 3.6rem;
      margin-right: 20px;
      background: #fff;
      padding: 0.2rem;
      overflow-y: auto;

      background: rgba(250, 250, 250, 0.5);
      border: 1px solid #f4f4f4;
      // border: 1px solid #ccc;
      box-sizing: border-box;
      .l-top {
        justify-content: space-between;
        align-items: center;
        padding-bottom: 0.19rem;
        border-bottom: solid #ccc 1px;
        margin-bottom: 0.2rem;
        span {
          font-size: 18px;
          color: #181818;
          font-weight: bold;
        }
      }
    }
    .department-main-right {
      flex: 1;
      // 查询
      .department-search {
        padding: 27px 22px 11px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 100%;
        background: rgba(250, 250, 250, 0.5);
        border: 1px solid #f4f4f4;
        border-radius: 2px;
        .department-search-left-item-box {
          .ant-form-item-children {
            display: flex;
            align-items: center;
          }
          .department-search-left-item-selct {
            width: 100px;
            margin-right: 10px;
          }
          .department-search-left-item {
            width: 220px;
          }
        }
        .department-search-left {
          .ant-form-item {
            margin-bottom: 16px !important;
          }
        }
        .department-search-right {
          margin-bottom: 16px !important;
        }
      }
      // 创建部门
      .department-apply {
        margin: 0.2rem 0;
        button {
          span {
            font-size: 0.16rem;
          }
        }
      }

      .department-table {
        .table-status {
          i {
            display: inline-block;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            margin-right: 5px;
            vertical-align: middle;
          }
        }
        .table-btn {
          display: flex;
          align-items: center;
          justify-content: space-around;
          & > span {
            cursor: pointer;
            color: #0067cc;
          }
          .table-btn-rm {
            color: #dd000d;
          }
        }
      }
    }
  }
}
.item_fl {
  .ant-form > ::v-deep .ant-row {
    display: flex !important;
  }
}
.department-box-createTime {
  display: flex;
  align-items: center;
}
.clx-model-body {
  .relation-tree-title {
    display: flex;
    .relation-tree-title-all {
      & > span {
        color: #0067cc;
      }
      margin-right: 20px;
    }
    .relation-tree-title-sel {
      & > span {
        color: #0067cc;
      }
    }
  }
}
</style>
