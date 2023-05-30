<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" deptLabel="申请人部门"></CommonSearchItem>
        <a-form-model-item label="事件地点">
          <a-input allowClear v-model="formInline.eventLocation" placeholder="请输入事件地点"></a-input>
        </a-form-model-item>
        <a-form-model-item label="事件类型">
          <a-select allowClear show-search v-model="formInline.eventType" placeholder="请选择事件类型" option-filter-prop="children" :filter-option="filterOption">
            <a-select-option v-for="item in eventTypeOptions" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- <a-form-model-item label="状态">
          <a-select v-model="formInline.auditStatus" placeholder="请选择状态">
            <a-select-option v-for="item in approveStatusOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>-->
        <a-form-model-item label="事件日期">
          <a-range-picker format="YYYY-MM-DD" v-model="formInline.eventTime" :placeholder="['开始日期','结束日期']" />
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
        <a-button type="primary" size="small" @click="toBack">返回</a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 1000 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="corporationId" slot-scope="record">
          <span>{{getMappingValue($refs.commonSearchItem.commonAddOrgnizeList, "id", record.corporationId).orgName}}</span>
        </div>
        <div slot="createTime" slot-scope="record">{{ format(record.createTime) }}</div>
        <!-- <div slot="auditStatus" slot-scope="record">{{ record.auditStatus | systemFilter('approvalStatus')}}</div> -->
        <div slot="eventType" slot-scope="record">{{ record.eventType | userFilter('event_type')}}</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="toDealPage(record)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="deleteItem(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis"
import cancelLoading from '@/mixin/cancelLoading'
import { formValidator } from "@/utils/clx-form-validator.js"

import dictionary from '@/utils/newDictionary'
import oldDictionary from '@/utils/dictionary'
import { mapState, mapActions } from 'vuex'
import dayJs from "dayjs"
import moment from 'moment'
import uploadCanRemove from "@/mixin/uploadCanRemove"
import ImportFile from "@/components/upload/importFile.vue"

import { debounce, cloneDeep } from 'lodash'
import { falseAlarmList, falseAlarmDelete } from '@/services/accident'
export default {
  mixins: [teableCenterEllipsis, cancelLoading, uploadCanRemove],
  components: { ImportFile },
  data() {
    return {
      tableSpinning: false,
      formInline: {
        eventTime: []
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      equipTypeList: [],
      userId: '',
      columns: [
        {
          title: '编号',
          dataIndex: 'code',
          width: 200
        },
        {
          title: '事件地点',
          dataIndex: 'eventLocation',
          customRender: (text) => {
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
          width: 200
        },
        {
          title: '事件类型',
          scopedSlots: { customRender: 'eventType' },
          width: 150
        },
        {
          title: '事件日期',
          dataIndex: 'eventDate',
          width: 200
        },
        {
          title: '事件具体时间',
          dataIndex: 'eventTime',
        },
        {
          title: '起草人',
          dataIndex: 'userName',
          width: 150
        },
        // {
        //   title: '状态',
        //   scopedSlots: { customRender: 'auditStatus' },
        //   width: 150
        // },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 150
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 140 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
      approveStatusOptions: oldDictionary('approvalStatus')
    }
  },
  computed: {
    chemicalNameOptions() {
      return dictionary('chemical')
    },
    orgOptions() {
      return dictionary('organize')
    },
    corporationList() {
      return this.$store.state.setting.corporationList;
    },
    eventTypeOptions() {
      return dictionary('event_type')
    }
  },
  created() {
    this.columns.splice(0, 0, this.addCommonColumnItem(150))
    this.columns.splice(1, 0, this.addCommonColumnDepartment({
      width: 150,
      title: "使用部门"
    }))
    this.setRouterCode('falseAlarm')
    this.getDataList()
  },
  activated() {
    setTimeout(() => {
      if (!this.keepalive) {
        this.iRest()
      }
    }, 20);
  },
  methods: {
    getDataList() {
      this.tableSpinning = true
      let params = {
        ...this.formInline,
        draftStatus: 1,//非草稿列表
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      }
      if (this.formInline.eventTime[0]) {
        params.startTime = moment(this.formInline.eventTime[0]).format('YYYY-MM-DD')
        params.endTime = moment(this.formInline.eventTime[1]).format('YYYY-MM-DD')
      }
      return falseAlarmList(params)
        .then(res => {
          let { list: tableList, total } = res.data ? res.data : { list: [], total: 0 };
          this.tableDataList = tableList || [];
          this.page.total = total;
          // 处理页码 问题
          if (this.tableDataList.length === 0 && (this.page.pageNo !== 1 || this.page.total !== 0)) {
            this.page.pageNo = 1;
            this.getDataList();
          }
        })
        .catch(err => { })
        .finally(() => {
          this.tableSpinning = false
        })
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page
      // 获取列表
      this.getDataList()
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1
      this.page.pageSize = pageSize
      this.getDataList()
    },
    // 查询
    iSearch() {
      // 获取列表
      this.getDataList(this.formInline)
        .finally(() => {
          this.cancelLoading()
        })
    },
    // 重置
    iRest: debounce(function () {
      this.$refs.commonSearchItem.reset()
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
        eventTime: []
      }
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    format(val) {
      return moment(val).format('YYYY-MM-DD')
    },
    isResolveVisible(row) {
      let handler = row.handler ? row.handler.split(',') : []
      return handler.includes(this.userId)
    },
    async getUserInfo() {
      let user = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user || {}
      this.userId = user.userId
    },
    getSite(siteCode) {
      return (this.corporationList.find(item => {
        return item.corporationId === siteCode
      }) || {}).orgAbbrName
    },
    viewDetail(row) {
      this.$router.push({
        path: '/safeManage/emergencyManagement/accidentManagement/falseAlarmView',
        query: {
          id: row.accidentId,
          type: 'approveView'
        }
      })
    },
    toBack() {
      this.$router.push({
        path: '/safeManage/emergencyManagement/accidentManagement/falseAlarm'
      })
    },
    toDealPage(row) {
      this.$router.push({
        path: '/safeManage/emergencyManagement/accidentManagement/falseAlarmEdit',
        query: { id: row.accidentId }
      })
    },
    async deleteItem(row) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: async () => {
          let para = {
            accidentId: row.accidentId
          }
          await falseAlarmDelete(para)
          this.$antMessage.success('删除成功')
          this.getDataList()
        }
      })
    },
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    }
  }
}
</script>

<style lang="less" scoped>
.pre-test {
  /deep/ .ant-modal-wrap {
    z-index: 1001;
  }
}
</style>