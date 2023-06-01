<template>
      <!-- 邀请列表 -->
      <div
            class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff"
      >
            <SearchTerm>
                  <a-form-model
                        layout="inline"
                        :model="formInline"
                        :colon="false"
                  >
                        <CommonSearchItem
                              ref="commonSearchItem"
                              :hasDepartment="true"
                              :CommonFormInline="formInline"
                        ></CommonSearchItem>

                        <a-form-model-item label="岗位">
                              <a-select
                                    v-model="formInline.jobId"
                                    placeholder="请选择"
                                    allowClear
                              >
                                    <a-select-option
                                          v-for="item in positionList"
                                          :key="item.value"
                                          :value="item.value"
                                          >{{ item.label }}</a-select-option
                                    >
                              </a-select>
                        </a-form-model-item>
                        <a-form-model-item label="检测结果">
                              <a-select
                                    v-model="formInline.checkResult"
                                    placeholder="请选择"
                                    allowClear
                              >
                                    <a-select-option value="1"
                                          >正常</a-select-option
                                    >
                                    <a-select-option value="2"
                                          >异常</a-select-option
                                    >
                              </a-select>
                        </a-form-model-item>
                        <a-form-model-item label="检测时间">
                              <a-range-picker
                                    separator="-"
                                    format="YYYY-MM-DD"
                                    class="searchtable-search-date m-b-15"
                                    v-model="formInline.timeArr"
                              >
                                    <a-icon slot="suffixIcon" type="calendar" />
                              </a-range-picker>
                        </a-form-model-item>
                        <a-form-model-item class="float-right">
                              <a-button
                                    type="primary"
                                    :loading="loading"
                                    @click="iSearch"
                                    >查询</a-button
                              >
                              <a-button @click="iRest">重置</a-button>
                        </a-form-model-item>
                  </a-form-model>
            </SearchTerm>
            <!-- 列表 -->
            <CommonTable
                  :page="page"
                  :pageNoChange="pageNoChange"
                  :showSizeChange="showSizeChange"
            >
                  <a-table
                        :columns="columns"
                        :data-source="tableDataList"
                        :pagination="false"
                        bordered
                  >
                        <div slot="result" slot-scope="record">
                              <template v-if="record">
                                    <span
                                          v-if="record == 1"
                                          style="color: #089908"
                                          >正常</span
                                    >
                                    <span v-else style="color: red">异常</span>
                              </template>
                              <template v-else>--</template>
                        </div>
                        <div slot="action" slot-scope="record">
                              <span
                                    class="color-0067cc cursor-pointer"
                                    @click="handleCheckLog(record)"
                                    >检测记录</span
                              >
                        </div>
                  </a-table>
            </CommonTable>
            <!-- 弹框 -->
            <CommonModal
                  title="检测记录"
                  :visible="visible"
                  :cancelFn="handleCancelLogList"
            >
                  <a-button type="primary" @click="handleAddLog"
                        >+ 新增</a-button
                  >
                  <div style="height: 10px"></div>
                  <a-table
                        :columns="logColumns"
                        :scroll="{ y: 800 }"
                        :data-source="tableLogDataList"
                        :pagination="false"
                  >
                        <div slot="result" slot-scope="record">
                              <span>{{ record == 1 ? "正常" : "异常" }}</span>
                        </div>
                        <div slot="action" slot-scope="record">
                              <span
                                    class="color-0067cc cursor-pointer"
                                    @click="handleLogEdit(record)"
                                    >编辑</span
                              >
                        </div>
                  </a-table>
                  <template slot="btn">
                        <a-button @click="handleCancelLogList">返回</a-button>
                        <a-button
                              type="primary"
                              class="m-l-15"
                              @click="handleConfirm"
                              >确定</a-button
                        >
                  </template>
            </CommonModal>
            <!-- 记录弹窗 -->
            <CommonModal
                  :title="logTitle"
                  :visible="logVisible"
                  :cancelFn="handleCancelLog"
            >
                  <a-form-model
                        ref="addLogForm"
                        :model="addLogForm"
                        :rules="addLogFormRules"
                        :label-col="{ style: { width: '120px' } }"
                        :wrapper-col="{
                              style: { width: 'calc(100% - 120px)' },
                        }"
                        :colon="false"
                        labelAlign="left"
                  >
                        <a-form-model-item
                              class="flex"
                              label="检测时间"
                              prop="checkTime"
                        >
                              <a-date-picker
                                    @change="onChange"
                                    :default-value="
                                          moment(new Date(), dateFormat)
                                    "
                                    :format="dateFormat"
                              />
                        </a-form-model-item>
                        <a-form-model-item
                              class="flex"
                              label="历史检测值"
                              prop="checkValue"
                        >
                              <a-input
                                    v-model="addLogForm.checkValue"
                                    placeholder="请输入检测值"
                              />
                        </a-form-model-item>
                        <a-form-model-item
                              label="检测结果"
                              class="flex"
                              prop="checkResult"
                        >
                              <a-select
                                    v-model="addLogForm.checkResult"
                                    placeholder="请选择"
                                    allowClear
                              >
                                    <a-select-option value="1"
                                          >正常</a-select-option
                                    >
                                    <a-select-option value="2"
                                          >异常</a-select-option
                                    >
                              </a-select>
                        </a-form-model-item>
                  </a-form-model>
                  <template slot="btn">
                        <a-button @click="handleCancelLog">取消</a-button>
                        <a-button
                              type="primary"
                              class="m-l-15"
                              @click="handleConfirmAddLog"
                              >确定</a-button
                        >
                  </template>
            </CommonModal>
      </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dragTable from "@/mixin/dragTable.js";
