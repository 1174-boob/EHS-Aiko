<template>
  <div class="side-menu-box">
    <a-layout-sider
      theme="light"
      :class="['side-menu', isMobile ? null : 'shadow','side-menu-main',collapsed?null : 'side-menu-main-padding-l-r','my-side-menu']"
      :collapsible="collapsible"
      v-model="collapsed"
      :trigger="null"
    >
      <i-menu theme="light" :collapsed="collapsed" :options="menuData" @select="onSelect" class="menu beauty-scroll" />
      <!-- logo背景 -->
      <!-- <img src="@/assets/menu/menu-logo-bg.png" class="side-menu-main-logo" /> -->
    </a-layout-sider>
    <!-- 折叠按钮 -->
    <div class="side-menu-btn" @click="toggleCollapse" v-if="!isMobile">
      <a-icon :type="collapsed ? 'right' : 'left'" class="side-menu-btn-ico" />
      <img src="@/assets/menu/menu-btn.png" class="side-menu-btn-bg" />
    </div>
  </div>
</template>

<script>
import IMenu from './menu'
import { mapState } from 'vuex'
export default {
  name: 'SideMenu',
  components: { IMenu },
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menuData: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    }
  },
  computed: {
    sideTheme() {
      return this.theme == 'light' ? this.theme : 'dark'
    },
    ...mapState('setting', ['isMobile', 'systemName'])
  },
  methods: {
    toggleCollapse() {
      this.$emit('toggleCollapse')
    },
    onSelect(obj) {
      this.$emit('menuSelect', obj)
    }
  },
}
</script>

<style lang="less">
@import "index";
.side-menu-box {
  flex: 0;
  position: relative;
  margin-bottom: 16px;
  .side-menu-main {
    border-radius: 0.05rem;
    margin: 0 16px;
    position: relative;
    overflow: hidden;
    z-index: 1;
    // 背景-logo
    .side-menu-main-logo {
      width: 50%;
      position: absolute;
      bottom: 13%;
      left: 50%;
      transform: translateX(-50%);
      pointer-events: none;
    }
  }
  .side-menu-main-padding-l-r {
    padding: 0 16px;
  }
  // 收缩按钮
  .side-menu-btn {
    position: absolute;
    top: 50%;
    right: 0px;
    width: 16px;
    height: 77px;
    // z-index: 999;
    cursor: pointer;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;

    .side-menu-btn-ico {
      font-size: 14px;
      color: #005eba;
      font-weight: bold;
    }
    .side-menu-btn-bg {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }
  }
}
.my-side-menu {
  &.ant-layout-sider {
    height: 100%;
    &.expanded {
      background: #fff;
    }
  }
  &.ant-layout-sider-collapsed {
    flex: 0 0 60px !important;
    max-width: 60px !important;
    min-width: 60px !important;
    width: 60px !important;
    .ant-menu-inline-collapsed {
      width: 60px;
    }
    .ant-menu-submenu-vertical,
    .ant-menu-item-only-child {
      span,
      a {
        &:not(.anticon) {
          // visibility: hidden;
        }
      }
    }
    .ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title,
    .ant-menu-inline-collapsed > .ant-menu-item {
      padding: 0 22px !important;
    }
  }

  .collapsed-btn {
    padding-left: 24px;
    position: absolute;
    left: 0;
    bottom: 0;
    cursor: pointer;
    width: 100%;
    height: 48px;
    box-sizing: border-box;
    padding-top: 12px;
    .anticon {
      font-size: 20px;
    }
  }
  .side-menu {
    position: relative;
    // background: #fff;
    width: 100%;
    height: 100%;
    padding-bottom: 48px;
    box-sizing: border-box;
    overflow: hidden;
    border-right: none;
    display: flex;
    flex-direction: column;
    > ul {
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 4px;
        // background: #fff;
      }
      &::-webkit-scrollbar-thumb {
        width: 4px;
        // background: #d9d9d9;
        border-radius: 2px;
      }
    }
    .menu-btn {
      position: absolute;
      left: 24px;
      bottom: 50px;
    }
  }
  .side-menu .ant-menu-sub.ant-menu-inline .ant-menu-item-group-title {
    display: none !important;
  }
  .right-menu-icon.anticon.anticon-right {
    font-size: 12px !important;
  }
  .my-menu-extend {
    position: fixed;
    width: 480px;
    max-height: 500px;
    overflow-y: auto;
    // background: #fff;
    top: 100px;
    padding: 16px;
    z-index: 2;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
    li {
      padding-left: 24px;
      font-size: 0.12rem;
      color: #000;
      &:hover {
        color: #0067cc;
      }
    }
    .prod-title {
      font-size: 0.12rem;
      font-weight: 700;
      padding-left: 24px;
      padding: 8px 24px;
    }
  }
}
</style>
