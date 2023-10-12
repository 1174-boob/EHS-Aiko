<template>
  <a-spin :spinning="spinning" wrapperClassName="a-spin">
    <div class="file-preview clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
      <!-- <iframe class="iframe-preview-pdf" v-if="pdfUrl" :src="pdfUrl" frameborder="0"></iframe> -->
      <div 
        class="pdf-preview-out"
        v-loading="boxLoading"
      >
        <!-- 上部 外层容器 用于滚动-->
        <div class="scroll-box">
          <!-- 用于截取调缩放后的空白区域 -->
          <div class="pdf-box">
            <!-- pdf预览区域(会被缩放) -->
            <div
              :style="getPdfSize()" 
              class="pdf-scale-box"
            >
              <!-- 预览组件 -->
              <pdf
                :src="pdfUrl"
                :page="currentPage"
                @num-pages="getTotalPage"
                @page-loaded="pageLoaded"
                @loaded="mountedLoaded"
              >
              </pdf>
            </div>
          </div>
        </div>
    
        <div class="bottom-tools">
          <div>
            共 {{ pageTotal }} 页
          </div>
          <div class="page">
            <el-button
              round
              type="primary"
              :disabled="currentPage === 1"
              @click="chengPage"
            >
              上一页
            </el-button>
            <el-button
              round
              type="primary"
              :disabled="currentPage === pageTotal"
              @click="chengPage('+')"
            >
              下一页
            </el-button>
          </div>
    
          <div class="scale">
            <el-button 
              type="primary"
              icon="el-icon-minus" 
              circle
              :disabled="(pageScale - 0.1) < 0.3"
              @click="scalePage"
            >
            </el-button>
            <el-button 
              type="primary"
              icon="el-icon-plus" 
              circle
              :disabled="(pageScale + 0.1) > 1"
              @click="scalePage('+')"
            >
            </el-button>
          </div>
        </div>
      </div>
      <!-- <div v-else>地址错误</div> -->
      <CommonModal :title="'签署告知书'" :visible="signVisible" :cancelFn="signCancle">
        <template slot="form">
          <a-form-model
            ref="editForm"
            :model="editForm"
            :rules="editFormRules"
            :label-col="labelColLong"
            :wrapper-col="wrapperColLong"
            labelAlign="left"
          >
            <a-form-model-item class="flex" label="签名区域" prop="sealData">
              <div class="test">
                <div id="testEle" class="testInfo"></div>
              </div>
              <a-button type="primary" class="m-l-15 m-t-10" @click="signUndo">
                撤销
              </a-button>
              <a-button type="primary" class="m-l-15 m-t-10" @click="signRedo">
                重签
              </a-button>
            </a-form-model-item>
            <a-form-model-item class="flex" :label-col="labelColSpec" :wrapper-col="wrapperColSpec" label="发送短信手机号">
              <span style="font-Size:24px">{{userPhone}}</span>
            </a-form-model-item>
            <a-form-model-item class="flex" :label-col="labelCol" :wrapper-col="wrapperCol" label="验证码" prop="code">
              <a-input allowClear :maxLength="8" style="width: 220px; margin-right: 15px" v-model="editForm.code" placeholder="请输入验证码"></a-input><a-button @click="sendCode">发送短信</a-button>
            </a-form-model-item>
          </a-form-model>
        </template>
        <template slot="btn">
          <a-button @click="signCancle">取消</a-button>
          <a-button type="primary" class="m-l-15" @click="signConfirm"
            >确定</a-button
          >
        </template>
      </CommonModal>
      <FixedBottom>
        <a-button :style="{ marginLeft: '8px' }" type="primary" v-show="!filePreview" @click="sign">签署</a-button>
        <a-button :style="{ marginLeft: '8px' }" @click="back">返回</a-button>
      </FixedBottom>
    </div>
  </a-spin>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js"
