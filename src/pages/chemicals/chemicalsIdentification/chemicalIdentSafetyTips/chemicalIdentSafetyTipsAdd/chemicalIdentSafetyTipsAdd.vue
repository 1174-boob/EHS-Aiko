<template>
  <HasFixedBottomWrapper>
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <a-form-model ref="ruleForm" :model="iFrom" :rules="iRules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <template title="基本信息">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>基本信息</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="chemicalsId" label="化学品名称" prop="chemicalsId">
                <a-select v-model="iFrom.chemicalsId" placeholder="请选择" show-search :filter-option="filterOption">
                  <a-select-option v-for="item in chemicalsList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <CommonSearchItem
                ref="commonSearchItem"
                :CommonFormInline="iFrom"
                :rules="iRules"
                :hasDepartment="true"
                :notTablePage="true"
                :departmentMultiple="true"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                deptLabel="使用部门"
              ></CommonSearchItem>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="shape" label="形态" prop="shape">
                <a-select v-model="iFrom.shape" placeholder="请选择" show-search :filter-option="filterOption">
                  <a-select-option v-for="item in shapeList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item ref="chemicalsFormula" label="化学式" prop="chemicalsFormula">
                <a-input v-model.trim="iFrom.chemicalsFormula" :maxLength="100" placeholder="请输入化学式"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item ref="safeRemindCas" label=" " prop="safeRemindCas" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
            <DashBtn>
              <div>
                <a-button type="dashed" @click="openAddCasNoModel()">
                  <a-icon type="plus" />新增一行
                </a-button>
              </div>
            </DashBtn>
            <CommonTable :noPaging="true">
              <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="iFrom.safeRemindCas" :rowKey="(record, index)=>{return index}" :pagination="false">
                <div slot="action" slot-scope="record">
                  <span class="color-0067cc cursor-pointer m-r-15" @click="tableRowEdit(record)">编辑</span>
                  <span class="color-0067cc cursor-pointer" @click="tableRowRm(record)">删除</span>
                </div>
              </a-table>
            </CommonTable>
          </a-form-model-item>
        </template>

        <template title="理化性质">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>理化性质</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="traits" label="性状" prop="traits">
                <a-input v-model.trim="iFrom.traits" :maxLength="100" placeholder="请输入性状"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="flashPoint" label="闪点[℃]" prop="flashPoint">
                <a-input v-model.trim="iFrom.flashPoint" :maxLength="100" placeholder="请输入闪点[℃]"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="relativeDensity" label="相对密度[水=1]" prop="relativeDensity">
                <a-input v-model.trim="iFrom.relativeDensity" :maxLength="100" placeholder="请输入相对密度[水=1]"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="explosiveLimit" label="爆炸极限" prop="explosiveLimit">
                <a-input v-model.trim="iFrom.explosiveLimit" :maxLength="100" placeholder="请输入爆炸极限"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="phData" label="PH值" prop="phData">
                <a-input v-model.trim="iFrom.phData" :maxLength="100" placeholder="请输入PH值"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>

        <template title="危险特性">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>危险特性</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="signalWord" label="警示词" prop="signalWord">
                <a-input v-model.trim="iFrom.signalWord" :maxLength="100" placeholder="请输入警示词"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="hazardousProperties" label="危险特性" prop="hazardousProperties">
                <a-textarea v-model.trim="iFrom.hazardousProperties" :maxLength="1000" placeholder="请输入危险特性"></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="pictogramsList" label="象形图" prop="pictogramsList">
                <UploadCanRemove ref="pictogramsListUploadCanRemove" :maxSize="5" :limit="20" :headImgs="iFrom.echoPictogramsList" @handleSuccess="handleSuccessPictograms"></UploadCanRemove>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>

        <template title="防护用品">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>防护用品</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-row>
            <a-col :span="24">
              <a-form-model-item ref="respiratoryProtection" label="呼吸防护" prop="respiratoryProtection" :label-col="labelColEditor" :wrapper-col="wrapperColEditor">
                <Editor :height="height" v-model="iFrom.respiratoryProtection" :isClear="isClear" @submitEditor="submitEditorRespiratory"></Editor>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item ref="handProtection" label="手部防护" prop="handProtection" :label-col="labelColEditor" :wrapper-col="wrapperColEditor">
                <Editor :height="height" v-model="iFrom.handProtection" :isClear="isClear" @submitEditor="submitEditorHand"></Editor>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item ref="eyeProtection" label="眼睛防护" prop="eyeProtection" :label-col="labelColEditor" :wrapper-col="wrapperColEditor">
                <Editor :height="height" v-model="iFrom.eyeProtection" :isClear="isClear" @submitEditor="submitEditorEye"></Editor>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item ref="bodyProtection" label="身体防护" prop="bodyProtection" :label-col="labelColEditor" :wrapper-col="wrapperColEditor">
                <Editor :height="height" v-model="iFrom.bodyProtection" :isClear="isClear" @submitEditor="submitEditorBody"></Editor>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>

        <template title="注意事项">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>注意事项</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="precautions" label="注意事项描述" prop="precautions">
                <a-textarea v-model.trim="iFrom.precautions" :maxLength="1000" placeholder="请输入注意事项描述"></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>

        <template title="应急措施">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>应急措施</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="humanContactMeasures" label="人体接触处理措施" prop="humanContactMeasures">
                <a-textarea v-model.trim="iFrom.humanContactMeasures" :maxLength="1000" placeholder="请输入人体接触处理措施"></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="泄露应急处理措施" prop="leakageEmergencyMeasures">
                <a-textarea v-model.trim="iFrom.leakageEmergencyMeasures" :maxLength="1000" placeholder="请输入泄露应急处理措施"></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="emergencyProcessList" label="应急流程" prop="emergencyProcessList">
                <UploadCanRemove ref="emergencyProcessListUploadCanRemove" :maxSize="5" :limit="20" :headImgs="iFrom.echoEmergencyProcessList" @handleSuccess="emergencyProcessHandleSuccess"></UploadCanRemove>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>

        <template title="应急电话">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>应急电话</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="ousideTel" label="外部应急电话" prop="ousideTel">
                <a-input v-model.trim="iFrom.ousideTel" :maxLength="100" placeholder="请输入外部应急电话"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="factoryTel" label="厂内应急电话" prop="factoryTel">
                <a-input v-model.trim="iFrom.factoryTel" :maxLength="100" placeholder="请输入厂内应急电话"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>

        <template title="参考资料">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>参考资料</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="safeReferences" label="参考资料" prop="safeReferences">
                <a-input v-model.trim="iFrom.safeReferences" :maxLength="100" placeholder="请输入参考资料"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="referencesAttachmentList" label="资料附件" prop="referencesAttachmentList">
                <UploadBtnStyle
                  :accept="['.doc', '.docx','.pdf','.xls','.xlsx','.ppt']"
                  :maxSize="20"
                  :limit="20"
                  :fileLists="iFrom.echoReferencesAttachmentList"
                  @handleSuccess="handleSuccessReferencesAttachment"
                ></UploadBtnStyle>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>
      </a-form-model>
    </a-spin>

    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="cancleSubmit">取消</a-button>
          <a-button type="primary" class="m-r-15" :loading="loading" @click="confirmSubmit">确定</a-button>
        </div>
      </FixedBottom>
    </div>

    <AddCasNoModel v-model="addCasNoModelShow" :addCasNoModelData="addCasNoModelData" :moduleList="iFrom.safeRemindCas" @changeModuleList="changeModuleList" />
  </HasFixedBottomWrapper>
