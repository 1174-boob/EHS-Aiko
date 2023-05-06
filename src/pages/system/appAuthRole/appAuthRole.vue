<template>
  <!-- 应用角色管理 -->
  <div class="app-auth-rolebox clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>应用角色管理</PageTitle>
    <!-- 主要区域 -->
    <div class="app-auth-rolemain">
      <!-- 左侧树 -->
      <div class="app-auth-rolemain-left">
        <div class="left-title">
          <span class="left-title-text" :title="selAppAuthItem.productName">{{selAppAuthItem.productName}}</span>
          <span class="left-title-add-btn" @click="addRole">+ 新增角色</span>
        </div>
        <!-- 列表 -->
        <ul class="app-auth-rolemain-left-list">
          <li :class="item.active?'left-list-item-active':''" v-for="item in appAuthRoleList" :key="item.roleId" @click="selAppAuthRoleListItem(item)">
            <div class="rule-name">{{item.roleName}}</div>
            <a-popover v-model="item.popoverShow" placement="leftTop" overlayClassName="rule-name-btn-tip-box">
              <ul slot="content" class="rule-name-btn-tip">
                <li @click="changeRole(item)">编辑角色</li>
                <li @click="rmRole(item)">删除角色</li>
              </ul>
              <div class="rule-name-btn">
                <span>...</span>
              </div>
            </a-popover>
          </li>
        </ul>
      </div>

      <!-- 右侧列表 -->
      <div class="app-auth-rolemain-right">
        <!-- 查询 -->
        <!-- 左侧搜索 -->
        <SearchTerm>
          <a-form-model layout="inline" :model="formInline" :colon="false">
            <a-form-model-item label="姓名">
              <a-input class="app-auth-rolesearch-left-item" :maxLength="nameMaxLength" v-model="formInline.name" placeholder="请输入姓名"></a-input>
            </a-form-model-item>
            <a-form-model-item label="工号">
              <a-input class="app-auth-rolesearch-left-item" :maxLength="nameMaxLength" v-model="formInline.userNo" placeholder="请输入工号"></a-input>
            </a-form-model-item>
            <a-form-model-item label="手机号">
              <a-input class="app-auth-rolesearch-left-item" :maxLength="phoneMaxLength" v-model="formInline.phone" placeholder="请输入手机号"></a-input>
            </a-form-model-item>
            <a-form-model-item class="float-right">
              <a-button type="primary" style="margin-right: 15px" :loading="loadingTwo" @click="iSearch">查询</a-button>
              <a-button @click="iRest">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>

        <!-- 授权用户 -->
        <div class="app-auth-roleapply clx-btn-dashed-box">
          <a-button type="dashed" @click="openGrantModel" class="clx-btn-margin-right">授权用户</a-button>
        </div>
        <!-- 表格 -->
        <div class="app-auth-roletable">
          <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
            <a-table :columns="columns" :locale="{ emptyText: emptyText }" :data-source="dataList" rowKey="userId" :pagination="false">
              <div class="table-btn" slot="action" slot-scope="text, record">
                <span class="table-btn-rm" @click="rmUser(record)">删除</span>
              </div>
            </a-table>
          </CommonTable>
        </div>
      </div>
    </div>
    <!-- 授权用户弹窗 -->
    <GrantModel
      v-model="grantModelShow"
      :grantModelTreeData="grantModelTreeData"
      :dataList="dataList"
      :grantModelDefaultValue="grantModelDefaultValue"
      :selRole="selRole"
      :selAppAuthItem="selAppAuthItem"
      @getTableList="getTableList"
    />
    <!-- 角色弹窗 -->
    <RoleModel
      v-model="roleModelShow"
      :roleModelData="roleModelData"
      :roleModeltree="roleModeltree"
      @getAppAuthRoleListFn="getAppAuthRoleListFn"
      :appAuthRoleList="appAuthRoleList"
      :resourceIdListAll="resourceIdListAll"
    />
  </div>
</template>

