<!--特种设备分析--> 
<template>
  <div>
    <DashBtn v-if="!disabled">
      <div>
        <a-button type="primary" @click="onSave">保存</a-button>
      </div>
    </DashBtn>
    <h3><i></i>特种设备</h3>
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow 
      show-overflow align="center" :row-config="{isHover: true}" :data="specialTableData"
      :cell-class-name="cellClassName" :header-cell-class-name="headerCellClassName1">
        <template v-for="(item) in specialColumns">
          <vxe-column v-if="['deviceTrouble', 'deviceDisable', 'deviceRectify'].includes(item.dataIndex)" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-select @change="specialHandleChange(row, item.dataIndex)" v-if="!disabled"  class="editable-select" :disabled="item.dataIndex != 'deviceTrouble' && row.deviceTrouble =='0'" v-model="row[item.dataIndex]" placeholder="请选择" option-filter-prop="children" show-search :filter-option="filterOption">
                <a-select-option v-for="item in options" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
              </a-select>
              <span v-else>{{+row[item.dataIndex] === 1 ? '是' : '否'}}</span>
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
      <!-- <a-table bordered :columns="specialColumns" :scroll="{ x: 1000 }" :locale="{emptyText: ''}" :data-source="specialTableData" :rowKey="(record, index)=>{return index}" :pagination="false">
      </a-table> -->
    </CommonTable>
    <h3><i></i>安全附件</h3>
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" 
      :row-config="{isHover: true}" :data="specialTableData" :cell-class-name="cellClassName" :header-cell-class-name="headerCellClassName1">
        <template v-for="(item) in safeColumns">
          <vxe-column v-if="['attachTrouble', 'attachRectify'].includes(item.dataIndex)" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title">
            <template #default="{ row }">
              <a-select @change="safeHandleChange(row, item.dataIndex)" v-if="!disabled" class="editable-select" v-model="row[item.dataIndex]" :disabled="item.dataIndex != 'attachTrouble' && row.attachTrouble =='0'" placeholder="请选择" option-filter-prop="children" show-search :filter-option="filterOption">
                <a-select-option v-for="item in options" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
              </a-select>
              <span v-else>{{+row[item.dataIndex] === 1 ? '是' : '否'}}</span>
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
    <h3><i></i>设备年检异常情况</h3>
    <DashBtn>
      <div v-if="!disabled">
        <a-button type="dashed" @click="addDeviceCheck">
          <a-icon type="plus"/>新增一行
        </a-button>
      </div>
    </DashBtn>
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border :header-cell-class-name="headerCellClassName1"
      show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="deviceTableData">
        <template v-for="(item) in deviceColumns">
          <vxe-column v-if="['isDisable', 'isRectify', 'isRetest'].includes(item.dataIndex)" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width ? item.width : 120" :title="item.title">
            <template #default="{ row }">
              <span>{{+row[item.dataIndex] === 1 ? '是' : '否'}}</span>
            </template>
          </vxe-column>
          <vxe-column v-else-if="item.dataIndex === 'action'" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width ? item.width : 120" :title="item.title">
            <template #default="{ row, rowIndex }">
              <span class="color-0067cc cursor-pointer" v-if="!disabled" @click="editDevice(row, rowIndex)">编辑</span>
              <span class="color-0067cc cursor-pointer mgl-10" v-if="disabled" @click="editDevice(row, rowIndex)">查看</span>
              <span class="color-ff4d4f cursor-pointer mgl-10" v-if="!disabled" @click="deleteDevice(rowIndex)">删除</span>
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
    <h3><i></i>安全附件异常情况</h3>
    <DashBtn>
      <div v-if="!disabled">
        <a-button type="dashed" @click="addSafeAttach">
          <a-icon type="plus"/>新增一行
        </a-button>
      </div>
    </DashBtn>
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border :cell-class-name="cellClassName1" :header-cell-class-name="headerCellClassName1"
      show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="attachTableData">
        <template v-for="(item) in attachColumns">
          <vxe-column v-if="item.dataIndex === 'action'" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width ? item.width : 120" :title="item.title">
            <template #default="{ row, rowIndex }">
              <span class="color-0067cc cursor-pointer" v-if="!disabled" @click="editAttach(row, rowIndex)">编辑</span>
              <span class="color-0067cc cursor-pointer mgl-10" v-if="disabled" @click="editAttach(row, rowIndex)">查看</span>
              <span class="color-ff4d4f cursor-pointer mgl-10" v-if="!disabled" @click="deleteAttach(rowIndex)">删除</span>
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
    <DeviceCheckModal :index="curIndex" :disabled="disabled" ref="deviceCheckRef" @callback="deviceCheckCallback" :visible.sync="deviceCheckVisible"/>
    <SafeAttachModal :index="curIndex" :disabled="disabled" ref="safeAttachRef" @callback="safeAttachCallback" :visible.sync="safeAttachVisible"/>
  </div>
