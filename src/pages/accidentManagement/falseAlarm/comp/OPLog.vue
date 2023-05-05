<template>
  <div>
    <h3 class="top-title">操作日志</h3>
    <div class="log-body">
      <div class="log-item" v-for="item in data" :key="item.handerTime">
        <h3>虚惊事件审批</h3>
        <div class="mgt-16"><span>操作人：</span> {{item.hander}}</div>
        <div class="mgt-16"><span>操作时间：</span> {{item.handerTime}}</div>
        <div class="mgt-16"><span>备注：</span> {{item.handerExplain}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped lang="less">
.log-body{
  padding: 0 20px;
}
  h3.top-title{
    font-size: 18px;
    color: #333333;
    background:#fff;
    font-weight: 400;
    padding-left: 19px;
    height: 58px;
    line-height: 58px;
  }
  .mgt-16{
    margin-top: 16px;
  }
  .log-item{
    div span{
      font-size: 14px;
      color: #999;
      display: inline-block;
      width:70px;
      margin-right:14px;
    }
    margin-top:33px;
    h3{
      font-size: 16px;
      color: #000;
    }

  }
</style>