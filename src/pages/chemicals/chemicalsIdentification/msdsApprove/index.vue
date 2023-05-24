<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline" :hasDepartment="true" deptLabel="申请人部门"></CommonSearchItem>
        <a-form-model-item label="申请人">
          <a-input allowClear v-model="formInline.applicant" placeholder="请输入申请人"></a-input>
        </a-form-model-item>
        <a-form-model-item label="标题">
          <a-input allowClear v-model="formInline.title" placeholder="请输入标题"></a-input>
        </a-form-model-item>
        <a-form-model-item label="化学品名称">
          <a-select allowClear show-search v-model="formInline.chemicalName" placeholder="请选择化学品名称" option-filter-prop="children" :filter-option="filterOption">
            <a-select-option v-for="item in chemicalNameOptions" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <a-select v-model="formInline.infoStatus" placeholder="请选择状态">
            <a-select-option v-for="item in chemicalApproveStatusOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
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
        <a-button type="primary" size="small" @click="toDraftPage">草稿箱</a-button>
        <a-button type="dashed" @click="toAddPage">
          <a-icon type="plus" />新建
        </a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 1000 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="corporationId" slot-scope="record">
          <span>{{getMappingValue($refs.commonSearchItem.commonAddOrgnizeList, "id", record.corporationId).orgName}}</span>
        </div>
        <div slot="createTime" slot-scope="record">{{ format(record.createTime) }}</div>
        <!-- <div slot="siteCode" slot-scope="record">{{ getSite(record.siteCode) }}</div> -->
        <div slot="chemicalName" slot-scope="record">{{ getChemicallName(record.chemicalName) }}</div>
        <div slot="infoStatus" slot-scope="record">{{ record.infoStatus | systemFilter('chemicalApproveStatus') }}</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="viewDetail(record)">查看</span>
          <span v-show="isResolveVisible(record)" class="color-0067cc cursor-pointer" @click="toDealPage(record)">处理</span>
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
// import ImportFile from "@/components/upload/importFile.vue"

import { debounce, cloneDeep } from 'lodash'
import { getMsdsApproveList, msdsGetUserInfo } from '@/services/chemicalMsds'
export default {
  mixins: [teableCenterEllipsis, cancelLoading, uploadCanRemove],
  // components: { ImportFile },
  data() {
    return {
      tableSpinning:false,
      formInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      equipTypeList: [],
      statusList: [
        { dictValue:1, dictLabel: '流转' },
        { dictValue:2, dictLabel: '结束' },
      ],
      userId: '',
      columns: [
        {
          title: '编号',
          dataIndex: 'code',
          width: 200
        },
        // {
        //   title: '所属组织',
        //   // scopedSlots: { customRender: 'siteCode' },
        //   scopedSlots: { customRender: 'corporationId' },
        //   width: 150
        // },
        {
          title: '标题',
          dataIndex: 'title',
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
          title: '化学品名称',
          scopedSlots: { customRender: 'chemicalName' },
          width: 150
        },
        {
          title: '申请人',
          dataIndex: 'applicant',
          width: 200
        },
        // {
        //   title: '申请人部门',
        //   dataIndex: 'applicationDepartment',
        //   width: 150
        // },
        {
          title: '创建时间',
          scopedSlots: { customRender: 'createTime' },
        },
        {
          title: '状态',
          dataIndex: 'nodeName',
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
      chemicalApproveStatusOptions: oldDictionary('chemicalApproveStatus')
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
    }
  },
  created() {
    this.columns.splice(1, 0, this.addCommonColumnItem(150))
    this.columns.splice(2, 0, this.addCommonColumnDepartment({
      width: 150,
      title: "申请人部门"
    }))
    this.setRouterCode('msdsApprove')
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
      this.getUserInfo()
    },
    getDataList() {
      let params = {
        ...this.formInline,
        isDraft: 0,//非草稿列表
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      }
      
      this.tableSpinning = true
      return getMsdsApproveList(params)
      .then(res=>{
        const {data } = res  
        this.tableDataList = data.list
        this.page.total = data.total
      })
      .finally(()=>{
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
      this.formInline = {}
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    getChemicallName(chemicalId) {
      if (!chemicalId || typeof chemicalId !== 'string') {
        return ''
      }
      let resArr = []
      let chemicalArr = chemicalId.split(',')
      while (chemicalArr.length) {
        let chemical = chemicalArr.shift()
        let chemicalName = ((this.chemicalNameOptions || []).find(item => {
          return item.dictValue === chemical
        }) || {}).dictLabel || ''
        resArr.push(chemicalName)
      }
      return resArr.join()
    },
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
    getSite(siteCode){
      return (this.corporationList.find(item => {
        return item.corporationId === siteCode
      }) || {}).orgAbbrName
    },
    viewDetail(row) {
      this.$router.push({
        path: '/safeManage/chemicalSafeManage/chemicalsIdentification/msdsApproveView',
        query: { 
          id: row.id,
          type: 'approveView'
        }
      })
    },
    toDraftPage() {
      this.$router.push({
        path: '/safeManage/chemicalSafeManage/chemicalsIdentification/msdsApproveDraftList'
      })
    },
    toDealPage(row) {
      this.$router.push({
        path: '/safeManage/chemicalSafeManage/chemicalsIdentification/msdsApproveResolve',
        query: { id: row.id }
      })
    },
    toAddPage() {
      this.$router.push({
        path: '/safeManage/chemicalSafeManage/chemicalsIdentification/msdsApproveCreate'
      })
    },
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    findText(infoStatus) { // key：字段值， val：过滤值
      return ((this.chemicalApproveStatusOptions || []).find(item => {
        return item.dictValue === infoStatus
      }) || {}).dictLabel
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