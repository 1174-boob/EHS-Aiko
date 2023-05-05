<template>
    <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
        <PageTitle>管理绩效数据</PageTitle>
        <SearchTerm>
            <a-form-model layout="inline"
                          :model="formInline"
                          :colon="false">
                <CommonDept ref="commonDept"
                            :CommonFormInline="formInline" :isAllCorporation="true"></CommonDept>
                <a-form-model-item label="年份">
                    <a-date-picker v-model="formInline.year"
                                   mode="year"
                                   format="YYYY"
                                   valueFormat="YYYY"
                                   @panelChange="yearChange" />
                </a-form-model-item>
                <a-form-model-item label="季度">
                    <a-select v-model="formInline.quarter"
                              placeholder="请选择季度">
                        <a-select-option v-for="item in quarterList"
                                         :key="item.key"
                                         :value="item.key">{{item.value}}</a-select-option>
                    </a-select>
                </a-form-model-item>

                <!-- 搜索栏按钮需要加固定的float-right类名 -->
                <a-form-model-item class="float-right">
                    <a-button type="primary"
                              :loading="loading"
                              @click="iSearch">查询</a-button>
                    <a-button @click="iRest">重置</a-button>
                </a-form-model-item>
            </a-form-model>
        </SearchTerm>
        <DashBtn>
            <div>
                <a-button type="dashed"
                          @click="toDataFilling">数据填报</a-button>
                <a-button type="dashed"
                          @click="exportExcel">批量导出</a-button>
            </div>
        </DashBtn>
        <CommonTable :spinning="tableSpinning" :page="page"
                     :pageNoChange="pageNoChange"
                     :showSizeChange="onShowSizeChange">
            <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, fixed: true }"
                     :columns="columns"
                     :scroll="{ x: tableScrollX() }"
                     :locale="{emptyText: emptyText}"
                     :data-source="tableDataList"
                     :rowKey="(record, index)=>{return record.id}"
                     :pagination="false">
                <div slot="createUser"
                     slot-scope="record">
                    {{record.workNum ? record.createUser + "/" + record.workNum : record.createUser}}
                </div>
                <div slot="quarter"
                     slot-scope="record">
                    {{getMappingValue(quarterList, "key", record.quarter).value}}
                </div>
                <div slot="infoStatus"
                     slot-scope="record">
                    {{getMappingValue(statusList, "dictValue", record.infoStatus).dictLabel}}
                </div>
                <div slot="action"
                     slot-scope="record">
                    <span class="color-0067cc cursor-pointer m-r-15"
                          @click="actionDetail(record)">查看</span>
                          <!-- 审批中、审批通过不可编辑 -->
                    <span class="color-0067cc cursor-pointer m-r-15" v-if="!(record.infoStatus == 'APPROVAL_OVER' || record.infoStatus == 'APPRAVAL_INFO')"
                          @click="actionEdit(record)">编辑</span>
                          <!-- 只有草稿状态可以删除 -->
                    <span class="color-red cursor-pointer" v-if="record.infoStatus == 'DRAFT'"
                          @click="actionDelete(record)">删除</span>
                </div>
            </a-table>
        </CommonTable>

    </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { formValidator } from "@/utils/clx-form-validator.js";
// import rowspanMethod from "@/utils/rowspanMethod.js";
import dictionary from '@/utils/dictionary'

