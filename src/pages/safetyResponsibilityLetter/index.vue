<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" deptLabel="所属部门"></CommonSearchItem>
        <a-form-model-item label="发起人">
          <a-input v-model="formInline.launchUserJobNumberOrName" placeholder="请输入发起人" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="签署人">
          <a-input v-model="formInline.signatureUserJobNumberOrName" placeholder="请输入签署人" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="签署状态">
          <a-select allowClear show-search v-model="formInline.signatureStatus" placeholder="请选择状态">
            <a-select-option v-for="item in dictionary('signatureStatus2')" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="模板分类">
          <a-select allowClear show-search v-model="formInline.templateClassificationId" placeholder="请选择模板分类">
            <a-select-option v-for="item in classificationList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="入职日期">
          <a-range-picker format="YYYY-MM-DD" v-model="formInline.entryDate" :placeholder="['开始日期','结束日期']"/>
        </a-form-model-item>
        <a-form-model-item label="签署日期">
          <a-range-picker format="YYYY-MM-DD" v-model="formInline.signatureFinalDate" :placeholder="['开始日期','结束日期']"/>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <div class="pe-data-container">
      <h4 class="pe-data-title">{{peDate}}数据</h4>
      <div>
        <div @click="changeTab(0)" class="pe-data-item total-pe-num" :class="[curIndex === 0 ? 'active' : '']">
          <span class="pe-data-body">总数 {{countInfo.total==0? '0':countInfo.total}} 份</span>
          <p class="en-illus">total quantity</p>
          <i></i>
        </div>
        <div @click="changeTab(1)" class="pe-data-item forbid-pe-num" :class="[curIndex === 1 ? 'active' : '']">
          <span class="pe-data-body">签署完成 {{countInfo.signingComplete}} 份</span>
          <p class="en-illus">sign off</p>
          <i></i>
        </div>
        <div @click="changeTab(2)" class="pe-data-item exception-pe-num" :class="[curIndex === 2 ? 'active' : '']">
          <span class="pe-data-body">待签署 {{countInfo.toBeSigned}} 份</span>
          <p class="en-illus">to be signed</p>
          <i></i>
        </div>
      </div>
    </div>
    <DashBtn>
      <div>
        <a-button type="primary" @click="importPersonnel">导入人员</a-button>
        <a-button type="primary" @click="batchPush">批量推送</a-button>
        <a-button type="primary" @click="batchInitiate">批量发起</a-button>
        <a-button type="primary" @click="batchSign">批量签署</a-button> 
        <a-button type="primary" @click="batchExport">批量下载</a-button>
        <a-button type="primary" :loading="downLoading" @click="exportAll">批量导出</a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, selectedRows: choosedArr, onSelect: onSelectNew, onChange: onSelectChange, onSelectAll: onSelectAllSelect }" bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return record.id}" :pagination="false">
        <div slot="num" slot-scope="record">{{ record.num }}</div>
        <div slot="templateTypeName" slot-scope="record">{{ record.templateTypeName }}</div>
        <div slot="templateClassificationName" slot-scope="record">{{ record.templateClassificationName }}</div>
        <div slot="signatureUserName" slot-scope="record">{{ record.signatureUserName }}/{{ record.signatureUserJobNumber }}</div>
        <div slot="launchUserName" slot-scope="record">{{ record.launchUserName }}/{{ record.launchUserJobNumber }}</div>
        <div slot="signatureStatus" slot-scope="record">{{ record.signatureStatus }}</div>
        <div slot="entryDate" slot-scope="record">{{ record.entryDate }}</div>
        <div slot="signatureRecordList" slot-scope="record">{{ record.signatureRecordList }}</div>
        <div slot="signatureFinalDate" slot-scope="record">{{ record.signatureFinalDate }}</div>
        <div slot="action" slot-scope="record">
          <!-- <span class="color-0067cc cursor-pointer" v-if="record.signatureStatus == 1 " @click="signFile(record)">签署</span> -->
          <span class="color-0067cc cursor-pointer" v-if="record.signatureStatus == 1 && record.signatoriesHandlerUserId == userId" @click="signFile(record)">签署</span>
          <span class="color-0067cc cursor-pointer" v-if="record.signatureStatus == 0" @click="pushFile(record)">推送</span>
          <span class="color-0067cc cursor-pointer" @click="viewFile(record)">预览</span>
          <span class="color-ff4d4f cursor-pointer" @click="reSend(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
    <CommonModal :title="'签署责任书'" :visible="signVisible" :cancelFn="signCancle">
      <template slot="form">
        <a-form-model
          ref="editForm"
          :model="editForm"
          :label-col="labelColLong"
          :wrapper-col="wrapperColLong"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="签名区域" prop="sealData">
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
            <!-- <a-button type="primary" class="m-l-15 m-t-10" @click="signUndo">
              撤销
            </a-button> -->
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
            :label-col="{ style: { width: '90px' } }"
            :wrapper-col="{ style: { width: 'calc(100% - 90px)' } }"
            :colon="false"
            labelAlign="left"
          >
            <a-form-model-item class="flex" label="手机号" prop="phone">
              <a-input :maxLength="11" v-model="storageForm.phone" placeholder="请输入手机号" />
            </a-form-model-item>
            <a-form-model-item class="flex" label="身份证号" prop="idNumber">
              <a-input v-model="storageForm.idNumber" placeholder="请输入身份证号"/>
            </a-form-model-item>
          </a-form-model>
        </template>
        <template slot="btn">
          <a-button @click="storageCancle">取消</a-button>
          <a-button type="primary" class="m-l-15" @click="storageConfirm">确定</a-button>
        </template>
      </CommonModal>

    <!-- 批量发起 -->
    <CommonModal class="table-modal" title="批量发起" :visible="pushVisible" :cancelFn="pushCancle">
      <a-form-model ref="ruleFormItem" :model="formInlineItem" :rules="iRulesItem" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-model-item ref="corporationId" label="" prop="corporationId" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <CommonDept
            ref="corporationId"
            :CommonFormInline="formInlineItem"
            :rules="iRulesItem"
            :hasDepartment="false"
            :label-col="{ span: 5 }" 
            :wrapper-col="{ span: 19 }"
          ></CommonDept>
        </a-form-model-item>
      </a-form-model>

      <div class="flex">
        <div style="flex-basis: 40%; padding-right:35px" class="left border-radius-3 border-f4 pd-l-20 pd-t-20 pd-b-20 m-r-20">
          <div class="m-b-20 font-16 font-weight-bold">选择人员</div>
          <div class="staff m-b-20 flex align-items-center">
            <staffOrDeptPush :labelTitle="''" :checkedTreeNode="checkedStaffNode" @getTreeData="getTreeData" :treePlaceholder="'请选择组织人员'" @getRootData="getRootData"></staffOrDeptPush>
          </div>
        </div>
        <div class="right border-radius-3 border-f4 pd-l-20 pd-r-20 pd-t-20 pd-b-20" style="overflow: hidden; flex: 1;">
          <div class="m-b-20 font-16 font-weight-bold">人员已选</div>
          <CommonTable :noPaging="true">
            <a-table :columns="columnsDetail1" :locale="{emptyText: emptyText}" :data-source="checkedUserTitle" :pagination="false"></a-table>
          </CommonTable>
        </div>
      </div>
      <div>
        <div class="ttile border-b-e7">
          <PageTitle class="ttile-text required-star">模板</PageTitle>
          <DashBtn class="ttile-bbtn">
            <div>
              <a-button type="dashed" @click="openSelTempDrawer()">
                <a-icon type="plus" />选择
              </a-button>
            </div>
          </DashBtn>
        </div>
        <div class="m-t-20"></div>
      </div>
      <a-form-model ref="ruleForm" :model="iFrom" :rules="iRules" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
        <a-form-model-item ref="selTempList" label=" " prop="selTempList" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
          <ul class="sel-tempList" v-if="Array.isArray(iFrom.selTempList) && iFrom.selTempList.length">
            <li class="selTempItem" v-for="item in iFrom.selTempList" :key="item.templateId">
              <img class="pic" :src="item.coverFile?.filePath || ''" :alt="item.templateName" />
              <div class="mask">
                <div class="maskBtn">
                  <a-icon class="eyeBtn" type="eye" @click="openTempPreviewModel(item)" />
                  <a-icon class="deleteBtn" type="delete" @click="rmSelTempItem(item)" />
                </div>
              </div>
            </li>
          </ul>
          <a-empty description="暂未选择" v-else />
        </a-form-model-item>
      </a-form-model>
      <template slot="btn1">
        <a-button @click="pushCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" :loading="loadingInitiate" @click="pushConfirm">发起</a-button>
      </template>
    </CommonModal>
    
    <!-- 上传 -->
    <Upload :importVisible="importVisible" @closeAddVisible="closeAddVisible" :pushStatus='pushStatus' :type="type"/>

    <!-- 选择模板抽屉 -->
    <SelTempDrawer v-model="selTempDrawerShow" :selTempList="iFrom.selTempList" @changeSelTempDrawerList="changeSelTempDrawerList" />

    <!-- 预览模板弹窗 -->
    <TempPreviewModel v-model="tempPreviewModelShow" :previewData="previewData" :readOnly="true" />
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis"
import cancelLoading from '@/mixin/cancelLoading'
import { formValidator } from "@/utils/clx-form-validator.js"
import { mapState } from 'vuex'
import Upload from '@/pages/safetyResponsibilityLetter/components/uploadImport.vue'
import dayJs from "dayjs"
import '@/utils/dzjm.min.js'
import dictionary from "@/utils/dictionary";
import moment from 'moment'
import { debounce, cloneDeep } from 'lodash'
import html2canvas from 'html2canvas'
import staffOrDeptPush from "@/components/staffOrDeptPush";
import SelTempDrawer from "./components/selTempDrawer.vue";
import TempPreviewModel from './components/tempPreviewModel.vue';
import serviceNameList from '@/config/default/service.config.js'
import {getResponsibilityCount, getResponsibilityList, pushResponsibility,pushResponsibilityExport, responsibilityDelete, responsibilitySignBatch,responsibilityInitiateBatch, getCheckPhoneAndIdNumberExist,getEditPhoneAndIdNumber,verifySignature,getSignatureImage} from "@/services/api.js"
import optionsMixin from '@/pages/occupationHealth/physicalExam/mixin/optionsMixin'
import postOptionsMixin from '@/pages/occupationHealth/physicalExam/mixin/postOptions'

