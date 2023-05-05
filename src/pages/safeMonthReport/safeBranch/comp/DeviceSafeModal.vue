<!--设备年检异常情况 -->
<template>
  <CommonModal :title="title" :visible="visible" :cancelFn="cancelFn">
    <template slot="form">
      <a-form-model ref="formRef" :rules="rules" :label-col="{ style: { width: '158px' } }"
        :wrapper-col="{ style: { width: 'calc(100% - 115px)' } }" :model="form" :colon="false">
        <a-form-model-item class="flex" label="设备类型" prop="deviceType">
          <a-input :disabled="disabled" v-model="form.deviceType" placeholder="请输入设备类型" :maxLength="30"></a-input>
        </a-form-model-item>
        <a-form-model-item
          class="flex"
          label="所属部门"
          prop="deptId"
        >
        <dept-tree :disabled="disabled" :placeholder="'请选择起草人部门'" v-model="form.deptId" :deptData="treeData" allowClear></dept-tree>
        </a-form-model-item>
        <a-form-model-item class="flex" label="认证数量" prop="quantity">
          <a-input :disabled="disabled" v-model="form.quantity" placeholder="请输入认证数量" :maxLength="30"></a-input>
        </a-form-model-item>
        <a-form-model-item class="flex" label="认证原因" prop="reason">
          <a-select :disabled="disabled" v-model="form.reason" placeholder="请选择认证原因" option-filter-prop="children" show-search :filter-option="filterOption">
            <a-select-option v-for="item in reasonOptions" :key="item.key" :value="item.key">{{item.label}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item class="flex" label="认证结论" prop="conclusion">
          <a-select :disabled="disabled" v-model="form.conclusion" placeholder="请选择认证结论" option-filter-prop="children" show-search :filter-option="filterOption">
            <a-select-option v-for="item in conclusionOptions" :key="item.key" :value="item.key">{{item.label}}</a-select-option>
          </a-select>
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
export default {
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
      reasonOptions:  [
        { label:'新设备', key:'newDevice', value: 'newDevice' },
        { label:'设备变更', key:'deviceChange', value: 'deviceChange' },
        { label: '设备再认证', key:'deviceCert', value: 'deviceCert' }
      ],
      conclusionOptions: [
        { label:'合格', key:'passed', value: 'passed' },
        { label:'不合格待整改', key:'toModify', value: 'toModify' },
        { label:'不合格停用', key:'stoped', value: 'stoped' }
      ],
      rules: {
        deviceType: [
          { required: true, message: '请输入设备类型', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: '请输入认证数量', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '请选择认证原因', trigger: 'blur' }
        ],
        conclusion: [
          { required: true, message: '请选择认证结论', trigger: 'blur' }
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
    handleTreeChange(value, label, extra) {
      this.form.userDepartment = label || []
    },
    cancelFn: function() {
      this.$refs.formRef.resetFields()
      this.$emit('update:visible', false)
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
    loadData(data) {
      this.form = {
        ...data
      }
    },
    handleChange(val) {
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