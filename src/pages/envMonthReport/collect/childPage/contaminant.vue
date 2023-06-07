<template>
    <!-- 邀请列表 -->
    <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
        <h3 class="title">废水废气污染物排放</h3>
        <SearchTerm>
            <a-form-model layout="inline"
                          :model="searchFormData"
                          :colon="false">
                <a-form-model-item label="日期">
                    <el-date-picker v-model="searchFormData.dateStr"
                                    value-format="yyyy-MM"
                                    type="month"
                                    placeholder="选择月"
                                    :clearable='false'>
                    </el-date-picker>
                </a-form-model-item>
                <a-form-model-item class="float-right">
                    <a-button type="primary"
                              :loading="loading"
                              @click="iSearch">查询</a-button>
                    <a-button @click="iRest">重置</a-button>
                </a-form-model-item>
            </a-form-model>
        </SearchTerm>
        <!-- 列表 -->
        <vxe-table border
                   resizable
                   align="center"
                   :data="tableData">
            <vxe-column field="projectName"
                        title="项目"></vxe-column>
            <vxe-column field="nicheItems"
                        title="单位"></vxe-column>

            <vxe-column v-for="(i,index) in titleList"
                        :field="i"
                        :title="findCorporationId(i)"
                        :key="index"></vxe-column>
            <template #empty>
                <div style="padding:16px 0;">
                    <a-empty />
                </div>
            </template>
        </vxe-table>
        <!-- <div style="height:20px"></div>
        <SearchTerm>
            <a-form-model layout="inline"
                          :model="searchFormDataC"
                          :colon="false">
                <CommonSearchItem ref="commonSearchItem"
                                  :CommonFormInline="searchFormDataC"></CommonSearchItem>
                <a-form-model-item label="指标">
                    <a-select v-model="searchFormDataC.nicheItemsCodeListText"
                              placeholder="请选择">
                        <a-select-option key="1048,1049,1050,1051">1#VOC(以NMHC计)</a-select-option>
                        <a-select-option key="1052,1053,1054,1055">2#VOC(以NMHC计)</a-select-option>
                        <a-select-option key="1056,1057,1058,1059">1#酸排NOx</a-select-option>
                        <a-select-option key="1060,1061,1062,1063">1#工艺排NOx</a-select-option>
                        <a-select-option key="1064,1065,1066,1067">2#酸排NOx</a-select-option>
                        <a-select-option key="1068,1069,1070">COD</a-select-option>
                        <a-select-option key="1071,1072,1073">NH₃-N</a-select-option>
                        <a-select-option key="1074,1075,1076">TP</a-select-option>
                        <a-select-option key="1077,1078,1079">F</a-select-option>
                        <a-select-option key="1080,1081,1082">Cu</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item class="float-right">
                    <a-button type="primary"
                              :loading="loading"
                              @click="iSearchC">查询</a-button>
                    <a-button @click="iRestC">重置</a-button>

                </a-form-model-item>
            </a-form-model>
        </SearchTerm>
        <chart :option="setOption"></chart> -->
    </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { debounce } from "lodash";
