<template>
  <div class="join_div">
    <CommonModal title="邀请用户加入企业" :visible="JoinQyFlag" :cancelFn="cancelThing">
      <div class="join_top_div">
        <p v-if="expireStatus" class="warn_p">您的邀请信息已于{{ expireTime }}过期，请重新生成。</p>
        <p v-else>请将以下邀请信息发送给员工</p>

        <div class="top_btn_div">
          <!-- :class="[step ? 'warn_all_span' : '']" -->
          <span @click="regenerate">重新生成</span>
          <div></div>
          <span v-if="step" :class="[step ? 'disabled_all_color disabled_all_hover' : '']">停用邀请信息</span>
          <span v-else @click="deactivate">停用邀请信息</span>
        </div>
      </div>
      <div class="join_code_div">
        <div class="code_left_div" :class="[step ? 'disabled_all_back' : '']">
          <p>邀请码</p>
          <p>成员可输入企业邀请码加入企业</p>
          <p>{{ inviteCode }}</p>
          <a-button v-if="step" class="disabled_all_color disabled_all_hover">复制企业邀请码</a-button>
          <a-button v-else @click="copyCode" id="enterpriseInvitationCode" :data-clipboard-text="inviteCode">复制企业邀请码</a-button>
        </div>
        <div class="code_right_div" :class="[step ? 'disabled_all_back' : '']">
          <p>邀请链接</p>
          <p>成员访问链接，登录后可直接加入企业</p>
          <p>{{ links }}</p>
          <a-button v-if="step" class="disabled_all_color disabled_all_hover">复制企业邀请链接</a-button>
          <a-button v-else @click="copyLink" id="corporateInvitationLink" :data-clipboard-text="links">复制企业邀请链接</a-button>
        </div>
      </div>
      <div class="join_time">
        <span class="join_time_title">设置邀请有效期</span>
        <a-select class="join_time_sel" @change="handleChange" :disabled="step" placeholder="请设置有效期" v-model="expireDays">
          <a-select-option v-for="item in timeStatusList" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
        </a-select>
        <span class="join_time_time" v-if="expireType"></span>
        <span class="join_time_time" v-else>{{ expireTime }} 到期</span>
      </div>
      <div class="join_approve">
        <span>是否需要管理员审批</span>
        <a-radio-group name="radioGroup" v-model="adminApproval" @change="groupThing" :disabled="step">
          <a-radio :value="1">是</a-radio>
          <a-radio :value="2">否</a-radio>
        </a-radio-group>
      </div>
      <h3 :class="[step ? 'disabled_all_color' : '']">生成邀请信息</h3>
      <p :class="[step ? 'disabled_all_color' : '', 'info_content_p']">
        “{{
        companName
        }}”邀请您成为企业成员，您可以登录BOE工业互联网平台输入邀请码
        <span :class="[step ? 'disabled_all_color' : '']">{{ inviteCode }}</span>
        加入企业，也可以点击邀请链接
        <span :class="[step ? 'disabled_all_color' : '']">{{ links }}</span>，由此链接进入邀请页，成为该企业成员。
      </p>
      <div class="join_bottom_div">
        <a-form-model ref="formRef" :model="form" :rules="formRules" :colon="false" labelAlign="right">
          <a-form-model-item label prop="phone">
            <div class="item_div">
              <a-input v-model.trim="form.phone" placeholder="请输入手机号" :disabled="step" style="width: 400px" />
              <a-button type="primary" :disabled="step" @click="sendPhone" :loading="loadingPhone">发送</a-button>
            </div>
          </a-form-model-item>

          <a-form-model-item label prop="email">
            <div class="item_div">
              <a-input v-model.trim="form.email" placeholder="请输入邮箱" :disabled="step" style="width: 400px" />
              <a-button type="primary" :disabled="step" @click="sendEmail" :loading="loadingEmail">发送</a-button>
            </div>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div slot="btn">
        <a-button @click="cancelThing">返回</a-button>
      </div>
    </CommonModal>
  </div>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import getDictionaryItemObj from "@/utils/dictionary";
import Clipboard from "clipboard"; //复制插件
import {
  UpdateInfoInterFace,
  SendPhoneOrEmailThing,
  StopUsingEnabled,
} from "@/services/permissions";

