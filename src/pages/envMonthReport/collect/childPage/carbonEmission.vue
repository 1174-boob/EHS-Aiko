<template>
    <!-- BOE碳排放量 -->
    <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
        <h3 class="title">BOE碳排放量</h3>

        <!-- 列表 -->
        <CommonTable>
            <a-table :columns="boeColumns"
                     :scroll="{ x: 800 }"
                     :data-source="boeTableDataList"
                     :pagination="false"
                     bordered
                     :rowKey="(record, index)=>{return index}">
            </a-table>
        </CommonTable>
        <chart :option="boeOption"></chart>
        <h3 class="title">现地碳排放量（最新月份的数据）</h3>
        <SearchTerm>
            <a-form-model layout="inline"
                          :model="searchFormData"
                          :colon="false">
                <a-form-model-item label="日期筛选">
                    <a-select v-model="searchFormData.dateType"
                              @change="handleChange"
                              placeholder="请选择">
                        <a-select-option key="1">月度</a-select-option>
                        <a-select-option key="2">季度</a-select-option>
                        <a-select-option key="3">半年度</a-select-option>
                        <a-select-option key="4">年度</a-select-option>
                    </a-select>
                    <span style="width:10px;display: inline-block;"></span>
                    <el-date-picker v-if="searchFormData.dateType==1"
                                    v-model="searchFormData.dateStr"
                                    value-format="yyyy-MM"
                                    type="month"
                                    :clearable="false"
                                    placeholder="选择月">
                    </el-date-picker>
                    <template v-if="searchFormData.dateType==2">
                        <el-date-picker v-model="searchFormData.dateStr"
                                        type="year"
                                        :clearable="false"
                                        placeholder="选择年">
                        </el-date-picker>
                        <span style="width:10px;display: inline-block;"></span>
                        <a-select v-model="searchFormData.dataType"
                                  placeholder="请选择">
                            <a-select-option key="1">第一季度</a-select-option>
                            <a-select-option key="2">第二季度</a-select-option>
                            <a-select-option key="3">第三季度</a-select-option>
                            <a-select-option key="4">第四季度</a-select-option>
                        </a-select>
                    </template>
                    <template v-if="searchFormData.dateType==3">
                        <el-date-picker v-model="searchFormData.dateStr"
                                        type="year"
                                        :clearable="false"
                                        placeholder="选择年">
                        </el-date-picker>
                        <span style="width:10px;display: inline-block;"></span>
                        <a-select v-model="searchFormData.dataType"
                                  placeholder="请选择">
                            <a-select-option key="1">上半年</a-select-option>
                            <a-select-option key="2">下半年</a-select-option>
                        </a-select>
                    </template>
                    <template v-if="searchFormData.dateType==4">
                        <el-date-picker v-model="searchFormData.dateStr"
                                        type="year"
                                        :clearable="false"
                                        placeholder="选择年">
                        </el-date-picker>
                    </template>
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
                   :merge-cells="mergeCells"
                   :data="subData">
            <vxe-column field="carBonName1"
                        title="CO2排放量(吨)"
                        width="250">
            </vxe-column>

            <vxe-column v-for="(i,index) in titleList"
                        :key="i.corporationId"
                        :field="i.corporationId"
                        minWidth="160"
                        :title="i.orgAbbrName">
            </vxe-column>
            <template #empty>
                <div style="padding:16px 0;">
                    <a-empty />
                </div>
            </template>
        </vxe-table>

        <chart :option="option"></chart>
    </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { debounce } from "lodash";
