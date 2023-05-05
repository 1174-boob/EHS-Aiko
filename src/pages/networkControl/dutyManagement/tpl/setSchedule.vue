<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <CommonTable>
      <a-table
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{ emptyText: emptyText }"
        :data-source="tableDataList"
        :rowKey="
          (record, index) => {
            return record.key;
          }
        "
        :pagination="false"
      >
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer m-r-15" @click="frequencyOpen(record,true)">编辑配置项</span>
          <span class="color-0067cc cursor-pointer" @click="frequencyOpen(record,false)">查看配置项</span>
        </div>
      </a-table>
    </CommonTable>

    <!-- 配置项设置 -->
    <CommonModal title="配置项设置" :visible="frequencyVisible" :cancelFn="frequencyCancle">
      <div>
        <a-button type="primary" @click="earlyWarningTest('add')" class="m-b-20" v-if="flag">新增配置项</a-button>
        <CommonTable
          :page="pageT"
          :pageNoChange="pageNoChangeT"
          :showSizeChange="onShowSizeChangeT"
        >
          <vxe-table
            class="vxe-scrollbar beauty-scroll-fireBox"
            show-header-overflow
            show-overflow
            align="center"
            :row-config="{ isHover: true }"
            :data="tableDataListT"
          >
            <template v-for="(item) in flag?columnsT:columnsS">
              <vxe-column
                :key="item.dataIndex"
                :field="item.dataIndex"
                :min-width="item.width?item.width:120"
                :title="item.title"
              >
                <template #default="{ row }" v-if="item.dataIndex === 'corporationId'">
                  <span>
                    {{row.corporationId?getMappingValue(
                    getCommonAddOrgnizeListAll,
                    "id",
                    row.corporationId
                    ).orgAbbrName:'--'}}
                  </span>
                </template>
                <template #default="{ row }" v-else-if="item.dataIndex === 'disable'">
                  <span>{{row.disable?row.disable == '1'?'禁用':'启用':'--'}}</span>
                </template>

                <template #default="{ row }" v-else>
                  <span>{{ row[item.dataIndex]|| '--' }}</span>
                </template>
              </vxe-column>
            </template>
            <vxe-column field="action" fixed="right" title="操作" width="200" v-if="flag">
              <template #default="{ row }">
                <div class="table-btn-box">
                  <span
                    class="color-0067cc cursor-pointer m-r-15"
                    @click="isDisOpen('启用', row)"
                    v-if="row.disable == 1"
                  >启用</span>
                  <span
                    class="color-0067cc cursor-pointer m-r-15"
                    @click="isDisOpen('禁用', row)"
                    v-else
                  >禁用</span>
                  <span
                    class="color-0067cc cursor-pointer m-r-15"
                    @click="earlyWarningTest('change', row)"
                  >编辑</span>
                  <span class="color-0067cc cursor-pointer m-r-15" @click="actionDelete(row)">删除</span>
                </div>
              </template>
            </vxe-column>
            <template #empty>
              <div style="padding: 16px 0">
                <a-empty />
              </div>
            </template>
          </vxe-table>
        </CommonTable>
      </div>
    </CommonModal>

    <!-- 新建编辑配置项 -->
    <CommonModal
      :title="earlyTitle"
      :visible="earlyWarningTestVisible"
      :cancelFn="earlyWarningTestCancle"
    >
      <template slot="form">
        <a-form-model
          ref="earlyWarningTest"
          :model="earlyWarningTestForm"
          :rules="earlyWarningTestFormRules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :colon="false"
          labelAlign="left"
        >
          <CommonSearchItem
            :CommonFormInline="earlyWarningTestForm"
            :rules="earlyWarningTestFormRules"
            :notTablePage="true"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            labelAlign="left"
            :needDeptName="false"
            :needCenterName="false"
            :needCorporationName="false"
          ></CommonSearchItem>
          <a-form-model-item class="flex" label="配置选项" prop="dictValue">
            <a-input
              :maxLength="100"
              v-model="earlyWarningTestForm.dictValue"
              placeholder="请输入配置选项名称"
            />
          </a-form-model-item>
          <a-form-model-item class="flex" label="状态" prop="disable">
            <a-radio-group v-model="earlyWarningTestForm.disable">
              <a-radio value="2">启用</a-radio>
              <a-radio value="1">禁用</a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="earlyWarningTestCancle">取消</a-button>
        <a-button type="primary" class="m-l-15" @click="earlyWarningTestConfirm">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import { formValidator } from "@/utils/clx-form-validator.js";