import staffTree from "@/mixin/treeTab.js"; // 选择组织成员单选
import { formValidator } from "@/utils/clx-form-validator.js";
import { debounce, cloneDeep } from "lodash";
import { getOrganizeList, DeptUserTree } from "@/services/api.js";
import {
      independentTestingPageList,
      checkHistory,
      checkHistoryAdd,
      checkHistoryEdit,
      getPostAll,
} from "@/services/occupationHealth.js";
import chemicalDict from "@/mixin/chemicalDict.js";
import moment from "moment";
import dayJs from "dayjs";

export default {
      mixins: [
            teableCenterEllipsis,
            cancelLoading,
            dragTable,
            staffTree,
            chemicalDict,
      ],
      data() {
            return {
                  dateFormat: "YYYY-MM-DD",
                  visible: false,
                  page: {
                        pageNo: 1,
                        pageSize: 10,
                        total: 0,
                  },
                  searchFormData: {},
                  formInline: {},
                  columns: [
                        {
                              title: "序号",
                              width: 100,
                              align: "center",
                              customRender: (text, record, index) => {
                                    return index + 1;
                              },
                              key: "index",
                        },
                        // {
                        //       title: "所属组织",
                        //       dataIndex: "organizationName",
                        //       key: "organizationName",
                        //       width: 120,
                        // },
                        // {
                        //       title: "部门",
                        //       dataIndex: "deptName",
                        //       key: "deptName",
                        //       width: 120,
                        // },

                        // {
                        //       title: "科室",
                        //       dataIndex: "officeName",
                        //       key: "officeName",
                        //       width: 120,
                        // },
                        {
                              title: "岗位",
                              dataIndex: "jobName",
                              key: "jobName",
                              width: 120,
                        },
                        {
                              title: "危害因素",
                              dataIndex: "checkProjectName",
                              key: "checkProjectName",
                              width: 120,
                        },
                        {
                              title: "检测结果",
                              dataIndex: "checkResult",
                              key: "checkResult",
                              scopedSlots: { customRender: "result" },
                              align: "center",
                              width: 120,
                        },
                        {
                              title: "检测时间",
                              dataIndex: "checkTime",
                              key: "checkTime",
                              width: 180,
                        },
                        {
                              title: "检测值",
                              dataIndex: "checkValue",
                              key: "checkValue",
                              width: 120,
                        },
                        {
                              title: "标准值",
                              dataIndex: "standard",
                              key: "standard",
                              width: 120,
                        },
                        {
                              title: "操作",
                              scopedSlots: { customRender: "action" },
                              key: "action",
                              fixed: "right", // 固定操作列
                              width: 200, // 宽度根据操作自定义设置
                        },
                  ],
                  tableDataList: [],
                  logColumns: [
                        {
                              title: "检测时间",
                              dataIndex: "checkTime",
                              key: "checkTime",
                              align: "center",
                        },
                        {
                              title: "检测历史检测值",
                              dataIndex: "checkValue",
                              key: "checkValue",
                              align: "center",
                        },
                        {
                              title: "检测结果",
                              dataIndex: "checkResult",
                              key: "checkResult",
                              scopedSlots: { customRender: "result" },
                              align: "center",
                        },
                        {
                              title: "操作",
                              scopedSlots: { customRender: "action" },
                              key: "action",
                              align: "center",
                        },
                  ],
                  tableLogDataList: [],
                  addLogForm: {
                        checkTime: moment(new Date(), "YYYY-MM-DD"),
                        checkValue: null,
                        checkResult: null,
                  },
                  logVisible: false,
                  logTitle: "新增",
                  logEditData: null,
                  addLogFormRules: {
                        // checkTime: [
                        //       {
                        //             required: true,
                        //             message: "时间不能为空",
                        //             trigger: "blur",
                        //       },
                        // ],
                        checkValue: [
                              {
                                    required: true,
                                    message: "检测值不能为空",
                                    trigger: "blur",
                              },
                        ],
                        checkResult: [
                              {
                                    required: true,
                                    message: "请选择检测结果",
                                    trigger: "blur",
                              },
                        ],
                  },
                  treeData: [],
                  userTreeData: [],
                  city: null,
                  harmFactorCheckId: null,
                  positionList: null,
            };
      },
      computed: {},
      created() {
            this.columns.splice(0, 0, this.addCommonColumnItem(150));
            this.columns.splice(1, 0, this.addCommonColumnDepartment(150));
            getPostAll().then((res) => {
                  this.positionList = res.data;
            });
            // this.getOrganizeTree();
            // this.getDeptUserTree();
            this.getSelectIssueInvitationPage();
      },
      methods: {
            moment,
            // 页码改变
            pageNoChange(page) {
                  this.page.pageNo = page;
                  // 获取列表
                  this.getSelectIssueInvitationPage();
            },
            // 重置
            iRest: debounce(
                  function () {
                        this.page = {
                              pageNo: 1,
                              pageSize: 10,
                              total: 0,
                        };
                        (this.formInline = {}),
                              (this.searchFormData = JSON.parse(
                                    JSON.stringify(this.formInline)
                              ));
                        this.getSelectIssueInvitationPage();
                  },
                  250,
                  { leading: true, trailing: false }
            ),
            // 查询
            iSearch() {
                  this.page = {
                        pageNo: 1,
                        pageSize: 10,
                        total: 0,
                  };
                  this.searchFormData = JSON.parse(
                        JSON.stringify(this.formInline)
                  );
                  this.handleLoading();
                  this.getSelectIssueInvitationPage(this.searchFormData);
            },
            // 字典组每页展示条数改变
            showSizeChange(page, pageSize) {
                  this.page.pageNo = 1;
                  this.page.pageSize = pageSize;
                  this.getSelectIssueInvitationPage();
            },
            //检测记录弹框确认
            handleConfirm() {
                  this.visible = false;
                  this.tableLogDataList = [];
                  this.getSelectIssueInvitationPage();
            },
            //查看检测记录
            handleCheckLog(e) {
                  console.log(e);
                  this.visible = true;
                  this.harmFactorCheckId = e.harmFactorCheckId;
                  checkHistory({
                        harmFactorId: e.harmFactorId,
                        dangerousStationId: e.dangerousStationId,
                  }).then((res) => {
                        console.log(res);
                        this.tableLogDataList = res.data;
                  });
            },
            handleCancelLogList() {
                  this.visible = false;
            },
            //添加一行记录
            handleAddLog() {
                  this.logVisible = true;
                  this.logTitle = "新增";
            },
            //编辑一条记录
            handleLogEdit(e) {
                  console.log(e);
                  this.logVisible = true;
                  this.addLogForm = cloneDeep(e);
                  this.logTitle = "编辑";
                  this.logEditData = e;
            },
            //确定添加一行记录
            handleConfirmAddLog() {
                  if (!formValidator.formAll(this, "addLogForm")) {
                        return;
                  } else {
                        console.log("校验通过");
                        this.addLogForm.checkTime = dayJs(
                              this.addLogForm.checkTime
                        ).format("YYYY-MM-DD");
                        if (this.logTitle == "新增") {
                              checkHistoryAdd({
                                    ...this.addLogForm,
                                    harmFactorCheckId: this.harmFactorCheckId,
                              }).then(
                                    (res) => {
                                          this.tableLogDataList.unshift({
                                                ...this.addLogForm,
                                          });
                                          this.handleCancelLog();
                                    },
                                    (error) => {
                                          console.log("添加失败！");
                                          this.handleCancelLog();
                                    }
                              );
                        } else {
                              checkHistoryEdit({
                                    ...this.addLogForm,
                                    harmFactorCheckId: this.harmFactorCheckId,
                              }).then(
                                    (res) => {
                                          this.addLogForm
                                                .dangerousStationCutCheckHistoryId;
                                          this.tableLogDataList.forEach(
                                                (item) => {
                                                      if (
                                                            item.dangerousStationCutCheckHistoryId ==
                                                            this.addLogForm
                                                                  .dangerousStationCutCheckHistoryId
                                                      ) {
                                                            item.checkResult =
                                                                  this.addLogForm.checkResult;
                                                            item.checkTime =
                                                                  this.addLogForm.checkTime;
                                                            item.checkValue =
                                                                  this.addLogForm.checkValue;
                                                            console.log(
                                                                  this
                                                                        .tableLogDataList
                                                            );
                                                      }
                                                }
                                          );

                                          //
                                          this.handleCancelLog();
                                    },
                                    (error) => {
                                          console.log("添加失败！");
                                          this.handleCancelLog();
                                    }
                              );
                        }
                  }
            },
            handleCancelLog() {
                  this.addLogForm = {
                        checkTime: new Date(),
                        checkValue: null,
                  };
                  this.logVisible = false;
            },
            getSelectIssueInvitationPage() {
                  this.cancelLoading();
                  if (this.searchFormData.timeArr) {
                        this.searchFormData.checkTimeStart = this.formInline
                              .timeArr[0]
                              ? dayJs(this.formInline.timeArr[0]).format(
                                      "YYYY-MM-DD"
                                )
                              : "";
                        this.searchFormData.checkTimeEnd = this.formInline
                              .timeArr[1]
                              ? dayJs(this.formInline.timeArr[1]).format(
                                      "YYYY-MM-DD"
                                )
                              : "";
                  }
                  independentTestingPageList({
                        ...this.page,
                        ...this.searchFormData,
                  }).then((res) => {
                        this.tableDataList = res.data.list;
                        this.page.total = res.data.total;
                  });
                  // let res = {
                  //       list: [
                  //             { test1: 1, test: 1 },
                  //             { test1: 2, test: 2 },
                  //             { test1: 3, test: 3 },
                  //             { test1: 4, test: 4 },
                  //             { test1: 5, test: 5 },
                  //       ],
                  //       total: 5,
                  // };
                  // this.tableDataList = res.list;
                  // this.page.total = res.total;
            },
            onChange(e) {
                  this.addLogForm.checkTime = e;
            },
      },
};
</script>

<style lang="less" scoped>
.radio-option {
      & > div {
            margin-top: 20px;
            border: 1px dashed #ccc;
            width: 150px;
            height: 150px;
            padding: 20px;
      }
      .active-config {
            color: #0067cc;
            border: 1px dashed #0067cc;
      }
}
</style>
