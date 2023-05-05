<!--设备安全认证--> 
<template>
  <div>
    <DashBtn v-if="!disabled">
      <div>
        <a-button type="primary" @click="onSave">保存</a-button>
      </div>
    </DashBtn>
    <h3><i></i>设备安全认证报告</h3>
    <DashBtn>
      <div v-if="!disabled">
        <a-button type="dashed" @click="addDeviceSafe">
          <a-icon type="plus" />新增一行
        </a-button>
      </div>
    </DashBtn>
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border :header-cell-class-name="headerCellClassName"
      show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="safeTableData">
        <template v-for="(item) in safeColumes">
          <!-- <vxe-column v-if="['reason', 'conclusion'].includes(item.dataIndex)" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-select class="editable-select" v-model="row[item.dataIndex]" placeholder="请选择" option-filter-prop="children" show-search :filter-option="filterOption">
                <a-select-option v-for="item in reasonOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
              </a-select>
            </template>
          </vxe-column>
          <vxe-column v-else-if="['conclusion'].includes(item.dataIndex)" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-select class="editable-select" v-model="row[item.dataIndex]" placeholder="请选择" option-filter-prop="children" show-search :filter-option="filterOption">
                <a-select-option v-for="item in conclusionOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
              </a-select>
            </template>
          </vxe-column> -->
          <!-- <vxe-column v-if="['deviceType', 'deptId', 'quantity'].includes(item.dataIndex)" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-input  class="editable-textarea" v-model="row[item.dataIndex]"></a-input>
            </template>
          </vxe-column> -->
          <vxe-column v-if="item.dataIndex === 'deptId'" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span>{{(recFindProjectById(treeData, row.deptId) || {}).name || ''}}</span>
            </template>
          </vxe-column>
          <vxe-column v-else-if="['reason', 'conclusion'].includes(item.dataIndex)" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width ? item.width : 120" :title="item.title">
            <template #default="{ row }">
              <span v-if="item.dataIndex === 'reason'">{{findReasonLabel(row.reason)}}</span>
              <span v-else-if="item.dataIndex === 'conclusion'">{{findCoclusionLabel(row.conclusion)}}</span>
            </template>
          </vxe-column>
          <vxe-column v-else-if="item.dataIndex === 'action'" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width ? item.width : 120" :title="item.title">
            <template #default="{ row, rowIndex }">
              <span class="color-0067cc cursor-pointer" v-if="!disabled" @click="editSafe(row, rowIndex)">编辑</span>
              <span class="color-0067cc cursor-pointer mgl-10" v-if="disabled" @click="editSafe(row, rowIndex)">查看</span>
              <span class="color-ff4d4f cursor-pointer mgl-10" v-if="!disabled" @click="deleteSafe(rowIndex)">删除</span>
            </template>
          </vxe-column>
          <vxe-column v-else :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span>{{ row[item.dataIndex] }}</span>
            </template>
          </vxe-column>
        </template>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
    </CommonTable>
    <h3><i></i>认证不合格设备分析</h3>
    <DashBtn>
      <div v-if="!disabled">
        <a-button type="dashed" @click="addCertUnpass">
          <a-icon type="plus" />新增一行
        </a-button>
      </div>
    </DashBtn>
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border :header-cell-class-name="headerCellClassName"
      show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="certificateTableData">
        <template v-for="(item) in certificateColumes">
          <!-- <vxe-column v-if="['deviceType', 'deviceId', 'deptId'].includes(item.dataIndex)" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-input class="editable-input" v-model="row[item.dataIndex]"></a-input>
            </template>
          </vxe-column>
          <vxe-column v-else-if="['issueReason', 'measure', 'progress'].includes(item.dataIndex)" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-textarea  class="editable-textarea" v-model="row[item.dataIndex]"></a-textarea>
            </template>
          </vxe-column> -->
          <vxe-column v-if="item.dataIndex === 'deptId'" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span>{{(recFindProjectById(treeData, row.deptId) || {}).name || ''}}</span>
            </template>
          </vxe-column>
          <vxe-column v-else-if="item.dataIndex === 'action'" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width ? item.width : 120" :title="item.title">
            <template #default="{ row, rowIndex }">
              <span class="color-0067cc cursor-pointer" v-if="!disabled" @click="editCert(row, rowIndex)">编辑</span>
              <span class="color-0067cc cursor-pointer mgl-10" v-if="disabled" @click="editCert(row, rowIndex)">查看</span>
              <span class="color-ff4d4f cursor-pointer mgl-10" v-if="!disabled" @click="deleteCert(rowIndex)">删除</span>
            </template>
          </vxe-column>
          <vxe-column v-else :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <span>{{ row[item.dataIndex] }}</span>
            </template>
          </vxe-column>
        </template>
        <template #empty>
          <div style="padding:16px 0;">
            <a-empty />
          </div>
        </template>
      </vxe-table>
      <!-- <a-table bordered :columns="certificateColumes" :scroll="{ x: 1000 }" :locale="{emptyText: ''}" :data-source="certificateTableData" :rowKey="(record, index)=>{return index}" :pagination="false">
      </a-table> -->
    </CommonTable>
    <CertificateUnpassModal :treeData="treeData" :disabled="disabled" ref="certificateUppassRef" @callback="certUnpassCallback" :visible.sync="certificateUnpassVisible"/>
    <DeviceSafeModal :treeData="treeData" :disabled="disabled" ref="deviceSafeRef" @callback="deviceSafeCallback" :visible.sync="deviceSafeVisible" />

  </div>
