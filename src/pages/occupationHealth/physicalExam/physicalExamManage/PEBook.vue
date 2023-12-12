<template>
  <div class="pe-book-container" :class="[showRightLog ? 'resolve-page' : '']">
    <HasFixedBottomWrapper>
      <div class="arc">
        <h3 class="top-title">预约体检</h3>
        <div class="info-container mgt-20 mgb-45">
          <h3>
            姓名：
            <span>{{userInfo.name}}</span>
            <span class="work-num-span">工号：</span>
            <span>{{userInfo.workNum}}</span>
          </h3>
          <div class="base-info-body">
            <a-row class="mgb-20">
              <a-col :span="6">
                <span class="info-label">性别：</span>
                <span>{{ userInfo.sex ? +userInfo.sex === 1 ? '男' : '女' : '--' }}</span>
              </a-col>
              <a-col :span="6">
                <span class="info-label">身份证：</span>
                <span>{{userInfo.certificateNum || '--'}}</span>
              </a-col>
              <a-col :span="6">
                <span class="info-label">籍贯：</span>
                <span>{{userInfo.nativePlace || '--'}}</span>
              </a-col>
              <a-col :span="6">
                <span class="info-label">入司时间：</span>
                <span>{{(userInfo.joyCompanyTime ? userInfo.joyCompanyTime.join('-') : '') || '--'}}</span>
              </a-col>
            </a-row>
            <a-row class="mgb-20">
              <a-col :span="6">
                <span class="info-label">文化程度：</span>
                <span>{{education[userInfo.degreeEducation] || '--'}}</span>
              </a-col>
              <a-col :span="6">
                <span class="info-label">手机号：</span>
                <span>{{userInfo.phone || '--'}}</span>
              </a-col>
              <a-col :span="6">
                <span class="info-label">出生年月：</span>
                <span>{{(userInfo.birthTime ? userInfo.birthTime.join('-') : '') || '--'}}</span>
              </a-col>
              <a-col :span="6">
                <span class="info-label">婚姻状况：</span>
                <span>{{userInfo.maritalStatus ? +userInfo.maritalStatus === 1 ? '已婚' : '未婚' : '--'}}</span>
              </a-col>
            </a-row>
            <a-row class="mgb-20">
              <a-col :span="6">
                <span class="info-label">嗜好：</span>
                <span>{{userInfo.hobby || '--'}}</span>
              </a-col>
              <a-col :span="6">
                <span class="info-label">工龄（月）：</span>
                <span>{{userInfo.workAge || '--'}}</span>
              </a-col>
              <a-col :span="6">
                <span class="info-label">接害工龄（月）：</span>
                <span>{{userInfo.harmfulAge || '--'}}</span>
              </a-col>
              <a-col :span="6">
                <span class="info-label">所属组织：</span>
                <span>{{userInfo.corporationName || '--'}}</span>
              </a-col>
            </a-row>
            <a-row class="mgb-20">
              <a-col :span="6">
                <span class="info-label">所属部门：</span>
                <span>{{userInfo.deptName || '--'}}</span>
              </a-col>
              <a-col :span="6">
                <span class="info-label">岗位：</span>
                <span>{{userInfo.postName || '--'}}</span>
              </a-col>
              <a-col :span="6">
                <span class="info-label">近期体检结论：</span>
                <span>{{checkResultLabel(userInfo.checkResult) || '--'}}</span>
              </a-col>
              <a-col :span="6">
                <span class="info-label">是否构成职业病：</span>
                <span>{{isSickLabel(userInfo.isSick) || '--'}}</span>
              </a-col>
            </a-row>
            <a-row class="mgb-20">
              <a-col :span="24">
                <span class="info-label">接触危害：</span>
                <span>{{userInfo.hazardFactors || '--'}}</span>
              </a-col>
            </a-row>
          </div>
        </div>
        <a-spin :spinning="spinning" wrapperClassName="a-spin">
          <a-form-model ref="ruleForm" :model="form" :rules="rules" :colon="false">
            <a-row>
              <a-col :span="12">
                <a-form-model-item label="体检类型" prop="checkType" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-select :disabled="disabled" allowClear show-search v-model="form.checkType" placeholder="请选择体检类型">
                    <a-select-option v-for="item in checkTypeOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="体检项目" prop="checkItem" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-input disabled v-model="form.checkItem" placeholder="请选择体检项目"></a-input>
                </a-form-model-item>
                <a-form-model-item label="体检城市" prop="city" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-cascader :disabled="disabled" v-model="form.city" :options="cityOptions" style="width: 100%" placeholder="请选择体检城市" @change="handleCityChange">
                    <template #displayRender="{ labels, selectedOptions }">
                      <span v-for="(label, index) in labels" :key="selectedOptions[index].value">
                        <span v-if="index === labels.length - 1">{{ label }}</span>
                        <span v-else>{{ label }} /</span>
                      </span>
                    </template>
                  </a-cascader>
                </a-form-model-item>
                <a-form-model-item label="体检机构" prop="checkAgency" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-select :disabled="disabled" allowClear show-search v-model="form.checkAgency" placeholder="请选择体检机构">
                    <a-select-option v-for="item in checkAgencyOptions" :value="item.dictValue" :key="item.dictValue">{{item.dictLabel}}</a-select-option>
                  </a-select>
                </a-form-model-item>
                <!-- <a-form-model-item label="备注" prop="remarks" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-input v-model="form.remarks"></a-input>
                </a-form-model-item> -->
                <a-form-model-item v-if="isShowDate" label="体检日期" prop="checkDate" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-date-picker :disabled="!canSelectDate" format="YYYY-MM-DD" @change="handleCheckDateChange" v-model="form.checkDate" placeholder="请选择有效期" />
                </a-form-model-item>
                <a-form-model-item v-if="isShowFile" label="体检通知单"  prop="physicalExaminationNoticeFileIdList" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <UploadBtnStyle :onlyShow="!canSelectDate" :showAcceptText="true" :accept="['.pdf']" :showUploadList="true" :fileLists="infoFileIdList" :btnText="'上传文件'" :btnType="'default'" @handleSuccess="handleSuccessSpec"></UploadBtnStyle>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-spin>
      </div>
      <div slot="fixedBottom" v-if="isCreate || isEdit || isRecheck">
        <FixedBottom class="fixed-button-container">
          <a-button @click="onSave">保存</a-button>
          <a-button type="primary" @click="onSubmit">立即预约</a-button>
        </FixedBottom>
      </div>
      <div slot="fixedBottom" v-else-if="isResolve">
        <FixedBottom class="fixed-button-container">
          <a-button @click="reject">驳回</a-button>
          <a-button type="primary" @click="approved">通过</a-button>
        </FixedBottom>
      </div>
      <div slot="fixedBottom" v-else-if="isView">
        <FixedBottom class="fixed-button-container">
          <a-button @click="reback">返回</a-button>
        </FixedBottom>
      </div>
    </HasFixedBottomWrapper>
    <ApproveModal
      :modalInfo="modalInfo"
      :corporationId="userInfo.corporationId"
      @save="doSave"
      @reject="doReject"
      :queryObj="queryObj"
      :isEdit="isEdit"
      :isResolve="isResolve"
      :form="form"
      ref="approveModal"
      :approveVisible.sync="approveVisible"
    />
    <div class="right-side" v-if="showRightLog">
      <OPLog :data="opData" />
    </div>
  </div>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom"
