<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <DashBtn>
      <div>
        <a-button type="primary" size="small" @click="toBackPage">返回</a-button>
      </div>
    </DashBtn>
    <a-spin :spinning="spinning" wrapperClassName="a-spin">
      <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
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
    </a-spin>
    <CommonModal :title="title" :visible="visible" :cancelFn="cancelFn">
      <template slot="form">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :colon="false" :label-col="{ style: { width: '158px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 115px)' } }">
            <a-form-model-item class="flex" label="点位名称" prop="riskPointName" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input :disabled="disabled" @focus="onSelectFocus" @blur="onSelectBlur" v-model="form.riskPointName" placeholder="请输入点名称">
              </a-input>
            </a-form-model-item>
          <a-form-model-item class="flex" label="数采仪编号" prop="note" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select v-model="form.polluteName" multiple placeholder="请选择数采仪编号" option-filter-prop="children" show-search :filter-option="filterOption">
              <a-select-option v-for="item in []" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="备注" prop="note" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input :disabled="disabled" type="textarea" v-model="form.note" :maxLength="300" placeholder="请输入备注"></a-input>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <div class="btn-container">
          <a-button class="mgtl-20" @click="hide">取消</a-button>
          <a-button class="mgtl-20 confirm-btn" @click="popConfirm" type="primary">确定</a-button>
        </div>
      </template>
    </CommonModal>
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis"
import cancelLoading from '@/mixin/cancelLoading'
import { formValidator } from "@/utils/clx-form-validator.js"

import { mapState } from 'vuex'
import dayJs from "dayjs"
import moment from 'moment'
import ImportFile from "@/components/upload/importFile.vue"


import { debounce } from 'lodash'
import { riskBuildingList, riskBuildingAdd, riskBuildingUpdate, riskBuildingDelete, getRiskBuildingTreeData } from "@/services/dangerSource/fourColor"
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
      form: {

      },
      modelForm: {
      
      },
      rules: {
        no: [
          { required: true, message: '请输入编号', trigger: 'blur'}
        ],
        dataType: [
          { required: true, message: '请选择数采仪类型', trigger: 'blur'}
        ],
        position: [
          { required: true, message: '请输入位置', trigger: 'blur'}
        ],
        polluteName: [
          { required: true, message: '请选择污染物', trigger: 'blur'}
        ]
      },
      loading: false,
      visible: false,
      userId: '',
      columns: [
        {
          title: '点位名称',
          dataIndex: 'buildingName',
          align: 'center',
          width: 200
        },
        {
          title: '所属组织',
          align: 'center',
          scopedSlots: { customRender: 'corporationId' },
          width: 200
        },
        {
          title: '数采仪编号',
          align: 'center',
          dataIndex: 'floorName1',
          width: 200
        },
        {
          title: '数采仪类型',
          align: 'center',
          dataIndex: 'floorName2',
          width: 200
        },
        {
          title: '位置',
          align: 'center',
          dataIndex: 'floorName3',
          width: 200
        },
        {
          title: '污染物',
          align: 'center',
          dataIndex: 'floorName4',
          width: 200
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'floorName5',
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
      tableDataList: [{}, {}],
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
    async getDataList() {
      let para = {
        ...this.formInline,
        ...this.page
      }
      const { data } = await riskBuildingList(para)
      this.spinning = false
      if (data) {
        // this.tableDataList = data.list
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
.mgtl-20{
  margin-left: 20px;
}
.btn-container{
  /deep/.ant-btn{
    margin-left:20px;
  }
}
</style>
