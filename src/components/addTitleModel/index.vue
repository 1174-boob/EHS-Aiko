<template>
  <CommonModal
    title="选择题目"
    :visible="addAddressModel"
    :cancelFn="closeAddAddressModel"
  >
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <!-- <a-form-model-item label="选择科目">
          <a-select
            v-model="formInline.subjectId"
            placeholder="请选择"
            allowClear
          >
            <a-select-option
              v-for="item in sujectList"
              :value="item.subjectId"
              :key="item.subjectId"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-form-model-item> -->
        <a-form-model-item label="选择题型">
          <a-select
            v-model="formInline.topicType"
            placeholder="请选择"
            allowClear
          >
            <a-select-option value="1">单选题</a-select-option>
            <a-select-option value="2">多选题</a-select-option>
            <a-select-option value="3">判断题</a-select-option>
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

    <!-- <CommonTable :spinning="tableSpinning" :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{ emptyText: emptyText }"
        :data-source="dictList"
        :rowKey="
          (record, index) => {
            return index;
          }
        "
        :pagination="false"
      >
        <div slot="customTitle">操作</div>
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer" @click="jumpLook(record)">查看</span>
          <span class="color-0067cc cursor-pointer" @click="jumpAddOrDetail('change', record)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="deleteDict(record)">删除</span>
        </div>
      </a-table>
    </CommonTable> -->
    <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
      <a-table
        :columns="columns"
        :locale="{ emptyText: emptyText }"
        :data-source="dictList"
        :rowKey="
          (record, index) => {
            return record.topicId;
          }
        "
        :pagination="false"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
      >
      </a-table>
    </CommonTable>
    <template slot="btn">
      <a-button @click="closeAddAddressModel">取消</a-button>
      <a-button
        class="m-l-15"
        type="primary"
        :loading="loading"
        @click="submitDict"
        >确定</a-button
      >
    </template>
  </CommonModal>
</template>

<script>
import fromMaxLength from "@/mixin/fromMaxLength";
// 自定义表单验证的class类
import { formValidator } from "@/utils/clx-form-validator.js";
import { contractAddAddress } from "@/services/api";
import cancelLoading from "@/mixin/cancelLoading";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import dragTable from "@/mixin/dragTable.js";
import { debounce } from "lodash";
import { GetKDataList, SubjectsDataList } from "@/services/questionmodel.js";
export default {
  mixins: [fromMaxLength, cancelLoading, teableCenterEllipsis, dragTable],
  props: ["addAddressModel", "sonDataList", "corporationId", "subjectId"],
  data() {
    return {
      dictList: [],
      selectedRowKeys: [],
      columns: [
        {
          title: "题目类型",
          dataIndex: "topicType",
          key: "topicType",
          customRender: (text, record, index) => {
            return text == 1 ? "单选题" : text == 2 ? "多选题" : "判断题";
          },
        },
        {
          title: "题目名称",
          dataIndex: "topicTitle",
          key: "topicTitle",
        },
      ],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      formInline: {
        topicType: undefined,
        subjectId: undefined,
      },
      sujectList: [], //科目列表
    };
  },
  created() {
    console.log(this.sonDataList, "...sonDataList");
    this.subjectsDataList(); //科目列表
    this.getTabList();
    this.selectedRowKeys = this.sonDataList;
  },
  methods: {
    //科目列表
    subjectsDataList() {
      SubjectsDataList()
        .then((res) => {
          console.log(res.data, "..");
          this.sujectList = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取列表
    getTabList() {
      let par = {
        // ...this.formInline,
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        corporationId: this.corporationId,
        subjectId: this.subjectId
      };
      GetKDataList(par).then((res) => {
        this.dictList = res.data ? res.data.list : [];
        this.page.total = res.data.total;
      })
      .catch((err) => {
        console.log(err);
      });
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      this.$emit("pageNo", this.page.pageNo);
      // 获取列表
      this.getTabList();
    },
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.$emit("pageSize", this.page.pageSize);
      this.getTabList();
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      // console.log(selectedRowKeys, selectedRows);
      this.selectedRowKeys = selectedRowKeys;
    },

    // 查询
    iSearch() {
      // this.handleLoading();
      this.getTabList();
    },

    // 重置
    iRest: debounce(
      function () {
        this.formInline = {
          topicType: undefined,
          subjectId: undefined,
        };
        this.getTabList();
      },
      250,
      { leading: true, trailing: false }
    ),

    // 关闭新建地址model
    closeAddAddressModel() {
      this.formInline = { topicType: undefined, subjectId: undefined };
      // this.selectedRowKeys = [];
      this.$emit("closeAddAddressModel");
    },

    submitDict() {
      this.$emit("submitDict", this.selectedRowKeys);
    },

    // 新增地址提交
    addAddressModelSubmit() {
      let isAll = true;
      this.$refs["addAddressModelForm"].validate((valid, object) => {
        if (!valid) {
          this.scrollView(object);
          isAll = valid;
        }
      });
      if (!isAll) return;
      this.handleLoading();
      // 处理地址
      let addressProvince = this.addAddressModelForm.address[0];
      let addressCity = this.addAddressModelForm.address[1];
      let addressDistinct = this.addAddressModelForm.address[2];
      let apiData = {
        ...this.addAddressModelForm,
        address: undefined,
        addressProvince,
        addressCity,
        addressDistinct,
      };
      contractAddAddress(apiData)
        .then((res) => {
          apiData.addressId = res.data;
          this.$emit("setAddressInfo", apiData);
          // 关闭新建地址model
          this.closeAddAddressModel();
        })
        .catch((err) => {})
        .finally(() => {
          this.cancelLoading();
        });
    },
  },
  // watch: {
  //   sonDataList(newVal) {
  //     if (newVal) {
  //       this.selectedRowKeys = newVal;
  //     }
  //   },
  // },
};
</script>

<style lang="less" scoped>
::v-deep .model-content {
  padding: 0 165px 0px 0px !important;
  width: 964px;
}
.clx-model-body {
  margin-bottom: 20px;
}
</style>
