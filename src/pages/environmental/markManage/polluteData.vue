<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <DashBtn>
      <div>
        <a-button type="primary" size="small" @click="toBackPage">返回</a-button>
        <a-button type="primary" size="small" @click="addItem">
          <a-icon type="plus" />新增</a-button>
      </div>
    </DashBtn>
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
        <a-table bordered :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: ''}" :data-source="tableDataList" :rowKey="(record, index)=>{return index}" :pagination="false">
          <div slot="pollutantType" slot-scope="record">
            <span>{{ {gas: '废气', water: '废水'}[record.pollutantType]}}</span>
          </div>
          <div slot="pollutantUnit" slot-scope="record">
            <span>{{getPollutantUnitLabel(record)}}</span>
          </div>
          <div slot="action" slot-scope="record">
            <span class="color-0067cc cursor-pointer" @click="showEdit(record)">编辑</span>
            <span class="color-ff4d4f cursor-pointer" @click="deleteItem(record)">删除</span>
          </div>
        </a-table>
      </CommonTable>
    </a-spin>
    <CommonModal :title="title" :visible="visible" :cancelFn="cancelFn">
      <template slot="form">
        <a-form-model ref="buildingFormRef" :rules="rules" :label-col="{ style: { width: '158px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 115px)' } }" :model="modelForm" :colon="false">
          <a-form-model-item class="flex" label="污染物类型" prop="pollutantType">
            <a-radio-group v-model="modelForm.pollutantType">
              <a-radio value="gas">废气</a-radio>
              <a-radio value="water">废水</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item class="flex" label="污染物名称" prop="pollutantName">
            <a-input v-model="modelForm.pollutantName" placeholder="请输入污染物编号" :maxLength="30"></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="污染物编号" prop="pollutantNum">
            <a-input v-model="modelForm.pollutantNum" placeholder="请输入污染物编号" :maxLength="30"></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="单位" prop="pollutantUnit">
            <a-select v-model="modelForm.pollutantUnit" placeholder="请选择单位" option-filter-prop="children" show-search :filter-option="filterOption">
              <a-select-option v-for="item in unitOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="备注" prop="remark">
            <a-input type="textarea" v-model="modelForm.remark" placeholder="输入备注，200字以内" :maxLength="200"></a-input>
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

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis"
import cancelLoading from '@/mixin/cancelLoading'
import { formValidator } from "@/utils/clx-form-validator.js"
import dictionary from '@/utils/dictionary'
import oldDictionary from '@/utils/dictionary'
import { mapState } from 'vuex'
import dayJs from "dayjs"
import moment from 'moment'
import ImportFile from "@/components/upload/importFile.vue"


import { debounce } from 'lodash'
import { pollutantAdd, pollutantUpdate, pollutantDetail, pollutantPageList, pollutantDelete } from "@/services/envWatch/markManage"
export default {
  components: {  },
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
        pollutantName: [
          { required: true, message: '请选择污染物名称', trigger: 'blur'}
        ],
        pollutantNum: [
          { required: true, message: '请输入污染物编号', trigger: 'blur'}
        ],
        pollutantUnit: [
          { required: true, message: '请选择单位', trigger: 'blur'}
        ],
        pollutantType: [
          { required: true, message: '请选择污染物类型', trigger: 'blur'}
        ]
      },
      loading: false,
      visible: false,
      userId: '',
      columns: [
        {
          title: '污染物类型',
          // dataIndex: 'pollutantType',
          scopedSlots: { customRender: 'pollutantType' },
          align: 'center',
          width: 200
        },
        {
          title: '污染物名称',
          align: 'center',
          dataIndex: 'pollutantName',
          // scopedSlots: { customRender: 'corporationId' },
          width: 200
        },
        {
          title: '污染物编号',
          align: 'center',
          dataIndex: 'pollutantNum',
          width: 200
        },
        {
          title: '单位',
          align: 'center',
          dataIndex: 'pollutantUnit',
          width: 200
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'remark',
          width: 200
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime',
          width: 200
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
      spinning: false,
      tableDataList: [],
    }
  },
  computed: {
    title() {
      return this.curRow ? '编辑' : '新增'
    },
    unitOptions() {
      if (this.modelForm.pollutantType === 'gas') {
        return oldDictionary('contaminants_gas_company')
      } else if (this.modelForm.pollutantType === 'water') {
        return oldDictionary('contaminants_water_company')
      }
      return []
    }
  },
  created() {
    this.setRouterCode('fourColorList')
    this.getDataList()
  },
  methods: {
    async getDataList() {
      let para = {
        ...this.formInline,
        ...this.page
      }
      const { data } = await pollutantPageList(para)
      this.spinning = false
      if (data) {
        this.tableDataList = data.list
        this.page.total = data.total
      }
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
            para.pollutantId = this.curRow.pollutantId
          }
          let api = this.curRow ? pollutantUpdate : pollutantAdd
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
    iSearch: debounce(function(){
      // 获取列表
      this.getDataList(this.formInline)
        .finally(() => {
          this.cancelLoading()
        })
    }, 250, { leading: true, trailing: false }),
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
    getPollutantUnitLabel(row) {
      let para = row.pollutantType === 'gas' ? 'contaminants_gas_company' : 'contaminants_water_company'
      return (oldDictionary(para).find(item => {
        return item.key === row.pollutantUnit
      }) || {}).value || ''
    },
    showEdit(row) {
      this.curRow = row
      // const { corporationId, buildingName, floorName, centerId } = row
      this.modelForm = {...row}
      this.visible = true
    },
    toBackPage() {
      this.setKeepalive(true)
      this.$router.push({
        path: '/environmentManage/environmental/pointMapManage',
      })
    },
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    async deleteItem(row) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: async ()=> {
          let para = {
            pollutantId: row.pollutantId
          }
          await pollutantDelete(para)
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
