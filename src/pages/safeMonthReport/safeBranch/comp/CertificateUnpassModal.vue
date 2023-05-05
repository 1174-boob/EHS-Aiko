<!--设备年检异常情况 -->
<template>
  <CommonModal :title="title" :visible="visible" :cancelFn="cancelFn">
    <template slot="form">
      <a-form-model ref="formRef" :rules="rules" :label-col="{ style: { width: '158px' } }"
        :wrapper-col="{ style: { width: 'calc(100% - 115px)' } }" :model="form" :colon="false">
        <a-form-model-item class="flex" label="设备类型" prop="deviceType">
          <a-input :disabled="disabled" v-model="form.deviceType" placeholder="请输入设备类型" :maxLength="30"></a-input>
        </a-form-model-item>
        <a-form-model-item class="flex" label="设备编号" prop="deviceId">
          <a-input :disabled="disabled" v-model="form.deviceId" placeholder="请输入设备编号" :maxLength="30"></a-input>
        </a-form-model-item>
        <a-form-model-item
          class="flex"
          label="所属部门"
          prop="deptId"
        >
        <dept-tree :disabled="disabled" :placeholder="'请选择起草人部门'" v-model="form.deptId" :deptData="treeData" allowClear></dept-tree>
        </a-form-model-item>
        <a-form-model-item class="flex" label="认证不合格原因" prop="issueReason">
          <a-textarea :disabled="disabled" v-model="form.issueReason" placeholder="请输入认证不合格原因" :maxLength="300"></a-textarea>
        </a-form-model-item>
        <a-form-model-item class="flex" label="整改措施" prop="measure">
          <a-textarea :disabled="disabled" v-model="form.measure" placeholder="请输入整改措施" :maxLength="300"></a-textarea>
        </a-form-model-item>
        <a-form-model-item class="flex" label="整改进度" prop="progress">
          <a-textarea :disabled="disabled" v-model="form.progress" placeholder="请输入整改进度" :maxLength="300"></a-textarea>
        </a-form-model-item>
      </a-form-model>
    </template>
    <template slot="btn">
      <a-button @click="cancelFn">取消</a-button>
      <a-button v-if="!disabled" type="primary" class="m-l-15" @click="confirm">确定</a-button>
    </template>
  </CommonModal>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js"
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
export default {
  components: {
    OrganizeLazyTree
  },
  props: {
    curRow: {
      type: Object,
      default: () => null
    },
    visible: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    treeData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        fileIdList: [],
        buildingAndFloor: []
      },
      options:  [],
      rules: {
        deviceType: [
          { required: true, message: '请输入设备类型', trigger: 'blur' }
        ],
        deviceId: [
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '请选择所属部门', trigger: 'blur' }
        ],
        issueReason: [
          { required: true, message: '请输入不合格原因', trigger: 'blur' }
        ],
        measure: [
          { required: true, message: '请输入整改措施', trigger: 'blur' }
        ],
        progress: [
          { required: true, message: '请输入整改进度', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.curRow ? '编辑认证不合格设备分析' : '新增认证不合格设备分析'
    },
  },
  methods: {
    initData() {
      this.$refs.organizeLazyTree.getOrganizeLazyTree()
      .then(res => {
        this.spinning = false
      })
    },
    getTreeDetail(applicationDepartmentId) {
      return this.$refs.organizeLazyTree.getOrganizeEmersionTree(applicationDepartmentId)
    },
    cancelFn: function() {
      this.$refs.formRef.resetFields()
      this.$emit('update:visible', false)
    },
    handleSuccess(file) {
      this.form.fileIdList = file.map(item => {
        return {
          uid: item.response ? item.response.data.id : item.uid,
          url: item.response ? item.response.data.url : item.url,
          name: item.name
        }
      }) || []
    },
    handleTreeChange(value, label, extra) {
      this.form.userDepartment = label || []
    },
    loadData(data) {
      this.form = {
        ...data
      }
    },
    handleChange(val) {
    },
    deptFormValidator(val) {
      formValidator.formItemValidate(this, 'userDepartmentId', 'addModuleForm')
    },
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    confirm() {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          this.$emit('callback', { ...this.form })
          this.cancelFn()
        }
      })
    }
  }
}
</script>

<style>

</style>