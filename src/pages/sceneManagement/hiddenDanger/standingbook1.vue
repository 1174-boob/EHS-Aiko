<template>
  <div class="mod-config clx-show-scroll clx-flex-1 beauty-scroll bg-fff">
    <SelfSearch :queryList="queryList" :search="search" :reset="reset"></SelfSearch>
    <DashBtn>
      <div>
        <a-button type="dashed" @click="toBlacklistDraft">申请单草稿箱</a-button>
        <!-- standingbook10是黑名单，新增入口在黑名单列表里 -->
        <a-button v-if="$route.path != '/cooperationPartner/standingbook10'" type="dashed" @click="addTo">
          <a-icon type="plus" />新增
        </a-button>
      </div>
    </DashBtn>
    
    <CommonTable :page="page" :pageNoChange="currentChangeHandle" :showSizeChange="sizeChangeHandle">
      <el-table :data="dataList" v-loading="dataListLoading" style="width: 100%;" :border="true" :resizable="true" @header-dragend="headerDragend">
        <template v-if="showList.length == 0">
          <template v-for="item1 in tableHeader1">
            <el-table-column :prop="item1.prop" header-align="center" align="center" :label="item1.label" :width="item1.width" min-width="200" :show-overflow-tooltip="true" :key="Math.random()">
              <template slot-scope="scope">
                <span v-if="item1.prop=='create_time'">{{initTime(scope.row[item1.prop])}}</span>
                <span v-else-if="item1.prop=='corporationId'">{{getMappingValue(getCommonAddOrgnizeList, "id", scope.row[item1.prop]).orgName}}</span>
                <span v-else>{{scope.row[item1.prop]}}</span>
              </template>
            </el-table-column>
          </template>
          <template v-for="item2 in tableHeader2">
            <el-table-column :prop="item2.prop" header-align="center" align="center" :label="item2.label" :width="item2.width" min-width="200" :show-overflow-tooltip="true" :key="Math.random()">
              <template slot-scope="scope">
                <span v-if="item2.prop=='create_time'">{{initTime(scope.row[item2.prop])}}</span>
                <span v-else-if="item1.prop=='corporationId'">{{getMappingValue(getCommonAddOrgnizeList, "id", scope.row[item1.prop]).orgName}}</span>
                <span v-else>{{scope.row[item2.prop]}}</span>
              </template>
            </el-table-column>
          </template>
        </template>
        <template v-else>
          <template v-for="(item, index) in showList">
            <template v-if="index == 0">
              <template v-for="item1 in tableHeader1">
                <el-table-column :prop="item1.prop" header-align="center" align="center" :label="item1.label" :width="item1.width" min-width="200" :show-overflow-tooltip="true" :key="Math.random()">
                  <template slot-scope="scope">
                    <span v-if="item1.prop=='create_time'">{{initTime(scope.row[item1.prop])}}</span>
                    <span v-else-if="item1.prop=='corporationId'">{{getMappingValue(getCommonAddOrgnizeList, "id", scope.row[item1.prop]).orgName}}</span>
                    <span v-else>{{scope.row[item1.prop]}}</span>
                  </template>
                </el-table-column>
              </template>
            </template>
            <el-table-column :prop="item.model" header-align="center" :key="Math.random()" align="center" :label="item.label" :width="item.width" min-width="200" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span
                  v-if="item.type == 'dictData' || item.type == 'dictDataMutiple' || item.type == 'staffTree' || item.type == 'organizeTree' || item.type == 'selfTimeRange' || item.type == 'organizeTreeCheckbox' || item.type == 'relationForm'"
                >{{scope.row[item.model + "_label"]}}</span>
                <span v-else>
                  <ng-form-item-base :record="item" :models="scope.row" :renderPreview="true" />
                </span>
              </template>
            </el-table-column>
            <template v-if="index == showList.length - 1">
              <template v-for="item2 in tableHeader2">
                <el-table-column :prop="item2.prop" header-align="center" align="center" :label="item2.label" :width="item2.width" min-width="200" :show-overflow-tooltip="true" :key="Math.random()">
                  <template slot-scope="scope">
                    <span v-if="item2.prop=='create_time'">{{initTime(scope.row[item2.prop])}}</span>
                    <span v-else-if="item1.prop=='corporationId'">{{getMappingValue(getCommonAddOrgnizeList, "id", scope.row[item1.prop]).orgName}}</span>
                    <span v-else>{{scope.row[item2.prop]}}</span>
                  </template>
                </el-table-column>
              </template>
            </template>  
          </template>
        </template>
        <div v-if="isHiddenTab==1">
          <div v-for="(item3, ind3) in 2" :key="ind3">
            <el-table-column v-if="ind3 == 1" fixed="right" width="200" header-align="center" align="center" label="业务状态" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row["node_status"] == "_SYSTEM_CLOSED_" ? "结束" : scope.row["node_status"]}}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="ind3 == 0" fixed="right" width="200" header-align="center" align="center" label="操作">
              <template slot-scope="scope">
                <span class="color-0067cc cursor-pointer m-r-10" @click="preview(scope.row, true)">查看</span>
                <span v-if="scope.row.status && isHiddenTab==1" class="color-0067cc cursor-pointer m-r-10" @click="preview(scope.row)">处理</span>
                <span class="color-0067cc cursor-pointer" @click="deleteData(scope.row.id)">删除</span>
              </template>
            </el-table-column>
          </div>
        </div>
        <div v-else>
          <el-table-column fixed="right" width="200" header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <span class="color-0067cc cursor-pointer m-r-10" @click="preview(scope.row, true)">查看</span>
              <span v-if="scope.row.status && isHiddenTab==1" class="color-0067cc cursor-pointer m-r-10" @click="preview(scope.row)">处理</span>
              <span class="color-0067cc cursor-pointer" @click="deleteData(scope.row.id)">删除</span>
            </template>
          </el-table-column>
        </div>
      </el-table>
    </CommonTable>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import dayJs from 'dayjs';
