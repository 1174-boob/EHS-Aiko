<template>
  <HasFixedBottomWrapper>
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <a-form-model ref="ruleForm" :model="iFrom" :rules="iRules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <template title="基本信息">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>基本信息</PageTitle>
            </div>
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
              <a-form-model-item ref="applyDepartCode" label="起草人部门" prop="applyDepartCode">
                <DeptTree :placeholder="iFrom.corporationId ? '请选择':'请先选择所属组织'" v-model="iFrom.applyDepartCode" :deptData="deptData" @change="(val,lab)=> departOrPerpleChange(lab,'applyDepartName')"></DeptTree>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <StaffOrDept
                ref="applyUserCode"
                :labelTitle="'责任担当'"
                :treeRoles="iRules"
                :propKey="'applyUserCode'"
                :treePlaceholder="deptTreeId?'请选择' : '请先选择所属组织'"
                :checkedTreeNode="checkedTreeNode"
                :deptTreeId="deptTreeId"
                :checkAbel="false"
                @getTreeData="getTreeData"
              />
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="applyContact" label="担当联系方式" prop="applyContact">
                <a-input v-model.trim="iFrom.applyContact" :maxLength="50" placeholder="请输入担当联系方式"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="areaDepartCode" label="作业区域部门" prop="areaDepartCode">
                <DeptTree :placeholder="iFrom.corporationId ? '请选择':'请先选择所属组织'" v-model="iFrom.areaDepartCode" :deptData="deptData" @change="(val,lab)=> departOrPerpleChange(lab,'areaDepartName')"></DeptTree>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="areaLocation" label="作业区域具体位置" prop="areaLocation">
                <a-input v-model.trim="iFrom.areaLocation" :maxLength="50" placeholder="请输入作业区域具体位置"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="operateBrief" label="作业内容简述" prop="operateBrief">
                <a-input v-model.trim="iFrom.operateBrief" :maxLength="200" placeholder="请输入作业内容简述"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="operateType" label="作业类别" prop="operateType">
                <a-select v-model="iFrom.operateType" show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOptionMixin" @change="operateTypeChange">
                  <a-select-option v-for="item in getChemicalDictList('hazard_category')" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="operateLevel" label="作业级别" prop="operateLevel" v-if="['fire_work','high_work'].includes(iFrom.operateType)">
                <a-select v-model="iFrom.operateLevel" show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOptionMixin">
                  <a-select-option v-for="item in hazardLevelList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="isNight" label="是否跨夜" prop="isNight">
                <a-select v-model="iFrom.isNight" show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOptionMixin">
                  <a-select-option v-for="item in overnightList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="dayDate" label="作业日期" prop="dayDate">
                <a-range-picker
                  :allowClear="false"
                  valueFormat="YYYY-MM-DD"
                  v-model="iFrom.dayDate"
                  :disabled-date="disabledDate"
                  style="width:100%"
                  format="YYYY-MM-DD"
                  :placeholder="['开始日期','结束日期']"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="dayTime" label="每日作业时间" prop="dayTime">
                <el-time-picker
                  is-range
                  :clearable="false"
                  v-model="iFrom.dayTime"
                  style="width:100%"
                  range-separator="~"
                  start-placeholder="开始时间"
                  format="HH:mm"
                  valueFormat="HH:mm"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                ></el-time-picker>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>

        <template title="现场监护人">
          <div>
            <div class="ttile border-b-e7">
              <PageTitle class="ttile-text">现场监护人</PageTitle>
              <DashBtn class="ttile-bbtn">
                <div>
                  <a-button type="dashed" @click="openAddCasNoModel()">
                    <a-icon type="plus" />添加一行
                  </a-button>
                </div>
              </DashBtn>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-form-model-item ref="dangerGuardian" label=" " prop="dangerGuardian" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
            <CommonTable :noPaging="true">
              <a-table style="width:100%;" :columns="columns" :scroll="{ x: tableScrollX() }" :locale="{emptyText: emptyText}" :data-source="iFrom.dangerGuardian" :rowKey="'guid'" :pagination="false">
                <div slot="action" slot-scope="record">
                  <span class="color-0067cc cursor-pointer m-r-15" @click="openAddCasNoModel(record)">编辑</span>
                  <span class="color-0067cc cursor-pointer" @click="tableRowRm(record)">删除</span>
                </div>
              </a-table>
            </CommonTable>
          </a-form-model-item>
        </template>

        <a-row>
          <a-col :span="12">
            <a-form-model-item ref="isMust" label="作业形式" prop="isMust">
              <a-select v-model="iFrom.isMust" show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOptionMixin">
                <a-select-option v-for="item in dictionary('hazardForm')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>

        <template title="外协厂商信息" v-if="iFrom.isMust-0 == 2">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>外协厂商信息</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="outCompany" label="外协厂商名称" prop="outCompany">
                <a-input v-model.trim="iFrom.outCompany" :maxLength="50" placeholder="请输入单位名称"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="outPrincipal" label="负责人" prop="outPrincipal">
                <a-input v-model.trim="iFrom.outPrincipal" :maxLength="20" placeholder="请输入负责人"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="outPrincipalContact" label="负责人联系方式" prop="outPrincipalContact">
                <a-input v-model.trim="iFrom.outPrincipalContact" :maxLength="20" placeholder="请输入负责人联系方式"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="outSafety" label="安全员" prop="outSafety">
                <a-input v-model.trim="iFrom.outSafety" :maxLength="20" placeholder="请输入安全员"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="outSafetyContact" label="安全员联系方式" prop="outSafetyContact">
                <a-input v-model.trim="iFrom.outSafetyContact" :maxLength="20" placeholder="请输入安全员联系方式"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <template title="特种作业员">
            <div>
              <div class="ttile border-b-e7">
                <PageTitle class="ttile-text">特种作业员</PageTitle>
                <DashBtn class="ttile-bbtn">
                  <div>
                    <a-button type="dashed" @click="openAddSpecialModelModel()">
                      <a-icon type="plus" />添加一行
                    </a-button>
                  </div>
                </DashBtn>
              </div>
              <div class="m-t-20"></div>
            </div>

            <a-form-model-item ref="dangerSpecialPerson" label=" " prop="dangerSpecialPerson" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
              <CommonTable :noPaging="true">
                <a-table
                  style="width:100%;"
                  :columns="columnsSpecial"
                  :scroll="{ x: tableScrollX() }"
                  :locale="{emptyText: emptyText}"
                  :data-source="iFrom.dangerSpecialPerson"
                  :rowKey="'guid'"
                  :pagination="false"
                >
                  <div slot="action" slot-scope="record">
                    <span class="color-0067cc cursor-pointer m-r-15" @click="openAddSpecialModelModel(record)">编辑</span>
                    <span class="color-0067cc cursor-pointer" @click="specialtableRowRm(record)">删除</span>
                  </div>
                </a-table>
              </CommonTable>
            </a-form-model-item>
          </template>
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

    <!-- 添加现场监护人弹窗 -->
    <AddCasNoModel v-model="addCasNoModelShow" :addCasNoModelData="addCasNoModelData" :moduleList="iFrom.dangerGuardian" :deptTreeId="deptTreeId" @changeModuleList="changeModuleList" />
    <!-- 添加特种作业员弹窗 -->
    <AddSpecialModel v-model="addSpecialModelShow" :addSpecialModelData="addSpecialModelData" :moduleList="iFrom.dangerSpecialPerson" @changeSpecialModuleList="changeSpecialModuleList" />
  </HasFixedBottomWrapper>
