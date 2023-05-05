<template>
  <div class="form-wrapper clx-show-scroll clx-flex-1 beauty-scroll">
    <div class="flex flex-direction-column">
      <ng-form-design class="form-design" ref="formDesign" :custom-components="customComponents" :reder="false" :clear="false" :config="{httpConfig: (config) => httpConfig(config)}">
        <!-- 自定义属性配置 -->
        <template slot="custom-properties" slot-scope="{selectItem}">
          <template v-if="selectItem.options">
            <!-- <Properties :selectItem="selectItem"/> -->
            <UploadimgProperties :selectItem="selectItem" />
            <ImportFileProperties :selectItem="selectItem" />
            <!-- <FixedValueProperties :selectItem="selectItem"></FixedValueProperties> -->
            <OrganizeTreeProperties :selectItem="selectItem"></OrganizeTreeProperties>
            <StaffTreeProperties :selectItem="selectItem"></StaffTreeProperties>
            <DictDataProperties :selectItem="selectItem"></DictDataProperties>
            <DictDataMutipleProperties :selectItem="selectItem"></DictDataMutipleProperties>
            <SelfTimeRangeProperties :selectItem="selectItem"></SelfTimeRangeProperties>
            <AnyTimeProperties :selectItem="selectItem"></AnyTimeProperties>
            <OrganizeTreeCheckboxProperties :selectItem="selectItem"></OrganizeTreeCheckboxProperties>
            <RelationFormProperties :selectItem="selectItem"></RelationFormProperties>
            <RadioListProperties :selectItem="selectItem"></RadioListProperties>
            <!-- <PassReferenceProperties :selectItem="selectItem"></PassReferenceProperties>
            <GetRemoteDataProperties :selectItem="selectItem"></GetRemoteDataProperties>
            <SystemDictProperties :selectItem="selectItem"></SystemDictProperties> -->
            <!-- <CenterOrganizeProperties :selectItem="selectItem"></CenterOrganizeProperties> -->
          </template>
        </template>
        <template slot="formName">
          <span>{{this.formName ? this.formName : ""}}</span>
        </template>
        <template slot="controlButton">
          <span class="color-0067cc m-r-10" type="primary" @click="saveFormJson">
            <a-icon class="m-r-8" type="save" />保存表单数据
          </span>
        </template>
        <template slot="form-extend-properties" slot-scope="{data }">
          <FormList :list="data.list" :config="data.config" />
        </template>
      </ng-form-design>
    </div>
  </div>
</template> 
<script>
// import FixedBottom from "@/components/commonTpl/fixedBottom";
// import FormPage from "@/components/commonTpl/formPage.vue";
import FormList from './tpl/formList'

