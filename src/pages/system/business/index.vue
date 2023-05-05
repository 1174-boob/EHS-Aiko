<template>
  <!-- 业务组织管理 -->
  <div class="role-console-box clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>业务组织管理</PageTitle>
      <!-- 主要区域 -->
      <div>
        <!-- 搜索框 -->
        <SearchTerm>
          <div class="role-console-search-left">
            <a-form-model layout="inline" :model="formInline" :colon="false">
              <a-form-model-item style="width: 358px" label="业务层级">
                <a-select style="width:200px" v-model="formInline.orgLevel" placeholder="请选择业务层级">
                  <a-select-option style="width:200px" :key="index" :value="item.itemCode" v-for="(item, index) in orgLevelList">{{item.itemName}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item style="width: 358px" label="上级业务组织">
                <a-input
                  class="role-console-search-left-item"
                  v-model="formInline.parentName"
                  placeholder="请输入上级业务组织"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item style="width: 358px" label="业务组织简称">
                <a-input
                  class="role-console-search-left-item"
                  :maxLength="nameMaxLength"
                  v-model="formInline.orgName"
                  placeholder="请输入业务组织简称"
                ></a-input>
              </a-form-model-item>
              <div class="float-right">
                <a-button type="primary" :loading="loadingTwo" @click="iSearch"
                  >查询</a-button
                >
                <a-button style="margin-left:16px" @click="iRest">重置</a-button>
              </div>
            </a-form-model>
          </div>
        </SearchTerm>
        <!-- 新增组织 -->
        <div class="role-console-apply clx-btn-dashed-box">
          <a-button type="dashed" @click="addConsoleRole">
            <a-icon type="plus" />新增组织
          </a-button>
        </div>
        <!-- 表格 -->
        <div class="role-console-table">
          <CommonTable
            :page="page"
            :pageNoChange="pageNoChange"
            :showSizeChange="showSizeChange"
          >
            <a-table
              :columns="columns"
              :locale="{ emptyText: emptyText }"
              :data-source="dataList"
              rowKey="orgId"
              :pagination="false"
            >
              <div slot="orgLevel" slot-scope="text">
                <span>{{getDictionaryItemObj("orgLevel", text)}}</span>
              </div>
              <div class="table-btn" slot="action" slot-scope="text, record">
                <span @click="modelDeptTree(record)">关联组织</span>
                <span @click="changeConsoleRole(record)">编辑</span>
                <span @click="rmConsoleRoleFn(record)" class="table-btn-rm"
                  >删除</span
                >
              </div>
            </a-table>
          </CommonTable>
        </div>
      </div>
    <!-- 获取关联组织功能 -->
    <CommonModal
      :title="'关联组织'"
      :visible="deptTreeVisible"
      :cancelFn="closeDeptModel"
    >
      <template slot="form">
        <a-form-model
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <!-- <a-form-model-item label="关联组织" prop="deptIds"> -->
            <dept-tree
              :placeholder="'请选择关联组织'" 
              v-model="formInlineDeptId" 
              :propKey="'deptIds'" 
              :multiple="true" 
              allowClear
            />
          <!-- </a-form-model-item> -->
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button type="dashed" :loading="loading" @click="closeDeptModel">取消</a-button>
        <a-button
          type="primary"
          style="margin-left: 0.2rem"
          :loading="loading"
          @click="deptTreeSubmit"
          >提交</a-button
        >
      </template>
    </CommonModal>
    <!-- 新增、编辑业务组织弹窗 -->
    <CommonModal
      :title="modelTitle"
      :visible="roleModelShow"
      :cancelFn="closeModel"
    >
      <template slot="form">
        <a-form-model
          ref="ruleForm"
          :model="formData"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="业务组织编号" prop="orgCode">
            <a-input
              :maxLength="10"
              :disabled="InpDis"
              v-model="formData.orgCode"
              placeholder="请输入数字，最多不要超过10位"
            />
          </a-form-model-item>
          <a-form-model-item label="业务组织简称" prop="orgName">
            <a-input 
              v-model="formData.orgName" 
              :maxLength="20"
              placeholder="请输入业务组织简称"/>
          </a-form-model-item>
          <a-form-model-item label="业务层级" prop="orgLevel">
            <a-select v-model="formData.orgLevel" placeholder="请选择业务层级">
              <a-select-option :key="index" :value="item.itemCode" v-for="(item, index) in orgLevelList">{{item.itemName}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <!-- <orgTreeModal 
            v-model="formData.parentOrgIds" 
            :orgTreeTitle="formData" 
            :treeRoles="rules" 
            :labelTitle="'上级业务组织'" 
            :propKey="'parentOrgIds'" 
            @getTreeData="getTreeData"
          /> -->
          <a-form-model-item label="上级业务组织" prop="parentOrgIds">
            <a-select mode="multiple" v-model="formData.parentOrgIds" placeholder="请选择上级业务组织">
              <a-select-opt-group  label="现地">
                <a-select-option :key="index" v-for="(item, index) in companyList" :value="item.orgId">
                  {{ item.orgName }}
                </a-select-option>
              </a-select-opt-group>
              <a-select-opt-group label="事业">
                <a-select-option :key="index" v-for="(item, index) in causeList" :value="item.orgId">
                  {{ item.orgName }}
                </a-select-option>
              </a-select-opt-group>
              <a-select-opt-group label="中心">
                <a-select-option :key="index" v-for="(item, index) in centerList" :value="item.orgId">
                  {{ item.orgName }}
                </a-select-option>
              </a-select-opt-group>
            </a-select>
          </a-form-model-item>
          <!-- <a-form-model-item label="关联组织" prop="deptIds"> -->
            <dept-tree
              :labelTitle="'关联组织'" 
              :placeholder="'请选择关联组织'" 
              v-model="formData.deptIds" 
              :propKey="'deptIds'" 
              :multiple="true" 
              allowClear
            />
          <!-- </a-form-model-item> -->

          <staffOrDept 
            v-model="formData.bossId" 
            :treeType="'user'" 
            :labelTitle="'负责人'" 
            :checkAbel="false"
            :propKey="'bossId'" 
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20 }" 
            :checkedTreeNode="sendBossId"
            @getTreeData="getUserTreeData"
          />

          <a-form-model-item label="业务组织描述" prop="description">
            <a-input 
              :maxLength="30"
              v-model="formData.description" 
              placeholder="请输入业务组织描述" />
          </a-form-model-item>

          <a-form-model-item label="标签" prop="orgLabelList">
            <!-- <a-cascader
              :fieldNames="{ label: 'labelName', value: 'labelCode', children: 'labelItemList' }"
              :default-value="formData.orgLabelList"
              :options="options"
              multiple
              placeholder="请选择标签"
              @change="onLabelChange"
            />  -->
            <a-tree-select
              v-model="formData.orgLabelList"
              style="width: 100%"
              :tree-data="options"
              tree-checkable
              placeholder="请选择标签"
              :replaceFields="replaceFields"
              @change="onLabelChange"
            />
          </a-form-model-item>

          <a-form-model-item label="业务组织全称" prop="orgAllName">
            <a-input 
              :maxLength="50"
              v-model="formData.orgAllName" 
              placeholder="请输入业务组织全称" />
          </a-form-model-item>
          
          <a-form-model-item label="业务组织地址" prop="addressList">
            <a-cascader
              v-model="formData.addressList"
              :options="city"
              placeholder="请输入业务组织地址"
            />
          </a-form-model-item>
          <a-form-model-item label="详细地址" prop="addressDetail">
            <a-input 
              :maxLength="100"
              v-model="formData.addressDetail" 
              placeholder="请输入详细地址" />
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button type="dashed" :loading="loading" @click="closeModel"
          >取消</a-button
        >
        <a-button
          type="primary"
          style="margin-left: 0.2rem"
          :loading="loading"
          @click="onSubmit"
          >提交</a-button
        >
      </template>
    </CommonModal>

  </div>
</template>

<script>
import {
  GetOrgPageList,
  AddOrg,
  UpdateOrg,
  DelOrg,
  GetOrgDetail,
  GetOrgGroup,
  BindDept,
} from "@/services/business.js";
import { GetLabelList } from "@/services/api";
import getDictionaryItemObj from "@/utils/dictionary";
import fromMaxLength from "@/mixin/fromMaxLength";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import { debounce } from "lodash";
import { formValidator } from "@/utils/clx-form-validator.js";
import staffOrDept from "@/components/staffOrDept";
// import orgTreeModal from "@/components/orgTreeModal";
import deptTree from "@/components/deptTree";
import city from "@/components/company/cities.js";
export default {
  mixins: [fromMaxLength, teableCenterEllipsis, cancelLoading],
  components: {
    staffOrDept,
    deptTree,
    // orgTreeModal
  },
  data() {
    return {
      city,
      labelCol: { span: 4 },
      getDictionaryItemObj,
      wrapperCol: { span: 20 },
      // 新增、修改表单
      formData: {
        orgCode: "",
        orgName: "",
        orgLevel: undefined,
        deptIds: [],
        description: "",
        orgLabelList:[],
        orgAllName: "",
        addressList: [],
        addressDetail: '',
        bossId: undefined,
        parentOrgIds: [],
        parentName:'',
        parentOrgId: '',
        parentOrgName: '',
      },
      options: [],
      selectedKeys: [],
      // 关联策略树
      treeData: [],
      companyId: null,
      searchTreeList: [],
      companyList: [],
      causeList: [],
      centerList: [],
      // 表单验证
      rules: {
        orgCode: [
          {
            required: true,
            validator: formValidator.onlyNumber,
            trigger: "blur",
            message: "业务组织编号保存后不可再次编辑，请谨慎填写",
          },
        ],
        orgName: [
          { 
            required: true,
            message: "业务组织简称不能为空",
            trigger: "blur" 
          },
        ],
        orgLevel: [
          { 
            required: true,
            message: "业务层级不能为空",
            trigger: "blur" 
          },
        ],
        parentOrgIds: [
          { 
            required: true,
            message: "上级业务组织不能为空",
            trigger: "blur",
            type: 'array'
          },
        ],
        deptIds: [
          { 
            required: true,
            message: "关联组织不能为空",
            trigger: "blur",
            type: 'array'
          },
        ],
        description: [
          {
            trigger: "blur",
            text: "业务组织描述",
          },
        ],
        orgAllName: [
          {
            trigger: "blur",
            text: "业务组织描述",
          },
        ],
        addressList: [
          {
            trigger: "blur",
            text: "业务组织描述",
            type: 'array'
          },
        ],
      },
      // 弹窗model-显示隐藏
      roleModelShow: false,
      // 搜索表单
      formInline: {
        orgName: undefined,
        orgLevel: undefined,
        parentName: ""
      },
      // 页码
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        {
          title: "业务组织简称",
          dataIndex: "orgName",
          key: "orgName",
        },
        {
          title: "业务组织编号",
          dataIndex: "orgCode",
          key: "orgCode",
        },
        {
          title: "业务层级",
          dataIndex: "orgLevel",
          key: "orgLevel",
          scopedSlots: { customRender: "orgLevel" }
        },
        {
          title: "上级业务组织",
          dataIndex: "parentOrgName",
          key: "parentOrgName",
        },
        {
          title: "负责人",
          dataIndex: "bossName",
          key: "bossName",
        },
        {
          title: "标签",
          dataIndex: "orgLabelName",
          key: "orgLabelName",
        },
        {
          title: "业务组织全称",
          dataIndex: "orgAllName",
          key: "orgAllName",
        },
        {
          title: "业务组织地址",
          dataIndex: "addressAll",
          key: "addressAll",
        },
        {
          title: "描述",
          dataIndex: "description",
          key: "description",
        },
        {
          dataIndex: "action",
          title: "操作",
          width: 180,
          scopedSlots: { customRender: "action" },
        },
      ],
      dataList: [],
      //编辑时禁用输入框
      InpDis: false,
      //弹窗title
      modelTitle: "",
      //编辑时存储的id
      // 标签组id
      orgId: "",
      sendParentId: [],
      sendDeptId: [],
      sendBossId: [],
      formInlineDeptId: [],
      deptTreeVisible: false,
      orgLevelList: [],
      modelDeptTreeData: {},
      replaceFields: { title: 'labelName', value:'labelCode', key: 'labelId', children: 'labelItemList'},
    };
  },
  created() {
    this.orgLevelList = getDictionaryItemObj('orgLevel');
    this.companyId = JSON.parse(
      sessionStorage.getItem("zconsole_userInfo")
    ).company.companyId;
    this.companyName = JSON.parse(
      sessionStorage.getItem("zconsole_userInfo")
    ).company.companyName;
    this.getTableList();
    // 获取组织架构-树结构
    // this.getEnterpriseTreeFn();
  },
  methods: {
    modelDeptTree(data) {
      this.modelDeptTreeData = data;
      // this.formInlineDeptId = this.modelDeptTreeData
      this.deptTreeVisible = true;
    },
    // 获取列表
    getLableList() {
      let postData = {
        ...this.page,
        ...this.formInline,
      };
      return GetLabelList(postData)
        .then((res) => {
          // let { list: options, total } = res.data
          //   ? res.data
          //   : { list: [], total: 0 };
          this.options = res.data ? res.data : [];
          // this.page.total = total;
        })
        .catch((err) => {});
    },
    onLabelChange(value, label, extra){
      this.formData.orgLabelList = value;
    },
    // 获取列表
    getTableList() {
      let parentId = this.selectedKeys.length ? this.selectedKeys[0] : "-1";
      let postData = {
        ...this.page,
        ...this.formInline,
        parentId, companyId: this.companyId,
      };
      return GetOrgPageList(postData)
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
    // 选择组织架构的某一项
    // selectTree(selectedKeys) {
    //   if (selectedKeys.length === 0) {
    //     this.selectedKeys = this.selectedKeysOld;
    //   } else {
    //     this.selectedKeysOld = this.selectedKeys;
    //     // 获取列表
    //     this.getTableList();
    //   }
    // },
    // 获取组织架构-树结构
    // getEnterpriseTreeFn() {
    //   let apiData = {
    //     companyId: this.companyId,
    //     companyName: this.companyName,
    //   };
    //   return GetOrgTree(apiData)
    //     .then((res) => {
    //       this.treeData = [res.data];
    //       this.selectedKeys = this.treeData.length ? [this.treeData[0].id] : [];
    //       this.selectedKeysOld = this.treeData.length
    //         ? [this.treeData[0].id]
    //         : [];
    //       // 获取列表
    //       this.getTableList();
    //     })
    //     .catch((err) => {});
    // },


    // 获取全部组织信息
    getOrgGroupFn() {
      return GetOrgGroup().then((res) => {
        this.searchTreeList = res.data;
        this.companyList = this.searchTreeList.company
        this.causeList = this.searchTreeList.cause
        this.centerList = this.searchTreeList.center
      }).catch((err) => {
        console.log(err);
      });
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
        this.formInline = { orgName: undefined, orgLevel: undefined, parentName: ""}  ;
        this.getTableList();
      },
      250,
      { leading: true, trailing: false }
    ),
    // 新增
    addConsoleRole(res) {
      // 获取标签组列表
      this.getLableList();
      this.roleModelData = {
        companyId: this.companyId,
      };
      this.sendBossId = [];
      this.sendParentId = [];
      this.sendDeptId = [];
      this.formData.orgCode = res.data
      this.modelTitle = "新增组织";   
      this.InpDis = false;
      this.roleModelShow = true;
      this.getOrgGroupFn()
    },
    // 获取详情
    getRoleItemDetailsFn(apiData) {
      return GetOrgDetail(apiData)
        .then((res) => {
          let {
            deptIds,
            parentOrgIds,
            parentOrgId,
            parentName,
            parentOrgName,
            addressList,
            orgName,
            description,
            orgLevel,
            orgLabelList,
            bossId,
            orgAllName,
            orgCode,
            addressDetail,
          } = res.data;
          this.formData = {
            deptIds,
            parentOrgIds,
            parentOrgId,
            parentName,
            parentOrgName,
            addressList,
            orgName,
            description,
            orgLevel,
            orgLabelList,
            bossId,
            orgAllName,
            orgCode,
            addressDetail
          };
          this.sendParentId = [this.formData.parentOrgId]
          this.sendDeptId = [this.formData.deptIds]
          this.sendBossId = [this.formData.bossId]
        })
        .catch((err) => {});
    },
    // 修改
    changeConsoleRole(item) {
      // 获取标签组列表
      this.getLableList();
      this.getOrgGroupFn()
      this.orgId = item.orgId;
      let apiData = { orgId: item.orgId };
      Promise.all([
        this.getRoleItemDetailsFn(apiData),
      ]).then(()=>{
        this.InpDis = true;
        this.modelTitle = "编辑组织";
        this.roleModelShow = true;
      })
    },
    
    // 删除
    rmConsoleRoleFn(row) {
      let postData = {
        orgId: row.orgId,
      };
      this.$confirm({
        title: "确定删除？",
        icon: () => (
          <a-icon type="delete" class="confirm-icon-rm" theme="filled" />
        ),
        content: "确认删除该组织？",
        cancelText: "取消",
        onOk: () => {
          DelOrg(postData)
            .then((res) => {
              this.$message.success("删除成功");
              this.getTableList();
            })
            .catch((err) => {});
        },
      });
    },
    //提交
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return;
        let obj = {
          ...this.formData,
          orgId: this.modelTitle == "新增组织" ? undefined : this.orgId,
          companyId: this.companyId 
        };
        if (this.modelTitle == "新增组织") {
          //新增
          AddOrg(obj)
            .then((res) => {
              this.getTableList();
              // this.getEnterpriseTreeFn();
              this.getOrgGroupFn()
              this.$message.success("新增成功");
              this.closeModel();
            })
            .catch(() => {});
        } else {
          UpdateOrg(obj)
            .then((res) => {
              this.getTableList();
              // this.getEnterpriseTreeFn();
              this.getOrgGroupFn()
              this.$message.success("修改成功");
              this.closeModel();
            })
            .catch(() => {});
        }
      });
    },
    // 关联组织提交
    deptTreeSubmit() {
      let params = {
        orgId: this.modelDeptTreeData.orgId,
        deptIds: this.formInlineDeptId,
      };
      return BindDept(params).then((res) => {
        this.$message.success(res.message);
        this.closeDeptModel()
      }).catch((err) => {});
    },
    //关闭弹窗
    closeModel() {
      this.roleModelShow = false;
      this.formData={
        orgCode: "",
        orgName: "",
        orgLevel: undefined,
        description: "",
        orgLabelList: [],
        orgAllName: "",
        addressList: [],
        deptIds: []
      }
    },
    closeDeptModel() {
      this.deptTreeVisible = false;
    },
    // 获取上级组织
    getTreeData(data) {
      if(data.treeModel.length > 0) {
        this.formData.parentOrgId = data.treeModel[0];
        this.formData.parentOrgName = data.treeName;
      }
      if (!formValidator.formItemValidate(this, "parentOrgId", "ruleForm")) {
        return;
      }
    },
    // 获取负责人组织
    getUserTreeData(data) {
      if(data.treeNameAndCodeList.length > 0) {
        this.formData.bossId = data.treeNameAndCodeList[0].id;
      }
      if (!formValidator.formItemValidate(this, "bossId", "ruleForm")) {
        return;
      }
    },
    
  },
};
</script>

<style lang="less" scoped>
.role-console-box {
  // title
  .role-console-title {
    font-size: 20px;
    font-weight: 400;
    color: #333333;
    margin: 15px 30px 15px 0;
  }
  // 新增组织
  .role-console-apply {
    margin: 20px 0;
    button {
      span {
        font-size: 0.16rem;
      }
    }
  }
  .role-console-table {
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
    .table-pagination {
      display: flex;
      margin: 15px 15px;
      justify-content: flex-end;
      align-items: center;
      .table-pagination-totel {
        margin-left: 15px;
        & > span {
          color: #0065c8;
        }
      }
    }
  }
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

::v-deep .ant-form-item {
  width: 600px;
}
::v-deep .ant-form-item-label {
  width: 100px;
}
::v-deep .ant-select-selection{
  width: 100% !important;
}

</style>
