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
              <a-form-model-item ref="chemicalName" label="化学品名称" prop="chemicalName">
                <a-select v-model="iFrom.chemicalName" placeholder="请选择" show-search :filter-option="filterOption">
                  <a-select-option v-for="item in chemicalsList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <CommonSearchItem
                ref="commonSearchItem"
                :CommonFormInline="iFrom"
                :rules="iRules"
                :hasDepartment="true"
                :departmentMultiple="true"
                :notTablePage="true"
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                deptLabel="使用部门"
              ></CommonSearchItem>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="form" label="形态" prop="form">
                <a-select v-model="iFrom.form" placeholder="请选择" show-search :filter-option="filterOption">
                  <a-select-option v-for="item in shapeList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="mainIngredient" label="主要成分" prop="mainIngredient">
                <a-input v-model.trim="iFrom.mainIngredient" :maxLength="100" placeholder="请输入主要成分"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="warningWord" label="警示词" prop="warningWord">
                <a-input v-model.trim="iFrom.warningWord" :maxLength="100" placeholder="请输入警示词"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="dangerousProperties" label="危险特性" prop="dangerousProperties">
                <a-input v-model.trim="iFrom.dangerousProperties" :maxLength="100" placeholder="请输入危险特性"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="pictureList" label="象形图" prop="pictureList">
                <UploadCanRemove ref="pictureListUploadCanRemove" :maxSize="5" :limit="20" :headImgs="iFrom.echoPictureList" @handleSuccess="handleSuccessPictograms"></UploadCanRemove>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="precaution" label="预防措施" prop="precaution">
                <a-textarea v-model="iFrom.precaution" :maxLength="1000" placeholder="请输入预防措施"></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="incidentResponse" label="事故响应" prop="incidentResponse">
                <a-textarea v-model="iFrom.incidentResponse" :maxLength="1000" placeholder="请输入事故响应"></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="safeStorage" label="安全储存" prop="safeStorage">
                <a-textarea v-model="iFrom.safeStorage" :maxLength="1000" placeholder="请输入安全储存"></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="wasteDisposal" label="废弃处置" prop="wasteDisposal">
                <a-textarea v-model="iFrom.wasteDisposal" :maxLength="1000" placeholder="请输入废弃处置"></a-textarea>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>

        <template title="联系信息">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>联系信息</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>

          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="supplier" label="供应商" prop="supplier">
                <a-input v-model.trim="iFrom.supplier" :maxLength="100" placeholder="请输入供应商"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="supplierContact" label="联系方式" prop="supplierContact">
                <a-input v-model.trim="iFrom.supplierContact" :maxLength="100" placeholder="请输入联系方式"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="supplierAddress" label="地址" prop="supplierAddress">
                <a-input v-model.trim="iFrom.supplierAddress" :maxLength="100" placeholder="请输入地址"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="supplierPostcode" label="邮编" prop="supplierPostcode">
                <a-input v-model.trim="iFrom.supplierPostcode" :maxLength="100" placeholder="请输入邮编"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="emergencyCall" label="化学品事故应急咨询电话" prop="emergencyCall">
                <a-input v-model.trim="iFrom.emergencyCall" :maxLength="100" placeholder="请输入化学品事故应急咨询电话"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="attachmentList" label="资料附件" prop="attachmentList">
                <UploadBtnStyle
                  :accept="['.doc', '.docx','.pdf','.xls','.xlsx','.ppt']"
                  :fileLists="iFrom.echoAttachmentList"
                  :maxSize="20"
                  :limit="20"
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
  </HasFixedBottomWrapper>
