<template>
  <HasFixedBottomWrapper>
    <PageTitle class="personal-title">人员信息<a-button v-if="!standingBook" type="primary" class="m-r-15" @click="personalEdit">编辑</a-button></PageTitle>
    <div class="personal-information">
      <div class="top-content">
        <div class="avatar">
          <img :src="avatarUrl" alt="">
        </div>
        <div class="information">
          <div class="name">{{healthForm.name}}</div>
          <div class="job-info">
            <ul>
              <li>
                所属组织：{{healthForm.corporationName ? healthForm.corporationName : '--'}}
              </li>
              <li>
                所属部门：{{healthForm.deptName ? healthForm.deptName : '--'}}
              </li>
              <li>
                工号：{{healthForm.workNum ? healthForm.workNum : '--'}}
              </li>
              <li>
                电话：{{healthForm.phone ? healthForm.phone : '--'}}
              </li>
              <li>
                邮箱：{{healthForm.email ? healthForm.email : '--'}}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="bottom-content">
        <ul>
          <li>
            <div class="info">
              <div class="title">性别：</div>
              <div class="detail">{{healthForm.sex ? healthForm.sex=='1' ? '男' : '女' : '--'}}</div>
            </div>
            <div class="info">
              <div class="title">年龄：</div>
              <div class="detail">{{healthForm.age ? healthForm.age : '--'}}</div>
            </div>
          </li>
          <li>
            <div class="info">
              <div class="title">籍贯：</div>
              <div class="detail">{{healthForm.nativePlace ? healthForm.nativePlace.replace(/,/g,'') : '--'}}</div>
            </div>
            <div class="info">
              <div class="title">身份证号：</div>
              <div class="detail">{{healthForm.certificateNum ? healthForm.certificateNum : '--'}}</div>
            </div>
          </li>
          <li>
            <div class="info">
              <div class="title">出生年月：</div>
              <div class="detail">{{healthForm.birthTime ? healthForm.birthTime : '--'}}</div>
            </div>
            <div class="info">
              <div class="title">文化程度：</div>
              <div class="detail">{{healthForm.degreeEducation ? educationDict[healthForm.degreeEducation] : '--' }}</div>
            </div>
          </li>
          <li>
            <div class="info">
              <div class="title">入司时间：</div>
              <div class="detail">{{healthForm.joyCompanyTime ? healthForm.joyCompanyTime : '--'}}</div>
            </div>
            <div class="info">
              <div class="title">从业年数：</div>
              <div class="detail">{{healthForm.yearsEmployment ? healthForm.yearsEmployment +'年' : '--'}}</div>
            </div>
          </li>
          <li>
            <div class="info">
              <div class="title">婚姻状况：</div>
              <div class="detail">{{healthForm.maritalStatus ? marriageDict[healthForm.maritalStatus] : '--'}}</div>
            </div>
            <div class="info">
              <div class="title">嗜好：</div>
              <div class="detail">{{healthForm.hobby ? healthForm.hobby : '--'}}</div>
            </div>
          </li>
          <li>
            <div class="info">
              <div class="title">健康状况：</div>
              <div class="detail more">{{healthForm.healthStatus ? checkResultDict[healthForm.healthStatus] : '--'}}</div>
            </div>
            <div class="info">
              <div class="title">接触危害：</div>
              <div class="detail more" :title="healthForm.hazardFactors">{{healthForm.hazardFactors ? healthForm.hazardFactors : '--'}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="table-content">
      <a-tabs default-active-key="1" @change="changeTab">
        <a-tab-pane key="1" tab="体检记录">
          <StandingTable v-if="tabKey=='1'" :tabKey="tabKey" :id="id"></StandingTable>
        </a-tab-pane>
        <a-tab-pane key="2" tab="职业史及职业病危害接触史">
          <StandingTable v-if="tabKey=='2'" :tabKey="tabKey" :id="id"></StandingTable>
        </a-tab-pane>
        <a-tab-pane key="3" tab="既往病史">
          <StandingTable v-if="tabKey=='3'" :tabKey="tabKey" :id="id"></StandingTable>
        </a-tab-pane>
        <a-tab-pane key="4" tab="职业病诊断">
          <StandingTable v-if="tabKey=='4'" :tabKey="tabKey" :id="id"></StandingTable>
        </a-tab-pane>
        <a-tab-pane key="5" tab="调岗记录">
          <StandingTable v-if="tabKey=='5'" :tabKey="tabKey" :id="id"></StandingTable>
        </a-tab-pane>
        <a-tab-pane key="6" tab="PPE配置">
          <StandingTable v-if="tabKey=='6'" :tabKey="tabKey" :id="id"></StandingTable>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div slot="fixedBottom" v-if="standingBook">
      <FixedBottom>
        <div>
          <a-button class="m-r-15" @click="goBack">返回</a-button>
        </div>
      </FixedBottom>
    </div>
  </HasFixedBottomWrapper>
</template>

<script>
import FixedBottom from "@/components/commonTpl/fixedBottom.vue";
import StandingTable from "./standingTable.vue";
import dictionary from '@/utils/dictionary';
import {
  healthUserDetail,
  getPortraitUrlt,
} from "@/services/api.js";
export default {
  components: {
    FixedBottom,
    StandingTable
  },
  data() {
    return {
      tabKey: '1',
      standingBook: false,
      id: null,
      healthForm: {},
      checkResultDict:{},
      avatarUrl:'',
      educationDict: {},
      marriageDict: {},
    }
  },
  beforeRouteEnter(to, from, next) {
    const id = to.query.id;
    if (id) {
      next(vm => {
        vm.setRouterCode("healthStandingBook");
        vm.gethealthDetail(id);
      })
    } else {
      next(vm=>{
        vm.setRouterCode("healthStandingBook");
      })
    }
  },
  created() {
    const standingBook = sessionStorage.getItem('standingBook');
    if(standingBook) {
      this.standingBook = true;
    }
    const checkResult = dictionary('checkResult');
    checkResult.forEach(item=>{
      this.$set(this.checkResultDict,item.key,item.value);
    });
    console.log("iii",this.checkResultDict);
    const education = dictionary('education');
    education.forEach(item=>{
      this.$set(this.educationDict,item.key,item.value);
    });
    const marriage = dictionary('marriage');
    marriage.forEach(item=>{
      this.$set(this.marriageDict,item.key,item.value);
    });
  },
  methods: {
    goBack(){
      this.setKeepalive(true)
      this.$router.go(-1)
    },
    // tab切换
    changeTab(key) {
      this.tabKey = key;
    },
    // 编辑
    personalEdit() {
      sessionStorage.setItem("personalHealth",1)
      this.$router.push({
        path: "/occupationHealth/addEditStandingBook",
        query: { id: this.id },
      });
    },
    gethealthDetail(id) {
      this.id = id;
      healthUserDetail({id}).then(res => {
        const data = res.data;
        this.healthForm = data;
        if(data.photo) {
          this.getPortraitUrlt(data.photo);
        }
      }).catch(err => {
        console.log(err);
      })
    },
    // 头像
    getPortraitUrlt(id) {
      getPortraitUrlt([id]).then(res => {
        const data = res.data[0];
        this.avatarUrl = data.filePath;
      }).catch(err => {
        console.log(err);
      })
    },
  },
  beforeDestroy() {
    sessionStorage.removeItem("standingBook");
  }
}
</script>

<style lang="less" scoped>
.personal-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.personal-information {
  background: rgba(250,250,250,0.50);
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid #F4F4F4;
  border-radius: 4px;
  .top-content {
    display: flex;
    padding-bottom: 20px;
    border-bottom: 1px solid #E9E9E9;
    .avatar {
      width: 90px;
      height: 90px;
      border-radius: 4px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .information {
      flex: 1;
      padding-left: 20px;
      box-sizing: border-box;
      .name {
        margin-top: 12px;
        font-size: 16px;
        color: #000;
        font-weight: 400;
      }
      .job-info {
        margin-top: 20px;
        font-size: 14px;
        color: #000;
        font-weight: 400;
        ul {
          li {
            float: left;
            min-width: 110px;
            margin-right: 30px;
          }
        }
      }
    }
  }
  .bottom-content {
    padding: 5px 0;
    ul {
      overflow: hidden;
      li {
        float: left;
        margin-right: 100px;
        .info {
          font-size: 14px;
          padding-top: 20px;
          display: flex;
          align-items: center;
          .title {
            width: 80px;
            display: inline-block;
            text-align: right;
            color: #999;
          }
          .detail {
            display: inline-block;
            text-align: left;
            color: #333;
            max-width: 260px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
      li:first-child {
        .info {
          .title {
            width: 50px;
          }
        }
      }
      li:last-child {
        margin-right: unset;
      }
    }
  }
}
.table-content {
  margin-top: 20px;
}
@media screen and (max-width: 1366px) {
  .personal-information {
    .bottom-content {
      ul {
        li {
          margin-right: 20px;
          .info {
            .more {
              width: 130px;
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1367px) and (max-width: 1440px) {
  .personal-information {
    .bottom-content {
      ul {
        li {
          margin-right: 30px;
          .info {
            .more {
              width: 150px;
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1441px) and (max-width: 1680px) {
  .personal-information {
    .bottom-content {
      ul {
        li {
          margin-right: 40px;
        }
      }
    }
  }
}
</style>