import OPLog from './comp/OPLog'
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import ApproveModal from './comp/ApproveModal'
import { formValidator } from "@/utils/clx-form-validator.js"
import oldDictionary from '@/utils/dictionary'
import dictionary from '@/utils/newDictionary'
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
import {
  getCityOptions, selectDetailByPersonId, healthManageUpdate,GetfileMsgList,
  healthManageAdd, healthManageDetail, healthApproveManageDetail, getFlowLogApi, PushTask
} from "@/services/api.js"
import moment from 'moment'
import { debounce } from 'lodash'
import optionsMixin from '@/pages/occupationHealth/physicalExam/mixin/optionsMixin'
import { getQueryVariable } from "@/utils/util.js";
export default {
  mixins: [optionsMixin],
  components: { FixedBottom, OrganizeLazyTree, OPLog, ApproveModal ,UploadBtnStyle},
  data() {
    return {
      userInfo: {},
      curIndex: -1,
      rebackVisable: false,
      rebackMsg: '',
      chooseStaffVisible: false,
      tableDataList: [],
      isShowFile:false,
      infoFileIdList: [],
      staffArr: [],
      plainOptions: [],
      status: '',//审批状态
      nodeName: '',
      spinning: false,
      form: {
      },
      treeData: [],
      education: {
        '1': '高中',
        '2': '大专',
        '3': '本科',
        '4': '研究生',
        '5': '博士'
      },
      replaceFields: { children: 'childDeptList', title: 'deptName', key: 'deptId', value: 'deptId' },
      consoleOrganizeTreeList: [],
      DEPLOYIDOption: dictionary('approvalType') || [],
      modalInfo: {},
      rules: {
        organization: [
          { required: true, message: "请选择所属组织", trigger: "blur" }
        ],
        checkType: [
          { required: true, message: "请选择体检类型", trigger: "blur" }
        ],
        checkItem: [
          { required: true, message: "请选择体检项目", trigger: "change" }
        ],
        checkDate: [
          { required: true, message: "请选择体检时间", trigger: "change" }
        ]
      },
      infoStatus: '',
      /**new start */
      cityOptions: [],
      opData: [],
      approveVisible: false
    };
  },
  created() {
    this.setRouterCode('physicalExam')
  },
  mounted() {
    this.init()
  },
  computed: {
    queryObj() {
      let query = this.$route.query;
      if (query.id || query.personId) {
        return query;
      } else {
        let id = getQueryVariable('id');
        let personId = getQueryVariable('personId');
        let queryObj = {
          id,
          personId,
        }
        return queryObj
      }
    },
    DEPLOYID() {
      return (this.DEPLOYIDOption.find(item => {
        return item.dictLabel === 'MSDSAPPROVAL'
      }) || {}).dictValue
    },
    canSelectDate() {
      return this.$route.meta && this.$route.meta.isResolve && (this.infoStatus.indexOf('002') > -1)
    },
    isShowDate() {
      return (this.infoStatus.indexOf('002') > -1) || this.status === 'end'
    },
    showRightLog() {
      return this.isResolve || this.$route.query.type === 'approveView'
    },
    labelCol() {
      return this.showRightLog ? { span: 8 } : { span: 4 }
    }, // 设置左边label宽度
    wrapperCol() {
      return this.showRightLog ? { span: 14 } : { span: 18 }
    }, // 设置右边表单宽度
    corporationList() {
      return this.$store.state.setting.corporationList
    },
    disabled() {
      return this.$route.meta && (this.$route.meta.isView || this.$route.meta.isResolve)
    },
    isResolve() {
      return this.$route.meta && this.$route.meta.isResolve
    },
    isView() {
      return this.$route.meta && this.$route.meta.isView
    },
    isEdit() {
      return this.$route.meta && this.$route.meta.isEdit
    },
    isCreate() {
      return this.$route.meta && this.$route.meta.isCreate
    },
    isRecheck() {
      return this.$route.meta && this.$route.meta.isRecheck
    }
  },
  methods: {
    async init() {
      this.getCityOptions()
      this.getUserInfo()
      if (!this.isCreate) {
        this.getDetail()
      }
    },
    async getOpLog(processId, handler) {
      let para = {
        processInstanceId: processId,
        handler: handler
      }
      const { code, data } = await getFlowLogApi(para)
      if (+code === 20000) {
        this.opData = data || []
        console.log(data, 'data')
      }
    },
    async getUserInfo() {
      let para = {
        personId: (this.queryObj || {}).personId
      }
      const { code, data } = await selectDetailByPersonId(para)
      if (+code === 20000) {
        this.userInfo = data || {}
        if (this.isCreate) {
          this.$set(this.form, 'checkItem', data.checkItem)
        }
      }
    },
    async getDetail() {
      let para = {
        checkId: this.queryObj.id
      }
      const { code, data } = await healthApproveManageDetail(para)
      if (+code === 20000) {
        this.modalInfo = {
          createUserId: data.createUserId,
          taskId: data.taskId,
          infoStatus: data.infoStatus,
          checkId: this.queryObj.id,
          handler: data.handler
        }
        this.infoStatus = data.infoStatus
        this.status = data.status
        if (this.showRightLog) {
          let handler = data.handler ? data.handler.split(',') : []
          this.getOpLog(data.processId, handler)
        }
        this.$set(this.form, 'corporationId', data.corporationId)
        this.$set(this.form, 'checkType', data.checkType)
        this.$set(this.form, 'checkItem', data.checkItem)
        this.$set(this.form, 'checkProvince', data.checkProvince)
        this.$set(this.form, 'checkCity', data.checkCity)
        this.$set(this.form, 'checkCounty', data.checkCounty)
        this.$set(this.form, 'processId', data.processId)
        if (typeof data.city === 'string') {
          data.city = JSON.parse(data.city)
          this.$set(this.form, 'city', data.city)
        }
        this.$set(this.form, 'checkDate', data.checkDate)
        this.$set(this.form, 'checkAgency', data.checkAgency)
        if (data.physicalExaminationNoticeFileList && data.physicalExaminationNoticeFileList.length > 0) {
          const fileIdDetailList = data.physicalExaminationNoticeFileList.map((item)=> {
            return item.id
          })
          GetfileMsgList(fileIdDetailList).then((res) => {
            let result = res.data || []
            this.infoFileIdList = (result || []).map(item => {
              return {
                uid: item.id,
                name: item.sourceFileName,
                status: 'done',
                url: item.filePath
              }
            }) 
          }).catch((err) =>{
            console.log(err)
          }) 
        }
        if (this.infoStatus.indexOf('002') > -1 || this.status === 'end'){
          this.isShowFile = true
        } else {
          this.isShowFile = false
        }
        // this.$set(this.form, 'remarks', data.remarks)
        console.log(this.form, '....this.form');
      }
    },
    handleCheckDateChange(val) {
      if (!val) {
        return
      }
      this.form.checkDate = moment(val).format('YYYY-MM-DD')
    },
    handleSuccessSpec(fileList){
      let newList = []
      newList = fileList.map((item) => {
        return item.id
      })
      console.log(newList,999);
      this.form.physicalExaminationNoticeFileIdList = newList
    },
    addRow() {
      this.moduleData = {}
      this.curIndex = -1
      this.moduleVisible = true
      this.$nextTick(() => {
        this.$refs.addModuleRef.initData()
      })
    },
    deleteRow(row, index) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: () => {
          this.tableDataList.splice(index, 1)
        }
      })
    },
    nextCancle() {
      this.rebackVisable = false
    },
    reback() {
      this.setKeepalive(true)
      this.$router.push({
        path: '/occupationHealth/physicalExamApprove'
      })
    },
    // 最后一个节点审批通过 + 归档
    handleCityChange(val, arr) {
      this.form.checkProvince = (arr[0] || {}).code
      this.form.checkCity = (arr[1] || {}).code
      this.form.checkCounty = (arr[2] || {}).code
    },
    async approved() {
      let valid = await this.validate()
      if (!valid) {
        return
      }
      this.approveVisible = true
      this.$nextTick(() => {
        this.modalInfo.date = this.form.checkDate
        this.modalInfo.physicalExaminationNoticeFileIdList = this.form.physicalExaminationNoticeFileIdList
        this.$refs.approveModal && this.$refs.approveModal.setApproveData(this.modalInfo)
      })
    },
    reject() {
      this.approveVisible = true
      this.$nextTick(() => {
        this.$refs.approveModal && this.$refs.approveModal.setApproveData(this.modalInfo, 0)
      })
    },
    chooseStaffCancle() {
      this.chooseStaffVisible = false
    },
    moduleCallback(data) {
      if (this.curIndex !== -1) {
        //编辑
        this.tableDataList.splice(this.curIndex, 1, data)
      } else {
        //新建
        this.tableDataList.push(data)
      }
    },

    handleSuccess(file) {
      this.form.fileId = file = file.map(item => {
        return {
          uid: item.response ? item.response.data.id : item.uid,
          url: item.response ? item.response.data.url : item.url,
          name: item.name
        }
      }) || []
    },
    validate() {
      return new Promise((resolve) => {
        this.$refs.ruleForm.validate(valid => {
          resolve(valid)
        })
      }).catch(err => {
        console.log(err)
      })
    },

    //驳回存草稿
    approveSavaDraft() {
      let para = {
        id: this.queryObj.id,
        opinion: this.rebackMsg
      }
      return msdsApproveSavaDraft(para)
    },

    //提交
    async onSubmit() {
      let valid = await this.validate()
      if (!valid) {
        return
      }
      this.approveVisible = true
      this.$nextTick(() => {
        this.$refs.approveModal && this.$refs.approveModal.getFirstNodeData()
      })
    },
    /** start new*/
    async onSave() {
      let valid = await this.validate()
      if (!valid) {
        return
      }
      this.doSave()
    },
    async doSave(draftStatus = 1, ovaPara = {}) {
      let query = this.queryObj || {}
      let para = {
        batchChecks: [
          {
            personId: query.personId,
            checkType: this.form.checkType
          }
        ],
        isBatch: 2,//1 批量，2 单个
        draftStatus: draftStatus,
        ...this.form,
        city: JSON.stringify(this.form.city),
        ...ovaPara,
        centerId: this.userInfo.centerId,
        corporationId: this.userInfo.corporationId,
      }
      let api = this.isEdit ? healthManageUpdate : healthManageAdd
      if (this.isEdit) {
        para.checkId = query.id
      }
      const { code, data } = await api(para)
      if (+code === 20000) {
        // 消息推送
        if (draftStatus == 2 && data) {
          console.log("hhhiiiii", data);
          let id = data.checkId;
          if (id) {
            let personIds = data.personId;
            let personId = ''
            if (personIds && personIds.length > 0) {
              personId = personIds[0]
            }
            let url = process.env.VUE_APP_LOGIN_URL + "client_id=" + process.env.VUE_APP_CLIENTID + "&response_type=" + process.env.VUE_APP_RESPONSE_TYPE + "&redirect_uri=" + process.env.VUE_APP_REDIRECT_URI + "&routeUrl=" + `/occupationHealth/PEBookResolve&id=${id}&personId=${personId}`
            this.pushTask(url, ovaPara);
          }
        }

        this.$antMessage.success('保存成功')
        if (draftStatus === 1) {
          this.$router.push({
            path: '/occupationHealth/physicalExamDraftList'
          })
        } else {
          this.$router.push({
            path: '/occupationHealth/physicalExamApprove'
          })
        }
      }
    },
    async pushTask(url, ovaPara) {
      const pushTask = await PushTask({
        title: "体检预约处理",
        approval: 'physical_examination',
        userId: ovaPara.handler,
        docId: ovaPara.processId,
        taskId: ovaPara.taskId,
        url: url,
        docNumber: ovaPara.docNumber,
      })
    },
    doReject() {

    },
    async getCityOptions() {
      const { code, data } = await getCityOptions()
      if (code === 20000) {
        this.cityOptions = data || []
      }
    }
  },
};
</script>

