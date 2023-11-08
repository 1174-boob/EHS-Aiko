<template>
  <div class="me-upload-can-remove-box" :class="[fileList.length?'padding-top8':'']">
    <a-upload
      name="multipartFile"
      :multiple="multiple"
      :action="action"
      list-type="picture-card"
      :disabled="loading || disabled"
      :headers="headers"
      :before-upload="beforeUpload"
      :file-list="fileList"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div class="upload-can-remove-box-main" v-if="fileList.length < limit">
        <a-icon class="ant-upload-icon" :type="loading ? 'loading' : 'plus'" />
      </div>
    </a-upload>
  </div>
</template>

<script>
import uploadCanRemove from "@/mixin/uploadCanRemoveHaslimit";
export default {
  mixins: [uploadCanRemove],
  props: {
    headImgs: {
      type: Array,
      default: () => [],
    },
    // 批量上传
    multiple: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      fileList: [
        // {
        // uid: '-1',
        // name: 'image.png',
        // status: 'done',
        // url: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
        // },
      ],
    };
  },
  watch: {
    headImgs: {
      handler(value) {
        this.fileList = JSON.parse(JSON.stringify(value));
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handlePreview(item) {
      this.previewImg(item.url ? item.url : item.response.data.url);//  item.response.data.url
    },
  },
};
</script>

<style lang="less">
@width: 40px;
@height: 40px;
.padding-top8{
  padding-top: 8px;
}
.me-upload-can-remove-box {
  width: 100%;
  position: relative;
  line-height:1;
  .ant-upload {
    padding: 0px !important;
  }
  .ant-upload-list-picture-card-container {
    width: @width;
    height: @height;
    margin: 0 10px 8px 0;
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
  .ant-upload-disabled {
    &:hover {
      cursor: no-drop;
    }
    .upload-can-remove-box-main {
      &:hover {
        cursor: no-drop;
      }
    }
  }

  .ant-upload-list-picture-card .ant-upload-list-item-info::before {
    left: 0px;
  }
  .ant-upload-list-picture-card .ant-upload-list-item {
    margin: 0 8px 8px 0;
  }
}
</style>
