<template>
  <HasFixedBottomWrapper>
    <PageTitle>{{plan=='edit'|| plan=='draft'?'编辑应急演练':plan=='adjust'?'计划调整':plan=='preview'?'查看应急演练':"新建应急演练"}}</PageTitle>
    <div class="form-content">
      <a-form-model ref="emForm" :model="emForm" :rules="emRules" :colon="false" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row class="m-t-20">
          <a-col :span="11">
            <a-form-model-item class="flex" label="审批状态" v-if="plan=='adjust'">
              <span>{{ portalStatus }}</span>
            </a-form-model-item>
            <CommonDept
              ref="commonSearchItem"
              :disabled="disabled"
              :CommonFormInline="emForm"
              :rules="emRules"
              :notTablePage="true"
              :hasDepartment="true"
              @corporationChange="corporationChange"
              @corporationDeptChange="corporationDeptChange"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            ></CommonDept>
            <a-form-model-item class="flex" label="起草人部门" prop="draftDepartCode">
              <dept-tree :disabled="disabled" :placeholder="'请选择起草人部门'" v-model="emForm.draftDepartCode" :deptData="deptData" @change="(id,name)=>draftChange(id,name,'draftDepartName')" allowClear></dept-tree>
            </a-form-model-item>
            <a-form-model-item class="flex" label="起草人">
              <span>{{emForm.draftName}}</span>/
              <span>{{emForm.draftCode}}</span>
            </a-form-model-item>
            <a-form-model-item class="flex" label="参演内部部门" prop="innerDepartCode">
              <dept-tree
                :multiple="true"
                :disabled="disabled"
                :placeholder="'请选择参演内部部门'"
                v-model="emForm.innerDepartCode"
                :deptData="deptData"
                @change="(id,name)=>draftChange(id,name,'innerDepartName')"
                allowClear
              ></dept-tree>
            </a-form-model-item>
            <a-form-model-item class="flex" label="参演外部单位">
              <a-input :disabled="disabled" :maxLength="50" v-model="emForm.outDepart" placeholder="请输入参演外部单位" allowClear></a-input>
            </a-form-model-item>
            <a-form-model-item class="flex" label="演练计划时间" prop="planTime">
              <a-date-picker :disabled="disabled && plan != 'adjust'" :disabled-date="disabledDate" v-model="emForm.planTime" />
            </a-form-model-item>
          </a-col>
          <a-col :span="11" :push="1">
            <a-form-model-item class="flex" label=" " v-if="plan=='adjust'"></a-form-model-item>
            <a-form-model-item class="flex" label="应急演练级别" prop="drillLevel">
              <a-select :disabled="disabled" v-model="emForm.drillLevel" placeholder="请选择应急演练级别" allowClear>
                <a-select-option v-for="item in emergencyLevel" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="flex" label="计划所属部门" prop="planDepartCode">
              <dept-tree :disabled="disabled" :placeholder="'请选择计划所属部门'" v-model="emForm.planDepartCode" :deptData="deptData" @change="(id,name)=>planDeptChange(id,name,'planDepartName')" allowClear></dept-tree>
            </a-form-model-item>
            <a-form-model-item class="flex" label="应急演练名称" prop="drillName">
              <a-input :disabled="disabled" v-model="emForm.drillName" :maxLength="50" placeholder="请输入应急演练名称" allowClear></a-input>
            </a-form-model-item>
            <a-form-model-item class="flex" label="应急演练类型" prop="drillTypeCode">
              <a-select :disabled="disabled" v-model="emForm.drillTypeCode" placeholder="请选择应急演练类型" allowClear>
                <a-select-option v-for="item in drill_type" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="flex" label="其他类型" v-if="emForm.drillTypeCode=='other'" prop="drillOtherTypeText">
              <a-input :disabled="disabled" v-model="emForm.drillOtherTypeText" placeholder="请输入其他类型" allowClear></a-input>
            </a-form-model-item>
            <a-form-model-item class="flex" label="应急演练形式" prop="drillForm">
              <a-select :disabled="disabled" v-model="emForm.drillForm" placeholder="请选择演练形式" allowClear>
                <a-select-option v-for="item in emergencyForm" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="flex" label="应急预案" prop="prepId">
              <a-button :disabled="disabled" class="modal-btn" @click="labelBtn" v-if="planList && planList.length>=1">
                <div class="selected-modal" v-for="item of planList" :key="item.prepId" @click.stop="colsePlanModal(item)">
                  {{item.eplanName}}&nbsp;
                  <span v-if="!adjust">
                    <a-icon type="close-circle" />;
                  </span>
                </div>
              </a-button>
              <a-button class="modal-btn" @click="labelBtn" v-else>请先选择计划所属部门，点击显示应急预案列表弹框</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <CommonModal title="选择应急预案" :visible="visible" :cancelFn="closeVisible" class="table-modal prep-modal">
      <template slot="form">
        <SearchTerm>
          <a-form-model layout="inline" :model="formInline" :colon="false">
            <a-form-model-item label="预案名称" prop="eplanName">
              <a-input v-model="formInline.eplanName" placeholder="请输入预案名称" allowClear></a-input>
            </a-form-model-item>
            <a-form-model-item label="预案级别" prop="eplanLevel">
              <a-select v-model="formInline.eplanLevel" placeholder="请选择预案级别" allowClear>
                <a-select-option v-for="item in prep_level" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="预案类型" prop="eplanTypeCode">
              <a-select v-model="formInline.eplanTypeCode" placeholder="请选择预案类型" allowClear>
                <a-select-option v-for="item in drill_type" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="float-right">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button @click="reset">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>
        <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
          <a-table
            bordered
            :row-selection="{ selectedRowKeys: selectedKeys, onChange: onPlanChange, type:'radio' }"
            :columns="columns"
            :locale="{emptyText: emptyText}"
            :data-source="dataSource"
            :rowKey="(record, index)=>{return record.prepId}"
            :pagination="false"
          >
            <template slot="draft" slot-scope="record">{{record.draftName}}/{{record.draftCode}}</template>
          </a-table>
        </CommonTable>
      </template>
      <template slot="btn">
        <a-button @click="closeVisible">取消</a-button>
        <a-button class="m-l-15" type="primary" @click="confirm">确定</a-button>
      </template>
    </CommonModal>
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="goBack">返回</a-button>
          <a-button type="primary" class="m-r-15" v-if="plan=='add' || plan=='draft'" :loading="loadingConfirm" @click="emConfirm('0')">保存</a-button>
          <a-button type="primary" class="m-r-15" v-if="plan=='add' || plan=='adjust' || plan=='draft' || plan=='edit'" :loading="loadingConfirm" @click="emConfirm('1')">提交</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import dictionary from '@/utils/dictionary';
