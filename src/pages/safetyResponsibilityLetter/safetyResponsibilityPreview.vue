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
      <CommonModal :title="'签署责任书'" :visible="signVisible" :cancelFn="signCancle">
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
              <div class="test" id="testBody">
                <div v-if="nameLength == '3'" class="testInfoThree" id="testInfoBorderThree" :style="{'border': '2px dashed grey'}">
                  <div 
                    id="testEle1"  
                    class="testItemThree"
                    :style="{'backgroundImage': 'url(' + firstImage + ')',
                      'backgroundRepeat': 'no-repeat', 
                      'backgroundPosition': 'center center',
                      'backgroundSize': '100%'
                    }">
                  </div>
                  <div 
                    id="testEle2"
                    class="testItemThree"
                    :style="{'backgroundImage': 'url(' + secondImage + ')',
                      'backgroundRepeat': 'no-repeat', 
                      'backgroundPosition': 'center center',
                      'backgroundSize': '100%'
                    }">
                  </div>
                  <div 
                    id="testEle3"  
                    class="testItemThree"
                    :style="{'backgroundImage': 'url(' + thirdImage + ')',
                      'backgroundRepeat': 'no-repeat', 
                      'backgroundPosition': 'center center',
                      'backgroundSize': '100%'
                    }">
                  </div>
                </div>
                <div v-if="nameLength == '2'" class="testInfoTwo" id="testInfoBorderTwo" :style="{'border': '2px dashed grey'}">
                  <div 
                    id="testEle4"  
                    class="testItemTwo"
                    :style="{'backgroundImage': 'url(' + forthImage + ')',
                      'backgroundRepeat': 'no-repeat', 
                      'backgroundPosition': 'center center',
                      'backgroundSize': '100%'
                    }">
                  </div>
                  <div 
                    id="testEle5"
                    class="testItemTwo"
                    :style="{'backgroundImage': 'url(' + fifthImage + ')',
                      'backgroundRepeat': 'no-repeat', 
                      'backgroundPosition': 'center center',
                      'backgroundSize': '100%'
                    }">
                  </div>
                </div>
                <div v-if="nameLength == '4'" class="testInfoTwo" id="testInfoBorderFour" :style="{'border': '2px dashed grey'}">
                  <div 
                    id="testEle6"  
                    class="testItemFour"
                    :style="{'backgroundImage': 'url(' + sixthImage + ')',
                      'backgroundRepeat': 'no-repeat', 
                      'backgroundPosition': 'center center',
                      'backgroundSize': '100%'
                    }">
                  </div>
                  <div 
                    id="testEle7"
                    class="testItemFour"
                    :style="{'backgroundImage': 'url(' + seventhImage + ')',
                      'backgroundRepeat': 'no-repeat', 
                      'backgroundPosition': 'center center',
                      'backgroundSize': '100%'
                    }">
                  </div>
                  <div 
                    id="testEle8"  
                    class="testItemFour"
                    :style="{'backgroundImage': 'url(' + eighthImage + ')',
                      'backgroundRepeat': 'no-repeat', 
                      'backgroundPosition': 'center center',
                      'backgroundSize': '100%'
                    }">
                  </div>
                  <div 
                    id="testEle9"
                    class="testItemFour"
                    :style="{'backgroundImage': 'url(' + ninthImage + ')',
                      'backgroundRepeat': 'no-repeat', 
                      'backgroundPosition': 'center center',
                      'backgroundSize': '100%'
                    }">
                  </div>
                </div>
              </div>
              <!-- <a-button type="primary" class="m-l-15 m-t-10" @click="signUndo">
                撤销
              </a-button> -->
              <div style="display: flex; justify-content: space-between;">
                <a-button style="flex-shrink: 0;" type="primary" class="m-l-15 m-t-10" @click="signRedo">
                  重签
                </a-button>
                <p style="color: #999;flex-shrink: 1;">提示：请使用正楷字体描写签字引导</p>
              </div>
            </a-form-model-item>
            <a-form-model-item class="flex" :label-col="labelColSpec" :wrapper-col="wrapperColSpec" label="发送短信手机号">
              <a-input style="width: 180px; margin-right: 20px" v-if="phoneNumberBtn == '确认'" v-model="formInline.phone" placeholder="请输入手机号" :maxLength="11"></a-input>
              <span v-if="phoneNumberBtn == '修改'" style="font-Size:24px; margin-right: 20px">{{userPhone?userPhone:'--'}}</span>
              <a-button @click="changeNumber" style="flex:1 ;minWidth:'90px';">{{phoneNumberBtn}}</a-button>
            </a-form-model-item>
            <a-form-model-item class="flex" :label-col="labelCol" :wrapper-col="wrapperCol" label="验证码" prop="code">
              <a-input allowClear :maxLength="8" style="width: 220px; margin-right: 15px" v-model="editForm.code" placeholder="请输入验证码"></a-input>
              <SendCodeButton/>
            </a-form-model-item>
          </a-form-model>
        </template>
        <template slot="btn">
          <a-button @click="signCancle">取消</a-button>
          <a-button type="primary" class="m-l-15" :loading='loading' @click="signConfirm"
            >确定</a-button
          >
        </template>
      </CommonModal>
      <FixedBottom>
        <a-button :style="{ marginLeft: '8px' }" type="primary" v-if="signatureStatus != '2'" v-show="!filePreview" @click="sign">签署</a-button>
        <a-button :style="{ marginLeft: '8px' }" @click="back">返回</a-button>
      </FixedBottom>
      <CommonModal :title="'个人认证'" :visible="storageVisible" :cancelFn="storageCancle">
        <template slot="form">
          <a-form-model
            ref="storageForm"
            :model="storageForm"
            :rules="tankFormRules"
            :label-col="{ style: { width: '90px' } }"
            :wrapper-col="{ style: { width: 'calc(100% - 90px)' } }"
            :colon="false"
            labelAlign="left"
          >
            <a-form-model-item class="flex" label="手机号" prop="phone">
              <a-input :disabled="showBtn" :maxLength="11" v-model="storageForm.phone" placeholder="请输入手机号" />
            </a-form-model-item>
            <a-form-model-item class="flex" label="身份证号" prop="idNumber">
              <a-input :disabled="showBtn" v-model="storageForm.idNumber" placeholder="请输入身份证号"/>
            </a-form-model-item>
            <a-form-model-item class="flex" label="验证码" prop="code">
              <a-input allowClear :maxLength="6" style="width: 220px; margin-right: 15px" v-model="storageForm.code" placeholder="请输入验证码"></a-input>
              <!-- <SendCodeButton/> -->
              <a-button type="default" @click="sendFnCode" :disabled="countdownNumber !== 60" style="flex:1; minWidth:'90px',">{{ countdownNumber !== 60 ? countdownNumber + "s" : "发送短信" }}</a-button>
            </a-form-model-item>
          </a-form-model>
        </template>
        <template slot="btn">
          <a-button @click="storageCancle">取消</a-button>
          <a-button type="primary" class="m-l-15" @click="storageConfirm">确定</a-button>
        </template>
      </CommonModal>
    </div>
  </a-spin>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js"
