<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" deptLabel="申请人部门"></CommonSearchItem>
        <a-form-model-item label="填报月份">
          <a-month-picker :disabledDate="disabledDate" v-model="formInline.reportDate" placeholder="选择月份" />
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="toAddPage">
          <a-icon type="plus" />数据填报
        </a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: tableScrollX() }" :locale="{emptyText: ''}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <template slot="corporationId" slot-scope="record">
          <a-popover autoAdjustOverflow>
            <div slot="content">
              <p>{{record.corporationId | corporationFilter}}</p>
            </div>
            <span>{{record.corporationId | corporationFilter}}</span>
          </a-popover>
        </template>
        <div slot="createTime" slot-scope="record">{{ format(record.createTime) }}</div>
        <div slot="nodeStatus" slot-scope="record">{{ record.nodeStatus | userFilter('security_month_approval')}}</div>
        <div slot="eventType" slot-scope="record">{{ record.eventType | userFilter('event_type') }}</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="viewDetail(record)">查看</span>
          <span v-if="[1,3].includes(+record.nodeStatus)" class="color-0067cc cursor-pointer" @click="toDealPage(record)">编辑</span>
          <!-- <span class="color-0067cc cursor-pointer" @click="showPreview(record)">预览</span> -->
          <span v-show="isResolveVisible(record)" class="color-0067cc cursor-pointer" @click="toResolvePage(record)">处理</span>
        </div>
      </a-table>
    </CommonTable>
    <CommonModal class="preview-modal" :title="'预览'" :visible="editVisible" :cancelFn="editCancle">
      <template slot="form">
        <safePreview importType="branch" :params="previewParams" />
      </template>
      <template slot="btn">
        <a-button @click="editCancle">取消</a-button>
      </template>
    </CommonModal>

    <CommonModal :title="'数据填报'" :visible="dataWriteVisible" :cancelFn="dataWriteCancelFn">
      <template slot="form">
        <a-form-model :rules="rules" :label-col="{ style: { width: '158px' } }" :wrapper-col="{ style: { width: 'calc(100% - 115px)' } }" ref="formRef" :model="form" :colon="false">
          <CommonSearchItem :CommonFormInline="form" :rules="rules" :notTablePage="true"></CommonSearchItem>
          <!-- <CommonSearchItem ref="commonSearchItem" :CommonFormInline="form" @corporationDeptChange="corporationDeptChange"></CommonSearchItem> -->
          <a-form-model-item class="flex" label="填报月份" prop="reportDate">
            <a-month-picker :disabledDate="disabledDate" format="YYYY-MM" v-model="form.reportDate" placeholder="选择月份" />
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="dataWriteCancelFn">取消</a-button>
        <a-button type="primary" class="mgl-20" @click="dataWriteConfirm">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>
<script>
import { safeMonthList, checkReportData, safeMonthProcessSave, safeMonthProcessReject } from '@/services/safeMonth'
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis"
import cancelLoading from '@/mixin/cancelLoading'
import { formValidator } from "@/utils/clx-form-validator.js"

import safePreview from '../safePreview'
import dictionary from '@/utils/newDictionary'
import oldDictionary from '@/utils/dictionary'
import { mapState, mapActions } from 'vuex'
import dayJs from "dayjs"
import moment from 'moment'
import uploadCanRemove from "@/mixin/uploadCanRemove"

