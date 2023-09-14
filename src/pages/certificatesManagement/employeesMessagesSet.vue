<template>
  <HasFixedBottomWrapper>
      <a-form-model ref="ruleForm" :model="iFrom" :rules="iRules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <template title="临期提醒">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>临期提醒</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="临期开始时间" prop="preliminaryStartTimeValue">
                <a-input v-model="iFrom.preliminaryStartTimeValue" :maxLength="20" placeholder="请输入"></a-input>
              </a-form-model-item>
                <h4 class="pe-data-title">内部员工证书</h4> 
              <a-form-model-item label="开始提醒时间" prop="temporaryInStartReminderTimeValue">
                <a-input v-model="iFrom.temporaryInStartReminderTimeValue" :maxLength="20" placeholder="请输入"></a-input>
              </a-form-model-item>
              <a-form-model-item label="开始提醒单位" prop="temporaryInStartReminderTimeUnit">
                <a-select v-model="iFrom.temporaryInStartReminderTimeUnit" placeholder="请选择">
                  <a-select-option v-for="item in operationForm" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="提醒频率" prop="temporaryInReminderFrequency">
                <a-select v-model="iFrom.temporaryInReminderFrequency" placeholder="请选择">
                  <a-select-option v-for="item in operationForm" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="提醒人员" prop="temporaryInReminderUser">
                <a-select v-model="iFrom.temporaryInReminderUser" placeholder="请选择">
                  <a-select-option v-for="item in peopleForm" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="时间单位" prop="preliminaryStartTimeUnit">
                <a-select v-model="iFrom.preliminaryStartTimeUnit" placeholder="请选择">
                  <a-select-option v-for="item in operationForm" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <h4 class="pe-data-title">外部员工证书</h4> 
              <a-form-model-item label="开始提醒时间" prop="temporaryOutStartReminderTimeValue">
                <a-input v-model.trim="iFrom.temporaryOutStartReminderTimeValue" :maxLength="20" placeholder="请输入"></a-input>
              </a-form-model-item>
              <a-form-model-item label="开始提醒单位" prop="temporaryOutStartReminderTimeUnit">
                <a-select v-model="iFrom.temporaryOutStartReminderTimeUnit" placeholder="请选择">
                  <a-select-option v-for="item in operationForm" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="提醒频率" prop="temporaryOutReminderFrequency">
                <a-select v-model="iFrom.temporaryOutReminderFrequency" placeholder="请选择">
                  <a-select-option v-for="item in operationForm" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>
        <template title="超期提醒">
          <div>
            <div class="m-t-20 border-b-e7">
              <PageTitle>超期提醒</PageTitle>
            </div>
            <div class="m-t-20"></div>
          </div>
          <a-row>
            <a-col :span="12">
              <h4 class="pe-data-title">内部员工证书</h4> 
              <a-form-model-item label="提醒频率" prop="overtimeInReminderFrequency">
                <a-select v-model="iFrom.overtimeInReminderFrequency" placeholder="请选择">
                  <a-select-option v-for="item in operationForm" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="提醒人员" prop="overtimeInReminderUser">
                <a-select v-model="iFrom.overtimeInReminderUser" placeholder="请选择">
                  <a-select-option v-for="item in peopleForm" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <h4 class="pe-data-title">外部员工证书</h4> 
              <a-form-model-item label="提醒频率" prop="overtimeOutReminderFrequency">
                <a-select v-model="iFrom.overtimeOutReminderFrequency" placeholder="请选择">
                  <a-select-option v-for="item in operationForm" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </template>
      </a-form-model>
    <div slot="fixedBottom">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="cancleSubmit">取消</a-button>
          <a-button type="primary" class="m-r-15" @click="iSave">确定</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>
<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import { cloneDeep } from 'lodash'
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import { getPushNotifyEdit, getPushNotifyDetail, } from '@/services/api.js'
import chemicalDict from "@/mixin/chemicalDict.js";
import cancelLoading from "@/mixin/cancelLoading";
export default {
  components: { FixedBottom, },
  mixins: [teableCenterEllipsis, chemicalDict, cancelLoading],
  data() {
    return {
      pushId:'',
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      iFrom: {},
      iRules: {
        preliminaryStartTimeValue: [{ required: true,validator: formValidator.onlyNumber, message: "请输入数字", trigger: "blur" },],
        preliminaryStartTimeUnit: [{ required: true, message: "时间单位不能为空", trigger: "change" },],
        temporaryInStartReminderTimeValue: [{ required: true,validator: formValidator.onlyNumber, message: "请输入数字", trigger: "blur" },],
        temporaryInStartReminderTimeUnit: [{ required: true, message: "开始提醒单位不能为空", trigger: "change" },],
        temporaryInReminderFrequency: [{ required: true, message: "提醒频率不能为空", trigger: "blur" },],
        temporaryInReminderUser: [{ required: true, message: "提醒人员不能为空", trigger: "blur" },],
        overtimeInReminderFrequency: [{ required: true, message: "提醒频率不能为空", trigger: "change" },],
        overtimeInReminderUser: [{ required: true, message: "提醒人员不能为空", trigger: "change" },],
        temporaryOutStartReminderTimeValue :[{ required: true,validator: formValidator.onlyNumber, message: "请输入数字", trigger: "blur" },],
        temporaryOutStartReminderTimeUnit: [{ required: true, message: "时间单位不能为空", trigger: "change" },],
        temporaryOutReminderFrequency: [{ required: true, message: "提醒频率不能为空", trigger: "change" },],
        overtimeOutReminderFrequency: [{ required: true, message: "提醒频率不能为空", trigger: "change" },],
      },
      // 日期
      operationForm: [
        {
          key: 'day',
          value: '日',
        },
        {
          key: 'week',
          value: '周',
        },
        {
          key: 'month',
          value: '月',
        },
      ],
      // 人员
      peopleForm: [
        {
          key: '1',
          value: '仅持证人',
        },
        {
          key: '2',
          value: '推送至持证人及部门经理',
        },
      ],
    }
  },
  created() {  
    this.getPageDetail()
  },
  computed: {},
  methods: {
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
    // 获取页面详情
    getPageDetail() {
      getPushNotifyDetail({})
      .then(res => {
        // console.log('详情返回的数据',res.data);
        this.iFrom = res.data
        this.pushId = res.data.pushId
      })
      .catch(err => {
        console.log(err);
      })
    },
    // 保存api
    iSave() {
      if (!this.formValidate()) {
        return
      }
      // console.log('要保存的数据',this.iFrom);
      let params = {
        ...this.iFrom,
        pushId:this.pushId?this.pushId:undefined
      }
      getPushNotifyEdit(params)
      .then(res => {
        this.$antMessage.success(res.message);
        this.$router.go(-1)
      })
      .catch(err => {
        console.log(err);
      })
    },
    // 取消
    cancleSubmit() {
      this.$router.go(-1)
    },
  }
}
</script>
<style lang="less" scoped>

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

.pe-data-title{
  margin-bottom: 30px;
  margin-left: 220px;
  font-size: 16px;
  color: rgba(0,0,0,0.85);
  line-height: 24px;
  font-weight: 500;
  border-bottom: 1px solid #f4f4f4;
}

::v-deep .el-input__icon.el-range__icon.el-icon-time {
  display: none;
}
</style>