import SendCodeButton from '@/components/sendCodeButton/index.vue'
import FixedBottom from "@/components/commonTpl/fixedBottom";
import html2canvas from 'html2canvas'
import { 
  responsibilityDetail,
  responsibilitySendCode,
  getAuthCodeByPhoneAndIdNumber,
  resendVerificationCode,
  responsibilitySign,
  getCheckPhoneAndIdNumberExist,
  getEditPhoneAndIdNumber,
  verifySignature,
  getSignatureImage,
  getUserEditPhone,
  getDevMessageBOE } from "@/services/api.js";
import '@/utils/dzjm.min.js'
import pdf from "vue-pdf";
import { getQueryVariable } from "@/utils/util.js";
// import CMapReaderFactory from "vue-pdf/src/CMapReaderFactory.js";
import CMapReaderFactory from "vue-pdf-signature/src/CMapReaderFactory.js";
import { debounce } from "lodash";

export default {
  components: { FixedBottom, pdf, SendCodeButton },
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
      phoneNumberBtn:'修改',
      formInline: {
        phone:''
      },
      nameLength: '',
      firstImage:'',
      secondImage:'',
      thirdImage:'',
      forthImage:'',
      fifthImage:'',
      sixthImage:'',
      seventhImage:'',
      eighthImage:'',
      ninthImage:'',
      dataWithoutPrefix:'',
      dataWithoutPrefixTwo:'',
      dataWithoutPrefixFour:'',
      loading:false,
      pageChangeTimer: null,
      spinning: true,
      pdfUrl: '',
      userPhone:'',
      fileId:'',
      signatureStatus :'',
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
      userInfoData:{},
      storageVisible: false,
      storageForm: {
        idNumber:'',
        phone:'',
        code:''
      },
      countdownNumber: 60,
      countdownTimer: null,
      showBtn: false, 
      startCountDown: false, // 开始倒计时
      endCountDown: false, // 结束倒计时
      tankFormRules: {
        phone: [
          { required: true, validator: formValidator.texTphoneNumber, trigger: "blur" },
        ],
        idNumber: [
          { required: true, validator: formValidator.texTidCard, trigger: 'blur', },
        ],
        code: [
          { required: true, message: "验证码不能为空", trigger: "change" },
        ],
      },
      phoneValue:'',
      idNumberValue:'',
      // 表单验证
      editFormRules: {
        code: [
          { required: true, message: "验证码不能为空", trigger: "change" },
        ],
      },
      paraData:{},
      mSign1: null,
      mSign2: null,
      mSign3: null,
      mSign4: null,
      mSign5: null,
      mSign6: null,
      mSign7: null,
      mSign8: null,
      mSign9: null,
    };
  },
  activated() {
    console.log('activated钩子函数被调用');
  },
  watch:{
    startCountDown(newVal){
      newVal && this.countDown()
    },
    endCountDown(newVal){
      newVal && this.clearTimer()
    },
  },
  created() {
    let para = {
      totalHeight: '150',
      totalWidth: '500'
    }
    getSignatureImage(para).then((res)=>{
      // console.log('res1111',res.data);
      if (res.data.length == 3){
        this.$nextTick(()=>{
          this.nameLength = '3'
          this.firstImage = 'data:image/png;base64,' + res.data[0]
          this.secondImage = 'data:image/png;base64,' + res.data[1]
          this.thirdImage = 'data:image/png;base64,' + res.data[2]
        })
      } else if(res.data.length == 2){
        this.nameLength = '2'
        this.forthImage = 'data:image/png;base64,' + res.data[0]
        this.fifthImage = 'data:image/png;base64,' + res.data[1]
      } else if (res.data.length == 4) {
        this.nameLength = '4'
        this.sixthImage = 'data:image/png;base64,' + res.data[0]
        this.seventhImage = 'data:image/png;base64,' + res.data[1]
        this.eighthImage = 'data:image/png;base64,' + res.data[2]
        this.ninthImage = 'data:image/png;base64,' + res.data[3]
      }
    })
    this.initPop()
    this.activeKey = this.$route.query.activeKey
    console.log(this.activeKey,9999);
    this.id = this.$route.query.id != undefined ?this.$route.query.id:getQueryVariable('id')
    this.filePreview = this.$route.query.filePreview
    this.getPaperUrl()
  },
  mounted() {
  },
  methods: {
    changeNumber(){
      if (this.phoneNumberBtn == '修改'){
        this.phoneNumberBtn = '确认'
      } else {
        if (!this.validatePhoneNumber(this.formInline.phone)) { 
          this.$antMessage.warn('请输入正确格式的手机号！')
          return
        }
        getUserEditPhone({phone:this.formInline.phone}).then(()=>{
          this.$antMessage.success("操作成功！");
          this.formInline.phone = ''
          getDevMessageBOE({}).then((res) =>{
            sessionStorage.setItem('zconsole_userInfo', JSON.stringify(res.data));
            sessionStorage.setItem('userName', res.data.user.name);
            sessionStorage.setItem('userId', res.data.user.userId);
            let zconsole_userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
            this.userInfoData = zconsole_userInfo.other
            // console.log('this.userInfoData.phoneSCCCC',this.userInfoData);
            this.$nextTick(()=>{
              this.$set(this,"userPhone",this.userInfoData.phone)
            })
          });
        }).catch((err)=>{
          console.log(err);
        }).finally(() => {
          
        })
        this.phoneNumberBtn = '修改'  
      }
    },
    // 手机号校验
    validatePhoneNumber(phoneNumber) {
      const regex = /^1[3456789]\d{9}$/; // 手机号正则表达式
      return regex.test(phoneNumber); // 验证通过为true 不通过为false
    },
    initPop(){
      let zconsole_userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
      this.userInfoData = zconsole_userInfo.other
      this.userPhone = this.userInfoData.phone
      this.phoneValue = this.userInfoData.phone
      this.idNumberValue = this.userInfoData.idNumber
      // 先判断一下是否要弹出个人认证的弹框
      getCheckPhoneAndIdNumberExist({}).then((res) => {
        console.log("数据全");
      }).catch((err) => {
        this.storageVisible = true;
        this.$nextTick(()=>{
          this.$set(this.storageForm,"idNumber",this.idNumberValue)
          this.$set(this.storageForm,"phone",this.phoneValue)
        })
      });
    },
    // 关闭弹框
    storageCancle() {
      this.storageVisible = false;
      this.storageForm = {};
      this.back()
    },
    // 发送验证码
    sendFnCode: debounce(function () {
      if (this.$listeners.sendCode) {
        this.$emit('sendCode')
        console.log('this.$listeners.sendCode');
      } else {
        let apiData = {
          phone:this.storageForm.phone,
          idNumber:this.storageForm.idNumber == this.userInfoData.idNumber?this.userInfoData.realIdNumber:this.storageForm.idNumber,
        }
        if (this.showBtn == false) {
          getAuthCodeByPhoneAndIdNumber(apiData)
            .then((res) => {
              this.showBtn = true
              this.countDown()
              this.$antMessage.success("发送成功！");
            })
            .catch((err) => { })
        } else {
           resendVerificationCode(apiData)
            .then((res) => {
              this.showBtn = true
              this.countDown()
              this.$antMessage.success("发送成功！");
            })
            .catch((err) => { })
        }
      }
    }, 300, { leading: true, trailing: false }),

    // 开始倒计时
    countDown() {
      this.countdownNumber = 59;
      this.countdownTimer && window.clearInterval(this.countdownTimer);
      this.countdownTimer = setInterval(() => {
        this.countdownNumber--;
        if (this.countdownNumber === 0) {
          this.clearTimer();
        }
      }, 1000);
    },

    // 清除倒计时
    clearTimer() {
      this.countdownNumber = 60;
      this.countdownTimer && window.clearInterval(this.countdownTimer);
    },
    // 弹框确定
    storageConfirm() {
      if (this.storageForm.idNumber != this.userInfoData.idNumber) {
        if (!formValidator.formAll(this, 'storageForm')) {
          return;
        }
      }
      formValidator.formItemValidate(this, 'code', 'storageForm');
      let apiData = {
        phone:this.storageForm.phone,
        idNumber:this.storageForm.idNumber == this.userInfoData.idNumber?this.userInfoData.realIdNumber:this.storageForm.idNumber,
        authCode:this.storageForm.code,
      }
      // console.log(apiData,'apiData');
      // return
      getEditPhoneAndIdNumber(apiData).then((res) =>{
        this.storageVisible = false;
        this.storageForm = {};
      })
    },
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
        id: this.id, // 需要从地址栏取
      }
      responsibilityDetail(apiData)
        .then(res => {
          // this.pdfUrl = res.data.gatherFile.filePath

          //这里是重点，然后将流数据转换为url，CMapReaderFactory方法在进行处理
          this.pdfUrl = pdf.createLoadingTask({ url: res.data.gatherFile.filePath, CMapReaderFactory });

          this.fileId = res.data.fileId
          this.signatureStatus = res.data.signatureStatus
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
      this.phoneNumberBtn = '修改'
      let para = {
        totalHeight: '150',
        totalWidth: '500'
      }
      getSignatureImage(para).then((res)=>{
        // console.log('res1111',res.data);
        if (res.data.length == 3){
          this.$nextTick(()=>{
            this.nameLength = '3'
            this.firstImage = 'data:image/png;base64,' + res.data[0]
            this.secondImage = 'data:image/png;base64,' + res.data[1]
            this.thirdImage = 'data:image/png;base64,' + res.data[2]
          })
          
        } else if(res.data.length == 2){
          this.nameLength = '2'
          this.forthImage = 'data:image/png;base64,' + res.data[0]
          this.fifthImage = 'data:image/png;base64,' + res.data[1]
        } else if (res.data.length == 4){
          this.nameLength = '4'
          this.sixthImage = 'data:image/png;base64,' + res.data[0]
          this.seventhImage = 'data:image/png;base64,' + res.data[1]
          this.eighthImage = 'data:image/png;base64,' + res.data[2]
          this.ninthImage = 'data:image/png;base64,' + res.data[3]
        }
      })
      if (this.nameLength == '3') {
        this.$nextTick(()=>{
          //所有功能演示代码
          this.mSign1 = new EleSign({
            ele: null
          });
          this.mSign2 = new EleSign({
            ele: null
          });
          this.mSign3 = new EleSign({
            ele: null
          });
          this.mSign1.init();
          this.mSign2.init();
          this.mSign3.init();
          this.mSign1.moutedEle(document.getElementById("testEle1"))
          this.mSign2.moutedEle(document.getElementById("testEle2"))
          this.mSign3.moutedEle(document.getElementById("testEle3"))
        })
      } else if (this.nameLength == '2'){
        this.$nextTick(()=>{
          //所有功能演示代码
          this.mSign4 = new EleSign({
            ele: null
          });
          this.mSign5 = new EleSign({
            ele: null
          });
          this.mSign4.init();
          this.mSign5.init();
          this.mSign4.moutedEle(document.getElementById("testEle4"))
          this.mSign5.moutedEle(document.getElementById("testEle5"))
        })
      } else if (this.nameLength == '4'){
        this.$nextTick(()=>{
          //所有功能演示代码
          this.mSign6 = new EleSign({
            ele: null
          });
          this.mSign7 = new EleSign({
            ele: null
          });
          this.mSign8 = new EleSign({
            ele: null
          });
          this.mSign9 = new EleSign({
            ele: null
          });
          this.mSign6.init();
          this.mSign7.init();
          this.mSign8.init();
          this.mSign9.init();
          this.mSign6.moutedEle(document.getElementById("testEle6"))
          this.mSign7.moutedEle(document.getElementById("testEle7"))
          this.mSign8.moutedEle(document.getElementById("testEle8"))
          this.mSign9.moutedEle(document.getElementById("testEle9"))
        })
      }
    },
    // 点击确定按钮
    signConfirm(){
      if (this.nameLength =='3') {
        if(JSON.parse(this.mSign1.toJson()).data.length > 0 && JSON.parse(this.mSign2.toJson()).data.length > 0 && JSON.parse(this.mSign3.toJson()).data.length > 0) {
          var baseUrl1 = this.mSign1.toPng();
          var dataWithoutPrefix1 = baseUrl1.split(',')[1];
          var baseUrl2 = this.mSign2.toPng();
          var dataWithoutPrefix2 = baseUrl2.split(',')[1];
          var baseUrl3 = this.mSign3.toPng();
          var dataWithoutPrefix3 = baseUrl3.split(',')[1];
        } else {
          this.$antMessage.warn('请签署姓名!')
          return
        }
      } else if (this.nameLength =='2') {
        if(JSON.parse(this.mSign4.toJson()).data.length > 0 && JSON.parse(this.mSign5.toJson()).data.length > 0) {
          var baseUrl4 = this.mSign4.toPng();
          var dataWithoutPrefix4 = baseUrl4.split(',')[1];
          var baseUrl5 = this.mSign5.toPng();
          var dataWithoutPrefix5 = baseUrl5.split(',')[1];
        } else {
          this.$antMessage.warn('请签署姓名!')
          return
        }
      } else if (this.nameLength =='4') {
        if(JSON.parse(this.mSign6.toJson()).data.length > 0 && JSON.parse(this.mSign7.toJson()).data.length > 0 && JSON.parse(this.mSign8.toJson()).data.length > 0 && JSON.parse(this.mSign9.toJson()).data.length > 0) {
          var baseUrl6 = this.mSign6.toPng();
          var dataWithoutPrefix6 = baseUrl6.split(',')[1];
          var baseUrl7 = this.mSign7.toPng();
          var dataWithoutPrefix7 = baseUrl7.split(',')[1];
          var baseUrl8 = this.mSign8.toPng();
          var dataWithoutPrefix8 = baseUrl8.split(',')[1];
          var baseUrl9 = this.mSign9.toPng();
          var dataWithoutPrefix9 = baseUrl9.split(',')[1];
        } else {
          this.$antMessage.warn('请签署姓名!')
          return
        }
      }
      if (!formValidator.formAll(this, "editForm")) return;
      if (this.nameLength == '3'){
        this.paraData = {
          signatureList: [dataWithoutPrefix1,dataWithoutPrefix2,dataWithoutPrefix3],
        }
      } else if (this.nameLength == '2'){
        this.paraData = {
          signatureList: [dataWithoutPrefix4,dataWithoutPrefix5],
        }
      } else if (this.nameLength == '4'){
        this.paraData = {
          signatureList: [dataWithoutPrefix6,dataWithoutPrefix7,dataWithoutPrefix8,dataWithoutPrefix9],
        }
      }
      console.log('paraaaa',this.paraData);
      // return
      if (this.nameLength == '3') {
        verifySignature(this.paraData).then((res)=>{
          console.log('res1111',res);
          if(res.code == '20000'){  
            this.loading = true
            const element = document.getElementById('testBody');  
            const elementInfoBorder = document.getElementById('testInfoBorderThree');
            const elementSonfirst = document.getElementById('testEle1');
            const elementSonSecond = document.getElementById('testEle2');
            const elementSonThird = document.getElementById('testEle3');  
            // 获取元素的背景图像并删除它  
            elementInfoBorder.style.border = 'none'
            elementSonfirst.style.backgroundImage = 'none';  
            elementSonSecond.style.backgroundImage = 'none';  
            elementSonThird.style.backgroundImage = 'none';  
            // 获取元素的尺寸  
            const w = element.offsetWidth * 0.9;  
            const h = element.offsetHeight * 0.9;  
            const offsetTop = element.offsetTop;  
            const offsetLeft = element.offsetLeft;  
            const canvas = document.createElement('canvas');  
            let abs = 0;  
            const winI = document.body.clientWidth;  
            const winO = window.innerWidth;  
            if (winO > winI) {  
              abs = (winO - winI) / 2;  
            }  
            canvas.width = w * 2;  
            canvas.height = h * 2;  
            const context = canvas.getContext('2d');  
            context.scale(2, 2);  
            context.translate(-offsetLeft - abs, -offsetTop);  
            html2canvas(element, {  
              allowTaint: true,  
              scale: 1 ,
            }).then((res) => {  
              const pageDate = res.toDataURL('image/jpeg', 1.0);  
              console.log('我要变强111',pageDate,);  
              this.dataWithoutPrefix = pageDate.split(',')[1]
              let params = {
                id: this.id,
                fileId: this.fileId,
                sealData: this.dataWithoutPrefix,
                code:this.editForm.code
              }
              responsibilitySign(params).then((res)=>{
                if(res.code == 20000){
                  this.$antMessage.success("签署成功！");
                  this.filePreview = true
                  this.signVisible = false
                  this.loading = false
                  this.getPaperUrl()
                }
              }).catch(()=>{
                this.signVisible = false
                this.loading = false
                this.editForm.code = ''
              })
            });  
          }
        })
      } else if (this.nameLength == '2'){
        verifySignature(this.paraData).then((res)=>{
          console.log('res1111',res);
          if(res.code == '20000'){ 
            this.loading = true 
            const element = document.getElementById('testBody');  
            const elementInfoBorder = document.getElementById('testInfoBorderTwo');
            const elementSonForth = document.getElementById('testEle4');
            const elementSonFifth = document.getElementById('testEle5');
            // 获取元素的背景图像并删除它  
            elementInfoBorder.style.border = 'none'
            elementSonForth.style.backgroundImage = 'none';  
            elementSonFifth.style.backgroundImage = 'none';  
            // 获取元素的尺寸  
            const w = element.offsetWidth * 0.9;  
            const h = element.offsetHeight * 0.9;  
            const offsetTop = element.offsetTop;  
            const offsetLeft = element.offsetLeft;  
            const canvas = document.createElement('canvas');  
            let abs = 0;  
            const winI = document.body.clientWidth;  
            const winO = window.innerWidth;  
            if (winO > winI) {  
              abs = (winO - winI) / 2;  
            }  
            canvas.width = w * 2;  
            canvas.height = h * 2;  
            const context = canvas.getContext('2d');  
            context.scale(2, 2);  
            context.translate(-offsetLeft - abs, -offsetTop);  
            html2canvas(element, {  
              allowTaint: true,  
              scale: 1 ,
            }).then((res) => {  
              const pageDate = res.toDataURL('image/jpeg', 1.0);  
              // console.log('我要变强222',pageDate,);  
              this.dataWithoutPrefixTwo = pageDate.split(',')[1]
              console.log('this.dataWithoutPrefixTwo+++++++',this.dataWithoutPrefixTwo);

              let params = {
                id: this.id,
                fileId: this.fileId,
                sealData: this.dataWithoutPrefixTwo ,
                code:this.editForm.code
              }
              responsibilitySign(params).then((res)=>{
                if(res.code == 20000){
                  this.$antMessage.success("签署成功！");
                  this.filePreview = true
                  this.signVisible = false
                  this.loading = false
                  this.getPaperUrl()
                }
              }).catch(()=>{
                this.signVisible = false
                this.editForm.code = ''
                this.loading = false
              })
            });  
          }
        })
      } else if (this.nameLength == '4'){
        verifySignature(this.paraData).then((res)=>{
          console.log('res1111',res);
          if(res.code == '20000'){ 
            this.loading = true 
            const element = document.getElementById('testBody');  
            const elementInfoBorder = document.getElementById('testInfoBorderFour');
            const elementSonSixth = document.getElementById('testEle6');
            const elementSonSeventh = document.getElementById('testEle7');
            const elementSonEighth = document.getElementById('testEle8');
            const elementSonNinth = document.getElementById('testEle9');
            // 获取元素的背景图像并删除它  
            elementInfoBorder.style.border = 'none'
            elementSonSixth.style.backgroundImage = 'none';  
            elementSonSeventh.style.backgroundImage = 'none';  
            elementSonEighth.style.backgroundImage = 'none';  
            elementSonNinth.style.backgroundImage = 'none';  
            // 获取元素的尺寸  
            const w = element.offsetWidth * 0.9;  
            const h = element.offsetHeight * 0.9;  
            const offsetTop = element.offsetTop;  
            const offsetLeft = element.offsetLeft;  
            const canvas = document.createElement('canvas');  
            let abs = 0;  
            const winI = document.body.clientWidth;  
            const winO = window.innerWidth;  
            if (winO > winI) {  
              abs = (winO - winI) / 2;  
            }  
            canvas.width = w * 2;  
            canvas.height = h * 2;  
            const context = canvas.getContext('2d');  
            context.scale(2, 2);  
            context.translate(-offsetLeft - abs, -offsetTop);  
            html2canvas(element, {  
              allowTaint: true,  
              scale: 1 ,
            }).then((res) => {  
              const pageDate = res.toDataURL('image/jpeg', 1.0);  
              // console.log('我要变强222',pageDate,);  
              this.dataWithoutPrefixFour = pageDate.split(',')[1]
              console.log('this.dataWithoutPrefixFour',this.dataWithoutPrefixFour);
              let params = {
                id: this.id,
                fileId: this.fileId,
                sealData: this.dataWithoutPrefixFour,
                code:this.editForm.code
              }
              responsibilitySign(params).then((res)=>{
                if(res.code == 20000){
                  this.$antMessage.success("签署成功！");
                  this.filePreview = true
                  this.signVisible = false
                  this.loading = false
                  this.getPaperUrl()
                }
              }).catch(()=>{
                this.signVisible = false
                this.editForm.code = ''
                this.loading = false
              })
            });  
          }
        })
      }
    },
    signUndo() {
      this.mSign.undo();
    },
    signRedo() {
      if (this.nameLength == '3') {
        this.mSign1.clear();
        this.mSign2.clear();
        this.mSign3.clear();
      } else if (this.nameLength == '2'){
        this.mSign4.clear();
        this.mSign5.clear();
      } else if (this.nameLength == '4'){
        this.mSign6.clear();
        this.mSign7.clear();
        this.mSign8.clear();
        this.mSign9.clear();
      }
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
.testInfoThree {
  // border: 2px dashed grey;
  overflow: hidden;
  display: flex;
}
.testInfoTwo{
  // border: 2px dashed grey;
  overflow: hidden;
  display: flex;
}
.testItemThree {
  flex: 1;
  width: 33%;
  height: 100%;
  // border: 1px solid black;
}
.testItemTwo {
  flex: 1;
  width: 50%;
  height: 100%;
  // border: 1px solid black;
}
.testItemFour {
  flex: 1;
  width: 25%;
  height: 100%;
  // border: 1px solid black;
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
