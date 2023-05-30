<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem
          ref="commonSearchItem"
          :CommonFormInline="formInline"
          :hasDepartment="true"
        ></CommonSearchItem>
        <a-form-model-item label="值班日期">
          <a-range-picker
            v-model="formInline.timeArr"
            format="YYYY-MM-DD"
            :placeholder="['起始时间', '结束时间']"
          />
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch"
            >查询</a-button
          >
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>

    <DashBtn>
      <!-- 带有加号按钮 -->
      <div>
        <a-button type="dashed" @click="addFireAlam">
          <a-icon type="plus" />新建排班
        </a-button>
        <a-button type="dashed" @click="frequencyOpen">班次设置</a-button>
      </div>
      <div>
        <UploadBtnStyle
          :action="actions"
          :showAcceptText="false"
          :accept="['.xlsx', '.xls']"
          :showUploadList="false"
          :btnText="'批量导入'"
          :btnType="'primary'"
          :btnIcon="false"
          @handleSuccess="handleSuccess"
        ></UploadBtnStyle>
        <a-button type="primary" class="btn m-l-20" @click="downTpl"
          >下载导入模板</a-button
        >
      </div>
    </DashBtn>

    <CommonTable
      :spinning="tableSpinning"
      :page="page"
      :pageNoChange="pageNoChange"
      :showSizeChange="onShowSizeChange"
    >
      <a-table
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{ emptyText: emptyText }"
        :data-source="tableDataList"
        :rowKey="
          (record, index) => {
            return record.planId;
          }
        "
        :pagination="false"
      >
        <div slot="action" slot-scope="record">
          <span
            class="color-0067cc cursor-pointer m-r-15"
            @click="actionEdit(record)"
            v-if="isChange(record)"
            >编辑</span
          >
          <span class="color-ccc m-r-15" v-else>编辑</span>
          <span
            v-if="isChange(record)"
            class="color-0067cc cursor-pointer"
            @click="actionDelete(record, 1)"
            >删除</span
          ><span class="color-ccc" v-else>删除</span>
        </div>
      </a-table>
    </CommonTable>

    <!-- 新增编辑排班 -->
    <CommonModal
      :title="editText"
      :visible="editVisible"
      :cancelFn="editCancle"
    >
      <template slot="form">
        <a-form-model
          ref="editForm"
          :model="editForm"
          :rules="editFormRules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :colon="false"
          labelAlign="left"
        >
          <CommonSearchItem
            ref="commonSearchItem1"
            :CommonFormInline="editForm"
            :rules="editFormRules"
            :notTablePage="true"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            labelAlign="left"
            :hasDepartment="true"
            @departmentChange="departmentChange"
            @corporationDeptChange="corporationDeptChange"
          ></CommonSearchItem>
          <a-form-model-item class="flex" label="排班名称" prop="planName">
            <a-input :maxLength="50" v-model="editForm.planName" placeholder="请输入排班名称"></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="值班日期" prop="planDate">
            <a-range-picker v-model="editForm.planDate" change="dataChange" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
          </a-form-model-item>
          <a-form-model-item class="flex" label="班次" prop="classesIdT">
            <a-select v-model="editForm.classesIdT" placeholder="请选择">
              <a-select-option
                v-for="item in classesList"
                :key="item.classesId"
                :value="item.classesId"
                >{{
                  `${item.classesName}（${item.startTime}-${item.endTime}）`
                }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
          <StaffOrDept
            :treeType="'user'"
            :propKey="'dutyUserIdList'"
            :treeRoles="editFormRules"
            :labelTitle="'值班员'"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            @getTreeData="personThingOne"
            :checkedTreeNode="editForm.dutyUserIdList"
            :deptTreeId="editForm.deptId"
          />
          <a-form-model-item class="flex" label="备注">
            <a-textarea
              :maxLength="50"
              v-model="editForm.remark"
              placeholder="请输入"
            ></a-textarea>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="editCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="editConfirm"
          >确定</a-button
        >
      </template>
    </CommonModal>

    <!-- 班次设置 -->
    <CommonModal
      title="班次设置"
      :visible="frequencyVisible"
      :cancelFn="frequencyCancle"
    >
      <div>
        <a-button type="primary" @click="earlyWarningTest('add')" class="m-b-20"
          >新增班次</a-button
        >
        <CommonTable
          :page="pageT"
          :pageNoChange="pageNoChangeT"
          :showSizeChange="onShowSizeChangeT"
        >
          <a-table
            :columns="columnsT"
            :scroll="{ x: 800 }"
            :locale="{ emptyText: emptyText }"
            :data-source="tableDataListT"
            :rowKey="
              (record, index) => {
                return record.classesId;
              }
            "
            :pagination="false"
          >
            <div slot="action" slot-scope="record">
              <span
                class="color-0067cc cursor-pointer m-r-15"
                @click="earlyWarningTest('change', record)"
                >编辑</span
              >
              <span
                class="color-0067cc cursor-pointer"
                @click="actionDelete(record, 2)"
                >删除</span
              >
            </div>
          </a-table>
        </CommonTable>
      </div>
    </CommonModal>

    <!-- 新建编辑班次 -->
    <CommonModal
      :title="earlyTitle"
      :visible="earlyWarningTestVisible"
      :cancelFn="earlyWarningTestCancle"
    >
      <template slot="form">
        <a-form-model
          ref="earlyWarningTest"
          :model="earlyWarningTestForm"
          :rules="earlyWarningTestFormRules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :colon="false"
          labelAlign="left"
        >
          <CommonSearchItem
            ref="commonSearchItem2"
            :CommonFormInline="earlyWarningTestForm"
            :rules="earlyWarningTestFormRules"
            :notTablePage="true"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            labelAlign="left"
            :hasDepartment="true"
          ></CommonSearchItem>
          <a-form-model-item class="flex" label="班次名称" prop="classesName">
            <a-input
              :maxLength="100"
              v-model="earlyWarningTestForm.classesName"
              placeholder="请输入"
            />
          </a-form-model-item>
          <a-form-model-item class="flex" label="开始时间" prop="startTime">
            <el-time-picker
              v-model="earlyWarningTestForm.startTime"
              range-separator="-"
              placeholder="开始时间"
              format="HH:mm"
              width="100%"
              value-format="HH:mm"
            ></el-time-picker>
          </a-form-model-item>
          <a-form-model-item class="flex" label="结束时间" prop="endTime">
            <el-time-picker
              v-model="earlyWarningTestForm.endTime"
              range-separator="-"
              placeholder="结束时间"
              format="HH:mm"
              value-format="HH:mm"
            ></el-time-picker>
          </a-form-model-item>
          <a-form-model-item class="flex" label="备注">
            <a-textarea
              :maxLength="50"
              v-model="earlyWarningTestForm.remark"
              placeholder="请输入"
            ></a-textarea>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="earlyWarningTestCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="earlyWarningTestConfirm"
          >确定</a-button
        >
      </template>
    </CommonModal>
  </div>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import { formValidator } from "@/utils/clx-form-validator.js";
import moment from "moment";
import dictionary from "@/utils/dictionary";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import serviceNameList from "@/config/default/service.config.js";
import { debounce, cloneDeep } from "lodash";
import StaffOrDept from "@/components/staffOrDept";
import {
  GetClassesList,
  AddClassesList,
  DelClassesList,
  ChangeClassesList,
  GetiInfoList,
  AddInfoList,
  DelInfoList,
  ChangeInfoList,
  GetClassesListNoPage,
} from "@/services/networkControl.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  components: { UploadBtnStyle, StaffOrDept },
  data() {
    return {
      tableSpinning:false,
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      classesList: [], //班次
      actions: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.danger}/api/ehs/alarm/networking/plan/table/info/import/excel`,
      formInline: {
        timeArr: [],
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      pageT: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      //现地字段下拉框数据
      equipTypeList: [],
      selectedRowKeys: [],

      detailVisible: false,
      currentMsg: {},

      editForm: {
        classesId: undefined,
        corporationId: undefined,
      },
      editVisible: false,

      addVisible: false,
      addForm: {},

      editText: "新增",
      // 表单验证
      editFormRules: {
        corporationId: [
          { required: true, message: "组织不能为空", trigger: "change" },
        ],
        deptId: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        planDate: [
          { required: true, message: "值班日期不能为空", trigger: "change" },
        ],
        classesIdT: [
          { required: true, message: "班次不能为空", trigger: "change" },
        ],
        dutyUserIdList: [
          { required: true, message: "值班员不能为空", trigger: "change" },
        ],
        planName: [
          { required: true, message: "排班名称不能为空", trigger: "change" },
        ],
      },

      columns: [
        {
          title: "组织",
          dataIndex: "corporationId",
          width: 150,
          customRender: (text) => {
            return text
              ? this.getMappingValue(
                  this.getCommonAddOrgnizeListAll,
                  "orgId",
                  text
                ).orgName
              : "--";
          },
        },
        {
          title: "部门",
          dataIndex: "deptName",
          width: 150,
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "班次",
          dataIndex: "classesName",
          width: 150,
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "排班名称",
          dataIndex: "planName",
          width: 150,
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "值班日期",
          dataIndex: "planDate",
          width: 150,
          customRender: (text, record) => {
            return record.planStartDate && record.planEndDate
              ? record.planStartDate + "-" + record.planEndDate
              : "--";
          },
        },
        {
          title: "值班时段",
          dataIndex: "equipName",
          width: 150,
          customRender: (text, record) => {
            return record.startTime && record.endTime
              ? record.startTime + "-" + record.endTime
              : "--";
          },
        },
        {
          title: "值班员",
          dataIndex: "dutyUserNameList",
          width: 200,
          customRender: (text) => {
            text = text ? text : "--";
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          fixed: "right", // 固定操作列
          width: 200, // 宽度根据操作自定义设置
        },
      ],
      tableDataList: [],

      columnsT: [
        {
          title: "组织",
          dataIndex: "corporationId",
          width: 150,
          customRender: (text) => {
            return text
              ? this.getMappingValue(
                  this.getCommonAddOrgnizeListAll,
                  "orgId",
                  text
                ).orgName
              : "--";
          },
        },
        {
          title: "部门",
          dataIndex: "deptName",
          width: 150,
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "班次",
          width: 150,
          dataIndex: "classesName",
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "时间段",
          dataIndex: "startTime",
          width: 150,
          customRender: (text, record) => {
            return record.startTime && record.endTime
              ? record.startTime + "-" + record.endTime
              : "--";
          },
        },
        {
          title: "备注",
          dataIndex: "remark",
          width: 150,
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          fixed: "right", // 固定操作列
          width: 150, // 宽度根据操作自定义设置
        },
      ],
      tableDataListT: [],

      earlyTitle: "新增",
      earlyWarningTestVisible: false,
      earlyWarningTestForm: {},
      earlyWarningTestFormRules: {
        corporationId: [
          { required: true, message: "组织不能为空", trigger: "change" },
        ],
        deptId: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        classesName: [
          { required: true, message: "班次名称不能为空", trigger: "change" },
        ],
        startTime: [
          { required: true, message: "开始时间不能为空", trigger: "change" },
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "change" },
        ],
      },

      frequencyVisible: false,
      scalId: undefined,
    };
  },
  created() {
    this.setRouterCode("infoMaintenance");
    this.getDataList();
    this.initConfigPage()
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
      this.equipTypeList = dictionary("equipType");
    },
    //判断是否能编辑
    isChange(record) {
      //比较时间 true展示编辑 false不可编辑
      if (record.planStartDate) {
        let date = new Date();
        let year = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(
          -2
        )}-${("0" + date.getDate()).slice(-2)}`;
        let hour = `${date.getHours()}:${date.getMinutes()}`;
        if (new Date(year) > new Date(record.planStartDate)) {
          return false;
        } else if (new Date(year) - new Date(record.planStartDate) == 0) {
          //年月日相等-在判断时间
          let hourA = hour.split(":");
          let hourB = record.startTime.split(":");
          return (
            date.setHours(hourA[0], hourA[1]) <
            date.setHours(hourB[0], hourB[1])
          );
        } else {
          return true;
        }
      } else {
        return false;
      }
    },

    //新增排班部门修改-清空人员组件
    departmentChange() {
      this.editForm.dutyUserIdList = [];
    },

    //所属组织改变
    corporationDeptChange() {
      if (this.editForm.corporationId) {
        this.getClassesListNoPage(); //获取班次列表
      }
      //清空班次
      this.$set(this.editForm, "classesId", undefined);
      this.classesList = [];
    },

    //获取班次列表不分页-用于新增排班
    getClassesListNoPage(flag) {
      GetClassesListNoPage({ corporationId: this.editForm.corporationId })
        .then((res) => {
          if (res.data) {
            this.classesList = res.data || [];
          }
          if (flag) {
            this.editVisible = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //获取name
    getName(list) {
      let listName = [];
      if (list.length) {
        for (var i = 0; i < list.length; i++) {
          listName.push(list[i].treeName);
        }
      }
      return listName;
    },

    //值班员
    personThingOne(data) {
      this.editForm.dutyUserIdList = data.treeIdList;
      let list = data.treeNameAndCodeList || [];
      this.editForm.dutyUserNameList = this.getName(list);
    },

    // 批量导入成功
    handleSuccess(fileList) {
      this.iRest();
    },

    //获取列表
    getDataList() {
      let params = {
        ...this.formInline,
        planStartDate:
          this.formInline.timeArr.length && this.formInline.timeArr[0]
            ? this.formInline.timeArr[0].format("YYYY-MM-DD")
            : undefined,
        planEndDate:
          this.formInline.timeArr.length && this.formInline.timeArr[1]
            ? this.formInline.timeArr[1].format("YYYY-MM-DD")
            : undefined,
        timeArr: undefined,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      };
      this.loading = true;
      this.tableSpinning = true
      GetiInfoList(params)
        .then((res) => {
          if (res.data) {
            this.tableDataList = res.data.list;
            this.page.total = res.data.total;
            this.cancelLoading();
          }
        })
        .catch((err) => {
          console.log(err);
          this.cancelLoading();
        })
        .finally(()=>{
          this.tableSpinning = false
        })
    },

    //获取班次-列表
    getClassesList() {
      let params = {
        pageSize: this.pageT.pageSize,
        pageNo: this.pageT.pageNo,
      };
      GetClassesList(params)
        .then((res) => {
          this.tableDataListT = res.data.list;
          this.pageT.total = res.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getDataList();
    },
    // 页码改变
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
    },

    // 班次-页码改变
    pageNoChangeT(page) {
      this.pageT.pageNo = page;
      // 获取列表
      this.getClassesList();
    },
    // 班次-页码改变
    onShowSizeChangeT(current, pageSize) {
      this.pageT.pageNo = 1;
      this.pageT.pageSize = pageSize;
      this.getClassesList();
    },

    // 设置班次弹窗-打开
    frequencyOpen() {
      this.getClassesList(); //获取列表
      this.frequencyVisible = true;
    },
    // 设置弹框-取消
    frequencyCancle() {
      this.frequencyVisible = false;
    },

    // 新建编辑班次
    earlyWarningTest(type, record) {
      this.earlyWarningTestVisible = true;
      if (type == "change") {
        let obj = {
          centerId: record.centerId,
          corporationId: record.corporationId,
          deptId: record.deptId,
          deptName: record.deptName,
          startTime: record.startTime,
          endTime: record.endTime,
          remark: record.remark,
          classesName: record.classesName,
        };
        this.earlyWarningTestForm = obj;
        this.scalId = record.classesId;
        this.earlyTitle = "编辑";
        this.earlyWarningTestVisible = true;
        this.$nextTick(() => {
          this.$refs.commonSearchItem2.corporationChange(
            record.corporationId,
            record.deptId
          );
        });
      } else {
        this.earlyTitle = "新增";
      }
    },
    // 班次弹框-取消
    earlyWarningTestCancle() {
      this.earlyWarningTestForm = {};
      this.earlyWarningTestVisible = false;
    },
    //班次确认
    earlyWarningTestConfirm() {
      if (!formValidator.formAll(this, "earlyWarningTest")) {
        return;
      }
      let params = {
        ...this.earlyWarningTestForm,
        classesId: this.earlyTitle == "新增" ? undefined : this.scalId,
      };
      let ApiName =
        this.earlyTitle == "新增" ? AddClassesList : ChangeClassesList;

      ApiName(params)
        .then((res) => {
          this.getClassesList();
          this.$antMessage.success(`${this.earlyTitle}成功`);
          this.earlyWarningTestForm = {};
          this.earlyWarningTestVisible = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 排班-新增
    addFireAlam() {
      this.editText = "新增";
      this.editForm = {};
      this.editVisible = true;
    },
    // 排班-编辑
    actionEdit(record) {
      if (record.corporationId) {
        this.getClassesListNoPage(true);
      }
      this.editText = "编辑";
      this.scalId = record.planId;
      this.editForm = {
        centerId: record.centerId,
        corporationId: record.corporationId,
        deptId: record.deptId,
        deptName: record.deptName,
        classesIdT: record.classesId,
        equipBrand: record.equipBrand,
        dutyUserIdList: record.dutyUserIdList,
        dutyUserNameList: record.dutyUserNameList,
        planName: record.planName,
        planStartDate: record.planStartDate,
        planEndDate: record.planEndDate,
        planDate: [record.planStartDate,record.planEndDate],
        remark: record.remark,
      };
      this.editVisible = true;
      this.$nextTick(() => {
        this.$refs.commonSearchItem1.corporationChange(
          record.corporationId,
          record.deptId
        );
      });
    },
    // 排班弹框-取消
    editCancle() {
      this.editVisible = false;
      this.editForm = {};
      this.classesList = [];
    },
    // 排班弹框-确定
    editConfirm() {
      if (!formValidator.formAll(this, "editForm")) {
        return;
      }
      let params = {
        ...this.editForm,
        classesId:this.editForm.classesIdT,
        classesIdT:undefined,
        planStartDate :this.editForm.planDate ? this.editForm.planDate[0] : "",
        planEndDate : this.editForm.planDate ? this.editForm.planDate[1] : "",
        planId: this.editText == "编辑" ? this.scalId : undefined,
      };
      let PromiseFn = this.editText == "编辑" ? ChangeInfoList : AddInfoList;
      PromiseFn(params)
        .then(() => {
          this.getDataList();
          this.$antMessage.success(this.editText + "成功");
          this.editVisible = false;
          this.editForm = {};
        })
        .catch((err) => console.log(err));
    },

    // 删除
    actionDelete(record, number) {
      //number：1为排班删除 2为班次删除
      console.log(record, number, "...");
      this.$antConfirm({
        content: "确认删除？",
        cancelText: "取消",
        onOk: () => {
          let ApiName = number == 2 ? DelClassesList : DelInfoList;
          ApiName({
            classesId: number == 2 ? record.classesId : undefined,
            planId: number == 1 ? record.planId : undefined,
          })
            .then((res) => {
              if (number == 2) {
                this.getClassesList();
              } else {
                this.getDataList();
              }
              this.$antMessage.success("删除成功");
            })
            .catch((err) => {
              console.log(err);
            });
        },
      });
    },

    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
      // 获取列表
      this.getDataList();
    },

    // 重置
    iRest: debounce(
      function () {
        this.$refs.commonSearchItem.reset();
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.formInline = {
          timeArr: [],
        };
        this.getDataList();
      },
      250,
      { leading: true, trailing: false }
    ),

    // 导入模板下载
    downTpl() {
      window.open(
        window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/报警联网排班表导入模板.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/报警联网排班表导入模板.xlsx`
      );
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ td {
  img {
    width: 30px;
    height: 30px;
  }
}
/deep/ .el-range-editor {
  width: 100% !important;
}
.color-ccc {
  color: #ccc;
}
.head-portrait {
  width: 50px;
  height: 50px;
}
</style>