import { debounce, cloneDeep } from 'lodash'
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  components: { safePreview },
  data() {
    return {
      tableSpinning:false,
      formInline: {
      },
      form: {},
      editVisible: false,
      dataWriteVisible: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      equipTypeList: [],
      userId: '',
      previewParams: {},
      columns: [
        {
          title: '所属组织',
          scopedSlots: { customRender: 'corporationId' },
          width: 180
        },
        {
          title: '填报月份',
          dataIndex: 'reportDate',
          width: 120
        },
        {
          title: '填报人',
          dataIndex: 'handlerName',
          minWidth: 150,
          customRender: (text) => {
            text = text ? text : ''
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
          title: '填报时间',
          dataIndex: 'createTime',
          width: 160
        },
        {
          title: '审批状态',
          scopedSlots: { customRender: 'nodeStatus' },
          minWidth: 120,
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 180 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
      rules: {
        reportDate: [
          { required: true, message: '请选择月份', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  computed: {
    chemicalNameOptions() {
      return dictionary('chemical')
    },
    orgOptions() {
      return dictionary('organize')
    },
    eventTypeOptions() {
      return dictionary('event_type')
    }
  },
  created() {
    this.setRouterCode('safeBranchCorp')
    this.getDataList()
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
        ...this.formInline,
        // draftStatus: 2,//非草稿列表
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      }
      if (params.reportDate) {
        params.reportDate = moment(params.reportDate).format('YYYY-MM')
      }
      this.tableSpinning = true
      return safeMonthList(params)
      .then(res=>{
        let { list: tableList, total } = res.data ? res.data : { list: [], total: 0 };
        this.tableDataList = tableList || [];
        this.page.total = total;
        // 处理页码 问题
        if (this.tableDataList.length === 0 && (this.page.pageNo !== 1 || this.page.total !== 0)) {
          this.page.pageNo = 1;
          this.getDataList();
        }
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },

    editCancle() {
      this.previewParams = {}
      this.editVisible = false
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
    iSearch: debounce(function () {
      // 获取列表
      this.getDataList(this.formInline)
        .finally(() => {
          this.cancelLoading()
        })
    }, 250),
    // 重置
    iRest: debounce(function () {
      this.$refs.commonSearchItem.reset()
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {
      }
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    format(val) {
      return moment(val).format('YYYY-MM-DD')
    },
    showPreview(row) {
      this.previewParams = {
        id: row.id,
        corporationId: row.corporationId,
        centerId: row.centerId,
        reportDate: row.reportDate
      }
      this.editVisible = true
    },
    isResolveVisible(row) {
      let userInfo = JSON.parse(sessionStorage.getItem('zconsole_userInfo')) || {}
      let user = userInfo.user || {}
      return row.handler === user.userId && +row.nodeStatus === 2
    },
    async getUserInfo() {
      let user = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user || {}
      this.userId = user.userId
    },
    dataWriteCancelFn() {
      this.$refs.formRef.resetFields()
      this.dataWriteVisible = false
    },
    async dataWriteConfirm() {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          let userInfo = JSON.parse(sessionStorage.getItem('zconsole_userInfo')) || {}
          let user = userInfo.user || {}
          let para = {
            reportDate: moment(this.form.reportDate).format('YYYY-MM'),
            corporationId: this.form.corporationId,
            centerId: this.form.centerId,
            handler: user.userId,
            deptId: user.adminDeptId
          }
          const { data } = await safeMonthProcessSave(para)
          if (data) {
            this.$router.push({
              path: '/safeManage/securityThinkTank/monthReportManage/safeBranchCorpCreate',
              query: {
                cId: para.centerId,
                corpId: para.corporationId,
                date: para.reportDate,
              }
            })
            this.dataWriteCancelFn()
          } else {
            this.$antMessage.warn(data)
          }
        }
      })


    },

    viewDetail(row) {
      this.$router.push({
        path: '/safeManage/securityThinkTank/monthReportManage/safeBranchCorpView',
        query: {
          id: row.id,
          cId: row.centerId,
          corpId: row.corporationId,
          date: row.reportDate,
          type: 'approveView',
          status: row.nodeStatus,
          state: 1,
        }
      })
    },
    toDealPage(row) {
      if (+row.nodeStatus === 3) {
        this.$antConfirm({
          title: '提示',
          content: '再次编辑需重新提交审批流程',
          cancelText: '取消',
          onOk: async () => {
            let para = {
              corporationId: row.corporationId,
              reportDate: row.reportDate
            }
            let api = safeMonthProcessReject
            await api(para)
            this.$router.push({
              path: '/safeManage/securityThinkTank/monthReportManage/safeBranchCorpEdit',
              query: {
                cId: row.centerId,
                status: row.nodeStatus,
                corpId: row.corporationId,
                date: row.reportDate,
                state: 2,
                // queryData: row
              }
            })
          },
        });
      } else {
        this.$router.push({
          path: '/safeManage/securityThinkTank/monthReportManage/safeBranchCorpEdit',
          query: {
            cId: row.centerId,
            corpId: row.corporationId,
            date: row.reportDate,
            status: row.nodeStatus,
            state: 2,
            queryData: row
          }
        })
      }
    },
    toResolvePage(row) {
      this.$router.push({
        path: '/safeManage/securityThinkTank/monthReportManage/safeBranchCorpResolve',
        query: {
          id: row.id,
          cId: row.centerId,
          corpId: row.corporationId,
          date: row.reportDate,
          status: row.nodeStatus
        }
      })
    },
    toAddPage() {
      this.dataWriteVisible = true
      // this.$router.push({
      //   path: '/monthReportManage/safeBranchCorpCreate'
      // })
    },
    disabledDate(current) {
      return current && current >= moment(new Date()).subtract(1, 'months').endOf('day')
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
.preview-modal {
  /deep/ .ant-modal {
    width: 1200px !important;
  }
}
.mgl-20 {
  margin-left: 20px;
}
.pre-test {
  /deep/ .ant-modal-wrap {
    z-index: 1001;
  }
}
</style>