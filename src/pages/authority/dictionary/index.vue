<template>
  <div class="searchtable-wrapper clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <PageTitle>字典管理</PageTitle>
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="字典组名称">
          <a-input v-model="formInline.dictName" placeholder="请输入字典组名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="字典组编码">
          <a-input v-model="formInline.dictType" placeholder="请输入字典组编码" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="addDict">
          <a-icon type="plus" />新建字典
        </a-button>
      </div>
    </DashBtn>
    <!-- 字典组列表 -->
    <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table :columns="columns" :scroll="{ x: 800 }" :locale="{emptyText: emptyText}" :data-source="dictList" :rowKey="(record, index)=>{return index}" :pagination="false">
        <div slot="customTitle">操作</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="editDict(record)">编辑</span>
          <span class="color-0067cc cursor-pointer" @click="editDictType(record)">编辑选项</span>
          <span class="color-ff4d4f cursor-pointer" @click="deleteDict(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
    <!-- 新建字典弹框 -->
    <CommonModal :title="dictTitle" :visible="visible" :cancelFn="cancelFn">
      <template slot="form">
        <a-form-model ref="dictForm" :model="dictForm" :rules="dictRules" :label-col="labelCol" :wrapper-col="wrapperCol" :colon="false" labelAlign="left">
          <a-form-model-item label="字典组编码" prop="dictType">
            <a-input class="form-input" v-model.trim="dictForm.dictType" placeholder="请输入" :disabled="dictTypeDisabled" />
          </a-form-model-item>
          <a-form-model-item label="字典组名称" prop="dictName">
            <a-input class="form-input" v-model.trim="dictForm.dictName" placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item label="备注">
            <a-input class="form-input" v-model="dictForm.remark" placeholder="请输入" />
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="visible = false">取消</a-button>
        <a-button class="m-l-15" type="primary" :loading="loading" @click="submitDict">确定</a-button>
      </template>
    </CommonModal>
    <!-- 编辑字典选项弹框 -->
    <CommonModal :title="'编辑字典项'" :visible="editDictVisible" :cancelFn="cancelDictType" class="table-dialog">
      <DashBtn>
        <div>
          <a-button type="dashed" @click="addItem">
            <a-icon type="plus" />添加选项
          </a-button>
        </div>
      </DashBtn>
      <CommonTable :page="itemPage" :pageNoChange="pageItemChange" :showSizeChange="itemSizeChange">
        <a-table :columns="dictTypeColumns" :scroll="{ x: 400 }" :locale="{emptyText: emptyText}" :data-source="dictTypeList" :rowKey="(record, index)=>{return index}" :pagination="false">
          <div slot="status" slot-scope="record">
            <span>{{record.status==0 ? '启用' : "禁用"}}</span>
          </div>
          <div slot="customTitle">操作</div>
          <div slot="action" slot-scope="record">
            <span class="color-0067cc cursor-pointer" @click="actionItem(record)">{{record.status==0 ? '禁用' : "启用"}}</span>
            <span class="color-0067cc cursor-pointer" @click="editDictItem(record)">编辑</span>
            <span class="color-ff4d4f cursor-pointer" @click="delDictItem(record)">删除</span>
          </div>
        </a-table>
      </CommonTable>
    </CommonModal>
    <!-- 编辑字典选项弹框中添加选项弹框 -->
    <CommonModal :title="dictItemTitle" :visible="itemVisible" :cancelFn="cancelItem">
      <template slot="form">
        <a-form-model ref="itemForm" :model="itemForm" :rules="itemRules" :colon="false">
          <CommonSearchItem ref="commonSearchItem" :notTablePage="true" :label-col="labelCol" :wrapper-col="wrapperCol" :CommonFormInline="itemForm" :disabled="dictItemDisabled" :hasDepartment="false"></CommonSearchItem>
          <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="字典项编码" prop="dictValue">
            <a-input class="form-input" v-model.trim="itemForm.dictValue" placeholder="请输入" :disabled="dictItemDisabled" />
          </a-form-model-item>
          <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="字典项名称" prop="dictLabel">
            <a-input class="form-input" v-model.trim="itemForm.dictLabel" placeholder="请输入" />
          </a-form-model-item>
          <a-form-model-item :label-col="labelCol" :wrapper-col="wrapperCol" label="排序号" prop="dictSort">
            <a-input class="form-input" v-model="itemForm.dictSort" placeholder="请输入" />
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button @click="itemVisible = false">取消</a-button>
        <a-button class="m-l-15" type="primary" :loading="loading" @click="submitItemDict">确定</a-button>
      </template>
    </CommonModal>
  </div>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from '@/mixin/cancelLoading';
