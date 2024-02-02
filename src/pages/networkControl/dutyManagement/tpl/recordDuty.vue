<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem
          ref="commonSearchItem"
          :CommonFormInline="formInline"
          :hasDepartment="true"
        ></CommonSearchItem>
        <a-form-model-item label="班次">
          <a-select v-model="formInline.classesId" placeholder="请选择">
            <a-select-option
              v-for="item in classesList"
              :key="item.classesId"
              :value="item.classesId"
              >{{ `${item.classesName}` }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="值班日期">
          <a-date-picker v-model="formInline.dutyDate" format="YYYY-MM-DD" />
        </a-form-model-item>
        <a-form-model-item label="值班名称">
          <a-input v-model="formInline.planName" placeholder="请输入值班名称"/>
        </a-form-model-item>
        <a-form-model-item label="值班时段">
          <el-time-picker
            is-range
            v-model="formInline.timeArr"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="请选择"
            format="HH:mm"
            value-format="HH:mm"
            :clearable="true"
          ></el-time-picker>
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
      <div class="m-b-20">
        <a-button type="dashed" @click="exportExcel">导出Excel</a-button>
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
            return record.dutyId;
          }
        "
        :pagination="false"
      >
        <div slot="action" slot-scope="record">
          <span
            class="color-0067cc cursor-pointer m-r-15"
            @click="actionHandle(record, 'change')"
            v-if="!record.handPickStatus"
            >编辑</span
          >
          <!-- <span
            class="color-0067cc cursor-pointer m-r-15"
            @click="actionHandle(record, 'handOver')"
            v-if="!record.handPickStatus"
            >交接班</span
          > -->
          <span
            class="color-0067cc cursor-pointer m-r-15"
            @click="actionHandle(record, 'look')"
            >查看</span
          >
        </div>
        <div slot="status" slot-scope="record">
          {{ dictionary("classesList", record.status) || "--" }}
        </div>
      </a-table>
    </CommonTable>

    <CommonModal class="pre-test" title="导出值班记录" :visible="alarmTestVisible" :cancelFn="alarmTestCancle">
      <template slot="form">
        <a-form-model
          ref="alarmTest"
          :model="alarmTestForm"
          :rules="alarmTestFormRules"
          :label-col="{ style: { width: '80px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 80px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="选择时间" prop="preDateTime">
            <a-range-picker
              format="YYYY/MM/DD"
              v-model="alarmTestForm.preDateTime"
            >
              <a-icon slot="suffixIcon" type="calendar" />
            </a-range-picker>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="alarmTestCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="alarmTestConfirm">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dictionary from "@/utils/dictionary";
import { formValidator } from "@/utils/clx-form-validator.js";
import dayJs from "dayjs";
import moment from "moment";
import { debounce } from "lodash";
import {
  DownloadGasProcess,
  GetDutyList,
  GetClassesListNoPage,
  ExoprCortExelNew,
} from "@/services/networkControl.js";

