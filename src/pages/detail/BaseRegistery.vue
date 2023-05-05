<template>
  <div class="box">
    <h1>批量注册</h1>
    <div class="content">
      <a-form :form="form">
        <a-form-item label="前缀:" name="213">
          <!-- <a-input
            :disabled="false"
            style="border: none; outline: none; background: none"
            value="88.155.101"
          />-->
          <span>{{ EnterprisePrefix }}</span>
        </a-form-item>
        <a-form-item label="数据模版">
          <a-select
            style="width: 2.2rem"
            label-in-value
            v-decorator="[
              'templateId',
              {
                rules: [{ required: true, message: '请选择数据模板' }],
              },
            ]"
            placeholder="下拉选择"
            @change="handleSelectChange"
          >
            <a-select-option v-for="item in dataArr" :key="item.templateId" :value="item.templateId" :text="item.templateName">{{ item.templateName }}</a-select-option>
          </a-select>
          <a-button v-show="!templateIds" :disabled="true" id="disable-border" style="margin-left: 0.2rem; width: 1rem">下载</a-button>
          <Download v-show="templateIds" :templateId="templateIds" :texts="labels" type="primary" text="下载" url="http://dev.boeplat.com.cn/boeplat-ziid/api/annex/download/register" />
        </a-form-item>

        <a-form-item label="数据导入">
          <a-upload-dragger
            class="upload-s"
            name="file"
            method="post"
            :disabled="loading"
            :headers="headers"
            :action="action"
            :before-upload="beforeUpload"
            :remove="removeFile"
            :file-list="fileList"
            :multiple="false"
          >
            <div class="upload-dragger-box-main" v-if="!imageUrl">
              <p class="ant-upload-drag-icon">
                <a-icon :type="loading ? 'loading' : 'cloud-upload'" />
              </p>
              <p class="ant-upload-text">
                <span>点击</span>
                或拖拽上传
              </p>
            </div>
            <div :style="{ height: minHeight }" class="upload-dragger-box-main" v-else>
              <img :src="imageUrl" class="upload-dragger-box-main-img" />
              <!-- <span class="upload-dragger-box-main-img-preview">预览</span> -->
            </div>
          </a-upload-dragger>
        </a-form-item>
      </a-form>

      <p style="margin-top: 0.2rem">
        说明： 1.下载Excel文件（请选择数据模版后下载）
        <br />2.编辑Excel文件（不超过10000行）
        <br />3.通过【选择文件】按钮，选择Excel
        <br />4.点击确定提交数据
      </p>
      <div class="btn">
        <a-button @click="back">取消</a-button>
        <a-button type="primary" @click="ok">确定</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import Download from "@/components/download/download.vue";
let companyId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company
  .companyId;
let EnterprisePrefix = sessionStorage.getItem("EnterprisePrefix");

