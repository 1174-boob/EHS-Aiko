<template>
  <HasFixedBottomWrapper>
    <a-spin :spinning="loadingSpin">
      <div class="box-father">
        <div class="left pd-b-50 clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>隐患信息</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>
          <!-- 详情展示 -->
          <InfoDetailList :hideDangerForm="hideDangerForm" />
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>整改信息</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>

          <!-- 展示一列 -->
          <a-form-model ref="addForm" :model="addForm" :rules="addFormRules" :label-col="labelColO" :wrapper-col="wrapperColO" v-if="!isPersonLevel">
            <template title="整改信息">
              <div class="m-t-20"></div>
              <!-- 待整改或者待复核-->
              <a-row v-if="hideDangerForm.processStatus == 'rectification'">
                <a-form-model-item label="隐患原因分析" prop="dangerCauseAnalysis">
                  <a-textarea placeholder="请输入" v-model="addForm.dangerCauseAnalysis" allowClear :maxLength="1000" />
                </a-form-model-item>
                <a-form-model-item label="隐患整改措施" prop="dangerRectificationMeasures">
                  <a-textarea placeholder="请输入" v-model="addForm.dangerRectificationMeasures" allowClear :maxLength="1000" />
                </a-form-model-item>
                <a-form-model-item label="举一反三" prop="theLines">
                  <a-textarea placeholder="请输入" v-model="addForm.theLines" allowClear :maxLength="1000" />
                </a-form-model-item>
                <a-form-model-item label="隐患整改照片" prop="dangerRectificationPhotoList">
                  <upload-can-remove :limit="20" :maxSize="10" :handleSuccessName="'addFormUploadSuccess'" @addFormUploadSuccess="addFormUploadSuccess" :headImgs="addForm.dangerRectificationPhotoList"></upload-can-remove>
                </a-form-model-item>
              </a-row>
              <!-- 待关闭 已关闭 -->
              <a-row v-else>
                <a-col :span="24">
                  <a-form-model-item label="隐患原因分析">
                    <div>{{ hideDangerForm.dangerCauseAnalysis || "--" }}</div>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item label="隐患整改措施">
                    <div>{{ hideDangerForm.dangerRectificationMeasures || "--" }}</div>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item label="举一反三">
                    <div>{{ hideDangerForm.theLines || "--" }}</div>
                  </a-form-model-item>
                </a-col>
                <a-col :span="24">
                  <a-form-model-item label="隐患整改照片" prop="dangerRectificationPhotoList">
                    <div v-if="
                        hideDangerForm &&
                        hideDangerForm.dangerRectificationPhotoList
                      ">
                      <img :src="item.filePath" alt v-for="item in hideDangerForm.dangerRectificationPhotoList" :key="item.id" @click="previewImg(item.filePath)" class="hide_img" />
                    </div>
                    <div v-else>--</div>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </template>
          </a-form-model>

          <!-- 展示两列 -->
          <a-form-model ref="addForm" :model="addForm" :rules="addFormRules" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="isPersonLevel">
            <template title="整改信息">
              <div class="m-t-20"></div>
              <a-row>
                <a-col :span="12">
                  <a-form-model-item label="填写人">
                    <div>
                      {{
                      `${
                      (hideDangerForm.userDanger &&
                      hideDangerForm.userDanger.userName) ||
                      ""
                      }${
                      hideDangerForm.userDanger &&
                      hideDangerForm.userDanger.jobnumber
                      ? "/" + hideDangerForm.userDanger.jobnumber
                      : ""
                      }` || "--"
                      }}&emsp;
                      <span
                        style="color: #999999"
                      >创建时间：</span>
                      {{
                      (hideDangerForm.userDanger &&
                      hideDangerForm.userDanger.createTime) ||
                      "--"
                      }}
                    </div>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="填写人">
                    <div>
                      {{
                      `${
                      (hideDangerForm.branchDanger &&
                      hideDangerForm.branchDanger.userName) ||
                      ""
                      }${
                      hideDangerForm.branchDanger &&
                      hideDangerForm.branchDanger.jobnumber
                      ? "/" + hideDangerForm.branchDanger.jobnumber
                      : ""
                      }` || "--"
                      }}&emsp;
                      <span
                        style="color: #999999"
                      >创建时间：</span>
                      {{
                      (hideDangerForm.branchDanger &&
                      hideDangerForm.branchDanger.createTime) ||
                      "--"
                      }}
                    </div>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <!-- 待整改或者待复核-->
              <a-row v-if="hideDangerForm.processStatus == 'rectification'">
                <a-col :span="12">
                  <a-form-model-item label="隐患原因分析" prop="dangerCauseAnalysis">
                    <a-textarea placeholder="请输入" v-model="addForm.dangerCauseAnalysis" allowClear :maxLength="1000" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="隐患原因分析" prop="dangerCauseAnalysisT">
                    <a-textarea placeholder="请输入" v-model="addForm.dangerCauseAnalysisT" allowClear :maxLength="1000" :disabled="employeesDis" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="隐患整改措施" prop="dangerRectificationMeasures">
                    <a-textarea placeholder="请输入" v-model="addForm.dangerRectificationMeasures" allowClear :maxLength="1000" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="隐患整改措施" prop="dangerRectificationMeasuresT">
                    <a-textarea placeholder="请输入" v-model="addForm.dangerRectificationMeasuresT" allowClear :maxLength="1000" :disabled="employeesDis" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="举一反三" prop="theLines">
                    <a-textarea placeholder="请输入" v-model="addForm.theLines" allowClear :maxLength="1000" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="举一反三" prop="theLinesT">
                    <a-textarea placeholder="请输入" v-model="addForm.theLinesT" allowClear :maxLength="1000" :disabled="employeesDis" />
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="隐患整改照片" prop="dangerRectificationPhotoList">
                    <upload-can-remove
                      :limit="20"
                      :maxSize="10"
                      :handleSuccessName="'addFormUploadSuccess'"
                      @addFormUploadSuccess="addFormUploadSuccess"
                      :headImgs="addForm.dangerRectificationPhotoList"
                    ></upload-can-remove>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="隐患整改照片" prop="dangerRectificationPhotoListT">
                    <upload-can-remove
                      :limit="20"
                      :maxSize="10"
                      :handleSuccessName="'successPeople'"
                      @successPeople="successPeople"
                      :headImgs="addForm.dangerRectificationPhotoListT"
                      :disabled="employeesDis"
                    ></upload-can-remove>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <!-- 待关闭 已关闭 -->
              <a-row v-else>
                <a-col :span="12">
                  <a-form-model-item label="隐患原因分析">
                    <div>
                      {{
                      (hideDangerForm.userDanger &&
                      hideDangerForm.userDanger.dangerCauseAnalysis) ||
                      "--"
                      }}
                    </div>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="隐患原因分析">
                    <div>
                      {{
                      (hideDangerForm.branchDanger &&
                      hideDangerForm.branchDanger.dangerCauseAnalysis) ||
                      "--"
                      }}
                    </div>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="隐患整改措施">
                    <div>
                      {{
                      (hideDangerForm.userDanger &&
                      hideDangerForm.userDanger
                      .dangerRectificationMeasures) ||
                      "--"
                      }}
                    </div>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="隐患整改措施">
                    <div>
                      {{
                      (hideDangerForm.branchDanger &&
                      hideDangerForm.branchDanger
                      .dangerRectificationMeasures) ||
                      "--"
                      }}
                    </div>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="举一反三">
                    <div>
                      {{
                      (hideDangerForm.userDanger &&
                      hideDangerForm.userDanger.theLines) ||
                      "--"
                      }}
                    </div>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="举一反三">
                    <div>
                      {{
                      (hideDangerForm.branchDanger &&
                      hideDangerForm.branchDanger.theLines) ||
                      "--"
                      }}
                    </div>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="隐患整改照片">
                    <div v-if="
                        hideDangerForm.userDanger &&
                        hideDangerForm.userDanger.dangerRectificationPhotoList
                      ">
                      <img
                        :src="item.filePath"
                        alt
                        v-for="item in hideDangerForm.userDanger
                          .dangerRectificationPhotoList"
                        :key="item.id"
                        @click="previewImg(item.filePath)"
                        class="hide_img"
                      />
                    </div>
                    <div v-else>--</div>
                  </a-form-model-item>
                </a-col>
                <a-col :span="12">
                  <a-form-model-item label="隐患整改照片">
                    <div v-if="
                        hideDangerForm.branchDanger &&
                        hideDangerForm.branchDanger.dangerRectificationPhotoList
                      ">
                      <img
                        :src="item.filePath"
                        alt
                        v-for="item in hideDangerForm.branchDanger
                          .dangerRectificationPhotoList"
                        :key="item.id"
                        @click="previewImg(item.filePath)"
                        class="hide_img"
                      />
                    </div>
                    <div v-else>--</div>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </template>
          </a-form-model>
        </div>
        <div class="right">
          <Log :logList="logList" :logItem="logItem" />
        </div>
      </div>
    </a-spin>
    <!-- 撤回，直接关闭弹框 -->
    <CommonModal :title="withdrawOrDownTitle" :visible="withdrawOrDownVisible" :cancelFn="cancleWithdrawOrDown">
      <template slot="form">
        <a-form-model
          ref="withdForm"
          :model="withdForm"
          :label-col="{ style: { width: '130px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 130px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" :label="withdrawOrDownArea" prop="withdrawInfo">
            <a-textarea
              placeholder="最多可输入100字"
              v-model="withdForm.withdrawInfo"
              allowClear
              :maxLength="100"
            />
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="cancleWithdrawOrDown">取消</a-button>
        <a-button class="m-l-15" type="primary" @click="submitWithdrawOrDown"
          >确定</a-button
        >
      </template>
    </CommonModal>
    <div slot="fixedBottom">
      <FixedBottom>
        <!-- rectification：待整改 -->
        <a-button class="m-r-10" @click="submit('submit')" v-show="hideDangerForm.processStatus == 'rectification'" :loading="loading" type="primary">提交</a-button>
        <a-button class="m-r-10" @click="submit('cancel')" v-show="hideDangerForm.processStatus == 'rectification'">取消</a-button>
        <!-- hdreview：待复核 -->
        <a-button class="m-r-10" @click="submit('pass')" v-show="hideDangerForm.processStatus == 'hdreview'" :loading="loading" type="primary">通过</a-button>
        <a-button class="m-r-10" @click="submit('back')" v-show="
            hideDangerForm.processStatus == 'hdreview' ||
            hideDangerForm.processStatus == 'hdclose'
          ">驳回</a-button>
        <!-- hdclose：待关闭 -->
        <a-button class="m-r-10" @click="submit('close')" v-show="hideDangerForm.processStatus == 'hdclose'">关闭</a-button>
        <a-button class="m-r-10" @click="withdraw" v-show="(routeObj.type && routeObj.type == 'look') && showStatus && (hideDangerForm.draftPersonId && hideDangerForm.draftPersonId.indexOf(currentUserId) > -1)">撤回</a-button>
        <a-button class="m-r-10" @click="shutDown" v-show="(routeObj.type && routeObj.type == 'look') && closeStatus &&(hideDangerForm.draftPersonId && hideDangerForm.draftPersonId.indexOf(currentUserId) > -1) && closeBtn">直接关闭</a-button>
        <!-- close：已关闭 -->
        <a-button class="m-r-10" @click="submit('cancel')" v-show="hideDangerForm.processStatus == 'close'">返回</a-button>
      </FixedBottom>
    </div>

    <!-- 退回起草人 -->
    <BackModel :backFlag="backFlag" @cancleBackFlag="cancleBackFlag" />
  </HasFixedBottomWrapper>
