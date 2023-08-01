<template>
  <a-form-model ref="ruleForm" :model="iFrom" :rules="iRules" :label-col="labelCol" :wrapper-col="wrapperCol">
    <template title="基本信息">
      <div>
        <div class="m-t-20 border-b-e7">
          <PageTitle>基本信息</PageTitle>
        </div>
        <div class="m-t-20"></div>
      </div>
      <a-row>
        <a-col :span="colSpan" :xxl="xxlSpan">
          <!-- <CommonSearchItem :CommonFormInline="iFrom" :rules="iRules" :notTablePage="true" :labelCol="labelCol" :wrapperCol="wrapperCol" disabled :hasDepartment="false"></CommonSearchItem> -->
          <CommonDept
            ref="corporationId"
            :CommonFormInline="iFrom"
            :rules="iRules"
            disabled
            :notTablePage="true"
            :hasDepartment="true"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            @corporationDeptChange="corporationDeptChange"
          ></CommonDept>
        </a-col>
        <a-col :span="colSpan" :xxl="xxlSpan">
          <a-form-model-item ref="applyDepartCode" label="起草人部门" prop="applyDepartCode">
            <!-- <OrganizeLazyTree
              disabled
              v-model="iFrom.applyDepartCode"
              ref="organizeLazyTree"
              :defaultGet="false"
              :useOutOrganizeTreeList="true"
              :outOrganizeTreeList="outOrganizeTreeList"
              :placeholder="'请先选择所属组织'"
            />-->

            <DeptTree :placeholder="iFrom.corporationId ? '请选择':'请先选择所属组织'" disabled v-model="iFrom.applyDepartCode" :deptData="deptData"></DeptTree>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="colSpan" :xxl="xxlSpan">
          <StaffOrDept :labelTitle="'责任担当'" :treeRoles="iRules" :propKey="'applyUserCode'" :checkedTreeNode="checkedTreeNode" :checkAbel="false" :onPreview="true" />
        </a-col>
        <a-col :span="colSpan" :xxl="xxlSpan">
          <a-form-model-item ref="applyContact" label="担当联系方式" prop="applyContact">
            <a-input v-model.trim="iFrom.applyContact" disabled :maxLength="50" placeholder="请输入担当联系方式"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="colSpan" :xxl="xxlSpan">
          <a-form-model-item ref="areaDepartCode" label="作业区域部门" prop="areaDepartCode">
            <!-- <OrganizeLazyTree v-model="iFrom.areaDepartCode" ref="areaDepartCodeLazyTree" :useOutOrganizeTreeList="true" :outOrganizeTreeList="outOrganizeTreeList" disabled :placeholder="'请先选择所属组织'" /> -->
            <DeptTree :placeholder="iFrom.corporationId ? '请选择':'请先选择所属组织'" disabled v-model="iFrom.areaDepartCode" :deptData="deptData"></DeptTree>
          </a-form-model-item>
        </a-col>
        <a-col :span="colSpan" :xxl="xxlSpan">
          <a-form-model-item ref="areaLocation" label="作业区域具体位置" prop="areaLocation">
            <a-input v-model.trim="iFrom.areaLocation" disabled :maxLength="50" placeholder="请输入作业区域具体位置"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="colSpan" :xxl="xxlSpan">
          <a-form-model-item ref="operateBrief" label="作业内容简述" prop="operateBrief">
            <a-input v-model.trim="iFrom.operateBrief" disabled :maxLength="200" placeholder="请输入作业内容简述"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="colSpan" :xxl="xxlSpan">
          <a-form-model-item ref="operateType" label="作业类别" prop="operateType">
            <a-select v-model="iFrom.operateType" disabled show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOptionMixin">
              <a-select-option v-for="item in getChemicalDictList('hazard_category')" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="colSpan" :xxl="xxlSpan">
          <a-form-model-item ref="operateLevel" label="作业级别" prop="operateLevel">
            <a-select v-model="iFrom.operateLevel" disabled show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOptionMixin">
              <a-select-option v-for="item in hazardLevelList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="colSpan" :xxl="xxlSpan">
          <a-form-model-item ref="sgrlx" label="作业日类型" prop="sgrlx">
            <a-select v-model="iFrom.sgrlx" disabled show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOptionMixin">
              <a-select-option v-for="item in getChemicalDictList('sgrlx')" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="colSpan" :xxl="xxlSpan">
          <a-form-model-item ref="ssfwyjsgfty" label="是否夜间施工" prop="ssfwyjsgfty">
            <a-select v-model="iFrom.ssfwyjsgfty" disabled show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOptionMixin">
              <a-select-option v-for="item in getChemicalDictList('ssfwyjsgfty')" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="colSpan" :xxl="xxlSpan">
          <a-form-model-item ref="dayDate" label="作业日期" prop="dayDate">
            <a-range-picker :allowClear="false" disabled valueFormat="YYYY-MM-DD" v-model="iFrom.dayDate" style="width:100%" format="YYYY-MM-DD" :placeholder="['开始日期','结束日期']" />
          </a-form-model-item>
        </a-col>
        <a-col :span="colSpan" :xxl="xxlSpan">
          <a-form-model-item ref="dayTime" label="每日作业时间" prop="dayTime">
            <el-time-picker
              is-range
              disabled
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
        </div>
        <div class="m-t-20"></div>
      </div>
      <a-form-model-item ref="dangerGuardian" label=" " prop="dangerGuardian" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
        <CommonTable :noPaging="true">
          <a-table style="width:100%;" :columns="columns" :scroll="{ x: tableScrollX() }" :locale="{emptyText: emptyText}" :data-source="iFrom.dangerGuardian" :rowKey="'guid'" :pagination="false"></a-table>
        </CommonTable>
      </a-form-model-item>
    </template>

    <!-- <a-row>
      <a-col :span="colSpan" :xxl="xxlSpan">
        <a-form-model-item ref="isMust" label="作业形式" prop="isMust">
          <a-select v-model="iFrom.isMust" disabled show-search placeholder="请选择" option-filter-prop="children" :filter-option="filterOptionMixin">
            <a-select-option v-for="item in dictionary('hazardForm')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
    </a-row> -->

    <template title="外协厂商信息">
      <div>
        <div class="m-t-20 border-b-e7">
          <PageTitle>外协厂商信息</PageTitle>
        </div>
        <div class="m-t-20"></div>
      </div>
      <a-row>
        <a-col :span="colSpan" :xxl="xxlSpan">
          <a-form-model-item ref="outCompany" label="外协厂商名称" prop="outCompany">
            <a-input v-model.trim="iFrom.outCompany" disabled :maxLength="50" placeholder="请输入单位名称"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="colSpan" :xxl="xxlSpan">
          <a-form-model-item ref="outPrincipal" label="负责人" prop="outPrincipal">
            <a-input v-model.trim="iFrom.outPrincipal" disabled :maxLength="20" placeholder="请输入负责人"></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="colSpan" :xxl="xxlSpan">
          <a-form-model-item ref="outPrincipalContact" label="负责人联系方式" prop="outPrincipalContact">
            <a-input v-model.trim="iFrom.outPrincipalContact" disabled :maxLength="20" placeholder="请输入负责人联系方式"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="colSpan" :xxl="xxlSpan">
          <a-form-model-item ref="outSafety" label="安全员" prop="outSafety">
            <a-input v-model.trim="iFrom.outSafety" disabled :maxLength="20" placeholder="请输入安全员"></a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="colSpan" :xxl="xxlSpan">
          <a-form-model-item ref="outSafetyContact" label="安全员联系方式" prop="outSafetyContact">
            <a-input v-model.trim="iFrom.outSafetyContact" disabled :maxLength="20" placeholder="请输入安全员联系方式"></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <template title="特种作业员">
        <div>
          <div class="ttile border-b-e7">
            <PageTitle class="ttile-text">特种作业员</PageTitle>
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
            ></a-table>
          </CommonTable>
        </a-form-model-item>
        <a-form-model-item label="特种操作证" :label-col="labelColSpec" :wrapper-col="wrapperColSpec">
          <UploadBtnStyle :maxSize="20" :onlyShow="true" @handleSuccess="handleFileSuccessTwo" :fileLists="iFrom.tzczzList"></UploadBtnStyle>
        </a-form-model-item>
        <a-form-model-item label="环境安全告知书" :label-col="labelColSpec" :wrapper-col="wrapperColSpec">
          <UploadBtnStyle :maxSize="20" :onlyShow="true" @handleSuccess="handleFileSuccessFive" :fileLists="iFrom.hjaqgzsList"></UploadBtnStyle>
        </a-form-model-item>
        <a-form-model-item label="施工人员名单" :label-col="labelColSpec" :wrapper-col="wrapperColSpec">
          <UploadBtnStyle :maxSize="20" :onlyShow="true" @handleSuccess="handleFileSuccessThree" :fileLists="iFrom.sgryqdList"></UploadBtnStyle>
        </a-form-model-item>
        <a-form-model-item label="教育记录" :label-col="labelColSpec" :wrapper-col="wrapperColSpec">
          <UploadBtnStyle :maxSize="20" :onlyShow="true" @handleSuccess="handleFileSuccessOne" :fileLists="iFrom.jyjlList"></UploadBtnStyle>
        </a-form-model-item>
        <a-form-model-item label="安全施工方案orJHA工作危害分析" :label-col="labelColSpec" :wrapper-col="wrapperColSpec">
          <UploadBtnStyle :maxSize="20" :onlyShow="true" @handleSuccess="handleFileSuccessFour" :fileLists="iFrom.aqsgfaorjhagzwhfxList"></UploadBtnStyle>
        </a-form-model-item>
      </template>
    </template>
  </a-form-model>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { cloneDeep } from 'lodash'
