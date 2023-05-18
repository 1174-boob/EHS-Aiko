<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="编号">
          <a-input v-model="formInline.code" placeholder="请输入编号" allowClear></a-input>
        </a-form-model-item>
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline"></CommonSearchItem>
        <a-form-model-item label="部门">
          <a-input v-model="formInline.deptName" placeholder="请输入部门" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="工艺">
          <a-input v-model="formInline.workmanship" placeholder="请输入工艺" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="风险分级">
          <a-select v-model="formInline.riskClassification" placeholder="请选择风险分级" allowClear>
            <a-select-option v-for="item in riskLevel" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select v-model="formInline.infoStatus" placeholder="请选择作业状态" allowClear>
            <a-select-option v-for="item in wxyStatus" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="危险源种类">
          <a-select v-model="formInline.riskClass" placeholder="请选择危险源种类" allowClear>
            <a-select-option v-for="item in wxyHazardkind" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="可能导致事件">
          <a-select v-model="formInline.possibleEvents" placeholder="请选择可能导致事件" allowClear>
            <a-select-option v-for="item in wxyLeadtheevent" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="关键词">
          <a-input v-model="formInline.keyWord" placeholder="请输入关键词" allowClear></a-input>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <!-- 带有加号按钮 -->
      <div>
        <a-button type="dashed" @click="addDangerBook">
          <a-icon type="plus" />新增危险源
        </a-button>
        <a-button type="dashed" :disabled="reviewDisabled" @click="expertReview">专家评审</a-button>
      </div>
      <div>
        <a-button type="primary" class="btn m-l-20" @click="inClick">导入</a-button>
        <a-button type="primary" class="btn m-l-20" @click="downTpl" :loading="exportLoad">导出</a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{emptyText: emptyText}"
        :data-source="dataSource"
        :pagination="false"
        :rowKey="tableRowKey"
        :selectedRowKeys="selectedRowKeys"
        bordered
        :row-selection="rowSelection"
      >
        <!-- <template slot="deptId" slot-scope="record">
          {{record.deptId ? deptCache[record.deptId] : '--'}}
        </template>-->
        <div slot="action" slot-scope="record">
          <span v-if="record.infoStatus =='status1' || record.infoStatus =='status4'" class="color-0067cc cursor-pointer m-r-15" @click="actionEdit(record.id)">编辑</span>
          <span v-if="record.infoStatus =='status2' || record.infoStatus =='status3'" class="color-0067cc cursor-pointer m-r-15" @click="actionPreview(record.id)">查看</span>
          <span
            v-if="record.infoStatus =='status2' || record.infoStatus =='status3' || record.infoStatus =='status4'"
            class="color-0067cc cursor-pointer m-r-15"
            @click="reviewDetail(record.code)"
          >评审详情</span>
          <span v-if="record.infoStatus =='status1' || record.infoStatus =='status4'" class="color-ff4d4f cursor-pointer" @click="actionDelete(record.id)">删除</span>
        </div>
      </a-table>
    </CommonTable>
    <CommonModal title="导入" :visible="addVisible" :cancelFn="addCancle">
      <template slot="form">
        <a-form-model
          ref="addForm"
          :model="addForm"
          :rules="addFormRules"
          :label-col="{ style: { width: '130px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 130px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item>
            <a-button type="link" style="padding:0" @click="downloadTemplate">下载导入模板</a-button>
          </a-form-model-item>
          <a-form-model-item class="flex" label="选择文件">
            <UploadBtnStyle
              :action="actions"
              :showAcceptText="true"
              :accept="['.xlsx']"
              :showUploadList="true"
              :btnText="'上传文件'"
              :btnType="'primary'"
              :btnIcon="false"
              @handleSuccess="handleSuccess"
              @resultCancel="resultCancel"
            ></UploadBtnStyle>
          </a-form-model-item>
        </a-form-model>
      </template>
    </CommonModal>
    <CommonModal :title="reviewTitle" :visible="reviewVisible" :cancelFn="reviewCancel">
      <template slot="form">
        <a-form-model ref="reviewForm" :model="reviewForm" :rules="reviewFormRules" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :colon="false" labelAlign="left">
          <a-form-model-item class="flex" label="所属分类">
            <span>{{classificationName}}{{classCorporationName}}</span>
          </a-form-model-item>
          <a-form-model-item class="flex" prop="subject" label="通知主题">
            <a-input v-model="reviewForm.subject" placeholder="请输入通知主题" allowClear />
          </a-form-model-item>
          <a-form-model-item class="flex" label="通知模板" prop="template">
            <a-textarea allowClear placeholder="请输入通知模板" v-model="reviewForm.template" :auto-size="{ minRows: 2, maxRows: 6 }" />
          </a-form-model-item>
          <a-form-model-item class="flex experts-item" label="专家列表" prop="experts">
            <div style="width:300px;height:30px;color:#999">以下所属组织均为必填项</div>
          </a-form-model-item>
          <div class="corporation-title">所属组织</div>
          <staffOrDept
            v-for="item of expertsList"
            :key="item.corporationId"
            :labelTitle="item.corporationName"
            :checkAbel="false"
            :deptTreeId="item.deptId"
            :checkedTreeNode="reviewForm[item.corporationId]?reviewForm[item.corporationId].split(',') : []"
            @getTreeData="value=>getCorData(value,item.corporationId)"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 19 }"
          ></staffOrDept>

          <staffOrDept
            ref="operations"
            :checkAbel="false"
            :labelTitle="'厂务中心评审'"
            :treeRoles="reviewFormRules"
            :propKey="'operations'"
            :checkedTreeNode="checkedTreeNode"
            @getTreeData="getTreeData"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 19 }"
          ></staffOrDept>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="reviewCancel">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="reviewConfirm" :loading="reviewLoading">确定</a-button>
      </template>
    </CommonModal>
    <CommonModal title="评审详情" :visible="detailVisible" :cancelFn="detailCancel" class="table-modal">
      <CommonTable>
        <a-table :columns="detailColumns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="detailSource" :pagination="false" :rowKey="(record, index)=>{return index}" bordered></a-table>
      </CommonTable>
      <template slot="btn">
        <a-button @click="detailCancel">取消</a-button>
      </template>
    </CommonModal>
  </div>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import teableSelected from "@/mixin/teableSelected.js";
