<template>
  <HasFixedBottomWrapper>
    <div class="form-content">
      <a-form-model ref="ruleForm" :model="chemicalForm" :rules="chemicalRules" :colon="false">
        <div class="m-t-20 border-b-e7">
          <PageTitle>基本信息</PageTitle>
        </div>
        <a-row class="m-t-20">
          <a-col :span="16">
            <a-form-model-item label="化学品名称" prop="chemicalName" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="chemicalForm.chemicalName" placeholder="请选择化学品名称" disabled>
                <a-select-option v-for="item of chemical" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="形态" prop="form" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="chemicalForm.form" placeholder="请选择形态" disabled>
                <a-select-option v-for="item in form" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="供应商" prop="supplier" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="chemicalForm.supplier" placeholder="请输入供应商" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="8"></a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item label=" " prop="content" :label-col="labelTable" :wrapper-col="wrapperTable">
              <CommonTable :noPaging="true">
                <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="dataSource" :rowKey="(record, index)=>{return index}" :pagination="false"></a-table>
              </CommonTable>
            </a-form-model-item>
          </a-col>
        </a-row>
        <div class="m-t-20 border-b-e7">
          <PageTitle>危险性信息</PageTitle>
        </div>
        <a-row class="m-t-20">
          <a-col :span="16">
            <a-form-model-item label="危险性分类" prop="dangerousClass" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.dangerousClass" placeholder="请输入危险性分类" disabled />
              <!-- <a-select v-model="chemicalForm.dangerousClass" placeholder="请选择危险性分类" disabled>
                <a-select-option v-for="item of risk_categories" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
              </a-select>-->
            </a-form-model-item>
            <a-form-model-item label="警示词" prop="warningWord" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.warningWord" placeholder="请输入警示词" disabled />
            </a-form-model-item>
            <a-form-model-item label="危险性说明" prop="dangerousStatement" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-textarea placeholder="请输入危险性说明" disabled v-model="chemicalForm.dangerousStatement" :auto-size="{ minRows: 2, maxRows: 6 }" />
              <!-- <a-input v-model="chemicalForm.dangerousStatement" placeholder="请输入危险性说明" disabled /> -->
            </a-form-model-item>
            <a-form-model-item label="闪点" prop="flashPoint" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.flashPoint" placeholder="请输入闪点" disabled />
            </a-form-model-item>
            <a-form-model-item label="爆炸极限" prop="explosionLimit" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.explosionLimit" placeholder="请输入爆炸极限" disabled />
            </a-form-model-item>
            <a-form-model-item label="PH值" prop="ph" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.ph" placeholder="请输入PH值" disabled />
            </a-form-model-item>
            <a-form-model-item label="象形图" prop="headImg" :label-col="labelCol" :wrapper-col="wrapperCol">
              <img class="img" v-for="img of headImgs" :src="img.filePath" :key="img.id" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8"></a-col>
        </a-row>
        <div class="m-t-20 border-b-e7">
          <PageTitle>储存信息</PageTitle>
        </div>
        <a-row class="m-t-20">
          <a-col :span="16">
            <a-form-model-item label="包装形式" prop="packageType" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.packageType" placeholder="请输入包装形式" disabled />
            </a-form-model-item>
            <a-form-model-item label="包装大小" prop="packageSize" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.packageSize" placeholder="请输入包装大小" disabled />
            </a-form-model-item>
            <a-form-model-item label="储存位置" prop="storageLocation" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.storageLocation" placeholder="请输入储存位置" disabled />
            </a-form-model-item>
            <a-form-model-item label="储存量" prop="storageCapacity" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.storageCapacity" placeholder="请输入储存量" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="8"></a-col>
        </a-row>
        <div class="m-t-20 border-b-e7">
          <PageTitle>使用信息</PageTitle>
        </div>
        <a-row class="m-t-20">
          <a-col :span="16">
            <CommonSearchItem
              ref="commonSearchItem"
              :rules="chemicalRules"
              :CommonFormInline="chemicalForm"
              :notTablePage="true"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :disabled="true"
              :hasDepartment="true"
              deptLabel="使用部门"
              :departmentMultiple="true"
            ></CommonSearchItem>
            <a-form-model-item label="使用设备" prop="useEquip" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.useEquip" placeholder="请输入使用设备" disabled />
            </a-form-model-item>
            <a-form-model-item label="使用位置" prop="useLocation" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.useLocation" placeholder="请输入使用位置" disabled />
            </a-form-model-item>
            <a-form-model-item label="使用量" prop="useAmount" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.useAmount" placeholder="请输入使用量" disabled />
            </a-form-model-item>
            <a-form-model-item label="是否有设备安全操作规程" prop="safetyOperatingProcedures" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.safetyOperatingProcedures" placeholder="请输入是否有设备安全操作规程" disabled />
            </a-form-model-item>
            <a-form-model-item label="化学品接触人数" prop="contactNum" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.contactNum" placeholder="请输入化学品接触人数" disabled />
            </a-form-model-item>
            <a-form-model-item label="接触人员是否接受培训" prop="receiveTraining" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="chemicalForm.receiveTraining" placeholder="请选择接触人员是否接受培训" disabled>
                <a-select-option v-for="item of training" :value="item.value" :key="item.value">{{item.label}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8"></a-col>
        </a-row>
        <div class="m-t-20 border-b-e7">
          <PageTitle>消防信息</PageTitle>
        </div>
        <a-row class="m-t-20">
          <a-col :span="16">
            <a-form-model-item label="适宜灭火介质" prop="suitableExtinguishingMedia" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.suitableExtinguishingMedia" placeholder="请输入适宜灭火介质" disabled />
            </a-form-model-item>
            <a-form-model-item label="禁忌灭火介质" prop="contraindicatedExtinguishingMedia" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.contraindicatedExtinguishingMedia" placeholder="请输入禁忌灭火介质" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="8"></a-col>
        </a-row>
        <div class="m-t-20 border-b-e7">
          <PageTitle>其他</PageTitle>
        </div>
        <a-row class="m-t-20">
          <a-col :span="16">
            <a-form-model-item label="关联MSDS" prop="msds" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-button class="modal-btn" v-if="msdsList && msdsList.length>=1">
                <div class="selected-modal" v-for="item of msdsList" :key="item.id" @click="mdsdDetail(item)">{{item | filterFileName}}&nbsp;</div>
              </a-button>
              <a-button class="modal-btn" v-else>点击显示MSDS库列表</a-button>
            </a-form-model-item>
            <a-form-model-item label="化学品安全标识" prop="safeLabel" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-button class="modal-btn" v-if="safeList && safeList.length>=1">
                <div class="selected-modal" v-for="item of safeList" :key="item.id" @click="safeDetail(item.id)">{{chemicalDict[item.chemicalName]}}&nbsp;</div>
              </a-button>
              <a-button class="modal-btn" v-else>点击显示化学品安全标识列表弹框，支持选择化学品标识</a-button>
            </a-form-model-item>
            <a-form-model-item label="化学品安全提示卡" prop="safeCueCard" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-button class="modal-btn" v-if="liftCardList && liftCardList.length>=1">
                <div class="selected-modal" v-for="item of liftCardList" :key="item.id" @click="liftDetail(item.id)">{{chemicalDict[item.chemicalsId]}}&nbsp;</div>
              </a-button>
              <a-button class="modal-btn" v-else>点击显示化学品安全提示卡列表弹框，支持选择化学品安全提示卡</a-button>
            </a-form-model-item>
            <a-form-model-item label="是否为特殊化学品" prop="specialChemical" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="chemicalForm.specialChemical" placeholder="请选择是否为特殊化学品" disabled>
                <a-select-option v-for="item of specialityChemicals" :value="item.value" :key="item.value">{{item.label}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8"></a-col>
        </a-row>
      </a-form-model>
    </div>
    <CommonModal :title="modalTitle" :visible="moduleVisible" :cancelFn="addModleCancle">
      <template slot="form">
        <a-form-model
          ref="addModleForm"
          :model="addModleForm"
          :rules="addModleFormRules"
          :label-col="{ style: { width: '80px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 80px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="主要成分" prop="bases">
            <a-input v-model.trim="addModleForm.bases" placeholder="请输入主要成分" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="CAS NO" prop="casNo">
            <a-input v-model.trim="addModleForm.casNo" placeholder="请输入CAS NO" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="百分比" prop="percent">
            <a-input v-model.trim="addModleForm.percent" placeholder="请输入百分比" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="分子式" prop="qwe">
            <a-input v-model.trim="addModleForm.qwe" placeholder="请输入分子式"></a-input>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="addModleCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="addModleConfirm">确定</a-button>
      </template>
    </CommonModal>
    <CommonModal title="关联化学品MSDS库" :visible="msdsVisible" :cancelFn="closemsdsVisible" class="table-modal msds">
      <template slot="form">
        <SearchTerm>
          <a-form-model layout="inline" :model="msdsForm" :colon="false">
            <a-form-model-item label="资料名称">
              <a-input v-model="msdsForm.name" placeholder="请输入化学品名称" allowClear />
            </a-form-model-item>
            <a-form-model-item class="float-right">
              <a-button type="primary" @click="msdsSearch">查询</a-button>
              <a-button @click="msdsRest">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>
        <CommonTable :page="modulePage" :pageNoChange="moduleNoChange" :showSizeChange="moduleSizeChange">
          <a-table
            bordered
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="msdsColumns"
            :locale="{emptyText: emptyText}"
            :data-source="dataList"
            :rowKey="(record, index)=>{return record.id}"
            :pagination="false"
          ></a-table>
        </CommonTable>
      </template>
      <template slot="btn">
        <a-button @click="closemsdsVisible">取消</a-button>
        <a-button class="m-l-15" type="primary" @click="msdsConfirm">确定</a-button>
      </template>
    </CommonModal>
    <CommonModal :title="chemicalSafeTitle" :visible="labelVisible" :cancelFn="closeLabelsVisible" class="msds">
      <template slot="form">
        <SearchTerm>
          <a-form-model layout="inline" :model="labelForm" :colon="false">
            <a-form-model-item label="化学品名称">
              <a-input v-model="labelForm.noMedium" placeholder="请输入化学品名称" allowClear />
            </a-form-model-item>
            <a-form-model-item class="float-right">
              <a-button type="primary" @click="msdsSearch">查询</a-button>
              <a-button @click="msdsRest">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>
        <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
          <a-table
            bordered
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type:'radio' }"
            :columns="msdsColumns"
            :locale="{emptyText: emptyText}"
            :data-source="dataList"
            :rowKey="(record, index)=>{return index}"
            :pagination="false"
          ></a-table>
        </CommonTable>
      </template>
      <template slot="btn">
        <a-button @click="closeLabelsVisible">取消</a-button>
        <a-button class="m-l-15" type="primary">确定</a-button>
      </template>
    </CommonModal>
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="back">返回</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import { formValidator } from "@/utils/clx-form-validator.js";
// import UploadCanRemove from "@/components/upload/uploadCanRemove.vue";
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
import { nanoid } from "nanoid";
import { getOrganizeList, chemicalDetail, GetfileMsgList } from "@/services/api.js";
export default {
  mixins: [teableCenterEllipsis],
  components: {
    FixedBottom,
    OrganizeLazyTree
    // UploadCanRemove
  },
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      labelTable: { span: 2 },
      wrapperTable: { span: 20 },
      modalTitle: '新增',
      chemicalSafeTitle: '关联化学品安全标识',
      moduleVisible: false,
      msdsVisible: false,
      labelVisible: false,
      chemicalForm: {
        title: "",
        form: undefined,
        supplier: "",
        msdsList: [],
        safetyLabels: null,
        liftCard: null,
      },
      headImgs: [],
      treeData: [],
      chemicalDict: {},
      formDict: {},
      replaceFields: { children: 'childDeptList', title: 'deptName', key: 'deptId', value: 'deptId' },
      addModleForm: {
        bases: "",
        casNo: '',
        percent: '',
        qwe: ''
      },
      msdsForm: {
        name: ''
      },
      labelForm: {
        name: ''
      },
      training: [
        { label: "是", value: '1' },
        { label: "否", value: '2' },
      ],
      specialityChemicals: [
        { label: "是", value: '1' },
        { label: "否", value: '2' },
      ],
      dataSource: [],
      columns: [
        {
          title: "主要成分",
          dataIndex: "mainIngredient",
          key: "mainIngredient",
        },
        {
          title: "CAS NO",
          dataIndex: "casNo",
          key: "casNo",
        },
        {
          title: "百分比",
          dataIndex: "percent",
          key: "percent",
        },
        {
          title: "分子式",
          dataIndex: "molecularFormula",
          key: "molecularFormula",
        }
      ],
      msdsColumns: [
        {
          title: "编号",
          dataIndex: "id",
          key: "id",
        },
        {
          title: "所属组织",
          dataIndex: "deptList",
          key: "deptList",
        },
        {
          title: "资料名称",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "资料文件",
          dataIndex: "file",
          key: "file",
        },
        {
          title: "版本",
          dataIndex: "versions",
          key: "versions",
        },
      ],
      selectedRowKeys: [],
      selectedmsds: [],
      dataList: [],
      msdsList: [],
      safeList: [],
      liftCardList: [],
      modulePage: {
        pageNo: 1,
        pageSize: 10,
        total: 16,
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 16,
      },
      chemicalRules: {
        chemicalName: [
          { required: true, message: '请选择化学品名称', trigger: 'change' },
        ],
        form: [
          { required: true, message: '请选择化学品形态', trigger: 'change' },
        ],
        supplier: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        dangerousClass: [
          { required: true, message: '请选择危险性分类', trigger: 'change' },
        ],
        warningWord: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        dangerousStatement: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        flashPoint: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        explosionLimit: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        ph: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        headImg: [
          { required: true, validator: this.headImgValidator, trigger: "change" },
        ],
        packageType: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        packageSize: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        storageLocation: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        storageCapacity: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        useEquip: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        useLocation: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        useAmount: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        safetyOperatingProcedures: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        contactNum: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        receiveTraining: [
          { required: true, message: '请选择接触人员是否接受培训', trigger: 'change' },
        ],
        suitableExtinguishingMedia: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        contraindicatedExtinguishingMedia: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        msds: [
          { required: false, validator: this.msdsValidator, trigger: ['blur', 'change'] },
        ],
        safeLabel: [
          { required: false, validator: this.safetyLabelsValidator, trigger: ['blur', 'change'] },
        ],
        safeCueCard: [
          { required: false, validator: this.liftCardValidator, trigger: ['blur', 'change'] },
        ],
        specialChemical: [
          { required: false, message: '请选择是否为特殊化学品', trigger: 'change' },
        ],
      }
    }
  },

  computed: {
    chemical() { //从字典组里获取化学品名称数据
      const dict = this.$store.state.setting.dictTypeData;
      const chemical = dict.find(item => {
        return item.dictType == 'chemical';
      });
      chemical.dictItem.forEach(ele => {
        this.$set(this.chemicalDict, ele.dictValue, ele.dictLabel);
      });
      return chemical.dictItem; //字典项
    },
    form() { //从字典组里获取化学品形态数据
      const dict = this.$store.state.setting.dictTypeData;
      const form = dict.find(item => {
        return item.dictType == 'form';
      });
      form.dictItem.forEach(ele => {
        this.$set(this.formDict, ele.dictValue, ele.dictLabel);
      });
      return form.dictItem; //字典项
    },
    // risk_categories() { //从字典组里获取危险性分类数据
    //   const dict = this.$store.state.setting.dictTypeData;
    //   const risk_categories = dict.find(item => {
    //     return item.dictType == 'risk_categories';
    //   });
    //   return risk_categories.dictItem; //字典项
    // },
    addModleFormRules() {
      let addModleFormRules = {
        mainIngredient: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        casNo: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        percent: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        molecularFormula: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
      }
      return addModleFormRules
    },
  },
  beforeRouteEnter(to, from, next) {
    const id = to.query.id;
    if (id) {
      next(vm => {
        vm.setRouterCode("chemicals");
        vm.getChemicalsDetail(id);
      })
    } else {
      next(vm => {
        vm.setRouterCode("chemicals");
      })
    }
  },
  filters: {
    filterFileName(value) {
      if (value.infoFileId) {
        const name = JSON.parse(value.infoFileId)[0].name.split('.')[0];
        return name;
      } else {
        return null
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 根据id获取详情
    getChemicalsDetail(chemicalId) {
      chemicalDetail({ chemicalId }).then(res => {
        const data = res.data;
        this.chemicalForm = data;
        this.dataSource = data.ingredientList;
        this.headImgs = data.pictureList;
        this.msdsList = data.msdsList;
        this.safeList = data.safeList;
        this.liftCardList = data.liftCardList;
        this.$nextTick(() => {
          this.$refs.commonSearchItem.corporationChange(this.chemicalForm.corporationId, this.chemicalForm.deptIds)
        })
        // if(pictureList) {
        //   const fileLists = [];
        //   for (let index = 0; index < pictureList.length; index++) {
        //     const element = pictureList[index];
        //     let fileObj = {
        //       uid: '-1',
        //       status: 'done',
        //     };
        //     fileObj.id = element.id;
        //     fileObj.name = element.sourceFileName + '.' + element.fileName.split('.')[1];
        //     fileObj.url = element.filePath;
        //     fileLists.push(fileObj);
        //   }
        //   this.addFormUploadSuccess(fileLists);
        // };
        // if(this.msdsList) {
        //   let mk = [];
        //   for (let index = 0; index < this.msdsList.length; index++) {
        //     const ele = this.msdsList[index];
        //     const kk = ele.id;
        //     mk.push(kk)
        //   }
        //   this.msdsSelectedKeys = mk;
        // }
        // if(this.safeList) {
        //   let mk = [];
        //   for (let index = 0; index < this.safeList.length; index++) {
        //     const ele = this.safeList[index];
        //     const kk = ele.id;
        //     mk.push(kk)
        //   }
        //   this.safeKeys = mk;
        // }
        // if(this.liftCardList) {
        //   let mk = [];
        //   for (let index = 0; index < this.liftCardList.length; index++) {
        //     const ele = this.liftCardList[index];
        //     const kk = ele.id;
        //     mk.push(kk)
        //   }
        //   this.liftCardKeys = mk;
        // }
      }).catch(err => {
        console.log(err);
      })
    },
    // 获取组织机构树
    // getOrganizeTree() {
    //   getOrganizeList().then(res => {
    //     this.treeData = [res.data];
    //   }).catch(err => {
    //     console.log(err);
    //   })
    // },
    // 文件下载
    mdsdDetail(row) {
      console.log("iiii", row);
      let fileInfo = typeof row.infoFileId === 'string' ? JSON.parse(row.infoFileId) : []
      let fileUrl = fileInfo[0] ? fileInfo[0].url : ''
      if (fileUrl) {
        window.location.href = fileUrl;
      }
    },
    // 跳转标识详情跳转
    safeDetail(labelId) {
      this.$router.push({ path: '/chemicalsIdentification/chemicalIdentSafetySignsShow', query: { labelId } })
    },
    // 提示卡详情跳转
    liftDetail(safeRemindId) {
      this.$router.push({ path: '/chemicalsIdentification/chemicalIdentSafetyTipsShow', query: { safeRemindId } })
    },
    // msds弹框显示
    msdsBtn() {
      this.msdsVisible = true;
    },
    // 化学品安全标签弹框显示
    labelBtn() {
      this.chemicalSafeTitle = '关联化学品安全标识',
        this.labelVisible = true;
    },
    // 化学品安全标签弹框显示
    liftCardBtn() {
      this.chemicalSafeTitle = '关联化学品安全提示卡',
        this.labelVisible = true;
    },
    // 弹框取消
    addModleCancle() {
      this.moduleVisible = false;
    },
    // msds弹框取消
    closemsdsVisible() {
      this.msdsVisible = false;
    },
    // 化学品安全标签弹框取消
    closeLabelsVisible() {
      this.labelVisible = false;
    },
    // msds查询
    msdsSearch() {
      console.log("查询。。。");
    },
    // msds重置
    msdsRest() {
      console.log("重置。。。。");
    },
    // 弹框确定
    addModleConfirm() {
      if (!formValidator.formAll(this, 'addModleForm')) {
        return;
      }
      if (this.modalTitle == '编辑') {
        this.dataSource.forEach((ele, ind) => {
          this.dataSource[ind] = ele.id == this.addModleForm.id ? this.addModleForm : ele;
        })
      } else {
        const data = {
          id: nanoid(),
          ...JSON.parse(JSON.stringify(this.addModleForm)),
        };
        this.dataSource.unshift(data);
      }
      this.moduleVisible = false;
      this.addModleForm = {
        bases: "",
        casNo: '',
        percent: '',
        qwe: ''
      }
    },
    // msds弹框确定
    msdsConfirm() {
      this.msdsVisible = false;
      console.log("iiii---", this.selectedmsds);
    },
    // msds跳转详情页
    msdsDetail(value) {
      console.log("详情==", value);
    },
    // // 象形图上传
    // async addFormUploadSuccess(fileList) {
    //   this.headImg = fileList[0];
    //   if (!formValidator.formItemValidate(this, "headImg", "ruleForm")) {
    //     return;
    //   }
    // },
    // 象形图校验
    headImgValidator(rule, value, callback) {
      if (!this.headImg || !this.headImg.id) {
        return Promise.reject("象形图不能为空")
      } else {
        callback()
      }
    },
    // 文本框校验
    inputValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("不能为空")
      } else if (value && value.length > 30) {
        return Promise.reject("不能超过30字")
      } else {
        callback()
      }
    },
    // 文本框校验
    msdsValidator(rule, value, callback) {
      let { required } = rule
      if (!this.msdsList || this.msdsList.length <= 0) {
        required ? callback(new Error(`MSDS不能为空`)) : callback()
      } else {
        callback()
      }
    },
    // 是否具有化学品安全标签校验
    safetyLabelsValidator(rule, value, callback) {
      let { required } = rule
      if (!this.safeList || this.safeList.length <= 0) {
        required ? callback(new Error(`化学品安全标识不能为空`)) : callback()
      } else {
        callback()
      }
    },
    // 化学品安全提示卡校验
    liftCardValidator(rule, value, callback) {
      let { required } = rule
      if (!this.liftCardList || this.liftCardList.length <= 0) {
        required ? callback(new Error(`化学品安全提升卡不能为空`)) : callback()
      } else {
        callback()
      }
    },
    // filterTree(inputValue, treeNode) {
    //   return treeNode.data.props.deptName.includes(inputValue)
    // },
    // treeChange(value) {
    //   this.chemicalForm.organizationId = value;
    // },
    // table选择
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedmsds = selectedRows;
      console.log("-----------", this.selectedRowKeys, selectedRows);
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      console.log(this.page);

    },
    moduleNoChange(page) {
      this.modulePage.pageNo = page;
      console.log(this.page);

    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
    },
    moduleSizeChange(page, pageSize) {
      this.modulePage.pageNo = 1;
      this.modulePage.pageSize = pageSize;
    },
    // 返回
    back() {
      this.setKeepalive(true)
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="less" scoped>
.form-content {
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
    &:hover {
      border-color: #d9d9d9;
      cursor: unset;
      color: rgba(0, 0, 0, 0.65);
    }
    .selected-modal {
      display: inline-block;
      background: #fafafa;
      border: 1px solid #e8e8e8;
      border-radius: 2px;
      margin-right: 4px;
      padding: 0 4px;
      margin-bottom: 2px;
      &:hover {
        cursor: pointer;
        color: #2384d9;
      }
    }
  }
  .img {
    width: 82px;
    height: 82px;
    border-radius: 4px;
    margin-right: 4px;
    border: 1px dashed #e8e8e8;
    box-sizing: border-box;
  }
}
.msds {
  ::v-deep .model-content-form {
    padding: 0 20px !important;
  }
}
</style>