</template>

<script>
import { deviceCertifyDetail, deviceCertifySave } from '@/services/safeMonth'
import DeviceSafeModal from './DeviceSafeModal'
import CertificateUnpassModal from './CertificateUnpassModal'
import moment from 'moment'
import mixin from '../mixin'
import { cloneDeep, debounce } from 'lodash'
export default {
  mixins: [mixin],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    treeData: {
      type: Array,
      default: () => []
    },
    para: {
      type: Object,
      default: () => {}
    }
  },
  components: { DeviceSafeModal, CertificateUnpassModal },
  data() {
    return {
      curIndex: -1,
      reasonOptions:  [
        { label:'新设备', key:'newDevice', value: 'newDevice' },
        { label:'设备变更', key:'deviceChange', value: 'deviceChange' },
        { label: '设备再认证', key:'deviceCert', value: 'deviceCert' }
      ],
      conclusionOptions: [
        { label:'合格', key:'passed', value: 'passed' },
        { label:'不合格待整改', key:'toModify', value: 'toModify' },
        { label:'不合格停用', key:'stoped', value: 'stoped' }
      ],
      certificateUnpassVisible: false,
      deviceSafeVisible: false,
      safeColumes: [
        {
          title: '设备类型',
          dataIndex: 'deviceType',
          width: 200,
          align: 'center'
        },
        {
          title: '所属部门',
          dataIndex: 'deptId',
          width: 200,
          align: 'center'
        },
        {
          title: '认证数量',
          dataIndex: 'quantity',
          width: 200,
          align: 'center'
        },
        {
          title: '认证原因',
          dataIndex: 'reason',
          width: 200,
          align: 'center'
        },
        {
          title: '认证结论',
          dataIndex: 'conclusion',
          width: 200,
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 200,
          align: 'center'
        },
      ],
      certificateColumes: [
        {
          title: '设备类型',
          dataIndex: 'deviceType',
          width: 200,
          align: 'center'
        },
        {
          title: '设备编号',
          dataIndex: 'deviceId',
          width: 200,
          align: 'center'
        },
        {
          title: '所属部门',
          dataIndex: 'deptId',
          width: 200,
          align: 'center'
        },
        {
          title: '认证不合格原因',
          dataIndex: 'issueReason',
          width: 200,
          align: 'center'
        },
        {
          title: '整改措施',
          dataIndex: 'measure',
          width: 200,
          align: 'center'
        },
        {
          title: '整改进度',
          dataIndex: 'progress',
          width: 200,
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 200,
          align: 'center'
        },
      ],
      safeTableData: [],
      certificateTableData: []
    }
  },
  methods: {
    onSave: debounce(function () {
      if (!this.validate()) {
        return
      }
      let para = {
        reportDate: moment(this.para.reportDate).format('YYYY-MM'),
        corporationId: this.para.corporationId,
        centerId: this.para.centerId
      }
      para.deviceCertifyVoList = this.safeTableData
      para.deviceUnqualifiedVoList = this.certificateTableData
      deviceCertifySave(para)
      this.isChanged = false
      this.$antMessage.success('保存成功')
    }, 250),
    findReasonLabel(val) {
      return (this.reasonOptions.find(item => {
        return item.value === val
      }) || {}).label
    },
    findCoclusionLabel(val) {
      return (this.conclusionOptions.find(item => {
        return item.value === val
      }) || {}).label
    },
    async fetchData(para) {
      para = { ...this.para }
      const { data } = await deviceCertifyDetail(para)
      if (data) {
        this.safeTableData = data.deviceCertifyVoList || []
        this.certificateTableData = data.deviceUnqualifiedVoList || []
      }
    },
    validate(cb) {
      return true
    },
    certUnpassCallback(row) {
      this.isChanged = true
      if (this.curIndex !== -1) {
        this.$set(this.certificateTableData, this.curIndex, row)
      } else {
        this.certificateTableData.push(row)
      }
    },
    deviceSafeCallback(row) {
      this.isChanged = true
      if (this.curIndex !== -1) {
        this.$set(this.safeTableData, this.curIndex, row)
      } else {
        this.safeTableData.push(row)
      }
    },
    editSafe(row ,index) {
      this.curIndex = index
      this.deviceSafeVisible = true
      this.$nextTick(item => {
        this.$refs.deviceSafeRef.loadData({ ...row })
      })
    },
    deleteSafe(index) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: ()=> {
          this.safeTableData.splice(index, 1)
          this.isChanged = true
        }
      })
    },
    editCert(row, index) {
      this.curIndex = index
      this.certificateUnpassVisible = true
      this.$nextTick(item => {
        this.isChanged = true
        this.$refs.certificateUppassRef.loadData({ ...row })
      })
    },
    deleteCert(index) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: ()=> {
          this.isChanged = true
          this.certificateTableData.splice(index, 1)
        }
      })
    },
    addDeviceSafe() {
      this.curIndex = -1
      this.deviceSafeVisible = true
    },
    addCertUnpass() {
      this.curIndex = -1
      this.certificateUnpassVisible = true
    },
    cellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (!['action'].includes(column.property)) {
        return 'editable-td'
      }
      return ''
    },
    
    headerCellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (!['action'].includes(column.property)) {
        return 'required'
      }
      return ''
    },

  }
}
</script>

<style>

</style>