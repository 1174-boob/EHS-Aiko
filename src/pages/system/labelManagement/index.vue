<template>
  <!-- 标签组管理 -->
  <div class="role-console-box clx-show-scroll clx-flex-1 beauty-scroll">
    <PageTitle>标签组管理</PageTitle>
    <SearchTerm>
      <div class="role-console-search-left">
        <a-form-model layout="inline" :model="formInline" :colon="false">
          <a-form-model-item label="标签组名称">
            <a-input
              class="role-console-search-left-item"
              :maxLength="nameMaxLength"
              v-model="formInline.labelName"
              placeholder="请输入标签组名称"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item style="width: 358px" label="标签组类型">
            <a-select style="width:200px" v-model="formInline.labelType" placeholder="请选择">
              <a-select-option style="width:200px" :key="index" :value="item.itemCode" v-for="(item, index) in orgLevelList">{{item.itemName}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="float-right">
            <a-button type="primary" :loading="loadingTwo" @click="iSearch"
              >查询</a-button
            >
            <a-button @click="iRest">重置</a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </SearchTerm>
    <!-- 创建标签组 -->
    <div class="role-console-apply clx-btn-dashed-box">
      <a-button type="dashed" @click="addConsoleRole">
        <a-icon type="plus" />创建标签组
      </a-button>
    </div>
    <!-- 表格 -->
    <div class="role-console-table">
      <CommonTable
        :page="page"
        :pageNoChange="pageNoChange"
        :showSizeChange="showSizeChange"
      >
        <a-table
          :columns="columns"
          :locale="{ emptyText: emptyText }"
          :data-source="dataList"
          rowKey="labelId"
          :pagination="false"
        >
          <div class="table-btn" slot="action" slot-scope="text, record">
            <span @click="manageLabel(record)">管理标签</span>
            <span @click="changeConsoleRole(record)">编辑</span>
            <span @click="rmConsoleRoleFn(record)" class="table-btn-rm"
              >删除</span
            >
          </div>
        </a-table>
      </CommonTable>
    </div>
    <!-- 新增、编辑标签组弹窗 -->
    <CommonModal
      :title="modelTitle"
      :visible="roleModelShow"
      :cancelFn="closeModel"
    >
      <template slot="form">
        <a-form-model
          ref="ruleForm"
          :model="formData"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="标签组编码" prop="labelCode">
            <a-input
              :maxLength="6"
              :disabled="InpDis"
              v-model="formData.labelCode"
              placeholder="请输入数字，最多不要超过6位"
            />
          </a-form-model-item>
          <a-form-model-item label="标签组名称" prop="labelName">
            <a-input 
              v-model="formData.labelName" 
              :maxLength="20"
              placeholder="请输入标签组名称" />
          </a-form-model-item>
          <a-form-model-item label="标签组类型" prop="labelType">
            <a-select style="display: block;"  v-model="formData.labelType" placeholder="请选择标签组类型">
              <a-select-option :key="index" :value="item.itemCode" v-for="(item, index) in orgLevelList">{{item.itemName}}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="标签组描述" prop="labelDescription">
            <a-textarea 
              :maxLength="100"
              v-model="formData.labelDescription" 
              placeholder="请输入标签组描述" />
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button type="dashed" :loading="loading" @click="closeModel"
          >取消</a-button
        >
        <a-button
          type="primary"
          style="margin-left: 0.2rem"
          :loading="loading"
          @click="onSubmit"
          >提交</a-button
        >
      </template>
    </CommonModal>

    <!-- 新增、编辑标签弹窗 -->
    <CommonModal
      title="管理标签"
      :visible="roleModelLabelShow"
      :cancelFn="closeModelLabel"
    >
      <template>
        <div style="margin-bottom: 16px" class="role-console-apply clx-btn-dashed-box ">
          <a-button type="dashed" @click="handleAdd">
            <a-icon type="plus" />创建标签
          </a-button>
        </div>
        <a-table bordered :data-source="labelDataSource" :columns="labelColumns" rowKey="timestamp">
          <template slot="labelItemName" slot-scope="text, record">
            <editable-cell :text="text" @change="onCellNameChange(record.timestamp, 'labelItemName', $event)" />
          </template>
          <template slot="labelItemCode" slot-scope="text, record">
            <editable-cell :text="text" @change="onCellCodeChange(record.timestamp, 'labelItemCode', $event)" />
          </template>
          <template slot="labelItemDescription" slot-scope="text, record">
            <editable-cell :text="text" @change="onCellDesChange(record.timestamp, 'labelItemDescription', $event)" />
          </template>
          <template slot="action" slot-scope="text, record">
            <a-popconfirm
              title="确定删除?"
              @confirm="() => onDelete(record)"
            >
              <a href="javascript:;" class="table-btn-rm">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </template>

      <template slot="btn">
        <a-button type="dashed" :loading="loading" @click="closeModelLabel"
          >取消</a-button
        >
        <a-button
          type="primary"
          style="margin-left: 0.2rem"
          :loading="loading"
          @click="onSetSubmit"
          >提交</a-button
        >
      </template>
    </CommonModal>
  </div>
</template>

<script>
const EditableCell = {
  template: `
      <div class="editable-cell">
        <div v-if="editable" class="editable-cell-input-wrapper">
          <a-input :value="value" @change="handleChange" @pressEnter="check" />
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ value || ' ' }}
        </div>
      </div>
    `,
  props: {
    text: String,
  },
  data() {
    return {
      value: this.text,
      editable: true,
    };
  },
  methods: {
    handleChange(e) {
      const value = e.target.value;
      this.value = value;
      this.$emit('change', this.value);
    },
    check() {
      this.editable = false;
      this.$emit('change', this.value);
    },
    edit() {
      this.editable = true;
    },
  },
};
import {
  GetLabelPageList,
  AddOLabel,
  UpdateOLabel,
  DelOLabel,
  GetItemLabel,
  DelOItemLabel,
  LabelItemAdd
} from "@/services/label.js";
import fromMaxLength from "@/mixin/fromMaxLength";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import { debounce } from "lodash";
import { formValidator } from "@/utils/clx-form-validator.js";
export default {
  mixins: [fromMaxLength, teableCenterEllipsis, cancelLoading],
  components: {
    EditableCell,
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      // 新增、修改表单
      formData: {
        labelCode: "",
        labelName: "",
        labelType: "",
        labelDescription: "",
      },
      // 表单验证
      rules: {
        labelCode: [
          {
            required: true,
            validator: formValidator.onlyNumber,
            trigger: "blur",
            message: "标签组编码保存后不可再次编辑，请谨慎填写",
          },
        ],
        labelName: [
          { 
            required: true,
            message: "标签组名称不能为空",
            trigger: "blur" 
          },
        ],
        labelType: [
          { 
            // validator: formValidator.onlyNumber,
            required: true,
            message: "标签组类型不能为空",
            trigger: "blur" 
          },
        ],
        labelDescription: [
          {
            // validator: formValidator.texTonlyNumberNine,
            trigger: "blur",
            text: "标签组描述",
          },
        ],
      },
      // 标签组弹窗model-显示隐藏
      roleModelShow: false,
      // 管理标签弹窗-显示隐藏
      roleModelLabelShow: false,
      // 搜索表单
      formInline: {
        labelName: undefined,
        labelType: undefined,
      },
      // 页码
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        {
          title: "标签组编码",
          dataIndex: "labelCode",
          key: "labelCode",
          width: 160
        },
        {
          title: "标签组名称",
          dataIndex: "labelName",
          key: "labelName",
          width: 360
        },
        {
          title: "标签组类型",
          dataIndex: "labelType",
          key: "labelType",
          width: 360
        },
        {
          title: "标签组描述",
          dataIndex: "labelDescription",
          key: "labelDescription",
        },
        {
          dataIndex: "action",
          title: "操作",
          width: 180,
          scopedSlots: { customRender: "action" },
        },
      ],
      dataList: [],
      orgLevelList:[
        {
          itemCode:'1',
          itemName:"个人标签"
        },
        {
          itemCode:'2',
          itemName:"部门标签"
        }
      ],
      //编辑时禁用输入框
      InpDis: false,
      //弹窗title
      modelTitle: "",
      //编辑时存储的id
      // 标签组id
      labelId: "",
      // 标签id
      labelItemId: '',
      labelDataSource: [],
      labelColumns: [
        {
          title: '标签名称',
          dataIndex: 'labelItemName',
          width: '30%',
          scopedSlots: { customRender: 'labelItemName' },
        },
        {
          title: '标签编码',
          dataIndex: 'labelItemCode',
          width: '20%',
          scopedSlots: { customRender: 'labelItemCode' },
        },
        {
          title: '标签描述',
          dataIndex: 'labelItemDescription',
          scopedSlots: { customRender: 'labelItemDescription' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '10%',
          scopedSlots: { customRender: 'action' },
        },
      ],
      labelItemName: '',
      labelItemCode: '',
      labelItemDescription:''
    };
  },
  created() {
    this.getTableList();
  },
  methods: {
    // 获取列表
    getTableList() {
      let postData = {
        ...this.page,
        ...this.formInline,
      };
      return GetLabelPageList(postData)
        .then((res) => {
          let { list: dataList, total } = res.data
            ? res.data
            : { list: [], total: 0 };
          this.dataList = dataList ? dataList : [];
          this.page.total = total;

          // 处理页码 问题
          if (
            this.dataList.length === 0 &&
            (this.page.pageNo !== 1 || this.page.total !== 0)
          ) {
            this.page.pageNo = 1;
            this.getTableList();
          }
        })
        .catch((err) => {});
    },
    getLabelTableList() {
      let postData = {
        labelId: this.labelId,
      };
      return GetItemLabel(postData)
        .then((res) => {
          let labelDataSource = res.data? res.data: [] 
          this.labelDataSource = labelDataSource ? labelDataSource : [];
        })
        .catch((err) => {});
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getTableList();
    },
    //改变每页条数事件
    showSizeChange(pageNo, pageSize) {
      this.page.pageNo = pageNo;
      this.page.pageSize = pageSize;
      //获取列表
      this.getTableList();
    },
    // 查询
    iSearch() {
      this.handleLoadingTwo();
      // 获取列表
      this.getTableList().finally(() => {
        this.cancelLoadingTwo();
      });
    },
    // 重置
    iRest: debounce(
      function () {
        this.formInline = { labelName: undefined ,labelType: undefined};
        this.getTableList();
      },
      250,
      { leading: true, trailing: false }
    ),
    // 新增
    addConsoleRole() {
      this.modelTitle = "创建标签组";
      this.InpDis = false;
      this.roleModelShow = true;
    },
    // 修改
    changeConsoleRole(item) {
      this.labelId = item.labelId;
      this.formData = {
        labelCode: item.labelCode,
        labelName: item.labelName,
        labelType: item.labelType,
        labelDescription: item.labelDescription,
      };
      this.InpDis = true;
      this.modelTitle = "编辑标签组";
      this.roleModelShow = true;
    },
    // 管理标签
    async manageLabel(item){
      this.labelId = item.labelId;
      await this.getLabelTableList();
      // this.labelDataSource = item.labelDataSource;
      // item.labelDataSource = this.labelDataSource
      // item.labelItemName = item.labelDataSource.labelItemName
      // item.labelItemCode = item.labelDataSource.labelItemCode
      // item.labelItemDescription = item.labelDataSource.labelItemDescription
      this.roleModelLabelShow = true
    },
    // 管理标签修改内容
    onCellNameChange(key, dataIndex, value) {
      const labelDataSource = [...this.labelDataSource];
      const target = labelDataSource.find(item => item.timestamp === key);
      if (target) {
        target[dataIndex] = value;
        this.labelDataSource = labelDataSource;
      }
    },
    // 管理标签修改内容
    onCellCodeChange(key, dataIndex, value) {
      const labelDataSource = [...this.labelDataSource];
      const target = labelDataSource.find(item => item.timestamp === key);
      if (target) {
        target[dataIndex] = value;
        this.labelDataSource = labelDataSource;
      }
    },
    // 管理标签修改内容
    onCellDesChange(key, dataIndex, value) {
      const labelDataSource = [...this.labelDataSource];
      const target = labelDataSource.find(item => item.timestamp === key);
      if (target) {
        target[dataIndex] = value;
        this.labelDataSource = labelDataSource;
      }
    },
    // 删除标签
    onDelete(row) {
      // 逻辑
      if(row.labelItemId != ''){
        let postLabelData = {
          labelId: row.labelId,
          labelItemId: row.labelItemId,
        };
        DelOItemLabel(postLabelData)
          .then((res) => {
            this.$message.success("删除成功");
            const labelDataSource = [...this.labelDataSource];
            this.labelDataSource = labelDataSource.filter(item => item.labelItemId !== row.labelItemId);
          })
          .catch((err) => {})
      } else {
        const labelDataSource = [...this.labelDataSource];
        this.labelDataSource = labelDataSource.filter(item => item.timestamp !== row.timestamp);
      }
    },
    
    // 删除
    rmConsoleRoleFn(row) {
      let postData = {
        labelId: row.labelId,
      };
      this.$antConfirm({
        title: "确定删除？",
        icon: () => (
          <a-icon type="delete" class="confirm-icon-rm" theme="filled" />
        ),
        content: "如果您有用户绑定了该标签，则将标签信息一并删除",
        cancelText: "取消",
        onOk: () => {
          DelOLabel(postData)
            .then((res) => {
              this.$message.success("删除成功");
              this.getTableList();
            })
            .catch((err) => {});
        },
      });
    },
    //提交
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return;
        let obj = {
          ...this.formData,
          labelId: this.modelTitle == "创建标签组" ? undefined : this.labelId,
        };
        if (this.modelTitle == "创建标签组") {
          //新增
          AddOLabel(obj)
            .then((res) => {
              this.getTableList();
              this.$message.success("新增成功");
              this.closeModel();
            })
            .catch(() => {});
        } else {
          UpdateOLabel(obj)
            .then((res) => {
              this.getTableList();
              this.$message.success("修改成功");
              this.closeModel();
            })
            .catch(() => {});
        }
      });
    },
    //关闭弹窗
    closeModel() {
      this.roleModelShow = false;
      this.formData={
        labelCode: "",
        labelName: "",
        labelType:'',
        labelDescription: "",
      }
    },
    // 创建标签
    handleAdd() {
      const { labelDataSource } = this;
      const newData = {
        timestamp: new Date().getTime(),
        labelItemId: '',
        labelItemName: '',
        labelItemCode: '',
        labelItemDescription: '',
      };
      this.labelDataSource = [...labelDataSource, newData];
    },
    // 提交管理标签
    onSetSubmit() {
      let params = {
        labelId: this.labelId,
        labelItemList: this.labelDataSource
      }
      console.log(params,'params');
      //标签新增｜修改 -> 提交
      LabelItemAdd(params)
        .then((res) => {
          this.getLabelTableList();
          this.$message.success("提交成功");
        })
        .catch((err) => {err});
      this.closeModelLabel();
    },
    closeModelLabel() {
      this.roleModelLabelShow = false;
    }
  },
};
</script>

