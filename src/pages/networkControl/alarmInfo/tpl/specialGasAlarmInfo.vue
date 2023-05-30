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
        <a-form-model-item label="设备品牌">
          <a-input
            v-model="formInline.equipBrand"
            placeholder="请输入设备品牌"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select v-model="formInline.status" placeholder="请选择状态">
            <a-select-option
              v-for="item in statusList"
              :key="item.key"
              :value="item.key"
              >{{ item.value }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="报警时间">
          <a-range-picker
            v-model="formInline.timeArr"
            :show-time="{ format: 'HH:mm:ss' }"
            format="YYYY-MM-DD HH:mm:ss"
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
            return index;
          }
        "
        :pagination="false"
      >
        <div slot="action" slot-scope="record">
          <span
            v-if="record.status == 0 || record.status == 1"
            class="color-0067cc cursor-pointer m-r-15"
            @click="actionHandle(record, 'deal')"
            >处理</span
          >
          <span
            v-if="record.status == 2"
            class="color-0067cc cursor-pointer m-r-15"
            @click="actionHandle(record, 'look')"
            >查看</span
          >
        </div>
        <div slot="siteAction" slot-scope="text, record">
          <span v-if="record.site && inSituListDit[record.site]">{{
            inSituListDit[record.site]
          }}</span>
          <span v-else>--</span>
        </div>
        <div slot="status" slot-scope="record">
          {{ findText(statusList, "key", record.status).value || "--" }}
        </div>
        <div slot="reasonType" slot-scope="record">
          {{
            findText(reasonTypeList, "dictValue", record.reasonType)
              .dictLabel || "--"
          }}
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import dictionary from "@/utils/dictionary";
import dayJs from "dayjs";
import moment from "moment";
import { debounce } from "lodash";
import { InfoGasPageList } from "@/services/api.js";
import { DownloadGasProcess } from "@/services/networkControl.js";

export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      tableSpinning:false,
      //现地字段下拉框数据
      inSituListDit: {},
      formInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      equipTypeList: [],
      statusList: [],
      reasonTypeList: [],

      detailVisible: false,
      currentMsg: {},

      handleForm: {
        val12: "1",
      },
      handleVisible: false,

      addVisible: false,
      addForm: {},

      // 表单验证
      handleFormRules: {
        val10: [
          {
            required: true,
            message: "报警原因类型不能为空",
            trigger: "change",
          },
        ],
        val11: [
          { required: true, message: "报警原因描述不能为空", trigger: "blur" },
        ],
        val12: [
          { required: true, message: "处理结果为必选项", trigger: "change" },
        ],
      },

      columns: [
        {
          title: "设备编号",
          dataIndex: "equipCode",
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
          title: "设备名称",
          dataIndex: "equipName",
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
          title: "安装位置",
          dataIndex: "location",
          width: 150,
        },
        {
          title: "设备品牌",
          dataIndex: "equipBrand",
          width: 150,
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
          title: "预警值",
          dataIndex: "preAlarmValue",
          width: 100,
        },
        {
          title: "一段值",
          dataIndex: "oneValue",
          width: 100,
        },
        {
          title: "两段值",
          dataIndex: "twoValue",
          width: 100,
        },
        {
          title: "预警描述",
          dataIndex: "description",
          width: 150,
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
          title: "报警时间",
          dataIndex: "alarmTime",
          width: 150,
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
          title: "状态",
          scopedSlots: { customRender: "status" },
          width: 150,
        },
        {
          title: "报警原因类型",
          scopedSlots: { customRender: "reasonType" },
          width: 150,
        },
        {
          title: "关闭时间",
          dataIndex: "closeTime",
          width: 150,
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
          title: "关闭人",
          dataIndex: "closePerson",
          width: 150,
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
      selectedRowKeys: [],

      terrainList: [
        {
          key: 1,
          value: "B1",
        },
        {
          key: 2,
          value: "B2",
        },
      ],
      dateStart: "",
      logVisible: false,
      logList: [
        {
          id: 1,
          name: "日志1",
          createTime: "2022/5/22 16:51:23",
        },
        {
          id: 2,
          name: "日志2",
          createTime: "2022/5/22 16:51:23",
        },
      ],
    };
  },
  created() {
    this.setRouterCode("alarmInfo");
    this.columns.splice(1, 0, this.addCommonColumnItem(150));
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
      this.companyName = JSON.parse(
      sessionStorage.getItem("zconsole_userInfo")).company.companyName;
      this.equipTypeList = dictionary("equipType");
      this.statusList = dictionary("closeStatus");
      this.reasonTypeList = Array.isArray(
        this.findText(this.dictTypeData, "dictType", "alarm_reason_type").dictItem
      )
        ? this.findText(this.dictTypeData, "dictType", "alarm_reason_type")
            .dictItem
        : [];
    },
    getDataList() {
      let params = {
        ...this.formInline,
        startTime: this.formInline.timeArr
          ? dayJs(this.formInline.timeArr[0]).format("YYYY-MM-DD HH:mm:ss")
          : undefined,
        endTime: this.formInline.timeArr
          ? dayJs(this.formInline.timeArr[1]).format("YYYY-MM-DD HH:mm:ss")
          : undefined,
        timeArr: undefined,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      };
      this.tableSpinning = true
      return InfoGasPageList(params)
        .then((res) => {
          this.tableDataList = res.data.list;
          this.page.total = res.data.total;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(()=>{
          this.tableSpinning = false
        })
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
        this.getDataList();
      },
      250,
      { leading: true, trailing: false }
    ),

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 导出excel
    async exportExcel() {
      let info = JSON.parse(sessionStorage.getItem("zconsole_userInfo"));
      let para = {
        ...this.formInline,
        startTime: this.formInline.timeArr
          ? dayJs(this.formInline.timeArr[0]).format("YYYY-MM-DD HH:mm:ss")
          : undefined,
        endTime: this.formInline.timeArr
          ? dayJs(this.formInline.timeArr[1]).format("YYYY-MM-DD HH:mm:ss")
          : undefined,
        timeArr: undefined,
        userId: info.user.userId,
        companyId: info.company.companyId,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      };
      const res = await DownloadGasProcess(para);
      if (res) {
        const name = "特气报警信息导出";   
        const blob = new Blob([res], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const downloadElement = document.createElement("a");
        const href = URL.createObjectURL(blob); //创建下载链接
        downloadElement.href = href;
        downloadElement.download = name + ".xlsx";
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      }
    },

    // 处理
    actionHandle(record, type) {
      this.handleVisible = true;
      this.$router.push({
        name: "特气处理查看",
        params: { idList: [record.equipGasId], type: type },
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
  },
  computed: {
    inSituList() {
      //从字典组里获取危害因素数据
      const dict = this.$store.state.setting.dictTypeData;
      const hazard = dict.find((item) => {
        return item.dictType == "organize";
      });
      hazard.dictItem.forEach((ele) => {
        this.$set(this.inSituListDit, ele.dictValue, ele.dictLabel);
      });
      return hazard.dictItem;
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
</style>