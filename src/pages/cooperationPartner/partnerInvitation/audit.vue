<template>
  <div class="page-detail">
    <PageTitle>审核</PageTitle>
    <!-- <component :is="currentComponent" :partnerInfo='partnerInfo'></component> -->
    <div class="bg-fff flex flex-1">
      <div class="flex-1">
        <component :is="currentComponent" :partnerInfo="partnerInfo"></component>
        <div v-if="componentsParams">
          <Detail :componentsParams="componentsParams"></Detail>
        </div>
      </div>
      <Log :historyList="historyList"></Log>
    </div>
    <FixedBottom>
      <a-button  @click="goBack">返回</a-button>
      <a-button :style="{ marginLeft: '8px' }" type="primary" @click="passClick">通过</a-button>
      <a-button :style="{ marginLeft: '8px' }" @click="rejectClick">驳回</a-button>
    </FixedBottom>
    <CommonModal :title="'操作'" :visible="visible" :cancelFn="cancelFn">
      <template slot="form">
        <a-form-model ref="inlineForm" :model="inlineForm" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" labelAlign="left">
          <a-form-model-item label="备注">
            <a-input class="form-input" v-model="inlineForm.remake" placeholder="请输入" allowClear />
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="cancelBtn">取消</a-button>
        <a-button class="m-l-15" type="primary" @click="submitBtn">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>

<script>
import Info from '../cooperationInfo/info.vue';
import FixedBottom from "@/components/commonTpl/fixedBottom";
import { InvitationDetail, InvitationToExamine, rejectInvitation, SelectFormTemplateDetailByEnter, SelectFormDataDetailByEnter } from "@/services/api.js";
import Log from "./log.vue";
import Detail from "@/pages/sceneManagement/hiddenDanger/detail.vue";
export default {
  name: 'audit',
  components: { FixedBottom, Info, Log, Detail },
  data() {
    return {
      labelCol: { span: 6 }, // 设置左边label宽度
      wrapperCol: { span: 18 }, // 设置右边表单宽度
      partnerInfo: null,
      invitationId: '',
      action: null,
      historyList: [],
      currentComponent: Info,
      visible: false,
      inlineForm: {
        remake: '',
      },
      componentsParams: undefined
    }
  },
  beforeRouteEnter(to, from, next) {
    const id = to.query.id;
    if (id) {
      next(vm => {
        vm.setRouterCode("partnerInvitation");
        vm.getInvitationDetail(id);
      })
    } else {
      next(vm=>{
        vm.setRouterCode("partnerInvitation");
      })
    }
  },
  created() {
    this.getEditData();
  },
  methods: {
    goBack(){
      this.setKeepalive(true)
      this.$router.go(-1)
    },
    getEditData() { // 拿编辑数据
      let params = {
        url: this.$route.query.url,
        companyId: this.$route.query.companyId
      }
      SelectFormTemplateDetailByEnter(params).then(res => {
        res.data.templateData = JSON.parse(res.data.templateData);
        if (this.$route.query.status == 2 || this.$route.query.status == 3) {
          SelectFormDataDetailByEnter({
            tempId: res.data.tempId,
            infoId: this.$route.query.fromId,
            companyId: this.$route.query.companyId
          }).then(res1 => {
            this.componentsParams = {
              formData: res.data,
              url: this.$route.query.url,
              dataMsg: res1.data,
              title: "编辑信息"
            }
          }).catch(err => console.log(err))
        } else {
          this.componentsParams = {
            formData: res.data,
            url: this.$route.query.url,
            title: "完善信息"
          }
        }
      })
    },
    cancelFn() {
      this.visible = false;
    },
    // 获取详情
    getInvitationDetail(id) {
      this.invitationId = id;
      InvitationDetail({ invitationId: id }).then(res => {
        this.partnerInfo = res.data;
        this.historyList = res.data.historyList;
      }).catch(err => {
        console.log(err);
      })
    },
    // 通过
    passClick() {
      this.visible = true;
      this.action = 1; //通过

      // const params = {
      //   invitationId: this.invitationId,
      //   remake:this.inlineForm.remake,
      // }
      // InvitationToExamine(params).then(res=>{
      //   if(res.code == 20000) {
      //     this.$antMessage.success("审核通过")
      //   }
      // }).catch(err=>{
      //   console.log(err);
      // })
      // this.$router.push('/cooperationPartner/partnerInvitation')
    },
    // 驳回
    rejectClick() {
      this.visible = true;
      this.action = 2; //驳回


      // const params = {
      //   invitationId: this.invitationId,
      //   remake:this.inlineForm.remake,
      // }
      // rejectInvitation(params).then(res=>{
      //   if(res.code == 20000) {
      //     this.$antMessage.success("审核驳回")
      //   }
      // }).catch(err=>{
      //   console.log(err);
      // })
      // this.$router.push('/cooperationPartner/partnerInvitation')
    },
    // 取消
    cancelBtn() {
      this.visible = false;
      this.inlineForm.remake = "";
    },
    // 确定
    submitBtn() {
      const params = {
        invitationId: this.invitationId,
        remake: this.inlineForm.remake,
      }
      // 通过
      if (this.action == 1) {
        InvitationToExamine(params).then(res => {
          if (res.code == 20000) {
            this.visible = false;
            this.$antMessage.success("审核通过");
            this.$router.push('/ehsGerneralManage/cooperationPartner/partnerInvitation')
          }
        }).catch(err => {
          console.log(err);
        })
      } else if (this.action == 2) { //驳回
        rejectInvitation(params).then(res => {
          if (res.code == 20000) {
            this.visible = false;
            this.$antMessage.success("审核驳回");
            this.$router.push('/ehsGerneralManage/cooperationPartner/partnerInvitation')
          }
        }).catch(err => {
          console.log(err);
        })
        // this.$router.push('/cooperationPartner/partnerInvitation')
      }
    }
  },
}
</script>

<style lang='less' scoped>
.page-detail {
  width: 100%;
  padding-bottom: 60px;
  overflow-y: auto;
}
</style>