<style lang="less" scoped>
.role-console-box {
  // title
  .role-console-title {
    font-size: 20px;
    font-weight: 400;
    color: #333333;
    margin: 15px 30px 15px 0;
  }
  // 创建标签组
  .role-console-apply {
    margin: 20px 0;
    button {
      span {
        font-size: 0.16rem;
      }
    }
  }
  .role-console-table {
    .table-status {
      i {
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        margin-right: 5px;
        vertical-align: middle;
      }
    }
    .table-btn {
      display: flex;
      align-items: center;
      justify-content: space-around;
      & > span {
        cursor: pointer;
        color: #0067cc;
      }
      .table-btn-rm {
        color: #dd000d;
      }
    }
    .table-pagination {
      display: flex;
      margin: 15px 15px;
      justify-content: flex-end;
      align-items: center;
      .table-pagination-totel {
        margin-left: 15px;
        & > span {
          color: #0065c8;
        }
      }
    }
  }
  .editable-cell {
  position: relative;
  }

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    line-height: 18px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell:hover .editable-cell-icon {
    display: inline-block;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #0067cc;
  }

  .editable-add-btn {
    margin-bottom: 16px;
  }
}
.clx-model-body {
  .relation-tree-title {
    display: flex;
    .relation-tree-title-all {
      & > span {
        color: #0067cc;
      }
      margin-right: 20px;
    }
    .relation-tree-title-sel {
      & > span {
        color: #0067cc;
      }
    }
  }
}

</style>
