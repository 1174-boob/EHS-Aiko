<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <div>
      <a-radio-group style="margin-bottom: 15px; margin-top: 15px;" @change="onChange" default-value="a" size="large" button-style="solid">
        <a-radio-button value="a">汇总</a-radio-button>
        <a-radio-button value="b">职业危害告知书</a-radio-button>
        <a-radio-button value="c">安全责任书</a-radio-button>
        <a-radio-button value="d">三级安全教育</a-radio-button>
        <a-radio-button value="e">培训数据</a-radio-button>
        <a-radio-button value="f">证书</a-radio-button>
      </a-radio-group>
    </div>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" deptLabel="所属部门"></CommonSearchItem>
        <a-form-model-item label="有效期限">
          <a-range-picker format="YYYY-MM-DD" v-model="formInline.validityPeriod" :placeholder="['开始日期','结束日期']"/>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>


  </div>
</template>

<script>
import { securityCertificate,hazardNotification,responsibilityStatement } from "@/services/api.js"
import moment from 'moment'
import { debounce, cloneDeep } from 'lodash'
export default {
  components: { },
  mixins: [],
  data() {
    return {
      tabValue:'',
      formInline: {
        validityPeriodStart: undefined,
        validityPeriodEnd: undefined,
        validityPeriod: []
      },
    }
  },
  created() {
    // this.getDataList()

  },
  methods: {
    // 切换tab展示
    onChange(e) {
      this.tabValue = e
      console.log(`checked = ${e.target.value}`);
    },
    iSearch(){
      this.getDataList()
    },
    // 重置
    iRest: debounce(function () {
      this.$refs.commonSearchItem.reset()
      this.formInline = {
        validityPeriod: []
      }
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    getDataList(){
      let validityPeriodStart = this.formInline.validityPeriod[0] ? moment(this.formInline.validityPeriod[0]).format('YYYY-MM-DD') : ''
      let validityPeriodEnd = this.formInline.validityPeriod[1] ? moment(this.formInline.validityPeriod[1]).format('YYYY-MM-DD') : ''
      let params = {
        ...this.formInline,
        startTime: validityPeriodStart,
        endTime: validityPeriodEnd,
      }
      console.log('paramssss',params);
      hazardNotification(params).then((res)=>{
        console.log('ressss',res.data);
      })
    },
    
  }
}
</script>

<style lang="less" scoped>


</style>