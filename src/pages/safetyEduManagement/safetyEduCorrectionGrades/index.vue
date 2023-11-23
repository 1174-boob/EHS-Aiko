<template>
  <!-- 成绩纠错 -->
  <HasFixedBottomWrapper>
    
    <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
      <!-- 上面的详情数据 -->
      <InfoDetailList :safetyEducationForm="safetyEducationForm" :trainerCompanyUserName="trainerCompanyUserName" :trainerDeptUserName="trainerDeptUserName" :trainerGroupUserName="trainerGroupUserName" />
      <!-- 下面的详情数据 -->
      <PageTitle>培训人员&nbsp;&nbsp;&nbsp;&nbsp; <span style="fontSize:14px;color:#9999a6">说明:同批次三级安全教育同一讲师若有多个培训级别均处于成绩纠错节点，请将多个级别均纠错完成后提交。</span></PageTitle> 
      <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
        <vxe-table
          class="vxe-scrollbar beauty-scroll-fireBox"
          border
          show-overflow
          align="center"
          :data="dataSource"
          show-header-overflow
        >
          <vxe-column field="userName" title="姓名">
            <template #default="{ row }">
              <span>{{ row.userName ? row.userName : '--' }}/{{ row.userJobNumber ? row.userJobNumber : '--' }}</span>
            </template>
          </vxe-column>
          <vxe-column field="deptName" title="部门">
            <template #default="{ row }">
              <span>{{ row.deptName ? row.deptName : '--' }}</span>
            </template>
          </vxe-column>
          <vxe-colgroup title="公司级">
            <vxe-column field="companyScore" title="员工填写">
              <template #default="{ row }">
                <span>{{ row.companyScore }}</span>
              </template>
            </vxe-column>
            <vxe-column field="companyCorrectScore" title="讲师纠错">
              <template #default="{ row }">
                <a-input :disabled="type == 'show' || currentLevel != 1" @change="handleChange(row)" class="editable-input" v-model="row.companyCorrectScore" :maxLength="30"></a-input>
              </template>
            </vxe-column>
          </vxe-colgroup>
          <vxe-colgroup title="车间(部门)级别">
            <vxe-column field="deptScore" title="员工填写">
              <template #default="{ row }">
                <span>{{ row.deptScore }}</span>
              </template>
            </vxe-column>
            <vxe-column field="deptCorrectScore" title="讲师纠错">
              <template #default="{ row }">
                <a-input :disabled="type == 'show' || currentLevel != 2" @change="handleChange(row)" class="editable-input" v-model="row.deptCorrectScore" :maxLength="30"></a-input>
              </template>
            </vxe-column>
          </vxe-colgroup>
          <vxe-colgroup title="班组级">
            <vxe-column field="groupScore" title="员工填写">
              <template #default="{ row }">
                <span>{{ row.groupScore }}</span>
              </template>
            </vxe-column>
            <vxe-column field="groupCorrectScore" title="讲师纠错">
              <template #default="{ row }">
                <a-input :disabled="type == 'show' || currentLevel != 3" @change="handleChange(row)" class="editable-input" v-model="row.groupCorrectScore" :maxLength="30"></a-input>
              </template>
            </vxe-column>
          </vxe-colgroup>
          <template #empty>
            <div style="padding:16px 0;">
              <a-empty />
            </div>
          </template>
        </vxe-table>
      </CommonTable>
      <DashBtn>
        <div></div>
        <div>
          <a-button type='primary' v-if="type == 'add'" @click="determine">确认</a-button>
          <a-button style="margin-left:10px" @click="back">取消</a-button>
        </div>
      </DashBtn>
    </div>

  </HasFixedBottomWrapper>
</template>

<script>
import InfoDetailList from "@/pages/safetyEduManagement/safetyEduCorrectionGrades/components/detailList.vue";
import {educationDetail, getEducationUserListPage, educationCorrect, educationRecognition} from "@/services/api.js"
import { debounce } from "lodash";

export default {
  components: { InfoDetailList,},
  data() {
    this.handleChange = debounce(this.handleChange, 800);
    return{
      id:'',
      type:'',
      currentLevel:'',
      safetyEducationForm:{},
      trainerCompanyUserName:'',
      trainerDeptUserName:'',
      trainerGroupUserName:'',
      dataSource:[],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
    }
  },
  created() {
    this.id = this.$route.query.id
    this.type = this.$route.query.type
    this.init()
    console.log(this.id,this.type);
  },
  methods:{
    // 确定 
    determine(){
      educationRecognition({id:this.id}).then((res)=>{
        console.log(res,889);
        if(res.code != 20000){
          this.$antMessage.warn(res.message);
          return
        } else {
          this.$antMessage.success(res.message);
          this.$router.push("/ehsGerneralManage/securityArchiveManagement/safetyEduManagement")
        }
      })
    },
    // 纠错
    handleChange(row){
      let para = {
        id: row.id,
        companyCorrectScore: row.companyCorrectScore, //公司级培训纠错成绩
        deptCorrectScore: row.deptCorrectScore, //部门级培训纠错成绩
        groupCorrectScore: row.groupCorrectScore //班组级培训纠错成绩
      }
      educationCorrect(para).then((res)=>{
        if(res.code != 20000){
          this.$antMessage.warn(res.message);
          return
        }
      }).catch((err)=>{
        console.log(err);
      })  
    },
    // 返回
    back() {
      this.$router.go(-1);
    },
    init() {
      this.getDetailUp()
      this.getDetailDown()
    },
    getDetailUp(){
      educationDetail({ id: this.id })
        .then((res) => {
          this.safetyEducationForm = res.data ? res.data : null;
          this.trainerCompanyUserName = this.safetyEducationForm.company.map(obj => `${obj.userName}/${obj.jobNumber}`).join('，');
          this.trainerDeptUserName = this.safetyEducationForm.dept.map(obj => `${obj.userName}/${obj.jobNumber}`).join('，');
          this.trainerGroupUserName = this.safetyEducationForm.group.map(obj => `${obj.userName}/${obj.jobNumber}`).join('，');
          this.currentLevel = res.data.currentLevel
        })
        .catch((err) => {
          console.log('err1',err);
        });
    },
    getDetailDown(){
      getEducationUserListPage({ id: this.id ,pageNo: this.page.pageNo,pageSize: this.page.pageSize})
        .then((res) => {
          this.dataSource = res.data.list ? res.data.list : [];
          console.log('res.data.list',res.data.list);
          this.page.total = res.data.total
        })
        .catch((err) => {
          console.log('err2',err);
        });
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page
      // 获取列表
      this.getDetailDown()
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1
      this.page.pageSize = pageSize
      this.getDetailDown()
    },
  },

}
</script>

<style lang="less" scoped>
</style>
