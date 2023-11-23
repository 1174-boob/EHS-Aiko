<template>
  <CommonModal :title="'自定义列'" :visible="selectModel" :cancelFn="closeModel">
    <div slot="form">
      <div class="user-table">
        <a-table
          :columns="columns"
          :data-source="dataList"
          :rowKey="tableRowKey"
          :pagination="false"
          :row-selection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange,type:'checkbox',getCheckboxProps:getCheckboxProps,hideDefaultSelections:true,}"
        ></a-table>
      </div>
    </div>
    <div slot="btn">
      <a-button type="dashed" @click="closeModel">取消</a-button>
      <a-button type="primary" style="margin-left: 20px" @click="selectModelSubmit">确定</a-button>
      <a-button type="primary" style="margin-left: 20px" @click="initDefault">恢复默认</a-button>
    </div>
  </CommonModal>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import teableSelected from "@/mixin/teableSelected";
import { cloneDeep, difference } from 'lodash'
export default {
  mixins: [teableCenterEllipsis, teableSelected],
  model: {
    prop: 'selectModel',
  },
  props: ['selectModel', 'tableColumnAll', 'tableColumnIng', 'setColumLocalStorageName', 'columnsDefault'],
  props: {
    selectModel: {
      default: false,
    },
    // 表头数据-全部
    tableColumnAll: {
      default: () => [],
    },
    // 表头数据-当前选择的
    tableColumnIng: {
      default: () => [],
    },
    // 表头数据-默认的
    columnsDefault: {
      default: () => [],
    },
    // 表头数据-本地存储的名称
    setColumLocalStorageName: {
      required: true,
    },
  },
  data() {
    return {
      columns: [
        {
          title: "全部",
          dataIndex: "title",
          key: "title",
        },
      ],
      tableRowKey: 'id',
      dataList: [],
      getCheckboxProps: record => ({
        props: {
          disabled: record.disabled, // 禁用项 
          name: record.title,
        },
      }),
      columnsDefaultKeys: [],
    }
  },
  computed: {
    allKeys() {
      let keys = this.tableColumnAll.map(item => item[this.tableRowKey])
      return keys
    },
  },
  methods: {
    // 取消-关闭model
    closeModel() {
      this.$emit('input', false)
    },
    // 恢复默认
    initDefault() {
      this.selectedRowKeys = [...this.columnsDefaultKeys]
    },
    // 确定
    selectModelSubmit() {
      // console.log(this.selectedRowKeys);
      if (this.selectedRowKeys.length == 0) {
        this.$message.warn('请至少选择一个列')
        return
      }
      let diffKeys = difference(this.allKeys, this.selectedRowKeys)
      // 存储当权用户选择的key
      this.setSeltableColumnList(diffKeys)
      this.$emit('setTableColumn', diffKeys)
      // 关闭选择地址model
      this.closeModel()
    },
    // 存储当权用户选择的key
    setSeltableColumnList(diffKeys) {
      let userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
      let seltableColumnListArr = JSON.parse(localStorage.getItem(this.setColumLocalStorageName)) || []
      let seltableColumnObj = { userId, diffKeys, }
      if (seltableColumnListArr.length) {
        let has = seltableColumnListArr.some(item => {
          if (userId == item.userId) {
            item.diffKeys = diffKeys
            return true
          }
        })
        if (!has) {
          seltableColumnListArr.push(seltableColumnObj)
        }
      } else {
        seltableColumnListArr = [seltableColumnObj]
      }
      localStorage.setItem(this.setColumLocalStorageName, JSON.stringify(seltableColumnListArr))
    },
  },
  watch: {
    selectModel(newVal) {
      if (newVal) {
        this.dataList = cloneDeep(this.tableColumnAll)
        this.selectedRowKeys = this.tableColumnIng.map(item => item.id)
        this.columnsDefaultKeys = this.columnsDefault.map(item => item.id)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.clx-model-body {
  margin-bottom: 20px;
}
::v-deep .a-spin {
  .ant-spin-blur {
    opacity: 0.1 !important;
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

::v-deep .ant-checkbox-disabled .ant-checkbox-inner {
  background-color: #f5f5f5 !important;
  border-color: #d9d9d9 !important;
}
</style>
