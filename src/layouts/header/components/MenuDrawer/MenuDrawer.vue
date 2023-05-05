<template>
  <a-drawer
    height="90%"
    wrapClassName="menu-drawer-box"
    :closable="true"
    :headerStyle="headerStyleDrawer"
    :bodyStyle="bodyStyleDrawer"
    placement="top"
    :visible="visible"
    @close="drawerClose"
    :maskClosable="true"
  >
    <div class="menu-drawer-box-body beauty-scroll">
      <div class="menu-drawer-box-body-search" @mouseenter="isSearchEnter" @mouseleave="isSearchLeave">
        <img src="@/assets/header/menu-search-active.svg" v-if="isSearch" />
        <img src="@/assets/header/menu-search.svg" v-else />
        <a-input class="menu-drawer-box-body-search-input" placeholder="请输入" v-model="productName" @change="onSearch" @focus="isFocusFn" @blur="isBlurFn" />
      </div>
      <a-divider class="menu-drawer-box-body-divider" />
      <MenuDrawerList :applicationList="applicationList" :productName="productName" />
    </div>
  </a-drawer>
</template>

<script>
import MenuDrawerList from "./MenuDrawer-list.vue";
import { getHeaderList } from "@/services/api";
import { debounce } from "lodash";
export default {
  components: { MenuDrawerList },
  data() {
    return {
      // 输入框内容
      productName: "",
      headerStyleDrawer: {
        height: "0px",
        padding: 0,
        borderBottom: "0px solid #f0f0f0",
      },
      bodyStyleDrawer: {
        padding: "64px 0 0 0",
        display: "flex",
        overflow: "hidden",
        height: "100%",
      },
      // 抽屉状态
      visible: false,
      // 抽屉数据列表
      applicationList: [],
      isSearch: false,
      isFocus: false,
    };
  },
  mounted() { },
  methods: {
    isBlurFn() {
      this.isFocus = false;
      this.isSearchLeave();
    },
    isFocusFn() {
      this.isFocus = true;
      this.isSearchEnter();
    },
    isSearchEnter() {
      this.isSearch = true;
    },
    isSearchLeave() {
      this.isSearch = this.isFocus;
    },
    drawerOpen() {
      this.visible = !this.visible;
    },
    drawerClose() {
      this.visible = false;
    },
    // 搜索
    onSearch: debounce(function () {
      this.getHeaderListFn();
    }, 250),
    // 请求列表
    getHeaderListFn() {
      let params = { productName: this.productName };
      getHeaderList(params)
        .then((res) => {
          let applicationList = res.data;
          // console.log(applicationList);
          applicationList = applicationList.filter((item) => {
            return (
              (item.children && item.children.length) ||
              (item.products && item.products.length)
            );
          });

          this.applicationList = applicationList;
        })
        .catch((err) => { });
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) this.getHeaderListFn();
    },
  },
};
</script>

<style lang="less">
.menu-drawer-box {
  display: flex;
  justify-content: center;
  .ant-drawer-content-wrapper {
    width: 80% !important;
    min-width: 1220px !important;
    margin: 0 auto;
    box-shadow: 0 0px 0px rgba(0, 0, 0, 0) !important;
  }
  .ant-drawer-close {
    top: 64px;
    &:hover {
      color: #0067cc !important;
    }
  }
  // 分割线
  .menu-drawer-box-body-divider {
    margin: 15px 0 10px;
  }
}
.ant-drawer-wrapper-body {
  overflow: hidden;
}
.menu-drawer-box-body {
  padding: 20px 80px 0px 70px;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  .menu-drawer-box-body-search {
    display: flex;
    align-items: center;
    img {
      flex: 0;
      width: 18px;
      height: 18px;
      margin-right: 12px;
    }
    .menu-drawer-box-body-search-input {
      width: 350px;
      border: 0px solid #000;
      &:hover {
        border-color: #fff;
        border-right-width: 0px !important;
      }
      &:focus {
        border-color: #fff;
        border-width: 0px !important;
        box-shadow: none;
      }
    }
  }
}
.menu-drawer-item-details {
  margin-bottom: 10px;
  border: 1px solid transparent;
  background: #f6f7fa;
  border-radius: 4px;
  padding: 10px;
  position: relative;
  cursor: pointer;
  &:hover {
    border: 1px solid #1f8efa;
    .menu-drawer-item-details-title {
      color: #1f8efa;
    }
  }
  .menu-drawer-item-details-title {
    color: #181818;
    font-size: 12px;
    box-sizing: border-box;
    font-weight: bold !important;
  }
  .menu-drawer-item-details-detail {
    box-sizing: border-box;
    margin-top: 10px;
    font-size: 12px;
    color: #787c87;
  }
}
</style>