</template>

<script>
import InfoDetailList from "@/pages/hiddenPerils/components/showHiddenDetail/index.vue";
import FixedBottom from "@/components/commonTpl/fixedBottom";
import { formValidator } from "@/utils/clx-form-validator.js";
import BackModel from "@/pages/hiddenPerils/components/backRason/index.vue";
import Log from "@/components/logList/index.vue";
import UploadCanRemove from "@/components/upload/uploadCanRemove.vue";
import {
  DetailhiddenPerilsList,
  DelayhiddenPerilsList,
  BackhiddenPerilsList,
  HiddenLogList,
  GetHiddenNextPeople,
  directClose,
  withdrawCreateUser
} from "@/services/hiddenPerils.js";
import { getQueryVariable } from "@/utils/util.js";
import { PushTask } from "@/services/api";
export default {
  components: { InfoDetailList, FixedBottom, BackModel, Log, UploadCanRemove },
  data() {
    return {
      loadingSpin: true,
      employeesDis: false, //两列情况-员工分身时禁用科长列
      logList: [], //操作日志
      logItem: {
        status: "handerType", //状态
        person: "hander", //操作人
        time: "handerTime", //操作时间
        note: "handerExplain", //备注
      },
      hideDangerForm: {
        dangerRectificationPhotoList: [],
        dangerRectificationPhotoListT: [],
        userDanger: {},
        branchDanger: {},
      },
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      labelColO: { span: 4 },
      wrapperColO: { span: 20 },
      loading: false,
      delayShow: true, //是否显示延期内容
      routeObj: {}, //接受参数
      backFlag: false, //退回起草人
      addForm: {
        dangerRectificationPhotoList: [],
        dangerCauseAnalysis: undefined,
        dangerRectificationMeasures: undefined,
        theLines: undefined,
        dangerRectificationPhotoListT: [],
        dangerCauseAnalysisT: undefined,
        dangerRectificationMeasuresT: undefined,
        theLinesT: undefined,
      },
      withdForm:{},
      withdrawOrDownTitle: '撤回',
      withdrawOrDownArea: '撤回原因',
      withdrawOrDownVisible: false,
      showStatus:false,
      closeBtn:false,
      closeStatus:true,
      currentUserId: sessionStorage.getItem('zconsole_userInfo') ? JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.jobNumber : '',
      addFormRules: {
        dangerCauseAnalysis: [
          {
            required: true,
            message: "隐患原因分析不能为空",
            trigger: "change",
          },
        ],
        dangerRectificationMeasures: [
          {
            required: true,
            message: "隐患整改措施不能为空",
            trigger: "change",
          },
        ],
        theLines: [
          { required: true, message: "举一反三不能为空", trigger: "change" },
        ],
        // dangerRectificationPhotoList: [
        //   {
        //     required: true,
        //     message: "隐患整改照片不能为空",
        //     trigger: "change",
        //   },
        // ],
        dangerCauseAnalysisT: [
          {
            required: true,
            message: "隐患原因分析不能为空",
            trigger: "change",
          },
        ],
        dangerRectificationMeasuresT: [
          {
            required: true,
            message: "隐患整改措施不能为空",
            trigger: "change",
          },
        ],
        theLinesT: [
          { required: true, message: "举一反三不能为空", trigger: "change" },
        ],
        dangerRectificationPhotoListT: [
          {
            required: false,
            message: "隐患整改照片不能为空",
            trigger: "change",
          },
        ],
      },
      type: 3, //1待整改 2待复核 3待关闭 4已关闭
      people: 2,
      isPersonLevel: false, //员工身份并且有上级 为true
      typePerson: undefined, //userDanger员工身份 branchDanger科长 bossDanger部长
    };
  },
  created() {
    let routeObj = this.$route.query;
    this.routeObj = routeObj;
    this.routeObj.hideDangerId =
      this.routeObj.hideDangerId || getQueryVariable("hideDangerId");
    this.getDetail(); //获取详情
    this.getLogList();
    if (!this.canClickBtnMixin("closeTheHiddenDangerDirectly")) {
      this.closeBtn = false;
    } else {
      this.closeBtn = true;
    }
  },
  methods: {
    // 消息推送
    async infoPush(urlJump) {
      // 获取下级审批人
      let nextPeopleData = await GetHiddenNextPeople({ hideDangerId: this.routeObj.hideDangerId })
      let nextUserId = nextPeopleData?.data?.handleId
      const url =
        process.env.VUE_APP_LOGIN_URL +
        "client_id=" +
        process.env.VUE_APP_CLIENTID +
        "&response_type=" +
        process.env.VUE_APP_RESPONSE_TYPE +
        "&redirect_uri=" +
        process.env.VUE_APP_REDIRECT_URI +
        "&routeUrl=" +
        `${urlJump}&hideDangerId=${this.routeObj.hideDangerId}`;

      PushTask({
        title: "隐患排查处理",
        approval: "hiddenPerils_verify",
        userId: nextUserId,
        url: url,
        docNumber: this.hideDangerForm?.dangerCode,   //业务id
        docId: this.routeObj.hideDangerId,  //主键id
      })
        .then((res) => {
          console.log(res, "推送成功");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //撤回
    withdraw(){
      console.log('撤回withdraw',);
      this.withdrawOrDownTitle = '撤回'
      this.withdrawOrDownArea = '撤回原因'
      this.withdrawOrDownVisible = true
    },
    // 直接关闭
    shutDown(){
      console.log('直接关闭shutDown',);
      this.withdrawOrDownTitle = '直接关闭'
      this.withdrawOrDownArea = '关闭原因'
      this.withdrawOrDownVisible = true
    },
    // 关闭撤回弹框
    cancleWithdrawOrDown(){
      this.withdrawOrDownVisible = false
      this.withdForm = {}
    },
    submitWithdrawOrDown(){
      let params = {
        hideDangerId: this.routeObj.hideDangerId,
        withdrawInfo: this.withdForm.withdrawInfo,
      }
      if(this.withdrawOrDownTitle == '撤回'){
        withdrawCreateUser(params).then(()=>{
          this.$antMessage.success('撤回成功')
          this.withdrawOrDownVisible = false
          this.withdForm = {}
          this.$router.push({ path: "/safeManage/dualControlManage/hiddenPerils/hiddenPerilsList" });
        }).catch((err)=>{
          console.log(err);
        })
      }else if(this.withdrawOrDownTitle == '直接关闭'){
        directClose(params).then(()=>{
          this.$antMessage.success('关闭成功')
          this.withdrawOrDownVisible = false
          this.withdForm = {}
          this.$router.push({ path: "/safeManage/dualControlManage/hiddenPerils/hiddenPerilsList" });
        }).catch((err)=>{
          console.log(err);
        })
      }
    },
    //按钮点击事件
    submit(type) {
      // console.log(this.typePerson, "...this.typePerson1");
      //1.type：submit:提交  cancel:取消  pass:通过  close:关闭  back:驳回
      //2.员工：>90  科长：>80 && <=90  部长：<=80

      //userDanger branchDanger bossDanger
      if (type == "submit") {
        //提交
        if (this.employeesDis) {
          //员工身份只校验员工一列 有两列的情况
          formValidator.formItemValidate(
            this,
            "dangerCauseAnalysis",
            "addForm"
          );
          formValidator.formItemValidate(
            this,
            "dangerRectificationMeasures",
            "addForm"
          );
          formValidator.formItemValidate(
            this,
            "dangerRectificationPhotoList",
            "addForm"
          );
          formValidator.formItemValidate(this, "theLines", "addForm");

          if (
            !formValidator.formItemValidate(
              this,
              "dangerCauseAnalysis",
              "addForm"
            ) ||
            !formValidator.formItemValidate(
              this,
              "dangerRectificationMeasures",
              "addForm"
            ) ||
            !formValidator.formItemValidate(
              this,
              "dangerRectificationPhotoList",
              "addForm"
            ) ||
            !formValidator.formItemValidate(this, "theLines", "addForm")
          ) {
            return;
          }
        } else {
          if (!formValidator.formAll(this, "addForm")) {
            return;
          }
        }

        let obj1 = {
          hideDangerId: this.routeObj.hideDangerId,
          //员工
          userDanger:
            this.typePerson == "userDanger"
              ? {
                ...this.addForm,
                hideDangerRectificationMeasuresId: this.hideDangerForm
                  .userDanger
                  ? this.hideDangerForm.userDanger
                    .hideDangerRectificationMeasuresId
                  : undefined,
                dangerRectificationPhotoList: this.dealIdList(
                  this.addForm.dangerRectificationPhotoList || []
                ),
              }
              : undefined,
          //科长
          branchDanger:
            this.typePerson == "branchDanger"
              ? {
                ...this.addForm,
                hideDangerRectificationMeasuresId: this.hideDangerForm
                  .branchDanger
                  ? this.hideDangerForm.branchDanger
                    .hideDangerRectificationMeasuresId
                  : undefined,
                dangerRectificationPhotoList: this.dealIdList(
                  this.addForm.dangerRectificationPhotoList || []
                ),
              }
              : undefined,
          //部长
          bossDanger:
            this.typePerson == "bossDanger"
              ? {
                ...this.addForm,
                hideDangerRectificationMeasuresId: this.hideDangerForm
                  .bossDanger
                  ? this.hideDangerForm.bossDanger
                    .hideDangerRectificationMeasuresId
                  : undefined,
                dangerRectificationPhotoList: this.dealIdList(
                  this.addForm.dangerRectificationPhotoList || []
                ),
              }
              : undefined,
        };

        let obj2 = {
          hideDangerId: this.routeObj.hideDangerId,
          //员工
          userDanger: {
            ...this.addForm,
            //值为undefined是因为后端不需要此参数
            dangerCauseAnalysisT: undefined,
            dangerRectificationMeasuresT: undefined,
            theLinesT: undefined,
            dangerRectificationPhotoListT: undefined,
            dangerRectificationPhotoList: this.dealIdList(
              this.addForm.dangerRectificationPhotoList || []
            ),
            hideDangerRectificationMeasuresId: this.hideDangerForm.userDanger
              ? this.hideDangerForm.userDanger.hideDangerRectificationMeasuresId
              : undefined,
          },
          //科长
          branchDanger: {
            dangerCauseAnalysis: this.addForm.dangerCauseAnalysisT,
            dangerRectificationMeasures:
              this.addForm.dangerRectificationMeasuresT,
            theLines: this.addForm.theLinesT,
            dangerRectificationPhotoList: this.dealIdList(
              this.addForm.dangerRectificationPhotoListT || []
            ),
            hideDangerRectificationMeasuresId: this.hideDangerForm.branchDanger
              ? this.hideDangerForm.branchDanger
                .hideDangerRectificationMeasuresId
              : undefined,
          },
        };
        // console.log(this.typePerson, this.isPersonLevel, obj2, obj1);
        // return;
        this.loading = true;
        this.setKeepalive(true)
        DelayhiddenPerilsList(this.isPersonLevel ? obj2 : obj1)
          .then(() => {
            this.infoPush("/safeManage/dualControlManage/hiddenPerils/dealIsFour");
            this.loading = false;
            this.$antMessage.success(`提交成功`);
            this.$router.push({ path: "/safeManage/dualControlManage/hiddenPerils/hiddenPerilsList" });
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          });
      } else if (type == "cancel") {
        this.setKeepalive(true)
        //跳转列表
        this.$router.push({ path: "/safeManage/dualControlManage/hiddenPerils/hiddenPerilsList" });
      } else if (type == "pass" || type == "close") {
        //通过、关闭
        this.loading = true;
        this.setKeepalive(true)
        DelayhiddenPerilsList({ hideDangerId: this.routeObj.hideDangerId })
          .then(() => {
            this.infoPush("/safeManage/dualControlManage/hiddenPerils/dealIsFour");
            this.loading = false;
            this.$antMessage.success(
              `${type == "pass" ? "通过成功" : "关闭成功"}`
            );
            this.$router.push({ path: "/safeManage/dualControlManage/hiddenPerils/hiddenPerilsList" });
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          });
      } else {
        //驳回弹窗打开
        this.backFlag = true;
      }
    },

    //判断分身：员工 科长 部长
    setPerSon(data) {
      // console.log(this.typePerson, "...this.typePerson7");
      if (
        data.rectificationBearPersonLevel > 90 ||
        data.rectificationBearPersonLevel == null
      ) {
        //员工
        this.typePerson = "userDanger";
      } else if (
        data.rectificationBearPersonLevel <= 90 &&
        data.rectificationBearPersonLevel > 80
      ) {
        //科长
        this.typePerson = "branchDanger";
      } else if (data.rectificationBearPersonLevel <= 80) {
        //部长
        this.typePerson = "bossDanger";
      }

      //判断如果当前登录人是员工身份 并且有科长有部长 则禁用掉科长列--两列的情况
      if (
        this.typePerson == "userDanger" &&
        data.rectificationBearPersonId &&
        data.handerId &&
        data.rectificationBearPersonId == data.handerId
      ) {
        this.employeesDis = true;
      }
    },

    //详情-回显数据
    backDetail(data) {
      //员工身份并且有科长有部长-两列的情况
      if (this.isPersonLevel) {
        this.hideDangerForm = data;
        if (this.hideDangerForm.userDanger) {
          //员工
          //员工表单回显
          let { dangerCauseAnalysis, dangerRectificationMeasures, theLines } =
            this.hideDangerForm.userDanger;
          this.addForm.dangerCauseAnalysis = dangerCauseAnalysis;
          this.addForm.dangerRectificationMeasures =
            dangerRectificationMeasures;
          this.addForm.theLines = theLines;

          //员工图片回显
          if (this.hideDangerForm.userDanger.dangerRectificationPhotoList) {
            this.addForm.dangerRectificationPhotoList = this.dealImgEcho(
              this.hideDangerForm.userDanger.dangerRectificationPhotoList,
              "fileName",
              "filePath"
            );
          }
        }

        if (
          this.hideDangerForm.branchDanger //科长
        ) {
          //科长表单回显
          let { dangerCauseAnalysis, dangerRectificationMeasures, theLines } =
            this.hideDangerForm.branchDanger;
          this.addForm.dangerCauseAnalysisT = dangerCauseAnalysis;
          this.addForm.dangerRectificationMeasuresT =
            dangerRectificationMeasures;
          this.addForm.theLinesT = theLines;

          //科长图片回显
          if (this.hideDangerForm.branchDanger.dangerRectificationPhotoList) {
            this.addForm.dangerRectificationPhotoListT = this.dealImgEcho(
              this.hideDangerForm.branchDanger.dangerRectificationPhotoList,
              "fileName",
              "filePath"
            );
          }
        }
      } else {
        this.hideDangerForm = { ...data, ...data[this.typePerson], corporationId: data.corporationId, centerId: data.centerId, };
        let obj = data[this.typePerson];

        if (obj) {
          this.addForm.dangerCauseAnalysis = obj.dangerCauseAnalysis;
          this.addForm.dangerRectificationMeasures =
            obj.dangerRectificationMeasures;
          this.addForm.theLines = obj.theLines;
        }

        //回显图片一列的情况
        if (obj && obj.dangerRectificationPhotoList) {
          this.addForm.dangerRectificationPhotoList = this.dealImgEcho(
            obj.dangerRectificationPhotoList,
            "fileName",
            "filePath"
          );
        } else {
          this.addForm.dangerRectificationPhotoList = [];
        }
      }
      //查看情况
      if (this.routeObj.type && this.routeObj.type == "look") {
        this.hideDangerForm.processStatus = "close";
      }
    },

    //获取操作日志
    getLogList() {
      HiddenLogList({ hideDangerId: this.routeObj.hideDangerId })
        .then((res) => {
          this.logList = res.data;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },

    //处理隐患图片
    dealIdList(list) {
      let list2 = [];
      list.forEach((item) => list2.push(item.id));
      return list2;
    },

    //获取详情
    getDetail() {
      DetailhiddenPerilsList({ hideDangerId: this.routeObj.hideDangerId })
        .then((res) => {
          //员工：>90  科长：>80 && <=90  部长：<=80
          this.loadingSpin = false;
          this.isPersonLevel = //员工身份并且有科长有部长
            res.data.rectificationBearPersonLevel > 90 &&
            res.data.rectificationBearPersonBossId &&
            res.data.rectificationBearPersonBranchId;

          this.setPerSon(res.data); //判断分身：员工 科长 部长
          this.backDetail(res.data); //回显数据
          if(res.data.processStatus == 'verification'){
            this.showStatus = true
          }
          if(res.data.processStatus == 'close'){
            this.closeStatus = false
          }
          this.hideDangerForm.deptId = res.data.draftDeptId; //回显部门人员
        })
        .catch((err) => {
          this.loadingSpin = false;
          console.log(err);
        });
    },

    // 新增隐患--文件上传成功-员工
    addFormUploadSuccess(fileList) {
      console.log(fileList, ".....1111");
      this.addForm.dangerRectificationPhotoList = fileList;
      formValidator.formItemValidate(
        this,
        "dangerRectificationPhotoList",
        "addForm"
      );
    },

    // 新增隐患--文件上传成功-科长
    successPeople(fileList) {
      this.addForm.dangerRectificationPhotoListT = fileList;
      formValidator.formItemValidate(
        this,
        "dangerRectificationPhotoListT",
        "addForm"
      );
    },

    //退回起草人弹窗关闭
    cancleBackFlag(obj) {
      if (obj) {
        let params = { ...obj, hideDangerId: this.routeObj.hideDangerId };
        BackhiddenPerilsList(params)
          .then((res) => {
            this.loading = false;
            this.$antMessage.success(`驳回成功`);
            this.setKeepalive(true)
            this.$router.push("/safeManage/dualControlManage/hiddenPerils/hiddenPerilsList");
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          });
      }
      this.backFlag = false;
    },

    //查看图片
    previewImg(imgUrl) {
      this.$hevueImgPreview(imgUrl);
    },
  },
};
</script>

<style lang="less" scoped>
.box-father {
  width: 100%;
  height: 100%;
  display: flex;
  .left {
    margin-right: 20px;
    flex: 1;
  }
  .right {
    width: 426px;
  }
}
.hide_img {
  width: 150px;
  padding-right: 15px;
  &:hover {
    cursor: pointer;
  }
}
@media screen and (max-width: 1366px) {
  .right {
    width: 270px !important;
  }
}
@media screen and (min-width: 1367px) and (max-width: 1440px) {
  .right {
    width: 326px !important;
  }
}
</style>