export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    this.alarmTestConfirm = debounce(this.alarmTestConfirm, 800);
    return {
      tableSpinning:false,
      formInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      alarmTestVisible: false,
      alarmTestForm: {},
      alarmTestFormRules: {
        preDateTime: [
          { required: true, message: "时间不能为空", trigger: "change" },
        ],
      },
      columns: [
        {
          title: "编号",
          dataIndex: "num",
          width: 150,
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "所属组织",
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
          dataIndex: "deptId",
          width: 150,
          customRender: (text) => {
            return text ? this.deptCache[text] : "--";
          },
        },
        {
          title: "值班名称",
          dataIndex: "planName",
          width: 150,
          customRender: (text) => {
            return text ? text : "--";
          },
        },
        {
          title: "班次",
          dataIndex: "classesName",
          width: 100,
          customRender: (text) => {
            return text ? text : "--";
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
          title: "值班日期",
          dataIndex: "dutyDate",
          width: 150,
        },
        {
          title: "值班时段",
          dataIndex: "dutyStartTime",
          width: 150,
          customRender: (text, record) => {
            text =
              record.dutyStartTime && record.dutyEndTime
                ? record.dutyStartTime + "-" + record.dutyEndTime
                : "--";
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
      classesList: [],
      dictionary,
      tableDataList: [],
    };
  },
  created() {
    this.setRouterCode("alarmInfo");
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
      this.getClassesListNoPage(); //班次列表
    },
    //获取列表
    getDataList() {
      let params = {
        ...this.formInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        dutyStartTime:
          this.formInline.timeArr && this.formInline.timeArr[0]
            ? this.formInline.timeArr[0]
            : undefined,
        dutyEndTime:
          this.formInline.timeArr && this.formInline.timeArr[1]
            ? this.formInline.timeArr[1]
            : undefined,
        dutyDate: this.formInline.dutyDate
          ? this.formInline.dutyDate.format("YYYY-MM-DD")
          : undefined,
        timeArr: undefined,
      };
      this.loading = true;
      this.tableSpinning = true
      GetDutyList(params)
        .then((res) => {
          this.tableDataList = res.data.list;
          this.page.total = res.data.total;
          this.cancelLoading();
        })
        .catch((err) => {
          console.log(err);
          this.cancelLoading();
        })
        .finally(()=>{
          this.tableSpinning = false
        })
    },

    //获取班次列表不分页
    getClassesListNoPage(flag) {
      return GetClassesListNoPage()
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
        this.formInline = {};
        this.getDataList();
      },
      250,
      { leading: true, trailing: false }
    ),
    exportExcel(){
      this.alarmTestVisible = true;
    },
    alarmTestCancle() {
      console.log("取消");
      this.alarmTestForm = {};
      this.alarmTestVisible = false;
    },
    alarmTestConfirm() {
      console.log("确定");
      if (!formValidator.formAll(this, 'alarmTest')) {
        return;
      }
      let startTime = this.alarmTestForm.preDateTime[0] ? dayJs(this.alarmTestForm.preDateTime[0]).format('YYYY-MM-DD') : '';
      let endTime = this.alarmTestForm.preDateTime[1] ? dayJs(this.alarmTestForm.preDateTime[1]).format('YYYY-MM-DD') : '';
      let params = {
        startDate: startTime,
        endDate:endTime,
      }
      ExoprCortExelNew(params).then((res) => {
        const name = '值班记录'
        const blob = new Blob([res],{ type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
        const downloadElement = document.createElement('a')
        const href = URL.createObjectURL(blob) //创建下载链接
        downloadElement.href = href
        downloadElement.download = name + '.xlsx'
        document.body.appendChild(downloadElement)
        downloadElement.click()
        document.body.removeChild(downloadElement)// 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
        this.alarmTestForm = {};
        this.alarmTestVisible = false;
        this.$antMessage.success(`${'操作成功！'}`);
      }).catch((err)=>{
        this.$antMessage.warn(`${err.message}`);
      }).finally(()=>{

      })
    },

    // 处理
    actionHandle(record, type) {
      let path =
        type == "handOver" //交接班
          ? "/safeManage/emergencyManagement/networkControl/ondutyRecordChangeShifts"
          : type == "change" //编辑
          ? "/safeManage/emergencyManagement/networkControl/ondutyRecordEdit"
          : "/safeManage/emergencyManagement/networkControl/ondutyRecordShow"; //查看
      this.$router.push({
        path: path,
        query: { dutyId: record.dutyId },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.log-wrapper {
  padding: 20px;
  border: 1px solid #eee;
  margin-bottom: 20px;
  box-shadow: 1px 1px 10px 5px #eee;
  div {
    display: flex;
    padding-top: 10px;
    border-radius: 10px;
    &:first-child {
      padding-top: 0;
    }
    span {
      &:first-child {
        width: 100px;
      }
      &:last-child {
        flex: 1;
      }
    }
  }
}
::v-deep.el-date-editor {
  width: 350px !important;
}
</style>