// 引用自定义的表单组件和自定义组件配置信息修改组件addFormUploadSuccess
// import CustomT from './components/CustomT/TCustom';
// import Properties from './components/CustomT/properties';
// 自定义组件-上传图片
import Uploadimg from "./components/uploadImg/uploadImg.vue";
import UploadimgProperties from "./components/uploadImg/properties.vue";
// 自定义组件-上传文件
import ImportFile from "./components/importFile/importFile.vue";
import ImportFileProperties from "./components/importFile/properties.vue";
// 自定义组件-固定值
// import FixedValue from "./components/fixedValue/fixedValue.vue";
// import FixedValueProperties from "./components/fixedValue/properties.vue";
// 自定义组件-组织机构树
import OrganizeTree from "./components/organizeTree/organizeTree.vue";
import OrganizeTreeProperties from "./components/organizeTree/properties.vue";
// 自定义组件-组织机构树
import StaffTree from "./components/staffTree/staffTree.vue";
import StaffTreeProperties from "./components/staffTree/properties.vue";
// 自定义组件-字典
import DictData from "./components/dictData/dictData.vue";
import DictDataProperties from "./components/dictData/properties.vue";
// 自定义组件-字典-多选
import DictDataMutiple from "./components/dictDataMutiple/dictDataMutiple.vue";
import DictDataMutipleProperties from "./components/dictDataMutiple/properties.vue";
// 自定义组件-时间范围
import SelfTimeRange from "./components/selfTimeRange/selfTimeRange.vue";
import SelfTimeRangeProperties from "./components/selfTimeRange/properties.vue";
// 自定义组件-任意时间点
import AnyTime from "./components/anyTime/anyTime.vue";
import AnyTimeProperties from "./components/anyTime/properties.vue";
// 自定义组件-组织机构多选
import OrganizeTreeCheckbox from "./components/organizeTreeCheckbox/organizeTreeCheckbox.vue";
import OrganizeTreeCheckboxProperties from "./components/organizeTreeCheckbox/properties.vue";
// 自定义组件-关联表单
import RelationForm from "./components/relationForm/relationForm.vue";
import RelationFormProperties from "./components/relationForm/properties.vue";
// 自定义组件-单选列表
import RadioList from "./components/radioList/radioList.vue";
import RadioListProperties from "./components/radioList/properties.vue";
// 自定义组件-关联传参
import PassReference from "./components/passReference/passReference.vue";
import PassReferenceProperties from "./components/passReference/properties.vue";
// 自定义组件-获取远程下拉选项
import GetRemoteData from "./components/getRemoteData/getRemoteData.vue";
import GetRemoteDataProperties from "./components/getRemoteData/properties.vue";
// 自定义组件-系统字典
import SystemDict from "./components/systemDict/systemDict.vue";
import SystemDictProperties from "./components/systemDict/properties.vue";
// 自定义组件-中心组织
import CenterOrganize from "./components/centerOrganize/centerOrganize.vue";
import CenterOrganizeProperties from "./components/centerOrganize/properties.vue";

import { UpdateNgform, DetailNgform } from "@/services/api.js";

import { mapMutations } from "vuex";



