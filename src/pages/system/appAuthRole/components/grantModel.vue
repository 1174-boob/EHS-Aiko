<template>
  <!--授权用户 弹窗 -->
  <CommonModal title="添加授权用户" :visible="grantModelShow" :cancelFn="closeModel">
    <div slot="form">
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <!-- <a-form-model-item ref="userIdList" prop="userIdList"> -->
          <!-- <a-tree-select
            v-model="form.userIdList"
            :selectable="false"
            placeholder="请选择添加授权的用户"
            :defaultValue="grantModelDefaultValue"
            tree-checkable
            :tree-data="grantModelTreeData"
            style="width: 100%"
            :dropdown-style="{maxHeight: '400px',overflow: 'auto',zIndex: 9999,}"
            :replace-fields="{title: 'namePhone',key: 'userId',value: 'userId',}"
            :treeNodeFilterProp="'title'"
            dropdownClassName="grantModel-tree"
          ></a-tree-select> -->
          <staffOrDept 
            :treeType="'user'" 
            :labelTitle="'组织人员'" 
            :propKey="'userIdList'" 
            :treeRoles="rules" 
            :labelCol="{ span: 4 }" 
            :wrapperCol="{ span: 20 }" 
            @getTreeData="getTreeData"
          />
      </a-form-model>
    </div>
    <div slot="btn">
      <a-button type="dashed" @click="closeModel">取消</a-button>
      <a-button :loading="loading" type="primary" style="margin-left: 0.2rem" @click="submitFrom">提交</a-button>
    </div>
  </CommonModal>
</template>

<script>
import { addGrantUser } from "@/services/api";
import cancelLoading from "@/mixin/cancelLoading";
// 自定义表单验证的class类
import { formValidator } from "@/utils/clx-form-validator.js";
import staffOrDept from "@/components/staffOrDept";
export default {
  components: {
    staffOrDept
  },
  mixins: [cancelLoading],
  model: {
    prop: 'grantModelShow',
  },
  props: ['grantModelShow', 'grantModelTreeData', 'grantModelDefaultValue', 'selRole', 'selAppAuthItem'],
  data() {
    return {
      // 表单
      form: {
        userIdList: undefined,
      },
      // 表单验证
      rules: {
        userIdList: [
          { required: true, message: "添加授权的用户不能为空", trigger: ["blur", "change"] }
        ],
      },
    };
  },
  methods: {
    // 取消-关闭model
    closeModel() {
      this.$emit('input', false)
    },
    // 验证表单
    submitFrom() {
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      this.handleLoading()
      // 添加授权用户接口
      this.submitFromApi()
    },
    getTreeData(data) {
      this.form.userIdList = data.treeIdList;
      if (!formValidator.formItemValidate(this, "userIdList", "ruleForm")) {
        return;
      }
    },
    // 添加授权用户接口
    submitFromApi() {
      let roleId = this.selRole ? this.selRole.roleId : undefined;
      let apiData = { roleId, productId: this.selAppAuthItem.productId, userIdList: this.form.userIdList };
      console.log(roleId)
      console.log(apiData)
      addGrantUser(apiData)
        .then(res => {
          this.$message.success("提交成功");
          this.$emit('getTableList')
          this.closeModel()
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoading()
        })
    }
  },
  watch: {
    grantModelShow(newVal) {
      if (newVal) {
        this.form.userIdList = undefined
      }
    }
  },
};
</script>

<style lang="less" scoped>
// 下拉多选居中
::v-deep .ant-select-selection--multiple > ul > li {
  margin-top: 6px !important;
  margin-bottom: 2px !important;
}
@media screen and (max-width: 1366px) {
  ::v-deep .ant-select-selection--multiple > ul > li {
    margin-top: 4px !important;
    margin-bottom: 2px !important;
  }
}
</style>
<style lang="less">
@media screen and (max-height: 860px) {
  .grantModel-tree {
    max-height: 37vh !important;
  }
}
</style>
