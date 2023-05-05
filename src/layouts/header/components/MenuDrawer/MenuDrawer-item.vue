<template>
  <a-row :gutter="10" :type="'flex'" class="clx-ant-col-5-box">
    <a-col :span="6" v-for="item in twoList" :key="item.id" style="display: flex" class="menu-drawer-item">
      <div class="menu-drawer-item-details" @click="openTarget(item)">
        <div class="menu-drawer-item-details-left">
          <!-- <img src="@/assets/header/menu-item-logo.svg" /> -->
          <img :src="item.logoFileUrl" />
        </div>
        <div class="menu-drawer-item-details-right">
          <div class="menu-drawer-item-details-title" style="font-weight: bold">{{ item.name }}</div>
          <div class="menu-drawer-item-details-detail">{{ item.code || '' }}</div>
        </div>
        <img class="menu-drawer-item-details-ykt" v-if="item.isOpen - 0 === 1" src="@/assets/header/is-open.svg" />
      </div>
    </a-col>
  </a-row>
</template>

<script>
export default {
  props: {
    twoList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {

    };
  },
  methods: {
    openTarget(item) {
      let { responseType, clientId, redirectUri } = item;
      redirectUri = (redirectUri && redirectUri.indexOf('#') != -1) ? redirectUri.replace('#', '%23') : redirectUri
      let url = "";
      if (item.isOpen === 1) {
        // 已开通
        url = `${process.env.VUE_APP_LOGIN_URL}client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}`;
      } else {
        if (item.url) {
          // url = item.url
          url = process.env.VUE_APP_ZCLOUD_URL + '?productId=' + item.productId + '#/' + item.url;
        } else {
          this.$antMessage.warning('url数据异常！');
          return
        }
      }
      // console.log(url);
      window.open(url);
    },
  },
  mounted() { },
};
</script>

<style lang="less">
.clx-ant-col-5-box {
  .ant-col-5 {
    width: 19.833333% !important;
    &:nth-of-type(5n) {
      padding-left: 5px !important;
      padding-right: 0px !important;
    }
  }
}
.menu-drawer-item {
  // display: flex;
}

.menu-drawer-item-details {
  margin-bottom: 15px;
  border: 1px solid transparent;
  background: #f6f7fa;
  border-radius: 3px;
  padding: 10px 15px;
  position: relative;
  cursor: pointer;
  flex: 1;
  display: flex;
  &:hover {
    border: 1px solid #0067cc;
    .menu-drawer-item-details-right {
      .menu-drawer-item-details-title,
      .menu-drawer-item-details-detail {
        color: #0067cc !important;
      }
    }
  }
  .menu-drawer-item-details-left {
    width: 48px;
    height: 48px;
    margin-right: 16px;
    flex: none;
    & > img {
      width: 100%;
      height: 100%;
    }
  }
  .menu-drawer-item-details-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .menu-drawer-item-details-title {
      color: #333 !important;
      font-size: 14px !important;
      line-height: 14px !important;
      box-sizing: border-box;
      font-weight: bold !important;
      margin-bottom: 8px;
    }
    .menu-drawer-item-details-detail {
      box-sizing: border-box;
      margin-top: 0px;
      font-size: 14px;
      line-height: 14px;
      color: #787c87;
    }
  }
  .menu-drawer-item-details-ykt {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 38px;
  }
}
</style>
