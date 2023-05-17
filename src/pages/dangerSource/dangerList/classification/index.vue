<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="所属分类">
          <a-select
            v-model="formInline.classificationCode"
            placeholder="请选择"
            @change="changeThing"
          >
            <a-select-option
              v-for="(val, key) in classDictObj"
              :key="key"
              :value="key"
              >{{ val }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="所属组织">
          <a-select v-model="formInline.corporationId" placeholder="请选择">
            <a-select-option
              v-for="item in organizationListO"
              :key="item.orgId"
              :value="item.orgId"
              >{{ item.orgAbbrName }}</a-select-option
            >
          </a-select>
        </a-form-model-item>
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch"
            >查询</a-button
          >
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="addFn"
          ><a-icon type="plus" />新增</a-button
        >
      </div>
    </DashBtn>
    <CommonTable
      :spinning="tableSpinning"
      :page="page"
      :pageNoChange="pageNoChange"
      :showSizeChange="onShowSizeChange"
    >
      <a-table
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{ emptyText: emptyText }"
        :data-source="tableDataList"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
        :pagination="false"
      >
        <div slot="action" slot-scope="record">
          <span
            class="color-0067cc cursor-pointer m-r-15"
            @click="actionEdit(record)"
            >编辑</span
          >
          <span
            class="color-0067cc cursor-pointer"
            @click="actionDelete(record)"
            >删除</span
          >
        </div>
      </a-table>
    </CommonTable>
    <CommonModal
      :title="modalTitle ? '编辑' : '新增'"
      :visible="addVisible"
      :cancelFn="addCancle"
    >
      <template slot="form">
        <a-form-model
          ref="addForm"
          :model="addForm"
          :rules="addFormRules"
          :label-col="{ style: { width: '108px' } }"
          :wrapper-col="{ style: { width: 'calc(100% - 108px)' } }"
          :colon="false"
          labelAlign="left"
        >
          <a-form-model-item
            class="flex"
            label="所属分类"
            prop="classificationCode"
          >
            <a-select v-model="addForm.classificationCode" placeholder="请选择">
              <a-select-option
                v-for="item in classDictList"
                :key="item.key"
                :value="item.key"
                >{{ item.value }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="所属组织" prop="orgId">
            <a-select v-model="addForm.corporationId" placeholder="请选择">
              <a-select-option
                v-for="(item, index) in organizationList"
                :key="index"
                :value="item.orgId"
                >{{ item.orgName }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
          <a-form-model-item class="flex" label="描述" prop="description">
            <a-textarea
              :maxLength="500"
              v-model="addForm.remake"
              placeholder="请输入描述"
            />
          </a-form-model-item>
        </a-form-model>
      </template>
      <template slot="btn">
        <a-button class="m-r-15" @click="addCancle">取消</a-button>
        <a-button type="primary" :loading="addLoading" @click="addConfirm"
          >确定</a-button
        >
      </template>
    </CommonModal>
  </div>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import { debounce } from "lodash";
import { formValidator } from "@/utils/clx-form-validator.js";
import {
  GetClassList,
  AddClassList,
  EditClassList,
  DelClassList,
  AllClassList,
  GetOrganizationList,
} from "@/services/dangerSource/dangerList/index.js";
import dictionary from "@/utils/dictionary";

export default {
  mixins: [teableCenterEllipsis, cancelLoading],
  data() {
    return {
      tableSpinning:false,
      organizationListO: {},
      treeData: [],
      classDictList: dictionary("classification"),
      classDictObj: {},
      addVisible: false,
      addLoading: false,
      addForm: {},
      addFormRules: {
        classificationCode: [
          { required: true, message: "所属分类不能为空", trigger: "change" },
        ],
        orgId: [
          { required: true, message: "所属组织不能为空", trigger: "change" },
        ],
      },
      modalTitle: false,
      formInline: {
        classificationCode: undefined,
        corporationId: undefined,
      },
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        {
          title: "编号",
          dataIndex: "id",
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "所属分类",
          dataIndex: "classificationName",
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "所属组织",
          dataIndex: "corporationName",
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          fixed: "right", // 固定操作列
          width: 200, // 宽度根据操作自定义设置
        },
      ],
      tableDataList: [],
      id: "",
    };
  },
  created() {
    console.log(123)
    this.getDataList(); //获取列表
    this.allClassList(); //获取所有所属分类
    this.getOrganizationList(); //获取所有组织列表
  },
  methods: {
    // 顶部搜索-所属分类切换
    changeThing(val) {
      if (val) {
        this.formInline.corporationId = undefined;
        GetOrganizationList({ classificationCode: val }).then((res) => {
          this.organizationListO = res.data;
        });
      }
    },

    // 获取所有组织列表
    getOrganizationList() {
      let list = this.setLoginCorporation;
      let list2 = [];
      list.forEach((item) => {
        if (item) {
          list2.push(item);
        }
      });
      this.organizationList = list2;
    },

    // 获取所有所属分类
    allClassList() {
      return AllClassList()
        .then((res) => {
          console.log(res.data);
          this.classDictObj = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 获取列表
    getDataList() {
      this.tableSpinning = true
      return GetClassList({
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        ...this.formInline,
      })
        .then((res) => {
          this.cancelLoading(100);
          this.tableDataList = res.data.list;
          this.page.total = res.data.total;
        })
        .catch((err) => {
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
      };
      // 获取列表
      this.getDataList().finally(() => {
        this.cancelLoading();
      });
    },

    // 重置
    iRest: debounce(
      function () {
        this.page = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
        };
        this.formInline = {
          classificationCode: undefined,
          corporationId: undefined,
        };
        this.getDataList();
      },
      250,
      { leading: true, trailing: false }
    ),

    // 新增
    addFn() {
      this.addVisible = true;
      this.modalTitle = false;
    },

    // 新增-确定
    addConfirm() {
      if (!formValidator.formAll(this, "addForm")) {
        return;
      }

      //modalTitle为真是编辑 为假是新增
      let promiseFn = this.modalTitle ? EditClassList : AddClassList;
      let dataObj = {
        ...this.addForm,
        classificationName: dictionary(
          "classification",
          this.addForm.classificationCode
        ),
        corporationName: this.getMappingValue(
          this.organizationList,
          "id",
          this.addForm.corporationId
        ).orgName,
        id: this.modalTitle ? this.id : undefined,
      };
      this.addLoading = true;
      promiseFn(dataObj)
        .then(() => {
          this.formInline = {
            classificationCode: undefined,
            corporationId: undefined,
          };
          this.$antMessage.success(
            `${this.modalTitle ? "编辑成功" : "新增成功"}`
          );
          this.getDataList(); //获取列表
          this.allClassList(); //获取所有所属分类-顶部搜索
          this.addLoading = false;
          this.addVisible = false;
          this.addForm = {};
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 弹框-取消
    addCancle() {
      this.addVisible = false;
      this.addForm = {};
    },

    // 按钮-编辑
    actionEdit(record) {
      let obj = {
        classificationCode: record.classificationCode || undefined,
        classificationName: record.classificationName,
        corporationId: record.corporationId || undefined,
        corporationName: record.corporationName,
        remake: record.remake,
      };
      this.modalTitle = true;
      this.id = record.id;
      this.addForm = obj;
      this.addVisible = true;
    },

    // 按钮-删除
    actionDelete(record) {
      this.$antConfirm({
        title: "提示",
        content: "确认删除？",
        cancelText: "取消",
        okText: "确认",
        onOk: () => {
          DelClassList({
            id: record.id,
          })
            .then((res) => {
              this.formInline = {
                classificationCode: undefined,
                corporationId: undefined,
              };
              this.allClassList(); //获取所有所属分类-顶部搜索
              this.getDataList(); //获取列表
              this.$antMessage.success("删除成功");
            })
            .catch((err) => console.log(err));
        },
      });
    },

    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getDataList();
    },

    // 页码改变
    onShowSizeChange(current, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getDataList();
    },
  },
};
</script>
<style lang="less" scoped>
.rule {
  width: 80px;
  margin: 0 10px;
}
</style>