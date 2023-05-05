<template>
  <!-- 表单页面，统一两列，样式固定 -->
  <a-form-model class="form-page" ref="addForm" :model="formPageModal" :rules="formPageRules" :colon="false">
    <a-row :gutter="24" class="flex justify-content-between">
      <a-col :span="12">
        <slot name="left"></slot>
      </a-col>
      <a-col :span="12">
        <slot name="right"></slot>
      </a-col>
    </a-row>
    <a-row :gutter="24" class="flex justify-content-between">
      <a-col :span="24">
        <slot></slot>
      </a-col>
    </a-row>
  </a-form-model>
</template>
<script>
export default {
  props: ["formPageModal", "formPageRules"],
}
</script>