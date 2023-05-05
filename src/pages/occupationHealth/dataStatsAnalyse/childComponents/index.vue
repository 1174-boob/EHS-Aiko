<template>
      <div
            class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff"
      >
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
                        <a-form-model-item label="横坐标">
                              <a-select
                                    v-model="formInline.abscissaList"
                                    placeholder="请选择"
                                    allowClear
                                    mode="multiple"
                              >
                                    <a-select-option
                                          v-for="(item, index) in harmList"
                                          :key="index"
                                          :value="item"
                                          >{{ item }}</a-select-option
                                    >
                              </a-select>
                        </a-form-model-item>
                        <a-form-model-item label="纵坐标">
                              <a-select
                                    v-model="formInline.ordinate"
                                    placeholder="请选择"
                                    allowClear
                                    @change="handleOrdinateChange"
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
                  xAxisName: "危害因素",
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
                        (this.xAxisName = "危害因素"),
                              (this.yAxisName = "岗位数"),
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
                  if (this.searchFormData.abscissaList) {
                        this.searchFormData.abscissaList =
                              this.searchFormData.abscissaList.length > 0
                                    ? this.searchFormData.abscissaList
                                    : null;
                        this.xAxisName = this.searchFormData.abscissa;
                  } else {
                        this.xAxisName = "危害因素";
                  }
                  selectHarmDataSite(this.searchFormData).then((res) => {
                        this.data = res.data;
                  });

                  // setTimeout(() => {
                  //       this.data.id = "myecharTop";
                  //       this.data.xAxisName = "危害因素";
                  //       this.data.yAxisName = "岗位数";
                  //       this.data = [
                  //             {
                  //                   name: "测试1",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试2",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试3",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试4",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试5",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试6",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试7",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试8",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //             {
                  //                   name: "测试9",
                  //                   value: this.num(),
                  //             },
                  //       ];
                  // }, 0);
            },
            num() {
                  return Math.floor(Math.random() * 100 + 1);
            },
            handleOrdinateChange(e) {
                  console.log(e);
            },
      },
};
</script>

<style lang="less" scoped></style>