import { debounce } from 'lodash';
import { cloneDeep } from 'lodash'
import { orgDataSelect, orgDataDelete, orgDataExport } from "@/services/performanceManagement.js";
export default {
    mixins: [teableCenterEllipsis, cancelLoading],
    data () {
        return {
            tableSpinning:false,
            statusList: [],
            quarterList: [
                {
                    key: 1,
                    value: "第一季度"
                },
                {
                    key: 2,
                    value: "第二季度"
                },
                {
                    key: 3,
                    value: "第三季度"
                },
                {
                    key: 4,
                    value: "第四季度"
                },
            ],
            formInline: {},
            preFormInline: {},
            page: {
                pageNo: 1,
                pageSize: 10,
                total: 0
            },
            selectedRowKeys: [],

            columns: [
                {
                    title: '年份',
                    dataIndex: 'year',
                    width: 100,
                },
                {
                    title: '统计季度',
                    scopedSlots: { customRender: 'quarter' },
                    width: 100,
                },
                {
                    title: '得分',
                    dataIndex: 'score',
                    width: 100,
                },
                {
                    title: '填报人',
                    dataIndex: 'updateUserId',
                    width: 200,
                },
                {
                    title: '填报时间',
                    dataIndex: 'updateTime',
                    minWidth: 200,
                },
                {
                    title: '状态',
                    scopedSlots: { customRender: 'infoStatus' },
                    fixed: 'right', // 固定操作列
                    width: 150,
                },
                {
                    title: '操作',
                    scopedSlots: { customRender: 'action' },
                    fixed: 'right', // 固定操作列
                    width: 200 // 宽度根据操作自定义设置
                }
            ],
            tableDataList: [],

        }
    },
    created () {
        this.setRouterCode("performanceData");
        this.initConfigPage()
        this.columns.splice(1, 0, this.addCommonColumnItem(200));
        this.getDataList();
    },
    activated() {
        setTimeout(() => {
        if(!this.keepalive){
            this.initConfigPage()
            this.iRest()
        }
        }, 20);
    },
    methods: {
        initConfigPage(){
            this.statusList = this.getMappingValue(this.dictTypeData, "dictType", "kpi_node").dictItem;
        },
        yearChange (val) {
            this.$set(this.formInline, "year", val.format('YYYY'));
        },
        onSelectChange (selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys;
        },
        // 导出Excel
        async exportExcel () {
            let para = {
                id: [ ...this.selectedRowKeys ],
                pageSize: this.page.pageSize,
                pageNo: this.page.pageNo
            }
            try {
                const res = await orgDataExport(para)
                if (res) {
                    const name = '管理绩效数据导出'
                    const blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
                    const downloadElement = document.createElement('a')
                    const href = URL.createObjectURL(blob) //创建下载链接
                    downloadElement.href = href
                    downloadElement.download = name + '.xlsx'
                    document.body.appendChild(downloadElement)
                    downloadElement.click()
                    document.body.removeChild(downloadElement)// 下载完成移除元素
                    window.URL.revokeObjectURL(href) // 释放掉blob对象
                }
            } catch (err) {
                console.log(err);
            }

        },
        // 填报数据报表
        toDataFilling () {
            this.$router.push({
                path: "/ehsGerneralManage/performanceManagement/dataFilling"
            })
        },
        // 查询
        iSearch () {
            this.preFormInline = { ...this.formInline };
            this.page = {
                pageNo: 1,
                pageSize: 10,
                total: 0,
            }
            // 获取列表
            this.getDataList()
                .finally(() => {
                    this.cancelLoading();
                })
        },
        // 重置
        iRest: debounce(function () {
            this.$refs.commonDept.reset();
            this.page = {
                pageNo: 1,
                pageSize: 10,
                total: 0,
            }
            this.formInline = {};
            this.preFormInline = {};
            this.getDataList()
        }, 250, { leading: true, trailing: false }),
        // 编辑
        actionEdit (record) {
            this.$router.push({
                path: "/ehsGerneralManage/performanceManagement/dataFillingEdit",
                query: { 
                    id: record.id
                    // corporationId: record.corporationId,
                    // year: record.year,
                    // quarter: record.quarter,
                }
            })
        },
        actionDetail (record) {
            this.$router.push({
                path: "/ehsGerneralManage/performanceManagement/dataFillingView",
                query: { 
                    id: record.id
                    // corporationId: record.corporationId,
                    // year: record.year,
                    // quarter: record.quarter,
                }
            })
        },
        // 删除
        actionDelete (record) {
            // if (!this.canClickBtnMixin("performanceData-del")) {
            //   return;
            // }
            if (record.infoStatus != "DRAFT") {
                this.$antMessage.warn("非草稿状态，不可删除！");
                return;
            }
            this.$antConfirm({
                title: '删除提示',
                content: '本操作不可恢复，确定继续？',
                cancelText: '取消',
                onOk: () => {
                    orgDataDelete({
                        id: record.id,
                    }).then(res => {
                        this.$antMessage.success('删除成功');
                        this.getDataList();
                    }).catch(err => {
                        console.log(err);
                    })
                }
            })



        },
        
        
        
        getDataList () {
            let params = {
                ...this.preFormInline,
                pageSize: this.page.pageSize,
                pageNo: this.page.pageNo
            }
            this.tableSpinning = true
            return orgDataSelect(params).then((res) => {
                this.addLoading = false;
                this.tableDataList = res.data.list || [];
                this.page.total = res.data.total;
            }).catch((err) => {
                console.log(err);
            })
            .finally(()=>{
                this.tableSpinning = false
            })
        },
       
        
        
        // 页码改变
        pageNoChange (page) {
            this.page.pageNo = page;
            // 获取列表
            this.getDataList();
        },
        onShowSizeChange (current, pageSize) {
            this.page.pageNo = 1;
            this.page.pageSize = pageSize;
            this.getDataList();
        },

    }
}
</script>
<style lang="less" scoped>
/deep/ td {
    img {
        width: 30px;
        height: 30px;
    }
}
.head-portrait {
    width: 50px;
    height: 50px;
}
</style>