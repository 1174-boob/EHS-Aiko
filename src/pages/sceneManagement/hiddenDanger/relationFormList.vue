<template>
  <div class="mod-config clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SelfSearch :queryList="queryList" :search="search" :reset="reset" :relationBusinessStatus="relationBusinessStatus"></SelfSearch>
    <CommonTable :page="page" :pageNoChange="currentChangeHandle" :showSizeChange="sizeChangeHandle">
      <el-table :data="dataList" v-loading="dataListLoading" style="width: 100%;" highlight-current-row @current-change="handleCurrentChange">
        <!-- <el-table-column v-if="dataList.length > 0" type="selection" width="55" fixed="left" header-align="center" align="center"></el-table-column> -->
        <el-table-column prop="id" header-align="center" align="center" label="编号" min-width="130" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_user_name" header-align="center" align="center" label="创建人" min-width="130" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.create_user_name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" header-align="center" align="center" label="创建时间" min-width="130" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{initTime(scope.row.create_time)}}</span>
          </template>
        </el-table-column>
        <SelfTable :showList="showList"></SelfTable>
        <el-table-column fixed="right" width="200" header-align="center" align="center" label="业务状态" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row["node_status"] == "_SYSTEM_CLOSED_" ? "结束" : scope.row["node_status"]}}</span>
          </template>
        </el-table-column>
      </el-table>
    </CommonTable>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import dayJs from 'dayjs';
import cancelLoading from '@/mixin/cancelLoading';
import { DetailNgform, SelectFormData } from "@/services/api.js";

// 功能
import SelfSearch from "@/pages/ngform/tpl/relationFormSelfSearch.vue";
import SelfTable from "@/pages/ngform/tpl/selfTable.vue";

export default {
  props: ["tempId", "relationBusinessStatus", "saveCurrentRow"],
  data() {
    return {
      form: {},
      queryMap: {},
      //列表显示list
      showList: [],
      // 搜索list
      queryList: [],
      dataList: [],
      page: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      dataListLoading: false,
      addHiddenInit: {},
      currentRow: []
    }
  },
  components: {
    SelfSearch,
    SelfTable
  },
  mixins: [cancelLoading],
  computed: {
    userId: {
      get() {
        return this.$store.state.user.id;
      }
    },
  },
  watch: {
    $route(newObj, oldObj) {
      if (newObj.path != oldObj.path) {
        this.initForm();
      }
    }
  },
  created() {
    this.initForm();
  },
  methods: {
    initTime(time) {
      if (time) {
        return dayJs(time).format('YYYY-MM-DD');
      }
    },
    initForm() {
      let params = {
        tempId: this.tempId
      }
      DetailNgform(params).then(({ data }) => {
        const formTemplate_ = JSON.parse(data.templateData)
        this.form = data;
        this.form.templateData = formTemplate_;
        const list_ = cloneDeep(formTemplate_.list);
        list_.forEach(t => {
          delete t.rules
          // textarea 类型替换为input
          if (t.type == 'textarea') {
            t.type = 'input'
          }
          if (t.options) {
            t.options.clearable = true;
          }
        })
        this.showList = list_.filter(t => formTemplate_.config && formTemplate_.config.showList && formTemplate_.config.showList.includes(t.model));
        this.queryList = list_.filter(t => formTemplate_.config && formTemplate_.config.queryList && formTemplate_.config.queryList.includes(t.model));
        for (let i = 0; i < this.queryList.length; i++) {
          this.queryList[i].options.disabled = false;
          this.queryList[i].options.hidden = false;
        }
        this.getDataList();
      })
    },
    search(dataForm) {
      this.page.pageNo = 1;
      this.queryMap = this.deleteLabel(cloneDeep(dataForm), this.queryList);
      this.queryMap.node_status = dataForm.node_status;
      let newObj = {};
      for (let i = 0; i < this.queryList.length; i++) {
        if (this.queryMap[this.queryList[i].model] != null && this.queryMap[this.queryList[i].model] != undefined && this.queryMap[this.queryList[i].model] != "") {
          newObj[this.queryList[i].model] = this.queryMap[this.queryList[i].model];
        }
      }
      if (this.queryMap.node_status) {
        newObj.node_status = this.queryMap.node_status;
      }
      this.queryMap = { ...newObj };
      this.getDataList();
    },
    reset() {
      this.queryMap = {};
      this.getDataList();
    },
    // 查询条件去掉_label
    deleteLabel(queryMap, allObj) {
      let finallyObj = {};
      for (let i = 0; i < allObj.length; i++) {
        finallyObj[allObj[i].model] = queryMap[allObj[i].model];
      }
      return finallyObj;
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      const form_ = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        tempId: this.tempId,
        queryMap: this.queryMap,
        nodeStatus: "1"
      }
      this.handleLoading();
      SelectFormData(form_).then(res => {
        this.page.total = res.data.total;
        this.dataList = res.data.list;
      }).catch(err => console.log(err)).finally(() => {
        this.dataListLoading = false;
        this.cancelLoading();
      })
    },
    // 每页数
    sizeChangeHandle(current, pageSize) {
      this.page.pageSize = pageSize;
      this.page.pageNo = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.page.pageNo = val
      this.getDataList()
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      this.saveCurrentRow(val);
    }
  }
}
</script>
<style lang="less" scoped>
.mod-config {
  /deep/ .el-table {
    th.el-table__cell {
      background: rgba(250, 250, 250, 0.5);
      padding: 16px 0;
    }
  }
}
</style>