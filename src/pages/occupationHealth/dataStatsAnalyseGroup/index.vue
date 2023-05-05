<template>
      <div
            class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff"
      >
            <childComp></childComp>
            <div class="line">
                  <p></p>
            </div>
            <childComB></childComB>
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
import childComp from "@/pages/occupationHealth/dataStatsAnalyseGroup/childComponents/index.vue";
import childComB from "@/pages/occupationHealth/dataStatsAnalyseGroup/childComponents/indexBotton.vue";
export default {
      data() {
            return {
                  searchFormTop: {},
            };
      },
      components: { childComp, childComB },
      computed: {},
      created() {
            this.setRouterCode("dataStatsAnalyseGroup");
      },
      methods: {
            // 重置
            iRest: debounce(
                  function () {
                        this.page = {
                              pageNo: 1,
                              pageSize: 10,
                              total: 0,
                        };
                        (this.formInline = {
                              name: "",
                              type: undefined,
                        }),
                              (this.searchFormData = JSON.parse(
                                    JSON.stringify(this.formInline)
                              ));
                        this.getSelectIssueInvitationPage();
                  },
                  250,
                  { leading: true, trailing: false }
            ),
            // 查询
            iSearch() {
                  this.searchFormData = JSON.parse(
                        JSON.stringify(this.formInline)
                  );
                  this.handleLoading();
                  this.getSelectIssueInvitationPage(this.searchFormData);
            },
      },
};
</script>

<style lang="less" scoped>
.line {
      padding: 40px;
      > p {
            height: 1px;
            background-color: #dfdfdf;
      }
}
</style>
