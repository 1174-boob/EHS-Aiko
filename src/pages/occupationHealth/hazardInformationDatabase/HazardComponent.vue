<template>
  <div class="hazard">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="tabKey == 2 ? true : false"></CommonSearchItem>
        <a-form-model-item label="岗位" v-if="tabKey==2">
          <a-input v-model.trim="formInline.jobName" placeholder="请输入岗位" />
        </a-form-model-item>
        <a-form-model-item label="危害因素">
          <a-input v-model.trim="formInline.harmFactorName" placeholder="请输入危害因素" />
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="hazardSearch">查询</a-button>
          <a-button @click="hazardRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="hazardJobAdd">
          <a-icon type="plus" />新建
        </a-button>
      </div>
      <div>
        <UploadBtnStyle
          :action="action"
          :showAcceptText="false"
          :accept="['.xlsx', '.xls',]"
          :showUploadList="false"
          :btnText="'批量导入'"
          :btnType="'primary'"
          :btnIcon="false"
          @handleSuccess="handleSuccess"
        ></UploadBtnStyle>
        <a-button type="primary" class="btn" @click="templateDownload" :loading="templateLoad">下载模板</a-button>
        <a-button type="primary" class="btn" @click="exportAll">批量导出</a-button>
      </div>
    </DashBtn>
    <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="dataSource" :rowKey="(record, index)=>{return index}" :pagination="false">
        <template slot="checkProjectId" slot-scope="record">
          <span :title="record.checkProjectId | checkProjectFilter">{{record.checkProjectId | checkProjectFilter}}</span>
        </template>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="hazardEdit(record)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="hazardDelete(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>

    <CommonModal :title="hazardTitle" :visible="hazardVisible" :cancelFn="hazardCancel">
      <template slot="form">
        <a-form-model
          ref="hazardForm"
          :model="hazardForm"
          :rules="hazardFormRules"
          :label-col="{ style: { width: '100px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 100px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <CommonDept
            ref="commonDept"
            :CommonFormInline="hazardForm"
            :rules="hazardFormRules"
            :labelAlign="'left'"
            :notTablePage="true"
            :hasDepartment="true"
            @corporationChange="corporationChange"
            @corporationDeptChange="corporationDeptChange"
          ></CommonDept>
          <a-form-model-item v-if="tabKey==2" class="flex" label="部门" prop="deptId">
            <dept-tree :placeholder="'请选择部门'" v-model="hazardForm.deptId" :deptData="deptData" @change="(id,name)=>draftChange(id,name,'deptName')" allowClear></dept-tree>
          </a-form-model-item>
          <a-form-model-item class="flex" label="岗位" prop="jobName" v-if="tabKey==2">
            <a-input v-model.trim="hazardForm.jobName" placeholder="该岗位输入后跟部门关联" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="建议PPE" prop="recommendationsPPE" v-if="tabKey==2">
            <a-input v-model.trim="hazardForm.recommendationsPPE" placeholder="请输入建议PPE" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="职业危害因素" prop="hazardous" v-if="tabKey==2">
            <div style="width:300px;height:30px;color:#999">以下化学类和物理类至少需要填写一项</div>
          </a-form-model-item>
          <a-form-model-item class="flex" label="化学类" v-if="tabKey==2">
            <a-button class="modal-btn" @click="harmBtn('2')">
              <div class="selected-modal" v-for="item of chemicalHarmArr" :key="item.value">
                {{item.label}}&nbsp;
                <!-- <a-icon type="close-circle" />; -->
              </div>
            </a-button>
            <!-- <a-textarea
              placeholder="输入化学类职业病危害因素，如没有，填无"
              v-model="hazardForm.chemicalHarm"
              :auto-size="{ minRows: 2, maxRows: 6 }"
            />-->
          </a-form-model-item>
          <a-form-model-item class="flex" label="物理类" v-if="tabKey==2">
            <a-button class="modal-btn" @click="harmBtn('1')">
              <div class="selected-modal" v-for="item of physicalHarmArr" :key="item.value">
                {{item.label}}&nbsp;
                <!-- <a-icon type="close-circle" />; -->
              </div>
            </a-button>
            <!-- <a-textarea
              placeholder="输入物理类职业病危害因素，如没有，填无"
              v-model="hazardForm.physicalHarm"
              :auto-size="{ minRows: 2, maxRows: 6 }"
            />-->
          </a-form-model-item>
          <a-form-model-item class="flex" label="危害因素" prop="harmFactorName" v-if="tabKey==1">
            <a-input v-model.trim="hazardForm.harmFactorName" placeholder="请输入危害因素" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="类别" prop="harmType" v-if="tabKey==1">
            <a-select v-model="hazardForm.harmType" placeholder="请选择类别" allowClear>
              <a-select-option v-for="item in harmTypes" :value="item.value" :key="item.value">{{item.label}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="健康危害" prop="healthHarm" v-if="tabKey==1">
            <a-textarea placeholder="请输入健康危害" v-model="hazardForm.healthHarm" :auto-size="{ minRows: 2, maxRows: 6 }" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="体检项目" prop="checkProjectId" v-if="tabKey==1">
            <a-select v-model="hazardForm.checkProjectId" placeholder="请选择体检项目" show-search mode="multiple" :filter-option="filterOption" allowClear>
              <a-select-option v-for="item in inspection_items" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="标准值" prop="standard" v-if="tabKey==1">
            <a-textarea placeholder="请输入标准值" v-model="hazardForm.standard" :auto-size="{ minRows: 2, maxRows: 6 }" />
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="hazardCancel">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="hazardConfirm" :loading="hazardLoading">确定</a-button>
      </template>
    </CommonModal>
    <CommonModal title="新增" :visible="damageVisible" :cancelFn="cancelDamage" class="principal-dialog">
      <div class="principal-content">
        <div class="left">
          <div class="title-content">
            <div class="title">选中的{{chemicalHarmTitle}}危害因素</div>
            <span class="color-ff4d4f cursor-pointer" @click="clearDanage">清空</span>
          </div>
          <ul>
            <li v-for="item of damageSelected" :key="item.value">
              <div class="name">{{item.label}}</div>
              <span class="color-ff4d4f cursor-pointer" @click="deleteDanage(item.value)">删除</span>
            </li>
          </ul>
        </div>
        <div class="right">
          <div class="title-content">{{chemicalHarmTitle}}危害因素</div>
          <div class="checkbox-group">
            <a-input placeholder="支持按危害因素名称模糊搜索" @change="damageBlur" />
            <!-- <a-checkbox-group
              v-model="damageValue"
              name="checkboxgroup"
              :options="factorList"
              @change="damageChange"
            />-->
            <a-checkbox v-for="item of factorList" :key="item.value" :checked="damageValue.indexOf(item.value) >=0" @change="(e)=>{factorChange(e.target.checked,item.value)}">{{item.label}}</a-checkbox>
          </div>
        </div>
      </div>
      <template slot="btn">
        <a-button @click="cancelDamage">取消</a-button>
        <a-button class="m-l-15" type="primary" @click="confirmDamage">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>

<script>
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue';
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import serviceNameList from '@/config/default/service.config.js'
import { formValidator } from "@/utils/clx-form-validator.js";
import lodash from 'lodash'
import {
  stationPageList,
  stationAdd,
  stationEdit,
  stationDelete,
  stationExport,
  factorPageList,
  factorAdd,
  factorEdit,
  factorDelete,
  factorTemplateExport,
  factorExport,
  harmFactorAll,
} from "@/services/api.js";
let that;
export default {
  mixins: [teableCenterEllipsis],
  components: {
    UploadBtnStyle,
    OrganizeLazyTree
  },
  props: {
    tabKey: {
      type: String || Number,
      default: '1'
    }
  },
  data() {
    return {
      damageVisible: false,
      hazardTitle: '新增',
      chemicalHarmTitle: '化学类',
      hazardVisible: false,
      loading: false,
      hazardLoading: false,
      templateLoad: false,
      deptData: [],
      // 导入文件地址
      action: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.health}/api/ehs/harm/factor/upload`,
      formInline: {

      },
      hazardObj: {},
      hazardForm: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      damageValue: [],
      damageKeys: [],
      damageSelected: [],
      harmTypes: [
        { value: '1', label: '物理类' },
        { value: '2', label: '化学类' },
      ],
      factorList: [],
      factorAll: [],
      harmFactorList: [],
      inspectionItemsDict: {},
      corporationDict: {},
      dataSource: [],
      physicalHarmArr: [],
      chemicalHarmArr: [],
      columns: [],
      columns1: [
        {
          title: "序号",
          width: 100,
          align: "center",
          customRender: (text, record, index) => {
            return index + 1;
          },
        },
        {
          title: "危害因素",
          dataIndex: "harmFactorName",
          key: "harmFactorName",
          width: 200,
        },
        {
          title: "类别",
          dataIndex: "harmType",
          key: "harmType",
          width: 200,
          customRender: (text, record, index) => {
            return text == '1' ? '物理类' : text == '2' ? '化学类' : '--'
          },
        },
        {
          title: "健康危害",
          dataIndex: "healthHarm",
          key: "healthHarm",
          width: 500,
        },
        {
          title: "体检项目",
          // dataIndex: "checkProjectId",
          key: "checkProjectId",
          width: 300,
          ellipsis: true,
          scopedSlots: { customRender: 'checkProjectId' },
        },
        {
          title: "标准值",
          dataIndex: "standard",
          key: "standard",
          width: 200,
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right',
          width: 200
        },
      ],
      columns2: [
        {
          title: "序号",
          width: 100,
          align: "center",
          customRender: (text, record, index) => {
            return index + 1;
          },
        },
        // {
        //   title: "组织",
        //   dataIndex: "corporationId",
        //   key: "corporationId",
        //   width: 200,
        //   customRender: (text, record, index) => {
        //     return this.corporationDict[text] ? this.corporationDict[text] : "--";
        //   },
        // },
        // {
        //   title: "部门",
        //   dataIndex: "deptName",
        //   key: "deptName",
        //   width: 200,
        // },
        {
          title: "岗位",
          dataIndex: "jobName",
          key: "jobName",
          width: 200,
        },
        {
          title: "化学类职业病危害因素",
          dataIndex: "chemicalHarm",
          key: "chemicalHarm",
          width: 300,
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "物理类职业病危害因素",
          dataIndex: "physicalHarm",
          key: "physicalHarm",
          width: 300,
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "建议PPE",
          dataIndex: "recommendationsPPE",
          key: "recommendationsPPE",
          width: 200,
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right',
          width: 200
        },
      ]
    }
  },
  computed: {
    inspection_items() { //从字典组里获取体检项目数据
      const dict = this.$store.state.setting.dictTypeData;
      const hazard = dict.find(item => {
        return item.dictType == 'inspection_items';
      });
      hazard.dictItem.forEach(ele => {
        this.$set(this.inspectionItemsDict, ele.dictValue, ele.dictLabel)
      });
      return hazard.dictItem;
    },
    corporationList() {
      const corporationList = this.$store.state.setting.corporationList;
      corporationList.forEach(ele => {
        this.$set(this.corporationDict, ele.corporationId, ele.orgAbbrName);
      });
      return corporationList;
    },
    hazardFormRules() {
      const hazardFormRules = {
        corporationId: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
        ],
        deptId: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
        ],
        jobName: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
        ],
        hazardous: [
          { required: true, validator: this.hazardousValidator, trigger: ['blur', 'change'] },
        ],
        harmFactorName: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
        ],
        harmType: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
        ],
        healthHarm: [
          { required: true, validator: this.textareaValidator, trigger: ['blur', 'change'] },
        ],
        checkProjectId: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
        ],
        standard: [
          { required: true, validator: this.textareaValidator, trigger: ['blur', 'change'] },
        ],
      }
      return hazardFormRules;
    }
  },
  watch: {
    tabKey: {
      handler(key) {
        this.getHazardDetail(key);
      },
      immediate: true,
      deep: true
    },
  },
  beforeCreate() {
    that = this;
  },
  filters: {
    checkProjectFilter(value) {
      if (value) {
        const inspect = value.split(",");
        let label = '';
        inspect.forEach(item => {
          let val = that.inspectionItemsDict[item] + ';';
          label += val;
        })
        return label.slice(0, label.length - 1);
      }
    }
  },
  created() {
    this.columns1.splice(1, 0, this.addCommonColumnItem(200));
    this.columns2.splice(1, 0, this.addCommonColumnItem(200));
    this.columns2.splice(2, 0, this.addCommonColumnDepartment({
      width: 150,
      title: "部门"
    }))
  },
  mounted() {
  },
  methods: {
    corporationChange(corporationId, deptId) {
      if (this.tabKey == 2) {
        console.log(corporationId, deptId)
      }
    },
    // 获取组织下所有部门
    corporationDeptChange(value) {
      console.log('获取组织下所有部门', value);
      this.deptData = value;
    },
    // tab切换
    getHazardDetail(key) {
      this.columns = this['columns' + key];
      this.dataSource = [];
      this.getHarmFactorAll();
      if (key == '1') {
        this.action = `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.health}/api/ehs/harm/factor/upload`
        this.getFactorPageList();
      } else {
        this.action = `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.health}/api/ehs/dangerous/station/import/harm`
        this.getStationPageList();
      }
    },
    // organizeChange(key,val) {
    //   this.hazardForm.deptName = val[0];
    // },
    // organizeChange1(key,val) {
    //   this.hazardForm.officeName = val[0];
    // },
    // 部门改变
    draftChange(id, name, key) {
      this.hazardForm[key] = name.join();
    },
    harmBtn(key) {
      this.factorList = [];
      this.damageValue = [];
      if (key == '1') {
        this.getHarmFactorAll("1");
        this.chemicalHarmTitle = "物理类";
        this.damageSelected = JSON.parse(JSON.stringify(this.physicalHarmArr));
      } else {
        this.getHarmFactorAll("2")
        this.chemicalHarmTitle = "化学类";
        this.damageSelected = JSON.parse(JSON.stringify(this.chemicalHarmArr));
      }
      for (let item of this.damageSelected) {
        const ind = this.damageValue.indexOf(item.value);
        if (ind < 0) {
          this.damageValue.push(item.value);
        }
      }
      this.damageVisible = true;
    },
    // 查询危害因素
    async getHarmFactorAll(type = null) {
      const params = {
        harmType: type
      }
      const data = await harmFactorAll(params);
      if (type) {
        this.harmFactorList = data.data; // 弹框全部的
        this.factorList = data.data; //弹框筛选之后的
      } else {
        // this.factorAll = data.data; //全部危害因素
      }
    },
    // 危害因素选择
    factorChange(sel, value) {
      if (sel) {
        this.damageValue.push(value)
        const selectedHarm = this.harmFactorList.filter(item => {
          return item.value == value;
        })
        this.damageSelected = [...this.damageSelected, ...selectedHarm];
      } else {
        const ind = this.damageValue.indexOf(value);
        this.damageValue.splice(ind, 1)
        this.damageSelected = this.damageSelected.filter(ele => {
          return ele.value != value;
        })
      }
    },
    // 危害岗位查询
    hazardSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      const formInline = {
        ...this.formInline,
      }
      this.hazardObj = JSON.parse(JSON.stringify(formInline));
      if (this.tabKey == '1') {
        this.getFactorPageList();
      } else {
        this.getStationPageList();
      }
    },
    // 危害岗位分页查询
    getStationPageList() {
      const params = {
        ...this.hazardObj,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }
      stationPageList(params).then(res => {
        this.dataSource = res.data.list;
        this.page.total = res.data.total;
      }).catch(err => {
        console.log(err);
      })
    },
    // 危害因素分页查询
    getFactorPageList() {
      const params = {
        ...this.hazardObj,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }
      factorPageList(params).then(res => {
        this.dataSource = res.data.list;
        this.page.total = res.data.total;
      }).catch(err => {
        console.log(err);
      })
    },
    damageBlur(e) {
      const value = e.target.value;
      const factorList = JSON.parse(JSON.stringify(this.harmFactorList));
      this.factorList = factorList.filter(item => {
        // const ind = item.label.indexOf(value);
        // if(ind>=0) {
        //   console.log("iiiiidd",item);
        // }
        return item.label.indexOf(value) >= 0
      })
    },
    // 情况选中的危害因素
    clearDanage() {
      this.damageSelected = [];
      this.damageValue = [];
    },
    // 删除危害因素选中项
    deleteDanage(value) {
      this.damageSelected = this.damageSelected.filter(item => {
        return item.value != value;
      });
      const ind = this.damageValue.indexOf(value);
      this.damageValue.splice(ind, 1);
    },
    damageChange(list) {
      let damageSelected = [];
      for (var item of list) {
        const arr = this.harmFactorList.filter(ele => {
          return ele.value == item;
        })
        damageSelected = [...damageSelected, ...arr]
      }
      this.damageSelected = damageSelected;
    },
    // 新增危害岗位弹框关闭
    cancelDamage() {
      this.damageVisible = false;
    },
    // 选择确定
    confirmDamage() {
      if (this.chemicalHarmTitle == "物理类") {
        this.physicalHarmArr = JSON.parse(JSON.stringify(this.damageSelected));
      } else {
        this.chemicalHarmArr = JSON.parse(JSON.stringify(this.damageSelected));
      }
      this.damageVisible = false;
      if (!formValidator.formItemValidate(this, "hazardous", "hazardForm")) {
        return;
      }
    },
    // 危害岗位重置
    hazardRest() {
      this.$refs.commonSearchItem.reset();
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.hazardObj = {};
      if (this.tabKey == '1') {
        this.getFactorPageList();
        this.getHarmFactorAll();
      } else {
        this.getStationPageList();
      }
    },
    // 危害岗位新增
    hazardJobAdd() {
      this.hazardTitle = '新增';
      this.physicalHarmArr = [];
      this.chemicalHarmArr = [];
      this.hazardVisible = true;
    },
    // 编辑
    hazardEdit(record) {
      const hazard = JSON.parse(JSON.stringify(record));
      this.hazardTitle = '编辑';
      this.hazardForm = hazard;
      this.hazardVisible = true;
      if (this.tabKey == '1') {
        this.hazardForm.checkProjectId = hazard.checkProjectId.split(',');
      } else {
        this.physicalHarmArr = record.physicalHarmArr;
        this.chemicalHarmArr = record.chemicalHarmArr;
        console.log(this.hazardForm)
        if (this.tabKey == 2) {


          this.$nextTick(() => {
            this.$refs.commonDept.corporationChange(this.hazardForm.corporationId, this.hazardForm.deptId);

            // this.$refs.commonSearchItem1.corporationChange(this.hazardForm.corporationId, this.hazardForm.deptId).then(res => {
            //   this.corporationChange(this.hazardForm.corporationId, res, this.hazardForm.officeId)
            // })
          })
        }
      }
    },
    // 删除
    hazardDelete(record) {
      const _this = this;
      this.$antConfirm({
        title: `确定删除吗？`,
        onOk() {
          if (_this.tabKey == '1') {
            factorDelete({ harmFactorId: record.harmFactorId }).then(res => {
              _this.$antMessage.success("删除成功");
              _this.getFactorPageList();
              _this.getHarmFactorAll();
            }).catch(err => {
              _this.$antMessage.error("删除失败,请稍后再试")
            })
          } else {
            stationDelete({ dangerousStationId: record.dangerousStationId }).then(res => {
              _this.$antMessage.success("删除成功");
              _this.getStationPageList();
            }).catch(err => {
              _this.$antMessage.error("删除失败,请稍后再试")
            })
          }
        },
        onCancel() {
          _this.$antMessage.info('取消删除');
        },
      });
    },
    // 危害因素模板下载
    async templateDownload() {
      this.templateLoad = true;
      if (this.tabKey == 2) {
        window.open(
          window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/危害岗位导入模板.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/危害岗位导入模板.xlsx`
        );
        this.templateLoad = false;
      } else {
        const name = '危害因素导入模板'
        let res = await factorTemplateExport();
        if (res) {
          this.spreadSheetExcel(res, name);
          this.templateLoad = false;
        }
      }
    },
    // 危害岗位批量导入成功
    handleSuccess(fileList) {
      this.hazardRest();

    },
    // 批量导出
    async exportAll() {
      if (this.tabKey == '2') {
        const name = '危害岗位批量导出'
        const params = {
          ...this.hazardObj
        }
        let res = await stationExport(params);
        if (res) {
          const blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          const downloadElement = document.createElement('a');
          const href = URL.createObjectURL(blob); //创建下载链接
          downloadElement.href = href;
          downloadElement.download = name + '.xlsx';
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);// 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        }
      } else {
        const name = '危害因素批量导出'
        const params = {
          ...this.hazardObj
        }
        let res = await factorExport(params);
        if (res) {
          const blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          const downloadElement = document.createElement('a');
          const href = URL.createObjectURL(blob); //创建下载链接
          downloadElement.href = href;
          downloadElement.download = name + '.xlsx';
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);// 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        }
      }
    },
    // 弹框确定
    hazardConfirm() {
      if (!formValidator.formAll(this, 'hazardForm')) {
        return;
      }
      this.hazardLoading = true;
      if (this.tabKey == '2') {
        const id = this.hazardForm.corporationId;
        const params = {
          ...this.hazardForm,
          physicalHarmArr: this.physicalHarmArr,
          chemicalHarmArr: this.chemicalHarmArr,
        }
        if (this.hazardTitle == '新增') {
          stationAdd(params).then(res => {
            this.hazardLoading = false;
            this.$antMessage.success(res.message);
            this.hazardVisible = false;
            this.hazardForm = {};
            this.getStationPageList();
          }).catch(err => {
            console.log(err);
            this.hazardLoading = false;
          })
        } else {
          stationEdit(params).then(res => {
            this.hazardLoading = false;
            this.$antMessage.success(res.message);
            this.hazardVisible = false;
            this.hazardForm = {};
            this.getStationPageList();
          }).catch(err => {
            console.log(err);
            this.hazardLoading = false;
          })
        }
      } else {
        const params = {
          ...this.hazardForm,
          checkProjectId: this.hazardForm.checkProjectId.join(),
        }
        if (this.hazardTitle == '新增') {
          factorAdd(params).then(res => {
            this.hazardLoading = false;
            this.$antMessage.success(res.message);
            this.hazardVisible = false;
            this.hazardForm = {};
            this.getFactorPageList();
            setTimeout(() => {
              this.getHarmFactorAll();
            }, 500);
          }).catch(err => {
            console.log(err);
            this.hazardLoading = false;
          })
        } else {
          factorEdit(params).then(res => {
            this.hazardLoading = false;
            this.$antMessage.success(res.message);
            this.hazardVisible = false;
            this.hazardForm = {};
            this.getFactorPageList();
            setTimeout(() => {
              this.getHarmFactorAll();
            }, 500);
          }).catch(err => {
            console.log(err);
            this.hazardLoading = false;
          })
        }
      }
    },
    // 弹框关闭
    hazardCancel() {
      this.hazardVisible = false;
      this.hazardForm = {};
      this.physicalHarmArr = [];
      this.chemicalHarmArr = [];
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      if (this.tabKey == '1') {
        this.getFactorPageList();
      } else {
        this.getStationPageList();
      }
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      if (this.tabKey == '1') {
        this.getFactorPageList();
      } else {
        this.getStationPageList();
      }
    },
    // 下拉框模糊搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    textareaValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("不能为空")
      } else if (value && value.length > 300) {
        return Promise.reject("不能超过300字")
      } else {
        callback()
      }
    },
    hazardousValidator(rule, value, callback) {
      if (this.physicalHarmArr.length <= 0 && this.chemicalHarmArr.length <= 0) {
        return Promise.reject("化学类和物理类至少需要填写一种")
      } else {
        callback()
      }
    },
    inputValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("不能为空")
      } else if (value && value.length > 20) {
        return Promise.reject("不能超过20字")
      } else {
        callback()
      }
    },
  }
}
</script>

