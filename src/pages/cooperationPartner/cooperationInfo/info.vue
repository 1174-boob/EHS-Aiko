<template>
  <div class="info-detail">
    <a-row v-if="partnerInfo">
        <a-col :span="12">
          <p class="pd-b-16 m-b-0">供应商名称: {{partnerInfo.companyName}}</p>
          <p class="pd-b-16 m-b-0">所属部门: {{partnerInfo.departmentName}}</p>
          <p class="pd-b-16 m-b-0">备注: {{partnerInfo.remarks}}</p>
        </a-col>
        <a-col :span="12">
          <p class="pd-b-16 m-b-0">供应商简称: {{partnerInfo.companyAbbreviation}}</p>
          <p class="pd-b-16 m-b-0">所属担当: {{partnerInfo.toBearName ? partnerInfo.toBearName : partnerInfo.toBear}}</p>
        </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name:'info',
  props:['partnerInfo'],
  // data() {
  //   return {
  //     toBearName:''
  //   }
  // },
  // watch: {
  //   partnerInfo: {
  //     handler(newV) {
  //       if(newV && newV.toBear) {
  //         let toBear = newV.toBear;
  //         this.getUserAndJobNumber([toBear]).then(res=>{ //全局方法
  //           const obj = res[toBear];
  //           this.toBearName = obj.name + '/' + obj.workNum
  //         }).catch(err=>{
  //           console.log(err);
  //         })
  //       }
  //     },
  //     immediate: true,
  //     deep: true
  //   }
  // },
  create() {
    if (!this.partnerInfo.toBearName) {
      this.getUserAndJobNumber([toBear]).then(res=>{ //全局方法
        const obj = res[toBear];
        this.partnerInfo.toBearName = obj.name + '/' + obj.workNum
      }).catch(err=>{
        console.log(err);
      })
    }
  },
  methods: {

  },

}
</script>

<style lang='less' scoped>
.info-detail {
  width: 100%;
  
}

</style>