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
          <a-form-model ref="addForm" :model="addForm" :rules="addFormRules" :label-col="labelCol" :wrapper-col="wrapperCol">
            <template title="整改信息">
              <div class="m-t-20"></div>
              <a-row v-if="hideDangerForm.processStatus == 'rectification'">
                <a-form-model-item label="隐患整改措施" prop="dangerRectificationMeasures">
                  <a-textarea placeholder="请输入" v-model="addForm.dangerRectificationMeasures" allowClear :maxLength="1000" />
                </a-form-model-item>
                <a-form-model-item label="隐患整改照片" prop="dangerRectificationPhotoList">
                  <upload-can-remove :limit="20" :maxSize="10" :handleSuccessName="'addFormUploadSuccess'" @addFormUploadSuccess="addFormUploadSuccess" :headImgs="addForm.dangerRectificationPhotoList"></upload-can-remove>
                </a-form-model-item>
              </a-row>
              <a-row v-else>
                <a-col :span="24">
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
                <a-col :span="24">
                  <a-form-model-item label="隐患整改照片">
                    <div
                      v-if="
                        hideDangerForm.userDanger &&
                        hideDangerForm.userDanger
                          .dangerRectificationPhotoList &&
                        hideDangerForm.userDanger.dangerRectificationPhotoList
                          .length
                      "
                    >
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
              </a-row>
            </template>
          </a-form-model>
        </div>
        <div class="right">
          <Log :logList="logList" :logItem="logItem" />
        </div>
      </div>
    </a-spin>
    <div slot="fixedBottom">
      <FixedBottom>
        <!-- rectification：待整改 -->
        <a-button class="m-r-10" @click="submit('submit')" v-show="hideDangerForm.processStatus == 'rectification' && userId == hideDangerForm.handerId" :loading="loading" type="primary">提交</a-button>
        <a-button class="m-r-10" @click="submit('cancel')" v-show="hideDangerForm.processStatus == 'rectification'">取消</a-button>
        <!-- hdreview：待复核 -->
        <a-button class="m-r-10" @click="submit('pass')" v-show="hideDangerForm.processStatus == 'hdreview'" :loading="loading" type="primary">通过</a-button>
        <a-button class="m-r-10" @click="submit('back')" v-show="
            (hideDangerForm.processStatus == 'hdreview' ||
            hideDangerForm.processStatus == 'hdclose') 
          ">驳回</a-button>
        <!-- hdclose：待关闭 -->
        <a-button class="m-r-10" @click="submit('close')" v-show="hideDangerForm.processStatus == 'hdclose'">关闭</a-button>
        <!-- <a-button class="m-r-10" @click="withdraw" v-show="(routeObj.type && routeObj.type == 'look') && showStatus && (hideDangerForm.draftPersonId && hideDangerForm.draftPersonId.indexOf(currentUserId) > -1)">撤回</a-button> -->
        <a-button class="m-r-10" @click="shutDown" v-show="lookBtn && (draftPersonBtn || closeBtn)">直接关闭</a-button>
        <a-button class="m-r-10" @click="submit('cancel')" v-show="hideDangerForm.processStatus == 'close' ">返回</a-button>
      </FixedBottom>
    </div>
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
  DetailhiddenPerilsListAssociation,
  DelayhiddenPerilsListAssociation,
  BackhiddenPerilsListAssociation,
  HiddenLogListAssociation,
  GetHiddenNextPeopleAssociation,
  directCloseAssociation,
  withdrawCreateUserAssociation
} from "@/services/hiddenPerils.js";
import { getQueryVariable } from "@/utils/util.js";
import { PushTask } from "@/services/api";

