<template>
  <div id="fileUpload" :class="{'only-read': record.options.disabled}" :title="record.options.disabled ? '禁用状态' : ''">
    <div>
      <a-upload
        :disabled="record.options.disabled"
        name='multipartFile'
        :accept="fileLayoutStr"
        @change="handleChange"
        :before-upload="beforeUpload"
        :file-list="fileList ? fileList : []"
        :action="action"
        :headers="headers"
      >
        <a-button type="primary">
          <a-icon type="upload" />导入文件
        </a-button>
      </a-upload>
      <div class="ecertificateFileId-main-tishi">
        注：每个附件大小不超过{{record.options.maxSize}}M，支持格式：
        <span v-for="(item, index) in record.options.fileLayout" :key="index">
          {{item}}
          <span v-if="index < record.options.fileLayout.length-1">、</span>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { importFile } from "@/services/api";
import serviceNameList from '@/config/default/service.config.js';
export default {
  props: {
    record: {// 组件数据
      type: Object,
      required: true
    },
    models: {// 表单数组 
      type: Object,
      required: true
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    preview: {// 是否当前是预览
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadUrl: process.env.VUE_APP_API_BASE_URL + `${serviceNameList.btpFile}/api/file/resource/upload`,//需要代理
      fileLayoutStr: "",
      action: window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/ehs-customer/api/file/uploadFile` : `ehs-customer/api/file/uploadFile`,
      loading: false,
      fileSize: 1048576,
      headers: { Authorization: "", },
      file: null,
    }
  },
  created() {
    this.fileLayoutStr = this.record.options.fileLayout.length ? this.record.options.fileLayout.join() : "";
  },
  mounted() {
    // 设置header
    this.setAuthorization();
  },
  computed: {
    fileList: {
      get: function () {
        return this.models[this.record.model];
      },
      set: function (value) {
        this.models[this.record.model] = value;
      }
    }
  },
  methods: {
    // 设置header
    setAuthorization() {
      const token_type = sessionStorage.getItem("token_type");
      const token = sessionStorage.getItem("access_token");
      this.headers.Authorization = token_type + " " + token;
    },
    // 上传之前
    beforeUpload(file) {
      // if (!this.fileTypeAndSizeTest(file)) return false;
      // 存储当前文件对象
      this.file = file;
      this.loading = true
    },
    // 上传状态改变
    handleChange(info) {
      let uploadState = info.file.status
      let { fileList } = info
      this.fileList = [...fileList]
      switch (uploadState) {
        case "uploading":
          break;
        case "done":
          this.uploadDone(info.file.response);
          break;
        case "error":
          this.fileList.pop()
          this.uploadError(info.file.response);
          break;
        case "removed":
          this.removeFile(info.file)
          break;
        default:
          this.fileList.pop()
      }
    },
    // 上传成功
    uploadDone(res) {
      let { id, url } = res.data
      let { uid, name } = this.file
      let fileData = { id, uid, name, status: 'done', url, }
      this.fileList.pop()
      this.fileList = [...this.fileList, fileData];
      this.$antMessage.success(`上传成功`);
      // this.$emit(this.handleSuccessName, this.fileList);
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
    // 删除上传列表某项
    removeFile(file) {
      this.fileList = this.fileList.filter((res) => {
        return res.uid !== file.uid;
      });
      // this.$emit(this.handleSuccessName, this.fileList);
    },
    customRequest(data) { // 上传提交
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('token', "token")
      this.saveFile(formData, data)
    },
    saveFile(formData, options) {
      importFile(formData).then(res => {
        this.fileList.push(res.data);
        // this.models[this.record.model]
        options.onSuccess();　　// 上传成功后结束文件上传转圈状态
      }).catch(err => console.log(err))
    },
  }
}
</script>
<style scoped>
.ecertificateFileId-main-tishi {
  font-size: 12px;
  color: #999;
  display: block;
  line-height: 16px;
  margin-top: 12px;
}
</style>