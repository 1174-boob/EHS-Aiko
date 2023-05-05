<template>
  <!-- 废水报警 -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div class="left-box">
      <a-spin :spinning="spinning" wrapperClassName="a-spin">
        <HasFixedBottomWrapper>
          <div class="m-t-20"></div>
          <div class="m-t-10"></div>
          <a-form-model ref="iFrom" :model="iFrom" :rules="iRules" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false">
            <CommonSearchItem ref="corporationId" disabled :CommonFormInline="iFrom" :notTablePage="true" :labelCol="labelCol" :wrapperCol="wrapperCol"></CommonSearchItem>
            <a-form-model-item ref="category" label="报警类型" prop="category">
              <span>{{iFrom.category ? dictionary('waste_gas_reported_type', iFrom.category) : ''}}</span>
            </a-form-model-item>
            <a-form-model-item ref="warningReason" label="报警原因描述" prop="warningReason">
              <a-textarea placeholder="请输入报警原因描述" v-model="iFrom.warningReason" :maxLength="200" :disabled="isShowPage" />
            </a-form-model-item>
            <a-form-model-item ref="warningPictureList" label="报警原因描述照片" prop="warningPictureList">
              <UploadCanRemove v-if="!isShowPage" :limit="5" :maxSize="5" :headImgs="iFrom.warningPictureEchoList" @handleSuccess="fileList=> handleSuccessPictograms(fileList, 'warningPictureList')"></UploadCanRemove>
              <div v-else>
                <img :src="item.url" alt v-for="item in iFrom.warningPictureEchoList" :key="item.id" @click="previewImg(item.url)" class="hide_img" />
              </div>
            </a-form-model-item>

            <a-form-model-item ref="dealReason" label="处置过程" prop="dealReason">
              <a-textarea placeholder="请输入处置过程" v-model="iFrom.dealReason" :maxLength="200" :disabled="isShowPage" />
            </a-form-model-item>
            <a-form-model-item ref="dealPictureList" label="处置过程照片" prop="dealPictureList">
              <UploadCanRemove v-if="!isShowPage" :limit="5" :maxSize="5" :headImgs="iFrom.dealPictureEchoList" @handleSuccess="fileList=> handleSuccessPictograms(fileList, 'dealPictureList')"></UploadCanRemove>
              <div v-else>
                <img :src="item.url" alt v-for="item in iFrom.dealPictureEchoList" :key="item.id" @click="previewImg(item.url)" class="hide_img" />
              </div>
            </a-form-model-item>
            <a-form-model-item ref="dealWithType" label="处理类型" prop="dealWithType">
              <a-radio-group :disabled="isShowPage" v-model="iFrom.dealWithType">
                <a-radio v-for="item in handleTypeList" :key="item.key" :value="item.key">{{item.value}}</a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item ref="alarmState" label="处理结果" prop="alarmState">
              <a-radio-group :disabled="isShowPage" v-model="iFrom.alarmState">
                <a-radio value="1">关闭</a-radio>
                <a-radio value="2">保持</a-radio>
              </a-radio-group>
            </a-form-model-item>
            <template v-if="iFrom.alarmState == 1">
              <a-form-model-item ref="relieveTime" label="解除时间" prop="relieveTime">
                <a-date-picker :disabled="isShowPage" valueFormat="YYYY-MM-DD hh:mm:ss" v-model="iFrom.relieveTime" show-time placeholder="请选择解除时间" />
              </a-form-model-item>
              <a-form-model-item ref="relieveValue" label="解除值" prop="relieveValue">
                <a-input :disabled="isShowPage" v-model="iFrom.relieveValue" placeholder="请选择解除值" :maxLength="30" />
              </a-form-model-item>
            </template>
          </a-form-model>
          <div slot="fixedBottom">
            <FixedBottom>
              <div>
                <a-button @click="onCancle">{{isShowPage?'返回':'取消'}}</a-button>
                <a-button type="primary" v-if="!isShowPage" @click="handleConfirm" :loading="loading">处理</a-button>
              </div>
            </FixedBottom>
          </div>
        </HasFixedBottomWrapper>
      </a-spin>
    </div>
    <div class="right-box" v-if="flowLogList.length">
      <SetLog v-show="isShowPage" :flowLogList="flowLogList" />
    </div>
  </div>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom";
