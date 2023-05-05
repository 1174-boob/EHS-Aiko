<template>
  <div class="upload-dialog">
    <a-modal :visible="visible" title="数据批量导入" :maskClosable="false" @cancel="cancelFn" destroyOnClose :footer="null">
      <a-form-model :model="uploadForm" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" labelAlign="right">
        <a-form-model-item label="选择文件" prop="companyName">
          <a-upload :headers="headers" :action="action" :before-upload="beforeUpload" :showUploadList="{showRemoveIcon:false}" @change="handleChange">
            <a-button>
              <a-icon type="upload" />上传文件
            </a-button>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
      <div class="tips">
        *Excel导入模板（危险作业上报）：
        <span class="color-0067cc cursor-pointer" @click="downPlate">点击下载</span>
      </div>
    </a-modal>
  </div>
</template>

<script>
import serviceNameList from '@/config/default/service.config.js'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    //请求地址
    action: {
      type: String,
      default: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.danger}/api/file/resource/upload`,
    },
  },
  data() {
    return {
      labelCol: { span: 4 }, // 设置左边label宽度
      wrapperCol: { span: 17 }, // 设置右边表单宽度
      uploadForm: {

      },
      fileList: [],
      headers: { Authorization: "", },
    }
  },
  mounted() {
    // 设置header
    this.setAuthorization();
  },
  methods: {
    cancelFn() {
      this.$emit('cancelFn', false)
    },
    // 上传之前
    beforeUpload(file) {
      console.log("上传之前文件file--", file);
      // if (!this.fileTypeAndSizeTest(file)) return false;
      // 存储文件列表和当前文件对象
      this.fileList = [...this.fileList, file];
      this.file = file;
      this.loading = true;
      console.log("上传文件fileList--", this.fileList);
    },
    // 检测文件类型和大小
    fileTypeAndSizeTest(file) {
      // 检测文件类型
      let isLegalType = this.fileTypeArr.includes(file.type);
      if (!isLegalType) this.$antMessage.warn(this.errTypeMsg);
      // 检测文件大小
      // let isMoreThen = file.size - this.fileSize * this.maxSize < 0;
      // if (!isMoreThen) this.$antMessage.warn(`文件大小不能超过${this.maxSize}M`);
      // return isLegalType && isMoreThen;
      return isLegalType;
    },
    // 上传状态改变
    handleChange(info) {
      console.log('上传info', info);
      console.log('上传状态改变1', info.file.status);
      // 状态有：uploading done error removed
      let uploadState = info.file.status
      switch (uploadState) {
        case "uploading":
          break;
        case "done":
          this.uploadDone(info.file.response);
          break;
        case "error":
          this.uploadError(info.file.response);
          break;
        case "removed":
          break;
        default:
          console.log('文件上传状态异常。。。');
      }
    },
    // 上传成功
    uploadDone(res) {
      console.log('上传成功', res.data);
      if (res.code != 20000) {
        this.$antMessage.error(res.message);
      } else {
        let { id, url } = res.data
        this.$antMessage.success(`上传成功`);
        // this.$emit(this.handleSuccessName, res.data);
        setTimeout(() => {
          this.loading = false
        }, 600);
      }
    },
    // 上传失败
    uploadError(res) {
      this.$antMessage.warn(`上传失败`);
      // this.$emit(this.handleErrorName, res);
      setTimeout(() => {
        this.loading = false
      }, 600);
    },
    // 设置header
    setAuthorization() {
      const token_type = sessionStorage.getItem("token_type");
      const token = sessionStorage.getItem("access_token");
      this.headers.Authorization = token_type + " " + token;
    },
    // 下载模板
    downPlate() {
      console.log('下载模板');
    }
  }
}
</script>

<style lang='less' scoped>
</style>