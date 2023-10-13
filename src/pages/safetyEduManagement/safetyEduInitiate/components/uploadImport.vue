<template>
  <CommonModal title="批量导入" :visible="uploadImportShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model
        ref="ruleForm"
        :model="addForm"
        :rules="addFormRules"
        :label-col="{ style: { width: '130px' } }"
        :wrapper-col="{ style: { width: 'calc(100% - 130px)' } }"
        :colon="false"
        labelAlign="left"
      >
        <a-form-model-item>
          <span class="scal" @click="downTemplate">下载导入模板</span>
        </a-form-model-item>
        <a-form-model-item class="flex" label="选择文件" prop="fileListExel">
          <UploadBtnStyle
            :showAcceptText="true"
            :onlyShow="false"
            :accept="['.xlsx']"
            :showUploadList="true"
            :btnText="'上传文件'"
            :btnType="'primary'"
            :limit="1"
            :btnIcon="false"
            @handleSuccess="handleSuccess"
            :data="addForm"
          ></UploadBtnStyle>
        </a-form-model-item>
      </a-form-model>
    </template>
    <template slot="btn">
      <a-button @click="closeModel">取消</a-button>
      <a-button
        class="m-l-15"
        type="primary"
        :loading="loading"
        @click="okClick"
        >确定</a-button
      >
    </template>
  </CommonModal>
</template>

<script>
import UploadBtnStyle from "@/components/upload/uploadStyleXt.vue";
import { formValidator } from "@/utils/clx-form-validator.js";
import { responsibilityFileImport } from "@/services/api.js";
export default {
  components: { UploadBtnStyle,},
  model: {
    prop: 'uploadImportShow',
  },
  props: {
    //导入弹窗开关
    uploadImportShow: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      loading: false,
      labelCol: { span: 4 }, // 设置左边label宽度
      wrapperCol: { span: 17 }, // 设置右边表单宽度
      addForm: {
        fileListExel:[]
      },
      addFormRules: {
        fileListExel: [
          { required: true, message: "文件不能为空", trigger: "change" },
        ],
      },
    };
  },

  methods: {
    //确认上传
    okClick() {
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      this.loading = true;
      responsibilityFileImport({
        fileId: this.addForm.fileListExel[0].id,
        // fileName: this.addForm.fileListExel[0].name,
      })
        .then((res) => {
          this.$antMessage.success("导入成功");
          this.closeModel(true);
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },

    // 批量导入成功文件
    handleSuccess(fileList) {
      this.addForm.fileListExel = fileList;
      formValidator.formItemValidate(this, "fileListExel", "ruleForm");
    },

    // 取消-关闭model
    closeModel() {
      this.$emit('input', false)
    },

    //下载模板
    downTemplate() {
      window.open(
        window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/axehs/ehs/证书批量导入（内部员工）.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/axehs/ehs/证书批量导入（内部员工）.xlsx`
      );
    },
  },

  watch: {
    uploadImportShow(newVal) {
      if (newVal) {

      } else {
        setTimeout(() => {
          
        }, 100);
      }
    }
  }
};
</script>

<style lang='less' scoped>
.scal {
  cursor: pointer;
  &:hover {
    color: #0067cc;
  }
}
</style>
