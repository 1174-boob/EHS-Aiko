<template>
  <CommonModal :title="modelTitle" :visible="addSpecialModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="addModleForm" :model="addModleForm" :rules="addModleFormRules" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }" :colon="false" labelAlign="left">
        <a-form-model-item ref="outSpecialPerson" label="特种作业员姓名" prop="outSpecialPerson">
          <a-input v-model.trim="addModleForm.outSpecialPerson" :maxLength="20" placeholder="请输入特种作业员姓名"></a-input>
        </a-form-model-item>
        <a-form-model-item ref="outCertificateType" label="证书类别" prop="outCertificateType">
          <a-input v-model.trim="addModleForm.outCertificateType" :maxLength="50" placeholder="请输入证书类别"></a-input>
        </a-form-model-item>
        <a-form-model-item ref="outCertificateNumber" label="证书编号" prop="outCertificateNumber">
          <a-input v-model.trim="addModleForm.outCertificateNumber" :maxLength="50" placeholder="请输入证书编号"></a-input>
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
        outSpecialPerson: [{ required: true, message: "特种作业员姓名不能为空", trigger: "blur" },],
        outCertificateType: [{ required: true, message: "证书类别不能为空", trigger: "blur" },],
        outCertificateNumber: [{ required: true, message: "证书编号不能为空", trigger: "blur" },],
      },
    };
  },
  computed: {
    // 弹窗标题
    modelTitle() {
      return this.addSpecialModelData.guid ? '编辑特种作业员' : '新增特种作业员'
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
