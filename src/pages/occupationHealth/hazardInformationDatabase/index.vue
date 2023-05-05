<template>
  <div class="hazard-information-database clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>危害岗位信息数据库</PageTitle>
    <a-tabs default-active-key="1" @change="hazardChange">
      <a-tab-pane key="1" tab="危害因素">
        <Hazard v-if="tabKey==1" :tabKey="tabKey"></Hazard>
      </a-tab-pane>
      <a-tab-pane key="2" tab="危害岗位">
        <Hazard v-if="tabKey==2" :tabKey="tabKey"></Hazard>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import Hazard from "./HazardComponent.vue";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import serviceNameList from '@/config/default/service.config.js';

export default {
  mixins: [teableCenterEllipsis],
  components: {
    UploadBtnStyle,
    Hazard
  },
  data() {
    return {
      tabKey:'1',
      loading: false,
      // 导入文件地址
      action: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.chemicals}/api/ehs/chemical/list/upload`,
      formInline: {

      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      hazardousPostDict:{},
      hazardFactorsDict:{},
      dataSource: [
        {name:"名称",name1:"工号",phone:"1234567865432",name3:'部门1',hazardous_post:'岗位1',form:'危害因素1'}
      ],
      columns: [
        {
          title: "姓名",
          dataIndex: "name",
          key: "name",
          width: 200,
        },
        {
          title: "工号",
          dataIndex: "name1",
          key: "name1",
          width: 200,
        },
        {
          title: "手机号",
          dataIndex: "phone",
          key: "phone",
          width: 200,
        },
        {
          title: "所属部门",
          dataIndex: "name3",
          key: "name3",
          width: 200,
        },
        {
          title: "岗位",
          dataIndex: "hazardous_post",
          key: "hazardous_post",
          width: 200,
          // customRender: (text, record, index) => {
          //   return this.chemicalDict[text] ? this.chemicalDict[text] : text ? text : "--";
          // },
        },
        {
          title: "危害因素",
          dataIndex: "form",
          key: "form",
          width: 400,
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right',
          width: 200
        },
      ]
    }
  },
  created() {
    this.setRouterCode("hazardInformationDatabase");
  },
  methods: {
    // tab切换
    hazardChange(key) {
      this.tabKey = key;
    }
  }
}
</script>

<style lang="less" scoped>

</style>