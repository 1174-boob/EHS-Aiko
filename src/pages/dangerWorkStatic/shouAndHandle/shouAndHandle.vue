<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div class="left-box">
      <a-spin :spinning="spinning" wrapperClassName="a-spin">
        <HasFixedBottomWrapper>
          <DefaultForm ref="defaultForm" :iFromDefault="iFromDefault" />
          <template v-if="!((step==4 && !iFrom.dangerEnvironmentVos) || (step ==1 && !isHandlePage))">
            <a-form-model ref="ruleForm" :model="iFrom" :rules="iRules">
              <template title="确认信息">
                <a-divider></a-divider>
                <a-form-model-item class="work-picture" ref="operateBeforePicture" label="作业前确认" prop="operateBeforePicture">
                  <template v-if="step == 1 ">
                    <UploadCanRemove ref="pictogramsListUploadCanRemove" :maxSize="5" :limit="20" :headImgs="iFrom.operateBeforePictureList" @handleSuccess="handleSuccessPictograms"></UploadCanRemove>
                  </template>

                  <template v-else>
                    <img class="main-header-top-right-img" v-for="item in iFrom.operateBeforePictureList" :key="item.id" :src="item.url" @click="handlePreview(item.url)" />
                  </template>
                </a-form-model-item>
                <div class="m-b-20" v-if="iFrom.beforeUser || iFrom.beforeTime">
                  <span>作业确认人：{{iFrom.beforeUser}}</span>
                  <span class="m-l-20">确认时间：{{iFrom.beforeTime | dateFilter}}</span>
                </div>

                <template title="作业环境测定" v-if="iFromDefault.operateType == 'space_work'">
                  <div>
                    <div class="ttile border-b-e7">
                      <div class="ttile-text" :class="[iRules.dangerDetectInfo[0].required?'ttile-text-required':'']">作业环境测定（现场填写项目，每30分钟测量一次）</div>
                      <DashBtn class="ttile-bbtn" v-if="step == 3 || step == 1 ">
                        <div>
                          <a-button type="dashed" @click="openAddSpecialModelModel()">
                            <a-icon type="plus" />添加一行
                          </a-button>
                        </div>
                      </DashBtn>
                    </div>
                    <div class="m-t-20"></div>
                  </div>
                  <a-form-model-item ref="dangerDetectInfo" label=" " prop="dangerDetectInfo" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                    <CommonTable :noPaging="true">
                      <a-table
                        style="width:100%;"
                        bordered
                        :columns="columns"
                        :scroll="{ x: tableScrollX() }"
                        :locale="{emptyText: emptyText}"
                        :data-source="iFrom.dangerDetectInfo"
                        :rowKey="'guid'"
                        :pagination="false"
                      >
                        <div slot="action" slot-scope="record" v-if="step == 3 || step == 1">
                          <span class="color-0067cc cursor-pointer m-r-15" @click="openAddSpecialModelModel(record)">编辑</span>
                          <span class="color-0067cc cursor-pointer" @click="specialtableRowRm(record)">删除</span>
                        </div>
                      </a-table>
                    </CommonTable>
                  </a-form-model-item>
                </template>

                <template title="作业环境检查内容">
                  <div>
                    <div class="ttile border-b-e7">
                      <div class="ttile-text" :class="[iRules.dangerEnvironmentVos[0].required?'ttile-text-required':'']">作业环境检查内容</div>
                    </div>
                    <div class="m-t-20"></div>
                  </div>
                  <a-form-model-item ref="dangerEnvironmentVos" label=" " prop="dangerEnvironmentVos" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
                    <CommonTable :noPaging="true">
                      <a-table
                        style="width:100%;"
                        bordered
                        :columns="columnsWork"
                        :scroll="{ x: tableScrollX(columnsWork) }"
                        :locale="{emptyText: emptyText}"
                        :data-source="iFrom.dangerEnvironmentVos"
                        :rowKey="'checkContentCode'"
                        :pagination="false"
                      >
                        <div slot="action" slot-scope="record" class="radio-group-box">
                          <a-radio-group name="radioGroup" v-model="record.checkResult" :disabled="disableEdit">
                            <a-radio :value="'1'">是</a-radio>
                            <a-radio :value="'2'">否</a-radio>
                            <a-radio :value="'3'">不涉及</a-radio>
                          </a-radio-group>
                        </div>
                      </a-table>
                    </CommonTable>
                  </a-form-model-item>
                </template>

                <a-form-model-item class="work-picture" v-if="step == 3" ref="operateAfterPicture" label="作业后确认" prop="operateAfterPicture">
                  <template v-if="isHandlePage">
                    <UploadCanRemove ref="operateAfterPictureUploadCanRemove" :maxSize="5" :limit="20" :headImgs="iFrom.operateAfterPictureList" @handleSuccess="handleOperateAfterPicture"></UploadCanRemove>
                  </template>
                  <template v-else>
                    <img class="main-header-top-right-img" v-for="item in iFrom.operateAfterPictureList" :key="item.id" :src="item.url" @click="handlePreview(item.url)" />
                  </template>
                </a-form-model-item>
                <template v-if="iFrom.afterUserAndTime && iFrom.afterUserAndTime.length">
                  <div class="m-b-20" v-for="(itemObj,index) in iFrom.afterUserAndTime" :key="index">
                    <template v-for="(value,key,index) in itemObj">
                      <span :key="index">
                        <span>作业确认人：{{key}}</span>
                        <span class="m-l-20">确认时间：{{value | dateFilter}}</span>
                      </span>
                    </template>
                  </div>
                </template>
              </template>
            </a-form-model>
          </template>

          <div slot="fixedBottom">
            <FixedBottom>
              <div>
                <a-button class="m-r-15" @click="iBack">返回</a-button>

                <template v-if="step==1">
                  <a-button type="primary" class="m-r-15" v-if="isHandlePage" @click="iSave">通过</a-button>
                  <a-button type="primary" class="m-r-15" v-if="!isHandlePage && iFromDefault.createUserId == userId" :loading="loading" @click="iRevoke">撤回</a-button>
                  <a-button type="primary" class="m-r-15" v-if="isHandlePage" :loading="loading" @click="iClose">作业关闭</a-button>
                </template>
                <template v-if="step==2">
                  <a-button type="primary" class="m-r-15" v-if="isHandlePage" @click="iSave">通过</a-button>
                  <a-button type="primary" class="m-r-15" v-if="isHandlePage" :loading="loading" @click="iReject">驳回</a-button>
                </template>
                <template v-if="step==3">
                  <a-button type="primary" class="m-r-15" v-if="isHandlePage" :loading="loadingTwo" @click="iStaging">暂存</a-button>
                  <a-button type="primary" class="m-r-15" v-if="isHandlePage" :loading="loading" @click="iEndClose">作业关闭</a-button>
                </template>
              </div>
            </FixedBottom>
          </div>
        </HasFixedBottomWrapper>
      </a-spin>
    </div>
    <div class="right-box" v-if="logList.length">
      <LogList v-show="!spinning" :logList="logList" :logItem="{status:'handerType',person:'hander',time:'handerTime',note:'handerExplain'}" />
    </div>

    <!-- 添加特种作业员弹窗 -->
    <AddSpecialModel v-model="addSpecialModelShow" :addSpecialModelData="addSpecialModelData" :moduleList="iFrom.dangerDetectInfo" @changeSpecialModuleList="changeSpecialModuleList" />

    <HandleModel v-model="handleModelShow" :modelType="modelType" :step="step" :plainOptions="plainOptions" />
  </div>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import { cloneDeep, isArray } from 'lodash'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import UploadCanRemove from '@/components/upload/uploadCanRemove.vue';
