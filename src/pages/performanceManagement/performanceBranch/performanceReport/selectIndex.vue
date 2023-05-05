<template>
    <!-- 邀请列表 -->
    <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
        <SearchTerm>
            <a-form-model layout="inline"
                          :model="searchFormData"
                          :colon="false">
                <a-form-model-item label="指标名称">
                    <a-input v-model="searchFormData.indexInfo"
                             placeholder="请输入指标名称"></a-input>
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
        <CommonTable :page="page"
                     :pageNoChange="pageNoChange"
                     :showSizeChange="showSizeChange">
            <a-table :columns="columns"
                     :scroll="{ x: 800 }"
                     :data-source="tableDataList"
                     :pagination="false"
                     :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,fixed:true }"
                     rowKey="id"
                     bordered>
                <div slot="deductPoints"
                     slot-scope="record">
                    <p v-for="(i,index) in record"
                       :key="index">{{i}}</p>
                </div>
                <div slot="unit"
                     slot-scope="record">
                    <p v-for="(i,index) in record"
                       :key="index">{{i}}</p>
                </div>
                <div slot="deductScore"
                     slot-scope="record">
                    <p v-for="(i,index) in record"
                       :key="index">{{i}}</p>
                </div>
            </a-table>
        </CommonTable>
    </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import getDictionaryItemObj from "@/utils/dictionary.js";
import UploadBtnStyle from "@/components/upload/uploadStyleXt.vue";
import { cloneDeep, debounce } from "lodash";
import { getDeviceInfoList } from "@/services/deviceSafety.js";
import { getKpiIndexList } from "@/services/performanceManagementBranch.js";
import serviceNameList from "@/config/default/service.config.js";
import { findCorporationId } from '@/utils/common.js'
import teableSelected from "@/mixin/teableSelected";
import dayJs from "dayjs";
export default {
    components: { UploadBtnStyle },
    mixins: [cancelLoading, teableSelected],
    props: {
        selectedRowOld: {
            type: Array,
            default: () => []
        },
        // corporationId: {
        //     required: true
        // },
    },
    data () {
        return {
            page: {
                pageNo: 1,
                pageSize: 10,
                total: 0,
            },
            searchFormData: {},
            optionList: [
                {
                    key: '0',
                    value: '在用'
                }, {
                    key: '1',
                    value: '停用'
                }, {
                    key: '2',
                    value: '拆除'
                }
            ],
            columns: [
                {
                    title: '指标类型',
                    scopedSlots: { customRender: 'indexType' },
                    width: 200,
                    customRender: v => {
                        return v == 1 ? '固定指标' : '自定义指标'
                    }
                },
                {
                    title: '指标名称',
                    dataIndex: 'indexInfo',
                    width: 200,
                },
                {
                    title: '风险分值',
                    dataIndex: 'riskScore',
                    width: 100,
                },
                {
                    title: '扣分标准',
                    scopedSlots: { customRender: 'deductPoints' },
                    dataIndex: 'deductPoints',
                    width: 200,
                },
                {
                    title: '指标单位',
                    scopedSlots: { customRender: 'unit' },
                    dataIndex: 'unit',
                    width: 100,
                },
                {
                    title: '扣分分值',
                    scopedSlots: { customRender: 'deductScore' },
                    dataIndex: 'deductScore',
                    width: 100,
                },
                {
                    title: '备注',
                    dataIndex: 'remake',
                    width: 200,
                },
                {
                    title: '修改人',
                    dataIndex: 'updateUserName',
                    width: 200,
                },
            ],
            tableDataList: [],
            tableRowKey: 'id',
            selectedRowKeys: [],
            selectedRow: [],
        };
    },
    computed: {},
    created () {
        this.selectedRow = cloneDeep(this.selectedRowOld)
        this.selectedRowKeys = this.selectedRowOld.map(item => item[this.tableRowKey]).filter(item => item || item === 0)
        this.initData();
    },
    mounted () { },
    methods: {
        // 页码改变
        pageNoChange (page) {
            this.page.pageNo = page;
            // 获取列表
            this.initData();
        },
        // 重置
        iRest: debounce(
            function () {
                this.page = {
                    pageNo: 1,
                    pageSize: 10,
                    total: 0,
                };
                this.searchFormData = {};
                this.initData();
            },
            250,
            { leading: true, trailing: false }
        ),
        // 查询
        iSearch () {
            this.page = {
                pageNo: 1,
                pageSize: 10,
                total: 0,
            };
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
            getKpiIndexList({ ...this.searchFormData, ...this.page }).then(res => {
                this.tableDataList = res.data.list.map(i => {
                    i.deductPoints = i.indexItems.map(item => item.deductPoints)
                    i.unit = i.indexItems.map(item => item.unit)
                    i.deductScore = i.indexItems.map(item => item.deductScore)
                    return i
                })
                this.page.total = res.data.total
            })
        },
        //处理一下数据
        dispose (data) {
            let arr = data.map(i => {
                i.deductPoints = i.indexItems.map(item => item.deductPoints)
                i.unit = i.indexItems.map(item => item.unit)
                i.deductScore = i.indexItems.map(item => item.deductScore)
                return i
            })
            return arr
        },
        //
        // onSelectChange (e) {
        //     console.log(e)
        //     this.selectedRowKeys = e
        // }
    },
};
</script>

<style lang="less" scoped>
.shenglvhao {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>
