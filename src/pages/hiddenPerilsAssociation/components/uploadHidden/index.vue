<template>
  <CommonModal title="批量导入" :visible="addVisible" :cancelFn="addCancle">
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
        <a-form-model-item class="flex" label="选择图片" prop="list">
          <UploadBtnStyle
            :showAcceptText="true"
            :onlyShow="false"
            :multiple="true"
            :accept="['.jpg', '.jpeg', '.png']"
            :showUploadList="true"
            :btnText="'上传图片'"
            :btnType="'primary'"
            :limit="20"
            :btnIcon="false"
            @handleSuccess="handleSuccessPhoto"
          ></UploadBtnStyle>
        </a-form-model-item>
        <p>
          <b>为了准确快速导入数据，请仔细阅读以下要求：</b><br />
          1.编辑表单信息时，禁止修改和增加表头字段，否则会导致导入失败；<br />
          2.标*的为必填字段，请务必正确填写；<br />
          3.禁止修改下拉选项信息，并主动选择字段值；<br />
          4.整改期限：时间选择需要控制在发现时间后的0-7天范围内；<br />
          5.图片命名需与表单隐患数据对应，例如1-1，1-2对应表单第一条隐患数据；
        </p>
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
import { ImportHiddenAssociation } from "@/services/hiddenPerils.js";
export default {
  components: { UploadBtnStyle },
  props: {
    ////导入弹窗开关
    addVisible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      loading: false,
      actions: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.safe}/api/ehs/safe/association/hide/danger/upload`,
      labelCol: { span: 4 }, // 设置左边label宽度
      wrapperCol: { span: 17 }, // 设置右边表单宽度
      addForm: {
        list: [],
        fileListExel: [],
      },
      listt: [],
      addFormRules: {
        fileListExel: [
          { required: true, message: "文件不能为空", trigger: "change" },
        ],
        list: [{ required: true, message: "图片不能为空", trigger: "change" }],
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
      ImportHiddenAssociation({
        fileId: this.addForm.fileListExel[0].id,
        fileName: this.addForm.fileListExel[0].name,
        list: this.addForm.list,
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

    // 图片文件上传成功
    handleSuccessPhoto(fileList) {
      this.addForm.list = fileList;
      formValidator.formItemValidate(this, "list", "ruleForm");
    },

    // 批量导入成功文件
    handleSuccess(fileList) {
      this.addForm.fileListExel = fileList;
      formValidator.formItemValidate(this, "fileListExel", "ruleForm");
    },

    //关闭导入弹窗
    addCancle(flag) {
      this.addForm = { list: [], fileListExel: [] };
      this.$emit("closeAddVisible", flag);
    },

    //下载模板
    downTemplate() {
      window.open(
        window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/upload.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/upload.xlsx`
      );
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
