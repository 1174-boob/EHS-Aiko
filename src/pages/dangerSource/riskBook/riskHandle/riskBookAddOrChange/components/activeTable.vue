<template>
  <div class="active-table-box">
    <div class="ttile border-b-e7">
      <div class="ttile-text" :class="[required?'ttile-text-required':'']">{{contentColumns}}</div>
      <DashBtn class="ttile-bbtn" v-if="!disabled">
        <div>
          <a-button type="dashed" @click="handleAdd()">添加一行</a-button>
        </div>
      </DashBtn>
    </div>
    <div class="m-t-20"></div>
    <CommonTable :noPaging="true">
      <a-table bordered :data-source="tableData" :columns="columns" :pagination="false" :locale="{emptyText: emptyText}" :rowKey="'guid'">
        <template slot="detailContent" slot-scope="text, record">
          <a-textarea autoSize v-show="record.active" v-model.trim="record.detailContent" :ref="`${record.guid}`" @blur="onBlur(record)" />
          <a-popover autoAdjustOverflow v-if="!disabled">
            <div slot="content">
              <p>{{ record.detailContent }}</p>
            </div>
            <span v-show="!record.active">{{ record.detailContent || ' ' }}</span>
          </a-popover>
          <span v-else>{{ record.detailContent || ' ' }}</span>
        </template>
        <div slot="action" slot-scope="text,record" class="action-box">
          <span class="color-0067cc cursor-pointer" v-if="!record.active" @click="editTableItem(record)">编辑</span>
          <span class="color-0067cc cursor-pointer" v-else>确定</span>
          <span class="color-ff4d4f cursor-pointer" @click="rmTableItem(record)">删除</span>
        </div>
      </a-table>
    </CommonTable>
  </div>
</template>
<script>
import { cloneDeep } from "lodash"
export default {
  props: {
    tableEllipsis: {
      type: Boolean,
      default: true,
    },
    contentColumns: {
      type: String,
      default: '措施',
    },
    attr: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    tableDataOld: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      emptyText: <a-empty />,
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          customRender: (text, record, index) => {
            return index + 1;
          },
          width: 70
        },
        {
          title: this.contentColumns,
          dataIndex: 'detailContent',
          scopedSlots: { customRender: 'detailContent' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          ellipsis: false,
          customCell: (record) => {
            return {
              style: { 'padding-top': '0', 'padding-bottom': '0', },
            };
          },
          width: 100,
        },
      ],
      tableData: [],
    };
  },
  created() {
    if (this.disabled) {
      this.columns = [
        {
          title: '序号',
          dataIndex: 'index',
          customRender: (text, record, index) => {
            return index + 1;
          },
          align: 'center',
          width: 100
        },
        {
          title: this.contentColumns,
          dataIndex: 'detailContent',
          align: 'center',
          scopedSlots: { customRender: 'detailContent' },
        },
      ]
    } else {
      this.columnsHandle()
    }
  },
  methods: {
    initTableData() {
      let tableDataOld = cloneDeep(this.tableDataOld)
      tableDataOld.forEach(item => {
        item.guid = this.guid()
        item.active = false
      })
      this.tableData = tableDataOld
    },
    // 失去焦点-会改变数据
    onBlur(record) {
      setTimeout(() => {
        record.active = false;
        this.$emit('activeTableChange', this.attr, this.tableData)
      }, 100);
    },
    // 开启编辑
    editTableItem(record) {
      if (!record.active) {
        record.active = true;
        this.$nextTick(() => {
          this.$refs[record.guid].focus()
        })
      }
    },
    // 删除-会改变数据
    rmTableItem(record) {
      this.$antConfirm({
        title: "确定删除吗?",
        onOk: () => {
          this.tableData = this.tableData.filter(item => item.guid != record.guid);
          this.$emit('activeTableChange', this.attr, this.tableData)
        },
      });
    },
    // 开启新增
    handleAdd() {
      const newData = {
        guid: this.guid(),
        detailContent: ``,
        active: true,
      };
      this.tableData = [...this.tableData, newData];
      this.$nextTick(() => {
        this.$refs[newData.guid].focus()
      })
    },
    // 生成唯一id
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    // 表格变省略号、内容居中
    columnsHandle() {
      this.columns.forEach(item => {
        item.align = item.align ? item.align : 'center'
        item.ellipsis = item.ellipsis ? item.ellipsis : this.tableEllipsis
      })
    },
  },
  watch: {
    tableDataOld: {
      handler(newVal) {
        this.initTableData()
      },
      immediate: true,
      deep: true,//true为进行深度监听,false为不进行深度监听
    }
  }
};
</script>

<style lang="less" scoped>
.active-table-box {
  position: relative;
  .action-box {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    & > span {
      min-height: 53px;
      display: inline-flex;
      align-items: center;
    }
  }
}
.ttile {
  display: flex;
  align-items: center;
  margin-bottom: -3px;
  border-bottom: 1px solid transparent;
  .ttile-text {
    margin-right: 12px;
  }
  .ttile-text-required {
    &::before {
      display: inline-block;
      margin-right: 4px;
      color: #f5222d;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: "*";
    }
  }
  .ttile-bbtn {
    margin-bottom: 0px;
  }
}

.has-error .ant-input,
.has-error .ant-input:hover {
  background-color: #fff;
  border-color: #b0b0b0;
}
.has-error .ant-input:focus {
  border-color: #b0b0b0;
  border-right-width: 1px !important;
  outline: 0;
  -webkit-box-shadow: 0 0 0 2px rgba(0, 103, 204, 0.2);
  box-shadow: 0 0 0 2px rgba(0, 103, 204, 0.2);
}
</style>
