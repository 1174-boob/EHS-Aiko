<template>
  <HasFixedBottomWrapper>
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <a-form-model ref="ruleForm" :model="iFrom" :rules="iRules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <div class="m-t-20"></div>

        <!-- 基本信息模块-->
        <template title="基本信息">
          <a-row>
            <a-col :span="12">
              <CommonSearchItem ref="commonSearchItem" :rules="iRules" :CommonFormInline="iFrom" :notTablePage="true" :disabled='true'></CommonSearchItem>
              <a-form-model-item label="部门" prop="deptName">
                <a-input v-model="iFrom.deptName" placeholder="请输入部门" :disabled='true'></a-input>
              </a-form-model-item>
              <a-form-model-item label="设备或区域" prop="equipmentArea">
                <a-input v-model.trim="iFrom.equipmentArea" :maxLength="100" placeholder="请输入设备或区域" :disabled='true'></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="工艺" prop="workmanship">
                <a-input v-model.trim="iFrom.workmanship" :maxLength="30" placeholder="请输入工艺" :disabled='true'></a-input>
              </a-form-model-item>
              <a-form-model-item label="作业状态" prop="jobStatus">
                <a-select v-model="iFrom.jobStatus" placeholder="请选择" :disabled='true'>
                  <a-select-option v-for="item in dangerOperations" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>

         <!-- 危险源信息模块-->
        <template title="危险源">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>危险源</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="危险源类型" prop="riskType">
                <a-select v-model="iFrom.riskType" placeholder="请选择" :disabled='true' >
                  <a-select-option v-for="item in dangerHazardtype" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="危险源种类" prop="riskClass">
                <a-select v-model="iFrom.riskClass" placeholder="请选择" :disabled='true'>
                  <a-select-option v-for="item in dangerHazardkind" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="可能导致事件" prop="possibleEvents">
                <a-select mode="multiple" v-model="iFrom.possibleEvents" placeholder="请选择" :disabled='true' >
                  <a-select-option v-for="item in dangerLeadtheevent" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
             <a-form-model-item label="可能接触伤害的部位" prop="partsBodyInjury">
                <a-select v-model="iFrom.partsBodyInjury" placeholder="请选择" :disabled='true' >
                  <a-select-option v-for="item in dangerWoundthepart" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="风险描述" prop="riskDescription">
                <a-textarea v-model.trim="iFrom.riskDescription" :maxLength="300" placeholder="请输入风险描述" :disabled='true'></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>

        <!-- 作业条件危险性评价模块-->
        <template title="作业条件危险性评价">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>作业条件危险性评价</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-row>
            <a-col :span="12">
               <a-form-model-item label="发生事故事件的可能性" prop="accidentsIncidents">
                <a-select v-model="iFrom.accidentsIncidents" placeholder="请选择" :disabled='true'>
                  <a-select-option v-for="item in eventpossibility" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="L值" prop="lvalue">
                <a-input v-model.trim="iFrom.lvalue" :maxLength="30" placeholder="自动带出" :disabled='true'></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
               <a-form-model-item label="人员暴露于危险环境的频繁程度" prop="environment">
                <a-select v-model="iFrom.environment" placeholder="请选择" :disabled='true'>
                  <a-select-option v-for="item in personnelexposure" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="E值" prop="evalue">
                <a-input v-model.trim="iFrom.evalue" :maxLength="30" placeholder="自动带出" :disabled='true'></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>

        <!-- 发生事故产生的后果模块-->
        <template title="发生事故产生的后果">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>发生事故产生的后果</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-row>
            <a-col :span="12">
               <a-form-model-item label="人员伤害" prop="personalInjury">
                <a-select v-model="iFrom.personalInjury" placeholder="请选择" :disabled='true'>
                  <a-select-option v-for="item in personalinjury" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="(C-人)值" prop="cvaluep">
                <a-input v-model.trim="iFrom.cvaluep" :maxLength="30" placeholder="自动带出" :disabled='true'></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
               <a-form-model-item label="生产损失" prop="productionLoss">
                <a-select v-model="iFrom.productionLoss" placeholder="请选择" :disabled='true'>
                  <a-select-option v-for="item in productionloss" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="(C-产)值" prop="cvalues">
                <a-input v-model.trim="iFrom.cvalues" :maxLength="30" placeholder="自动带出" :disabled='true'></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
               <a-form-model-item label="C值" prop="cvalue">
                <a-input v-model.trim="iFrom.cvalue" :maxLength="30" placeholder="自动带出" :disabled='true'></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="风险值" prop="valueRisk">
                <a-input v-model.trim="iFrom.valueRisk" :maxLength="30" placeholder="自动带出" :disabled='true'></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
               <a-form-model-item label="危险级别" prop="hazardLevel">
                <a-select v-model="iFrom.hazardLevel" placeholder="自动带出" :disabled='true'>
                  <a-select-option v-for="item in hazardLevelList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <div :class="[classBack]">
                <a-form-model-item label="风险分级" prop="riskClassification">
                  <a-select v-model="iFrom.riskClassification" placeholder="自动带出" :disabled='true'>
                    <a-select-option v-for="item in riskLevelList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </div>
            </a-col>
          </a-row>
        </template>
        
         <!-- 策划控制模块-->
        <template title="策划控制">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>策划控制</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-row>
             <a-col :span="12">
              <a-form-model-item label="规定" prop="regulations">
                <a-input v-model.trim="iFrom.regulations" :maxLength="30" placeholder="请输入规定" :disabled='true'></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>
      </a-form-model>
    </a-spin>
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="goBack">返回</a-button>
          <a-button class="m-r-15" v-if="processReview==2" @click="backReview">退回</a-button>
          <a-button type="primary" v-if="processReview==2" class="m-r-15" :loading="loading" @click="reviewConfirm">评审</a-button>
        </div>
      </FixedBottom>
    </div>
    <CommonModal title="评审" :visible="reviewVisible" :cancelFn="reviewCancel" class="table-modal review-content">
      <template slot="form">
        <a-form-model ref="reviewForm" :model="reviewForm" :rules="reviewRules" :label-col="labelCol" :wrapper-col="wrapperCol">

          <!-- 作业条件危险性评价模块-->
          <template title="作业条件危险性评价">
            <div>
              <div class="m-t-20">
                <PageTitle>作业条件危险性评价</PageTitle>
              </div>
              <div class="m-t-20"></div>
            </div>
            <a-row>
              <a-col :span="17">
                <a-form-model-item label="发生事故事件的可能性" prop="accidentsIncidents">
                  <a-select v-model="reviewForm.accidentsIncidents" placeholder="请选择" @change="changeAll($event,'lvalue')">
                    <a-select-option v-for="item in eventpossibility" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="7">
                <a-form-model-item label="L值" prop="lvalue">
                  <a-input v-model.trim="reviewForm.lvalue" :maxLength="30" placeholder="自动带出" :disabled='true'></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="17">
                <a-form-model-item label="人员暴露于危险环境的频繁程度" prop="environment">
                  <a-select v-model="reviewForm.environment" placeholder="请选择" @change="changeAll($event,'evalue')">
                    <a-select-option v-for="item in personnelexposure" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="7">
                <a-form-model-item label="E值" prop="evalue">
                  <a-input v-model.trim="reviewForm.evalue" :maxLength="30" placeholder="自动带出" :disabled='true'></a-input>
                </a-form-model-item>
              </a-col>
            </a-row>
          </template>

          <!-- 发生事故产生的后果模块-->
          <template title="发生事故产生的后果">
            <div>
              <div class="m-t-20">
                <PageTitle>发生事故产生的后果</PageTitle>
              </div>
              <div class="m-t-20"></div>
            </div>
            <a-row>
              <a-col :span="17">
                <a-form-model-item label="人员伤害" prop="personalInjury">
                  <a-select v-model="reviewForm.personalInjury" placeholder="请选择" @change="changeAll($event,'cvaluep')">
                    <a-select-option v-for="item in personalinjury" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="7">
                <a-form-model-item label="(C-人)值" prop="cvaluep">
                  <a-input v-model.trim="reviewForm.cvaluep" :maxLength="30" placeholder="自动带出" :disabled='true'></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="17">
                <a-form-model-item label="生产损失" prop="productionLoss">
                  <a-select v-model="reviewForm.productionLoss" placeholder="请选择" @change="changeAll($event,'cvalues')">
                    <a-select-option v-for="item in productionloss" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="7">
                <a-form-model-item label="(C-产)值" prop="cvalues">
                  <a-input v-model.trim="reviewForm.cvalues" :maxLength="30" placeholder="自动带出" :disabled='true'></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="17">
                <a-form-model-item label="C值" prop="cvalue">
                  <a-input v-model.trim="reviewForm.cvalue" :maxLength="30" placeholder="自动带出" :disabled='true'></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="7">
                <a-form-model-item label="风险值" prop="valueRisk">
                  <a-input v-model.trim="reviewForm.valueRisk" :maxLength="30" placeholder="自动带出" :disabled='true'></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="17">
                <a-form-model-item label="危险级别" prop="hazardLevel">
                  <a-select v-model="reviewForm.hazardLevel" placeholder="自动带出" :disabled='true'>
                    <a-select-option v-for="item in hazardLevelList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="7">
                <div :class="[classReviewBack]">
                  <a-form-model-item label="风险分级" prop="riskClassification">
                    <a-select v-model="reviewForm.riskClassification" placeholder="自动带出" :disabled='true'>
                      <a-select-option v-for="item in riskLevelList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </div>
              </a-col>
            </a-row>
          </template>
          <!-- 评审意见模块-->
          <template title="评审意见">
            <div>
              <div class="m-t-20 border-d-e7">
              </div>
              <div class="m-t-20"></div>
            </div>
            <a-row>
              <a-col :span="17">
                <a-form-model-item label="危险源标识" prop="riskType">
                  <a-radio-group v-model="reviewForm.riskType" :options="plainOptions"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="17">
                <a-form-model-item label="评审意见">
                  <a-textarea v-model.trim="reviewForm.reviewRemake" :maxLength="300" placeholder="请输入评审意见"></a-textarea>
                </a-form-model-item>
              </a-col>
            </a-row>
          </template>
        </a-form-model>
      </template>
      
      <template slot="btn">
        <a-button @click="reviewCancel">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="confirm" :loading="confirmLoading">确定</a-button>
      </template>
    </CommonModal>
    <BackModel :outTitle="'退回申请'" :title="'退回原因'" :backFlag="backFlag" @cancleBackFlag="cancleBackFlag" />
  </HasFixedBottomWrapper>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import BackModel from "@/pages/hiddenPerils/components/backRason/index.vue";
