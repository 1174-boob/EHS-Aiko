<template>
  <HasFixedBottomWrapper>
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <a-form-model ref="ruleForm" :model="iFrom" :rules="iRules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <template title="基本信息">
          <div>
            <!-- <div class="m-t-20 border-b-e7">
              <PageTitle>基本信息</PageTitle>
            </div> -->
            <div class="m-t-20"></div>
          </div>
          <a-row>
            <a-col :span="12">
              <CommonDept
                ref="corporationId"
                :CommonFormInline="iFrom"
                :rules="iRules"
                :notTablePage="true"
                :hasDepartment="true"
                @corporationChange="corporationChange"
                @corporationDeptChange="corporationDeptChange"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
              ></CommonDept>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="plantAreaId" label="所属厂区" prop="plantAreaId">
                <a-select v-model="iFrom.plantAreaId" show-search placeholder="请选择所属厂区" option-filter-prop="children" :filter-option="filterOptionMixin" @change="plantAreaIdChange">
                  <a-select-option v-for="item in getChemicalDictList('plant_area')" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <StaffOrDept
                ref="applicationDepartmentId"
                :labelTitle="'申请部门'"
                :treeRoles="iRules"
                :propKey="'applicationDepartmentId'"
                :treeType="'dept'" 
                :treePlaceholder="deptTreeId?'请选择' : '请先选择申请部门'"
                :checkedTreeNode="AcheckedTreeNode"
                :deptTreeId="deptTreeId"
                :checkAbel="false"
                @getTreeData="applicationDepartmentIdTreeData"
              />
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="supervisionPersonId" label="监督人" prop="supervisionPersonId">
                <StaffOrDept :treeRoles="iRules" :propKey="'supervisionPersonId'" :checkedTreeNode="ScheckedTreeNode" :checkAbel="false" @getTreeData="supervisionPersonIdTreeData" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="supervisionPersonContactInformation" label="监督人联系方式" prop="supervisionPersonContactInformation">
                <a-input v-model.trim="iFrom.supervisionPersonContactInformation" :maxLength="50" placeholder="请输入监督人联系方式"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="personInChargeOfTheDepartmentInTheConstructionAreaId" label="施工所在区域部门负责人" prop="personInChargeOfTheDepartmentInTheConstructionAreaId">
                <StaffOrDept :treeRoles="iRules" :propKey="'personInChargeOfTheDepartmentInTheConstructionAreaId'" :checkedTreeNode="PcheckedTreeNode" :checkAbel="false" @getTreeData="personInChargeTreeData" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="constructionLocation" label="施工位置" prop="constructionLocation">
                <a-input v-model.trim="iFrom.constructionLocation" :maxLength="50" placeholder="请输入施工位置"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>


          
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="nameOfEquipmentOrWorks" label="设备/工程名称" prop="nameOfEquipmentOrWorks">
                <a-input v-model.trim="iFrom.nameOfEquipmentOrWorks" :maxLength="50" placeholder="请输入设备/工程名称"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="manufacturingOrConstructionUnit" label="制造/施工单位" prop="manufacturingOrConstructionUnit">
                <a-input v-model.trim="iFrom.manufacturingOrConstructionUnit" :maxLength="50" placeholder="请输入设制造/施工单位"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="personInChargeOfConstructionUnitName" label="施工单位负责人" prop="personInChargeOfConstructionUnitName">
                <a-input v-model.trim="iFrom.personInChargeOfConstructionUnitName" :maxLength="50" placeholder="请输入施工单位负责人"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="personInChargeOfConstructionUnitContactInformation" label="负责人联系方式" prop="personInChargeOfConstructionUnitContactInformation">
                <a-input v-model.trim="iFrom.personInChargeOfConstructionUnitContactInformation" :maxLength="50" placeholder="请输入负责人联系方式"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="guardianOfConstructionUnitName" label="施工单位监护人" prop="guardianOfConstructionUnitName">
                <a-input v-model.trim="iFrom.guardianOfConstructionUnitName" :maxLength="50" placeholder="请输入施工单位监护人"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="guardianOfConstructionUnitContactInformation" label="监护人联系方式" prop="guardianOfConstructionUnitContactInformation">
                <a-input v-model.trim="iFrom.guardianOfConstructionUnitContactInformation" :maxLength="50" placeholder="请输入监护人联系方式"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="constructionCompetentDepartmentId" label="施工主管部门" prop="constructionCompetentDepartmentId">
                <StaffOrDept
                  ref="constructionCompetentDepartmentId"
                  :treeRoles="iRules"
                  :propKey="'constructionCompetentDepartmentId'"
                  :treeType="'dept'" 
                  :treePlaceholder="deptTreeId?'请选择' : '请选择施工主管部门'"
                  :checkedTreeNode="CcheckedTreeNode"
                  :deptTreeId="deptTreeId"
                  :checkAbel="false"
                  @getTreeData="constructionCompetentDepartmentIdTreeData"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="projectLeaderName" label="项目负责人" prop="projectLeaderName">
                <a-input v-model.trim="iFrom.projectLeaderName" :maxLength="50" placeholder="请输入监督人联系方式"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="estimatedConstructionDate" label="预计施工日期" prop="estimatedConstructionDate">
                <a-range-picker
                  :allowClear="false"
                  valueFormat="YYYY-MM-DD"
                  v-model="iFrom.estimatedConstructionDate"
                  :disabled-date="disabledDate"
                  style="width:100%"
                  format="YYYY-MM-DD"
                  :placeholder="['开始日期','结束日期']"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="projectLeaderContactInformation" label="项目负责人联系方式" prop="projectLeaderContactInformation">
                <a-input v-model.trim="iFrom.projectLeaderContactInformation" :maxLength="50" placeholder="请输入项目负责人联系方式"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="typeOfConstructionDayId" label="施工日类型" prop="typeOfConstructionDayId">
                <a-select v-model="iFrom.typeOfConstructionDayId" show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOptionMixin" @change="typeOfConstructionDayIdChange">
                  <a-select-option v-for="item in getChemicalDictList('type_of_construction_day')" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="personNumberOfConstructionOperations" label="施工作业人数" prop="personNumberOfConstructionOperations">
                <a-input v-model.trim="iFrom.personNumberOfConstructionOperations" :maxLength="50" placeholder="请输入施工作业人数"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>



          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="contentsOfInstallationAndConstruction" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" label="安装施工内容" prop="contentsOfInstallationAndConstruction">
                <a-textarea v-model="iFrom.contentsOfInstallationAndConstruction" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="endangermentHazardsAndEnvironmentalFactors" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" label="预想危险事项/危险/环境因素" prop="endangermentHazardsAndEnvironmentalFactors">
                <a-textarea v-model="iFrom.endangermentHazardsAndEnvironmentalFactors" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="establishSafetyCountermeasuresAndDisasterPreventionPlans" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" label="树立安全对策及防灾计划" prop="establishSafetyCountermeasuresAndDisasterPreventionPlans">
                <a-textarea v-model="iFrom.establishSafetyCountermeasuresAndDisasterPreventionPlans" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="safetyProtectionEquipmentIdList" label="安全防护用具" prop="safetyProtectionEquipmentIdList">
                <a-select v-model="iFrom.safetyProtectionEquipmentIdList" mode="multiple" show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOptionMixin" @change="safetyProtectionChange">
                  <a-select-option v-for="item in getChemicalDictList('safety_protection_equipment')" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="explosionProofAreaIdList" label="防爆区域" prop="explosionProofAreaIdList">
                <a-select v-model="iFrom.explosionProofAreaIdList" mode="multiple" show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOptionMixin" @change="explosionProofChange">
                  <a-select-option v-for="item in getChemicalDictList('explosion_proof_area')" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>
      </a-form-model>
    </a-spin>

    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="cancleSubmit">取消</a-button>
          <a-button type="primary" class="m-r-15" :loading="loadingTwo" @click="iSave">保存</a-button>
          <a-button type="primary" class="m-r-15" :loading="loading" @click="iSubmit">提交</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>