<script>
import { getAppAuthRoleList, getGrantTreeList, getAppAuthRoleUserList, getAppAuthRoleDetail, rmAppAuthRole, getGrantModelTreeData, rmGrantUser, } from "@/services/api";
import treeMixin from "@/mixin/tree";
import fromMaxLength from "@/mixin/fromMaxLength";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import teableSelected from "@/mixin/teableSelected";
import cancelLoading from "@/mixin/cancelLoading";
import { debounce, cloneDeep } from "lodash";
import { clxTools } from "@/utils/clx-tools";
import GrantModel from './components/grantModel.vue'
import RoleModel from './components/roleModel.vue'
export default {
  components: { GrantModel, RoleModel },
  mixins: [
    treeMixin,
    fromMaxLength,
    teableCenterEllipsis,
    teableSelected,
    cancelLoading,
  ],
  data() {
    return {
      // 角色弹窗model-显示隐藏
      roleModelShow: false,
      // 角色弹窗model-表单信息
      roleModelData: null,
      // 修改时所有角色权限
      resourceIdListAll: [],
      // 角色权限树
      roleModeltree: [
        {
          resourceName: '0-0',
          resourceId: '0-0',
          children: [
            {
              resourceName: '0-0-0',
              resourceId: '0-0-0',
              children: [
                { resourceName: '0-0-0-0', resourceId: '0-0-0-0' },
                { resourceName: '0-0-0-1', resourceId: '0-0-0-1' },
                { resourceName: '0-0-0-2', resourceId: '0-0-0-2' },
              ],
            },
          ],
        },
        {
          resourceName: '0-2',
          resourceId: '0-2',
        },
      ],
      // 授权用户弹窗model-显示隐藏
      grantModelShow: false,
      // 授权用户弹窗model-下拉树
      grantModelTreeData: [],
      // 授权用户弹窗model-默认选择项
      grantModelDefaultValue: [],
      // 上页面选择的应用信息
      selAppAuthItem: {
        productName: '',
      },
      // 左侧-角色列表信息
      appAuthRoleList: [],
      // 搜索表单
      formInline: {
        name: undefined,
        phone: undefined,
        userNo: undefined,
      },
      // 页码
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        {
          title: "手机号",
          dataIndex: "phone",
          key: "phone",
        },
        {
          title: "工号",
          dataIndex: "userNo",
          key: "userNo",
        },
        {
          title: "姓名",
          dataIndex: "name",
          key: "name",
        },
        {
          dataIndex: "action",
          title: "操作",
          width: 120,
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      dataList: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      // 表单
      form: {
        deptIds: undefined,
      },
      // 表单验证
      rules: {
        deptIds: [
          {
            required: true,
            message: "添加权限的用户不能为空",
            trigger: "change",
          },
        ],
      },
      companyId: null,
    };
  },
  created() {
    let console_appAuthRole = clxTools.hasRouteParams(this, "console_appAuthRole")
    this.selAppAuthItem = (console_appAuthRole && console_appAuthRole.appAuthRole) ? console_appAuthRole.appAuthRole : this.selAppAuthItem
    let zconsole_userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
    this.companyId = (zconsole_userInfo && zconsole_userInfo.company && zconsole_userInfo.company.companyId) ? zconsole_userInfo.company.companyId : undefined
    // 获取角色列表
    this.getAppAuthRoleListFn()
    // 获取当前产品的菜单权限树
    this.getGrantModelTree()
  },
  computed: {
    // 选择的角色
    selRole() {
      let selRole = this.appAuthRoleList.filter(item => {
        return item.active
      })
      return selRole.length ? selRole[0] : null
    }
  },
  methods: {
    // 获取角色列表
    getAppAuthRoleListFn(isInit = true) {
      let apiData = { companyId: this.companyId, productId: this.selAppAuthItem.productId }
      getAppAuthRoleList(apiData)
        .then(res => {
          let appAuthRoleList = res.data
          // 是否需要初始化
          if (isInit) {
            appAuthRoleList.forEach((item, index) => {
              item.active = index == 0
              item.popoverShow = false
            })
            this.appAuthRoleList = cloneDeep(appAuthRoleList)
            if (this.appAuthRoleList.length) {
              // 获取用户列表
              this.getTableList()
            }
          } else {
            appAuthRoleList.forEach(item => {
              item.active = item.roleId == this.selRole.roleId
              item.popoverShow = false
            })
            this.appAuthRoleList = cloneDeep(appAuthRoleList)
          }
        })
        .catch(err => { })
    },
    // 选中角色
    selAppAuthRoleListItem(item) {
      if (item.active) {
        return
      }
      this.appAuthRoleList.forEach(item1 => {
        item1.active = item1.roleId == item.roleId
      })
      // 获取用户列表
      this.getTableList()
    },
    // 获取列表
    getTableList() {
      let roleId = this.selRole ? this.selRole.roleId : undefined;
      let apiData = { roleId, productId: this.selAppAuthItem.productId, ...this.page, ...this.formInline };
      return getAppAuthRoleUserList(apiData)
        .then((res) => {
          let { list: dataList, total } = res.data ? res.data : { list: [], total: 0 };
          this.dataList = dataList ? dataList : [];
          this.page.total = total;
          // 处理页码 问题
          if (this.dataList.length === 0 && (this.page.pageNo !== 1 || this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .catch(err => {
          
        });
    },
    // 获取当前产品的菜单权限树
    getGrantModelTree() {
      let apiData = { productId: this.selAppAuthItem.productId }
      return getGrantTreeList(apiData)
        .then(res => {
          this.roleModeltree = res.data
          return res
        })
        .catch(err => { })
    },
    // 打开授权用户弹窗
    openGrantModel: debounce(function () {
      if (this.appAuthRoleList.length == 0) {
        this.$message.warn('请先新增角色，再添加授权用户')
        return
      }
      this.grantModelShow = true
      // 获取授权用户时可选择的用户列表
      // this.getGrantModelTreeDataFn()
      //   .then(res => {
      //     this.grantModelShow = true
      //   })
      //   .catch(err => { })
    }, 250, { leading: true, trailing: false }),
    // 获取授权用户时可选择的用户列表
    getGrantModelTreeDataFn() {
      let roleId = this.selRole ? this.selRole.roleId : undefined;
      let apiData = { roleId, productId: this.selAppAuthItem.productId, };
      return getGrantModelTreeData(apiData)
        .then((res) => {
          let grantModelTreeData = res.data ? res.data : []
          grantModelTreeData.forEach(item => {
            item.namePhone = (item.name ? item.name : '') + item.phone
          })
          this.grantModelTreeData = cloneDeep(grantModelTreeData)
        })
        .catch(err => {
          
        });
    },
    // 新增角色
    addRole() {
      // 获取当前产品的菜单权限树
      this.getGrantModelTree()
        .then(res => {
          this.roleModelData = {
            companyId: this.companyId,
            productId: this.selAppAuthItem.productId,
            productName: this.selAppAuthItem.productName,
            roleCode: "",
            roleName: "",
            description: "",
            resourceIdList: [],
          }
          this.roleModelShow = true
        })
    },
    // 修改角色
    changeRole: debounce(function (item) {
      let apiData = { roleId: item.roleId }
      getAppAuthRoleDetail(apiData)
        .then(res => {
          let resourceIdList = clxTools.recursionArr(res.data.resourceTreeList, "resourceId");
          // 获取所有id集合，并找出与仅子集数组的不同项
          this.resourceIdListAll = clxTools.recursionArr(res.data.resourceTreeList, "resourceId", 'children', true);
          this.roleModelData = {
            companyId: this.companyId,
            productId: this.selAppAuthItem.productId,
            roleId: item.roleId,
            productName: this.selAppAuthItem.productName,
            roleCode: res.data.roleCode,
            roleName: res.data.roleName,
            description: res.data.description,
            resourceIdList: resourceIdList,
          }
          item.popoverShow = false
          this.roleModelShow = true
        })
    }, 250, { leading: true, trailing: false }),
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
    iRest: debounce(function () {
      this.formInline = {
        name: undefined,
        phone: undefined,
        userNo: undefined,
      };
      this.getTableList();
    }, 250, { leading: true, trailing: false }),
    // 删除角色
    rmRole(item) {
      item.popoverShow = false
      let apiData = {
        roleId: item.roleId,
      };
      this.$confirm({
        title: "确定删除?",
        icon: () => <a-icon type="delete" class="confirm-icon-rm" theme="filled" />,
        content: "确定后所有被赋予该角色的用户将失去对应的功能权限",
        cancelText: "取消",
        onOk: () => {
          rmAppAuthRole(apiData)
            .then((res) => {
              this.$message.success("删除成功");
              // 获取角色列表
              this.getAppAuthRoleListFn(item.active);
            })
            .catch((err) => { });
        },
      });
    },
    // 删除用户
    rmUser(row) {
      let roleId = this.selRole ? this.selRole.roleId : undefined;
      let apiData = {
        roleId,
        userId: row.userId,
        productId: this.selAppAuthItem.productId,
      };
      this.$confirm({
        title: "删除",
        icon: () => <a-icon type="delete" class="confirm-icon-rm" theme="filled" />,
        content: "确定删除该用户的角色权限？",
        cancelText: "取消",
        onOk: () => {
          rmGrantUser(apiData)
            .then((res) => {
              this.$message.success("删除成功");
              this.getTableList();
            })
            .catch((err) => { });
        },
      });
    },
  },
  watch: {
  },
};
</script>

<style lang="less" scoped>
.app-auth-rolebox {
  display: flex;
  flex-direction: column;
  // 内容区域
  .app-auth-rolemain {
    display: flex;
    flex: 1;
    .app-auth-rolemain-left {
      width: 342px;
      margin-right: 20px;
      background: #fff;
      padding: 20px;
      overflow-y: auto;
      background: rgba(250, 250, 250, 0.5);
      border: 1px solid #f4f4f4;
      box-sizing: border-box;
      .left-title {
        justify-content: space-between;
        align-items: center;
        padding-bottom: 19px;
        border-bottom: 1px solid #e7e7e7;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        .left-title-text {
          flex: 1;
          font-size: 18px;
          color: #333333;
          font-weight: bold;
          /*这里要显示的设置宽度*/
          overflow: hidden;
          white-space: nowrap;
          /*文字超出宽度则显示ellipsis省略号*/
          text-overflow: ellipsis;
        }
        .left-title-add-btn {
          flex: none;
          font-size: 14px;
          color: #0067cc;
          cursor: pointer;
        }
      }
      .app-auth-rolemain-left-list {
        & > li {
          display: flex;
          align-items: center;
          width: 100%;
          height: 42px;
          border-radius: 4px;
          margin: 0 auto;
          font-size: 14px;
          padding: 0 8px 0 20px;
          cursor: pointer;
          color: #333;
          .rule-name {
            flex: 1;
            /*这里要显示的设置宽度*/
            overflow: hidden;
            white-space: nowrap;
            /*文字超出宽度则显示ellipsis省略号*/
            text-overflow: ellipsis;
          }
          .rule-name-btn {
            flex: none;
            width: 16px;
            margin-left: 18px;
            font-size: 24px;
            & > span {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              transform: rotate(90deg);
            }
          }
        }
        .left-list-item-active {
          background: #f1f4ff;
          color: #0067cc;
        }
      }
    }
    .app-auth-rolemain-right {
      flex: 1;
      // 查询
      .app-auth-rolesearch {
        padding: 27px 22px 11px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        width: 100%;
        background: rgba(250, 250, 250, 0.5);
        border: 1px solid #f4f4f4;
        border-radius: 2px;
        .app-auth-rolesearch-left-item-box {
          .ant-form-item-children {
            display: flex;
            align-items: center;
          }
          .app-auth-rolesearch-left-item-selct {
            width: 100px;
            margin-right: 10px;
          }
          .app-auth-rolesearch-left-item {
            width: 220px;
          }
        }
        .app-auth-rolesearch-left {
          .ant-form-item {
            margin-bottom: 16px !important;
          }
        }
        .app-auth-rolesearch-right {
          margin-bottom: 16px !important;
        }
      }
      // 创建部门
      .app-auth-roleapply {
        margin: 20px 0;
        button {
          span {
            font-size: 16px;
          }
        }
      }

      .app-auth-roletable {
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
  }
}
.rule-name-btn-tip-box {
  .rule-name-btn-tip {
    & > li {
      font-size: 14px;
      color: #000;
      font-weight: 400;
      padding-bottom: 12px;
      text-align: center;
      border-bottom: 1px solid #efefef;
      cursor: pointer;
      &:hover {
        color: #0067cc;
      }
      &:last-child {
        padding: 12px 0 0;
        border-bottom: 0px solid #efefef;
      }
    }
  }
  .ant-popover-arrow {
    display: none !important;
  }
}

.app-auth-rolebox-createTime {
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
<style lang="less">
// 隐藏ant-popover箭头
.rule-name-btn-tip-box {
  .ant-popover-arrow {
    display: none !important;
  }
}
</style>
