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
            :hasDepartment="false" @corporationChange="corporationChange" :labelCol="labelCol" :wrapperCol="wrapperCol">
          </CommonDept>

          <a-form-model-item ref="title" label="标题" prop="title">
            <a-input v-model.trim="iFrom.title" :maxLength="200" placeholder="请输入"></a-input>
          </a-form-model-item>

          <a-form-model-item ref="type" label="类型" prop="type">
            <a-select show-search v-model="iFrom.type" placeholder="请选择" @change="changeEmployeeType">
              <a-select-option v-for="item in getDictTarget('s', 'employeeType')" :key="item.key" :value="item.key">{{
                item.value }}</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item ref="signDeadline" label="签署截止日期" prop="signDeadline">
            <a-date-picker v-model="iFrom.signDeadline" placeholder="请选择" style="width:100%;" valueFormat="YYYY-MM-DD"
              :disabled-date="disabledDate" />
          </a-form-model-item>
        </template>

        <template description="安全教育培训讲师">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>安全教育培训讲师</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>

          <template description="转（复）岗时，讲师不显示公司级" v-if="!isChangePost">
            <StaffOrDept ref="trainerCompanyUserId" :labelTitle="'公司级'" :treeRoles="iRules"
              :propKey="'trainerCompanyUserId'" :treePlaceholder="'请选择'" :checkedTreeNode="checkedTreeNodeCompany"
              :deptTreeId="deptTreeId" :checkAbel="false"
              @getTreeData="(value) => getTreeDataCompany(value, { idAttr: 'trainerCompanyUserId', codeAttr: 'trainerCompanyJobNumber', nameAttr: 'trainerCompanyUserName' }, 'checkedTreeNodeCompany')" />
          </template>

          <StaffOrDept ref="trainerDeptUserId" :labelTitle="'车间（部门）级'" :treeRoles="iRules" :propKey="'trainerDeptUserId'"
            :treePlaceholder="'请选择'" :checkedTreeNode="checkedTreeNodeDept" :deptTreeId="deptTreeId" :checkAbel="false"
            @getTreeData="(value) => handleStaffFormData(value, { idAttr: 'trainerDeptUserId', codeAttr: 'trainerDeptJobNumber', nameAttr: 'trainerDeptUserName' }, 'checkedTreeNodeDept')" />

          <StaffOrDept ref="trainerGroupUserId" :labelTitle="'班组级'" :treeRoles="iRules" :propKey="'trainerGroupUserId'"
            :treePlaceholder="'请选择'" :checkedTreeNode="checkedTreeNodeGroup" :deptTreeId="deptTreeId" :checkAbel="false"
            @getTreeData="(value) => handleStaffFormData(value, { idAttr: 'trainerGroupUserId', codeAttr: 'trainerGroupJobNumber', nameAttr: 'trainerGroupUserName' }, 'checkedTreeNodeGroup')" />

          <StaffOrDept ref="trainerEsdUserId" :labelTitle="'环安部培训负责人'" :treeRoles="iRules" :propKey="'trainerEsdUserId'"
            :treePlaceholder="'请选择'" :checkedTreeNode="checkedTreeNodeAssign" :deptTreeId="deptTreeId" :checkAbel="false"
            :onPreview="!isChangePost"
            @getTreeData="(value) => handleStaffFormData(value, { idAttr: 'trainerEsdUserId', codeAttr: 'trainerEsdJobNumber', nameAttr: 'trainerEsdUserName' }, 'checkedTreeNodeAssign')" />
        </template>

        <template title="模板">
          <div>
            <div class="ttile border-b-e7">
              <PageTitle class="ttile-text required-star">模板</PageTitle>
              <DashBtn class="ttile-bbtn">
                <div>
                  <a-button type="dashed" @click="openSelTempDrawer()">
                    <a-icon type="plus" />选择
                  </a-button>
                </div>
              </DashBtn>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-form-model-item ref="selTempList" label=" " prop="selTempList" :label-col="{ span: 0 }"
            :wrapper-col="{ span: 24 }">
            <ul class="sel-tempList" v-if="Array.isArray(iFrom.selTempList).length">
              <li class="selTempItem" v-for="item in iFrom.selTempList" :key="item.templateId">
                <img class="pic" :src="item.coverFile?.filePath || ''" :alt="item.templateName">
                <div class="mask">
                  <div class="maskBtn">
                    <a-icon class="eyeBtn" type="eye" @click="openTempPreviewModel(item)" />
                    <a-icon class="deleteBtn" type="delete" @click="rmSelTempItem(item)" />
                  </div>
                </div>
              </li>
            </ul>
            <a-empty description="暂未选择" v-else />
          </a-form-model-item>
        </template>


        <template description="培训人员">
          <div>
            <div class="ttile border-b-e7">
              <PageTitle class="ttile-text required-star">培训人员</PageTitle>
              <DashBtn class="ttile-bbtn">
                <div>
                  <a-button type="dashed" @click="opeUploadImportModel">
                    <a-icon type="plus" />批量导入
                  </a-button>
                </div>
              </DashBtn>
              <span></span>
              <a-button type="link" @click="changeIsRetract">
                {{isRetract?'展开':'收起'}} 
              </a-button>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-form-model-item ref="securityEducationRecordsList" label=" " prop="securityEducationRecordsList"
            :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
            <CommonTable :noPaging="true">
              <a-table style="width:100%;" :columns="columns" :scroll="{ x: tableScrollX() }"
                :locale="{ emptyText: emptyText }" :data-source="showSecurityEducationRecordsList"
                :rowKey="(record, index) => index" :pagination="false">
              </a-table>
            </CommonTable>
          </a-form-model-item>
        </template>

      </a-form-model>
    </a-spin>

    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="cancleSubmit">取消</a-button>
          <a-button type="primary" class="m-r-15" :loading="loadingTwo" @click="iSave">发起</a-button>
        </div>
      </FixedBottom>
    </div>

    <!-- 选择模板抽屉 -->
    <SelTempDrawer v-model="selTempDrawerShow" :selTempList="iFrom.selTempList"
      @changeSelTempDrawerList="changeSelTempDrawerList" />

    <!-- 预览模板弹窗 -->
    <TempPreviewModel v-model="tempPreviewModelShow" :previewData="previewData" :readOnly="true" />

    <UploadImport v-model="uploadImportShow" @uploadSuccess="uploadEduSuccess"/>

  </HasFixedBottomWrapper>
