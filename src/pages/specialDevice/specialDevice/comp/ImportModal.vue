<!-- -->
<template>
  <CommonModal title="批量导入" :visible="visible" :cancelFn="cancelFn">
    <template slot="form">
      <UploadBtnStyle
        :action="action0"
        :showAcceptText="false"
        :accept="['.xlsx', '.xls',]"
        :showUploadList="false"
        :btnText="'叉车批量导入'"
        :btnType="'primary'"
        :btnIcon="false"
        @handleSuccess="handleSuccess"
      ></UploadBtnStyle>
      <UploadBtnStyle
        :action="action1"
        :showAcceptText="false"
        :accept="['.xlsx', '.xls',]"
        :showUploadList="false"
        :btnText="'天车批量导入'"
        :btnType="'primary'"
        :btnIcon="false"
        @handleSuccess="handleSuccess"
      ></UploadBtnStyle>
      <UploadBtnStyle
        :action="action2"
        :showAcceptText="false"
        :accept="['.xlsx', '.xls',]"
        :showUploadList="false"
        :btnText="'电梯批量导入'"
        :btnType="'primary'"
        :btnIcon="false"
        @handleSuccess="handleSuccess"
      ></UploadBtnStyle>
      <UploadBtnStyle
        :action="action3"
        :showAcceptText="false"
        :accept="['.xlsx', '.xls',]"
        :showUploadList="false"
        :btnText="'压力管道批量导入'"
        :btnType="'primary'"
        :btnIcon="false"
        @handleSuccess="handleSuccess"
      ></UploadBtnStyle>
      <UploadBtnStyle
        :action="action4"
        :showAcceptText="false"
        :accept="['.xlsx', '.xls',]"
        :showUploadList="false"
        :btnText="'压力容器批量导入'"
        :btnType="'primary'"
        :btnIcon="false"
        @handleSuccess="handleSuccess"
      ></UploadBtnStyle>
    </template>
    <template slot="btn">
      <a-button @click="cancelFn">取消</a-button>
    </template>
  </CommonModal>
</template>

<script>
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue"
import serviceNameList from '@/config/default/service.config.js'
export default {
  components: { UploadBtnStyle },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      action0: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.danger}/api/ehs/danger/sepicalEquipmentExcel/importEquipment?equipmentType=0`,
      action1: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.danger}/api/ehs/danger/sepicalEquipmentExcel/importEquipment?equipmentType=1`,
      action2: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.danger}/api/ehs/danger/sepicalEquipmentExcel/importEquipment?equipmentType=2`,
      action3: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.danger}/api/ehs/danger/sepicalEquipmentExcel/importEquipment?equipmentType=3`,
      action4: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.danger}/api/ehs/danger/sepicalEquipmentExcel/importEquipment?equipmentType=4`,
    }
  },
  methods: {
    cancelFn: function() {
      this.$emit('update:visible', false)
    },
    handleSuccess() {
      this.$emit('successCallback')
      this.cancelFn()
    },
    downloadTemplate(num) {
      switch(num) {
        case 0:
          window.open(window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/叉车导入模板.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/叉车导入模板.xlsx`)
          break
        case 1:
          window.open(window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/天车导入模板.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/天车导入模板.xlsx`)
          break
        case 2:
          window.open(window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/电梯导入模板.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/电梯导入模板.xlsx`)
          break
        case 3:
          window.open(window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/压力管道导入模板.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/压力管道导入模板.xlsx`)
          break
        case 4:
          window.open(window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/压力容器导入模板.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/压力容器导入模板.xlsx`)
          break
      }
    }
  }
}
</script>

<style scoped lang="less">
/deep/.upload-btn{
  margin-left: 15px;
  margin-top:10px;
}
</style>