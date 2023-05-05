<template>
  <div>
    <pageTitle>这是插槽标题</pageTitle>
    <!-- 虚线按钮 -->
    <div class="dashed-btn clx-btn-dashed-box m-b-15">
      <a-button class="m-r-30" type="dashed" @click="goInvitationAction">普通虚线框按钮</a-button>
      <!-- 带有加号按钮 -->
      <a-button type="dashed" @click="goInvitationAction">
        <a-icon type="plus" />带加号按钮
      </a-button>
    </div>
    <CommonForm></CommonForm>
    <!-- 弹框 -->
    <!-- <a-modal class="clx-model invitationMsgModal" centered title="邀请企业好友" :visible="visible" @cancel="visible = false" :maskClosable="false" destroyOnClose :footer="null">
        <div class="clx-model-body beauty-scroll">
          <a-form-model ref="invitationMsgForm" :model="formInvitationMsg" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" labelAlign="right">
            <a-form-model-item class="m-t-50" label="企业名称" prop="companyName">
              <a-input class="form-input" v-model.trim="formInvitationMsg.companyName" placeholder="请输入企业名称" style="color: #878787" />
            </a-form-model-item>
            <a-form-model-item label="联系人" prop="phone">
              <a-input class="form-input" :maxLength="11" v-model="formInvitationMsg.phone" placeholder="请输入手机号" />
            </a-form-model-item>
            <a-form-model-item label="备注" prop="phone">
              <a-input class="form-input" :maxLength="50" v-model="formInvitationMsg.remarks" placeholder="请输入显示名称" />
            </a-form-model-item>
            <a-form-model-item label="企业名称" prop="companyName">
              <a-input class="form-input" v-model.trim="formInvitationMsg.companyName" placeholder="请输入企业名称" style="color: #878787" />
            </a-form-model-item>
            <a-form-model-item label="联系人" prop="phone">
              <a-input class="form-input" :maxLength="11" v-model="formInvitationMsg.phone" placeholder="请输入手机号" />
            </a-form-model-item>
            <a-form-model-item label="备注">
              <a-input class="form-input" :maxLength="50" v-model="formInvitationMsg.remarks" placeholder="请输入显示名称" />
            </a-form-model-item><a-form-model-item label="企业名称" prop="companyName">
              <a-input class="form-input" v-model.trim="formInvitationMsg.companyName" placeholder="请输入企业名称" style="color: #878787" />
            </a-form-model-item>
            <a-form-model-item label="联系人" prop="phone">
              <a-input class="form-input" :maxLength="11" v-model="formInvitationMsg.phone" placeholder="请输入手机号" />
            </a-form-model-item>
            <a-form-model-item label="备注">
              <a-input class="form-input" :maxLength="50" v-model="formInvitationMsg.remarks" placeholder="请输入显示名称" />
            </a-form-model-item>
            <a-form-item :wrapper-col="{ span: 18, offset: 6 }">
              <a-button @click="visible = false">取消</a-button>
              <a-button class="m-l-15" type="primary" :loading="loading" @click="invitationMsgOk">提交</a-button>
            </a-form-item>
          </a-form-model>
        </div>
    </a-modal>-->
  </div>
</template>

<script>
import cancelLoading from '@/mixin/cancelLoading'
import { formValidator } from "@/utils/clx-form-validator.js";
export default {
  mixins: [cancelLoading],
  data() {
    return {
      visible: false,
      labelCol: { span: 6 }, // 设置左边label宽度
      wrapperCol: { span: 18 }, // 设置右边表单宽度
      // 邀请企业表单信息
      formInvitationMsg: {
        companyName: undefined,
        phone: undefined,
        remarks: undefined,
      },
      // 邀请企业表单验证
      rules: {
        companyName: [
          {
            required: true,
            trigger: "blur",
            message: "企业名称不能为空",
            text: "企业名称",
          },
        ],
        phone: [
          {
            required: true,
            validator: formValidator.texTphoneNumber,
            trigger: "blur",
          },
        ]
      }
    }
  },
  methods: {
    // 跳转邀请记录
    goInvitationAction() {
      this.visible = true;
    },
    invitationMsgOk() {
      this.visible = false;
      this.$antMessage.success("点击了提交按钮");
    }
  }
}
</script>
