<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline"></CommonSearchItem>
        <a-form-model-item label="状态">
          <a-select v-model="formInline.status" placeholder="请选择状态">
            <a-select-option v-for="item in statusList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="预警时间">
          <a-range-picker v-model="formInline.timeArr" :show-time="{ format: 'HH:mm:ss' }" format="YYYY/MM/DD HH:mm:ss" :placeholder="['起始时间', '结束时间']" />
        </a-form-model-item>

        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="status" slot-scope="record">{{findText(statusList, "key", record.status).value}}</div>
        <div slot="siteAction" slot-scope="text,record">
          <span v-if="record.site && inSituListDit[record.site]">{{inSituListDit[record.site]}}</span>
          <span v-else>--</span>
        </div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionHandle(record)">测试设备</span>
          <span v-show="record.status != 2" class="color-0067cc cursor-pointer" @click="actionedit(record)">编辑</span>
          <span v-show="record.status != 2" class="color-0067cc cursor-pointer" @click="actionDelete(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
    <CommonModal class="table-modal" title="测试设备列表" :visible="detailVisible" :cancelFn="detailCancle">
      <SearchTerm>
        <a-form-model layout="inline" :model="formInlineDetail" :colon="false">
          <a-form-model-item label="设备编号">
            <a-input v-model="formInlineDetail.equipCode" placeholder="请输入设备编号"></a-input>
          </a-form-model-item>
          <a-form-model-item label="设备名称">
            <a-input v-model="formInlineDetail.equipName" placeholder="请输入设备名称"></a-input>
          </a-form-model-item>
          <a-form-model-item label="具体位置">
            <a-input v-model="formInlineDetail.location" placeholder="请输入具体位置"></a-input>
          </a-form-model-item>

          <!-- 搜索栏按钮需要加固定的float-right类名 -->
          <a-form-model-item class="float-right">
            <a-button type="primary" :loading="loading" @click="iSearchDetail">查询</a-button>
            <a-button @click="iRestDetail">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </SearchTerm>
      <CommonTable :page="pageDetail" :pageNoChange="pageNoChangeDetail" :showSizeChange="onShowSizeChangeDetail">
        <a-table :columns="columnsDetail" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataListDetail" :rowKey="(record, index)=>{return index}" :pagination="false">
          <div slot="status" slot-scope="record">{{findText(statusList, "key", record.status).value}}</div>
          <div slot="equipType" slot-scope="record">{{findText(equipTypeList, "key", record.equipType).value}}</div>
          <div slot="action" slot-scope="record">
             <a-popover placement="topLeft">
              <template #content>
                <p class="topLeft_P" @click="thing(1,record)">当天未测试</p>
                <p class="topLeft_P" @click="thing(2,record)">测试未报警</p>
              </template>
              <span v-show="record.status == 3" class="color-0067cc cursor-pointer">原因</span>
            </a-popover>
            <span v-show="record.status == 1" class="color-0067cc cursor-pointer" @click="actionDeleteDetail(record)">移除</span>
          </div>
        </a-table>
      </CommonTable>
    </CommonModal>

    <CommonModal class="pre-test" title="预警测试" :visible="alarmTestVisible" :cancelFn="alarmTestCancle">
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
          <a-form-model-item class="flex" label="预警时间" prop="preDateTime">
            <a-range-picker
              format="YYYY/MM/DD HH:mm:ss"
              :show-time="{ format: 'HH:mm:ss' }"
              :disabled-date="disabledDate"
              v-model="alarmTestForm.preDateTime"
              @calendarChange="calendarPriceRangeChange"
              :disabledTime="disabledDateTime"
              @change="changePriceRangeDate"
            >
              <a-icon slot="suffixIcon" type="calendar" />
            </a-range-picker>
          </a-form-model-item>
          <a-form-model-item class="flex" label="预警描述" prop="description">
            <a-input :maxLength="100" v-model="alarmTestForm.description" placeholder="请输入预警描述" />
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
import cancelLoading from '@/mixin/cancelLoading';
import { formValidator } from "@/utils/clx-form-validator.js";
import dictionary from '@/utils/dictionary'
import dayJs from "dayjs";
import moment from 'moment'
import { debounce } from 'lodash';
import { preAlarmPageList, preAlarmDelete, preAlarmEdit, gasEquipPageList, removeEquip, retestEquip } from "@/services/api.js";
import { RetestPreAlarm } from "@/services/networkControl.js";

