<template>
  <div class="sign-box">
    <div id="testEle" class="testInfo"></div>
    <a-button type="primary" class="m-r-15 m-t-10" @click="signUndo">
      撤销
    </a-button>
    <a-button type="primary" class="m-t-10" @click="signRedo">
      重签
    </a-button>
  </div>
</template>

<script>
export default {
  props: [],
  data() {
    return {
      iSign: undefined,
    };
  },
  mounted() {
    this.signInit()
  },
  methods: {
    // 签字初始化
    signInit() {
      this.$nextTick(() => {
        this.iSign = new EleSign({
          ele: null
        });
        this.iSign.init();
        this.iSign.moutedEle(document.getElementById("testEle"))
      })
    },
    // 获取签名生成的base64数据
    getSignBase64(){
      if(JSON.parse(this.iSign.toJson()).data.length) {
        // 完整base64
        let base64Url = this.iSign.toJpeg();
        // 去除前缀
        let base64UrlWithoutPrefix = base64Url.split(',')[1];
        return {base64Url,base64UrlWithoutPrefix}
      }
      return undefined
    },  
    // 签署弹窗-撤销
    signUndo() {
      this.iSign.undo();
    },
    // 签署弹窗-重签
    signRedo() {
      this.iSign.clear();
    },
  },
  watch: {
    
  }
};
</script>

<style lang="less" scoped>
.sign-box{
  
  
}
.testInfo {
  width: 500px !important;
  height: 200px !important;
  box-sizing: content-box;
  border: 2px dashed grey;
  overflow: hidden;
}
</style>