</template>
<script>
import { equipmentDetail, saveEquipment } from '@/services/safeMonth'
import DeviceCheckModal from './DeviceCheckModal'
import SafeAttachModal from './SafeAttachModal'
import moment from 'moment'
import mixin from '../mixin'
import { debounce,  } from 'lodash'
export default {
  mixins: [mixin],
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    para: {
      type: Object,
      default: () => {}
    }
  },
  components: { DeviceCheckModal, SafeAttachModal },
  data() {
    return {
      curIndex: -1,
      deviceCheckVisible: false,
      safeAttachVisible: false,
      isDeviceTroubleEmpty : false,
      isDeviceDisableEmpty : false,
      isDeviceRectifyEmpty : false,
      isAttachTroubleEmpty : false,
      isAttachRectifyEmpty : false,
      options: [
        {
          key: '1',
          value: '是'
        },
        {
          key: '0',
          value: '否'
        }
      ],
      specialColumns: [
        {
          title: '特种设备总数',
          dataIndex: 'deviceTotal',
          width: 200,
          align: 'center'
        },
        {
          title: '本月到期年检设备数',
          dataIndex: 'deviceExpire',
          width: 200,
          align: 'center'
        },
        {
          title: '完成年检数量',
          dataIndex: 'deviceCheck',
          width: 200,
          align: 'center'
        },
        {
          title: '是否存在隐患',
          dataIndex: 'deviceTrouble',
          width: 200,
          align: 'center'
        },
        {
          title: '存在隐患设备是否已停用',
          dataIndex: 'deviceDisable',
          width: 200,
          align: 'center'
        },
        {
          title: '存在隐患设备已整改',
          dataIndex: 'deviceRectify',
          width: 200,
          align: 'center'
        },
      ],
      safeColumns: [
        {
          title: '安全附件数量',
          dataIndex: 'attachTotal',
          width: 200,
          align: 'center'
        },
        {
          title: '本月到期年检数量',
          dataIndex: 'deviceExpire',
          width: 200,
          align: 'center'
        },
        {
          title: '超期未年检数量',
          dataIndex: 'attachUnCheck',
          width: 200,
          align: 'center'
        },
        {
          title: '是否存在隐患',
          dataIndex: 'attachTrouble',
          width: 200,
          align: 'center'
        },
        {
          title: '存在隐患安全附件是否已更换',
          dataIndex: 'attachRectify',
          width: 200,
          align: 'center'
        },
      ],
      deviceColumns: [
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          width: 200,
          align: 'center'
        },
        {
          title: '设备编号',
          dataIndex: 'deviceCode',
          width: 200,
          align: 'center'
        },
        {
          title: '检测发现隐患描述',
          dataIndex: 'troubleDesc',
          width: 200,
          align: 'center'
        },
        {
          title: '处置措施',
          dataIndex: 'measure',
          width: 200,
          align: 'center'
        },
        {
          title: '是否已停用',
          dataIndex: 'isDisable',
          width: 200,
          align: 'center'
        },
        {
          title: '是否已整改',
          dataIndex: 'isRectify',
          width: 200,
          align: 'center'
        },
        {
          title: '是否已复测',
          dataIndex: 'isRetest',
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
      attachColumns: [
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          width: 200,
          align: 'center'
        },
        {
          title: '设备编号',
          dataIndex: 'deviceCode',
          width: 200,
          align: 'center'
        },
        {
          title: '检测发现隐患描述',
          dataIndex: 'troubleDesc',
          width: 200,
          align: 'center'
        },
        {
          title: '处置措施',
          dataIndex: 'measure',
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
      specialTableData: [],
      safeTableData: [],
      deviceTableData: [],
      attachTableData: []
    }
  },
  methods: {
    validate() {
      this.specialTableData.forEach(item => {
        if (this.isEmpty(item.deviceTrouble)) {
          this.isDeviceTroubleEmpty = true
        } else if (this.isEmpty(item.deviceDisable)) {
          this.isDeviceDisableEmpty = true
        } else if (this.isEmpty(item.deviceRectify)) {
          this.isDeviceRectifyEmpty = true
        }
      })
      if (this.isDeviceTroubleEmpty) {
        this.$antMessage.warn('请选择特种设备 是否存在隐患')
        return false
      }
      if (this.isDeviceDisableEmpty) {
        this.$antMessage.warn('请选择特种设备 存在隐患设备是否已停用')
        return false
      }
      if (this.isDeviceRectifyEmpty) {
        this.$antMessage.warn('请选择特种设备 存在隐患设备已整改')
        return false
      }
      this.specialTableData.forEach(item => {
        if (this.isEmpty(item.attachTrouble)) {
          this.isAttachTroubleEmpty = true
        } else if (this.isEmpty(item.attachRectify)) {
          this.isAttachRectifyEmpty = true
        }
      })
      if (this.isAttachTroubleEmpty) {
        this.$antMessage.warn('请选择安全附件 是否存在隐患')
        return false
      }
      if (this.isAttachRectifyEmpty) {
        this.$antMessage.warn('请选择安全附件 存在隐患安全附件是否已更换')
        return false
      }
      return true
    },
    onSave: debounce(function () {
      if (!this.validate()) {
        return
      }
      let para = {
        reportDate: moment(this.para.reportDate).format('YYYY-MM'),
        corporationId: this.para.corporationId,
        centerId: this.para.centerId
      }
      para.pecialAbnormalVoList = this.deviceTableData
      para.specialAttachVoList = this.attachTableData
      para.specialAnalyseVoList = this.specialTableData
      // console.log(para)
      // return
      saveEquipment(para)
      this.isChanged = false
      this.$antMessage.success('保存成功')
    }, 1000),
    async fetchData(para) {
      para = { ...this.para }
      const { data } = await equipmentDetail(para)
      if (data) {
        this.specialTableData = data.specialAnalyseVoList || []
        this.attachTableData = data.specialAttachVoList || []
        this.deviceTableData = data.pecialAbnormalVoList || []
        this.attachTableData = data.specialAttachVoList || []
      }
    },
    addDeviceCheck() {
      this.curIndex = -1
      this.deviceCheckVisible = true
    },
    addSafeAttach() {
      this.curIndex = -1
      this.safeAttachVisible = true
    },
    cellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (['deviceTrouble','deviceDisable', 'deviceRectify', 'attachTrouble', 'attachRectify'].includes(column.property)) {
        return 'editable-td'
      }
      return ''
    },
    cellClassName1({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (!['action'].includes(column.property)) {
        return 'editable-td'
      }
      return ''
    },
    headerCellClassName1({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (this.disabled) {
        return ''
      }
      if (!['action', 'deviceTotal', 'deviceExpire', 'deviceCheck', 'attachTotal', 'deviceExpire', 'attachUnCheck'].includes(column.property)) {
        return 'required'
      }
      return ''
    },
    editDevice(row, index) {
      this.curIndex = index
      this.deviceCheckVisible = true
      this.$nextTick(item => {
        this.$refs.deviceCheckRef.loadData({ ...row })
      })
    },
    // 下拉框搜索
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    deleteDevice(index) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: ()=> {
          this.isChanged = true
          this.deviceTableData.splice(index, 1)
        }
      })
    },
    editAttach(row, index) {
      this.curIndex = index
      this.safeAttachVisible = true
      this.$nextTick(item => {
        this.$refs.safeAttachRef.loadData({ ...row })
      })
    },
    deleteAttach(index) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: ()=> {
          this.isChanged = true
          this.attachTableData.splice(index, 1)
        }
      })
    },
    deviceCheckCallback(row) {
      this.isChanged = true
      if (this.curIndex !== -1) {
        this.$set(this.deviceTableData, this.curIndex, row)
      } else {
        this.deviceTableData.push(row)
      }
      
    },
    safeAttachCallback(row) {
      this.isChanged = true
      if (this.curIndex !== -1) {
        this.$set(this.attachTableData, this.curIndex, row)
      } else {
        this.attachTableData.push(row)
      }
    },
    headerCellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (['reason','plan'].includes(column.property)) {
        return 'required'
      }
      return ''
    },
    specialHandleChange(data, type) {
      if(type == 'deviceTrouble') {
        if(data.deviceTrouble == '1') {
          data.deviceDisable = ''
          data.deviceRectify = ''
        } else {
          data.deviceDisable = '0'
          data.deviceRectify = '0'
          this.isDeviceDisableEmpty = false
          this.isDeviceRectifyEmpty = false
        }
      }
    },
    safeHandleChange(data, type) {
      if(type == 'attachTrouble') {
        if(data.attachTrouble == '1') {
          data.attachRectify = ''
        } else {
          data.attachRectify = '0'
          this.isAttachRectifyEmpty = false
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.mgl-10{
  margin-left:10px;
}
</style>