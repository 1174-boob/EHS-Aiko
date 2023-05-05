<template>
  <div
    class="post-wrapper flex clx-show-scroll clx-flex-1 beauty-scroll bg-fff"
  >
    <!-- 左侧-表单盒子 -->
    <div :class="['flex-1', 'position-rel', disabled ? 'pd-b-10' : 'pd-b-80']">
      <div :class="['scroll-center-box', disabled ? '' : 'pd-l-50-box']">
        <!-- 顶部 -->
        <div class="m-t-20 w-90-b">
          <a-form-model
            :label-col="{ style: { width: '108px' } }"
            class="form-page"
            ref="addForm"
            :model="basicInfoForm"
            :colon="false"
          >
            <a-row :gutter="24" class="flex justify-content-between">
              <a-col :span="12">
                <a-form-model-item label="设备编号" prop="name">
                  <div class="pure-text">{{ basicInfoForm.equipCode }}</div>
                </a-form-model-item>
                <a-form-model-item label="气体" prop="name">
                  <div class="pure-text">{{ basicInfoForm.gas }}</div>
                </a-form-model-item>
                <a-form-model-item label="开始时间" prop="name">
                  <div class="pure-text">{{ basicInfoForm.startTime }}</div>
                </a-form-model-item>
                <a-form-model-item label="持续时间" prop="patch">
                  <div class="pure-text">{{ basicInfoForm.persistTime }}</div>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item label="设备名称" prop="name">
                  <div class="pure-text">{{ basicInfoForm.equipName }}</div>
                </a-form-model-item>
                <a-form-model-item label="报警级别" prop="name">
                  <div class="pure-text">{{ basicInfoForm.name }}</div>
                </a-form-model-item>
                <a-form-model-item label="结束时间" prop="name">
                  <div class="pure-text">{{ basicInfoForm.endTime }}</div>
                </a-form-model-item>
                <a-form-model-item label="最大数值" prop="patch">
                  <div class="pure-text">{{ basicInfoForm.maxValue }}</div>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
        <div class="title">
          <PageTitle>报警曲线</PageTitle>
        </div>

        <!-- 中间-eharts -->
        <div>
          <div v-if="alarmList.length == 0">
            <a-empty />
          </div>
          <div
            v-else
            id="hazard-level"
            :class="['h-400', disabled ? 'w-100-b' : 'w-68-b']"
          ></div>
        </div>

        <!-- 底部 -->
        <div :class="[disabled ? 'pd-l-50-box' : '']">
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
              <div class="div-img" v-else>
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
              label="描述图片"
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
import Editor from "@/components/editor/wangEditor.vue";
import { formValidator } from "@/utils/clx-form-validator.js";
import SetLog from "@/pages/networkControl/compoents/setLog.vue";
import FormPage from "@/components/commonTpl/formPage.vue";
import * as echarts from "echarts";
import cancelLoading from "@/mixin/cancelLoading";
import {
  DealAlarmProcess,
  GetGasProcess,
  GetLogList,
} from "@/services/networkControl.js";
import UploadCanRemove from "@/components/upload/uploadCanRemove.vue";

