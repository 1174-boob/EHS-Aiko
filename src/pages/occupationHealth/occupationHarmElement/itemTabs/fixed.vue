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
                        <a-form-model-item label="危害因素">
                              <a-select
                                    v-model="formInline.checkProjectName"
                                    placeholder="请选择"
                                    allowClear
                              >
                                    <a-select-option
                                          v-for="item in testItemList"
                                          :key="item.value"
                                          :value="item.value"
                                          >{{ item.label }}</a-select-option
                                    >
                              </a-select>
                        </a-form-model-item>
                        <!-- <a-form-model-item label="部门">
                              <OrganizeLazyTree
                                    v-model="formInline.deptId"
                                    ref="organizeLazyTree"
                                    :defaultGet="false"
                              />
                        </a-form-model-item> -->
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
                        :scroll="{ x: 800 }"
                        :data-source="tableDataList"
                        :pagination="false"
                        bordered
                  >
                        <div slot="checkResult" slot-scope="record">
                              <template v-if="record.checkTime">
                                    <span
                                          v-if="record.checkResultV2 == 0"
                                          style="color: #089908"
                                          >正常
                                    </span>
                                    <span v-else style="color: red">异常</span>
                              </template>
                              <template v-else> -- </template>
                        </div>
                        <div
                              slot="checkHarm"
                              slot-scope="record"
                              class="shenglvhao"
                        >
                              <a-tooltip>
                                    <template slot="title">
                                          {{ record.chemicalHarm || ""
                                          }}{{
                                                record.chemicalHarm &&
                                                record.physicalHarm
                                                      ? "、"
                                                      : ""
                                          }}{{ record.physicalHarm || "" }}
                                    </template>
                                    {{ record.chemicalHarm || ""
                                    }}{{
                                          record.chemicalHarm &&
                                          record.physicalHarm
                                                ? "、"
                                                : ""
                                    }}{{ record.physicalHarm || "" }}
                              </a-tooltip>
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
            <!-- 记录弹框 -->
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
                        :data-source="tableLogDataList"
                        :pagination="false"
                        bordered
                  >
                        <div slot="date" slot-scope="record">
                              <template v-if="record.isAdd">
                                    <a-date-picker
                                          @change="
                                                handleSetDate(record, $event)
                                          "
                                          :default-value="
                                                moment(new Date(), dateFormat)
                                          "
                                          :format="dateFormat"
                                          placeholder="请选择日期"
                                          :allowClear="false"
                                    />
                              </template>
                              <template v-else>
                                    {{ record.checkTime }}
                              </template>
                        </div>
                        <div slot="action" slot-scope="record">
                              <span
                                    v-if="!record.fileId"
                                    class="color-0067cc cursor-pointer span-gap"
                                    @click="handleUploadFile(record)"
                                    >上传检测报告</span
                              >
                              <span
                                    v-else
                                    class="color-0067cc cursor-pointer span-gap"
                                    @click="hazardFileDownload(record)"
                                    >检测报告</span
                              >
                              <span
                                    class="color-0067cc cursor-pointer span-gap"
                                    @click="handleOpenTest(record)"
                                    >检测值</span
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
            <!-- 文件弹窗 -->
            <CommonModal
                  title="文件上传"
                  :visible="fileVisible"
                  :cancelFn="handleCancelLog"
            >
                  <UploadBtnStyle
                        :accept="[
                              '.doc',
                              '.docx',
                              '.pdf',
                              '.xls',
                              '.xlsx',
                              '.ppt',
                        ]"
                        :maxSize="30"
                        :limit="1"
                        :fileLists="addLogForm.report"
                        @handleSuccess="handleSuccessRefFile"
                  ></UploadBtnStyle>
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
            <!-- 检测值弹框 -->
            <CommonModal
                  title="检测值"
                  :visible="testVisible"
                  :cancelFn="handleCancelTestList"
            >
                  <a-table
                        :columns="testColumns"
                        :data-source="tableTestDataList"
                        :pagination="false"
                        bordered
                  >
                        <div slot="value" slot-scope="record">
                              <a-input
                                    id="inputNumber"
                                    v-model="record.checkValue"
                                    placeholder="请输入"
                              />
                        </div>
                        <div slot="state" slot-scope="record">
                              <a-select
                                    v-model="record.checkResult"
                                    placeholder="请选择"
                                    :allowClear="false"
                                    :default-value="1"
                                    class="my-select"
                              >
                                    <a-select-option value="1"
                                          >正常</a-select-option
                                    >
                                    <a-select-option value="2"
                                          >异常</a-select-option
                                    >
                              </a-select>
                        </div>
                  </a-table>
                  <template slot="btn">
                        <a-button @click="handleCancelTestList">返回</a-button>
                        <a-button
                              type="primary"
                              class="m-l-15"
                              @click="handleTestConfirm"
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
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import { formValidator } from "@/utils/clx-form-validator.js";
import { debounce } from "lodash";
import {
      outsourcingPageList,
      outsourcingCheckHistory,
      checkProject,
      outsourcingcCeckHistoryAdd,
      checkHistoryDetails,
      checkHistoryUpdate,
      checkHistoryFileUpdate,
      getHarmAll,
      getPostAll,
} from "@/services/occupationHealth.js";
import { getPortraitUrlt } from "@/services/api.js";
import OrganizeLazyTree from "@/components/organizeLazyTree/organizeLazyTree.vue";
import chemicalDict from "@/mixin/chemicalDict.js";
import moment from "moment";
import dayJs from "dayjs";
export default {
      components: { UploadBtnStyle },
      mixins: [
            teableCenterEllipsis,
            cancelLoading,
            dragTable,
            staffTree,
            chemicalDict,
      ],
      data() {
            return {
                  visible: false,
                  dateFormat: "YYYY-MM-DD",
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

                        {
                              title: "科室",
                              dataIndex: "officeName",
                              key: "officeName",
                              width: 120,
                        },
                        {
                              title: "岗位",
                              dataIndex: "jobName",
                              key: "jobName",
                              width: 120,
                        },
                        {
                              title: "危害因素",
                              key: "checkHarm",
                              scopedSlots: { customRender: "checkHarm" },
                              ellipsis: true,
                              // width: 150,
                        },
                        {
                              title: "检测时间",
                              dataIndex: "checkTime",
                              key: "checkTime",
                              width: 180,
                        },
                        {
                              title: "检测结果",
                              // dataIndex: "checkResultV2",
                              scopedSlots: { customRender: "checkResult" },
                              key: "checkResultV2",
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
                              key: "date",
                              align: "center",
                              scopedSlots: { customRender: "date" },
                        },

                        {
                              title: "操作",
                              scopedSlots: { customRender: "action" },
                              key: "action",
                              align: "center",
                        },
                  ],
                  tableLogDataList: [],
                  addLogForm: { date: null, num: null, report: [] },
                  fileVisible: false,
                  positionList: [],
                  testItemList: [],
                  //检测值
                  testVisible: false,
                  testColumns: [
                        {
                              title: "危害因素",
                              dataIndex: "dangerousStationCutName",
                              key: "dangerousStationCutName",
                              align: "center",
                        },
                        {
                              title: "检测值",
                              scopedSlots: { customRender: "value" },
                              key: "value",
                              align: "center",
                              width: 200,
                        },
                        {
                              title: "状态",
                              scopedSlots: { customRender: "state" },
                              key: "state",
                              align: "center",
                              width: 200,
                        },
                  ],
                  tableTestDataList: [],
                  dangerousStationId: "",
                  harmFactorCheckId: "",
                  testValueData: null, //缓存打开的检测记录某一行
                  saveTestValueData: null,
                  fileList: [], //缓存文件id
            };
      },
      computed: {},
      created() {
            // this.positionList = this.getChemicalDictList("position");
            // this.testItemList = this.getChemicalDictList("test_item");
            this.columns.splice(0, 0, this.addCommonColumnItem(150))
            this.columns.splice(1, 0, this.addCommonColumnDepartment(150))
            console.log(this.columns)
            getHarmAll({}).then((res) => {
                  this.testItemList = res.data;
            });
            getPostAll({}).then((res) => {
                  this.positionList = res.data;
            });
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
                  outsourcingPageList({
                        ...this.page,
                        ...this.searchFormData,
                  }).then((res) => {
                        this.tableDataList = res.data.list;
                        this.page.total = res.data.total;
                  });
                  // let params = {
                  //       ...this.searchFormData,
                  //       ...this.page,
                  // };
                  // get(params).then((res) => {
                  //       console.log(res);
                  //       this.tableDataList = res.data.list
                  //       this.page.total = res.data.total;
                  // });
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
            //查看检测记录-------------------------------------start---------
            handleCheckLog(e) {
                  this.visible = true;
                  console.log(e);
                  this.dangerousStationId = e.dangerousStationId;
                  this.harmFactorCheckId = e.harmFactorCheckId;
                  outsourcingCheckHistory({
                        dangerousStationId: e.dangerousStationId,
                  }).then((res) => {
                        this.tableLogDataList = res.data;
                  });
            },
            //检测记录弹框-----确认
            async handleConfirm() {
                  let arr = this.tableLogDataList.filter((item) => {
                        return item.isAdd == true;
                  });
                  if (arr.length > 0) {
                        // let fileIdBo = arr.every((item) => {
                        //       return item.fileId != null || undefined;
                        // });
                        // if (!fileIdBo) {
                        //       this.$antMessage.warn(`请上传检测报告`);
                        //       return false;
                        // }
                        let checkTimeBo = arr.every((item) => {
                              return (
                                    item.checkTime != "Invalid Date" ||
                                    null ||
                                    undefined
                              );
                        });
                        if (!checkTimeBo) {
                              this.$antMessage.warn(`请选择时间`);
                              return false;
                        }

                        let testValueBo = arr.every((item) => {
                              return (
                                    item.dangerousStationCutCheckDetailsSaveList !=
                                          null || undefined
                              );
                        });
                        if (!testValueBo) {
                              this.$antMessage.warn(`请填写检测值!`);
                              return false;
                        }

                        let newArr = arr.map((item) => {
                              item.checkTime = dayJs(item.checkTime).format(
                                    "YYYY-MM-DD"
                              );
                              return item;
                        });
                        await outsourcingcCeckHistoryAdd({
                              dangerousStationId: this.dangerousStationId,
                              harmFactorCheckId: this.harmFactorCheckId,
                              details: newArr,
                        }).then((res) => {
                              this.tableLogDataList = [];
                        });
                  } else {
                        this.tableLogDataList = [];
                  }
                  this.visible = false;
                  this.getSelectIssueInvitationPage();
            },
            //检测记录弹框-----取消
            handleCancelLogList() {
                  this.visible = false;
                  this.tableLogDataList = [];
            },
            //添加一行记录
            handleAddLog() {
                  this.tableLogDataList.unshift({
                        checkTime: new Date(),
                        fileId: null,
                        isAdd: true,
                        dangerousStationCutCheckDetailsSaveList: null,
                  });
            },
            //查看检测记录-------------------------------------end----------------------------
            //-------------------------------------上传检测报告start--------------------------
            //打开上传弹框
            handleUploadFile(e) {
                  console.log(e);
                  this.fileVisible = true;
                  this.testValueData = e;
            },
            //文件上传结果接受
            handleSuccessRefFile(fileList) {
                  console.log(fileList);
                  this.fileList = fileList;
            },
            //取消文件上传弹框
            handleCancelLog() {
                  this.fileVisible = false;
            },
            //文件下载
            hazardFileDownload(e) {
                  getPortraitUrlt([e.fileId]).then((res) => {
                        if (res.data[0]) {
                              console.log(res.data[0].filePath);
                              window.open(res.data[0].filePath);
                        }
                  });
            },
            //文件上传确定
            handleConfirmAddLog() {
                  if (this.fileList[0]) {
                        if (this.testValueData.isAdd) {
                              //是新增的
                              this.testValueData.fileId = this.fileList[0].id;
                        } else {
                              //是历史数据 需要修改
                              checkHistoryFileUpdate({
                                    dangerousStationCheckHistoryId:
                                          this.testValueData
                                                .dangerousStationCheckHistoryId,
                                    harmFactorCheckId: this.harmFactorCheckId,
                                    fileId: this.fileList[0].id,
                              }).then((res) => {
                                    this.testValueData.fileId =
                                          this.fileList[0].id;
                              });
                        }
                  }
                  this.fileVisible = false;
            },
            //-------------------------------------上传检测报告end--------------------------
            //检测值弹框打开
            handleOpenTest(e) {
                  this.testVisible = true;
                  this.testValueData = e;
                  if (e.isAdd) {
                        checkProject({
                              dangerousStationId: this.dangerousStationId,
                        }).then((res) => {
                              this.tableTestDataList = res.data;
                        });
                  } else {
                        checkHistoryDetails({
                              dangerousStationCheckHistoryId:
                                    e.dangerousStationCheckHistoryId,
                        }).then((res) => {
                              this.tableTestDataList = res.data;
                        });
                  }
            },
            //检测值弹框关闭
            handleCancelTestList() {
                  this.testVisible = false;
            },
            //检测值弹框确定
            handleTestConfirm() {
                  let v = this.tableTestDataList.every((item) => {
                        return item.checkResult && item.checkValue;
                  });
                  if (!v) {
                        this.$antMessage.warn(`请填写完整检测项！`);
                        return false;
                  }
                  if (this.testValueData.isAdd) {
                        console.log();
                        this.testValueData.dangerousStationCutCheckDetailsSaveList =
                              JSON.parse(
                                    JSON.stringify(this.tableTestDataList)
                              );
                        // this.saveTestValueData = JSON.parse(
                        //       JSON.stringify(this.tableDataList)
                        // );
                        this.tableTestDataList = null;
                        this.testVisible = false;
                  } else {
                        checkHistoryUpdate({
                              dangerousStationCheckHistoryId:
                                    this.testValueData
                                          .dangerousStationCheckHistoryId,
                              harmFactorCheckId: this.harmFactorCheckId,
                              dangerousStationCutCheckDetailsSaveList:
                                    this.tableTestDataList,
                        }).then((res) => {
                              this.testVisible = false;
                        });
                  }
            },
            //时间改变
            handleSetDate(r, e) {
                  console.log(r, e);
                  r.checkTime = dayJs(e).format("YYYY-MM-DD");
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
.my-select {
      width: 100%;
}
.shenglvhao {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
}
</style>
