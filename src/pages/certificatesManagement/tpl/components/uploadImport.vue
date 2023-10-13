<template>
  <CommonModal title="批量导入" :visible="importVisible" :cancelFn="addCancle">
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
      <a-button @click="addCancle">取消</a-button>
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
import serviceNameList from "@/config/default/service.config.js";
import UploadBtnStyle from "@/components/upload/uploadStyleXt.vue";
import { formValidator } from "@/utils/clx-form-validator.js";
import { getCertificateImport } from "@/services/api.js";
export default {
  components: { UploadBtnStyle,},
  props: {
    ////导入弹窗开关
    importVisible: {
      type: Boolean,
      default: false,
    },
    inOutType: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      loading: false,
      labelCol: { span: 4 }, // 设置左边label宽度
      wrapperCol: { span: 17 }, // 设置右边表单宽度
      addForm: {
        fileListExel: [],
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
      console.log(this.inOutType,'inOutType');
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      this.loading = true;
      getCertificateImport({
        fileId: this.addForm.fileListExel[0].id,
        inOutType: this.inOutType
        // fileName: this.addForm.fileListExel[0].name,
      })
        .then((res) => {
          this.$antMessage.success("导入成功");
          this.addCancle(true);
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },

    // 批量导入成功文件
    handleSuccess(fileList) {
      console.log('fileListccc',fileList);
      this.addForm.fileListExel = fileList;
      formValidator.formItemValidate(this, "fileListExel", "ruleForm");
    },

    //关闭导入弹窗
    addCancle(flag) {
      this.addForm.fileListExel = [];
      this.$emit("closeAddVisible", flag);
    },

    //下载模板
    downTemplate() {
      if(this.inOutType == 1){
        window.open(
          window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/证书批量导入（内部员工）.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/证书批量导入（内部员工）.xlsx`
        );
      } else if (this.inOutType == 2){
        window.open(
          window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/证书批量导入（外部员工）.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/证书批量导入（外部员工）.xlsx`
        );
      }
    },
  },
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
