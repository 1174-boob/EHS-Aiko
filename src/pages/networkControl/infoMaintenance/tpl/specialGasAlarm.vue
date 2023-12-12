<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem
          ref="commonSearchItem"
          :CommonFormInline="formInline"
        ></CommonSearchItem>
        <a-form-model-item label="设备编号">
          <a-input
            v-model="formInline.equipCode"
            placeholder="请输入设备编号"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="设备名称">
          <a-input
            v-model="formInline.equipName"
            placeholder="请输入设备名称"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="安装位置">
          <a-input
            v-model="formInline.location"
            placeholder="请输入安装位置"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="机台名">
          <a-input
            v-model="formInline.machineName"
            placeholder="请输入机台名"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="设备品牌">
          <a-input
            v-model="formInline.equipBrand"
            placeholder="请输入设备品牌"
          ></a-input>
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
          <a-icon type="plus" />新建
        </a-button>
        <a-button type="dashed" @click="earlyWarningTest">预警测试</a-button>
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
        <a-button type="primary" style="margin-left:10px" @click="downTpl">下载导入模板</a-button>
        <a-button type="dashed" @click="batchExport" :loading="downLoading">批量导出</a-button>
      </div>
    </DashBtn>
    <CommonTable
      :page="page"
      :pageNoChange="pageNoChange"
      :showSizeChange="onShowSizeChange"
    >
      <a-table
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{ emptyText: emptyText }"
        :data-source="tableDataList"
        :rowKey="
          (record, index) => {
            return record.equipGasId;
          }
        "
        :pagination="false"
      >
        <div slot="action" slot-scope="record">
          <span
            class="color-0067cc cursor-pointer m-r-15"
            @click="actionEdit(record)"
            >编辑</span
          >
          <span
            class="color-0067cc cursor-pointer"
            @click="actionDelete(record)"
            >删除</span
          >
        </div>
        <!-- <div slot="gender" slot-scope="record">{{findText(genderList, "key", record.gender).value}}</div> -->
      </a-table>
    </CommonTable>
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
          :label-col="{ style: { width: '80px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 80px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <CommonSearchItem
            :CommonFormInline="editForm"
            :rules="editFormRules"
            :notTablePage="true"
            :labelCol="{ style: { width: '80px' } }"
            :wrapperCol="{ style: { width: 'calc(100% - 80px)' } }"
            labelAlign="left"
          ></CommonSearchItem>
          <a-form-model-item class="flex" label="设备编号" prop="equipCode">
            <a-input
              :maxLength="50"
              v-model="editForm.equipCode"
              placeholder="请输入设备编号"
            />
          </a-form-model-item>
          <a-form-model-item class="flex" label="设备名称" prop="equipName">
            <a-input
              :maxLength="50"
              v-model="editForm.equipName"
              placeholder="请输入设备名称"
            />
          </a-form-model-item>
          <a-form-model-item class="flex" label="气体" prop="gas">
            <a-input
              :maxLength="50"
              v-model="editForm.gas"
              placeholder="请输入气体"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="机台名" prop="machineName">
            <a-input
              :maxLength="50"
              v-model="editForm.machineName"
              placeholder="请输入机台名"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="安装位置" prop="location">
            <a-input
              :maxLength="50"
              v-model="editForm.location"
              placeholder="请输入安装位置"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="量程" prop="length">
            <a-input
              :maxLength="50"
              v-model="editForm.length"
              placeholder="请输入量程"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="设备品牌" prop="equipBrand">
            <a-input
              :maxLength="50"
              v-model="editForm.equipBrand"
              placeholder="请输入设备品牌"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="预警值" prop="preAlarmValue">
            <a-input
              :maxLength="50"
              v-model="editForm.preAlarmValue"
              placeholder="请输入预警值"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="一段值" prop="oneValue">
            <a-input
              :maxLength="50"
              v-model="editForm.oneValue"
              placeholder="请输入一段值"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="二段值" prop="twoValue">
            <a-input
              :maxLength="50"
              v-model="editForm.twoValue"
              placeholder="请输入二段值"
            ></a-input>
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
    <CommonModal
      title="预警测试"
      :visible="earlyWarningTestVisible"
      :cancelFn="earlyWarningTestCancle"
    >
      <template slot="form">
        <a-form-model
          ref="earlyWarningTest"
          :model="earlyWarningTestForm"
          :rules="earlyWarningTestFormRules"
          :label-col="{ style: { width: '80px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 80px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item class="flex" label="预警时间" prop="preDateTime">
            <a-range-picker
              format="YYYY/MM/DD HH:mm:ss"
              :show-time="{ format: 'HH:mm:ss' }"
              :disabled-date="disabledDate"
              v-model="earlyWarningTestForm.preDateTime"
              @calendarChange="calendarPriceRangeChange"
              :disabledTime="disabledDateTime"
              @change="changePriceRangeDate"
            >
              <a-icon slot="suffixIcon" type="calendar" />
            </a-range-picker>
          </a-form-model-item>
          <a-form-model-item class="flex" label="预警描述" prop="description">
            <a-input
              :maxLength="100"
              v-model="earlyWarningTestForm.description"
              placeholder="请输入预警描述"
            />
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