import dictionary from '@/utils/dictionary';
import uploadCanRemove from "@/mixin/uploadCanRemove";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import serviceNameList from "@/config/default/service.config.js";
import { debounce, cloneDeep } from 'lodash';
import { formValidator } from "@/utils/clx-form-validator.js";
import { DeptUserTree } from "@/services/api.js";
import staffOrDept from "@/components/staffOrDept";
// import { mapState } from "vuex";
import { accountSelect, accountDelete, accountExport, selectClassByCorporation, reviewSave, reviewExpert } from "@/services/dangerSource/dangerBook/index.js";
import { PushTask } from '@/services/api';
export default {
  mixins: [teableCenterEllipsis, teableSelected, cancelLoading, uploadCanRemove],
  components: { UploadBtnStyle, staffOrDept },
  data() {
    return {
      tableSpinning:false,
      centerAreaList: [],
      tableRowKey: "id",
      classificationName: '',
      loading: false,
      exportLoad: false,
      checkedTreeNode: [],
      //导入弹窗开关
      addVisible: false,
      reviewDisabled: true,
      reviewVisible: false,
      reviewLoading: false,
      detailVisible: false,
      reviewTitle: '新增',
      actions: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.risk}/api/ehs/risk/detail/account/importFile`,
      formInline: {},
      dangerBookForm: {},
      reviewForm: {
        title: '危险源评审',
        template: '专家您好，本现地新增1个危险源，请您参与评审确定危险源标识！',
      },
      classCorporationName: undefined,
      expertsList: [],
      // userTreeFields: { value: 'key' },
      // userTreeData: [],
      wxyStatusDict: {}, //状态字典
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      riskLevel: [],
      editForm: {},
      columns: [
        {
          title: '状态',
          dataIndex: 'infoStatus',
          width: 150,
          customRender: (text, record, index) => {
            return this.wxyStatusDict[text] ? this.wxyStatusDict[text] : '--';
          },
        },
        {
          title: '编号',
          dataIndex: 'code',
          width: 200,
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        // {
        //   title: '所属组织',
        //   dataIndex: 'corporationName',
        //   width: 150,
        //   customRender: (text, record, index) => {
        //     return text ? text : '--'
        //   },
        // },
        {
          title: '部门',
          dataIndex: 'deptName',
          width: 150,
          customRender: (text, record, index) => {
            return text ? text : '--'
          },
        },
        {
          title: '工艺',
          dataIndex: 'workmanship',
          width: 150,
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: '设备或区域',
          dataIndex: 'equipmentArea',
          width: 150,
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: '作业状态',
          dataIndex: 'jobStatus',
          width: 150,
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: '风险描述',
          dataIndex: 'riskDescription',
          width: 150,
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: '危险源种类',
          dataIndex: 'riskClass',
          width: 150,
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: '可能导致的事件',
          dataIndex: 'possibleEvents',
          width: 150,
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        // {
        //   title: '危险等级',
        //   dataIndex: 'hazardLevel',
        //   width: 150,
        //   customRender: (text,record) => {
        //     return text ? dictionary('hazardLevel', text) : "--";
        //   },
        // },
        {
          title: '风险分级',
          dataIndex: 'riskClassification',
          fixed: 'right', // 固定操作列
          width: 200, // 宽度根据操作自定义设置
          customRender: (text, record) => {
            return record.riskClassification ? dictionary('riskLevel', record.riskClassification) : "--";
          },
          customCell: (record) => {
            let background = dictionary('riskLevel', record.riskClassification, false).color || ''
            return {
              style: { 'background': background }
            }
          },
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 260 // 宽度根据操作自定义设置
        }
      ],
      detailColumns: [
        // {
        //   title: '所属组织',
        //   dataIndex: 'corporationName',
        //   width: 150,
        //   align:'center',
        //   customRender: (text, record, index) => {
        //     return text ? text : '--'
        //   },
        // },
        {
          title: '姓名',
          dataIndex: 'expertName',
          width: 150,
          align: "center",
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: 'L值',
          dataIndex: 'lvalue',
          width: 150,
          align: "center",
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: 'C值',
          dataIndex: 'cvalue',
          width: 150,
          align: "center",
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: '(C-人)值',
          dataIndex: 'cvaluep',
          width: 150,
          align: "center",
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: '(C-产)值',
          dataIndex: 'cvalues',
          width: 150,
          align: "center",
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: 'E值',
          dataIndex: 'evalue',
          width: 150,
          align: "center",
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: '风险值',
          dataIndex: 'valueRisk',
          width: 150,
          align: "center",
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: '风险分级',
          dataIndex: 'riskClassification',
          width: 150,
          align: "center",
          customRender: (text, record) => {
            return record.riskClassification ? dictionary('riskLevel', record.riskClassification) : "--";
          },
          customCell: (record) => {
            let background = dictionary('riskLevel', record.riskClassification, false).color || ''
            return {
              style: { 'background': background }
            }
          },
        },
        {
          title: '危险源标识',
          dataIndex: 'riskType',
          width: 150,
          align: "center",
          customRender: (text, record, index) => {
            return text ? text == '1' ? "共性危险源" : "特异性危险源" : '--';
          },
        },
        {
          title: '评审时间',
          dataIndex: 'reviewTime',
          width: 150,
          align: "center",
          ellipsis: true,
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
        {
          title: '评审意见',
          dataIndex: 'reviewRemake',
          width: 150,
          align: "center",
          customRender: (text, record, index) => {
            return text ? text : '--';
          },
        },
      ],
      detailSource: [],
      dataSource: [],
      addForm: {},
      addFormRules: {
        // operationLine: [
          // { required: true, message: "所属中心不能为空", trigger: "change" },
        // ],
        deptId: [
          { required: true, message: "组织编码不能为空", trigger: "change" },
        ],
        orgAbbrName: [
          { required: true, message: "机构简称不能为空", trigger: "blur" },
        ],
        orgName: [
          { required: true, message: "机构全称不能为空", trigger: "blur" },
        ],
      },
    }
  },
  created() {
    this.setRouterCode("dangerBook");
    this.columns.splice(2, 0, this.addCommonColumnItem(150));
    this.detailColumns.splice(0, 0, this.addCommonColumnItem(150));
    this.getDataList();
    this.initConfigPage()
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.initConfigPage()
        this.iRest()
      }
    }, 20);
 },
  computed: {
    // ...mapState("setting", ["deptCache"]),
    corporationList() {
      return this.$store.state.setting.corporationList
    },
    // 危险源种类字典
    wxyHazardkind() {
      const dict = this.$store.state.setting.dictTypeData;
      const wxyHazardkind = dict.find((item) => {
        return item.dictType == "wxy_hazardkind";
      });
      return wxyHazardkind.dictItem;
    },
    // 可能导致事件字典
    wxyLeadtheevent() {
      const dict = this.$store.state.setting.dictTypeData;
      const wxyLeadtheevent = dict.find((item) => {
        return item.dictType == "wxy_leadtheevent";
      });
      return wxyLeadtheevent.dictItem;
    },
    reviewFormRules() {
      const reviewFormRules = {
        subject: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
        ],
        template: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
        ],
        experts: [
          { required: true, validator: this.expertsValidator, trigger: ['blur', 'change'] },
        ],
        operations: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
        ],

      }
      return reviewFormRules;
    },
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.onSelectChange(selectedRowKeys, selectedRows);
          if (selectedRowKeys && selectedRowKeys.length >= 1) {
            this.reviewDisabled = false;
          } else {
            this.reviewDisabled = true;
          }
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.infoStatus != 'status1',
          },
        }),
      }
    },
  },
  methods: {
    initConfigPage(){
      this.riskLevel = dictionary('riskLevel');
      this.wxyStatus = dictionary("wxyStatus"); //状态字典
      this.wxyStatus.forEach((ele) => {
        this.$set(this.wxyStatusDict, ele.key, ele.value);
      });
    },
    getTreeData(value) {
      this.reviewForm.operations = value.treeIdList.join();
      const treeNameAndCodeList = value.treeNameAndCodeList;
      let name = [];
      for (let ele of treeNameAndCodeList) {
        name.push(ele.treeName)
      }
      this.reviewForm.operationName = name.join();
      if (!formValidator.formItemValidate(this, "operations", "reviewForm")) {
        return;
      }
    },
    // 所属组织选人员
    getCorData(value, corId) {
      const id = value.treeIdList.join('');
      this.reviewForm[corId] = id;
      const treeNameAndCodeList = value.treeNameAndCodeList;
      let name = [];
      for (let ele of treeNameAndCodeList) {
        name.push(ele.treeName)
      }
      this.reviewForm[id] = name.join();
      if (!formValidator.formItemValidate(this, "experts", "reviewForm")) {
        return;
      }
    },
    //导入确认
    addConfirm() {
      this.addVisible = false
    },
    //关闭导入弹窗
    addCancle() {
      this.addVisible = false
    },
    // 下载模板
    downloadTemplate() {
      window.open(window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/riskAccount.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/riskAccount.xlsx`)
    },
    // 批量导入成功
    handleSuccess() {
      this.iRest();
    },
    resultCancel() {
      this.addVisible = false;
    },

    //获取列表
    getDataList() {
      let params = {
        ...this.dangerBookForm,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo
      }
      this.tableSpinning = true
      return accountSelect(params)
      .then((res) => {
        this.dataSource = res.data.list;
        this.page.total = res.data.total;
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    filterUserTree(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue)
    },

    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      console.log("换页", page);
      // 获取列表
      this.getDataList();
    },

    // 页码改变
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
    },

    // 查询
    iSearch() {
      this.loading = true;
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.dangerBookForm = JSON.parse(JSON.stringify(this.formInline));
      // 获取列表
      this.getDataList()
        .finally(() => {
          this.cancelLoading();
        })
    },

    // 重置
    iRest: debounce(function () {
      this.$refs.commonSearchItem.reset();
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.dangerBookForm = {};
      this.getDataList()
    }, 250, { leading: true, trailing: false }),

    // 导入模板下载
    inClick() {
      this.addVisible = true
    },

    // 导出危险源台账
    async downTpl() {
      this.exportLoad = true;
      const name = '危险源台账'
      const params = {
        ...this.dangerBookForm,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo
      }
      let res = await accountExport(params);
      if (res) {
        this.spreadSheetExcel(res, name);
      }
      this.exportLoad = false;
    },

    // 专家评审
    expertReview() {
      this.reviewForm = {
        title: '危险源评审',
        template: '专家您好，本现地新增1个危险源，请您参与评审确定危险源标识！',
      };
      let visible = true;
      const id = this.selectedRow[0].corporationId;
      const idArr = [id];
      const selectedRow = this.selectedRow.slice(1);
      for (let row of selectedRow) {
        const corporationId = row.corporationId;
        const ind = idArr.indexOf(corporationId);
        if (ind < 0) {
          visible = false;
          this.$antMessage.error("请选择所属组织相同的数据")
          break;
        }
      }
      if (visible) {
        this.reviewVisible = true;
        selectClassByCorporation({ corporationId: id }).then(res => {
          if (!res.data) {
            this.$antMessage.error("未匹配到所属组织对应的所属分类，请维护分类配置后重试！");
            this.reviewVisible = false;
            return
          }
          this.classificationName = res.data.classificationName;
          const data = res.data.corporationMap;
          if (!data || data.length <= 0) {
            this.reviewVisible = false;
            this.$antMessage.error("未匹配到所属组织，请重新编辑该数据后重试！");
            this.reviewVisible = false;
            return
          }
          let name = '';
          this.expertsList = [];
          for (let key in data) {
            const dept = this.corporationList.find(item => item.corporationId == key);
            const corp = {
              corporationId: key,
              corporationName: data[key],
              deptId: dept ? dept.deptId : "",
            }
            name = name + data[key] + '、';
            this.expertsList.push(corp);
          }
          this.classCorporationName = '(' + name.substring(0, name.length - 1) + ')';
        }).catch(err => {
          console.log(err);
        })
      }
    },
    // 取消指定专家评审弹框
    reviewCancel() {
      this.reviewVisible = false;
    },
    // 评审详情关闭
    detailCancel() {
      this.detailVisible = false;
    },
    // 指定专家评审弹框- 确定
    reviewConfirm() {
      if (!formValidator.formAll(this, 'reviewForm')) {
        return;
      }
      const reviewForm = cloneDeep(this.reviewForm);
      this.reviewLoading = true;
      this.reviewForm = {
        title: '危险源评审',
        template: '专家您好，本现地新增1个危险源，请您参与评审确定危险源标识！',
      };
      const userIds = []
      const riskReviewExpertDtoList = [];
      for (let ele of this.expertsList) {
        const riskReviewExpertDto = {
          expertId: undefined,
          expertName: "",
          corporationId: undefined,
        }
        const corporationId = ele.corporationId;
        riskReviewExpertDto.corporationId = corporationId;
        riskReviewExpertDto.expertId = reviewForm[corporationId];
        userIds.push(reviewForm[corporationId]);
        riskReviewExpertDto.expertName = reviewForm[riskReviewExpertDto.expertId];
        riskReviewExpertDtoList.push(riskReviewExpertDto);
      }
      const factoryList = {
        expertId: reviewForm.operations,
        expertName: reviewForm.operationName,
      }
      userIds.push(reviewForm.operations)
      const params = {
        id: this.selectedRowKeys,
        subject: this.reviewForm.subject,
        template: this.reviewForm.template,
        factoryList: [factoryList],
        riskReviewExpertDtoList,
      }
      console.log(params, 11);
      reviewSave(params).then(res => {
        let {id} = res.data
        for (let row of this.selectedRow) {
          this.pushTask(id, row.code, userIds);
        }
        this.$antMessage.success("操作成功");
        this.reviewLoading = false;
        this.reviewVisible = false;
        this.selectedRowKeys = [];
        this.selectedRow = [];
        this.getDataList();
      }).catch(err => {
        console.log(err);
        this.reviewLoading = false;
      })
    },
    // 代办推送
    async pushTask(id, code, userIds) {
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/safeManage/dualControlManage/riskManage/processReview&dangerId=${id}&dangerCode=${code}`
      const pushTask = await PushTask({
        title: "危险源待评审",
        approval: 'dangerApprove',
        userId: userIds.join(),
        // docId: this.flowData.processId,
        // taskId: this.flowData.taskId,
        url: url,
        docNumber: code,   //业务id
        docId: id,  //主键id
        handleType: 1,
      })
    },
    // 新增危险源
    addDangerBook() {
      this.$router.push('/safeManage/dualControlManage/riskManage/addEditDangerBook');
    },
    // 编辑
    actionEdit(id) {
      this.$router.push({ path: '/safeManage/dualControlManage/riskManage/addEditDangerBook', query: { id } });
    },
    // 查看
    actionPreview(id) {
      this.$router.push({ path: '/safeManage/dualControlManage/riskManage/previewDangerBook', query: { id } });
    },
    // 评审详情
    reviewDetail(code) {
      this.detailVisible = true;
      reviewExpert({ code }).then(res => {
        this.detailSource = res.data;
      }).catch(err => {
        console.log(err);
      })
    },
    // 删除
    actionDelete(id) {
      this.$antConfirm({
        content: '确认删除？',
        cancelText: '取消',
        onOk: () => {
          accountDelete({ id }).then(res => {
            this.$antMessage.success('删除成功');
            this.page.pageNo = 1;
            this.getDataList();
          }).catch(err => {
            console.log(err);
          })
        },
      });
    },

    expertsValidator(rule, value, callback) {
      for (let ele of this.expertsList) {
        const id = ele.corporationId;
        const name = ele.corporationName;
        if (!this.reviewForm[id]) {
          return Promise.reject(`${name}不能为空`)
        }
      }
      callback()
    },
  }
}
</script>
<style lang="less" scoped>
/deep/ td {
  img {
    width: 30px;
    height: 30px;
  }
}
.head-portrait {
  width: 50px;
  height: 50px;
}
.experts-item {
  padding-bottom: 10px;
}
.corporation-title {
  padding-bottom: 10px;
}
</style>