import FixedBottom from "@/components/commonTpl/fixedBottom";
import { responsibilityDetail,responsibilitySendCode,responsibilitySign} from "@/services/api.js";
import '@/utils/dzjm.min.js'
import pdf from "vue-pdf";
// import CMapReaderFactory from "vue-pdf/src/CMapReaderFactory.js";
import CMapReaderFactory from "vue-pdf-signature/src/CMapReaderFactory.js";
import { debounce } from "lodash";
export default {
  components: { FixedBottom, pdf },
  data() {
    this.sendCode = debounce(this.sendCode, 800);
    return {
      // 总页数
      pageTotal: 0,
      // 当前页
      currentPage: 1,
      // 缩放比例
      pageScale: 0.8,
      // 遮罩
      boxLoading: true,
      pageChangeTimer: null,
      spinning: true,
      pdfUrl: '',
      userPhone:'',
      fileId:'',
      id: undefined,
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      labelColLong: { span: 3 },
      wrapperColLong: { span: 21 },
      labelColSpec: { span: 6 },
      wrapperColSpec: { span: 18 },
      signVisible: false,
      filePreview: false,
      editForm:{},
      activeKey:'',
      // 表单验证
      editFormRules: {
        code: [
          { required: true, message: "验证码不能为空", trigger: "change" },
        ],
      },
      mSign: null
    };
  },
  created() {
    this.activeKey = this.$route.query.activeKey
    console.log(this.activeKey,9999);
    this.id = this.$route.query.id
    this.filePreview = this.$route.query.filePreview
    this.getPaperUrl()
    let zconsole_userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
    this.userPhone = zconsole_userInfo.user.phone
  },
  mounted() {
  },
  methods: {
    // 获取到pdf总页数时触发 会传入总页数
    getTotalPage(page) {
      this.pageTotal = page
    },
    // 初始化加载完毕触发
    mountedLoaded() {
      // 去除遮罩
      this.boxLoading = false
    },
    // 每加载完成一页时触发(初始化/翻页时均会触发)
    pageLoaded() {
      // 重新设置pdf预览区域容器外容器的尺寸
      this.setPdfBoxSize()
    },
    // 设置pdf预览区域容器的缩放尺寸
    getPdfSize() {
      return {
        transform: `scale(${this.pageScale})`
      }
    },
    // 点击缩放时触发
    scalePage(type) {
      // 改变缩放比例
      let sacle = 0
      if (type === '+') {
        sacle = this.pageScale + 0.1
      } else {
        sacle = this.pageScale - 0.1
      }
      // 可能会涉及js的精度损失 保留一位小数即可
      this.pageScale = Number(sacle.toFixed(1))
      // 缩放后pdf预览区域容器中会有留白 重新设置pdf预览区域容器外容器的尺寸
      this.setPdfBoxSize()
    },
    // 方法 翻页
    chengPage(type) {
      // 防抖 0.5秒内不再次触发时执行
      if (this.pageChangeTimer) {
        clearTimeout(this.pageChangeTimer)
      }
      // 执行翻页
      this.pageChangeTimer = setTimeout(() => {
        if (type === '+') {
          this.currentPage+=1
        } else {
          this.currentPage-=1
        }
        // 翻页后将滚动条归位到顶部
        this.scrollbarReset()
        this.pageChangeTimer = null
      }, 500)
    },
    // 方法 滚动条归位到顶部
    scrollbarReset() {
      let boxDom = document.querySelector('.scroll-box')
      boxDom.scrollTop = 0
    },
    // 方法 设置pdf预览区域容器外容器的尺寸
    setPdfBoxSize() {
      // 缩放后 pdf的显示上会缩小 但元素的实际占地尺寸不会变化(仍是原尺寸) 导致可能会出现部分区域留白 通过改变pdf预览区域容器外容器的尺寸 来将留白区域hidden
      // 获取pdf的原尺寸
      let boxDom = document.querySelector('.pdf-scale-box')
      // 获取要设置尺寸的元素dom
      let setDom = document.querySelector('.pdf-box')
      // 如有缩放 高度根据缩放比例变化(48px是预留的上下外边距)
      if (this.pageScale !== 1 && boxDom && setDom) {
        setDom.style.height = `${boxDom.clientHeight *  this.pageScale + 48}px`
      } else {
        setDom.style.height = ''
      }
      // console.log(this.pageScale)
      // console.log(boxDom.clientWidth *  this.pageScale)
    },
    getPaperUrl() {
      let apiData = {
        id: this.id,
      }
      responsibilityDetail(apiData)
        .then(res => {
          // this.pdfUrl = res.data.gatherFile.filePath

          //这里是重点，然后将流数据转换为url，CMapReaderFactory方法在进行处理
          this.pdfUrl = pdf.createLoadingTask({ url: res.data.gatherFile.filePath, CMapReaderFactory });

          this.fileId = res.data.fileId
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.spinning = false
        })
    },
    // 点击签署按钮
    sign(){
      console.log('点击签署按钮');
      this.signVisible = true
      this.$nextTick(()=>{
        //所有功能演示代码
        this.mSign = new EleSign({
          ele: null
        });
        this.mSign.init();
        this.mSign.moutedEle(document.getElementById("testEle"))
      })
    },
    // 点击确定按钮
    signConfirm(){
      if(JSON.parse(this.mSign.toJson()).data.length > 0) {
        var baseUrl = this.mSign.toJpeg();
        var dataWithoutPrefix = baseUrl.split(',')[1];
        // console.log(baseUrl, '生成的base64')
      } else {
        this.$antMessage.warn('请签署姓名!')
        return
      }
      if (!formValidator.formAll(this, "editForm")) return;
      let params = {
        id: this.id,
        fileId: this.fileId,
        sealData: dataWithoutPrefix,
        code:this.editForm.code
      }
      responsibilitySign(params).then((res)=>{
        if(res.code == 20000){
          this.$antMessage.success("签署成功！");
          this.filePreview = true
          this.signVisible = false
          this.getPaperUrl()
        }
      })
    },
    signUndo() {
      this.mSign.undo();
    },
    signRedo() {
      this.mSign.clear();
    },
    // 点击取消按钮
    signCancle() {
      this.signVisible = false;
      this.editForm = {};
    },
    // 发送短信
    sendCode(){
      responsibilitySendCode({}).then((res) => {
        if(res.code == 20000){
          this.$antMessage.success("发送成功！");
        }
      }).catch((err) =>{
        console.log(err);
     })
    },
    back() {
      if (this.activeKey == 1){
        let query = {
          activeKey:3
        }
        this.$router.push({
          path: '/ehsGerneralManage/securityArchiveManagement/safetyResponsibilityLetter',
          query,
        })
        console.log(this.activeKey,'go');
      } else {
        this.$router.push({
          path: '/ehsGerneralManage/securityArchiveManagement/safetyResponsibilityLetter',
        })
        console.log('come11');
      }
      // this.$router.go(-1)
    }
  },
};
</script>

