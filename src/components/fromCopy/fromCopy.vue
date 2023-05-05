<template>
  <!-- 返回组件 -->
  <div>
    <a-form-model>
      <!-- 输入框 -->
      <a-form-model-item label="企业名称" placeholder="请输入企业名称" prop="companyName">
        <a-input />
      </a-form-model-item>
      <!-- 下拉框 -->
      <a-form-model-item label="证件类型" placeholder="请选择证件类型" prop="ecertificateType">
        <a-select>
          <a-select-option :value="2">Jack</a-select-option>
        </a-select>
      </a-form-model-item>
      <!-- 单选框 -->
      <a-form-model-item label="您的身份" prop="identityType">
        <a-radio-group>
          <a-radio :value="1">法定代表人</a-radio>
          <a-radio :value="2">被授权人</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <!-- 选择树 -->
      <a-form-model-item ref="parentId" label="上级部门" prop="parentId">
        <a-tree-select style="width: 100%" :dropdown-style="{ maxHeight: '400px', overflow: 'auto',zIndex:9999, }" placeholder="请选择上级部门" :replace-fields="{title:'name',key:'id',value:'id'}"></a-tree-select>
      </a-form-model-item>
      <!-- 时间选择 -->
      <a-form-model-item label="创建时间">
        <a-range-picker separator="至" class="order-search-left-item">
          <a-icon slot="suffixIcon" type="calendar" />
        </a-range-picker>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
export default {

  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {

  },
}
</script>

<style lang="less" scoped>
</style>
