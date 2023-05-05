<template>
    <!-- 邀请列表 -->
    <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
        <SearchTerm>
            <a-form-model layout="inline"
                          :model="searchFormData"
                          :colon="false">
                <a-form-model-item label="设备状态">
                    <a-select v-model="searchFormData.equipmentStatus"
                              placeholder="请选择"
                              allowClear>
                        <a-select-option v-for="item in optionList"
                                         :key="item.value"
                                         :value="item.key">{{ item.value }}</a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="编号/设备ID">
                    <a-input v-model="searchFormData.equipmentCode"
                             placeholder="请输入编号/设备ID" />
                </a-form-model-item>
                <a-form-model-item label="创建时间">
                    <el-date-picker v-model="searchFormData.timeArr"
                                    type="daterange"
                                    range-separator="-"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
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
        <CommonTable :page="page"
                     :pageNoChange="pageNoChange"
                     :showSizeChange="showSizeChange">
            <a-table :columns="columns"
                     :scroll="{ x: 800 }"
                     :data-source="tableDataList"
                     :pagination="false"
                     :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,fixed:true }"
                     rowKey="equipmentId"
                     bordered>
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
                    title: "设备ID",
                    dataIndex: "equipmentCode",
                    key: "equipmentCode",
                    align: "center",
                },
                {
                    title: "设备名称",
                    dataIndex: "equipmentName",
                    key: "equipmentName",
                    align: "center",
                },
                {
                    title: "设备类型",
                    dataIndex: "equipmentType",
                    key: "equipmentType",
                    align: "center",
                },
                {
                    title: "区域",
                    dataIndex: "equipmentRegion",
                    key: "equipmentRegion",
                    align: "center",
                },
                {
                    title: "设备状态",
                    dataIndex: "equipmentStatus",
                    key: "equipmentStatus",
                    align: "center",
                    customRender: (text) => {
                        if (text == '0') {
                            return '在用'
                        } else if (text == '1') {
                            return '停用'
                        } else {
                            return '拆除'
                        }

                    },
                },
                {
                    title: "责任担当",
                    dataIndex: "responsibility",
                    key: "responsibility",
                    align: "center",
                }, {
                    title: "设备量产时间",
                    dataIndex: "equipmentProductionDate",
                    key: "equipmentProductionDate",
                    align: "center",
                }, {
                    title: "安全认证时间",
                    dataIndex: "securityCertificationDate",
                    key: "securityCertificationDate",
                    align: "center",
                }, {
                    title: "安全认证周期",
                    dataIndex: "securityCertificationCycle",
                    key: "securityCertificationCycle",
                    align: "center",
                }, {
                    title: "下次安全认证时间",
                    dataIndex: "nextCertificationDate",
                    key: "nextCertificationDate",
                    align: "center",
                }
            ],
            tableDataList: [],
            tableRowKey: 'equipmentId',
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
            this.cancelLoading();
            if (this.searchFormData.timeArr) {
                this.searchFormData.securityCertificationStartDate = this
                    .searchFormData.timeArr[0]
                    ? dayJs(this.searchFormData.timeArr[0]).format(
                        "YYYY-MM-DD"
                    )
                    : "";
                this.searchFormData.securityCertificationEndDate = this.searchFormData
                    .timeArr[1]
                    ? dayJs(this.searchFormData.timeArr[1]).format(
                        "YYYY-MM-DD"
                    )
                    : "";
            }
            getDeviceInfoList({ ...this.searchFormData, ...this.page }).then(res => {
                this.tableDataList = res.data.list.map(item => {
                    item.corporationName = item.corporationId ? findCorporationId(item.corporationId) : '--'
                    return item
                })
                this.page.total = res.data.total
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
