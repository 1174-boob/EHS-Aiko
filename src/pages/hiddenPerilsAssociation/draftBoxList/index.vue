<template>
  <div class="clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SearchTerm>
      <a-form-model layout="inline" :model="formInline" :colon="false">
        <a-form-model-item label="检查类型">
          <a-select v-model="formInline.checkType" placeholder="请选择">
            <a-select-option v-for="item in checkList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="隐患类型">
          <a-select v-model="formInline.dangerCategory" placeholder="请选择">
            <a-select-option v-for="item in troubleList" :key="item.dictValue" :value="item.dictValue">{{item.dictLabel}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="隐患级别">
          <a-select v-model="formInline.dangerLevel" placeholder="请选择">
            <a-select-option v-for="item in troubleClassList" :key="item.dictValue" :value="item.dictValue">{{ item.dictLabel }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 搜索栏按钮需要加固定的float-right类名 -->
        <a-form-model-item class="float-right">
          <a-button type="primary" :loading="loading" @click="iSearch">查询</a-button>
          <a-button @click="iRest">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </SearchTerm>
    <CommonTable :page="page" :spinning="tableSpinning" :pageNoChange="pageNoChange" :showSizeChange="onShowSizeChange">
      <a-table
        :columns="columns"
        :scroll="{ x: 800 }"
        :locale="{ emptyText: emptyText }"
        :data-source="tableList"
        :pagination="false"
        :rowKey="
          (record, index) => {
            return record.hideDangerId;
          }
        "
        bordered
      >
        <div slot="action" slot-scope="record">
          <span class="color-0067cc cursor-pointer m-r-15" @click="actionEdit(record)">编辑</span>
          <span class="color-ff4d4f cursor-pointer" @click="actionDelete(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import cancelLoading from "@/mixin/cancelLoading";
import UploadBtnStyle from "@/components/upload/uploadStyleXt.vue";
import { debounce } from "lodash";
import { GethiddenPerilsListAssociation, DelhiddenPerilsListAssociation, } from "@/services/hiddenPerils.js";
import chemicalDict from "@/mixin/chemicalDict.js";
export default {
  components: { UploadBtnStyle },
  mixins: [teableCenterEllipsis, cancelLoading, chemicalDict],
  data() {
    return {
      checkList: [], //检查类型
      troubleList: [], //隐患类别
      troubleClassList: [], //隐患级别
      formInline: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      tableSpinning:false,
      columns: [
        {
          title: "隐患编号",
          dataIndex: "dangerCode",
          width: 200,
          customRender: (text) => {
            text = text ? text : "--";
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
          title: "检查类型",
          dataIndex: "checkType",
          width: 150,
          customRender: (text, record, index) => {
            return text ? this.getChemicalDictText('checkType', text) : "--";
          },
        },
        {
          title: "隐患类别",
          dataIndex: "dangerCategory",
          width: 150,
          customRender: (text, record, index) => {
            return text ? this.getChemicalDictText("httype", text) : "--";
          },
        },
        {
          title: "隐患位置",
          dataIndex: "dangerLocation",
          width: 200,
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "隐患描述",
          dataIndex: "dangerSketch",
          width: 200,
          customRender: (text) => {
            text = text ? text : "--";
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
          title: "责任部门/责任人",
          dataIndex: "responsibilityPersonName",
          width: 200,
          customRender: (text, record, index) => {
            return text ? text : "--";
          },
        },
        {
          title: "发现时间",
          dataIndex: "findTime",
          width: 200,
          customRender: (text) => {
            text = text ? text : "--";
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
          title: "创建时间",
          dataIndex: "createTime",
          width: 200,
          customRender: (text) => {
            text = text ? text : "--";
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
          title: "操作",
          scopedSlots: { customRender: "action" },
          fixed: "right", // 固定操作列
          width: 120, // 宽度根据操作自定义设置
        },
      ],
      tableList: [],
      loading: false,
    };
  },

  created() {
    this.initConfigPage()
    this.getDataList(); //获取列表
  },
  activated() {
    setTimeout(() => {
      if(!this.keepalive){
        this.initConfigPage()
        this.iRest()
      }
    }, 20);
  },
  methods: {
    initConfigPage(){
      this.checkList = this.getChemicalDictList('checkType')
      this.troubleList = this.getChemicalDictList('httype')
      this.troubleClassList = this.getChemicalDictList('htlevel')
    },
    //获取列表
    getDataList() {
      let params = {
        ...this.formInline,
        dangerOperateId:this.$route.query.dangerOperateId,
        draftStatus: "draft",
        pageSize: this.page.pageSize,
        pageNo: this.page.pageNo,
      };
      this.loading = true;
      this.tableSpinning = true
      return GethiddenPerilsListAssociation(params)
        .then((res) => {
          this.loading = false;
          this.tableList = res.data.list;
          this.page.total = res.data.total;
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        }).finally(()=>{
          this.tableSpinning = false
        })
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
        this.formInline = {};
        this.getDataList();
      },
      250,
      { leading: true, trailing: false }
    ),

    // 编辑
    actionEdit(record) {
      let path = "/safeManage/workManage/dangerWorkStatic/addHiddenPerilsAssociation";
      this.$router.push({ path, query: { hideDangerId: record.hideDangerId } });
    },

    // 删除
    actionDelete(record) {
      this.$antConfirm({
        content: "确认删除？",
        cancelText: "取消",
        onOk: () => {
          DelhiddenPerilsListAssociation({
            hideDangerId: record.hideDangerId,
          })
            .then((res) => {
              this.$antMessage.success("删除成功");
              this.page.pageNo = 1;
              this.getDataList();
            })
            .catch((err) => {
              console.log(err);
            });
        },
      });
    },
  },
};
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
.scal {
  // color: #0067cc;
  // font-size: 15px;
  cursor: pointer;
  &:hover {
    color: #0067cc;
  }
}
</style>