import dragTable from "@/mixin/dragTable.js";
import { formValidator } from "@/utils/clx-form-validator.js";
import { debounce } from 'lodash';
import {
  DictTypePage,
  SaveDictData,
  RemoveDictType,
  UpdateDictTypePage,
  DictDataPage,
  SaveSysDictData,
  RemoveSysDictData,
  UpdateSysDictData
} from "@/services/api.js";
import { mapActions } from "vuex";

export default {
  mixins: [teableCenterEllipsis, cancelLoading, dragTable],
  data() {
    return {
      tableSpinning:false,
      visible: false,
      editDictVisible: false,
      itemVisible: false,
      dictTypeDisabled: false,
      dictItemDisabled: false,
      dictTitle: '新建字典组',
      dictItemTitle: '添加选项',
      labelCol: { span: 6 }, // 设置左边label宽度
      wrapperCol: { span: 18 }, // 设置右边表单宽度
      dictForm: {
        dictType: '', //字典组编码
        dictName: "", //字典组名称
        remark: '', //字典组备注
      },
      dictId: null, //字典id
      itemForm: {
        dictValue: '', //字典标签
        dictLabel: '', //字典项名称
        dictSort: '' //排序号
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      itemPage: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formInline: {},
      columns: [
        {
          title: '字典组编码',
          dataIndex: 'dictType',
          key: "dictType",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '字典组',
          dataIndex: 'dictName',
          key: "dictName",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: "remark",
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          slots: { title: 'customTitle' },
          scopedSlots: { customRender: 'action' },
          key: "action",
          fixed: 'right', // 固定操作列
          width: 200 // 宽度根据操作自定义设置
        }
      ],
      dictTypeColumns: [
        {
          title: "所属组织",
          dataIndex: 'corporationId',
          key: "corporationId",
          customRender: (text) => {
            return (text ? this.getMappingValue(this.getCommonAddOrgnizeListAll, "orgId", text).orgName : '全部基地');
          },
          align: "center",
        },
        {
          title: '字典项编码',
          dataIndex: 'dictValue',
          key: "dictValue",
          align: 'center',
          ellipsis: true,
          width: 130,
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '字典项名称',
          dataIndex: 'dictLabel',
          key: "dictLabel",
          align: 'center',
          ellipsis: true,
          customRender: (text) => {
            text = text ? text : ''
            return (
              <a-popover autoAdjustOverflow>
                <div slot="content">
                  <p>{{ text }}</p>
                </div>
                <span>{{ text }}</span>
              </a-popover>
            );
          },
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'status' },
          key: "status",
          align: 'center',
          ellipsis: true,
          width: 80
        },
        {
          slots: { title: 'customTitle' },
          scopedSlots: { customRender: 'action' },
          key: "action",
          align: 'center',
          fixed: 'right', // 固定操作列
          width: 150 // 宽度根据操作自定义设置
        }
      ],
      dictList: [],
      dictTypeList: [],
      itemDictCode: '', //字典项中的id
      parentDictType: '', //父级的编码（字典组）
      dictKV: {
        dictName: {
          name: '字典组名称', //字段名称
          count: 30 //限制字段的长度
        },
        dictType: {
          name: '字典组编码',
          count: 30
        },
        dictValue: {
          name: '字典项编码',
          count: 60
        },
        dictLabel: {
          name: '字典项名称',
          count: 300
        },
      }
    }
  },
  computed: {
    dictRules() {
      let noticeRules = {
        dictType: [
          { required: true, validator: this.dictValidator, trigger: 'blur' },
        ],
        dictName: [
          { required: true, validator: this.dictValidator, trigger: 'blur' },
        ],
      }
      return noticeRules
    },
    itemRules() {
      let itemRules = {
        dictValue: [
          { required: true, validator: this.dictValidator, trigger: 'blur' },
        ],
        dictLabel: [
          { required: true, validator: this.dictValidator, trigger: 'blur' },
        ],
        dictSort: [
          { required: true, validator: this.dictSortValidator, trigger: 'blur' },
        ],
      }
      return itemRules
    },
  },
  created() {
    this.setRouterCode("dictionary");
    this.getDictTypePage();
  },
  methods: {
    ...mapActions("setting", ["getDictTree"]),
    // 获取字典数据
    getDictTypePage() {
      const params = {
        ...this.formInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
      }
      this.tableSpinning = true
      return DictTypePage(params)
      .then(res => {
        this.cancelLoading(100);
        this.dictList = res.data.list;
        this.page.total = res.data.total;
      })
      .catch(err => {
        console.log(err);
      })
      .finally(()=>{
        this.tableSpinning = false
      })
    },
    // 获取字典项中字典值列表
    getDictTypeDetail() {
      const params = {
        dictType: this.parentDictType,
        pageNo: this.itemPage.pageNo,
        pageSize: this.itemPage.pageSize,
      }
      DictDataPage(params).then(res => {
        this.dictTypeList = res.data.list;
        this.itemPage.total = res.data.total;
      }).catch(err => {
        console.log(err);
      })
    },
    dictValidator(rule, value, callback) {
      const name = this.dictKV[rule.field].name;
      const count = this.dictKV[rule.field].count;
      if (!value) {
        return Promise.reject(`${name}不能为空`)
      } else if (value && value.length > count) {
        return Promise.reject(`${name}不能超过${count}个字`)
      } else {
        callback()
      }
    },
    dictSortValidator(rule, value, callback) {
      console.log(value);
      if (!value) {
        return Promise.reject("排序号不能为空")
      } else if (value && !/(^[1-9]\d*$)/.test(value)) {
        return Promise.reject("排序号只能输入正整数")
      } else if (value.length > 8) {
        return Promise.reject("排序号位数不能超过8位数")
      } else {
        callback()
      }
    },
    //新建字典
    addDict() {
      this.dictForm = {
        dictType: '', //字典组编码
        dictName: "", //字典组名称
        remark: '', //字典组备注
      },
        this.dictTitle = "新建字典组";
      this.dictTypeDisabled = false;
      this.visible = true;
    },
    // 添加选项
    addItem() {
      this.itemForm = {
        dictValue: '',
        dictLabel: '',
        dictSort: ''
      }
      this.dictItemTitle = '添加选项';
      this.dictItemDisabled = false;
      this.itemVisible = true;
    },
    // 编辑字典
    editDict(record) {
      this.dictTitle = "编辑字典组";
      this.dictTypeDisabled = true;
      this.visible = true;
      this.dictForm = {
        dictType: record.dictType,
        dictName: record.dictName,
        remark: record.remark,
      }
      this.dictId = record.dictId;
    },
    // 编辑字典项
    editDictType(record) {
      this.editDictVisible = true;
      this.parentDictType = record.dictType; //字典组编码
      this.itemPage = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.getDictTypeDetail();
    },
    // 编辑字典项中具体有一个值
    editDictItem(record) {
      console.log(record);
      this.dictItemTitle = "编辑选项";
      this.dictItemDisabled = true;
      this.itemVisible = true;
      this.itemDictCode = record.dictCode;
      this.itemForm = {
        dictValue: record.dictValue, //字典标签
        dictLabel: record.dictLabel, //字典项名称
        dictSort: record.dictSort,//排序号
        corporationId: record.corporationId,//2024-2-4 新增的所属组织
        corporationName: record.corporationName //2024-2-4 新增的所属组织
      };
    },
    // 启用禁用
    actionItem(record) {
      const params = {
        status: record.status == '0' ? '1' : '0',
        dictCode: record.dictCode,
        dictType: this.parentDictType
      }
      UpdateSysDictData(params).then(res => {
        this.getDictTypeDetail();
      }).catch(err => {
        console.log(err);
      })
    },
    // 删除字典项
    delDictItem(record) {
      const _this = this;
      this.$antConfirm({
        title: '确定删除吗?',
        // content: h => <div>Some descriptions</div>,
        // icon: "redo",
        onOk() {
          RemoveSysDictData({ delSysDictTypeIdList: [record.dictCode] }).then(res => {
            _this.$antMessage.success(res.message);
            _this.getDictTypeDetail();
          }).catch(err => {
            console.log(err);
          })
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    // 删除字典组
    deleteDict(record) {
      const _this = this;
      this.$antConfirm({
        title: '确定删除吗?',
        // content: h => <div>Some descriptions</div>,
        // icon: "redo",
        onOk() {
          RemoveDictType({ delSysDictTypeIdList: [record.dictId] }).then(res => {
            _this.$antMessage.success(res.message);
            _this.getDictTypePage();
          }).catch(err => {
            console.log(err);
          })
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    // 关闭弹框
    cancelFn() {
      this.visible = false;
    },
    // 关闭字典组弹框
    cancelDictType() {
      this.editDictVisible = false;
    },
    // 关闭选项
    cancelItem() {
      this.itemVisible = false;
    },
    // 提交
    submitDict() {
      console.log('ddddd===', this.dictForm);
      if (!formValidator.formAll(this, 'dictForm')) {
        return
      }
      if (this.dictTitle == "编辑字典组") {
        // 编辑
        const params = {
          dictId: this.dictId,
          remark: this.dictForm.remark,
          dictName: this.dictForm.dictName,
          dictType: this.dictForm.dictType,
        }
        UpdateDictTypePage(params).then(res => {
          if (res.code == 20000) {
            this.$antMessage.success(res.message);
            this.dictForm = {
              dictType: '',
              dictName: "",
              remark: '',
            };
            this.visible = false;
            this.getDictTypePage();
            this.getDictTree();
          }

        }).catch(err => {
          console.log(err);
        })
      } else {
        // 新增
        SaveDictData(this.dictForm).then(res => {
          if (res.code == 20000) {
            this.$antMessage.success(res.message);
            this.dictForm = {
              dictType: '',
              dictName: "",
              remark: '',
            };
            this.visible = false;
            this.getDictTypePage();
            this.getDictTree();
          }

        }).catch(err => {
          console.log(err);
        })
      }
    },
    // 字典项新增
    submitItemDict() {
      if (!formValidator.formAll(this, 'itemForm')) {
        return
      }
      if (this.dictItemTitle == "编辑选项") {
        // 编辑
        const params = {
          ...this.itemForm,
          dictCode: this.itemDictCode,
          dictType: this.parentDictType
        }
        UpdateSysDictData(params).then(res => {
          if (res.code == 20000) {
            this.$antMessage.success(res.message);
            this.itemForm = {
              dictValue: '',
              dictLabel: "",
              dictSort: '',
            };
            this.itemVisible = false;
            this.getDictTypeDetail();
          }

        }).catch(err => {
          console.log(err);
        })
      } else {
        // 新增
        const params = {
          ...this.itemForm,
          dictType: this.parentDictType,
        }
        SaveSysDictData(params).then(res => {
          if (res.code == 20000) {
            this.$antMessage.success(res.message);
            this.itemForm = {
              dictValue: '',
              dictLabel: "",
              dictSort: '',
            };
            this.itemVisible = false;
            this.getDictTypeDetail();
          }

        }).catch(err => {
          console.log(err);
        })
      }
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getDictTypePage();
    },
    // 字典组每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDictTypePage();
    },
    // 字典选项列表中页码改变
    pageItemChange(page) {
      this.itemPage.pageNo = page;
      // 获取列表
      this.getDictTypeDetail();
    },
    // 字典选项列表中每页展示条数改变
    itemSizeChange(page, pageSize) {
      this.itemPage.pageNo = 1;
      this.itemPage.pageSize = pageSize;
      // 获取列表
      this.getDictTypeDetail();
    },
    // 查询
    iSearch() {
      this.page.pageNo = 1
      this.handleLoading();
      this.getDictTypePage();
    },
    // 重置
    iRest: debounce(function () {
      this.page = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      }
      this.formInline = {}
      this.getDictTypePage();
    }, 250, { leading: true, trailing: false }),
  },
  beforeDestroy() {
    this.getDictTree();
  }
}
</script>

<style scoped lang='less'>
.table-dialog {
  ::v-deep .ant-modal-header {
    margin-bottom: 20px !important;
  }
  ::v-deep .ant-modal-body {
    .clx-model-body {
      padding: 0 30px !important;
      .model-content {
        padding: 0;
      }
    }
  }
}
</style>