<!--报警数据分析--> 
<template>
  <div>
    <CommonTable>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="realTableData">
        <template v-for="(item) in realColumes">
          <vxe-column v-if="item.dataIndex === 'action' && readOnly" :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width ? item.width : 120" :title="item.title">
            <template #default="{ row, rowIndex }">
              <span class="color-0067cc cursor-pointer" @click="addDeviceCheck(rowIndex)">编辑</span>
              <span class="color-ff4d4f cursor-pointer mgl-10" @click="deleteAttach(rowIndex)">删除</span>
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

    <!-- 添加列表弹窗 -->
    <AddRowModel v-model="realTableDataModelshow" :editIndex="realTableDataEditIndex" :moduleList="realTableData" @changeModuleList="changeModuleList" />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import AddRowModel from './comp/addRowModel.vue'
export default {
  components: { AddRowModel },
  props: {
    readOnly: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      realTableData: [],
      realTableDataEditIndex: -1,
      realTableDataModelshow: false,
      realColumes: [
        {
          title: '报警时间',
          dataIndex: 'alarmTime',
          width: 200,
          align: 'center'
        },
        {
          title: '系统',
          dataIndex: 'sysCode',
          width: 200,
          align: 'center'
        },
        {
          title: '报警描述',
          dataIndex: 'alarmDesc',
          width: 200,
          align: 'center'
        },
        {
          title: '责任部门',
          dataIndex: 'deptId',
          width: 200,
          align: 'center'
        },
        {
          title: '原因分析',
          dataIndex: 'reason',
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
          title: '举一反三排查',
          dataIndex: 'theLines',
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
    }
  },
  created() {
  },
  methods: {
    // 添加一行
    addDeviceCheck(index) {
      this.realTableDataEditIndex = (index == 0 || index) ? index : -1
      setTimeout(() => {
        this.realTableDataModelshow = true
      });
    },
    // 删除一行
    deleteAttach(index) {
      this.$antConfirm({
        title: '确认删除？',
        onOk: () => {
          this.realTableData.splice(index, 1)
        }
      })
    },
    // 修改主要成分table数据-添加一行
    changeModuleList(moduleDataList) {
      this.realTableData = cloneDeep(moduleDataList)
    },
  }
}
</script>

<style scoped lang="less">
</style>