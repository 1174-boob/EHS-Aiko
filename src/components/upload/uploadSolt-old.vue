<template>
  <div :style="{ width }" class="upload-dragger-box" :class="imageUrl?'no-border':''">
    <a-upload-dragger name='multipartFile' :disabled="loading" :headers="headers" :action="action" :before-upload="beforeUpload" :showUploadList="showUploadList" :remove="removeFile" :file-list="fileList">
      <div :style="{ height: minHeight }" class="upload-dragger-box-main" v-if="!imageUrl">
        <slot></slot>
      </div>
      <div :style="{ height: minHeight }" class="upload-dragger-box-main" v-else>
        <img :src="imageUrl" class="upload-dragger-box-main-img" />
        <span class="upload-dragger-box-main-img-preview" @click.stop="previewImg(imageUrl)">预览</span>
      </div>
    </a-upload-dragger>
  </div>
</template>

<script>
import { getUploadSTS, saveUploadFile, getUrlApi } from "@/services/api";
import SparkMD5 from "spark-md5";
import { baseUrlUseForImg } from "@/utils/request.js";
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
      default: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    },
    // 文件类型
    fileTypeArr: {
      type: Array,
      default: () => [
        "image/jpeg",
        "image/png",
        "text/plain",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
    imgId: {
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
      headers: {
        Authorization: "",
      },
      file: null,
      fileList: [],
      // 接口获取的sts对象
      stsObj: {},
      imageUrl: "",
    };
  },
  mounted() {
    // 设置header
    this.setAuthorization();
  },
  methods: {
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
    // 上传之前
    beforeUpload(file) {
      console.log("file--", file);
      if (!this.fileTypeAndSizeTest(file)) return false;
      // 存储文件列表和当前文件对象
      this.fileList = [...this.fileList, file];
      this.file = file;
      // 获取STS
      this.beforeUploadGetSTS(file);
      return false;
    },
    // 检测文件类型和大小
    fileTypeAndSizeTest(file) {
      // 检测文件类型
      let isJpgOrPng = this.fileTypeArr.includes(file.type);
      if (!isJpgOrPng) this.$antMessage.warn(this.errTypeMsg);
      // 检测文件大小
      const isLt2M = file.size - this.fileSize * this.maxSize < 0;
      if (!isLt2M) this.$antMessage.warn(`文件大小不能超过${this.maxSize}M`);
      return isJpgOrPng && isLt2M;
    },
    // getSTS
    beforeUploadGetSTS(file) {
      this.getFileMd5(file).then((res) => {
        // console.log('md5-', res);
        let postData = {
          accessId: 0,
          fileName: file.name,
          fileSize: file.size,
          md5: res,
        };
        getUploadSTS(postData)
          .then((res) => {
            console.log("STS--", res);
            this.stsObj = res.data;
            this.uploadFn();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    // 获取文件md5
    getFileMd5(file) {
      var fileReader = new FileReader();
      var spark = new SparkMD5.ArrayBuffer();
      // 获取文件二进制数据
      fileReader.readAsArrayBuffer(file);
      return new Promise((resove, reject) => {
        fileReader.onload = function (e) {
          spark.append(e.target.result);
          let md5 = spark.end();
          resove(md5);
        };
      });
    },
    // 上传文件
    uploadFn() {
      const formData = new FormData();
      formData.append("file", this.file);
      formData.append("sts", this.stsObj.sts);
      formData.append("seq", 0);
      saveUploadFile(formData)
        .then((res) => {
          // console.log('uploadFn-', res);
          this.getProcess();
        })
        .catch((err) => { });
    },
    // 获取 上传 结果
    getProcess() {
      let formData = { id: this.stsObj.id };
      getUrlApi(formData)
        .then((res) => {
          console.log("getUrl-", res);
          this.fileList = this.fileList.slice(-this.limit);
          this.imageUrl = this.isImg
            ? `${baseUrlUseForImg}/boeplat-customer/api/bps/file/download?id=${this.stsObj.id}&isOnline=true`
            : "";
          // 将STS数据传递给父级
          this.$emit(this.handleSuccessName, this.stsObj);
        })
        .catch((err) => {
          // 将err数据传递给父级
          this.$emit(this.handleErrorName, err);
        });
    },
    removeFile(file) {
      // console.log('项目移除了', file);
      this.fileList = this.fileList.filter((res) => {
        return res.uid !== file.uid;
      });
      // this.fileList = this.fileList.slice(this.limit);
    },
  },
  watch: {
    imgId(newVal) {
      if (newVal) {
        this.imageUrl = `${baseUrlUseForImg}/boeplat-customer/api/bps/file/download?id=${newVal}&isOnline=true`;
      }
    },
  },
};
</script>

<style lang="less">
@import "./index.less";
.no-border {
  .ant-upload-drag {
    border: 0px dashed #d9d9d9 !important;
  }
}
</style>
