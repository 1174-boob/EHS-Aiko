<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :hasDepartment="true" :CommonFormInline="formInline" deptLabel="使用部门"></CommonSearchItem>
        <a-form-model-item label="资料名称">
          <a-input v-model="formInline.infoName" placeholder="请输入资料名称"></a-input>
        </a-form-model-item>
        <a-form-model-item label="化学品名称">
          <a-select allowClear show-search v-model="formInline.chemicalName" placeholder="请选择化学品名称" option-filter-prop="children" :filter-option="filterOption">
            <a-select-option v-for="item in chemicalNameOptions" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="有效日期">
          <a-range-picker format="YYYY-MM-DD" v-model="formInline.effectDate" :placeholder="['开始日期','结束日期']" />
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 1080 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <!-- <div slot="siteCode" slot-scope="record">{{ getSite(record.siteCode) }}</div> -->
        <div slot="corporationId" slot-scope="record">
          <span>{{getMappingValue($refs.commonSearchItem.commonAddOrgnizeList, "id", record.corporationId).orgName}}</span>
        </div>
        <div slot="validityTime" :class="[+record.isOverdue === 1 ? 'overdue-date' : '']" slot-scope="record">{{ record.validityTime }}</div>
        <div slot="chemicalName" slot-scope="record">{{ getChemicallName(record.chemicalName) }}</div>
        <div slot="form" slot-scope="record">{{ getFormName(record.form) }}</div>
        <div slot="infoFile" slot-scope="record">
          <span class="link-span" @click="downloadFile(record)">{{ record.infoFile }}</span>
        </div>
        <div slot="action" slot-scope="record">
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
import { mapState } from 'vuex'
import moment from 'moment'
import uploadCanRemove from "@/mixin/uploadCanRemove"
import ImportFile from "@/components/upload/importFile.vue"
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'


import { debounce } from 'lodash'
import { cloneDeep } from 'lodash'
import { msdsStoreList, msdsStoreDelete } from "@/services/chemicalMsds.js"
export default {
  mixins: [teableCenterEllipsis, cancelLoading, uploadCanRemove],
  components: { ImportFile, OrganizeLazyTree },
  data() {
    return {
      tableSpinning:false,
      formInline: {
        effectDate: []
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: '编号',
          dataIndex: 'code',
          width: 200
        },
        {
          title: '资料名称',
          dataIndex: 'infoName',
          key: "createTime",
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
          width: 160
        },
        {
          title: '资料文件',
          scopedSlots: { customRender: 'infoFile' },
          width: 160,
        },
        {
          title: '版本',
          dataIndex: 'version',
          width: 100
        },
        {
          title: '有效期',
          scopedSlots: { customRender: 'validityTime' },
          width: 150
        },
        {
          title: '化学品名称',
          scopedSlots: { customRender: 'chemicalName' },
          width: 150
        },
        {
          title: '形态',
          scopedSlots: { customRender: 'form' },
          width: 150
        },
        {
          title: '主要成分',
          dataIndex: 'mainComponents',
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
          width: 150
        },
        {
          title: '危险性',
          dataIndex: 'danger',
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
          width: 150
        },
        // {
        //   title: '使用部门',
        //   dataIndex: 'userDepartment',
        //   width: 150
        // },
        {
          title: '供应厂商',
          dataIndex: 'supplier',
          width: 150
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 100 // 宽度根据操作自定义设置
        }
      ],
      formOptions: dictionary('form'),
      tableDataList: [],
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
      return this.$store.state.setting.corporationList
    }
  },
  created() {
    this.setRouterCode('msdsStore')
    this.columns.splice(0, 0, this.addCommonColumnItem(150))
    this.columns.splice(1, 0, this.addCommonColumnDepartment({
      width: 150,
      title: "使用部门"
    }))
    this.getDataList()
  },
  methods: {
    getDataList() {
      let params = {
        ...this.formInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      }
      if (this.formInline.effectDate[0]) {
        params.validityTime = []
        params.validityTime[0] = moment(this.formInline.effectDate[0]).format('YYYY-MM-DD')
        params.validityTime[1] = moment(this.formInline.effectDate[1]).format('YYYY-MM-DD')
      }
      
      this.tableSpinning = true
      return msdsStoreList(params)
      .then(res=>{
        const { data } = res 
        this.tableDataList = data.list || []
        this.page.total = data.total
      })
      .catch(err=>{})
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    downloadFile(row) {
      let fileInfo = typeof row.infoFileId === 'string' ? JSON.parse(row.infoFileId) : []
      let fileUrl = fileInfo[0] ? fileInfo[0].url : ''
      if (fileUrl) {
        window.location.href = fileUrl
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
      this.formInline = {
        effectDate: []
      }
      this.getDataList()
    }, 250, { leading: true, trailing: false }),

    deleteItem(row) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: async () => {
          let para = {
            id: row.id
          }
          const { code } = await msdsStoreDelete(para)
          if (+code === 20000) {
            this.$antMessage.success('删除成功')
            this.getDataList()
          }
        }
      })
    },
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
        }) || {}).dictLabel || chemical
        resArr.push(chemicalName)
      }
      return resArr.join()
    },
    getFormName(form) {
      return ((this.formOptions || []).find(item => {
        return item.dictValue === form
      }) || {}).dictLabel
    },
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    getSite(siteCode) {
      return (this.corporationList.find(item => {
        return item.corporationId === siteCode
      }) || {}).orgAbbrName
    },
  }
}
</script>

<style lang="less" scoped>
.overdue-date {
  color: #f00;
}
.link-span {
  cursor: pointer;
  color: #02a7f0;
}
.pre-test {
  /deep/ .ant-modal-wrap {
    z-index: 1001;
  }
}
</style>