export default {
  mixins: [teableCenterEllipsis, cancelLoading, optionsMixin, postOptionsMixin],
  components: { Upload, staffOrDeptPush, TempPreviewModel, SelTempDrawer },
  data() {
    return {
      dictionary,
      signVisible: false,
      paraData:{},
      mSign1: null,
      mSign2: null,
      mSign3: null,
      mSign4: null,
      mSign5: null,
      editForm:{},
      nameLength: '',
      firstImage:'',
      secondImage:'',
      thirdImage:'',
      forthImage:'',
      fifthImage:'',
      dataWithoutPrefix:'',
      dataWithoutPrefixTwo:'',
      loading:false,
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
      labelColLong: { span: 3 },
      wrapperColLong: { span: 21 },
      formInline: {
        entryDateStart: undefined,
        entryDateEnd: undefined,
        entryDate: [],
        signatureFinalDateStart: undefined,
        signatureFinalDateEnd: undefined,
        signatureFinalDate: []
      },
      choosedArr: [],
      loadingInitiate: false,
      pushVisible: false,
      selTempDrawerShow: false,
      tempPreviewModelShow: false,
      previewData: {},
      checkedStaffNode: [],
      userTreeData: [],// 组织
      checkedUserTitle: [],
      columnsDetail1: [
        {
          title: "姓名",
          dataIndex: "name",
          key: "name"
        },
        {
          title: "工号",
          dataIndex: "workNum",
          key: "workNum"
        }
      ],
      iFrom: {},
      formInlineItem:{},
      iRulesItem: {
        corporationId: [{ required: true, message: "组织不能为空", trigger: "change" },],
      },
      iRules: {
        selTempList: [{ required: true, message: "模板不能为空", trigger: "change" },],
      },
      selectedRowKeys: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      pushStatus: 1,
      peDate: '',
      curIndex: -1,
      signatureStatus2:'',
      importVisible: false,
      userInfoData:{},
      storageVisible: false,
      storageForm: {},
      tankFormRules: {
        phone: [
          { required: true, validator: formValidator.texTphoneNumber, trigger: "blur" },
        ],
        idNumber: [
          { required: true, validator: formValidator.texTidCard, trigger: 'blur', },
        ]
      },
      phoneValue:'',
      idNumberValue:'',
      type: 0,
      countInfo: {
        total: '', //总数
        signingComplete: '', //签署成功
        toBeSigned: '', //待签署
      },
      tableSpinning: false,
      columns:  [
        {
          title: '编号',
          scopedSlots: { customRender: 'num' },
          width: 200
        },
        {
          title: '模板名称',
          scopedSlots: { customRender: 'templateTypeName' },
          width: 180
        },
        {
          title: '模板分类',
          scopedSlots: { customRender: 'templateClassificationName' },
          width: 180
        },
        {
          title: '目标责任人',
          scopedSlots: { customRender: 'signatureUserName' },
          width: 150
        },
        {
          title: '发起人',
          scopedSlots: { customRender: 'launchUserName' },
          width: 150
        },
        {
          title: '签署状态',
          dataIndex: 'signatureStatus',
          width: 150,
          customRender: (text) => {
            text = text ? this.getNumStatus(text) : ''
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
          title: '入职日期',
          dataIndex: 'entryDate',
          width: 150,
          customRender: (text) => {
            text = text ? text: '--'
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
          title: '签署记录',
          dataIndex:'securitySignRecordList',
          customRender: (text) => {
            if (!text) {
              return '--';
            }
            text[0] = text ? text[0] : '--';
            const signatoriesJobNumberFirst = text[0] && text[0].signatoriesJobNumber ? text[0].signatoriesJobNumber : '--';
            const signatoriesNameFirst = text[0] && text[0].signatoriesName ? text[0].signatoriesName : '--';
            const signatoriesTimeFirst = text[0] && text[0].signatoriesTime ? text[0].signatoriesTime.split(' ')[0] : '--';
            text[1] = text ? text[1] : '--';
            const signatoriesJobNumberSecond = text[1] && text[1].signatoriesJobNumber ? text[1].signatoriesJobNumber : '--';
            const signatoriesNameSecond = text[1] && text[1].signatoriesName ? text[1].signatoriesName : '--';
            const signatoriesTimeSecond = text[1] && text[1].signatoriesTime ? text[1].signatoriesTime.split(' ')[0] : '--';
            return (
              <a-popover autoAdjustOverflow title="签署人">
                <div slot="content">
                  目标责任人：<p>{signatoriesNameFirst}/{signatoriesJobNumberFirst}&nbsp;&nbsp;&nbsp;{signatoriesTimeFirst}</p> 
                  部门负责人：<p>{signatoriesNameSecond}/{signatoriesJobNumberSecond}&nbsp;&nbsp;&nbsp;{signatoriesTimeSecond}</p> 
                </div>
                <span>查看记录</span>
              </a-popover>
            );
          },
          width: 150,
        },
        {
          title: '签署完成日期',
          dataIndex: 'signatureFinalDate',
          width: 150,
          customRender: (text) => {
            text = text ? text: '--'
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
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
      classificationList: [],
      userId: undefined,
      downLoading: false,
    }
  },
  created() {
    this.columns.splice(1, 0, this.addCommonColumnItem(150, true));
    this.columns.splice(2, 0, this.addCommonColumnDepartment({
      title: "所属部门",
      width: 150
    }, true));
    this.classificationList = this.getMappingValue(this.dictTypeData, "dictType", "safety_responsibility_statement").dictItem;
    this.init()
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
      }
    })
  },
  activated(){
    if(this.$route.query.activeKey == 3){
      this.init()
    }
  },
  methods: {
    initPop(){
      let zconsole_userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
      this.userInfoData = zconsole_userInfo.other
      this.userPhone = this.userInfoData.phone
      this.phoneValue = this.userInfoData.phone
      this.idNumberValue = this.userInfoData.idNumber
      // 先判断一下是否要弹出个人认证的弹框
      getCheckPhoneAndIdNumberExist({}).then((res) => {
        console.log("数据全");
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
      this.signVisible = false
      this.storageForm = {};
    },
    // 弹框确定
    storageConfirm() {
      if (this.storageForm.idNumber != this.userInfoData.idNumber) {
        if (!formValidator.formAll(this, 'storageForm')) {
          return;
        }
      }
      let apiData = {
        phone:this.storageForm.phone,
        idNumber:this.storageForm.idNumber == this.userInfoData.idNumber?this.userInfoData.realIdNumberValue:this.storageForm.idNumber,
      }
      getEditPhoneAndIdNumber(apiData).then((res) =>{
        this.storageVisible = false;
        this.storageForm = {};
      })
    },
    async init() {
      this.getDataList()
      this.getCertCount()
      this.getPeDate()
    },
    // 批量导入成功
    handleSuccess(fileList) {
      this.getDataList()
    },
    // 获取到那三个格子的详情数据
    async getCertCount(){
      let params1 = {
        ...this.formInline,
        signatureStatus2:this.signatureStatus2,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        signatureFinalDateStart :this.formInline.signatureFinalDate[0] ? moment(this.formInline.signatureFinalDate[0]).format('YYYY-MM-DD') : '',
        signatureFinalDateEnd :this.formInline.signatureFinalDate[1] ? moment(this.formInline.signatureFinalDate[1]).format('YYYY-MM-DD') : '',
        entryDateStart :this.formInline.entryDate[0] ? moment(this.formInline.entryDate[0]).format('YYYY-MM-DD') : '',
        entryDateEnd :this.formInline.entryDate[1] ? moment(this.formInline.entryDate[1]).format('YYYY-MM-DD') : '',
        type: "1" 
      }
      const {code, data } = await getResponsibilityCount(params1)
      if (+code === 20000) {
        this.countInfo = data
      }
    },
    getPeDate() {
      if (!this.formInline.entryDate || !this.formInline.entryDate.length) {
        this.peDate = new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月'
      } else {
        let startMonth = new Date(this.formInline.entryDate[0]).getMonth() + 1
        let startYear = new Date(this.formInline.entryDate[0]).getFullYear()
        let endMonth = new Date(this.formInline.entryDate[1]).getMonth() + 1
        let endYear = new Date(this.formInline.entryDate[1]).getFullYear()
        if (startMonth === endMonth) {
          this.peDate = startYear + '年' + startMonth + '月'
        } else {
          this.peDate = startYear + '年' + startMonth + '月' + ' - ' + endYear + '年' + endMonth + '月'
        }
      }
    },
    async getDataList() {
      let entryDateStart = this.formInline.entryDate[0] ? moment(this.formInline.entryDate[0]).format('YYYY-MM-DD') : ''
      let entryDateEnd = this.formInline.entryDate[1] ? moment(this.formInline.entryDate[1]).format('YYYY-MM-DD') : ''
      let signatureFinalDateStart = this.formInline.signatureFinalDate[0] ? moment(this.formInline.signatureFinalDate[0]).format('YYYY-MM-DD') : ''
      let signatureFinalDateEnd = this.formInline.signatureFinalDate[1] ? moment(this.formInline.signatureFinalDate[1]).format('YYYY-MM-DD') : ''
      let params = {
        type:1,
        ...this.formInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        entryDateStart: entryDateStart,
        entryDateEnd: entryDateEnd,
        signatureFinalDateStart: signatureFinalDateStart,
        signatureFinalDateEnd: signatureFinalDateEnd,
        signatureStatus2:this.signatureStatus2
      }
      this.tableSpinning = true
      const { code, data } = await getResponsibilityList(params)
      this.tableSpinning = false
      if (+code === 20000 && data) {
        this.tableDataList = data.list
        this.page.total = data.total
      }
    },
    changeTab(tabIndex) {
      this.curIndex = this.curIndex === tabIndex ? -1 : tabIndex
      if (tabIndex == 0){
        this.signatureStatus2 = ''
      } else if (tabIndex == 1) {
        this.signatureStatus2 = '3'
      } else if (tabIndex == 2) {
        this.signatureStatus2 = '1'
      }
      this.page.pageNo = 1
      this.selectedRowKeys = []
      this.choosedArr = []
      this.getDataList()
    },
    // 选择模板抽屉
    openSelTempDrawer() {
      this.selTempDrawerShow = true;
    },
    // 模板change事件
    changeSelTempDrawerList(selTempList) {
      this.$set(this.iFrom, 'selTempList', selTempList)
      formValidator.formItemValidate(this, 'selTempList', 'ruleForm')
    },
    // 预览模板弹窗
    openTempPreviewModel(item) {
      this.previewData = item
      this.tempPreviewModelShow = true
    },
    // 删除选择的模板
    rmSelTempItem(rmItem) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: () => {
          const newSelTempList = this.iFrom.selTempList.filter(item => item.templateId != rmItem.templateId)
          this.$set(this.iFrom, 'selTempList', newSelTempList)
          formValidator.formItemValidate(this, 'selTempList', 'ruleForm')
          return Promise.resolve()
        }
      })
    },
    // 批量发起
    batchInitiate(){
      if (!this.canClickBtnMixin("responsibilityBatchInitiate")) {
        return;
      }
      this.pushVisible = true;
      this.checkedUserTitle = [];
      this.iFrom = {}
      this.formInlineItem = {}
    },
    // 关闭批量发起弹框
    pushCancle() {
      this.pushVisible = false;
      this.checkedUserTitle = [];
      this.iFrom = {}
      this.formInlineItem = {}
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
    // 表单校验
    formValidateItem() {
      // 如果页面表单验证有报错则滚动到表单验证报错的地方
      let formAll = true
      this.$refs["ruleFormItem"].validate((valid, object) => {
        if (!valid) {
          formAll = false
          this.scrollView(object);
        }
      });
      return formAll
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
    // 确认发起
    pushConfirm(){
      if (!this.formValidateItem()) {
        return
      }
      if (this.checkedUserTitle.length == 0) {
        this.$antMessage.warning("您还未选择人员");
        return;
      }
      if (!this.formValidate()) {
        return
      }
      this.formInlineItem.corporationName = this.matchOrganizeName(this.formInlineItem.corporationId),
      console.log('this.formInlineItem',this.formInlineItem);
      console.log('templateId',this.iFrom.selTempList[0].templateId);
      // return
      console.log('确认发起',this.checkedUserTitle);
      for (let i = 0; i < this.checkedUserTitle.length; i++) {
        this.checkedUserTitle[i].deptName = this.findDeptName(this.userTreeData, this.checkedUserTitle[i].deptId);
      }
      let userListTotal = this.checkedUserTitle;
      userListTotal.forEach(item => {
        item.userId = item.key
        item.userName = item.name
        item.userCode = item.workNum
      })
      console.log('userListTotal全部数据',userListTotal);
      const userList = userListTotal.filter(item => item.isLeaf || item.isLeaf == undefined);
      const deptList = userListTotal.filter(item => !item.isLeaf);
      console.log('userList人员',userList);
      console.log('deptList部门',deptList);
      const userIdList = userList.map(item  => item.userId)
      const deptIdListUnde = deptList.map(item  => item.deptId)
      const deptIdList = deptIdListUnde.filter(element => element !== undefined);
      let params = {
        userIdList:userIdList,
        deptIdList:deptIdList,
        templateId:this.iFrom.selTempList[0].templateId,
        corporationId: this.formInlineItem.corporationId,
        corporationName: this.formInlineItem.corporationName
      }
      console.log('paramsb',params);
      this.loadingInitiate = true
      responsibilityInitiateBatch(params).then((res)=>{
        this.$antMessage.success(res.message)
        this.loadingInitiate = false
        this.pushCancle()
      }).catch(err =>{
        this.$antMessage.warning(err.message)
      }).finally(()=>{
        this.loadingInitiate = false
      })
      // console.log('userIdList222',userIdList,'deptIdList333',deptIdList);
    },
    // 获取内部人员数据
    getRootData(treeData) {
      this.userTreeData = treeData;
    },
    // 改变组织人员
    getTreeData(obj) {
      console.log(obj);
      let arr = obj.treeNameAndCodeList || [];
      let brr = [];
      console.log('obj.treeNameAndCodeList@SH',obj.treeNameAndCodeList);
      for (let i = 0; i < arr.length; i++) {
        // console.log('arr[i]',arr[i]);
        brr.push({
          name: arr[i].treeName,
          workNum: arr[i].treeCode,
          deptId: arr[i].treeParentId,
          deptName: arr[i].treeParentName,
          isLeaf: arr[i].isLeaf,
          key: arr[i].id,
        });
      }
      this.checkedUserTitle = [...brr]; // 传给后端得数据
    },
    findDeptName(userTreeData, deptId) {
      for (let i = 0; i < userTreeData.length; i++) {
        if (userTreeData[i].key == deptId) {
          return userTreeData[i].value;
        } else {
          if (userTreeData[i].children) {
            return this.findDeptName(userTreeData[i].children, deptId);
          }
        }
      }
    },
    // 批量导出
    async exportAll() {
      if (!this.canClickBtnMixin("responsibilityBatchExportOut")) {
        return;
      }
      this.downLoading = true;
      const name = '安全责任书';
      let res = await pushResponsibilityExport(this.formInline);
      if(res){
        const blob = new Blob([res],{ type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const downloadElement = document.createElement('a');
        const href = URL.createObjectURL(blob); //创建下载链接
        downloadElement.href = href;
        downloadElement.download = name + '.xlsx';
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);// 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      }
      this.downLoading = false;
    },
    // 批量推送
    async batchPush() {
      if (!this.canClickBtnMixin("responsibilityBatchPush")) {
        return;
      }
      console.log(this.choosedArr);
      if (!this.choosedArr.length) {
        this.$antMessage.warning('请选择推送人员！')
        return
      }
      if (this.choosedArr.every(item => item.signatureStatus == 0 || item.signatureStatus == 1)) {
        const personIds = this.choosedArr.map(item => {
          return item.id
        })
        let para = {
          idList: personIds
        }
        const { code } = await pushResponsibility(para)
        if (+code === 20000) {
          this.$antMessage.success('批量推送成功')
          this.selectedRowKeys = []
          this.choosedArr = []
          this.getDataList()
          this.getCertCount()
        }
      } else {
        this.$antMessage.warning('请正确选择推送人员！')
        return;
      }
    },
    // 批量签署
    async batchSign() {
      if (!this.canClickBtnMixin("responsibilityBatchSign")) {
        return;
      }
      this.initPop()
      // console.log('批量签署',this.choosedArr);
      if (!this.choosedArr.length) {
        this.$antMessage.warning('至少选择一条数据！')
        return
      }
      const condition = (item) => {
        return item.signatoriesHandlerUserId != this.userId || item.signatureStatus != 2;
      };
      const canNotSign = this.choosedArr.some(condition);
      if (canNotSign) {
        this.$antMessage.warning('请正确选择签署文件！')
        return;
      } else {
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
        }
        // console.log(this.selectedRowKeys,'idList999');
      }
    },
    // 批量下载
    async batchExport() {
      if (!this.canClickBtnMixin("responsibilityBatchExport")) {
        return;
      }
      console.log('批量下载',this.choosedArr);
      if (!this.choosedArr.length) {
        this.$antMessage.warning('至少选择一条数据！')
        return
      }
      this.choosedArr.forEach(item => {
        window.open(item.file.filePath);
      })
      this.choosedArr = []
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
      if (!formValidator.formAll(this, "editForm")) return;
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
              let params = {
                idList: this.selectedRowKeys,
                sealData: this.dataWithoutPrefix,
              }
              responsibilitySignBatch(params).then((res)=>{
                if(res.code == 20000){
                  this.$antMessage.success("签署成功！");
                  this.signVisible = false
                  this.loading = false
                  this.selectedRowKeys = []
                  this.choosedArr = []
                  this.getDataList()
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
                idList: this.selectedRowKeys,
                sealData: this.dataWithoutPrefixTwo ,
              }
              responsibilitySignBatch(params).then((res)=>{
                if(res.code == 20000){
                  this.$antMessage.success("签署成功！");
                  this.signVisible = false
                  this.loading = false
                  this.selectedRowKeys = []
                  this.choosedArr = []
                  this.getDataList()
                }
              }).catch(()=>{
                this.signVisible = false
                this.loading = false
              })
            });  
          }
        })
      }
      // let params = {
      //   idList: this.selectedRowKeys,
      //   sealData: dataWithoutPrefix,
      // }
      // responsibilitySignBatch(params).then((res)=>{
      //   if(res.code == 20000){
      //     this.$antMessage.success("签署成功！");
      //     this.signVisible = false
      //     this.selectedRowKeys = []
      //     this.choosedArr = []
      //     this.getDataList()
      //   }
      // })
    },
    signUndo() {
      this.mSign.undo();
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
    // 点击取消按钮
    signCancle() {
      this.signVisible = false;
      this.editForm = {};
    },
    onSelectNew(record, selected, selectedRows, nativeEvent){
      // 选择
      if (selected) {
        this.selectedRowKeys.push(record.id)
        this.choosedArr.push(record)
      } else {
        // 取消选中
        this.selectedRowKeys = this.selectedRowKeys.filter((v) => v !== record.id)
        this.choosedArr.splice(
          this.choosedArr.findIndex((x) => x.id === record.id),
          1
        )
      }
      this.getArray(this.choosedArr)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = [...new Set(selectedRowKeys)];
      console.log('selectedRowKeys111SCC',this.selectedRowKeys);
    },
    onSelectAllSelect(selected, selectedRows, changeRows) {
      // console.log(selected, selectedRows, changeRows)
      // 全选
      if (selected) {
        changeRows.map((x) => {
          this.selectedRowKeys.push(x.id) //选中id
        })
        this.choosedArr = this.choosedArr.concat(changeRows)
      } else {
        // 取消全选
        changeRows.forEach((item) => {
          // 去掉选择取消的keyID
          this.selectedRowKeys = this.selectedRowKeys.filter((v) => v !== item.id)
        })
        this.choosedArr = this.choosedArr.filter((x) => !changeRows.find((i) => i.id === x.id))
      }
      this.getArray(this.choosedArr)
    },
    // 数组去重
    getArray(selectData) {
      let map = new Map()
      for (let item of selectData) {
        if (!map.has(item.id)) {
          map.set(item.id, item)
        }
      }
      this.choosedArr = [...map.values()]
      console.log(this.choosedArr, '数组去重后')
    },
    // 根据列表签署状态转为文字
    getNumStatus(num){
      if(num == '0'){
        return '待推送'
      } else if(num == '1'){
        return '待签署'
      } else if(num == '2'){
        return '签署中'
      } else if(num == '3'){
        return '签署完成'
      }
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page
      // this.choosedArr = []
      // this.selectedRowKeys = []
      // 获取列表
      this.getDataList()
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1
      this.page.pageSize = pageSize
      this.getDataList()
    },
    // 查询
    iSearch() {
      this.getPeDate()
      // 获取列表
      this.page.pageNo = 1
      this.getDataList(this.formInline)
        .finally(() => {
          this.cancelLoading()
        })
      this.selectedRowKeys = []
      this.choosedArr = []
      this.getCertCount()
    },
    // 重置
    iRest: debounce(function () {
      this.$refs.commonSearchItem.reset()
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
        entryDate: [],
        signatureFinalDate: [],
      }
      this.signatureStatus2 = ''
      this.curIndex = -1
      this.selectedRowKeys = []
      this.choosedArr = []
      this.getDataList()
      this.getCertCount()
      this.getPeDate()
    }, 250, { leading: true, trailing: false }),
    format(val) {
      return moment(val).format('YYYY-MM-DD')
    },
    // 导入人员-打开弹框
    importPersonnel() {
      if (!this.canClickBtnMixin("responsibilityImportPersonnel")) {
        return;
      }
      this.importVisible = true
      this.type = 1
      this.pushStatus = 1
    },
    //关闭批量导入弹窗
    closeAddVisible(flag) {
      if (flag) {
        this.formInline = {
          entryDateStart: undefined,
          entryDateEnd: undefined,
          entryDate: [],
          signatureFinalDateStart: undefined,
          signatureFinalDateEnd: undefined,
          signatureFinalDate: []
        },
        this.getDataList();
        this.getCertCount()
      }
      this.importVisible = false;
      this.type = 0
      this.pushStatus = 1
    },
    // 处理文件id
    handleFileIdS(list) {
      list = list ? list : []
      let ids = list.map(item => {
        return item.id
      })
      ids = ids ? ids : []
      return ids
    },
    // 处理文件回显
    handleFileRedisplay(list) {
      // console.log(888,list);
      list = list ? list : []
      let fileList = []
      list.forEach(item => {
        let itemObj = {
          id: item.id,
          uid: item.id,
          name: item.sourceFileName,
          status: 'done',
          url: item.filePath,
        }
        fileList.push(itemObj)
      })
      return fileList
    },
    // 签署
    signFile(row){
      if (!this.canClickBtnMixin("safetyResponsibilitySign")) {
        return;
      }
      let query = {
        id: row.id,
        activeKey:'1'
      }
      this.$router.push({
        path: '/ehsGerneralManage/securityArchiveManagement/safetyResponsibilityPreview',
        query
      })
    },
    // 预览
    viewFile(row){
      if (!this.canClickBtnMixin("safetyResponsibilityView")) {
        return;
      }
      let query = {
        id: row.id,
        filePreview: true
      }
      this.$router.push({
        path: '/ehsGerneralManage/securityArchiveManagement/safetyResponsibilityPreview',
        query,
      })
    },
    // 推送
    pushFile(row){
      let para = {
        idList: [row.id]
      }
      pushResponsibility(para)
      .then((res) =>{
        if(res.code == 20000){
          this.$antMessage.success('推送成功')
          this.getDataList()
          this.getCertCount()
        }
      })
    },
    // 删除
    reSend(row){
      if (!this.canClickBtnMixin("responsibilityDelete")) {
        return;
      }
      this.$antConfirm({
        title: '确认删除？',
        onOk: async () => {
          let para = {
           id:row.id
          }
          await responsibilityDelete(para)
          this.$antMessage.success('删除成功')
          this.getDataList()
          this.getCertCount()
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
.sel-tempList {
  padding-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 18px;
  grid-row-gap: 18px;

  .selTempItem {
    position: relative;
    overflow: hidden;

    &:hover {
      .mask {
        display: flex;
      }
    }

    .selRadioBox {
      position: absolute;
      top: 0px;
      left: 0px;
      padding: 4px 8px 4px;
      z-index: 2;

      ::v-deep .ant-radio-inner {
        border-color: #0067cc;
      }
    }

    .pic {
      width: 100%;
    }

    .mask {
      display: none;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: rgba(255, 255, 255, 0.5);
      align-items: center;
      justify-content: center;

      .maskBtn {
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;

        .eyeBtn {
          font-size: 24px;
          margin-right: 20px;
          cursor: pointer;
        }

        .deleteBtn {
          font-size: 22px;
          cursor: pointer;
        }
      }
    }
  }
}
.table-modal {
  ::v-deep  .ant-select-selection {
    width: 400px !important;
  }
  /deep/ .ant-modal {
    width: 1200px !important;
    .clx-model-body {
      max-height: 700px;
      padding-bottom: 30px;
    }
    .pos-btn {
      bottom: 20px;
      width: 100%;
      background: #fff;
      padding-top: 20px;
    }
  }
}
::v-deep .selectClass {
  .ant-select-selection {
    width: 400px !important;
  }
}
::v-deep .ant-modal-content {
  .model-content-form {
    padding: 0 111px 0 102px !important;
  }
}
::v-deep .dashed-btn{
  .ant-btn-primary {
    background: #f1f4ff;
    color: #0067cc;
    border: 1px dashed #9fcaf5 !important;
  }
  .ant-btn-primary:hover {
    border: 1px dashed #0067cc !important;
  }
}
.testInfoThree {
  // border: 2px dashed grey;
  overflow: hidden;
  display: flex;
}
.testInfoTwo{
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
.pe-data-item{
  display: inline-block;
  width:224px;
  height: 64px;
  cursor: pointer;
  position: relative;
  background: rgba(250,250,250,0.50);
  border: 1px solid rgba(244,244,244,1);
  border-radius: 4px;
  padding-left:30px;
  & +.pe-data-item{
    margin-left: 20px;
  }
  &.active{
    background:#fff;
  }
  i {
    position: absolute;
    display: inline-block;
    background-color: #333;
    -webkit-mask-image: url(~@/assets/images/data-icon.svg);
    mask-image: url(~@/assets/images/data-icon.svg);
    width:14px;
    top:34px;
    right: 30px;
    height: 14px;
  }
}
.link-span{
  cursor: pointer;
  color:#02A7F0;
}
.total-pe-num{
  &.active{
    border: 1px solid rgba(0,103,204,1);
    box-shadow: 0px 0px 10px 0px rgba(0,103,204,0.1);
    .pe-data-body{
      color: #0067CC;
    }
    .en-illus{
      color: #0067CC;
    }
    i {
      background-color: rgba(0,103,204,1);
    }
  }
}
.exception-pe-num{
  &.active{
    border: 1px solid rgba(255,157,1,1);
    box-shadow: 0px 0px 10px 0px rgba(255,157,1,0.1);
    .pe-data-body,.en-illus{
      color: #FF9D01;
    }
    i {
      background-color:rgba(255,157,1,1);
    }
  }
}
.forbid-pe-num{
  &.active{
    border: 1px solid rgba(87,234,201,1);
    box-shadow: 0px 0px 10px 0px rgba(87,234,201,0.1);
    .pe-data-body,.en-illus{
      color: #57eac9;
    }
    i {
      background-color:rgba(87,234,201,1);
    }
  }
}
.pe-data-container{
  margin-bottom:30px;
  .pe-data-body{
    display: inline-block;
    font-size: 14px;
    color: #333333;
  }
  .en-illus{
    opacity: 0.5;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #333333;
    line-height: 12px;
    font-weight: 400;
    margin-top:10px;
  }
}
.pe-green{
  color: #02DFAD;
}
.pe-red{
  color:#FF1212;
}
.pe-data-title{
  margin-bottom: 30px;
  padding-bottom:20px;
  font-size: 16px;
  color: rgba(0,0,0,0.85);
  line-height: 24px;
  font-weight: 500;
  border-bottom: 1px solid #f4f4f4;
}
.pe-data-body{
  margin-top: 15px;
}
.pre-test {
  /deep/ .ant-modal-wrap {
    z-index: 1001;
  }
}
</style>