<template>
    <!-- 邀请列表 -->
    <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
        <SearchTerm>
            <a-form-model layout="inline"
                          :model="searchFormData"
                          :colon="false">
                <a-form-model-item class="flex"
                                   label="配置状态">
                    <a-select v-model="searchFormData.configStatus"
                              placeholder="请选择配置状态">
                        <a-select-option v-for="item in configStatusList"
                                         :key="item.key"
                                         :value="item.key">{{item.value}}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="部门名称">
                    <a-input v-model="searchFormData.deptName"
                             placeholder="请输入部门名称"></a-input>
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

        <a-table :columns="columns"
                 :scroll="{ x: 800 }"
                 :data-source="tableDataList"
                 :pagination="false"
                 :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,fixed:true }"
                 rowKey="id"
                 bordered>
        </a-table>
    </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import getDictionaryItemObj from "@/utils/dictionary.js";
import UploadBtnStyle from "@/components/upload/uploadStyleXt.vue";
import { cloneDeep, debounce } from "lodash";
import { getDeviceInfoList } from "@/services/deviceSafety.js";
import { selectDeptList } from "@/services/performanceManagementBranch.js";
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
            configStatusList: [
                {
                    key: "1",
                    value: "未配置"
                },
                {
                    key: "2",
                    value: "已配置"
                }
            ],
            columns: [
                {
                    title: '部门',
                    dataIndex: 'deptName',
                },
                {
                    title: '配置状态',
                    dataIndex: 'configStatus',
                    customRender: v => {
                        return v == 1 ? '未配置' : v == 2 ? '已配置' : '--'
                    }
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
            this.initData();
        },
        // 字典组每页展示条数改变
        showSizeChange (page, pageSize) {
            this.page.pageNo = 1;
            this.page.pageSize = pageSize;
            this.initData();
        },
        initData () {
            selectDeptList({ ...this.searchFormData, ...this.page }).then(res => {
                this.tableDataList = res.data
            })
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
