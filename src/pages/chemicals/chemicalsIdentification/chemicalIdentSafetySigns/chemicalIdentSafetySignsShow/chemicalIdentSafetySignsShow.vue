<template>
  <HasFixedBottomWrapper>
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <div class="chemicals-signs-show">
        <template description="顶部">
          <div class="header-box">
            <span
              class="header-title"
            >{{iFrom.chemicalName && this.getChemicalDictText('chemical', iFrom.chemicalName) ? this.getChemicalDictText('chemical', iFrom.chemicalName) : iFrom.chemicalName}}</span>
            <span class="header-tip">{{iFrom.mainIngredient}}</span>
          </div>
        </template>

        <template description="主要内容区域">
          <div class="main-box">
            <div class="main-header">
              <div class="main-header-top">
                <div class="main-header-top-left">危险</div>
                <div class="main-header-top-right">
                  <img class="main-header-top-right-img" v-for="item in iFrom.echoPictureList" :key="item.id" :src="item.filePath" @click="handlePreview(item.filePath)" />
                </div>
              </div>
              <div class="main-header-bottom">{{iFrom.dangerousProperties}}</div>
            </div>
            <div class="main-details">
              <div class="details-item">
                <div class="details-item-title">【预防措施】</div>
                <ul class="details-item-content">
                  <li v-html="iFrom.precautionHtml"></li>
                </ul>
              </div>
              <div class="details-item">
                <div class="details-item-title">【事故响应】</div>
                <ul class="details-item-content">
                  <li v-html="iFrom.incidentResponseHtml"></li>
                </ul>
              </div>
              <div class="details-item">
                <div class="details-item-title">【安全储存】</div>
                <ul class="details-item-content">
                  <li v-html="iFrom.safeStorageHtml"></li>
                </ul>
              </div>
              <div class="details-item">
                <div class="details-item-title">【废弃处置】</div>
                <ul class="details-item-content">
                  <li v-html="iFrom.wasteDisposalHtml"></li>
                </ul>
              </div>
            </div>
          </div>
        </template>

        <template description="底部">
          <div class="footer-box">
            <div class="footer-top">请参阅化学品安全技术说明书</div>
            <div class="footer-details">
              <a-row class="footer-details-box">
                <a-col :span="18" class="footer-details-item">
                  <span class="footer-details-left">供应商</span>
                  <span>：{{iFrom.supplier}}</span>
                </a-col>
                <a-col :span="6">
                  <span>电话：{{iFrom.supplierContact}}</span>
                </a-col>
              </a-row>
              <a-row class="footer-details-box">
                <a-col :span="18" class="footer-details-item">
                  <span class="footer-details-left">地址</span>
                  <span>：{{iFrom.supplierAddress}}</span>
                </a-col>
                <a-col :span="6">
                  <span>邮编：{{iFrom.supplierPostcode}}</span>
                </a-col>
              </a-row>
            </div>
            <div class="footer-bottom">化学品事故应急咨询电话：{{iFrom.emergencyCall}}</div>
          </div>
        </template>
      </div>
      <div class="file-list">
        <div class="file-list-title">附件：</div>
        <div class="file-item" v-for="item in iFrom.echoAttachmentList" :key="item.id" @click="openFile(item.filePath)">{{item.fileName}}</div>
      </div>
    </a-spin>

    <!-- <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="cancleSubmit">返回</a-button>
        </div>
      </FixedBottom>
    </div>-->
  </HasFixedBottomWrapper>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import { cloneDeep } from 'lodash'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import UploadCanRemove from '@/components/upload/uploadCanRemove.vue';
import ImportFile from "@/components/upload/importFile.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import { getConsoleOrganizeList, addChemicalIdentSafetySignsApi, getChemicalIdentSafetySignsAddDetailApi, changeChemicalIdentSafetySignsApi } from '@/services/chemicalIdentSafetyTipsAdd.js'
import cancelLoading from "@/mixin/cancelLoading";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
export default {
  components: { FixedBottom, UploadCanRemove, ImportFile, UploadBtnStyle, OrganizeLazyTree },
  mixins: [chemicalDict, cancelLoading],
  data() {
    return {
      spinning: true,
      iFrom: {
        chemicalName: undefined,
        form: undefined,
        deptList: undefined,
        mainIngredient: undefined,
        warningWord: undefined,
        dangerousProperties: undefined,
        pictureList: undefined,
        echoPictureList: [],
        precaution: undefined,
        incidentResponse: undefined,
        safeStorage: undefined,
        wasteDisposal: undefined,
        supplier: undefined,
        supplierContact: undefined,
        supplierAddress: undefined,
        supplierPostcode: undefined,
        emergencyCall: undefined,
        attachmentList: undefined,
        echoAttachmentList: [],
      },
    }
  },
  mounted() {
    // 页面初始化
    this.initPage()
  },
  methods: {
    // 文件下载
    openFile(filePath) {
      window.open(filePath)
    },
    // 图片预览
    handlePreview(url) {
      this.$hevueImgPreview(url);
    },
    // 页面初始化
    initPage() {
      // 获取页面详情和组织机构
      Promise.all([this.getPageDetail()])
        .then(resArr => {

        })
        .finally(() => {
          this.spinning = false
        })
    },
    // 获取页面详情
    getPageDetail() {
      let labelId = this.$route.query.labelId
      let apiData = { labelId }
      return new Promise((resove, rej) => {
        getChemicalIdentSafetySignsAddDetailApi(apiData)
          .then(res => {
            let iFrom = res.data
            iFrom.precautionHtml = iFrom.precaution.replace(/(\n|\r|\r\n|↵)/g, '<br/>')
            iFrom.incidentResponseHtml = iFrom.incidentResponse.replace(/(\n|\r|\r\n|↵)/g, '<br/>')
            iFrom.safeStorageHtml = iFrom.safeStorage.replace(/(\n|\r|\r\n|↵)/g, '<br/>')
            iFrom.wasteDisposalHtml = iFrom.wasteDisposal.replace(/(\n|\r|\r\n|↵)/g, '<br/>')
            this.iFrom = iFrom
            resove(iFrom)
          })
          .catch(err => {
            rej()
          })
      })
    },
    // 返回
    cancleSubmit() {
      this.$router.go(-1)
    },
  }
}
</script>

