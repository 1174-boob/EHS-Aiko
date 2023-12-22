<template>
  <div class="notice-preview">
    <div v-if="noticeMsg">
      <div class="title-wrapper">
        <div class="preview-title">{{noticeMsg.policyLawSubject}}</div>
        <div class="sub">
          <div class="title">{{noticeMsg.subTitle}}</div>
          <div class="pub-title">发布日期：{{noticeMsg.releaseTime?noticeMsg.releaseTime.split(" ")[0]:''}}</div>
        </div>
      </div>
      <div class="content" v-html="noticeMsg.content"></div>
      <ul class="download" v-if="fileDetail && fileDetail.length>=1">
        <li v-for="file of fileDetail">
          {{file.name}}
          <span class="btn" @click="downloadFile(file.url,file.name)">下载</span>
        </li>
      </ul>
    </div>
    <FixedBottom>
      <a-button :style="{ marginLeft: '8px' }" @click="back">返回</a-button>
    </FixedBottom>
  </div>
</template>

<script>
import { SelectPolicylawDetail } from "@/services/api.js";
import FixedBottom from "@/components/commonTpl/fixedBottom";
import { getQueryVariable } from "@/utils/util.js"
export default {
  components: { FixedBottom },
  data() {
    return {
      noticeMsg: null,
      id: null,
      fromPath: '',
      fileDetail: [],
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.path == "/securityThinkTank/notice") { //从列表页进入
      next(vm => {
        vm.setRouterCode("notice");
        vm.fromPath = from.path;
        console.log(111);
        vm.getParams(to.query.id != undefined ? to.query.id : getQueryVariable('id'));
      });
    } else { //从编辑页面进入
      next(vm => {
        vm.setRouterCode("notice");
        vm.fromPath = from.path;
        vm.getNoticeMsg(to.query);
      })
    }
  },
  mounted() {
    // 监听浏览器刷新事件
    window.addEventListener("beforeunload", () => {
      if (!this.$route.query.id) { //当前路由没有id的时候才会将数据存入sessionStorage
        sessionStorage.setItem("noticeMsg", JSON.stringify(this.$store.state.setting.noticeMsg));
      }
    })
  },
  methods: {
    // 获取参数
    getParams(policyLawId) {
      console.log("query====id========", policyLawId);
      SelectPolicylawDetail({ policyLawId }).then(res => {
        this.noticeMsg = res.data;
        this.fileDetail = res.data.fileId;
        console.log("dd", this.noticeMsg);
      }).catch(err => {
        console.log(err);
      })
    },
    // 获取预览数据
    getNoticeMsg(query = {}) {
      console.log("qqqq====", query);
      if (query.id != undefined ? query.id : getQueryVariable('id')) {
        console.log(999);
        this.getParams(query.id != undefined ? query.id : getQueryVariable('id'));
      } else {
        const noticeMsg = JSON.parse(sessionStorage.getItem('noticeMsg'));
        if (noticeMsg) {
          this.noticeMsg = noticeMsg;
          this.fileDetail = noticeMsg.fileDetail ? noticeMsg.fileDetail : [];
          this.$store.commit("setting/noticeMsg", noticeMsg);
          this.$nextTick(() => {
            sessionStorage.removeItem("noticeMsg");
          })
          console.log('11==', this.noticeMsg);
        } else {
          this.noticeMsg = this.$store.state.setting.noticeMsg;
          this.fileDetail = this.noticeMsg.fileDetail ? this.noticeMsg.fileDetail : [];
          if (!this.noticeMsg) {
            this.$router.replace("/notice/systemNotice")
          }
          console.log('22==', this.noticeMsg);
        }
      }
    },
    // 下载文件(原有版本)
    // downloadFile(url) {
    //   window.open(url)
    // },
    // 下载文件
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
    },
  },
}
</script>

<style lang='less' scoped>
.notice-preview {
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  padding-bottom: 60px;
  .title-wrapper {
    padding: 30px 0;
    background: #fafbff;
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
    /deep/ p {
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