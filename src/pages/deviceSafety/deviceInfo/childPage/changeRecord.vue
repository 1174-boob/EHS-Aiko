<template>
    <HasSpinAndBtnBox :spinning="false">
        <div class="clx-flex-1">
            <div class="baseInfo">
                <a-row type="flex"
                    justify="space-around">
                    <a-col :span="4">
                        所属组织：{{baseInfo.corporationName}}
                    </a-col>
                    <a-col :span="4">
                        部门： {{baseInfo.deptName}}
                    </a-col>
                    <a-col :span="4">
                        设备ID： {{baseInfo.equipmentCode}}
                    </a-col>
                    <a-col :span="4">
                        设备名称：{{baseInfo.equipmentName}}
                    </a-col>

                </a-row>
                <a-row type="flex"
                    class="bottom"
                    justify="space-around">

                    <a-col :span="4">
                        设备类型：{{baseInfo.equipmentType}}
                    </a-col>
                    <a-col :span="4">
                        区域： {{baseInfo.equipmentRegion}}
                    </a-col>
                    <a-col :span="4">
                        设备量产时间：{{baseInfo.equipmentProductionDate}}
                    </a-col>
                    <a-col :span="4">
                        初次认证时间：{{baseInfo.initialCertificationDate}}
                    </a-col>
                </a-row>

            </div>
            <DashBtn>
                <div>
                    <a-button type="dashed"
                            @click="addDevice">新增</a-button>
                </div>
                <div>
                    <a-button type="primary"
                            @click="handleToexport"
                            class="m-l-20">导出</a-button>
                </div>
            </DashBtn>
            <CommonTable>
                <a-table :columns="columns"
                        :data-source="tableDataList"
                        :pagination="false"
                        bordered>
                    <div slot="action"
                        slot-scope="record">
                        <span class="color-0067cc cursor-pointer"
                            @click="editDevice(record)">编辑</span>
                        <span class="color-ff4d4f cursor-pointer"
                            @click="handleDelete(record)">删除</span>
                    </div>
                </a-table>
            </CommonTable>
        </div>

        <FixedBottom slot="fixedBottom">
            <a-button @click="goBack">返回</a-button>
        </FixedBottom>

         <CommonModal :title="modalTitle" :visible="addVisible"  :cancelFn="addCancle">
            <template slot="form">
                <a-form-model ref="addForm"
                            :model="addForm"
                            :rules="addFormRules"
                            :label-col="{span: 9}"
                            :wrapper-col="{span: 15}"
                            :colon="false"
                            labelAlign="right">

                    <a-form-model-item class="flex"
                                    label="责任担当"
                                    prop="responsibility">
                        {{ addForm.responsibilityName}}
                    </a-form-model-item>
                    <a-form-model-item class="flex"
                                    label="安全认证时间"
                                    prop="lastCertificationDate">

                        {{addForm.lastCertificationDate}}

                    </a-form-model-item>
                    <a-form-model-item class="flex"
                                    label="变更描述"
                                    prop="changeDesc">
                        <a-input v-model="addForm.changeDesc"
                                placeholder="请输入描述" />
                    </a-form-model-item>
                    <a-form-model-item class="flex"
                                    label="变更开始时间"
                                    prop="changeStartDate">
                        <el-date-picker v-model="addForm.changeStartDate"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                        </el-date-picker>
                    </a-form-model-item>
                    <a-form-model-item class="flex"
                                    label="变更结束时间"
                                    prop="changeEndDate">
                        <el-date-picker v-model="addForm.changeEndDate"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="选择日期">
                        </el-date-picker>
                    </a-form-model-item>
                    <StaffOrDept :treeType="'user'"
                                :propKey="'changeBear'"
                                :treeRoles="addFormRules"
                                :labelTitle="'变更担当'"
                                :label-col="{span: 9}"
                                :checkedTreeNode="checkedTreeNode"
                                @getTreeData='getDutyUserList'
                                :wrapper-col="{ span: 15 }"
                                :checkAbel="false"
                                :deptTreeId="addForm.deptId" />
                    <a-form-model-item class="flex"
                                    label="变更后是否进行安全认证"
                                    prop="changeCertification">
                        <a-select v-model="addForm.changeCertification"
                                placeholder="请选择"
                                allowClear>
                            <a-select-option v-for="item in optionList"
                                            :key="item.value"
                                            :value="item.key">{{ item.value }}</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item class="flex"
                                    v-if="addForm.changeCertification == 1&&modalTitle=='新增'"
                                    label="变更后安全认证审批单号"
                                    prop="changeApprovalOn">
                        {{addForm.changeApprovalOn||'--'}}
                    </a-form-model-item>
                </a-form-model>
            </template>
            <template slot="btn">
                <a-button class="m-r-15"
                        @click="addCancle">取消</a-button>
                <a-button type="primary"
                        :loading="addLoading"
                        @click="addConfirm">确定</a-button>
            </template>
        </CommonModal>
    </HasSpinAndBtnBox>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import getDictionaryItemObj from "@/utils/dictionary.js";
