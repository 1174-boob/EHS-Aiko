<template>
    <!-- 邀请列表 -->
    <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
        <SearchTerm>
            <a-form-model layout="inline"
                          :model="searchFormData"
                          :colon="false">
                <CommonSearchItem ref="commonSearchItem"
                                  :hasDepartment="true"
                                  :CommonFormInline="searchFormData"></CommonSearchItem>
                <a-form-model-item label="审核状态">
                    <a-select v-model="searchFormData.approvalStatus"
                              placeholder="请选择"
                              allowClear>
                        <a-select-option v-for="item in optionList"
                                         :key="item.value"
                                         :value="item.key">{{ item.value }}</a-select-option>
                    </a-select>
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
        <DashBtn>
            <div>
                <a-button type="primary"
                          @click="handleToAdd">
                    <a-icon type="plus" />新增
                </a-button>
                <a-button type="primary"
                          @click="handleToDrafts">
                    草稿箱
                </a-button>
            </div>
            <div>

                <a-button type="primary"
                          @click="handleToexport"
                          class="m-l-20">导出Excel</a-button>
            </div>
        </DashBtn>
        <!-- 列表 -->
        <CommonTable :spinning="tableSpinning" :page="page"
                     :pageNoChange="pageNoChange"
                     :showSizeChange="showSizeChange">
            <a-table :columns="columns"
                     :scroll="{ x: 800 }"
                     :data-source="tableDataList"
                     :pagination="false"
                     bordered>
                <div slot="action"
                     slot-scope="record">
                    <span class="color-0067cc cursor-pointer"
                          @click="handleCheckInfo(record)">查看</span>
                    <span v-if="(record.approvalStatus=='2'||record.approvalStatus=='1') && record.handlerUser==userId"
                          class="color-0067cc cursor-pointer"
                          @click="handleDispose(record)">处理</span>
                    <span v-if="reassignShow&&(record.approvalStatus=='2'||record.approvalStatus=='1')"
                          class="color-0067cc cursor-pointer"
                          @click="handleAllocation(record)">重新分配</span>
                    <span v-if="record.approvalStatus==3"
                          class="color-ff4d4f cursor-pointer"
                          @click="handleDelete(record)">删除</span>

                </div>
            </a-table>
        </CommonTable>

        <!-- 分配弹框 -->
        <CommonModal title="重新分配"
                     :visible="addVisible"
                     :cancelFn="addCancle">
            <template slot="form">
                <a-form-model ref="addForm"
                              :model="addForm"
                              :rules="addFormRules"
                              :label-col="{ style: { width: '125px' } }"
                              :wrapper-col="{ style: { width: 'calc(100% - 125px)' } }"
                              :colon="false"
                              labelAlign="right">

                    <a-form-model-item class="flex"
                                       label="当前处理节点">
                        {{addForm.nodeStatesText}}
                    </a-form-model-item>
                    <a-form-model-item class="flex"
                                       label="原处理人">
                        {{handlerUserName}}
                    </a-form-model-item>
                    <StaffOrDept :treeType="'user'"
                                 :propKey="'reassignUser'"
                                 :treeRoles="addFormRules"
                                 :labelTitle="'重新分配人员'"
                                 :label-col="{span: 6}"
                                 @getTreeData='getDutyUserList'
                                 :wrapper-col="{ span: 18 }"
                                 :checkAbel="false"
                                 :deptTreeId="addForm.deptId" />

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
    </div>
</template>

