<template>
  <div class="mod-config clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SelfSearch :queryList="queryList" :search="search" :reset="reset"></SelfSearch>
    <CommonTable :page="page" :pageNoChange="currentChangeHandle" :showSizeChange="sizeChangeHandle">
      <el-table :data="dataList" v-loading="dataListLoading" style="width: 100%;">
        <!--  width="120" -->
        <el-table-column prop="id" header-align="center" align="center" label="编号" min-width="130" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <!--  width="120" -->
        <el-table-column prop="create_user_name" header-align="center" align="center" label="创建人" min-width="130" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.create_user_name}}</span>
          </template>
        </el-table-column>
        <!--  width="150" -->
        <el-table-column prop="create_time" header-align="center" align="center" label="创建时间" min-width="130" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{initTime(scope.row.create_time)}}</span>
          </template>
        </el-table-column>
        <SelfTable :showList="showList"></SelfTable>
        <!--  -->
        <el-table-column fixed="right" header-align="center" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <span class="color-0067cc cursor-pointer m-r-10" @click="preview(scope.row)">编辑</span>
            <span class="color-0067cc cursor-pointer" @click="deleteData(scope.row.id)">删除</span>
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
import { mapState } from 'vuex';

import { DetailNgform, SelectFormData, DeleteFormData, SelectTemplateByNode } from "@/services/api.js";

// 功能
import SelfSearch from "@/pages/ngform/tpl/selfSearch.vue";
import SelfTable from "@/pages/ngform/tpl/selfTable.vue";


export default {
  data() {
    return {
      dataForm: {},
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
        total: 0,
      },
      dataListLoading: false,
      addHiddenInit: {},
    }
  },
  components: {
    SelfSearch,
    SelfTable
  },
  mixins: [cancelLoading],
  computed: {
    ...mapState("setting", ["customComponents"]),
    userId: {
      get() {
        return this.$store.state.user.id;
      }
    },
    deleteBtnCode() {
      this.$route.path.split('/')[this.$route.path.split('/').length - 1] + '-del'
    },
    // showDeleteBtn() {
    //   return this.canClickBtnMixin(this.$route.path.split('/')[this.$route.path.split('/').length - 1] + '-del')
    // }
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
        url: this.$route.meta.url
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
          if (this.queryList[i].type == "date") {
            this.queryList[i].options.range = true;
          }
        }
        this.getDataList();
      })
    },
    search(dataForm) {
      this.page.pageNo = 1;
      this.queryMap = this.deleteLabel(cloneDeep(dataForm), this.queryList);
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
      let newObj = {};
      for (let i = 0; i < this.queryList.length; i++) {
        if (this.queryMap[this.queryList[i].model]) {
          newObj[this.queryList[i].model] = this.queryMap[this.queryList[i].model];
        }
      }
      const form_ = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        url: this.$route.meta.url,
        nodeStatus: "3",
        queryMap: newObj
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
    preview(msg, flag) {
      SelectTemplateByNode({
        tempId: this.form.tempId,
        nodeId: msg.nodeId,
        type: "0"
      }).then(res => {
        res.data.templateData = JSON.parse(res.data.templateData);
        if (flag) {
          this.$router.push({ name: this.$route.meta.addName, params: { formData: res.data, dataMsg: msg, draftUrl: this.$route.meta.draftUrl, url: this.$route.meta.url, onlyShow: true, title: "查看" } });
        } else {
          this.$router.push({ name: this.$route.meta.addName, params: { formData: res.data, dataMsg: msg, draftUrl: this.$route.meta.draftUrl, url: this.$route.meta.url, title: "编辑" } });
        }
      }).catch(err => console.log(err))
    },
    showMsg(msg) {
      this.$router.push({ name: this.$route.meta.addName, params: { formData: this.form, dataMsg: msg, draftUrl: this.$route.meta.draftUrl, url: this.$route.meta.url, onlyShow: true } });
    },
    deleteData(id) {
      if (!this.canClickBtnMixin(this.deleteBtnCode)) {
        return;
      }
      let _this = this;
      this.$antConfirm({
        title: '确定删除吗？',
        onOk() {
          let params = {
            id: id,
            tempId: _this.form.tempId
          }
          DeleteFormData(params).then(res => {
            _this.$antMessage.success("删除成功");
            _this.getDataList();
          }).catch(err => console.log(err))
        }
      })
    },

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
// .custom-item{
//   width: 235px;
//   /deep/ label{
//     width: 30%;
//     overflow: hidden;
//     white-space: nowrap;
//     text-overflow: ellipsis;
//   }
//   /deep/ label + div{
//     width: 70%;
//     .ant-select{

//     }
//   }
// }
</style>
