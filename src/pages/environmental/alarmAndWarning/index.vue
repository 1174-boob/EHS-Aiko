<template>
  <div class="alarm-warning clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonDept ref="commonDept" :CommonFormInline="formInline" :hasDepartment="false" @corporationChange="corporationChange" @centerChange="centerChange"></CommonDept>
        <a-form-model-item label="污染物" v-if="tabKey=='1'">
          <a-select v-model="formInline.instrumentPollutantRelId" placeholder="请选择" allowClear :disabled="pollutantDisabled">
            <a-select-option v-for="item in wasteGasArr" :key="item.instrumentPollutantRelId" :value="item.instrumentPollutantRelId" :title="item.pollutantName">
              {{ getChemicalDictText('point_location',item.location) }}{{item.pollutantName}}
              <span v-if="item.pollutantUnit">({{ item.pollutantUnit }})</span>
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="污染物" v-if="tabKey=='2'">
          <a-select v-model="formInline.instrumentPollutantRelId" placeholder="请选择" allowClear :disabled="pollutantDisabled">
            <a-select-option v-for="item in wasteWaterArr" :key="item.instrumentPollutantRelId" :value="item.instrumentPollutantRelId" :title="item.pollutantName">
              {{ getChemicalDictText('point_location',item.location) }}{{item.pollutantName}}
              <span v-if="item.pollutantUnit">({{ item.pollutantUnit }})</span>
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="addPollutant">
          <a-icon type="plus" />新增
        </a-button>
        <a-button type="dashed" @click="pushAlarm">
          报警推送
        </a-button>
      </div>
    </DashBtn>
    <a-tabs default-active-key="1" @change="tabChange">
      <a-tab-pane key="1" tab="废气预警/报警管理">
        <AlarmWarnTable v-if="tabKey=='1'" :tableSpinning="tableSpinning" :tabKey="tabKey" :dataSource="dataSource" @getPage="getPage" @action="action"></AlarmWarnTable>
      </a-tab-pane>
      <a-tab-pane key="2" tab="废水预警/报警管理">
        <AlarmWarnTable v-if="tabKey=='2'" :tableSpinning="tableSpinning" :tabKey="tabKey" :dataSource="dataSource" @getPage="getPage" @action="action"></AlarmWarnTable>
      </a-tab-pane>
    </a-tabs>
    <CommonModal :title="title" :visible="visible" :cancelFn="cancelVisible" class="waste-gas-modal">
      <template slot="form">
        <a-form-model ref="gasForm" :model="gasForm" :rules="gasRules" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" labelAlign="left">
          <CommonDept
            ref="commonSearchItem"
            :CommonFormInline="gasForm"
            :rules="gasRules"
            :labelAlign="'left'"
            :notTablePage="true"
            :hasDepartment="false"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :disabled="disabled"
            @corporationChange="gasCorporationChange"
          ></CommonDept>
          <a-form-model-item class="flex" label="排气筒高度(米)" prop="stackHeight">
            <a-input v-model="gasForm.stackHeight" placeholder="请输入排气筒高度" allowClear :disabled="disabled"></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="污染物" prop="instrumentPollutantRelId">
            <a-select v-model="gasForm.instrumentPollutantRelId" placeholder="请选择" :disabled="gasDisabled" @change="pollutantChange">
              <a-select-option v-for="item in wasteGasModalArr" :key="item.instrumentPollutantRelId" :value="item.instrumentPollutantRelId" :title="item.pollutantName">
                {{ getChemicalDictText('point_location',item.location) }}{{item.pollutantName}}
                <span v-if="item.pollutantUnit">({{ item.pollutantUnit }})</span>
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="标准排放值" required>
            <div class="wrapper-contentNew">
              <span>浓度</span>
              <a-form-model-item class="inner-content" prop="standardConcentration">
                <a-input v-model="gasForm.standardConcentration" placeholder="请输入浓度" allowClear :disabled="disabled"></a-input>
              </a-form-model-item>
              <span>(mg/m3)</span>
            </div>
            <!-- <div class="wrapper-content">
              <span>速率</span>
              <a-form-model-item class="inner-content" prop="standardRate">
                <a-input v-model="gasForm.standardRate" placeholder="请输入浓度" allowClear :disabled="disabled"></a-input>
              </a-form-model-item>
              <span>(kg/h)</span>
            </div> -->
          </a-form-model-item>
          <a-form-model-item class="flex" label="环评中要求排放标准值" required>
            <div class="wrapper-contentNew">
              <span>浓度</span>
              <a-form-model-item class="inner-content" prop="requireConcentration">
                <a-input v-model="gasForm.requireConcentration" placeholder="请输入浓度" allowClear :disabled="disabled"></a-input>
              </a-form-model-item>
              <span>(mg/m3)</span>
            </div>
            <!-- <div class="wrapper-content">
              <span>速率</span>
              <a-form-model-item class="inner-content" prop="requireRate">
                <a-input v-model="gasForm.requireRate" placeholder="请输入浓度" allowClear :disabled="disabled"></a-input>
              </a-form-model-item>
              <span>(kg/h)</span>
            </div> -->
          </a-form-model-item>
          <a-form-model-item class="flex" label="恒值报警时间" required>
            <div class="wrapper-content">
              <a-form-model-item class="inner-content inner-input" prop="constantAlarmTime">
                <a-input v-model="gasForm.constantAlarmTime" disabled></a-input>
              </a-form-model-item>
              <span>分钟</span>
            </div>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="cancelVisible">取消</a-button>
        <a-button v-if="!disabled" type="primary" class="m-l-15" @click="gasConfirm">确定</a-button>
      </template>
    </CommonModal>
    <!-- 报警推送弹框 -->
    <CommonModal :title="'报警推送'" :visible="pushVisible" :cancelFn="cancelPushVisible" class="waste-gas-modal">
      <template slot="form">
        <a-form-model ref="pushForm" :model="pushForm" :rules="pushRules" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" labelAlign="left">
          <CommonDept
            ref="commonSearchItem"
            :CommonFormInline="pushForm"
            :rules="pushRules"
            :labelAlign="'left'"
            :notTablePage="true"
            :hasDepartment="false"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            @corporationChange="pushCorporationChange"
          ></CommonDept>
          <StaffOrDept
            :treeType="'user'"
            :propKey="'oneList'"
            :treeRoles="pushRules"
            :labelTitle="'一级报警'"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            @getTreeData="personThingOne"
            :checkedTreeNode="pushForm.oneList"
            :deptTreeId="pushForm.deptId"
          />
          <span class="ecertificateFileId-main-tishi">一级报警推送规则：发生报警立即推送</span>
          <StaffOrDept
            :treeType="'user'"
            :propKey="'twoList'"
            :treeRoles="pushRules"
            :labelTitle="'二级报警'"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            @getTreeData="personThingTwo"
            :checkedTreeNode="pushForm.twoList"
            :deptTreeId="pushForm.deptId"
          />
          <span class="ecertificateFileId-main-tishi">二级报警推送规则：发生报警24h仍未处理后推送</span>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="cancelPushVisible">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="pushConfirm">确定</a-button>
      </template>
    </CommonModal>

    <CommonModal :title="title" :visible="waterVisible" :cancelFn="cancelWaterVisible" class="waste-water-modal">
      <template slot="form">
        <a-form-model ref="waterForm" :model="waterForm" :rules="waterRules" :label-col="labelCol1" :wrapper-col="wrapperCol1" :colon="false" labelAlign="left">
          <CommonDept
            ref="commonSearchItem"
            :CommonFormInline="waterForm"
            :rules="waterRules"
            :labelAlign="'left'"
            :notTablePage="true"
            :hasDepartment="false"
            :labelCol="labelCol1"
            :wrapperCol="wrapperCol1"
            :disabled="disabled"
            @corporationChange="waterCorporationChange"
          ></CommonDept>
          <a-form-model-item class="flex" label="污染物" prop="instrumentPollutantRelId">
            <a-select v-model="waterForm.instrumentPollutantRelId" placeholder="请选择" :disabled="waterDisabled" @change="pollutantChange">
              <a-select-option v-for="item in wasteWaterModalArr" :key="item.instrumentPollutantRelId" :value="item.instrumentPollutantRelId" :title="item.pollutantName">
                {{ getChemicalDictText('point_location',item.location) }}{{item.pollutantName}}
                <span v-if="item.pollutantUnit">({{ item.pollutantUnit }})</span>
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item v-if="PH_Pollutant" class="flex" label="下限标准排放值" required>
            <div>
              <span>浓度</span>
              <a-form-model-item class="inner-content" prop="standardDown">
                <a-input v-model="waterForm.standardDown" placeholder="请输入浓度" :disabled="disabled" @blur="standardDownBlur"></a-input>
              </a-form-model-item>
              <span>(mg/m3)</span>
            </div>
          </a-form-model-item>
          <a-form-model-item class="flex" label="上限标准排放值" required>
            <div>
              <span>浓度</span>
              <a-form-model-item class="inner-content" prop="standardUp">
                <a-input v-model="waterForm.standardUp" placeholder="请输入浓度" :disabled="disabled" @blur="standardUpBlur"></a-input>
              </a-form-model-item>
              <span>(mg/m3)</span>
            </div>
          </a-form-model-item>
          <a-form-model-item v-if="PH_Pollutant" class="flex" label="下限环评中纳管标准值" required>
            <div>
              <span>浓度</span>
              <a-form-model-item class="inner-content" prop="requireDown">
                <a-input v-model="waterForm.requireDown" placeholder="请输入浓度" :disabled="disabled" @blur="requireDownBlur"></a-input>
              </a-form-model-item>
              <span>(mg/m3)</span>
            </div>
          </a-form-model-item>
          <a-form-model-item class="flex" label="上限环评中纳管标准值" required>
            <div>
              <span>浓度</span>
              <a-form-model-item class="inner-content" prop="requireUp">
                <a-input v-model="waterForm.requireUp" placeholder="请输入浓度" :disabled="disabled" @blur="requireUpBlur"></a-input>
              </a-form-model-item>
              <span>(mg/m3)</span>
            </div>
          </a-form-model-item>
          <a-form-model-item class="flex" label="恒值报警时间" prop="constantAlarmTime">
            <a-select v-model="waterForm.constantAlarmTime" placeholder="请选择" :disabled="disabled">
              <a-select-option v-for="item in time" :key="item.value" :value="item.value" :title="item.label">{{item.label}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="cancelWaterVisible">取消</a-button>
        <a-button v-if="!disabled" type="primary" class="m-l-15" @click="waterConfirm">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>

<script>
import { debounce } from 'lodash';
import { formValidator } from "@/utils/clx-form-validator.js";
import AlarmWarnTable from "./component/alarmWarnTable.vue";
import {
  gasConfigAdd,
  gasConfigPageList,
  gasConfigUpdate,
  gasConfigDelete,
  waterConfigPageList,
  waterConfigAdd,
  waterConfigUpdate,
  waterConfigDelete,
  monitorConfigAddandEdit,
  monitorConfigDetail
} from "@/services/api.js";
import { mapActions } from 'vuex'
import chemicalDict from "@/mixin/chemicalDict.js";
import StaffOrDept from "@/components/staffOrDept";
export default {
  components: { AlarmWarnTable , StaffOrDept},
  mixins: [chemicalDict],
  data() {
    return {
      tableSpinning:false,
      loading: false,
      visible: false,
      waterVisible: false,
      edit: false,
      disabled: false,
      pollutantDisabled: true,
      gasDisabled: true,
      waterDisabled: true,
      PH_Pollutant: false,
      // wasteWater: [],
      wasteWaterArr: [],
      wasteGasArr: [],
      wasteGasModalArr: [],
      wasteWaterModalArr: [],
      // wasteGas:[],
      title: '新增',
      time: [
        { value: '60', label: '1小时' },
        { value: '120', label: '2小时' },
      ],
      labelCol: { span: 6 }, // 设置左边label宽度
      wrapperCol: { span: 18 }, // 设置右边表单宽度
      labelCol1: { span: 8 }, // 设置左边label宽度
      wrapperCol1: { span: 16 }, // 设置右边表单宽度
      tabKey: '1',
      formInline: {
        instrumentPollutantRelId: undefined
      },
      formData: {},
      gasForm: { constantAlarmTime: '20' },
      pushForm: {},
      pushVisible:false,
      dataSourceReturn:{},
      changePeopleOne:false,
      changePeopleTwo:false,
      waterForm: {},
      dataSource: {
        list: [],
        total: 0
      },
      gasRules: {
        instrumentPollutantRelId: [{ required: true, message: "不能为空", trigger: ['blur', 'change'] },],
        standardConcentration: [{ required: true, validator: this.numValidator, trigger: ['blur', 'change'] },],
        // standardRate: [{ required: true, validator: this.numValidator, trigger: ['blur', 'change'] },],
        stackHeight: [{ required: true, validator: this.numValidator, trigger: ['blur', 'change'] },],
        requireConcentration: [{ required: true, validator: this.numValidator, trigger: ['blur', 'change'] },],
        // requireRate: [{ required: true, validator: this.numValidator, trigger: ['blur', 'change'] },],
        constantAlarmTime: [{ required: true, message: "不能为空", trigger: ['blur', 'change'] },],
      },
      pushRules: {
        corporationId: [
          { required: true, message: "组织不能为空", trigger: "change" }
        ],
        oneList: [
          { required: true, message: "一级报警不能为空", trigger: "change" },
        ],
        twoList: [
          { required: true, message: "二级报警不能为空", trigger: "change" },
        ],
      },
      waterRules: {
        standardDown: [{ required: true, validator: this.standardDownValidator, trigger: ['blur', 'change'] },],
        standardUp: [{ required: true, validator: this.standardUpValidator, trigger: ['blur', 'change'] },],
        instrumentPollutantRelId: [{ required: true, message: "不能为空", trigger: ['blur', 'change'] },],
        constantAlarmTime: [{ required: true, message: "不能为空", trigger: ['blur', 'change'] },],
        requireDown: [{ required: true, validator: this.requireDownValidator, trigger: ['blur', 'change'] },],
        requireUp: [{ required: true, validator: this.requireUpValidator, trigger: ['blur', 'change'] },],
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {
    pollutantOptions() {
      return this.$store.state.setting.pollutantOptions;
    },
  },
  created() {
    this.setRouterCode('alarmAndWarning')
    this.getPollutantOptions();
    this.getPageList();
  },
  methods: {
    ...mapActions("setting", ["getPollutantOptions"]),
    centerChange(centerId) {
      this.formInline.instrumentPollutantRelId = undefined;
      this.pollutantDisabled = true;
      if (this.tabKey == '1') {
        this.wasteGasArr = []
      } else {
        this.wasteWaterArr = []
      }
    },
    corporationChange(corporationId, deptId) {
      this.formInline.instrumentPollutantRelId = undefined;
      this.pollutantDisabled = false;
      if (this.tabKey == '1') {
        this.wasteGasArr = this.pollutantOptions.filter(item => {
          return item.corporationId == corporationId && item.numberPickInstrumentType == 'gas';
        })
      } else {
        this.wasteWaterArr = this.pollutantOptions.filter(item => {
          return item.corporationId == corporationId && item.numberPickInstrumentType == 'water';
        })
      }
    },
    pollutantChange(key) {
      const selectPollutant = this.pollutantOptions.find(ele => ele.instrumentPollutantRelId == key);
      console.log("key-----", key, selectPollutant);
      // if (selectPollutant.pollutantNum == "w01001") { // PH值的判定(原厂务对应的字段)
      if (selectPollutant.pollutantNum == "ph") { // PH值的判定
        this.PH_Pollutant = true;
      } else {
        this.PH_Pollutant = false;
        if (this.waterForm.standardDown || this.waterForm.requireDown) {
          delete this.waterForm.standardDown;
          delete this.waterForm.requireDown;
          this.$nextTick(() => {
            formValidator.formItemValidate(this, 'standardUp', 'waterForm')
            formValidator.formItemValidate(this, 'requireUp', 'waterForm')
          })
        }
      }
    },
    gasCorporationChange(corporationId, deptId) {
      this.$set(this.gasForm, 'instrumentPollutantRelId', undefined);
      this.gasDisabled = false;
      this.wasteGasModalArr = this.pollutantOptions.filter(item => {
        return item.corporationId == corporationId && item.numberPickInstrumentType == 'gas';
      })
    },
    // 组织机构-改变
    pushCorporationChange(val, corporationDeptId) {
      console.log('基地Id',val);
      this.changePeopleOne = false
      this.changePeopleTwo = false
      if(val){
        console.log(this.pushForm.corporationId,this.pushForm.corporationName);
        monitorConfigDetail(this.pushForm).then((res)=>{
          console.log('res',res.data);
          this.dataSourceReturn = JSON.parse(JSON.stringify(res.data))   
          this.pushForm = res.data
          this.pushForm.oneList = this.pushForm.oneList.map(item => item.userId)
          this.pushForm.twoList = this.pushForm.twoList.map(item => item.userId)
        }).catch((err)=>{
          console.log(err);
        }).finally(()=>{
        })
      }
    },
    waterCorporationChange(corporationId, deptId) {
      this.$set(this.waterForm, 'instrumentPollutantRelId', undefined);
      this.waterDisabled = false;
      this.PH_Pollutant = false;
      this.wasteWaterModalArr = this.pollutantOptions.filter(item => {
        return item.corporationId == corporationId && item.numberPickInstrumentType == 'water';
      })
    },
    tabChange(key) {
      this.tabKey = key;
      if (key == '1') {
        this.wasteGasArr = []
      } else {
        this.wasteWaterArr = []
      }
      this.pollutantDisabled = true;
      this.dataSource = {
        list: [],
        total: 0
      };
      this.iRest();
    },
    getPageList() {
      const params = {
        ...this.formData,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo
      }
      this.tableSpinning = true
      const api = this.tabKey == '1' ? gasConfigPageList : waterConfigPageList;
      api(params)
      .then(res => {
        this.dataSource = res.data;
      })
      .catch(err => {
        console.log(err);
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    getPage(page) {
      this.page = page;
      this.getPageList();
    },
    action(record, code) {
      this.disabled = false;
      if (code == 'edit') {
        this.edit = true;
        this.title = '编辑';
        if (this.tabKey == '1') {
          this.visible = true;
          this.gasDisabled = false;
          
          this.$nextTick(()=>{
            this.gasForm = { ...record };
            this.gasForm.constantAlarmTime = '20';
            this.wasteGasModalArr = this.pollutantOptions.filter(item => {
              return item.corporationId == this.gasForm.corporationId && item.numberPickInstrumentType == 'gas';
            })
            this.pollutantChange(this.gasForm.instrumentPollutantRelId);
          })
        } else {
          this.waterVisible = true;
          this.waterDisabled = false;
          
          this.$nextTick(()=>{
            this.waterForm = { ...record };
            this.wasteWaterModalArr = this.pollutantOptions.filter(item => {
              return item.corporationId == this.waterForm.corporationId && item.numberPickInstrumentType == 'water';
            })
          })
          this.pollutantChange(this.waterForm.instrumentPollutantRelId);
        }
      } else if (code == 'preview') {
        this.title = '查看';
        this.disabled = true;
        if (this.tabKey == '1') {
          this.visible = true;
          this.gasDisabled = true;
          this.$nextTick(()=>{
            this.gasForm = { ...record };
            this.wasteGasModalArr = this.pollutantOptions.filter(item => {
              return item.corporationId == this.gasForm.corporationId && item.numberPickInstrumentType == 'gas';
            })
          })
        } else {
          this.waterVisible = true;
          this.waterDisabled = true;
          this.$nextTick(()=>{
            this.waterForm = { ...record };
            this.wasteWaterModalArr = this.pollutantOptions.filter(item => {
              return item.corporationId == this.waterForm.corporationId && item.numberPickInstrumentType == 'water';
            })
          })
          this.pollutantChange(this.waterForm.instrumentPollutantRelId);
        }
      } else if (code == 'delete') {
        if (this.tabKey == '1') {
          const gasId = record.gasId;
          this.$antConfirm({
            content: '确认删除？',
            cancelText: '取消',
            onOk: () => {
              gasConfigDelete({ gasId }).then(res => {
                this.$antMessage.success('删除成功');
                this.getPageList();
              }).catch(err => {
                console.log(err);
              })
            },
          });
        } else {
          const waterId = record.waterId;
          this.$antConfirm({
            content: '确认删除？',
            cancelText: '取消',
            onOk: () => {
              waterConfigDelete({ waterId }).then(res => {
                this.$antMessage.success('删除成功');
                this.getPageList();
              }).catch(err => {
                console.log(err);
              })
            },
          });
        }
      }
    },
    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formData = JSON.parse(JSON.stringify(this.formInline))
      this.getPageList();
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.$refs.commonDept.reset();
      this.formInline = { instrumentPollutantRelId: undefined };
      this.formData = {};
      this.wasteGasArr = [];
      this.wasteWaterArr = [];
      this.pollutantDisabled = true;
      this.getPageList();
    }, 250, { leading: true, trailing: false }),
    // 新增
    addPollutant() {
      this.title = '新增';
      if (this.tabKey == '1') {
        this.visible = true;
        this.gasDisabled = true;
      } else {
        this.waterVisible = true;
        this.waterDisabled = true;
        this.PH_Pollutant = false;
      }
    },
    pushAlarm(){
      this.pushVisible = true
      this.pushForm = {}
    },
    cancelPushVisible(){
      this.pushVisible = false
    },
    pushConfirm() {
      if (!formValidator.formAll(this, 'pushForm')) {
        return;
      }
      console.log('this.dataSourceReturn',this.dataSourceReturn);

      if (this.changePeopleOne && !this.changePeopleTwo){  // 一级改了 二级没改 应该是取二级的
        this.pushForm.twoList = this.dataSourceReturn.twoList
      } 
      if (!this.changePeopleOne && this.changePeopleTwo){  // 二级改了 一级没改 应该是取一级的
        this.pushForm.oneList = this.dataSourceReturn.oneList
      }
      if (!this.changePeopleOne && !this.changePeopleTwo){  // 两个都没改
        this.pushForm.oneList = this.dataSourceReturn.oneList
        this.pushForm.twoList = this.dataSourceReturn.twoList
      }
      // if (!this.changePeopleTwo){
      //   this.pushForm.twoList = this.dataSourceReturn.twoList
      // } 
      console.log('涨钱',this.pushForm);
      monitorConfigAddandEdit(this.pushForm).then((res)=>{
        console.log('res',res);
        this.$antMessage.success("操作成功!");
        this.pushVisible = false
      }).catch((err)=>{
        console.log(err);
      }).finally(()=>{

      })
    },
    //一级报警
    personThingOne(data) {
      console.log('1111');
      this.changePeopleOne = true
      let arr = data.treeNameAndCodeList || [];
      let brr = [];
      for (let i = 0; i < arr.length; i++) {
        brr.push({
          userId: arr[i].id,
          userName: arr[i].treeName,
          userJobNumber: arr[i].treeCode,
        });
      }
      this.pushForm.oneList = [...brr]; // 传给后端得数据
    },
    //二级报警
    personThingTwo(data) {
      console.log('2222');
      this.changePeopleTwo = true
      let arr = data.treeNameAndCodeList || [];
      let brr = [];
      // console.log('obj.treeNameAndCodeList@SH',data.treeNameAndCodeList);
      for (let i = 0; i < arr.length; i++) {
        // console.log('arr[i]',arr[i]);
        brr.push({
          userId: arr[i].id,
          userName: arr[i].treeName,
          userJobNumber: arr[i].treeCode,
        });
      }
      this.pushForm.twoList = [...brr]; // 传给后端得数据
    },
    //获取name
    getName(list) {
      let listName = [];
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          listName.push(list[i].treeName);
        }
      }
      return listName;
    },
    //获取工号
    getWorkNum(list) {
      let listName = [];
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          listName.push(list[i].treeCode);
        }
      }
      return listName;
    },
    cancelVisible() {
      this.visible = false;
      this.edit = false;
      this.gasForm = { constantAlarmTime: '20' };
      setTimeout(() => {
        this.disabled = false;
      }, 300);
    },
    cancelWaterVisible() {
      this.waterVisible = false;
      this.edit = false;
      this.waterForm = {};
      setTimeout(() => {
        this.disabled = false;
      }, 300);
    },
    gasConfirm() {
      if (!formValidator.formAll(this, 'gasForm')) {
        return;
      }
      const api = this.edit ? gasConfigUpdate : gasConfigAdd;
      api(this.gasForm).then(res => {
        this.$antMessage.success("操作成功");
        this.edit = false;
        this.cancelVisible();
        this.getPageList();
      }).catch(err => {
        console.log(err);
      })
    },
    waterConfirm() {
      if (!formValidator.formAll(this, 'waterForm')) {
        return;
      }
      const api = this.edit ? waterConfigUpdate : waterConfigAdd;
      api(this.waterForm).then(res => {
        this.$antMessage.success("操作成功");
        this.edit = false;
        this.cancelWaterVisible();
        this.getPageList();
      }).catch(err => {
        console.log(err);
      })
    },
    standardUpBlur() {
      formValidator.formItemValidate(this, 'standardDown', 'waterForm')
    },
    standardDownBlur() {
      formValidator.formItemValidate(this, 'standardUp', 'waterForm')
    },
    requireDownBlur() {
      formValidator.formItemValidate(this, 'requireUp', 'waterForm')
    },
    requireUpBlur() {
      formValidator.formItemValidate(this, 'requireDown', 'waterForm')
    },
    requireDownValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("不能为空")
      } else if (!/^([1-9][\d]*|0)(\.[\d]+)?$/.test(value)) {
        return Promise.reject("请输入数字")
      } else if (this.waterForm.requireUp && Number(value) >= Number(this.waterForm.requireUp)) {
        return Promise.reject("需小于上限环评中纳管标准值")
      } else {
        callback()
      }
    },
    standardDownValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("不能为空")
      } else if (!/^([1-9][\d]*|0)(\.[\d]+)?$/.test(value)) {
        return Promise.reject("请输入数字")
      } else if (this.waterForm.standardUp && Number(value) >= Number(this.waterForm.standardUp)) {
        return Promise.reject("需小于上限标准排放值")
      } else {
        callback()
      }
    },
    requireUpValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("不能为空")
      } else if (!/^([1-9][\d]*|0)(\.[\d]+)?$/.test(value)) {
        return Promise.reject("请输入数字")
      } else if (Number(value) <= Number(this.waterForm.requireDown)) {
        return Promise.reject("需大于下限环评中纳管标准值")
      } else {
        callback()
      }
    },
    standardUpValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("不能为空")
      } else if (!/^([1-9][\d]*|0)(\.[\d]+)?$/.test(value)) {
        return Promise.reject("请输入数字")
      } else if (Number(value) <= Number(this.waterForm.standardDown)) {
        return Promise.reject("需大于下限标准排放值")
      } else {
        callback()
      }
    },
    numValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("不能为空")
      } else if (!/^([1-9][\d]*|0)(\.[\d]+)?$/.test(value)) {
        return Promise.reject("请输入数字")
      } else {
        callback()
      }
    },
  }
}
</script>

