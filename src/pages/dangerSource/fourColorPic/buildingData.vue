<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="formInline"></CommonSearchItem>
        <a-form-model-item label="建筑">
          <a-input allowClear v-model="formInline.buildingName" placeholder="请输入建筑"></a-input>
        </a-form-model-item>
        <a-form-model-item label="楼层">
          <a-input allowClear v-model="formInline.floorName" placeholder="请输入楼层"></a-input>
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
        <a-button type="primary" size="small" @click="toBackPage">返回</a-button>
        <a-button type="primary" size="small" @click="addItem">
          <a-icon type="plus" />新增</a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: ''}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="corporationId" slot-scope="record">
          <span>{{ record.corporationId | corporationFilter}}</span>
        </div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="showEdit(record)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="deleteItem(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>

    <CommonModal :title="title" :visible="visible" :cancelFn="cancelFn">
      <template slot="form">
        <a-form-model ref="buildingFormRef" :rules="rules" :label-col="{ style: { width: '158px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 115px)' } }" :model="modelForm" :colon="false">
          <!-- <a-form-model-item class="flex" label="所属组织" prop="site">
            <a-input v-model="modelForm.corporationId" placeholder="请输入所属组织" :maxLength="30"></a-input>
          </a-form-model-item> -->
          <CommonSearchItem :CommonFormInline="modelForm" :rules="rules" :notTablePage="true" ></CommonSearchItem>
          <a-form-model-item class="flex" label="建筑" prop="buildingName">
            <a-input v-model="modelForm.buildingName" placeholder="请输入建筑" :maxLength="30"></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="楼层" prop="floorName">
            <a-input v-model="modelForm.floorName" placeholder="请输入楼层" :maxLength="30"></a-input>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="cancelFn">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="confirm">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>

<script>
import cancelLoading from '@/mixin/cancelLoading'
import ImportFile from "@/components/upload/importFile.vue"
import { debounce } from 'lodash'
import { riskBuildingList, riskBuildingAdd, riskBuildingUpdate, riskBuildingDelete, getRiskBuildingTreeData } from "@/services/dangerSource/fourColor"
import OrganizeLazyTree from '@/components/organizeLazyTree/organizeLazyTree.vue'
export default {
  components: { ImportFile, OrganizeLazyTree },
  mixins:[cancelLoading],
  data() {
    return {
      formInline: {
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      modelForm: {
      
      },
      rules: {
        buildingName: [
          { required: true, message: '请输入建筑', trigger: 'blur'}
        ],
        floorName: [
          { required: true, message: '请输入楼层', trigger: 'blur'}
        ]
      },
      loading: false,
      visible: false,
      userId: '',
      columns: [
        {
          title: '建筑',
          dataIndex: 'buildingName',
          align: 'center',
          width: 300
        },
        {
          title: '所属组织',
          align: 'center',
          scopedSlots: { customRender: 'corporationId' },
          width: 300
        },
        {
          title: '楼层',
          align: 'center',
          dataIndex: 'floorName',
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      curRow: null,
      tableSpinning: false,
      tableDataList: [],
    }
  },
  computed: {
    title() {
      return this.curRow ? '编辑' : '新增'
    },
  },
  created() {
    this.setRouterCode('fourColorList')
    this.getDataList()
  },
  methods: {
    getDataList() {
      let para = {
        ...this.formInline,
        ...this.page
      }
      this.tableSpinning = true
      return riskBuildingList(para)
      .then(res=>{
        const { list,total } = res.data ? res.data : {list:[],total:0}
        this.tableDataList = list
        this.page.total = total
      })
      .finally(()=>{
        this.tableSpinning = false
        this.cancelLoading()
      })
    },
    cancelFn() {
      this.$refs.buildingFormRef.resetFields()
      this.visible = false
    },
    confirm() {
      this.$refs.buildingFormRef.validate( async valid => {
        if (valid) {
          let para = {
            ...this.modelForm
          }
          if (this.curRow) {
            para.riskBuildingId = this.curRow.riskBuildingId
          }
          let api = this.curRow ? riskBuildingUpdate : riskBuildingAdd
          await api(para)
          let msg = this.curRow ? '编辑成功' : '新增成功'
          this.$antMessage.success(msg)
          this.getDataList()
          this.cancelFn()
        }
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
    iSearch(){
      this.handleLoading()
      this.getDataList(this.formInline)
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
    addItem() {
      this.curRow = null
      this.visible = true
    },
    showEdit(row) {
      this.curRow = row
      const { corporationId, buildingName, floorName, centerId } = row
      this.$set(this.modelForm, 'corporationId', corporationId)
      this.$set(this.modelForm, 'buildingName', buildingName)
      this.$set(this.modelForm, 'floorName', floorName)
      this.$set(this.modelForm, 'centerId', centerId)
      this.visible = true
    },
    toBackPage() {
      this.setKeepalive(true)
      this.$router.push({
        path: '/safeManage/dualControlManage/riskManage/fourColorList',
      })
    },
    async deleteItem(row) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: async ()=> {
          let para = {
            riskBuildingId: row.riskBuildingId
          }
          await riskBuildingDelete(para)
          this.$antMessage.success('删除成功')
          this.getDataList()
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
