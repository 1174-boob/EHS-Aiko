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
              <a-select v-model="chemicalForm.chemicalName" placeholder="请选择化学品名称" show-search :filter-option="filterOption">
                <a-select-option v-for="item of chemical" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="形态" prop="form" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="chemicalForm.form" placeholder="请选择形态" show-search :filter-option="filterOption">
                <a-select-option v-for="item in form" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="供应商" prop="supplier" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model.trim="chemicalForm.supplier" placeholder="请输入供应商" allowClear />
            </a-form-model-item>
          </a-col>
          <a-col :span="8"></a-col>
        </a-row>
        <a-row>
          <a-col :span="16">
            <a-form-model-item label="成分列表" prop="ingredient" :label-col="labelCol" :wrapper-col="wrapperCol">
              <div>
                <DashBtn>
                  <div>
                    <a-button type="dashed" @click="handleAdd">添加一行</a-button>
                  </div>
                </DashBtn>
              </div>
            </a-form-model-item>
          </a-col>
          <a-col :span="8"></a-col>
          <a-col :span="24">
            <a-form-model-item label=" " :label-col="labelTable" :wrapper-col="wrapperTable">
              <CommonTable :noPaging="true">
                <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="dataSource" :rowKey="(record, index)=>{return index}" :pagination="false">
                  <div slot="action" slot-scope="record">
                    <span class="color-0067cc cursor-pointer m-r-15" @click="actionEdit(record)">编辑</span>
                    <span class="color-ff4d4f cursor-pointer" @click="actionDelete(record)">删除</span>
                  </div>
                </a-table>
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
              <a-input v-model="chemicalForm.dangerousClass" placeholder="请输入危险性分类" allowClear />
              <!-- <a-select v-model="chemicalForm.dangerousClass" placeholder="请选择危险性分类" show-search :filter-option="filterOption">
                <a-select-option v-for="item of risk_categories" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
              </a-select>-->
            </a-form-model-item>
            <a-form-model-item label="警示词" prop="warningWord" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.warningWord" placeholder="请输入警示词" allowClear />
            </a-form-model-item>
            <a-form-model-item label="危险性说明" prop="dangerousStatement" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-textarea placeholder="请输入危险性说明" allowClear v-model="chemicalForm.dangerousStatement" :auto-size="{ minRows: 2, maxRows: 6 }" />
              <!-- <a-input v-model="chemicalForm.dangerousStatement" placeholder="请输入危险性说明" allowClear /> -->
            </a-form-model-item>
            <a-form-model-item label="闪点" prop="flashPoint" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.flashPoint" placeholder="请输入闪点" allowClear />
            </a-form-model-item>
            <a-form-model-item label="爆炸极限" prop="explosionLimit" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.explosionLimit" placeholder="请输入爆炸极限" allowClear />
            </a-form-model-item>
            <a-form-model-item label="PH值" prop="ph" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.ph" placeholder="请输入PH值" allowClear />
            </a-form-model-item>
            <a-form-model-item label="象形图" prop="headImg" :label-col="labelCol" :wrapper-col="wrapperCol">
              <upload-can-remove ref="editModel" :maxSize="5" :limit="20" :headImgs="headImgs" :handleSuccessName="'addFormUploadSuccess'" @addFormUploadSuccess="addFormUploadSuccess"></upload-can-remove>
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
              <a-input v-model="chemicalForm.packageType" placeholder="请输入包装形式" allowClear />
            </a-form-model-item>
            <a-form-model-item label="包装大小" prop="packageSize" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.packageSize" placeholder="请输入包装大小" allowClear />
            </a-form-model-item>
            <a-form-model-item label="储存位置" prop="storageLocation" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.storageLocation" placeholder="请输入储存位置" allowClear />
            </a-form-model-item>
            <a-form-model-item label="储存量" prop="storageCapacity" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.storageCapacity" placeholder="请输入储存量" allowClear />
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
              :departmentMultiple="true"
              :hasDepartment="true"
              deptLabel="使用部门"
            ></CommonSearchItem>
            <a-form-model-item label="使用设备" prop="useEquip" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.useEquip" placeholder="请输入使用设备" allowClear />
            </a-form-model-item>
            <a-form-model-item label="使用位置" prop="useLocation" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.useLocation" placeholder="请输入使用位置" allowClear />
            </a-form-model-item>
            <a-form-model-item label="使用量" prop="useAmount" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.useAmount" placeholder="请输入使用量" allowClear />
            </a-form-model-item>
            <a-form-model-item label="是否有设备安全操作规程" prop="safetyOperatingProcedures" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.safetyOperatingProcedures" placeholder="请输入是否有设备安全操作规程" allowClear />
            </a-form-model-item>
            <a-form-model-item label="化学品接触人数" prop="contactNum" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.contactNum" placeholder="请输入化学品接触人数" allowClear />
            </a-form-model-item>
            <a-form-model-item label="接触人员是否接受培训" prop="receiveTraining" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="chemicalForm.receiveTraining" placeholder="请选择接触人员是否接受培训">
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
              <a-input v-model="chemicalForm.suitableExtinguishingMedia" placeholder="请输入适宜灭火介质" allowClear />
            </a-form-model-item>
            <a-form-model-item label="禁忌灭火介质" prop="contraindicatedExtinguishingMedia" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input v-model="chemicalForm.contraindicatedExtinguishingMedia" placeholder="请输入禁忌灭火介质" allowClear />
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
              <a-button class="modal-btn" @click="msdsBtn" v-if="msdsList && msdsList.length>=1">
                <div class="selected-modal" v-for="item of msdsList" :key="item.id" @click.stop="colseModal(item)">
                  {{item | filterFileName}}&nbsp;
                  <a-icon type="close-circle" />;
                </div>
              </a-button>
              <a-button class="modal-btn" @click="msdsBtn" v-else>点击显示MSDS库列表</a-button>
            </a-form-model-item>
            <a-form-model-item label="化学品安全标识" prop="safeLabel" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-button class="modal-btn" @click="labelBtn" v-if="safeList && safeList.length>=1">
                <div class="selected-modal" v-for="item of safeList" :key="item.id" @click.stop="colseLabelModal(item)">
                  {{chemicalDict[item.chemicalName]}}&nbsp;
                  <a-icon type="close-circle" />;
                </div>
              </a-button>
              <a-button class="modal-btn" @click="labelBtn" v-else>点击显示化学品安全标识列表弹框，支持选择化学品标识</a-button>
            </a-form-model-item>
            <a-form-model-item label="化学品安全提示卡" prop="safeCueCard" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-button class="modal-btn" @click="liftCardBtn" v-if="liftCardList && liftCardList.length>=1">
                <div class="selected-modal" v-for="item of liftCardList" :key="item.id" @click.stop="deselectLiftCard(item)">
                  {{chemicalDict[item.chemicalsId]}}&nbsp;
                  <a-icon type="close-circle" />;
                </div>
              </a-button>
              <a-button class="modal-btn" @click="liftCardBtn" v-else>点击显示化学品安全提示卡列表弹框，支持选择化学品安全提示卡</a-button>
            </a-form-model-item>
            <a-form-model-item label="是否为特殊化学品" prop="specialChemical" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select v-model="chemicalForm.specialChemical" placeholder="请选择是否为特殊化学品">
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
          <a-form-model-item class="flex" label="主要成分" prop="mainIngredient">
            <a-input v-model.trim="addModleForm.mainIngredient" placeholder="请输入主要成分" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="CAS NO" prop="casNo">
            <a-input v-model.trim="addModleForm.casNo" placeholder="请输入CAS NO" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="百分比" prop="percent">
            <a-input v-model.trim="addModleForm.percent" placeholder="请输入百分比" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="分子式" prop="molecularFormula">
            <a-input v-model.trim="addModleForm.molecularFormula" placeholder="请输入分子式"></a-input>
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
              <a-input v-model="msdsForm.chemicalName" placeholder="请输入资料名称" allowClear />
            </a-form-model-item>
            <a-form-model-item class="float-right">
              <a-button type="primary" @click="msdsSearch">查询</a-button>
              <a-button @click="msdsRest">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>
        <CommonTable :page="msdsPage" :pageNoChange="moduleNoChange" :showSizeChange="moduleSizeChange">
          <a-table
            bordered
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="msdsColumns"
            :locale="{emptyText: emptyText}"
            :data-source="msdsFilingList"
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
    <CommonModal title="关联化学品安全标识" :visible="labelVisible" :cancelFn="closeLabelsVisible" class="table-modal msds">
      <template slot="form">
        <SearchTerm>
          <a-form-model layout="inline" :model="labelForm" :colon="false">
            <a-form-model-item label="化学品名称">
              <a-select v-model="labelForm.chemicalName" placeholder="请选择化学品名称" show-search :filter-option="filterOption" allowClear>
                <a-select-option v-for="item of chemical" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="float-right">
              <a-button type="primary" @click="safeSearch">查询</a-button>
              <a-button @click="safeRest">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>
        <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
          <a-table
            bordered
            :row-selection="{ selectedRowKeys: selectedSafeKeys, onChange: onSafeChange, type:'radio' }"
            :columns="safeColumns"
            :locale="{emptyText: emptyText}"
            :data-source="dataList"
            :rowKey="(record, index)=>{return record.labelId}"
            :pagination="false"
          ></a-table>
        </CommonTable>
      </template>
      <template slot="btn">
        <a-button @click="closeLabelsVisible">取消</a-button>
        <a-button class="m-l-15" type="primary" @click="safeConfirm">确定</a-button>
      </template>
    </CommonModal>
    <CommonModal title="关联化学品安全提示卡" :visible="liftCardVisible" :cancelFn="closeliftCardVisible" class="table-modal msds">
      <template slot="form">
        <SearchTerm>
          <a-form-model layout="inline" :model="liftCardForm" :colon="false">
            <a-form-model-item label="化学品名称">
              <a-select v-model="liftCardForm.chemicalsId" placeholder="请选择化学品名称" show-search :filter-option="filterOption" allowClear>
                <a-select-option v-for="item of chemical" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="float-right">
              <a-button type="primary" @click="liftCardSearch">查询</a-button>
              <a-button @click="liftCardRest">重置</a-button>
            </a-form-model-item>
          </a-form-model>
        </SearchTerm>
        <CommonTable :page="tipsPage" :pageNoChange="tipsNoChange" :showSizeChange="tipsSizeChange">
          <a-table
            bordered
            :row-selection="{ selectedRowKeys: selectedliftCardKeys, onChange: liftCardChange, type:'radio' }"
            :columns="tipsColumns"
            :locale="{emptyText: emptyText}"
            :data-source="tipsList"
            :rowKey="(record, index)=>{return record.safeRemindId}"
            :pagination="false"
          ></a-table>
        </CommonTable>
      </template>
      <template slot="btn">
        <a-button @click="closeliftCardVisible">取消</a-button>
        <a-button class="m-l-15" type="primary" @click="liftCardConfirm">确定</a-button>
      </template>
    </CommonModal>
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="back">取消</a-button>
          <a-button type="primary" class="m-r-15" @click="confirm">确定</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import { formValidator } from "@/utils/clx-form-validator.js";