<style scoped lang='less'>
.work-num-span {
  margin-left: 30px;
}
.arc {
  width: 100%;
  flex: 1;
}
.resolve-page {
  /deep/.fixed-bottom {
    width: calc(100vw - 762px);
  }
}
.pe-book-container {
  width: 100%;
}
.top-search-right-side {
  text-align: right;
  padding-right: 24px;
}
.mgb-45 {
  margin-bottom: 45px;
}
.mgt-20 {
  margin-top: 20px;
}
.mgb-20 {
  margin-bottom: 20px;
}
/deep/.ant-btn {
  & + .ant-btn {
    margin-left: 8px;
  }
}
.info-container {
  background: rgba(250, 250, 250, 0.5);
  border: 1px solid rgba(244, 244, 244, 1);
  padding: 32px 0 0;
  h3 {
    font-size: 16px;
    color: #000000;
    font-weight: 500;
    margin: 0 19px 0;
    padding-bottom: 19px;
    border-bottom: 1px solid #e9e9e9;
  }
}
.pe-book-container {
  display: flex;
}
.top-title {
  margin-top: 20px;
  margin-bottom: 30px;
}
.left-side {
  flex: 1;
  width: 0;
}
.base-info-body {
  margin-top: 20px;
  padding: 0 44px;
  /deep/.ant-col.ant-col-6 {
    display: flex;
  }
  .info-label {
    width: 125px;
    flex: none;
    display: inline-block;
    font-size: 14px;
    color: #999;
    text-align: right;
  }
}