import { debounce } from "lodash";
import { changeList, changeSave, changeDetails, changeDelete, changeUpdate, changeExport } from "@/services/deviceSafety.js";
import { formValidator } from "@/utils/clx-form-validator.js";
import StaffOrDept from "@/components/staffOrDept";
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
                    title: "安全认证时间",
                    dataIndex: "lastCertificationDate",
                    key: "lastCertificationDate",
                    align: "center",
                },
                {
                    title: "变更描述",
                    dataIndex: "changeDesc",
                    key: "changeDesc",
                    align: "center",
                },
                {
                    title: "变更开始时间",
                    dataIndex: "changeStartDate",
                    key: "changeStartDate",
                    align: "center",
                    // customRender: (text) => {
                    // },
                },
                {
                    title: "变更结束时间",
                    dataIndex: "changeEndDate",
                    key: "changeEndDate",
                    align: "center",
                },
                {
                    title: "变更担当",
                    dataIndex: "changeBearName",
                    key: "changeBearName",
                    align: "center",
                },
                {
                    title: "变更后是否进行安全认证",
                    dataIndex: "changeCertification",
                    key: "changeCertification",
                    align: "center",
                    customRender: d => {
                        return d == 1 ? '是' : '否'
                    }
                },
                {
                    title: "变更后安全认证审批单号",
                    dataIndex: "changeApprovalOn",
                    key: "changeApprovalOn",
                    align: "center",
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
            addVisible: false,
            addLoading: false,
            addForm: {},
            addFormRules: {
                // responsibility: [{ required: true, message: "不能为空", trigger: "change" }],
                // lastCertificationDate: [{ required: true, message: "不能为空", trigger: "change" }],
                changeDesc: [{ required: true, message: "变更描述不能为空", trigger: "change" }],
                changeStartDate: [{ required: true, message: "开始时间不能为空", trigger: "change" }],
                changeEndDate: [{ required: true, message: "结束时间不能为空", trigger: "change" }],
                changeBearName: [{ required: true, message: "变更责任人不能为空", trigger: "change" }],
                equipmentStatus: [{ required: true, message: "变更后是否进行安全认证不能为空", trigger: "change" }],
                securityCertificationCycle: [{ required: true, message: "不能为空", trigger: "change" }],
                changeCertification: [{ required: true, message: "不能为空", trigger: "change" }],
            },
            modalTitle: '',
            equipmentId: null,
            baseInfo: {},
            loading: false,
            operationChangeId: null,
            optionList: [{
                key: '1',
                value: '是'
            }, {
                key: '2',
                value: '否'
            }],
            checkedTreeNode: [],
        };
    },
    components: { StaffOrDept },
    computed: {},
    created () {
        this.setRouterCode("envMonthReport");
        this.equipmentId = this.$route.query.Id
        this.initData()
    },
    methods: {
        goBack(){
            this.setKeepalive(true)
            this.$router.go(-1)
        },
        //导出
        handleToexport () {
            console.log('下载')
            changeExport({ equipmentId: this.equipmentId }).then(res => {
                const name = '设备变更导出'
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
            changeList({ equipmentId: this.equipmentId }).then(res => {
                this.baseInfo = res.data
                this.tableDataList = res.data.changeVoList
            })
        },
        addDevice () {
            this.modalTitle = '新增';
            this.addVisible = true
            this.addForm.responsibility = this.baseInfo.responsibility
            this.addForm.responsibilityName = this.baseInfo.responsibilityName
            this.addForm.lastCertificationDate = this.baseInfo.securityCertificationDate
            this.addForm.changeApprovalOn = this.baseInfo.approvalOn
        },
        addCancle () {
            this.addVisible = false
            this.addForm = {}
            this.checkedTreeNode = []
        },
        editDevice (e) {
            changeDetails({ equipmentId: this.equipmentId, changeId: e.changeId }).then(res => {
                this.modalTitle = '编辑';
                this.addVisible = true;
                this.operationChangeId = e.operationChangeId
                this.addForm = res.data
                this.checkedTreeNode = res.data.changeBear ? [res.data.changeBear] : []
            })
        },
        //新增or修改
        addConfirm: debounce(
            function (e) {
                if (!formValidator.formAll(this, "addForm")) {
                    console.log('验证不通过')
                    return;
                }
                if (this.modalTitle == '新增') {
                    changeSave({ ...this.addForm, equipmentId: this.equipmentId }).then(res => {
                        this.$antMessage.success("新增成功！");
                        this.addCancle()
                        this.initData()
                    })
                } else {
                    console.log()
                    changeUpdate({ ...this.addForm, equipmentId: this.equipmentId }).then(res => {
                        this.$antMessage.success("修改成功！");
                        this.addCancle()
                        this.initData()
                    })
                }
            },
            2000,
            { leading: true, trailing: false }
        ),
        //删除
        handleDelete (e) {
            let _this = this
            this.$antConfirm({
                title: '确定删除设备吗?',
                onOk () {
                    changeDelete({ changeId: e.changeId }).then(res => {
                        _this.$antMessage.success("删除成功！");
                        _this.initData()
                    })
                },
                onCancel () {

                }
            });
        },
        //弹框责任人数据获取
        getDutyUserList (data) {
            this.addForm.changeBear =
                data && data.treeNameAndCodeList.length
                    ? data.treeNameAndCodeList[0].id
                    : "";
            this.addForm.changeBearName =
                data && data.treeNameAndCodeList.length
                    ? data.treeNameAndCodeList[0].treeName
                    : "";
        },
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
