<template>
  <CommonModal :title="'绘制签名'" :visible="signModalShow" :cancelFn="closeModel" id="signComp-model">
    <template slot="form">
      <a-form-model ref="editForm" :model="editForm" :label-col="labelCol" :wrapper-col="wrapperCol" labelAlign="left">
        <a-form-model-item class="flex" label="绘制区域" prop="sealData">
          <!-- <SignComp ref="signRef" /> -->
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
          </div>
          <div style="display: flex; justify-content: space-between;">
            <a-button style="flex-shrink: 0;" type="primary" class="m-l-15 m-t-10" @click="signRedo">
              重签
            </a-button>
            <p style="color: #999;flex-shrink: 1;">提示：请使用正楷字体描写签字引导</p>
          </div>
        </a-form-model-item>
      </a-form-model>
    </template>
    <template slot="btn">
      <a-button @click="closeModel">取消</a-button>
      <a-button type="primary" class="m-l-15" :loading="loading" @click="onSubmit">确定</a-button>
    </template>
  </CommonModal>
</template>

<script>
import { addSignManagementDataApi, editSignManagementDataApi } from "@/services/safetyEduArchives"
import { verifySignature,getSignatureImage} from "@/services/api.js";
import cancelLoading from "@/mixin/cancelLoading";
import SignComp from '@/components/signComp/index.vue'
import html2canvas from 'html2canvas'
export default {
  components: { SignComp },
  mixins: [cancelLoading],
  model: {
    prop: 'signModalShow',
  },
  props: ['signModalShow', 'sealDataId'],
  data() {
    return {
      editForm: {},
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      nameLength: '',
      firstImage:'',
      secondImage:'',
      thirdImage:'',
      forthImage:'',
      fifthImage:'',
      dataWithoutPrefix:'',
      dataWithoutPrefixTwo:'',
      loading:false,
      paraData:{},
      mSign1: null,
      mSign2: null,
      mSign3: null,
      mSign4: null,
      mSign5: null,
      rules: {
        shanggangyijian: [{ required: true, message: "不能为空", trigger: "change" }],
      },
      // 新增、修改表单
      formModel: {},
      userData: undefined
    };
  },
  //  ！！！！
  created() {
    let userInfo = JSON.parse(sessionStorage.getItem('zconsole_userInfo'));
    this.userData = userInfo.user.name;
    this.nameLength = this.userData.length
    console.log('this.userData',this.userData.length);
  },
  mounted(){
  },
  methods: {
    // 提交
    onSubmit() {
      // const { base64UrlWithoutPrefix } = this.$refs.signRef.getSignBase64() || {}
      // if (!base64UrlWithoutPrefix) {
      //   this.$antMessage.warn('请签署姓名!')
      //   return
      // }
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
      }
      if (this.nameLength == '3'){
        this.paraData = {
          signatureList: [dataWithoutPrefix1,dataWithoutPrefix2,dataWithoutPrefix3],
        }
      } else if (this.nameLength == '2'){
        this.paraData = {
          signatureList: [dataWithoutPrefix4,dataWithoutPrefix5],
        }
      }
      console.log('paraaaa',this.paraData);
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
              this.handleLoading()
              const apiName = this.sealDataId ? editSignManagementDataApi : addSignManagementDataApi

              let params = {
                sealData: this.dataWithoutPrefix,
                sealDataId: this.sealDataId,
              }
              apiName(params)
              .then(res => {
                this.$emit('signOnOk')
                this.closeModel()
              })
              .catch(err => { })
              .finally(() => {
                setTimeout(() => {
                  this.changeLoading()
                }, 300);
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
              this.handleLoading()
              const apiName = this.sealDataId ? editSignManagementDataApi : addSignManagementDataApi

              let params = {
                sealData: this.dataWithoutPrefixTwo,
                sealDataId: this.sealDataId,
              }
              apiName(params)
              .then(res => {
                this.$emit('signOnOk')
                this.closeModel()
              })
              .catch(err => { })
              .finally(() => {
                setTimeout(() => {
                  this.changeLoading()
                }, 300);
              })
            });    
          }
        })
      }
    },
    signRedo() {
      if (this.nameLength == '3') {
        this.mSign1.clear();
        this.mSign2.clear();
        this.mSign3.clear();
      } else if (this.nameLength == '2'){
        this.mSign4.clear();
        this.mSign5.clear();
      }
    },
    // 取消-关闭model
    closeModel() {
      this.$emit('input', false)
    },
  },
  watch: {
    signModalShow(newVal) {
      if (newVal) {
        console.log('newVal',newVal);
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
            this.$nextTick(()=>{
              this.nameLength = '2'
              this.forthImage = 'data:image/png;base64,' + res.data[0]
              this.fifthImage = 'data:image/png;base64,' + res.data[1]
            })
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
            console.log('kannimane');
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
        }
      } else {
        setTimeout(() => {
          this.formModel = {}
        }, 100);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.testInfoThree {
  width: 400px !important;
  height: 150px !important;
  // border: 2px dashed grey;
  overflow: hidden;
  display: flex;
}
.testInfoTwo{
  width: 400px !important;
  height: 150px !important;
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
</style>
