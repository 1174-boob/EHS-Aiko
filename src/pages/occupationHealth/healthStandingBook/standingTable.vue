<template>
  <div>
    <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="dataSource" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="time" slot-scope="record">
          {{record.startTime?record.startTime.join('-'):'--'}} 至 {{record.endTime?record.endTime.join('-'):'--'}}
        </div>
        <template slot="checkResult" slot-scope="record">
          <span v-if="record.checkResult=='normal' || record.checkResult=='radiationWork'" style="color: #02DFAD">{{checkResultDict[record.checkResult]}}</span>
          <span v-else style="color: #FF1212">{{checkResultDict[record.checkResult]}}</span>
        </template>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" v-if="record.checkStatus=='notCheck'" @click="cancelReservation(record)">取消预约</span>
          <span class="color-0067cc cursor-pointer" v-else-if="record.checkStatus=='checked'" @click="downloadPPT(record.checkFileData)">体检报告</span>
          <span class="color-0067cc cursor-pointer" v-else>--</span>
        </div>
      </a-table>
    </CommonTable>
    <CommonModal title="取消体检预约" :visible="reservationVisible" :cancelFn="reservationCancel">
      <template slot="form">
        <a-form-model
          ref="reservationForm"
          :model="reservationForm"
          :rules="reservationRules"
          :label-col="{ style: { width: '120px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 120px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="请输入取消原因" prop="cause">
            <a-textarea
              v-model="reservationForm.cause"
              placeholder="请输入取消原因"
              :auto-size="{ minRows: 4, maxRows: 6 }"
            />
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="reservationCancel">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="reservationConfirm">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import dictionary from '@/utils/dictionary';
import { formValidator } from "@/utils/clx-form-validator.js";
import {
  selectDiagnosis,
  selectMedical,
  selectExposure,
  checkHealthHistory,
  checkCancel,
  selectUserPost,
  ppeReceiveList,
} from "@/services/api.js";
export default {
  mixins: [teableCenterEllipsis],
  props: {
    tabKey: {
      type: String || Number,
      default: '1'
    },
    id: {
      type: String || Number,
      default: null
    }
  },
  data() {
    return {
      checkDict: {},
      healthyDict: {},
      universalDict: {},
      checkResultDict: {},
      checkStatusDict: {},
      ppeTypeDict: {},
      useTypeDict: {},
      ppeUnitDict: {},
      postApplyDict: {},
      postReasonDict: {}, //调岗原因字典
      quitReasonDict: {}, //离岗原因字典
      reservationVisible: false,
      checkId: null,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      dataSource:[],
      reservationForm: {},
      // dataSource1:[
      //   {time:'2022-12-11-2022-12-12',status:"1"},
      //   {time:'2022-12-11-2022-12-12',status:"2"},
      //   {time:'2022-12-11-2022-12-12',status:"23"},
      // ],
      outComeDict: {},
      columns:[],
      columns1:[
        {
          title: "序号",
          width: 100,
          align:"center",
          customRender: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: "体检日期",
          dataIndex: "checkDate",
          key: "checkDate",
          width: 200,
          align:"center",
          scopedSlots: { customRender: "checkDate" },
        },
        {
          title: "体检类型",
          dataIndex: "checkType",
          key: "checkType",
          width: 200,
          align:"center",
          customRender: (text, record, index) => {
            return this.checkDict[text] ? this.checkDict[text]:'--'
          },
        },
        {
          title: "接触危害",
          dataIndex: "exposureHazard",
          key: "exposureHazard",
          width: 200,
          align:"center",
          customRender: (text, record, index) => {
            return text ? text :'--'
          },
        },
        {
          title: "体检机构",
          dataIndex: "checkAgency",
          key: "checkAgency",
          width: 200,
          align:"center",
          customRender: (text, record, index) => {
            return this.healthyDict[text] ? this.healthyDict[text]:'--'
          },
        },
        {
          title: "是否构成职业病",
          dataIndex: "isSick",
          key: "isSick",
          width: 200,
          align:"center",
          customRender: (text, record, index) => {
            return this.universalDict[text] ? this.universalDict[text]:'--'
          },
        },
        {
          title: "体检提醒时间",
          dataIndex: "checkTellDate",
          key: "checkTellDate",
          width: 200,
          align:"center",
          customRender: (text, record, index) => {
            return text ? text :'--'
          },
        },
        {
          title: "体检状态",
          dataIndex: "checkStatus",
          key: "checkStatus",
          width: 200,
          align:"center",
          customRender: (text, record, index) => {
            return this.checkStatusDict[text] ? this.checkStatusDict[text]:'--'
          },
        },
        {
          title: "体检结论",
          // dataIndex: "checkResult",
          key: "checkResult",
          width: 200,
          align:"center",
          scopedSlots: { customRender: "checkResult" },
          // customRender: (text, record, index) => {
          //   return this.checkResultDict[text] ? this.checkResultDict[text]:'--'
          // },
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right",
          align:"center",
          width: 200
        }
      ],
      // dataSource2: [],
      columns2:[
      {
          title: "序号",
          width: 100,
          align:"center",
          customRender: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: "起止时间",
          key: "time",
          align:"center",
          scopedSlots: { customRender: "time" },
        },
        {
          title: "部门",
          dataIndex: "departmentName",
          key: "departmentName",
          align:"center",
        },
        {
          title: "岗位",
          dataIndex: "postName",
          key: "postName",
          align:"center",
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "接触职业病危害因素",
          dataIndex: "hazardFactors",
          key: "hazardFactors",
          align:"center",
        },
        // {
        //   title: "防护措施",
        //   dataIndex: "protectiveMeasures",
        //   key: "protectiveMeasures",
        //   align:"center",
        // },
      ],
      // dataSource3:[],
      columns3:[
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
          align:'center',
          customRender: (text, record, index) => {
            return this.outComeDict[text] ? this.outComeDict[text]:'--'
          },
        },
        {
          title: "备注",
          dataIndex: "remarks",
          key: "remarks",
          align:'center',
        },
      ],
      // dataSource4:[],
      columns4:[
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
      ],
      // dataSource5:[],
      columns5:[
        {
          title: "序号",
          width: 100,
          align:"center",
          customRender: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: "申请时间",
          dataIndex: "applicationTime",
          key: "applicationTime",
          align:'center',
        },
        {
          title: "变岗形式",
          dataIndex: "variation",
          key: "variation",
          align:'center',
          customRender: (text, record, index) => {
            return this.postApplyDict[text] ? this.postApplyDict[text]:'--'
          },
        },
        {
          title: "变岗原因",
          dataIndex: "transfer",
          key: "transfer",
          align:'center',
          customRender: (text, record, index) => {
            return record.variation == 'quit_post' ? this.quitReasonDict[text] :this.postReasonDict[text]
          },
        },
        {
          title: "部门",
          dataIndex: "deptName",
          key: "deptName",
          align:'center',
        },
        {
          title: "调整前岗位名称",
          dataIndex: "originalPositionName",
          key: "originalPositionName",
          align:'center',
        },
        {
          title: "调整后岗位名称",
          dataIndex: "afterAdjustment",
          key: "afterAdjustment",
          align:'center',
        },
        {
          title: "变岗提醒时间",
          dataIndex: "approvalTime",
          key: "approvalTime",
          align:'center',
        },
      ],
      columns6:[
        {
          title: "序号",
          width: 100,
          align:"center",
          customRender: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: "PPE类型",
          dataIndex: "ppeType",
          key: "ppeType",
          align:'center',
          customRender: (text, record, index) => {
            return this.ppeTypeDict[text] ? this.ppeTypeDict[text]:'--'
          },
        },
        {
          title: "名称",
          dataIndex: "materialName",
          key: "materialName",
          align:'center',
        },
        {
          title: "数量",
          dataIndex: "receiveAmount",
          key: "receiveAmount",
          align:'center',
        },
        {
          title: "单位",
          dataIndex: "unit",
          key: "unit",
          align:'center',
          customRender: (text, record, index) => {
            return this.ppeUnitDict[text] ? this.ppeUnitDict[text]:'--'
          },
        },
        {
          title: "使用方式",
          dataIndex: "useType",
          key: "useType",
          align:'center',
          customRender: (text, record, index) => {
            return this.useTypeDict[text] ? this.useTypeDict[text]:'--'
          },
        },
        {
          title: "领用日期",
          dataIndex: "finalTime",
          key: "finalTime",
          align:'center',
        },
      ]
    }
  },
  watch: {
    tabKey: {
      handler(key) {
        this.timer = setInterval(() => {
          if(this.id) {
            this.getTableDetail(key);
            clearInterval(this.timer)
          }
        }, 100);
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    reservationRules() {
      let reservationRules = {
        cause: [
          { required: true, message:"不能为空", trigger: ['blur', 'change'] },
        ],
      }
      return reservationRules
    },
  },
  created() {
    this.initDict();
  },
  mounted() {
  },
  methods: {
    initDict() {
      const checkType = dictionary('healthCheckType');
      checkType.forEach(item=>{
        this.$set(this.checkDict,item.key,item.value);
      });
      // 是否职业病
      const universal = dictionary('universal');
      universal.forEach(item=>{
        this.$set(this.universalDict,item.key,item.value);
      });
      // 体检状态
      const checkStatus = dictionary('checkStatus');
      checkStatus.forEach(item=>{
        this.$set(this.checkStatusDict,item.key,item.value);
      });
      // 体检结论
      const checkResult = dictionary('checkResult');
      checkResult.forEach(item=>{
        this.$set(this.checkResultDict,item.key,item.value);
      });
      const postApply = dictionary('post_apply'); // 变岗形式
      postApply.forEach(ele => {
        this.$set(this.postApplyDict, ele.key, ele.value)
      });
      console.log("iiii---ii--",postApply,this.postApplyDict);
      const postReason = dictionary('change_post_reason') //调岗原因
      postReason.forEach(ele => { //调岗原因
        this.$set(this.postReasonDict, ele.key, ele.value)
      });
      const quitReason = dictionary('quit_reason') //离岗原因
      quitReason.forEach(ele => { //离岗原因
        this.$set(this.quitReasonDict, ele.key, ele.value)
      });
      // ppe使用方式
      const useType = dictionary('ppeUseType');
      useType.forEach(item=>{
        this.$set(this.useTypeDict,item.key,item.value);
      });
      // 治疗结果
      const outcome = dictionary('outcome');
      outcome.forEach(ele => {
        this.$set(this.outComeDict, ele.key, ele.value)
      });
      // 体检机构
      const dict = this.$store.state.setting.dictTypeData;
      const healthy = dict.find(item => {
        return item.dictType == 'healthy_institution';
      });
      healthy.dictItem.forEach(ele => {
        this.$set(this.healthyDict, ele.dictValue, ele.dictLabel)
      });
      // ppe类型
      const ppeType = dict.find(item => {
        return item.dictType == 'PPE_type';
      });
      ppeType.dictItem.forEach(ele => {
        this.$set(this.ppeTypeDict, ele.dictValue, ele.dictLabel)
      });
      // ppe单位
      const ppeUnit = dict.find(item => {
        return item.dictType == 'PPE_unit';
      });
      ppeUnit.dictItem.forEach(ele => {
        this.$set(this.ppeUnitDict, ele.dictValue, ele.dictLabel)
      });
    },
    getTableDetail(key) {
      this.columns = this['columns'+key];
      if(key=='1') {
        this.getHealthHistory();
      } else if(key=='2') {
        this.getExposure();
      } else if(key=='3') {
        this.getMedical();
      } else if(key=='4') {
        this.getDiagnosis();
      } else if(key == '5') {
        this.getUserPost();
      } else {
        this.getPPEList();
      }
    },
    async getHealthHistory() {
      const params = {
        personId:this.id,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }
      const data = await checkHealthHistory(params);
      this.dataSource = data.data.list;
      this.page.total = data.data.total;
    },
    // 职业病史列表
    async getExposure() {
      const params = {
        id:this.id,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }
      const data = await selectExposure(params);
      this.dataSource = data.data.list;
      this.page.total = data.data.total;
    },
    // 关联既往病史列表
    async getMedical() {
      const params = {
        id: this.id,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }
      const data = await selectMedical(params);
      this.dataSource = data.data.list;
      this.page.total = data.data.total;
    },
    // 职业病诊断表
    async getDiagnosis() {
      const params = {
        id: this.id,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }
      const data = await selectDiagnosis(params);
      this.dataSource = data.data.list;
      this.page.total = data.data.total;
    },
    // 调岗记录表
    async getUserPost() {
      const params = {
        id: this.id,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }
      const data = await selectUserPost(params);
      this.dataSource = data.data.list;
      this.page.total = data.data.total;
    },
    // 调岗记录表
    async getPPEList() {
      const params = {
        userId: this.id,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }
      const data = await ppeReceiveList(params);
      this.dataSource = data.data.list;
      this.page.total = data.data.total;
    },
    // 下载报告
    downloadPPT(data) {
      const url = data[0].filePath;
      window.location.href = url;
    },
    reservationCancel() {
      this.reservationVisible = false;
    },
    reservationConfirm() {
      if (!formValidator.formAll(this, 'reservationForm')) {
        return;
      }
      const params = {
        ...this.reservationForm,
        personId: this.id,
        checkId: this.checkId
      }
      checkCancel(params).then(res=>{
        this.reservationForm.cause = "";
        this.$antMessage.success(res.message);
        this.reservationVisible = false;
        this.getTableDetail(this.tabKey);
      }).catch(err=>{
        console.log(err);
      })
    },
    // 取消预约
    cancelReservation(record) {
      console.log(record);
      this.checkId = record.checkId
      this.reservationVisible = true;
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      this.getTableDetail(this.tabKey);
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getTableDetail(this.tabKey);
    },
  }
}
</script>

<style>

</style>