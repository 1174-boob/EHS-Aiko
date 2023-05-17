<template>
  <div>
    <CommonModal title="导入化学品记录" :visible="visible" :cancelFn="closeVisible">
      <div class="down-upload">
        <div class="down-load load">
          <a-spin v-if="downLoading">
            <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
          </a-spin>
          <a-button class="content" @click="downTemplate" :disabled="downDisabled">
            <img src="./img/download.png">
            <span>下载模板</span>
          </a-button>
        </div>
        <a-upload
          class="up-load load"
          :action="action"
          name='multipartFile'
          :headers="headers"
          :data="data"
          accept=".xlsx,.xls"
          :before-upload="beforeUpload"
          @change="handleChange"
          :multiple="true"
          :disabled="disabled"
          :file-list="fileList"
        >
        <a-spin v-if="spinLoading">
          <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
        </a-spin>
          <div class="detail">
            <div class="content">
              <img src="./img/upload.png">
              <span>附件上传</span>
            </div>
            <div>单个文件不超过 5M，支持格式：.xlsx、.xls</div>
          </div>
        </a-upload>
      </div>
    </CommonModal>
    <CommonModal title="导入结果" :visible="resultVisible" :cancelFn="resultCancel" class="result-visible">
      {{resultText}}
    </CommonModal>
  </div>
</template>

<script>
import serviceNameList from '@/config/default/service.config.js';
import uploadCanRemove from "@/mixin/uploadCanRemoveHaslimit";
import { warehouseTemplateExport } from "@/services/api.js";
export default {
  mixins: [uploadCanRemove],
  props: {
    visible: {
      required: true,
      type: Boolean,
      default: false,
    },
    //请求地址
    action: {
      type: String,
      default: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.chemicals}/api/ehs/chemical/warehouse/inventory/import`,
    },
    // 文件类型
    fileTypeArr: {
      type: Array,
      default: () => [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ],
    },
  },
  watch: {
    visible: {
      handler(newV) {
        if(newV) {
          this.fileList = [];
        }
      },
      immediate: true,
      deep: true
    },
  },
  data() {
    return {
      fileList:[],
      resultVisible: false,
      spinLoading: false,
      downLoading: false,
      disabled: false,
      downDisabled: false,
      resultText:''
    }
  },
  methods: {
    closeVisible() {
      this.$emit("visible",false);
    },
    // 模板下载
    async downTemplate() {
      this.downLoading = true;
      this.downDisabled = true;
      const name = '导入模板'
      let res = await warehouseTemplateExport();
      if(res){
        const blob = new Blob([res],{ type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const downloadElement = document.createElement('a');
        const href = URL.createObjectURL(blob); //创建下载链接
        downloadElement.href = href;
        downloadElement.download = name + '.xlsx';
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);// 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      }
      this.downLoading = false;
      this.downDisabled = false;
    },
    // 上传之前
    beforeUpload(file) {
      // if (!this.canUploadByLimit) {
      //   this.$antMessage.warn(`最多上传${this.limit}个文件`);
      //   return false;
      // }
      if (!this.fileTypeAndSizeTest(file)) return false;
      // 存储文件
      this.file = file;
      this.spinLoading = true;
      this.disabled = true;
    },
    // 上传成功
    uploadDone(res) {
      if (res.data) {
        let { id, url } = res.data;
        this.fileList.some((item) => {
          if (item.uid == this.file.uid) {
            this.$set(item, "id", id);
            this.$set(item, "url", url);
            return true;
          }
        });
      }
      this.$emit("handleSuccess", this.fileList);
      if(res.data && res.data.code==200001) {
        this.resultText = res.data.result;
        this.$emit("visible",false,true);
        this.resultVisible = true;
      } else {
        this.$emit("visible",false,true);
        this.$antMessage.success(`上传成功`);
      }
      setTimeout(() => {
        this.spinLoading = false;
        this.disabled = false;
      }, 600);
    },
    // 导入结果弹框关闭
    resultCancel() {
      this.resultVisible = false;
    }
  }
}
</script>

<style lang="less" scoped>
::v-deep .model-content {
  display: flex;
  justify-content: center;
}
.down-upload {
  width: 460px;
  min-height: 200px;
  .load {
    width: 100%;
    height: 80px;
    background: #FFFFFF;
    border: 1px solid #DCDEE0;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    position: relative;
    cursor: pointer;
    img {
      width: 20px;
      height: 20px;
    }
    span {
      font-size: 14px;
      color: #323233;
      margin-left: 4px;
    }
    ::v-deep .ant-spin {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(#f5f5f5, .6) !important;
      z-index: 9;
    }
  }
  .down-load {
    .content {
      width: 100%;
      height: 100%;
      border: unset;
      border-radius: unset;
    }
  }
  .up-load {
    margin-top: 20px;
    display: block;
    ::v-deep .ant-upload-select {
      width: 100%;
      height: 100%;
      
      div {
        text-align: center;
      }
      .detail {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

</style>