import moment from "moment";
import chemicalDict from "@/mixin/chemicalDict.js";
import { formValidator } from "@/utils/clx-form-validator.js";
import { PushTask, planPageList, addDrillPlan, editDrillPlan, viewDetailPlan, editDraftDrillPlan, drillPlanAdjust } from "@/services/api.js";
export default {
  mixins: [chemicalDict, teableCenterEllipsis],
  components: {
    FixedBottom,
  },
  props: {
    plan: {
      type: String,
      default: 'add'
    },
    planId: {
      type: String,
      default: null
    },
    adjust: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      emForm: {
        // draftDepartCode: undefined,
        planTime: null,
      },
      portalStatus: "",
      deptData: [],
      loadingConfirm: false,
      visible: false,
      emergencyLevel: undefined,
      emergencyForm: undefined,
      drill_type: undefined,
      labelCol: { style: { width: '100px' } },
      wrapperCol: { style: { width: 'calc(100% - 100px)' } },
      deptId: undefined,
      selectedKeys: [],
      selectedRowKeys: [],
      safeKeys: [],
      selectedRow: [],
      safeRow: [],
      planList: [],
      formInline: {},
      formData: {},
      dataSource: [],
      columns: [
        {
          title: '预案编号',
          dataIndex: 'prepNumber',
          width: 200
        },
        {
          title: '预案名称',
          dataIndex: 'eplanName',
          width: 200
        },
        {
          title: '预案级别',
          dataIndex: 'eplanLevel',
          customRender: (text) => {
            return text ? this.getChemicalDictText('prep_level', text) : '--'
          },
          width: 200
        },
        {
          title: '预案类型',
          dataIndex: 'eplanTypeCode',
          customRender: (text) => {
            return text ? this.getChemicalDictText('drill_type', text) : '--'
          },
          width: 200
        },
        {
          title: '起草人',
          scopedSlots: { customRender: 'draft' },
          width: 200
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 200
        },
      ],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      disabled: false,
      pushPara: {}
    }
  },
  computed: {
    emRules() {
      let emRules = {
        draftDepartCode: [
          { required: true, message: "不能为空", trigger: ['blur', 'change'] },
        ],
        innerDepartCode: [
          { required: true, message: "不能为空", trigger: ['blur', 'change'] },
        ],
        planDepartCode: [
          { required: true, message: "不能为空", trigger: ['blur', 'change'] },
        ],
        drillLevel: [
          { required: true, message: "不能为空", trigger: ['blur', 'change'] },
        ],
        drillTypeCode: [
          { required: true, message: "不能为空", trigger: ['blur', 'change'] },
        ],
        drillForm: [
          { required: true, message: "不能为空", trigger: ['blur', 'change'] },
        ],
        planTime: [
          { required: true, message: "不能为空", trigger: ['blur', 'change'] },
        ],
        drillName: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        drillOtherTypeText: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        prepId: [
          { required: true, validator: this.prepIdValidator, trigger: ['blur', 'change'] },
        ],
      }
      return emRules
    },

  },

  created() {
    // if(sessionStorage.getItem("zconsole_userInfo")) {
    //   let adminDeptId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user.adminDeptId;
    //   this.$set(this.emForm, 'draftDepartCode', adminDeptId ? [adminDeptId] : []);
    // }
    if(sessionStorage.getItem("zconsole_userInfo")) {
      let adminDeptId = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user.adminDeptId;
      let adminDeptName = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).user.adminDeptName;
      this.emForm.draftDepartCode = adminDeptId ? adminDeptId: ''
      this.$set(this.emForm, 'draftDepartName', adminDeptName ? adminDeptName : '');
      console.log(this.emForm.draftDepartCode,'xxx');
    }
    const user = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user;
    this.emForm.draftName = user.name ? user.name : '';
    this.emForm.draftCode = user.jobNumber ? user.jobNumber : '';
    this.emergencyLevel = dictionary("emergencyLevel"); //应急演练级别
    this.emergencyForm = dictionary("emergencyForm"); //应急演练形式
    this.prep_level = this.getChemicalDictList('prep_level'); //预案级别
    this.drill_type = this.getChemicalDictList('drill_type'); //应急演练类型
    this.columns.splice(4, 0, this.addCommonColumnDepartment({
      width: 150,
      key: 'eplanDepartcode',
      title: "预案部门"
    }));
    this.disabled = (this.plan && this.plan == "preview") || this.adjust;
    this.getInit();

  },
  methods: {
    // 编辑预览初始化
    getInit() {
      if (this.planId) {
        viewDetailPlan({ planId: this.planId }).then(res => {
          const data = res.data;
          data.innerDepartCode = data.innerDepartCode ? data.innerDepartCode.split(",") : [];
          this.$refs.commonSearchItem.corporationChange(data.corporationId);
          this.emForm = { ...data };
          this.emForm.planTime = moment(data.planTime);
          this.planList = [data.temergentdrillPrep];
          this.safeKeys = data.temergentdrillPrep.prepId.split(",");
          this.portalStatus = data.portalStatus ? dictionary("dirllPlanApproveStatus", data.portalStatus) : '--';
        }).catch(err => {
          console.log(err);
        })
      } else {
        const date = new Date();
        const yy = date.getFullYear();
        const mm = date.getMonth() + 1;
        const dd = date.getDate();
        const tday = `${yy}-${mm}-${dd}`;
        this.emForm.planTime = moment(tday);
      }
    },
    // 调整时间不能跨年
    disabledDate(current) {
      const date = new Date();
      const yy = date.getFullYear();
      const mm = date.getMonth() + 1;
      const dd = date.getDate();
      const tday = `${yy}-${mm}-${dd}`;
      const nextYear = `${yy + 1}-01-01`;
      if (this.plan == 'adjust') {
        return current < moment(tday) || current >= moment(nextYear);
      } else {
        return current < moment(tday);
      }
    },
    goBack(){
      this.setKeepalive(true)
      this.$router.go(-1)
    },
    // 确认
    emConfirm(operationType) { //operationType 0保存 1确定
      if (!formValidator.formAll(this, 'emForm')) {
        return;
      }
      const disabled = 'disabled' + operationType;
      this[disabled] = true;
      const time = this.emForm.planTime.format('YYYY-MM-DD');
      let emTime = {};
      if (this.plan === 'adjust') {
        emTime = {
          adjustDate: time,
          planTime: undefined,
        }
      } else {
        emTime = {
          planTime: time,
        }
      }
      const params = {
        ...this.emForm,
        operationType,
        ...emTime,
        prepId: this.planList[0].prepId,
      }
      params.innerDepartCode = params.innerDepartCode ? params.innerDepartCode.join(",") : "";
      const api = this.planId ? this.plan === 'draft' ? editDraftDrillPlan : this.plan === 'adjust' ? drillPlanAdjust : editDrillPlan : addDrillPlan;
      this.loadingConfirm = true;
      api(params)
      .then(res => {
        this.$antMessage.success("操作成功");
        const url = operationType == '0' ? '/safeManage/emergencyManagement/emergencyDrillManagement/emergencyDraftbox' : '/safeManage/emergencyManagement/emergencyDrillManagement/emergencyPlan'
        if (this.plan == 'adjust') {
          this.pushPara = res.data;
          this.pushTask();
        }
        this.$router.replace(url);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.loadingConfirm = false;
      })
    },
    // 获取组织下所有部门
    corporationDeptChange(value) {
      this.deptData = value;
    },
    // 组织改变
    corporationChange(val, deptId) {
      // this.$set(this.emForm, 'draftDepartCode', undefined);
      this.$set(this.emForm, 'planDepartCode', undefined);
      this.$set(this.emForm, 'innerDepartCode', undefined);
      // this.emForm.draftDepartName = undefined;
      this.emForm.planDepartName = undefined;
      this.emForm.innerDepartName = undefined;
    },
    // 部门改变
    draftChange(id, name, key) {
      this.emForm[key] = name.join();
    },
    // 计划所属部门改变
    planDeptChange(id, name, key) {
      this.emForm[key] = name.join();
      this.colsePlanModal();
    },
    // 取消选中的应急预案
    colsePlanModal(value) {
      this.planList = [];
      this.safeKeys = [];
      formValidator.formItemValidate(this, 'prepId', 'emForm')
    },
    // 弹框显示
    labelBtn() {
      if (!this.emForm.planDepartCode) {
        this.$antMessage.warn("请先选择计划所属部门");
        return;
      } else {
        this.formInline.eplanDepartcode = this.emForm.planDepartCode;
        this.formData.eplanDepartcode = this.emForm.planDepartCode;
      }
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
      this.selectedKeys = this.safeKeys;
      this.selectedRow = this.planList;
      this.visible = true;
      this.getPlanPageList();

    },
    getPlanPageList() {
      const params = {
        ...this.formData,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        isPlanQuery: 1
      }
      planPageList(params).then(res => {
        this.dataSource = res.data.list;
        this.page.total = res.data.total;
      }).catch(err => {
        console.log(err);
      })
    },
    // 应急预案选项改变
    onPlanChange(selectedRowKeys, selectedRows) {
      this.selectedKeys = JSON.parse(JSON.stringify(selectedRowKeys));
      this.selectedRow = JSON.parse(JSON.stringify(selectedRows));
    },
    // 应急预案弹框确定
    confirm() {
      this.planList = JSON.parse(JSON.stringify(this.selectedRow));
      this.safeKeys = JSON.parse(JSON.stringify(this.selectedKeys));
      this.visible = false;
      formValidator.formItemValidate(this, 'prepId', 'emForm')
    },
    // 关闭应急预案弹框
    closeVisible() {
      this.visible = false;
    },
    search() {
      this.formData = JSON.parse(JSON.stringify(this.formInline));
      this.getPlanPageList();
    },
    reset() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
      this.formInline = {
        eplanDepartcode: this.formInline.eplanDepartcode
      };
      this.formData = {
        eplanDepartcode: this.formInline.eplanDepartcode
      };
      this.getPlanPageList();
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      this.getPlanPageList()
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getPlanPageList()
    },
    // 文字长度
    inputValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("不能为空")
      } else if (value && value.length > 50) {
        return Promise.reject("不能超过50字")
      } else {
        callback()
      }
    },
    // 应急预案校验
    prepIdValidator(rule, value, callback) {
      if (!this.planList || this.planList.length <= 0) {
        return Promise.reject("不能为空")
      } else {
        callback()
      }
    },
    // 待办推送
    async pushTask() {
      let routePath = "/safeManage/emergencyManagement/emergencyDrillManagement/approvePlanHandle";
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + routePath + `&processId=${this.pushPara.processId}`
      if (this.pushPara.handle && this.pushPara.processId) {
        await PushTask({
          title: "应急演练推送待办",
          approval: 'emergencyManagement',
          userId: this.pushPara.handle,
          // docId: this.pushPara.processId ? this.pushPara.processId : this.pushPara.handle,
          taskId: this.pushPara.processId ? this.pushPara.processId : this.pushPara.handle,
          url: url,
          docNumber: this.emForm?.planNumber,   //业务id
          docId: this.pushPara.processId,  //主键id
        })
      }
    },
  }
}
</script>

<style lang="less" scoped>
.modal-btn {
  width: 100%;
  min-height: 38px;
  text-align: left;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  height: auto;
  overflow: hidden;
  padding-top: 2px;
  .selected-modal {
    display: inline-block;
    background: #fafafa;
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    margin-right: 4px;
    margin-bottom: 2px;
    padding: 0 4px;
  }
}
.prep-modal {
  ::v-deep .model-content-form {
    padding: 0 20px !important;
    @scrollbar-thumb: #ccc;
    @scrollbar-track: transparent;
    // 横向滚动条样式
    .ant-table-body {
      scrollbar-color: @scrollbar-thumb @scrollbar-track;
      scrollbar-width: thin;
      -ms-overflow-style: none;
      position: relative;
      overflow-x: auto;
      &::-webkit-scrollbar {
        width: 3px;
        height: 6px;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background: #ddd;
      }

      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
        border-radius: 3px;
        background: @scrollbar-track;
      }
    }
  }
}
</style>