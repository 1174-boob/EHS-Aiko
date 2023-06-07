<template>
  <div>
    <PageTitle>特种设备检测分析报告</PageTitle>
    <!-- 特种设备检测分析报告 -->
    <CommonTable>
      <DashBtn>
        <div>
          <a-button type="dashed" v-if="!isPreviewType" @click="saveData">保存</a-button>
        </div>
      </DashBtn>
      <vxe-table class="vxe-scrollbar beauty-scroll-fireBox" border show-header-overflow show-overflow align="center" :row-config="{isHover: true}" :data="deviceChainVoList" :cellClassName="cellClassNameSel" :headerCellClassName="headerCellClassName" :column-config="{resizable: true}" height="300">
        <template v-for="(item, index) in columnsSpecial">
          <vxe-column v-if="item.dataIndex === 'typeName'" :key="index" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title" fixed="left">
            <template #default="{ row }">
              {{row.title}}
            </template>
          </vxe-column>
          <vxe-column v-else :key="item.dataIndex" :field="item.dataIndex" :min-width="item.width?item.width:120" :title="item.title" :fixed="index == columnsSpecial.length-1 ?'right' : ''">
            <template #default="{ row }">
              <a-select v-if="!isPreviewType && [4,5,6,10,11].includes(row.titleIndex) && index != columnsSpecial.length-1 && row[item.dataIndex]" class="editable-select" v-model="row[item.dataIndex]" placeholder="请选择" option-filter-prop="children" show-search :filter-option="filterOption">
                <a-select-option v-for="item in selectOptions" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
              </a-select>
              <span v-else-if="![4,5,6,10,11].includes(row.titleIndex) && item.dataIndex == 'total'">{{row.lastTotal}}</span>
              <span v-else>{{row[item.dataIndex] ? row[item.dataIndex] : '/'}}</span>
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
    <!-- 设备年检异常情况 -->
    <CommonTable>
      <a-table bordered :columns="columnsYear" :scroll="{ x: 800 }"  :data-source="pecialAbnormalVoList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <template slot="title">设备年检异常情况</template>
        <span slot="showSite" slot-scope="text, record">{{corporationList.find(item=>{ return record.corporationId == item.orgId }).orgName || record.corporationId}}</span>
        <span slot="isDisable" slot-scope="text, record">{{record.isDisable == 1 ? '是' : '否'}}</span>
        <span slot="isRectify" slot-scope="text, record">{{record.isRectify == 1 ? '是' : '否'}}</span>
        <span slot="isRetest" slot-scope="text, record">{{record.isRetest == 1 ? '是' : '否'}}</span>
      </a-table>
    </CommonTable>
    <!-- 安全附件异常情况 -->
    <CommonTable>
      <a-table bordered :columns="columnsSafe" :scroll="{ x: 800 }"  :data-source="specialAttachVoList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <template slot="title">安全附件异常情况</template>
        <span slot="showSite" slot-scope="text, record">{{corporationList.find(item=>{ return record.corporationId == item.orgId }).orgName || record.corporationId}}</span>
      </a-table>
    </CommonTable>
  </div>
</template>

