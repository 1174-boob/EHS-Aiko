<template>
  <HasFixedBottomWrapper>
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <div class="tag-box">
        <div class="tag-item" ref="imageWrapper" v-for="(item,index) in tagList" :key="item.id">
          <div class="tag-title">{{printTitle}}</div>
          <ul class="tag-item-content-box">
            <li class="tag-item-content">
              <div class="content-left">化学品名称：</div>
              <div class="content-right">{{item.chemicalsId}}</div>
            </li>
            <li class="tag-item-content">
              <div class="content-left">厂商名称：</div>
              <div class="content-right">{{item.tradeName}}</div>
            </li>
            <li class="tag-item-content">
              <div class="content-left">所属部门：</div>
              <div class="content-right">{{item.organization}}</div>
            </li>
            <li class="tag-item-content">
              <div class="content-left">保存有效期：</div>
              <div class="content-right">{{item.outFactoryDate}}</div>
            </li>
          </ul>
          <div class="print-button" @click="downloadTemplate(index)">下载</div>
        </div>
      </div>
    </a-spin>
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="cancleSubmit">返回</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import html2canvas from "html2canvas";
import { getTransientChemicalsTagApi, } from "@/services/chemicalIdentSafetyTipsAdd.js";
import chemicalDict from "@/mixin/chemicalDict.js";
export default {
  components: { FixedBottom },
  mixins: [chemicalDict],
  data() {
    return {
      spinning: false,
      printTitle: '化学品准入',
      tagList: [],
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    getTableList() {
      this.spinning = true
      let apiData = { temporaryEntryId: this.$route.query.temporaryEntryId }
      getTransientChemicalsTagApi(apiData)
        .then(res => {
          this.tagList = res.data
        })
        .catch(err => { })
        .finally(() => {
          this.spinning = false
        })
    },
    // 下载模板
    downloadTemplate(index) {
      const clientWidth = this.$refs.imageWrapper[index].offsetWidth;
      const clientHeight = this.$refs.imageWrapper[index].offsetHeight;
      const kh = [clientWidth, clientHeight];
      html2canvas(this.$refs.imageWrapper[index], {
        useCORS: true,
        logging: true,
      }).then((canvas) => {
        const dataURL = canvas.toDataURL("image/png");
        this.download(dataURL, kh);
      });
    },
    download(imgUrl, kh) {
      this.getUrlBase64(imgUrl, kh).then((base64) => {
        const link = document.createElement("a");
        link.href = base64;
        link.download = `${this.printTitle}.png`;
        link.click();
      });
    },
    getUrlBase64(url, kh) {
      return new Promise((resolve) => {
        let canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.crossOrigin = "Anonymous"; // 允许跨域
        img.src = url;
        img.onload = () => {
          canvas.height = kh[1];
          canvas.width = kh[0];
          ctx.drawImage(img, 0, 0, kh[0], kh[1]);
          const dataURL = canvas.toDataURL("image/png");
          canvas = null;
          resolve(dataURL);
        };
      });
    },
    // 取消
    cancleSubmit() {
      this.setKeepalive(true)
      this.$router.go(-1)
    },
  }
}
</script>

<style lang="less" scoped>
.tag-box {
  min-height: 300px;
  padding-top: 30px;
  display: flex;
  flex-wrap: wrap;
  .tag-item {
    flex: none;
    width: 500px / 1.1;
    height: 400px / 1.1;
    border: 1px solid #ccc;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    position: relative;
    margin-bottom: 40px;
    margin-right: 40px;
    .tag-title {
      flex: none;
      font-size: 28px;
      line-height: 1.1;
      font-weight: bold;
      color: #000;
      text-align: center;
      padding: 30px 0 0px;
    }
    .tag-item-content-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 20px 20px;
      .tag-item-content {
        // flex: 1;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        font-size: 16px;
        line-height: 1.3;
        .content-left {
          flex: none;
          color: #999;
        }
        .content-right {
          flex: 1;
          color: #333;
        }
      }
    }
    .print-button {
      position: absolute;
      top: -20px;
      right: 0px;
      cursor: pointer;
      color: #0067cc;
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