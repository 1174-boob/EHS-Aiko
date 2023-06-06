<template>
  <CommonModal
    title="选择试卷"
    :visible="addAddressModel"
    :cancelFn="closeAddAddressModel"
  >
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="选择分类">
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
        </a-form-model-item>
        <a-form-model-item label="选择试卷">
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
    <CommonTable>
      <a-table
        :columns="columns"
        :locale="{ emptyText: emptyText }"
        :data-source="dictList"
        :rowKey="
          (record, index) => {
            return record.paperId;
          }
        "
        :pagination="false"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          type:rowType
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
import { GetKDataList, SubjectsDataList,GetQuestionDataList } from "@/services/questionmodel.js";
export default {
  mixins: [fromMaxLength, cancelLoading, teableCenterEllipsis, dragTable],
  props: ["addAddressModel", "sonDataList"],
  data() {
    return {
      dictList: [],
      rowType:'radio',
      selectedRowKeys: [],
      selectedRows:'',
      columns: [
        {
          title: "试卷名称",
          dataIndex: "name",
          key: "name",
          // customRender: (text, record, index) => {
          //   return text == 1 ? "单选题" : text == 2 ? "多选题" : "判断题";
          // },
        },
        {
          title: "题目",
          dataIndex: "subjectId",
          key: "subjectId",
        },
        {
          title: "总分",
          dataIndex: "totalScore",
          key: "totalScore",
        },
      ],
      productId: null,
      formInline: {
        topicType: undefined,
        subjectId: undefined,
      },
      formInline11: {
        subjectId: undefined,
        name: undefined,
      },
      sujectList: [], //科目列表
    };
  },
  created() {
    this.setRouterCode("testManagement");
    this.productId = JSON.parse(
      sessionStorage.getItem("zconsole_userInfo")
    ).productSets.productId;
    console.log(this.sonDataList, "...sonDataList");
    this.subjectsDataList(); //科目列表
    // this.getTabList();
    this.getQuestionDataList();
    this.selectedRowKeys = this.sonDataList;
  },
  methods: {
    // 获取试卷列表
    getQuestionDataList() {
      const params = {
        ...this.formInline11,
        pageNo: 1,
        pageSize: 10000,
        productId: this.productId,
      };
      GetQuestionDataList(params)
        .then((res) => {
          this.cancelLoading(100);
          console.log("iiiii===",res);
          this.dictList = res.data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },
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
    // getTabList() {
    //   let par = { ...this.formInline };
    //   GetKDataList(par)
    //     .then((res) => {
    //       this.dictList = res.data;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },

    onSelectChange(selectedRowKeys, selectedRows) {
      // console.log(selectedRowKeys, selectedRows);
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },

    // 查询
    iSearch() {
      // this.handleLoading();
      // this.getTabList();
      this.getQuestionDataList();
    },

    // 重置
    iRest: debounce(
      function () {
        this.formInline = {
          topicType: undefined,
          subjectId: undefined,
        };
        // this.getTabList();
        this.getQuestionDataList();
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
      this.$emit("submitDict", this.selectedRows);
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
  padding: 0 80px !important;
}
.clx-model-body {
  margin-bottom: 20px;
}
@media screen and (max-width: 1366px) {
  .clx-model{
    /deep/ .ant-modal{
      width: 800px !important;
    }
  }
}

</style>
