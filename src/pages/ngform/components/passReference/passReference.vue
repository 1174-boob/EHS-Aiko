<template>
  <div id="passReference" :class="{'none-events': record.options.disabled}" :title="record.options.disabled ? '禁用状态' : ''">
      <a-row>
        <a-col :span="12" v-for="(item, ind) in labelList" :key="ind"><span class="text-right" style="width: 70px">{{item}}：</span>{{result[showModel[ind]] ? result[showModel[ind]] : "--"}}</a-col>
      </a-row>
  </div>
</template>
<script>
import { getRemoteInterface } from "@/services/api.js";

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
  created() {
    this.init();
  },
  data () {
    return {
      labelList: [],
      showModel: [],
      result: {},
      relationData: {},
    }
  },
  watch: {
    models: {
      handler(newVal){
        console.log(newVal);
        let num = 0;
        for (let key in this.relationData) {
          if (newVal[key] != this.relationData[key]) {
            this.relationData[key] = newVal[key];
            num++;
          }
        }
        if (num > 0) {
          this.init();
        }
      },
      deep: true
    }
  },
  methods: {
    init() {
      if (this.record.options.interfacePath && this.record.options.parameter && this.record.options.relationLabel) {
        let para = {};
        let showModel = [];
        let labelList = [];
        // 格式就是：传参字段名aaa&数据字段select_1234567890987654&1    
        let arr = this.record.options.parameter.split(",");
        for (let i = 0; i < arr.length; i++) {
          let paraItem = arr[i].split("&");
          if (!paraItem[2]) { // 1就是固定值，不是1就不是固定值，按照关联别的数据字段作为参数处理
            para[paraItem[0]] = this.models[paraItem[1]];
            this.relationData[paraItem[1]] = this.models[paraItem[1]];
          } else {
            console.log(paraItem,paraItem[1])
            para[paraItem[0]] = paraItem[1];
          }
        }
        let brr = this.record.options.relationLabel.split(",");
        for (let i = 0; i < brr.length; i++) {
          let brrItem = brr[i].split("&");
          labelList.push(brrItem[0]);
          showModel.push(brrItem[1]);
        }
        this.labelList = labelList;
        this.showModel = showModel;
        getRemoteInterface(this.record.options.interfacePath, para).then(res => {
          this.result = res.data || {};
        })
      }
    },
  }
}

</script>
<style scoped>
</style>

