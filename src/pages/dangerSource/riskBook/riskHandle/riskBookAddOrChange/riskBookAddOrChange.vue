<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div class="left-box">
      <a-spin :spinning="spinning" wrapperClassName="a-spin">
        <HasFixedBottomWrapper>
          <a-form-model ref="ruleForm" :model="iFrom" :rules="iRules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <template title="基本信息">
              <div>
                <div class="m-t-20 border-b-e7">
                  <PageTitle>基本信息</PageTitle>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-row>
                <a-col :span="13">
                  <CommonDept
                    ref="commonSearchItem"
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
              </a-row>
              <a-row>
                <a-col :span="13">
                  <a-form-model-item ref="deptId" label="部门" prop="deptId">
                    <DeptTree
                      :disabled="!iFrom.corporationId"
                      :placeholder="iFrom.corporationId ? '请选择':'请先选择所属组织'"
                      v-model="iFrom.deptId"
                      :deptData="deptData"
                      @change="(deptId,deptName)=>addDeptNameFn(deptId,deptName)"
                    ></DeptTree>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="13">
                  <a-form-model-item ref="riskPointLocation" label="所在位置" prop="riskPointLocation">
                    <a-input v-model="iFrom.riskPointLocation" :maxLength="30" placeholder="请输入所在位置"></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="13">
                  <a-form-model-item ref="riskPointName" label="风险点" prop="riskPointName">
                    <a-input v-model="iFrom.riskPointName" :maxLength="30" placeholder="请输入风险点"></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="13">
                  <a-form-model-item ref="riskLevel" label="风险分级" prop="riskLevel">
                    <a-select
                      v-model="iFrom.riskLevel"
                      placeholder="请先关联危险源"
                      :disabled="!iFrom.dangerSourceList || !iFrom.dangerSourceList.length"
                      option-filter-prop="children"
                      show-search
                      :filter-option="filterOption"
                      @change="riskLevelChange"
                    >
                      <a-select-option v-for="item in dictionary('riskLevel')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </template>

            <template title="关联危险源">
              <div>
                <div class="ttile border-b-e7">
                  <div class="ttile-text" :class="[iRules.dangerSourceList[0].required?'ttile-text-required':'']">关联危险源</div>
                  <DashBtn class="ttile-bbtn">
                    <div>
                      <a-button type="dashed" @click="openHazardSourceDrawer()">选择危险源</a-button>
                    </div>
                  </DashBtn>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-form-model-item ref="dangerSourceList" label=" " prop="dangerSourceList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <CommonTable :noPaging="true">
                  <a-table
                    style="width:100%;"
                    bordered
                    :columns="columns"
                    :scroll="{ x: tableScrollX(columns) }"
                    :locale="{emptyText: emptyText}"
                    :data-source="iFrom.dangerSourceList || []"
                    :rowKey="'guid'"
                    :pagination="false"
                  >
                    <div slot="code" slot-scope="text,record">
                      <a-popover autoAdjustOverflow>
                        <div slot="content">
                          <p>{{ text }}</p>
                        </div>
                        <span class="can-click overflow-text" @click="goDangerSourceDetailsPage(record)">{{ text }}</span>
                      </a-popover>
                    </div>
                  </a-table>
                </CommonTable>
              </a-form-model-item>
            </template>

            <template title="风险管控措施">
              <div>
                <div class="m-t-20 border-b-e7">
                  <PageTitle>风险管控措施</PageTitle>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item ref="hardTechnologyControlList" label=" " prop="hardTechnologyControlList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                    <ActiveTable
                      :contentColumns="'工程技术措施'"
                      :required="iRules.hardTechnologyControlList[0].required"
                      :attr="'hardTechnologyControlList'"
                      :tableDataOld="iFrom.hardTechnologyControlList"
                      @activeTableChange="activeTableChange"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item ref="managementControlList" label=" " prop="managementControlList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                    <ActiveTable
                      :contentColumns="'管理措施'"
                      :required="iRules.managementControlList[0].required"
                      :attr="'managementControlList'"
                      :tableDataOld="iFrom.managementControlList"
                      @activeTableChange="activeTableChange"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item ref="educationalTrainingControlList" label=" " prop="educationalTrainingControlList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                    <ActiveTable
                      :contentColumns="'教育培训措施'"
                      :required="iRules.educationalTrainingControlList[0].required"
                      :attr="'educationalTrainingControlList'"
                      :tableDataOld="iFrom.educationalTrainingControlList"
                      @activeTableChange="activeTableChange"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item ref="individualProtectionControlList" label=" " prop="individualProtectionControlList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                    <ActiveTable
                      :contentColumns="'个体防护措施'"
                      :required="iRules.individualProtectionControlList[0].required"
                      :attr="'individualProtectionControlList'"
                      :tableDataOld="iFrom.individualProtectionControlList"
                      @activeTableChange="activeTableChange"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :span="24">
                  <a-form-model-item ref="emergencyControlList" label=" " prop="emergencyControlList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                    <ActiveTable
                      :contentColumns="'应急措施'"
                      :required="iRules.emergencyControlList[0].required"
                      :attr="'emergencyControlList'"
                      :tableDataOld="iFrom.emergencyControlList"
                      @activeTableChange="activeTableChange"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </template>

            <template title="管控责任主体">
              <div>
                <div class="m-t-20 border-b-e7">
                  <PageTitle>管控责任主体</PageTitle>
                </div>
                <div class="m-t-20"></div>
              </div>
              <a-form-model-item ref="riskPointControlResponsibilityList" label=" " prop="riskPointControlResponsibilityList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                <CommonTable :noPaging="true">
                  <!-- 'controlsLevelId' -->
                  <a-table
                    style="width:100%;"
                    bordered
                    :columns="dutyColumns"
                    :rowKey="'controlsLevelId'"
                    :scroll="{ x: tableScrollX(dutyColumns) }"
                    :locale="{emptyText: emptyText}"
                    :data-source="iFrom.riskPointControlResponsibilityList"
                    :pagination="false"
                  >
                    <div slot="responsibilityDeptId" slot-scope="text,record,index">
                      <DeptTree
                        :disabled="!iFrom.corporationId"
                        :placeholder="iFrom.corporationId ? '请选择':'请先选择所属组织'"
                        v-model="record.responsibilityDeptId"
                        :deptData="deptData"
                        @change="(deptId,deptName)=>getLiablePeopleBydepId(deptId,deptName,index)"
                      ></DeptTree>
                    </div>
                    <div slot="responsibilityPersonId" slot-scope="text,record,index">
                      <StaffOrDept
                        class="staff-dept"
                        :labelTitle="'负责人'"
                        :ref="'staff'+index"
                        :onPreview="!record.responsibilityDeptId || record.isGetLiablePeople"
                        :checkAbel="false"
                        :deptTreeId="deptTreeId"
                        :checkedTreeNode="iFrom.riskPointControlResponsibilityList[index].responsibilityPersonId ? iFrom.riskPointControlResponsibilityList[index].responsibilityPersonId.split(',') : []"
                        @getTreeData="value=>getTreeData(value,record,index)"
                      ></StaffOrDept>
                    </div>
                  </a-table>
                </CommonTable>
              </a-form-model-item>
              <a-row>
                <a-col :span="13">
                  <StaffOrDept ref="staffCharge" :labelTitle="'分管安全副总'" :deptTreeId="deptTreeId" :checkedTreeNode="checkedCharge" :checkAbel="false" @getTreeData="getChargeData"></StaffOrDept>
                </a-col>
              </a-row>
            </template>
          </a-form-model>

          <div slot="fixedBottom">
            <FixedBottom>
              <div>
                <a-button class="m-r-15" @click="cancleSubmit">返回</a-button>
                <a-button type="primary" class="m-r-15" :loading="loading" @click="saveChemicalIdentSafetyTips">保存</a-button>
              </div>
            </FixedBottom>
          </div>
        </HasFixedBottomWrapper>
      </a-spin>
    </div>

    <!-- 关联危险源抽屉 -->
    <CommonDrawer title="关联危险源" :visible="dangerSourceShow" :cancelFn="closeHazardSourceDrawer" :width="'90vw'">
      <template>
        <a-tabs>
          <a-tab-pane key="1" tab="共性危险源" forceRender>
            <DangerSourceEqual ref="dangerSourceEqual" :corporationId="iFrom.corporationId" :selectedRowOld="(iFrom.dangerSourceList || []).filter(item=>item.riskDetailedType == 1)" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="特异性危险源" forceRender>
            <DangerSourceSpecial ref="dangerSourceSpecial" :corporationId="iFrom.corporationId" :selectedRowOld="(iFrom.dangerSourceList || []).filter(item=>item.riskDetailedType == 2)" />
          </a-tab-pane>
        </a-tabs>
      </template>
      <template slot="btn">
        <a-button type="dashed" @click="closeHazardSourceDrawer">取消</a-button>
        <a-button type="primary" style="margin-left: 0.2rem" @click="onSubmitHazardSourceDrawer">确定</a-button>
      </template>
    </CommonDrawer>
  </div>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { cloneDeep, isArray } from 'lodash'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import { addRiskBookApi, getRiskBookDetailApi, editRiskBookApi, changeRiskBookApi, getControlsLevelByRiskLevelApi } from "@/services/dangerSource/risk";
