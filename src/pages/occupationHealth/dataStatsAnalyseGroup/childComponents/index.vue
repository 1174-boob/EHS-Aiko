<template>
      <div
            class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff"
      >
            <!-- 集团 1-->
            <SearchTerm>
                  <a-form-model
                        layout="inline"
                        :model="formInline"
                        :colon="false"
                  >
                        <CommonSearchItem
                              ref="commonSearchItem"
                              :CommonFormInline="formInline"
                        ></CommonSearchItem>
                        <a-form-model-item label="危害因素">
                              <a-select
                                    v-model="formInline.cutHarm"
                                    placeholder="请选择"
                                    allowClear
                              >
                                    <a-select-option
                                          v-for="(item, index) in harmList"
                                          :key="index"
                                          :value="item"
                                          >{{ item }}</a-select-option
                                    >
                              </a-select>
                        </a-form-model-item>
                        <!-- <a-form-model-item label="横坐标">
                              <a-select
                                    v-model="formInline.type"
                                    placeholder="请选择"
                                    allowClear
                              >
                                    <a-select-option value="0"
                                          >噪声</a-select-option
                                    >
                                    <a-select-option value="1"
                                          >硫酸</a-select-option
                                    >
                              </a-select>
                        </a-form-model-item> -->
                        <a-form-model-item label="纵坐标">
                              <a-select
                                    v-model="formInline.ordinate"
                                    placeholder="请选择"
                                    allowClear
                              >
                                    <a-select-option value="1"
                                          >岗位数</a-select-option
                                    >
                                    <a-select-option value="2"
                                          >禁忌调岗人数</a-select-option
                                    >
                                    <a-select-option value="3"
                                          >接害人数</a-select-option
                                    >
                              </a-select>
                        </a-form-model-item>
                        <a-form-model-item class="float-right">
                              <a-button
                                    type="primary"
                                    :loading="loading"
                                    @click="iSearch"
                                    >查询</a-button
                              >
                              <a-button @click="iRest">重置</a-button>
                        </a-form-model-item>
                  </a-form-model>
            </SearchTerm>
            <chart
                  :data="data"
                  :xAxisName="xAxisName"
                  :yAxisName="yAxisName"
                  setId="myechar"
            ></chart>
      </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dragTable from "@/mixin/dragTable.js";
import staffTree from "@/mixin/treeTab.js"; // 选择组织成员单选

import { formValidator } from "@/utils/clx-form-validator.js";
import getDictionaryItemObj from "@/utils/dictionary.js";
import OrganizeLazyTree from "@/components/organizeLazyTree/organizeLazyTree.vue";
import { debounce } from "lodash";
import {} from "@/services/api.js";
import {
      getSelectHarm,
      selectHarmDataSite,
      selectHarmDataGroup,
} from "@/services/occupationHealth.js";
import chart from "@/pages/occupationHealth/dataStatsAnalyseGroup/childComponents/chart.vue";
// import itemLiberty from "@/pages/occupationHealth/occupationHarmElement/itemTabs/liberty .vue";
export default {
      data() {
            return {
                  searchFormData: {},
                  formInline: {},
                  loading: false,
                  data: {},
                  xAxisName: "基地",
                  yAxisName: "岗位数",
                  harmList: [],
            };
      },
      components: { chart },

      computed: {
            corporationList() {
                  return this.$store.state.setting.corporationList;
            },
      },
      created() {},
      mounted() {
            // getDictionaryItemObj();
            getSelectHarm({}).then((res) => {
                  this.harmList = res.data;
            });
            this.getSelectIssueInvitationPage();
      },
      methods: {
            // 重置
            iRest: debounce(
                  function () {
                        (this.formInline = {}),
                              (this.searchFormData = JSON.parse(
                                    JSON.stringify(this.formInline)
                              ));
                        this.yAxisName = "岗位数";
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
                  // this.handleLoading();
                  this.getSelectIssueInvitationPage();
            },
            getSelectIssueInvitationPage() {
                  if (this.searchFormData.ordinate) {
                        this.yAxisName =
                              this.searchFormData.ordinate == 1
                                    ? "岗位数"
                                    : this.searchFormData.ordinate == 2
                                    ? "禁忌调岗人数"
                                    : "接害人数";
                  } else {
                        this.yAxisName = "岗位数";
                  }
                  // if (this.searchFormData.abscissa) {
                  //       this.xAxisName = this.searchFormData.abscissa;
                  // }
                  selectHarmDataGroup(this.searchFormData).then((res) => {
                        console.log("top:", res);
                        this.data = res.data;
                  });
            },
            num() {
                  return Math.floor(Math.random() * 100 + 1);
            },
      },
};
</script>

<style lang="less" scoped></style>
