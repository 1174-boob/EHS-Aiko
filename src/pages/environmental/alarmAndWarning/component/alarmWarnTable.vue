<template>
  <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
    <a-table
      bordered
      :columns="columns"
      :scroll="{ x: 800 }"
      :locale="{emptyText: emptyText}"
      :data-source="dataList"
      :rowKey="(record, index)=>{return index}"
      :pagination="false"
    >
      <div slot="action" slot-scope="record">
        <span class="color-0067cc cursor-pointer" @click="action(record,'edit')">编辑</span>
        <span class="color-0067cc cursor-pointer" @click="action(record,'preview')">查看</span>
        <span class="color-ff4d4f cursor-pointer" @click="action(record,'delete')">删除</span>
      </div>
    </a-table>
  </CommonTable>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import dictionary from "@/utils/dictionary.js";
import chemicalDict from "@/mixin/chemicalDict.js";
export default {
  mixins: [teableCenterEllipsis,chemicalDict],
  props: {
    tabKey: {
      type: String,
      default: '1'
    },
    dataSource: {
      type: Object,
      default:()=>{}
    },
    tableSpinning:{
      default:false
    }
  },
  watch: {
    dataSource: {
      handler(val) {
        if(val && val.list && val.list.length>=1) {
          this.dataList = val.list;
          this.page.total = val.total;
        } else {
          this.dataList = [];
          this.page.total = 0;
        }
      },
      immediate: true,
      deep: true
    },
    tabKey: {
      handler(key) {
        this.getColumns(key);
      },
      immediate: true,
      deep: true
    },
    pollutantOptions: {
      handler(newV) {
        if(newV && newV.length) {
          for(let item of newV) {
            let unit = item.pollutantUnit ? '(' + item.pollutantUnit + ')' : '';
            let location = this.getChemicalDictText('point_location',item.location)
            let name = location + item.pollutantName + unit;
            this.$set(this.pollutantObj,item.instrumentPollutantRelId,name);
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      timeObj: {'60':'1小时','120':'2小时'},
      pollutantObj: {},
      columns: [],
      columns1: [
        {
          title: '污染物',
          dataIndex: 'instrumentPollutantRelId',
          key: "instrumentPollutantRelId",
          customRender: (text) => {
            return text ? this.pollutantObj[text] : '--'
          },
          width: 200
        },
        {
          title: '排气筒高度(m)',
          dataIndex: 'stackHeight',
          key: "stackHeight",
          width: 200
        },
        {
          title: '标准排放值',
          children: [
            {
              title: '浓度(mg/m3)',
              dataIndex: 'standardConcentration',
              key: 'standardConcentration',
              align:'center',
              width: 200,
            },
          ]
        },
        {
          title: '环评中要求排放标准值',
          children: [
            {
              title: '浓度(mg/m3)',
              dataIndex: 'requireConcentration',
              key: 'requireConcentration',
              align:'center',
              width: 200,
            },
          ]
        },
        {
          title: '报警值',
          children: [
            {
              title: '浓度(mg/m3)',
              dataIndex: 'alarmConcentration',
              key: 'alarmConcentration',
              align:'center',
              width: 200,
            },
          ]
        },
        {
          title: '预警值',
          children: [
            {
              title: '浓度(mg/m3)',
              dataIndex: 'warningConcentration',
              key: 'warningConcentration',
              align:'center',
              width: 200,
            },
          ]
        },
        {
          title: '恒值报警时间',
          dataIndex: 'constantAlarmTime',
          customRender: (text) => {
            return text ? text + '分钟' : '--'
          },
          width: 200,
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          width: 200,
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        },
      ],
      columns2: [
        {
          title: '污染物',
          dataIndex: 'instrumentPollutantRelId',
          key: "instrumentPollutantRelId",
          customRender: (text) => {
            return text ? this.pollutantObj[text] : '--'
          },
          width: 200
        },
        {
          title: '下限标准排放值浓度(mg/L)',
          dataIndex: 'standardDown',
          key: "standardDown",
          customRender: (text) => {
            return text ? text : '--'
          },
          width: 260
        },
        {
          title: '上限标准排放值浓度(mg/L)',
          dataIndex: 'standardUp',
          key: "standardUp",
          width: 260
        },
        {
          title: '下限环评中纳管标准值(mg/L)',
          dataIndex: 'requireDown',
          key: "requireDown",
          customRender: (text) => {
            return text ? text : '--'
          },
          width: 260
        },
        {
          title: '上限环评中纳管标准值(mg/L)',
          dataIndex: 'requireUp',
          key: "requireUp",
          width: 260
        },
        {
          title: '下限预警值(mg/L)',
          dataIndex: 'warningDown',
          key: "warningDown",
          customRender: (text) => {
            return text ? text : '--'
          },
          width: 200
        },
        {
          title: '上限预警值(mg/L)',
          dataIndex: 'warningUp',
          key: "warningUp",
          width: 200
        },
        {
          title: '下限报警值(mg/L)',
          dataIndex: 'alarmDown',
          key: "alarmDown",
          customRender: (text) => {
            return text ? text : '--'
          },
          width: 200
        },
        {
          title: '上限报警值(mg/L)',
          dataIndex: 'alarmUp',
          key: "alarmUp",
          width: 200
        },
        {
          title: '恒值报警时间',
          dataIndex: 'constantAlarmTime',
          customRender: (text) => {
            return text ? this.timeObj[text] : '--'
          },
          width: 200,
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          width: 200,
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        },
      ],
      dataList: [],
    }
  },
  computed: {
    pollutantOptions() {
      return this.$store.state.setting.pollutantOptions;
    },
  },
  created() {
    this.columns.splice(0, 0, this.addCommonColumnItem(150));
  },
  methods: {
    getColumns(key) {
      this.columns = this['columns'+key];
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      this.$emit('getPage',this.page);
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.$emit('getPage',this.page);
    },
    action(record,code) {
      this.$emit('action',record,code);
    }
  }
}
</script>

<style>

</style>