import { getLiablePeopleByDeptId } from '@/services/api'
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
import dictionary from "@/utils/dictionary";
import ActiveTable from './components/activeTable.vue'
import DangerSourceEqual from './components/dangerSourceEqual.vue'
import DangerSourceSpecial from './components/dangerSourceSpecial.vue'
import StaffOrDept from "@/components/staffOrDept";
export default {
  components: { FixedBottom, ActiveTable, DangerSourceEqual, DangerSourceSpecial, StaffOrDept },
  mixins: [teableCenterEllipsis, chemicalDict, cancelLoading],
  data() {
    return {
      deptTreeId: undefined,
      deptData: [],
      checkedTreeNode: [],
      checkedCharge: [],
      // 选择危险源抽屉
      dangerSourceShow: false,
      dictionary,
      spinning: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      iFrom: {},
      iRules: {
        corporationId: [{ required: true, message: "所属组织不能为空", trigger: "change" },],
        deptId: [{ required: true, message: "部门不能为空", trigger: "change" },],
        riskPointLocation: [{ required: true, message: "所在位置不能为空", trigger: "blur" },],
        riskPointName: [{ required: true, message: "风险点不能为空", trigger: "blur" },],
        riskLevel: [{ required: true, message: "风险分级不能为空", trigger: "change" },],
        dangerSourceList: [{ required: true, message: "关联危险源不能为空", trigger: "change" },],
        hardTechnologyControlList: [{ required: true, validator: this.intoFactoryDateValidator, trigger: "change", text: '工程技术措施' }],
        managementControlList: [{ required: true, validator: this.intoFactoryDateValidator, trigger: "change", text: '管理措施' },],
        educationalTrainingControlList: [{ required: true, validator: this.intoFactoryDateValidator, trigger: "change", text: '教育培训措施' },],
        individualProtectionControlList: [{ required: true, validator: this.intoFactoryDateValidator, trigger: "change", text: '个体防护措施' },],
        emergencyControlList: [{ required: true, validator: this.intoFactoryDateValidator, trigger: "change", text: '应急措施' },],
        riskPointControlResponsibilityList: [{ required: true, validator: this.riskPointControlResponsibilityListValidator, trigger: "change" },],
        chargeSecurityHeadId: [{ required: false, message: "分管安全副总不能为空", trigger: "change" },],
      },
      // 主要成分table
      columns: [
        {
          title: '编号',
          dataIndex: 'code',
          width: 170,
          scopedSlots: { customRender: "code" },
        },
        {
          title: '工艺',
          dataIndex: 'workmanship',
          width: 100,
          customRender: (text) => {
            text = text ? text : "";
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '设备或区域',
          dataIndex: 'equipmentArea',
          width: 110,
          customRender: (text) => {
            text = text ? text : "";
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '作业状态',
          dataIndex: 'jobStatus',
          width: 100,
          customRender: (text) => {
            text = text ? text : "";
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '风险描述',
          dataIndex: 'riskDescription',
          minWidth: 150,
          customRender: (text) => {
            text = text ? text : "";
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '危险源种类',
          dataIndex: 'riskClassKey',
          width: 110,
          customRender: (text) => {
            text = text ? this.getChemicalDictText('wxy_hazardkind', text) : "";
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '可能导致的事件',
          dataIndex: 'possibleEventsKey',
          width: 140,
          customRender: (text) => {
            text = text ? this.getChemicalDictText('wxy_leadtheevent', text) : "";
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '风险分级',
          dataIndex: "riskClassification",
          fixed: 'right',
          width: 110,
          customCell: (record) => {
            let background = dictionary('riskLevel', record.riskClassification, false).color || ''
            return {
              style: { 'background': background }
            }
          },
          customRender: (text, record) => {
            return text ? dictionary('riskLevel', text) : "";
          },
        },
      ],
      dutyColumns: [
        {
          title: "管控层级",
          dataIndex: "controlsLevelId",
          key: "controlsLevelId",
          align: 'center',
          ellipsis: true,
          customRender: (text) => {
            text = text ? dictionary('controlLevel', text) : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          width: 180,
        },
        {
          title: "责任部门",
          dataIndex: "responsibilityDeptId",
          key: "responsibilityDeptId",
          scopedSlots: { customRender: "responsibilityDeptId" },
          align: 'center',
          ellipsis: true,
        },
        {
          title: "责任人",
          dataIndex: "responsibilityPersonId",
          key: "responsibilityPersonId",
          scopedSlots: { customRender: "responsibilityPersonId" },
          align: 'center',
          ellipsis: true,
        },
      ],
      // 共性危险源选择的项
      dangerSourceEqualTableData: [],
      // 特异性危险源选择的项
      dangerSourceSpecialTableData: [],
    }
  },
  created() {
    // 列表插入所属组织
    this.columns.splice(1, 0, this.addCommonColumnItem(130));
    this.columns.splice(2, 0, this.addCommonColumnDepartment(130));
  },
  mounted() {
    // 页面初始化
    this.initPage()
  },
  computed: {
    // 当前页面是否为新增
    isAddPage() {
      return !this.$route.query.riskPointId
    },
    // 当前页面类型  add新增  edit编辑  change变更
    pageType() {
      return this.$route.meta.pageType
    }
  },
  methods: {
    // 获取部门数据
    corporationDeptChange(deptData) {
      this.deptData = deptData || []
    },
    addDeptNameFn(deptId, deptName) {
      let name = deptName.length ? deptName[0] : undefined
      this.$set(this.iFrom, 'deptName', name)
    },
    // 选择负责人
    getTreeData(value, record, index) {
      record.responsibilityPersonId = value.treeIdList.join('');
      const treeNameAndCodeList = value.treeNameAndCodeList;
      let name = [];
      for (let ele of treeNameAndCodeList) {
        name.push(ele.treeName)
      }
      this.$set(this.iFrom.riskPointControlResponsibilityList[index], 'responsibilityPersonName', name.join())
    },
    // 选择分管安全副总
    getChargeData(value) {
      this.iFrom.chargeSecurityHeadId = value.treeIdList.join('');
      const treeNameAndCodeList = value.treeNameAndCodeList;
      let name = [];
      for (let ele of treeNameAndCodeList) {
        name.push(ele.treeName)
      }
      this.$set(this.iFrom, 'chargeSecurityHeadName', name.join())
    },
    // 页面初始化
    initPage() {
      if (this.isAddPage) {
        // Promise.all([this.getDeptUserTree()])
        //   .then(resArr => { })
        //   .finally(() => {
        //     this.spinning = false
        //   })
        this.spinning = false
      } else {
        // 获取页面详情和组织机构
        Promise.all([this.getPageDetail()])
          .then(resArr => { })
          .finally(() => {
            this.spinning = false
          })
      }
    },
    // 风险分级修改-获取管控责任主体api
    riskLevelChange(riskLevel) {
      if (riskLevel) {
        let apiData = { riskLevel, corporationId : this.iFrom.corporationId }
        getControlsLevelByRiskLevelApi(apiData)
          .then(res => {
            let riskPointControlResponsibilityList = cloneDeep(res.data)
            riskPointControlResponsibilityList.forEach(item => {
              item.controlsLevelId = item.controlLevel
              item.controlsLevelName = item.controlLevelName
            })
            this.$set(this.iFrom, 'riskPointControlResponsibilityList', riskPointControlResponsibilityList)
          })
          .catch(err => { })
      } else {
        this.$set(this.iFrom, 'riskPointControlResponsibilityList', [])
      }
    },
    // 获取初始组织机构树-api
    corporationChange(val, deptId) {
      // 清空责任主体选择的数据
      // 关联危险源清空
      this.$set(this.iFrom, 'dangerSourceList', []);
      // 风险分级清空
      this.$set(this.iFrom, 'riskLevel', undefined);
      // 管控责任主体
      this.$set(this.iFrom, 'riskPointControlResponsibilityList', []);
      this.deptTreeId = deptId
    },
    // 部门改变-查找责任人
    getLiablePeopleBydepId(deptId, deptName, index) {
      // 存储部门名称
      this.$set(this.iFrom.riskPointControlResponsibilityList[index], 'responsibilityDeptName', deptName[0])
      let apiData = { deptId, type: '1' }
      this.$set(this.iFrom.riskPointControlResponsibilityList[index], 'isGetLiablePeople', true)
      getLiablePeopleByDeptId(apiData)
        .then(res => {
          if (res.data && res.data.length && res.data[0].userId) {
            this.$set(this.iFrom.riskPointControlResponsibilityList[index], 'responsibilityPersonId', res.data[0].userId)
            this.$set(this.iFrom.riskPointControlResponsibilityList[index], 'responsibilityPersonName', `${res.data[0].name ? res.data[0].name : ''}/${res.data[0].deptId ? res.data[0].deptId : ''}`)
          } else {
            this.$set(this.iFrom.riskPointControlResponsibilityList[index], 'responsibilityPersonId', undefined)
            this.$set(this.iFrom.riskPointControlResponsibilityList[index], 'responsibilityPersonName', undefined)
          }
        })
        .catch(err => { })
        .finally(() => {
          this.$set(this.iFrom.riskPointControlResponsibilityList[index], 'isGetLiablePeople', false)
        })
    },
    // 分管安全副总文字
    chargeSecurityHeadIdChange(keyId, chargeSecurityHeadName) {
      this.$set(this.iFrom, 'chargeSecurityHeadName', chargeSecurityHeadName[0])
    },
    // 责任人修改
    responsibilityPersonIdChange(personId, personName, index) {
      // console.log('责任人修改', personId, personName, index);
      this.$set(this.iFrom.riskPointControlResponsibilityList[index], 'responsibilityPersonName', personName[0])
    },
    // 各措施表单校验
    intoFactoryDateValidator(rule, value, callback) {
      let { required, text } = rule
      value = value ? value : []
      let hasNull = value.some(item => {
        return item.detailContent == ''
      })
      if (value.length == 0) {
        required ? callback(new Error(`${text}不能为空`)) : callback();
      } else if (hasNull) {
        required ? callback(new Error(`${text}不能存在空白内容`)) : callback();
      } else {
        callback();
      }
    },
    // 管控责任主体表单校验
    riskPointControlResponsibilityListValidator(rule, value, callback) {
      let { required } = rule
      value = value ? value : []
      let hasDeptNull = value.some(item => {
        return item.responsibilityDeptId == undefined
      })
      let hasPersonNull = value.some(item => {
        return !item.responsibilityPersonId
      })
      if (value.length == 0) {
        required ? callback(new Error(`管控责任主体不能为空`)) : callback();
      } else if (hasDeptNull) {
        required ? callback(new Error(`责任部门存在未选择的项`)) : callback();
      } else if (hasPersonNull) {
        required ? callback(new Error(`责任人存在未选择的项`)) : callback();
      } else {
        callback();
      }
    },
    // 各措施表单输入内容变更
    activeTableChange(attr, targetList) {
      targetList.forEach((item, index) => {
        item.sortVal = index + 1
      })
      this.$set(this.iFrom, attr, targetList)
      formValidator.formItemValidate(this, attr, 'ruleForm')
    },
    // 获取页面详情
    getPageDetail() {
      let apiData = { riskPointId: this.$route.query.riskPointId }
      return new Promise((resolve, rej) => {
        getRiskBookDetailApi(apiData)
          .then(res => {
            let iFrom = res.data

            iFrom.hardTechnologyControlList = this.addGuid(iFrom.hardTechnologyControlList)
            iFrom.managementControlList = this.addGuid(iFrom.managementControlList)
            iFrom.educationalTrainingControlList = this.addGuid(iFrom.educationalTrainingControlList)
            iFrom.individualProtectionControlList = this.addGuid(iFrom.individualProtectionControlList)
            iFrom.emergencyControlList = this.addGuid(iFrom.emergencyControlList)
            iFrom.dangerSourceList = this.addGuid(iFrom.dangerSourceList)
            this.iFrom = cloneDeep(iFrom)
            this.checkedCharge = this.iFrom.chargeSecurityHeadId ? this.iFrom.chargeSecurityHeadId.split(",") : []
            // 部门回显
            this.$refs.commonSearchItem.corporationChange(iFrom.corporationId, iFrom.deptId)
            resolve()
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
    formValidate() {
      // 如果页面表单验证有报错则滚动到表单验证报错的地方
      let formAll = true
      this.$refs["ruleForm"].validate((valid, object) => {
        if (!valid) {
          formAll = false
          this.scrollView(object);
        }
      });
      return formAll
    },
    // 保存api
    saveChemicalIdentSafetyTips() {
      console.log(this.iFrom);
      if (!this.formValidate()) {
        return
      }
      this.handleLoading()
      let apiData = { ...this.iFrom }
      // 草稿 1-是，2-否
      apiData.draftStatus = 1
      const apiName = this.isAddPage ? addRiskBookApi : (this.pageType == 'edit' ? editRiskBookApi : changeRiskBookApi)
      this.handleLoading();
      apiName(apiData)
        .then(res => {
          this.$antMessage.success('保存成功');
          // 跳转列表页
          this.$router.push({ path: '/safeManage/dualControlManage/riskManage/riskBook' })
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 关联危险源-跳转详情页
    goDangerSourceDetailsPage(record) {
      let type = record.riskDetailedType
      let path = record.riskDetailedType == 1 ? '/safeManage/dualControlManage/riskManage/detailDanger' : '/safeManage/dualControlManage/riskManage/detailDanger'
      let routeUrl = this.$router.resolve({
        path,
        query: { id: record.id, type, back: true }
      });
      window.open(routeUrl.href, "_blank");
    },
    // 关联危险源-打开抽屉
    openHazardSourceDrawer(row) {
      if (this.iFrom.corporationId) {
        this.dangerSourceShow = true;
      } else {
        this.$antMessage.warn('请先选择所属组织');
      }
    },
    // 关联危险源-关闭抽屉
    closeHazardSourceDrawer() {
      this.dangerSourceShow = false
    },
    // 关联危险源-抽屉-提交
    onSubmitHazardSourceDrawer() {
      // 共性
      this.dangerSourceEqualTableData = cloneDeep(this.$refs.dangerSourceEqual.selectedRow)
      this.dangerSourceEqualTableData.forEach(item => {
        item.riskDetailedType = 1
      })
      // 特异性
      this.dangerSourceSpecialTableData = cloneDeep(this.$refs.dangerSourceSpecial.selectedRow)
      this.dangerSourceSpecialTableData.forEach(item => {
        item.riskDetailedType = 2
      })
      let dangerSourceList = [...this.dangerSourceEqualTableData, ...this.dangerSourceSpecialTableData]
      dangerSourceList.forEach(item => {
        item.guid = this.guid()
      })
      this.$set(this.iFrom, 'dangerSourceList', dangerSourceList)
      // 自动处理风险分级
      this.riskLevelHandleAuto(dangerSourceList)
      this.closeHazardSourceDrawer()
    },
    // 自动处理风险分级
    riskLevelHandleAuto(dangerSourceList) {
      if (dangerSourceList.length) {
        dangerSourceList.forEach(item => {
          item.valueRisk = item.valueRisk ? item.valueRisk - 0 : 0
        })
        dangerSourceList.sort((a, b) => {
          return b.valueRisk - a.valueRisk
        })
        let riskLevelList = Array.isArray(dictionary('riskLevel')) ? dictionary('riskLevel') : []
        let riskLevelKey = riskLevelList.map(item => item.key)
        if (riskLevelKey.includes(dangerSourceList[0].riskClassification)) {
          this.$set(this.iFrom, 'riskLevel', dangerSourceList[0].riskClassification)
        }
      } else {
        this.$set(this.iFrom, 'riskLevel', undefined)
      }
      this.riskLevelChange(this.iFrom.riskLevel)
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
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    // 部门表单校验
    deptFormValidator(val) {
      formValidator.formItemValidate(this, 'deptId', 'ruleForm')
    },
    // 测试人员模糊筛选
    filterUserTree(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue)
    },
  }
}
</script>

<style lang="less" scoped>
.searchtable-wrapper {
  display: flex;
  .left-box {
    flex: 1;
    position: relative;
    display: flex;
    overflow: hidden;
    .ttile {
      display: flex;
      align-items: center;
      margin-bottom: -3px;
      border-bottom: 1px solid transparent;
      .ttile-text {
        // margin-bottom: 10px;
        margin-right: 12px;
      }
      .ttile-text-required {
        &::before {
          display: inline-block;
          margin-right: 4px;
          color: #f5222d;
          font-size: 14px;
          font-family: SimSun, sans-serif;
          line-height: 1;
          content: "*";
        }
      }
      .ttile-bbtn {
        margin-bottom: 0px;
      }
    }
    ::v-deep .fixed-bottom {
      bottom: 0px;
    }
  }
  .right-box {
    flex: none;
    display: flex;
  }
}
.overflow-text {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.can-click {
  color: #0067cc;
  cursor: pointer;
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
::v-deep .table-organizeLazyTree {
  .ant-select-selection {
    border-color: #b0b0b0 !important;
  }
  .ant-select-arrow {
    color: #333 !important;
  }
}
.staff-dept {
  ::v-deep .ant-form-item {
    padding-bottom: unset;
    .ant-select-selection {
      border-color: #b0b0b0 !important;
    }
    .ant-select-arrow {
      color: #333 !important;
    }
  }
}
</style>
