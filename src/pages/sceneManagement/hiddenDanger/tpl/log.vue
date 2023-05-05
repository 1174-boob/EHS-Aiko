<template>
  <div class="log bg-fc border-radius-3 border-f4">
    <div class="log-wrapper bg-fc">
      <h3 class="border-b-e7 border-b-f6 bg-fff pd-l-20 pd-r-20 font-18 color-333">操作日志</h3>
      <div class="item-wrapper pd-l-20 pd-r-20">
        
          <div class="log-item" v-for="(item, ind) in 5" :key="ind">
            <div class="pd-b-18 font-16 font-weight-bold">核实退回</div>
            <div class="border-b-f6">
              <div class="pd-b-16 flex"><span class="width-70 color-999">退回人：</span><span class="color-333 flex-1">AAA/10313136</span></div>
              <div class="pd-b-16 flex"><span class="width-70 color-999">退回时间：</span><span class="color-333 flex-1">2021/04/27  16 : 00 : 00</span></div>
              <div class="pd-b-16 flex"><span class="width-70 color-999 ">退回原因：</span><span class="color-333 flex-1 text-ellipsis">隐患位置描述错误，请重新填写隐患位置描述错误，请重新填写隐患位置描述错误，请重新填写隐患位置描述错误，请重新填写</span></div>
            </div>
          </div>
        
        <!-- <div class="log-item">
          <div class="pd-b-18 font-16 font-weight-bold">核实退回</div>
          <div class="border-b-f6">
            <div class="pd-b-16 flex"><span class="width-70 color-999">退回人：</span><span class="color-333 flex-1">AAA/10313136</span></div>
            <div class="pd-b-16 flex"><span class="width-70 color-999">退回时间：</span><span class="color-333 flex-1">2021/04/27  16 : 00 : 00</span></div>
            <div class="pd-b-16 flex"><span class="width-70 color-999">退回原因：</span><span class="color-333 flex-1">隐患位置描述错误，请重新填写</span></div>
          </div>
        </div>
        <div class="log-item">
          <div class="pd-b-18 font-16 font-weight-bold">核实退回</div>
          <div class="border-b-f6">
            <div class="pd-b-16 flex"><span class="width-70 color-999">退回人：</span><span class="color-333 flex-1">AAA/10313136</span></div>
            <div class="pd-b-16 flex"><span class="width-70 color-999">退回时间：</span><span class="color-333 flex-1">2021/04/27  16 : 00 : 00</span></div>
            <div class="pd-b-16 flex"><span class="width-70 color-999">退回原因：</span><span class="color-333 flex-1">隐患位置描述错误，请重新填写</span></div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
  </template>
  <script>
  
  export default {
  
  }
  </script>
  <style lang="less" scoped>
  .log{
    width: 426px;
    overflow: hidden;
    height: 100%;
    margin-left: 20px;
    h3{
      height: 58px;
      line-height: 58px;
    }
    .log-wrapper{
      height: 100%;
      overflow: hidden;
      .item-wrapper{
        height: calc(100% - 78px);
        overflow: auto;
          .log-item{
            margin-top: 30px;
          } 
      }
    }
    
  }
  .width-70{
    width: 70px;
  }
  .text-ellipsis{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: 20px;
  }
  @media screen and (max-width: 1366px) {
    .log{
      width: 226px;
    }
  }
  @media screen and (min-width: 1367px) and (max-width: 1440px) {
    .log{
      width: 326px;
    }
  }
  </style>
  