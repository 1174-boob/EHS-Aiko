<template>
  <div class="pop-container" ref="markPopRef">
    <a-popover :visible="visible" placement="rightTop" trigger="click" :key="keyCode">
      <template #content>
        <div class="pop-content">
          <a-spin :spinning="spin" wrapperClassName="a-spin">
            <a-form-model :spining="spin" ref="ruleForm" :model="form" :rules="rules" :colon="false">
              <a-row>
                <h3 class="h3-title-pollutant">污染物</h3>
              </a-row>
              <a-row class="pollutant-name-list" v-if="pollutantList.length">
                <div v-for="(item, index) in pollutantList" :key="index"><i :class="item.numberPickInstrumentType"></i>{{item.pollutantName}} <span style="padding-left:10px;"> {{ item.nowValue ? item.nowValue + item.pollutantUnit : ' -- '}}</span></div>
              </a-row>
              <a-row v-else>暂无数据</a-row>
            </a-form-model>
          </a-spin>
        </div>
      </template>
    </a-popover>
  </div>
</template>

<script>
import { monitorInstrumentOptions, monitorRealTimeData } from "@/services/envWatch/markManage"
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
      spin: true,
      pollutantList: [],
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
    // pollutantList() {
    //   let list = this.scyOptions.filter(item => {
    //     return (this.form.numberPickInstrumentCodeList || []).includes(item.numberPickInstrumentId) 
    //   })
    //   list = list.map(item => {
    //     return {
    //       id: item.numberPickInstrumentId,
    //       name: item.pollutant,
    //       type: item.numberPickInstrumentType
    //     }
    //   })
    //   console.log(list, '-------')
    //   return list
    // }
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
      this.getMonitorInstrumentOptions(val)
    },
    async getMonitorInstrumentOptions(val) {
      let para = {
        corporationId: val
      }
      const { data } = await monitorInstrumentOptions(para)
      this.scyOptions = data || []
      let list = this.scyOptions.map(item => {
        if (this.form.numberPickInstrumentCodeList.includes(item.numberPickInstrumentId)) {
          return item.numberPickInstrumentNum
        }
      })
      if (list && list.length) {
        this.featchMonitorRealTimeData(list)
      }
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
      // if (data.numberPickInstrumentCodeList && data.numberPickInstrumentCodeList.length) {
      //   this.featchMonitorRealTimeData(data.numberPickInstrumentCodeList)
      // }
    },
    async featchMonitorRealTimeData(list){
      let para = {
        numberPickInstrumentNumList: list
      }
      this.spin = true
      const {data} = await monitorRealTimeData(para)
      this.spin = false
      this.pollutantList = data || []
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