<template>
  <CommonModal :title="modelTitle" :visible="addSpecialModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="addModleForm" :model="addModleForm" :rules="addModleFormRules" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :colon="false" labelAlign="left">
        <a-form-model-item ref="oxygen" label="氧气含量(%)" prop="oxygen">
          <a-input v-model.trim="addModleForm.oxygen" :maxLength="20" placeholder="请输入氧气含量(%)"></a-input>
        </a-form-model-item>
        <a-form-model-item ref="combustibleGas" label="可燃气浓度(%LEL)" prop="combustibleGas">
          <a-input v-model.trim="addModleForm.combustibleGas" :maxLength="20" placeholder="请输入可燃气浓度(%LEL)"></a-input>
        </a-form-model-item>
        <a-form-model-item ref="carbon" label="一氧化碳(PPM)" prop="carbon">
          <a-input v-model.trim="addModleForm.carbon" :maxLength="20" placeholder="请输入一氧化碳(PPM)"></a-input>
        </a-form-model-item>
        <a-form-model-item ref="poisonGas" label="毒害气体(PPM)" prop="poisonGas">
          <a-input v-model.trim="addModleForm.poisonGas" :maxLength="20" placeholder="请输入毒害气体(PPM)"></a-input>
        </a-form-model-item>
        <a-form-model-item ref="detectPerson" label="检测人" prop="detectPerson">
          <a-input v-model.trim="addModleForm.detectPerson" :maxLength="20" placeholder="请输入检测人"></a-input>
        </a-form-model-item>
        <a-form-model-item ref="detectTime" label="检测时间" prop="detectTime">
          <a-date-picker style="width:100%;" v-model="addModleForm.detectTime" show-time valueFormat="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" placeholder="请选择检测时间" />
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
import dayJs from 'dayjs';
export default {
  model: {
    prop: "addSpecialModelShow",
  },
  props: {
    // 弹窗显示隐藏
    addSpecialModelShow: {
      type: Boolean,
      default: false,
    },
    // 每一条数据
    addSpecialModelData: {
      type: Object,
      default: () => { },
    },
    // 全部数据
    moduleList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      addModleForm: {},
      // 表单校验
      addModleFormRules: {
        oxygen: [{ required: true, message: "氧气含量(%)不能为空", trigger: "blur" },],
        combustibleGas: [{ required: true, message: "可燃气浓度(%LEL)不能为空", trigger: "blur" },],
        carbon: [{ required: true, message: "一氧化碳(PPM)不能为空", trigger: "blur" },],
        poisonGas: [{ required: true, message: "毒害气体(PPM)不能为空", trigger: "blur" },],
        detectPerson: [{ required: true, message: "检测人不能为空", trigger: "blur" },],
        detectTime: [{ required: true, message: "检测时间不能为空", trigger: "change" },],
      },
    };
  },
  computed: {
    // 弹窗标题
    modelTitle() {
      return this.addSpecialModelData.guid ? '编辑作业环境测定' : '新增作业环境测定'
    },
  },
  methods: {
    // 确定
    addModleConfirm() {
      if (!formValidator.formAll(this, "addModleForm")) return;
      // console.log('确定', this.addModleForm)
      let moduleListNew = cloneDeep(this.moduleList)
      if (this.addModleForm.guid) {
        // 修改
        let index = moduleListNew.findIndex(item => item.guid == this.addModleForm.guid)
        moduleListNew.splice(index, 1, { ...this.addModleForm })
      } else {
        // 新增
        this.addModleForm.guid = this.guid()
        moduleListNew.push(this.addModleForm)
      }
      this.$emit('changeSpecialModuleList', moduleListNew)
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
    addSpecialModelShow(newVal) {
      if (newVal) {
        this.addModleForm = isEmpty(this.addSpecialModelData) ? {} : cloneDeep(this.addSpecialModelData)
      } else {
        setTimeout(() => {
          this.addModleForm = {}
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
