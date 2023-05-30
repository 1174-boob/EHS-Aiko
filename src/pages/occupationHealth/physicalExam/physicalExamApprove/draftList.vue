<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :hasDepartment="true" :CommonFormInline="formInline" deptLabel="所属部门"></CommonSearchItem>
        <a-form-model-item label="姓名">
          <a-input v-model="formInline.name" placeholder="请输入姓名"></a-input>
        </a-form-model-item>
        <a-form-model-item label="工号">
          <a-input v-model="formInline.workNum" placeholder="请输入工号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="手机号">
          <a-input v-model="formInline.phone" placeholder="请输入手机号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="岗位">
          <a-select allowClear show-search v-model="formInline.post" placeholder="请选择岗位">
            <a-select-option v-for="item in postOptions" :key="item.value" :value="item.value">{{item.label}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="体检类别">
          <a-select v-model="formInline.checkType" placeholder="请选择体检类型">
            <a-select-option v-for="item in checkTypeOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="预约日期">
          <a-range-picker format="YYYY-MM-DD"  v-model="formInline.checkDate" :placeholder="['开始日期','结束日期']"/>
        </a-form-model-item>
        <!-- <a-form-model-item label="审核状态">
          <a-select v-model="formInline.infoStatus" placeholder="请选择状态">
            <a-select-option v-for="item in chemicalApproveStatusOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item> -->
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="primary" size="small" @click="toPEPage">返回</a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="createTime" slot-scope="record">{{ format(record.createTime) }}</div>
        <!-- <div slot="siteCode" slot-scope="record">{{ getSite(record.siteCode) }}</div> -->
        <div slot="corporationId" slot-scope="record">
          <span>{{getMappingValue($refs.commonSearchItem.commonAddOrgnizeList, "id", record.corporationId).orgName}}</span>
        </div>
        <div slot="checkType" slot-scope="record">{{ record.checkType | systemFilter('healthCheckType')}}</div>
        <div slot="post" slot-scope="record">{{ postLabel(record.post)}}</div>
        <div slot="status" slot-scope="record">{{ record.status | systemFilter('chemicalApproveStatus') }}</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="toEditPage(record)">编辑</span>
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

import { mapState } from 'vuex'
import dayJs from "dayjs"
import ImportFile from "@/components/upload/importFile.vue"

import { debounce, cloneDeep } from 'lodash'
import { healthApprovalList, healthCheckDelete, feathJobPosition } from "@/services/api.js"
import optionsMixin from '@/pages/occupationHealth/physicalExam/mixin/optionsMixin'
import postOptionsMixin from '@/pages/occupationHealth/physicalExam/mixin/postOptions'
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
import moment from 'moment'
export default {
  mixins: [teableCenterEllipsis, cancelLoading, optionsMixin, postOptionsMixin],
  components: { ImportFile, OrganizeLazyTree },
  data() {
    return {
      formInline: {
        checkDate: []
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      allPostOptions: [],
      userId: '',
      columns: [
        {
          title: '编号',
          dataIndex: 'code',
          width: 150
        },
        // {
        //   title: '所属组织',
        //   scopedSlots: { customRender: 'corporationId' },
        //   width: 150
        // },
        {
          title: '姓名',
          dataIndex: 'name',
          width: 150
        },
        {
          title: '工号',
          dataIndex: 'workNum',
          width: 150
        },
        {
          title: '手机号',
          dataIndex: 'phone',
          width: 150
        },
        // {
        //   title: '所属部门',
        //   dataIndex: 'departmentName',
        //   width: 150
        // },
        {
          title: '岗位',
          scopedSlots: { customRender: 'post' },
          width: 150
        },
        {
          title: '体检类别',
          scopedSlots: { customRender: 'checkType' },
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
    }
  },
  computed: {
  },
  created() {
    this.columns.splice(0, 0, this.addCommonColumnItem(150));
    this.columns.splice(1, 0, this.addCommonColumnDepartment({
      width: 150,
      title: "所属部门",
      key: "deptId"
    }))
    this.initConfigPage()
    this.getDataList()
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
      this.getAllJobOptions()
    },
    async getDataList() {
      let checkDateStart;
      let checkDateEnd;
      if (this.formInline.checkDate) {
        checkDateStart = this.formInline.checkDate[0] ? moment(this.formInline.checkDate[0]).format('YYYY-MM-DD') : ''
        checkDateEnd = this.formInline.checkDate[1] ? moment(this.formInline.checkDate[1]).format('YYYY-MM-DD') : ''
      }
      let params = {
        ...this.formInline,
        draftStatus: 1,//非草稿列表
        checkDateStart: checkDateStart,
        checkDateEnd: checkDateEnd,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      }
      this.tableSpinning = true
      const { code, data } = await  healthApprovalList(params)
      this.tableSpinning = false
      if (+code === 20000 && data) {
        this.tableDataList = data.list
        this.page.total = data.total
      }
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
      this.formInline = {}
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    format(val) {
      return moment(val).format('YYYY-MM-DD')
    },
    getSite(siteCode){
      return (this.corporationList.find(item => {
        return item.corporationId === siteCode
      }) || {}).orgAbbrName
    },
    viewDetail(row) {
      this.$router.push({
        path: '/occupationHealth/PEBookView',
        query: { id: row.id, type: 'approveView' }
      })
    },
    toEditPage(row) {
      if (+row.isBatch === 1) {
          this.$router.push({
          path: '/occupationHealth/multiPEBookEdit',
          query: { id: row.checkId }
        })
      } else {
        this.$router.push({
          path: '/occupationHealth/PEBookEdit',
          query: { id: row.checkId, personId: row.personId }
        })
      }
    },
    toPEPage() {
      this.$router.push({
        path: '/occupationHealth/physicalExam',
      })
    },
    async deleteItem(row) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: async ()=> {
          let para = {
            checkId: row.checkId
          }
          const { code } = await healthCheckDelete(para)
          if (+code === 20000) {
            this.$antMessage.success('删除成功')
            this.getDataList()
          }
        }
      })
    },
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