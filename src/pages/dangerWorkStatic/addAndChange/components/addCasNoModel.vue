<template>
  <CommonModal :title="modelTitle" :visible="addCasNoModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="addModleForm" :model="addModleForm" :rules="addModleFormRules" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }" :colon="false" labelAlign="left">
        <StaffOrDept
          :labelTitle="'现场监护人'"
          :treeRoles="addModleFormRules"
          :propKey="'guardianCode'"
          :checkedTreeNode="checkedTreeNode"
          :checkAbel="false"
          :deptTreeId="deptTreeId"
          @getTreeData="getTreeData"
        />
        <a-form-model-item ref="guardianContact" label="联系方式" prop="guardianContact">
          <a-input v-model.trim="addModleForm.guardianContact" :maxLength="50" placeholder="请输入联系方式"></a-input>
        </a-form-model-item>
      </a-form-model>
    </template>
    <template slot="btn">
      <a-button @click="closeModel">取消</a-button>
      <a-button type="primary" class="m-l-15" @click="addModleConfirm">确定</a-button>
    </template>
  </CommonModal>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import { cloneDeep, isEmpty } from 'lodash'
import StaffOrDept from "@/components/staffOrDept";
export default {
  components: { StaffOrDept },
  model: {
    prop: "addCasNoModelShow",
  },
  props: {
    // 弹窗显示隐藏
    addCasNoModelShow: {
      type: Boolean,
      default: false,
    },
    // 每一条数据
    addCasNoModelData: {
      type: Object,
      default: () => { },
    },
    // 全部数据
    moduleList: {
      type: Array,
      default: () => [],
    },
    deptTreeId: {}
  },
  data() {
    return {
      addModleForm: {},
      // 表单校验
      addModleFormRules: {
        guardianCode: [{ required: true, message: "现场监护人不能为空", trigger: "change" },],
        guardianContact: [{ required: true, message: "联系方式不能为空", trigger: "blur" },],
      },
      checkedTreeNode: [],
    };
  },
  computed: {
    // 弹窗标题
    modelTitle() {
      return this.addCasNoModelData.guid ? '编辑现场监护人' : '新增现场监护人'
    },
  },
  methods: {
    getTreeData(value) {
      // console.log("ppppp----", value);
      let { treeIdList, treeNameAndCodeList } = value

      // 针对组件取消后数据被清空时做保存数据处理
      this.checkedTreeNode = treeIdList

      let { id, treeName, treeCode } = treeNameAndCodeList && treeNameAndCodeList.length ? treeNameAndCodeList[0] : {}
      let guardianCode = id
      let guardianName = (treeName || '') + (treeName && treeCode ? '/' : '') + (treeCode || '')
      this.$set(this.addModleForm, 'guardianCode', guardianCode)
      this.$set(this.addModleForm, 'guardianName', guardianName)
      formValidator.formItemValidate(this, "guardianCode", "addModleForm")
    },
    // 确定
    addModleConfirm() {
      if (!formValidator.formAll(this, "addModleForm")) return;
      let moduleListNew = cloneDeep(this.moduleList)
      if (this.addModleForm.guid) {
        // 修改
        let index = moduleListNew.findIndex(item => item.guid == this.addModleForm.guid)
        moduleListNew.splice(index, 1, { ...this.addModleForm })
      } else {
        // 新增
        this.$set(this.addModleForm, 'guid', this.guid())
        moduleListNew.push(this.addModleForm)
      }
      this.$emit('changeModuleList', moduleListNew)
      this.closeModel()
    },
    // 取消-关闭model
    closeModel() {
      this.$emit("input", false);
    },
    // 生成唯一id
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
  },
  watch: {
    addCasNoModelShow(newVal) {
      if (newVal) {
        this.addModleForm = isEmpty(this.addCasNoModelData) ? {} : cloneDeep(this.addCasNoModelData)
        this.checkedTreeNode = this.addCasNoModelData.guardianCode ? [this.addCasNoModelData.guardianCode] : [];
      } else {
        setTimeout(() => {
          this.addModleForm = {}
          this.checkedTreeNode = []
        }, 300);
      }
    }
  }
};
</script>

<style lang='less' scoped>
::v-deep .a-spin {
  .ant-spin-blur {
    opacity: 0.1 !important;
  }
}
#principal-dialog {
  ::v-deep .ant-modal {
    width: 600px !important;
    padding-bottom: 0px !important;
  }
}

.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.model-main {
  min-height: 360px;
  .model-main-qr-img {
    display: block;
    flex: none;
    width: 80%;
    height: auto;
    margin: 0 auto;
    max-width: 620px;
    max-height: 620px;
  }
}
@media screen and (max-width: 1367px) {
  .model-main {
    min-height: 320px;
    .model-main-qr-img {
      width: 70%;
    }
  }
}
</style>