import UploadCanRemove from "@/components/upload/uploadCanRemove.vue";
import { nanoid } from "nanoid";
import { getOrganizeList, chemicalSave, chemicalDetail, chemicalUpdate } from "@/services/api.js";
import { getChemicalIdentSafetyTipsListApi, getChemicalIdentSafetySignsListApi } from "@/services/chemicalIdentSafetyTipsAdd.js";
import { msdsStoreList } from "@/services/chemicalMsds.js";
import lodash from 'lodash';
export default {
  mixins: [teableCenterEllipsis],
  components: {
    FixedBottom,
    UploadCanRemove,
  },
  data() {
    return {
      addEdit: 'add',
      chemicalId: null,
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      labelTable: { span: 2 },
      wrapperTable: { span: 20 },
      modalTitle: '新增',
      moduleVisible: false,
      msdsVisible: false,
      labelVisible: false,
      liftCardVisible: false,
      chemicalForm: {
        form: undefined,
        supplier: "",
        msdsList: [],
        safeCueCard: null,
      },
      headImgs: [],
      safeList: [],
      tipsList: [],
      msdsFilingList: [],
      liftCardList: [],
      organizeDict: {},
      chemicalDict: {},
      formDict: {},
      // treeData: [],
      msdsInfoName: undefined,
      liftCardChemicalsId: undefined,
      safeChemicalName: undefined,
      replaceFields: { children: 'childDeptList', title: 'deptName', key: 'deptId', value: 'deptId' },
      addModleForm: {
        mainIngredient: "",
        casNo: '',
        percent: '',
        molecularFormula: ''
      },
      msdsForm: {
        infoName: undefined,
      },
      labelForm: {
        chemicalName: undefined,
      },
      liftCardForm: {
        chemicalsId: undefined,
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
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right",
          width: 200
        }
      ],
      msdsColumns: [
        {
          title: "编号",
          dataIndex: "code",
          key: "code",
          align: "center",
          width: 200
        },
        // {
        //   title: "所属组织",
        //   dataIndex: "siteCode",
        //   key: "siteCode",
        //   align: "center",
        //   customRender: (text, record, index) => {
        //     return this.corporationDict[text] ? this.corporationDict[text] : "--";
        //   },
        // },
        {
          title: "资料名称",
          dataIndex: "infoName",
          key: "infoName",
          align: "center",
        },
        {
          title: "资料文件",
          dataIndex: "infoFile",
          key: "infoFile",
          align: "center",
        },
        {
          title: "版本",
          dataIndex: "version",
          key: "version",
          align: "center",
          customRender: (text, record, index) => {
            return text ? text : "--";
          }
        },
      ],
      tipsColumns: [
        {
          title: "化学品名称",
          dataIndex: "chemicalsId",
          key: "chemicalsId",
          align: 'center',
          customRender: (text, record, index) => {
            return this.chemicalDict[text] ? this.chemicalDict[text] : "--";
          },
        },
        {
          title: "形态",
          dataIndex: "shape",
          key: "shape",
          align: 'center',
          customRender: (text, record, index) => {
            return this.formDict[text] ? this.formDict[text] : "--";
          },
        },
        {
          title: "危险特性",
          dataIndex: "hazardousProperties",
          key: "hazardousProperties",
          align: 'center',
        },
        {
          title: "使用部门",
          dataIndex: "deptName",
          key: "deptName",
          align: 'center',
        },
      ],
      safeColumns: [
        {
          title: "化学品名称",
          dataIndex: "chemicalName",
          key: "chemicalName",
          align: 'center',
          customRender: (text, record, index) => {
            return this.chemicalDict[text] ? this.chemicalDict[text] : "--";
          },
        },
        {
          title: "形态",
          dataIndex: "form",
          key: "form",
          align: 'center',
          customRender: (text, record, index) => {
            return this.formDict[text] ? this.formDict[text] : "--";
          },
        },
        {
          title: "危险特性",
          dataIndex: "dangerousProperties",
          key: "dangerousProperties",
          align: 'center',
        },
        {
          title: "使用部门",
          dataIndex: "useDept",
          key: "useDept",
          align: 'center',
        },
      ],
      selectedRowKeys: [],
      msdsSelectedKeys: [],
      safeSelected: [],
      liftCardSelected: [],
      selectedSafeKeys: [],
      liftCardKeys: [],
      safeKeys: [],
      selectedliftCardKeys: [],
      msdsSelected: [],
      msdsList: [],
      msdsAll: [],
      dataList: [],
      msdsPage: {
        pageNo: 1,
        pageSize: 10,
        total: 16,
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      tipsPage: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
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
    // corporationDict() { //所属组织
    //   const corporationList = this.$store.state.setting.corporationList;
    //   const corporationDict = {};
    //   corporationList.forEach(ele => {
    //     corporationDict[ele.corporationId] = ele.orgAbbrName;
    //   });
    //   return corporationDict;
    // },
    chemicalRules() {
      let chemicalRules = {
        chemicalName: [
          { required: true, message: '不能为空', trigger: 'change' },
        ],
        form: [
          { required: true, message: '不能为空', trigger: 'change' },
        ],
        supplier: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        ingredient: [
          { required: true, validator: this.ingredientValidator, trigger: ['blur', 'change'] },
        ],
        dangerousClass: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
        ],
        warningWord: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        dangerousStatement: [
          { required: true, validator: this.textareaValidator, trigger: ['blur', 'change'] },
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
        deptList: [
          { required: true, message: '不能为空', trigger: 'change' },
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
          { required: true, validator: this.intValidator, trigger: ['blur', 'change'] },
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
      return chemicalRules
    },
    addModleFormRules() {
      let addModleFormRules = {
        mainIngredient: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        casNo: [
          { required: false, message: 'CAS NO不能为空', trigger: ['blur', 'change'] },
        ],
        percent: [
          { required: true, validator: this.inputValidator, trigger: ['blur', 'change'] },
        ],
        molecularFormula: [
          { required: false, message: '分子式不能为空', trigger: ['blur', 'change'] },
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
    this.msdsColumns.splice(1, 0, this.addCommonColumnItem());
    this.getTipsList();
    this.getMsdsList();
    this.getSafeList();
  },
  methods: {
    deptFormValidator(val) {
      formValidator.formItemValidate(this, 'deptList', 'ruleForm')
    },
    // 获取提示卡弹框列表
    getTipsList() {
      const params = {
        pageNo: this.tipsPage.pageNo,
        pageSize: this.tipsPage.pageSize,
        chemicalsId: this.liftCardChemicalsId,
      }
      getChemicalIdentSafetyTipsListApi(params).then(res => {
        this.tipsList = res.data.list;
        this.tipsPage.total = res.data.total;
      }).catch(err => {
        console.log(err);
      })
    },
    // 获取详情
    getChemicalsDetail(chemicalId) {
      this.chemicalId = chemicalId;
      const chemicalAdd = sessionStorage.getItem('chemicalAdd');
      if (chemicalAdd == 1) {
        this.addEdit = 'edit';
      } else {
        this.addEdit = 'add';
      }
      chemicalDetail({ chemicalId }).then(res => {
        const data = res.data;
        this.chemicalForm = data;
        this.dataSource = data.ingredientList || [];
        const pictureList = data.pictureList;
        this.msdsList = data.msdsList;
        this.safeList = data.safeList;
        this.liftCardList = data.liftCardList;
        if (typeof data.deptList === 'string') {
          this.chemicalForm.deptList = data.deptList.split(',');
        }
        this.$refs.commonSearchItem.corporationChange(this.chemicalForm.corporationId, this.chemicalForm.deptIds)
        if (pictureList) {
          const fileLists = [];
          for (let index = 0; index < pictureList.length; index++) {
            const element = pictureList[index];
            let fileObj = {
              uid: Math.random(),
              status: 'done',
            };
            fileObj.id = element.id;
            fileObj.name = element.sourceFileName + '.' + element.fileName.split('.')[1];
            fileObj.url = element.filePath;
            fileLists.push(fileObj);
          }
          this.addFormUploadSuccess(fileLists);
        }
        if (this.msdsList) {
          let mk = [];
          for (let index = 0; index < this.msdsList.length; index++) {
            const ele = this.msdsList[index];
            const kk = ele.id;
            mk.push(kk)
          }
          this.msdsSelectedKeys = mk;
        }
        if (this.safeList) {
          let mk = [];
          for (let index = 0; index < this.safeList.length; index++) {
            const ele = this.safeList[index];
            const kk = ele.id;
            mk.push(kk)
          }
          this.safeKeys = mk;
        }
        if (this.liftCardList) {
          let mk = [];
          for (let index = 0; index < this.liftCardList.length; index++) {
            const ele = this.liftCardList[index];
            const kk = ele.id;
            mk.push(kk)
          }
          this.liftCardKeys = mk;
        }
      }).catch(err => {
        console.log(err);
      })
    },
    // 获取msds列表库弹框列表
    getMsdsList() {
      const params = {
        pageNo: this.msdsPage.pageNo,
        pageSize: this.msdsPage.pageSize,
        infoName: this.msdsInfoName,
      }
      msdsStoreList(params).then(res => {
        this.msdsFilingList = res.data.list;
        this.msdsPage.total = res.data.total;
      }).catch(err => {
        console.log(err);
      })
    },
    async getSafeList() {
      const params = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        chemicalName: this.safeChemicalName,
      }
      const data = await getChemicalIdentSafetySignsListApi(params);
      this.dataList = data.data.list;
      this.page.total = data.data.total;
    },
    handleAdd() {
      this.modalTitle = '新增';
      this.moduleVisible = true;
    },
    // msds弹框显示
    msdsBtn() {
      this.selectedRowKeys = this.msdsSelectedKeys;
      this.msdsVisible = true;
    },
    // 化学品安全标识弹框显示
    labelBtn() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
        this.getSafeList();
      this.selectedSafeKeys = this.safeKeys;
      this.labelVisible = true;
    },
    // 化学品安全提示卡弹框显示
    liftCardBtn() {
      this.tipsPage = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
        this.getTipsList();
      this.selectedliftCardKeys = this.liftCardKeys
      this.liftCardVisible = true;
    },
    // 弹框取消
    addModleCancle() {
      this.moduleVisible = false;
    },
    // msds弹框取消
    closemsdsVisible() {
      this.msdsVisible = false;
    },
    // 化学品安全标识弹框取消
    closeLabelsVisible() {
      this.labelVisible = false;
    },
    // 化学品安全提示卡弹框取消
    closeliftCardVisible() {
      this.liftCardVisible = false;
    },
    // msds查询
    msdsSearch() {
      this.msdsInfoName = lodash.cloneDeep(this.msdsForm.chemicalName);
      this.getMsdsList();
    },
    // msds重置
    msdsRest() {
      this.msdsPage = {
        pageNo: 1,
        pageSize: 10,
        total: 0
      };
      this.msdsForm.chemicalName = undefined;
      this.msdsInfoName = undefined;
      this.getMsdsList();
    },
    // 提示卡弹框搜索
    liftCardSearch() {
      this.liftCardChemicalsId = lodash.cloneDeep(this.liftCardForm.chemicalsId);
      this.getTipsList();
    },
    // 提示卡重置
    liftCardRest() {
      this.tipsPage = {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
      this.liftCardForm.chemicalsId = undefined;
      this.liftCardChemicalsId = undefined;
      this.getTipsList();
    },
    // 安全标识弹框搜索
    safeSearch() {
      this.safeChemicalName = lodash.cloneDeep(this.labelForm.chemicalName);
      this.getSafeList();
    },
    // 重置
    safeRest() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0
      };
      this.labelForm.chemicalName = undefined;
      this.safeChemicalName = undefined;
      this.getSafeList();
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
      if (!formValidator.formItemValidate(this, "ingredient", "ruleForm")) {
        return;
      }
    },
    // msds弹框确定
    msdsConfirm() {
      const msdsList = JSON.parse(JSON.stringify(this.msdsSelected));
      this.msdsAll = [...this.msdsAll, ...msdsList];
      this.msdsList = [];
      for (let index = 0; index < this.msdsAll.length; index++) {
        const element = this.msdsAll[index];
        const ind = this.selectedRowKeys.indexOf(element.id);
        const msds = this.msdsList.filter(item => {
          return item.id == element.id
        })
        if (ind >= 0 && msds.length == 0) {
          this.msdsList.push(element)
        }
      }
      this.msdsSelectedKeys = JSON.parse(JSON.stringify(this.selectedRowKeys));
      this.msdsVisible = false;
    },
    // 安全标签弹框确定
    safeConfirm() {
      this.safeList = JSON.parse(JSON.stringify(this.safeSelected));
      this.safeKeys = JSON.parse(JSON.stringify(this.selectedSafeKeys));
      this.labelVisible = false;
    },
    // 安全提示卡弹框确定
    liftCardConfirm() {
      this.liftCardList = JSON.parse(JSON.stringify(this.liftCardSelected));
      this.liftCardKeys = JSON.parse(JSON.stringify(this.selectedliftCardKeys));
      this.liftCardVisible = false;
    },
    // 新增或者编辑页面确定
    confirm() {
      if (!formValidator.formAll(this, 'ruleForm')) {
        return;
      }
      const pictureList = [];
      for (let index = 0; index < this.headImgs.length; index++) {
        const element = this.headImgs[index];
        pictureList.push(element.id);
      }
      const params = {
        ...this.chemicalForm,
        chemicalId: this.chemicalId,
        ingredientList: this.dataSource,
        pictureList,
        msdsList: this.msdsSelectedKeys,
        safeCueCard: this.liftCardKeys[0],
        safeLabel: this.safeKeys[0],
      }
      if (this.addEdit == 'add') {
        chemicalSave(params).then(res => {
          this.$antMessage.success('操作成功');
          this.$router.push('/safeManage/chemicalSafeManage/chemicalListManage/chemicalsList');
        }).catch(err => {
          console.log(err);
        })
      } else {
        chemicalUpdate(params).then(res => {
          this.$antMessage.success('修改成功');
          this.$router.push('/safeManage/chemicalSafeManage/chemicalListManage/chemicalsList');
        }).catch(err => {
          console.log(err);
        })
      }

    },
    // 弹框编辑
    actionEdit(record) {
      this.modalTitle = "编辑";
      this.moduleVisible = true;
      this.addModleForm = JSON.parse(JSON.stringify(record));
    },
    // 删除
    actionDelete(record) {
      const _this = this;
      this.$antConfirm({
        title: '确定删除吗？',
        onOk() {
          const dataSource = [..._this.dataSource];
          _this.dataSource = dataSource.filter(item => item.id != record.id);
          if (!formValidator.formItemValidate(_this, "ingredient", "ruleForm")) {
            return;
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    // 取消选中的msds
    colseModal(value) {
      this.msdsList = this.msdsList.filter(item => {
        return item.id != value.id;
      })
      const index = this.msdsSelectedKeys.indexOf(value.id);
      if (index >= 0) {
        this.msdsSelectedKeys.splice(index, 1);
      }
    },
    // 取消选中的安全标签
    colseLabelModal(value) {
      this.safeList = this.safeList.filter(item => {
        return item.id != value.id;
      })
      this.safeKeys = [];
      this.safeSelected = [];
    },
    // 取消选中的安全提示卡
    deselectLiftCard(value) {
      this.liftCardList = this.liftCardList.filter(item => {
        return item.safeRemindId != value.safeRemindId;
      })
      this.liftCardKeys = [];
      this.liftCardSelected = [];
    },
    // 象形图上传
    async addFormUploadSuccess(fileList) {
      this.headImgs = fileList;
      if (!formValidator.formItemValidate(this, "headImg", "ruleForm")) {
        return;
      }
    },
    // 象形图校验
    headImgValidator(rule, value, callback) {
      if (!this.headImgs || this.headImgs.length <= 0) {
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
    textareaValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("不能为空")
      } else if (value && value.length > 300) {
        return Promise.reject("不能超过300字")
      } else {
        callback()
      }
    },
    // 成分列表校验
    ingredientValidator(rule, value, callback) {
      if (!this.dataSource || this.dataSource.length <= 0) {
        return Promise.reject("至少添加一行成分列表");
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
    // 整数类型校验
    intValidator(rule, value, callback) {
      if (!value) {
        return Promise.reject("不能为空");
      } else if (value && value.length > 30) {
        return Promise.reject("不能超过30字");
      } else if (/\D+/g.test(value)) {
        return Promise.reject("只能输入正整数");
      } else if (value * 1 <= 0) {
        return Promise.reject("只能输入正整数");
      } else {
        callback();
      }
    },
    // 下拉框模糊搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
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
    filterTree(inputValue, treeNode) {
      return treeNode.data.props.deptName.includes(inputValue)
    },
    // treeChange(value) {
    //   this.chemicalForm.organizationId = value;
    // },
    // table选择
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.msdsSelected = selectedRows;
    },
    // 安全标签选择
    onSafeChange(selectedRowKeys, selectedRows) {
      this.selectedSafeKeys = JSON.parse(JSON.stringify(selectedRowKeys));
      this.safeSelected = JSON.parse(JSON.stringify(selectedRows));
    },
    // 安全提示卡选择
    liftCardChange(selectedRowKeys, selectedRows) {
      this.selectedliftCardKeys = JSON.parse(JSON.stringify(selectedRowKeys));
      this.liftCardSelected = JSON.parse(JSON.stringify(selectedRows));
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      this.getSafeList();
    },
    tipsNoChange(page) {
      this.tipsPage.pageNo = page;
      this.getTipsList();
    },
    moduleNoChange(page) {
      const msdsList = JSON.parse(JSON.stringify(this.msdsSelected));
      this.msdsAll = [...this.msdsAll, ...msdsList];

      this.msdsPage.pageNo = page;
      this.getMsdsList();
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getSafeList();
    },
    moduleSizeChange(page, pageSize) {
      const msdsList = JSON.parse(JSON.stringify(this.msdsSelected));
      this.msdsAll = [...this.msdsAll, ...msdsList];
      this.msdsPage.pageNo = 1;
      this.msdsPage.pageSize = pageSize;
      this.getMsdsList();
    },
    tipsSizeChange(page, pageSize) {
      this.tipsPage.pageNo = 1;
      this.tipsPage.pageSize = pageSize;
      this.getTipsList();
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
}
.msds {
  ::v-deep .model-content-form {
    padding: 0 20px !important;
  }
}
</style>