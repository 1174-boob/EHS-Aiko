<template>
  <CommonModal :title="'办理'" :visible="selNodeUserModelShow" :cancelFn="closeModel">
    <template slot="form">
      <div v-show="nodeName" class="pd-b-16">下一节点：{{ nodeName }}</div>
      <div>
        <div>办理人：</div>
        <a-checkbox-group v-model="staffArr" :options="plainOptions" />
      </div>
    </template>
    <template slot="btn">
      <a-button @click="closeModel">取消</a-button>
      <a-button type="primary" class="m-l-15" :loading="loading" @click="addModleConfirm">发送</a-button>
    </template>
  </CommonModal>
</template>

<script>
import { cloneDeep, isEmpty } from 'lodash'
import cancelLoading from "@/mixin/cancelLoading";
export default {
  mixins: [cancelLoading],
  model: {
    prop: "selNodeUserModelShow",
  },
  props: {
    // 弹窗显示隐藏
    selNodeUserModelShow: {
      type: Boolean,
      default: false,
    },
    // 选择的用户数据
    plainOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      nodeName: '',
      staffArr: [],
    };
  },
  methods: {
    // 确定
    addModleConfirm() {
      if (!this.staffArr.length) {
        this.$antMessage.warning('请选择办理人')
        return
      }
      this.handleLoading();
      this.$parent.submitChemicalIdentSafetyTips(this.staffArr)
        .then(res => {
          this.closeModel()
        })
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 取消-关闭model
    closeModel() {
      this.$emit("input", false);
    },
  },
  watch: {
    selNodeUserModelShow(newVal) {
      if (newVal) {

      } else {
        setTimeout(() => {
          this.staffArr = []
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
