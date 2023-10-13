<template>
  <!-- 发起 -->
  <HasFixedBottomWrapper>
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <a-form-model ref="ruleForm" :model="iFrom" :rules="iRules" :label-col="labelCol" :wrapper-col="wrapperCol">

        <template description="基本信息">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>基本信息</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>

          <CommonDept ref="corporationId" :CommonFormInline="iFrom" :rules="iRules" :notTablePage="true"
            :hasDepartment="true" @corporationChange="corporationChange" @corporationDeptChange="corporationDeptChange"
            :labelCol="labelCol" :wrapperCol="wrapperCol"></CommonDept>

          <a-form-model-item ref="biaoti" label="标题" prop="biaoti">
            <a-input v-model.trim="iFrom.biaoti" :maxLength="200" placeholder="请输入"></a-input>
          </a-form-model-item>

          <a-form-model-item ref="leixing" label="类型" prop="leixing">
            <a-select show-search v-model="iFrom.leixing" placeholder="请选择" @change="changeEmployeeType">
              <a-select-option v-for="item in getDictTarget('s', 'employeeType')" :key="item.key" :value="item.key">{{
                item.value }}</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item ref="qianshujiezhiriqi" label="签署截止日期" prop="qianshujiezhiriqi">
            <a-date-picker v-model="iFrom.qianshujiezhiriqi" placeholder="请选择" style="width:100%;"
              valueFormat="YYYY-MM-DD" :disabled-date="disabledDate" />
          </a-form-model-item>
        </template>

        <!-- <template description="安全教育培训讲师">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>安全教育培训讲师</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>

          <template description="转（复）岗时，讲师不显示公司级" v-if="!isChangePost">
            <StaffOrDept ref="gongsiji" :labelTitle="'公司级'" :treeRoles="iRules" :propKey="'gongsiji'"
              :treePlaceholder="'请选择'" :checkedTreeNode="checkedTreeNodeCompany" :deptTreeId="deptTreeId"
              :checkAbel="false"
              @getTreeData="(value) => getTreeDataCompany(value, 'gongsiji', 'gongsijiname', 'checkedTreeNodeCompany')" />
          </template>

          <StaffOrDept ref="chejianbumenji" :labelTitle="'车间（部门）级'" :treeRoles="iRules" :propKey="'chejianbumenji'"
            :treePlaceholder="'请选择'" :checkedTreeNode="checkedTreeNodeDept" :deptTreeId="deptTreeId" :checkAbel="false"
            @getTreeData="(value) => handleStaffFormData(value, 'chejianbumenji', 'chejianbumenjiname', 'checkedTreeNodeDept')" />

          <StaffOrDept ref="banzuji" :labelTitle="'班组级'" :treeRoles="iRules" :propKey="'banzuji'" :treePlaceholder="'请选择'"
            :checkedTreeNode="checkedTreeNodeGroup" :deptTreeId="deptTreeId" :checkAbel="false"
            @getTreeData="(value) => handleStaffFormData(value, 'banzuji', 'banzujiname', 'checkedTreeNodeGroup')" />

          <StaffOrDept ref="peixunfuzeren" :labelTitle="'环安部培训负责人'" :treeRoles="iRules" :propKey="'peixunfuzeren'"
            :treePlaceholder="'请选择'" :checkedTreeNode="checkedTreeNodeAssign" :deptTreeId="deptTreeId" :checkAbel="false"
            :onPreview="!isChangePost"
            @getTreeData="(value) => handleStaffFormData(value, 'peixunfuzeren', 'peixunfuzerenname', 'checkedTreeNodeAssign')" />

          <template title="模板">
            <div>
              <div class="ttile border-b-e7">
                <PageTitle class="ttile-text">模板</PageTitle>
                <DashBtn class="ttile-bbtn">
                  <div>
                    <a-button type="dashed" @click="openAddCasNoModel()">
                      <a-icon type="plus" />选择
                    </a-button>
                  </div>
                </DashBtn>
              </div>
              <div class="m-t-20"></div>
            </div>
            <a-form-model-item ref="moban" label=" " prop="moban" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
              11111
            </a-form-model-item>
          </template>
        </template> -->


        <template description="培训人员">
          <div>
            <div class="ttile border-b-e7">
              <PageTitle class="ttile-text">培训人员</PageTitle>
              <DashBtn class="ttile-bbtn">
                <div>
                  <a-button type="dashed" @click="opeUploadImportModel()">
                    <a-icon type="plus" />批量导入
                  </a-button>
                </div>
              </DashBtn>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-form-model-item ref="peixunrenyuan" label=" " prop="peixunrenyuan" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
            <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :data="tableList">

              <vxe-column field="xingming" title="姓名" :min-width="120"></vxe-column>
              <vxe-column field="gonghao" title="工号" :min-width="120"></vxe-column>
              <vxe-column field="bumen" title="部门" :min-width="120"></vxe-column>
              <vxe-column field="gangwei" title="岗位" :min-width="120"></vxe-column>
              <vxe-column field="xingbie" title="性别" :min-width="120"></vxe-column>
              <vxe-column field="shenfenzhenghao" title="身份证号" :min-width="160"></vxe-column>
              <vxe-column field="jiatingzhuzhi" title="家庭住址" :min-width="180"></vxe-column>

              <template #empty>
                <div style="padding:16px 0;">
                  <a-empty />
                </div>
              </template>
            </vxe-table>
          </a-form-model-item>
        </template>

      </a-form-model>
    </a-spin>

    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="cancleSubmit">取消</a-button>
          <a-button type="primary" class="m-r-15" :loading="loadingTwo" @click="iSave">保存</a-button>
          <a-button type="primary" class="m-r-15" :loading="loading" @click="iSubmit">提交</a-button>
        </div>
      </FixedBottom>
    </div>

    <!-- 添加现场监护人弹窗 -->
    <AddCasNoModel v-model="addCasNoModelShow" :addCasNoModelData="addCasNoModelData" :moduleList="iFrom.dangerGuardian"
      :deptTreeId="deptTreeId" @changeModuleList="changeModuleList" />

    <UploadImport v-model="uploadImportShow"/>
  </HasFixedBottomWrapper>
