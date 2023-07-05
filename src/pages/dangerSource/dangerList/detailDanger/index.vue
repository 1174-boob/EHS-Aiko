<template>
  <HasFixedBottomWrapper>
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <a-form-model
        ref="ruleForm"
        :model="iFrom"
        :rules="iRules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <div class="m-t-20"></div>

        <!-- 基本信息模块-->
        <template title="基本信息">
          <a-row>
            <a-col :span="12">
              <!-- 共性 -->
              <CommonSearchItem
                v-if="listObj.type == 1"
                ref="commonSearchItem"
                :hasDepartment="false"
                :CommonFormInline="iFrom"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :notTablePage="true"
                :needDeptName="false"
                :justNeedDepartment="true"
                :disabled="true"
              ></CommonSearchItem>
              <!-- 特异性 -->
              <CommonSearchItem
                v-else
                ref="commonSearchItem"
                :hasDepartment="false"
                :CommonFormInline="iFrom"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                :notTablePage="true"
                :needDeptName="false"
                :disabled="true"
              ></CommonSearchItem>
              <a-form-model-item label="部门" prop="deptName">
                <a-input
                  v-model.trim="iFrom.deptName"
                  :maxLength="30"
                  placeholder="请输入部门"
                  :disabled="true"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item label="设备或区域" prop="equipmentArea">
                <a-input
                  v-model.trim="iFrom.equipmentArea"
                  :maxLength="30"
                  placeholder="请输入设备或区域"
                  :disabled="true"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="工艺" prop="workmanship">
                <a-input
                  v-model.trim="iFrom.workmanship"
                  :maxLength="30"
                  placeholder="请输入工艺"
                  :disabled="true"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item label="作业状态" prop="jobStatus">
                <a-select
                  v-model="iFrom.jobStatus"
                  placeholder="请选择"
                  :disabled="true"
                >
                  <a-select-option
                    v-for="item in dangerOperations"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-select-option
                  >
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
                <a-select
                  v-model="iFrom.riskType"
                  placeholder="请选择"
                  :disabled="true"
                >
                  <a-select-option
                    v-for="item in dangerHazardtype"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="危险源种类" prop="riskClass">
                <a-select
                  v-model="iFrom.riskClass"
                  placeholder="请选择"
                  :disabled="true"
                >
                  <a-select-option
                    v-for="item in dangerHazardkind"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="可能导致事件" prop="possibleEvents">
                <a-select
                  v-model="iFrom.possibleEvents"
                  placeholder="请选择"
                  :disabled="true"
                  mode="multiple"
                >
                  <a-select-option
                    v-for="item in dangerLeadtheevent"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                label="可能接触伤害的部位"
                prop="partsBodyInjury"
              >
                <a-select
                  v-model="iFrom.partsBodyInjury"
                  placeholder="请选择"
                  :disabled="true"
                >
                  <a-select-option
                    v-for="item in dangerWoundthepart"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    >{{ item.dictLabel }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="风险描述" prop="riskDescription">
                <a-textarea
                  v-model.trim="iFrom.riskDescription"
                  :maxLength="300"
                  placeholder="请输入风险描述"
                  :disabled="true"
                ></a-textarea>
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
              <a-form-model-item
                label="发生事故事件的可能性"
                prop="accidentsIncidents"
              >
                <a-select
                  v-model="iFrom.accidentsIncidents"
                  placeholder="请选择"
                  @change="changeAll($event, 'lvalue')"
                  :disabled="true"
                >
                  <a-select-option
                    v-for="item in eventpossibility"
                    :key="item.key"
                    :value="item.key"
                    >{{ item.value }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="L值" prop="lvalue">
                <a-input
                  v-model.trim="iFrom.lvalue"
                  :maxLength="30"
                  placeholder="自动带出"
                  :disabled="true"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                label="人员暴露于危险环境的频繁程度"
                prop="environment"
              >
                <a-select
                  v-model="iFrom.environment"
                  placeholder="请选择"
                  @change="changeAll($event, 'evalue')"
                  :disabled="true"
                >
                  <a-select-option
                    v-for="item in personnelexposure"
                    :key="item.key"
                    :value="item.key"
                    >{{ item.value }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="E值" prop="evalue">
                <a-input
                  v-model.trim="iFrom.evalue"
                  :maxLength="30"
                  placeholder="自动带出"
                  :disabled="true"
                ></a-input>
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
                <a-select
                  v-model="iFrom.personalInjury"
                  placeholder="请选择"
                  @change="changeAll($event, 'cvaluep')"
                  :disabled="true"
                >
                  <a-select-option
                    v-for="item in personalinjury"
                    :key="item.key"
                    :value="item.key"
                    >{{ item.value }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="(C-人)值" prop="cvaluep">
                <a-input
                  v-model.trim="iFrom.cvaluep"
                  :maxLength="30"
                  placeholder="自动带出"
                  :disabled="true"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="生产损失" prop="productionLoss">
                <a-select
                  v-model="iFrom.productionLoss"
                  placeholder="请选择"
                  @change="changeAll($event, 'cvalues')"
                  :disabled="true"
                >
                  <a-select-option
                    v-for="item in productionloss"
                    :key="item.key"
                    :value="item.key"
                    >{{ item.value }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="(C-产)值" prop="cvalues">
                <a-input
                  v-model.trim="iFrom.cvalues"
                  :maxLength="30"
                  placeholder="自动带出"
                  :disabled="true"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="C值" prop="cvalue">
                <a-input
                  v-model.trim="iFrom.cvalue"
                  :maxLength="30"
                  placeholder="自动带出"
                  :disabled="true"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="风险值" prop="valueRisk">
                <a-input
                  v-model.trim="iFrom.valueRisk"
                  :maxLength="30"
                  placeholder="自动带出"
                  :disabled="true"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="危险级别" prop="hazardLevel">
                <a-select
                  v-model="iFrom.hazardLevel"
                  placeholder="自动带出"
                  :disabled="true"
                >
                  <a-select-option
                    v-for="item in hazardLevelList"
                    :key="item.key"
                    :value="item.key"
                    >{{ item.value }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <div :class="[classBack]">
                <a-form-model-item label="风险分级" prop="riskClassification">
                  <a-select
                    v-model="iFrom.riskClassification"
                    placeholder="自动带出"
                    :disabled="true"
                  >
                    <a-select-option
                      v-for="item in riskLevelList"
                      :key="item.key"
                      :value="item.key"
                      >{{ item.value }}</a-select-option
                    >
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
                <a-input
                  v-model.trim="iFrom.regulations"
                  :maxLength="30"
                  placeholder="请输入规定"
                  :disabled="true"
                ></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>
      </a-form-model>
    </a-spin>

    <div slot="fixedBottom" v-show="!listObj.back">
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
import cancelLoading from "@/mixin/cancelLoading";
import chemicalDict from "@/mixin/chemicalDict.js";
import { formValidator } from "@/utils/clx-form-validator.js";
import OrganizeLazyTree from "@/components/organizeLazyTree/organizeLazyTree.vue";
import dictionary from "@/utils/dictionary";
import {
  DetailCommonList,
  EditCommonList,
  DetailSpecificityList,
  EditSpecificityList,
} from "@/services/dangerSource/dangerList/index.js";

export default {
  components: { FixedBottom, OrganizeLazyTree },
  mixins: [cancelLoading, chemicalDict],
  data() {
    return {
      iFrom: {
        //基本信息
        departmentId: undefined,
        equipmentArea: undefined,
        workmanship: undefined,
        jobStatus: undefined,
        //危险源
        riskType: undefined,
        riskClass: undefined,
        possibleEvents: undefined,
        partsBodyInjury: undefined,
        riskDescription: undefined,
        //作业条件危险性评价
        accidentsIncidents: undefined,
        lvalue: undefined,
        environment: undefined,
        evalue: undefined,
        //发生事故产生的后果
        personalInjury: undefined,
        cvaluep: undefined,
        productionLoss: undefined,
        cvalues: undefined,
        cvalue: undefined,
        valueRisk: undefined,
        hazardLevel: undefined,
        riskClassification: undefined,
        //策划控制
        regulations: undefined,
      },
      iRules: {
        //基本信息
        deptName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        corporationId: [
          { required: true, message: "所属组织不能为空", trigger: "change" },
        ],
        workmanship: [
          { required: true, message: "工艺不能为空", trigger: "change" },
        ],
        jobStatus: [
          { required: true, message: "作业状态不能为空", trigger: "change" },
        ],

        //危险源
        riskType: [
          { required: true, message: "危险源类型不能为空", trigger: "change" },
        ],
        riskClass: [
          { required: true, message: "危险源种类不能为空", trigger: "change" },
        ],
        possibleEvents: [
          {
            required: true,
            message: "可能导致事件不能为空",
            trigger: "change",
          },
        ],
        partsBodyInjury: [
          {
            required: true,
            message: "可能接触伤害的部位不能为空",
            trigger: "change",
          },
        ],
        riskDescription: [
          { required: true, message: "风险描述不能为空", trigger: "change" },
        ],

        //作业条件危险性评价
        accidentsIncidents: [
          {
            required: true,
            message: "发生事故事件的可能性不能为空",
            trigger: "change",
          },
        ],
        environment: [
          {
            required: true,
            message: "人员暴露于危险环境的频繁程度不能为空",
            trigger: "change",
          },
        ],

        //发生事故产生的后果
        personalInjury: [
          { required: true, message: "人员伤害不能为空", trigger: "change" },
        ],
        productionLoss: [
          { required: true, message: "生产损失不能为空", trigger: "change" },
        ],

        //策划控制
        regulations: [
          { required: true, message: "规定不能为空", trigger: "change" },
        ],
      },
      classBack: "",
      background: "rgb(255, 0, 0)", //#f5f5f5默认rgb(255, 0, 0)
      shapeList: [], //危险级别
      spinning: false,
      dangerOperations: [], //作业状态
      dangerHazardtype: [], //危险源类型
      dangerHazardkind: [], //危险源种类
      dangerLeadtheevent: [], //可能导致的事件
      dangerWoundthepart: [], //可能接触伤害的部位
      eventpossibility: [], //发生事故的可能
      personnelexposure: [], //人员暴露
      personalinjury: [], //人员伤害
      productionloss: [], //生产损失
      dictObj: {},
      hazardLevelList: [], //危险级别
      riskLevelList: [], //风险分级
      listObj: {}, //列表跳转id
    };
  },
  created() {
    //接受参数
    let isFlag = this.$route.query;

    this.listObj = isFlag;
    this.dangerOperations = this.getChemicalDictList("wxy_operation_status"); //作业状态
    this.dangerHazardtype = this.getChemicalDictList("wxy_hazardtype"); //危险源类型
    this.dangerHazardkind = this.getChemicalDictList("wxy_hazardkind"); //危险源种类
    this.dangerLeadtheevent = this.getChemicalDictList("wxy_leadtheevent"); //可能导致的事件
    this.dangerWoundthepart = this.getChemicalDictList("wxy_woundthepart"); //可能接触伤害的部位

    this.eventpossibility = dictionary("eventpossibility"); //发生事故的可能
    this.personnelexposure = dictionary("personnelexposure"); //人员暴露
    this.personalinjury = dictionary("personalinjury"); //人员伤害
    this.productionloss = dictionary("productionloss"); //生产损失

    this.hazardLevelList = dictionary("hazardLevel"); //危险级别
    this.riskLevelList = dictionary("riskLevel"); //危险分级

    this.dealListDic(); //处理L，E，C-人，C-产值
    this.getDetailInfo(); //获取详情
    // console.log(this.hazardLevel,this.riskLevel,'..eventpossibility');
  },
  methods: {
    //获取详情
    getDetailInfo() {
      //1共性  2特异性
      let PromiseThing =
        this.listObj.type == 1 ? DetailCommonList : DetailSpecificityList;
      PromiseThing({ id: this.listObj.id }).then((res) => {
        if (res.data) {
          let obj = {
            //基本信息
            // centerId: res.data.data.centerId || undefined,
            deptName: res.data.deptName || undefined,
            corporationId: res.data.corporationId || undefined,
            equipmentArea: res.data.equipmentArea || undefined,
            workmanship: res.data.workmanship || undefined,
            jobStatus: res.data.jobStatus || undefined,
            //危险源
            riskType: res.data.riskType || undefined,
            riskClass: res.data.riskClass || undefined,
            possibleEvents: res.data.possibleEvents ? JSON.parse(res.data.possibleEvents || []) : [],
            partsBodyInjury: res.data.partsBodyInjury || undefined,
            riskDescription: res.data.riskDescription || undefined,
            //作业条件危险性评价
            accidentsIncidents: res.data.accidentsIncidents || undefined,
            lvalue: res.data.lvalue || undefined,
            environment: res.data.environment || undefined,
            evalue: res.data.evalue || undefined,
            //发生事故产生的后果
            personalInjury: res.data.personalInjury || undefined,
            cvaluep: res.data.cvaluep || undefined,
            productionLoss: res.data.productionLoss || undefined,
            cvalues: res.data.cvalues || undefined,
            cvalue: res.data.cvalue || undefined,
            valueRisk: res.data.valueRisk || undefined,
            hazardLevel: res.data.hazardLevel || undefined,
            riskClassification: res.data.riskClassification || undefined,
            //策划控制
            regulations: res.data.regulations || undefined,
          };
          this.iFrom = obj;
        }
      });
    },

    //下拉框改变
    changeAll(val, sonVal) {
      this.iFrom[sonVal] = this.dictObj[val]; //根据一级带出二级分值
    },

    //处理L，E，C-人，C-产值
    dealListDic() {
      let list1 = this.eventpossibility; //发生事故的可能
      let list2 = this.personnelexposure; //人员暴露
      let list3 = this.personalinjury; //人员伤害
      let list4 = this.productionloss; //生产损失
      let list5 = [];
      list5 = list5.concat(list1, list2, list3, list4);
      let obj = {};
      for (let i = 0; i < list5.length; i++) {
        obj[list5[i].key] = list5[i].description;
      }
      this.dictObj = obj;
    },

    // 取消
    cancleSubmit() {
      this.setKeepalive(true)
      this.$router.go(-1);
    },
  },
  watch: {
    iFrom: {
      // 数据变化时执行的逻辑代码
      handler(newVal, oldVal) {
        //计算C值
        if (!newVal.cvalues && newVal.cvaluep) {
          //(C-人)值存在
          newVal.cvalue = newVal.cvaluep;
        } else if (newVal.cvalues && !newVal.cvaluep) {
          //(C-产)值值存在
          newVal.cvalue = newVal.cvalues;
        } else if (
          newVal.cvalues &&
          newVal.cvaluep &&
          Number(newVal.cvalues) >= Number(newVal.cvaluep)
        ) {
          //(C-产)>(C-人)
          newVal.cvalue = newVal.cvalues;
        } else if (
          newVal.cvalues &&
          newVal.cvaluep &&
          Number(newVal.cvalues) < Number(newVal.cvaluep)
        ) {
          //(C-产)<(C-人)
          newVal.cvalue = newVal.cvaluep;
        }

        //计算风险值
        if (newVal.lvalue && newVal.evalue && newVal.cvalue) {
          newVal.valueRisk =
            Number(newVal.lvalue) *
            Number(newVal.evalue) *
            Number(newVal.cvalue);
        }

        //计算危险级别、风险分级
        if (newVal.valueRisk) {
          //低风险< 70   一般风险<=70 <160   较大风险 <=160 <320   重大风险 >=320
          let list1 = [
            "significantRisk",
            "largerRisk",
            "generalRisk",
            "lowRisk",
          ];
          let list2 = ["5", "4", "3", "2"];
          let valueRisk = Number(newVal.valueRisk);
          if (valueRisk < 70) {
            newVal.riskClassification = list1[3];
            newVal.hazardLevel = list2[3];
            newVal.regulations = "监测+培训";
            this.classBack = "lowRisk";
          } else if (valueRisk >= 70 && valueRisk < 160) {
            newVal.riskClassification = list1[2];
            newVal.hazardLevel = list2[2];
            newVal.regulations = "运行控制/应急响应+培训";
            this.classBack = "generalRisk";
          } else if (valueRisk >= 160 && valueRisk < 320) {
            newVal.riskClassification = list1[1];
            newVal.hazardLevel = list2[1];
            newVal.regulations = "目标+运行控制/应急响应+培训";
            this.classBack = "largerRisk";
          } else if (valueRisk >= 320) {
            newVal.riskClassification = list1[0];
            newVal.hazardLevel = list2[0];
            newVal.regulations = "立即改进+目标+运行控制+培训";
            this.classBack = "significantRisk";
          }
        }
      },
      // 开启深度监听
      deep: true,
      immediate: true,
    },
  },
  computed: {
    labelCol() {
      let scrol = window.innerWidth;
      if (scrol < 1910) {
        return { span: 10 };
      } else {
        return { span: 8 };
      }
    },
    wrapperCol() {
      let scrol = window.innerWidth;
      if (scrol < 1910) {
        return { span: 14 };
      } else {
        return { span: 16 };
      }
    },
  },
};
</script>

<style lang="less" scoped>
.lowRisk {
  ::v-deep.ant-select-selection {
    background: rgb(0, 0, 255);
    color: #000;
  }
}
.generalRisk {
  ::v-deep.ant-select-selection {
    background: rgb(255, 255, 0);
    color: #000;
  }
}
.largerRisk {
  ::v-deep.ant-select-selection {
    background: rgb(255, 165, 0);
    color: #000;
  }
}
.significantRisk {
  ::v-deep.ant-select-selection {
    background: rgb(255, 0, 0);
    color: #000;
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
// ::v-deep.ant-input-disabled{
//   color: #666 !important;
// }
</style>