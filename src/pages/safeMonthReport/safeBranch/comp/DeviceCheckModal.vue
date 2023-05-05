<!--设备年检异常情况 -->
<template>
  <CommonModal :title="title" :visible="visible" :cancelFn="cancelFn">
    <template slot="form">
      <a-form-model ref="formRef" :rules="rules" :label-col="{ style: { width: '158px' } }"
        :wrapper-col="{ style: { width: 'calc(100% - 115px)' } }" :model="form" :colon="false">
        <a-form-model-item class="flex" label="设备名称" prop="deviceName">
          <a-input :disabled="disabled" v-model="form.deviceName" placeholder="请输入设备名称" :maxLength="30"></a-input>
        </a-form-model-item>
        <a-form-model-item class="flex" label="设备编号" prop="deviceCode">
          <a-input :disabled="disabled" v-model="form.deviceCode" placeholder="请输入设备编号" :maxLength="30"></a-input>
        </a-form-model-item>
        <a-form-model-item class="flex" label="检测发现隐患描述" prop="troubleDesc">
          <a-textarea :disabled="disabled" v-model="form.troubleDesc" placeholder="检测发现隐患描述" :maxLength="30"></a-textarea>
        </a-form-model-item>
        <a-form-model-item class="flex" label="处置措施" prop="measure">
          <a-textarea :disabled="disabled" v-model="form.measure" placeholder="处置措施" :maxLength="30"></a-textarea>
        </a-form-model-item>
        <a-form-model-item class="flex" label="是否已停用" prop="isDisable">
          <a-select :disabled="disabled" v-model="form.isDisable" placeholder="请选择" option-filter-prop="children" show-search :filter-option="filterOption">
            <a-select-option v-for="item in options" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item class="flex" label="是否已整改" prop="isRectify">
          <a-select :disabled="disabled" v-model="form.isRectify" placeholder="请选择" option-filter-prop="children" show-search :filter-option="filterOption">
            <a-select-option v-for="item in options" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item class="flex" label="是否已复测" prop="isRetest">
          <a-select :disabled="disabled" v-model="form.isRetest" placeholder="请选择" option-filter-prop="children" show-search :filter-option="filterOption">
            <a-select-option v-for="item in options" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
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

export default {
  components: {
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
  },
  data() {
    return {
      options: [
        {
          key: 1,
          value: '是'
        },
        {
          key: 0,
          value: '否'
        }
      ],
      form: {
        
      },
      rules: {
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        deviceCode: [
          { required: true, message: '请输入设备编号', trigger: 'blur' }
        ],
        troubleDesc: [
          { required: true, message: '请输入检测发现隐患描述', trigger: 'blur' }
        ],
        measure: [
          { required: true, message: '请输入处置措施', trigger: 'blur' }
        ],
        isDisable: [
          { required: true, message: '请选择是否已停用', trigger: 'blur' }
        ],
        isRectify: [
          { required: true, message: '请选择是否已整改', trigger: 'blur' }
        ],
        isRetest: [
          { required: true, message: '请选择是否已复测', trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    title() {
      return this.curRow ? '编辑设备年检异常情况' : '新增设备年检异常情况'
    },
  },
  methods: {
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
    loadData(data) {
      this.form = {
        ...data
      }
    },
    handleChange(val) {
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