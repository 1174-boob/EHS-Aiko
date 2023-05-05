<template>
  <HasFixedBottomWrapper>
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <div class="chemicalIdentSafetyTipsShow-box font-size-14">
        <template description="顶部">
          <div class="header-box">
            <span class="header-title">化学品安全提示卡</span>
          </div>
        </template>

        <template description="基本信息、理化性质">
          <a-row class="section-one flex">
            <a-col :span="row1" class="border-right flex text-xy-center">基本信息</a-col>
            <a-col :span="24 - row1">
              <a-row type="flex">
                <a-col :span="6" class="border-right flex">
                  <ul class="flex flex-1 flex-direction-column">
                    <li class="flex flex-1">
                      <div class="border-right border-bottom flex-1 content-padding text-xy-center">名称</div>
                      <div
                        class="border-bottom flex-2 content-padding text-xy-center"
                      >{{iFrom.chemicalsId && this.getChemicalDictText('chemical', iFrom.chemicalsId) ? this.getChemicalDictText('chemical', iFrom.chemicalsId) : iFrom.chemicalsId}}</div>
                    </li>
                    <li class="flex flex-1">
                      <div class="border-right border-bottom flex-1 content-padding text-xy-center">化学式</div>
                      <div class="border-bottom flex-2 content-padding text-xy-center">{{iFrom.chemicalsFormula}}</div>
                    </li>
                    <li class="flex flex-1">
                      <div class="border-right border-bottom flex-1 content-padding text-xy-center">主要成分</div>
                      <div class="border-bottom flex-2 content-padding text-xy-center">{{safeRemindCasText('mainIngredient',iFrom.safeRemindCas)}}</div>
                    </li>
                    <li class="flex flex-1">
                      <div class="border-right flex-1 content-padding text-xy-center">CAS NO</div>
                      <div class="flex-2 content-padding text-xy-center">{{safeRemindCasText('csaNo',iFrom.safeRemindCas)}}</div>
                    </li>
                  </ul>
                </a-col>
                <a-col :span="4" class="border-right flex text-xy-center">理化性质</a-col>
                <a-col :span="14" class="flex">
                  <ul class="flex flex-1 flex-direction-column">
                    <li class="flex flex-2">
                      <div class="border-bottom flex-1 content-padding text-xy-center">{{iFrom.traits}}</div>
                    </li>
                    <li class="flex flex-1">
                      <a-row type="flex" class="flex-1 border-bottom">
                        <a-col :span="6" class="border-right text-xy-center">闪点[℃]</a-col>
                        <a-col :span="6" class="border-right text-xy-center">{{iFrom.flashPoint}}</a-col>
                        <a-col :span="6" class="border-right text-xy-center">相对密度[水=1]</a-col>
                        <a-col :span="6" class="text-xy-center">{{iFrom.relativeDensity}}</a-col>
                      </a-row>
                    </li>
                    <li class="flex flex-1">
                      <a-row type="flex" class="flex-1">
                        <a-col :span="6" class="border-right text-xy-center">爆炸极限</a-col>
                        <a-col :span="6" class="border-right text-xy-center">{{iFrom.explosiveLimit}}</a-col>
                        <a-col :span="6" class="border-right text-xy-center">PH值</a-col>
                        <a-col :span="6" class="text-xy-center">{{iFrom.phData}}</a-col>
                      </a-row>
                    </li>
                  </ul>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </template>

        <template description="危险特性">
          <a-row class="section-one flex">
            <a-col :span="row1" class="border-right flex text-xy-center">危险特性</a-col>
            <a-col :span="24 - row1">
              <a-row type="flex">
                <a-col :span="17" class="border-right flex content-padding text-y-center">
                  <div class="line-height-12" v-html="iFrom.hazardousPropertiesHtml"></div>
                </a-col>
                <a-col :span="7" class="flex">
                  <ul class="flex flex-1 flex-direction-column">
                    <li class="flex-1">
                      <div class="border-bottom content-padding text-xy-center flex-wrap">
                        <img class="main-header-top-right-img cursor-pointer" v-for="item in iFrom.echoPictogramsList" :key="item.id" :src="item.filePath" @click="handlePreview(item.filePath)" />
                      </div>
                    </li>
                    <li class="flex-1">
                      <div class="content-padding text-xy-center">{{iFrom.signalWord}}</div>
                    </li>
                  </ul>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </template>

        <template description="防护用品">
          <a-row class="section-one flex">
            <a-col :span="row1" class="border-right flex text-xy-center">防护用品</a-col>
            <a-col :span="24 - row1">
              <a-row class="border-bottom flex">
                <a-col :span="6" class="flex border-right content-padding text-xy-center line-height-12">呼吸防护：{{getPlainText(iFrom.respiratoryProtection)}}</a-col>
                <a-col :span="6" class="flex border-right content-padding text-xy-center line-height-12">手部防护：{{getPlainText(iFrom.handProtection)}}</a-col>
                <a-col :span="6" class="flex border-right content-padding text-xy-center line-height-12">眼睛防护：{{getPlainText(iFrom.eyeProtection)}}</a-col>
                <a-col :span="6" class="flex content-padding text-xy-center line-height-12">身体防护：{{getPlainText(iFrom.bodyProtection)}}</a-col>
              </a-row>
              <div class="content-padding text-xy-center flex-wrap">
                <img class="main-header-top-right-img cursor-pointer" v-for="(item,index) in getImgSrc(iFrom.respiratoryProtection)" :key="item+index" :src="item" @click="handlePreview(item)" />
                <img class="main-header-top-right-img cursor-pointer" v-for="(item,index) in getImgSrc(iFrom.handProtection)" :key="item+index" :src="item" @click="handlePreview(item)" />
                <img class="main-header-top-right-img cursor-pointer" v-for="(item,index) in getImgSrc(iFrom.eyeProtection)" :key="item+index" :src="item" @click="handlePreview(item)" />
                <img class="main-header-top-right-img cursor-pointer" v-for="(item,index) in getImgSrc(iFrom.bodyProtection)" :key="item+index" :src="item" @click="handlePreview(item)" />
              </div>
            </a-col>
          </a-row>
        </template>

        <template description="注意事项">
          <a-row class="section-one flex">
            <a-col :span="row1" class="border-right flex text-xy-center">注意事项</a-col>
            <a-col :span="24 - row1">
              <div class="content-padding line-height-12" v-html="iFrom.precautionsHtml"></div>
            </a-col>
          </a-row>
        </template>

        <template description="应急措施">
          <a-row class="section-one flex">
            <a-col :span="row1" class="border-right flex text-xy-center">应急措施</a-col>
            <a-col :span="24 - row1">
              <a-row type="flex">
                <a-col :span="14" class="flex border-right">
                  <div class="content-padding text-xy-center line-height-12" v-html="iFrom.humanContactMeasuresHtml"></div>
                </a-col>
                <a-col :span="10" class="flex">
                  <div class="content-padding text-xy-center line-height-12" v-html="iFrom.leakageEmergencyMeasuresHtml"></div>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </template>

        <template description="应急电话">
          <a-row class="section-one flex">
            <a-col :span="row1" class="border-right flex text-xy-center">应急电话</a-col>
            <a-col :span="24 - row1">
              <a-row class="flex">
                <a-col :span="3" class="flex border-right content-padding text-y-center">外部应急电话:</a-col>
                <a-col :span="8" class="flex border-right content-padding text-xy-center">{{iFrom.ousideTel}}</a-col>
                <a-col :span="4" class="flex border-right content-padding text-xy-center">厂内应急电话：</a-col>
                <a-col :span="9" class="flex content-padding text-xy-center">{{iFrom.factoryTel}}</a-col>
              </a-row>
            </a-col>
          </a-row>
        </template>

        <template description="参考资料">
          <a-row class="flex">
            <a-col :span="row1" class="border-right flex text-xy-center">参考资料</a-col>
            <a-col :span="24 - row1" class="content-padding text-xy-center">{{iFrom.safeReferences}}</a-col>
          </a-row>
        </template>
      </div>
      <div class="file-list font-size-14">
        <div class="file-list-title">附件：</div>
        <div class="file-item" v-for="item in iFrom.echoReferencesAttachmentList" :key="item.id" @click="openFile(item.filePath)">{{item.fileName}}</div>
      </div>
      <div class="file-list font-size-14">
        <div class="file-list-title">应急流程：</div>
        <div class="file-item">
          <img v-for="item in iFrom.echoEmergencyProcessList" :key="item.id" :src="item.filePath" @click="handlePreview(item.filePath)" />
        </div>
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
import { cloneDeep } from 'lodash'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import { getChemicalIdentSafetyTipsAddDetailApi } from '@/services/chemicalIdentSafetyTipsAdd.js'
import chemicalDict from "@/mixin/chemicalDict.js";
export default {
  components: { FixedBottom },
  mixins: [chemicalDict],
  data() {
    return {
      row1: 2,
      spinning: true,
      iFrom: {
        chemicalsId: undefined,
        chemicalsFormula: undefined,
        deptIds: undefined,
        shape: undefined,
        safeRemindCas: undefined,
        traits: undefined,
        flashPoint: undefined,
        relativeDensity: undefined,
        explosiveLimit: undefined,
        phData: undefined,
        signalWord: undefined,
        hazardousProperties: undefined,
        pictogramsList: undefined,
        echoPictogramsList: [],
        respiratoryProtection: undefined,
        handProtection: undefined,
        eyeProtection: undefined,
        bodyProtection: undefined,
        precautions: undefined,
        humanContactMeasures: undefined,
        leakageEmergencyMeasures: undefined,
        emergencyProcessList: undefined,
        echoEmergencyProcessList: [],
        ousideTel: undefined,
        factoryTel: undefined,
        safeReferences: undefined,
        referencesAttachmentList: undefined,
        echoReferencesAttachmentList: [],
      },
      // 化学品名称list
      chemicalsList: [],
      // 形态list
      shapeList: [],
    }
  },
  created() {
    // 化学品名称字典
    this.chemicalsList = this.getChemicalDictList('chemical')
    // 形态list
    this.shapeList = this.getChemicalDictList('form')
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
    // 页面初始化
    initPage() {
      // 获取页面详情和组织机构
      Promise.all([this.getPageDetail()])
        .then(resArr => { })
        .finally(() => {
          this.spinning = false
        })
    },
    // 获取页面详情
    getPageDetail() {
      let safeRemindId = this.$route.query.safeRemindId
      let apiData = { safeRemindId }
      return new Promise((resove, rej) => {
        getChemicalIdentSafetyTipsAddDetailApi(apiData)
          .then(res => {
            let iFrom = res.data
            iFrom.hazardousPropertiesHtml = iFrom.hazardousProperties.replace(/(\n|\r|\r\n|↵)/g, '<br/>')
            iFrom.precautionsHtml = iFrom.precautions.replace(/(\n|\r|\r\n|↵)/g, '<br/>')
            iFrom.humanContactMeasuresHtml = iFrom.humanContactMeasures.replace(/(\n|\r|\r\n|↵)/g, '<br/>')
            iFrom.leakageEmergencyMeasuresHtml = iFrom.leakageEmergencyMeasures.replace(/(\n|\r|\r\n|↵)/g, '<br/>')
            this.iFrom = iFrom
            resove(iFrom)
          })
          .catch(err => {
            rej()
          })
      })
    },
    //转意符换成普通字符
    convertIdeogramToNormalCharacter(val) {
      const arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
      return val.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
    },
    getPlainText(richCont) {
      const str = richCont;
      let value = richCont;
      if (richCont) {
        // 方法一： 
        value = value.replace(/\s*/g, "");  //去掉空格
        value = value.replace(/<[^>]+>/g, ""); //去掉所有的html标记
        value = value.replace(/↵/g, "");     //去掉所有的↵符号
        value = value.replace(/[\r\n]/g, "") //去掉回车换行
        value = value.replace(/&nbsp;/g, "") //去掉空格
        value = this.convertIdeogramToNormalCharacter(value);
        return value;

        // 方法二： 
        // value = value.replace(/(\n)/g, "");
        // value = value.replace(/(\t)/g, "");
        // value = value.replace(/(\r)/g, "");
        // value = value.replace(/<\/?[^>]*>/g, "");
        // value = value.replace(/\s*/g, "");
        // value = this.convertIdeogramToNormalCharacter(value);
        // return value;
      } else {
        return '';
      }
    },
    getImgSrc(rich) {
      let imgList = [];
      (rich || '').replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, (match, capture) => {
        imgList.push(capture);
      });
      return imgList;
    },
    // 数组项转文字
    safeRemindCasText(attr, arr) {
      let strArr = (arr || []).map(item => item[attr])
      let attrAtr = strArr.length ? strArr.toString() : ''
      return attrAtr
    },
    // 返回
    cancleSubmit() {
      this.$router.go(-1)
    },
    // 图片预览
    handlePreview(url) {
      this.$hevueImgPreview(url);
    },
  },
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
.border-right {
  border-right: 1px solid #999;
}
.border-left {
  border-left: 1px solid #999;
}
.border-bottom {
  border-bottom: 1px solid #999;
}
.text-y-center {
  display: flex;
  align-items: center;
}
.text-xy-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.flex-wrap {
  flex-wrap: wrap;
}
.content-padding {
  padding: 10px;
}
.flex-1 {
  flex: 1;
}
.flex-2 {
  flex: 2;
}
.font-size-14 {
  font-size: 14px;
}
.line-height-12 {
  line-height: 1.3;
}
.main-header-top-right-img {
  width: 50px;
  margin-right: 5px;
}
.chemicalIdentSafetyTipsShow-box {
  width: 100%;
  margin: 10px auto;
  border: @border;
  // 公共
  .header-box,
  .footer-box {
    padding: 10px 30px;
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
    }
  }
  //
  .section-one {
    border-bottom: @border;
  }
}
.file-list {
  margin-bottom: 10px;
  .file-list-title {
    margin-bottom: 10px;
  }
  .file-item {
    cursor: pointer;
    margin-bottom: 10px;
    color: #0067cc;
    &:last-child {
      margin-bottom: 0px;
    }
    & > img {
      max-width: 100%;
      margin-bottom: 10px;
    }
  }
}

@media screen and (max-width: 1440px) {
  .content-padding {
    padding: 6px;
  }
  .line-height-12 {
    line-height: 1.3;
  }
  .font-size-14 {
    font-size: 12px;
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
      font-size: 20px !important;
      font-weight: bold;
      line-height: @lineHeight;
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
