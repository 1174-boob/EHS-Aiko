<template>
  <div class="pop-container" ref="markPopRef">
    <a-popover :visible="visible" placement="rightTop" trigger="click" :key="keyCode">
      <template #content>
        <div class="pop-content">
          <a-form-model ref="ruleForm" :model="form" :rules="rules" :colon="false">
            <a-row>
              <h3 class="h3-title">点位名称</h3>
            </a-row>
            <a-row>
                <a-form-model-item label=" " prop="pointItemName" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-input :disabled="disabled" v-model="form.pointItemName" placeholder="请输入点名称" :maxLength="30">
                  </a-input>
                </a-form-model-item>
            </a-row>
            <a-row>
              <h3 class="h3-title">所属组织 </h3>
            </a-row>
            <a-row>
              <CommonSearchItem class="org-item" @corporationChange="corporationChange" :disabled="disabled" :CommonFormInline="form" :rules="rules" :notTablePage="true"></CommonSearchItem>
            </a-row>
            <a-row>
              <h3 class="h3-title mg-0">数采仪编号 <i class="color-0067cc red-font">（ 支持多选 ）</i></h3>
            </a-row>
            <a-row>
              <a-form-model-item label=" " prop="numberPickInstrumentCodeList" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-select :disabled="!form.corporationId" v-model="form.numberPickInstrumentCodeList" mode="multiple" placeholder="请选择数采仪编号" option-filter-prop="children" show-search :filter-option="filterOption">
                  <a-select-option v-for="item in scyOptions" :key="item.numberPickInstrumentId" :value="item.numberPickInstrumentId">{{item.numberPickInstrumentNum}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-row>
            <a-row>
              <a-form-model-item label=" " prop="remark" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input :disabled="disabled" type="textarea" v-model="form.remark" :maxLength="300" placeholder="请输入备注"></a-input>
              </a-form-model-item>
            </a-row>
            <a-row v-if="pollutantList.length">
              <h3 class="h3-title-pollutant">污染物在线</h3>
            </a-row>
            <a-row class="pollutant-name-list" v-if="pollutantList.length">
              <div v-for="item in pollutantList" :key="item.id"><i :class="item.type"></i>{{item.name}}</div>
            </a-row>
            <a-row class="btn-container" v-if="!disabled">
              <a-button @click="hide">取消</a-button>
              <a-button @click="deleteItem">删除</a-button>
              <a-button @click="popConfirm" class="confirm-btn" type="primary">确定</a-button>
            </a-row>
          </a-form-model>
        </div>
      </template>
    </a-popover>
  </div>
</template>

<script>
import { monitorInstrumentOptions } from "@/services/envWatch/markManage"
import isValid from 'date-fns/isValid/index'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    markItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      keyCode: 0,
      riskModalVisible: false,
      labelCol: { span:1 }, // 设置左边label宽度
      wrapperCol: { span: 24 }, // 设置右边表单宽度
      form: {
        numberPickInstrumentCodeList: []
      },
      scyOptions: [],
      extraInfo: {

      },
      rules: {
        riskPoint: [
          { required: true, message: '请选择风险点', trigger: 'change'}
        ]
      }
    }
  },
  created(){
  },
  computed: {
    pollutantList() {
      let list = this.scyOptions.filter(item => {
        return (this.form.numberPickInstrumentCodeList || []).includes(item.numberPickInstrumentId) 
      })
      list = list.map(item => {
        return {
          id: item.numberPickInstrumentId,
          name: item.pollutant,
          type: item.numberPickInstrumentType
        }
      })
      return list
    }
  },
  watch: {
    markItem: {
      handler: function(newVal, oldVal) {
        if (this.visible) {
          this.$refs.markPopRef.style.left = newVal.position.x1
          this.$refs.markPopRef.style.top = newVal.position.y
          // this.keyCode++
        }
      },
      deep: true
    },
    visible: function(newVal) {
      if (!newVal) {
        this.form = {
          numberPickInstrumentCodeList: []
        }
      }
    }
  },
  methods: {
    hide() {
      this.$emit('update:visible', false)
    },
    toRiskDetail() {
      let path = "/environmentManage/environmental/bitmapManage"
      this.$router.push({
        path
      })
    },
    corporationChange(val) {
      console.log(val, 'val - - - -')
      this.getMonitorInstrumentOptions(val)
    },
    async getMonitorInstrumentOptions(val) {
      let para = {
        corporationId: val
      }
      const { data } = await monitorInstrumentOptions(para)
      this.scyOptions = data || []
      console.log(data, '----data -- -')
    },
    loadData(data) {
      // if (!data.pointItemId) {
      //   this.form = {}
      //   return
      // }
      this.$set(this.form, 'remark', data.remark)
      this.$set(this.form, 'corporationId', data.corporationId)
      this.$set(this.form, 'corporationName', data.corporationName)
      this.$set(this.form, 'pointItemName', data.pointItemName)
      this.$set(this.form, 'numberPickInstrumentCodeList', data.numberPickInstrumentCodeList)
      this.corporationChange(data.corporationId)
    },
    deleteItem() {
      this.$emit('delete')
    },
    validate() {
      if (!this.form.pointItemName) {
        this.$antMessage.warn('请输入点位名称')
        return false
      }
      if (!this.form.corporationId) {
        this.$antMessage.warn('请选择所属组织')
        return false
      }
      if (!this.form.numberPickInstrumentCodeList || this.form.numberPickInstrumentCodeList.length < 1) {
        this.$antMessage.warn('请选择数采仪编号')
        return false
      }
      return true
    },
    popConfirm() {
      if (!this.validate()) {
        return
      }
      this.$emit('popConfirm', { ...this.form })
      this.$emit('update:visible', false)
    },
    onSelectBlur() {
    },
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    }
  }
}
</script>

