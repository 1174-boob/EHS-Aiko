<template>
  <CommonModal class="self-modal" :title="modelTitle" :visible="addCasNoModelShow" :cancelFn="closeModel" :setStyle="{ padding: '0 80px 0 100px !important' }">
    <div>
      <!--表格列表 -->
      <CommonTable :page="page" :pageNoChange="pageNoChange" :showSizeChange="showSizeChange">
        <a-table
          bordered
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,fixed:true }"
          :scroll="{ x: tableScrollX() }"
          :columns="columns"
          :locale="{emptyText: emptyText}"
          :data-source="tableData"
          :rowKey="tableRowKey"
          :loading="loading || loadingTwo"
          :pagination="false"
        ></a-table>
      </CommonTable>
    </div>
    <template slot="btn">
      <a-button @click="closeModel">取消</a-button>
      <a-button type="primary" class="m-l-15" @click="confirmModle">确定</a-button>
    </template>
  </CommonModal>
</template>

<script>
import { cloneDeep } from 'lodash'
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import teableSelected from "@/mixin/teableSelected";
import cancelLoading from "@/mixin/cancelLoading";
import { getDictConfigData } from "@/utils/dictionary.js";
import ondutyMixin from '@/pages/networkControl/onduty/mixin/ondutyMixin.js'
export default {
  mixins: [teableCenterEllipsis, teableSelected, cancelLoading, ondutyMixin],
  model: {
    prop: "addCasNoModelShow",
  },
  props: {
    // 弹窗显示隐藏
    addCasNoModelShow: {
      type: Boolean,
      default: false,
    },
    modelTitle: {
      type: String,
      default: '系统数据',
    },
    // tableKey
    tableRowKey: {
      type: String,
      default: 'dictId',
    },
    // 匹配字典的key
    dictConfigKey: {
      type: String,
      default: 'dictId',
    },
    // 组织id
    corporationId: {},
    // 列表默认项
    configItemKey: {
      type: String,
      default: 'dictValue',
    },
    selectedRowOld: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      spinning: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        {
          title: "配置项",
          dataIndex: '',
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
      tableData: [],
    };
  },
  created() {
    this.columns.splice(0, 0, this.addCommonColumnItem(undefined, true));
  },
  methods: {
    // 获取列表
    getTableList() {
      let dictArr = getDictConfigData(this.dictConfigKey)
      if (Array.isArray(dictArr)) {
        let tableData = this.matchOrgnize(dictArr)
        this.tableData = tableData.filter(item => {
          return item.corporationId == this.corporationId
        })
      }
    },
    // 取消-关闭model
    closeModel() {
      this.$emit("input", false);
    },
    confirmModle() {
      console.log(this.selectedRowKeys, this.selectedRow);
      let colListData = cloneDeep(this.selectedRow)
      colListData.forEach(item => {
        item.titleText = item[this.configItemKey]
      })
      this.$emit('confirmModle', colListData)
      this.closeModel()
    },
    // 页码改变
    pageNoChange(page) {
      this.page.pageNo = page;
      // 获取列表
      this.getTableList();
    },
    // 每页展示条数改变
    showSizeChange(page, pageSize) {
      this.page.pageNo = 1;
      this.page.pageSize = pageSize;
      this.getTableList();
    },
  },
  watch: {
    addCasNoModelShow(newVal) {
      if (newVal) {
        // 处理选择的数据
        this.selectedRow = cloneDeep(this.selectedRowOld)
        // console.log('选择的id', this.selectedRowOld);
        this.selectedRowKeys = this.selectedRowOld.map(item => item[this.tableRowKey])
        this.columns[1].dataIndex = this.configItemKey
        // 处理表头数据
        // console.log('处理表头数据', this.columns);
        this.getTableList()
      } else {

      }
    }
  }
};
</script>

<style lang='less' scoped>
.self-modal {
  /deep/ .ant-modal {
    width: 1000px !important;
  }
}
::v-deep .a-spin {
  .ant-spin-blur {
    opacity: 0.1 !important;
  }
}
#principal-dialog {
  ::v-deep .ant-modal {
    width: 600px !important;
    padding-bottom: 0px !important;
  }
}

.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.model-main {
  min-height: 360px;
  .model-main-qr-img {
    display: block;
    flex: none;
    width: 80%;
    height: auto;
    margin: 0 auto;
    max-width: 620px;
    max-height: 620px;
  }
}
@media screen and (max-width: 1367px) {
  .model-main {
    min-height: 320px;
    .model-main-qr-img {
      width: 70%;
    }
  }
}
</style>
