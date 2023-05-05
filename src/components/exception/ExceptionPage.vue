<template>
  <div class="exception-page exception-page-404" v-if="type == '403'">
    <div class="exception-page-404-main">
      <div class="img">
        <img src="@/assets/img/403.svg" />
      </div>
      <div class="content">
        <h1>抱歉</h1>
        <div class="desc">您尚未被授权该功能权限，如有需要，请联系贵公司管理员为您开通权限。</div>
        <div class="action">
          <a-button type="primary" @click="backHome">返回首页</a-button>
        </div>
      </div>
    </div>
  </div>
  <div class="exception-page exception-page-404" v-else-if="type == '404'">
    <div class="exception-page-404-main">
      <div class="img">
        <img src="@/assets/img/404.svg" />
      </div>
      <div class="content">
        <h1>抱歉</h1>
        <div class="desc">您所寻找的页面不存在，您可点击下面的按钮返回主页。</div>
        <div class="action">
          <a-button type="primary" @click="backHome">返回首页</a-button>
        </div>
      </div>
    </div>
  </div>
  <div v-else></div>
</template>

<script>
import Config from "./typeConfig";
export default {
  name: "ExceptionPage",
  props: ["type", "homeRoute"],
  data() {
    return {
      config: Config,
    };
  },
  mounted() {
    console.log('走了404')
  },
  methods: {
    backHome() {
      this.$router.push({ path: "/overview/preview" });
    },
  },
};
</script>

<style lang="less" scoped>
.exception-page {
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: @base-bg-color;
  .img {
    padding-right: 52px;
    zoom: 1;
    img {
      max-width: 430px;
    }
  }
  .content {
    h1 {
      color: #434e59;
      font-size: 60px;
      font-weight: 600;
      line-height: 60px;
      margin-bottom: 24px;
    }
    .desc {
      color: @text-color-second;
      font-size: 20px;
      line-height: 28px;
      margin-bottom: 16px;
    }
  }
}
.exception-page-404 {
  .exception-page-404-main {
    display: flex;
    justify-content: center;
    .img {
      margin-top: 5px;
      img {
        width: 102px;
      }
    }
  }
}
@media screen and (max-width: 1366px) {
  .exception-page {
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: @base-bg-color;
    .img {
      padding-right: 40px;
      zoom: 1;
      img {
        max-width: 430px;
      }
    }
    .content {
      h1 {
        color: #434e59;
        font-size: 50px;
        font-weight: 600;
        line-height: 50px;
        margin-bottom: 24px;
      }
      .desc {
        color: @text-color-second;
        font-size: 14px;
        line-height: 24px;
        margin-bottom: 16px;
      }
    }
  }
  .exception-page-404 {
    .exception-page-404-main {
      display: flex;
      justify-content: center;
      .img {
        margin-top: 5px;
        img {
          width: 84px;
        }
      }
    }
  }
}
</style>