<style scoped lang='less'>
::v-deep .ant-modal-content {
  .model-content-form {
    padding: 0 111px 0 102px !important;
  }
}
.testInfo {
  border: 2px dashed grey;
  overflow: hidden;
}
.file-preview {
  .iframe-preview-pdf {
    width: 100%;
    height: calc(100% - 75px);
  }
}
.pdf-preview-out {
  // 高度为占满父组件中的外层容器(若不需要在父组件中设置高度 也可以在本组件中直接设置为所需值)
  height: 90%;
  // border: 1px solid #909;
  &, div {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  // 滚动容器
  .scroll-box {
    // 高度按比例 溢出滚动
    height: calc(100% - 50px);
    overflow: auto;
    border: 2px solid #c0d8f3;
    border-bottom: none;
    border-radius: 6px;
    background-color: #eeeeee;
    // 滚动条样式
    &::-webkit-scrollbar {
      width: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #c0d8f3;
      border-radius: 6px;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
      border-radius: 6px;
    }
    // 用于缩放后截取掉不需要的空白的容器
    .pdf-box {
      overflow: hidden;
      padding: 24px;
      // border: 1px solid rgb(165, 11, 236);
    }
    // pdf预览区容器
    .pdf-scale-box {
      box-shadow: 0px 0px 20px 5px #666565;
      // border: 2px solid #090;
      // 设置缩放的中心点
      transform-origin: center top;
      transition: .2s;
    }
  }
  .bottom-tools {
    height: 50px;
    line-height: 50px;
    background-color: #c0d8f3;
    border: 1px solid #5caaf8;
    border-radius: 6px;
    display: flex;
    padding: 0px 24px;
    .page {
      color: #636a70;
      flex-grow: 1;
      // border: 1px solid #909;
      span {
        margin-right: 20px; 
      }
    }
    .scale {
      // border: 1px solid #909;
      text-align: right;
    }
  }
}
</style>
