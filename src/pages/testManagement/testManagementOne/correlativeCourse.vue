<template>
  <div class="correlative-course">
    <CommonModal
      title="关联课程"
      :visible="addAddressModel"
      :cancelFn="closeAddAddressModel"
    >
      <SearchTerm>
        <a-form-model layout="inline" :model="formInline" :colon="false">
          <a-form-model-item label="课程名称">
            <a-input v-model="formInline.name" placeholder="请输入课程名称" />
          </a-form-model-item>
          <a-form-model-item class="float-right">
            <a-button type="primary" :loading="loading" @click="iSearch"
              >查询</a-button
            >
            <a-button @click="iRest">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </SearchTerm>
      <div class="course-detail">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="课程列表" class="tab">
            <a-radio-group v-model:value="courseId">
              <a-row v-for="course of courseList" :key="course.courseId">
                <a-col>
                  <a-radio :value="course.courseId">
                    <img :src="course.coverUrl?course.coverUrl:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic_source%2F9e%2F32%2F9a%2F9e329acc0c79523b0204f6ed7ea1e45e.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1656225906&t=b23453b4f502773672e7f27ffc36ba5b'" alt="">
                    <!-- <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic_source%2F9e%2F32%2F9a%2F9e329acc0c79523b0204f6ed7ea1e45e.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1656225906&t=b23453b4f502773672e7f27ffc36ba5b" alt=""> -->
                    <span class="name">{{course.name}}</span>
                  </a-radio>
                </a-col>
              </a-row>
            </a-radio-group>
          </a-tab-pane>
        </a-tabs>
      </div>
      <template slot="btn">
        <a-button @click="closeAddAddressModel">取消</a-button>
        <a-button
          class="m-l-15"
          type="primary"
          :loading="loading"
          @click="submitCourse"
          >确定</a-button
        >
      </template>
    </CommonModal>
  </div>
</template>

<script>
import { debounce } from "lodash";
import {  courseListAll } from "@/services/api";
export default {
  props: {
    addAddressModel: {
      default: false,
    },
    selectedCourse: {
      default:()=>[]
    },
    corporationId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loading:false,
      activeKey:'1',
      formInline: {
        name:''
      },
      courseId:null,
      courseList:[],
    }
  },
  watch: {
    addAddressModel: {
      handler(value) {
        if(value) {
          this.getCourseList();
        }
      },
      immediate: true,
      deep: true,
    },
    selectedCourse: {
      handler(value) {
        if(value.length>=1) {
          this.courseId = value[0].courseId;
        } else {
          this.courseId = null;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getCourseList(name=null) {
      const params = {
        name,
        corporationId: this.corporationId
      }
      courseListAll(params).then(res=>{
        this.courseList = res.data;
      }).catch(err=>{
        console.log(err);
      })
    },
    // 查询
    iSearch() {
      this.getCourseList(this.formInline.name)
    },

    // 关闭新建地址model
    closeAddAddressModel() {
      this.formInline = { 
        name:'',
       };
      this.$emit("closeAddAddressModel");
    },
    // 确定
    submitCourse() {
      const selectedCourse = this.courseList.filter(item=>{
        return item.courseId == this.courseId;
      })
      this.$emit("submitCourse", selectedCourse);
      this.$emit("closeAddAddressModel");
    },
    // 重置
    iRest: debounce(
      function () {
        this.formInline = {
          name:'',
        };
        this.getCourseList()
      },
      250,
      { leading: true, trailing: false }
    ),
  }

}
</script>

<style lang='less' scoped>
.course-detail {
  .tab {
    ::v-deep .ant-radio-group{
      width: 100%;
      .ant-col {
        margin-bottom: 10px;
        width: 100%;
        img {
          width: 60px;
          height: 60px;
          margin-left: 10px;
        }
        .name {
          margin-left: 15px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>