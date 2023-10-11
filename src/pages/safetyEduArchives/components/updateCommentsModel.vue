<template>
  <CommonModal :title="modelTitle" :visible="updateCommentsModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formModel" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">

        <a-form-model-item label="上岗意见" prop="shanggangyijian">
          <a-radio-group v-model="formModel.shanggangyijian">
            <a-radio v-for="item in getDictTarget('s', 'bossOpinion')" :key="item.key" :value="item.key">
              {{ item.value }}
            </a-radio>
          </a-radio-group>
        </a-form-model-item>

      </a-form-model>
    </template>
    <template slot="btn">
      <a-button type="dashed" @click="closeModel">取消</a-button>
      <a-button type="primary" style="margin-left: 0.2rem" :loading="loading" @click="onSubmit">提交</a-button>
    </template>
  </CommonModal>
</template>

<script>
import { pdateSafetyEduOnboarding } from "@/services/safetyEduArchives"
import cancelLoading from "@/mixin/cancelLoading";
import { formValidator } from "@/utils/clx-form-validator.js";
import { getDictTarget } from '@/utils/dictionary'
export default {
  mixins: [cancelLoading],
  model: {
    prop: 'updateCommentsModelShow',
  },
  props: ['updateCommentsModelShow', 'updateCommentsModelData'],
  data() {
    return {
      getDictTarget,
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      rules: {
        shanggangyijian: [{ required: true, message: "不能为空", trigger: "change" }],
      },
      // 新增、修改表单
      formModel: {},
    };
  },
  computed: {
    modelTitle() {
      if (Array.isArray(this.updateCommentsModelData)) {
        return '批量更新上岗意见'
      } else {
        return '更新上岗意见'
      }
    },
  },
  methods: {
    // 提交
    onSubmit() {
      if (!formValidator.formAll(this, "ruleForm")) {
        return;
      }
      this.handleLoading()
      let ids = Array.isArray(this.updateCommentsModelData) ? this.updateCommentsModelData.map(item => item.id) : this.updateCommentsModelData.id
      let apiData = { ...this.formModel, ids }
      pdateSafetyEduOnboarding(apiData)
        .then(res => {
          this.$emit('updateOnOk')
          this.closeModel()
        })
        .catch(err => {})
        .finally(() => {
          setTimeout(() => {
            this.changeLoading()
          }, 300);
        })
    },
    // 取消-关闭model
    closeModel() {
      this.$emit('input', false)
    },
  },
  watch: {
    updateCommentsModelShow(newVal) {
      if (newVal) {

      } else {
        setTimeout(() => {
          this.formModel = {}
        }, 100);
      }
    }
  }
};
</script>

<style lang="less" scoped></style>