</template>
<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import { cloneDeep, debounce } from 'lodash'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import UploadCanRemove from '@/components/upload/uploadCanRemove.vue';
import ImportFile from "@/components/upload/importFile.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import { addChemicalIdentSafetySignsApi, getChemicalIdentSafetySignsAddDetailApi, changeChemicalIdentSafetySignsApi } from '@/services/chemicalIdentSafetyTipsAdd.js'
import cancelLoading from "@/mixin/cancelLoading";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
export default {
  components: { FixedBottom, UploadCanRemove, ImportFile, UploadBtnStyle },
  mixins: [chemicalDict, cancelLoading],
  data() {
    return {
      spinning: true,
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      iFrom: {
        chemicalName: undefined,
        form: undefined,
        deptList: undefined,
        mainIngredient: undefined,
        warningWord: undefined,
        dangerousProperties: undefined,
        pictureList: undefined,
        echoPictureList: [],
        precaution: undefined,
        incidentResponse: undefined,
        safeStorage: undefined,
        wasteDisposal: undefined,
        supplier: undefined,
        supplierContact: undefined,
        supplierAddress: undefined,
        supplierPostcode: undefined,
        emergencyCall: undefined,
        attachmentList: undefined,
        echoAttachmentList: [],
      },
      iRules: {
        chemicalName: [{ required: true, message: "化学品名称不能为空", trigger: "change" },],
        form: [{ required: true, message: "形态不能为空", trigger: "change" },],
        deptList: [{ required: true, message: "使用部门不能为空", trigger: "change" },],
        mainIngredient: [{ required: true, message: "主要成分不能为空", trigger: "change" },],
        warningWord: [{ required: true, message: "警示词不能为空", trigger: "blur" },],
        dangerousProperties: [{ required: true, message: "危险特性不能为空", trigger: "blur" },],
        pictureList: [{ required: true, message: "象形图不能为空", trigger: "change" },],
        precaution: [{ required: true, message: "预防措施不能为空", trigger: "change" },],
        incidentResponse: [{ required: true, message: "事故响应不能为空", trigger: "change" },],
        safeStorage: [{ required: true, message: "安全储存不能为空", trigger: "change" },],
        wasteDisposal: [{ required: true, message: "废弃处置不能为空", trigger: "change" },],
        supplier: [{ required: true, message: "供应商不能为空", trigger: "blur" },],
        supplierContact: [{ required: true, message: "联系方式不能为空", trigger: "blur" },],
        supplierAddress: [{ required: true, message: "地址不能为空", trigger: "blur" },],
        supplierPostcode: [{ required: true, message: "邮编不能为空", trigger: "blur" },],
        emergencyCall: [{ required: true, message: "化学品事故应急咨询电话不能为空", trigger: "blur" },],
        attachmentList: [{ required: false, message: "参考资料不能为空", trigger: "blur" },],
      },
      // 化学品名称list
      chemicalsList: [],
      treeData: [
        { id: 1, pId: 0, value: '1', name: 'Expand to load' },
        { id: 2, pId: 0, value: '2', name: 'Expand to load' },
        { id: 3, pId: 0, value: '3', name: 'Tree Node', isLeaf: true },
      ],
      // 使用部门树
      consoleOrganizeTreeList: [],
      replaceFields: { title: 'name', key: 'id', value: 'id' },
      // 形态list
      shapeList: [],
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
      formValidator.formItemValidate(this, 'deptList', 'ruleForm')
    },
    // 页面初始化
    initPage() {
      if (this.isAddPage) {
        this.spinning = false
      } else {
        // 获取页面详情和组织机构
        Promise.all([this.getPageDetail()])
          .then(resArr => { })
          .finally(() => {
            this.spinning = false
          })
      }
    },
    // 获取页面详情
    getPageDetail() {
      let labelId = this.$route.query.labelId
      let apiData = { labelId }
      return new Promise((res, rej) => {
        getChemicalIdentSafetySignsAddDetailApi(apiData)
          .then(res => {
            let iFrom = res.data
            // 象形图-回显
            iFrom.pictureList = this.handleFileIdS(iFrom.echoPictureList)
            iFrom.echoPictureList = this.handleFileRedisplay(iFrom.echoPictureList)
            // 资料附件-回显
            iFrom.attachmentList = this.handleFileIdS(iFrom.echoAttachmentList)
            iFrom.echoAttachmentList = this.handleFileRedisplay(iFrom.echoAttachmentList)
            this.iFrom = iFrom
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
      let apiData = { ...this.iFrom }
      return addChemicalIdentSafetySignsApi(apiData)
        .then(res => {
          this.$antMessage.success('新增成功');
          // 跳转列表页
          this.$router.push({
            path: '/safeManage/chemicalSafeManage/chemicalsIdentification/chemicalIdentSafetySigns'
          })
        })
        .catch(err => { })
    },
    // 全部表单修改api
    changeChemicalIdentSafetyTips() {
      let apiData = { ...this.iFrom }
      return changeChemicalIdentSafetySignsApi(apiData)
        .then(res => {
          this.$antMessage.success('修改成功');
          // 跳转列表页
          this.$router.push({
            path: '/safeManage/chemicalSafeManage/chemicalsIdentification/chemicalIdentSafetySigns'
          })
        })
        .catch(err => { })
    },
    // 树搜索过滤
    filterTree(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue)
    },
    // 象形图图片上传
    handleSuccessPictograms() {
      this.iFrom.pictureList = this.$refs.pictureListUploadCanRemove.fileList.map(item => {
        return item.id
      })
      formValidator.formItemValidate(this, 'pictureList', 'ruleForm')
    },
    // 资料附件-文件上传
    handleSuccessReferencesAttachment(fileList) {
      this.iFrom.attachmentList = fileList.map(item => {
        return item.id
      })
      formValidator.formItemValidate(this, 'attachmentList', 'ruleForm')
    },
  }
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