import { getDangerWorkStaticDetailApi, } from '@/services/dangerWorkStatic.js'
import { DeptUserTree } from '@/services/api'
import chemicalDict from "@/mixin/chemicalDict.js";
import dictionary from "@/utils/dictionary";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue"
import { getConsoleOrganizeLazyLoadListApi } from '@/services/chemicalIdentSafetyTipsAdd.js'
import StaffOrDept from "@/components/staffOrDept";
import deptAndUser from '@/pages/dangerWorkStatic/mixin/deptAndUser.js'
export default {
  components: { StaffOrDept ,UploadBtnStyle},
  mixins: [teableCenterEllipsis, chemicalDict, deptAndUser],
  props: {
    iFromDefault: {
      required: true,
    }
  },
  data() {
    return {
      deptTreeId: undefined,
      dictionary,
      colSpan: 16,
      xxlSpan: 12,
      userTreeFields: { value: 'key' },
      labelCol: { span: 7 },
      labelColSpec: { span: 3 },
      labelColSpecLong: { span: 5 },
      wrapperCol: { span: 17 },
      wrapperColSpec: { span: 21 },
      wrapperColSpecLong: { span: 19 },
      iFrom: {
        jyjlList: [], //教育记录
        tzczzList: [], //特种操作证
        sgryqdList: [], //施工人员清单
        aqsgfaorjhagzwhfxList: [], //安全施工方案orJHA工作危害分析
        hjaqgzsList: [], //环境安全告知书
      },
      iRules: {
        applyDepartCode: [{ required: true, message: "起草人部门不能为空", trigger: "change" },],
        applyUserCode: [{ required: true, message: "责任担当不能为空", trigger: "change" },],
        applyContact: [{ required: true, message: "担当联系方式不能为空", trigger: "blur" },],
        areaDepartCode: [{ required: true, message: "作业区域部门不能为空", trigger: "change" },],
        areaLocation: [{ required: true, message: "作业区域具体位置不能为空", trigger: "blur" },],
        operateBrief: [{ required: true, message: "作业内容简述不能为空", trigger: "blur" },],
        operateType: [{ required: true, message: "作业类别不能为空", trigger: "change" },],
        operateLevel: [{ required: true, message: "作业级别不能为空", trigger: "change" },],
        
        sgrlx: [{ required: true, message: "作业日类型不能为空", trigger: "change" },],
        ssfwyjsgfty: [{ required: true, message: "是否夜间施工不能为空", trigger: "change" },],
        dayDate: [{ required: true, message: "作业日期不能为空", trigger: "change" },],
        dayTime: [{ required: true, message: "每日作业时间不能为空", trigger: "change" },],
        dangerGuardian: [{ required: true, message: "BOE现场监护人不能为空", trigger: "change" },],
        // isMust: [{ required: true, message: "作业形式不能为空", trigger: "change" },],
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
      // 作业级别
      hazardLevelList: [],
      checkedTreeNode: [],
    }
  },
  methods: {
    // 页面初始化
    initPage() {
      let iFrom = cloneDeep(this.iFromDefault)
      iFrom.jyjlList = (iFrom.jyjlList || []).map(item => {
        return {
          url: item.url,
          name: item.EducationalRecord
        }
      })
      iFrom.tzczzList = (iFrom.tzczzList || []).map(item => {
        return {
          url: item.url,
          name: item.SpecialOperationCertificate
        }
      })
      iFrom.sgryqdList = (iFrom.sgryqdList || []).map(item => {
        return {
          url: item.url,
          name: item.ListOfConstructors
        }
      })
      iFrom.aqsgfaorjhagzwhfxList = (iFrom.aqsgfaorjhagzwhfxList || []).map(item => {
        return {
          url: item.url,
          name: item.SafetyConstructionSchemeORJHAworkHazardAnalysis
        }
      })
      iFrom.hjaqgzsList = (iFrom.hjaqgzsList || []).map(item => {
        return {
          url: item.url,
          name: item.EnvironmentalsafetyNotice
        }
      })
      iFrom.jyjlList = this.addGuid(this.iFromDefault.jyjlList)
      iFrom.tzczzList = this.addGuid(this.iFromDefault.tzczzList)
      iFrom.sgryqdList = this.addGuid(this.iFromDefault.sgryqdList)
      iFrom.aqsgfaorjhagzwhfxList = this.addGuid(this.iFromDefault.aqsgfaorjhagzwhfxList)
      iFrom.hjaqgzsList = this.addGuid(this.iFromDefault.hjaqgzsList)

      iFrom.jyjlList = this.handleFileIdS(this.iFromDefault.jyjlList)
      iFrom.tzczzList = this.handleFileIdS(this.iFromDefault.tzczzList)
      iFrom.sgryqdList = this.handleFileIdS(this.iFromDefault.sgryqdList)
      iFrom.aqsgfaorjhagzwhfxList = this.handleFileIdS(this.iFromDefault.aqsgfaorjhagzwhfxList)
      iFrom.hjaqgzsList = this.handleFileIdS(this.iFromDefault.hjaqgzsList)

      iFrom.jyjlList = this.handleFileRedisplayOne(this.iFromDefault.jyjlList)
      iFrom.tzczzList = this.handleFileRedisplayTwo(this.iFromDefault.tzczzList)
      iFrom.sgryqdList = this.handleFileRedisplayThree(this.iFromDefault.sgryqdList)
      iFrom.aqsgfaorjhagzwhfxList = this.handleFileRedisplayFour(this.iFromDefault.aqsgfaorjhagzwhfxList)
      iFrom.hjaqgzsList = this.handleFileRedisplayFive(this.iFromDefault.hjaqgzsList)
      iFrom.dangerGuardian = this.addGuid(iFrom.dangerGuardian)
      iFrom.dangerSpecialPerson = this.addGuid(iFrom.dangerSpecialPerson)
      this.operateTypeChange(iFrom.operateType, false)
      // 部门回显
      this.$refs.corporationId.corporationChange(iFrom.corporationId, iFrom.deptId)
      this.iFrom = iFrom
      this.checkedTreeNode = iFrom.applyUserCode ? [iFrom.applyUserCode] : [];
      // console.log(this.iFrom);
      return Promise.resolve()
    },
    // 各部门改变
    departOrPerpleChange(lab, attrName) {
      this.$set(this.iFrom, attrName, lab[0])
    },
    // 作业类别改变
    operateTypeChange(val, rm = true) {
      // if (val == 'fire_work') {
      //   this.hazardLevelList = dictionary('dangerhazardHLevel')
      //   this.iRules.operateLevel[0].required = true
      // } else if (val == 'high_work') {
      //   this.hazardLevelList = dictionary('dangerhazardGLevel')
      //   this.iRules.operateLevel[0].required = true
      // } else {
      //   this.hazardLevelList = []
      //   this.iRules.operateLevel[0].required = false
      // }
      rm && this.$set(this.iFrom, 'operateLevel', undefined)
    },
    handleFileSuccessOne(file) {
      this.iFrom.jyjlList = file.map(item => {
        return {
          id: item.guid,
          url: item.url,
          name: item.EducationalRecord
        }
      }) || []
    },
    handleFileSuccessTwo(file) {
      this.iFrom.tzczzList = file.map(item => {
        return {
          id: item.guid,
          url: item.url,
          name: item.SpecialOperationCertificate
        }
      }) || []
    },
    handleFileSuccessThree(file) {
      this.iFrom.sgryqdList = file.map(item => {
        return {
          id: item.guid,
          url: item.url,
          name: item.ListOfConstructors
        }
      }) || []
    },
    handleFileSuccessFour(file) {
      this.iFrom.aqsgfaorjhagzwhfxList = file.map(item => {
        return {
          id: item.guid,
          url: item.url,
          name: item.SafetyConstructionSchemeORJHAworkHazardAnalysis
        }
      }) || []
    },
    handleFileSuccessFive(file) {
      this.iFrom.hjaqgzsList = file.map(item => {
        return {
          id: item.guid,
          url: item.url,
          name: item.EnvironmentalsafetyNotice
        }
      }) || []
    },
    // 处理文件id
    handleFileIdS(list) {
      list = list ? list : []
      let ids = list.map(item => {
        return item.guid
      })
      ids = ids ? ids : []
      return ids
    },
    // 处理文件回显
    handleFileRedisplayOne(list) {
      let fileList = list ? list : []
      fileList.forEach(item => {
        item.name = item.EducationalRecord
        item.status = 'done'
        item.uid = item.guid
      })
      return fileList
    },
    handleFileRedisplayTwo(list) {
      let fileList = list ? list : []
      fileList.forEach(item => {
        item.name = item.SpecialOperationCertificate
        item.status = 'done'
        item.uid = item.guid
      })
      return fileList
    },
    handleFileRedisplayThree(list) {
      let fileList = list ? list : []
      fileList.forEach(item => {
        item.name = item.ListOfConstructors
        item.status = 'done'
        item.uid = item.guid
      })
      return fileList
    },
    handleFileRedisplayFour(list) {
      let fileList = list ? list : []
      fileList.forEach(item => {
        item.name = item.SafetyConstructionSchemeORJHAworkHazardAnalysis
        item.status = 'done'
        item.uid = item.guid
      })
      return fileList
    },
    handleFileRedisplayFive(list) {
      let fileList = list ? list : []
      fileList.forEach(item => {
        item.name = item.EnvironmentalsafetyNotice
        item.status = 'done'
        item.uid = item.guid
      })
      return fileList
    },

    // 列表添加guid
    addGuid(list) {
      (list || []).forEach(item => {
        item.guid = this.guid()
      })
      return list
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
</style>