export default {
  components: { InfoDetailList, FixedBottom, BackModel, Log, UploadCanRemove },
  data() {
    return {
      loadingSpin: true,
      logList: [], //操作日志
      logItem: {
        status: "handerType", //状态
        person: "hander", //操作人
        time: "handerTime", //操作时间
        note: "handerExplain", //备注
      },
      hideDangerForm: {
        list: [],
        userDanger: {},
      },
      closeBtn:false,
      draftPersonBtn: false,
      lookBtn:false,
      withdForm:{},
      withdrawOrDownTitle: '撤回',
      withdrawOrDownArea: '撤回原因',
      withdrawOrDownVisible: false,
      showStatus:false,
      currentUserId: sessionStorage.getItem('zconsole_userInfo') ? JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.jobNumber : '',
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      loading: false,
      delayShow: true, //是否显示延期内容
      routeObj: {}, //接受参数
      backFlag: false, //退回起草人
      addForm: {
        dangerRectificationPhotoList: [],
        dangerRectificationMeasures: undefined,
      },
      userId: "",
      addFormRules: {
        corporationId: [
          { required: true, message: "abc不能为空", trigger: "change" },
        ],
        dangerRectificationMeasures: [
          {
            required: true,
            message: "隐患整改措施不能为空",
            trigger: "change",
          },
        ],
        // dangerRectificationPhotoList: [
        //   {
        //     required: true,
        //     message: "隐患整改照片不能为空",
        //     trigger: "change",
        //   },
        // ],
      },
    };
  },
  created() {
    let routeObj = this.$route.query;
    this.routeObj = routeObj;
    this.routeObj.hideDangerId =
      this.routeObj.hideDangerId || getQueryVariable("hideDangerId");
    this.getDetail(); //获取详情
    this.getLogList();
    this.userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
    if (!this.canShowModalMixin("closeTheHiddenDangerDirectly")) {
      this.closeBtn = false;
    } else {
      this.closeBtn = true;
    }
  },
  methods: {
    // 消息推送
    async infoPush(urlJump) {
      // 获取下级审批人
      let nextPeopleData = await GetHiddenNextPeopleAssociation({ hideDangerId: this.routeObj.hideDangerId })
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

    //获取操作日志
    getLogList() {
      HiddenLogListAssociation({ hideDangerId: this.routeObj.hideDangerId })
        .then((res) => {
          this.logList = res.data;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },

    //获取详情
    getDetail() {
      DetailhiddenPerilsListAssociation({ hideDangerId: this.routeObj.hideDangerId })
        .then((res) => {
          this.loadingSpin = false;
          let obj = { ...res.data, deptId: res.data.draftDeptId };
          this.hideDangerForm = obj;
          // console.log(this.hideDangerForm)
          //查看情况
          if (this.routeObj.type && this.routeObj.type == "look") {
            this.hideDangerForm.processStatus = "close";
            this.lookBtn = true
          }
          if(res.data.processStatus == 'verification'){
            this.showStatus = true
          }
          console.log('res.data.draftPersonId',res.data.draftPersonId,'this.currentUserId',this.currentUserId);
          if(res.data.draftPersonId == this.currentUserId) {
            this.draftPersonBtn = true
            console.log(1,this.lookBtn,2,(this.draftPersonBtn || this.closeBtn));
          }
          if (res.data.userDanger) {
            //回显隐患整改措施
            this.addForm.dangerRectificationMeasures =
              res.data.userDanger.dangerRectificationMeasures || undefined;
            //回显隐患整改照片
            if (res.data.userDanger.dangerRectificationPhotoList&&res.data.userDanger.dangerRectificationPhotoList.length) {
              this.addForm.dangerRectificationPhotoList = this.dealImgEcho(
                res.data.userDanger.dangerRectificationPhotoList,
                "fileName",
                "filePath"
              );
            } else {
              this.addForm.dangerRectificationPhotoList = [];
            }
          }
        })
        .catch((err) => {
          this.loadingSpin = false;
          console.log(err);
        });
    },

    // 新增隐患--文件上传成功
    addFormUploadSuccess(fileList) {
      this.addForm.dangerRectificationPhotoList = fileList;
      formValidator.formItemValidate(
        this,
        "dangerRectificationPhotoList",
        "addForm"
      );
    },

    //退回起草人弹窗关闭
    cancleBackFlag(obj) {
      if (obj) {
        let params = { ...obj, hideDangerId: this.routeObj.hideDangerId };
        BackhiddenPerilsListAssociation(params)
          .then((res) => {
            this.loading = false;
            this.$antMessage.success(`驳回成功`);
            this.setKeepalive(true)
            // this.$router.push("/safeManage/workManage/dangerWorkStatic/hiddenPerilsListAssociation");
            this.$router.go(-1)
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          });
      }
      this.backFlag = false;
    },

    //处理隐患图片
    dealIdList(list) {
      let list2 = [];
      list.forEach((item) => list2.push(item.id));
      return list2;
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
        withdrawCreateUserAssociation(params).then(()=>{
          this.$antMessage.success('撤回成功')
          this.withdrawOrDownVisible = false
          this.withdForm = {}
          // this.$router.push({ path: "/safeManage/workManage/dangerWorkStatic/hiddenPerilsListAssociation" });
          this.$router.go(-1)
        }).catch((err)=>{
          console.log(err);
        })
      }else if(this.withdrawOrDownTitle == '直接关闭'){
        directCloseAssociation(params).then(()=>{
          this.$antMessage.success('关闭成功')
          this.withdrawOrDownVisible = false
          this.withdForm = {}
          // this.$router.push({ path: "/safeManage/workManage/dangerWorkStatic/hiddenPerilsListAssociation" });
          this.$router.go(-1)
        }).catch((err)=>{
          console.log(err);
        })
      }
    },
    //按钮点击事件
    submit(type) {
      //type：submit:提交  cancel:取消  pass:通过  close:关闭  back:驳回
      if (type == "submit") {
        //提交
        if (!formValidator.formAll(this, "addForm")) {
          return;
        }
        let obj = {
          hideDangerId: this.routeObj.hideDangerId,
          ...this.addForm,
          dangerRectificationPhotoList: this.dealIdList(
            this.addForm.dangerRectificationPhotoList || []
          ),
          hideDangerRectificationMeasuresId: this.hideDangerForm
            .userDanger
            ? this.hideDangerForm.userDanger
              .hideDangerRectificationMeasuresId
            : undefined,
        };
        this.loading = true;
        this.setKeepalive(true)
        DelayhiddenPerilsListAssociation(obj)
          .then(() => {
            // this.setKeepalive(true)
            this.infoPush("/safeManage/workManage/dangerWorkStatic/dealNoFourAssociation");
            this.loading = false;
            this.$antMessage.success(`提交成功`);
            // this.$router.push({ path: "/safeManage/workManage/dangerWorkStatic/hiddenPerilsListAssociation" });
            this.$router.go(-1)
          })
          .catch((err) => {
            this.loading = false;
            console.log(err);
          });
      } else if (type == "cancel") {
        this.setKeepalive(true)
        //跳转列表
        this.$router.go(-1)
        // this.$router.push({ path: "/safeManage/workManage/dangerWorkStatic/hiddenPerilsListAssociation" });
      } else if (type == "pass" || type == "close") {
        //通过、关闭
        this.loading = true;
        this.setKeepalive(true)
        DelayhiddenPerilsListAssociation({ hideDangerId: this.routeObj.hideDangerId })
          .then(() => {
            this.infoPush("/safeManage/workManage/dangerWorkStatic/dealNoFourAssociation");
            this.loading = false;
            this.$antMessage.success(
              `${type == "pass" ? "通过成功" : "关闭成功"}`
            );
            // this.$router.push({ path: "/safeManage/workManage/dangerWorkStatic/hiddenPerilsListAssociation" });
            this.$router.go(-1)
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
