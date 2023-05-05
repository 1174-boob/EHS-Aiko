<template>
  <!-- 自定义model 适用于 工单再次提问、服务评价 类型model -->
  <a-modal class="custom-model" centered :visible="serviceModelShow" :footer="null" @cancel="closeServiceModel" :maskClosable="false" :title="false" :closable="false" destroyOnClose>
    <div class="custom-model-body-max-height beauty-scroll">
      <h2 class="custom-model-title">{{headerTitle}}</h2>
      <slot></slot>
    </div>
  </a-modal>
</template>

<script>
export default {
  props: ['serviceModelShow', 'headerTitle'],
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    // 关闭model
    closeServiceModel() {
      this.$emit('closeServiceModel')
    },
  },
}
</script>

<style lang="less">
.custom-model {
  .ant-modal {
    width: 600px !important;
    padding-bottom: 0px;
    .ant-modal-body {
      padding: 60px 0px;
      .ant-form-item-label > label {
        color: #999 !important;
      }
    }
    .custom-model-title {
      font-size: 24px;
      color: #000000;
      text-align: center;
      margin-bottom: 30px;
    }
  }
}
.custom-model-body-max-height {
  max-height: calc(~"100vh - 100px - 55px");
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