export default {
  props: ["JoinQyFlag", "addcodeObj"],
  data() {
    return {
      loadingPhone: false,
      loadingEmail: false,
      groupRadio: undefined,
      selectVal: undefined,
      form: { phone: undefined, email: undefined },
      formRules: {
        phone: [
          {
            required: true,
            validator: formValidator.texTphoneNumber,
            trigger: "blur",
          },
        ],
        email: [{ required: true, message: "邮箱不能为空", trigger: "change" }],
      },
      stylesDisabled: false, //过期样式开关
      timeStatusList: [], //有效期字典
      links: "", //邀请链接
      inviteCode: "", //大写邀请码
      expireType: false, //是否永久 true是
      expireStatus: false, //是否过期 true是
      expireTime: "", //过期时间
      adminApproval: undefined, //是否需要管理员审批
      expireDays: undefined, //有效期天数
      step: false, //过期禁用样式开关
      companName: JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company
        .companyName,
    };
  },
  created() {
    //获取设置时间字典
    this.timeStatusList = getDictionaryItemObj("inviteCodeDate");
  },
  methods: {
    //手机号-发送信息事件
    sendPhone() {
      this.$refs["formRef"].validateField(["phone"], (err) => {
        //校验
        if (!err) {
          this.loadingPhone = true;
          SendPhoneOrEmailThing({
            phone: this.form.phone,
            companyInviteCodeId: this.addcodeObj.companyInviteCodeId,
          })
            .then((res) => {
              this.form.phone = undefined;
              this.loadingPhone = false;
              this.$message.success("发送成功");
            })
            .catch((err) => {
              this.loadingPhone = false;
            });
        }
      });
    },
    //邮箱-发送信息事件
    sendEmail() {
      this.$refs["formRef"].validateField(["email"], (err) => {
        //校验
        if (!err) {
          this.loadingEmail = true;
          SendPhoneOrEmailThing({
            email: this.form.email,
            companyInviteCodeId: this.addcodeObj.companyInviteCodeId,
          })
            .then((res) => {
              this.form.email = undefined;
              this.loadingEmail = false;
              this.$message.success("发送成功");
            })
            .catch((err) => {
              this.loadingEmail = false;
            });
        }
      });
    },
    //获取props值 并赋值
    getObj() {
      if (this.addcodeObj) {
        this.stylesDisabled = this.addcodeObj.status == 1 ? false : true; //判断是否过期
        this.links = this.addcodeObj.allInviteCode; //邀请链接
        this.expireType = this.addcodeObj.expireType == 1 ? true : false; //有效期类型 1永久 2非永久
        this.expireTime = this.addcodeObj.expireTime || ""; //过期时间
        this.adminApproval = this.addcodeObj.adminApproval; //是否需要管理员审批
        this.expireDays = this.addcodeObj.expireDays; //有效期天数
        this.expireStatus = this.addcodeObj.expireStatus; //是否过期
        this.inviteCode = this.addcodeObj.inviteCode; //大写邀请码
        this.step = this.addcodeObj.expireStatus == 1 ? true : false; //过期禁用样式
      }
    },
    //复制邀请码功能
    copyCode() {
      var _this = this;
      var clipboard = new Clipboard("#enterpriseInvitationCode");
      clipboard.on("success", (e) => {
        _this.$message.success("复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        // 不支持复制
        console.log("该浏览器不支持自动复制");
        // 释放内存
        clipboard.destroy();
      });
    },
    //复制邀请链接功能
    copyLink() {
      var _this = this;
      var clipboard = new Clipboard("#corporateInvitationLink");
      clipboard.on("success", (e) => {
        _this.$message.success("复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        // 不支持复制
        console.log("该浏览器不支持自动复制");
        // 释放内存
        clipboard.destroy();
      });
    },
    //重新生成
    regenerate() {
      this.$confirm({
        title: "提示",
        content: "重新生成后，之前的邀请信息自动失效，是否重新生成？",
        cancelText: "取消",
        onOk: () => {
          this.$emit("toRegenerateCode");
        },
      });
    },
    //停用
    deactivate() {
      this.$confirm({
        title: "提示",
        content: "停用后，他人无法再通过该邀请链接和邀请码加入。确定停用吗？",
        cancelText: "取消",
        onOk: () => {
          StopUsingEnabled({
            codeStatus: 1,
          })
            .then((res) => {
              this.$message.success("停用成功");
              this.cancelThing();
              this.clearForm();
            })
            .catch((err) => {
              
            });
        },
      });
    },

    //清空表单值
    clearForm() {
      let clearForm = { phone: undefined, email: undefined };
      this.form = clearForm;
    },
    //关闭弹框事件
    cancelThing() {
      this.clearForm();
      this.$emit("closeJoinEnterpriseFlag");
    },
    //是否需要管理员审批事件
    async groupThing(e) {
      let result = await UpdateInfoInterFace({
        adminApproval: e.target.value,
        companyInviteCodeId: this.addcodeObj.companyInviteCodeId,
      });
      if (result.code == 20000) {
        this.$message.success("设置成功");
        this.expireDays = val;
      }
    },
    //有限期下拉事件
    async handleChange(val) {
      let result = await UpdateInfoInterFace({
        expireDays: val,
        companyInviteCodeId: this.addcodeObj.companyInviteCodeId,
      });
      if (result.code == 20000) {
        this.expireDays = val;
        this.$emit("joinUser");
        this.$message.success("设置成功");
      }
    },
  },
  watch: {
    addcodeObj() {
      this.getObj();
    },
  },
};
</script>

<style lang='less' >
@media screen and (max-width: 1366px) {
  .join_code_div > div p {
    font-size: 12px !important;
  }
  .join_top_div > p {
    font-size: 12px !important;
  }
  .join_code_div > div {
    padding: 18px !important;
  }
  .join_top_div .top_btn_div span {
    font-size: 12px;
  }
  .clx-model .ant-modal .clx-model-body .model-content {
    padding: 0 40px !important;
  }
}
@media screen and (max-width: 1440px) {
  .join_top_div > p {
    font-size: 12px !important;
  }
  .clx-model .ant-modal .clx-model-body .model-content {
    padding: 0 50px !important;
  }
  .join_code_div > div {
    padding: 18px !important;
  }
}
.join_div {
  width: 100%;
  height: 100%;
  > h3 {
    font-size: 14px;
    color: #333333;
  }
}
.join_top_div {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: self-start;
  margin-bottom: 20px;
  > p {
    width: 70%;
    font-size: 14px;
    margin: 0;
  }
  .top_btn_div {
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    span {
      color: #0067cc;
      &:hover {
        cursor: pointer;
      }
    }
    > div {
      width: 20px;
    }
  }
  .warn_p {
    color: #e23232;
  }
}
.join_code_div {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    background: #f6fbff;
    padding: 30px;
    width: 49%;
    p {
      margin: 0;
      &:nth-child(1) {
        font-size: 14px;
        color: #666666;
        margin-bottom: 10px;
      }
      &:nth-child(2) {
        font-size: 14px;
        color: #666666;
        margin-bottom: 20px;
      }
      &:nth-child(3) {
        font-size: 14px;
        color: #333;
        margin-bottom: 20px;
        height: 42px;
      }
    }
    // .a_btn_div {
    //   background: #f4f4f4;
    //   height: 36px;
    //   font-size: 14px;
    //   padding: 10px 14px;
    //   width: 124px;
    // }
    button {
      background: #fff;
      height: 40px;
      color: #0067cc;
      border: none !important;
      outline: 0 none !important;
      margin-right: 0;
    }
  }
}
.join_time {
  margin: 30px 0;
  display: flex;
  align-items: center;
  .join_time_title {
    display: inline-block;
    color: #999;
    width: 126px;
    text-align: right;
    margin-right: 10px;
  }
  .join_time_sel {
    width: 166px;
  }
  .join_time_time {
    display: inline-block;
    color: #999;
    text-align: right;
    margin-left: 10px;
  }
}
.join_approve {
  margin: 0 0 30px 0;
  > span {
    display: inline-block;
    color: #999;
    width: 126px;
    text-align: right;
    margin-right: 10px;
  }
}
.info_content_p {
  font-size: 14px;
  color: #999999;
  margin-bottom: 30px;
  span {
    &:nth-child(1) {
      color: #333;
    }
    &:nth-child(2) {
      color: #0067cc;
    }
  }
}
.join_bottom_div {
  padding: 0 110px;
  > div {
    display: flex;
    margin-bottom: 30px;
  }
}
.item_div {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  input {
    margin-right: 10px;
  }
}
.disabled_all_color {
  color: #999 !important;
}
.disabled_all_hover {
  &:hover {
    cursor: not-allowed !important;
  }
}
.disabled_all_back {
  background: #f4f4f4 !important;
}
// .warn_all_span {
//   color: #e23232 !important;
// }
</style>