</template>
<script>
import { getDictTarget } from '@/utils/dictionary'

import { formValidator } from "@/utils/clx-form-validator.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { cloneDeep } from 'lodash'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import AddCasNoModel from "./components/addCasNoModel.vue";
import AddSpecialModel from "./components/addSpecialModel.vue";
import { addDangerWorkStaticApi, getDangerWorkStaticDetailApi, editDangerWorkStaticApi } from '@/services/dangerWorkStatic.js'
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
import { PushTask } from '@/services/api'
import moment from 'moment';
import StaffOrDept from "@/components/staffOrDept";
import UploadImport from '@/pages/safetyEduManagement/safetyEduInitiate/components/uploadImport.vue'
export default {
  components: { FixedBottom, AddCasNoModel, StaffOrDept,UploadImport },
  mixins: [teableCenterEllipsis, chemicalDict, cancelLoading],
  data() {
    return {
      getDictTarget,

      uploadImportShow:false,
      spinning: true,
      labelCol: { span: 4 },
      wrapperCol: { span: 15 },
      iFrom: {},
      iRules: {
        biaoti: [{ required: true, message: "标题不能为空", trigger: "blur" },],
        leixing: [{ required: true, message: "类型不能为空", trigger: "change" },],
        qianshujiezhiriqi: [{ required: true, message: "签署截止日期不能为空", trigger: "change" },],

      },

      tableList:[
        {
          id:1
        },
        
      ],

      // 添加一行弹窗-显示隐藏
      addCasNoModelShow: false,
      addCasNoModelData: {},
      // 是否是转复岗
      isChangePost: false,

      checkedTreeNodeCompany: [],
      checkedTreeNodeDept: [],
      checkedTreeNodeGroup: [],
      checkedTreeNodeAssign: [],
      // 主键id
      operateId: undefined,
      deptTreeId: undefined,
    }
  },
  created() {
    this.operateId = this.$route.query.operateId + '' || undefined
  },
  computed: {
    // 当前页面是否为新增
    isAddPage() {
      return !this.$route.query.operateId
    },
  },
  mounted() {
    // 页面初始化
    this.initPage()
  },
  methods: {
    opeUploadImportModel(){
      this.uploadImportShow = true
    },  
    // 类型change 1新员工 2转(复)岗
    changeEmployeeType(e) {
      console.log('e', e);
      this.isChangePost = e == 2
    },

    moment,
    // 页面初始化
    initPage() {
      if (this.isAddPage) {
        // this.$set(this.iFrom, 'isMust', '1');
        this.spinning = false
      } else {
        // 获取页面详情
        Promise.all([this.getPageDetail()])
          .finally(() => {
            this.spinning = false
          })
      }
    },
    // 处理选择人员后的change事件数据
    getTreeData(value) {
      const { treeIdList, treeNameAndCodeList } = value

      let { id, treeName, treeCode } = treeNameAndCodeList && treeNameAndCodeList.length ? treeNameAndCodeList[0] : {}
      let applyUserCode = id
      let applyUserName = (treeName || '') + (treeName && treeCode ? '/' : '') + (treeCode || '')

      return { applyUserCode, applyUserName, treeIdList }
    },

    // 公司级 人员选择事件
    getTreeDataCompany(value, keyCode, keyName, checkedTreeNodeName) {
      this.handleStaffFormData(value, keyCode, keyName, checkedTreeNodeName);
      // 环安部培训负责人自动选择
      this.handleStaffFormData(value, 'peixunfuzeren', 'peixunfuzerenname', 'checkedTreeNodeAssign');
    },

    // 选择人员后的change事件
    handleStaffFormData(value, keyCode, keyName, checkedTreeNodeName) {
      const { applyUserCode, applyUserName, treeIdList } = this.getTreeData(value)

      // 针对组件取消后数据被清空时做保存数据处理
      this[checkedTreeNodeName] = treeIdList

      // 表单赋值
      this.$set(this.iFrom, keyCode, applyUserCode)
      this.$set(this.iFrom, keyName, applyUserName)

      // 表单校验
      setTimeout(() => {
        formValidator.formItemValidate(this, keyCode, "ruleForm")
      }, 100);
    },

    corporationDeptChange(deptData) {

    },

    // 时间限制
    disabledDate(current) {
      return current < moment().subtract(1, 'days').endOf('day')
    },
    // 组织机构-改变
    corporationChange(val, corporationDeptId) {
      // console.log('被清除了');
      this.$set(this.iFrom, 'applyDepartCode', undefined)
      this.$set(this.iFrom, 'applyDepartName', undefined)
      this.$set(this.iFrom, 'areaDepartCode', undefined)
      this.$set(this.iFrom, 'areaDepartName', undefined)
      // 人员相关
      this.deptTreeId = corporationDeptId
      this.$set(this.iFrom, 'applyUserCode', undefined)
      this.$set(this.iFrom, 'applyUserName', undefined)
      this.checkedTreeNode = []
      // 现场监护人
      this.$set(this.iFrom, 'dangerGuardian', [])
    },
    // 获取页面详情
    getPageDetail() {
      let operateId = this.operateId
      let apiData = { operateId }
      return new Promise((resove, rej) => {
        getDangerWorkStaticDetailApi(apiData)
          .then(res => {

            resove()
          })
          .catch(err => {
            rej()
          })
      })
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
    // 表单校验
    formValidate() {
      // 如果页面表单验证有报错则滚动到表单验证报错的地方
      let formAll = true
      this.$refs["ruleForm"].validate((valid, object) => {
        if (!valid) {
          formAll = false
          this.scrollView(object);
        }
      });
      if (!this.iFrom.applyUserCode) {
        formAll = false
      }

      return formAll
    },
    // 提交之前的流程api
    iSubmit() {
      if (!this.formValidate() || this.loading || this.spinning) {
        return
      }
      this.handleLoading();
      let apiData = { ...this.iFrom, isDraft: 2 }
      const apiName = this.isAddPage ? addDangerWorkStaticApi : editDangerWorkStaticApi
      return apiName(apiData)
        .then(res => {

        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 代办推送
    async pushTask(securityUser, operateId) {
      if (operateId) {
        const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/safeManage/dangerWorkStatic/dangerWorkStaticHandle&operateId=${operateId}`
        const pushTask = await PushTask({
          title: "危险作业前确认",
          approval: 'dangerWorkStatic',
          userId: securityUser,
          url: url,
          docNumber: this.iFrom?.operateNumber,   //业务id
          docId: operateId,  //主键id
        })
      }
    },
    // 保存api
    iSave() {
      console.log(this.iFrom);
      if (!this.formValidate() || this.loading || this.spinning) {
        return
      }

      // 草稿 1-是，2-否
      let apiData = { ...this.iFrom, isDraft: 1 }
      const apiName = this.isAddPage ? addDangerWorkStaticApi : editDangerWorkStaticApi
      this.handleLoadingTwo();
      apiName(apiData)
        .then(res => {
          this.$antMessage.success('保存成功');
          // 跳转列表页
          this.$router.push({ path: '/safeManage/dangerWorkStatic/dangerWorkStaticDraft' })
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoadingTwo();
        })
    },
    // 取消
    cancleSubmit() {
      this.setKeepalive(true)
      this.$router.go(-1)
    },
    // 现场监护人-打开窗口-新增、编辑
    openAddCasNoModel(row) {
      if (this.iFrom.corporationId) {
        this.addCasNoModelData = row ? row : {}
        this.addCasNoModelShow = true;
      } else {
        this.$antMessage.warn('请先选择所属组织')
      }
    },
    // 现场监护人-添加、修改一行
    changeModuleList(moduleDataList) {
      this.$set(this.iFrom, 'dangerGuardian', moduleDataList)
      formValidator.formItemValidate(this, 'dangerGuardian', 'ruleForm')
    },
  }
}
</script>

<style lang="less" scoped>
.ttile {
  display: flex;
  align-items: center;
  margin-bottom: -3px;
  border-bottom: 1px solid transparent;

  .ttile-text {
    margin-bottom: 10px;
    margin-right: 12px;
  }

  .ttile-bbtn {
    margin-bottom: 0px;
  }
}

::v-deep .fixed-bottom {
  width: 100% !important;
  bottom: 0px !important;
  left: 0px !important;
}

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

.has-error .el-input__inner {
  border-color: #f5222f !important;
}

::v-deep .el-input__icon.el-range__icon.el-icon-time {
  display: none;
}
</style>