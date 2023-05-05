<template>
  <a-form-model-item label="日期筛选">
    <a-select v-model="formInline.dataType" @change="handleChange" allowClear placeholder="请选择">
      <!-- 1-月度 2-季度 3-半年度 4-年度  5时间段 -->
      <a-select-option key="4">年度</a-select-option>
      <a-select-option key="3">半年度</a-select-option>
      <a-select-option key="2">季度</a-select-option>
      <a-select-option key="1">月度</a-select-option>
      <a-select-option key="5">时间段</a-select-option>
    </a-select>
    <span style="width:10px;display: inline-block;"></span>
    <template title="选择的项">
      <template title="年度" v-if="formInline.dataType==4">
        <el-date-picker key="4" v-model="formInline.reportDate" type="year" value-format="yyyy" placeholder="选择年" :clearable="false"></el-date-picker>
      </template>
      <template title="半年度" v-if="formInline.dataType==3">
        <el-date-picker key="3" v-model="formInline.yearStr" type="year" value-format="yyyy" placeholder="选择年" :clearable="false"></el-date-picker>
        <span style="width:10px;display: inline-block;"></span>
        <a-select v-model="formInline.reportDate" placeholder="请选择">
          <a-select-option key="1">上半年</a-select-option>
          <a-select-option key="2">下半年</a-select-option>
        </a-select>
      </template>
      <template title="季度" v-if="formInline.dataType==2">
        <el-date-picker key="2" v-model="formInline.yearStr" type="year" value-format="yyyy" placeholder="选择年" :clearable="false"></el-date-picker>
        <span style="width:10px;display: inline-block;"></span>
        <a-select v-model="formInline.reportDate" placeholder="请选择">
          <a-select-option key="1">第一季度</a-select-option>
          <a-select-option key="2">第二季度</a-select-option>
          <a-select-option key="3">第三季度</a-select-option>
          <a-select-option key="4">第四季度</a-select-option>
        </a-select>
      </template>
      <template title="月度" v-if="formInline.dataType==1">
        <el-date-picker key="1" v-model="formInline.reportDate" value-format="yyyy-MM" type="month" placeholder="选择月" :clearable="false"></el-date-picker>
      </template>
      <template title="时间段" v-if="formInline.dataType==5">
        <el-date-picker
          key="5"
          v-model="formInline.reportDate"
          popper-class="date-picker-hour"
          style="width:330px"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm"
          valueFormat="yyyy-MM-dd HH:mm"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </template>
    </template>
  </a-form-model-item>
</template>

<script>
export default {
  data() {
    return {
      formInline: {},
    }
  },
  methods: {
    handleChange(e) {
      this.$set(this.formInline, 'reportDate', undefined)
      this.$set(this.formInline, 'yearStr', undefined)
    },
    // 是否全部选择
    hasAll() {
      let isAll = true
      switch (this.formInline.dataType) {
        case '4':
          isAll = Boolean(this.formInline.reportDate)
          break;
        case '3':
          isAll = Boolean(this.formInline.reportDate) && Boolean(this.formInline.dataType) && Boolean(this.formInline.yearStr)
          break;
        case '2':
          isAll = Boolean(this.formInline.reportDate) && Boolean(this.formInline.dataType) && Boolean(this.formInline.yearStr)
          break;
        case '1':
          isAll = Boolean(this.formInline.reportDate)
          break;
        case '5':
          isAll = Boolean(this.formInline.reportDate)
          break;
        default:
      }
      if (!isAll) {
        this.$antMessage.warn('请选择完整的日期筛选条件')
      }
      return isAll
    },
    // 获取当前选择的日期筛选
    getFormInline() {
      let { dataType, reportDate, yearStr } = this.formInline
      let formInline = {}
      switch (dataType) {
        case '4':
          // dateTime：2022
          formInline = { dataType, reportDate }
          break;
        case '3':
          // 半年度：1上半年  2下半年
          formInline = { dataType, reportDate, yearStr }
          break;
        case '2':
          // 季度：1一季度,2二季度,3三季度,4四季度  
          formInline = { dataType, reportDate, yearStr }
          break;
        case '1':
          // dateTime：2022-12
          formInline = { dataType, reportDate }
          break;
        case '5':
          // startTime、endTime
          formInline = { dataType, startTime: reportDate[0], endTime: reportDate[1] }
          break;
        default:
      }
      return formInline
    },
    iRest() {
      this.formInline = {}
    }
  }
}
</script>

<style lang='less' scoped>
</style>