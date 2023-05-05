<template>
  <!-- 自定义组件的属性配置 -->
  <el-form v-show="selectItem.key" size="mini" :disabled="disabled">
    <template v-if="selectItem.type == 'importFile'">
      <div>
        <el-form-item label="文件格式">
          <el-checkbox-group v-model="selectItem.options.fileLayout">
            <el-checkbox v-for="item in fileLayoutOptions" :label="item.label" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="文件体积限制">
          <el-input type="number" placeholder="请输入" v-model="selectItem.options.maxSize" :style="selectItem.options.style" />M
        </el-form-item>
      </div>
      <div>
        <div>操作属性</div>
        <a-checkbox v-model="selectItem.options.disabled" @change="onChangeDisabled">禁用</a-checkbox>
        <a-checkbox v-model="selectItem.options.hidden" @change="onChangeHide">隐藏</a-checkbox>
      </div>
    </template>
  </el-form>
</template>
<script>
export default {
  props: {
    selectItem: { // 当前选择的组件
      type: Object,
      required: true
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileLayoutOptions: [
        {
          value: '.pdf',
          label: '.pdf'
        }, {
          value: '.doc',
          label: '.doc'
        }, {
          value: '.docx',
          label: '.docx'
        }, {
          value: '.xlsx',
          label: '.xlsx'
        }, {
          value: '.xls',
          label: '.xls'
        }, {
          value: '.ppt',
          label: '.ppt'
        }, {
          value: '.zip',
          label: '.zip'
        }, {
          value: '.rar',
          label: '.rar'
        }
      ],
    }
  },
  methods: {
    onChangeDisabled(e) {
      this.selectItem.options.disabled = e.target.checked;
    },
    onChangeHide(e) {
      this.selectItem.options.hidden = e.target.checked;
    }
  }
}
</script>