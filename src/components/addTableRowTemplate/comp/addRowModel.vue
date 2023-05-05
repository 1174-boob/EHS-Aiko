<template>
  <CommonModal :title="'新增'" :visible="realTableDataModelshow" :cancelFn="closeModel">
    <template slot="form">
      <a-form-model ref="iFrom" :model="iFrom" :rules="addModleFormRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" :colon="false" labelAlign="left">
        <a-form-model-item class="flex" label="报警时间" prop="alarmTime">
          <a-date-picker style="width:100%;" valueFormat="YYYY-MM-DD hh:mm:ss" v-model="iFrom.alarmTime" show-time placeholder="请选择报警时间" />
        </a-form-model-item>
        <a-form-model-item class="flex" label="系统" prop="sysCode">
          <a-input v-model="iFrom.sysCode" :maxLength="500" placeholder="请输入系统" />
        </a-form-model-item>
        <a-form-model-item class="flex" label="报警描述" prop="alarmDesc">
          <a-textarea v-model="iFrom.alarmDesc" :maxLength="500" placeholder="请输入报警描述" />
        </a-form-model-item>
        <a-form-model-item class="flex" label="责任部门" prop="deptId">
          <a-input v-model="iFrom.deptId" :maxLength="100" placeholder="请输入责任部门" />
        </a-form-model-item>
        <a-form-model-item class="flex" label="原因分析" prop="reason">
          <a-textarea v-model="iFrom.reason" :maxLength="500" placeholder="请输入原因分析" />
        </a-form-model-item>
        <a-form-model-item class="flex" label="整改措施" prop="measure">
          <a-textarea v-model="iFrom.measure" :maxLength="500" placeholder="请输入整改措施" />
        </a-form-model-item>
        <a-form-model-item class="flex" label="举一反三排查" prop="theLines">
          <a-textarea v-model="iFrom.theLines" :maxLength="500" placeholder="请输入举一反三排查" />
        </a-form-model-item>
      </a-form-model>
    </template>
    <template slot="btn">
      <a-button @click="closeModel">取消</a-button>
      <a-button type="primary" class="m-l-15" @click="addModleConfirm">确定</a-button>
    </template>
  </CommonModal>
</template>

<script>
import { formValidator } from "@/utils/clx-form-validator.js";
import { cloneDeep, isEmpty } from 'lodash'
export default {
  model: {
    prop: "realTableDataModelshow",
  },
  props: {
    // 弹窗显示隐藏
    realTableDataModelshow: {
      type: Boolean,
      default: false,
    },
    // 全部数据
    moduleList: {
      type: Array,
      default: () => [],
    },
    // 修改数据的下标
    editIndex: {
      type: Number,
    }
  },
  data() {
    return {
      spinning: false,
      loading: false,
      iFrom: {},
      // 表单校验
      addModleFormRules: {
        alarmTime: [
          { required: true, message: "报警时间不能为空", trigger: "change" },
        ],
        sysCode: [
          { required: true, message: "系统不能为空", trigger: "blur" },
        ],
        alarmDesc: [
          { required: true, message: "报警描述不能为空", trigger: "blur" },
        ],
        deptId: [
          { required: true, message: "责任部门不能为空", trigger: "blur" },
        ],
        reason: [
          { required: true, message: "原因分析不能为空", trigger: "blur" },
        ],
        measure: [
          { required: true, message: "整改措施不能为空", trigger: "blur" },
        ],
        theLines: [
          { required: true, message: "举一反三排查不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 确定
    addModleConfirm() {
      if (!formValidator.formAll(this, "iFrom")) {
        return;
      }
      let moduleListNew = cloneDeep(this.moduleList)
      if (this.editIndex != -1) {
        // 修改
        moduleListNew.splice(this.editIndex, 1, { ...this.iFrom })
      } else {
        // 新增
        moduleListNew.push(this.iFrom)
      }
      this.$emit('changeModuleList', moduleListNew)
      this.closeModel()
    },
    // 取消-关闭model
    closeModel() {
      this.$emit("input", false);
    },
  },
  watch: {
    realTableDataModelshow(newVal) {
      if (newVal) {
        let editData = this.moduleList.find((item, index) => index == this.editIndex)
        this.iFrom = this.editIndex == -1 ? {} : cloneDeep(editData)
      } else {
        setTimeout(() => {
          this.iFrom = {}
        }, 300);
      }
    }
  }
};
</script>

<style lang='less' scoped>
::v-deep .a-spin {
  .ant-spin-blur {
    opacity: 0.1 !important;
  }
}
#principal-dialog {
  ::v-deep .ant-modal {
    width: 600px !important;
    padding-bottom: 0px !important;
  }
}

.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.model-main {
  min-height: 360px;
  .model-main-qr-img {
    display: block;
    flex: none;
    width: 80%;
    height: auto;
    margin: 0 auto;
    max-width: 620px;
    max-height: 620px;
  }
}
@media screen and (max-width: 1367px) {
  .model-main {
    min-height: 320px;
    .model-main-qr-img {
      width: 70%;
    }
  }
}
</style>
