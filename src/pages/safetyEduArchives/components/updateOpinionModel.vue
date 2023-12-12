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
      <CommonTable>
        <vxe-table
          class="vxe-scrollbar beauty-scroll-fireBox"
          border
          show-overflow
          align="center"
          :data="dataSource"
          show-header-overflow
        >
          <vxe-column field="userName" title="姓名">
            <template #default="{ row }">
              <span>{{ row.userName ? row.userName : '--' }}/{{ row.userJobNumber ? row.userJobNumber : '--' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="deptName" title="部门">
            <template #default="{ row }">
              <span>{{ row.deptName ? row.deptName : '--' }}</span>
            </template>
          </vxe-column>
          <vxe-colgroup title="公司级">
            <vxe-column field="companyScore" title="员工填写">
              <template #default="{ row }">
                <span>{{ row.companyScore }}</span>
              </template>
            </vxe-column>
            <vxe-column field="companyCorrectScore" title="讲师纠错">
              <template #default="{ row }">
                <span>{{ row.companyCorrectScore }}</span>
              </template>
            </vxe-column>
          </vxe-colgroup>
          <vxe-colgroup title="车间(部门)级别">
            <vxe-column field="deptScore" title="员工填写">
              <template #default="{ row }">
                <span>{{ row.deptScore }}</span>
              </template>
            </vxe-column>
            <vxe-column field="deptCorrectScore" title="讲师纠错">
              <template #default="{ row }">
                <span>{{ row.deptCorrectScore }}</span>
              </template>
            </vxe-column>
          </vxe-colgroup>
          <vxe-colgroup title="班组级">
            <vxe-column field="groupScore" title="员工填写">
              <template #default="{ row }">
                <span>{{ row.groupScore }}</span>
              </template>
            </vxe-column>
            <vxe-column field="groupCorrectScore" title="讲师纠错">
              <template #default="{ row }">
                <span>{{ row.groupCorrectScore }}</span>
              </template>
            </vxe-column>
          </vxe-colgroup>
          <template #empty>
            <div style="padding:16px 0;">
              <a-empty />
            </div>
          </template>
        </vxe-table>
      </CommonTable>
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
    dataSource() {
      console.log('this.updateOpinionModelData',this.updateOpinionModelData);
      // return this.updateOpinionModelData? [this.updateOpinionModelData] : []
      return Array.isArray(this.updateOpinionModelData)? this.updateOpinionModelData : [this.updateOpinionModelData]
    },
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

<style lang="less" scoped>
::v-deep .ant-modal-content {
  width: 917px;
}
::v-deep .model-content-form {
  padding: 0px 30px 0 70px!important;
}

</style>
