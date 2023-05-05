<template>
    <!-- 邀请列表 -->
    <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
        <h3 class="title">废水管理</h3>
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
                                    placeholder="选择月"
                                    :clearable='false'>
                    </el-date-picker>
                    <template v-if="searchFormData.dateType==2">
                        <el-date-picker v-model="searchFormData.dateStr"
                                        type="year"
                                        value-format='yyyy'
                                        placeholder="选择年"
                                        :clearable='false'>
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
                                        value-format='yyyy'
                                        placeholder="选择年"
                                        :clearable='false'>
                        </el-date-picker>
                        <span style="width:10px;display: inline-block;"></span>
                        <a-select v-model="searchFormData.dataType"
                                  placeholder="请选择">
                            <a-select-option key="1">上半年</a-select-option>
                            <a-select-option key="2">下半年</a-select-option>
                        </a-select>
                    </template>
                    <el-date-picker v-if="searchFormData.dateType==4"
                                    v-model="searchFormData.dateStr"
                                    type="year"
                                    value-format='yyyy'
                                    placeholder="选择年"
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
        <!-- 列表 -->
        <vxe-table border
                   resizable
                   align="center"
                   :data="tableData">
            <vxe-column field="carBonName1"
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

        <div style="height:40px"></div>
        <chart :option="setOption"></chart>
    </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { debounce } from "lodash";
import getDictionaryItemObj from "@/utils/dictionary.js";
import { wasteWater } from "@/services/envMonth.js";
import dayJs from "dayjs";
import chart from "./chart.vue";
import { tableConversion, findCorporationId, lastMonth } from "./methods.js";
export default {
    components: { chart },
    data () {
        return {
            page: {
                pageNo: 1,
                pageSize: 10,
                total: 0,
            },
            searchFormData: { dateType: '1', dateStr: lastMonth(), dataType: '' },
            boeTableDataList: [],
            option: {
                title: {
                    text: "排水量统计", //"作业数量",
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
                        "单位面积排水量(m3/m2)",
                        "单位产品基准排水量(m3/m2)",
                    ],
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
                yAxis: { name: "" },
                series: [
                    {
                        name: "单位面积排水量(m3/m2)",
                        type: "bar",
                        stack: "Ad",
                        emphasis: {
                            focus: "series",
                        },
                        barMaxWidth: 50,
                        data: [],
                    },
                    {
                        name: "单位产品基准排水量(m3/m2)",
                        type: "bar",
                        barMaxWidth: 50,
                        data: [],
                    },
                ],
            },
            setOption: undefined,
            columns: [
                {
                    title: "#",
                    dataIndex: "code",
                    key: "code",
                    align: "center",
                    width: 80,
                },
                {
                    title: "B1",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
                {
                    title: "B2",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
                {
                    title: "B3",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
                {
                    title: "B4",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
                {
                    title: "B5",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
                {
                    title: "B6",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
                {
                    title: "B7",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
                {
                    title: "B8",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
                {
                    title: "B9",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
                {
                    title: "B10",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
                {
                    title: "B11",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
                {
                    title: "B12",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
                {
                    title: "B13",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
                {
                    title: "B14",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
                {
                    title: "B15",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
                {
                    title: "B16",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
                {
                    title: "B17",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
                {
                    title: "B18",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
                {
                    title: "B19",
                    dataIndex: "userName",
                    key: "userName",
                    align: "center",
                    width: 150,
                },
            ],
            tableDataList: [],
            titleList: null,
            tableData: null,
            loading: false,
        };
    },
    computed: {},
    created () {

        this.initData();
    },
    mounted () { },
    methods: {
        findCorporationId,
        // 页码改变
        pageNoChange (page) {
            this.page.pageNo = page;
            // 获取列表
            this.initData();
        },
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
        // 字典组每页展示条数改变
        showSizeChange (page, pageSize) {
            this.page.pageNo = 1;
            this.page.pageSize = pageSize;
            this.initData();
        },
        initData () {
            wasteWater({ ...this.searchFormData }).then((res) => {
                if (Object.keys(res.data).length === 0) {
                    this.setOption = undefined
                    this.titleList = null
                    this.tableData = null
                } else {
                    let obj = tableConversion(res.data, 1112)
                    this.titleList = obj.titleList
                    this.tableData = obj.tableData
                    console.log(obj)
                    this.option.xAxis[0].data = this.titleList.map(findCorporationId);
                    for (let i = 0; i < this.tableData.length - 1; i++) {
                        this.option.series[i].data = []
                        for (let j = 0; j < this.titleList.length; j++) {
                            let key = this.titleList[j]
                            console.log(this.option.series[i], i)
                            this.option.series[i].data.push((this.tableData[i][key] || 0))
                        }
                    }
                    this.setOption = this.option
                }

            });
        },
        handleChange (e) {
            if (e == 1 || e == 4) {
                this.searchFormData.dataType = '';
            } else {
                this.searchFormData.dataType = '1';
            }
            if (e != 1) {
                this.searchFormData.dateStr = new Date().getFullYear().toString();
            }
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
