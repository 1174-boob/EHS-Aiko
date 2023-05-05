<template>
  <!-- 我的课程考试  -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>我的课程考试</PageTitle>
    <div class="card-container">
      <a-tabs v-model="activeKey" @change="tabChange">
        <a-tab-pane key="1" tab="课程">
          <div>
            <MyCourse v-if="activeKey == 1" />
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="考试">
          <div>
            <MyExam v-if="activeKey == 2" />
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import MyCourse from './myCourse/index.vue'
import MyExam from './myExam/index.vue'
export default {
  components: { MyCourse, MyExam },
  data() {
    return {
      activeKey: '1',
    }
  },
  created() {
    this.setRouterCode("myCourseTest");
    this.activeKey = this.$route.query.activeKey ? this.$route.query.activeKey + '' : '1'
  },
  mounted() {
    // this.initPageFn()
  },
  methods: {
    // tab切换
    tabChange(activeKey) {
      let query = { activeKey };
      this.$router.push({
        path: "/ehsGerneralManage/educationmanagement/myCourseTest",
        query,
      });
      // this.initPageFn
    },
    initPageFn() {
      if (this.activeKey == 1) {
        // this.$refs.MyCourse.initPage()
      } else if (this.activeKey == 2) {
        // this.$refs.MyExam.initPage()
      } else if (this.activeKey == 3) {
        // this.$refs.PpeStock.initPage()
      }
    }
  },
}
</script>

<style lang="less" scoped>
</style>