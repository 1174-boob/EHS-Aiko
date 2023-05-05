<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline"></CommonSearchItem>
        <a-form-model-item label="培训课程名称">
          <a-input v-model="formInline.courseName" placeholder="请输入培训课程名称"></a-input>
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
        <a-button type="dashed" @click="toAddPage">
          <a-icon type="plus" />新建
        </a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 1080 }" :locale="{emptyText: emptyText}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="corporationId" slot-scope="record">
          <span>{{getMappingValue($refs.commonSearchItem.commonAddOrgnizeList, "id", record.corporationId).orgName}}</span>
        </div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="toView(record)">查看</span>
          <span class="color-0067cc cursor-pointer" @click="toEdit(record)">编辑</span>
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
import dayJs from "dayjs"
import moment from 'moment'
import uploadCanRemove from "@/mixin/uploadCanRemove"
import ImportFile from "@/components/upload/importFile.vue"



import { debounce, cloneDeep } from 'lodash'
import { msdsCourseList, msdsCourseDelete } from "@/services/chemicalMsds"
export default {
  mixins: [teableCenterEllipsis, cancelLoading, uploadCanRemove],
  components: { ImportFile },
  data() {
    return {
      tableSpinning:false,
      formInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: '编号',
          dataIndex: 'id',
          width: 250
        },
        {
          title: '培训课程名称',
          dataIndex: 'courseName',
          width: 200
        },
        {
          title: '创建人',
          dataIndex: 'createUserName',
          width: 200
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          width: 200,
          fixed: 'right', // 固定操作列
          // 宽度根据操作自定义设置
        }
      ],
      tableDataList: [],
    }
  },
  created() {
    this.setRouterCode('trainingDatabase')
    this.columns.splice(1, 0, this.addCommonColumnItem(150));
    this.getDataList()
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.iRest()
      }
    }, 20);
  },
  computed: {
    corporationList() {
      return this.$store.state.setting.corporationList
    }
  },
  methods: {
    getDataList() {
      let params = {
        ...this.formInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      }
      this.tableSpinning = true
      return msdsCourseList(params)
      .then((res) => {
        this.tableDataList = res.data.list
        this.page.total = res.data.total
      })
      .catch((err) => {
        console.log(err)
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

    deleteItem(row) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: async () => {
          let para = {
            id: row.id
          }
          const { code, data } = await msdsCourseDelete(para)
          if (+code === 20000) {
            this.$antMessage.success('删除成功')
            this.getDataList()
          }
        }
      })
    },
    toEdit(row) {
      this.$router.push({
        path: '/safeManage/chemicalSafeManage/chemicalsIdentification/trainingDatabaseEdit',
        query: {
          id: row.id
        }
      })
    },
    toView(row) {
      this.$router.push({
        path: '/safeManage/chemicalSafeManage/chemicalsIdentification/trainingDatabaseView',
        query: {
          id: row.id
        }
      })
    },
    toAddPage() {
      this.$router.push({
        path: '/safeManage/chemicalSafeManage/chemicalsIdentification/trainingDatabaseCreate'
      })
    },
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    getIndex(index) {

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