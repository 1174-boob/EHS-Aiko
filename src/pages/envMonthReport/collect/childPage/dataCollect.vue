<template>
  <!-- 邀请列表 -->
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="searchFormData" :colon="false">
        <CommonSearchItem ref="commonSearchItem" :CommonFormInline="searchFormData"></CommonSearchItem>
        <a-form-model-item label="日期筛选">
          <a-select v-model="searchFormData.dateType" @change="handleChange" placeholder="请选择">
            <a-select-option key="1">月度</a-select-option>
            <a-select-option key="2">季度</a-select-option>
            <a-select-option key="3">半年度</a-select-option>
            <a-select-option key="4">年度</a-select-option>
          </a-select>
          <span style="width:10px;display: inline-block;"></span>
          <el-date-picker v-if="searchFormData.dateType==1" v-model="searchFormData.dateStr" value-format="yyyy-MM" type="month" placeholder="选择月" :clearable="false"></el-date-picker>
          <template v-if="searchFormData.dateType==2">
            <el-date-picker v-model="searchFormData.dateStr" type="year" value-format="yyyy" placeholder="选择年" :clearable="false"></el-date-picker>
            <span style="width:10px;display: inline-block;"></span>
            <a-select v-model="searchFormData.dataType" placeholder="请选择">
              <a-select-option key="1">第一季度</a-select-option>
              <a-select-option key="2">第二季度</a-select-option>
              <a-select-option key="3">第三季度</a-select-option>
              <a-select-option key="4">第四季度</a-select-option>
            </a-select>
          </template>
          <template v-if="searchFormData.dateType==3">
            <el-date-picker v-model="searchFormData.dateStr" type="year" value-format="yyyy" placeholder="选择年" :clearable="false"></el-date-picker>
            <span style="width:10px;display: inline-block;"></span>
            <a-select v-model="searchFormData.dataType" placeholder="请选择">
              <a-select-option key="1">上半年</a-select-option>
              <a-select-option key="2">下半年</a-select-option>
            </a-select>
          </template>
          <el-date-picker v-if="searchFormData.dateType==4" v-model="searchFormData.dateStr" type="year" value-format="yyyy" placeholder="选择年" :clearable="false"></el-date-picker>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>

    <!-- <DashBtn>
      <div>
        <a-button type="dashed" @click="openSelTable">显示数据配置</a-button>
      </div>
    </DashBtn> -->
    <!-- 列表 -->
    <vxe-table v-if="columnsAll" max-height="600" border resizable :merge-cells="mergeCells" :scroll-y="{enabled: false}" :data="tableData">
      <template v-for="(item,index) in columnsIng">
        <vxe-column v-if="item.props != 'sum'" :key="index" :type="item.type" :field="item.props" :title="item.title" :min-width="item.minWidth?item.minWidth:90"></vxe-column>
        <vxe-column v-else :key="index" :type="item.type" :field="item.props" :title="item.title" :min-width="item.minWidth?item.minWidth:90" :formatter="sumStr"></vxe-column>
      </template>

      <template #empty>
        <div style="padding:16px 0;">
          <a-empty />
        </div>
      </template>
    </vxe-table>

    <SelTable
      v-model="selectModel"
      :tableColumnAll="columnsAll"
      :tableColumnIng="columnsIng"
      :setColumLocalStorageName="setColumLocalStorageName"
      :columnsDefault="columnsDefault"
      @setTableColumn="setTableColumn"
    />
  </div>
</template>

