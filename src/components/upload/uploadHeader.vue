<template>
  <div class="upload_btn_header">
    <a-upload
      name='multipartFile'
      list-type="picture-card"
      class="avatar-uploader"
      :show-upload-list="false"
      :action="action"
      :before-upload="beforeUpload"
      @change="handleChange"
      :headers="headers"
      @changeList="changeList"
      :isAlt="isAlt"
    >
      <div class="upload_btn_header_div">
        <img v-show="imgTwoUrl" :src="imgTwoUrl" alt="avatar" />
      </div>
    </a-upload>
  </div>
</template>

<script>
import defUrl from "@/assets/images/overview/touxiangtong.svg";
import serviceNameList from "@/config/default/service.config.js";
export default {
  props: ["imageUrl", "isAlt"],
  data() {
    return {
      defUrl,
      fileList: [
        // {
        //   uid: '-1',
        //   name: 'image.png',
        //   status: 'done',
        //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
      ],
      imgTwoUrl: "",
      fileSize: 1048576,
      headers: { Authorization: "" },
      file: null,
      // 列表最多保留几项
      limit: 1,
      //请求地址
      action: window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/ehs-customer/api/file/uploadFile` : `ehs-customer/api/file/uploadFile`,
      // 文件类型
      fileTypeArr: ["image/jpeg", "image/jpg", "image/png"],
      // 类型错误提示文字
      errTypeMsg: "上传文件类型错误",
      // 文件大小限制
      maxSize: 1,
    };
  },
  mounted() {
    this.setAuthorization();
    this.imgTwoUrl = this.imageUrl; //存储img
  },
  methods: {
    //回显
    changeList(filelist) {
      this.fileList = filelist.length ? filelist : [];
    },

    // 上传之前
    beforeUpload(file) {
      if (!this.fileTypeAndSizeTest(file)) return false;
      // 存储当前文件对象
      this.file = file;
    },

    // 检测文件类型和大小
    fileTypeAndSizeTest(file) {
      // 检测文件类型
      let isLegalType = this.fileTypeArr.includes(file.type);
      if (!isLegalType) this.$message.warn(this.errTypeMsg);
      // 检测文件大小
      let isMoreThen = file.size - this.fileSize * this.maxSize < 0;
      if (!isMoreThen) this.$message.warn(`文件大小不能超过${this.maxSize}M`);
      return isLegalType && isMoreThen;
    },

    // 上传状态改变
    handleChange(info) {
      // 状态有：uploading done error removed
      let uploadState = info.file.status;
      let { fileList } = info;
      this.fileList = [...fileList];
      switch (uploadState) {
        case "uploading":
          break;
        case "done":
          this.uploadDone(info.file.response);
          break;
        case "error":
          this.fileList.pop();
          this.uploadError(info.file.response);
          break;
        case "removed":
          this.removeFile(info.file);
          this.$emit(this.handleSuccessName, this.fileList);
          break;
        default:
          this.fileList.pop();
          console.log("文件上传状态异常。。。");
      }
    },
    // 上传成功
    uploadDone(res) {
      let { id, url } = res.data;
      let { uid, name } = this.file;
      let fileData = { id, uid, name, status: "done", url };
      this.fileList.pop();
      this.fileList = [fileData];
      this.imgTwoUrl = res.data.url;
      if (this.isAlt) {
        this.$message.success(`上传成功`);
      }
      this.$emit("handleSuccessName", this.fileList); //上传成功把id返回
    },

    // 上传失败
    uploadError(res) {
      this.$message.warn(`上传失败`);
      this.$emit(this.handleErrorName, res);
      setTimeout(() => {
        this.loading = false;
      }, 600);
    },

    // 删除上传列表某项
    removeFile(file) {
      this.fileList = this.fileList.filter((item) => {
        return item.uid !== file.uid;
      });
      this.$emit(this.handleRemoveName, this.fileList);
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

    handlePreview(item) {
      this.previewImg(item.url);
    },
  },
  watch: {
    imageUrl() {
      this.imgTwoUrl = this.imageUrl; //存储img
    },
  },
};
</script>

<style lang="less" scoped>
.upload_btn_header {
  ::v-deep.ant-upload-list-item-uploading-text {
    display: none !important;
  }
  ::v-deep.ant-upload-select-picture-card {
    background: none !important;
    border: none !important;
    width: 40px !important;
    height: 40px !important;
    > span {
      padding: 0 !important;
    }
    div {
      width: 100%;
      height: 100%;
    }

    .upload_btn_header_div {
      width: 40px !important;
      height: 40px !important;
      border-radius: 50%;
      background-image: url("../../assets/images/overview/touxiangtong.svg");
      background-repeat: no-repete;
      background-size: 100% 100%;
      &:hover {
        position: relative;
        z-index: 999;
        background-image: url("../../assets/images/overview/touxiangclicktong.svg");
        img {
          display: none !important;
        }
      }
      img {
        width: 40px !important;
        height: 40px !important;
        border-radius: 50%;
      }
    }
  }
  ::v-deep.ant-upload-list-picture-card-container {
    width: 40px !important;
    height: 40px !important;
    border-radius: 50% !important;
  }
  ::v-deep.ant-upload-list-item {
    width: 40px !important;
    height: 40px !important;
    padding: 0 !important;
    border-radius: 50% !important;
    .ant-upload-list-item-info {
      border-radius: 50% !important;
    }
  }
  ::v-deep.ant-upload-list-item-uploading {
  }
}
:v-deep .ant-upload-list-item {
  // width: 40px !important;
  // height: 40px !important;
  // border-radius: 50% !important;
  background-color: none !important;
  background-image: url("../../assets/header/loadingback.gif") !important;
  background-repeat: no-repete !important;
  background-size: 100% 100% !important;
}
// ::v-deep.ant-upload-list-picture-card {

// }
</style>
