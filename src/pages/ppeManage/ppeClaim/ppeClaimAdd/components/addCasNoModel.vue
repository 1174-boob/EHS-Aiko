<template>
  <CommonModal :title="modelTitle" :visible="addCasNoModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="addModleForm" :model="addModleForm" :rules="addModleFormRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :colon="false" labelAlign="left">
        <a-form-model-item ref="ppeType" label="PPE类型" prop="ppeType">
          <a-select v-model="addModleForm.ppeType" show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOption" @change="ppeTypeChange">
            <a-select-option v-for="item in ppeTypeList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="inventoryId" label="物料名称/型号" prop="inventoryId">
          <a-select v-model="addModleForm.inventoryId" show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOption" @change="inventoryIdChange">
            <a-select-option v-for="item in ppeDepositoryList" :key="item.inventoryId" :value="item.inventoryId">{{item.materialNameAndBrand}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="receiveAmount" class="flex" label="领取数量" prop="receiveAmount">
          <a-input v-model.trim="addModleForm.receiveAmount" :maxLength="30" placeholder="请输入领取数量" />
        </a-form-model-item>
        <a-form-model-item ref="unit" class="flex" label="单位" prop="unit">
          <a-select v-model="addModleForm.unit" show-search placeholder="选择物料名称/型号后自动显示" option-filter-prop="children" :filter-option="filterOption" disabled>
            <a-select-option v-for="item in unitList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <StaffOrDept
          ref="receiveUserList"
          :labelTitle="'领用人'"
          :treeRoles="addModleFormRules"
          :deptTreeId="deptTreeId"
          :propKey="'receiveUserList'"
          :checkedTreeNode="checkedTreeNode"
          @getTreeData="getTreeData"
        ></StaffOrDept>
        <a-form-model-item ref="useType" label="使用方式" prop="useType">
          <a-select v-model="addModleForm.useType" show-search placeholder="请选择领用人后自动显示" option-filter-prop="children" :filter-option="filterOption" disabled>
            <a-select-option v-for="item in ppeUseType" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="remark" label="备注" prop="remark">
          <a-textarea :maxLength="300" v-model="addModleForm.remark" placeholder="请输入备注"></a-textarea>
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
import { addPpeClaimApi, getPpeClaimDetailApi, changePpeClaimApi, getPpeDepositoryListNoPageApi } from '@/services/chemicalIdentSafetyTipsAdd.js'
import { number } from 'echarts';
import StaffOrDept from "@/components/staffOrDept";
export default {
  mixins: [chemicalDict],
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
    // 使用方式字典
    ppeUseType: {
      type: Array,
      default: () => [],
    },
    deptTreeId: {

    }
  },
  data() {
    return {
      // 化学品名称list
      ppeTypeList: [],
      spinning: false,
      loading: false,
      addModleFormInit: {
        ppeType: undefined,
        inventoryId: undefined,
        materialNameAndBrand: undefined,
        receiveAmount: undefined,
        unit: undefined,
        receiveUserList: undefined,
        receiveUserNameList: undefined,
        useType: undefined,
        remark: undefined,
      },
      // 表单校验
      addModleFormRules: {
        ppeType: [{ required: true, message: "PPE类型不能为空", trigger: "change" },],
        inventoryId: [{ required: true, validator: this.inventoryIdVtor, trigger: "change" },],
        receiveAmount: [{ required: true, validator: this.receiveAmountVtor, trigger: "blur", text: '领取数量' },],
        unit: [{ required: true, message: "单位不能为空", trigger: "blur" },],
        receiveUserList: [{ required: true, message: "领用人不能为空", trigger: "change" },],
        useType: [{ required: true, message: "使用方式不能为空", trigger: "change" },],
        remark: [{ required: false, message: "备注不能为空", trigger: "blur" },],
      },
      // model
      addModleForm: {},
      // 单位字典
      unitList: [],
      // ppe库存列表--物料名称/型号
      ppeDepositoryList: [],
    };
  },
  computed: {
    checkedTreeNode() {
      return this.addModleForm.receiveUserList
    },
    // 弹窗标题
    modelTitle() {
      return this.addCasNoModelData.guid ? '编辑领用清单' : '新增领用清单'
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
        return pre + Number(cur.receiveAmount)
      }, 0)
      // 如果当前是编辑  清单总选择量 = 清单总选择量 - 当前已选择的量
      if (this.addCasNoModelData.guid && this.addModleForm.inventoryId == this.addCasNoModelData.inventoryId) {
        allSelNumberByList = allSelNumberByList - Number(this.addCasNoModelData.receiveAmount)
      }
      return allSelNumberByList
    },
    // 库存剩余数量
    remainder() {
      if (this.addModleForm.inventoryId) {
        // 总量
        let amount = this.inventoryObj ? this.inventoryObj.amount : 10000
        // 剩余量 = 物料总库存 - 已选择的
        let endNumber = amount - this.allSelNumber
        console.log(`总量:${amount} `, `清单已选择:${this.allSelNumber} `, `库存剩余数量:${endNumber}`);
        endNumber = endNumber < 0 ? 0 : endNumber
        return endNumber
      } else {
        return null
      }
    },
  },
  methods: {
    // PPE类型改变
    ppeTypeChange() {
      this.getPpeDepositoryListNoPage()
        .then(res => {
          this.addModleForm.inventoryId = undefined
          this.inventoryIdChange()
        })
    },
    // 物料名称/型号
    getPpeDepositoryListNoPage() {
      if (!this.addModleForm.ppeType) {
        this.ppeDepositoryList = []
        return Promise.resolve()
      }
      let apiData = {
        ppeType: this.addModleForm.ppeType
      };
      return getPpeDepositoryListNoPageApi(apiData)
        .then((res) => {
          this.ppeDepositoryList = res.data || []
        })
        .catch(err => { })
    },
    // 物料名称/型号选择
    inventoryIdChange() {
      this.addModleForm.unit = this.inventoryObj ? this.inventoryObj.unit : undefined
      this.addModleForm.materialNameAndBrand = this.inventoryObj ? this.inventoryObj.materialNameAndBrand : undefined
      if (this.inventoryObj) {
        formValidator.formItemValidate(this, 'unit', 'addModleForm')
        this.addModleForm.receiveAmount && formValidator.formItemValidate(this, 'receiveAmount', 'addModleForm')
      } else {
        this.addModleForm.receiveAmount = undefined
        formValidator.clearFormItemValidate(this, 'receiveAmount', 'addModleForm')
      }
    },
    // 选择申请人
    getTreeData(value) {
      this.addModleForm.receiveUserList = value.treeIdList;
      this.addModleForm.useType = value.treeIdList && value.treeIdList.length ? (value.treeIdList.length >= 2 ? '2' : '1') : undefined;
      const treeNameAndCodeList = value.treeNameAndCodeList;
      let name = [];
      for (let ele of treeNameAndCodeList) {
        name.push(ele.treeName)
      }
      this.addModleForm.receiveUserNameList = name.join();
      formValidator.formItemValidate(this, 'useType', 'addModleForm')
      if (!formValidator.formItemValidate(this, "receiveUserList", "addModleForm")) {
        return;
      }
    },
    // 校验物料名称/型号选择
    inventoryIdVtor(rule, value, callback) {
      let { required } = rule
      if (!value && value !== 0) {
        required ? callback(new Error(`物料名称/型号不能为空不能为空`)) : callback();
      } else if (isNumber(this.remainder) && this.remainder == 0) {
        callback(new Error(`当前物料已无库存`));
      } else {
        callback();
      }
    },
    // 校验领取数量
    receiveAmountVtor(rule, value, callback) {
      let { required, text } = rule
      let re = /^[1-9]+[0-9]*$/
      if (!value && value !== 0) {
        required ? callback(new Error(`${text}不能为空`)) : callback();
      } else if (!re.test(value)) {
        callback(new Error(`${text}只能为大于0的整数`));
      } else if (isNumber(this.remainder) && this.addModleForm.receiveAmount > this.remainder) {
        callback(new Error(`不得超过库存数量${this.remainder}`));
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
      if (!this.addModleForm.receiveUserList || this.addModleForm.receiveUserList.length <= 0) {
        return
      }
      if (!formAll) {
        return;
      }
      // console.log('确定', this.addModleForm)
      let moduleListNew = cloneDeep(this.moduleList)
      if (this.addModleForm.guid) {
        // 修改
        let index = moduleListNew.findIndex(item => item.guid == this.addModleForm.guid)
        moduleListNew.splice(index, 1, { ...this.addModleForm })
      } else {
        // 新增
        let addModleForm = cloneDeep(this.addModleForm)
        addModleForm.guid = this.guid()
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
  },
  watch: {
    addCasNoModelShow(newVal) {
      if (newVal) {
        this.addModleForm = isEmpty(this.addCasNoModelData) ? cloneDeep(this.addModleFormInit) : cloneDeep(this.addCasNoModelData)
        this.getPpeDepositoryListNoPage()
        // PPE类型字典
        this.ppeTypeList = this.getChemicalDictList('PPE_type')
        // PPE类型字典
        this.unitList = this.getChemicalDictList('PPE_unit')
        // 禁用输入功能
        this.$nextTick(() => {
          const auctionTimesCode = document.querySelector('.readonlyTreeSelect .ant-select-search__field');
          auctionTimesCode && auctionTimesCode.setAttribute('readonly', 'true');
        })
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
