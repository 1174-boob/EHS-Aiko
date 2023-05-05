<template>
    <!-- 邀请列表 -->
    <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
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
                                        value-format="yyyy"
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
                                        value-format="yyyy"
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
                                        value-format="yyyy"
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
        <CommonTable>
            <a-table :columns="columns"
                     :scroll="{ x: 800 }"
                     :data-source="tableDataList"
                     :pagination="false"
                     bordered
                     :rowKey="(record, index)=>{return index}">
                <template slot="dataItemTitle">
                    {{dataObj.dataItem}}
                </template>
                <template slot="upPeriodTitle">
                    {{dataObj.upPeriodDataItem}}
                </template>
                <template slot="upYearTitle">
                    {{dataObj.upYearDataItem}}
                </template>
            </a-table>
        </CommonTable>
        <div class="chain-echarts">

            <Chain v-if="pieceEchartsObj.upPeriodData1122"
                   :chainId="'top1'"
                   :pieceData="pieceEchartsObj.upPeriodData1122"></Chain>
            <Chain v-if="pieceEchartsObj.upYearData1122"
                   :chainId="'top2'"
                   :pieceData="pieceEchartsObj.upYearData1122"></Chain>
            <Chain v-if="pieceEchartsObj.upPeriodData1110"
                   :chainId="'top3'"
                   :pieceData="pieceEchartsObj.upPeriodData1110"></Chain>
            <Chain v-if="pieceEchartsObj.upYearData1110"
                   :chainId="'top4'"
                   :pieceData="pieceEchartsObj.upYearData1110"></Chain>
            <Chain v-if="pieceEchartsObj.upPeriodData1112"
                   :chainId="'top5'"
                   :pieceData="pieceEchartsObj.upPeriodData1112"></Chain>
            <Chain v-if="pieceEchartsObj.upYearData1112"
                   :chainId="'top6'"
                   :pieceData="pieceEchartsObj.upYearData1112"></Chain>
            <Chain v-if="pieceEchartsObj.upPeriodData1113"
                   :chainId="'top7'"
                   :pieceData="pieceEchartsObj.upPeriodData1113"></Chain>
            <Chain v-if="pieceEchartsObj.upYearData1113"
                   :chainId="'top8'"
                   :pieceData="pieceEchartsObj.upYearData1113"></Chain>
            <div class="empty-charts"
                 v-for="(item,index) in pieceLength"></div>

        </div>
    </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { debounce } from "lodash";