import cancelLoading from "@/mixin/cancelLoading";
import chemicalDict from "@/mixin/chemicalDict.js";
import { formValidator } from "@/utils/clx-form-validator.js";
import dictionary from '@/utils/dictionary';
import { reviewSelectDetail,reviewInfo,returnReview } from "@/services/dangerSource/dangerApprove/index.js";
import { getQueryVariable } from "@/utils/util.js"
export default {
  components: { FixedBottom, BackModel },
  mixins: [cancelLoading, chemicalDict],
  data() {
    return {
      dangerApproveId: "",
      processReview: 1,
      dangerApproveCode: '',
      spinning:false,
      confirmLoading:false,
      reviewVisible: false,
      plainOptions:[
        { label: '共性危险源', value: '1' },
        { label: '特异性危险源', value: '2' },
      ],
      reviewForm: {
        riskType: undefined,
        reviewRemake: undefined,
        cvalue: undefined,
        accidentsIncidents: undefined,
        lvalue: undefined,
        environment: undefined,
        evalue: undefined,
        //发生事故产生的后果
        personalInjury: undefined,
        cvaluep:undefined,
        productionLoss:undefined,
        cvalues: undefined,
        valueRisk: undefined,
        hazardLevel: undefined,
        riskClassification: undefined,
      },
      backFlag: false,
      classBack:'',
      classReviewBack:'',
      dangerOperations:[],//作业状态
      dangerHazardtype:[],//危险源类型
      dangerHazardkind:[],//危险源种类
      dangerLeadtheevent:[],//可能导致的事件
      dangerWoundthepart:[],//可能接触伤害的部位
      eventpossibility:[],//发生事故的可能
      personnelexposure:[],//人员暴露
      personalinjury:[],//人员伤害
      productionloss:[],//生产损失
      dictObj:{},
      hazardLevelList:[],//危险级别
      riskLevelList:[],//风险分级
      iFrom:{},
      iRules: {
        //基本信息
        deptName: [{ required: true, message: "部门不能为空", trigger: "change" },],
        workmanship: [{ required: true, message: "工艺不能为空", trigger: "change" },],
        jobStatus: [{ required: true, message: "作业状态不能为空", trigger: "change" },],
        
        //危险源
        riskType: [{ required: true, message: "危险源类型不能为空", trigger: "change" },],
        riskClass: [{ required: true, message: "危险源种类不能为空", trigger: "change" },],
        possibleEvents: [{ required: true, message: "可能导致事件不能为空", trigger: "change" },],
        partsBodyInjury: [{ required: true, message: "可能接触伤害的部位不能为空", trigger: "change" },],
        riskDescription: [{ required: true, message: "风险描述不能为空", trigger: "change" },],
        
        //作业条件危险性评价
        accidentsIncidents: [{ required: true, message: "发生事故事件的可能性不能为空", trigger: "change" },],
        environment: [{ required: true, message: "人员暴露于危险环境的频繁程度不能为空", trigger: "change" },],

        //发生事故产生的后果
        personalInjury: [{ required: true, message: "人员伤害不能为空", trigger: "change" },],
        productionLoss: [{ required: true, message: "生产损失不能为空", trigger: "change" },],
        
        //策划控制
        regulations: [{ required: true, message: "规定不能为空", trigger: "change" },],
      },
      reviewRules: {
        //作业条件危险性评价
        accidentsIncidents: [{ required: true, message: "发生事故事件的可能性不能为空", trigger: "change" },],
        environment: [{ required: true, message: "人员暴露于危险环境的频繁程度不能为空", trigger: "change" },],

        //发生事故产生的后果
        personalInjury: [{ required: true, message: "人员伤害不能为空", trigger: "change" },],
        productionLoss: [{ required: true, message: "生产损失不能为空", trigger: "change" },],
        riskType: [{ required: true, message: "危险源标识不能为空", trigger: "change" },],
      }
    }
  },
  computed: {
    labelCol(){
        let scrol = window.innerWidth
        if(scrol < 1910){
            return { span: 10 }
        }else{
            return { span: 8 }
        }
    },
    wrapperCol(){
        let scrol = window.innerWidth
        if(scrol < 1910){
            return { span: 14 }
        }else{
            return { span: 16 }
        }
    },
  },
  watch:{
    iFrom: {
      // 数据变化时执行的逻辑代码
      handler(newVal, oldVal) {
        console.log("iiiiiiiiiiiiiiiiii",newVal);
          //计算C值
          if(!newVal.cvalues && newVal.cvaluep){//(C-人)值存在
            newVal.cvalue = newVal.cvaluep
          }else if(newVal.cvalues && !newVal.cvaluep){//(C-产)值值存在
            newVal.cvalue = newVal.cvalues
          }else if(newVal.cvalues && newVal.cvaluep && Number(newVal.cvalues) >= Number(newVal.cvaluep)){//(C-产)>(C-人)
            newVal.cvalue = newVal.cvalues
          }else if(newVal.cvalues && newVal.cvaluep && Number(newVal.cvalues) < Number(newVal.cvaluep)){//(C-产)<(C-人)
            newVal.cvalue = newVal.cvaluep
          }

          //计算风险值
          if(newVal.lvalue && newVal.evalue && newVal.cvalue){
            newVal.valueRisk = Number(newVal.lvalue)* 10 * Number(newVal.evalue) * Number(newVal.cvalue) / 10
          }

          //计算危险级别、风险分级
          if(newVal.valueRisk){
            console.log("--------------tt",newVal.valueRisk);
            //低风险< 70   一般风险<=70 <160   较大风险 <=160 <320   重大风险 >=320
            let list1 = ['significantRisk', "largerRisk", "generalRisk", "lowRisk"];
            let list2 = ['5', '4', '3', '2'];
            let valueRisk = Number(newVal.valueRisk);
              if( valueRisk < 70 ){
                newVal.riskClassification = list1[3]
                newVal.hazardLevel = list2[3]
                this.classBack = 'lowRisk'
              }else if( valueRisk >= 70 && valueRisk < 160){
                newVal.riskClassification = list1[2]
                newVal.hazardLevel = list2[2]
                this.classBack = 'generalRisk'
              }else if( valueRisk >= 160 && valueRisk < 320){
                newVal.riskClassification = list1[1]
                newVal.hazardLevel = list2[1]
                this.classBack = 'largerRisk'
              }else if( valueRisk >= 320 ){
                newVal.riskClassification = list1[0]
                newVal.hazardLevel = list2[0]
                this.classBack = 'significantRisk'
              }
          }
      },
      // 开启深度监听
      deep: true,
      immediate: true,
    },
    reviewForm: {
      // 数据变化时执行的逻辑代码
      handler(newVal, oldVal) {
          //计算C值
          if(!newVal.cvalues && newVal.cvaluep){//(C-人)值存在
            newVal.cvalue = newVal.cvaluep
          }else if(newVal.cvalues && !newVal.cvaluep){//(C-产)值值存在
            newVal.cvalue = newVal.cvalues
          }else if(newVal.cvalues && newVal.cvaluep && Number(newVal.cvalues) >= Number(newVal.cvaluep)){//(C-产)>(C-人)
            newVal.cvalue = newVal.cvalues
          }else if(newVal.cvalues && newVal.cvaluep && Number(newVal.cvalues) < Number(newVal.cvaluep)){//(C-产)<(C-人)
            newVal.cvalue = newVal.cvaluep
          }

          //计算风险值
          if(newVal.lvalue && newVal.evalue && newVal.cvalue){
            newVal.valueRisk = Number(newVal.lvalue) * Number(newVal.evalue) * Number(newVal.cvalue)
          }

          //计算危险级别、风险分级
          if(newVal.valueRisk){
            //低风险< 70   一般风险<=70 <160   较大风险 <=160 <320   重大风险 >=320
            let list1 = ['significantRisk', "largerRisk", "generalRisk", "lowRisk"];
            let list2 = ['5', '4', '3', '2'];
            let valueRisk = Number(newVal.valueRisk);
              if( valueRisk < 70 ){
                newVal.riskClassification = list1[3]
                newVal.hazardLevel = list2[3]
                this.classReviewBack = 'lowRisk'
              }else if( valueRisk >= 70 && valueRisk < 160){
                newVal.riskClassification = list1[2]
                newVal.hazardLevel = list2[2]
                this.classReviewBack = 'generalRisk'
              }else if( valueRisk >= 160 && valueRisk < 320){
                newVal.riskClassification = list1[1]
                newVal.hazardLevel = list2[1]
                this.classReviewBack = 'largerRisk'
              }else if( valueRisk >= 320 ){
                newVal.riskClassification = list1[0]
                newVal.hazardLevel = list2[0]
                this.classReviewBack = 'significantRisk'
              }
          }
      },
      // 开启深度监听
      deep: true,
      immediate: true,
    }
  },
  beforeRouteEnter(to, from, next) {
    const userKey = getQueryVariable('userKey');
    const id = to.query.id || getQueryVariable('dangerId');
    const code = to.query.code || getQueryVariable('dangerCode');
    if (id) {
      next(vm => {
        vm.setRouterCode("dangerApprove");
        vm.processReview = userKey ? '2' : sessionStorage.getItem('processReview');
        vm.dangerApproveId = id;
        vm.dangerApproveCode = code;
        vm.getApproveDetail(id,code);
      })
    } else {
      next(vm=>{
        vm.setRouterCode("dangerApprove");
      })
    }
  },
  created() {
    this.dangerOperations = this.getChemicalDictList('wxy_operation_status')//作业状态
    this.dangerHazardtype = this.getChemicalDictList('wxy_hazardtype')//危险源类型
    this.dangerHazardkind = this.getChemicalDictList('wxy_hazardkind')//危险源种类
    this.dangerLeadtheevent = this.getChemicalDictList('wxy_leadtheevent')//可能导致的事件
    this.dangerWoundthepart = this.getChemicalDictList('wxy_woundthepart')//可能接触伤害的部位

    this.eventpossibility = dictionary('eventpossibility')//发生事故的可能
    this.personnelexposure = dictionary('personnelexposure')//人员暴露
    this.personalinjury = dictionary('personalinjury')//人员伤害
    this.productionloss = dictionary('productionloss')//生产损失

    this.hazardLevelList = dictionary('hazardLevel')//危险级别
    this.riskLevelList = dictionary('riskLevel')//危险分级
    this.dealListDic()//处理L，E，C-人，C-产值
  },
  methods: {
    goBack(){
      this.setKeepalive(true)
      this.$router.push({
        path:'/safeManage/dualControlManage/riskManage/dangerApprove'
      })
    },
    // 获取详情
    getApproveDetail(id,code) {
      reviewSelectDetail({id,code}).then(res=>{
        console.log("detail---",res);
        this.iFrom = res.data;
        this.iFrom.possibleEvents = JSON.parse(this.iFrom.possibleEvents);
        this.$refs.commonSearchItem.corporationChange(res.data.corporationId,res.data.deptId)
      }).catch(err=>{
        console.log(err);
      })
    },
    reviewConfirm() {
      this.reviewVisible = true;
      this.reviewForm.accidentsIncidents = this.iFrom.accidentsIncidents;
      this.reviewForm.lvalue = this.iFrom.lvalue;
      this.reviewForm.environment = this.iFrom.environment;
      this.reviewForm.evalue = this.iFrom.evalue;
      this.reviewForm.personalInjury = this.iFrom.personalInjury;
      this.reviewForm.cvaluep = this.iFrom.cvaluep;
      this.reviewForm.productionLoss = this.iFrom.productionLoss;
      this.reviewForm.cvalues = this.iFrom.cvalues;
      this.reviewForm.cvalue = this.iFrom.cvalue;
      this.reviewForm.valueRisk = this.iFrom.valueRisk;
      this.reviewForm.hazardLevel = this.iFrom.hazardLevel;
      this.reviewForm.riskClassification = this.iFrom.riskClassification;
      this.reviewForm.reviewRemake = this.iFrom.reviewRemake;
    },
    // 退回
    backReview() {
      this.backFlag = true;
    },
    //下拉框改变
    changeAll(val,sonVal){
      console.log(val,sonVal);
      this.reviewForm[sonVal] = this.dictObj[val]//根据一级带出二级分值
    },
     //处理L，E，C-人，C-产值
     dealListDic(){
      let list1 = this.eventpossibility//发生事故的可能
      let list2 = this.personnelexposure//人员暴露
      let list3 = this.personalinjury//人员伤害
      let list4 = this.productionloss//生产损失
      let list5 = []
      list5 = list5.concat(list1,list2,list3,list4)
      let obj = {}
      for(let i = 0; i<list5.length; i++){
        obj[list5[i].key] = list5[i].description
      }
      this.dictObj = obj
    },
    // 评审弹框关闭
    reviewCancel() {
      this.reviewVisible = false;
    },
    // 评审弹框确定
    confirm() {
      if (!formValidator.formAll(this, "reviewForm")) {
        return;
      }
      this.confirmLoading = true;
      const params = {
        id: this.dangerApproveId,
        code: this.dangerApproveCode,
        ...this.reviewForm,
      }
      reviewInfo(params).then(res=>{
        this.reviewVisible = false;
        this.confirmLoading = false;
        this.$antMessage.success("评审成功")
        this.$router.push("/safeManage/dualControlManage/riskManage/dangerApprove");
      }).catch(err=>{
        this.confirmLoading = false;
        console.log(err);
      })
    },
    cancleBackFlag(obj) {
      this.$antConfirm({
        content: '确认退回？',
        cancelText: '取消',
        onOk: () => {
          let para = {
            code:this.dangerApproveCode,
            reviewRemake: obj.withdrawInfo
          }
          returnReview(para).then(res => {
            this.$antMessage.success('退回成功');
            this.$router.push("/safeManage/dualControlManage/riskManage/dangerApprove");
          }).catch(err => {
            console.log(err);
          })
        },
      });
      this.backFlag = false;
    },
  },
  beforeDestroy() {
    sessionStorage.removeItem('processReview');
  }
}
</script>

<style scoped lang="less">
.lowRisk{
  ::v-deep.ant-select-selection{
    background:rgb(0,0,255) ;
    color: #fff;
    .ant-select-arrow-icon{
      color: #fff;
    }
  }
}
.generalRisk{
  ::v-deep.ant-select-selection{
    background:rgb(255,255,0) ;
    color: #fff;
    .ant-select-arrow-icon{
      color: #fff;
    }
  }
}
.largerRisk{
  ::v-deep.ant-select-selection{
    background:rgb(255,165,0) ;
    color: #fff;
    .ant-select-arrow-icon{
      color: #fff;
    }
  }
}
.significantRisk{
  ::v-deep.ant-select-selection{
    background:rgb(255,0,0) ;
    color: #fff;
    .ant-select-arrow-icon{
      color: #fff;
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
.review-content {
  ::v-deep .ant-modal-body {
    .model-content-form {
      padding: 0 30px;
    }
  }
}
</style>