<style lang="less" scoped>
.waste-gas-modal {
  ::v-deep .ant-modal-content {
    .model-content-form {
      padding: 0 80px !important;
    }
  }
}
.ecertificateFileId-main-tishi {
    font-size: 12px;
    color: #999;
    display: block;
    line-height: 16px;
    margin-top: -18px;
    margin-bottom: 12px;
    margin-left: 163px;
  }
.waste-water-modal {
  ::v-deep .ant-modal-content {
    .model-content-form {
      padding: 0 100px !important;
    }
  }
  .inner-content {
    width: 60%;
  }
}

.wrapper-content {
  display: inline-block;
  width: 50%;
  .inner-content {
    width: 50%;
  }
}
.wrapper-contentNew {
  display: inline-block;
  width: 100%;
  .inner-content {
    width: 50%;
  }
}
.inner-content {
  display: inline-block;
  margin: 0 10px;
  height: 40px;
}
.inner-input {
  margin-left: 0 !important;
}
@media screen and (max-width: 1366px) {
  .waste-water-modal {
    ::v-deep .ant-modal-content {
      .model-content-form {
        padding: 0 60px !important;
      }
    }
  }
  .wrapper-content {
    display: block;
    width: 100%;
  }
  .inner-content {
    width: 60%;
  }
}
</style>