import { GetDataTemplateList, UploadOk } from "@/services/basic";
export default {
  data() {
    return {
      maxSize: 2,
      labels: "",
      dataArr: [],
      templateIds: "",
      form: this.$form.createForm(this, { name: "BaseRegistery" }),
      loading: false,
      fileSize: 1024000,
      action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
      headers: {},
      file: {},
      fileList: [],
      EnterprisePrefix,
      // 接口获取的sts对象
      stsObj: {},
      imageUrl: "",
      fileTypeArr: [
        // "image/jpeg",
        // "image/png",
        // "text/plain",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
      errTypeMsg: "请上传正确格式的文件",
    };
  },
  mounted() {
    this.getdataTemplate();
  },
  methods: {
    tokens() {
      this.headers = { Authorization: `bearer ${token}` };
    },
    ok() {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          if (JSON.stringify(this.file) == "{}") {
            this.$antMessage.info("请先上传exel");
          } else {
            const formData = new FormData();
            formData.append("file", this.file);
            formData.append("templateId", this.templateIds);
            UploadOk(formData)
              .then((res) => {
                if (res.code == "20000") {
                  this.$antMessage.success("注册成功");
                  this.$router.push("/overview/preview");
                } else {
                  //this.$antMessage.info(res.message) llll;
                }
              })
              .catch((err) => { });
          }
        }
      });
    },
    removeFile(file) {
      this.fileList = this.fileList.filter((res) => {
        return res.uid !== file.uid;
      });
    },
    // 上传之前
    beforeUpload(file) {
      if (this.fileList.length >= "1") {
        this.$antMessage.info("只能上传一个文件");
        return false;
      }
      if (this.fileTypeAndSizeTest(file)) {
        // 存储文件列表和当前文件对象
        this.fileList = [...this.fileList, file];
        this.file = file;
        return false;
      } else {
        return false;
      }
    },
    // 检测文件类型和大小
    fileTypeAndSizeTest(file) {
      // 检测文件类型
      let isJpgOrPng = this.fileTypeArr.includes(file.type);
      if (!isJpgOrPng) this.$antMessage.error(this.errTypeMsg);
      // 检测文件大小
      const isLt2M = file.size - this.fileSize * this.maxSize < 0;
      if (!isLt2M) this.$antMessage.error(`文件大小不能超过${this.maxSize}M`);
      return isJpgOrPng && isLt2M;
    },
    async getdataTemplate() {
      //获取数据模板列表下拉框
      let result = await GetDataTemplateList({
        companyId: companyId,
      });
      if (result.code == "20000") {
        this.dataArr = result.data;
      }
    },
    async handleSelectChange(option) {
      //数据模板
      this.templateIds = option.key;
      this.labels = option.label;
    },
    back() {
      this.$router.go(-1);
    },
  },
  components: {
    Download,
  },
};
</script>

<style lang='less'>
.box {
  width: 100%;
  height: 100%;
  padding-bottom: 0.1rem;
  .ant-row {
    display: flex !important;
    // align-items: center;
    align-items: flex-start;
  }
  h1 {
    font-size: 0.2rem;
    font-family: FZLanTingHeiS-R-GB;
    font-weight: 400;
    height: auto;
    color: #333333;
    padding: 0.2rem 0 0.2rem 0;
    border-bottom: 0.02rem solid #f5f5f5;
  }
  .content {
    width: 5.1rem;
    margin: 0 auto;
    color: #999999;
    .ant-row {
      .ant-form-item-label {
        width: 1.2rem;
        color: #999999;
      }
      .ant-form-item-control-wrapper {
        div {
          input {
            width: 2.5rem;
          }
        }
      }
    }
    p {
      line-height: 0.3rem;
      margin-left: 1.2rem;
      width: 100%;
      font-size: 0.12rem;
    }
    .btn {
      margin-left: 1.2rem;
      margin-top: 0.2rem;
      button {
        font-size: 0.12rem;
        padding: 0.08rem 0.2rem;
        height: auto !important;
        span {
          font-size: 0.12rem;
        }
        &:nth-child(2) {
          margin-left: 0.1rem;
        }
      }
    }
  }
}
.upload-s {
  width: 3.4rem;
  .ant-upload {
    width: 3.4rem !important;
  }
  .ant-upload-drag {
    width: 3.4rem;
  }
  div {
    width: 3.4rem;
  }
  ::v-deep.ant-form-item-children {
    width: 3.4rem;
  }
  ::v-deep.ant-upload-drag-icon {
    margin: 0px !important;
  }
}

.ant-upload-list-item-info {
  span {
    display: flex;
    align-items: center;
    .anticon-paper-clip {
      left: -3px;
    }
  }
}
.upload-dragger-box {
  .ant-upload-drag-icon {
    margin: 0;
  }
  .upload-dragger-box-main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    // .ant-upload-drag-icon {
    //   margin: 0 0 0.1rem 0 !important;
    // }
    .ant-upload-drag-icon i {
      color: #cbcbcb !important;
    }
    .ant-upload-text {
      font-size: 0.12rem !important;
      span {
        color: #267ed3;
        font-size: 0.12rem !important;
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
.ant-upload-drag-icon {
  margin: 0 !important;
}
</style>