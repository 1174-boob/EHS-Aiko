<template>
  <div class="policy-preview">
    <div v-if="policyMsg">
      <div class="title-wrapper">
        <div class="preview-title">{{policyMsg.policyLawSubject}}</div>
        <div class="sub">
          <div class="title">{{policyMsg.subTitle}}</div>
          <div class="pub-title">发布日期：{{policyMsg.releaseTime?policyMsg.releaseTime.split(" ")[0]:''}}</div>
        </div>
      </div>
      <div class="content" id='content' v-html="policyMsg.content"></div>
      <ul class="download" v-if="fileDetail && fileDetail.length>=1">
        <!-- <li v-for="file of fileDetail"><span class="btn" @click="downloadFile(file.url,file.name)">下载</span></li> -->
        <li style="width:900px" v-for="file of fileDetail">
          {{file.name}}
          <span class="btn" @click="downloadFile(file.url,file.name)">下载</span>
        </li>
      </ul>
    </div>
    <FixedBottom>
      <a-button :style="{ marginLeft: '8px' }" @click="back">
        返回
      </a-button>
    </FixedBottom>
  </div>
</template>

<script>
import { SelectPolicylawDetail} from "@/services/api.js";
import FixedBottom from "@/components/commonTpl/fixedBottom";
export default {
  components:{FixedBottom},
  data() {
    return {
      policyMsg: null,
      id: null,
      fromPath: '',
      fileDetail:[],
    }
  },
  beforeRouteEnter(to,from,next) {
    if(from.path=="/safeManage/securityThinkTank/notice") { //从列表页进入
      next(vm=>{
        vm.setRouterCode("policy");
        vm.fromPath = from.path;
        vm.getParams(to.query.id);
      });
    } else { //从编辑页面进入
      next(vm=>{
        vm.setRouterCode("policy");
        vm.fromPath = from.path;
        vm.getNoticeMsg(to.query);
      })
    }
  },
  mounted() {
    // 监听浏览器刷新事件
    window.addEventListener("beforeunload",()=>{
      if(!this.$route.query.id) { //当前路由没有id的时候才会将数据存入sessionStorage
        sessionStorage.setItem("policyMsg",JSON.stringify(this.$store.state.setting.policyMsg));
      }
    })
  },
  methods: {
    // 获取参数
    getParams(policyLawId) {
      console.log("query====id========",policyLawId);
      SelectPolicylawDetail({policyLawId}).then(res=>{
        this.policyMsg = res.data;
        this.fileDetail = res.data.fileId;
        console.log("dd=======",this.policyMsg);
      }).catch(err=>{
        console.log(err);
      })
    },
    // 获取预览数据
    getNoticeMsg(query={}) {
      console.log("qqqq====",query);
      if(query.id) {
        this.getParams(query.id);
      } else {
        const policyMsg = JSON.parse(sessionStorage.getItem('policyMsg'));
        console.log('policyMsg====',policyMsg);
        if(policyMsg) {
          this.policyMsg = policyMsg;
          this.fileDetail = policyMsg.fileDetail?policyMsg.fileDetail:[];
          this.$store.commit("setting/policyMsg",policyMsg);
          this.$nextTick(()=>{
            sessionStorage.removeItem("policyMsg");
          })
          console.log('11==',this.policyMsg);
        } else {
          this.policyMsg = this.$store.state.setting.policyMsg;
          this.fileDetail = this.policyMsg.fileDetail?this.policyMsg.fileDetail:[];
          if(!this.policyMsg) {
            this.$router.replace("/safeManage/securityThinkTank/policy")
          }
          console.log('22==',this.policyMsg);
        }
      }
    },
    // 原版下载文件
    // downloadFile(url) {
    //   console.log("uro===",url);
    //   window.open(url)
    // },
    // 新版下载文件
    downloadFile(url,fileName){
      var httpRequest = new XMLHttpRequest();
      //指定响应类型，这决定了浏览器对返回内容的解析方式，设置为空或者text会作为字符解析、json会作为json解析，blob和arraybuffer会作为字节流解析
      httpRequest.responseType ='arraybuffer';
      httpRequest.open('GET', url, true);
      httpRequest.onload  = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
          //只有responseType为空或者text，才会使用responseText获取内容，其他情况                        httpRequest.response就是你需要的不含http头的返回内容
          var content = httpRequest.response;
            var elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            var blob = new Blob([content]);
          //创建指向内存中字节流的链接
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
              elink.click();
            document.body.removeChild(elink);
        }
      };
      httpRequest.send();
    },
    back() {
      // console.log("fanhui===",this.fromPath);
      this.setKeepalive(true)
      this.$router.push(this.fromPath)
    }
  },
}
</script>

<style lang='less' scoped>
.policy-preview {
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  padding-bottom: 60px;
  .title-wrapper {
    padding: 30px 0;
    background: #FAFBFF;
    .preview-title {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      color: #181818;
    }
    .sub {
      font-size: 14px;
      color: #666666;
      // overflow: hidden;
      display: flex;
      justify-content: center;
      margin-top: 16px;
      div {
        float: left;
        margin-left: 12px;
      }
    }
  }
  .content {
    padding: 20px 0;
    /deep/ p{
      line-height: 1.5 !important;
    }
  }
  .download {
    li {
      margin-bottom: 10px;
    }
    .btn {
      margin-left: 10px;
      cursor: pointer;
      color: #0067cc;
    }
  }
}
</style>