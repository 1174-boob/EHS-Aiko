<template>
    <!-- 邀请列表 -->
    <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
        <h3 class="title">在线平均值</h3>
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
        <vxe-table v-if="titleList"
                   border
                   align="center"
                   :data="tableData">
            <vxe-column field="projectName"
                        title="类别"></vxe-column>
            <vxe-column field="nicheItems"
                        title="检测项目"></vxe-column>
            <vxe-colgroup :title="searchFormData.dateStr">
                <vxe-column v-for="(i,index) in titleList"
                            :field="i"
                            :title="findCorporationId(i)"
                            :key="index"></vxe-column>
            </vxe-colgroup>
            <template #empty>
                <div style="padding:16px 0;">
                    <a-empty />
                </div>
            </template>
        </vxe-table>
        <h3 class="title">废气统计图</h3>
        <chart v-for="(i,index) in optionArr"
               :key='index'
               :option="i"></chart>
    </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { debounce } from "lodash";
import getDictionaryItemObj from "@/utils/dictionary.js";
import { meanComparison } from "@/services/envMonth.js";
import { tableConversion, findCorporationId, lastMonth } from "./methods.js";
import dayJs from "dayjs";
import chart from "./chart.vue";
export default {
    components: { chart },
    data () {
        return {
            searchFormData: { dateType: '1', dateStr: lastMonth(), dataType: '' },
            option: {
                title: {
                    text: "1#VOC(以NMHC计)", //"作业数量",
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
                    z: 2,
                    top: 18,
                    right: 20,
                    data: [
                        '1#VOC(以NMHC计)'
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
                        data: [],
                        axisPointer: {
                            type: "shadow",
                        },
                    },
                ],
                yAxis: { name: "" },
                series: [
                    {
                        name: "1#VOC(以NMHC计)",
                        type: "bar",
                        stack: "Ad",
                        emphasis: {
                            focus: "series",
                        },
                        barMaxWidth: 50,
                        data: [],
                    }
                ],
            },
            titleList: null,
            tableData: null,
            optionArr: [],
            loading: false
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
        initData () {
            meanComparison({
                ...this.searchFormData,
            }).then((res) => {
                let obj = tableConversion(res.data, 1049)
                this.titleList = obj.titleList
                console.log(obj.tableData)
                this.tableData = obj.tableData
                if (Object.keys(res.data).length === 0) {
                    this.optionArr = []
                } else {
                    this.optionArr = []
                    this.option.xAxis[0].data = this.titleList.map(findCorporationId);
                    for (let i = 0; i < this.tableData.length; i++) {
                        let option = JSON.parse(JSON.stringify(this.option))
                        option.title.text = this.tableData[i].projectName
                        let dataArr = []
                        for (let key in this.tableData[i]) {
                            if (this.titleList.indexOf(key) > -1) {
                                dataArr.push(this.tableData[i][key])
                            }
                        }
                        option.series[0].data = dataArr;
                        option.series[0].name = this.tableData[i].projectName;
                        option.legend.data[0] = this.tableData[i].projectName;
                        this.optionArr.push(option)
                    }
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
