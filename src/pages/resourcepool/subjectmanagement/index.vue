<template>
    <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
        <PageTitle>科目管理</PageTitle>
        <SearchTerm>
            <a-form-model layout="inline" :model="formInline" :colon="false">
                <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline"></CommonSearchItem>
                <a-form-model-item label="科目名称">
                    <a-input v-model="formInline.name" placeholder="请输入科目名称"></a-input>
                </a-form-model-item>
                <!-- 搜索栏按钮需要加固定的float-right类名 -->
                <a-form-model-item class="float-right">
                    <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
                    <a-button @click="iRest">重置</a-button>
                </a-form-model-item>
            </a-form-model>
        </SearchTerm>
        <DashBtn>
            <div>
                <a-button type="dashed" @click="addCourseware">新增科目</a-button>
            </div>
        </DashBtn>
        <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
            <a-table
                :columns="columns"
                :scroll="{ x: 800 }"
                :locale="{emptyText: emptyText}"
                :data-source="tableDataList"
                :rowKey="(record, index)=>{return index}"
                :pagination="false"
            >
                <div slot="state" slot-scope="record">
                    <!-- <h3>{{record}}</h3>
                    <span>{{record==1?'开启':'关闭'}}</span>-->
                    <a-switch @click="handelStatus(record)" v-model="record.state" />
                    <!-- <template v-if="record.status==1">
                        <a-switch @click="handelStatus(record)" v-model="record.state" />
                    </template>
                    <template v-else>
                        <a-switch @click="handelStatus(record)" v-model="switchFalse" />
                    </template>-->
                    <!-- <span><a-switch v-model="true" /></span> -->
                </div>
                <div slot="action" slot-scope="record">
                    <span
                        class="color-0067cc cursor-pointer m-r-15"
                        @click="handelContent(record)"
                    >內容管理</span>
                    <span class="color-0067cc cursor-pointer m-r-15" @click="actionEdit(record)">编辑</span>
                    <span class="color-0067cc cursor-pointer" @click="actionDelete(record)">删除</span>
                </div>
                <!-- <div slot="headStatus" slot-scope="record">
          <span>{{findValue(2, record.headStatus)}}</span>
                </div>-->
            </a-table>
        </CommonTable>
        <!-- 弹框 -->
        <CommonModal :title="editText" :visible="editVisible" :cancelFn="editCancle">
            <template slot="form">
                <a-form-model
                    ref="editForm"
                    :model="editSubjectForm"
                    :rules="addSubjectRules"
                    :label-col="{ style: { width: '80px' } }"
                    :wrapper-col="{ style: { width: 'calc(100% - 80px)' } }"
                    :colon="false"
                    labelAlign="left"
                >
                    <CommonSearchItem :CommonFormInline="editSubjectForm" :rules="addSubjectRules" :notTablePage="true" :labelCol="{ style: { width: '80px' } }" :wrapperCol="{ style: { width: 'calc(100% - 80px)' } }"></CommonSearchItem>
                    <a-form-model-item class="flex" label="科目名称" prop="name">
                        <a-input v-model="editSubjectForm.name" placeholder="请输入科目名称" />
                    </a-form-model-item>
                    <a-form-model-item class="flex" label="状态" prop="status">
                        <a-switch v-model="editSubjectForm.status" />
                    </a-form-model-item>
                </a-form-model>
            </template>
            <template slot="btn">
                <a-button @click="editCancle">取消</a-button>
                <a-button type="primary" class="m-l-15" @click="editConfirm">确定</a-button>
            </template>
        </CommonModal>
        <CommonModal title="新增科目" :visible="addVisible" :cancelFn="addCancle">
            <template slot="form">
                <a-form-model
                    ref="addForm"
                    :model="addForm"
                    :rules="addSubjectRules"
                    :label-col="{span: 4}"
                    :wrapper-col="{span: 20}"
                    :colon="false"
                    labelAlign="left"
                >
                    <CommonSearchItem :CommonFormInline="addForm" :rules="addSubjectRules" :notTablePage="true" :labelCol="{span: 4}" :wrapperCol="{span: 20}"></CommonSearchItem>
                    <a-form-model-item class="flex" label="科目名称" prop="name">
                        <a-input v-model="addForm.name" placeholder="请输入科目名称" />
                    </a-form-model-item>
                    <a-form-model-item class="flex" label="状态" prop="status">
                        <a-switch v-model="addForm.status" />
                    </a-form-model-item>
                </a-form-model>
            </template>
            <template slot="btn">
                <a-button @click="addCancle">取消</a-button>
                <a-button
                    type="primary"
                    class="m-l-15"
                    :loading="addLoading"
                    @click="addConfirm(addForm)"
                >确定</a-button>
            </template>
        </CommonModal>
    </div>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import { formValidator } from "@/utils/clx-form-validator.js";
