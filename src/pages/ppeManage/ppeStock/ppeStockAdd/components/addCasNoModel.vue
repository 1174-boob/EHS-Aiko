<template>
  <CommonModal :title="modelTitle" :visible="addCasNoModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="addModleForm" :model="addModleForm" :rules="addModleFormRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :colon="false" labelAlign="left">
        <a-form-model-item ref="ppeType" label="PPE类型" prop="ppeType">
          <a-select v-model="addModleForm.ppeType" show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOption">
            <a-select-option v-for="item in ppeTypeList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="inventoryId" label="物料名称/型号" prop="inventoryId">
          <a-select v-model="addModleForm.inventoryId" show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOption" @change="inventoryIdChange">
            <a-select-option v-for="item in ppeDepositoryList" :key="item.inventoryId" :value="item.inventoryId">{{item.materialNameAndBrand}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="scrapAmount" class="flex" label="数量" prop="scrapAmount">
          <a-input v-model.trim="addModleForm.scrapAmount" :maxLength="30" placeholder="请输入数量" />
        </a-form-model-item>
        <a-form-model-item ref="unit" class="flex" label="单位" prop="unit">
          <a-select v-model="addModleForm.unit" show-search placeholder="选择物料名称/型号后自动显示" option-filter-prop="children" :filter-option="filterOption" disabled>
            <a-select-option v-for="item in unitList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="useType" label="使用方式" prop="useType">
          <a-select v-model="addModleForm.useType" show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOption" disabled>
            <a-select-option v-for="item in ppeUseType" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="validityTime" label="有效期" prop="validityTime">
          <a-date-picker style="width: 100%;" v-model="addModleForm.validityTime" format="YYYY-MM-DD" placeholder="请选择有效期" />
        </a-form-model-item>
        <a-form-model-item ref="remark" label="备注" prop="remark">
          <a-textarea v-model.trim="addModleForm.remark" :maxLength="300" placeholder="请输入备注"></a-textarea>
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
import { cloneDeep, isEmpty, isNumber } from 'lodash'
import chemicalDict from "@/mixin/chemicalDict.js";
import dictionary from "@/utils/dictionary";
import dayJs from 'dayjs';
export default {
  mixins: [chemicalDict],
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
    // ppe领用列表--物料名称/型号
    ppeDepositoryList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      ppeTypeList: [],
      spinning: false,
      loading: false,
      addModleFormInit: {
        ppeType: undefined,
        inventoryId: undefined,
        materialNameAndBrand: undefined,
        scrapAmount: undefined,
        unit: undefined,
        useType: '2',
        validityTime: undefined,
        remark: undefined,
      },
      // 表单校验
      addModleFormRules: {
        ppeType: [{ required: true, message: "PPE类型不能为空", trigger: "change" },],
        inventoryId: [{ required: true, validator: this.inventoryIdVtor, trigger: "change" },],
        scrapAmount: [{ required: true, validator: this.scrapAmountVtor, trigger: "blur", text: '数量' },],
        unit: [{ required: true, message: "单位不能为空", trigger: "blur" },],
        useType: [{ required: true, message: "使用方式不能为空", trigger: "blur" },],
        validityTime: [{ required: true, message: "有效期不能为空", trigger: "change" },],
        remark: [{ required: false, message: "备注不能为空", trigger: "blur" },],
      },
      // model
      addModleForm: {},
      // 使用方式列表
      ppeUseType: [],
      // 单位字典
      unitList: [],
    };
  },
  computed: {
    // 弹窗标题
    modelTitle() {
      return this.addCasNoModelData.guid ? '编辑报废清单' : '新增报废清单'
    },
    // 所选的物料名称
    inventoryObj() {
      return this.ppeDepositoryList.find(item => item.inventoryId == this.addModleForm.inventoryId)
    },
    // 当前清单已选择的数量
    allSelNumber() {
      let moduleList = this.moduleList.filter(item => {
        return item.inventoryId == this.addModleForm.inventoryId
      })
      // 清单总选择量
      let allSelNumberByList = moduleList.reduce((pre, cur) => {
        return pre + Number(cur.scrapAmount)
      }, 0)
      // 如果当前是编辑  清单总选择量 = 清单总选择量 - 当前已选择的量
      if (this.addCasNoModelData.guid && this.addModleForm.inventoryId == this.addCasNoModelData.inventoryId) {
        allSelNumberByList = allSelNumberByList - Number(this.addCasNoModelData.scrapAmount)
      }
      return allSelNumberByList
    },
    // 领用剩余数量
    remainder() {
      if (this.addModleForm.inventoryId) {
        // 总量
        let maxAmount = this.inventoryObj ? this.inventoryObj.maxAmount : 10000
        // 剩余量 = 物料总领用 - 已选择的
        let endNumber = maxAmount - this.allSelNumber
        console.log(`总量:${maxAmount} `, `清单已选择:${this.allSelNumber} `, `领用剩余数量:${endNumber}`);
        endNumber = endNumber < 0 ? 0 : endNumber
        return endNumber
      } else {
        return null
      }
    },
  },
  methods: {
    // 物料名称/型号选择
    inventoryIdChange() {
      this.addModleForm.unit = this.inventoryObj ? this.inventoryObj.unit : undefined
      this.addModleForm.materialNameAndBrand = this.inventoryObj ? this.inventoryObj.materialNameAndBrand : undefined
      if (this.inventoryObj) {
        formValidator.formItemValidate(this, 'unit', 'addModleForm')
        this.addModleForm.scrapAmount && formValidator.formItemValidate(this, 'scrapAmount', 'addModleForm')
      } else {
        this.addModleForm.scrapAmount = undefined
        formValidator.clearFormItemValidate(this, 'scrapAmount', 'addModleForm')
      }
    },
    // 校验物料名称/型号选择
    inventoryIdVtor(rule, value, callback) {
      let { required } = rule
      if (!value && value !== 0) {
        required ? callback(new Error(`物料名称/型号不能为空不能为空`)) : callback();
      } else if (isNumber(this.remainder) && this.remainder == 0) {
        callback(new Error(`当前物料已无领用数量`));
      } else {
        callback();
      }
    },
    // 校验报废数量
    scrapAmountVtor(rule, value, callback) {
      let { required, text } = rule
      console.log(this.remainder);
      let re = /^[1-9]+[0-9]*$/
      if (!value && value !== 0) {
        required ? callback(new Error(`${text}不能为空`)) : callback();
      } else if (!re.test(value)) {
        callback(new Error(`${text}只能为大于0的整数`));
      } else if (isNumber(this.remainder) && this.addModleForm.scrapAmount > this.remainder) {
        callback(new Error(`不得超过领用数量${this.remainder}`));
      } else {
        callback();
      }
    },
    // 滚动到表单验证报错的地方
    scrollView(object) {
      for (const i in object) {
        let dom = this.$refs[i];
        // 这里是针对遍历的情况（多个输入框），取值为数组
        if (Object.prototype.toString.call(dom) !== "[object Object]") {
          dom = dom[0];
        }
        // 第一种方法（包含动画效果）
        dom.$el.scrollIntoView({
          // 滚动到指定节点
          // 值有start,center,end，nearest，当前显示在视图区域中间
          block: "center",
          // 值有auto、instant,smooth，缓动动画（当前是慢速的）
          behavior: "smooth",
        });
        break; // 因为我们只需要检测一项,所以就可以跳出循环了
      }
    },
    // 确定
    addModleConfirm() {
      let formAll = true
      this.$refs["addModleForm"].validate((valid, object) => {
        if (!valid) {
          formAll = false
          this.scrollView(object);
        }
      });
      if (!formAll) {
        return;
      }
      // console.log('确定', this.addModleForm)
      let moduleListNew = cloneDeep(this.moduleList)
      let addModleForm = cloneDeep(this.addModleForm)
      if (this.addModleForm.guid) {
        // 修改
        // 处理时间
        addModleForm.validityTime = dayJs(addModleForm.validityTime).format("YYYY-MM-DD")
        // 替换
        let index = moduleListNew.findIndex(item => item.guid == this.addModleForm.guid)
        moduleListNew.splice(index, 1, addModleForm)
      } else {
        // 新增
        addModleForm.guid = this.guid()
        addModleForm.validityTime = dayJs(addModleForm.validityTime).format("YYYY-MM-DD")
        moduleListNew.push(addModleForm)
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
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    // 处理PPE类型字典
    handlePpeTypeListFn() {
      // 获取全部PPE类型字典
      let handlePpeTypeList = this.getChemicalDictList('PPE_type')
      // 根据物料名称/型号得到对应的PPE类型数据
      let ppeTypeDictValueArr = this.ppeDepositoryList.map(item => item.ppeType)
      ppeTypeDictValueArr = [...new Set(ppeTypeDictValueArr)]
      handlePpeTypeList = handlePpeTypeList.filter(item => {
        return ppeTypeDictValueArr.includes(item.dictValue)
      })
      this.ppeTypeList = handlePpeTypeList
    },
  },
  watch: {
    addCasNoModelShow(newVal) {
      if (newVal) {
        this.addModleForm = isEmpty(this.addCasNoModelData) ? cloneDeep(this.addModleFormInit) : cloneDeep(this.addCasNoModelData)
        // 处理PPE类型字典
        this.handlePpeTypeListFn()
        // 使用方式字典
        this.ppeUseType = dictionary("ppeUseType");
        // PPE类型字典
        this.unitList = this.getChemicalDictList('PPE_unit')
      } else {
        setTimeout(() => {
          this.addModleForm = cloneDeep(this.addModleFormInit)
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
