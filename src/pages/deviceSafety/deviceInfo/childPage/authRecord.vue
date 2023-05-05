<template>
    <!-- 设备安全认证履历 -->
    <HasSpinAndBtnBox :spinning="false">
        <div class="clx-flex-1">
            <div class="baseInfo">

                <a-row type="flex"
                    justify="space-around">
                    <a-col :span="4">
                        所属组织：{{recordInfo.corporationName||'--'}}
                    </a-col>
                    <a-col :span="4">
                        部门： {{recordInfo.deptName}}
                    </a-col>
                    <a-col :span="4">
                        设备ID： {{recordInfo.equipmentCode}}
                    </a-col>
                    <a-col :span="4">
                        设备名称：{{recordInfo.equipmentName}}
                    </a-col>

                </a-row>
                <a-row type="flex"
                    class="bottom"
                    justify="space-around">

                    <a-col :span="4">
                        设备类型：{{recordInfo.equipmentType}}
                    </a-col>
                    <a-col :span="4">
                        区域： {{recordInfo.equipmentRegion}}
                    </a-col>
                    <a-col :span="4">
                        设备量产时间：{{recordInfo.equipmentProductionDate}}
                    </a-col>
                    <a-col :span="4">
                        初次认证时间：{{recordInfo.initialCertificationDate}}
                    </a-col>
                </a-row>

            </div>
            <DashBtn>
                <div>
                    <a-button type="dashed"
                            @click="handelDownload">导出</a-button>
                </div>
                <div class="ttips">

                </div>
            </DashBtn>
        </div>

        <FixedBottom slot="fixedBottom">
            <a-button @click="goBack">返回</a-button>
        </FixedBottom>

        <CommonTable>
            <a-table :columns="columns"
                     :data-source="tableDataList"
                     :pagination="false"
                     bordered>
                <div slot="report"
                     slot-scope="record">
                    <span class="color-0067cc cursor-pointer"
                          @click="handleDownloadPdf(record.certificationReport)">认证报告.pdf</span>
                </div>
                <div slot="action"
                     slot-scope="record">
                    <span class="color-0067cc cursor-pointer"
                          @click="handleCheckInfo(record)">查看</span>
                </div>
            </a-table>
        </CommonTable>
    </HasSpinAndBtnBox>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import getDictionaryItemObj from "@/utils/dictionary.js";
import { debounce } from "lodash";
import { recordList, recordExport } from "@/services/deviceSafety.js";
import { formValidator } from "@/utils/clx-form-validator.js";
import StaffOrDept from "@/components/staffOrDept";
import { getPortraitUrlt } from "@/services/api.js";
import dayJs from "dayjs";
export default {
    data () {
        return {
            countInfo: {},
            curIndex: null,
            columns: [
                {
                    title: "责任担当",
                    dataIndex: "responsibilityName",
                    key: "responsibilityName",
                    align: "center",
                },
                {
                    title: "本次认证时间",
                    dataIndex: "thisCertificationDate",
                    key: "thisCertificationDate",
                    align: "center",
                },
                {
                    title: "本次认证有效期",
                    dataIndex: "thisCertificationValid",
                    key: "thisCertificationValid",
                    align: "center",
                    customRender: v => {
                        return v ? v + '年' : '--'
                    }
                },
                {
                    title: "本次认证结论",
                    dataIndex: "thisCertificationConclusion",
                    key: "thisCertificationConclusion",
                    align: "center",
                    customRender: (v) => {
                        return v == 1 ? '合格' : '不合格'
                    },
                },
                {
                    title: "不合格原因",
                    dataIndex: "unqualifiedReason",
                    key: "unqualifiedReason",
                    align: "center",
                },
                {
                    title: "认证报告",
                    scopedSlots: { customRender: "report" },
                    key: "report",
                    align: "center",
                    width: 200, // 宽度根据操作自定义设置
                },
                {
                    title: "操作",
                    scopedSlots: { customRender: "action" },
                    key: "action",
                    align: "center",
                    fixed: "right", // 固定操作列
                    width: 150, // 宽度根据操作自定义设置
                },
            ],
            tableDataList: null,
            //弹框
            loading: false,
            equipmentId: null,
            recordInfo: {}
        };
    },
    components: {},
    computed: {},
    created () {
        this.equipmentId = this.$route.query.Id
        this.initData()
    },
    methods: {
        goBack(){
            this.setKeepalive(true)
            this.$router.go(-1)
        },
        handelDownload () {
            console.log('下载')
            recordExport({ equipmentId: this.equipmentId }).then(res => {
                const name = '设备履历导出'
                const blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
                const downloadElement = document.createElement('a')
                const href = URL.createObjectURL(blob) //创建下载链接
                downloadElement.href = href
                downloadElement.download = name + '.xlsx'
                document.body.appendChild(downloadElement)
                downloadElement.click()
                document.body.removeChild(downloadElement)// 下载完成移除元素
                window.URL.revokeObjectURL(href) // 释放掉blob对象
                this.$antMessage.success("导出成功");
            })
        },
        initData () {
            recordList({ equipmentId: this.equipmentId }).then(res => {
                this.recordInfo = res.data
                this.tableDataList = res.data.certificationVoList
            })
            // let res = { data: {}, total: 1 }
            // res.data = [{ responsibilityName: '4', bDate: 'test', bjr: 'test', bcTime: 'test', notCause: 'test', report: 'test' }]
            // this.tableDataList = res.data
        },
        handleDownloadPdf (e) {
            getPortraitUrlt([e]).then((res) => {
                if (res.data[0]) {
                    console.log(res.data[0].filePath);
                    window.open(res.data[0].filePath);
                }
            });
        },
        handleCheckInfo (e) {
            this.$router.push({
                path: "/safeManage/deviceSafeManage/deviceSafety/recordDteails",
                query: {
                    Id: e.certificationId
                },
            });
        }
    },
};
</script>

<style lang="less" scoped>
.download {
    padding: 20px 0;
}
.baseInfo {
    padding: 30px 0;
    .bottom {
        margin-top: 30px;
    }
}
</style>
