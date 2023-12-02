<template>
  <HasFixedBottomWrapper>
    <PageTitle>{{addEdit == "add"?'新增':'编辑'}}人员台账</PageTitle>
    <div class="form-content">
      <a-form-model ref="healthForm" :model="healthForm" :rules="healthRules" :colon="false">
        <div class="m-t-20 border-b-e7">
          <PageTitle>基本信息</PageTitle>
        </div>
        <a-row class="m-t-20">
          <a-col :span="12">
            <a-form-model-item class="work-num" label="工号" prop="workNum" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-row>
                <a-col class="work-col">
                  <a-form-model-item label="" prop="workNum">
                    <a-input v-model.trim="healthForm.workNum" placeholder="请输入工号查询员工信息" allowClear :disabled="disabled"/>
                  </a-form-model-item>
                  <a-button type="primary" class="m-l-15" @click="jobNumSearch(healthForm.workNum)">查询</a-button>
                </a-col>
              </a-row>
            </a-form-model-item>
            <a-form-model-item label="姓名" prop="name" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="healthForm.name" placeholder="请根据工号查询选择" allowClear disabled/>
            </a-form-model-item>
            <a-form-model-item label="性别" prop="sex" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="healthForm.sex" placeholder="请选择性别" allowClear>
                <a-select-option v-for="item in gender" :value="item.key" :key="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="籍贯" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-cascader v-model="healthForm.nativePlace" :options="cityOptions" style="width: 100%" placeholder="请选择籍贯" @change="handleCityChange">
                <template #displayRender="{ labels, selectedOptions }">
                  <span v-for="(label, index) in labels" :key="selectedOptions[index].code">
                    <span v-if="index === labels.length - 1">
                      {{ label }} (
                      <a @click="e => handleAreaClick(e, label, selectedOptions[index])">
                        {{ selectedOptions[index].code }}
                      </a>
                      )
                    </span>
                    <span v-else>{{ label }} /</span>
                  </span>
                </template>
              </a-cascader>
            </a-form-model-item>
            <a-form-model-item label="文化程度" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="healthForm.degreeEducation" placeholder="请选择文化程度" allowClear>
                <a-select-option v-for="item in education" :value="item.key" :key="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="从业年数" prop="yearsEmployment" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="healthForm.yearsEmployment" placeholder="请输入从业年数"/>
            </a-form-model-item>
            <a-form-model-item label="上传照片" :label-col="labelCol" :wrapper-col="wrapperCol">
              <upload-can-remove ref="editModel" :maxSize="5" :limit="1" :headImgs="headImgs" :handleSuccessName="'addFormUploadSuccess'" @addFormUploadSuccess="addFormUploadSuccess"></upload-can-remove>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="手机号" prop="phone" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="healthForm.phone" placeholder="请输入手机号" :disabled="disabled"/>
            </a-form-model-item>
            <a-form-model-item label="身份证" prop="certificateNum" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="healthForm.certificateNum" placeholder="请输入身份证号码" :disabled="disabled"/>
            </a-form-model-item>
            <a-form-model-item label="出生日期" prop="birthTime" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker v-model.trim="healthForm.birthTime" placeholder="请选择出生日期" :disabled='birthDisabled'/>
            </a-form-model-item>
            <a-form-model-item label="年龄" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="healthForm.age" placeholder="根据出生日期带出" disabled/>
            </a-form-model-item>
            <a-form-model-item label="入司时间" prop="joyCompanyTime" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker v-model.trim="healthForm.joyCompanyTime" placeholder="请选择入司时间"/>
            </a-form-model-item>
            <a-form-model-item label="婚姻状况" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="healthForm.maritalStatus" placeholder="请选择婚姻状况" allowClear>
                <a-select-option v-for="item in maritalStatus" :value="item.key" :key="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="嗜好" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-textarea
                v-model.trim="healthForm.hobby"
                placeholder="请输入嗜好，如抽烟、喝酒等"
                :auto-size="{ minRows: 2, maxRows: 6 }"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <div class="m-t-20 border-b-e7">
          <PageTitle>上岗岗位信息</PageTitle>
        </div>
        <a-row class="m-t-20">
          <a-col :span="12">
            <CommonSearchItem ref="commonSearchItem" :rules="healthRules" :CommonFormInline="healthForm" :notTablePage="true" :hasDepartment="true" :label-col="labelCol" :wrapper-col="wrapperCol" :disabled="personalHealth" deptLabel="所属部门" @departmentChange="departmentChange" @corporationChange="corporationChange"></CommonSearchItem>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="岗位" prop="post" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="healthForm.post" placeholder="请选择岗位" show-search :filter-option="filterOption" allowClear @change="postChange" :disabled="personalHealth">
                <a-select-option v-for="item in hazardous_post" :value="item.value" :key="item.value">{{item.label}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="危害因素" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="healthForm.hazardFactors" placeholder="根据岗位带出" disabled/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <div class="m-t-20 border-b-e7">
          <PageTitle>职业史及职业病危害接触史
            <a-button class="plus-line" type="dashed" @click="occupationalHistoryAdd"><a-icon type="plus" />新增</a-button>
          </PageTitle>
        </div>
        <a-row class="m-t-20">
          <a-col :span="24">
            <a-form-model-item label=" " :label-col="labelTable" :wrapper-col="wrapperTable">
              <CommonTable :noPaging="true">
                <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="exposureList" :rowKey="(record, index)=>{return index}" :pagination="false">
                  <div slot="time" slot-scope="record">
                    {{record.startTime? (Array.isArray(record.startTime) ?record.startTime.join('-'):record.startTime):'--'}} 至 {{record.startTime? (Array.isArray(record.endTime) ?record.endTime.join('-'):record.endTime):'--'}}
                  </div>
                  <div slot="action" slot-scope="text,record,index">
                    <span class="color-0067cc cursor-pointer m-r-15" @click="occupationalHistoryEdit(record,index)">编辑</span>
                    <span class="color-ff4d4f cursor-pointer" @click="occupationalHistoryDelete(record,index)">删除</span>
                  </div>
                </a-table>
              </CommonTable>
            </a-form-model-item>
          </a-col>
        </a-row>
        <div class="m-t-20 border-b-e7">
          <PageTitle>既往病史
            <a-button class="plus-line" type="dashed" @click="anamnesisAdd"><a-icon type="plus" />新增</a-button>
          </PageTitle>
        </div>
        <a-row class="m-t-20">
          <a-col :span="24">
            <a-form-model-item label=" " :label-col="labelTable" :wrapper-col="wrapperTable">
              <CommonTable :noPaging="true">
                <a-table :columns="anamnesisColumns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="medicalList" :rowKey="(record, index)=>{return index}" :pagination="false">
                  <div slot="action" slot-scope="text,record,index">
                    <span class="color-0067cc cursor-pointer m-r-15" @click="anamnesisEdit(record,index)">编辑</span>
                    <span class="color-ff4d4f cursor-pointer" @click="anamnesisDelete(record,index)">删除</span>
                  </div>
                </a-table>
              </CommonTable>
            </a-form-model-item>
          </a-col>
        </a-row>
        <div class="m-t-20 border-b-e7">
          <PageTitle>职业病诊断
            <a-button class="plus-line" type="dashed" @click="occupationalDiseaseAdd"><a-icon type="plus" />新增</a-button>
          </PageTitle>
        </div>
        <a-row class="m-t-20">
          <a-col :span="24">
            <a-form-model-item label=" " :label-col="labelTable" :wrapper-col="wrapperTable">
              <CommonTable :noPaging="true">
                <a-table :columns="occupationalDiseaseColumns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="diagnosisList" :rowKey="(record, index)=>{return index}" :pagination="false">
                  <div slot="action" slot-scope="text,record,index">
                    <span class="color-0067cc cursor-pointer m-r-15" @click="actionEdit(record,index)">编辑</span>
                    <span class="color-ff4d4f cursor-pointer" @click="actionDelete(record,index)">删除</span>
                  </div>
                </a-table>
              </CommonTable>
            </a-form-model-item>
          </a-col>
        </a-row>

        <div class="m-t-20 border-b-e7">
          <PageTitle>入职前工作经历
            <a-button class="plus-line" type="dashed" @click="beforeWorkExp"><a-icon type="plus" />新增</a-button>
          </PageTitle>
        </div>
        <a-row class="m-t-20">
          <a-col :span="24">
            <a-form-model-item label=" " :label-col="labelTable" :wrapper-col="wrapperTable">
              <CommonTable :noPaging="true">
                <a-table :columns="beforeWorkExpColumns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="beforeWorkExpList" :rowKey="(record, index)=>{return index}" :pagination="false">
                  <div slot="action" slot-scope="text,record,index">
                    <span class="color-0067cc cursor-pointer m-r-15" @click="beforeWorkExpEdit(record,index)">编辑</span>
                    <span class="color-ff4d4f cursor-pointer" @click="beforeWorkExpDelete(record,index)">删除</span>
                  </div>
                </a-table>
              </CommonTable>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <!-- 职业史及职业病危害接触史弹框 -->
    <CommonModal :title="occupationalHistoryTitle+'职业史及职业病危害接触史'" :visible="occupationalHistoryVisible" :cancelFn="occupationalHistoryCancel">
      <template slot="form">
        <a-form-model
          ref="occupationalHistoryForm"
          :model="occupationalHistoryForm"
          :rules="occupationalHistoryFormRules"
          :label-col="{ style: { width: '80px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 80px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="起止时间" prop="time">
            <a-range-picker
            v-model.trim="occupationalHistoryForm.time"
            :disabled-date="disabledDate"
            :placeholder="['开始日期', '结束日期']"
            />
          </a-form-model-item>
          <a-form-model-item class="flex" label="工作单位" prop="departmentName">
            <a-input v-model.trim="occupationalHistoryForm.departmentName" placeholder="请输入工作单位"/>
            <!-- <OrganizeLazyTree v-model="occupationalHistoryForm.departmentId" ref="organizeLazyTree" @deptFormValidator="deptFormValidator" @change="organizeChange"/> -->
          </a-form-model-item>
          <a-form-model-item class="flex" label="岗位" prop="postName">
            <!-- <a-select v-model="occupationalHistoryForm.post" placeholder="请选择岗位" show-search :filter-option="filterOption" allowClear @change="hazardousChange">
              <a-select-option v-for="item in hazardousPost" :value="item.value" :key="item.value">{{item.label}}</a-select-option>
            </a-select> -->
            <a-input v-model.trim="occupationalHistoryForm.postName" placeholder="请输入岗位"/>
          </a-form-model-item>
          <a-form-model-item class="flex" label="危害因素" prop="hazardFactors">
            <a-input v-model.trim="occupationalHistoryForm.hazardFactors" placeholder="请输入危害因素"/>
            <!-- <a-select v-model="occupationalHistoryForm.hazardFactors" placeholder="请选择危害因素" show-search :filter-option="filterOption" allowClear>
              <a-select-option v-for="item in hazard_factors" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
            </a-select> -->
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="occupationalHistoryCancel">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="occupationalHistoryConfirm">确定</a-button>
      </template>
    </CommonModal>

    <!-- 既往病史弹框 -->
    <CommonModal :title="anamnesisTitle+'既往病史'" :visible="anamnesisVisible" :cancelFn="anamnesisCancel">
      <template slot="form">
        <a-form-model
          ref="anamnesisForm"
          :model="anamnesisForm"
          :rules="anamnesisRules"
          :label-col="{ style: { width: '80px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 80px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="既往病史" prop="pastMedical">
            <a-input v-model.trim="anamnesisForm.pastMedical" placeholder="请输入既往病史名称"/>
          </a-form-model-item>
          <a-form-model-item class="flex" label="诊断医院" prop="diagnosticHospital">
            <a-input v-model.trim="anamnesisForm.diagnosticHospital" placeholder="请输入诊断医院"/>
          </a-form-model-item>
          <a-form-model-item class="flex" label="诊断日期" prop="diagnosisTime">
            <a-date-picker v-model="anamnesisForm.diagnosisTime" placeholder="请选择诊断日期"/>
          </a-form-model-item>
          <a-form-model-item class="flex" label="治疗结果" prop="diagnosisResults">
            <a-select v-model="anamnesisForm.diagnosisResults" placeholder="请选择治疗结果" show-search :filter-option="filterOption" allowClear>
              <a-select-option v-for="item in outcome" :value="item.key" :key="item.key">{{item.value}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="备注">
            <a-input v-model.trim="anamnesisForm.remarks" placeholder="请输入备注"/>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="anamnesisCancel">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="anamnesisConfirm">确定</a-button>
      </template>
    </CommonModal>

    <!-- 职业病弹框 -->
    <CommonModal :title="occupationalDiseaseTitle+'职业病诊断'" :visible="occupationalDiseaseVisible" :cancelFn="occupationalDiseaseCancel">
      <template slot="form">
        <a-form-model
          ref="occupationalDiseaseForm"
          :model="occupationalDiseaseForm"
          :rules="occupationalDiseaseRules"
          :label-col="{ style: { width: '90px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 90px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="职业病名称" prop="occupationalDiseases">
            <a-input v-model.trim="occupationalDiseaseForm.occupationalDiseases" placeholder="请输入职业病名称"/>
          </a-form-model-item>
          <a-form-model-item class="flex" label="诊断医院" prop="diagnosticHospital">
            <a-input v-model.trim="occupationalDiseaseForm.diagnosticHospital" placeholder="请输入诊断医院"/>
          </a-form-model-item>
          <a-form-model-item class="flex" label="诊断级别" prop="diagnosisLevel">
            <a-input v-model.trim="occupationalDiseaseForm.diagnosisLevel" placeholder="请输入诊断级别"/>
          </a-form-model-item>
          <a-form-model-item class="flex" label="诊断日期" prop="diagnosisTime">
            <a-date-picker v-model="occupationalDiseaseForm.diagnosisTime" placeholder="请选择诊断日期"/>
          </a-form-model-item>
          <a-form-model-item class="flex" label="备注">
            <a-input v-model.trim="occupationalDiseaseForm.remarks" placeholder="请输入备注"/>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="occupationalDiseaseCancel">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="occupationalDiseaseConfirm">确定</a-button>
      </template>
    </CommonModal>

    <!-- 前工作经历弹框 -->
    <CommonModal :title="'前工作经历'" :visible="beforeWorkExpVisible" :cancelFn="beforeWorkExpCancel">
      <template slot="form">
        <a-form-model
          ref="beforeWorkExpForm"
          :model="beforeWorkExpForm"
          :rules="beforeWorkExpRules"
          :label-col="{ style: { width: '90px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 90px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="起止时间" prop="time">
            <!-- <a-range-picker v-model="formInline.dateTime" valueFormat="YYYY-MM-DD" class="search-range-picker" format="YYYY-MM-DD" style="width: 200px" :placeholder="['开始日期','结束日期']" /> -->
            <a-range-picker
            v-model.trim="beforeWorkExpForm.workTime"
            :disabled-date="disabledDate"
            valueFormat="YYYY-MM-DD" 
            class="search-range-picker" 
            format="YYYY-MM-DD"
            :placeholder="['开始日期', '结束日期']"
            />
          </a-form-model-item>
          <a-form-model-item class="flex" label="原工作单位" prop="formerCompany">
            <a-input v-model.trim="beforeWorkExpForm.formerCompany" placeholder="请输入原工作单位"/>
          </a-form-model-item>
          <a-form-model-item class="flex" label="任职部门" prop="formerDepartment">
            <a-input v-model.trim="beforeWorkExpForm.formerDepartment" placeholder="请输入任职部门"/>
          </a-form-model-item>
          <a-form-model-item class="flex" label="离职前岗位" prop="formerJob">
            <a-input v-model.trim="beforeWorkExpForm.formerJob" placeholder="请输入离职前岗位"/>
          </a-form-model-item>
          <a-form-model-item class="flex" label="主要职责" prop="duty">
            <a-input v-model.trim="beforeWorkExpForm.duty" placeholder="请输入主要职责"/>
          </a-form-model-item>
          <a-form-model-item class="flex" label="离职原因" prop="reason">
            <a-input v-model.trim="beforeWorkExpForm.reason" placeholder="请输入离职原因"/>
          </a-form-model-item>
          <a-form-model-item class="flex" label="备注" prop="remarks">
            <a-input v-model.trim="beforeWorkExpForm.remarks" placeholder="请输入备注"/>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="beforeWorkExpCancel">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="beforeWorkExpConfirm">确定</a-button>
      </template>
    </CommonModal>
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="goBack">取消</a-button>
          <a-button type="primary" class="m-r-15" :loading="loading" @click="saveConfirm">提交</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import {
  // selectByNameOrWokerNum,
  getCityOptions,
  healthUserSave,
  healthUserDetail,
  healthUserUpdate,
  getPortraitUrlt,
  selectDiagnosis,
  selectPreWork,
  selectMedical,
  selectExposure,
  stationAll,
  harmFactor,
  getUserByJobNumber,
} from "@/services/api.js";
import moment from "moment";
import { formValidator } from "@/utils/clx-form-validator.js";
import UploadCanRemove from "@/components/upload/uploadCanRemove.vue";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { nanoid } from "nanoid";
import dictionary from '@/utils/dictionary';
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
import dayJs from 'dayjs';

export default {
  mixins: [teableCenterEllipsis],
  components: {
    FixedBottom,
    UploadCanRemove,
    OrganizeLazyTree
  },
  data() {
    return {
      addEdit: "add", //add 新建，edit编辑
      personalHealth: false,
      workNum: '',
      fullPath: '',
      loading: false,
      disabled: false,
      occupationalHistoryTitle: "新增",
      occupationalHistoryVisible: false,
      anamnesisTitle: '新增',
      anamnesisVisible: false, //既往病史
      occupationalDiseaseTitle: '新增', //职业病
      occupationalDiseaseVisible: false, //职业病
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
      labelTable: { span: 1 },
      wrapperTable: { span: 22 },
      occupationalIndex: null,
      anamnesisIndex: null,
      diseaseIndex: null,
      beforeWorkExpIndex: null,
      headImgs: [],
      cityOptions: [],
      hazardousPost:[],
      // hazardousPostDict: {},
      hazardFactorsDict: {},
      hazardous_post:[],
      healthForm: {
        certificateNum: "",
        sex: undefined,
        age: null,
        nativePlace:undefined,
        birthTime: null,
      },
      birthDisabled: false,
      healthRules: {
        name: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        sex: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        workNum: [
          { required: true, validator: this.workNumValidator, trigger: ['blur', 'change'] },
        ],
        siteCode: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        post: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        departmentId: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        joyCompanyTime: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        birthTime: [
          { required: true, validator: this.birthTimeValidator, trigger: ['blur', 'change'] },
        ],
        // joyCompanyTime: [
        //   { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        // ],
        maritalStatus: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        hobby: [
          { required: this.addEdit=='add' ? false : true, validator: this.hobbyValidator, trigger: 'blur'},
        ],
        photo: [
          { required: true, validator: this.photoValidator, trigger: 'blur'},
        ],
        certificateNum: [
          { required: true, validator: this.texTidCard, trigger: 'blur'},
        ],
        phone: [
          { required: true,  message:"不能为空", trigger: ['blur', 'change'] },
        ],
        yearsEmployment: [
          { required: true, validator: this.durationValidator, trigger: ['blur', 'change']},
        ],
      },
      occupationalHistoryForm: {

      },
      anamnesisForm: {

      },
      occupationalDiseaseForm: {

      },
      outComeDict: {},
      treeData: [],
      exposureList:[],
      medicalList:[],
      diagnosisList:[],
      beforeWorkExpForm: {},
      beforeWorkExpList:[],
      beforeWorkExpVisible: false,
      beforeWorkExpTitle: '新增',
      beforeWorkExpRules: {
        workTime: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        formerCompany: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        formerDepartment: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        formerJob: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        duty: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        reason: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        remarks: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ]
      },
      postDict: {},
      hazardousPostDict: {},
      columns:[
        {
          title: "序号",
          width: 100,
          customRender: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: "起止时间",
          key: "time",
          scopedSlots: { customRender: "time" },
        },
        {
          title: "部门",
          dataIndex: "departmentName",
          key: "departmentName",
        },
        {
          title: "岗位",
          dataIndex: "postName",
          key: "postName",
          // customRender: (text, record, index) => {
          //   return this.hazardousPostDict[text] ? this.hazardousPostDict[text] : "--";
          // },
        },
        {
          title: "接触职业病危害因素",
          dataIndex: "hazardFactors",
          key: "hazardFactors",
          width: 300
          // customRender: (text, record, index) => {
          //   return this.hazardFactorsDict[text] ? this.hazardFactorsDict[text] : "--";
          // },
        },
        // {
        //   title: "防护措施",
        //   dataIndex: "protectiveMeasures",
        //   key: "protectiveMeasures",
        // },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right",
          width: 200
        }
      ],
      anamnesisColumns:[
        {
          title: "序号",
          width: 100,
          align:"center",
          customRender: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: "既往病史",
          dataIndex: "pastMedical",
          key: "pastMedical",
          align:'center',
        },
        {
          title: "诊断医院",
          dataIndex: "diagnosticHospital",
          key: "diagnosticHospital",
          align:'center',
        },
        {
          title: "诊断日期",
          dataIndex: "diagnosisTime",
          key: "diagnosisTime",
          align:'center',
        },
        {
          title: "治疗结果",
          dataIndex: "diagnosisResults",
          key: "diagnosisResults",
          customRender: (text, record, index) => {
            return this.outComeDict[text] ? this.outComeDict[text] : "--";
          },
          align:'center',
        },
        {
          title: "备注",
          dataIndex: "remarks",
          key: "remarks",
          align:'center',
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right",
          align:'center',
          width: 200
        }
      ],
      occupationalDiseaseColumns:[
        {
          title: "序号",
          width: 100,
          align:"center",
          customRender: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: "职业病名称",
          dataIndex: "occupationalDiseases",
          key: "occupationalDiseases",
          align:'center',
        },
        {
          title: "诊断医院",
          dataIndex: "diagnosticHospital",
          key: "diagnosticHospital",
          align:'center',
        },
        {
          title: "诊断级别",
          dataIndex: "diagnosisLevel",
          key: "diagnosisLevel",
          align:'center',
        },
        {
          title: "诊断日期",
          dataIndex: "diagnosisTime",
          key: "diagnosisTime",
          align:'center',
        },
        {
          title: "备注",
          dataIndex: "remarks",
          key: "remarks",
          align:'center',
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right",
          align:'center',
          width: 200
        }
      ],
      beforeWorkExpColumns:[
        {
          title: "序号",
          width: 100,
          align:"center",
          customRender: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: "开始日期",
          dataIndex: "workStartTime",
          key: "workStartTime",
          align:'center',
        },
        {
          title: "结束日期",
          dataIndex: "workEndTime",
          key: "workEndTime",
          align:'center',
        },
        {
          title: "原工作单位",
          dataIndex: "formerCompany",
          key: "formerCompany",
          align:'center',
        },
        {
          title: "任职部门",
          dataIndex: "formerDepartment",
          key: "formerDepartment",
          align:'center',
        },
        {
          title: "离职前岗位",
          dataIndex: "formerJob",
          key: "formerJob",
          align:'center',
        },
        {
          title: "主要职责",
          dataIndex: "duty",
          key: "duty",
          align:'center',
        },
        {
          title: "离职原因",
          dataIndex: "reason",
          key: "reason",
          align:'center',
        },
        {
          title: "备注",
          dataIndex: "remarks",
          key: "remarks",
          align:'center',
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right",
          align:'center',
          width: 200
        }
      ],
      corporationDeptId: ""
    }
  },
  computed: {
    occupationalHistoryFormRules() {
      let occupationalHistoryFormRules = {
        time: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        departmentName: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        postName: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        hazardFactors: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        // protectiveMeasures: [
        //   { required: true, message:"不能为空", trigger: 'blur'},
        // ],
      }
      return occupationalHistoryFormRules
    },
    anamnesisRules() {
      let anamnesisRules = {
        pastMedical: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        diagnosticHospital: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        diagnosisTime: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
        diagnosisResults: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
      }
      return anamnesisRules
    },
    occupationalDiseaseRules() {
      let occupationalDiseaseRules = {
        occupationalDiseases: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        diagnosticHospital: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        diagnosisLevel: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        diagnosisTime: [
        { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
      }
      return occupationalDiseaseRules
    },
    hazard_factors() { //从字典组里获取危害因素数据
      const dict = this.$store.state.setting.dictTypeData;
      const hazard = dict.find(item => {
        return item.dictType == 'hazard_factors';
      });
      hazard.dictItem.forEach(ele => {
        this.$set(this.hazardFactorsDict, ele.dictValue, ele.dictLabel)
      });
      return hazard.dictItem;
    },
    corporationList() {
      return this.$store.state.setting.corporationList;
    },
    gender() {
      const gender = dictionary('sex');
      return gender
    },
    education() {
      const education = dictionary('education');
      return education
    },
    maritalStatus() {
      const marriage = dictionary('marriage');
      return marriage
    },
    outcome() {
      const outcome = dictionary('outcome');
      outcome.forEach(ele => {
        this.$set(this.outComeDict, ele.key, ele.value)
      });
      return outcome
    }
  },
  watch: {
    "healthForm.certificateNum":{
      handler(value) {
        this.getBirth(value)
      },
      immediate: true
    },
    "healthForm.birthTime":{
      handler(value) {
        if(value) {
          this.getAge(value)
        } else {
          this.healthForm.age = "";
        }
      },
      immediate: true,
      deep: true
    },
    // "healthForm.deptId":{
    //   handler(value) {
    //     console.log(value);
    //     if(value) {
    //       stationAll({deptId:value}).then(res=>{
    //         this.hazardous_post = res.data;
    //         this.hazardous_post.forEach(item=>{
    //           this.$set(this.postDict, item.value, item.label);
    //         })
    //         // this.$set(this.healthForm,'post',undefined);
    //         this.$set(this.healthForm,'hazardFactors', "");
    //       }).catch(err=>{
    //         console.log(err);
    //       })
    //     } else {
    //       // this.$set(this.healthForm,'post',undefined);
    //       this.$set(this.healthForm,'hazardFactors', "");
    //       this.hazardous_post = [];
    //       this.postDict = {};
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // },
    // "occupationalHistoryForm.deptId":{
    //   handler(value) {
    //     console.log("oooooccc",value);
    //     if(value) {
    //       stationAll({deptId:value}).then(res=>{
    //         this.hazardousPost = res.data;
    //         this.hazardousPost.forEach(item=>{
    //           this.$set(this.hazardousPostDict, item.value, item.label);
    //         })
    //         this.$set(this.occupationalHistoryForm,'post',undefined)
    //         this.$set(this.occupationalHistoryForm,'hazardFactors', "")
    //       }).catch(err=>{
    //         console.log(err);
    //       })
    //     } else {
    //       this.$set(this.occupationalHistoryForm,'post',undefined);
    //       this.$set(this.occupationalHistoryForm,'hazardFactors', "");
    //       this.hazardousPost = [];
    //       this.hazardousPostDict = {};
    //     }
    //   },
    //   immediate: true,
    //   deep: true
    // },
  },
  beforeRouteEnter(to, from, next) {
    const id = to.query.id;
    const fullPath = from.fullPath;
    if (id) {
      next(vm => {
        vm.setRouterCode("healthStandingBook");
        vm.fullPath = fullPath;
        vm.gethealthDetail(id);
        vm.getDiagnosis(id);
        vm.getSelectPreWork(id);
        vm.getMedical(id);
        vm.getExposure(id);
      })
    } else {
      next(vm=>{
        vm.setRouterCode("healthStandingBook");
      })
    }
  },
  created() {
    this.getCityOptions();
    const personalHealth = sessionStorage.getItem('personalHealth');
    this.personalHealth = personalHealth=='1' ? true : false;
    
  },
  methods: {
    goBack(){
      this.setKeepalive(true)
      this.$router.go(-1)
    },
    //职业病危害接触史时间限制今天以及今天之前可选
    disabledDate(current) {
      return current > moment().endOf('day');
    },
    gethealthDetail(id) {
      this.addEdit = "edit";
      this.disabled = true;
      healthUserDetail({id}).then(res => {
        const data = res.data;
        this.healthForm = data;
        this.healthForm.nativePlace = this.healthForm.nativePlace ? this.healthForm.nativePlace.split(",") : null;
        this.healthForm.joyCompanyTime = data.joyCompanyTime ? moment(this.getBirth(data.joyCompanyTime)) : null;
        this.healthForm.birthTime = data.birthTime ? moment(data.birthTime) : null;
        console.log(this.healthForm.birthTime)
        console.log(this.healthForm.joyCompanyTime)
        if(data.photo) {
          this.getPortraitUrlt(data.photo);
        }
        if(this.healthForm.deptId) {
          stationAll({deptId: this.healthForm.deptId}).then(res=>{
            this.hazardous_post = res.data;
          }).catch(err=>{
            console.log(err);
          })
          this.$refs.commonSearchItem.corporationChange(this.healthForm.corporationId, this.healthForm.deptId).then(res => {
            this.healthRules = {...this.healthRules}
            this.healthForm = {...this.healthForm}
          })
        }
      }).catch(err => {
        console.log(err);
      })
    },
    corporationChange(val, deptId) {
      this.corporationDeptId = deptId;
    },
    // 部门改变时岗位清空且重新获取岗位下拉数据
    departmentChange(val, val1, val2) {
      console.log(val, val1, val2);
      this.getStationAll(val, true);
    },
    getStationAll(val, flag) {
      this.hazardous_post = [];
      this.postDict = {};
      stationAll({deptId:val}).then(res=>{
        this.hazardous_post = res.data;
        if (flag) {
          this.$set(this.healthForm,'post',undefined);
          this.$set(this.healthForm,'hazardFactors', "");
        }
        this.hazardous_post.forEach(item=>{
          this.$set(this.postDict, item.value, item.label);
        })
      }).catch(err=>{
        console.log(err);
      })
    },
    // 根据工号查询姓名和手机号
    jobNumSearch(workNum) {
      getUserByJobNumber({workNum}).then(res=>{
        const data = res.data;
        this.$set(this.healthForm,'name',data.name);
        this.$set(this.healthForm,'phone',data.phone);
        this.$set(this.healthForm,'id',data.userId);
        this.workNum = workNum;
      }).catch(err=>{
        this.$set(this.healthForm,'name','');
        this.$set(this.healthForm,'phone','');
        this.$set(this.healthForm,'id',null);
      })
    },
    getPortraitUrlt(id) {
      const fileList = [];
      getPortraitUrlt([id]).then(res => {
        const data = res.data[0];
        const photo = {
          id: data.id,
          name: data.fileName,
          status: "done",
          uid: "vc-upload-1663214627272-2",
          url: data.filePath,
        }
        fileList.push(photo);
        this.addFormUploadSuccess(fileList);
      }).catch(err => {
        console.log(err);
      })
    },
    // 职业病诊断表
    async getDiagnosis(id) {
      const params = {
        id,
        pageNo: 1,
        pageSize: 1000000,
      }
      const data = await selectDiagnosis(params);
      this.diagnosisList = data.data.list;
    },
    // 分页查询入职前工作经历
    async getSelectPreWork(id) {
      const params = {
        id,
        pageNo: 1,
        pageSize: 1000000,
      }
      const data = await selectPreWork(params);
      this.beforeWorkExpList = data.data.list;
    },
    // 关联既往病史列表
    async getMedical(id) {
      const params = {
        id,
        pageNo: 1,
        pageSize: 1000000,
      }
      const data = await selectMedical(params);
      this.medicalList = data.data.list;
    },
    // 分页查询关联职业史列表
    async getExposure(id) {
      const params = {
        id,
        pageNo: 1,
        pageSize: 1000000,
      }
      const data = await selectExposure(params);
      this.exposureList = data.data.list;
    },
    async getCityOptions() {
      const { code, data } = await getCityOptions();
      if (code === 20000) {
        this.cityOptions = data || []
      }
    },
    // 最后一个节点审批通过 + 归档
    handleCityChange(val, arr) {
      this.healthForm.nativePlace = val;
    },
    // departChange(key,value) {
    //   this.healthForm.departmentName = value[0];
    //   stationAll({deptId:key}).then(res=>{
    //     this.hazardous_post = res.data;
    //     this.hazardous_post.forEach(item=>{
    //       this.$set(this.postDict, item.value, item.label);
    //     })
    //     this.$set(this.healthForm,'post',undefined);
    //     this.$set(this.healthForm,'hazardFactors', "");
    //   }).catch(err=>{
    //     console.log(err);
    //   })
    // },
    postChange(val) {
      if(val) {
        harmFactor({dangerousStationId:val}).then(res=>{
          const data = res.data;
          if(data && data.length>=1) {
            this.healthForm.hazardFactors = data.join();
          } else {
            this.healthForm.hazardFactors = "";
          }
          this.$forceUpdate();
        }).catch(err=>{
          console.log(err);
        })
        this.healthForm.postName = this.postDict[val];
      } else {
        this.healthForm.postName = '';
        this.healthForm.hazardFactors = "";
      }
      
    },
    // organizeChange(key,value) {
    //   this.occupationalHistoryForm.departmentName = value[0];
    //   stationAll({deptId:key}).then(res=>{
    //     this.hazardousPost = res.data;
    //     this.hazardousPost.forEach(item=>{
    //       this.$set(this.hazardousPostDict, item.value, item.label);
    //     })
    //     this.$set(this.occupationalHistoryForm,'post',undefined)
    //     this.$set(this.occupationalHistoryForm,'hazardFactors', "")
    //   }).catch(err=>{
    //     console.log(err);
    //   })
    // },
    // hazardousChange(val) {
    //   if(val) {
    //     harmFactor({dangerousStationId:val}).then(res=>{
    //       const data = res.data;
    //       if(data && data.length>=1) {
    //         this.occupationalHistoryForm.hazardFactors = data.join();
    //       } else {
    //         this.occupationalHistoryForm.hazardFactors = ""
    //       }
    //       this.$forceUpdate();
    //     }).catch(err=>{
    //       console.log(err);
    //     })
    //     this.occupationalHistoryForm.postName = this.hazardousPostDict[val];
    //   } else {
    //     this.occupationalHistoryForm.postName = '';
    //     this.occupationalHistoryForm.hazardFactors = ""
    //   }
      
    // },
    filterTree(inputValue, treeNode) {
      return treeNode.data.props.deptName.includes(inputValue)
    },
    treeChange(value) {
      this.healthForm.organizationId = value;
    },
    // 上传照片
    async addFormUploadSuccess(fileList) {
      this.headImgs = fileList;
      this.healthForm.photo = fileList[0].id;
    },
    // 下拉框模糊搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    // 测试人员模糊筛选
    filterUserTree(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue)
    },
    // 职业史及职业病危害接触史新增
    occupationalHistoryAdd() {
      this.occupationalHistoryTitle = "新增";
      this.occupationalHistoryForm = {},
      this.occupationalHistoryVisible = true;
      this.$nextTick(res => {
        let corporationDeptId = this.corporationDeptId;
        if (!corporationDeptId) {
          corporationDeptId = this.getMappingValue(this.getCommonAddOrgnizeList, "id", this.healthForm.corporationId).deptId;
        }
        // this.$refs.organizeLazyTree.getOrganizeLazyTree(corporationDeptId, true);
      })      
    },
    // 编辑职业史及职业病危害接触史
    occupationalHistoryEdit(record,index) {
      console.log(record);
      this.occupationalIndex = index;
      this.occupationalHistoryTitle = "编辑";
      this.occupationalHistoryForm = {
        ...record,
        time: [moment(record.startTime),moment(record.endTime)]
      }
      this.occupationalHistoryVisible = true;
      if(record.departmentId) {
        stationAll({deptId: record.departmentId}).then(res=>{
          console.log(this.hazardousPost)
          this.hazardousPost = res.data;
          this.occupationalHistoryForm = { ...this.occupationalHistoryForm }
        }).catch(err=>{
          console.log(err);
        })
        this.$nextTick(()=>{
          let corporationDeptId = this.corporationDeptId;
          if (!corporationDeptId) {
            corporationDeptId = this.getMappingValue(this.getCommonAddOrgnizeList, "id", this.healthForm.corporationId).deptId;
          }
          // this.$refs.organizeLazyTree.getOrganizeLazyTree(corporationDeptId, true).then(res => {
          //   this.$refs.organizeLazyTree.getOrganizeEmersionTree(record.departmentId, corporationDeptId);
          // })
        })
      }
    },
    // 删除职业史及职业病危害接触史
    occupationalHistoryDelete(record,index) {
      const _this = this;
      this.$antConfirm({
        title: '确定删除吗？',
        onOk() {
          _this.exposureList.splice(index, 1);
          // const exposureList = [..._this.exposureList];
          // _this.exposureList = exposureList.filter(item => item.id != record.id);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    // 职业史及职业病危害接触史弹框确认
    occupationalHistoryConfirm() {
      console.log("iiiii",this.occupationalHistoryForm);
      if (!formValidator.formAll(this, 'occupationalHistoryForm')) {
        return;
      }
      console.log("fffff",this.occupationalHistoryForm);
      if(this.occupationalHistoryTitle == "新增") {
        const data = {
          ...this.occupationalHistoryForm,
          healthId: nanoid(),
          startTime: this.occupationalHistoryForm.time[0].format("YYYY-MM-DD"),
          endTime: this.occupationalHistoryForm.time[1].format("YYYY-MM-DD"),
        }
        this.exposureList.push(data);
      } else {
        const data = {
          ...this.occupationalHistoryForm,
          startTime: this.occupationalHistoryForm.time[0].format("YYYY-MM-DD"),
          endTime: this.occupationalHistoryForm.time[1].format("YYYY-MM-DD"),
        }
        this.exposureList[this.occupationalIndex] = data;
        // forEach((ele, ind) => {
        //   this.exposureList[ind] = ele.id == this.occupationalHistoryForm.id ? data : ele;
        // })
      }
      this.occupationalHistoryVisible = false;
      this.occupationalHistoryForm = {};
    },
    // 职业史及职业病危害接触史弹框关闭
    occupationalHistoryCancel() {
      this.occupationalHistoryVisible = false;
    },

    // 既往病史新增
    anamnesisAdd() {
      this.anamnesisTitle = '新增';
      this.anamnesisForm = {};
      this.anamnesisVisible = true;
    },
    // 既往病史弹框取消
    anamnesisCancel() {
      this.anamnesisVisible = false;
    },
    // 既往病史编辑
    anamnesisEdit(record,index) {
      this.anamnesisTitle = '编辑';
      this.anamnesisIndex = index;
      this.anamnesisForm = {
        ...record,
        diagnosisTime: moment(record.diagnosisTime),
      }
      this.anamnesisVisible = true;

    },
    // 既往病史删除
    anamnesisDelete(record,index) {
      const _this = this;
      this.$antConfirm({
        title: '确定删除吗？',
        onOk() {
          _this.medicalList.splice(index, 1);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    // 既往病史弹框确认
    anamnesisConfirm() {
      if (!formValidator.formAll(this, 'anamnesisForm')) {
        return;
      }
      if(this.anamnesisTitle == '新增') {
        const data = {
          ...this.anamnesisForm,
          healthId: nanoid(),
          diagnosisTime: this.anamnesisForm.diagnosisTime.format("YYYY-MM-DD"),
        }
        this.medicalList.push(data);
      } else {
        const data = {
          ...this.anamnesisForm,
          diagnosisTime: this.anamnesisForm.diagnosisTime.format("YYYY-MM-DD"),
        }
        this.medicalList[this.anamnesisIndex] = data;
      }
      this.anamnesisVisible = false;
      this.anamnesisForm = {};
    },

    // 职业病新增
    occupationalDiseaseAdd() {
      this.occupationalDiseaseTitle = '新增';
      this.occupationalDiseaseForm = {};
      this.occupationalDiseaseVisible = true;
    },
    // 职业病关闭弹框
    occupationalDiseaseCancel() {
      this.occupationalDiseaseVisible = false;
    },
    // 职业病弹框确定
    occupationalDiseaseConfirm() {
      if (!formValidator.formAll(this, 'occupationalDiseaseForm')) {
        return;
      }
      if(this.occupationalDiseaseTitle == '新增') {
        const data = {
          ...this.occupationalDiseaseForm,
          healthId: nanoid(),
          diagnosisTime: this.occupationalDiseaseForm.diagnosisTime.format("YYYY-MM-DD"),
        }
        this.diagnosisList.push(data);
      } else {
        const data = {
          ...this.occupationalDiseaseForm,
          diagnosisTime: this.occupationalDiseaseForm.diagnosisTime.format("YYYY-MM-DD"),
        }
        this.diagnosisList[this.diseaseIndex] = data;
      }
      this.occupationalDiseaseVisible = false;
      this.occupationalDiseaseForm = {};
    },
    beforeWorkExp() {
      this.beforeWorkExpTitle = '新增';
      this.beforeWorkExpList = [];
      this.beforeWorkExpVisible = true;
    },
    beforeWorkExpCancel() {
      this.beforeWorkExpVisible = false;
    },
    beforeWorkExpConfirm() {
      if (!formValidator.formAll(this, 'beforeWorkExpForm')) {
        return;
      }
      if(this.beforeWorkExpTitle == '新增') {
        if (this.beforeWorkExpForm.workTime) {
          this.beforeWorkExpForm.workStartTime = this.beforeWorkExpForm.workTime[0] ? dayJs(this.beforeWorkExpForm.workTime[0]).format("YYYY-MM-DD") : "";
          this.beforeWorkExpForm.workEndTime = this.beforeWorkExpForm.workTime[1] ? dayJs(this.beforeWorkExpForm.workTime[1]).format("YYYY-MM-DD") : "";
        }
        const data = {
          ...this.beforeWorkExpForm,
          workStartTime: this.beforeWorkExpForm.workStartTime,
          workEndTime: this.beforeWorkExpForm.workEndTime
        }
        this.beforeWorkExpList.push(data);
      } else {
        if (this.beforeWorkExpForm.workTime) {
          this.beforeWorkExpForm.workStartTime = this.beforeWorkExpForm.workTime[0] ? dayJs(this.beforeWorkExpForm.workTime[0]).format("YYYY-MM-DD") : "";
          this.beforeWorkExpForm.workEndTime = this.beforeWorkExpForm.workTime[1] ? dayJs(this.beforeWorkExpForm.workTime[1]).format("YYYY-MM-DD") : "";
        }
        const data = {
          ...this.beforeWorkExpForm,
          workStartTime: this.beforeWorkExpForm.workStartTime,
          workEndTime: this.beforeWorkExpForm.workEndTime
        }
        this.beforeWorkExpList[this.beforeWorkExpIndex] = data;
      }
      this.beforeWorkExpVisible = false;
      this.beforeWorkExpForm = {};
    },
    // 职业病编辑
    actionEdit(record,index) {
      console.log(record);
      this.diseaseIndex = index;
      this.occupationalDiseaseTitle = '编辑';
      this.occupationalDiseaseForm = {
        ...record,
        diagnosisTime: moment(record.diagnosisTime),
      }
      this.occupationalDiseaseVisible = true;
    },
    // 职业病删除
    actionDelete(record,index) {
      const _this = this;
      this.$antConfirm({
        title: '确定删除吗？',
        onOk() {
          _this.diagnosisList.splice(index,1);
          // const diagnosisList = [..._this.diagnosisList];
          // _this.diagnosisList = diagnosisList.filter(item => item.id != record.id);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    beforeWorkExpEdit(record,index) {
      this.beforeWorkExpIndex = index;
      this.beforeWorkExpTitle = '编辑';
      this.beforeWorkExpForm = {
        ...record,
        workStartTime: record.workStartTime,
        workEndTime: record.workEndTime
      }
      this.beforeWorkExpVisible = true;
    },
    beforeWorkExpDelete(record,index) {
      const _this = this;
      this.$antConfirm({
        title: '确定删除吗？',
        onOk() {
          _this.beforeWorkExpList.splice(index,1);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    saveConfirm() {
      if (!formValidator.formAll(this, 'healthForm')) {
        return;
      }
      this.loading = true;
      if(this.addEdit == 'add') {
        const params = {
          ...this.healthForm,
          joyCompanyTime: this.healthForm.joyCompanyTime?this.healthForm.joyCompanyTime.format("YYYY-MM-DD"): null,
          birthTime: this.healthForm.birthTime?this.healthForm.birthTime.format("YYYY-MM-DD"):null,
          nativePlace: this.healthForm.nativePlace?this.healthForm.nativePlace.join():null,
          exposureList: this.exposureList,
          medicalList: this.medicalList,
          diagnosisList: this.diagnosisList,
          preWorkList: this.beforeWorkExpList,
        }
        healthUserSave(params).then(res=>{
          this.$antMessage.success(res.message);
          this.loading = false;
          this.$router.push("/occupationHealth/healthStandingBook");
        }).catch(err=>{
          console.log(err);
          this.loading = false;
        })
      } else {
        const params = {
          ...this.healthForm,
          joyCompanyTime: this.healthForm.joyCompanyTime?this.healthForm.joyCompanyTime.format("YYYY-MM-DD"): null,
          birthTime: this.healthForm.birthTime?this.healthForm.birthTime.format("YYYY-MM-DD"):null,
          nativePlace: this.healthForm.nativePlace?this.healthForm.nativePlace.join():null,
          exposureList: this.exposureList,
          medicalList: this.medicalList,
          diagnosisList: this.diagnosisList,
          preWorkList: this.beforeWorkExpList,
        }
        healthUserUpdate(params).then(res=>{
          this.$antMessage.success(res.message);
          this.loading = false;
          this.$router.push(this.fullPath);
        }).catch(err=>{
          console.log(err);
          this.loading = false;
        })
      }
    },
    // deptFormValidator(val) {
    //   formValidator.formItemValidate(this, 'departmentId', 'healthForm')
    // },
    // 文本框校验
    inputValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("不能为空")
      } else if (value && value.length > 20) {
        return Promise.reject("不能超过20字")
      } else {
        callback()
      }
    },
    // 工号校验
    workNumValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("不能为空")
      } else if (value && value.length > 20) {
        return Promise.reject("不能超过20字")
      } else if(this.workNum && value != this.workNum) {
        return Promise.reject("该工号跟查询结果不匹配，请重新查询")
      } else {
        callback()
      }
    },
    // 文本框校验50
    hobbyValidator(rule, value, callback) {
      if (!value && this.addEdit =='edit') {
        return Promise.reject("不能为空")
      } else if (value && value.length > 50 && this.addEdit =='edit') {
        return Promise.reject("不能超过50字")
      } else {
        callback()
      }
    },
    // 照片校验
    photoValidator(rule, value, callback) {
      if (!this.headImgs || this.headImgs.length<=0) {
        return Promise.reject("照片不能为空")
      } else {
        callback()
      }
    },
    durationValidator(rule, value, callback){
      if (!value) {
        callback()
      } else if (!/^\d+(\.\d{0,1})?$/.test(value)) {
        return Promise.reject("只能输入整数或最多一位小数")
      } else if(value*1 > 100) {
        return Promise.reject("从业年数不能大于100")
      } else if(value.slice(value.length-1)=='.') {
        return Promise.reject("只能输入整数或最多一位小数")
      } else {
        callback()
      }
    },
    // 身份证校验
    texTidCard (rule, value, callback){
      let reCN = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      let reF = /^[0-9A-z\(（）\)]+$/;
      let year = value.slice(6,10);
      let month = value.slice(10,12);
      let day = value.slice(12,14);
      if (!value && value !== 0) {
        return Promise.reject('身份证号不能为空');
      } else if (value.indexOf(' ') != -1) {
        return Promise.reject('身份证号不能包含空格');
      } else if(value.length != 18 && !reF.test(value)) {
        return Promise.reject('请输入格式正确的身份证号');
      } else if(value.length == 18 && !reCN.test(value)) {
        return Promise.reject('请输入格式正确的身份证号');
      } else if (value.length == 18 && reCN.test(value) && this.isAdult(Number(year),Number(month),Number(day))) {
        return Promise.reject('年龄不能小于18周岁');
      } else {
        callback();
      }
    },
    // texTidCard (rule, value, callback){
    //   let re = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    //   let year = value.slice(6,10);
    //   let month = value.slice(10,12);
    //   let day = value.slice(12,14);
    //   if (!value && value !== 0) {
    //     return Promise.reject('身份证号不能为空');
    //   } else if (value.indexOf(' ') != -1) {
    //     return Promise.reject('身份证号不能包含空格');
    //   } else if (!re.test(value)) {
    //     return Promise.reject('请输入格式正确的身份证号');
    //   } else if(this.isAdult(Number(year),Number(month),Number(day))) {
    //     return Promise.reject('年龄不能小于18周岁');
    //   } else {
    //     callback();
    //   }
    // },
    isAdult(year,month,day) {
      let date = new Date();
      let nowY = date.getFullYear();
      let nowM = date.getMonth() + 1;
      let nowD = date.getDate();
      if(nowY - year > 18) {
        return false;
      } else if(nowY - year < 18) {
        return true;
      } else if(nowM - month > 0) {
        return false;
      } else if( nowM - month < 0) {
        return true;
      } else if (nowD - day > 0) {
        return false;
      } else {
        return true;
      }
    },
    birthTimeValidator(rule, value, callback){
      const birth = value ? value.format("YYYYMMDD") : [];
      let year = birth.slice(0,4);
      let month = birth.slice(4,6);
      let day = birth.slice(6,8);
      const certificateNum = this.healthForm.certificateNum;
      if(!value) {
        return Promise.reject('请输入出生日期');
      } else if (certificateNum.length != 18 && this.isAdult(Number(year),Number(month),Number(day))) {
        return Promise.reject('年龄不能小于18周岁');
      } else {
        callback();
      }
    },
    // 根据身份证号码获取年龄（周岁）
    getBirth(value) {
      let re = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if(value && value.length==18 && value.indexOf(' ') == -1 && re.test(value)) {
        let year = value.slice(6,10)*1;
        let month = value.slice(10,12)*1;
        let day = value.slice(12,14)*1;
        // let date = new Date();
        // let nowY = date.getFullYear();
        // let nowM = date.getMonth() + 1;
        // let nowD = date.getDate();
        let birth = `${year}-${month}-${day}`
        this.healthForm.birthTime = moment(birth);
        this.birthDisabled = true;
        // if(nowY > year) {
        //   if(nowM > month) {
        //     this.healthForm.age = nowY - year;
        //   } else if(nowM == month && nowD <= day ) {
        //     this.healthForm.age = nowY - year - 1;
        //   } else if(nowM == month && nowD > day ) {
        //     this.healthForm.age = nowY - year;
        //   } else if(nowM < month) {
        //     this.healthForm.age = nowY - year - 1;
        //   }
        // } else {
        //   this.healthForm.age = nowY - year;
        // }
      } else {
        this.birthDisabled = false;
      }
    },
    getAge(value) {
      const birth = value ? value.format("YYYYMMDD") : [];
      let year = birth.slice(0,4);
      let month = birth.slice(4,6);
      let day = birth.slice(6,8);
      let date = new Date();
      let nowY = date.getFullYear();
      let nowM = date.getMonth() + 1;
      let nowD = date.getDate();
      console.log("vvvv---",`${birth}----${year}---${month}--${day}`);
      if(value) {
        if(nowY > year) {
          if(nowM > month) {
            this.healthForm.age = nowY - year;
          } else if(nowM == month && nowD <= day ) {
            this.healthForm.age = nowY - year - 1;
          } else if(nowM == month && nowD > day ) {
            this.healthForm.age = nowY - year;
          } else if(nowM < month) {
            this.healthForm.age = nowY - year - 1;
          }
        } else {
          this.healthForm.age = nowY - year;
        }
      } else {
        this.healthForm.age = "";
      }
      // formValidator.formItemValidate(this, 'birthTime', 'healthForm')
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("personalHealth");
  }
}
</script>

<style lang="less" scoped>
.form-content {
  .plus-line {
    margin-left: 10px;
    background: #F1F4FF;
    color: #0067cc;
    border: 1px dashed #9fcaf5 !important;
    &:hover {
      border: 1px dashed #0067cc !important;
    }
  }
  .work-num {
    padding-bottom: 0;
    // display: flex;
    .work-col {
      display: flex;
      ::v-deep .ant-form-item {
        flex: 1;
      }
    }
  }
}
</style>