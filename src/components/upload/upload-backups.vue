<template>
  <div :style="{ width }" class="upload-dragger-box">
    <a-upload-dragger name='multipartFile' :disabled="loading" :headers="headers" :action="action" :before-upload="beforeUpload" :showUploadList="showUploadList">
      <div :style="{ height: minHeight }" class="upload-dragger-box-main" v-if="!imageUrl">
        <p class="ant-upload-drag-icon">
          <a-icon :type="loading ? 'loading' : 'cloud-upload'" />
        </p>
        <p class="ant-upload-text">
          <span>点击</span>
          或拖拽{{ typeText }}上传
        </p>
      </div>
      <div :style="{ height: minHeight }" class="upload-dragger-box-main" v-else>
        <img :src="imageUrl" class="upload-dragger-box-main-img" />
        <!-- <span class="upload-dragger-box-main-img-preview">预览</span> -->
      </div>
    </a-upload-dragger>
  </div>
</template>

<script>
import { getUploadSTS, saveUploadFile, getUrlApi } from "@/services/api";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
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
    typeText: {
      type: String,
      default: "图片",
    },
    // 是否显示列表
    showUploadList: {
      type: Boolean,
      default: false,
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
      default: 2,
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
      stsObj: {},
      imageUrl: "",
    };
  },
  mounted() {
    this.headers.Authorization =
      "bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOm51bGwsImNvZGUiOiIyMDAwMCIsInVzZXJfbmFtZSI6ImJhaTEyMzQ1NiIsInNjb3BlIjpbImFsbCJdLCJleHAiOjE2MzQyNzc3MDEsInVzZXJOYW1lIjoiYmFpMTIzNDU2IiwidXNlcklkIjoiMTQxMjk2NjQ1OTc1OTUyOTk4NCIsImF1dGhvcml0aWVzIjpbIlJPTEVfQURNSU4iXSwianRpIjoiNzlkOWM0ZGQtNDUwMC00N2Y3LWE3NzMtMmVhNGY5MGRmOGViIiwiY2xpZW50X2lkIjoid2ViX2FwcCJ9.UZZHpvVDGA--OnaU1-NEf0zsvF1itnqDWw0KMuXI40JT7Bqj3fO-e1bp6YM_CVapjn7Yp5YU-0vvU05TKdjBfxD8VgR5ZAD0UqtpJme_d5E8eCJ6Tjff6bwSr9f1sp4LBNhHjoI10Gqhesg1Rvq6QY2Y1w1N-pQqDt234_8WNVVxCFf_xsssx8ikpQaGH4j758lhHgFmkftiHraO_d9tPo1ejCU8wJU_LKAvoMsv73Y8I32Jer-YhkjSibM-nmdf40RDL6df0m78-YlgS4b9IDubHQZR9kymK4YF8wxx2iVVFpPKlszPT9zFJcHV7lHnBl_CJVZtNwGBHzKQ_w8eWw";
  },
  methods: {
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
    // getSTS
    beforeUploadGetSTS(file) {
      console.log(1);
      let postData = {
        accessId: 0,
        fileName: file.name,
        fileSize: file.size,
        md5: "cf287ce217b95465d9d070b917cd85b0",
      };
      getUploadSTS(postData)
        .then((res) => {
          console.log("STS--", res);
          this.stsObj = res.data.data;
          this.uploadFn();
        })
        .catch((err) => {
          console.log(err);
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
          console.log("uploadFn-", res);
          this.getProcess();
        })
        .catch((err) => { });
    },
    // 获取 上传图片 结果
    getProcess() {
      let formData = { id: this.stsObj.id };
      getUrlApi(formData)
        .then((res) => {
          console.log("getUrl-", res);
          // 将STS数据传递给父级
          this.$emit(this.handleSuccessName, this.stsObj);
          // 获取base64
          getBase64(this.file, (imageUrl) => {
            this.imageUrl = imageUrl;
          });
        })
        .catch((err) => {
          // 将err数据传递给父级
          this.$emit(this.handleErrorName, err);
        });
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
  },
};
</script>

<style lang="less">
.upload-dragger-box {
  .ant-upload {
    padding: 0px !important;
  }
  .upload-dragger-box-main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    .ant-upload-drag-icon i {
      color: #cbcbcb !important;
    }
    .ant-upload-text {
      span {
        color: #267ed3;
      }
    }
    .upload-dragger-box-main-img {
      height: 100%;
      width: auto;
    }
    .upload-dragger-box-main-img-preview {
      text-align: center;
      cursor: pointer;
      box-sizing: border-box;
      position: absolute;
      height: 26px;
      line-height: 26px;
      left: -10px;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      font-size: 12px;
      color: #fff;
      z-index: 1;
    }
  }
}
</style>