import { getEarlyWarnInfoWasteWaterDetailApi, changeEarlyWarnInfoWasteWaterItemApi, getEarlyWarnInfoWasteWaterLogList } from "@/services/earlyWarnAlarmInfo.js";
import { formValidator } from "@/utils/clx-form-validator.js";
import cancelLoading from "@/mixin/cancelLoading";
import UploadCanRemove from "@/components/upload/uploadCanRemove.vue";
import SetLog from '@/pages/environmental/earlyWarnInfo/comp/setLog.vue'
import dictionary from '@/utils/dictionary'
import { cloneDeep } from 'lodash';
import handleDisplayPicture from '@/pages/environmental/earlyWarnInfo/mixin/handleDisplayPicture'
export default {
  components: { FixedBottom, SetLog, UploadCanRemove },
  mixins: [cancelLoading, handleDisplayPicture],
  data() {
    return {
      dictionary,
      spinning: true,
      //操作日志
      flowLogList: [],
      //表单字段
      iFrom: {},
      // 表单验证
      iRules: {
        warningReason: [{ required: true, message: "报警原因描述不能为空", trigger: "blur" }],
        warningPictureList: [{ required: false, message: "报警原因描述照片不能为空", trigger: "change" }],
        dealReason: [{ required: true, message: "处置过程不能为空", trigger: "blur" }],
        dealPictureList: [{ required: false, message: "处置过程照片不能为空", trigger: "change" }],
        dealWithType: [{ required: true, message: "处理类型不能为空", trigger: "change" }],
        alarmState: [{ required: true, message: "处理结果不能为空", trigger: "change" }],
        relieveTime: [{ required: true, message: "解除时间不能为空", trigger: "change" }],
        relieveValue: [{ required: true, validator: this.onlyPositiveNumber, trigger: "change" }],
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
      // 处理类型
      handleTypeList: [],
      // 主键id
      waterId: undefined,
    };
  },
  created() {
    // 处理类型
    this.handleTypeList = Array.isArray(dictionary('waste_gas_handle_type')) ? dictionary('waste_gas_handle_type') : []
    this.waterId = this.$route.query.waterId;
    this.initPage()
  },
  computed: {
    // 当前页面是否为查看
    isShowPage() {
      return Boolean(this.$route.meta.isShowPage)
    },
  },
  methods: {
    initPage() {
      let apiList = [
        //获取详情
        this.getDetailsFn(),
      ]
      if (this.isShowPage) {
        apiList = [
          ...apiList,
          //获取日志
          this.getFlowLogList()
        ]
      }
      Promise.all(apiList)
        .finally(() => {
          setTimeout(() => {
            this.spinning = false
          }, 100);
        })
    },
    //获取详情
    getDetailsFn() {
      let params = { waterId: this.waterId };
      return getEarlyWarnInfoWasteWaterDetailApi(params)
        .then(res => {
          if (res.data) {
            let { corporationId, category, warningReason, warningPictureList, dealReason, dealPictureList, dealWithType, alarmState, relieveTime, relieveValue } = res.data
            if (alarmState == 1 || alarmState == 2) {
              // 处理图片回显
              return this.handleDisplayPicture({ warningPictureList, dealPictureList })
                .then(res1 => {
                  // console.log(res1);
                  let { warningPictureList: warningPictureEchoList, dealPictureList: dealPictureEchoList } = res1
                  if (alarmState == 2) {
                    relieveTime = undefined
                    relieveValue = undefined
                  }
                  // 赋值
                  this.iFrom = { corporationId, category, warningReason, warningPictureList, warningPictureEchoList, dealReason, dealPictureList, dealPictureEchoList, dealWithType, alarmState, relieveTime, relieveValue };
                  console.log(this.iFrom);
                  return Promise.resolve()
                })
            } else {
              this.iFrom = { corporationId, category, }
              return Promise.resolve()
            }
          }
        })
        .catch(err => { })
    },
    //获取日志--api
    getFlowLogList() {
      let apiData = { waterId: this.waterId };
      return getEarlyWarnInfoWasteWaterLogList(apiData)
        .then(res => {
          this.flowLogList = res.data || [];
        })
        .catch(err => {
          console.log(err)
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
      let formAll = false
      this.$refs["iFrom"].validate((valid, object) => {
        if (!valid) {
          this.scrollView(object);
        } else {
          formAll = true
        }
      });
      return formAll
    },
    // 处理--api
    handleConfirm() {
      console.log(this.iFrom, "...this.iFrom");
      if (!this.formValidate()) {
        return;
      }
      let apiData = {
        waterId: this.waterId,
        ...this.iFrom
      };
      if (apiData.alarmState != 1) {
        apiData.relieveTime = undefined
        apiData.relieveValue = undefined
      }
      this.handleLoading();
      changeEarlyWarnInfoWasteWaterItemApi(apiData)
        .then(() => {
          this.$antMessage.success("处理成功");
          this.$router.push({
            path:'/environmentManage/environmental/ambientAlarmInfo'
          })
        })
        .finally(() => {
          this.cancelLoading();
        });
    },
    // 仅正数
    onlyPositiveNumber(rule, value, callback) {
      let { required } = rule
      let re = /^[1-9]+[.]?\d*$/
      if (!value && value !== 0) {
        required ? callback(new Error(`解除值不能为空`)) : callback();
      } else if (!re.test(value)) {
        required ? callback(new Error(`解除值只能为大于0的数字`)) : callback();
      } else if (value.length >= 9) {
        required ? callback(new Error(`解除值位数必须小于9位`)) : callback();
      } else {
        callback();
      }
    },
    // 取消
    onCancle() {
      this.setKeepalive(true)
      this.$router.push({
        path:'/environmentManage/environmental/ambientAlarmInfo'
      })
    },
    //查看图片
    previewImg(imgUrl) {
      this.$hevueImgPreview(imgUrl);
    }
  },
};
</script>

<style scoped lang='less'>
.searchtable-wrapper {
  display: flex;
  .left-box {
    flex: 1;
    position: relative;
    display: flex;
    overflow: hidden;
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
      bottom: 0px;
    }
  }
  .right-box {
    flex: none;
    display: flex;
  }
}
.hide_img {
  width: 84px;
  height: 84px;
  margin-right: 15px;
  &:hover {
    cursor: pointer;
  }
}
::v-deep .fixed-bottom {
  width: 100%;
  bottom: 30px;
  left: 0px;
  z-index: 999;
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
</style>