<script>
import { cloneDeep, debounce } from "lodash";
import { environmentMonthList } from "@/services/envMonth.js";
import { lastMonth } from "./methods.js";
import SelTable from "@/pages/dangerWorkStatic/components/selTable.vue";
import cancelLoading from "@/mixin/cancelLoading";
import { BigNumber } from "bignumber.js";
// import tableDataJsonSource from "@/pages/envMonthReport/terrain/childPage/monthlyData.js";
import tableDataJsonSource from "@/pages/envMonthReport/terrain/childPage/aikoMonthData.js";
const tableDataJson = tableDataJsonSource.filter(i => i.nicheItemsCode < 1300);
export default {
  components: { SelTable },
  mixins: [cancelLoading],
  data() {
    return {
      searchFormData: { dateType: '1', dateStr: lastMonth(), dataType: '' },
      columnsStart: [
        {
          id: 1,
          title: "项目",
          disabled: true,
          isDefault: true,
          minWidth: 134,
          type: "html",
          props: 'projectName',
        },
        {
          id: 2,
          title: "数据",
          disabled: true,
          isDefault: true,
          minWidth: 190,
          props: 'nicheItems',
        },
      ],
      columnsEnd: [
        {
          id: 3,
          title: "爱旭汇总",
          disabled: true,
          isDefault: true,
          minWidth: 130,
          props: 'sum',
          fixed: 'right'
        }
      ],
      tableData: [],
      selectModel: false,
      columnsAll: null,
      setColumLocalStorageName: 'envCollectData',
      columnsIng: null,
      orgAbbrIds: null,
      mergeCells: [],
    };
  },
  created() {
    // this.searchFormData.dateStr = dayJs(this.searchFormData.month).format(
    //     "YYYY-MM"
    // );
    // let keys = ['爱旭太阳能', '义乌基地', '珠海基地', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15', 'B16', 'B17', 'B18', "B19"]
    let keys = this.getCommonAddOrgnizeList.filter((item) => {
      return item.orgName != '爱旭太阳能'
    }).map((item) => {
      return item.orgName
    });
    let columns = this.getCommonAddOrgnizeListAll.map((item, index) => {
      return {
        id: index + 3,
        title: item.orgName,
        disabled: keys.includes(item.orgName),
        isDefault: keys.includes(item.orgName),
        props: item.orgId,
        corporationId: item.orgId,
      }
    })
    this.orgAbbrIds = this.getCommonAddOrgnizeListAll.map((item, index) => {
      return item.orgId
    })
    this.columnsEnd[0].id = this.columnsStart.length + columns.length + 1;
    this.columnsAll = [...this.columnsStart, ...columns, ...this.columnsEnd]
    this.columnsIng = JSON.parse(JSON.stringify(this.columnsAll.filter(i => i.isDefault)))
    this.initData();
  },
  computed: {
    columnsDefault() {
      if (this.columnsAll) {
        return this.columnsAll.filter(item => item.isDefault)
      } else {
        return []
      }
    },
  },
  methods: {
    // 合并单元格
    mergeCellsFn() {
      //{row: 第几行, col: 第几列, rowspan: 竖向几个, colspan: 横向几个}
      //{ row: 3, col: 0, rowspan: 1, colspan: 3 }, 
      let mergeCellsData = tableDataJson.map((item, index) => {
        let obj = undefined
        if (item.needMerge) {
          obj = { row: index, ...item.mergeCellsObj }
        }
        if (item.nicheItemsCode == 999) {
          obj = { ...obj, colspan: this.columnsIng.length }
        }
        return obj
      })
      mergeCellsData = mergeCellsData.filter(item => item)
      return mergeCellsData
    },
    initData() {
      let apiData = {
        ...this.searchFormData
      }
      environmentMonthList(apiData)
        .then((res) => {
          let data = res.data;
          if (Object.keys(data).length) {
            this.mergeCells = []
            let tableData = tableDataJson.map((item, index) => {
              // 寻找匹配的数据
              let targetResArr = data[item.nicheItemsCode] ?? []
              // 处理匹配的数据---和表头对应
              let targetResData = {}
              this.columnsIng.forEach(item1 => {
                let targetObj = targetResArr.find(item2 => item2.corporationId == item1.props)
                if (targetObj) {
                  // 匹配key:value
                  targetResData[targetObj.corporationId] = targetObj.dataItem
                }
              })

              let obj = { ...item, ...targetResData }
              return obj
            })
            this.mergeCells = cloneDeep(this.mergeCellsFn())
            this.tableData = cloneDeep(tableData)
          } else {
            this.tableData = [];
          }
        })
        .catch(err => { })
        .finally(() => {
          this.cancelLoading();
        })
    },
    handleChange(e) {
      if (e == 1 || e == 4) {
        this.searchFormData.dataType = '';
      } else {
        this.searchFormData.dataType = '1';
      }
      if (e != 1) {
        this.searchFormData.dateStr = new Date().getFullYear().toString();
      }
    },
    // 打开自定义列弹窗
    openSelTable() {
      if (!this.canClickBtnMixin("dangerWorkStaticAccount-autoColumns")) {
        return;
      }
      this.selectModel = true
    },
    setTableColumn(diffKeys) {
      let columnsArr = JSON.parse(JSON.stringify(this.columnsAll.filter(item => !diffKeys.includes(item.id))))
      this.columnsIng = columnsArr
    },
    // 汇总
    sumStr({ row }) {
      let sum = 0
      Object.keys(row).forEach(item => {
        if (this.orgAbbrIds.includes(item)) {
          sum = BigNumber(sum).plus(BigNumber(row[item]))
        }
      })
      return (isNaN(sum) || sum === Infinity) ? 0 : sum.toFixed(2);
    },
    // 重置
    iRest: debounce(
      function () {
        this.searchFormData = { dateType: '1', dateStr: lastMonth(), dataType: '' };
        this.initData();
      },
      250,
      { leading: true, trailing: false }
    ),
    // 查询
    iSearch() {
      this.handleLoading();
      this.initData();
    },
  },
};
</script>

<style lang="less" scoped>
.shenglvhao {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