import getDictionaryItemObj from "@/utils/dictionary.js";
import { environmentMonthCarbonemissions, listEnvironmentMonthlySubmodule } from "@/services/envMonth.js";
import dayJs from "dayjs";
import chart from "./chart.vue";
import { tableConversion, findData } from "./methods.js";
export default {
    components: { chart },
    data () {
        return {
            loading: false,
            searchFormData: { dateType: '1', dateStr: this.lastMonth(), dataType: '' },
            formData: {},
            mergeCells: [
                //{row: 第几行, col: 第几列, rowspan: 竖向几个, colspan: 横向几个}
                // { row: 3, col: 0, rowspan: 1, colspan: 21 },
            ],
            subData: [],
            titleList: [],
            boeColumns: [
                {
                    title: "CO2排放量(万吨)",
                    dataIndex: "nicheItemsCode",
                    // key: "nicheItemsCode",
                    customRender: (text) => {
                        return findData(text).carBonName ? findData(text).carBonName : '--'
                    },
                    align: "center",
                    fixed: 'left',
                    width: 250,
                },
                {
                    title: "1月",
                    dataIndex: "january",
                    // key: "january",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                    align: "center",
                    width: 150,
                },
                {
                    title: "2月",
                    dataIndex: "february",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                    align: "center",
                    width: 150,
                },
                {
                    title: "3月",
                    dataIndex: "march",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                    align: "center",
                    width: 150,
                },
                {
                    title: "4月",
                    dataIndex: "april",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                    align: "center",
                    width: 150,
                },
                {
                    title: "5月",
                    dataIndex: "may",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                    align: "center",
                    width: 150,
                },
                {
                    title: "6月",
                    dataIndex: "june",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                    align: "center",
                    width: 150,
                },
                {
                    title: "7月",
                    dataIndex: "july",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                    align: "center",
                    width: 150,
                },
                {
                    title: "8月",
                    dataIndex: "august",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                    align: "center",
                    width: 150,
                },
                {
                    title: "9月",
                    dataIndex: "september",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                    align: "center",
                    width: 150,
                },
                {
                    title: "10月",
                    dataIndex: "october",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                    align: "center",
                    width: 150,
                },
                {
                    title: "11月",
                    dataIndex: "november",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                    align: "center",
                    width: 150,
                },
                {
                    title: "12月",
                    dataIndex: "december",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                    align: "center",
                    width: 150,
                },
            ],
            boeTableDataList: [],
            boeOption: {
                title: {
                    text: "{test|二氧化碳每月排放量统计}", //"作业数量",
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
                    bottom: "2%",
                    containLabel: true,
                },
                legend: {
                    // left:'45%',
                    // x: "right",
                    // y: "top",
                    z: 2,
                    top: 18,
                    right: 20,
                    // data: [
                    //     "scope1(万tCO₂e)",
                    //     "scope2(万tCO₂e)",
                    //     "排放强度",
                    // ],
                },
                color: ["#0067CC", "#00CECA", "#9958FF"],
                xAxis: [
                    {
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
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                        name: "万tCO₂e",
                        alignTicks: true,
                        // interval: 100,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "#000000",
                            },
                        },
                    },
                    {
                        type: "value",
                        name: "kgCO₂e/m²",
                        // min: 0,
                        // max: 100,
                        alignTicks: true,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "#000000",
                            },
                        },
                        // axisLabel: {
                        //     // formatter: "{value} %",
                        //     formatter: (v) => {
                        //         return Math.f;
                        //     },
                        // },
                    },
                ],
                series: [
                    {
                        name: "scope1(万tCO₂e)",
                        type: "bar",
                        stack: "Ad",
                        emphasis: {
                            focus: "series",
                        },
                        barMaxWidth: 50,
                        data: [],
                    },
                    {
                        name: "scope2(万tCO₂e)",
                        type: "bar",
                        stack: "Ad",
                        emphasis: {
                            focus: "series",
                        },
                        barMaxWidth: 50,
                        data: [],
                    },
                    {
                        name: "排放强度(kgCO₂e/m²)",
                        type: "line",
                        yAxisIndex: 1,
                        // tooltip: {
                        //     valueFormatter: function (value) {
                        //         return value + " %";
                        //     },
                        // },
                        data: [],
                    },
                ],
            },
            tableDataList: [],
            option: {
                title: {
                    text: "{test|各现地二氧化碳排放量统计}", //"作业数量",
                    x: "left",
                    y: "top",
                    z: 1,
                    textStyle: {
                        fontSize: 28,
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
                    left: "2%",
                    right: "2%",
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
                    // data: [
                    //     "scope1(tCO₂e)",
                    //     "scope2(tCO₂e)",
                    //     "排放强度",
                    // ],
                },
                color: ["#0067CC", "#00CECA", "#9958FF"],
                xAxis: [
                    {
                        type: "category",
                        axisLabel: {
                            // rotate: 40,
                            width: 20,
                            interval: 0,
                        },
                        data: [],
                        axisPointer: {
                            type: "shadow",
                        },
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                        name: "tCO₂e",
                        alignTicks: true,
                        // interval: 100,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "#000000",
                            },
                        },
                    },
                    {
                        type: "value",
                        name: "kgCO₂e/m²",
                        // min: 0,
                        // max: 100,
                        alignTicks: true,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: "#000000",
                            },
                        },
                        // axisLabel: {
                        //     // formatter: "{value} %",
                        //     formatter: (v) => {
                        //         return parseInt(v) + "%";
                        //     },
                        // },
                    },
                ],
                series: [
                    {
                        name: "scope1(tCO₂e)",
                        type: "bar",
                        stack: "Ad",
                        emphasis: {
                            focus: "series",
                        },
                        barMaxWidth: 50,
                        data: [],
                    },
                    {
                        name: "scope2(tCO₂e)",
                        type: "bar",
                        stack: "Ad",
                        emphasis: {
                            focus: "series",
                        },
                        barMaxWidth: 50,
                        data: [],
                    },
                    {
                        name: "排放强度(kgCO₂e/m²)",
                        type: "line",
                        yAxisIndex: 1,
                        // tooltip: {
                        //     valueFormatter: function (value) {
                        //         return value + " %";
                        //     },
                        // },
                        data: [],
                    },
                ],
            },
        };
    },
    computed: {
        corporationList () {
            return this.$store.state.setting.corporationList
        },

    },
    created () {
        this.formData = JSON.parse(JSON.stringify(this.searchFormData));
        this.initData();
    },
    mounted () { },
    methods: {
        lastMonth () {
            const date = new Date();
            const yy = date.getFullYear();
            const mm = date.getMonth();
            if (mm == 0) {
                return `${yy - 1}-12`
            } else {
                return `${yy}-${mm}`
            }
        },
        handleChange (e) {
            if (e == 1 || e == 4) {
                this.searchFormData.dataType = '';
            } else {
                this.searchFormData.dataType = '1';
            }
            if (e != 1) {
                this.searchFormData.dateStr = new Date().getFullYear().toString();
            } else {
                this.searchFormData.dateStr = this.lastMonth();
            }
        },
        // 重置
        iRest: debounce(
            function () {
                this.searchFormData = { dateType: '1', dateStr: this.lastMonth(), dataType: '' };
                this.formData = { dateType: '1', dateStr: this.lastMonth(), dataType: '' };
                this.getSubmodule();
            },
            250,
            { leading: true, trailing: false }
        ),
        // 查询
        iSearch () {
            this.loading = true;
            this.formData = JSON.parse(JSON.stringify(this.searchFormData));
            this.getSubmodule();
        },
        initData () {
            this.getCarbonemissions();
            this.getSubmodule();
        },
        //BOE碳排放量
        async getCarbonemissions () {
            this.boeTableDataList = [];
            this.boeOption.series[0].data = [];
            this.boeOption.series[1].data = [];
            this.boeOption.series[2].data = [];
            const data = await environmentMonthCarbonemissions();
            const res = data.data;
            const boeList = []
            for (let list of res) {
                const code = list.nicheItemsCode;
                if (code == 1002) {
                    boeList[0] = list;
                } else if (code == 1098) {
                    boeList[1] = list;
                } else if (code == 1100) {
                    boeList[2] = list;
                } else if (code == 9999) {
                    boeList[3] = list;
                } else if (code == 1097) {
                    boeList[4] = list;
                } else if (code == 1122) {
                    boeList[5] = list;
                } else if (code == 1103) {
                    boeList[6] = list;
                }
            };
            this.boeTableDataList = boeList;
            const data1 = [];
            const data2 = [];
            const data3 = [];
            for (let item of res) {
                const code = item.nicheItemsCode;
                if (code == 9999) {
                    data1[0] = item.january;
                    data1[1] = item.february;
                    data1[2] = item.march;
                    data1[3] = item.april;
                    data1[4] = item.may;
                    data1[5] = item.june;
                    data1[6] = item.july;
                    data1[7] = item.august;
                    data1[8] = item.september;
                    data1[9] = item.october;
                    data1[10] = item.november;
                    data1[11] = item.december;
                } else if (code == 1097) {
                    data2[0] = item.january;
                    data2[1] = item.february;
                    data2[2] = item.march;
                    data2[3] = item.april;
                    data2[4] = item.may;
                    data2[5] = item.june;
                    data2[6] = item.july;
                    data2[7] = item.august;
                    data2[8] = item.september;
                    data2[9] = item.october;
                    data2[10] = item.november;
                    data2[11] = item.december;
                } else if (code == 1122) {
                    data3[0] = item.january;
                    data3[1] = item.february;
                    data3[2] = item.march;
                    data3[3] = item.april;
                    data3[4] = item.may;
                    data3[5] = item.june;
                    data3[6] = item.july;
                    data3[7] = item.august;
                    data3[8] = item.september;
                    data3[9] = item.october;
                    data3[10] = item.november;
                    data3[11] = item.december;
                }
            }
            this.boeOption.series[0].data = data1;
            this.boeOption.series[1].data = data2;
            this.boeOption.series[2].data = data3;
        },
        //现地碳排放量（最新月份的数据
        async getSubmodule () {
            const params = {
                ...this.formData,
            }
            this.subData = [];
            this.option.xAxis[0].data = [];
            this.option.series[0].data = [];
            this.option.series[1].data = [];
            this.option.series[2].data = [];
            const data = await listEnvironmentMonthlySubmodule(params);
            let obj = tableConversion(data.data, 1002);
            const titleList = obj.titleList;
            const tableData = obj.tableData;
            const boeList = []
            for (let list of tableData) {
                const code = list.nicheItemsCode;
                if (code == 1002) {
                    boeList[0] = list;
                } else if (code == 1098) {
                    boeList[1] = list;
                } else if (code == 1100) {
                    boeList[2] = list;
                } else if (code == 9999) {
                    boeList[3] = list;
                } else if (code == 1097) {
                    boeList[4] = list;
                } else if (code == 1122) {
                    boeList[5] = list;
                } else if (code == 1103) {
                    boeList[6] = list;
                }
            };
            this.subData = boeList;
            const title = [];
            const xAxisData = [];
            for (let i of titleList) {
                const arr = this.corporationList.find(item => item.corporationId == i);
                title.push(arr);
                xAxisData.push(arr.orgAbbrName);
                for (let item of tableData) {
                    const code = item.nicheItemsCode;
                    if (code == 9999) {
                        this.option.series[0].data = [item[i]];
                    } else if (code == 1097) {
                        this.option.series[1].data = [item[i]];
                    } else if (code == 1122) {
                        this.option.series[2].data = [item[i]];
                    }
                }
            }
            this.titleList = title;
            // x轴
            this.option.xAxis[0].data = xAxisData;
            this.loading = false;
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