import uploadCanRemove from "@/mixin/uploadCanRemoveHaslimit";
import {
    getSubject,
    getlistPage,
    insertSubject,
    updateSubject,
    delSubject
} from "@/services/api.js";
// import UploadCanRemove from "@/components/upload/uploadCanRemove.vue";
// import UploadCanRemove from "@/components/upload/uploadFile.vue";

import { debounce } from "lodash";
import {
    getOrganizeList,
    updateOrgainizeList,
    getUserDetail,
    updateUserDetail,
    getUserPageList,
    syncOrgainize
} from "@/services/api.js";
export default {
    mixins: [teableCenterEllipsis, cancelLoading, uploadCanRemove],
    props: {},
    // components: {
    //   UploadCanRemove
    // },
    data() {
        return {
            tableSpinning:false,
            // subjectDel: false,
            formInline: {},
            preFormInline: {},
            page: {
                pageNo: 1,
                pageSize: 10,
                total: 0
            },
            detailVisible: false,
            currentMsg: {},

            // My data
            //添加科目验证
            editForm: {},
            editVisible: false,
            addVisible: false,
            addForm: {},
            addLoading: false,
            editSubjectForm: {},
            addSubjectRules: {
                name: [
                    {
                        required: true,
                        message: "科目名不能为空",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        max: 8,
                        message: "请输入2到8个字符",
                        trigger: "blur"
                    }
                ]
            },
            editText: "",
            columns: [
                // {
                //     title: "序号",
                //     dataIndex: "val1",
                //     key: "val1"
                // },
                {
                    title: "科目",
                    dataIndex: "name",
                    key: "name"
                },
                {
                    title: "课程数",
                    dataIndex: "num",
                    key: "num"
                },
                // {
                //     title: "排序",
                //     dataIndex: "sort",
                //     key: "sort"
                // },
                {
                    title: "状态",
                    scopedSlots: { customRender: "state" },
                    // dataIndex: "status",
                    key: "state"
                },
                {
                    title: "新增时间",
                    dataIndex: "createTime",
                    key: "createTime"
                },
                {
                    title: "操作",
                    scopedSlots: { customRender: "action" },
                    key: "action",
                    fixed: "right", // 固定操作列
                    width: 200 // 宽度根据操作自定义设置
                }
            ],
            tableDataList: [],
            switchFalse: false,
            switchTrue: true
        };
    },
    created() {
        this.setRouterCode("subjectmanagement");
        this.columns.splice(1, 0, this.addCommonColumnItem());
        this.getDataList();
        // this.subjectDel=this.canClickBtnMixin("subjectmanagement-del")?true:false;
    },
    activated() {
        setTimeout(() => {
            if(!this.keepalive){
                this.iRest()
            }
        }, 20);
    },
    methods: {
        getDataList() {
            let params = {
                ...this.preFormInline,
                ...this.page
            };
            this.tableSpinning = true
            return getlistPage(params)
            .then(res => {
                console.log(res);
                this.tableDataList = res.data.list.map(item => {
                    return { ...item, state: item.status == 1 ? true : false };
                });
                this.page.total = res.data.total;
            })
            .finally(()=>{
                this.tableSpinning = false
            })
        },
        // 查询
        iSearch() {
            console.log(this.formInline);
            this.preFormInline = { ...this.formInline };
            // 获取列表
            this.getDataList().finally(() => {
                this.cancelLoading();
            });
        },
        // 重置
        iRest: debounce(
            function() {
                this.page = {
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                };
                this.formInline = {};
                this.preFormInline = {};
                this.getDataList();
            },
            250,
            { leading: true, trailing: false }
        ),

        // 内容管理
        handelContent(record) {
            console.log("handelContent", record);
            this.$router.push({
                path: "/ehsGerneralManage/educationmanagement/subjectContent",
                query: { ...record }
            });
        },

        //删除按钮
        actionDelete(record) {
            console.log("删除", record);
            if (!this.canClickBtnMixin("subjectmanagement-del")) {
                return;
            }
            this.$antConfirm({
                title: "删除提示",
                content: "本操作不可恢复，确定继续？",
                cancelText: "取消",
                onOk: () => {
                    delSubject({
                        ...record
                    }).then(res => {
                        this.$antMessage.success("删除成功");
                        this.getDataList();
                    });
                }
            });
        },

        // 编辑弹框按钮事件
        editCancle() {
            this.editVisible = false;
            this.editForm = {};
        },
        actionEdit(record) {
            console.log("编辑", record);
            this.editText = "编辑";
            record.status = record.status == 1 ? true : false;
            this.editSubjectForm = JSON.parse(JSON.stringify(record));
            this.editVisible = true;
        },
        editConfirm() {
            if (!formValidator.formAll(this, "editForm")) {
                console.log(1231231);
                return;
            } else {
                updateSubject({
                    centerId: this.editSubjectForm.centerId,
                    corporationId: this.editSubjectForm.corporationId,
                    subjectId: this.editSubjectForm.subjectId,
                    name: this.editSubjectForm.name,
                    num: this.editSubjectForm.num,
                    sort: this.editSubjectForm.sort,
                    status: this.editSubjectForm.status ? 1 : 0
                }).then(res => {
                    this.getDataList();
                    this.$antMessage.success("修改成功");
                    this.editVisible = false;
                });
            }
        },
        handelStatus(e) {
            console.log(e);
            updateSubject({
                subjectId: e.subjectId,
                name: e.name,
                num: e.num,
                sort: e.sort,
                status: e.status == 1 ? 0 : 1
            }).then(res => {
                this.getDataList();
                this.$antMessage.success("修改成功");
            });
        },

        // 新增科目
        // 新增弹框按钮事件
        addCourseware() {
            this.addVisible = true;
            this.addForm = {
                status: true
            };
        },
        addCancle() {
            this.addVisible = false;
            this.addForm = {};
        },
        addConfirm(ref) {
            if (!formValidator.formAll(this, "addForm")) {
                return;
            } else {
                this.addLoading = true;
                console.log("---------");
                insertSubject({
                    centerId: this.addForm.centerId,
                    corporationId: this.addForm.corporationId,
                    // subjectId: null,
                    name: this.addForm.name,
                    // num: 0,
                    // sort: 0,
                    status: this.addForm.status ? 1 : 2
                }).then(res => {
                    this.getDataList();
                    this.$antMessage.success("新增成功");
                    this.addVisible = false;
                    this.addLoading = false;
                });
            }
        },

        // 页码改变
        pageNoChange(page) {
            this.page.pageNo = page;
            console.log(this.page);
            // 获取列表
            this.getDataList();
        },
        onShowSizeChange(current, pageSize) {
            this.page.pageSize = pageSize;
            this.getDataList();
        }
    }
};
</script>
<style lang="less" scoped>
/deep/ td {
    .ant-select {
        width: 100%;
    }
}
/deep/ .ant-form-item .ant-switch {
    margin-top: 10px;
}
</style>