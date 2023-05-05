<template>
  <div>
    <CommonModal :title="'进出厂记录'" :visible="noteModelShow" :cancelFn="closeModel" class="table-modal">
      <template slot="form">
        <a-spin :spinning="spinning" wrapperClassName="a-spin">
          <CommonTable>
            <a-table
              bordered
              :columns="columns"
              :locale="{ emptyText: emptyText }"
              :data-source="tableList"
              :rowKey="
                (record, index) => {
                  return index;
                }
              "
              :pagination="false"
            ></a-table>
          </CommonTable>
        </a-spin>
      </template>
      <template slot="btn">
        <a-button class="m-l-15" type="primary" @click="closeModel">关闭</a-button>
      </template>
    </CommonModal>
  </div>
</template>

<script>
import chemicalDict from "@/mixin/chemicalDict.js";
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import dictionary from "@/utils/dictionary";
import { getTransientChemicalsNoteApi, } from "@/services/chemicalIdentSafetyTipsAdd.js";
export default {
  mixins: [chemicalDict, teableCenterEllipsis],
  model: {
    prop: "noteModelShow",
  },
  props: {
    // 弹窗显示隐藏
    noteModelShow: {
      type: Boolean,
      default: false,
    },
    // 二维码数据
    noteModelData: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      spinning: false,
      columns: [
        {
          title: "化学品名称",
          dataIndex: "chemicalsId",
          key: "chemicalsId",
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
          title: "申请数量",
          dataIndex: "applicationNum",
          key: "applicationNum",
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
          title: "单位",
          dataIndex: "chemicalsUnit",
          key: "chemicalsUnit",
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          customRender: (text) => {
            text = dictionary('factoryStatus', text)
            return text;
          },
        },
        {
          title: "操作人",
          dataIndex: "operator",
          key: "operator",
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
          title: "操作时间",
          dataIndex: "operateTime",
          key: "operateTime",
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
          width: 160,
        },
        {
          title: "实际进出厂数量",
          dataIndex: "recordNum",
          key: "recordNum",
          width: 134,
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
          title: "备注",
          dataIndex: "remark",
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
      ],
      tableList: [],
    };
  },
  methods: {
    getTableList() {
      this.spinning = true
      let apiData = { temporaryEntryId: this.noteModelData.temporaryEntryId }
      getTransientChemicalsNoteApi(apiData)
        .then(res => {
          this.tableList = res.data
        })
        .catch(err => { })
        .finally(() => {
          this.spinning = false
        })
    },
    // 取消-关闭model
    closeModel() {
      this.$emit("input", false);
    },
  },
  watch: {
    noteModelShow(newV, oldV) {
      if (newV) {
        this.getTableList()
      }
    }
  },
};
</script>

<style lang='less' scoped>
::v-deep .a-spin {
  .ant-spin-blur {
    opacity: 0.1 !important;
  }
}

.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.table-modal {
  ::v-deep .model-content-form {
    padding: 0 20px !important;
  }
}
</style>