</template>
<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { cloneDeep } from 'lodash'
import Editor from "@/components/editor/wangEditor.vue";
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import AddCasNoModel from "./components/addCasNoModel.vue";
import UploadCanRemove from '@/components/upload/uploadCanRemove.vue';
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import { getConsoleOrganizeList, addChemicalIdentSafetyTipsApi, getChemicalIdentSafetyTipsAddDetailApi, changeChemicalIdentSafetyTipsApi } from '@/services/chemicalIdentSafetyTipsAdd.js'
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
export default {
  components: { FixedBottom, Editor, AddCasNoModel, UploadCanRemove, UploadBtnStyle },
  mixins: [teableCenterEllipsis, chemicalDict, cancelLoading],
  data() {
    return {
      spinning: true,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      iFrom: {
        chemicalsId: undefined,
        chemicalsFormula: undefined,
        deptIds: undefined,
        shape: undefined,
        safeRemindCas: undefined,
        traits: undefined,
        flashPoint: undefined,
        relativeDensity: undefined,
        explosiveLimit: undefined,
        phData: undefined,
        signalWord: undefined,
        hazardousProperties: undefined,
        pictogramsList: undefined,
        echoPictogramsList: [],
        respiratoryProtection: undefined,
        handProtection: undefined,
        eyeProtection: undefined,
        bodyProtection: undefined,
        precautions: undefined,
        humanContactMeasures: undefined,
        leakageEmergencyMeasures: undefined,
        emergencyProcessList: undefined,
        echoEmergencyProcessList: [],
        ousideTel: undefined,
        factoryTel: undefined,
        safeReferences: undefined,
        referencesAttachmentList: undefined,
        echoReferencesAttachmentList: [],
      },
      iRules: {
        chemicalsId: [{ required: true, message: "化学品名称不能为空", trigger: "change" },],
        chemicalsFormula: [{ required: false, message: "化学式不能为空", trigger: "blur" },],
        deptIds: [{ required: true, message: "使用部门不能为空", trigger: "change" },],
        shape: [{ required: true, message: "形态不能为空", trigger: "change" },],
        safeRemindCas: [{ required: true, message: "主要成分不能为空", trigger: "change" },],
        traits: [{ required: true, message: "性状不能为空", trigger: "blur" },],
        flashPoint: [{ required: true, message: "闪点不能为空", trigger: "blur" },],
        relativeDensity: [{ required: true, message: "相对密度不能为空", trigger: "blur" },],
        explosiveLimit: [{ required: true, message: "爆炸极限不能为空", trigger: "blur" },],
        phData: [{ required: true, message: "ph值不能为空", trigger: "blur" },],
        signalWord: [{ required: true, message: "警示词不能为空", trigger: "blur" },],
        hazardousProperties: [{ required: true, message: "危险特性不能为空", trigger: "blur" },],
        pictogramsList: [{ required: true, message: "象形图不能为空", trigger: "change" },],
        respiratoryProtection: [{ required: true, message: "呼吸防护不能为空", trigger: "change" },],
        handProtection: [{ required: true, message: "手部防护不能为空", trigger: "blur" },],
        eyeProtection: [{ required: true, message: "眼睛防护不能为空", trigger: "blur" },],
        bodyProtection: [{ required: true, message: "身体防护不能为空", trigger: "blur" },],
        precautions: [{ required: true, message: "注意事项描述不能为空", trigger: "blur" },],
        humanContactMeasures: [{ required: true, message: "人体接触处理措施不能为空", trigger: "blur" },],
        leakageEmergencyMeasures: [{ required: true, message: "泄露应急处理措施不能为空", trigger: "blur" },],
        emergencyProcessList: [{ required: true, message: "应急流程不能为空", trigger: "blur" },],
        ousideTel: [{ required: true, message: "外部应急电话不能为空", trigger: "blur" },],
        factoryTel: [{ required: true, message: "厂内应急电话不能为空", trigger: "blur" },],
        safeReferences: [{ required: true, message: "参考资料不能为空", trigger: "blur" },],
        referencesAttachmentList: [{ required: false, message: "参考资料不能为空", trigger: "blur" },],
      },
      // 化学品名称list
      chemicalsList: [],
      // 使用部门树
      consoleOrganizeTreeList: [],
      replaceFields: { children: 'children', title: 'name', key: 'id', value: 'id' },
      // 形态list
      shapeList: [],
      // 主要成分table
      columns: [
        {
          title: "主要成分",
          dataIndex: "mainIngredient",
          key: "mainIngredient"
        },
        {
          title: "CAS NO",
          dataIndex: "csaNo",
          key: "csaNo"
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right", // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      // 添加一行弹窗-显示隐藏
      addCasNoModelShow: false,
      addCasNoModelData: {},
      // 富文本高度
      height: "300px",
      // 富文本
      isClear: false,
      labelColEditor: { span: 3 },
      wrapperColEditor: { span: 21 },
    }
  },
  created() {
    // 化学品名称字典
    this.chemicalsList = this.getChemicalDictList('chemical')
    // 形态list
    this.shapeList = this.getChemicalDictList('form')
  },
  mounted() {
    // 页面初始化
    this.initPage()
  },
  computed: {
    // 当前页面是否为新增
    isAddPage() {
      let pageType = this.$route.query.type ? this.$route.query.type : 'add'
      return pageType == 'add'
    },
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    deptFormValidator(val) {
      formValidator.formItemValidate(this, 'deptIds', 'ruleForm')
    },
    // 页面初始化
    initPage() {
      if (this.isAddPage) {
        this.spinning = false
      } else {
        // 获取页面详情和组织机构
        Promise.all([this.getPageDetail()])
          .then(resArr => {

          })
          .finally(() => {
            this.spinning = false
          })
      }
    },
    // 获取页面详情
    getPageDetail() {
      let safeRemindId = this.$route.query.safeRemindId
      let apiData = { safeRemindId }
      return new Promise((res, rej) => {
        getChemicalIdentSafetyTipsAddDetailApi(apiData)
          .then(res => {
            let iFrom = res.data
            iFrom.safeRemindCas.forEach(item => {
              item.guid = this.guid()
            })
            // 象形图-回显
            iFrom.pictogramsList = this.handleFileIdS(iFrom.echoPictogramsList)
            iFrom.echoPictogramsList = this.handleFileRedisplay(iFrom.echoPictogramsList)
            // 应急流程-回显
            iFrom.emergencyProcessList = this.handleFileIdS(iFrom.echoEmergencyProcessList)
            iFrom.echoEmergencyProcessList = this.handleFileRedisplay(iFrom.echoEmergencyProcessList)
            // 资料附件-回显
            iFrom.referencesAttachmentList = this.handleFileIdS(iFrom.echoReferencesAttachmentList)
            iFrom.echoReferencesAttachmentList = this.handleFileRedisplay(iFrom.echoReferencesAttachmentList)
            this.iFrom = iFrom
            console.log(this.iFrom)
            this.$refs.commonSearchItem.corporationChange(this.iFrom.corporationId, this.iFrom.deptIds)
            return iFrom
          })
          .then(() => {
            res()
          })
          .catch(err => {
            rej()
          })
      })
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
    // 取消
    cancleSubmit() {
      this.setKeepalive(true)
      this.$router.go(-1)
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
    // 确定
    confirmSubmit() {
      console.log(this.iFrom)
      // 如果页面表单验证有报错则滚动到表单验证报错的地方
      this.$refs["ruleForm"].validate((valid, object) => {
        if (!valid) {
          this.scrollView(object);
        }
      });
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      this.handleLoading();
      // 全部表单新增、编辑--api
      let apiName = this.isAddPage ? 'addChemicalIdentSafetyTips' : 'changeChemicalIdentSafetyTips'
      this[apiName]()
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 全部表单新增api
    addChemicalIdentSafetyTips() {
      let apiData = this.iFrom
      return addChemicalIdentSafetyTipsApi(apiData)
        .then(res => {
          this.$antMessage.success('新增成功');
          // 跳转列表页
          this.$router.push({
            path: '/safeManage/chemicalSafeManage/chemicalsIdentification/chemicalIdentSafetyTips'
          })
        })
        .catch(err => { })
    },
    // 全部表单修改api
    changeChemicalIdentSafetyTips() {
      let apiData = this.iFrom
      return changeChemicalIdentSafetyTipsApi(apiData)
        .then(res => {
          this.$antMessage.success('修改成功');
          // 跳转列表页
          this.$router.push({
            path: '/safeManage/chemicalSafeManage/chemicalsIdentification/chemicalIdentSafetyTips'
          })
        })
        .catch(err => { })
    },
    // 树搜索过滤
    filterTree(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue)
    },
    // 添加一行
    openAddCasNoModel(row) {
      this.addCasNoModelData = row ? row : {}
      this.addCasNoModelShow = true;
    },
    // 修改表格某一行
    tableRowEdit(row) {
      this.addCasNoModelData = row
      this.addCasNoModelShow = true;
    },
    // 删除表格某一行
    tableRowRm(row) {
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          this.iFrom.safeRemindCas = this.iFrom.safeRemindCas.filter(item => {
            return item.guid != row.guid
          })
          formValidator.formItemValidate(this, 'safeRemindCas', 'ruleForm')
        },
      });
    },
    // 生成唯一id
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    // 修改主要成分table数据-添加一行
    changeModuleList(moduleDataList) {
      this.iFrom.safeRemindCas = moduleDataList
      formValidator.formItemValidate(this, 'safeRemindCas', 'ruleForm')
    },
    // 象形图图片上传
    handleSuccessPictograms() {
      this.iFrom.pictogramsList = this.$refs.pictogramsListUploadCanRemove.fileList.map(item => {
        return item.id
      })
      formValidator.formItemValidate(this, 'pictogramsList', 'ruleForm')
    },
    //富文本编辑器-呼吸防护
    submitEditorRespiratory(value) {
      this.iFrom.respiratoryProtection = value;
      formValidator.formItemValidate(this, 'respiratoryProtection', 'ruleForm')
    },
    //富文本编辑器-手部防护
    submitEditorHand(value) {
      this.iFrom.handProtection = value;
      formValidator.formItemValidate(this, 'handProtection', 'ruleForm')
    },
    //富文本编辑器-眼睛防护
    submitEditorEye(value) {
      this.iFrom.eyeProtection = value;
      formValidator.formItemValidate(this, 'eyeProtection', 'ruleForm')
    },
    //富文本编辑器-身体防护 
    submitEditorBody(value) {
      this.iFrom.bodyProtection = value;
      formValidator.formItemValidate(this, 'bodyProtection', 'ruleForm')
    },
    // 应急流程图片上传
    emergencyProcessHandleSuccess() {
      this.iFrom.emergencyProcessList = this.$refs.emergencyProcessListUploadCanRemove.fileList.map(item => {
        return item.id
      })
      formValidator.formItemValidate(this, 'emergencyProcessList', 'ruleForm')
    },
    // 资料附件-文件上传
    handleSuccessReferencesAttachment(fileList) {
      this.iFrom.referencesAttachmentList = fileList.map(item => {
        return item.id
      })
      formValidator.formItemValidate(this, 'referencesAttachmentList', 'ruleForm')
    },
  },
}
</script>
<style lang="less" scoped>
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
</style>