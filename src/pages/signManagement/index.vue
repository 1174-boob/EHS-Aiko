<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <a-spin :spinning="pageSpinning" wrapperClassName="a-spin">
      <div class="page-title">
        <h3 class="page-title-content">我的签名</h3>
      </div>

      <div class="sign-show-container">
        <img v-if="signUrl" :src="signUrl" class="sign-show" alt="签名">
        <a-empty v-else class="sign-empty" description="暂无签名"/>
      </div>
      <div class="page-button">
        <a-button type="primary" :disabled="!sealDataId" @click="rmSign">删除</a-button>
        <div style="margin-right: 15px;"></div>
        <a-button type="primary" @click="openSignModal">{{ signUrl ? '更换' : '签署' }}</a-button>
      </div>
    </a-spin>

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
            <a-button type="default" @click="sendFnCode" :disabled="countdownNumber !== 60" style="flex:1; minWidth:'90px',">{{ countdownNumber !== 60 ? countdownNumber + "s" : "发送短信" }}</a-button>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="storageCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" :loading='loadingSure' @click="storageConfirm">确定</a-button>
      </template>
    </CommonModal>

    <!-- 绘制签名弹窗 -->
    <SignModal v-model="signModalShow" :sealDataId="sealDataId" @signOnOk="signOnOk" />
  </div>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js"
import { getCheckPhoneAndIdNumberExist,getEditPhoneAndIdNumber,getAuthCodeByPhoneAndIdNumber,resendVerificationCode} from "@/services/api.js";
import cancelLoading from '@/mixin/cancelLoading'
import { getSignManagementDataApi,rmSignManagementDataApi } from "@/services/safetyEduArchives"
import SignModal from './components/signModal.vue'
import { debounce } from "lodash";
export default {
  components: { SignModal },
  mixins: [cancelLoading],
  data() {
    this.storageConfirm = debounce(this.storageConfirm, 1000);
    return {
      pageSpinning: false,
      signModalShow: false,
      userId: undefined,
      signUrl: '',
      sealDataId:undefined,
      userInfoData:{},
      loadingSure:false,
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
      storageVisible: false,
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
    }
  },
  created() {
    this.getDataList()
    let zconsole_userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
    this.userId = zconsole_userInfo.user.userId
  },
  watch:{
    startCountDown(newVal){
      newVal && this.countDown()
    },
    endCountDown(newVal){
      newVal && this.clearTimer()
    },
  },
  methods: {
    getDataList() {
      let params = {
        pageNo: 1, 
        pageSize: 10
      }
      this.pageSpinning = true
      return getSignManagementDataApi(params)
        .then((res) => {
          const {list} = res.data || {list:[]}
          if(Array.isArray(list) && list.length){
            const bs = 'data:image/jpeg;base64,'
            this.signUrl = bs + list[0].sealDataBase64
            this.sealDataId = list[0].sealDataId
          }else{
            this.signUrl = ''
            this.sealDataId = undefined
          }
        })
        .catch(err => { })
        .finally(() => {
          this.pageSpinning = false
        })
    },

    // 批量签署-打开弹窗
    openSignModal() {
      this.initPop()
      // this.signModalShow = true
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
        this.signModalShow = true
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
      this.loadingSure = true
      getEditPhoneAndIdNumber(apiData).then((res) =>{
        this.storageVisible = false;
        this.storageForm = {};
        this.signModalShow = true
      }).catch((err) =>{
        console.log(err);
      }).finally(()=>{
        this.loadingSure = false
      })
    },
    // 批量签署-弹窗提交成功
    signOnOk() {
      this.$antMessage.success("绘制成功！");
      this.getDataList()
    },

    // 删除签名
    rmSign(){
      this.$antConfirm({
        title: '确认删除？',
        onOk: async () => {
          let para = {
            sealDataId:this.sealDataId
          }
          await rmSignManagementDataApi(para)
          this.$antMessage.success('删除成功')
          this.getDataList()
        }
      })
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
  }
}
</script>

<style lang="less" scoped>
.page-title {
  display: flex;
  align-items: center;
  padding: 10px 0 30px;

  .page-title-content {
    margin-bottom: 0px;
    line-height: 1;
  }
}

.page-button{
  display: flex;
  align-items: center;
}

.sign-show-container {
  margin-bottom: 25px;
  width: 500px;
  height: 200px;
  box-sizing: content-box;
  border: 2px dashed grey;
  overflow: hidden;
  .sign-show {
    overflow: hidden;
    width: 100%;
  }
  .sign-empty{
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>