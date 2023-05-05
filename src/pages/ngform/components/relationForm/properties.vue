<template>
  <!-- 自定义组件的属性配置 -->
  <el-form v-show="selectItem.key" size="mini" :disabled="disabled">
    <template v-if="selectItem.type == 'relationForm'">
      <div>
        <div>请选择表单关联</div>
        <a-tree-select allow-clear showSearch :filterTreeNode="filterUserTree" v-model="fieldKey" :tree-data="ngformList" :replaceFields="replaceFields" @change="handleChange" placeholder="请选择表单关联"></a-tree-select>
        <div class="color-999">目前“评分”、“提示”、“滑动输入条”、“开关”、“按钮”、“动态表格”、“标签”、“HTML”、“上传图片”、“上传文件”、“关联表单”组件暂时不支持关联字段</div>
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
import { GetSelectFormTree, EhsDetailByForm } from "@/services/api.js";
import dictionary from "@/utils/dictType.js";


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
      page: {
        pageNo: 1,
        pageSize: 10
      },
      ngformList: [],
      fieldKey: "", //
      replaceFields: { children: 'customTableList', title: 'title', key: 'key', value: 'key' },
    }
  },

  async created() {
    let result = await GetSelectFormTree();
    let list = result.data;
    for (let i = 0; i < list.length; i++) {
      list[i].title = list[i].tempName;
      list[i].key = list[i].tempId;
      list[i].value = list[i].tempId;
      list[i].selectable = false;
      if (list[i].customTableList.length > 0) {
        let arr = [];
        for (let j = 0; j < list[i].customTableList.length; j++) {
          list[i].customTableList[j].title = list[i].customTableList[j].comment;
          list[i].customTableList[j].key = list[i].tempId + "/" + list[i].customTableList[j].createTableFiledName;
          list[i].customTableList[j].value = list[i].tempId + "/" + list[i].customTableList[j].createTableFiledName;
          if (list[i].customTableList[j].comment.slice("-3") != "_标题") {
            arr.push(list[i].customTableList[j]);
          }
        }
        list[i].customTableList = arr;
      }
    }
    this.ngformList = list;
    if (this.selectItem.options.formMsg) {
      this.fieldKey = this.selectItem.options.formMsg.tempId + "/" + this.selectItem.options.formMsg.fieldKey;
    }
  },
  methods: {
    filterUserTree(inputValue, treeNode) {
      return treeNode.data.props.title.includes(inputValue);
    },
    handleChange(value) {
      this.selectItem.options.formMsg.fieldKey = value.substr(value.indexOf("/") + 1);
      this.selectItem.options.formMsg.tempId = value.substr(0, value.indexOf("/"));
      for (let i = 0; i < this.ngformList.length; i++) {
        if (this.ngformList[i].tempId == this.selectItem.options.formMsg.tempId) {
          this.selectItem.options.formMsg.url = this.ngformList[i].url;
        }
      }
      EhsDetailByForm({
        tempId: this.selectItem.options.formMsg.tempId
      }).then(res => {
        let dictType = res.data.nodeList[0].dictForm.dictType;
        let dictItem = dictionary(dictType);
        dictItem.push({
          dictValue: "_SYSTEM_CLOSED_",
          dictLabel: "结束"
        })
        this.selectItem.options.formMsg.relationBusinessStatus = dictItem;
      })
    },
    filterOption(inputValue, option) {
      return option.data.key.includes(inputValue)
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