<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { cloneDeep } from 'lodash'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import { operateInfoSave, operateInfoEdit, operateInfoDetail } from '@/services/dangerWorkStatic.js'
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
import dictionary from "@/utils/dictionary";
import { PushTask } from '@/services/api'
import moment from 'moment';
import StaffOrDept from "@/components/staffOrDept";
import deptAndUser from '../mixin/deptAndUser.js'
import dayJs from "dayjs";
export default {
  components: { FixedBottom, StaffOrDept },
  mixins: [teableCenterEllipsis, chemicalDict, cancelLoading, deptAndUser],
  data() {
    return {
      dictionary,
      spinning: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      iFrom: {},
      iRules: {
        plantAreaId: [{ required: true, message: "所属厂区不能为空", trigger: "change" },],
        applicationDepartmentId: [{ required: true, message: "申请部门不能为空", trigger: "change" },],
        supervisionPersonId: [{ required: true, message: "监督人不能为空", trigger: "blur" },],
        supervisionPersonContactInformation: [{ required: true, message: "监督人联系方式不能为空", trigger: "change" },],
        constructionLocation: [{ required: true, message: "施工位置不能为空", trigger: "blur" },],
        personInChargeOfTheDepartmentInTheConstructionAreaId: [{ required: true, message: "施工所在区域部门负责人不能为空", trigger: "blur" },],
        typeOfConstructionDayId: [{ required: true, message: "施工日类型不能为空", trigger: "change" },],
        nameOfEquipmentOrWorks: [{ required: true, message: "设备/工程名称不能为空", trigger: "change" },],
        manufacturingOrConstructionUnit: [{ required: true, message: "制造/施工单位不能为空", trigger: "change" },],
        personInChargeOfConstructionUnitName: [{ required: true, message: "施工单位负责人不能为空", trigger: "change" },],
        guardianOfConstructionUnitName: [{ required: true, message: "施工单位监护人不能为空", trigger: "change" },],
        guardianOfConstructionUnitContactInformation: [{ required: true, message: "监护人联系方式不能为空", trigger: "change" },],
        constructionCompetentDepartmentId: [{ required: true, message: "施工主管部门不能为空", trigger: "change" },],
        projectLeaderName: [{ required: true, message: "项目负责人不能为空", trigger: "blur" },],
        personInChargeOfConstructionUnitContactInformation: [{ required: true, message: "负责人联系方式不能为空", trigger: "blur" },],
        estimatedConstructionDate: [{ required: true, message: "预计施工日期不能为空", trigger: "blur" },],
        projectLeaderContactInformation: [{ required: true, message: "项目负责人联系方式不能为空", trigger: "blur" },],
        personNumberOfConstructionOperations: [{ required: true, message: "施工作业人数不能为空", trigger: "blur" },],
        contentsOfInstallationAndConstruction: [{ required: true, message: "安装施工内容不能为空", trigger: "blur" },],
        endangermentHazardsAndEnvironmentalFactors: [{ required: true, message: "预想危险事项/危险/环境因素不能为空", trigger: "change" },],
        establishSafetyCountermeasuresAndDisasterPreventionPlans: [{ required: true, message: "树立安全对策及防灾计划不能为空", trigger: "change" },],
        safetyProtectionEquipmentIdList: [{ required: true, message: "安全防护用具不能为空", trigger: "change" },],
        explosionProofAreaIdList: [{ required: true, message: "防爆区域不能为空", trigger: "change" },],
      },
      safetyProtectionEquipmentIdList: [],
      explosionProofAreaIdList: [],
      // 主要成分table
      columns: [
        {
          title: "现场监护人",
          dataIndex: "guardianName",
          key: "guardianName",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          minWidth: 180,
        },
        {
          title: "联系方式",
          dataIndex: "guardianContact",
          key: "guardianContact",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          minWidth: 200,
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right", // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],

      columnsSpecial: [
        {
          title: "特种作业员姓名",
          dataIndex: "outSpecialPerson",
          key: "outSpecialPerson",
          align: 'center',
          ellipsis: true,
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          minWidth: 180,
        },
        {
          title: "证书类别",
          dataIndex: "outCertificateType",
          key: "outCertificateType",
          align: 'center',
          ellipsis: true,
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          minWidth: 200,
        },
        {
          title: "证书编号",
          dataIndex: "outCertificateNumber",
          key: "outCertificateNumber",
          align: 'center',
          ellipsis: true,
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          minWidth: 200,
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          align: 'center',
          fixed: "right", // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      // 部门数据
      outOrganizeTreeList: [],
      // 是否跨夜
      overnightList: [
        {
          key: '1',
          value: '是',
        },
        {
          key: '2',
          value: '否',
        },
      ],
      // 作业形式
      operationForm: [
        {
          key: 1,
          value: '内部自主作业',
        },
        {
          key: 2,
          value: '外协厂商作业',
        },
      ],
      // 作业级别
      hazardLevelList: [],
      checkedTreeNode: [],
      AcheckedTreeNode: [],
      CcheckedTreeNode: [],
      ScheckedTreeNode: [],
      PcheckedTreeNode: [],
      // 主键id
      generalOperateId: undefined,
      deptTreeId: undefined,
    }
  },
  created() {
    this.generalOperateId = this.$route.query.generalOperateId + '' || undefined
  },
  computed: {
    // 当前页面是否为新增
    isAddPage() {
      return !this.$route.query.generalOperateId
    },
  },
  mounted() {
    // 页面初始化
    this.initPage()
  },
  methods: {
    moment,
    // 页面初始化
    initPage() {
      if (this.iFrom.estimatedConstructionDate) {
        this.iFrom.estimatedConstructionDateStart = this.iFrom.estimatedConstructionDate[0] ? dayJs(this.iFrom.estimatedConstructionDate[0]).format("YYYY-MM-DD") : "";
        this.iFrom.estimatedConstructionDateEnd = this.iFrom.estimatedConstructionDate[1] ? dayJs(this.iFrom.estimatedConstructionDate[1]).format("YYYY-MM-DD") : "";
      }
      if (this.isAddPage) {
        this.spinning = false
      } else {
        // 获取页面详情
        Promise.all([this.getPageDetail()])
          .finally(() => {
            this.spinning = false
          })
      }
    },
    plantAreaIdChange(val, option) {
      this.iFrom.plantAreaId = val;
      this.iFrom.plantAreaName = this.getChemicalDictList('plant_area').find(item => {
        return item.dictValue == val
      }).dictLabel;
    },
    typeOfConstructionDayIdChange(val, option) {
      this.iFrom.typeOfConstructionDayId = val;
      this.iFrom.typeOfConstructionDayName = this.getChemicalDictList('type_of_construction_day').find(item => {
        return item.dictValue == val
      }).dictLabel;
    },
    safetyProtectionChange(val, option) {
      this.iFrom.safetyProtectionEquipmentIdList = val;
      let safetyProtectionEquipmentNameList = [];
      val.forEach(item => {
        safetyProtectionEquipmentNameList.push(this.getChemicalDictList('safety_protection_equipment').find(_item => {
          return item == _item.dictValue
        }).dictLabel);
      })
      this.iFrom.safetyProtectionEquipmentNameList = safetyProtectionEquipmentNameList
    },
    explosionProofChange(val, option) {
      this.iFrom.explosionProofAreaIdList = val;
      let explosionProofAreaNameList = [];
      val.forEach(item => {
        explosionProofAreaNameList.push(this.getChemicalDictList('explosion_proof_area').find(_item => {
          return item == _item.dictValue
        }).dictLabel);
      })
      this.iFrom.explosionProofAreaNameList = explosionProofAreaNameList
    },
    applicationDepartmentIdTreeData(value) {
      let { treeIdList, treeNameAndCodeList } = value
      // 针对组件取消后数据被清空时做保存数据处理
      this.AcheckedTreeNode = treeIdList
      let { id, treeName, treeCode } = treeNameAndCodeList && treeNameAndCodeList.length ? treeNameAndCodeList[0] : {}
      let applicationDepartmentId = id
      let applicationDepartmentName = (treeName || '') + (treeName && treeCode ? '/' : '') + (treeCode || '')
      this.$set(this.iFrom, 'applicationDepartmentId', applicationDepartmentId)
      this.departOrPerpleChange([applicationDepartmentName], 'applicationDepartmentName')
      formValidator.formItemValidate(this, "applicationDepartmentId", "ruleForm")
    },
    constructionCompetentDepartmentIdTreeData(value) {
      let { treeIdList, treeNameAndCodeList } = value
      // 针对组件取消后数据被清空时做保存数据处理
      this.CcheckedTreeNode = treeIdList
      let { id, treeName, treeCode } = treeNameAndCodeList && treeNameAndCodeList.length ? treeNameAndCodeList[0] : {}
      let constructionCompetentDepartmentId = id
      let constructionCompetentDepartmentName = (treeName || '') + (treeName && treeCode ? '/' : '') + (treeCode || '')
      this.$set(this.iFrom, 'constructionCompetentDepartmentId', constructionCompetentDepartmentId)
      this.departOrPerpleChange([constructionCompetentDepartmentName], 'constructionCompetentDepartmentName')
      formValidator.formItemValidate(this, "constructionCompetentDepartmentId", "ruleForm")
    },
    supervisionPersonIdTreeData(value) {
      console.log(value, '>>???')
      let { treeIdList, treeNameAndCodeList } = value
      // 针对组件取消后数据被清空时做保存数据处理
      this.ScheckedTreeNode = treeIdList
      let { id, treeName, treeCode } = treeNameAndCodeList && treeNameAndCodeList.length ? treeNameAndCodeList[0] : {}
      let supervisionPersonId = id
      let supervisionPersonName = (treeName || '')
      let supervisionPersonJobNumber = (treeCode || '')
      this.$set(this.iFrom, 'supervisionPersonId', supervisionPersonId)
      this.departOrPerpleChange([supervisionPersonName], 'supervisionPersonName')
      this.departOrPerpleChange([supervisionPersonJobNumber], 'supervisionPersonJobNumber')
      formValidator.formItemValidate(this, "supervisionPersonId", "ruleForm")
    },
    personInChargeTreeData(value) {
      let { treeIdList, treeNameAndCodeList } = value
      // 针对组件取消后数据被清空时做保存数据处理
      this.PcheckedTreeNode = treeIdList
      let { id, treeName, treeCode } = treeNameAndCodeList && treeNameAndCodeList.length ? treeNameAndCodeList[0] : {}
      let personInChargeOfTheDepartmentInTheConstructionAreaId = id
      let personInChargeOfTheDepartmentInTheConstructionAreaName = (treeName || '')
      let personInChargeOfTheDepartmentInTheConstructionAreaJobNumber = (treeCode || '')
      this.$set(this.iFrom, 'personInChargeOfTheDepartmentInTheConstructionAreaId', personInChargeOfTheDepartmentInTheConstructionAreaId)
      this.departOrPerpleChange([personInChargeOfTheDepartmentInTheConstructionAreaName], 'personInChargeOfTheDepartmentInTheConstructionAreaName')
      this.departOrPerpleChange([personInChargeOfTheDepartmentInTheConstructionAreaJobNumber], 'personInChargeOfTheDepartmentInTheConstructionAreaJobNumber')
      formValidator.formItemValidate(this, "personInChargeOfTheDepartmentInTheConstructionAreaId", "ruleForm")
    },
    // 选择人员后的change事件
    // getTreeData(value) {
    //   let { treeIdList, treeNameAndCodeList } = value
    //   // 针对组件取消后数据被清空时做保存数据处理
    //   this.checkedTreeNode = treeIdList
    //   let { id, treeName, treeCode } = treeNameAndCodeList && treeNameAndCodeList.length ? treeNameAndCodeList[0] : {}
    //   let applicationDepartmentId = id
    //   let applicationDepartmentName = (treeName || '') + (treeName && treeCode ? '/' : '') + (treeCode || '')
    //   this.$set(this.iFrom, 'applicationDepartmentId', applicationDepartmentId)
    //   this.departOrPerpleChange([applicationDepartmentName], 'applicationDepartmentName')
    //   formValidator.formItemValidate(this, "applicationDepartmentId", "ruleForm")
    // },
    // 各部门改变
    departOrPerpleChange(lab, attrName) {
      this.$set(this.iFrom, attrName, lab[0])
    },
    // 施工日类型改变
    operateTypeChange(val, rm = true) {
      
    },
    // 时间限制
    disabledDate(current) {
      return current < moment().subtract(1, 'days').endOf('day')
    },
    // 组织机构-改变
    corporationChange(val, corporationDeptId) {
      // 人员相关
      this.deptTreeId = corporationDeptId
      this.checkedTreeNode = []
    },
    // 获取页面详情
    getPageDetail() {
      let generalOperateId = this.generalOperateId
      let apiData = { generalOperateId }
      return new Promise((resove, rej) => {
        operateInfoDetail(apiData)
          .then(res => {
            console.log(res, 'operateInfoDetail')
            let iFrom = res.data
            this.operateTypeChange(iFrom.operateType, false)
            // 部门回显
            this.$refs.corporationId.corporationChange(iFrom.corporationId, iFrom.deptId)
            this.checkedTreeNode = iFrom.applyUserCode ? [iFrom.applyUserCode] : [];
            setTimeout(() => {
              this.iFrom = iFrom
              if (this.iFrom.estimatedConstructionDateStart && this.iFrom.estimatedConstructionDateEnd) {
                this.$nextTick(()=>{
                  let estimatedConstructionDate = [this.iFrom.estimatedConstructionDateStart,this.iFrom.estimatedConstructionDateEnd]
                  this.$set(this.iFrom, 'estimatedConstructionDate', estimatedConstructionDate)
                })
              }
              this.CcheckedTreeNode = iFrom.constructionCompetentDepartmentId ? [iFrom.constructionCompetentDepartmentId] : [];
              this.AcheckedTreeNode = iFrom.applicationDepartmentId ? [iFrom.applicationDepartmentId] : [];
              this.ScheckedTreeNode = iFrom.supervisionPersonId ? [iFrom.supervisionPersonId] : [];
              this.PcheckedTreeNode = iFrom.personInChargeOfTheDepartmentInTheConstructionAreaId ? [iFrom.personInChargeOfTheDepartmentInTheConstructionAreaId] : [];
            });
            resove()
          })
          .catch(err => {
            rej()
          })
      })
    },
    // 列表添加guid
    addGuid(list) {
      (list || []).forEach(item => {
        item.guid = this.guid()
      })
      return list
    },
    // 滚动到表单验证报错的地方
    scrollView(object) {
      for (const i in object) {
        let dom = this.$refs[i];
        // 这里是针对遍历的情况（多个输入框），取值为数组
        if (Object.prototype.toString.call(dom) !== "[object Object]") {
          dom = dom[0];
        }
        // 第一种方法（包含动画效果）
        dom.$el.scrollIntoView({
          // 滚动到指定节点
          // 值有start,center,end，nearest，当前显示在视图区域中间
          block: "center",
          // 值有auto、instant,smooth，缓动动画（当前是慢速的）
          behavior: "smooth",
        });
        break; // 因为我们只需要检测一项,所以就可以跳出循环了
      }
    },
    // 表单校验
    // formValidate() {
    //   // 如果页面表单验证有报错则滚动到表单验证报错的地方
    //   let formAll = true
    //   this.$refs["ruleForm"].validate((valid, object) => {
    //     if (!valid) {
    //       formAll = false
    //       this.scrollView(object);
    //     }
    //   });
    //   if (!this.iFrom.applyUserCode) {
    //     formAll = false
    //   }

    //   return formAll
    // },
    // 提交之前的流程api
    iSubmit() {
      this.$refs.ruleForm.validate((valid, object) => {
        if (!valid) {
          this.scrollView(object);
        }
      });
      if (!formValidator.formAll(this, 'ruleForm')){
        console.log('?????',this.iFrom);
        return;
      }
      if (this.iFrom.estimatedConstructionDate) {
        this.iFrom.estimatedConstructionDateStart = this.iFrom.estimatedConstructionDate[0] ? dayJs(this.iFrom.estimatedConstructionDate[0]).format("YYYY-MM-DD") : "";
        this.iFrom.estimatedConstructionDateEnd = this.iFrom.estimatedConstructionDate[1] ? dayJs(this.iFrom.estimatedConstructionDate[1]).format("YYYY-MM-DD") : "";
      }
      console.log(this.iFrom, '诶嘿')
      // isDraft提交2，保存1
      // if (!this.formValidate() || this.loading || this.spinning) {
      //   return
      // }
      this.handleLoading();
      let apiData = { ...this.iFrom, isDraft: 2 }
      const apiName = this.isAddPage ? operateInfoSave : operateInfoEdit
      return apiName(apiData)
        .then(res => {
          // 代办推送
          console.log(res, '....')

          this.$antMessage.success('提交成功');
          // 跳转列表页
          this.$router.push({ path: '/safeManage/workManage/normalWorkStatic/normalWorkStaticAccount' })
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 代办推送
    async pushTask(securityUser, generalOperateId) {
      if (generalOperateId) {
        const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/safeManage/workManage/dangerWorkStatic/dangerWorkStaticHandle&generalOperateId=${generalOperateId}`
        const pushTask = await PushTask({
          title: "一般作业前确认",
          approval: 'dangerWorkStatic',
          userId: securityUser,
          url: url,
          docNumber: this.iFrom?.operateNumber,   //业务id
          docId: generalOperateId,  //主键id
        })
      }
    },
    // 保存api
    iSave() {
      this.$refs.ruleForm.validate((valid, object) => {
        if (!valid) {
          this.scrollView(object);
        }
      });
      if (!formValidator.formAll(this, 'ruleForm')){
        console.log('?????',this.iFrom);
        return;
      }
      if (this.iFrom.estimatedConstructionDate) {
        this.iFrom.estimatedConstructionDateStart = this.iFrom.estimatedConstructionDate[0] ? dayJs(this.iFrom.estimatedConstructionDate[0]).format("YYYY-MM-DD") : "";
        this.iFrom.estimatedConstructionDateEnd = this.iFrom.estimatedConstructionDate[1] ? dayJs(this.iFrom.estimatedConstructionDate[1]).format("YYYY-MM-DD") : "";
      }
      console.log(999,this.iFrom);
      let apiData = { ...this.iFrom, isDraft: 1 }
      // return
      const apiName = this.isAddPage ? operateInfoSave : operateInfoEdit
      this.handleLoadingTwo();
      apiName(apiData)
        .then(res => {
          this.$antMessage.success('保存成功');
          // 跳转列表页
          this.$router.push({ path: '/safeManage/workManage/normalWorkStatic/normalWorkStaticDraft' })
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoadingTwo();
        })
    },
    
    // 取消
    cancleSubmit() {
      this.setKeepalive(true)
      this.$router.go(-1)
    },
    // 生成唯一id
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
  }
}
</script>
<style lang="less" scoped>
.ttile {
  display: flex;
  align-items: center;
  margin-bottom: -3px;
  border-bottom: 1px solid transparent;
  .ttile-text {
    margin-bottom: 10px;
    margin-right: 12px;
  }
  .ttile-bbtn {
    margin-bottom: 0px;
  }
}
::v-deep .fixed-bottom {
  width: 100% !important;
  bottom: 0px !important;
  left: 0px !important;
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

.has-error .el-input__inner {
  border-color: #f5222f !important;
}

::v-deep .el-input__icon.el-range__icon.el-icon-time {
  display: none;
}
</style>