import dictionary from "@/utils/dictionary";
import { debounce, cloneDeep } from "lodash";
import {
  GetConfigList,
  DelConfigList,
  StatusConfigList,
  AddsConfigList,
  ChangeConfigList
} from "@/services/networkControl.js";
export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      dictKey: "",
      flag: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      pageT: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        {
          title: "类型",
          dataIndex: "value",
          customRender: text => {
            return text ? text : "--";
          }
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" }
        }
      ],
      tableDataList: [],
      columnsT: [
        {
          title: "组织",
          dataIndex: "corporationId",
          width: 100
        },
        {
          title: "配置选项",
          dataIndex: "dictValue",
          width: 100
        },
        {
          title: "状态",
          dataIndex: "disable",
          width: 100
        }
      ],
      columnsS: [
        {
          title: "组织",
          dataIndex: "corporationId",
          width: 100
        },
        {
          title: "配置选项",
          width: 100,
          dataIndex: "dictValue"
        },
        {
          title: "状态",
          dataIndex: "disable",
          width: 100
        }
      ],
      tableDataListT: [],

      earlyTitle: "新增",
      earlyWarningTestVisible: false,
      earlyWarningTestForm: {},
      earlyWarningTestFormRules: {
        corporationId: [
          { required: true, message: "组织不能为空", trigger: "change" }
        ],
        deptId: [
          { required: true, message: "部门不能为空", trigger: "change" }
        ],
        dictValue: [
          {
            required: true,
            message: "配置选项名称不能为空",
            trigger: "change"
          }
        ],
        disable: [
          { required: true, message: "状态不能为空", trigger: "change" }
        ]
      },

      frequencyVisible: false,
      scalId: undefined
    };
  },
  created() {
    this.tableDataList = dictionary("alarm"); //获取字典列表
  },
  methods: {
    //获取配置项-列表
    getClassesList(flag) {
      let params = {
        pageSize: this.pageT.pageSize,
        pageNo: this.pageT.pageNo,
        key: this.dictKey
      };
      return GetConfigList(params)
        .then(res => {
          this.tableDataListT = res.data.list;
          this.pageT.total = res.data.total;
          if (flag) {
            this.frequencyVisible = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 配置项-页码改变
    pageNoChangeT(page) {
      this.pageT.pageNo = page;
      // 获取列表
      this.getClassesList();
    },
    // 配置项-页码改变
    onShowSizeChangeT(current, pageSize) {
      this.pageT.pageNo = 1;
      this.pageT.pageSize = pageSize;
      this.getClassesList();
    },

    // 设置配置项弹窗-打开
    frequencyOpen(record, flag) {
      this.flag = flag;
      this.dictKey = record.key;
      this.getClassesList(true); //获取列表
    },

    // 设置弹框-取消
    frequencyCancle() {
      this.frequencyVisible = false;
    },

    // 新建编辑配置项
    earlyWarningTest(type, record) {
      if (type == "change") {
        // if (!this.canClickBtnMixin("changeConfiguration")) {
        //   return;
        // }
        this.scalId = record.dictId;
        this.earlyTitle = "编辑";
        let obj = {
          //回显
          centerId: record.centerId,
          corporationId: record.corporationId,
          dictValue: record.dictValue,
          disable: String(record.disable)
        };
        this.earlyWarningTestForm = obj;
      } else {
        this.earlyTitle = "新增";
      }
      this.earlyWarningTestVisible = true;
    },

    // 配置项弹框-取消
    earlyWarningTestCancle() {
      this.earlyWarningTestForm = {};
      this.earlyWarningTestVisible = false;
    },

    //配置项确认
    earlyWarningTestConfirm() {
      if (!formValidator.formAll(this, "earlyWarningTest")) {
        return;
      }

      let params = {
        ...this.earlyWarningTestForm,
        dictKey: this.dictKey,
        dictId: this.earlyTitle == "新增" ? undefined : this.scalId
      };

      let ApiName =
        this.earlyTitle == "新增" ? AddsConfigList : ChangeConfigList;
      ApiName(params)
        .then(res => {
          this.getClassesList();
          this.$antMessage.success(`${this.earlyTitle}成功`);
          this.earlyWarningTestVisible = false;
          this.earlyWarningTestForm = {};
        })
        .catch(err => {
          console.log(err);
        });
    },

    //启用禁用
    isDisOpen(type, record) {
      this.$antConfirm({
        content: `确认${type}？`,
        cancelText: "取消",
        onOk: () => {
          StatusConfigList({
            dictId: record.dictId,
            disable: type == "启用" ? 2 : 1
          })
            .then(res => {
              this.$antMessage.success(`${type}成功`);
              this.pageT.pageNo = 1;
              this.getClassesList();
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },

    // 删除
    actionDelete(record) {
      // if (!this.canClickBtnMixin("delConfiguration")) {
      //   return;
      // }
      this.$antConfirm({
        content: "确认删除？",
        cancelText: "取消",
        onOk: () => {
          DelConfigList({
            dictId: record.dictId
          })
            .then(res => {
              this.$antMessage.success("删除成功");
              this.pageT.pageNo = 1;
              this.getClassesList();
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ td {
  img {
    width: 30px;
    height: 30px;
  }
}
/deep/ .el-range-editor {
  width: 100% !important;
}
.head-portrait {
  width: 50px;
  height: 50px;
}
</style>