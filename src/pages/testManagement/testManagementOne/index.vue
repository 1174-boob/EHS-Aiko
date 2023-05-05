<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll">
    <!-- 步骤条 -->
    <div class="steps">
      <span :class="{ 'active': stepActive>=1 }">1 设置考试信息</span>
      <span :class="{ 'active': stepActive>=2 }">2 选择试卷</span>
      <span :class="{ 'active': stepActive>=3 }">3 发布</span>
    </div>
    <component :is="currentComponent" @jumpPage='jumpPage' :examData="examData"></component>
  </div>
</template>
<script>
import ExamPaper from "./examPaper.vue";
import ExamInformation from "./examInformation.vue";
import ExamPublish from "./examPublish.vue"
import { TestInsert, TestDetail, TestUpdate } from "@/services/questionmodel.js";
export default {
  components: { ExamPaper,ExamInformation },
  data() {
    return {
      currentComponent: ExamInformation,
      stepActive: 1,
      examData: {},
    };
  },
  beforeRouteEnter (to, from, next) {
    if(from.path == '/') {
      next(vm => {
        vm.setRouterCode("testManagement");
        vm.$router.replace('/ehsGerneralManage/educationmanagement/testManagement')
      })
    } else if(from.path =="/ehsGerneralManage/educationmanagement/examinationAOCOne" ||from.path=='/educationmanagement/examinationAOCTwo'){
      const data = JSON.parse(sessionStorage.getItem('savEexamData'));
      next(vm=>{
        vm.setRouterCode("testManagement");
        vm.jumpPage({data,page:2});
        sessionStorage.removeItem("savEexamData");
        sessionStorage.removeItem("examPathFrom");
      })
    } else if (to.query.testId) {
      next(vm => {
        vm.setRouterCode("testManagement");
        vm.getTestDetail(to.query.testId);
      })
    }
    next(vm=>{
      vm.setRouterCode("testManagement");
    })
  },
  methods: {
    // 获取考试详情
    getTestDetail(testId) {
      TestDetail({testId}).then(res=>{
        console.log(res);
        this.examData = res.data;
      }).catch(err=>{
        console.log(err);
      })
    },
    // 页面跳转-下一步上一步
    jumpPage(value) {
      this.examData = Object.assign(this.examData,value.data)
      console.log("新数据为====",this.examData );
      if(typeof value.page == 'number') {
        this.stepActive = value.page;
        if(this.stepActive==1) {
          this.currentComponent = ExamInformation;
        } else if(this.stepActive==2) {
          this.currentComponent = ExamPaper;
        } else if(this.stepActive==3) {
          this.currentComponent = ExamPublish;
        }
      } else {
        const params = {
          ...this.examData,
        }
        if(this.examData.testId) {
          // 更新
          TestUpdate(params).then(res=>{
            if(res.code==20000) {
              this.$antMessage.success("发布成功");
              this.$router.replace('/ehsGerneralManage/educationmanagement/testManagement')
            }
          }).catch(err=>{
            console.log(err);
          })
        } else {
          // 新增
          TestInsert(params).then(res=>{
            if(res.code==20000) {
              this.$antMessage.success("发布成功");
              this.$router.replace('/ehsGerneralManage/educationmanagement/testManagement')
            }
          }).catch(err=>{
            console.log(err);
          })
        }
      }
    },
  }
};
</script>

<style lang="less" scoped>
// 步骤条
.steps {
  color: #2c3e50;
  box-sizing: border-box;
  display: flex;
  margin: 20px 0 30px 0;
  & > span {
    width: 25%;
    height: 42px;
    line-height: 42px;
    padding-left: 30px;
    margin-right: 20px;
    background: #eef2ff;
    position: relative;
    // font-weight: 600;
    color: #999;
    &:before {
      content: "";
      width: 0;
      height: 0;
      border: 20px solid;
      border-color: transparent transparent transparent #eef2ff;
      position: absolute;
      right: -40px;
    }
    &:nth-child(2),
    &:nth-child(3) {
      padding-left: 50px;
      &:after {
        content: "";
        width: 0;
        height: 0;
        border: 20px solid;
        border-color: transparent transparent transparent #fff;
        position: absolute;
        left: 0px;
      }
    }
  }
  .active {
    background: #e9f4ff;
    color: #0067cc;
    font-weight: 600;
    &:before {
      border-color: transparent transparent transparent #e9f4ff;
    }
  }
}
</style>