export default {
  components: { FixedBottom, Editor, SetLog, FormPage, UploadCanRemove },
  mixins: [cancelLoading],
  data() {
    return {
      basicInfoForm: { name: "1231" },
      //富文本高度
      height: "300px",
      isClear: false,
      detailObj: {},
      //操作日志
      flowLogList: [],
      //表单字段
      handleForm: {
        reasonType: undefined,
        reasonDescription: undefined,
        disposalProcess: undefined,
        alarmType: "1",
        status: "1",
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
          { required: true, message: "请输入预警原因描述", trigger: "change" },
        ],
        disposalProcess: [
          { required: true, message: "请输入处置过程", trigger: "change" },
        ],
        alarmType: [
          { required: true, message: "报警类型为必选项", trigger: "change" },
        ],
        status: [
          { required: true, message: "处理结果为必选项", trigger: "change" },
        ],
      },
      disabled: false,
      //echart数据
      alarmList: [],
      editorLength: 0,
    };
  },
  created() {
    // let obj = {type:'deal',idList:['135']}
    let obj = this.$route.params;
    if (JSON.stringify(obj) == "{}") {
      this.$router.push("/safeManage/emergencyManagement/networkControl/alarmInfo"); //返回列表页
    }

    this.detailObj = obj;
    this.disabled = obj.type == "look" ? true : false;
    this.getIsSafety(); //获取详情
    if (obj.type == "look") {
      this.getFlowLogList(); //获取日志
    }
  },
  mounted() {
    window.onresize = () => {
      this.levelCharts && this.levelCharts.resize();
    };
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
      GetGasProcess(params)
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
              reasonDescription: res.data.reasonDescription,
              disposalProcess: res.data.disposalProcess,
              alarmType: res.data.alarmType,
              status: res.data.status == 0 ? undefined : res.data.status,
            };
            this.handleForm = obj;
            this.basicInfoForm = res.data;
            this.alarmList = res.data.alarmList || [];
            if (res.data.alarmList && res.data.alarmList.length) {
              setTimeout(() => {
                this.barInit();
              }, 20);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //获取日志
    getFlowLogList() {
      let params = { alarmId: this.detailObj.idList[0], alarmType: "2" };
      GetLogList(params)
        .then((res) => {
          this.flowLogList = res.data;
        })
        .catch((err) => console.log(err));
    },

    //echarts图表绘画
    barInit() {
      this.levelCharts = echarts.init(document.getElementById("hazard-level"));
      this.levelCharts.setOption(this.levelOption);
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
        type: "2",
        alarmId: this.detailObj.idList[0],
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
  },
  //查看图片
  previewImg(imgUrl) {
    this.$hevueImgPreview(imgUrl);
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
    //echarts图表数据
    levelOption() {
      let list = this.alarmList;
      let listT = [];
      let listS = [];
      list.forEach((item) => {
        listT.push(item.dateTime);
        listS.push(item.value);
      });
      let obj = {
        xAxis: {
          type: "category",
          data: listT,
          axisLabel: {
            rotate: -40,
          },
        },
        yAxis: {
          type: "value",
          // name: '报警曲线',
          // min: 0,
          // max:16,
          // interval: 2,
          // axisLabel: {
          //   formatter: '{value} ml'
          // }
        },
        series: [
          {
            data: listS,
            type: "line",
          },
        ],
      };
      return obj;
    },
  },
};
</script>

<style scoped lang='less'>
.hide_img {
  width: 150px;
  padding-right: 15px;
  &:hover {
    cursor: pointer;
  }
}
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
.w-68-b {
  width: 68%;
}
.h-400 {
  height: 400px;
  #hazard-level {
    width: 100%;
    height: 100%;
  }
}
.detail_know_content {
  width: 100%;
  margin-top: 25px;
  .detail_know_content_item {
    margin-bottom: 35px;
    display: flex;
    div {
      width: 50%;
      span {
        color: #333;
        &:nth-child(1) {
          color: #9d9d9d;
          padding-right: 10px;
          display: inline-block;
          width: 95px;
        }
      }
    }
    .scal_div {
      display: flex;
      width: 100%;
      img {
        width: 235px;
        height: 136px;
        @media screen and (max-width: 1366px) {
          width: 150px;
          height: 80px;
        }
      }

      span {
        padding-right: 10px;
        display: inline-block;
        width: 95px;
      }
      & > p {
        flex: 1;
      }
    }
    .detail_div {
      flex: 1;
      .detail_div_item {
        width: 100%;
        height: 56px;
        padding-right: 10px;
        &:nth-child(odd) {
          background: #fafafa;
          .detail_div_item_left_one {
            background: #e0eaf4;
          }
        }
        &:nth-child(even) {
          .detail_div_item_left_one {
            background: #f2f7fc;
          }
        }
        .detail_div_item_left {
          width: 84%;
          height: 100%;
          display: flex;
          .detail_div_item_left_one {
            padding: 0;
            display: inline-block;
            height: 100%;
            width: 56px;
            text-align: center;
            color: #0067cc;
            margin-right: 15px;
          }
          .detail_div_item_left_two {
            display: inline-block;
            width: calc(100% - 56px);
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }
          span {
            line-height: 56px;
          }
        }
        .detail_div_item_right {
          width: 16%;
          text-align: right;
          span {
            color: #0067cc;
          }
        }
      }
    }
  }
}
.w-90-b {
  width: 90%;
}
.w-100-b {
  width: 100%;
}
.title {
  margin-bottom: -20px;
}
.div-img {
  width: 100%;
  display: flex;
  img {
    width: 100px;
    padding-right: 10px;
  }
}
</style>