<style lang="less" scoped>
@border:1px solid #999;
@marginBottom: 16px;
@marginBottomSmall: 4px;
@lineHeight: 1.1;
.textJustify {
  text-align: justify;
  text-align-last: justify;
}
.chemicals-signs-show {
  width: 80%;
  max-width: 900px;
  margin: 0 auto;
  border: @border;
  // 公共
  .header-box,
  .main-box,
  .footer-box {
    padding: 20px 30px;
  }
  // 顶部
  .header-box {
    border-bottom: @border;
    display: flex;
    align-items: center;
    justify-content: center;
    .header-title {
      flex: none;
      color: #333;
      font-size: 24px;
      font-weight: bold;
      line-height: @lineHeight;
      margin-right: 20px;
    }
    .header-tip {
      font-size: 16px;
      line-height: 1.3;
    }
  }
  // 内容区
  .main-box {
    border-bottom: @border;
    .main-header {
      margin-bottom: 20px;
      .main-header-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 4px;
        .main-header-top-left {
          flex: none;
          padding: 10px 30px;
          background: #333;
          color: #fff;
          font-size: 16px;
          line-height: @lineHeight;
          font-weight: bold;
          margin-bottom: 12px;
        }
        .main-header-top-right {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          // justify-content: center;
          margin-left: 20px;
          .main-header-top-right-img {
            width: 50px;
            margin: 0 0 12px 12px;
            cursor: pointer;
          }
        }
      }
      .main-header-bottom {
        font-size: 16px;
        color: #333;
        font-weight: bold;
        line-height: 14px;
      }
    }
    .main-details {
      .details-item {
        .details-item-title {
          color: #333;
          font-weight: bold;
          transform: translateX(-5px);
          margin-bottom: 8px;
          margin-top: 14px;
        }
        .details-item-content {
          & > li {
            line-height: 1.5;
          }
        }
      }
    }
  }
  // 底部
  .footer-box {
    font-size: 14px;
    line-height: @lineHeight;
    .footer-top {
      margin-bottom: 10px;
      text-align: center;
    }
    .footer-details {
      margin-bottom: 8px;
      .footer-details-item {
        line-height: 1.5;
        .footer-details-left {
          width: 42px;
          display: inline-block;
          .textJustify;
        }
      }
    }
    .footer-bottom {
      margin-bottom: @marginBottomSmall;
      text-align: center;
    }
  }
}
.file-list {
  width: 80%;
  max-width: 900px;
  margin: 10px auto;
  .file-list-title {
    margin-bottom: 10px;
  }
  .file-item {
    cursor: pointer;
    margin-bottom: 10px;
    color: #0067cc;
  }
}

@media screen and (max-width: 1440px) {
  .textJustify {
    text-align: justify;
    text-align-last: justify;
  }
  .chemicals-signs-show {
    width: 80%;
    max-width: 900px;
    margin: 0 auto;
    border: @border;
    // 公共
    .header-box,
    .main-box,
    .footer-box {
      padding: 12px 20px;
    }
    // 顶部
    .header-box {
      border-bottom: @border;
      display: flex;
      align-items: center;
      justify-content: center;
      .header-title {
        flex: none;
        color: #333;
        font-size: 16px;
        font-weight: bold;
        line-height: @lineHeight;
        margin-right: 16px;
      }
      .header-tip {
        font-size: 12px;
        line-height: 1.3;
      }
    }
    // 内容区
    .main-box {
      border-bottom: @border;
      .main-header {
        margin-bottom: 15px;
        .main-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
          .main-header-top-left {
            flex: none;
            padding: 8px 20px;
            background: #333;
            color: #fff;
            font-size: 14px;
            line-height: @lineHeight;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .main-header-top-right {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            margin-left: 20px;
            .main-header-top-right-img {
              width: 40px;
              margin: 0 0 8px 12px;
            }
          }
        }
        .main-header-bottom {
          font-size: 14px;
          color: #333;
          font-weight: bold;
          line-height: 1.1;
        }
      }
      .main-details {
        .details-item {
          &:nth-of-type(1) {
            .details-item-title {
              margin-top: 0px;
            }
          }
          .details-item-title {
            color: #333;
            font-weight: bold;
            transform: translateX(-5px);
            margin-bottom: 6px;
            margin-top: 10px;
            font-size: 12px;
          }
          .details-item-content {
            & > li {
              line-height: 1.4;
              font-size: 12px;
            }
          }
        }
      }
    }
    // 底部
    .footer-box {
      font-size: 12px;
      line-height: @lineHeight;
      .footer-top {
        margin-bottom: 8px;
        text-align: center;
      }
      .footer-details {
        margin-bottom: 8px;
        .footer-details-box {
          margin-bottom: 4px;
        }
        .footer-details-item {
          .footer-details-left {
            width: 42px;
            display: inline-block;
            .textJustify;
          }
        }
      }
      .footer-bottom {
        margin-bottom: 0px;
        text-align: center;
      }
    }
  }
}

::v-deep .a-spin {
  display: flex;
  flex: 1;
  overflow: hidden;
  .ant-spin-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .ant-spin-blur {
    opacity: 0.06 !important;
  }
}
</style>





