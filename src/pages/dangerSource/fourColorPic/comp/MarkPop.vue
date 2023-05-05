<template>
  <div class="pop-container" ref="markPopRef">
    <a-popover :visible="visible" placement="rightTop" trigger="click" :key="keyCode">
      <template #content>
        <div class="pop-content">
          <a-form-model ref="ruleForm" :model="form" :rules="rules" :colon="false">
            <a-row>
              <h3 class="h3-title">风险点 <span class="color-0067cc cursor-pointer" @click="toRiskDetail">详情</span></h3>
            </a-row>
            <a-row>
                <a-form-model-item label=" " prop="riskPointName" :label-col="labelCol" :wrapper-col="wrapperCol">
                  <a-input :disabled="disabled" @focus="onSelectFocus" @blur="onSelectBlur" v-model="form.riskPointName" placeholder="请选择风险点">
                  </a-input>
                </a-form-model-item>
            </a-row>
            <a-row class="auto-info-body">
              <el-row><span class="label-span">风险分级：</span> <span>{{form.riskLevel | systemFilter('riskLevel')}}</span></el-row>
              <el-row><span class="label-span">管控层级：</span> <span>{{form.controlsLevelId | systemFilter('controlLevel')}}</span></el-row>
              <el-row><span class="label-span">责任部门：</span> <span>{{deptCache[form.responsibilityDeptId]}}</span></el-row>
              <el-row><span class="label-span">责任人：</span> <span>{{form.responsibilityPersonName}}</span></el-row>
            </a-row>
            <a-row>
              <a-form-model-item label=" " prop="note" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-input :disabled="disabled" type="textarea" v-model="form.note" :maxLength="300" placeholder="请输入备注"></a-input>
              </a-form-model-item>
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
    <RiskModal @onSubmitRiskData="onSubmitRiskData" :visible.sync="riskModalVisible" :zIndex="2000"/>
  </div>
</template>

<script>
import RiskModal from './RiskModal'
export default {
  components: { RiskModal },
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
      form: {},
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
  watch: {
    markItem: {
      handler: function(newVal, oldVal) {
        if (this.visible) {
          this.$refs.markPopRef.style.left = newVal.position.x1
          this.$refs.markPopRef.style.top = newVal.position.y
          this.keyCode++
        }
      },
      deep: true
    },
    visible: function(newVal) {
      if (!newVal) {
        this.form = {}
      }
    }
  },
  methods: {
    hide() {
      this.$emit('update:visible', false)
    },
    toRiskDetail() {
      if (!this.form.riskPointId) {
        this.$antMessage.warning('请选择风险点')
        return
      }
      let path = "/safeManage/dualControlManage/riskManage/riskBookShow"
      let query = { riskPointId: this.form.riskPointId }
      this.$router.push({
        path,
        query,
      })
    },
    loadData(data) {
      if (!data.riskPointId) {
        this.form = {}
        return
      }
      this.$set(this.form, 'riskPointName', data.riskPointName)
      this.$set(this.form, 'riskLevel', data.riskLevel)
      this.$set(this.form, 'riskPointId', data.riskPointId)
      this.$set(this.form, 'responsibilityDeptId', data.responsibilityDeptId)
      this.$set(this.form, 'controlsLevelId', data.controlsLevelId)
      this.$set(this.form, 'responsibilityPersonName', data.responsibilityPersonName)
      if (data.note) {
        this.$set(this.form, 'note', data.note)
      }
    },
    onSubmitRiskData(data) {
      this.loadData(data)
    },
    deleteItem() {
      this.$emit('delete')
    },
    onSelectFocus() {
      this.riskModalVisible = true
    },
    popConfirm() {
      if (!this.form.riskPointId) {
        this.$antMessage.warning('请选择风险点')
        return
      }
      this.$emit('popConfirm', { ...this.form })
      this.$emit('update:visible', false)
    },
    onSelectBlur() {
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
.h3-title{
  font-size:14px;
  margin:7px 0 8px;
  span{
    float: right;
  }
}
/deep/.ant-form-item{
  padding-bottom:10px;
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
  padding: 6px 16px;
  background: #FAFAFA;
  border-radius: 4px;
  margin-bottom:10px;
  .el-row{
    display: flex;
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
div.pop-content{
  width:244px;
  margin:0 10px;
}
</style>