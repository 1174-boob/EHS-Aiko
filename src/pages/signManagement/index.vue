<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <a-spin :spinning="pageSpinning" wrapperClassName="a-spin">
      <div class="page-title">
        <h3 class="page-title-content">我的签名</h3>
        <!-- <div style="margin-right: 40px;"></div>
        <a-button type="primary" @click="openSignModal">{{ signUrl ? '更换' : '签署' }}</a-button>
        <div style="margin-right: 15px;"></div>
        <a-button type="primary" @click="rmSign">删除</a-button> -->
      </div>

      <div class="sign-show-container">
        <img v-if="signUrl" :src="signUrl" class="sign-show" alt="签名">
        <a-empty v-else class="sign-empty" description="暂无签名"/>
      </div>
      <div class="page-button">
        <a-button type="primary" :disabled="!sealDataId" @click="rmSign">删除</a-button>
        <div style="margin-right: 15px;"></div>
        <a-button type="primary" @click="openSignModal">{{ signUrl ? '更换' : '签署' }}</a-button>
      </div>
    </a-spin>

    <!-- 绘制签名弹窗 -->
    <SignModal v-model="signModalShow" :sealDataId="sealDataId" @signOnOk="signOnOk" />
  </div>
</template>

<script>
import cancelLoading from '@/mixin/cancelLoading'
import { getSignManagementDataApi,rmSignManagementDataApi } from "@/services/safetyEduArchives"
import SignModal from './components/signModal.vue'
export default {
  components: { SignModal },
  mixins: [cancelLoading],
  data() {
    return {
      pageSpinning: false,
      signModalShow: false,
      userId: undefined,
      signUrl: '',
      sealDataId:undefined,
    }
  },
  created() {
    this.getDataList()
    let zconsole_userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
    this.userId = zconsole_userInfo.user.userId
  },
  methods: {
    getDataList() {
      let params = {
        pageNo: 1, 
        pageSize: 10
      }
      this.pageSpinning = true
      return getSignManagementDataApi(params)
        .then((res) => {
          const {list} = res.data || {list:[]}
          if(Array.isArray(list) && list.length){
            const bs = 'data:image/jpeg;base64,'
            this.signUrl = bs + list[0].sealDataBase64
            this.sealDataId = list[0].sealDataId
          }else{
            this.signUrl = ''
            this.sealDataId = undefined
          }
        })
        .catch(err => { })
        .finally(() => {
          this.pageSpinning = false
        })
    },

    // 批量签署-打开弹窗
    openSignModal() {
      this.signModalShow = true
    },

    // 批量签署-弹窗提交成功
    signOnOk() {
      this.$antMessage.success("绘制成功！");
      this.getDataList()
    },

    // 删除签名
    rmSign(){
      this.$antConfirm({
        title: '确认删除？',
        onOk: async () => {
          let para = {
            sealDataId:this.sealDataId
          }
          await rmSignManagementDataApi(para)
          this.$antMessage.success('删除成功')
          this.getDataList()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page-title {
  display: flex;
  align-items: center;
  padding: 10px 0 30px;

  .page-title-content {
    margin-bottom: 0px;
    line-height: 1;
  }
}

.page-button{
  display: flex;
  align-items: center;
}

.sign-show-container {
  margin-bottom: 25px;
  width: 530px;
  padding: 10px;
  border: 2px dashed grey;
  overflow: hidden;
  .sign-show {
    overflow: hidden;
    width: 100%;
  }
  .sign-empty{
    height: 165px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>