export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      tableSpinning:false,
      formInline: {},
      preFormInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      equipTypeList: [],
      statusList: [],
      columns: [
        // {
        //   title: '现地',
        //   scopedSlots: { customRender: 'siteAction' },
        //   width: 150
        // },
        {
          title: '预警时间',
          dataIndex: 'preAlarmTime',
          width: 150
        },
        {
          title: '预警描述',
          dataIndex: 'description',
          width: 150
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'status' },
          width: 150
        },
        {
          title: '创建人',
          dataIndex: 'createUser',
          width: 150
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 150
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
      preAlarmMsg: {},

      detailVisible: false,
      resetTest: false, // 是否点击的是重新测试
      formInlineDetail: {},
      preFormInlineDetail: {},
      pageDetail: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columnsDetail: [
        {
          title: '设备编号',
          dataIndex: 'equipCode',
          width: 150
        },
        {
          title: '设备名称',
          dataIndex: 'equipName',
          width: 150
        },
        {
          title: '气体',
          dataIndex: 'gas',
          width: 150
        },
        {
          title: '机台名',
          dataIndex: 'machineName',
          width: 150
        },
        {
          title: '安装位置',
          dataIndex: 'location',
          width: 150
        },
        {
          title: '量程',
          dataIndex: 'length',
          width: 150
        },
        {
          title: '设备品牌',
          dataIndex: 'equipBrand',
          width: 150
        },
        {
          title: '预警值',
          dataIndex: 'preAlarmValue',
          width: 150
        },
        {
          title: '一段值',
          dataIndex: 'oneValue',
          width: 150
        },
        {
          title: '二段值',
          dataIndex: 'twoValue',
          width: 150
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'status' },
          width: 150,
          align: "center",
          ellipsis: true
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 200,
          align: "center",
          ellipsis: true
        }
      ],
      tableDataListDetail: [],
      equipGasId: "",

      alarmTestVisible: false,
      alarmTestForm: {},
      alarmTestFormRules: { 
        preDateTime: [
          { required: true, message: "预警时间不能为空", trigger: "change" },
        ],
        description: [
          { required: true, message: "预警描述不能为空", trigger: "blur" },
        ]
      },
      companyName:'',
      inSituListDit:{}
    }
  },
  created() {
    this.columns.splice(1, 0, this.addCommonColumnItem(150));
    this.getDataList();
    this.equipTypeList = dictionary("equipType");
    this.statusList = dictionary("alarmStatus");
    this.companyName = JSON.parse(sessionStorage.getItem("zconsole_userInfo")).company.companyName;
  },
  methods: {
    thing(type,record){
      //type为1:当天未测试,type为2测试未报警
      this.$antConfirm({
        content: type == 1? '确认设置为当天未测试？': '确认设置为测试未报警？',
        cancelText: '取消',
        onOk: () => {
          if(type == 1){
              removeEquip({
                preAlarmId: this.currentDetailMsg.preAlarmId,
                equipGasId: record.equipGasId
              }).then(res => {
                this.$antMessage.success('操作成功');
                this.pageDetail.pageNo = 1;
                this.getDataListDetail();
              }).catch(err => {
                console.log(err);
              })
          }else{
            let params = { type: 2, preAlarmId: this.currentDetailMsg.preAlarmId, equipGasId: record.equipGasId }
            RetestPreAlarm(params).then((res) => {
              this.page.pageNo = 1;
              this.getDataListDetail();
              this.$antMessage.success('操作成功')
            }).catch((err) => {
              console.log(err);
            })
          }
        },
      });
    },
    getDataList() {
      let params = {
        ...this.preFormInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
        type: "2"
      }
      this.tableSpinning = true
      return preAlarmPageList(params)
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
      let { status, centerId, corporationId } = this.formInline;
      let { pageNo, pageSize } = this.page
      let startTime = "", endTime = "";
      if (this.formInline.timeArr) {
        startTime = this.formInline.timeArr[0] ? dayJs(this.formInline.timeArr[0]).format('YYYY/MM/DD HH:mm:ss') : '';
        endTime = this.formInline.timeArr[1] ? dayJs(this.formInline.timeArr[1]).format('YYYY/MM/DD HH:mm:ss') : '';
      }
      this.preFormInline = { centerId, corporationId, status, startTime, endTime, pageNo, pageSize };
      // 获取列表
      this.getDataList(this.preFormInline)
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 重置
    iRest: debounce(function () {
      this.$refs.commonSearchItem.reset();
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.preFormInline = {};
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    // 删除
    actionDelete(record) {
      this.$antConfirm({
        content: '确认删除？',
        cancelText: '取消',
        onOk: () => {
          preAlarmDelete({
            preAlarmId: record.preAlarmId,
            type: "2"
          }).then(res => {
            this.$antMessage.success('删除成功');
            this.page.pageNo = 1;
            this.getDataList();
          }).catch(err => {
            console.log(err);
          })
        },
      });
    },
    // 编辑
    actionedit(record) {
      console.log("编辑");
      this.resetTest = false;
      this.alarmTestVisible = true;
      this.preAlarmMsg = { ...record };
      this.alarmTestForm = {
        preDateTime: [record.startTime, record.endTime],
        // preDateTime: ["2022/08/26 07:00:00", "2022/08/26 08:30:00"],
        description: record.description
      }
    },
    // 测试设备
    async actionHandle(record) {
      this.detailVisible = true;
      this.currentDetailMsg = record;
      this.getDataListDetail();
    },
    resetModalMsg(flag) {
      this.tableDataListDetail = [];
      this.selectedRowKeys = [];
      this.pageDetail = {
        pageSize: 10,
        pageNo: 1,
        total: 0
      }
      if (flag) {
        this.formInlineDetail = {};
        this.preFormInlineDetail = {};
      }
    },
    // 详情弹框取消
    detailCancle(record) {
      this.detailVisible = false;
      this.resetModalMsg(true);
    },
    // 获取人员列表
    getDataListDetail() {
      return gasEquipPageList({
        pageSize: this.pageDetail.pageSize,
        pageNo: this.pageDetail.pageNo,
        preAlarmId: this.currentDetailMsg.preAlarmId,
        ...this.preFormInlineDetail
      }).then(res => {
        this.cancelLoading(100);
        this.tableDataListDetail = res.data.list;
        this.pageDetail.total = res.data.total;
      }).catch(err => {
        console.log(err);
      })
    },
    // 查询
    iSearchDetail() {
      this.preFormInlineDetail = { ...this.formInlineDetail };
      this.pageDetail = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      // 获取列表
      this.getDataListDetail()
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 重置
    iRestDetail: debounce(function () {
      this.resetModalMsg(true);
      this.getDataListDetail()
    }, 250, { leading: true, trailing: false }),
    // 页码改变
    pageNoChangeDetail(page) {
      this.pageDetail.pageNo = page;
      this.selectedRowKeys = [];
      // 获取列表
      this.getDataListDetail();
    },
    onShowSizeChangeDetail(current, pageSize) {
      this.pageDetail.pageNo = 1;
      this.pageDetail.pageSize = pageSize;
      this.selectedRowKeys = [];
      this.getDataListDetail();
    },
    // 移除
    actionDeleteDetail(record) {
      console.log("移除");
      this.$antConfirm({
        content: '确认移除？',
        cancelText: '取消',
        onOk: () => {
          removeEquip({
            preAlarmId: this.currentDetailMsg.preAlarmId,
            equipGasId: record.equipGasId
          }).then(res => {
            this.$antMessage.success('移除成功');
            this.pageDetail.pageNo = 1;
            this.getDataListDetail();
          }).catch(err => {
            console.log(err);
          })
        },
      });
    },
    // 重新测试
    alarmTest(record) {
      this.alarmTestVisible = true;
      this.resetTest = true;
      this.equipGasId = record.equipGasId;
      // this.offsetDays = moment().endOf("day").valueOf() - moment().valueOf();
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
      let promiseFn = preAlarmEdit;
      let startTime = this.alarmTestForm.preDateTime[0] ? dayJs(this.alarmTestForm.preDateTime[0]).format('YYYY/MM/DD HH:mm:ss') : '';
      let endTime = this.alarmTestForm.preDateTime[1] ? dayJs(this.alarmTestForm.preDateTime[1]).format('YYYY/MM/DD HH:mm:ss') : '';
      let params = {
        preDateTime: startTime + "-" + endTime,
        description: this.alarmTestForm.description,
      }
      if (this.resetTest) { // 测试设备-重新测试
        params.type = "2";
        console.log(this.currentDetailMsg)
        params.equipGasId = this.equipGasId;
        params.preAlarmId = this.currentDetailMsg.preAlarmId;
        promiseFn = retestEquip;
      } else { // 预警测试记录-编辑
        params.preAlarmId = this.preAlarmMsg.preAlarmId;
      }
      promiseFn(params).then(res => {
        this.$antMessage.success("预警测试成功");
        this.alarmTestVisible = false;
        this.alarmTestForm = {};
        this.getDataList();
      }).catch(err => {
        console.log(err);
      })
    },

    disabledDateTime(dates, partial) {
      // 当前时间的时分秒
      let hours = this.oldSelectPriceDate ? this.oldSelectPriceDate.hours() : moment().hours();//0~23
      let minutes = this.oldSelectPriceDate ? this.oldSelectPriceDate.minutes() : moment().minutes();//0~59
      let seconds = this.oldSelectPriceDate ? this.oldSelectPriceDate.seconds() : moment().seconds();//0~59
      //当日只能选择当前时间之后的时间点
      if (partial == 'end') {
        return {
          disabledHours: () => this.range(0, hours - 1),
          disabledMinutes: () => this.range(0, minutes - 1),
          disabledSeconds: () => this.range(0, seconds),
        };
      }
      if (this.oldSelectPriceDate && this.oldSelectPriceDate.hours() > moment().hours()) {
        return {
          disabledHours: () => this.range(0, hours - 1)
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
        let selectV = moment(this.selectPriceDate, "YYYY/MM/DD").valueOf();
        return (
          (current < moment().startOf("day") ||
            current > moment(new Date(selectV), "YYYY/MM/DD")) ||
          current < moment(new Date(selectV), "YYYY/MM/DD")
        );
      } else {
        return current && current < moment().startOf("day");
      }
    },

    findText(arr, key, val) { // key：字段值， val：过滤值
      if (val == 0) val = 0 + "";
      if (!(arr && key && val)) {
        return {};
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] == val) {
          return arr[i]
        }
      }
      return {}
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
}
</script>

<style lang="less" scoped>
.pre-test {
  /deep/ .ant-modal-wrap {
    z-index: 1001;
  }
}
.topLeft_P{
  width: 100%;
  &:hover{
    color: #0067cc;
    cursor: pointer;
  }
}
</style>