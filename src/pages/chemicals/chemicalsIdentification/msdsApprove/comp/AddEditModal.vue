<template>
  <CommonModal :title="modalTitle" :visible="moduleVisible" :cancelFn="addModleCancle">
      <template slot="form">
        <a-spin :spinning="spinning" wrapperClassName="a-spin">
        <a-form-model
          ref="addModuleForm"
          :model="form"
          :rules="rules"
          :label-col="{ style: { width: '100px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 100px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="化学品名称" prop="chemicalName">
            <a-select allowClear show-search :disabled="disabled" v-model="form.chemicalName" placeholder="请选择化学品名称" @change="handleChemicalChange" option-filter-prop="children" :filter-option="filterOption">
              <a-select-option v-for="item in chemicalNameOptions" :key="item.dictLabel" :value="item.dictValue">{{ item.dictLabel }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="形态" prop="form">
            <a-select :disabled="disabled" v-model="form.form" placeholder="请选择形态" allowClear >
                <a-select-option v-for="item in formOptions" :value="item.dictValue" :key="item.dictValue">{{ item.dictLabel }}</a-select-option>
              </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="主要成分" prop="mainComponents">
            <a-input :disabled="disabled" v-model="form.mainComponents" placeholder="请输入主要成分" :maxLength="30" ></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="危险性" prop="danger">
            <a-input type="textarea" :disabled="disabled" v-model="form.danger" placeholder="请输入危险性" :maxLength="300"></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="使用部门" prop="userDepartmentId">
            <dept-tree :disabled="disabled" placeholder="请选择使用部门" v-model="form.userDepartmentId" :multiple="true" :deptData="treeData" @change="handleTreeChange" allowClear></dept-tree>
            <!-- <OrganizeLazyTree :disabledExtend="!disabled" :disabled="disabled" @change="handleTreeChange" multiple v-model="form.userDepartmentId" ref="organizeLazyTree" :defaultGet="false" @deptFormValidator="deptFormValidator" /> -->
          </a-form-model-item>
          <a-form-model-item class="flex" label="供应厂商" prop="supplier">
            <a-input :disabled="disabled" v-model="form.supplier" placeholder="请输入供应厂商" :maxLength="30"></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="资料名称" prop="infoName">
            <a-input :disabled="disabled" v-model="form.infoName" placeholder="请输入资料名称" :maxLength="30"></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="版本" prop="version">
            <a-input :disabled="disabled" v-model="form.version" placeholder="请输入版本" :maxLength="30"></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="有效期" prop="validityTime">
            <a-date-picker :disabled="disabled" format="YYYY-MM-DD" @change="handleDateChange" v-model="form.validityTime" placeholder="请选择有效期"/>
          </a-form-model-item>
          <a-form-model-item class="flex" label="资料文件" prop="infoFileId">
            <UploadEhs :maxSize="20" :limit="1" :onlyShow="disabled" :accept="accept" @handleSuccess="handleSuccess" :fileLists="form.infoFileId"></UploadEhs>
          </a-form-model-item>
          <!-- <a-form-model-item class="flex" label="资料文件名称" prop="effDate">
            <a-input disabled :value="fileListName" placeholder="显示上传的文件名称"></a-input>
          </a-form-model-item> -->
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
    },
    treeData: {
      type: Array,
      default: () => []
    }
  },
  components: {
    UploadEhs,
  },
  data() {
    return {
      form: {
        // chemicalName: undefined,
        // form: undefined,
        // mainComponents: undefined,
        chemicalName: undefined,
        form: undefined,
        mainComponents: undefined,
        danger: undefined,
        validityTime: undefined,
        infoFileId: [],
        version: undefined,
        userDepartmentId: []
      },
      spinning: false,
      accept: ['.doc', '.docx' ,'.pdf', '.xls', '.xlsx', '.ppt'],
      chemicalNameOptions: dictionary('chemical'),
      modalTitle: '新增',
      formOptions: dictionary('form'),
      consoleOrganizeTreeList: [],
      replaceFields: { children: 'children', title: 'name', key: 'id', value: 'id' },
      rules: {
        chemicalName: [
          { required: true, message: '请选择化学品名称', trigger: 'blur' }
        ],
        form: [
          { required: true, message: '请选择形态', trigger: 'blur' }
        ],
        mainComponents: [
          { required: true, message: '请输入主要成分', trigger: 'blur' }
        ],
        danger: [
          { required: true, message: '请输入危险性', trigger: 'blur' }
        ],
        userDepartmentId: [
          { required: true, message: '请输入使用部门', trigger: 'blur' }
        ],
        supplier: [
          { required: true, message: '请输入供应厂商', trigger: 'blur' }
        ],
        infoName: [
          { required: true, message: '请输入资料名称', trigger: 'blur' }
        ],
        version: [
          { required: true, message: '请输入版本', trigger: 'blur' }
        ],
        validityTime: [
          { required: true, message: '请选择有效期', trigger: 'change' }
        ],
        infoFileId: [
          { required: true, message: '请上传资料文件', trigger: 'blur' }
        ]
      }
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
      if (data.infoFileId && typeof data.infoFileId === 'string') {
        data.infoFileId = JSON.parse(data.infoFileId)
      }
      this.form = { ...data }
    },
     // 获取组织机构树
    // getOrganizeTree() {
    //   return getConsoleOrganizeList()
    //     .then(res => {
    //       this.consoleOrganizeTreeList = [res.data]
    //     })
    //     .catch(err => { })
    // },
    handleTreeChange(value, label, extra) {
      this.form.userDepartment = label || []
    },
    async handleChemicalChange(val) {
      let para = {
        chemicalName: val
      }
      const { code, data } = await getDetailByChemicalName(para)
      if (+code === 20000 && data) {
        this.$set(this.form, 'form', data.form)
        this.$set(this.form, 'form', data.version)
        this.$set(this.form, 'mainComponents', data.mainIngredient)
        this.$set(this.form, 'danger', data.dangerousStatement)
        this.$set(this.form, 'userDepartment', data.deptList || [])
        this.$set(this.form, 'supplier', data.supplier)
      }
    },
    addModleCancle() {
      this.modalTitle = '新增'
      this.$refs.addModuleForm.resetFields()
      this.form = {
        chemicalName: undefined,
        form: undefined,
        mainComponents: undefined,
        version: undefined,
        danger: undefined,
        validityTime: undefined,
        infoFileId: [],
        userDepartmentId: []
      }
      this.$emit('update:moduleVisible', false)
    },
    handleSuccess(file) {
      if (file && file[0]) {
        this.form.infoFile = file[0].name
      }
      this.form.infoFileId = file.map(item => {
        return {
          uid: item.response ? item.response.data.id : item.uid,
          url: item.response ? item.response.data.url : item.url,
          name: item.name
        }
      }) || []
    },
    getDepartmentLabel(ids) {
      let labelArr = []
      if (!ids || ids.length) {
        return ''
      }
      while (ids.length) {
        let id = ids.shift()
        let name = this.searchNameById(id)
        if (name) {
          labelArr.push(name)
        }
      }
      return labelArr.join()
    },
    searchNameById(id) {
      let res = ''
    },
    handleDateChange(val) {
      if (!val) {
        return
      }
      this.form.validityTime = moment(val).format('YYYY-MM-DD')
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