<style lang="less" scoped>
.hazard {
  .btn {
    margin-left: 20px;
  }
  .hazard-factors {
    text-align: left;
    p {
      margin: 0;
    }
  }
}
.principal-dialog {
  ::v-deep .ant-modal-header {
    margin-bottom: 0 !important;
  }
  ::v-deep .model-content {
    padding: 0 20px !important;
  }
}

.principal-content {
  width: 100%;
  display: flex;
  justify-content: left;
  min-height: 240px;
  .title-content {
    height: 44px;
    display: flex;
    padding-right: 10px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    margin-bottom: 5px;
    .title {
      font-size: 14px;
      color: #000;
    }
  }
  .left {
    width: 30%;
    ul {
      li {
        font-size: 14px;
        height: 21px;
        margin-bottom: 5px;
        padding-right: 10px;
        box-sizing: border-box;
        color: #666;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .right {
    width: 70%;
    padding: 0 5px;
    box-sizing: border-box;
    border-left: 1px solid #eee;
    ::v-deep .ant-checkbox-group-item {
      display: block;
      margin-bottom: 5px;
    }
    .check-title {
      color: #000;
      margin-bottom: 8px;
    }
    .empty {
      text-align: center;
    }
    .checkbox-group {
      min-height: 70%;
      /deep/ input {
        margin: 5px 0;
      }
      ::v-deep label {
        display: block;
        margin-left: 0;
      }
    }
    .pagination {
      ul {
        float: right;
      }
    }
  }
}
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
</style>