import dictionary from "@/utils/dictionary";
import dayJs from "dayjs";
import moment from "moment";
import uploadCanRemove from "@/mixin/uploadCanRemove";
import UploadBtnStyle from "@/components/upload/uploadBtnStyle.vue";
import serviceNameList from "@/config/default/service.config.js";

import { debounce } from "lodash";
import { cloneDeep } from "lodash";
import {
  gasPageList,
  gasExport,
  gasInsert,
  gasUpdate,
  gasDelete,
  preAlarmInsert,
} from "@/services/api.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading, uploadCanRemove],
  components: { UploadBtnStyle },
  data() {
    return {
      actions: `${process.env.VUE_APP_API_BASE_URL}${serviceNameList.danger}/api/ehs/equip/gas/upload`,
      formInline: {},
      preFormInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      selectedRowKeys: [],
      detailVisible: false,
      downLoading: false,
      currentMsg: {},

      editForm: {},
      editVisible: false,

      addVisible: false,
      addForm: {},

      editText: "",
      // 表单验证
      editFormRules: {
        equipCode: [
          { required: true, message: "设备编号不能为空", trigger: "blur" },
        ],
        equipName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" },
        ],
        gas: [{ required: true, message: "气体不能为空", trigger: "blur" }],
        machineName: [
          { required: true, message: "机台名不能为空", trigger: "blur" },
        ],
        location: [
          { required: true, message: "安装位置不能为空", trigger: "blur" },
        ],
        length: [{ required: true, message: "量程不能为空", trigger: "blur" }],
        equipBrand: [
          { required: true, message: "设备品牌不能为空", trigger: "blur" },
        ],
        preAlarmValue: [
          { required: true, message: "预警值不能为空", trigger: "blur" },
        ],
        oneValue: [
          { required: true, message: "一段值不能为空", trigger: "blur" },
        ],
        twoValue: [
          { required: true, message: "二段值不能为空", trigger: "blur" },
        ],
      },
      columns: [
        {
          title: "设备编号",
          dataIndex: "equipCode",
          width: 150,
        },
        {
          title: "设备名称",
          dataIndex: "equipName",
          width: 150,
        },
        {
          title: "气体",
          dataIndex: "gas",
          width: 150,
        },
        {
          title: "机台名",
          dataIndex: "machineName",
          width: 150,
        },
        {
          title: "安装位置",
          dataIndex: "location",
          width: 150,
        },
        {
          title: "量程",
          dataIndex: "length",
          width: 150,
        },
        {
          title: "设备品牌",
          dataIndex: "equipBrand",
          width: 150,
        },
        {
          title: "预警值",
          dataIndex: "preAlarmValue",
          width: 150,
        },
        {
          title: "一段值",
          dataIndex: "oneValue",
          width: 150,
        },
        {
          title: "二段值",
          dataIndex: "twoValue",
          width: 150,
        },
        {
          title: "创建人",
          dataIndex: "createUser",
          width: 150,
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          width: 150,
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          fixed: "right", // 固定操作列
          width: 200, // 宽度根据操作自定义设置
        },
      ],
      tableDataList: [],

      importVisible: false,
      earlyWarningTestVisible: false,

      earlyWarningTestForm: {},
      earlyWarningTestFormRules: {
        preDateTime: [
          { required: true, message: "预警时间不能为空", trigger: "change" },
        ],
        description: [
          { required: true, message: "报警描述不能为空", trigger: "blur" },
        ],
      },
      fileList: [],
      offsetDays: 0,
      selectPriceDate: "",
      oldSelectPriceDate: "",
    };
  },
  created() {
    this.setRouterCode("infoMaintenance");
    this.columns.splice(0, 0, this.addCommonColumnItem(150));
    this.getDataList();
  },
  methods: {
    // 导入模板下载
    downTpl() {
      window.open(
        window.location.host.indexOf('localhost') < 0 ? `${process.env.VUE_APP_API_PROXY_TARGET}/file/template/特气报警系统设备信息维护批量导入模板.xlsx` : `${process.env.VUE_APP_API_BASE_URL}file/template/特气报警系统设备信息维护批量导入模板.xlsx`
      );
    },
    async batchExport() {
      this.downLoading = true;
      let para = {
        ...this.formInline,
        gasEquipIdList: this.selectedRowKeys
      }
      let res = await gasExport(para);
      if(res){
        const name = '特气报警导出';
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
        this.selectedRowKeys = []
      }
      this.downLoading = false;
    },
    // 批量导入成功
    handleSuccess(fileList) {
      this.iRest();
    },
    getDataList() {
      let params = {
        ...this.preFormInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      };
      return gasPageList(params)
        .then((res) => {
          this.tableDataList = res.data.list;
          this.page.total = res.data.total;
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
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
    },
    // 查询
    iSearch() {
      this.preFormInline = { ...this.formInline };
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      };
      // 获取列表
      this.getDataList().finally(() => {
        this.cancelLoading();
      });
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
        this.preFormInline = {};
        this.getDataList();
      },
      250,
      { leading: true, trailing: false }
    ),
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 批量导入
    batchImport() {
      this.importVisible = true;
    },
    // 批量导入弹框-取消
    importCancle() {
      this.importVisible = false;
    },
    // 批量导入弹框-确定
    importConfirm() {
      this.importVisible = false;
    },

    // 预警测试
    earlyWarningTest() {
      if(this.selectedRowKeys.length == 0){
        this.$antMessage.warning('请至少选择一条数据')
        return
      }
      this.earlyWarningTestVisible = true;
    },
    earlyWarningTestCancle() {
      this.earlyWarningTestForm = {};
      this.earlyWarningTestVisible = false;
    },
    earlyWarningTestConfirm() {
      if (!formValidator.formAll(this, "earlyWarningTest")) {
        return;
      }
      if (this.selectedRowKeys.length == 0) {
        this.$antMessage.error("您还未选择预警数据");
      }
      let startTime =
        this.earlyWarningTestForm.preDateTime[0] &&
        this.earlyWarningTestForm.preDateTime[0].format("YYYY/MM/DD HH:mm:ss");
      let endTime =
        this.earlyWarningTestForm.preDateTime[1] &&
        this.earlyWarningTestForm.preDateTime[1].format("YYYY/MM/DD HH:mm:ss");
      console.log(this.earlyWarningTestForm, this.selectedRowKeys);
      let corporationIdList = [];
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        let id = (
          this.tableDataList.filter((item) => {
            return item.equipGasId == this.selectedRowKeys[i];
          })[0] || {}
        ).corporationId;
        if (id && corporationIdList.indexOf(id) == -1) {
          corporationIdList.push(id);
        }
      }
      if (corporationIdList.length != 1) {
        this.$antMessage.error(
          "选择的预警测试数据有误,所选数据的所属组织必须相同~"
        );
        return;
      }
      preAlarmInsert({
        preDateTime: startTime + "-" + endTime,
        description: this.earlyWarningTestForm.description,
        type: 2,
        equipGasIdList: this.selectedRowKeys,
        corporationId: this.getMappingValue(
          this.tableDataList,
          "equipGasId",
          this.selectedRowKeys[0]
        ).corporationId,
        centerId: this.getMappingValue(
          this.tableDataList,
          "equipGasId",
          this.selectedRowKeys[0]
        ).centerId,
      })
        .then((res) => {
          this.$antMessage.success("新增预警测试成功");
          this.earlyWarningTestVisible = false;
          this.earlyWarningTestForm = {};
          this.selectedRowKeys = [];
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 新增
    addFireAlam() {
      this.editText = "新增";
      this.editForm = {};
      this.editVisible = true;
    },
    // 编辑
    async actionEdit(record) {
      this.editText = "编辑";
      if(!this.getOrgAuthMisson(record.corporationId)) {
        return
      }
      record.corporationName = this.getMappingValue(this.getCommonAddOrgnizeList, 'orgId', record.corporationId).orgName;
      this.editForm = {
        centerId: record.centerId,
        corporationId: record.corporationId,
        corporationName:record.corporationName,
        equipGasId: record.equipGasId,
        equipCode: record.equipCode,
        equipName: record.equipName,
        gas: record.gas,
        machineName: record.machineName,
        location: record.location,
        length: record.length,
        equipBrand: record.equipBrand,
        preAlarmValue: record.preAlarmValue,
        oneValue: record.oneValue,
        twoValue: record.twoValue,
      };
      this.editVisible = true;
    },
    // 编辑弹框-取消
    editCancle() {
      this.editVisible = false;
      this.editForm = {};
    },
    // 编辑弹框-确定
    editConfirm() {
      if (!formValidator.formAll(this, "editForm")) {
        return;
      }
      let params = {
        ...this.editForm,
      };
      let promiseFn = gasInsert;
      if (this.editText == "编辑") {
        promiseFn = gasUpdate;
      }
      promiseFn(params)
        .then(() => {
          this.$antMessage.success(this.editText + "成功");
          this.editVisible = false;
          this.editForm = {};
          this.getDataList();
        })
        .catch((err) => console.log(err));
    },
    // 删除
    actionDelete(record) {
      this.$antConfirm({
        content: "确认删除？",
        cancelText: "取消",
        onOk: () => {
          gasDelete({
            equipGasId: record.equipGasId,
          })
            .then((res) => {
              this.$antMessage.success("删除成功");
              this.page.pageNo = 1;
              this.getDataList();
            })
            .catch((err) => {
              console.log(err);
            });
        },
      });
    },

    findText(arr, key, val) {
      // key：字段值， val：过滤值
      if (val == 0) val = 0 + "";
      if (!(arr && key && val)) {
        return {};
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] == val) {
          return arr[i];
        }
      }
      return {};
    },

    disabledDateTime(dates, partial) {
      // 当前时间的时分秒
      let hours = this.oldSelectPriceDate
        ? this.oldSelectPriceDate.hours()
        : moment().hours(); //0~23
      let minutes = this.oldSelectPriceDate
        ? this.oldSelectPriceDate.minutes()
        : moment().minutes(); //0~59
      let seconds = this.oldSelectPriceDate
        ? this.oldSelectPriceDate.seconds()
        : moment().seconds(); //0~59
      //当日只能选择当前时间之后的时间点
      if (partial == "end") {
        return {
          disabledHours: () => this.range(0, hours - 1),
          disabledMinutes: () => this.range(0, minutes - 1),
          disabledSeconds: () => this.range(0, seconds),
        };
      }
      if (
        this.oldSelectPriceDate &&
        this.oldSelectPriceDate.hours() > moment().hours()
      ) {
        return {
          disabledHours: () => this.range(0, hours - 1),
        };
      } else {
        return {
          disabledHours: () => this.range(0, hours - 1),
          disabledMinutes: () => this.range(0, minutes - 1),
          disabledSeconds: () => this.range(0, seconds),
        };
      }
    },
    range(start, end) {
      const result = [];
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
      return result;
    },
    // 选择完时间 清空限制
    changePriceRangeDate() {
      this.selectPriceDate = "";
    },
    //选择开始时间/结束时间
    calendarPriceRangeChange(date) {
      this.selectPriceDate = date[0];
      this.oldSelectPriceDate = date[0];
    },
    //根据选择的开始时间/结束时间，动态渲染要禁用的日期
    disabledDate(current) {
      if (this.selectPriceDate) {
        let selectV = moment(this.selectPriceDate, "YYYY-MM-DD").valueOf();
        return (
          current < moment().startOf("day") ||
          current > moment(new Date(selectV), "YYYY-MM-DD") ||
          current < moment(new Date(selectV), "YYYY-MM-DD")
        );
      } else {
        return current && current < moment().startOf("day");
      }
    },
  },
};
</script>
<style lang="less" scoped>
::v-deep .dashed-btn{
  .ant-btn-primary {
    background: #f1f4ff;
    color: #0067cc;
    border: 1px dashed #9fcaf5 !important;
  }
  .ant-btn-primary:hover {
    border: 1px dashed #0067cc !important;
  }
}
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