import cancelLoading from '@/mixin/cancelLoading';
import { DetailNgform, SelectFormData, DeleteFormData, SelectTemplateByNode, GetId, GetFirstNode } from "@/services/api.js";
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
        total: 0
      },
      dataListLoading: false,
      addHiddenInit: {},
      isHiddenTab: "",
      tableHeader1: [
        {
          prop: "id",
          label: "编号",
          width: 200,
        },
        {
          prop: "corporationId",
          label: "所属组织",
          width: 200,
        },
        {
          prop: "create_time",
          label: "创建时间",
          width: 200,
        },
        {
          prop: "create_user_name",
          label: "创建人",
          width: 200,
        },
        
      ],
      tableHeader2: [
        
      ],
    }
  },
  components: {
    SelfSearch,
    SelfTable
  },
  mixins: [cancelLoading],
  computed: {
    deleteBtnCode() {
      this.$route.path.split('/')[this.$route.path.split('/').length - 1] + '-del'
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
    console.log(this.$route.path.split('/')[this.$route.path.split('/').length - 1]);
    let currentRouterCode = this.$route.path.split('/')[this.$route.path.split('/').length - 1];
    if (currentRouterCode != "standingbook10") {
      this.setRouterCode(currentRouterCode)
    }
    this.initForm();
    // 当页面刷新时，若本地存储中存的有表头数组信息，就用本地的。当然第一次本地是没有的
    if (sessionStorage.getItem("tableHeader1")) {
      this.tableHeader1 = sessionStorage.getItem("tableHeader1") && JSON.parse(sessionStorage.getItem("tableHeader1"));
    }
    if (sessionStorage.getItem("tableHeader2")) {
      this.tableHeader2 = sessionStorage.getItem("tableHeader2") && JSON.parse(sessionStorage.getItem("tableHeader2"));
    }
  },
  methods: {
    // 表头拖动事件
    headerDragend(newWidth, oldWidth, column, event) {
      // 饿了么UI中提供的有对应参数，主要用到的是newWidth和column.property
      console.log(newWidth, oldWidth, column, event);
      // 根据column中的信息就可以知道用户拖动的是哪一列，从而将新的列宽度替换原来的列宽度
      let newTableHeader1 = this.tableHeader1.map((item, index) => {
        if (item.prop == column.property) {
          item.width = newWidth;
        }
        return item;
      });
      let newTableHeader2 = this.tableHeader2.map((item, index) => {
        if (item.prop == column.property) {
          item.width = newWidth;
        }
        return item;
      });
      let newTableHeader3 = this.showList.map((item, index) => {
        if (item.model == column.property) {
          console.log(item.model, column.property)
          item.width = newWidth;
        }
        return item;
      });
      // 最后存一份到本地，当刷新的时候，就用本地的这个记录了用户拖动宽度的表头数组数据
      sessionStorage.setItem("tableHeader1", JSON.stringify(newTableHeader1));
      sessionStorage.setItem("tableHeader2", JSON.stringify(newTableHeader2));
      sessionStorage.setItem("showList", JSON.stringify(newTableHeader3));
    },
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
        this.isHiddenTab = data.isHiddenTab;
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
        console.log(this.showList, this.queryList);
        if (sessionStorage.getItem("showList")) {
          let showListWidth = sessionStorage.getItem("showList") && JSON.parse(sessionStorage.getItem("showList"));
          for (let i = 0; i < showListWidth.length; i++) {
            for (let j = 0; j < this.showList.length; j++) {
              if (showListWidth[i].model == this.showList[j].model) {
                this.showList[j].width = showListWidth[i].width;
                continue;
              }
            }
          }
          console.log(this.showList);
        }
        if (this.$route.path == "/cooperationPartner/standingbook10") { // 黑名单审批台账列表
          for (let i = 0; i < this.queryList.length; i++) {
            if (this.queryList[i].relevance == "companyName") {
              this.queryList[i].options.defaultValue = this.$route.query.companyName;
              this.queryMap[this.queryList[i].model] = this.$route.query.companyName;
            }
          }
        }
        this.getDataList();
      })
    },
    search(dataForm) {
      this.dataForm = { ...dataForm };
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
    // 新建隐患"/hiddendangermanage/addhiddendanger"
    async addTo() {
        if (this.form.tempId) {
          let params1 = {
          tempId: this.form.tempId
        }
        let result1 = await GetId(params1);
        let deployId = result1.data.deploymentId;
        let params8 = {
          deployId: deployId
        }
        let result8 = await GetFirstNode(params8);
        let firstNode = result8.data.id;
        SelectTemplateByNode({
          tempId: this.form.tempId,
          nodeId: firstNode,
          type: "0"
        }).then(res => {
          res.data.templateData = JSON.parse(res.data.templateData);
          this.$router.push({ name: this.$route.meta.addName, params: { formData: res.data, draftUrl: this.$route.meta.draftUrl, url: this.$route.meta.url, title: "新建" } });
        }).catch(err => console.log(err))
      }
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
        queryMap: newObj,
        nodeStatus: this.form.templateData.config.isHiddenTab,
        centerId: this.dataForm.centerId,
        corporationId: this.dataForm.corporationId
      }
      form_.queryMap.centerId = this.queryMap.centerId;
      form_.queryMap.corporationId = this.queryMap.corporationId;      
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
      if (flag) {
        this.$router.push({ path: this.$route.meta.detailUrl, query: { formId: this.form.tempId, businessId: msg.id, url: this.$route.meta.url, draftUrl: this.$route.meta.draftUrl} })
        return;
      }
      SelectTemplateByNode({
        tempId: this.form.tempId,
        nodeId: msg.nodeId,
        nodeState: msg.node_status
      }).then(res => {
        res.data.templateData = JSON.parse(res.data.templateData);
        if (flag) {
          this.$router.push({ path: this.$route.meta.detailUrl, query: { formId: this.form.tempId, businessId: msg.id } })
        } else {
          this.$router.push({ name: this.$route.meta.addName, params: { formData: res.data, dataMsg: msg, url: this.$route.meta.url, draftUrl: this.$route.meta.draftUrl, title: "处理" } });
        }
      }).catch(err => console.log(err))
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
    toBlacklistDraft() {
      console.log("去黑名单草稿箱");
      this.$router.push({ path: this.$route.meta.draftUrl });
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