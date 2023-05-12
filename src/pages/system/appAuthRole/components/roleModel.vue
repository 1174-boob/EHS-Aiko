<template>
  <!-- 角色弹窗 -->
  <CommonModal :title="modelTitle" :visible="roleModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formRole" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="roleCode" label="角色编码" prop="roleCode">
          <a-input :disabled="formRole.roleId?true:false" :maxLength="nameMaxLength" v-model="formRole.roleCode" placeholder="请输入角色编码" />
        </a-form-model-item>
        <a-form-model-item ref="roleName" label="角色名称" prop="roleName">
          <a-input :maxLength="codeMaxLength" v-model="formRole.roleName" placeholder="请输入角色名称" />
        </a-form-model-item>
        <a-form-model-item ref="description" label="角色描述" prop="description">
          <a-textarea :maxLength="descriptionMaxLength" v-model="formRole.description" placeholder="请输入角色描述" />
        </a-form-model-item>
        <a-form-model-item ref="resourceIdList" label="角色权限" prop="resourceIdList">
          <a-tree
            v-if="roleModelShow"
            v-model="formRole.resourceIdList"
            :selectable="false"
            :defaultExpandAll="false"
            checkable
            :replace-fields="{ title: 'resourceName', key: 'resourceId' }"
            :tree-data="roleModeltree"
            @check="onCheck"
          />
        </a-form-model-item>
      </a-form-model>
    </template>
    <template slot="btn">
      <a-button type="dashed" :loading="loading" @click="closeModel">取消</a-button>
      <a-button type="primary" style="margin-left: 0.2rem" :loading="loading" @click="onSubmit">提交</a-button>
    </template>
  </CommonModal>
</template>

<script>
import { addAppAuthRole, changeAppAuthRole, } from "@/services/api";
import treeMixin from "@/mixin/tree";
import fromMaxLength from "@/mixin/fromMaxLength";
import cancelLoading from "@/mixin/cancelLoading";
// 自定义表单验证的class类
import { formValidator } from "@/utils/clx-form-validator.js";
import { cloneDeep, difference } from "lodash";
export default {
  mixins: [treeMixin, fromMaxLength, cancelLoading],
  model: {
    prop: 'roleModelShow',
  },
  props: ['roleModelShow', 'roleModelData', 'roleModeltree', 'appAuthRoleList', 'resourceIdListAll'],
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      // 新增、修改表单
      formRole: {
        roleCode: "",
        roleName: "",
        description: "",
        resourceIdList: [],
      },
      // 表单验证
      rules: {
        roleCode: [{ required: true, message: "角色编码不能为空", trigger: "blur" }],
        roleName: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
        description: [
          { required: true, message: "角色描述不能为空", trigger: "blur" },
        ],
        resourceIdList: [
          { required: true, message: "角色权限不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    modelTitle() {
      if (this.formRole.roleId) {
        return '编辑角色'
      } else {
        return '新增角色'
      }
    },
  },
  methods: {
    // 取消-关闭model
    closeModel() {
      this.$emit('input', false)
    },
    // 提交
    onSubmit() {
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      this.handleLoading()
      let methodsName = this.formRole.roleId ? 'changeAppAuthRoleApiFn' : 'addAppAuthRoleApiFn'
      this[methodsName]()
        .then(res => {
          this.$emit('getAppAuthRoleListFn', this.appAuthRoleList.length == 0)
          this.closeModel()
        })
        .finally(() => {
          this.cancelLoading()
        })
    },
    // 新增api
    addAppAuthRoleApiFn() {
      let apiData = { ...this.formRole, roleType: 1 }
      apiData.resourceIdList = [...apiData.resourceIdList, ...this.halfCheckedKeys]
      return addAppAuthRole(apiData)
        .then((res) => {
          this.$message.success("新增成功");
          return res
        })
        .catch(err => {
          
        });
    },
    // 修改api
    changeAppAuthRoleApiFn() {
      let apiData = { ...this.formRole, roleType: 1 }
      apiData.resourceIdList = [...apiData.resourceIdList, ...this.halfCheckedKeys]
      return changeAppAuthRole(apiData)
        .then((res) => {
          this.$message.success("修改成功");
          return res
        })
        .catch(err => {
          
        });
    }
  },
  watch: {
    roleModelShow(newVal) {
      if (newVal) {
        this.formRole = cloneDeep(this.roleModelData)
        if (this.formRole.roleId) {
          this.halfCheckedKeys = difference(this.resourceIdListAll, this.formRole.resourceIdList)
        }
      }
    }
  },
};
</script>

<style lang="less" scoped>
</style>
