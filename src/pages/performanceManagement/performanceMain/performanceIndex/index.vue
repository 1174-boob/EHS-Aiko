<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle v-if="!flag">管理绩效指标</PageTitle>
    <SearchTerm v-if="!configIndex">
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="指标类型">
          <a-select v-model="formInline.indexType" placeholder="请选择指标类型">
            <a-select-option v-for="item in indexTypeList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="否决性指标">
          <a-select v-model="formInline.isNoIndex" placeholder="请选择否决性指标">
            <a-select-option v-for="item in isNoIndexList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="指标名称">
          <a-input v-model="formInline.indexInfo" placeholder="请输入指标名称"></a-input>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn v-if="!flag">
      <div>
        <a-button type="dashed" @click="addIndex">
          <a-icon type="plus" />新增指标
        </a-button>
      </div>
    </DashBtn>
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table
        :row-selection="(flag && !configIndex) ? {onChange: onSelectChange,...rowSelection} : undefined"
        :columns="columns"
        :scroll="{ x: tableScrollX() }"
        :locale="{emptyText: emptyText}"
        :data-source="tableDataList"
        :rowKey="tableRowKey"
        :pagination="false"
      >
        <div slot="indexType" slot-scope="record">{{getMappingValue(indexTypeList, "key", record.indexType).value}}</div>
        <div slot="isNoIndex" slot-scope="record">{{getMappingValue(isNoIndexList, "key", record.isNoIndex).value}}</div>
        <div slot="deductPoints" slot-scope="record">
          <div class="cell-item" v-for="item in record.deductPoints" :title="item">{{item ? item : "--"}}</div>
        </div>
        <div slot="unit" slot-scope="record">
          <div class="cell-item" v-for="item in record.unit" :title="item">{{item ? item : "--"}}</div>
        </div>
        <div slot="deductScore" slot-scope="record">
          <div class="cell-item" v-for="item in record.deductScore" :title="item">{{item ? item : "--"}}</div>
        </div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer m-r-15" v-if="!flag" @click="actionEdit(record)">编辑</span>
          <!-- 固定指标、关联管理绩效表的自定义指标 不可删除 -->
          <span class="color-red cursor-pointer" v-if="record.indexType != 1 && !configIndex" @click="actionDelete(record)">删除</span>
          <span class="color-red cursor-pointer" v-if="configIndex" @click="configIndexDelete(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
    <CommonModal class="table-modal" :title="isAdd ? '新增' : '编辑'" :visible="editVisible" :cancelFn="editCancle">
      <template slot="form">
        <a-form-model
          ref="editForm"
          :model="editForm"
          :rules="editFormRules"
          :label-col="{ style: { width: '94px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 94px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <!-- 固定指标 -->
          <a-form-model-item class="flex" label="否决性指标" prop="isNoIndex">
            <a-select v-model="editForm.isNoIndex" :disabled="editForm.indexType == 1" placeholder="请选择是否是否决性指标" @change="isNoIndexChange">
              <a-select-option v-for="item in isNoIndexList" :key="item.key" :value="item.key">{{item.value}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <!-- 固定指标 -->
          <a-form-model-item class="flex" label="指标名称" prop="indexInfo">
            <a-input v-model="editForm.indexInfo" :disabled="editForm.indexType == 1" :maxLength="100" placeholder="请输入指标名称"></a-input>
          </a-form-model-item>
          <!-- 否决性时为空且禁止点击 -->
          <a-form-model-item class="flex" label="风险分值" prop="riskScore">
            <a-input type="number" :disabled="editForm.isNoIndex == 2" v-model="editForm.riskScore" placeholder="请输入风险分值"></a-input>
          </a-form-model-item>
          <div class="m-b-20">
            <vxe-table
              class="vxe-scrollbar beauty-scroll-fireBox"
              border
              align="center"
              ref="xTable"
              show-overflow
              :edit-config="{trigger: 'click', mode: 'cell'}"
              :column-config="{resizable: true}"
              :row-config="{height: 60, isHover: true}"
              :data="modalTableData"
            >
              <!-- 固定指标 || 否决性 -->
              <vxe-column field="deductPoints" title="扣分标准" min-width="300" :edit-render="{autofocus: '.vxe-input--inner', placeholder: '请点击输入扣分标准'}">
                <template #edit="{ row }">
                  <a-input
                    :disabled="editForm.isNoIndex == 2 || editForm.indexType == 1"
                    :maxLength="100"
                    v-model="row.deductPoints"
                    type="text"
                    placeholder="请点击输入扣分标准"
                    allowClear
                    @blur="(e) => {removeComma(e, row, 'deductPoints')}"
                  ></a-input>
                </template>
              </vxe-column>
              <!-- 固定指标 -->
              <vxe-column field="unit" title="指标单位" width="100" :edit-render="{autofocus: '.vxe-input--inner', placeholder: '请点击输入指标单位'}">
                <template #edit="{ row }">
                  <a-input v-model="row.unit" :disabled="editForm.indexType == 1" type="text" :maxLength="10" placeholder="请点击输入指标单位" allowClear @blur="(e) => {removeComma(e, row, 'unit')}"></a-input>
                </template>
              </vxe-column>
              <!-- 否决性时为空且不可编辑 -->
              <vxe-column field="deductScore" title="扣分分值" width="100" :edit-render="{autofocus: '.vxe-input--inner', placeholder: '请点击输入扣分分值'}">
                <template #edit="{ row }">
                  <a-input :disabled="editForm.isNoIndex == 2" v-model="row.deductScore" placeholder="请点击输入扣分分值" allowClear @blur="(e) => {removeComma(e, row, 'deductScore')}"></a-input>
                </template>
              </vxe-column>
              <!-- 固定指标不可增减扣分标准 -->
              <vxe-column title="操作" field="action" width="140" align="center" fixed="right">
                <template #default="{ row , rowIndex}">
                  <a-button class="m-r-15" @click="insertdeductScoreDTOList(row.purposeCode, rowIndex)">+</a-button>
                  <a-button class="color-red" @click="deleteEvent(row.purposeCode, rowIndex)" v-if="checkTypeNum(row.purposeCode) > 1">-</a-button>
                </template>
              </vxe-column>
            </vxe-table>
          </div>
          <a-form-model-item class="flex" label="备注" prop="remake">
            <a-input v-model="editForm.remake" :maxLength="200" placeholder="请输入备注"></a-input>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="editCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" :loading="addLoading" @click="editConfirm">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>
<script>

import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import { formValidator } from "@/utils/clx-form-validator.js";
import dictionary from '@/utils/dictionary'

import { debounce } from 'lodash';
import { cloneDeep } from 'lodash'
import { getIndexSelect, indexSave, indexUpdate, indexDelete, indexSelectDetail } from "@/services/performanceManagement.js";

export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  props: {
    flag: { // 弹框多选时
      type: Boolean,
      default: false
    },
    configIndex: { // 弹框选完展示到页面时
      type: Boolean,
      default: false
    },
    componentsData: {
      type: Array,
      default: undefined
    },
    hasSelectId: {
      type: Array,
      default: () => [],
    },
    indexForm: {
      type: Object,
      default: () => { },
    },
    projectId: {
      type: String,
      default: "0"
    }
  },
  data() {
    return {
      tableSpinning:false,
      addLoading: false,
      formInline: {},
      preFormInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      // 表格所选择的key
      selectedRowKeys: [],
      selectedRow: [],
      tableRowKey: 'id',
      indexTypeList: [
        {
          key: "1",
          value: "固定指标"
        },
        {
          key: "2",
          value: "自定义指标"
        }
      ],
      isNoIndexList: [
        {
          key: "1",
          value: "否"
        },
        {
          key: "2",
          value: "是"
        }
      ],
      deductScoreDTOListList: [
        {
          deductScoreDTOList: "",
          unit: "",
          deductScore: ""
        }
      ], // 扣分标准
      isAdd: true,
      modalTableData: [
        {
          deductPoints: undefined,
          unit: undefined,
          deductScore: undefined
        }
      ],
      // 固定指标编辑弹框显隐
      editFixedVisible: false,

      editForm: {},
      editVisible: false,

      addVisible: false,
      addForm: {},

      // 表单验证
      editFormRules: {
        isNoIndex: [
          { required: true, message: "否决性指标必选", trigger: "change" },
        ],
        indexInfo: [
          { required: true, message: "指标名称不能为空", trigger: "blur" },
        ],
        riskScore: [
          { required: true, message: "风险分值不能为空", trigger: "blur" },
        ]
      },

      columns: [
        {
          title: '指标类型',
          scopedSlots: { customRender: 'indexType' },
          width: 100,
        },
        {
          title: '否决性指标',
          scopedSlots: { customRender: 'isNoIndex' },
          width: 150,
        },
        {
          title: '指标',
          dataIndex: 'indexInfo',
          width: 200,
        },
        {
          title: '风险分值',
          dataIndex: 'riskScore',
          width: 100,
        },
        {
          title: '扣分标准',
          scopedSlots: { customRender: 'deductPoints' },
          width: 400,
        },
        {
          title: '指标单位',
          // dataIndex: 'unit',
          scopedSlots: { customRender: 'unit' },
          width: 100,
        },
        {
          title: '扣分分值',
          // dataIndex: 'deductScore',
          scopedSlots: { customRender: 'deductScore' },
          width: 100,
        },
        {
          title: '备注',
          dataIndex: 'remake',
          minWidth: 200,
        },

      ],
      tableDataList: [],
    }
  },
  created() {
    this.setRouterCode("performanceIndex");
    if (!this.flag || this.configIndex) {
      this.columns.push({
        title: '操作',
        scopedSlots: { customRender: 'action' },
        fixed: 'right', // 固定操作列
        width: 200 // 宽度根据操作自定义设置
      })
    }
    if (!this.configIndex) {
      this.getDataList();
    }
  },
  watch: {
    projectId: {
      handler(newVal, oldVal) {
        if (newVal) {
          if (newVal == 1) { // 否决性指标
            // this.$set(this.formInline, "isNoIndex", "2");
            this.preFormInline = {
              ...this.preFormInline,
              // isNoIndex: newVal
            }
            this.projectChange();
          } else {
            // this.$set(this.formInline, "isNoIndex", "1");
            this.preFormInline = {
              ...this.preFormInline,
              // isNoIndex: newVal
            }
            if (oldVal == 1) {
              this.projectChange();
            }
          }
        }
      },
      immediate: true,
    },
    componentsData: {
      handler(newVal, oldVal) {
        console.log(newVal)
        if (newVal) {
          this.tableDataList = this.componentsData || [];
        }
      },
      deep: true
    },
    selectedRowKeys: {
      handler(newVal) {
        if (newVal.length == 0) {
          // console.log('被清除');
          this.selectedRow = []
        }
      },
      deep: true
    }
  },
  computed: {
    rowSelection() {
      return {
        // onChange: (selectedRowKeys) => {
        //   this.selectedRowKeys = selectedRowKeys;
        //   let selectArr = this.tableDataList.filter(item => {
        //     return selectedRowKeys.indexOf(item.id) != -1;
        //   })
        //   console.log(selectArr, selectedRowKeys);
        //   this.$emit("indexSelectChange", selectArr, selectedRowKeys);
        // },
        getCheckboxProps: record => ({
          props: {
            disabled: record.disabled
          },
        }),
        selectedRowKeys: this.selectedRowKeys,
        fixed: true
      };
    },
  },
  methods: {
    // 表格选择的key
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.tableRowKey && this.setSelectedRow(selectedRows)
      setTimeout(() => {
        console.log(this.selectedRow, this.selectedRowKeys);
        this.$emit("indexSelectChange", this.selectedRow, this.selectedRowKeys);
      });
    },
    // 表格选择的项
    setSelectedRow(selectedRows) {
      let selectedRow = [...this.selectedRow, ...selectedRows]
      selectedRow = this.selectedRowKeys.map(item => {
        let selectedRowItem = {}
        selectedRow.some(item1 => {
          if (item1[this.tableRowKey] === item) {
            selectedRowItem = item1
            return true
          }
        })
        return selectedRowItem
      })
      this.selectedRow = cloneDeep(selectedRow)
      // console.log('this--', this.selectedRow);
    },

    // 否决性指标选项改变时
    isNoIndexChange(val) {
      if (val == 2) { // 是
        this.$set(this.editForm, "deductScore", undefined);
        this.modalTableData = [{
          deductPoints: "发生否决性指标，本次考核记为C档"
        }]
        this.editFormRules.riskScore = [
          { required: false }
        ]
      } else {
        this.editFormRules.riskScore = [
          { required: true, message: "风险分值不能为空", trigger: "blur" },
        ]
      }
    },

    // 新增弹框-新增扣分标准按钮
    insertdeductScoreDTOList(index) {
      let record = {
        deductPoints: undefined,
        unit: undefined,
        deductScore: undefined
      };
      this.modalTableData.splice(index + 1, 0, record);
    },
    deleteEvent(index) {
      this.modalTableData.splice(index, 1);
    },
    checkTypeNum() {
      return this.modalTableData.length;
    },
    projectChange(isSearch) {
      let arr = [...this.tableDataList];
      for (let i = 0; i < arr.length; i++) {
        arr[i].disabled = this.hasSelectId.indexOf(arr[i].id) != -1 || (this.projectId == 1 && arr[i].isNoIndex != 2) || ((this.projectId == 2 || this.projectId == 3 || this.projectId == 4 || this.projectId == 5 || this.projectId == 6) && arr[i].isNoIndex == 2);
      }
      this.tableDataList = [...arr];
      if (!isSearch) {
        this.selectedRowKeys = [];
      }
      this.$emit("indexSelectChange", [], [], true);
    },
    getDataList(isSearch) { // isSearch为true代表是点击搜索触发的
      let params = {
        ...this.preFormInline,
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo
      }
      this.tableSpinning = true
      return getIndexSelect(params).then((result) => {
        let arr = result.data.list || [];
        for (let i = 0; i < arr.length; i++) {
          arr[i].deductPoints = (arr[i].deductPoints && typeof (arr[i].deductPoints) == "string") ? arr[i].deductPoints.split(",") : [];
          arr[i].unit = (arr[i].unit && typeof (arr[i].unit) == "string") ? arr[i].unit.split(",") : [];
          arr[i].deductScore = (arr[i].deductScore && typeof (arr[i].deductScore) == "string") ? arr[i].deductScore.split(",") : [];
        }
        if (this.flag && isSearch) { // 查询数据的时候清空多选项
          this.selectedRowKeys = [];
          this.$emit("indexSelectChange", [], []);
        }
        this.addLoading = false;
        this.tableDataList = arr;
        if (this.flag) {
          this.projectChange(true);
        }
        this.page.total = result.data.total;
      }).catch((err) => {
        console.log(err);
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    // 查询
    iSearch() {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.preFormInline = { ...this.formInline };
      // 获取列表
      this.getDataList(true)
        .finally(() => {
          this.cancelLoading();
        })
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {};
      this.preFormInline = {};
      this.getDataList(true)
    }, 250, { leading: true, trailing: false }),
    // 编辑
    async actionEdit(record) {
      this.isAdd = false;
      this.editForm = cloneDeep(record);
      this.editVisible = true;
      this.modalTableData = [];
      let arr = [];
      for (let i = 0; i < record.deductPoints.length; i++) {
        arr.push({
          deductPoints: record.deductPoints[i],
          unit: record.unit[i],
          deductScore: record.deductScore[i]
        })
      }
      this.modalTableData = [...arr];
      if (record.indexType == 1) {
        this.$nextTick(() => {
          this.$refs.xTable.hideColumn(this.$refs.xTable.getColumnByField('action'));
        })
      }

    },
    actionDelete(record) {
      if (!this.canClickBtnMixin("performanceIndex-del")) {
        return;
      }
      this.$antConfirm({
        title: '删除提示',
        content: '本操作不可恢复，确定继续？',
        cancelText: '取消',
        onOk: () => {
          indexDelete({
            id: record.id,
          }).then(res => {
            this.$antMessage.success('删除成功');
            this.getDataList();
          }).catch(err => {
            console.log(err);
          })
        },
      });
    },
    configIndexDelete(record) {
      this.$emit("configIndexDelete", record);
    },
    editCancle() {
      this.editVisible = false;
      this.editForm = {};
    },
    editConfirm() {
      if (!formValidator.formAll(this, 'editForm')) {
        return;
      }
      let params = {
        ...this.editForm,
        deductScoreDTOList: cloneDeep(this.modalTableData)
      }
      let promiseFn = indexSave;
      if (!this.isAdd) { // 编辑
        promiseFn = indexUpdate;
      }
      this.addLoading = true;
      promiseFn(params).then(() => {
        this.$antMessage.success(this.isAdd ? "新增成功" : "编辑成功");
        this.editVisible = false;
        this.editForm = {};
        this.modalTableData = [
          {
            deductPoints: undefined,
            unit: undefined,
            deductScore: undefined
          }
        ]
        this.getDataList();
      }).catch(err => console.log(err))
        .finally(() => {
          this.addLoading = false;
        })
    },
    addCancle() {
      this.addVisible = false;
      this.addForm = {}
    },

    // 新增
    addIndex() {
      this.isAdd = true;
      this.editForm = {
        isNoIndex: "1"
      };
      this.modalTableData = [
        {
          deductPoints: undefined,
          unit: undefined,
          deductScore: undefined
        }
      ]
      this.editVisible = true;
    },

    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getDataList();
    },
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
    },
    // 限制不可输入英文逗号,移除逗号
    removeComma(e, row, key) {
      let val = e.target.value;
      if (!val) return;
      let money = /[,]/g;
      if (money.test(val)) {
        this.$antMessage.warn("扣分标准、扣分单位、扣分分值不可输入英文逗号“,”字符");
        row[key] = val.replace(/,/g, "");
      }
    },
  }
}
</script>
<style lang="less" scoped>
/deep/ td {
  img {
    width: 30px;
    height: 30px;
  }
}
.head-portrait {
  width: 50px;
  height: 50px;
}
.cell-item {
  width: 100%;
  height: 20px;
  line-height: 20px;
  text-align: center;
  word-break: keep-all;
}
</style>