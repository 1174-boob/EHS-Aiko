<template>
  <div class="upload-can-remove-box" :class="{'only-read': record.options.disabled}" :title="record.options.disabled ? '禁用状态' : ''">
    <div>
      <a-upload
        :disabled="loading"
        accept=".jpg, .png, .jpeg"
        :action="action"
        list-type="picture-card"
        :headers="headers"
        :before-upload="beforeUpload"
        :file-list="fileList ? fileList : []"
        @preview="handlePreview"
        @change="handleChange"
      >
        <div class="upload-can-remove-box-main">
          <a-icon class="ant-upload-icon" :type="loading ? 'loading' : 'plus'" />
          <span class="ant-upload-text">文件上传</span>
        </div>
      </a-upload>
      <span class="ecertificateFileId-main-tishi">注：每个附件大小不超过{{maxSize}}M，支持格式：PNG、JPG、JPEG</span>
    </div>
  </div>
</template>

<script>
import uploadCanRemove from "@/mixin/uploadCanRemove";
export default {
  props: {
    record: {//组件数据
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
  mixins: [uploadCanRemove],
  created() {
  },
  data() {
    return {
    }
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
    handlePreview(item) {
      this.previewImg(item.url)
    },
    addFormUploadSuccess() {

    },
  }
};
</script>

<style lang="less">
@width: 84px;
@height: 84px;
.upload-can-remove-box {
  width: 100%;
  position: relative;
  .ant-upload {
    padding: 0px !important;
  }
  .ant-upload-list-picture-card-container {
    width: @width;
    height: @height;
    margin: 0 10px 0 0;
  }
  .ant-upload-list-picture-card .ant-upload-list-item {
    width: @width;
    height: @height;
    padding: 0;
    border: 0px solid #d9d9d9;
    border-radius: 2px;
    overflow: hidden;
  }
  .ant-upload.ant-upload-select-picture-card {
    width: @width;
    height: @height;
    margin-right: 0px;
    margin-bottom: 0px;
    background-color: #f1f4ff;
    border: 1px dashed #afccf2;
  }
  .upload-can-remove-box-main {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    background-color: #f1f4ff;
    .ant-upload-icon {
      color: #1472cf;
      font-size: 16px;
      margin-bottom: 5px;
    }
    .ant-upload-text {
      color: #267ed3;
      font-size: 14px;
    }
    .upload-can-remove-box-main-img {
      height: 100%;
      width: 100%;
    }
  }
  .ecertificateFileId-main-tishi {
    font-size: 12px;
    color: #999;
    display: block;
    line-height: 16px;
    margin-top: 12px;
    // position: absolute;
    // top: @height + 10px;
    // left: 0;
  }
  // 上传中 加载进度居中
  .ant-upload-list-item-uploading {
    display: flex;
    justify-content: center;
  }
}
</style>
