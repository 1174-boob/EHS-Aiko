<template>
  <CommonModal :title="modalTitle" :visible="moduleVisible" :cancelFn="addModleCancle">
    <template slot="form">
      <a-spin :spinning="spinning" wrapperClassName="a-spin">
        <a-form-model
          ref="addModuleForm"
          class="ant-form-custom-disabled"
          :model="form"
          :rules="rules"
          :label-col="{ style: { width: '100px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 100px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="原因类型" prop="reasonType">
            <a-select allowClear show-search :disabled="disabled" v-model="form.reasonType" placeholder="请选择原因类型" option-filter-prop="children" :filter-option="filterOption">
              <a-select-option v-for="item in reasonOptions" :key="item.dictLabel" :value="item.dictValue">{{ item.dictLabel }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="事件原因分析" prop="reasonAnalysis">
            <a-textarea autoSize :disabled="disabled" v-model="form.reasonAnalysis" placeholder="请输入事件整改措施" :maxLength="1000"></a-textarea>
          </a-form-model-item>
          <a-form-model-item class="flex" label="事件整改措施" prop="rectificationMeasures">
            <a-textarea autoSize :disabled="disabled" v-model="form.rectificationMeasures" placeholder="请输入事件整改措施" :maxLength="1000"></a-textarea>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </template>
    <template slot="btn" v-if="!disabled">
      <a-button @click="addModleCancle">取消</a-button>
      <a-button type="primary" class="m-l-15" @click="addModleConfirm">确定</a-button>
    </template>
  </CommonModal>
</template>

<script>
import UploadEhs from "@/components/upload/uploadBtnStyle.vue"
import { formValidator } from "@/utils/clx-form-validator.js"
import dictionary from '@/utils/newDictionary'
import { getConsoleOrganizeList } from '@/services/chemicalIdentSafetyTipsAdd.js'
import moment from 'moment'
import { getDetailByChemicalName } from '@/services/chemicalMsds'
export default {
  props: {
    moduleVisible: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    UploadEhs,
  },
  data() {
    return {
      form: {
      },
      spinning: false,
      accept: ['.doc', '.docx', '.pdf', '.xls', '.xlsx', '.ppt'],
      chemicalNameOptions: dictionary('chemical'),
      modalTitle: '新增',
      formOptions: dictionary('form'),
      consoleOrganizeTreeList: [],
      replaceFields: { children: 'children', title: 'name', key: 'id', value: 'id' },
      rules: {
        reasonType: [
          { required: true, message: '请选择原因类型', trigger: 'blur' }
        ],
        reasonAnalysis: [
          { required: true, message: '请输入事件原因分析', trigger: 'blur' }
        ],
        rectificationMeasures: [
          { required: true, message: '请输入事件整改措施', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    reasonOptions() {
      return dictionary('event_reason_type')
    }
  },
  created() {
    // this.getOrganizeTree()
  },
  mounted() {

  },
  methods: {
    initData() {

    },
    loadData(data) {
      this.modalTitle = '编辑'
      if (this.disabled) {
        this.modalTitle = '查看'
      }
      this.form = { ...data }
    },
    deptFormValidator(val) {
      formValidator.formItemValidate(this, 'userDepartmentId', 'addModuleForm')
    },
    addModleCancle() {
      this.modalTitle = '新增'
      this.$refs.addModuleForm.resetFields()
      this.form = {
      }
      this.$emit('update:moduleVisible', false)
    },
    async addModleConfirm() {
      let valid = await this.validate()
      if (valid) {
        this.$emit('callback', { ...this.form })
        this.addModleCancle()
      }
    },
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    validate() {
      return new Promise((resolve) => {
        this.$refs.addModuleForm.validate(valid => {
          resolve(valid)
        })
      }).catch(err => {
        console.log(err, 'err')
      })
    }
  }
}
</script>

<style>
</style>