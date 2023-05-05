<template>
  <CommonModal :title="'请勾选需显示的字段'" :visible="selectModel" :cancelFn="closeModel">
    <div slot="form">
      <div class="user-table">
        <a-table :columns="columns" :data-source="dataList" :rowKey="tableRowKey" :pagination="false" :row-selection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange,type:'checkbox',}"></a-table>
      </div>
    </div>
    <div slot="btn">
      <a-button type="dashed" @click="closeModel">取消</a-button>
      <a-button type="primary" style="margin-left: 20px" :loading="loading" @click="selectModelSubmit">确定</a-button>
    </div>
  </CommonModal>
</template>

<script>
import teableCenterEllipsis from "@/mixin/teableCenterEllipsis";
import teableSelected from "@/mixin/teableSelected";
import { cloneDeep } from 'lodash'
export default {
  mixins: [teableCenterEllipsis, teableSelected],
  model: {
    prop: 'selectModel',
  },
  props: ['selectModel', 'tableColumnAll', 'tableColumnIng', 'seltableColumnVersion'],
  data() {
    return {
      columns: [
        {
          title: "全部",
          dataIndex: "title",
          key: "title",
        },
      ],
      tableRowKey: 'dataIndex',
      dataList: [],
      loading: false,
    }
  },
  methods: {
    // 取消-关闭model
    closeModel() {
      this.$emit('input', false)
    },
    selectModelSubmit() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.warn('请至少选择一个字段')
        return
      }
      // console.log(this.selectedRowKeys);
      // 存储当权用户选择的key
      this.setConsoleUserSeltableColumnList()
      this.$emit('setTableColumn', this.selectedRowKeys)
      // 关闭选择地址model
      this.closeModel()
    },
    // 存储当权用户选择的key
    setConsoleUserSeltableColumnList() {
      let userId = JSON.parse(sessionStorage.getItem('zconsole_userInfo')).user.userId
      let seltableColumnListArr = JSON.parse(localStorage.getItem('console_user_seltableColumnList')) || []
      let seltableColumnObj = {
        userId,
        seltableColumnVersion: this.seltableColumnVersion,
        selectedRowKeys: this.selectedRowKeys
      }
      if (seltableColumnListArr.length) {
        let has = false
        seltableColumnListArr.forEach(item => {
          if (userId == item.userId) {
            item.version = this.seltableColumnVersion
            item.selectedRowKeys = this.selectedRowKeys
            has = true
          }
        })
        if (!has) {
          seltableColumnListArr.push(seltableColumnObj)
        }
      } else {
        seltableColumnListArr = [seltableColumnObj]
      }
      localStorage.setItem('console_user_seltableColumnList', JSON.stringify(seltableColumnListArr))
    },
  },
  watch: {
    selectModel(newVal) {
      if (newVal) {
        this.dataList = cloneDeep(this.tableColumnAll)
        this.selectedRowKeys = this.tableColumnIng.map(item => {
          return item.key
        })
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
</style>