import getDictionaryItemObj from "@/utils/dictionary.js";
import { wasteWaterAndGas, wasteWaterAndGasLineChart } from "@/services/envMonth.js";
import dayJs from "dayjs";
import chart from "./chart.vue";
import { tableConversion, findCorporationId, lastMonth } from "./methods.js";
export default {
    components: { chart },
    data () {
        return {
            searchFormData: { dateType: '1', dateStr: lastMonth(), dataType: '' },
            searchFormDataC: { nicheItemsCodeListText: "1048,1049,1050,1051" },
            titleList: null,
            tableData: null,
            loading: false,
            option: {
                title: {
                    text: "{test|废水废气污染物排放统计}", //"作业数量",
                    x: "left",
                    y: "top",
                    z: 1,
                    textStyle: {
                        fontSize: 18,
                        fontWeight: "normal",
                        label: {
                            formatter: "{title|{b}}",
                        },
                        rich: {
                            test: {
                                color: "#333333",
                                height: 48,
                                padding: [0, 0, 0, 20],
                                width: 2000,
                            },
                        },
                    },
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        crossStyle: {
                            color: "#999",
                        },
                    },
                },
                grid: {
                    top: "20%",
                    left: "1%",
                    right: "1%",
                    bottom: "12%",
                    containLabel: true,
                },
                legend: {
                    // left:'45%',
                    // x: "right",
                    // y: "top",
                    z: 2,
                    top: 18,
                    right: 20,
                    data: [
                        "最大排放浓度(mg/l)",
                        "平均排放浓度(mg/l)",
                        "第三方监测浓度(mg/l)",
                    ],
                },
                color: ["#0067CC", "#00CECA", "#9958FF"],
                xAxis: [{
                    type: "category",
                    axisLabel: {
                        // rotate: 40,
                        width: 20,
                        interval: 0,
                    },
                    data: [
                        "1月",
                        "2月",
                        "3月",
                        "4月",
                        "5月",
                        "6月",
                        "7月",
                        "8月",
                        "9月",
                        "10月",
                        "11月",
                        "12月",
                    ],
                    axisPointer: {
                        type: "shadow",
                    },
                }],
                yAxis: [{
                    type: "value",
                    name: "",
                }, {
                    type: "value",
                    name: "",
                }],
                series: [
                    {
                        name: "最大排放浓度(mg/l)",
                        type: "line",
                        stack: "Ad",
                        emphasis: {
                            focus: "series",
                        },
                        barMaxWidth: 50,
                        data: [],
                    },
                    {
                        name: "平均排放浓度(mg/l)",
                        type: "line",
                        yAxisIndex: 1,

                        data: [],
                    },
                    {
                        name: "第三方监测浓度(mg/l)",
                        type: "line",
                        yAxisIndex: 1,

                        data: [],
                    },
                ],
            },
            setOption: undefined,
            tableDataList: [],
            titleListC: null,
            tableDataC: null,
        };
    },
    computed: {},
    created () {
        this.initData();
    },
    mounted () { },
    methods: {
        findCorporationId,
        // 重置
        iRest: debounce(
            function () {
                this.searchFormData = { dateType: '1', dateStr: lastMonth(), dataType: '' };
                this.initData();
            },
            250,
            { leading: true, trailing: false }
        ),
        // 查询
        iSearch () {
            this.initData();
        },
        // 重置
        iRestC: debounce(
            function () {
                this.searchFormDataC = { nicheItemsCodeListText: "1048,1049,1050,1051" };
                this.initData();
            },
            250,
            { leading: true, trailing: false }
        ),
        // 查询
        iSearchC () {
            this.initData();
        },
        initData () {
            wasteWaterAndGas({ ...this.searchFormData }).then((res) => {
                let obj = tableConversion(res.data, 47)
                this.titleList = obj.titleList
                this.tableData = obj.tableData
            });
            if (this.searchFormDataC.nicheItemsCodeListText) {
                this.searchFormDataC.nicheItemsCodeList = this.searchFormDataC.nicheItemsCodeListText.split(',')
            }

            wasteWaterAndGasLineChart({ ...this.searchFormDataC }).then((res) => {
                if (res.data.length) {
                    let monthText = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
                    let v1048 = []
                    let v1049 = []
                    let v1050 = []
                    for (let i = 0; i < res.data.length; i++) {
                        for (let j in res.data[i]) {
                            if (monthText.indexOf(j) > -1) {
                                if (res.data[i].nicheItemsCode == this.searchFormDataC.nicheItemsCodeList[0]) {
                                    v1048[monthText.indexOf(j)] = res.data[i][j] == null ? 0 : res.data[i][j]
                                }
                                if (res.data[i].nicheItemsCode == this.searchFormDataC.nicheItemsCodeList[1]) {
                                    v1049[monthText.indexOf(j)] = res.data[i][j] == null ? 0 : res.data[i][j]
                                }
                                if (res.data[i].nicheItemsCode == this.searchFormDataC.nicheItemsCodeList[2]) {
                                    v1050[monthText.indexOf(j)] = res.data[i][j] == null ? 0 : res.data[i][j]
                                }
                            }
                        }

                    }
                    this.option.series[0].data = v1048
                    this.option.series[1].data = v1049
                    this.option.series[2].data = v1050
                    this.setOption = this.option
                } else {
                    this.setOption = undefined
                }


            });
        },
    },
};
</script>

<style lang="less" scoped>
.shenglvhao {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.title {
    font-size: 16px;
    font-weight: bold;
    color: 16px;
    line-height: 80px;
}
</style>
