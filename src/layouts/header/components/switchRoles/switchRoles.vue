<template>
  <!-- 角色切换 -->
  <a-modal centered title="角色切换" :visible="switchRolesShow" :footer="null" :width="'33%'" class="switch-roles clx-model" @cancel="cancel" :maskClosable="false">
    <div class="mask-roles">
      <a-icon :style="{color: '#FAAD14', marginRight: '0.1rem'}" type="exclamation-circle" />
      <span :style="{color: '#1F8EFA' }">注：切换角色后，将以角色的身份访问BOE工业互联网平台的资源</span>
      <div style="margin-top:0.35rem">
        <a-button
          v-for="(item,index) in companyList"
          :key="index"
          :class="item.type == 3 ? 'personalLogin' : ''"
          :style="{width: '100%'}"
          @click="handlSelectOrg(item)"
        >{{item.type == 0? item.companyName + '(管理员)': item.type == 1? item.companyName + '(二级管理员)': item.type === 3? '个人登录': item.companyName + '(用户)'}}</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { getCompany } from '@/services/api'
export default {
  props: ['switchRolesShow'],
  data() {
    return {
      // 公司列表
      companyList: []
    }
  },
  methods: {
    cancel() {
      this.$emit('switchRolesShowFn')
    },
    // 获取公司列表
    getCompanyFn() {
      getCompany()
        .then(res => {
          this.companyList = res.data.data
        })
        .catch(err => { })
    },
    // 选择公司
    handlSelectOrg(item) {
      this.$antMessage.info('此功能暂未开通');
      return
      // let { companyId, type } = item
      // let userId = null
      // let getData = { companyId, type, userId }
      // getMessage(getData)
      //   .then(res => {

      //   })
    }
  },
  watch: {
    switchRolesShow(newVal) {
      if (newVal) {
        this.getCompanyFn()
      }
    }
  }
}
</script>

<style lang="less">
.switch-roles {
  .mask-roles {
    width: 100%;
    .roles-imgs {
      margin: 0.2rem 0 0.35rem 0;
      margin-bottom: 0.35rem;
      display: flex;
    }
  }
  .personalLogin {
    background: transparent !important;
    border: 1px solid #1f8efa;
    color: #1f8efa !important;
  }
}
</style>