import chemicalDict from "@/mixin/chemicalDict.js";
import { getDangerWorkStaticDetailApi, getDangerWorkStaticLogApi, closeDangerWorkStaticItemApi, revokeDangerWorkStaticItemApi, passDangerWorkStaticApi, rejectDangerWorkStaticApi, stagingDangerWorkStaticApi, getDangerWorkStaticPeopleApi } from "@/services/dangerWorkStatic.js";
import { PushTask } from '@/services/api'
import cancelLoading from "@/mixin/cancelLoading";
import AddSpecialModel from "./components/addSpecialModel.vue";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import LogList from '@/components/logList/index.vue'
import HandleModel from './components/handleModel.vue';
import DefaultForm from './components/defaultForm.vue'
import dayJs from 'dayjs';
import { getQueryVariable } from "@/utils/util.js";
export default {
  components: { FixedBottom, UploadCanRemove, AddSpecialModel, LogList, HandleModel, DefaultForm },
  mixins: [chemicalDict, cancelLoading, teableCenterEllipsis],
  data() {
    return {
      // 通过、驳回弹窗-显示隐藏
      handleModelShow: false,
      // 弹窗类型 通过、驳回
      modelType: 'pass',
      plainOptions: [],

      // 添加一行弹窗-显示隐藏
      addSpecialModelShow: false,
      addSpecialModelData: {},
      spinning: true,
      iFromDefault: {},
      iFrom: {},
      iRules: {
        operateBeforePicture: [{ required: false, message: "作业前照片不能为空", trigger: "change" },],
        dangerDetectInfo: [{ required: true, message: "作业环境测定不能为空", trigger: "change" },],
        dangerEnvironmentVos: [{ required: true, message: "作业环境检查内不能为空", trigger: "change" },],
        operateAfterPicture: [{ required: false, message: "作业后确认照片不能为空", trigger: "change" },],
      },
      columns: [
        {
          title: "氧气含量(%)",
          dataIndex: "oxygen",
          key: "oxygen",
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
          minWidth: 150,
        },
        {
          title: "可燃气浓度(%LEL)",
          dataIndex: "combustibleGas",
          key: "combustibleGas",
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
          minWidth: 150,
        },
        {
          title: "一氧化碳(PPM)",
          dataIndex: "carbon",
          key: "carbon",
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
          minWidth: 150,
        },
        {
          title: "毒害气体(PPM)",
          dataIndex: "poisonGas",
          key: "poisonGas",
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
          minWidth: 150,
        },
        {
          title: "检测人",
          dataIndex: "detectPerson",
          key: "detectPerson",
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
          minWidth: 150,
        },
        {
          title: "检测时间",
          dataIndex: "detectTime",
          key: "detectTime",
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
          minWidth: 150,
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          fixed: "right", // 固定操作列
          width: 140 // 宽度根据操作自定义设置
        }
      ],
      labelCol: { span: 3 },
      wrapperCol: { span: 17 },
      columnsWork: [
        {
          title: "内容",
          dataIndex: "checkContent",
          key: "checkContent",
          minWidth: 150,
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          align: 'center',
          fixed: "right", // 固定操作列
          width: 230 // 宽度根据操作自定义设置
        }
      ],
      logList: [],
      userId: undefined,
      companyId: undefined,
      // 主键
      operateId: undefined,
    }
  },
  created() {
    this.operateId = this.$route.query.operateId || getQueryVariable('operateId')
    this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
    this.companyId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).company.companyId
  },
  mounted() {
    // 页面初始化
    this.initPage()
  },
  computed: {
    isHandlePage() {
      return !this.$route.meta.isShowPage
    },
    step() {
      /**
       * Before_dangerous_operation__1 作业前一次操作   选人
       * Before_dangerous_operation__2 作业前二次操作
       * In_dangerous_peration 作业中
       * Closed 已关闭
       * Operate_Withdraw 撤回
       * Closed__auto1 作业后自动关闭
       * Closed__auto2 作业前过期自动关闭
       * Closed__auto3 作业前手动关闭
       */
      let stp = 99
      switch (this.iFromDefault.infoStatus) {
        case 'Before_dangerous_operation__1':
          stp = 1
          break;
        case 'Before_dangerous_operation__2':
          stp = 2
          break;
        case 'Operate_Withdraw':
          stp = 1
          break;
        case 'In_dangerous_peration':
          stp = 3
          break;
        case 'Closed':
          stp = 4
          break;
        case 'Closed__auto2':
          stp = 4
          break;
        case 'Closed__auto3':
          stp = 4
          break;
        default:
          break;
      }
      console.log('当前stp:', stp);
      return stp
    },
    disableEdit() {
      let dis = true
      if (this.isHandlePage) {
        if (this.step == 2 || this.step == 3) {
          dis = true
        } else {
          dis = false
        }
      } else {
        dis = true
      }
      return dis
    },
  },
  methods: {
    // 页面初始化
    initPage() {
      // 获取页面详情和组织机构
      Promise.all([this.getPageDetail()])
        .then(resArr => { })
        .catch(() => { })
        .finally(() => {
          setTimeout(() => {
            this.spinning = false
          }, 200);
        })
    },
    //获取节点用户信息
    getUserNodeInfo(iFromDefault) {
      let apiData = {
        corporationId: [iFromDefault.corporationId],
      }
      return getDangerWorkStaticPeopleApi(apiData)
        .then(res => {
          const { data } = res
          this.plainOptions = (data || []).map(item => {
            const { userId: value, name: label } = item
            return { value, label }
          })
        })
        .catch(err => { })
    },
    // 图片预览
    handlePreview(url) {
      this.$hevueImgPreview(url);
    },
    // 获取页面详情
    getPageDetail() {
      let operateId = this.operateId
      let apiData = { operateId }
      return getDangerWorkStaticDetailApi(apiData)
        .then(async res => {
          this.iFromDefault = res.data ? cloneDeep(res.data) : {}
          setTimeout(() => {
            this.$refs.defaultForm.initPage()
          });
          // 移除操作按钮
          if (this.disableEdit) {
            this.columns = this.columns.filter(item => {
              return item.key != 'action'
            })
          }

          // 作业前第一次处理
          if (this.step == 1 && this.iFromDefault.infoStatus != 'Operate_Withdraw') {
            this.checkContentListHandle(this.iFromDefault.operateType)
            await Promise.all([this.getUserNodeInfo(this.iFromDefault), this.getflowLog(this.iFromDefault)])
            // await this.getflowLog(this.iFromDefault)
          } else {
            await Promise.all([this.handleIFrom(this.iFromDefault), this.getflowLog(this.iFromDefault)])
          }

          return Promise.resolve(this.iFromDefault)
        })
        .catch(err => {
          return Promise.reject(this.iFromDefault)
        })
    },
    // 处理iFrom
    async handleIFrom(iFromDefault) {
      let { beforePicture: operateBeforePicture, beforeUser, beforeTime, afterPicture: operateAfterPicture, dangerDetectInfo, dangerEnvironment: dangerEnvironmentVos, afterUserAndTime } = iFromDefault
      // 作业前照片 operateBeforePicture
      let operateBeforePictureList = []
      if (isArray(operateBeforePicture) && operateBeforePicture.length) {
        operateBeforePictureList = await this.getPortraitUrltFn(operateBeforePicture)
        operateBeforePictureList = this.dealImgEcho(operateBeforePictureList, "fileName", "filePath")
        console.log('作业前照片', operateBeforePictureList);
      }

      // 作业确认人
      // beforeUser  
      // beforeTime
      // 作业后照片 operateAfterPicture
      let operateAfterPictureList = []
      if (isArray(operateAfterPicture) && operateAfterPicture.length) {
        operateAfterPictureList = await this.getPortraitUrltFn(operateAfterPicture)
        operateAfterPictureList = this.dealImgEcho(operateAfterPictureList, "fileName", "filePath")
        console.log('作业后照片', operateAfterPictureList);
      }
      // 危险作业环境检测信息 dangerDetectInfo
      dangerDetectInfo = this.addGuid(dangerDetectInfo)
      // 危险作业环境检查内容 dangerEnvironmentVos

      // 整合数据
      this.iFrom = { operateBeforePicture, beforeUser, beforeTime, operateBeforePictureList, operateAfterPicture, operateAfterPictureList, dangerDetectInfo, dangerEnvironmentVos, afterUserAndTime }
      console.log(this.iFrom);
    },
    // 列表添加guid
    addGuid(list) {
      (list || []).forEach(item => {
        item.guid = this.guid()
      })
      return list
    },
    // 获取操作记录
    getflowLog(iFromDefault) {
      let apiData = {
        operateId: this.operateId,
        handerId: iFromDefault.handerId,
      }
      return getDangerWorkStaticLogApi(apiData)
        .then(res => {
          let logList = res.data || []
          this.logList = cloneDeep(logList)
        })
        .catch(err => { })
    },
    // 处理作业环境检查内容
    checkContentListHandle(dictName) {
      dictName = dictName + '_ck'
      let dangerEnvironmentVos = cloneDeep(this.getChemicalDictList(dictName))
      dangerEnvironmentVos.forEach(item => {
        item.operateType = dictName
        item.checkContent = item.dictLabel
        item.checkContentCode = item.dictValue
        item.checkResult = '3'
      })
      // console.log('处理作业环境检查内容', dangerEnvironmentVos);
      this.$set(this.iFrom, 'dangerEnvironmentVos', dangerEnvironmentVos)
    },
    // 图片上传-作业前照片
    handleSuccessPictograms() {
      let operateBeforePicture = this.$refs.pictogramsListUploadCanRemove.fileList.map(item => {
        return item.id
      })
      this.$set(this.iFrom, 'operateBeforePicture', operateBeforePicture)
      formValidator.formItemValidate(this, 'operateBeforePicture', 'ruleForm')
    },
    // 图片上传-作业后照片
    handleOperateAfterPicture() {
      let operateAfterPicture = this.$refs.operateAfterPictureUploadCanRemove.fileList.map(item => {
        return item.id
      })
      this.$set(this.iFrom, 'operateAfterPicture', operateAfterPicture)
      formValidator.formItemValidate(this, 'operateAfterPicture', 'ruleForm')
    },
    // 特种作业员-打开窗口-新增、编辑
    openAddSpecialModelModel(row) {
      this.addSpecialModelData = row ? row : {}
      this.addSpecialModelShow = true;
    },
    // 特种作业员-添加、修改一行
    changeSpecialModuleList(moduleDataList) {
      console.log(moduleDataList);
      this.$set(this.iFrom, 'dangerDetectInfo', moduleDataList)
      formValidator.formItemValidate(this, 'dangerDetectInfo', 'ruleForm')
    },
    // 特种作业员-删除一行
    specialtableRowRm(row) {
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          this.iFrom.dangerDetectInfo = this.iFrom.dangerDetectInfo.filter(item => {
            return item.guid != row.guid
          })
          formValidator.formItemValidate(this, 'dangerDetectInfo', 'ruleForm')
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
      return formAll
    },
    iRevoke() {
      this.$antConfirm({
        title: "确定撤回吗?",
        onOk: () => {
          return revokeDangerWorkStaticItemApi({ operateId: this.operateId })
            .then((res) => {
              this.$antMessage.success('撤回成功');
              this.$router.push({ path: '/safeManage/dangerWorkStatic/dangerWorkStaticAccount' })
            })
            .catch(err => {
              console.log(err, err);
            });
        },
      });
    },
    iSave() {
      if (!this.formValidate() || this.loadingTwo) {
        return
      }
      this.modelType = 'pass'
      this.handleModelShow = true
    },
    iSaveApi(remake, securityUser) {
      console.log(this.iFrom);
      this.handleLoadingTwo();
      let apiData = {
        operateId: this.operateId,
        handerId: this.userId,
        securityUser,
        remake,
        ...this.iFrom,
      }
      return passDangerWorkStaticApi(apiData)
        .then(res => {
          // 代办推送
          let title = ''
          if (this.step == 1) {
            title = '危险作业前二次确认'
          } else if (this.step == 2) {
            title = '危险作业中处理'
          }
          this.pushTask(securityUser, title);
          this.$antMessage.success('提交成功');
          // 跳转列表页
          this.$router.push({ path: '/safeManage/dangerWorkStatic/dangerWorkStaticAccount' })
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoadingTwo();
        })
    },
    // 代办推送
    async pushTask(securityUser, title) {
      const url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/safeManage/dangerWorkStatic/dangerWorkStaticHandle&operateId=${this.operateId}`
      // 处理userId
      let guardianCode = this.iFromDefault.dangerGuardian.map(item => item.guardianCode)
      guardianCode = guardianCode.join()
      let userId = securityUser ? securityUser : guardianCode
      const pushTask = await PushTask({
        title,
        approval: 'dangerWorkStatic',
        userId,
        url: url,
        docNumber: this.iFromDefault?.operateNumber,   //业务id
        docId: this.operateId,  //主键id
      })
    },
    // 关闭代办推送
    closePushTask() {
      let apiData = {
        approval: 'dangerWorkStatic',
        docNumber: this.iFromDefault?.operateNumber,   //业务id
        docId: this.operateId,  //主键id
      }
      PushTask(apiData)
    },
    iClose() {
      let apiData = {
        operateId: this.operateId,
        handerId: this.userId,
      }
      this.$antConfirm({
        title: "确定关闭该作业单？",
        onOk: () => {
          return closeDangerWorkStaticItemApi(apiData)
            .then((res) => {
              this.$antMessage.success('关闭成功');
              // 关闭代办推送
              this.closePushTask()
              this.$router.push({ path: '/safeManage/dangerWorkStatic/dangerWorkStaticAccount' })
            })
            .catch(err => { });
        },
      });
    },
    iEndClose() {
      this.modelType = 'close'
      this.handleModelShow = true
    },
    iEndCloseApi(withdrawInfo) {
      let apiData = {
        operateId: this.operateId,
        handerId: this.userId,
        withdrawInfo,
      }
      return this.iStaging(false)
        .then(res => {
          return res
        })
        .then(iStagingRes => {
          return closeDangerWorkStaticItemApi(apiData)
        })
        .then((closeRes) => {
          this.$antMessage.success('关闭成功');
          // 关闭代办推送
          this.closePushTask()
          this.$router.push({ path: '/safeManage/dangerWorkStatic/dangerWorkStaticAccount' })
        })
        .catch(() => { })
    },
    iStaging(isChangePage = true) {
      console.log(this.iFrom);
      isChangePage && this.handleLoadingTwo();
      let apiData = {
        operateId: this.operateId,
        handerId: this.userId,
        ...this.iFrom,
      }
      return stagingDangerWorkStaticApi(apiData)
        .then(res => {
          if (isChangePage) {
            this.$antMessage.success('暂存成功');
            // 跳转列表页
            this.$router.push({ path: '/safeManage/dangerWorkStatic/dangerWorkStaticAccount' })
          }
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoadingTwo();
        })
    },
    iReject() {
      this.modelType = 'reject'
      this.handleModelShow = true
    },
    iRejectApi(withdrawInfo) {
      console.log(this.iFrom);
      this.handleLoadingTwo();
      let apiData = {
        operateId: this.operateId,
        handerId: this.userId,
        withdrawInfo,
      }
      return rejectDangerWorkStaticApi(apiData)
        .then(res => {
          this.$antMessage.success('驳回成功');
          // 关闭代办推送
          this.closePushTask()
          // 跳转列表页
          this.$router.push({ path: '/safeManage/dangerWorkStatic/dangerWorkStaticAccount' })
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoadingTwo();
        })
    },
    // 返回
    iBack() {
      this.setKeepalive(true)
      // 跳转列表页
      this.$router.push({ path: '/safeManage/dangerWorkStatic/dangerWorkStaticAccount' })
    },
  }
}
</script>

<style lang="less" scoped>
.searchtable-wrapper {
  display: flex;
  .left-box {
    flex: 1;
    position: relative;
    display: flex;
    overflow: hidden;
    ::v-deep .fixed-bottom {
      bottom: 0px;
    }
  }
  .right-box {
    flex: none;
    display: flex;
  }
}
.main-header-top-right-img {
  width: 84px;
  height: 84px;
  margin: 0 0 12px 12px;
  cursor: pointer;
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
.ttile {
  display: flex;
  align-items: center;
  margin-bottom: -3px;
  border-bottom: 1px solid transparent;
  .ttile-text {
    // margin-bottom: 10px;
    margin-right: 12px;
  }
  .ttile-text-required {
    &::before {
      display: inline-block;
      margin-right: 4px;
      color: #f5222d;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: "*";
    }
  }
  .ttile-bbtn {
    margin-bottom: 0px;
  }
}
::v-deep .radio-group-box {
  .ant-radio {
    margin-left: 6px !important;
    margin-right: 0px !important;
  }
  .ant-radio-wrapper {
    margin-right: 0px !important;
  }
}
.work-picture {
  display: flex;
  align-items: flex-start;
  ::v-deep .ant-form-item-control-wrapper {
    flex: 1;
  }
}
::v-deep .fixed-bottom {
  width: 100% !important;
  bottom: 0px !important;
  left: 0px !important;
}
::v-deep .el-range-editor.is-disabled {
  color: rgba(0, 0, 0, 0.65) !important;
  background-color: #f5f5f5 !important;
}
::v-deep .el-range-editor.is-disabled input {
  color: rgba(0, 0, 0, 0.65) !important;
  background-color: #f5f5f5 !important;
}
::v-deep .el-input__icon.el-range__icon.el-icon-time {
  display: none;
}
</style>





