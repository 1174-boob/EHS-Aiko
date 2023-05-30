<template>
  <div
    class="post-wrapper flex clx-show-scroll clx-flex-1 beauty-scroll bg-fff"
  >
    <!-- 左侧-表单盒子 -->
    <div :class="['flex-1', 'position-rel', disabled ? 'pd-b-10' : 'pd-b-80']">
      <div :class="['scroll-center-box', disabled ? '' : 'pd-l-50-box']">
        <!-- <PageTitle>变岗申请</PageTitle> -->
        <div :class="['', disabled ? 'pd-l-50-box p-b-60' : '']">
          <h3 class="h-40"></h3>
          <a-form-model
            ref="handleForm"
            :model="handleForm"
            :rules="handleFormRules"
            :label-col="{ style: { width: '108px' } }"
            :wrapper-col="{
              style: { width: disabled ? 'calc(100% - 200px)' : '55%' },
            }"
            :colon="false"
            labelAlign="left"
          >
            <CommonSearchItem
              ref="commonSearchItem"
              :CommonFormInline="handleForm"
              :rules="handleFormRules"
              :notTablePage="true"
              :labelCol="{ style: { width: '108px' } }"
              :wrapperCol="{
                style: { width: disabled ? 'calc(100% - 200px)' : '55%' },
              }"
              labelAlign="left"
            ></CommonSearchItem>
            <a-form-model-item
              class="flex"
              label="报警原因类型"
              prop="reasonType"
            >
              <a-select
                :disabled="disabled"
                v-model="handleForm.reasonType"
                placeholder="请选择报警原因类型"
                prop="reasonType"
              >
                <a-select-option
                  v-for="item in reasonTypeList"
                  :key="item.dictValue"
                  :value="item.dictValue"
                  >{{ item.dictLabel }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
            <a-form-model-item
              class="flex"
              label="预警原因描述"
              prop="reasonDescription"
            >
              <a-textarea
                placeholder="请输入预警原因描述"
                v-model="handleForm.reasonDescription"
                allowClear
                :maxLength="200"
                :disabled="disabled"
              />
            </a-form-model-item>
            <a-form-model-item
              class="flex"
              label="描述图片"
              prop="reasonDescriptionPhotosList"
            >
              <upload-can-remove
                v-if="!disabled"
                :limit="5"
                :maxSize="5"
                :handleSuccessName="'addFormUploadSuccess'"
                @addFormUploadSuccess="addFormUploadSuccess"
                :headImgs="handleForm.reasonDescriptionPhotosList"
              ></upload-can-remove>
              <div v-else class="div-img">
                <img
                  :src="item.url"
                  alt
                  v-for="item in handleForm.reasonDescriptionPhotosList"
                  :key="item.id"
                  @click="previewImg(item.url)"
                  class="hide_img"
                />
              </div>
            </a-form-model-item>
            <a-form-model-item
              class="flex"
              label="处置过程"
              prop="disposalProcess"
            >
              <a-textarea
                placeholder="请输入处置过程"
                v-model="handleForm.disposalProcess"
                allowClear
                :maxLength="200"
                :disabled="disabled"
              />
            </a-form-model-item>
            <a-form-model-item
              class="flex"
              label="现场确认图片"
              prop="disposalProcessPhotosList"
            >
              <upload-can-remove
                v-if="!disabled"
                :limit="5"
                :maxSize="5"
                :handleSuccessName="'addFormUploadSuccessT'"
                @addFormUploadSuccessT="addFormUploadSuccessT"
                :headImgs="handleForm.disposalProcessPhotosList"
              ></upload-can-remove>
              <div class="div-img" v-else>
                <img
                  :src="item.url"
                  alt
                  v-for="item in handleForm.disposalProcessPhotosList"
                  :key="item.id"
                  @click="previewImg(item.url)"
                  class="hide_img"
                />
              </div>
            </a-form-model-item>
            <a-form-model-item class="flex" label="复位时间" prop="resetTime">
              <a-date-picker
                :disabled="disabled"
                v-model="handleForm.resetTime"
                show-time
                placeholder="请选择复位时间"
              />
            </a-form-model-item>
            <a-form-model-item class="flex" label="报警级别" prop="alarmLevel">
              <a-input
                :disabled="disabled"
                v-model="handleForm.alarmLevel"
                placeholder="请输入..."
                :maxLength="30"
              />
            </a-form-model-item>
            <a-form-model-item class="flex" label="处理类型" prop="alarmType">
              <a-radio-group
                :disabled="disabled"
                v-model="handleForm.alarmType"
              >
                <a-radio value="1">真实报警</a-radio>
                <a-radio value="2">虚惊报警</a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item class="flex" label="处理结果" prop="status">
              <a-radio-group :disabled="disabled" v-model="handleForm.status">
                <a-radio value="2">关闭</a-radio>
                <a-radio value="1">保持</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>
      <div slot="fixedBottom" v-show="!disabled">
        <FixedBottom>
          <div>
            <a-button @click="onCancle">取消</a-button>
            <a-button type="primary" @click="handleConfirm" :loading="loading"
              >确定</a-button
            >
          </div>
        </FixedBottom>
      </div>
      <div slot="fixedBottom" v-show="disabled">
        <FixedBottom>
          <div>
            <a-button @click="onCancle">返回</a-button>
          </div>
        </FixedBottom>
      </div>
    </div>
    <!-- 右侧-操作日志盒子 -->
    <SetLog v-show="disabled" :flowLogList="flowLogList" />
  </div>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom";
import {
  DealAlarmProcess,
  GetAlarmProcess,
  GetLogList,
} from "@/services/networkControl.js";
import Editor from "@/components/editor/wangEditor.vue";
import { formValidator } from "@/utils/clx-form-validator.js";
import SetLog from "@/pages/networkControl/compoents/setLog.vue";
import cancelLoading from "@/mixin/cancelLoading";
import moment from "moment";
import UploadCanRemove from "@/components/upload/uploadCanRemove.vue";

export default {
  components: { FixedBottom, Editor, SetLog, UploadCanRemove },
  mixins: [cancelLoading],
  data() {
    return {
      isClear: false,
      detailObj: {},
      //操作日志
      flowLogList: [],
      //表单字段
      handleForm: {
        reasonType: undefined,
        reasonDescription: undefined,
        disposalProcess: undefined,
        resetTime: undefined,
        alarmLevel: undefined,
        alarmType: undefined,
        status: undefined,
        reasonDescriptionPhotosList: [],
        disposalProcessPhotosList: [],
      },
      // 表单验证
      handleFormRules: {
        reasonType: [
          {
            required: true,
            message: "报警原因类型不能为空",
            trigger: "change",
          },
        ],
        reasonDescription: [
          {
            required: true,
            validator: this.titleValidator,
            trigger: ["blur", "change"],
          },
        ],
        disposalProcess: [
          {
            required: true,
            validator: this.titleValidatorT,
            trigger: ["blur", "change"],
          },
        ],
        resetTime: [
          { required: true, message: "请输入复位时间", trigger: "change" },
        ],
        reasonDescription: [
          { required: true, message: "请输入预警原因描述", trigger: "change" },
        ],
        disposalProcess: [
          { required: true, message: "请输入处置过程", trigger: "change" },
        ],
        alarmType: [
          { required: true, message: "请输入报警类型", trigger: "change" },
        ],
        status: [
          { required: true, message: "请输入处理结果", trigger: "change" },
        ],
      },
      disabled: false,
    };
  },
  created() {
    let obj = this.$route.params;
    if (JSON.stringify(obj) == "{}") {
      this.$router.push("/safeManage/emergencyManagement/networkControl/alarmInfo"); //返回列表页
      return;
    }
    this.detailObj = obj;
    this.disabled = obj.type == "look" ? true : false;
    this.getIsSafety(); //获取详情
    if (obj.type == "look") {
      this.getFlowLogList(); //获取日志
    }
  },
  methods: {
    // 预警原因描述照片--文件上传成功
    addFormUploadSuccess(fileList) {
      this.handleForm.reasonDescriptionPhotosList = fileList;
    },
    // 处置过程照片--文件上传成功
    addFormUploadSuccessT(fileList) {
      this.handleForm.disposalProcessPhotosList = fileList;
    },
    //获取详情
    getIsSafety() {
      let params = { id: this.detailObj.idList[0] };
      GetAlarmProcess(params)
        .then((res) => {
          if (res.data) {
            let reasonDescriptionPhotosList = res.data
              .reasonDescriptionPhotosList
              ? this.dealImgEcho(
                  res.data.reasonDescriptionPhotosList,
                  "fileName",
                  "filePath"
                )
              : [];
            let disposalProcessPhotosList = res.data.disposalProcessPhotosList
              ? this.dealImgEcho(
                  res.data.disposalProcessPhotosList,
                  "fileName",
                  "filePath"
                )
              : [];
            let obj = {
              reasonDescriptionPhotosList,
              disposalProcessPhotosList,
              centerId: res.data.centerId,
              corporationId: res.data.corporationId,
              reasonType: res.data.reasonType || undefined,
              disposalProcess: res.data.disposalProcess,
              resetTime: res.data.resetTime
                ? moment(res.data.resetTime)
                : undefined,
              reasonDescription: res.data.reasonDescription,
              disposalProcess: res.data.disposalProcess,
              alarmType: res.data.alarmType,
              status: res.data.status == 0 ? undefined : res.data.status,
              alarmLevel: res.data.alarmLevel,
            };
            this.handleForm = obj;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //获取日志
    getFlowLogList() {
      let params = { alarmId: this.detailObj.idList[0], alarmType: "1" };
      GetLogList(params)
        .then((res) => {
          this.flowLogList = res.data;
        })
        .catch((err) => console.log(err));
    },

    //获取id
    getPhotoId(list) {
      let arr = [];
      if (list.length) {
        list.forEach((item) => {
          arr.push(item.id);
        });
        return arr;
      } else {
        return [];
      }
    },

    // 处理-确定
    handleConfirm() {
      if (!formValidator.formAll(this, "handleForm")) {
        return;
      }

      let params = {
        ...this.handleForm,
        reasonDescriptionPhotos: this.getPhotoId(
          this.handleForm.reasonDescriptionPhotosList
        ),
        disposalProcessPhotos: this.getPhotoId(
          this.handleForm.disposalProcessPhotosList
        ),
        reasonDescriptionPhotosList: undefined,
        disposalProcessPhotosList: undefined,
        resetTime: this.handleForm.resetTime
          ? this.handleForm.resetTime.format("YYYY-MM-DD HH:mm:ss")
          : undefined,
        type: "1",
        idList: this.detailObj.idList,
      };
      DealAlarmProcess(params)
        .then(() => {
          this.$antMessage.success("处理成功");
          this.$router.push("/safeManage/emergencyManagement/networkControl/alarmInfo");
        })
        .catch((err) => console.log(err));
    },

    // 取消
    onCancle() {
      this.setKeepalive(true)
      this.$router.push("/safeManage/emergencyManagement/networkControl/alarmInfo");
    },
    //查看图片
    previewImg(imgUrl) {
      this.$hevueImgPreview(imgUrl);
    },
  },
  computed: {
    //报警原因类型
    reasonTypeList() {
      //从字典组里获取危害因素数据
      const dict = this.$store.state.setting.dictTypeData;
      const hazard = dict.find((item) => {
        return item.dictType == "alarm_reason_type";
      });
      return hazard.dictItem;
    },
  },
};
</script>

<style scoped lang='less'>
.scroll-center-box {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    //宽度
    width: 5px !important;
    height: 5px !important;
  }
  &::-webkit-scrollbar-thumb {
    //颜色
    border-radius: 3px;
    background: #0067cc;
  }
}
.width-70 {
  width: 70px;
}
.staff-msg {
  & > div {
    width: 33%;
    margin-right: 1%;
    &:last-child {
      margin-right: 0;
    }
    p {
      display: flex;
      margin-bottom: 20px;
      span {
        &:nth-child(1) {
          width: 70px;
          text-align: right;
          color: #999;
        }
        &:nth-child(2) {
          flex: 1;
          color: #333;
        }
      }
    }
  }
}
.title-h3 {
  display: flex;
  align-items: center;
}
.div-img {
  width: 100%;
  display: flex;
  img {
    width: 100px;
    padding-right: 10px;
  }
}
.post-wrapper {
  /deep/ .fixed-bottom {
    bottom: 0;
    margin: 0;
    left: 0;
  }
  /deep/ .log {
    flex: none;
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
  .pd-l-50-box {
    padding-left: 20px;
  }
}
@media screen and (min-width: 1367px) and (max-width: 1440px) {
  .pd-l-50-box {
    padding-left: 20px;
  }
}
.pd-l-50-box {
  padding-left: 50px;
}
.p-b-60 {
  padding-bottom: 60px;
}
</style>