<script>
import { headEquipmentDetail, headSaveEquipment } from '@/services/safeMonth'
export default {
  props: {
    searchData: {
      type: Object,
      default: {}
    },
    isPreviewType: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      columnsSpecial: [],
      columnsYear: [
        {
          title: '所属组织',
          dataIndex: 'corporationId',
          key: "corporationId",
          width: 180,
          scopedSlots: { customRender: "showSite" },
        },
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
          align: 'center',
          scopedSlots: { customRender: "isDisable" },
        },
        {
          title: '是否已整改',
          dataIndex: 'isRectify',
          width: 200,
          align: 'center',
          scopedSlots: { customRender: "isRectify" },
        },
        {
          title: '是否已复测',
          dataIndex: 'isRetest',
          width: 200,
          align: 'center',
          scopedSlots: { customRender: "isRetest" },
        },
      ],
      columnsSafe: [
        {
          title: '所属组织',
          dataIndex: 'corporationId',
          key: "corporationId",
          width: 180,
          scopedSlots: { customRender: "showSite" },
        },
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
      ],
      initDeviceChainVoList: [],
      deviceChainVoList: [],
      pecialAbnormalVoList: [],
      specialAttachVoList: [],
      columnDataList: [
        { typeName: '特种设备总数(台/套)', typeKey: 1},
        { typeName: '本月到期年检设备数', typeKey: 2 },
        { typeName: '月完成年检的数量', typeKey: 3 },
        { typeName: '是否存在隐患', typeKey: 4},
        { typeName: '存在隐患设备是否已停用', typeKey: 5 },
        { typeName: '存在隐患设备是否已整改', typeKey: 6 },
        { typeName: '安全附件数量', typeKey: 7 },
        { typeName: '本月到期年检数量', typeKey: 8 },
        { typeName: '超期未年检数量', typeKey: 9 },
        { typeName: '是否存在隐患', typeKey: 10 },
        { typeName: '存在隐患安全附件是否已更换', typeKey: 11 },
      ],
      selectOptions: [
        {
          key: '1',
          value: '是'
        },
        {
          key: '0',
          value: '否'
        }
      ],
    }
  },
  mounted() {
    this.searchTable();
  },
  computed: {
    // 组织所属组织机构
    corporationList() {
      return this.getCommonAddOrgnizeListAll
      // return this.$store.state.setting.corporationList
    },
  },
  methods: {
    headerCellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (!['eventType'].includes(column.property)) {
        return 'normal-th'
      }
      return ''
    },
    cellClassName({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (['eventType'].includes(column.property)) {
        return 'bold-td'
      }
      return ''
    },
    cellClassNameSel({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if ([4,5,6,10,11].includes(row.titleIndex) && column.field != 'typeName') {
        return 'editable-td'
      }
      return ''
    },
    async searchTable() {
      const { data } = await headEquipmentDetail(this.searchData);
      if(data) {
        // 定义表头
        this.columnsSpecial = this.corporationList.map( item => {
          return {
            title: item.orgName,
            dataIndex: item.orgId,
            width: 180,
            align: 'center'
          }
        })
        // 在表头和尾插入项目 & 合计
        this.columnsSpecial.unshift({
          title: '项目',
          dataIndex: 'typeName',
          width: 160,
          align: 'center',
        })
        this.columnsSpecial.push({
          title: '合计',
          dataIndex: 'total',
          width: 100,
          align: 'center',
        })
        // 最后将表格数据渲染到月、年、年均的每条数据中
        if(data.specialAnalyseVoList && data.specialAnalyseVoList.length > 0) {
          this.initDeviceChainVoList = data.specialAnalyseVoList;
          if(this.searchData.dataType != '1') {
            this.columnDataList = [
              { typeName: '特种设备总数(台/套)', typeKey: 1},
              { typeName: '本月到期年检设备数', typeKey: 2 },
              { typeName: '月完成年检的数量', typeKey: 3 },
              { typeName: '安全附件数量', typeKey: 7 },
              { typeName: '本月到期年检数量', typeKey: 8 },
              { typeName: '超期未年检数量', typeKey: 9 },
            ]
          } else {
            this.columnDataList = [
              { typeName: '特种设备总数(台/套)', typeKey: 1},
              { typeName: '本月到期年检设备数', typeKey: 2 },
              { typeName: '月完成年检的数量', typeKey: 3 },
              { typeName: '是否存在隐患', typeKey: 4},
              { typeName: '存在隐患设备是否已停用', typeKey: 5 },
              { typeName: '存在隐患设备是否已整改', typeKey: 6 },
              { typeName: '安全附件数量', typeKey: 7 },
              { typeName: '本月到期年检数量', typeKey: 8 },
              { typeName: '超期未年检数量', typeKey: 9 },
              { typeName: '是否存在隐患', typeKey: 10 },
              { typeName: '存在隐患安全附件是否已更换', typeKey: 11 },
            ]
          }
          let deviceChainVoList = this.columnDataList.map(item=> {
            let mapIndex = {
              title: item.typeName,
              titleIndex: item.typeKey,
              lastTotal: 0,
              width: 180,
              align: 'center'
            }
            data.specialAnalyseVoList.map(_item=> {
              if(mapIndex.titleIndex == 1) {
                mapIndex[_item.corporationId] = _item.deviceTotal
              }
              if(mapIndex.titleIndex == 2) {
                mapIndex[_item.corporationId] = _item.deviceExpire
              }
              if(mapIndex.titleIndex == 3) {
                mapIndex[_item.corporationId] = _item.deviceCheck
              }
              if(mapIndex.titleIndex == 4) {
                mapIndex[_item.corporationId] = _item.deviceTrouble
              }
              if(mapIndex.titleIndex == 5) {
                mapIndex[_item.corporationId] = _item.deviceDisable
              }
              if(mapIndex.titleIndex == 6) {
                mapIndex[_item.corporationId] = _item.deviceRectify
              }
              if(mapIndex.titleIndex == 7) {
                mapIndex[_item.corporationId] = _item.attachTotal
              }
              if(mapIndex.titleIndex == 8) {
                mapIndex[_item.corporationId] = _item.attachExpire
              }
              if(mapIndex.titleIndex == 9) {
                mapIndex[_item.corporationId] = _item.attachUnCheck
              }
              if(mapIndex.titleIndex == 10) {
                mapIndex[_item.corporationId] = _item.attachTrouble
              }
              if(mapIndex.titleIndex == 11) {
                mapIndex[_item.corporationId] = _item.attachRectify
              }
            })
            Object.keys(mapIndex).forEach((key)=>{
              if(!isNaN(key-0)) {
                mapIndex.lastTotal += (mapIndex[key]-0);
              }
            })
            return mapIndex
          })
          this.deviceChainVoList = deviceChainVoList;
        }
        this.pecialAbnormalVoList = data.pecialAbnormalVoList;
        this.specialAttachVoList = data.specialAttachVoList;
      } else {
        this.deviceChainVoList = [];
        this.pecialAbnormalVoList = [];
        this.specialAttachVoList = [];
      }
    },
    // 下拉框搜索
    filterOption(input, option) {
      // return (
      //   option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      // );
    },
    async saveData() {
      // 拿到deviceChainVoList处理过的数据
      // 循环initDeviceChainVoList初始数据
      // 用corporationId去匹配deviceChainVoList中的第4,5,6,10,11条数据中的以corporationId为key值的数
      // 按顺序,分别为deviceTrouble,deviceDisable,deviceRectify和attachTrouble,attachRectify
      // 将匹配选中的数据,赋值给initDeviceChainVoList遍历的当前数据
      // 最终调接口上送数据
      let handleData = this.deviceChainVoList.filter(item=>{
        return [4,5,6,10,11].includes(item.titleIndex)
      });
      this.initDeviceChainVoList.map((item, index)=>{
        handleData.map((insideItem, insideIndex)=>{
          if(insideIndex == 0) {
            item.deviceTrouble = insideItem[item.corporationId]
          }
          if(insideIndex == 1) {
            item.deviceDisable = insideItem[item.corporationId]
          }
          if(insideIndex == 2) {
            item.deviceRectify = insideItem[item.corporationId]
          }
          if(insideIndex == 3) {
            item.attachTrouble = insideItem[item.corporationId]
          }
          if(insideIndex == 4) {
            item.attachRectify = insideItem[item.corporationId]
          }
        })
      })
      if(this.initDeviceChainVoList && this.initDeviceChainVoList.length > 0) {
        const result = await headSaveEquipment({ specialAnalyseVoList: this.initDeviceChainVoList });
        if(result.code == 20000) {
          this.$antMessage.success('保存成功')
        }
        // 获取列表
        this.searchTable();
      }
    }
  }
}
</script>

<style>

</style>