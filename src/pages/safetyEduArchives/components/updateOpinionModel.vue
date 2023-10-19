<template>
  <CommonModal :title="modelTitle" :visible="updateOpinionModelShow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="ruleForm" :model="formModel" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-model-item label="上岗意见" prop="bossOpinions">
          <a-radio-group v-model="formModel.bossOpinions">
            <a-radio v-for="item in getDictTarget('s', 'bossOpinion')" :key="item.key" :value="item.key">{{ item.value }}</a-radio>
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
    prop: 'updateOpinionModelShow',
  },
  props: ['updateOpinionModelShow', 'updateOpinionModelData'],
  data() {
    return {
      getDictTarget,
      rules: {
        bossOpinions: [{ required: true, message: "不能为空", trigger: "change" }],
      },
      // 新增、修改表单
      formModel: {},
    };
  },
  computed: {
    modelTitle() {
      if (Array.isArray(this.updateOpinionModelData)) {
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
      let idList = Array.isArray(this.updateOpinionModelData) ? this.updateOpinionModelData.map(item => item.id) : [this.updateOpinionModelData.id]
      let apiData = { ...this.formModel, idList }
      pdateSafetyEduOnboarding(apiData)
        .then(res => {
          this.$emit('updateOnOk')
          const msg = res.data
          this.$antMessage.info({
            content: `${msg}`,
            duration: 5
          });
          this.closeModel()
        })
        .catch(err => { })
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
    updateOpinionModelShow(newVal) {
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