<style scoped lang="less">
.pop-container{
  position: absolute;
  top:0;
  left:0;
  height: 300px;
  overflow: hidden;
}
.h3-title-pollutant{
  font-size:14px;
  margin:2px 0 3px;
}
.pollutant-name-list{
  div{
    display: flex;
    align-items: center;
    margin-top:2px;
    background: #f8f8f8;
    font-size:13px;
  }
  i{
    flex-basis: 20px;
    height: 20px;
    &.gas{
      background: url(~@/assets/images/gas.svg) center center;
      background-size: 100% 100%;
    }
    &.water{
      background: url(~@/assets/images/water.svg) center center;
      background-size: 100% 100%;
    }
  }
}
.h3-title{
  font-size:14px;
  margin:7px 0 8px;
  &:before{
    content: '*';
    color: #f00;
  }
  span{
    float: right;
    &.red-font{
      float: left;
    }
  }
}
/deep/.ant-form-item{
  padding-bottom:2px;
  position:relative;
}
/deep/.ant-popover{
  z-index:999;
}
/deep/.ant-form-item-label{
  position:absolute;
  left:-10px;
}
.auto-info-body{
  width: 244px;
  padding: 10px 16px;
  background: #FAFAFA;
  border-radius: 4px;
  margin-bottom:20px;
  .el-row{
    display: flex;
    margin-bottom:10px;
    span:first-child{
      color: #999;
      display:inline-block;
      flex-basis:70px;
      text-align: right;
      white-space: nowrap;
    }
  }
}
.btn-container{
  text-align:center;
  padding-bottom:10px;
  padding-top:10px;
  /deep/.ant-btn{
    height: 24px;
    padding: 0 10px;
    & +.ant-btn{
      margin-left: 8px;
    }
  }
}
.red-font{
  color: #f00;
  font-weight: 400;
}
.org-item{
  /deep/.ant-form-item-label{
    width: 0;
  }
  /deep/.ant-form-item-control-wrapper{
    width: 100%;
  }
}
.mg-0{
  margin-top:0;
  margin-bottom: 5px;
}
div.pop-content{
  width:244px;
  margin:0 10px;
}
</style>