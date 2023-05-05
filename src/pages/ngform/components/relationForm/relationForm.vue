<template>
  <div id="relationForm" :title="record.options.disabled ? '禁用状态' : ''">
    <div v-if="$route.meta.title != '查看'" :class="{'none-events': record.options.disabled}">
      <div
        class="relation-box"
        @click="chooseRelationData"
        :disabled="!record.options.formMsg.tempId"
        title="请在控件属性中选择关联表单信息"
      >{{models[record.model] ? models[record.model][record.options.formMsg.fieldKey + "_label"] ? models[record.model][record.options.formMsg.fieldKey + "_label"] : models[record.model][record.options.formMsg.fieldKey] : '点击选择关联数据'}}</div>
    </div>
    <!-- 查看-只读状态 -->
    <div v-else>
      <div
        class="relation-box"
        :class="{'color-0067cc cursor-pointer': models[record.model]}"
        @click="toRelationDetail"
      >{{models[record.model] ? models[record.model][record.options.formMsg.fieldKey + "_label"] ? models[record.model][record.options.formMsg.fieldKey + "_label"] : models[record.model][record.options.formMsg.fieldKey] : '暂无数据'}}</div>
    </div>
    <CommonModal title="选择关联数据" :visible="detailVisible" :cancelFn="detailCancle">
      <div>
        <RelationFormList :tempId="record.options.formMsg.tempId" :relationBusinessStatus="record.options.formMsg.relationBusinessStatus" :saveCurrentRow="saveCurrentRow"></RelationFormList>
      </div>
      <template slot="btn">
        <a-button @click="detailCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="detailConfirm">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>
<script>
import RelationFormList from "@/pages/sceneManagement/hiddenDanger/relationFormList.vue";
import { SelectTemplateByNode } from "@/services/api.js";
import { nanoid } from 'nanoid';
import Bus from '@/utils/bus.js';


export default {
  props: {
    record: {// 组件数据
      type: Object,
      required: true
    },
    models: {// 表单数组 
      type: Object,
      required: true
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: true
    },
    preview: {// 是否当前是预览
      type: Boolean,
      default: false
    }
  },
  components: {
    RelationFormList
  },
  data() {
    return {
      detailVisible: false,
      currentRow: {},
      showText: "",
    }
  },
  methods: {
    chooseRelationData() {
      this.detailVisible = true;
    },
    detailCancle() {
      this.detailVisible = false;
      this.currentRow = this.models[this.record.model];
    },
    saveCurrentRow(currentRow) {
      this.currentRow = currentRow;
    },
    detailConfirm() {
      if (this.currentRow) {
        this.models[this.record.model] = this.currentRow;
        this.models[this.record.model + "_label"] = this.models[this.record.model][this.record.options.formMsg.fieldKey + "_label"] ? this.models[this.record.model][this.record.options.formMsg.fieldKey + "_label"] : this.models[this.record.model][this.record.options.formMsg.fieldKey];
        this.detailVisible = false;
      } else {
        this.$antMessage.error("必须选择一条数据");
      }
    },
    toRelationDetail() {
      if (this.models[this.record.model]) {
        SelectTemplateByNode({
          tempId: this.record.options.formMsg.tempId,
          nodeId: this.models[this.record.model].nodeId,
        }).then(res => {
          res.data.templateData = JSON.parse(res.data.templateData);
          Bus.$emit("changeParams", { formData: res.data, dataMsg: this.models[this.record.model], url: this.record.options.formMsg.url, title: "查看" });
        }).catch(err => console.log(err))
      }
    }
  }
}
</script>
<style lang="less" scoped>
.relation-box {
  border: 1px solid #eee;
  text-align: center;
  padding: 5px;
}
/deep/ .ant-modal-mask {
  z-index: 2009;
}
/deep/ .ant-modal-wrap.ant-modal-centered {
  z-index: 2010;
  .ant-modal {
    width: 1000px !important;
  }
}
</style>