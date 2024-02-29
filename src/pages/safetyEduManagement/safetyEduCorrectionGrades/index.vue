<template>
  <!-- 成绩录入 -->
  <HasFixedBottomWrapper>
    
    <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
      <!-- 上面的详情数据 -->
      <InfoDetailList :safetyEducationForm="safetyEducationForm" :trainerCompanyUserName="trainerCompanyUserName" :trainerDeptUserName="trainerDeptUserName" :trainerGroupUserName="trainerGroupUserName" />
      <!-- 下面的详情数据 -->
      <PageTitle>培训人员&nbsp;&nbsp;&nbsp;&nbsp; <span style="fontSize:14px;color:#9999a6">说明:同批次三级安全教育同一讲师若有多个培训级别均处于成绩录入节点，请将多个级别均录入完成后提交。</span></PageTitle> 
      <template>
        <DashBtn class="ttile-bbtn">
          <div>
            <a-button type="dashed" @click="importTrainingPersonnel">
              导入
            </a-button>
          </div>
        </DashBtn>
      </template>
      <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
        <vxe-table
          class="vxe-scrollbar beauty-scroll-fireBox"
          border
          show-overflow
          align="center"
          :data="dataSource"
          show-header-overflow
        >
          <vxe-column field="userName" title="姓名">
            <template #default="{ row }">
              <span>{{ row.userName ? row.userName : '--' }}/{{ row.userJobNumber ? row.userJobNumber : '--' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="deptName" title="部门">
            <template #default="{ row }">
              <span>{{ row.deptName ? row.deptName : '--' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="companyScore"  title="公司级">
            <template #default="{ row }">
              <a-input :disabled="type == 'show' || row.currentLevel != 1 || row.status == 3 || row.nodeStatus !='to_be_imported_by_company_level_lecturer'" @change="handleChange(row)" style="text-align: center;" class="editable-input" v-model="row.companyScore" :maxLength="30"></a-input>
            </template>
          </vxe-column>
          <vxe-column field="deptScore"  title="车间(部门)级别">
            <template #default="{ row }">
              <a-input :disabled="type == 'show' || row.currentLevel != 2 || row.status == 3 || row.nodeStatus !='to_be_imported_by_dept_level_lecturer'" @change="handleChange(row)" style="text-align: center;" class="editable-input" v-model="row.deptScore" :maxLength="30"></a-input>
            </template>
          </vxe-column>
          <vxe-column field="groupScore"  title="班组级">
            <template #default="{ row }">
              <a-input :disabled="type == 'show' || row.currentLevel != 3 || row.status == 3 || row.nodeStatus !='to_be_imported_by_group_level_lecturer'" @change="handleChange(row)" style="text-align: center;" class="editable-input" v-model="row.groupScore" :maxLength="30"></a-input>
            </template>
          </vxe-column>
          <template #empty>
            <div style="padding:16px 0;">
              <a-empty />
            </div>
          </template>
        </vxe-table>
      </CommonTable>
      
      <CommonModal :title="'绘制签名'" :visible="signVisible" :cancelFn="signCancle">
        <template slot="form">
          <a-form-model
            ref="editForm"
            :model="editForm"
            :label-col="labelColLong"
            :wrapper-col="wrapperColLong"
            labelAlign="left"
          >
            <a-form-model-item class="flex" label="绘制区域" prop="sealData">
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
          <a-button @click="signCancle">取消</a-button>
          <a-button type="primary" class="m-l-15" :loading='loading' @click="signConfirm"
            >确定</a-button
          >
        </template>
      </CommonModal>

      <CommonModal :title="'个人认证'" :visible="storageVisible" :cancelFn="storageCancle">
        <template slot="form">
          <a-form-model
            ref="storageForm"
            :model="storageForm"
            :rules="tankFormRules"
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 19 }"
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
            <h3>注:手机号开户对应的身份信息与当前信息一致，单日认证上限次数5次</h3>
          </a-form-model>
        </template>
        <template slot="btn">
          <a-button @click="storageCancle">取消</a-button>
          <a-button type="primary" class="m-l-15" :loading='loadingSure' @click="storageConfirm">确定</a-button>
        </template>
      </CommonModal>

      <CommonModal title="批量导入" :visible="uploadImportShow" :cancelFn="closeModel">
        <template slot="form">
          <a-form-model
            ref="ruleForm"
            :model="addForm"
            :rules="addFormRules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :colon="false"
            labelAlign="left"
          >
            <a-form-model-item>
              <span class="scal" @click="downTemplate">下载导入模板</span>
            </a-form-model-item>
            <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="培训级别" prop="currentLevel">
              <a-select allowClear  show-search v-model="addForm.currentLevel" placeholder="请选择培训级别">
                <a-select-option v-for="item in getDictTarget('s','educationLevel')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="flex" label="选择文件" prop="fileListExel">
              <UploadBtnStyle
                :showAcceptText="true"
                :onlyShow="false"
                :accept="['.xlsx']"
                :showUploadList="true"
                :btnText="'上传文件'"
                :btnType="'primary'"
                :limit="1"
                :btnIcon="false"
                @handleSuccess="handleSuccess"
                :data="addForm"
              ></UploadBtnStyle>
            </a-form-model-item>
          </a-form-model>
        </template>
        <template slot="btn">
          <a-button @click="closeModel">取消</a-button>
          <a-button class="m-l-15" type="primary" :loading="loadingImport" @click="okClick">确定</a-button>
        </template>
      </CommonModal>
      <DashBtn>
        <div></div>
        <div>
          <a-button type='primary' v-if="type == 'add'" @click="determine">确认</a-button>
          <a-button style="margin-left:10px" @click="back">取消</a-button>
        </div>
      </DashBtn>
    </div>

  </HasFixedBottomWrapper>
</template>

<script>
import InfoDetailList from "@/pages/safetyEduManagement/safetyEduCorrectionGrades/components/detailList.vue";
import {educationDetail, verifySignature, getSignatureImage, getEducationUserListPage, educationCorrect,educationImport, educationRecognition,getCheckPhoneAndIdNumberExist,getAuthCodeByPhoneAndIdNumber,resendVerificationCode,getEditPhoneAndIdNumber} from "@/services/api.js"
import { debounce } from "lodash";
import { formValidator } from "@/utils/clx-form-validator.js"
import html2canvas from 'html2canvas'
import { addSignManagementDataApi, getSignManagementDataApi } from "@/services/safetyEduArchives"
import UploadBtnStyle from "@/components/upload/uploadStyleXt.vue";
import {getDictTarget} from '@/utils/dictionary'
import { getQueryVariable } from "@/utils/util.js"

export default {
  components: { InfoDetailList,UploadBtnStyle},
  data() {
    this.handleChange = debounce(this.handleChange, 800);
    return{
      id:'',
      type:'',
      safetyEducationForm:{},
      trainerCompanyUserName:'',
      trainerDeptUserName:'',
      trainerGroupUserName:'',
      getDictTarget,
      uploadImportShow: false,
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
      editForm:{},
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
      userInfoData:{},
      phoneValue:'',
      idNumberValue:'',
      storageVisible: false,
      storageForm: {
        idNumber:'',
        phone:'',
        code:''
      },
      showBtn: false,
      loading: false,
      loadingSure:false,
      countdownNumber: 60,
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
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      labelColLong: { span: 3 },
      wrapperColLong: { span: 21 },
      addForm: {
        fileListExel: []
      },
      addFormRules: {
        fileListExel: [
          { required: true, message: "文件不能为空", trigger: "change" },
        ],
      },
      loadingImport: false,
      signVisible: false,
      dataSource:[],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
    }
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
    this.id = this.$route.query.id ? this.$route.query.id : getQueryVariable('id')
    this.type = this.$route.query.type ? this.$route.query.type : getQueryVariable('type')
    this.init()
    console.log(this.id,this.type);
    let zconsole_userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
    this.userId = zconsole_userInfo.user.userId
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
  },
  methods:{
    //确认上传
    okClick() {
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      this.loadingImport = true;
      let para = {
        id: this.id,
        currentLevel:this.addForm.currentLevel,
        fileId: this.addForm.fileListExel[0].id,
      }
      console.log('para导入参数',para);
      educationImport(para)
        .then((res) => {
          this.uploadImportShow = false
          this.$antMessage.success('导入成功！')
        })
        .catch((err) => { console.log(err);})
        .finally(() => {
          setTimeout(() => {
            this.loadingImport = false;
            this.getDetailDown()
          }, 200);
        })
    },

    // 批量导入成功文件
    handleSuccess(fileList) {
      this.addForm.fileListExel = fileList;
      formValidator.formItemValidate(this, "fileListExel", "ruleForm");
    },

    // 取消-关闭model
    closeModel() {
      this.uploadImportShow = false
    },

    //下载模板
    downTemplate() {
      window.open(
        window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/三级安全教育档案成绩导入.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/三级安全教育档案成绩导入.xlsx`
      );
    },
    // 确定 
    determine(){
      let zconsole_userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
      this.userInfoData = zconsole_userInfo.other
      this.phoneValue = this.userInfoData.phone
      this.idNumberValue = this.userInfoData.idNumber
      // 先判断一下是否要弹出个人认证的弹框
      getCheckPhoneAndIdNumberExist({}).then((res) => {
        console.log("数据全");
        let params = {
          pageNo: 1, 
          pageSize: 10
        }
        return getSignManagementDataApi(params)
        .then((res) => {
          const {list} = res.data || {list:[]}
          if(!(Array.isArray(list) && list.length)){
            this.$antMessage.warn('请维护个人签名!');
            this.signVisible = true
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
          } else {
            console.log('有签名=>点击确认SCC@');
            educationRecognition({id:this.id}).then((res)=>{
              console.log(res,889);
              if(res.code != 20000){
                this.$antMessage.warn(res.message);
                return
              } else {
                this.$antMessage.success(res.message);
                this.$router.push("/ehsGerneralManage/securityArchiveManagement/safetyEduManagement")
              }
            })
          }
        })
        .catch(err => { })
        .finally(() => {
        })
      }).catch((err) => {
        this.storageVisible = true;
        this.$nextTick(()=>{
          this.$set(this.storageForm,"idNumber",this.idNumberValue)
          this.$set(this.storageForm,"phone",this.phoneValue)
        })
      });
    },
    // 纠错
    handleChange(row){
      let para = {
        id: row.id,
        companyScore: row.companyScore, //公司级培训纠错成绩
        deptScore: row.deptScore, //部门级培训纠错成绩
        groupScore: row.groupScore //班组级培训纠错成绩
      }
      educationCorrect(para).then((res)=>{
        if(res.code != 20000){
          this.$antMessage.warn(res.message);
          return
        }
      }).catch((err)=>{
        console.log(err);
      })  
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
          this.$antMessage.warn('请绘制姓名!')
          return
        }
      } else if (this.nameLength =='2') {
        if(JSON.parse(this.mSign4.toJson()).data.length > 0 && JSON.parse(this.mSign5.toJson()).data.length > 0) {
          var baseUrl4 = this.mSign4.toPng();
          var dataWithoutPrefix4 = baseUrl4.split(',')[1];
          var baseUrl5 = this.mSign5.toPng();
          var dataWithoutPrefix5 = baseUrl5.split(',')[1];
        } else {
          this.$antMessage.warn('请绘制姓名!')
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
          this.$antMessage.warn('请绘制姓名!')
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
                sealData: this.dataWithoutPrefix,
              }
              addSignManagementDataApi(params).then((res)=>{
                if(res.code == 20000){
                  this.$antMessage.success("绘制成功！");
                  this.signVisible = false
                  this.loading = false
                  this.choosedArr = []
                }
              }).catch(()=>{
                this.signVisible = false
                this.loading = false
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
                sealData: this.dataWithoutPrefixTwo ,
              }
              addSignManagementDataApi(params).then((res)=>{
                if(res.code == 20000){
                  this.$antMessage.success("绘制成功！");
                  this.signVisible = false
                  this.loading = false
                  this.choosedArr = []
                }
              }).catch(()=>{
                this.signVisible = false
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
                sealData: this.dataWithoutPrefixFour ,
              }
              addSignManagementDataApi(params).then((res)=>{
                if(res.code == 20000){
                  this.$antMessage.success("绘制成功！");
                  this.signVisible = false
                  this.loading = false
                  this.choosedArr = []
                }
              }).catch(()=>{
                this.signVisible = false
                this.loading = false
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
    // 返回
    back() {
      // this.$router.go(-1);
      this.$router.push({ path: "/ehsGerneralManage/securityArchiveManagement/safetyEduManagement" });
    },
    init() {
      this.getDetailUp()
      this.getDetailDown()
    },
    getDetailUp(){
      educationDetail({ id: this.id })
        .then((res) => {
          this.safetyEducationForm = res.data ? res.data : null;
          this.trainerCompanyUserName = this.safetyEducationForm.company.map(obj => `${obj.userName}/${obj.jobNumber}`).join('，');
          this.trainerDeptUserName = this.safetyEducationForm.dept.map(obj => `${obj.userName}/${obj.jobNumber}`).join('，');
          this.trainerGroupUserName = this.safetyEducationForm.group.map(obj => `${obj.userName}/${obj.jobNumber}`).join('，');
        })
        .catch((err) => {
          console.log('err1',err);
        });
    },
    getDetailDown(){
      getEducationUserListPage({ id: this.id ,pageNo: this.page.pageNo,pageSize: this.page.pageSize})
        .then((res) => {
          this.dataSource = res.data.list ? res.data.list : [];
          console.log('res.data.list',res.data.list);
          this.page.total = res.data.total
        })
        .catch((err) => {
          console.log('err2',err);
        });
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page
      // 获取列表
      this.getDetailDown()
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1
      this.page.pageSize = pageSize
      this.getDetailDown()
    },
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
    // 导入
    importTrainingPersonnel(){
      console.log('导入人员SCC');
      let zconsole_userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
      this.userInfoData = zconsole_userInfo.other
      this.phoneValue = this.userInfoData.phone
      this.idNumberValue = this.userInfoData.idNumber
      // 先判断一下是否要弹出个人认证的弹框
      getCheckPhoneAndIdNumberExist({}).then((res) => {
        console.log("数据全");
        this.signName()
        this.addForm = {}
      }).catch((err) => {
        this.storageVisible = true;
        this.$nextTick(()=>{
          this.$set(this.storageForm,"idNumber",this.idNumberValue)
          this.$set(this.storageForm,"phone",this.phoneValue)
        })
      });
    },
    signName(){
      let params = {
        pageNo: 1, 
        pageSize: 10
      }
      return getSignManagementDataApi(params)
      .then((res) => {
        const {list} = res.data || {list:[]}
        if(!(Array.isArray(list) && list.length)){
          this.$antMessage.warn('维护好个人签名后方可导入成绩!');
          this.signVisible = true
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
        } else {
          console.log('有签名=>弹出导入弹框SCC@');
          this.uploadImportShow = true
        }
      })
      .catch(err => { })
      .finally(() => {
      })
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
      }).catch((err) =>{
        console.log(err);
      }).finally(()=>{
        this.loadingSure = false
      })
    },
    // 关闭弹框
    storageCancle() {
      this.storageVisible = false;
      this.signVisible = false
      this.storageForm = {};
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
  },
}
</script>

<style lang="less" scoped>
.scal {
  cursor: pointer;
  &:hover {
    color: #0067cc;
  }
}
.ttile-bbtn {
  margin-bottom: 20px;
}
.testInfoThree {
  overflow: hidden;
  display: flex;
}
.testInfoTwo{
  overflow: hidden;
  display: flex;
}
.testItemThree {
  flex: 1;
  width: 33%;
  height: 100%;
}
.testItemTwo {
  flex: 1;
  width: 50%;
  height: 100%;
}
.testItemFour {
  flex: 1;
  width: 25%;
  height: 100%;
}
</style>
