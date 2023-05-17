<template>
  <div>
    <a-upload name='multipartFile' :action="action" :headers="headers" :before-upload="beforeUpload" @change="handleChange">
      <a-button :loading="loading">
        <a-icon type="upload" />上传
      </a-button>
    </a-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      action: '',
      fileSize: 1048576,
      headers: { Authorization: "", },
      file: null,
      fileList: [],
      // 类型数组
      fileTypeArr: [],
      maxSize: 1,
    };
  },
  mounted() {
    // 设置header
    this.setAuthorization();
  },
  methods: {
    // 上传之前
    beforeUpload(file) {
      console.log("上传之前文件file--", file);
      if (!this.fileTypeAndSizeTest(file)) return false;
      // 存储文件列表和当前文件对象
      this.fileList = [...this.fileList, file];
      this.file = file;
      this.loading = true
    },
    // 检测文件类型和大小
    fileTypeAndSizeTest(file) {
      // 检测文件类型
      let isLegalType = this.fileTypeArr.includes(file.type);
      if (!isLegalType) this.$antMessage.warn(this.errTypeMsg);
      // 检测文件大小
      let isMoreThen = file.size - this.fileSize * this.maxSize < 0;
      if (!isMoreThen) this.$antMessage.warn(`文件大小不能超过${this.maxSize}M`);
      return isLegalType && isMoreThen;
    },
    // 上传状态改变
    handleChange(info) {
      console.log('上传info', info);
      // 状态有：uploading done error removed
      let uploadState = info.file.status
      switch (uploadState) {
        case "uploading":
          console.log('文件上传中。。。');
          break;
        case "done":
          this.uploadDone(info.file.response);
          break;
        case "error":
          this.uploadError(info.file.response);
          break;
        case "removed":
          this.removeFile(info.file)
          break;
        default:
          console.log('文件上传状态异常。。。');
      }
      setTimeout(() => {
        this.loading = false
      }, 600);
    },
    // 上传成功
    uploadDone(res) {
      this.$antMessage.success(`上传成功`);
      this.uploadSuccessCallback && this.uploadSuccessCallback(res)
    },
    // 上传失败
    uploadError(res) {
      this.$antMessage.warn(`上传失败`);
      this.uploadErrorCallback && this.uploadErrorCallback(res)
    },
    // 删除上传列表某项
    removeFile(file) {
      this.fileList = this.fileList.filter((res) => {
        return res.uid !== file.uid;
      });
      this.uploadRemoveCallback && this.uploadRemoveCallback(this.fileList)
    },
    // 图片预览
    previewImg(imgUrl) {
      this.$hevueImgPreview(imgUrl);
    },
    // 设置header
    setAuthorization() {
      const token_type = sessionStorage.getItem("token_type");
      const token = sessionStorage.getItem("access_token");
      this.headers.Authorization = token_type + " " + token;
    },
  },
};
</script>

<style lang="less">
</style>
