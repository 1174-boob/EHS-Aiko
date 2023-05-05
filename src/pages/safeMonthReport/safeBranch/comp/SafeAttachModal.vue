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
          <a-textarea :disabled="disabled" v-model="form.troubleDesc" placeholder="检测发现隐患描述" :maxLength="300"></a-textarea>
        </a-form-model-item>
        <a-form-model-item class="flex" label="处置措施" prop="measure">
          <a-textarea :disabled="disabled" v-model="form.measure" placeholder="处置措施" :maxLength="300"></a-textarea>
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
    }
  },
  data() {
    return {
      form: {
        fileIdList: [],
        buildingAndFloor: []
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
        ]
      }
    }
  },
  computed: {
    title() {
      return this.curRow ? '编辑安全附件异常情况' : '新增安全附件异常情况'
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
    // async fetchData(para) {
    //   const { data } = await dangerAnalyseDetail(para)

    // },
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