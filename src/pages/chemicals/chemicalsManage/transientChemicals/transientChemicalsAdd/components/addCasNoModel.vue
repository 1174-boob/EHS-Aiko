<template>
  <CommonModal :title="modelTitle" :visible="addCasNoModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="addModleForm" :model="addModleForm" :rules="addModleFormRules" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }" :colon="false" labelAlign="left">
        <a-form-model-item ref="chemicalsId" label="化学品名称" prop="chemicalsId">
          <a-input v-model.trim="addModleForm.chemicalsId" :maxLength="30" placeholder="请输入化学品名称" />
        </a-form-model-item>
        <a-form-model-item ref="chemicalComposition" class="flex" label="化学品组分" prop="chemicalComposition">
          <a-input v-model.trim="addModleForm.chemicalComposition" :maxLength="30" placeholder="请输入化学品组分" />
        </a-form-model-item>
        <a-form-model-item ref="chemicalUse" class="flex" label="化学品用途" prop="chemicalUse">
          <a-input v-model.trim="addModleForm.chemicalUse" :maxLength="30" placeholder="请输入化学品用途" />
        </a-form-model-item>
        <a-form-model-item ref="intoFactoryNum" class="flex" label="入厂数量" prop="intoFactoryNum">
          <a-input v-model.trim="addModleForm.intoFactoryNum" :maxLength="30" placeholder="请输入入厂数量" />
        </a-form-model-item>
        <a-form-model-item ref="chemicalsUnit" class="flex" label="单位" prop="chemicalsUnit">
          <a-input v-model.trim="addModleForm.chemicalsUnit" :maxLength="30" placeholder="请输入单位" />
        </a-form-model-item>
        <a-form-model-item ref="outFactory" class="flex" label="是否出厂" prop="outFactory">
          <a-radio-group v-model="addModleForm.outFactory">
            <a-radio v-for="item in requiredList" :key="item.key" :value="item.key">{{item.value}}</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="outFactoryDate" label="化学品出厂日期" prop="outFactoryDate" v-if="addModleForm.outFactory == 1">
          <a-date-picker style="width: 100%;" v-model="addModleForm.outFactoryDate" format="YYYY-MM-DD" placeholder="请选择化学品出厂日期" />
        </a-form-model-item>
        <a-form-model-item ref="hazardousProperties" class="flex" label="化学品危险性" prop="hazardousProperties">
          <a-input v-model.trim="addModleForm.hazardousProperties" :maxLength="30" placeholder="请输入化学品危险性" />
        </a-form-model-item>
        <a-form-model-item ref="useLocation" class="flex" label="化学品使用地点" prop="useLocation">
          <a-input v-model.trim="addModleForm.useLocation" :maxLength="30" placeholder="请输入化学品使用地点" />
        </a-form-model-item>
        <a-form-model-item ref="protectiveMeasures" class="flex" label="化学品使用防护措施" prop="protectiveMeasures">
          <a-input v-model.trim="addModleForm.protectiveMeasures" :maxLength="30" placeholder="请输入化学品使用防护措施" />
        </a-form-model-item>
        <a-form-model-item ref="usePerson" class="flex" label="化学品使用人员" prop="usePerson">
          <a-input v-model.trim="addModleForm.usePerson" :maxLength="30" placeholder="请输入化学品使用人员" />
        </a-form-model-item>
        <a-form-model-item ref="storageLocation" class="flex" label="化学品临时储存位置" prop="storageLocation">
          <a-input v-model.trim="addModleForm.storageLocation" :maxLength="30" placeholder="请输入化学品临时储存位置" />
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
    // 是否出厂字典
    requiredList: {
      type: Array,
      default: () => [],
    },
    // 化学品入厂日期
    intoFactoryDate: {}
  },
  data() {
    return {
      // 化学品名称list
      chemicalsList: [],
      spinning: false,
      loading: false,
      addModleFormInit: {
        chemicalsId: undefined,
        outFactoryDate: undefined,
        chemicalComposition: undefined,
        chemicalUse: undefined,
        intoFactoryNum: undefined,
        chemicalsUnit: undefined,
        outFactory: undefined,
        hazardousProperties: undefined,
        useLocation: undefined,
        protectiveMeasures: undefined,
        usePerson: undefined,
        storageLocation: undefined,
      },
      // 表单校验
      addModleFormRules: {
        chemicalsId: [{ required: true, message: "化学品名称不能为空", trigger: "blur" },],
        outFactoryDate: [{ required: true, validator: this.outFactoryDateValidator, trigger: "change", },],
        chemicalComposition: [{ required: true, message: "化学品组分不能为空", trigger: "blur" },],
        chemicalUse: [{ required: true, message: "化学品用途不能为空", trigger: "blur" },],
        intoFactoryNum: [{ required: true, validator: formValidator.onlyNumber, trigger: "blur", text: '入厂数量' },],
        chemicalsUnit: [{ required: true, message: "单位不能为空", trigger: "blur" },],
        outFactory: [{ required: true, message: "是否出厂不能为空", trigger: "change" },],
        hazardousProperties: [{ required: true, message: "化学品危险性不能为空", trigger: "blur" },],
        useLocation: [{ required: true, message: "化学品使用地点不能为空", trigger: "blur" },],
        protectiveMeasures: [{ required: true, message: "化学品使用防护措施不能为空", trigger: "blur" },],
        usePerson: [{ required: true, message: "化学品使用人员不能为空", trigger: "blur" },],
        storageLocation: [{ required: true, message: "化学品临时储存位置不能为空", trigger: "blur" },],
      },
      // model
      addModleForm: {},
    };
  },
  computed: {
    // 弹窗标题
    modelTitle() {
      return this.addCasNoModelData.guid ? '编辑临时化学品信息' : '新增临时化学品信息'
    },
  },
  methods: {
    // 化学品出厂日期
    outFactoryDateValidator(rule, value, callback) {
      let { required } = rule
      if (!value) {
        required ? callback(new Error(`化学品出厂日期不能为空`)) : callback();
      } else if (this.intoFactoryDate) {
        if (dayJs(value).diff(dayJs(this.intoFactoryDate).format('YYYY-MM-DD'), 'hour') < 0) {
          required ? callback(new Error(`出厂日期不能早于入场日期`)) : callback();
        } else {
          callback();
        }
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
      if (this.addModleForm.guid) {
        // 修改
        let index = moduleListNew.findIndex(item => item.guid == this.addModleForm.guid)
        this.addModleForm.outFactoryDate = this.addModleForm.outFactory == 1 ? dayJs(this.addModleForm.outFactoryDate).format("YYYY-MM-DD") : undefined
        moduleListNew.splice(index, 1, { ...this.addModleForm })
        this.$emit('intoFactoryDateAutoValidate')
      } else {
        // 新增
        this.addModleForm.guid = this.guid()
        this.addModleForm.outFactoryDate = this.addModleForm.outFactory == 1 ? dayJs(this.addModleForm.outFactoryDate).format("YYYY-MM-DD") : undefined
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
        // 化学品名称字典
        this.chemicalsList = this.getChemicalDictList('chemical')
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