.right-side {
  margin-top: 65px;
  flex-basis: 426px;
  background: #fcfcfc;
  border: 1px solid rgba(244, 244, 244, 1);
  border-radius: 4px 0px 0px 4px;
  margin-left: 20px;
}
.log-body {
  background: #fcfcfc;
}
.table-container {
  width: calc(100vw - 300px);
}
.fixed-button-container {
  .ant-btn + .ant-btn {
    margin-left: 20px;
  }
}
.v-line-icon {
  display: inline-block;
  width: 2px;
  height: 14px;
  margin-right: 5px;
  background: #0067cc;
}
.active {
  background: #e9f4ff;
  color: #0067cc;
  font-weight: 600;
  &:before {
    border-color: transparent transparent transparent #e9f4ff;
  }
}

@media (min-width: 1340px) {
  .base-info-body {
    .info-label {
      width: 115px;
    }
  }
  .resolve-page {
    /deep/.fixed-bottom {
      width: calc(100vw - 562px);
    }
  }
  .right-side {
    flex-basis: 226px;
  }
}
@media (min-width: 1680px) {
  .resolve-page {
    /deep/.fixed-bottom {
      width: calc(100vw - 662px);
    }
  }
  .right-side {
    flex-basis: 326px;
  }
}
@media (min-width: 1920px) {
  .resolve-page {
    /deep/.fixed-bottom {
      width: calc(100vw - 762px);
    }
  }
  .base-info-body {
    .info-label {
      width: 125px;
    }
  }
  .right-side {
    overflow: auto;
    flex-basis: 426px;
  }
}
</style>