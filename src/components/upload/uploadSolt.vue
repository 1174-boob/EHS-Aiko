<template>
  <div :style="{ width }" class="upload-dragger-box" :class="imageUrl?'no-border':''">
    <a-upload-dragger name='multipartFile' :disabled="loading" :headers="headers" :action="action" :before-upload="beforeUpload" :showUploadList="showUploadList" @change="handleChange">
      <div :style="{ height: minHeight }" class="upload-dragger-box-main" v-if="!imageUrl">
        <a-icon class="upload-solt-ico" :type="loading?'loading':'plus'" />
        <span style="margin-top:10px;">{{typeText}}</span>
      </div>
      <div :style="{ height: minHeight }" class="upload-dragger-box-main" v-else>
        <img :src="imageUrl" class="upload-dragger-box-main-img" />
        <span class="upload-dragger-box-main-img-preview" @click.stop="previewImg(imageUrl)">预览</span>
      </div>
    </a-upload-dragger>
  </div>
</template>

<script>
import serviceNameList from '@/config/default/service.config.js'
export default {
  props: {
    // 组件大小
    width: {
      type: String,
      default: "430px",
    },
    height: {
      type: String,
      default: "199px",
    },
    // 上传框内类型文字
    typeText: {
      type: String,
      default: "图片",
    },
    // 是否显示列表
    showUploadList: {
      type: Boolean,
      default: true,
    },
    // 是否显示列表
    limit: {
      type: Number,
      default: 1,
    },
    //请求地址
    action: {
      type: String,
      default: window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/ehs-customer/api/file/uploadFile` : `ehs-customer/api/file/uploadFile`,
    },
    // 文件类型
    fileTypeArr: {
      type: Array,
      default: () => [
        "image/jpeg",
        "image/jpg",
        "image/png",
      ],
    },
    // 类型错误提示文字
    errTypeMsg: {
      type: String,
      default: "上传文件类型错误",
    },
    // 文件大小限制
    maxSize: {
      type: Number,
      default: 1,
    },
    // 成功的回调方法名
    handleSuccessName: {
      type: String,
      default: "handleSuccess",
    },
    // 失败的回调方法名
    handleErrorName: {
      type: String,
      default: "handleError",
    },
    // 是否是图片 如果是则会提供预览
    isImg: {
      type: Boolean,
      default: false,
    },
    // 是图片 图片id 供预览使用
    imageUrl: {
      type: String | Number,
      default: "",
    },
  },
  computed: {
    minHeight() {
      let isPx = this.height.indexOf("px") !== -1;
      let minHeight = null;
      if (isPx) {
        minHeight = parseFloat(this.height);
        minHeight = minHeight - 2 + "px";
      }
      return minHeight;
    },
  },
  data() {
    return {
      loading: false,
      fileSize: 1048576,
      headers: { Authorization: "", },
      file: null,
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
      // 存储当前文件对象
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
      // console.log('上传info', info);
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
      let { id, url } = res.data
      this.$antMessage.success(`上传成功`);
      this.$emit(this.handleSuccessName, res.data);
      setTimeout(() => {
        this.loading = false
      }, 600);
    },
    // 上传失败
    uploadError(res) {
      this.$antMessage.warn(`上传失败`);
      this.$emit(this.handleErrorName, res);
      setTimeout(() => {
        this.loading = false
      }, 600);
    },
    // 图片预览
    previewImg(imageUrl) {
      this.$hevueImgPreview(imageUrl);
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
@import "./index.less";
.no-border {
  .ant-upload-drag {
    border: 1px dashed transparent !important;
  }
}
.upload-solt-ico {
  font-size: 30px !important;
}
</style>
