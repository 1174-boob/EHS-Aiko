<template>
    <!-- 邀请列表 -->
    <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
        <h3 class="title">BOE天然气数据</h3>

        <!-- 列表 -->
        <CommonTable>
            <a-table :columns="boeColumns"
                     :scroll="{ x: 800 }"
                     :data-source="boeTableDataList"
                     :pagination="false"
                     bordered>
            </a-table>
        </CommonTable>

        <h3 class="title">现地天然气数据（最新月份的数据）</h3>
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
                                        value-format="yyyy"
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
                                        value-format="yyyy"
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
                                    value-format="yyyy"
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
        <vxe-table border
                   resizable
                   align="center"
                   :data="tableData">
            <vxe-column field="carBonName"
                        title="项目"
                        min-width="220"></vxe-column>

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
    </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import { debounce } from "lodash";
import getDictionaryItemObj from "@/utils/dictionary.js";
import { naturalBOE, naturalLocal } from "@/services/envMonth.js";
import dayJs from "dayjs";
import chart from "./chart.vue";
import { tableConversion, findCorporationId, findData, lastMonth } from "./methods.js";
export default {
    components: { chart },
    data () {
        return {
            searchFormData: { dateType: '1', dateStr: lastMonth(), dataType: '' },
            boeColumns: [
                {
                    title: "#",
                    dataIndex: "nicheItemsCode",
                    key: "nicheItemsCode",
                    align: "center",
                    customRender: (text) => {
                        return findData(text).carBonName ? findData(text).carBonName : '--'
                    },
                    width: 250,

                },
                {
                    title: "1月",
                    dataIndex: "january",
                    key: "january",
                    align: "center",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                },
                {
                    title: "2月",
                    dataIndex: "february",
                    key: "february",
                    align: "center",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                },
                {
                    title: "3月",
                    dataIndex: "march",
                    key: "march",
                    align: "center",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                },
                {
                    title: "4月",
                    dataIndex: "april",
                    key: "april",
                    align: "center",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                },
                {
                    title: "5月",
                    dataIndex: "may",
                    key: "may",
                    align: "center",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                },
                {
                    title: "6月",
                    dataIndex: "june",
                    key: "june",
                    align: "center",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                },
                {
                    title: "7月",
                    dataIndex: "july",
                    key: "july",
                    align: "center",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                },
                {
                    title: "8月",
                    dataIndex: "august",
                    key: "august",
                    align: "center",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                }, {
                    title: "9月",
                    dataIndex: "september",
                    key: "september",
                    align: "center",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                }, {
                    title: "10月",
                    dataIndex: "october",
                    key: "october",
                    align: "center",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                }, {
                    title: "11月",
                    dataIndex: "november",
                    key: "november",
                    align: "center",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                },
                {
                    title: "12月",
                    dataIndex: "december",
                    key: "december",
                    align: "center",
                    customRender: (text) => {
                        return text ? text : '--'
                    },
                },
            ],
            boeTableDataList: [],
            titleList: null,
            tableData: null,
            loading: false,
            page: {}
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
                this.searchFormData = { dateType: '1', dateStr: lastMonth(), dataType: '' }
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
            naturalBOE({}).then((res) => {
                this.boeTableDataList = res.data
            });
            naturalLocal({ ...this.searchFormData }).then((res) => {
                let obj = tableConversion(res.data, 1005)
                this.titleList = obj.titleList
                this.tableData = obj.tableData
                console.log(obj)
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
