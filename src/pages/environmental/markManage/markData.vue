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
          <div slot="corporationId" slot-scope="record">
            <span>{{ record.corporationId | corporationFilter}}</span>
          </div>
          <div slot="numberPickInstrumentType" slot-scope="record">
            <span>{{ {'water': '废水', 'gas': '废气' }[record.numberPickInstrumentType]}}</span>
          </div>
          <div slot="numberPickInstrumentLocation" slot-scope="record">
            <span>{{ record.numberPickInstrumentLocation | userFilter('point_location')}}</span>
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
          <CommonSearchItem :CommonFormInline="modelForm" :rules="rules" :notTablePage="true" @corporationChange="corporationChange"></CommonSearchItem>
          <a-form-model-item class="flex" label="数采仪编号" prop="numberPickInstrumentNum">
            <a-input v-model="modelForm.numberPickInstrumentNum" placeholder="请输入编号" :maxLength="30"></a-input>
          </a-form-model-item>
          <a-form-model-item class="flex" label="数采仪类型" prop="numberPickInstrumentType">
            <a-radio-group v-model="modelForm.numberPickInstrumentType" @change="handleWasteTypeChange">
              <a-radio value="gas">废气</a-radio>
              <a-radio value="water">废水</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item class="flex" label="位置" prop="numberPickInstrumentLocation">
            <a-select v-model="modelForm.numberPickInstrumentLocation" placeholder="请选择位置" option-filter-prop="children" show-search :filter-option="filterOption">
              <a-select-option v-for="item in locationOptions" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="污染物" prop="pollutantList">
            <a-select v-model="modelForm.pollutantList" mode="multiple" placeholder="请选择污染物" option-filter-prop="children" show-search :filter-option="filterOption">
              <a-select-option v-for="item in pollutantOptions" :key="item.pollutantId" :value="item.pollutantId">{{item.pollutantName}}</a-select-option>
            </a-select>
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

import dayJs from "dayjs"
import moment from 'moment'
import ImportFile from "@/components/upload/importFile.vue"
import oldDictionary from '@/utils/dictionary'
import dictionary from '@/utils/newDictionary'

import { debounce } from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { pointConfigPageList,  pointConfigAdd, pointConfigUpdate, pointConfigDetail, pointConfigDelete, monitorPollutantOptionList } from "@/services/envWatch/markManage"
export default {
  data() {
    return {
      formInline: {
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      pollutantOptions: [],
      modelForm: {
      
      },
      rules: {
        numberPickInstrumentNum: [
          { required: true, message: '请输入编号', trigger: 'blur'}
        ],
        numberPickInstrumentType: [
          { required: true, message: '请选择数采仪类型', trigger: 'blur'}
        ],
        numberPickInstrumentLocation: [
          { required: true, message: '请输入位置', trigger: 'blur'}
        ],
        pollutantList: [
          { required: true, message: '请选择污染物', trigger: ['blur']}
        ]
      },
      loading: false,
      visible: false,
      userId: '',
      columns: [
        {
          title: '所属组织',
          align: 'center',
          dataIndex: 'corporationName',
          width: 300
        },
        {
          title: '数采仪编号',
          align: 'center',
          dataIndex: 'numberPickInstrumentNum',
          width: 300
        },
        {
          title: '数采仪类型',
          align: 'center',
          scopedSlots: { customRender: 'numberPickInstrumentType' },
          width: 300
        },
        {
          title: '楼号',
          align: 'center',
          scopedSlots: { customRender: 'numberPickInstrumentLocation' },
          width: 300
        },
        {
          title: '污染物',
          align: 'center',
          dataIndex: 'pollutant',
          width: 300
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime',
          width: 300
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
    // ...mapGetters("setting", ["pollutantOptionsGetter"]),
    title() {
      return this.curRow ? '编辑' : '新增'
    },
    locationOptions() {
      return dictionary('point_location')
    }
    // pollutantOptions() {
    //   if (+this.modelForm.instrumentType === 1) {
    //     return oldDictionary('contaminants_gas_company')
    //   } else if (+this.modelForm.pollutantType === 2) {
    //     return oldDictionary('contaminants_water_company')
    //   }
    //   return []
    // }
  },
  created() {
    this.setRouterCode('pointMapManage')
    this.getDataList()
    // this.getPollutantOptions()
  },
  methods: {
    ...mapActions("setting", ["getPollutantOptions"]),
    async getDataList() {
      let para = {
        ...this.formInline,
        ...this.page
      }
      const { data } = await pointConfigPageList(para)
      this.spinning = false
      if (data) {
        this.tableDataList = data.list
        this.page.total = data.total
      }
    },
    // async getPollutantList() {
    //   const { data } = await monitorPollutantList()
    //   console.log(data, 'data- - --')
    //   this.pollutantOptions = data || [] 
    // },
    corporationChange(val) {
      
    },
    cancelFn() {
      this.$refs.buildingFormRef.resetFields()
      this.modelForm = {}
      this.visible = false
    },
    confirm() {
      this.$refs.buildingFormRef.validate( async valid => {
        if (valid) {
          let para = {
            ...this.modelForm
          }
          if (this.curRow) {
            para.numberPickInstrumentId = this.curRow.numberPickInstrumentId
          }
          para.pollutantList = this.pollutantOptions.filter(item => {
            return this.modelForm.pollutantList.includes(item.pollutantId)
          })
          let api = this.curRow ? pointConfigUpdate : pointConfigAdd
          await api(para)
          let msg = this.curRow ? '编辑成功' : '新增成功'
          this.$antMessage.success(msg)
          this.getDataList()
          this.getPollutantOptions()//成功后更新vuex
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
    handleWasteTypeChange(e) {
      this.$set(this.modelForm, 'pollutantList', [])
      this.onWasteTypeChange(e.target.value)
    },
    async onWasteTypeChange(val) {
      let para = {
        pollutantType: val
      }
      const { data } = await monitorPollutantOptionList(para)
      this.pollutantOptions = data || []
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
    async showEdit(row) {
      this.curRow = row
      let para = {
        numberPickInstrumentId: row.numberPickInstrumentId
      }
      const { data } = await pointConfigDetail(para)
      const { corporationId, corporationName, numberPickInstrumentNum, numberPickInstrumentType, numberPickInstrumentLocation } = data
      this.$set(this.modelForm, 'corporationId', corporationId)
      this.$set(this.modelForm, 'corporationName', corporationName)
      this.$set(this.modelForm, 'numberPickInstrumentType', numberPickInstrumentType)//类型
      this.$set(this.modelForm, 'numberPickInstrumentNum', numberPickInstrumentNum)
      this.$set(this.modelForm, 'numberPickInstrumentLocation', numberPickInstrumentLocation)
      let pollutantList = (data.pollutantList || []).map(item => {
        return item.pollutantId
      })
      this.$set(this.modelForm, 'pollutantList', pollutantList)
      this.visible = true
      // this.corporationChange(corporationId)
      this.onWasteTypeChange(numberPickInstrumentType)
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
            numberPickInstrumentId: row.numberPickInstrumentId
          }
          await pointConfigDelete(para)
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
