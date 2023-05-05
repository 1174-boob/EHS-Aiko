<template>
      <div
            class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff"
      >
            <div class="card-container">
                  <a-tabs default-active-key="1" @change="tabChange">
                        <a-tab-pane key="1" tab="自主检测">
                              <itemLiberty></itemLiberty>
                        </a-tab-pane>
                        <a-tab-pane key="2" tab="定期委外">
                              <item-fixed></item-fixed>
                        </a-tab-pane>
                  </a-tabs>
            </div>
      </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dragTable from "@/mixin/dragTable.js";
import staffTree from "@/mixin/treeTab.js"; // 选择组织成员单选
import { formValidator } from "@/utils/clx-form-validator.js";
import { debounce } from "lodash";
import {} from "@/services/api.js";
import itemFixed from "@/pages/occupationHealth/occupationHarmElement/itemTabs/fixed.vue";
import itemLiberty from "@/pages/occupationHealth/occupationHarmElement/itemTabs/liberty.vue";
export default {
      data() {
            return {};
      },
      components: { itemFixed, itemLiberty },
      computed: {},
      created() {
            this.setRouterCode("occupationHarmElement");
      },
      methods: {
            // tab切换
            tabChange(key) {},
      },
};
</script>

<style lang="less" scoped></style>
