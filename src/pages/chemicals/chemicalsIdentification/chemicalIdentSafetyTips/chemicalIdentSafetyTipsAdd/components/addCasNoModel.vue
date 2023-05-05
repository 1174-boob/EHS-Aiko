<template>
  <CommonModal :title="modelTitle" :visible="addCasNoModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model
        ref="addModleForm"
        :model="addModleForm"
        :rules="addModleFormRules"
        :label-col="{ style: { width: '80px' } }"
        :wrapper-col="{ style: { width: 'calc(100% - 80px)' } }"
        :colon="false"
        labelAlign="left"
      >
        <a-form-model-item class="flex" label="主要成分" prop="mainIngredient">
          <a-input v-model="addModleForm.mainIngredient" :maxLength="100" placeholder="请输入主要成分" />
        </a-form-model-item>
        <a-form-model-item class="flex" label="CAS NO" prop="csaNo">
          <a-input v-model="addModleForm.csaNo" :maxLength="100" placeholder="请输入CAS NO" />
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
export default {
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
  },
  computed: {
    // 弹窗标题
    modelTitle() {
      return this.addCasNoModelData.guid ? '编辑' : '新增'
    },
  },
  data() {
    return {
      spinning: false,
      loading: false,
      addModleFormInit: {
        mainIngredient: '',
        csaNo: '',
      },
      // model
      addModleForm: {},
      // 表单校验
      addModleFormRules: {
        mainIngredient: [
          { required: true, message: "主要成分不能为空", trigger: "blur" },
        ],
        csaNo: [
          { required: true, message: "CAS NO不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 确定
    addModleConfirm() {
      if (!formValidator.formAll(this, "addModleForm")) {
        return;
      }
      // console.log('确定', this.addModleForm)
      let moduleListNew = cloneDeep(this.moduleList)
      if (this.addModleForm.guid) {
        // 修改
        moduleListNew.some(item => {
          if (item.guid == this.addModleForm.guid) {
            item.mainIngredient = this.addModleForm.mainIngredient
            item.csaNo = this.addModleForm.csaNo
            return true
          }
        })
      } else {
        // 新增
        this.addModleForm.guid = this.guid()
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
  },
  watch: {
    addCasNoModelShow(newVal) {
      if (newVal) {
        this.addModleForm = isEmpty(this.addCasNoModelData) ? cloneDeep(this.addModleFormInit) : cloneDeep(this.addCasNoModelData)
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