<script>
import cancelLoading from "@/mixin/cancelLoading";
import getDictionaryItemObj from "@/utils/dictionary.js";
import UploadBtnStyle from "@/components/upload/uploadStyleXt.vue";
import { debounce } from "lodash";
import { formValidator } from "@/utils/clx-form-validator.js";
import { authList, authAdd, authDelete, authToExport, authReassign } from "@/services/deviceSafety.js";
import serviceNameList from "@/config/default/service.config.js";
import StaffOrDept from "@/components/staffOrDept";
import dayJs from "dayjs";
export default {
    components: { UploadBtnStyle, StaffOrDept },
    mixins: [cancelLoading],
    data () {
        return {
            tableSpinning:false,
            page: {
                pageNo: 1,
                pageSize: 10,
                total: 0,
            },
            searchFormData: {},
            optionList: [
                {
                    key: 1,
                    value: '已提交'
                }, {
                    key: 2,
                    value: '审核中'
                }, {
                    key: 3,
                    value: '结束'
                }
            ],
            columns: [
                {
                    title: "审批单号",
                    dataIndex: "approvalOn",
                    key: "approvalOn",
                    align: "center",
                },
                {
                    title: "所属组织",
                    dataIndex: "corporationName",
                    key: "corporationName",
                    align: "center",
                },
                {
                    title: "部门",
                    dataIndex: "deptName",
                    key: "deptName",
                    align: "center",
                },
                {
                    title: "创建时间",
                    dataIndex: "createTime",
                    key: "createTime",
                    align: "center",
                },
                {
                    title: "审核状态",
                    dataIndex: "approvalStatus",
                    key: "approvalStatus",
                    align: "center",
                    customRender: (text) => {
                        switch (text) {
                            case '1':
                                return '已提交'
                                break;
                            case '2':
                                return '审批中'
                                break;
                            case '3':
                                return '结束'
                                break;
                            case '4':
                                return '驳回'
                                break;
                            default:
                                return '--'
                        }

                    },
                },
                {
                    title: "操作",
                    scopedSlots: { customRender: "action" },
                    key: "action",
                    align: "center",
                    fixed: "right", // 固定操作列
                    width: 300, // 宽度根据操作自定义设置
                },
            ],
            tableDataList: [],
            //弹框
            addVisible: false,
            addLoading: false,
            addForm: {},
            addFormRules: {
                reassignUser: [{ required: true, message: "重新分配人员不能为空", trigger: "change" }],
            },
            handlerUserName: '--',
            reassignShow: false,
            userId: null
        };
    },
    created () {
        this.setRouterCode("deviceAuth");
        this.initConfigPage()
        this.initData();
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
            let user = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user || {}
            this.userId = user.userId
            if (this.canShowModalMixin("reassign-show")) {
                this.reassignShow = true
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
                this.page = {
                    pageNo: 1,
                    pageSize: 10,
                    total: 0,
                };
                this.$refs.commonSearchItem.reset()
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
                this.searchFormData.createStartTime = this
                    .searchFormData.timeArr[0]
                    ? dayJs(this.searchFormData.timeArr[0]).format(
                        "YYYY-MM-DD"
                    )
                    : "";
                this.searchFormData.createEndTime = this.searchFormData
                    .timeArr[1]
                    ? dayJs(this.searchFormData.timeArr[1]).format(
                        "YYYY-MM-DD"
                    )
                    : "";
            }
            this.tableSpinning = true
            authList({ ...this.page, ...this.searchFormData })
            .then(res => {
                this.tableDataList = res.data.list
                this.page.total = res.data.total
            })
            .finally(()=>{
                this.tableSpinning = false
            })
        },
        //新增
        handleToAdd () {
            this.$router.push({
                path: "/safeManage/deviceSafeManage/deviceSafety/deviceAuthDetails",
                query: {
                    type: 1
                },
            });
        },
        //批量导出
        handleToexport () {
            console.log('下载')
            authToExport(this.searchFormData).then((res) => {
                const name = '认证设备导出'
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
        //去草稿箱
        handleToDrafts () {
            this.$router.push({
                path: "/safeManage/deviceSafeManage/deviceSafety/deviceAuthDrafts",
            });
        },
        //查看信息
        handleCheckInfo (e) {
            this.$router.push({
                path: "/safeManage/deviceSafeManage/deviceSafety/deviceAuthDetails",
                query: {
                    type: 2,
                    approvalId: e.approvalId

                },
            });
        },
        //处理信息
        handleDispose (e) {
            this.$router.push({
                path: "/safeManage/deviceSafeManage/deviceSafety/deviceAuthDetails",
                query: {
                    type: 2,
                    approvalId: e.approvalId,
                    manage: true
                },
            });
        },
        //分配
        handleAllocation (e) {
            let _this = this
            this.$antConfirm({
                title: '重新分配流程节点人员会影响原有流程，是否确认进行重新分配？?',
                onOk () {
                    _this.addVisible = true
                    /*
                      SUBMITTED  已提交,
                      SECTION_CHIEF  起草人科长审批,
                      POWER  动力部门认证,
                      TECHNICAL_SAFETY 技按部门认证,
                      MINISTER  起草人部长审批,
                      CLOSE  结束,
                      REJECT  撤回驳回
                    */
                    // handlerUser
                    switch (e.nodeStates) {
                        case "SUBMITTED":
                            _this.addForm.nodeStatesText = '已提交';
                            break;
                        case "SECTION_CHIEF":
                            _this.addForm.nodeStatesText = '起草人科长审批';
                            break;
                        case "POWER":
                            _this.addForm.nodeStatesText = '动力部门认证';
                            break;
                        case "TECHNICAL_SAFETY":
                            _this.addForm.nodeStatesText = '技按部门认证';
                            break;
                        case "MINISTER":
                            _this.addForm.nodeStatesText = '起草人部长审批';
                            break;
                        case "CLOSE":
                            _this.addForm.nodeStatesText = '结束';
                            break;
                        case "REJECT":
                            _this.addForm.nodeStatesText = '撤回驳回';
                            break;
                    }
                    _this.addForm.currentNode = e.nodeStates;
                    _this.addForm.handlerUser = e.handlerUser;
                    _this.addForm.approvalId = e.approvalId
                    const newArr = new Set([e.handlerUser]);
                    _this.getUserAndJobNumber(newArr).then(res => { //全局方法
                        console.log(res[e.handlerUser].name, _this.addForm)
                        _this.handlerUserName = res[e.handlerUser].name
                    }).catch(err => {
                        console.log(err);
                    })

                },
                onCancel () {

                }
            });
        },
        //重新分配人员选择
        getDutyUserList (data) {
            this.addForm.reassignUser =
                data && data.treeNameAndCodeList.length
                    ? data.treeNameAndCodeList[0].id
                    : "";
            this.addForm.reassignUserName =
                data && data.treeNameAndCodeList.length
                    ? data.treeNameAndCodeList[0].treeName
                    : "";
        },
        //重新分配确定
        addConfirm: debounce(
            function () {
                if (!formValidator.formAll(this, "addForm")) {
                    console.log('验证不通过')
                    return;
                }
                authReassign(this.addForm).then(res => {
                    this.$antMessage.success("修改成功！");
                    this.addCancle()
                    this.initData()
                })
            },
            2000,
            { leading: true, trailing: false }
        ),
        //取消弹框
        addCancle () {
            this.addVisible = false
            this.addForm = {}
        },
        //删除
        handleDelete (e) {
            let _this = this
            this.$antConfirm({
                title: '确定删除设备吗?',
                onOk () {
                    authDelete({ approvalId: e.approvalId }).then(res => {
                        _this.$antMessage.success("删除成功！");
                        _this.initData()
                    })
                },
                onCancel () {

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
</style>