import getDictionaryItemObj from "@/utils/dictionary.js";
import Chain from "./component/Chain.vue"
import {
    environmentMonthRingratio //单耗环比
} from "@/services/envMonth.js";
import dayJs from "dayjs";
import { tableConversion, lastMonth, findData } from "./methods.js";
export default {
    components: { Chain },
    mixins: [cancelLoading],
    data () {
        return {
            // pieceData: {
            //     name:"GHG（kgCO2e/m2）",
            //     time:["2022M8","2022M9"],
            //     num:[107.11,131]
            // },
            pieceLength: 0,
            searchFormData: { dateType: '1', dateStr: this.lastMonth(), dataType: '' },
            // formData:{},
            pieceEchartsObj: {},
            dataObj: {
                dataItem: '2022-09', //当期
                upPeriodDataItem: '2022-08', //上期
                upYearDataItem: "2021-09", //去年同期值
            },
            columns: [
                {
                    title: "指标",
                    dataIndex: "nicheItemsCode",
                    customRender: (text) => {
                        return findData(text).pieceName ? findData(text).pieceName : '--'
                    },
                    align: "center",
                    width: 250,
                },
                {
                    scopedSlots: {
                        title: 'dataItemTitle'
                    },
                    dataIndex: "dataItem",
                    key: "dataItem",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                    align: "center",
                    width: 150,
                },
                {
                    scopedSlots: {
                        title: 'upPeriodTitle'
                    },
                    dataIndex: "upPeriodDataItem",
                    key: "upPeriodDataItem",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                    align: "center",
                    width: 150,
                },
                {
                    title: "环比(%)",
                    dataIndex: "ringRatio",
                    key: "ringRatio",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                    align: "center",
                    width: 150,
                },

                {
                    scopedSlots: {
                        title: 'upYearTitle'
                    },
                    dataIndex: "upYearDataItem",
                    key: "upYearDataItem",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                    align: "center",
                    width: 150,
                },
                {
                    title: "同比(%)",
                    dataIndex: "withThan",
                    key: "withThan",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                    align: "center",
                    width: 150,
                },
            ],
            tableDataList: [],
            checkItemList: null,
        };
    },
    computed: {},
    created () {
        this.checkItemList = getDictionaryItemObj("taskCheckStatus");
        // this.formData = JSON.parse(JSON.stringify(this.searchFormData));
        this.initData();
    },
    mounted () {
    },
    methods: {
        monthChange (month) {
            console.log(month);
        },
        yearChange (value) {
            console.log(value);
        },
        dataTypeChange (key, value) {
            const text = value.componentOptions.children[0].text;
            console.log(key, text);
        },
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
            console.log("eee", e);
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
        // 页码改变
        pageNoChange (page) {
            this.page.pageNo = page;
            // 获取列表
            this.initData();
        },
        // 重置
        iRest: debounce(
            function () {
                this.searchFormData = { dateType: '1', dateStr: this.lastMonth(), dataType: '' };
                // this.formData = {dateType: '1', dateStr: this.lastMonth(), dataType: ''};
                this.initData();
            },
            250,
            { leading: true, trailing: false }
        ),
        // 查询
        iSearch () {
            // this.formData = JSON.parse(JSON.stringify(this.searchFormData));
            this.handleLoading();
            this.initData();
        },
        // 字典组每页展示条数改变
        showSizeChange (page, pageSize) {
            this.page.pageNo = 1;
            this.page.pageSize = pageSize;
            this.initData();
        },
        initData () {
            const formData = this.searchFormData;
            const dateType = formData.dateType;
            const dateStr = formData.dateStr; //当期时间
            const dataType = formData.dataType; //季度或者上下半年
            if (dateType == 1) {
                let cm = dateStr.split("-")[1];
                let cYear = dateStr.split("-")[0];
                if (cm == 1) {
                    var upPeriod = cYear - 1 + "-12";
                } else {
                    let last = cm - 1;
                    let lastM = last >= 10 ? last : "0" + last;
                    var upPeriod = cYear + "-" + lastM;
                }
                this.dataObj = {
                    dataItem: dateStr, //当期
                    upPeriodDataItem: upPeriod, //上期
                    upYearDataItem: cYear - 1 + '-' + cm, //去年同期值
                };
            } else if (dateType == 2) {
                let jidu = ['第一季度', '第二季度', '第三季度', '第四季度'];
                const ind = dataType - 1;
                if (ind == 0) {
                    var lastJidu = dateStr - 1 + '第四季度';
                } else {
                    var lastJidu = dateStr + jidu[dataType - 2];
                }
                this.dataObj = {
                    dataItem: dateStr + jidu[ind], //当期
                    upPeriodDataItem: lastJidu, //上期
                    upYearDataItem: dateStr - 1 + jidu[ind], //去年同期值
                };
            } else if (dateType == 3) {
                let half = ['上半年', '下半年'];
                const ind = dataType - 1;
                if (dataType == 1) {
                    var halfYear = dateStr - 1 + '下半年';
                } else {
                    var halfYear = dateStr + "上半年";
                }
                this.dataObj = {
                    dataItem: dateStr + half[ind], //当期
                    upPeriodDataItem: halfYear, //上期
                    upYearDataItem: dateStr - 1 + half[ind], //去年同期值
                };
            } else if (dateType == 4) {
                this.dataObj = {
                    dataItem: dateStr, //当期
                    upPeriodDataItem: dateStr - 1, //上期
                    upYearDataItem: dateStr - 1, //去年同期值
                };
            }
            this.pieceEchartsObj = {};
            this.tableDataList = [];
            this.cancelLoading();
            environmentMonthRingratio({
                ...this.searchFormData,
            }).then((res) => {
                const data = res.data;
                const dataSource = [];
                const codes = ['1122', '1110', '1112', '1113'];

                if (Object.keys(data).length == 0) {
                    //
                } else {
                    const keys = Object.keys(data);
                    const codeKey = codes.filter(val => {
                        return keys.indexOf(val) >= 0
                    });
                    const pieceEchartsObj = {};
                    for (let item of codeKey) {
                        let obj = data[item][0];
                        let name1 = "upPeriodData" + item;
                        let name2 = "upYearData" + item;
                        let pieceData1 = {
                            name: findData(item).pieceName,
                            time: [this.dataObj.dataItem, this.dataObj.upPeriodDataItem],
                            num: [obj.dataItem, obj.upPeriodDataItem],
                        }
                        let pieceData2 = {
                            name: findData(item).pieceName,
                            time: [this.dataObj.dataItem, this.dataObj.upYearDataItem],
                            num: [obj.dataItem, obj.upYearDataItem],
                        }
                        dataSource.push(obj);
                        pieceEchartsObj[name1] = pieceData1;
                        pieceEchartsObj[name2] = pieceData2;
                    }
                    this.pieceEchartsObj = pieceEchartsObj;
                    this.tableDataList = dataSource;
                    const len = Object.keys(this.pieceEchartsObj).length;
                    this.pieceLength = len % 4;
                }
            });
        },
    },
};
</script>

<style lang="less" scoped>
.chain-echarts {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .empty-charts {
        width: 23%;
        height: 420px;
    }
}
</style>