export default {
  name: 'App',
  components: {
    UploadimgProperties,
    ImportFileProperties,
    OrganizeTreeProperties,
    StaffTreeProperties,
    DictDataProperties,
    DictDataMutipleProperties,
    FormList,
    SelfTimeRangeProperties,
    AnyTimeProperties,
    OrganizeTreeCheckboxProperties,
    RelationFormProperties,
    RadioListProperties,
    PassReferenceProperties,
    GetRemoteDataProperties,
    SystemDictProperties,
    // CenterOrganizeProperties
  },
  props: ["tabStatus", "keepActiveKey", "keepActiveOne", "isHiddenTab"], // keepActiveOne更新模板成功后才能让点击
  data() {
    return {
      rules: {
        url: [{ required: true, message: "模块url不能为空", trigger: "blur" }],
      },
      formJson: {
      },
      // 自定义组件列表
      customComponents: [
        // { 
        //   type: 'customT' ,
        //   label: "自定义图片展示", // 标题文字 
        //   component: CustomT ,
        //   options: {
        //     style: 'width:100px;height:100px'
        //   },
        //   model: "customT",
        //   rules: [
        //     {
        //       required: false,
        //       message: "必填项"
        //     }
        //   ]
        // },
        {
          type: 'uploadimg',
          label: "上传图片", // 标题文字 
          component: Uploadimg,
          options: {
            style: 'width:70px;height:100px',
            maxSize: 5,
            maxlength: 1,
            disabled: false, // 是否禁用true禁用false不禁用
            hidden: false, // 是否隐藏true隐藏false不隐藏
          },
          model: "uploadimg",
          rules: [
            {
              required: false,
              message: "必填项"
            }
          ]
        },
        {
          type: 'importFile',
          label: "上传文件", // 标题文字 
          component: ImportFile,
          options: {
            style: 'width:70px;height:100px',
            maxSize: 5,
            fileLayout: [],
            disabled: false,
            hidden: false,
          },
          model: "importFile", // 提交数据的时候提交给接口的字段值
          rules: [
            {
              required: false,
              message: "必填项",
            }
          ]
        },
        {
          type: 'organizeTree',
          label: "组织单选", // 标题文字 
          component: OrganizeTree,
          options: {
            value: "",
            disabled: false,
            hidden: false,
          },
          model: "OrganizeTree", // 数据字段
          rules: [
            {
              required: false,
              message: "必填项"
            }
          ]
        },
        {
          type: 'staffTree',
          label: "组织人员", // 标题文字 
          component: StaffTree,
          options: {
            value: "",
            disabled: false,
            hidden: false,
          },
          model: "StaffTree", // 数据字段
          rules: [
            {
              required: false,
              message: "必填项"
            }
          ]
        },
        {
          type: 'dictData',
          label: "字典项数据", // 标题文字 
          component: DictData,
          options: {
            dictKey: "",
            dictOptions: [],
            disabled: false,
            hidden: false,
          },
          model: "dictData", // 数据字段
          rules: [
            {
              required: false,
              message: "必填项"
            }
          ]
        },
        {
          type: 'dictDataMutiple',
          label: "字典多选", // 标题文字 
          component: DictDataMutiple,
          options: {
            dictKey: "",
            dictOptions: [],
            disabled: false,
            hidden: false,
          },
          model: "dictDataMutiple", // 数据字段
          rules: [
            {
              required: false,
              message: "必填项"
            }
          ]
        },
        {
          type: 'selfTimeRange',
          label: "时间范围", // 标题文字 
          component: SelfTimeRange,
          options: {
            disabled: false,
            hidden: false,
          },
          model: "selfTimeRange", // 数据字段
          rules: [
            {
              required: false,
              message: "必填项"
            }
          ]
        },
        {
          type: 'anyTime',
          label: "时间点", // 标题文字 
          component: AnyTime,
          options: {
            disabled: false,
            hidden: false,
          },
          model: "anyTime", // 数据字段
          rules: [
            {
              required: false,
              message: "必填项"
            }
          ]
        },
        {
          type: 'organizeTreeCheckbox',
          label: "组织多选", // 标题文字 
          component: OrganizeTreeCheckbox,
          options: {
            disabled: false,
            hidden: false,
          },
          model: "organizeTreeCheckbox", // 数据字段
          rules: [
            {
              required: false,
              message: "必填项"
            }
          ]
        },
        {
          type: 'relationForm',
          label: "关联表单", // 标题文字 
          component: RelationForm,
          options: {
            disabled: false,
            hidden: false,
            formMsg: {
              fieldKey: "",
              tempId: "",
              relationBusinessStatus: [],
              onlyRead: false
            },
            dataList: []
          },
          model: "relationForm", // 数据字段
          rules: [
            {
              required: false,
              message: "必填项"
            }
          ]
        },
        {
          type: 'radioList',
          label: "单选列表", // 标题文字 
          component: RadioList,
          options: {
            disabled: false,
            hidden: false,
            radioList: [],
            renderData: []
          },
          model: "radioList", // 数据字段
          rules: [
            {
              required: false,
              message: "必填项"
            }
          ]
        },
        // {
        //   type: 'passReference',
        //   label: "带出数据", // 标题文字 
        //   component: PassReference,
        //   options: {
        //     disabled: false,
        //     hidden: false,
            
        //   },
        //   model: "passReference", // 数据字段
        //   rules: [
        //     {
        //       required: false,
        //       message: "必填项"
        //     }
        //   ]
        // },
        // {
        //   type: 'getRemoteData',
        //   label: "远程下拉框", // 标题文字 
        //   component: GetRemoteData,
        //   options: {
        //     disabled: false,
        //     hidden: false,
            
        //   },
        //   model: "getRemoteData", // 数据字段
        //   rules: [
        //     {
        //       required: false,
        //       message: "必填项"
        //     }
        //   ]
        // },
        // {
        //   type: 'systemDict',
        //   label: "系统字典", // 标题文字 
        //   component: SystemDict,
        //   options: {
        //     disabled: false,
        //     hidden: false,
            
        //   },
        //   model: "systemDict", // 数据字段
        //   rules: [
        //     {
        //       required: false,
        //       message: "必填项"
        //     }
        //   ]
        // },
        // {
        //   type: 'centerOrganize',
        //   label: "中心组织", // 标题文字 
        //   component: CenterOrganize,
        //   options: {
        //     disabled: false,
        //     hidden: false,
        //   },
        //   model: "centerOrganize", // 数据字段
        //   rules: [
        //     {
        //       required: false,
        //       message: "必填项"
        //     }
        //   ]
        // },
      ],
      fromlist: null,
      formName: null
    }
  },
  watch: {
    tabStatus(newVal) {
      if (newVal == 2) {
        this.saveFormJson();
      }
    }
  },
  created() {
    this.formName = this.$route.query.name;
    if (this.$route.query && this.$route.query.from) {
      this.fromlist = true;
      this.saveTempId(this.$route.query.tempId);
      this.getEditData();
    } else {
      this.$router.push({ name: "表单流程配置" })
    }
    let customComponentsList = [];
    for (let i = 0; i < this.customComponents.length; i++) {
      this.customComponents[i].model = this.customComponents[i].model + "_" + this.randomNum();
      customComponentsList.push({
        type: this.customComponents[i].type,
        component: this.customComponents[i].component
      })
    }
    this.saveCustomComponents(customComponentsList);
  },
  methods: {
    ...mapMutations("setting", ["saveTempId", "saveCustomComponents"]),
    httpConfig(config) { // 请求接口时统一加上参数
      const token_type = sessionStorage.getItem('token_type');
      const token = sessionStorage.getItem('access_token');
      // 请求成功处理
      if (sessionStorage.getItem('token')) {//判断浏览器中的cookie中是否存在项目的token
        config.headers.token = sessionStorage.getItem('token')
      }
      let clientId = process.env.VUE_APP_CLIENTID;
      let clientSecret = process.env.VUE_APP_CLIENT_SECRET;
      let headerLogin = clientId + ':' + clientSecret;
      if (config.url.indexOf('oauth/token') > 0 || config.url.indexOf('getToken') > 0) {
        config.headers.Authorization = 'Basic ' + Base64.encode(headerLogin); // 增加客户端认证
      } else if (token_type && token) {
        config.headers.Authorization = token_type + ' ' + token;
      }
      return config;
    },
    getEditData() { // 拿编辑数据
      let params = {
        tempId: this.$route.query.tempId,
      }
      DetailNgform(params).then(res => {
        this.formJson = {
          code: res.data.code,
          url: res.data.url,
          remark: res.data.remark,
          name: res.data.name
        }
        this.$refs["formDesign"].initModel(JSON.parse(res.data.templateData))
      }).catch((err) => {
        console.log(err);
      })
    },
    saveFormJson() {
      this.$antConfirm({
        title: '提示',
        content: '表单数据保存后将覆盖现有版本，如果用户继续点击确定，则表单更新成功后，后续创建数据都按新表单进行内容完善；',
        cancelText: '取消',
        onOk: async () => {
          if (this.$refs["formDesign"].getModel().list.length <= 0) {
            this.$antMessage.error("表单项不能为空");
            this.keepActiveKey();
            return;
          }
          // 保存的时候可以根据传过来的参数来决定是哪个菜单里的表单
          let params = {
            ...this.formJson,
            templateData: this.$refs["formDesign"].getModel(),
          }
          params.templateData.config.isHiddenTab = this.isHiddenTab;
          if (this.fromlist) {
            params.tempId = this.$route.query.tempId;
            let result1 = await UpdateNgform(params)
            if (this.isHiddenTab == 1) {
              this.$antMessage.info("请重新配置流程字段权限");
            } else {
              this.$antMessage.success("保存成功");
            }
          }
          this.keepActiveOne(true);
        },
        onCancel: () => {
          this.keepActiveKey();
        },
      });

    },
    //生成从minNum到maxNum的随机数
    randomNum() {
      let minNum = 1000000000000;
      let maxNum = 1999999999999;
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-select-dropdown {
  z-index: 3000 !important;
}
.form-wrapper {
  height: calc(100vh - 87px);
  overflow: auto;
}
</style>
 