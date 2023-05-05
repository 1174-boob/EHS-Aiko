<template>
  <a-row :gutter="16">
    <template v-if="applicationList.length">
      <a-col :span="24" v-for="item in applicationList" :key="item.id" class="colcol">
        <a-card :bordered="false" :headStyle="headStyleCard" :bodyStyle="bodyStyleCard">
          <template slot="cover">
            <div class="one-title-box">
              <div class="one-title-main">
                <span class="one-bs"></span>
                <span class="one-title">{{ item.name }}</span>
              </div>
            </div>
          </template>
          <template v-if="item.children && item.children.length">
            <div v-for="item2 in item.children" :key="item2.id">
              <template v-if="item2.products && item2.products.length">
                <span class="two-title" v-show="item2.name">
                  {{
                  item2.name
                  }}
                </span>
                <MenuDrawerItem :twoList="item2.products" />
              </template>
            </div>
          </template>
          <template v-else>
            <MenuDrawerItem :twoList="item.products" />
          </template>
        </a-card>
      </a-col>
    </template>
    <!-- 已搜索 但是没有产品 -->
    <template v-else-if="productName">
      <a-empty style="width: 100%">
        <div class="menuDrawer-list-no-data" slot="description">
          未找到与
          <span>{{ productName }}</span>
          相关的产品
        </div>
      </a-empty>
    </template>
    <!-- 未搜索 没有产品 -->
    <template v-else>
      <a-empty style="width: 100%" description="暂无产品" />
    </template>
  </a-row>
</template>

<script>
import MenuDrawerItem from "./MenuDrawer-item";
export default {
  components: { MenuDrawerItem },
  props: {
    applicationList: {
      type: Array,
      default: () => [],
    },
    productName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      headStyleCard: { fontWeight: "bold", padding: 0 },
      bodyStyleCard: { padding: "0px 10px" },
    };
  },
  methods: {},
  mounted() { },
};
</script>

<style lang="less">
.one-title-box {
  // margin: 10px 0 0 0;
  width: 100%;
  .one-title-main {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    // border-bottom: 1px solid #f0f0f0;
    margin-bottom: 10px;
    margin-top: 20px;
    .one-bs {
      width: 6px;
      height: 10px;
      margin-right: 5px;
      background-color: #0067cc;
      border-radius: 4px;
    }
    .one-title {
      color: rgba(0, 0, 0, 0.85);
      font-weight: bold;
      font-size: 16px;
      line-height: 16px;
    }
  }
}
.two-title {
  color: #333 !important;
  display: block;
  font-size: 14px;
  margin-bottom: 10px;
  font-weight: bold;
}
.menuDrawer-list-no-data {
  font-size: 16px;
  & > span {
    color: #066acc;
  }
}
</style>
