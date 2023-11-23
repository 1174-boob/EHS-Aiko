<template>
  <a-spin :spinning="false" wrapperClassName="a-spin">
    <a-form-model ref="addForm" :model="safetyEducationForm" :label-col="labelCol" :wrapper-col="wrapperCol">
      <template title="基本信息">
        <div class="m-t-20"></div>
        <a-row>

          <a-col :span="12">
            <a-form-model-item label="三级安全教育标题" >
              <div style="fontWeight: bold">{{ safetyEducationForm.title || "--" }}</div>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="状态">
              <div style="color: #f59e2b;" v-if="safetyEducationForm.status == 1">待开始</div>
              <div style="color: #0067cc;" v-if="safetyEducationForm.status == 2">进行中</div>
              <div style="color: #98ca49;" v-if="safetyEducationForm.status == 3">已完成</div>
              <div v-if="safetyEducationForm.status == undefined">'--'</div>
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="所属组织">
              <div>{{ safetyEducationForm.corporationName || "--" }}</div>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="类型">
              <div v-if="safetyEducationForm.type == 1">新员工</div>
              <div v-if="safetyEducationForm.type == 2">转岗</div>
              <div v-if="safetyEducationForm.status == undefined">'--'</div>
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="签署截止时间">
              <div>{{ safetyEducationForm.signDeadline || "--" }}</div>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="公司级培训讲师">
              <div>{{ trainerCompanyUserName || "--" }}</div>
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="车间(部门)级培训讲师">
              <div>{{ trainerDeptUserName || "--" }}</div>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="班组级培训讲师">
              <div>{{ trainerGroupUserName || "--" }}</div>
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="环安部培训负责人">
              <div>{{ safetyEducationForm.trainerEsdUserName || "--" }}/{{ safetyEducationForm.trainerEsdJobNumber}}</div>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="发起人">
              <div>{{ safetyEducationForm.createUserName || "--" }}/{{ safetyEducationForm.createUserJobNumber}}</div>
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="发起时间">
              <div>{{ safetyEducationForm.createTime || "--" }}</div>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="">
              <!-- <div>{{ safetyEducationForm.dangerLocation || "--" }}</div> -->
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="">
              <div>{{ safetyEducationForm.dangerLocation || "" }}</div>
            </a-form-model-item>
          </a-col>
        </a-row>
      </template>
    </a-form-model>
  </a-spin>
</template>

<script>
export default {
  props: {
    safetyEducationForm: {
      type: Object,
      default: () => {
        return {
          checkType: undefined,
        };
      },
    },
    trainerCompanyUserName: {
      type: String,
      default: ''
    },
    trainerDeptUserName: {
      type: String,
      default: ''
    },
    trainerGroupUserName: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
  },
  methods: {
    
  },
  watch: {
    safetyEducationForm(newV,) {
      console.log(newV, newV.corporationId)
    },
  },
};
</script>

<style lang='less' scoped>
.scal_tDiv {
  ::v-deep.ant-select-selection {
    background: none !important;
    color: #595959 !important;
    border: #fff 1px solid !important;
    .ant-select-arrow {
      display: none !important;
    }
  }
}
.hide_img {
  width: 150px;
  padding-right: 15px;
  &:hover {
    cursor: pointer;
  }
}

.changeCommon {
  height: 20px !important; 
}
</style>