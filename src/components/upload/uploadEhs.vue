<template>
  <!-- :default-file-list="defaultFileList" -->
  <a-upload :accept="accept" name="multipartFile" :action="action" :headers="headers" :default-file-list="defaultFileList" :before-upload="beforeUpload" :file-list="fileList" :remove="removeFile" @change="handleChange" multiple>
    <a-button>
      <a-icon type="upload" />上传文件
    </a-button>
    <p style="margin-top:6px">支持扩展名：{{accept.replace(/,/g,' ')}}</p>
  </a-upload>
</template>

<script>
import serviceNameList from '@/config/default/service.config.js'
export default {
  props: {
    //请求地址
    action: {
      type: String,
      default: window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/ehs-customer/api/file/uploadFile` : `ehs-customer/api/file/uploadFile`,
    },
    fileLists: {
      type: Array,
    },
    disabled: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: '.xlsx,.doc,.docx,.pdf,.jpg,.jpeg,.png',
    }
  },
  data() {
    return {
      fileList: [],
      headers: { Authorization: "" },
      defaultFileList: [
        // {
        //   uid: '1',
        //   name: 'xxx.png',
        //   status: 'done',
        //   response: 'Server Error 500',
        //   url: 'http://www.baidu.com/xxx.png',
        // },
      ],
    }
  },
  mounted() {
    // 设置header
    this.setAuthorization();
  },
  watch: {
    fileLists: {
      handler(newV) {
        this.fileList = newV
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 上传之前
    beforeUpload(file) {
      // console.log("上传之前文件file--", file);
      // console.log("kkk==",file.name,file.uid);
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
      // console.log('上传状态改变1', info.fileList[0].name);
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
      console.log('上传成功', res);
      if (res.code != 20000) {
        this.$antMessage.error(res.message);
      } else {
        // let { id, url } = res.data
        this.$antMessage.success(`上传成功`);
        // const data = {
        //   ...res.data,
        //   name:this.fileName,
        //   uid:this.fileUid
        // }
        // this.$emit("handleSuccess", res.data.id);
        this.$emit("handleSuccess", this.fileList);
        setTimeout(() => {
          this.loading = false
        }, 600);
      }
    },
    // 上传失败
    uploadError(res) {
      // console.log('上传失败',res);
      this.$antMessage.warn(`上传失败`);
      // this.$emit(this.handleErrorName, res);
      setTimeout(() => {
        this.loading = false
      }, 600);
    },
    // 移除文件
    removeFile(file) {
      console.log('项目移除了', file);
      this.fileList = this.fileList.filter((res) => {
        return res.uid !== file.uid;
      });
      this.$antMessage.success(`移除成功`);
      // this.$emit("handleSuccess",file.response.data.id);
      this.$emit("handleSuccess", this.fileList);
      console.log("fileList--", this.fileList);
    },
    // 设置header
    setAuthorization() {
      const token_type = sessionStorage.getItem("token_type");
      const token = sessionStorage.getItem("access_token");
      this.headers.Authorization = token_type + " " + token;
    },
  }
}
</script>

<style scoped lang="less">
.accept-file-type{
  font-size:12px;
  margin-top:5px;
}
</style>