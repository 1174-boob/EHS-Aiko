<template>
<div class="log bg-fc border-radius-3 border-f4 pd-l-20 pd-r-20">
  <div class="bg-fc" v-if="historyList && historyList.length>=1">
    <div class="border-b-e7 pd-t-12 pd-b-12 font-weight-bold border-b-f6 bg-fc">操作日志</div>
    <div class="pd-t-12" v-for="item of historyList" :key="item.historyId">
      <div class="pd-b-18 font-14 font-weight-bold">{{stateKV[item.invitationState]}}</div>
      <div class="border-b-f6">
        <div class="pd-b-12 flex"><span class="color-999">操作人：</span><span class="color-333 flex-1">{{item.handle}}</span></div>
        <div class="pd-b-12 flex"><span class="color-999">操作时间：</span><span class="color-333 flex-1">{{item.handleTime}}</span></div>
        <div class="pd-b-12 flex" v-if="!noRemark"><span class="color-999">备注：</span><span class="color-333 flex-1">{{item.remarks}}</span></div>
      </div>
    </div>
    
  </div>
</div>
</template>
<script>

export default {
  name:'log',
  props:['historyList', 'noRemark'],
  data() {
    return {
      stateKV: {
        '0': "待发送",
        '1': "待处理",
        '2': "待审核",
        '3': "审核通过",
        '4': "审核驳回"
      }
    }
  }
  
}
</script>
<style lang="less" scoped>
.log{
  width: 426px;
  margin-left: 20px;
  div{
    .flex{
      span{
        line-height: 22px;
        &:first-child{
          width: 70px;
        }
      }
    }
  }
}
@media screen and (max-width: 1366px) {
  .log{
    width: 226px;
    .flex{
      span{
        font-size: 12px;
        line-height: 20px!important;
      }
    }
  }
}
@media screen and (min-width: 1367px) and (max-width: 1440px) {
  .log{
    width: 326px;
  }
}
</style>
