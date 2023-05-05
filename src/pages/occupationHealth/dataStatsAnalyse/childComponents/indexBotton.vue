<template>
      <div
            class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff"
      >
            <!-- 现地 2 -->
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
                        <a-form-model-item label="时间">
                              <a-range-picker
                                    separator="-"
                                    format="YYYY-MM-DD"
                                    class="searchtable-search-date m-b-15"
                                    v-model="formInline.timeArr"
                              >
                                    <a-icon slot="suffixIcon" type="calendar" />
                              </a-range-picker>
                        </a-form-model-item>

                        <a-form-model-item label="横坐标">
                              <a-select
                                    v-model="formInline.abscissa"
                                    placeholder="请选择"
                                    allowClear
                              >
                                    <a-select-option value="1"
                                          >时间</a-select-option
                                    >
                                    <a-select-option value="2"
                                          >岗位</a-select-option
                                    >
                              </a-select>
                        </a-form-model-item>
                        <a-form-model-item label="纵坐标">
                              <a-select
                                    v-model="formInline.ordinate"
                                    placeholder="请选择"
                              >
                                    <a-select-option
                                          v-for="(item, index) in harmList"
                                          :key="index"
                                          :value="item"
                                          >{{ item }}</a-select-option
                                    >
                              </a-select>
                        </a-form-model-item>
                        <a-form-model-item
                              label="岗位"
                              v-if="formInline.abscissa == 1"
                        >
                              <a-select
                                    v-model="formInline.post"
                                    placeholder="请选择"
                                    allowClear
                              >
                                    <a-select-option
                                          v-for="item in positionList"
                                          :key="item.value"
                                          :value="item.value"
                                          >{{ item.label }}</a-select-option
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
                  :lineValue="lineValue"
                  setId="myecharB"
            ></chart>
      </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dragTable from "@/mixin/dragTable.js";
import dayJs from "dayjs";
import staffTree from "@/mixin/treeTab.js"; // 选择组织成员单选
import { formValidator } from "@/utils/clx-form-validator.js";
import chemicalDict from "@/mixin/chemicalDict.js";
import { debounce } from "lodash";
import {} from "@/services/api.js";
import {
      selectHarmDataSiteCode,
      getSelectHarm,
} from "@/services/occupationHealth.js";
import { getPostAll } from "@/services/occupationHealth.js";
import OrganizeLazyTree from "@/components/organizeLazyTree/organizeLazyTree.vue";
import chart from "@/pages/occupationHealth/dataStatsAnalyseGroup/childComponents/chart.vue";
// import itemLiberty from "@/pages/occupationHealth/occupationHarmElement/itemTabs/liberty .vue";
export default {
      data() {
            return {
                  searchFormData: {},
                  formInline: { ordinate: null },
                  loading: false,
                  data: {},
                  city: [],
                  xAxisName: "时间",
                  yAxisName: "",
                  groupOrTerrain: 1,
                  harmList: [],
                  positionList: [],
                  lineValue: null,
            };
      },
      components: { chart },
      mixins: [chemicalDict],
      computed: {
            corporationList() {
                  return this.$store.state.setting.corporationList;
            },
      },
      created() {
            getPostAll().then((res) => {
                  this.positionList = res.data;
            });
      },
      async mounted() {
            getSelectHarm({}).then((res) => {
                  this.harmList = res.data;
                  this.yAxisName = this.harmList[0];
                  this.formInline.ordinate = this.harmList[0];
                  this.iSearch();
            });

      },
      methods: {
            // 重置
            iRest: debounce(
                  function () {
                        (this.formInline = { ordinate: this.harmList[0] }),
                              (this.searchFormData = JSON.parse(
                                    JSON.stringify(this.formInline)
                              ));
                        this.xAxisName = "时间";
                        this.yAxisName = this.harmList[0];
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
                  if (this.searchFormData.timeArr) {
                        this.searchFormData.startTime = this.formInline
                              .timeArr[0]
                              ? dayJs(this.formInline.timeArr[0]).format(
                                      "YYYY-MM-DD"
                                ) + " 00:00:00"
                              : "";
                        this.searchFormData.endTime = this.formInline.timeArr[1]
                              ? dayJs(this.formInline.timeArr[1]).format(
                                      "YYYY-MM-DD"
                                ) + " 23:59:59"
                              : "";
                  }
                  if (this.searchFormData.ordinate) {
                        this.yAxisName = this.searchFormData.ordinate;
                  } else {
                        this.yAxisName = this.harmList[0];
                  }
                  if (this.searchFormData.abscissa) {
                        this.xAxisName =
                              this.searchFormData.abscissa == 1
                                    ? "时间"
                                    : "岗位";
                  } else {
                        this.xAxisName = "时间";
                  }
                  selectHarmDataSiteCode(this.searchFormData).then((res) => {
                        console.log(res);
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