</template>
<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { cloneDeep } from 'lodash'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import AddCasNoModel from "./components/addCasNoModel.vue";
import AddSpecialModel from "./components/addSpecialModel.vue";
import { addDangerWorkStaticApi, getDangerWorkStaticDetailApi, editDangerWorkStaticApi } from '@/services/dangerWorkStatic.js'
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
import dictionary from "@/utils/dictionary";
import { PushTask } from '@/services/api'
import moment from 'moment';
import StaffOrDept from "@/components/staffOrDept";
import deptAndUser from '../mixin/deptAndUser.js'
export default {
  components: { FixedBottom, AddCasNoModel, AddSpecialModel, StaffOrDept },
  mixins: [teableCenterEllipsis, chemicalDict, cancelLoading, deptAndUser],
  data() {
    return {
      dictionary,
      spinning: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      iFrom: {},
      iRules: {
        applyDepartCode: [{ required: true, message: "起草人部门不能为空", trigger: "change" },],
        applyUserCode: [{ required: true, message: "责任担当不能为空", trigger: "change" },],
        applyContact: [{ required: true, message: "担当联系方式不能为空", trigger: "blur" },],
        areaDepartCode: [{ required: true, message: "作业区域部门不能为空", trigger: "change" },],
        areaLocation: [{ required: true, message: "作业区域具体位置不能为空", trigger: "blur" },],
        operateBrief: [{ required: true, message: "作业内容简述不能为空", trigger: "blur" },],
        operateType: [{ required: true, message: "作业类别不能为空", trigger: "change" },],
        operateLevel: [{ required: false, message: "作业级别不能为空", trigger: "change" },],
        isNight: [{ required: true, message: "是否跨夜不能为空", trigger: "change" },],
        dayDate: [{ required: true, message: "作业日期不能为空", trigger: "change" },],
        dayTime: [{ required: true, message: "每日作业时间不能为空", trigger: "change" },],
        dangerGuardian: [{ required: true, message: "现场监护人不能为空", trigger: "change" },],
        isMust: [{ required: true, message: "作业形式不能为空", trigger: "change" },],
        outCompany: [{ required: true, message: "外协厂商名称不能为空", trigger: "blur" },],
        outPrincipal: [{ required: true, message: "负责人不能为空", trigger: "blur" },],
        outPrincipalContact: [{ required: true, message: "负责人联系方式不能为空", trigger: "blur" },],
        outSafety: [{ required: true, message: "安全员不能为空", trigger: "blur" },],
        outSafetyContact: [{ required: true, message: "安全员联系方式不能为空", trigger: "blur" },],
        dangerSpecialPerson: [{ required: false, message: "特种作业员不能为空", trigger: "change" },],
      },
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
      // 添加一行弹窗-显示隐藏
      addCasNoModelShow: false,
      addCasNoModelData: {},

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
      // 添加一行弹窗-显示隐藏
      addSpecialModelShow: false,
      addSpecialModelData: {},
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
      // 主键id
      operateId: undefined,
      deptTreeId: undefined,
    }
  },
  created() {
    this.operateId = this.$route.query.operateId + '' || undefined
  },
  computed: {
    // 当前页面是否为新增
    isAddPage() {
      return !this.$route.query.operateId
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
      if (this.isAddPage) {
        this.$set(this.iFrom, 'isMust', '1');
        this.spinning = false
      } else {
        // 获取页面详情
        Promise.all([this.getPageDetail()])
          .finally(() => {
            this.spinning = false
          })
      }
    },
    // 选择人员后的change事件
    getTreeData(value) {
      // console.log("ppppp----", value);
      let { treeIdList, treeNameAndCodeList } = value

      // 针对组件取消后数据被清空时做保存数据处理
      this.checkedTreeNode = treeIdList

      let { id, treeName, treeCode } = treeNameAndCodeList && treeNameAndCodeList.length ? treeNameAndCodeList[0] : {}
      let applyUserCode = id
      let applyUserName = (treeName || '') + (treeName && treeCode ? '/' : '') + (treeCode || '')
      this.$set(this.iFrom, 'applyUserCode', applyUserCode)
      this.departOrPerpleChange([applyUserName], 'applyUserName')
      formValidator.formItemValidate(this, "applyUserCode", "ruleForm")
    },
    // 各部门改变
    departOrPerpleChange(lab, attrName) {
      this.$set(this.iFrom, attrName, lab[0])
    },
    // 作业类别改变
    operateTypeChange(val, rm = true) {
      if (val == 'fire_work') {
        this.hazardLevelList = dictionary('dangerhazardHLevel')
        this.iRules.operateLevel[0].required = true
      } else if (val == 'high_work') {
        this.hazardLevelList = dictionary('dangerhazardGLevel')
        this.iRules.operateLevel[0].required = true
      } else {
        this.hazardLevelList = []
        this.iRules.operateLevel[0].required = false
      }
      rm && this.$set(this.iFrom, 'operateLevel', undefined)
    },
    // 时间限制
    disabledDate(current) {
      return current < moment().subtract(1, 'days').endOf('day')
    },
    // 组织机构-改变
    corporationChange(val, corporationDeptId) {
      // console.log('被清除了');
      this.$set(this.iFrom, 'applyDepartCode', undefined)
      this.$set(this.iFrom, 'applyDepartName', undefined)
      this.$set(this.iFrom, 'areaDepartCode', undefined)
      this.$set(this.iFrom, 'areaDepartName', undefined)
      // 人员相关
      this.deptTreeId = corporationDeptId
      this.$set(this.iFrom, 'applyUserCode', undefined)
      this.$set(this.iFrom, 'applyUserName', undefined)
      this.checkedTreeNode = []
      // 现场监护人
      this.$set(this.iFrom, 'dangerGuardian', [])
    },
    // 获取页面详情
    getPageDetail() {
      let operateId = this.operateId
      let apiData = { operateId }
      return new Promise((resove, rej) => {
        getDangerWorkStaticDetailApi(apiData)
          .then(res => {
            let iFrom = res.data
            iFrom.dangerGuardian = this.addGuid(iFrom.dangerGuardian)
            iFrom.dangerSpecialPerson = this.addGuid(iFrom.dangerSpecialPerson == null? [] : iFrom.dangerSpecialPerson)
            this.operateTypeChange(iFrom.operateType, false)
            // 部门回显
            this.$refs.corporationId.corporationChange(iFrom.corporationId, iFrom.deptId)
            this.checkedTreeNode = iFrom.applyUserCode ? [iFrom.applyUserCode] : [];
            setTimeout(() => {
              this.iFrom = iFrom
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
    formValidate() {
      // 如果页面表单验证有报错则滚动到表单验证报错的地方
      let formAll = true
      this.$refs["ruleForm"].validate((valid, object) => {
        if (!valid) {
          formAll = false
          this.scrollView(object);
        }
      });
      if (!this.iFrom.applyUserCode) {
        formAll = false
      }

      return formAll
    },
    // 提交之前的流程api
    iSubmit() {
      if (!this.formValidate() || this.loading || this.spinning) {
        return
      }
      this.handleLoading();
      // 删除外协厂商信息
      if (this.iFrom.isMust == '1') {
        this.rmAttrFn()
      }
      // 草稿 1-是，2-否
      let apiData = { ...this.iFrom, isDraft: 2 }
      const apiName = this.isAddPage ? addDangerWorkStaticApi : editDangerWorkStaticApi
      return apiName(apiData)
        .then(res => {
          // 代办推送
          let securityUser = this.iFrom.dangerGuardian.map(item => item.guardianCode)
          securityUser = securityUser.join()
          let operateId = this.isAddPage ? (res.data ? res.data.id : undefined) : this.operateId
          this.pushTask(securityUser, operateId)

          this.$antMessage.success('提交成功');
          // 跳转列表页
          this.$router.push({ path: '/safeManage/dangerWorkStatic/dangerWorkStaticAccount' })
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 代办推送
    async pushTask(securityUser, operateId) {
      if (operateId) {
        const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/safeManage/dangerWorkStatic/dangerWorkStaticHandle&operateId=${operateId}`
        const pushTask = await PushTask({
          title: "危险作业前确认",
          approval: 'dangerWorkStatic',
          userId: securityUser,
          url: url,
          docNumber: this.iFrom?.operateNumber,   //业务id
          docId: operateId,  //主键id
        })
      }
    },
    // 删除外协厂商信息属性
    rmAttrFn() {
      this.iFrom.outCompany = undefined
      this.iFrom.outPrincipal = undefined
      this.iFrom.outPrincipalContact = undefined
      this.iFrom.outSafety = undefined
      this.iFrom.outSafetyContact = undefined
      this.iFrom.dangerSpecialPerson = undefined
    },
    // 保存api
    iSave() {
      console.log(this.iFrom);
      if (!this.formValidate() || this.loading || this.spinning) {
        return
      }
      // 删除外协厂商信息
      if (this.iFrom.isMust == '1') {
        this.rmAttrFn()
      }
      // 草稿 1-是，2-否
      let apiData = { ...this.iFrom, isDraft: 1 }
      const apiName = this.isAddPage ? addDangerWorkStaticApi : editDangerWorkStaticApi
      this.handleLoadingTwo();
      apiName(apiData)
        .then(res => {
          this.$antMessage.success('保存成功');
          // 跳转列表页
          this.$router.push({ path: '/safeManage/dangerWorkStatic/dangerWorkStaticDraft' })
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoadingTwo();
        })
    },
    // 特种作业员-打开窗口-新增、编辑
    openAddSpecialModelModel(row) {
      this.addSpecialModelData = row ? row : {}
      this.addSpecialModelShow = true;
    },
    // 特种作业员-添加、修改一行
    changeSpecialModuleList(moduleDataList) {
      this.$set(this.iFrom, 'dangerSpecialPerson', moduleDataList)
      formValidator.formItemValidate(this, 'dangerSpecialPerson', 'ruleForm')
    },
    // 特种作业员-删除一行
    specialtableRowRm(row) {
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          this.iFrom.dangerSpecialPerson = this.iFrom.dangerSpecialPerson.filter(item => {
            return item.guid != row.guid
          })
          formValidator.formItemValidate(this, 'dangerSpecialPerson', 'ruleForm')
        },
      });
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
    // 现场监护人-打开窗口-新增、编辑
    openAddCasNoModel(row) {
      if (this.iFrom.corporationId) {
        this.addCasNoModelData = row ? row : {}
        this.addCasNoModelShow = true;
      } else {
        this.$antMessage.warn('请先选择所属组织')
      }
    },
    // 现场监护人-添加、修改一行
    changeModuleList(moduleDataList) {
      this.$set(this.iFrom, 'dangerGuardian', moduleDataList)
      formValidator.formItemValidate(this, 'dangerGuardian', 'ruleForm')
    },
    // 现场监护人-删除一行
    tableRowRm(row) {
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          this.iFrom.dangerGuardian = this.iFrom.dangerGuardian.filter(item => {
            return item.guid != row.guid
          })
          formValidator.formItemValidate(this, 'dangerGuardian', 'ruleForm')
        },
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