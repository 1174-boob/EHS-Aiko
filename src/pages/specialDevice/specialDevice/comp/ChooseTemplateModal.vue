<!-- -->
<template>
  <CommonModal title="下载导入模板" :visible="visible" :cancelFn="cancelFn">
    <template slot="form">
      <a-button type="primary" class="btn" @click="downloadTemplate(0)">叉车模板下载</a-button>
      <a-button type="primary" class="btn" @click="downloadTemplate(1)">天车模板下载</a-button>
      <a-button type="primary" class="btn" @click="downloadTemplate(2)">电梯模板下载</a-button>
      <a-button type="primary" class="btn" @click="downloadTemplate(3)">压力管道模板下载</a-button>
      <a-button type="primary" class="btn" @click="downloadTemplate(4)">压力容器模板下载</a-button>
    </template>
    <template slot="btn">
      <a-button @click="cancelFn">取消</a-button>
    </template>
  </CommonModal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
    }
  },
  methods: {
    cancelFn: function() {
      this.$emit('update:visible', false)
    },
    downloadTemplate(num) {
      switch(num) {
        case 0:
          window.open(`${process.env.VUE_APP_API_BASE_URL}/file/template/叉车导入模板.xlsx`)
          break
        case 1:
          window.open(`${process.env.VUE_APP_API_BASE_URL}/file/template/天车导入模板.xlsx`)
          break
        case 2:
          window.open(`${process.env.VUE_APP_API_BASE_URL}/file/template/电梯导入模板.xlsx`)
          break
        case 3:
          window.open(`${process.env.VUE_APP_API_BASE_URL}/file/template/压力管道导入模板.xlsx`)
          break
        case 4:
          window.open(`${process.env.VUE_APP_API_BASE_URL}/file/template/压力容器导入模板.xlsx`)
          break
      }
    }
  }
}
</script>

<style scoped lang="less">
.btn{
  margin-left:15px;
  margin-top:10px;
}
</style>