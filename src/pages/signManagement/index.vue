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
        <a-button type="primary" @click="rmSign">删除</a-button>
        <div style="margin-right: 15px;"></div>
        <a-button type="primary" @click="openSignModal">{{ signUrl ? '更换' : '签署' }}</a-button>
      </div>
    </a-spin>

    <!-- 绘制签名弹窗 -->
    <SignModal v-model="signModalShow" :signTargetData="signTargetData" @signOnOk="signOnOk" />
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
      signTargetData: undefined,
      userId: undefined,
      signUrl: '',
    }
  },
  created() {
    this.init()
    let zconsole_userInfo = JSON.parse(sessionStorage.getItem("zconsole_userInfo"))
    this.userId = zconsole_userInfo.user.userId
  },
  activated() {
    if (this.$route.query.activeKey == 3) {
      this.init()
    }
  },
  methods: {
    async init() {
      this.getDataList()
    },

    getDataList() {
      const bs = 'data:image/jpeg;base64,'
      this.signUrl = bs + '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1VRC26nsFtu9GHiQU9fSx1EfUPJ3S8EZH1XpIg+W12q12O3wWmy22lt9DTN6IaalhbFFE3OcNY0ANGSfIL6kRAREQEREBERAX8554aaGSpqZmRRRNL5JHuDWsaBkkk9gAPVctubuvt/s7pmXVu4upaW0W+PLY/anMtRJjIjijGXSP/BoPbJOACVnxuDvpvxz41PJtLsfp2ssGhhIBcaiZ5YJIs9n10zMtY3Ay2BhcXEH58DpDtuR/NvV25ephsHxIirLlcrjK6iqL9bxmSY+T20bvJjAMl1SSAAC5paAJD33Gbw99FbZupdcbumDV+sX4qfYTD2lBQTHuS1rv4+QH9I/tnu1oI6j7m2unOKvBTTEtBf9wrHDqWeFrrrcKqRslzqyBnpjpo+uWOHI7MaD6dRce6j7cDxUNvqCY23arby9amq3u9nHPXvbRQOeezSxjRJI/vjsQwlBeVeDq7XuiNAW83XXGr7PYKQAkS3Gtjp2u/BvWR1H6AZJ9FQD8tvEt5FjGndPz6CstR+liphaGhp7BwlqC6qd5+cZx648l7+kfC5uF+uH5Qb8b0XC710xzURWoOkkefqaupy53r5xD+lBJG4viY8etIGSl0l9sayrGdgaCmNPTdQ8wZZ+k4/FjHAqE5eR3OblXM637IaFm0fp2f4DX0o6AGHz6rhOGtJHn9y1r/wKt5tzw7447Yexn09tha6quhwRXXVpr5+r9cGbqDD+4GqZWtaxoYxoa1owABgAIKHbb+GFS11f+VPIbcq4akulQ72tTR26Z/RI/wBfa1cuZZc+uGsPbzVw9u9otstpbcbXtxoi1WGFzQ2R1LAPbTAfzkrsySHsO7nErr0QEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREGD2rtx9zd+dwo9RaykuWsLvUSYgt8TZHMDM5EEMUXdkefNseCe5z1HqVptEbGc9ty9N0elbXHFtNouPtHb4n/Y0YBx1l8MIdVyuOBkz5Lj5u8yNEdvtq9udqrS2ybd6MtVhpQ0Nf7pAGyTY8jLKcvld+09xP4rqkFItuPCz2ws0sdx3S1reNWVWeuSmpR7hSuJ8w4guld+8HsJ+itLt7sftDtVCyLb3bux2WRjej3mCla6pePo+d2ZX/wC84ruEQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREH/2Q=='
      return
      let params = {}
      this.pageSpinning = true
      return getSignManagementDataApi(params)
        .then((res) => {
          const bs = 'data:image/jpeg;base64,'
          this.signUrl = bs + res.data
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
      this.signUrl = ''
      return
      this.$antConfirm({
        title: '确认删除？',
        onOk: async () => {
          let para = {
           
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
  width: 400px;
  padding: 10px;
  border: 2px dashed grey;
  .sign-show {
    overflow: hidden;
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