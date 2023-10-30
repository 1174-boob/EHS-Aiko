
<template>
  <!-- 成熟度评价指标 -->
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="项目">
          <a-input v-model="formInline.indexInfo" placeholder="请输入项目"></a-input>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="addIndex">
          <a-icon type="plus" />新增指标
        </a-button>
      </div>
    </DashBtn>
    <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table
        :columns="columns"
        :scroll="{ x: tableScrollX() }"
        :locale="{emptyText: emptyText}"
        :data-source="tableDataList"
        :rowKey="(record, index)=>{return record._id ? record._id : record.indexId}"
        :pagination="false"
      >
        <!-- <div slot="indexType" slot-scope="record">{{getMappingValue(indexTypeList, "key", record.indexType).value}}</div> -->
        <div slot="deductPoints" slot-scope="record" class="table-p-box">
          <p v-for="(i,index) in record" :key="index">{{i}}</p>
        </div>
        <div slot="unit" slot-scope="record" class="table-p-box">
          <p v-for="(i,index) in record" :key="index">{{i}}</p>
        </div>
        <div slot="deductScore" slot-scope="record" class="table-p-box">
          <p v-for="(i,index) in record" :key="index">{{i}}</p>
        </div>

        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionEdit(record)">编辑</span>
          <!-- 固定指标、关联管理绩效表的自定义指标 不可删除 -->
          <span class="color-red cursor-pointer" @click="handleDelete(record)">删除</span>
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
          <a-form-model-item class="flex" label="设立目的" prop="shelimudi">
            <a-input v-model="editForm.shelimudi" :maxLength="100" placeholder="请输入设立目的"></a-input>
          </a-form-model-item>

          <a-form-model-item class="flex" label="项目" prop="xiangmu">
            <a-input v-model="editForm.xiangmu" :maxLength="100" placeholder="请输入项目"></a-input>
          </a-form-model-item>

          <a-form-model-item class="flex" label="定义" prop="dingyi">
            <a-textarea v-model="editForm.dingyi" :maxLength="100" placeholder="请输入定义"></a-textarea>
          </a-form-model-item>

          <!-- 分值 -->
          <a-form-model-item class="flex" label="分值" prop="riskScore">
            <a-input-number v-model="editForm.riskScore" :min="0" :step="0.1" placeholder="请输入分值" :precision="1" />
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
              <vxe-column field="deductPoints" title="计算明细" min-width="200" :edit-render="{autofocus: '.vxe-input--inner', placeholder: '请点击输入计算明细'}">
                <template #edit="{ row }">
                  <vxe-input :disabled="editForm.rejectIndex == 1" maxlength="100" v-model="row.deductPoints" type="text" placeholder="请点击输入计算明细" allowClear></vxe-input>
                </template>
              </vxe-column>
              <!-- 固定指标  -->
              <vxe-column field="unit" title="指标单位" width="180" :edit-render="{autofocus: '.vxe-input--inner', placeholder: '请点击输入指标单位'}">
                <template #edit="{ row }">
                  <vxe-input v-model="row.unit" type="text" maxlength="10" placeholder="请点击输入指标单位" allowClear></vxe-input>
                </template>
              </vxe-column>
              <!-- 否决性时为空且不可编辑 -->
              <vxe-column field="deductScore" title="扣分分值" width="180" :edit-render="{autofocus: '.vxe-input--inner', placeholder: '请点击输入扣分分值'}">
                <template #edit="{ row }">
                  <vxe-input :disabled="editForm.rejectIndex == 1" v-model="row.deductScore" placeholder="请点击输入扣分分值" type="float" min="0" digits="1" clearable></vxe-input>
                </template>
              </vxe-column>
              <!-- 固定指标不可增减计算明细 -->
              <vxe-column title="操作" field="action" width="140" align="center" fixed="right">
                <template #default="{ row , rowIndex}">
                  <a-button class="m-r-15" @click="insertDeductPoints(row.purposeCode, rowIndex)">+</a-button>
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
// import rowspanMethod from "@/utils/rowspanMethod.js";
import dictionary from '@/utils/dictionary'
import { debounce } from 'lodash';
import { cloneDeep } from 'lodash'
import { getKpiIndexList, addKpiIndex, deleteKpiIndex, editKpiIndexEdit, checkKpiIndex } from "@/services/maturityEvaluation.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      addLoading: false,
      formInline: {},
      preFormInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      selectedRowKeys: [],
      indexTypeList: [
        {
          key: 1,
          value: "固定指标"
        },
        {
          key: 2,
          value: "自定义指标"
        }
      ],
      rejectIndexList: [
        {
          key: 1,
          value: "是"
        },
        {
          key: 2,
          value: "否"
        }
      ],
      deductPointsList: [
        {
          deductPoints: "",
          indexUnit: "",
          deductNum: ""
        }
      ], // 计算明细
      isAdd: true,
      // rowspanMethod: rowspanMethod(["purposeCode", "aa"]),
      modalTableData: [
        {
          deductPoints: "",
          unit: "",
          deductScore: ""
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
        shelimudi: [
          { required: true, message: "设立目的不能为空", trigger: "blur" },
        ],
        xiangmu: [
          { required: true, message: "项目不能为空", trigger: "blur" },
        ],
        dingyi: [
          { required: true, message: "定义不能为空", trigger: "blur" },
        ],
        riskScore: [
          { required: true, message: "分值不能为空", trigger: "blur" },
        ],
        remake: [
          { required: false, message: "备注不能为空", trigger: "blur" },
        ],
      },

      columns: [
        {
          title: '设立目的',
          dataIndex: 'shelimudi',
          width: 200,
        },
        {
          title: '项目',
          dataIndex: 'xiangmu',
          width: 200,
        },
        {
          title: '定义',
          dataIndex: 'dingyi',
          width: 200,
        },
        {
          title: '分值',
          dataIndex: 'riskScore',
          width: 100,
        },

        {
          title: '计算明细',
          scopedSlots: { customRender: 'deductPoints' },
          dataIndex: 'deductPoints',
          width: 400,
        },
        {
          title: '单位',
          scopedSlots: { customRender: 'unit' },
          dataIndex: 'unit',
          width: 100,
        },
        {
          title: '扣分分值',
          scopedSlots: { customRender: 'deductScore' },
          dataIndex: 'deductScore',
          width: 100,
        },
        {
          title: '备注',
          dataIndex: 'remake',
          minWidth: 200,
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          key: "action",
          align: "center",
          fixed: "right", // 固定操作列
          width: 120, // 宽度根据操作自定义设置
        },

      ],
      tableDataList: [],

    }
  },
  created() {
    this.setRouterCode("maturityEvaluationQuota");
    this.getDataList();
  },
  computed: {
  },
  methods: {

    // 新增弹框-新增计算明细按钮
    insertDeductPoints(index) {
      let record = {
        deductPoints: "",
        unit: "",
        deductScore: ""
      };
      this.modalTableData.splice(index + 1, 0, record);
    },
    deleteEvent(index) {
      this.modalTableData.splice(index, 1);
    },
    checkTypeNum() {
      return this.modalTableData.length;
    },
    getDataList() {
      let params = {
        ...this.formInline,
        ...this.page
      }
      return getKpiIndexList(params).then((res) => {

        this.addLoading = false;
        this.tableDataList = res.data.list.map(i => {
          i.deductPoints = i.indexItems.map(item => item.deductPoints)
          i.unit = i.indexItems.map(item => item.unit)
          i.deductScore = i.indexItems.map(item => item.deductScore)
          return i
        })
        this.page.total = res.data.total;
      }).catch((err) => {
        console.log(err);
      })
    },
    // 查询
    iSearch() {
      this.preFormInline = { ...this.formInline };
      // 获取列表
      this.getDataList()
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
      this.getDataList()
    }, 250, { leading: true, trailing: false }),
    // 编辑
    async actionEdit(e) {
      this.isAdd = false;
      checkKpiIndex({ id: e.id }).then(res => {
        this.editForm = res.data
        this.modalTableData = res.data.indexItems
        this.editVisible = true;
      })
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
          // DeleteLecturer({
          //   id: record.indexId,
          // }).then(res => {
          this.$antMessage.success('删除成功');
          this.getDataList();
          // }).catch(err => {
          //   console.log(err);
          // })
        },
      });
    },
    handleDelete(e) {
      let _this = this
      this.$antConfirm({
        title: '确定删除该指标吗?',
        onOk() {
          deleteKpiIndex({ id: e.id }).then(res => {
            _this.$antMessage.success("删除成功！");
            _this.getDataList()
          })
        },
        onCancel() {

        }
      });
    },
    // 关闭指标弹窗
    editCancle() {
      this.editVisible = false;
      this.editForm = {};
      this.modalTableData = [
        {
          deductPoints: "",
          unit: "",
          deductScore: ""
        }
      ]
    },
    // 确定
    editConfirm() {
      if (!formValidator.formAll(this, 'editForm')) {
        return;
      }

      let b = this.modalTableData.some(i => {
        return !(i.deductPoints && i.unit && i.deductScore)
      })
      if (b) {
        this.$antMessage.error("请正确填写计算明细！");
        return false
      }
      this.editForm.indexItems = this.modalTableData
      console.log('this.editForm',this.editForm);
      return
      this.addLoading = true;
      if (this.isAdd) {
        addKpiIndex(this.editForm)
        .then(() => {
          this.$antMessage.success("新增成功");
          this.editCancle()
          this.getDataList();
        })
        .catch(err => {})
      } else {
        editKpiIndexEdit(this.editForm)
        .then(() => {
          this.$antMessage.success("修改成功");
          this.editCancle()
          this.getDataList();
        })
        .catch(err => {})
      }
    },

    // 新增-打开弹框
    addIndex() {
      this.isAdd = true;
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
  }
}
</script>

<style lang="less" scoped>
.table-p-box{
  &>p{
    margin-bottom: 1em;
    &:nth-last-child(1){
      margin-bottom: 0px;
    }
  }
}
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
/deep/ .ant-input-number {
  width: 100%;
}
</style>