</template>
<script>
import { getDictTarget } from '@/utils/dictionary'
import { formValidator } from "@/utils/clx-form-validator.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { cloneDeep } from 'lodash'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import SelTempDrawer from "./components/selTempDrawer.vue";
import TempPreviewModel from './components/tempPreviewModel.vue';
import { educationAdd, educationDetail } from '@/services/api.js'
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
import { PushTask } from '@/services/api'
import moment from 'moment';
import StaffOrDept from "@/components/staffOrDept";
import UploadImport from '@/pages/safetyEduManagement/safetyEduInitiate/components/uploadImport.vue'

export default {
  components: { FixedBottom, SelTempDrawer, StaffOrDept, UploadImport, TempPreviewModel },
  mixins: [teableCenterEllipsis, chemicalDict, cancelLoading],
  data() {
    return {
      getDictTarget,

      tempPreviewModelShow: false,
      previewData: {},

      uploadImportShow: false,
      spinning: true,
      labelCol: { span: 4 },
      wrapperCol: { span: 15 },
      iFrom: {},
      iRules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" },],
        type: [{ required: true, message: "类型不能为空", trigger: "change" },],
        signDeadline: [{ required: true, message: "签署截止日期不能为空", trigger: "change" },],

        selTempList: [{ required: true, message: "模板不能为空", trigger: "change" },],
        securityEducationRecordsList: [{ required: true, message: "培训人员不能为空", trigger: "change" },],
      },
      // 培训人员table
      columns: [
        {
          title: "姓名",
          dataIndex: "userName",
          key: "userName",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          minWidth: 120,
        },
        {
          title: "工号",
          dataIndex: "userJobNumber",
          key: "userJobNumber",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          minWidth: 120,
        },
        {
          title: "部门",
          dataIndex: "deptName",
          key: "deptName",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          minWidth: 120,
        },
        {
          title: "岗位",
          dataIndex: "jobName",
          key: "jobName",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          minWidth: 120,
        },
        {
          title: "性别",
          dataIndex: "sex",
          key: "sex",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          minWidth: 120,
        },
        {
          title: "身份证号",
          dataIndex: "idNumber",
          key: "idNumber",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          minWidth: 160,
        },
        {
          title: "家庭住址",
          dataIndex: "address",
          key: "address",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          minWidth: 160,
        },
      ],
      // 添加一行弹窗-显示隐藏
      selTempDrawerShow: false,
      addCasNoModelData: {},
      // 是否是转复岗
      isChangePost: false,

      // 是否收起  /展开
      isRetract:false,

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
    // 当前展示的培训人员list
    showSecurityEducationRecordsList(){
      const allRecordsList = this.iFrom.securityEducationRecordsList || [];
      return this.isRetract ? allRecordsList.filter((item,index)=> index+1 >= 10) : allRecordsList
    },
  },
  mounted() {
    // 页面初始化
    this.initPage()
  },
  methods: {
    // 打开批量导入弹窗
    opeUploadImportModel() {
      this.uploadImportShow = true
    },
    // 导入培训人员成功
    uploadEduSuccess(eduArr){
      this.$set(this.iFrom, 'securityEducationRecordsList', eduArr)
    },
    // 培训人员列表  收起/展开
    changeIsRetract(){
      this.isRetract = !this.isRetract
    },

    // 类型change 1新员工 2转(复)岗
    changeEmployeeType(e) {
      console.log('e', e);
      this.isChangePost = e == 2
    },
    // 预览模板弹窗
    openTempPreviewModel(item) {
      this.previewData = item
      this.tempPreviewModelShow = true
    },
    // 页面初始化
    initPage() {
      if (this.isAddPage) {
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
      // let applyUserName = (treeName || '') + (treeName && treeCode ? '/' : '') + (treeCode || '')
      let applyUserName = treeName

      return { applyUserCode, applyUserName, treeIdList }
    },
    // 公司级 人员选择事件
    getTreeDataCompany(value, iFromObj, checkedTreeNodeName) {
      this.handleStaffFormData(value, iFromObj, checkedTreeNodeName);
      // 环安部培训负责人自动选择
      this.handleStaffFormData(value, { idAttr: 'trainerEsdUserId', codeAttr: 'trainerEsdJobNumber', nameAttr: 'trainerEsdUserName' }, 'checkedTreeNodeAssign')
    },
    // 选择人员后的change事件
    handleStaffFormData(value, iFromObj, checkedTreeNodeName) {
      const { applyUserCode, applyUserName, treeIdList } = this.getTreeData(value)

      // 针对组件取消后数据被清空时做保存数据处理
      this[checkedTreeNodeName] = treeIdList

      // 表单赋值
      const { idAttr, codeAttr, nameAttr } = iFromObj
      this.$set(this.iFrom, idAttr, applyUserCode)
      this.$set(this.iFrom, codeAttr, applyUserCode)
      this.$set(this.iFrom, nameAttr, applyUserName)

      // 表单校验
      setTimeout(() => {
        formValidator.formItemValidate(this, idAttr, "ruleForm")
      }, 100);
    },

    // 时间限制
    disabledDate(current) {
      return current < moment().subtract(1, 'days').endOf('day')
    },
    // 组织机构-改变
    corporationChange(val, corporationDeptId) {
      // this.$set(this.iFrom, 'applyDepartCode', undefined)
    },
    // 获取页面详情
    getPageDetail() {
      let operateId = this.operateId
      let apiData = { operateId }
      return new Promise((resove, rej) => {
        educationDetail(apiData)
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
      if (!this.formValidate() || this.loading || this.spinning) {
        return
      }

      let apiData = { ...this.iFrom }
      // 处理模板数据
      apiData.templateId = this.iFrom.selTempList[0].templateId
      apiData.templateName = this.iFrom.selTempList[0].templateName
      apiData.selTempList = undefined
      console.log(apiData);
      
      const apiName = this.isAddPage ? educationAdd : editDangerWorkStaticApi
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
    // 选择模板抽屉
    openSelTempDrawer() {
      this.selTempDrawerShow = true;
    },
    // 模板change事件
    changeSelTempDrawerList(selTempList) {
      this.$set(this.iFrom, 'selTempList', selTempList)
      formValidator.formItemValidate(this, 'selTempList', 'ruleForm')
    },
    // 删除选择的模板
    rmSelTempItem(rmItem) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: () => {
          const newSelTempList = this.iFrom.selTempList.filter(item => item.templateId != rmItem.templateId)
          this.$set(this.iFrom, 'selTempList', newSelTempList)
          formValidator.formItemValidate(this, 'selTempList', 'ruleForm')
          return Promise.resolve()
        }
      })
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

.sel-tempList {
  padding-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 18px;
  grid-row-gap: 18px;

  .selTempItem {
    position: relative;
    overflow: hidden;

    &:hover {
      .mask {
        display: flex;
      }
    }

    .selRadioBox {
      position: absolute;
      top: 0px;
      left: 0px;
      padding: 4px 8px 4px;
      z-index: 2;

      ::v-deep .ant-radio-inner {
        border-color: #0067cc;
      }
    }

    .pic {
      width: 100%;
    }

    .mask {
      display: none;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: rgba(255, 255, 255, 0.5);
      align-items: center;
      justify-content: center;

      .maskBtn {
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;

        .eyeBtn {
          font-size: 24px;
          margin-right: 20px;
          cursor: pointer;
        }

        .deleteBtn {
          font-size: 22px;
          cursor: pointer;
        }
      }
    }
  }
}</style>