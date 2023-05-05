<template>
  <!-- 自定义组件的属性配置 -->
  <el-form v-show="selectItem.key" size="mini" :disabled="disabled">
    <!-- TCustom   start-->
    <template v-if="selectItem.type == 'fixedValue'">
      <div>
        <div>动态获取固定值的数据</div>
        <el-form-item label="接口地址">
          <el-input placeholder="请输入接口地址" v-model.trim="selectItem.options.remoteFunc" @blur="GetList" />
        </el-form-item>
        <el-form-item label="数据路径">
          <el-input placeholder="请输入数据路径" v-model.trim="selectItem.options.dataPath" />
        </el-form-item>
        <!-- <el-form-item label="键名">
            <el-input placeholder="请输入键名" v-model.trim="selectItem.options.remoteLabel" />
          </el-form-item>
          <el-form-item label="键值">
            <el-input placeholder="请输入键值" disabled v-model.trim="selectItem.options.result[selectItem.options.remoteLabel]" />
        </el-form-item>-->
      </div>
      <div>
        <div>操作属性</div>
        <a-checkbox v-model="selectItem.options.disabled" @change="onChangeDisabled">禁用</a-checkbox>
        <a-checkbox v-model="selectItem.options.hidden" @change="onChangeHide">隐藏</a-checkbox>
      </div>
    </template>
    <!-- TCustom  end -->
  </el-form>
</template>
<script>
import {
  GetList
} from "@/services/api";
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

    }
  },
  methods: {
    GetList() {
      GetList({ url: this.selectItem.options.remoteFunc }).then((res) => {
        this.selectItem.options.result = res;
      })
    },
    onChangeDisabled(e) {
      this.selectItem.options.disabled = e.target.checked;
    },
    onChangeHide(e) {
      this.selectItem.options.hidden = e.target.checked;
    }
  }
}
</script>